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
    }
  }, [activeProjectId, user?.id]);

  const handleSaveAll = useCallback(async () => {
    try {
      localStorage.setItem('studioProjects', JSON.stringify(projects));
      if (activeProjectId) {
        localStorage.setItem('studioActiveProjectId', activeProjectId);
      } else {
        localStorage.removeItem('studioActiveProjectId');
      }
      if (activeDesignId) {
        localStorage.setItem('studioActiveDesignId', activeDesignId);
      } else {
        localStorage.removeItem('studioActiveDesignId');
      }
      if (user?.id) {
        for (const p of projects) {
          await ProjectService.updateProject(p.id, { name: p.name });
        }
      }
      alert('Projetos salvos.');
    } catch (e) {
      console.warn('Falha ao salvar globalmente:', e);
      alert('Falha ao salvar globalmente. Alterações ficam salvas localmente.');
    }
  }, [projects, user?.id, activeProjectId, activeDesignId]);

  const handleCreateProject = async () => {
    setIsProjectModalOpen(true);
  };

  const handleCreateProjectConfirm = async (projectName: string) => {
    if (!projectName.trim()) return;
    const name = projectName.trim();
    try {
      if (user?.id) {
        const created = await ProjectService.createProject({
          user_id: user.id,
          name,
          description: ''
        });
        const id = created.id;
        const newProj: Project = {
          id,
          name,
          designs: [],
          createdBy: user.email || 'Usuário'
        };
        setProjects((prev) => [...prev, newProj]);
        setActiveProjectId(id);
      } else {
        const id = `${Date.now()}`;
        const newProj: Project = { id, name, designs: [], createdBy: user?.email || 'Usuário' };
        setProjects((prev) => [...prev, newProj]);
        setActiveProjectId(id);
      }
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      const id = `${Date.now()}`;
      const newProj: Project = { id, name, designs: [], createdBy: user?.email || 'Usuário' };
      setProjects((prev) => [...prev, newProj]);
      setActiveProjectId(id);
    } finally {
      setIsProjectModalOpen(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setError(null);
    if (!activeProjectId) {
      alert('Crie ou selecione um projeto primeiro.');
      return;
    }
    setPendingFile(file);
    setIsUploadModalOpen(true);
  };

  const handleUploadConfirm = async (designName: string, designerName: string, workType: 'Parede' | 'Piso' | 'Aberturas') => {
    if (!pendingFile || !designName.trim()) return;

    const dataUrl = await fileToDataUrl(pendingFile);
    let designId = `${Date.now()}`;

    // Preparar URL final (Storage para usuários autenticados, base64 comprimido para convidados)
    let finalOriginalUrl: string;
    let finalMimeType: string = 'image/jpeg';
    if (user?.id) {
      const jpgData = await compressToJpegDataUrl(dataUrl, 0.85);
      const storagePath = `designs/${user.id}/${activeProjectId}/${designId}/original.jpg`;
      const uploadedUrl = await uploadDesignImage(jpgData, storagePath);
      finalOriginalUrl = uploadedUrl || jpgData;
      // Persistir design no backend e usar id real
      try {
        const created = await DesignService.createDesign({
          project_id: activeProjectId!,
          name: designName.trim(),
          original_image_url: finalOriginalUrl,
          mime_type: finalMimeType,
          designer_name: designerName.trim() || null,
          work_type: workType,
        });
        designId = created.id;
      } catch (e) {
        console.warn('Falha ao criar design no backend, mantendo local:', e);
      }
    } else {
      finalOriginalUrl = await compressToJpegDataUrl(dataUrl, 0.85);
    }

    const newDesign: Design = {
      id: designId,
      name: designName.trim(),
      originalImageUrl: finalOriginalUrl,
      mimeType: finalMimeType,
      edits: [],
      designerName: designerName.trim(),
      workType: workType,
    };

    setProjects((prev) =>
      prev.map((p) => (p.id === activeProjectId ? { ...p, designs: [...p.designs, newDesign] } : p))
    );
    setActiveDesignId(designId);
    setIsUploadModalOpen(false);
    setPendingFile(null);
  };

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current) return;
    const img = imageRef.current;
    const rect = img.getBoundingClientRect();
    const nw = img.naturalWidth || 1;
    const nh = img.naturalHeight || 1;
    const containerW = rect.width;
    const containerH = rect.height;
    const imgAspect = nw / nh;
    const containerAspect = containerW / containerH;

    let drawW = containerW, drawH = containerH, offsetX = 0, offsetY = 0;
    if (imgAspect > containerAspect) {
      drawW = containerW;
      drawH = containerW / imgAspect;
      offsetY = (containerH - drawH) / 2;
    } else {
      drawH = containerH;
      drawW = containerH * imgAspect;
      offsetX = (containerW - drawW) / 2;
    }

    const clickX = event.clientX - rect.left - offsetX;
    const clickY = event.clientY - rect.top - offsetY;

    const xClamped = Math.min(Math.max(clickX, 0), drawW);
    const yClamped = Math.min(Math.max(clickY, 0), drawH);

    const xNorm = xClamped / drawW;
    const yNorm = yClamped / drawH;

    setSelectionCoords({ x: xNorm, y: yNorm });
    // Registrar ponto para o alvo ativo
    setTargetPoints((prev) => ({ ...prev, [activeTarget]: { x: xNorm, y: yNorm } }));
  };

  const getImageContentBox = () => {
    if (!imageRef.current) return null;
    const img = imageRef.current;
    const rect = img.getBoundingClientRect();
    const nw = img.naturalWidth || 1;
    const nh = img.naturalHeight || 1;
    const containerW = rect.width;
    const containerH = rect.height;
    const imgAspect = nw / nh;
    const containerAspect = containerW / containerH;
    let drawW = containerW, drawH = containerH, offsetX = 0, offsetY = 0;
    if (imgAspect > containerAspect) {
      drawW = containerW;
      drawH = containerW / imgAspect;
      offsetY = (containerH - drawH) / 2;
    } else {
      drawH = containerH;
      drawW = containerH * imgAspect;
      offsetX = (containerW - drawW) / 2;
    }
    return { offsetX, offsetY, drawW, drawH, containerW, containerH };
  };

  const aiPrompt = useMemo(() => {
    const workType = activeDesign?.workType || 'Parede';
    const currentColor = targetColors[activeTarget] || selectedColor;

    if (activeTab === 'COLOR') {
      switch (workType) {
        case 'Piso':
          switch (floorFinishType) {
            case 'epoxy':
              return `Apply a glossy epoxy floor coating in color ${currentColor}. Simulate specular reflection and depth. Preserve perspective and lighting.`;
            case 'microcement':
              return `Apply a photorealistic microcement floor coating in color ${currentColor}. Style: ${microcementStyle}. Show subtle trowel marks, tonal variation, slight sheen, and cement grain. Avoid flat/uniform look. Preserve perspective, lighting, and room geometry.`;
            default:
              return `Apply color ${currentColor} to the floor surface. Keep furniture, walls, and lighting unchanged.`;
          }
        case 'Aberturas':
          return `Paint the selected door/window frame with color ${currentColor}. Keep the surrounding walls, furniture, and lighting intact.`;
        default: // 'Parede'
          return `Change the color of the selected wall to ${currentColor}. Keep the original room textures, furniture, and lighting as realistic as possible.`;
      }
    }

    if (activeTab === 'TEXTURE' && selectedTexture) {
      const colorHex = targetColors[activeTarget] || selectedColor;
      const isCimentoQueimado = selectedTexture.name?.toLowerCase().includes('cimento');
      const colorPhrase = isCimentoQueimado && colorHex
        ? ` Tone it using the catalog color ${colorHex} for a cohesive cement-burnt finish.`
        : '';

      switch (workType) {
        case 'Piso':
          return `Apply a realistic ${selectedTexture.name.toLowerCase()} finish to the floor.${colorPhrase} Maintain original perspective and lighting.`;
        case 'Aberturas':
          return `Apply ${selectedTexture.name.toLowerCase()} texture to the door/window surface. Keep surrounding areas unchanged.`;
        default:
          return `Apply a realistic ${selectedTexture.name.toLowerCase()} texture to the selected wall.${colorPhrase} Maintain the room's original lighting, shadows, and perspective.`;
      }
    }

    return '';
  }, [activeTab, selectedColor, selectedTexture, activeTarget, targetColors, activeDesign?.workType, floorFinishType]);

  const hasOps = Object.values(targetPoints).some(Boolean);
//const canApply = Boolean(activeDesign && aiPrompt && !isGenerating && (selectionCoords || hasOps));
const canApply = Boolean(activeDesign && aiPrompt && !isGenerating);

  const handleDownload = useCallback(() => {
    const url = displayedImageUrl || activeDesign?.originalImageUrl;
    if (!url) return;
    let ext = 'png';
    const m = url.match(/^data:image\/(png|jpeg|webp)/);
    if (m) ext = m[1] === 'jpeg' ? 'jpg' : m[1];
    const a = document.createElement('a');
    a.href = url;
    a.download = `prorevest-${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [displayedImageUrl, activeDesign]);

  const handleApply = useCallback(async () => {
    if (!canApply || !activeDesign) return;
    setIsGenerating(true);
    setError(null);

    // Preparar operações múltiplas quando houver pontos por alvo
    const ops = TARGETS.map((t) => {
      const pt = targetPoints[t.id];
      if (!pt) return null;
      return {
        point: pt,
        color: targetColors[t.id] || selectedColor,
        blendMode: 'multiply' as const,
        tintOpacity: 0.6,
        surface: t.label, // NOVO: passar a identificação da superfície
      };
    }).filter(Boolean) as any[];

    // Determinar finishType baseado em workType
    let finishType: 'paint' | 'epoxy' | 'microcement' = 'paint';
    if (activeDesign?.workType === 'Piso') {
      finishType = floorFinishType;
    } else if (activeDesign?.workType === 'Aberturas') {
      finishType = 'paint'; // Aberturas sempre usam pintura por enquanto
    }

    try {
      const res = await editRoomImage({
        imageDataUrl: displayedImageUrl || activeDesign.originalImageUrl,
        prompt: aiPrompt,
        selectionCoordinates: ops.length ? undefined : (selectionCoords ?? { x: 0.5, y: 0.5 }),
        color: ops.length ? undefined : (activeTab === 'COLOR' ? selectedColor : undefined),
        ops: ops.length ? ops : undefined,
        outputFormat: outputFormat,
        finishType,
        microcementStyle: floorFinishType === 'microcement' ? microcementStyle : undefined,
        meta:
          activeTab === 'TEXTURE' && selectedTexture?.imageUrl
            ? { textureUrl: selectedTexture.imageUrl, preserveLighting: true }
            : undefined,
      });

      if (res.status === 'ok' && res.processedImage) {
      const editId = `${Date.now()}`;
      const historyLabel = activeTab === 'COLOR' ? selectedColor : selectedTexture?.name || 'Edit';

      // Upload para Storage se autenticado, senão usar base64 comprimido
      let finalEditUrl: string;
      if (user?.id) {
        const jpgEdit = await compressToJpegDataUrl(res.processedImage!, 0.85);
        const storagePath = `designs/${user.id}/${activeProjectId}/${activeDesignId}/edits/${editId}.jpg`;
        const uploadedUrl = await uploadDesignImage(jpgEdit, storagePath);
        finalEditUrl = uploadedUrl || jpgEdit;
      } else {
        finalEditUrl = await compressToJpegDataUrl(res.processedImage!, 0.85);
      }

      setProjects((prev) =>
        prev.map((p) =>
          p.id !== activeProjectId
            ? p
            : {
                ...p,
                designs: p.designs.map((d) =>
                  d.id !== activeDesignId
                    ? d
                    : {
                        ...d,
                        edits: [...d.edits, { id: editId, prompt: historyLabel, imageUrl: finalEditUrl }],
                      }
                ),
              }
        )
      );
      // Persistir edição no backend (se autenticado)
      try {
        if (user?.id && activeDesignId) {
          await DesignService.addEdit({
            design_id: activeDesignId,
            prompt: historyLabel,
            image_url: finalEditUrl,
          });
        }
      } catch (e) {
        console.warn('Falha ao salvar edição no backend, mantendo local:', e);
      }
      setDisplayedImageUrl(finalEditUrl);
      } else {
        setError(res.error || 'Falha ao aplicar edição.');
      }
    } catch (error) {
      console.error('Falha ao processar edição no Studio:', error);
      setError('Não foi possível processar a imagem. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  }, [canApply, activeDesign, displayedImageUrl, aiPrompt, selectionCoords, targetPoints, targetColors, activeTab, selectedColor, activeProjectId, activeDesignId, selectedTexture, user?.id, floorFinishType, TARGETS]);

  const handleReset = useCallback(() => {
    setSelectedTexture(null);
    setSelectionCoords(null);
    setTargetColors({});
    setFloorFinishType('epoxy');
    // Reset dinâmico baseado nos TARGETS atuais
    const resetPoints: Record<string, null> = {};
    TARGETS.forEach(t => { resetPoints[t.id] = null; });
    setTargetPoints(resetPoints);
    setActiveTarget(TARGETS[0]?.id || 'WALL_A');
    setError(null);
    setComparePercent(50);
    if (activeDesign) {
      setDisplayedImageUrl(activeDesign.originalImageUrl);
    } else {
      setDisplayedImageUrl(null);
    }
  }, [activeDesign, TARGETS]);

  async function urlToDataUrl(url: string): Promise<string> {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  async function ensurePngDataUrl(dataUrl: string): Promise<string> {
    return await new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(dataUrl);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = dataUrl;
    });
  }

  // Helpers para compressão e upload de imagens de design
  async function compressToJpegDataUrl(dataUrl: string, quality: number = 0.85): Promise<string> {
    return await new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(dataUrl);
        ctx.drawImage(img, 0, 0);
        const jpg = canvas.toDataURL('image/jpeg', quality);
        resolve(jpg);
      };
      img.src = dataUrl;
    });
  }

  async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
    const res = await fetch(dataUrl);
    return await res.blob();
  }

  async function uploadDesignImage(dataUrl: string, path: string): Promise<string | null> {
    try {
      const blob = await dataUrlToBlob(dataUrl);
      const { error } = await supabase.storage
        .from('prorevest')
        .upload(path, blob, { upsert: true, cacheControl: '3600', contentType: blob.type || 'image/jpeg' });
      if (error) {
        console.warn('Falha ao subir imagem para Storage:', error.message);
        return null;
      }
      const { data } = supabase.storage
        .from('prorevest')
        .getPublicUrl(path);
      return data?.publicUrl || null;
    } catch (e) {
      console.warn('Erro ao preparar upload de imagem:', e);
      return null;
    }
  }

  // Helper para montar payload de orçamento com dados do usuário
  const buildBudgetPayload = useCallback(async () => {
    if (!activeProject || !activeDesign) return null;
    const baseUrl = displayedImageUrl || activeDesign.originalImageUrl;
    if (!baseUrl) return null;
    const rawDataUrl = baseUrl.startsWith('data:image') ? baseUrl : await urlToDataUrl(baseUrl);
    const dataUrl = await ensurePngDataUrl(rawDataUrl);
    const customer = {
      name: profile?.full_name || (user as any)?.user_metadata?.full_name || (user as any)?.user_metadata?.name || user?.email || 'Cliente',
      email: (user as any)?.email || null,
      phone: profile?.phone || null,
    };
    return {
      image: dataUrl,
      project: { id: activeProject.id, name: activeProject.name },
      design: { id: activeDesign.id, name: activeDesign.name },
      walls: {
        wallAColor: targetColors['WALL_A'] || null,
        wallBColor: targetColors['WALL_B'] || null,
        wallAName: targetColorMeta['WALL_A']?.name || null,
        wallBName: targetColorMeta['WALL_B']?.name || null,
        WALL_A: targetColors['WALL_A'] || null,
        WALL_B: targetColors['WALL_B'] || null,
      },
      customer,
      userId: user?.id || 'anonymous',
      notes: `Orçamento do Studio para ${activeProject.name}`,
      items: [],
      subtotal: 0,
      discount: 0,
      total: 0,
    };
  }, [activeProject, activeDesign, displayedImageUrl, targetColors, targetColorMeta, profile, user]);

  // Disparo silencioso ao salvar
  const sendBudgetAuto = useCallback(async (reason?: string) => {
    try {
      const payload = await buildBudgetPayload();
      if (!payload) return false;
      const res = await fetch('/api/quotes/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return res.ok;
    } catch {
      return false;
    }
  }, [buildBudgetPayload]);

  const handleGenerateBudget = useCallback(async () => {
    const payload = await buildBudgetPayload();
    if (!payload) return;
    const { image, project, customer, walls } = payload as any;
    const dataUrl = image;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    doc.setFontSize(16);
    doc.text('Orçamento ProRevest', 40, 40);
    doc.setFontSize(11);
    const pName = project?.name || activeProject?.name || 'Projeto';
    const today = new Date();
    doc.text(`Projeto: ${pName}`, 40, 62);
    doc.text(`Data: ${today.toLocaleDateString('pt-BR')}`, 40, 78);
    doc.text(`Cliente: ${customer?.name || '—'}`, 40, 94);
    doc.text(`E-mail: ${customer?.email || '—'}`, 40, 110);
    doc.text(`Telefone: ${customer?.phone || '—'}`, 40, 126);

    doc.setFontSize(12);
    doc.text('Tintas selecionadas:', 40, 150);
    doc.setFontSize(11);
    const wallA = walls?.wallAName ? `${walls.wallAName} (${walls.wallAColor || '—'})` : (walls?.wallAColor || '—');
    const wallB = walls?.wallBName ? `${walls.wallBName} (${walls.wallBColor || '—'})` : (walls?.wallBColor || '—');
    doc.text(`Parede 1: ${wallA}`, 40, 168);
    doc.text(`Parede 2: ${wallB}`, 40, 186);

    const pageW = doc.internal.pageSize.getWidth();
    const imgW = pageW - 80;
    const imgH = imgW * 0.56;
    doc.addImage(dataUrl, 'PNG', 40, 220, imgW, imgH);
    doc.save(`orcamento-${pName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  }, [buildBudgetPayload, activeProject]);

  const handleSendBudget = useCallback(async () => {
    try {
      setIsSendingBudget(true);
      const payload = await buildBudgetPayload();
      if (!payload) {
        alert('Selecione um projeto e um design antes de enviar o orçamento.');
        return;
      }
      const res = await fetch('/api/quotes/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Falha ao enviar orçamento.');
      alert('Orçamento enviado ao site com sucesso!');
    } catch (e: any) {
      console.error(e);
      alert(e?.message || 'Erro ao enviar orçamento.');
    } finally {
      setIsSendingBudget(false);
    }
  }, [buildBudgetPayload]);
  return (
    <Layout showHeaderFooter={false}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-screen-2xl xl:max-w-none mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                  <Palette className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Studio ProRevest</h1>
                  <p className="text-xs text-gray-500">Design de Interiores com IA</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Projeto ativo: {activeProject?.name || 'Nenhum'}
                </span>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-screen-2xl xl:max-w-none mx-auto px-2 sm:px-4 lg:px-6 grid grid-cols-12 gap-4">
          {/* Coluna lateral estreita: Ações do projeto (esquerda) */}
          <div className="col-span-12 lg:col-span-2 order-2 lg:order-1 bg-card text-card-foreground p-4 rounded-lg border shadow-sm flex flex-col gap-3">
            <h3 className="text-base font-semibold text-gray-800">Projeto</h3>
            
            {/* Card do Projeto Ativo */}
            {activeProject && (
              <div className="bg-gray-50 border rounded-lg p-3 mb-2">
                <div className="flex items-center justify-between mb-1">
                  {isEditingProjectName ? (
                    <input
                      value={projectNameDraft}
                      onChange={(e) => setProjectNameDraft(e.target.value)}
                      className="text-sm px-2 py-1 border rounded"
                    />
                  ) : (
                    <h4 className="font-medium text-gray-800 text-sm">{activeProject.name}</h4>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      title="Editar"
                      onClick={() => {
                        setIsEditingProjectName(true);
                        setProjectNameDraft(activeProject.name);
                      }}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      title="Salvar"
                      onClick={async () => {
                        if (!isEditingProjectName || !activeProject) return;
                        const name = (projectNameDraft || '').trim();
                        if (!name) { setIsEditingProjectName(false); return; }
                        setProjects((prev) => prev.map((p) => (p.id === activeProject.id ? { ...p, name } : p)));
                        setIsEditingProjectName(false);
                        try {
                          if (user?.id) {
                            await ProjectService.updateProject(activeProject.id, { name });
                          }
                        } catch (e) {
                          console.warn('Falha ao atualizar projeto no backend, mantendo alteração local:', e);
                        }
                        await sendBudgetAuto('project_save');
                      }}
                      className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
                      disabled={!isEditingProjectName}
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      title="Excluir"
                      onClick={() => {
                        if (confirm('Excluir este projeto? Esta ação é irreversível.')) {
                          setProjects((prev) => prev.filter((p) => p.id !== activeProject.id));
                          setActiveProjectId(null);
                          setActiveDesignId(null);
                        }
                      }}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  Criado por: {activeProject.createdBy || 'Usuário'}
                </p>
                {activeDesign && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      {isEditingDesignName ? (
                        <input
                          value={designNameDraft}
                          onChange={(e) => setDesignNameDraft(e.target.value)}
                          className="text-xs px-2 py-1 border rounded"
                        />
                      ) : (
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Design:</span> {activeDesign.name}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <button
                          title="Editar"
                          onClick={() => {
                            setIsEditingDesignName(true);
                            setDesignNameDraft(activeDesign.name);
                          }}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          title="Salvar"
                          onClick={async () => {
                            if (!isEditingDesignName) return;
                            const name = (designNameDraft || '').trim();
                            if (!name) { setIsEditingDesignName(false); return; }
                            setProjects((prev) => prev.map((p) => (
                              p.id === activeProject.id
                                ? { ...p, designs: p.designs.map((d) => (d.id === activeDesign.id ? { ...d, name } : d)) }
                                : p
                            )));
                            setIsEditingDesignName(false);
                            await sendBudgetAuto('design_save');
                          }}
                          className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
                          disabled={!isEditingDesignName}
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          title="Excluir"
                          onClick={() => {
                            if (confirm('Excluir este design? Esta ação é irreversível.')) {
                              setProjects((prev) => prev.map((p) => (
                                p.id === activeProject.id
                                  ? { ...p, designs: p.designs.filter((d) => d.id !== activeDesign.id) }
                                  : p
                              )));
                              setActiveDesignId(null);
                            }
                          }}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {activeDesign.designerName && (
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Designer:</span> {activeDesign.designerName}
                      </p>
                    )}
                    {activeDesign.workType && (
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Tipo:</span> {activeDesign.workType}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={handleCreateProject}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Novo Projeto
            </button>

            {/* Lista de Projetos Salvos */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-800">Meus Projetos</h4>
                <span className="text-xs text-gray-500">{projects.length}</span>
              </div>
              {projects.length === 0 ? (
                <p className="text-xs text-gray-500">Nenhum projeto salvo.</p>
              ) : (
                <div className="space-y-1 overflow-y-auto max-h-64 pr-1">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setActiveProjectId(p.id)}
                      className={`w-full px-3 py-2 rounded-md border cursor-pointer ${activeProjectId === p.id ? 'bg-orange-50 border-orange-300 text-orange-700' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'}`}
                      title={p.name}
                    >
                      <div className="flex items-center justify-between gap-2">
                        {editingProjectId === p.id ? (
                          <input
                            value={projectListDraft}
                            onChange={(e) => setProjectListDraft(e.target.value)}
                            className="text-sm px-2 py-1 border rounded w-full"
                            autoFocus
                          />
                        ) : (
                          <span className="text-sm font-medium truncate">{p.name}</span>
                        )}
                        <div className="flex items-center gap-2 shrink-0">
                          {editingProjectId === p.id ? (
                            <button
                              title="Salvar"
                              onClick={(e) => { e.stopPropagation(); handleProjectListSave(); }}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              title="Editar"
                              onClick={(e) => { e.stopPropagation(); setEditingProjectId(p.id); setProjectListDraft(p.name); }}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            title="Excluir"
                            onClick={(e) => { e.stopPropagation(); handleProjectListDelete(p.id); }}
                            className="text-gray-600 hover:text-red-600"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        {p.designs?.length ? (
                          <span className="text-xs text-gray-500">{p.designs.length} design(s)</span>
                        ) : <span className="text-xs text-gray-400">Sem designs</span>}
                        {activeProjectId === p.id && <span className="text-[10px] text-orange-600">ativo</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => setIsSaveModalOpen(true)}
                className="mt-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg font-semibold"
              >
                Salvar
              </button>
              <p className="mt-2 text-xs text-gray-500 text-center italic">
                O resultado da aplicação pode variar conforme o aplicador.
              </p>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-8 order-1 lg:order-2 bg-card text-card-foreground p-4 rounded-lg border shadow-sm flex flex-col items-center justify-center relative overflow-hidden min-h-[320px] sm:min-h-[420px] md:min-h-[560px]">
            {!activeDesign ? (
              <div className="text-center">
                <input
                  id="file-upload-studio"
                  type="file"
                  accept="image/jpeg, image/png"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) await handleImageUpload(f);
                  }}
                  disabled={!activeProject}
                />
                {activeProject ? (
                  <label
                    htmlFor="file-upload-studio"
                    className="cursor-pointer p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center hover:border-orange-500"
                  >
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                    <span className="font-semibold text-gray-700">Faça upload de um design</span>
                    <span className="text-sm text-gray-500 mt-1">Formatos suportados: JPG, PNG</span>
                    <span className="text-xs text-gray-400 mt-2 text-center">Selecione um projeto primeiro e envie uma imagem do ambiente.</span>
                  </label>
                ) : (
                  <div
                    aria-disabled="true"
                    className="p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-not-allowed opacity-50 pointer-events-none"
                  >
                    <Upload className="h-12 w-12 text-gray-300 mb-2" />
                    <span className="font-semibold text-gray-500">Faça upload de um design</span>
                    <span className="text-sm text-gray-400 mt-1">Formatos suportados: JPG, PNG</span>
                    <span className="text-xs text-gray-400 mt-2 text-center">Crie um projeto para habilitar o upload.</span>
                  </div>
                )}
              </div>
            ) : (
              <div ref={containerRef} className="w-full h-full relative">
                {isFloatingPaletteOpen && user && (
                  <FloatingPalette
                    onClose={() => setIsFloatingPaletteOpen(false)}
                    onSelectColor={(color) => {
                      setSelectedColor(color.hex_code);
                      setTargetColors((prev) => ({ ...prev, [activeTarget]: color.hex_code }));
                      setTargetColorMeta((prev) => ({ ...prev, [activeTarget]: { name: color.name, hex: color.hex_code, code: color.pro_revest_code || color.numeric_code || color.reference_number } }));
                      setIsFloatingPaletteOpen(false);
                    }}
                  />
                )}
                {isGenerating && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      </svg>
                      <span>Aplicando IA...</span>
                    </div>
                  </div>
                )}
                {(activeDesign?.originalImageUrl) ? (
                  <div className="absolute inset-0">
                    <img
                      ref={imageRef}
                      src={activeDesign.originalImageUrl}
                      alt={activeDesign?.name || 'Design image'}
                      crossOrigin="anonymous"
                      onClick={handleImageClick}
                      onLoad={() => setImageRenderTick((v) => v + 1)}
                      onError={async () => {
                        try {
                          const dataUrl = await urlToDataUrl(activeDesign.originalImageUrl);
                          setDisplayedImageUrl(dataUrl);
                          setComparePercent(100);
                        } catch (err) {
                          console.error('Falha ao carregar imagem base; fallback indisponível', err);
                        }
                      }}
                      className="absolute inset-0 w-full h-full object-contain rounded-b-lg"
                    />
                    {displayedImageUrl && displayedImageUrl !== activeDesign.originalImageUrl && (() => {
                      const box = getImageContentBox();
                      const containerRect = containerRef.current?.getBoundingClientRect();
                      const imageRect = imageRef.current?.getBoundingClientRect();
                      if (!box || !containerRect || !imageRect) return null;
                      const imageOffsetLeft = imageRect.left - containerRect.left;
                      const imageOffsetTop = imageRect.top - containerRect.top;
                      const overlayLeft = imageOffsetLeft + box.offsetX;
                      const overlayTop = imageOffsetTop + box.offsetY;
                      const overlayWidth = box.drawW * (comparePercent / 100);
                      const overlayHeight = box.drawH;
                      const sliderLeft = overlayLeft + overlayWidth;

                      return (
                        <>
                          <div
                          className="absolute pointer-events-none z-[10]"
                          style={{
                             left: overlayLeft,
                           top: overlayTop,
                          width: box.drawW,
                          height: box.drawH,
                          backgroundImage: `url(${displayedImageUrl})`,
                          backgroundRepeat: 'no-repeat',
                           backgroundPosition: 'left top',
                             backgroundSize: 'contain',
                              clipPath: `inset(0px ${Math.max(0, box.drawW - overlayWidth)}px 0px 0px)`
                            }}
                          />
                          {compareMode === 'split' && (
                            <div
                              className="absolute pointer-events-none z-[20]"
                              style={{ left: sliderLeft, top: overlayTop, height: overlayHeight }}
                            >
                              <div className="w-px bg-orange-600 h-full" />
                              <button
                                className="absolute -top-6 -translate-x-1/2 bg-white border border-orange-600 text-orange-600 rounded-full shadow px-3 py-1 text-xs font-semibold cursor-ew-resize pointer-events-auto touch-none"
                                onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); setIsSliding(true); }}
                                aria-label="Deslizar comparação"
                              >
                                ⇔
                              </button>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Imagem não disponível</p>
                  </div>
                )}
                {(() => {
                  const box = getImageContentBox();
                  // NOVO: Mostrar todos os pontos marcados com labels dinâmicos
                  const pts = TARGETS
                    .map(t => ({ id: t.id, label: t.label, pt: targetPoints[t.id] }))
                    .filter((p) => p.pt);

                  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
                    if (!imageRef.current) return;
                    const rect = imageRef.current.getBoundingClientRect();
                    if (!box) return;
                    const lx = e.clientX - rect.left - box.offsetX;
                    const ly = e.clientY - rect.top - box.offsetY;
                    const nx = Math.min(1, Math.max(0, lx / box.drawW));
                    const ny = Math.min(1, Math.max(0, ly / box.drawH));
                    setTargetPoints((prev) => ({ ...prev, [activeTarget]: { x: nx, y: ny } }));
                  };

                  if (!box) return null;
                  return (
                    <div className="absolute inset-0 z-10" style={{ cursor: 'crosshair' }} onClick={handleOverlayClick}>
                      {pts.map(({ id, label, pt }) => {
                        const containerRect = containerRef.current?.getBoundingClientRect();
                        const imageRect = imageRef.current?.getBoundingClientRect();
                        const imageOffsetLeft = (containerRect && imageRect) ? (imageRect.left - containerRect.left) : 0;
                        const imageOffsetTop = (containerRect && imageRect) ? (imageRect.top - containerRect.top) : 0;
                        const left = imageOffsetLeft + box.offsetX + (pt!.x * box.drawW);
                        const top = imageOffsetTop + box.offsetY + (pt!.y * box.drawH);
                        const dotSize = 10;
                        const hex = (targetColors[id] || '#ff4d00');
                        return (
                          <div
                            key={id}
                            style={{ position: 'absolute', left: left, top: top }}
                          >
                            {/* Cruz */}
                            <div style={{ position: 'absolute', left: 0, top: 0, width: 16, height: 2, background: '#ff4d00', transform: 'translate(-50%, -50%)' }}></div>
                            <div style={{ position: 'absolute', left: 0, top: 0, width: 2, height: 16, background: '#ff4d00', transform: 'translate(-50%, -50%)' }}></div>
                            {/* Bolinha */}
                            <div
                              style={{
                                position: 'absolute',
                                width: dotSize,
                                height: dotSize,
                                borderRadius: '50%',
                                background: hex,
                                border: '2px solid #fff',
                                left: 0,
                                top: 0,
                                transform: 'translate(-50%, -50%)'
                              }}
                            ></div>
                            {/* Label */}
                            <div
                              style={{
                                position: 'absolute',
                                left: 12,
                                top: -24,
                                background: 'rgba(255,77,0,0.9)',
                                color: '#fff',
                                fontSize: 11,
                                padding: '2px 6px',
                                borderRadius: 4,
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                              }}
                            >
                              {label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Painel direito: Controles */}
          <div className="col-span-12 lg:col-span-2 order-3 lg:order-3 bg-card text-card-foreground p-4 rounded-lg border shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Controles</h3>

            {/* Aviso explicativo sobre tipo de trabalho */}
            <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-xs text-blue-800">
                  <p className="font-semibold mb-1">Tipo de trabalho: <span className="text-blue-600">{activeDesign?.workType || 'Parede'}</span></p>
                  <p className="text-blue-700">Clique na imagem para marcar os pontos de aplicação.</p>
                  <p className="text-blue-600 mt-1 text-[10px]">
                    {activeDesign?.workType === 'Piso' && 'Piso → Seletor de acabamento disponível'}
                    {activeDesign?.workType === 'Aberturas' && 'Aberturas → Portas e Janelas'}
                    {(!activeDesign?.workType || activeDesign?.workType === 'Parede') && 'Parede → Pintura padrão'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <span className="text-xs font-semibold text-gray-600">Alvo de aplicação</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {TARGETS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTarget(t.id)}
                    className={`text-xs px-2 py-1 rounded border ${activeTarget === t.id ? 'bg-orange-100 border-orange-300 text-orange-800' : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* NOVO: Seletor de tipo de acabamento - apenas para Piso */}
            {activeDesign?.workType === 'Piso' && (
              <div className="mb-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-xs font-semibold text-gray-700 block mb-2">Tipo de Acabamento</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'epoxy', label: 'Epóxi Liso', desc: 'Brilhante, reflexivo' },
                    { id: 'microcement', label: 'Microcimento', desc: 'Contínuo, texturizado' },
                    { id: 'paint', label: 'Pintura', desc: 'Cor simples' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setFloorFinishType(option.id as 'epoxy' | 'microcement' | 'paint')}
                      className={`text-left px-2 py-1.5 rounded text-xs transition-colors ${
                        floorFinishType === option.id
                          ? 'bg-orange-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium block">{option.label}</span>
                      <span className={`text-[10px] ${floorFinishType === option.id ? 'text-orange-100' : 'text-gray-500'}`}>
                        {option.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeDesign?.workType === 'Piso' && floorFinishType === 'microcement' && (
              <div className="mb-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-xs font-semibold text-gray-700 block mb-2">Estilo Microcimento</span>
                <div className="flex gap-2">
                  {(['polido', 'rústico'] as const).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setMicrocementStyle(style)}
                      className={`flex-1 text-xs px-2 py-2 rounded border font-medium transition-colors ${
                        microcementStyle === style
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {style === 'polido' ? 'Tradicional 1' : 'Tradicional 2'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex border-b border-gray-200">
              {(['COLOR', 'TEXTURE'] as SelectionTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-4 text-sm font-medium transition-colors ${activeTab === tab ? 'border-b-2 border-orange-600 text-orange-600' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="py-4 space-y-4">
              {activeTab === 'COLOR' && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-bold"
                        style={{ border: `3px solid ${targetColors[activeTarget] || selectedColor}`, color: targetColors[activeTarget] || selectedColor }}
                        title="Tintas"
                      >
                        T
                      </div>
                      <div className="px-3 py-1 rounded-md border bg-white">
                        <span className="text-sm font-semibold text-gray-800">{selectedColorName}</span>
                        <span className="text-xs text-gray-500 ml-2">{targetColors[activeTarget] || selectedColor}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { if (!user) { setIsAuthModalOpen(true); } else { setIsPaletteModalOpen(true); } }}
                      className="text-xs inline-flex items-center gap-1 px-2 py-1 border rounded-md bg-white hover:bg-gray-50"
                    >
                      <Palette className="w-3 h-3" /> Paleta ProRevest
                    </button>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {PALETTE_COLORS.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => { setSelectedColor(c.hex); setTargetColors((prev) => ({ ...prev, [activeTarget]: c.hex })); setTargetColorMeta((prev) => ({ ...prev, [activeTarget]: { name: c.name, hex: c.hex } })); }}
                        className={`h-10 w-10 rounded-full transition-transform transform hover:scale-105 ${((targetColors[activeTarget] || selectedColor) === c.hex) ? 'ring-2 ring-offset-2 ring-orange-500' : ''}`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      ></button>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'TEXTURE' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-700">
                      {selectedTexture ? `Selecionado: ${selectedTexture.name}` : 'Não selecionado'}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedTexture(null)}
                        className="text-xs inline-flex items-center gap-1 px-2 py-1 border rounded-md bg-white hover:bg-gray-50"
                      >
                        Não selecionado
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      key="none"
                      onClick={() => setSelectedTexture(null)}
                      className={`relative rounded-lg overflow-hidden aspect-square border ${!selectedTexture ? 'ring-2 ring-orange-500' : ''}`}
                      style={{ borderColor: (targetColors[activeTarget] || selectedColor), borderWidth: (!selectedTexture ? 4 : 2), borderStyle: 'solid' }}
                    >
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-700 font-semibold text-xs text-center">Não selecionado</span>
                      </div>
                    </button>

                    {(adminTextures.length ? adminTextures : TEXTURE_OPTIONS).map((t) => (
                      <button
                        key={t.name}
                        onClick={() => setSelectedTexture(t)}
                        className={`relative rounded-lg overflow-hidden aspect-square border`}
                        style={{ borderColor: (targetColors[activeTarget] || selectedColor), borderWidth: (selectedTexture?.name === t.name ? 4 : 2), borderStyle: 'solid' }}
                      >
                        <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-white font-semibold text-xs text-center">{t.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-2">
                <label className="text-sm font-medium text-gray-700">Formato de saída</label>
                <div className="flex items-center gap-2 mt-1">
                  {(['webp','jpeg','png'] as ('webp'|'jpeg'|'png')[]).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setOutputFormat(fmt)}
                      className={`px-2 py-1 text-xs rounded border ${outputFormat===fmt ? 'bg-orange-100 border-orange-500 text-orange-700' : 'bg-white border-gray-300 text-gray-700'}`}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-2">
                <label className="text-sm font-medium text-gray-700">Comparação antes/depois</label>
                <div className="text-xs text-gray-500 mt-2">Arraste o marcador vertical sobre a imagem</div>
              </div>
            </div>

            <button
              onClick={handleApply}
              disabled={!canApply}
              className="w-full mt-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center"
            >
              {isGenerating ? 'Gerando...' : `Aplicar ${activeDesign?.workType === 'Piso' ? 'no Piso' : activeDesign?.workType === 'Aberturas' ? 'nas Aberturas' : 'nas Paredes'}`}
            </button>

            <button
              onClick={handleReset}
              className="w-full mt-2 bg-white hover:bg-gray-50 border text-gray-800 font-semibold py-2 px-4 rounded-lg"
            >
              Resetar
            </button>

            <button
              onClick={handleDownload}
              disabled={!(displayedImageUrl || activeDesign?.originalImageUrl)}
              className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg"
            >
              Baixar imagem
            </button>

            <button
              onClick={handleGenerateBudget}
              className="w-full mt-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-semibold py-2 px-4 rounded-lg text-sm"
            >
              Gerar Orçamento (PDF)
            </button>
            <button
              onClick={handleSendBudget}
              disabled={!activeProject || !activeDesign || isSendingBudget}
              className="w-full mt-2 bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:bg-gray-200 disabled:text-gray-500 font-semibold py-2 px-4 rounded-lg text-sm"
            >
              {isSendingBudget ? 'Enviando...' : 'Enviar Orçamento (Site)'}
            </button>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <div className="mt-6 border-t pt-4 flex-grow">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Edições</h3>
              <div className="space-y-2 overflow-y-auto max-h-48">
                {activeDesign && (
                  <div
                    className="flex items-center gap-2 p-2 rounded-md bg-gray-100 cursor-pointer"
                    onClick={() => setDisplayedImageUrl(activeDesign.originalImageUrl)}
                  >
                    <img src={activeDesign.originalImageUrl} className="w-10 h-10 rounded object-cover" />
                    <span className="text-sm font-semibold">Imagem Original</span>
                  </div>
                )}
                {activeDesign?.edits.slice().reverse().map((edit) => (
                  <div
                    key={edit.id}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                    onClick={() => setDisplayedImageUrl(edit.imageUrl)}
                  >
                    <img src={edit.imageUrl} className="w-10 h-10 rounded object-cover" />
                    <span className="text-sm">{edit.prompt}</span>
                  </div>
                ))}
                {activeDesign?.edits.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">Suas edições aparecerão aqui.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      {isPaletteModalOpen && (
        <ColorPaletteModal
          onClose={() => setIsPaletteModalOpen(false)}
          onSelectColor={(color) => {
            setSelectedColor(color.hex_code);
            setTargetColors((prev) => ({ ...prev, [activeTarget]: color.hex_code }));
            setTargetColorMeta((prev) => ({ ...prev, [activeTarget]: { name: color.name, hex: color.hex_code, code: color.pro_revest_code || color.numeric_code || color.reference_number } }));
            setIsPaletteModalOpen(false);
          }}
        />
      )}

      {/* Modal de Criação de Projeto */}
      {isProjectModalOpen && (
        <ProjectModal
          onClose={() => setIsProjectModalOpen(false)}
          onConfirm={handleCreateProjectConfirm}
          defaultName={`Projeto ${projects.length + 1}`}
        />
      )}

      {/* Modal de Upload de Design */}
      {isUploadModalOpen && (
        <UploadModal
          onClose={() => {
            setIsUploadModalOpen(false);
            setPendingFile(null);
          }}
          onConfirm={handleUploadConfirm}
          fileName={pendingFile?.name || ''}
          userName={profile?.full_name || user?.email || 'Usuário'}
        />
      )}

      {/* Modal de Salvar Elegante */}
      {isSaveModalOpen && (
        <SaveModal
          onClose={() => setIsSaveModalOpen(false)}
          onConfirm={async () => {
            await handleSaveAll();
            setIsSaveModalOpen(false);
          }}
        />
      )}
      </div>
    </Layout>
  );
}

// Tipos para paleta
type PaletteColorRow = {
  id: string;
  name: string;
  hex_code: string;
  pro_revest_code?: string;
  numeric_code?: string;
  reference_number?: string;
  category?: string;
};

function usePaginatedColors(initialTerm = '') {
  const [colors, setColors] = useState<PaletteColorRow[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [term, setTerm] = useState(initialTerm);
  const loadingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const PAGE_SIZE = 60;

  const fetchPage = useCallback(async (pageToFetch: number) => {
    if (loadingRef.current) return;

    const requestId = ++requestIdRef.current;
    const controller = new AbortController();
    abortRef.current = controller;
    loadingRef.current = true;
    setIsLoading(true);
    setError(null);

    const offset = pageToFetch * PAGE_SIZE;
    let didTimeout = false;
    const timeoutId = window.setTimeout(() => {
      didTimeout = true;
      controller.abort();
    }, 15000);

    try {
      let query = supabase
        .from('colors')
        .select('id,name,hex_code,pro_revest_code,numeric_code,reference_number,category')
        .eq('is_archived', false);

      const q = term.trim();
      if (q) {
        query = query.or(
          `name.ilike.%${q}%,pro_revest_code.ilike.%${q}%,numeric_code.ilike.%${q}%,reference_number.ilike.%${q}%`
        );
      }

      const { data, error: queryError } = await query
        .order('name', { ascending: true })
        .order('id', { ascending: true })
        .range(offset, offset + PAGE_SIZE - 1)
        .abortSignal(controller.signal);

      if (requestId !== requestIdRef.current) return;
      if (queryError) throw queryError;

      const list = (data || []) as PaletteColorRow[];
      setColors((prev) => {
        if (pageToFetch === 0) return list;
        const seen = new Set(prev.map((color) => color.id));
        return [...prev, ...list.filter((color) => !seen.has(color.id))];
      });
      setPage(pageToFetch + 1);
      setHasMore(list.length === PAGE_SIZE);
    } catch (fetchError) {
      if (requestId !== requestIdRef.current) return;
      if (controller.signal.aborted && !didTimeout) return;
      console.warn('Erro ao carregar cores:', fetchError);
      setError(didTimeout
        ? 'A paleta demorou para responder. Tente novamente.'
        : 'Não foi possível carregar mais cores. Tente novamente.');
    } finally {
      window.clearTimeout(timeoutId);
      if (requestId === requestIdRef.current) {
        loadingRef.current = false;
        abortRef.current = null;
        setIsLoading(false);
      }
    }
  }, [term]);

  const fetchNextPage = useCallback(() => {
    if (!hasMore || loadingRef.current) return;
    void fetchPage(page);
  }, [fetchPage, hasMore, page]);

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    loadingRef.current = false;
    setColors([]);
    setPage(0);
    setHasMore(true);
    setIsLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
      abortRef.current?.abort();
    };
  }, []);

  return { colors, page, isLoading, hasMore, error, term, setTerm, fetchPage, fetchNextPage, reset };
}

function ColorItem({ color, onPick }: { color: PaletteColorRow; onPick: (color: PaletteColorRow) => void }) {
  const hex = color.hex_code || '#cccccc';
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const code = color.pro_revest_code || color.numeric_code || color.reference_number || hex;

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // Aqui você pode adicionar lógica para salvar favoritos no localStorage ou backend
  };

  return (
    <button
      onClick={() => onPick(color)}
      className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 border"
      title={`${color.name}${color.pro_revest_code ? ` • ${color.pro_revest_code}` : ''}`}
    >
      <div className="w-8 h-8 rounded-md border" style={{ backgroundColor: hex }} />
      <div className="flex flex-col text-left flex-1">
        <span className="text-sm font-semibold text-gray-800">{color.name}</span>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">{code}</span>
          <button
            onClick={copyToClipboard}
            className="p-0.5 rounded hover:bg-gray-200 transition-colors"
            title="Copiar código"
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-600" />
            ) : (
              <Copy className="w-3 h-3 text-gray-400" />
            )}
          </button>
        </div>
      </div>
      <button
        onClick={toggleFavorite}
        className="p-1 rounded hover:bg-gray-200 transition-colors"
        title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
        <Star className={`w-4 h-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
      </button>
    </button>
  );
}



function ColorPaletteModal({ onClose, onSelectColor }: { onClose: () => void; onSelectColor: (color: PaletteColorRow) => void }) {
  const { colors, isLoading, hasMore, error, term, setTerm, fetchPage, fetchNextPage, reset } = usePaginatedColors('');
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      reset();
      void fetchPage(0);
    }, term.trim() ? 300 : 0);
    return () => window.clearTimeout(id);
  }, [term, reset, fetchPage]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting) && hasMore && !isLoading && !error) {
        fetchNextPage();
      }
    }, {
      root: scrollRef.current || undefined,
      rootMargin: '120px 0px',
      threshold: 0.01,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, isLoading, error, fetchNextPage]);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl border">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-orange-600" />
              <span className="font-semibold">Paleta ProRevest</span>
            </div>
            <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-3 border-b">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
                <input
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Buscar por nome ou código ProRevest"
                  className="w-full pl-8 pr-3 py-2 border rounded-md"
                />
              </div>
              <button
                onClick={() => {
                  reset();
                  fetchPage(0);
                }}
                className="text-sm px-3 py-2 border rounded-md bg-white hover:bg-gray-50"
              >
                Atualizar
              </button>
            </div>
          </div>
          <div ref={scrollRef} className="p-3 max-h-[60vh] overflow-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {colors.map((c) => (
                <ColorItem key={c.id} color={c} onPick={onSelectColor} />
              ))}
            </div>
            <div ref={sentinelRef} className="h-6" />
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-600 p-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
                <span>Carregando...</span>
              </div>
            )}
            {error && !isLoading && (
              <div className="flex items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={fetchNextPage}
                  className="shrink-0 rounded border border-red-300 bg-white px-2 py-1 text-xs font-medium hover:bg-red-100"
                >
                  Tentar novamente
                </button>
              </div>
            )}
            {!hasMore && colors.length > 0 && (
              <p className="text-xs text-gray-500 text-center py-2">Fim dos resultados</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Modal de Criação de Projeto
function ProjectModal({ 
  onClose, 
  onConfirm, 
  defaultName 
}: { 
  onClose: () => void; 
  onConfirm: (name: string) => void; 
  defaultName: string; 
}) {
  const [projectName, setProjectName] = useState(defaultName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      onConfirm(projectName);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Criar Novo Projeto</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Projeto
            </label>
            <input
              id="project-name"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Digite o nome do projeto"
              autoFocus
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 font-medium"
            >
              Criar Projeto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal de Upload de Design
function UploadModal({ 
  onClose, 
  onConfirm, 
  fileName, 
  userName 
}: { 
  onClose: () => void; 
  onConfirm: (designName: string, designerName: string, workType: 'Parede' | 'Piso' | 'Aberturas') => void; 
  fileName: string; 
  userName: string; 
}) {
  const [designName, setDesignName] = useState(fileName.replace(/\.[^/.]+$/, ''));
  const [designerName, setDesignerName] = useState(userName || '');
  const [workType, setWorkType] = useState<'Parede' | 'Piso' | 'Aberturas'>('Parede');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (designName.trim() && designerName.trim()) {
      onConfirm(designName, designerName, workType);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload de Design</h2>
        
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Usuário:</span> {userName}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="design-name" className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Design
            </label>
            <input
              id="design-name"
              type="text"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Digite o nome do design"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="designer-name" className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Designer
            </label>
            <input
              id="designer-name"
              type="text"
              value={designerName}
              onChange={(e) => setDesignerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Digite o nome do designer"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Trabalho/Aplicação
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Parede', 'Piso', 'Aberturas'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setWorkType(type)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    workType === type
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 font-medium"
            >
              Fazer Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SaveModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [isSaving, setIsSaving] = useState(false);

  const handleConfirm = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await onConfirm();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl border">
        <div className="flex items-center gap-3 mb-3">
          <Save className="w-6 h-6 text-orange-600" />
          <h2 className="text-xl font-semibold text-gray-800">Salvar alterações</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Vamos salvar o projeto, designs e edições atuais no seu backend.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 font-medium disabled:opacity-60"
            disabled={isSaving}
          >
            {isSaving ? 'Salvando…' : 'Salvar agora'}
          </button>
        </div>
      </div>
    </div>
  );
}

function FloatingPalette({ onClose, onSelectColor }: { onClose: () => void; onSelectColor: (color: PaletteColorRow) => void }) {
  const { colors, isLoading, hasMore, error, term, setTerm, fetchPage, fetchNextPage, reset } = usePaginatedColors('');
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      reset();
      void fetchPage(0);
    }, term.trim() ? 300 : 0);
    return () => window.clearTimeout(id);
  }, [term, reset, fetchPage]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting) && hasMore && !isLoading && !error) {
        fetchNextPage();
      }
    }, {
      root: scrollRef.current || undefined,
      rootMargin: '120px 0px',
      threshold: 0.01,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, isLoading, error, fetchNextPage]);

  return (
    <div className="absolute top-0 right-0 h-full w-[320px] bg-white/95 backdrop-blur-sm border-l shadow-lg rounded-l-lg z-30 flex flex-col">
      <div className="flex items-center justify-between p-2 border-b bg-white/80">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-semibold">Paleta ProRevest</span>
        </div>
        <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-2 border-b bg-white/80">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Nome ou código ProRevest"
            className="w-full pl-8 pr-2 py-2 border rounded-md text-sm"
          />
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-auto p-2">
        <div className="space-y-2">
          {colors.map((c) => (
            <ColorItem key={c.id} color={c} onPick={onSelectColor} />
          ))}
        </div>
        <div ref={sentinelRef} className="h-6" />
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-600 p-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
            <span>Carregando...</span>
          </div>
        )}
        {error && !isLoading && (
          <div className="flex items-center justify-between gap-2 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">
            <span>{error}</span>
            <button
              type="button"
              onClick={fetchNextPage}
              className="shrink-0 rounded border border-red-300 bg-white px-2 py-1 font-medium hover:bg-red-100"
            >
              Tentar novamente
            </button>
          </div>
        )}
        {!hasMore && colors.length > 0 && (
          <p className="text-[11px] text-gray-500 text-center py-1">Fim dos resultados</p>
        )}
      </div>
    </div>
  );
}
