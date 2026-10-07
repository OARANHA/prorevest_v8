import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Upload, Wand2, Palette, Search, X, Copy, Check, Star, Edit, Save, Trash } from 'lucide-react';
import { Layout } from '../components/Layout';
import { editRoomImage } from '../services/geminiService';
import { productService } from '../services/productService';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { AuthModal } from '../components/auth/AuthModal';
import { jsPDF } from 'jspdf';
import { ProjectService } from '../services/projectService';
import { DesignService } from '../services/designService';

// Tipos locais básicos
type EditEntry = { id: string; prompt: string; imageUrl: string };
type Design = { 
  id: string; 
  name: string; 
  originalImageUrl: string; 
  mimeType: string; 
  edits: EditEntry[];
  designerName?: string;
  workType?: 'Parede' | 'Piso' | 'Aberturas';
};
type Project = { 
  id: string; 
  name: string; 
  designs: Design[];
  createdBy?: string;
};

type SelectionTab = 'COLOR' | 'TEXTURE';

const PALETTE_COLORS = [
  { name: 'Alabaster', hex: '#f1e9da' },
  { name: 'Pearl', hex: '#f5f5f5' },
  { name: 'Sand', hex: '#e4d5c5' },
  { name: 'Fog', hex: '#dfe3e6' },
  { name: 'Clay', hex: '#c8b7a6' },
  { name: 'Slate', hex: '#7a8a99' },
];

const TEXTURE_OPTIONS = [
  { name: 'Stucco', imageUrl: 'https://images.unsplash.com/photo-1602426193450-8346d7be0c29?w=200&q=50' },
  { name: 'Concrete', imageUrl: 'https://images.unsplash.com/photo-1523419410042-64a53ef3f5d0?w=200&q=50' },
  { name: 'Wood', imageUrl: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad1?w=200&q=50' },
];

// Alvos de aplicação no canvas (multi-pontos) - será dinâmico via useMemo
// Definido aqui para ter o tipo disponível
type TargetKind = 'WALL_A' | 'WALL_B' | 'FLOOR_A' | 'FLOOR_B' | 'DOOR_A' | 'DOOR_B' | 'WINDOW_A' | 'WINDOW_B';

// Targets base para inicialização
const BASE_TARGETS = [
  { id: 'WALL_A' as const, label: 'Parede 1' },
  { id: 'WALL_B' as const, label: 'Parede 2' },
];

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function StudioProRevest() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeDesignId, setActiveDesignId] = useState<string | null>(null);
  const [displayedImageUrl, setDisplayedImageUrl] = useState<string | null>(null);
  const [selectionCoords, setSelectionCoords] = useState<{ x: number; y: number } | null>(null);
  const [activeTab, setActiveTab] = useState<SelectionTab>('COLOR');
  const [selectedColor, setSelectedColor] = useState<string>('#f1e9da');
  const [selectedTexture, setSelectedTexture] = useState<{ name: string; imageUrl: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [outputFormat, setOutputFormat] = useState<'webp' | 'jpeg' | 'png'>('webp');
  const [isPaletteModalOpen, setIsPaletteModalOpen] = useState(false);
  const [isFloatingPaletteOpen, setIsFloatingPaletteOpen] = useState(false);
  const [imageRenderTick, setImageRenderTick] = useState(0);
  const { user } = useAuth();
  const { profile } = useProfile();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [comparePercent, setComparePercent] = useState(50);
  const [isSliding, setIsSliding] = useState(false);
  const [draggingProjectId, setDraggingProjectId] = useState<string | null>(null);
  const [isSendingBudget, setIsSendingBudget] = useState(false);
  const [compareMode, setCompareMode] = useState<'split' | 'opacity'>('split');
  const location = useLocation();
  
  // Admin textures state
  const [adminTextures, setAdminTextures] = useState<{ name: string; imageUrl: string }[]>([]);
  const [texturesLoading, setTexturesLoading] = useState<boolean>(false);
  const [texturesError, setTexturesError] = useState<string | null>(null);

  // Modal states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);
  const [projectNameDraft, setProjectNameDraft] = useState('');
  const [isEditingDesignName, setIsEditingDesignName] = useState(false);
  const [designNameDraft, setDesignNameDraft] = useState('');


  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setTexturesLoading(true);
        const tx = await productService.getTextures();
        if (mounted) {
          const mapped = (tx || []).map(t => ({ name: t.name, imageUrl: t.image_url || '' }));
          setAdminTextures(mapped);
        }
      } catch (e) {
        if (mounted) setTexturesError('Erro ao carregar texturas do Admin');
      } finally {
        if (mounted) setTexturesLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);
  useEffect(() => {
    if (!isSliding) return;
    const onMove = (e: PointerEvent) => {
      const img = imageRef.current;
      const box = getImageContentBox();
      if (!img || !box) return;
      const imgRect = img.getBoundingClientRect();
      const localX = e.clientX - imgRect.left - box.offsetX;
      const clamped = Math.min(Math.max(localX, 0), box.drawW);
      const pct = Math.round((clamped / box.drawW) * 100);
      setComparePercent(pct);
    };
    const onUp = () => setIsSliding(false);
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
  }, [isSliding]);



  // Multi-alvos: alvo ativo, pontos e cores por alvo
  const [activeTarget, setActiveTarget] = useState<string>('WALL_A');
  const [targetPoints, setTargetPoints] = useState<Record<string, { x: number; y: number } | null>>({
    WALL_A: null,
    WALL_B: null,
  });
  const [targetColors, setTargetColors] = useState<Record<string, string>>({});
  const [targetColorMeta, setTargetColorMeta] = useState<Record<string, { name?: string; hex?: string; code?: string }>>({});

  // NOVO: Estado para tipo de acabamento de piso
  const [floorFinishType, setFloorFinishType] = useState<'epoxy' | 'microcement' | 'paint'>('epoxy');
  const [microcementStyle, setMicrocementStyle] = useState<'polido' | 'rústico'>('polido');

  // Nome derivado da cor selecionada (exibe nome ao lado do hex)
  const selectedColorName = useMemo(() => {
    const metaName = targetColorMeta[activeTarget]?.name;
    if (metaName) return metaName;
    const currentHex = (targetColors[activeTarget] || selectedColor || '').toLowerCase();
    const found = PALETTE_COLORS.find(c => c.hex.toLowerCase() === currentHex);
    return found?.name || 'Cor selecionada';
  }, [selectedColor, targetColors, activeTarget, targetColorMeta]);

  // Persistência global: carregar do backend se autenticado (fallback local) e respeitar projectId via query
  useEffect(() => {
    (async () => {
      try {
        if (user?.id) {
          const backendProjects = await ProjectService.getProjects(user.id);
          // Tentar hidratar designs a partir do localStorage para não perder edições ao retornar
          let localStoredProjects: Project[] = [];
          try {
            const rawLocal = localStorage.getItem('studioProjects');
            if (rawLocal) {
              const parsed: Project[] = JSON.parse(rawLocal);
              if (Array.isArray(parsed)) localStoredProjects = parsed;
            }
          } catch {}
          const backend = backendProjects || [];
          // Carregar designs+edits do backend
          const mergedList: Project[] = await Promise.all(
            backend.map(async (bp) => {
              const backendDesigns = await DesignService.getDesigns(bp.id);
              const designsWithEdits = await Promise.all(
                backendDesigns.map(async (bd) => {
                  const edits = await DesignService.getEdits(bd.id);
                  return {
                    id: bd.id,
                    name: bd.name,
                    originalImageUrl: bd.original_image_url,
                    mimeType: bd.mime_type || 'image/jpeg',
                    edits: edits.map((e) => ({ id: e.id, prompt: e.prompt || '', imageUrl: e.image_url })),
                    designerName: bd.designer_name || undefined,
                    workType: (bd.work_type as any) || undefined,
                  } as Design;
                })
              );
              // Acrescentar designs locais que não existem no backend
              const localMatch = localStoredProjects.find((lp) => lp.id === bp.id);
              const localOnlyDesigns = (localMatch?.designs || []).filter(
                (ld) => !designsWithEdits.some((d) => d.id === ld.id)
              );
              return {
                id: bp.id,
                name: bp.name,
                designs: [...designsWithEdits, ...localOnlyDesigns],
                createdBy: user.email || 'Usuário',
              } as Project;
            })
          );
          const localOnly = localStoredProjects.filter((lp) => !backend.some((bp) => bp.id === lp.id));
          const merged = [...mergedList, ...localOnly];
          setProjects(merged);
          const params = new URLSearchParams(location.search);
          const queryProjId = params.get('projectId');
          const savedProjId = localStorage.getItem('studioActiveProjectId');
          const savedDesignId = localStorage.getItem('studioActiveDesignId');
          if (queryProjId && merged.some((p) => p.id === queryProjId)) {
            setActiveProjectId(queryProjId);
          } else if (savedProjId && merged.some((p) => p.id === savedProjId)) {
            setActiveProjectId(savedProjId);
          } else if (merged.length) {
            setActiveProjectId(merged[0].id);
          }
          if (savedDesignId) setActiveDesignId(savedDesignId);
        } else {
          const raw = localStorage.getItem('studioProjects');
          if (raw) {
            const saved: Project[] = JSON.parse(raw);
            if (Array.isArray(saved)) {
              setProjects(saved);
              const params = new URLSearchParams(location.search);
              const queryProjId = params.get('projectId');
              const savedProjId = localStorage.getItem('studioActiveProjectId');
              const savedDesignId = localStorage.getItem('studioActiveDesignId');
              if (queryProjId && saved.some(p => p.id === queryProjId)) {
                setActiveProjectId(queryProjId);
              } else if (savedProjId) setActiveProjectId(savedProjId);
              if (savedDesignId) setActiveDesignId(savedDesignId);
            }
          }
        }
      } catch (err) {
        console.warn('Falha ao carregar projetos, usando localStorage:', err);
        try {
          const raw = localStorage.getItem('studioProjects');
          if (raw) {
            const saved: Project[] = JSON.parse(raw);
            if (Array.isArray(saved)) {
              setProjects(saved);
            }
          }
        } catch {}
      }
    })();
  }, [user?.id, location.search]);

  // Persistir alterações
  useEffect(() => {
    try {
      localStorage.setItem('studioProjects', JSON.stringify(projects));
    } catch {}
  }, [projects]);

  useEffect(() => {
    if (activeProjectId) {
      localStorage.setItem('studioActiveProjectId', activeProjectId);
    } else {
      localStorage.removeItem('studioActiveProjectId');
    }
  }, [activeProjectId]);

  useEffect(() => {
    if (activeDesignId) {
      localStorage.setItem('studioActiveDesignId', activeDesignId);
    } else {
      localStorage.removeItem('studioActiveDesignId');
    }
  }, [activeDesignId]);

  // Auto-selecionar design quando projeto ativo muda
  useEffect(() => {
    if (activeProjectId) {
      const project = projects.find(p => p.id === activeProjectId);
      if (project && project.designs && project.designs.length > 0) {
        // Se não há design ativo ou o design ativo não pertence ao projeto atual
        const currentDesignBelongsToProject = project.designs.some(d => d.id === activeDesignId);
        if (!activeDesignId || !currentDesignBelongsToProject) {
          // Selecionar o design mais recente (último na lista) ou o primeiro disponível
          const latestDesign = project.designs[project.designs.length - 1];
          setActiveDesignId(latestDesign.id);
        }
      } else {
        // Se o projeto não tem designs, limpar o design ativo
        setActiveDesignId(null);
      }
    }
  }, [activeProjectId, projects, activeDesignId]);

  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeProjectId) || null,
    [projects, activeProjectId]
  );
  const activeDesign = useMemo(
    () => activeProject?.designs.find((d) => d.id === activeDesignId) || null,
    [activeProject, activeDesignId]
  );

  // NOVO: TARGETS dinâmico baseado em workType
  const TARGETS = useMemo(() => {
    const workType = activeDesign?.workType || 'Parede';
    switch (workType) {
      case 'Piso':
        return [
          { id: 'FLOOR_A' as const, label: 'Piso 1' },
          { id: 'FLOOR_B' as const, label: 'Piso 2' },
        ];
      case 'Aberturas':
        return [
          { id: 'DOOR_A' as const, label: 'Porta 1' },
          { id: 'DOOR_B' as const, label: 'Porta 2' },
          { id: 'WINDOW_A' as const, label: 'Janela 1' },
          { id: 'WINDOW_B' as const, label: 'Janela 2' },
        ];
      default: // 'Parede'
        return [
          { id: 'WALL_A' as const, label: 'Parede 1' },
          { id: 'WALL_B' as const, label: 'Parede 2' },
        ];
    }
  }, [activeDesign?.workType]);

  // NOVO: Effect para sincronizar activeTarget quando TARGETS muda
  useEffect(() => {
    if (activeTarget && !TARGETS.find(t => t.id === activeTarget)) {
      setActiveTarget(TARGETS[0]?.id || 'WALL_A');
      // Resetar targetPoints para os novos targets
      const resetPoints: Record<string, null> = {};
      TARGETS.forEach(t => { resetPoints[t.id] = null; });
      setTargetPoints(resetPoints);
    }
  }, [TARGETS, activeTarget]);

  // Ajustar imagem exibida quando o design ativo muda
  useEffect(() => {
    if (!activeDesign) {
      setDisplayedImageUrl(null);
      return;
    }
    const lastEdit = activeDesign.edits && activeDesign.edits.length > 0 ? activeDesign.edits[activeDesign.edits.length - 1] : null;
    const nextUrl = lastEdit?.imageUrl || activeDesign.originalImageUrl || null;
    if (!displayedImageUrl || displayedImageUrl !== nextUrl) {
      setDisplayedImageUrl(nextUrl);
    }
  }, [activeDesign]);

  // Estados/handlers para edição por item na lista de projetos e salvar global
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectListDraft, setProjectListDraft] = useState<string>('');

  const handleProjectListSave = useCallback(async () => {
    if (!editingProjectId) return;
    const name = (projectListDraft || '').trim();
    if (!name) { setEditingProjectId(null); return; }
    setProjects((prev) => prev.map((p) => (p.id === editingProjectId ? { ...p, name } : p)));
    try {
      if (user?.id) {
        await ProjectService.updateProject(editingProjectId, { name });
      }
    } catch (e) {
      console.warn('Falha ao atualizar projeto no backend:', e);
    } finally {
      setEditingProjectId(null);
    }
  }, [editingProjectId, projectListDraft, user?.id]);

  const handleProjectListDelete = useCallback(async (id: string) => {
    if (!confirm('Excluir este projeto? Esta ação é irreversível.')) return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProjectId === id) {
      setActiveProjectId(null);
      setActiveDesignId(null);
    }
    try {
      if (user?.id) {
        await ProjectService.deleteProject(id);
      }
    } catch (e) {
      console.warn('Falha ao excluir projeto no backend, removendo localmente:', e);