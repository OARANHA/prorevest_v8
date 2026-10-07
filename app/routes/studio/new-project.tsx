import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Layout } from "../../components/Layout";
import { ArrowLeft, Upload, Palette, Check, ImagePlus, Wand2, Eraser, Sparkles, Blend, RefreshCw } from "lucide-react";

export default function NewStudioProject() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!loading && !user) {
      const redirectTo = `${location.pathname}${location.search || ""}`;
      navigate(`/login?redirect=${encodeURIComponent(redirectTo)}`);
    }
  }, [loading, user, navigate, location]);

  // Guardas visuais movidos para baixo dos hooks para manter a ordem estável dos hooks entre renders

  // Estados para o formulário
  const [projectData, setProjectData] = useState({
    name: "",
    roomType: "",
    description: "",
    style: "",
    primaryColor: "#f1e9da",
  });

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<{ width: number; height: number; sizeMB: number; type: string } | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedColor, setSelectedColor] = useState<string>(projectData.primaryColor);

  // ROI e preview local
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDrawingROI, setIsDrawingROI] = useState(false);
  const [roi, setRoi] = useState<{ x0: number; y0: number; x1: number; y1: number } | null>(null); // valores 0..1
  const [selectionPoint, setSelectionPoint] = useState<{ x: number; y: number } | null>(null);
  const [blendMode, setBlendMode] = useState<'multiply' | 'overlay' | 'normal'>("multiply");
  const [tintOpacity, setTintOpacity] = useState<number>(0.6);
  const [isUpgrading, setIsUpgrading] = useState(false);
  
  const [aiUpgraded, setAiUpgraded] = useState(false);
  const [aiResultUrl, setAiResultUrl] = useState<string | null>(null);
  const [resultMeta, setResultMeta] = useState<{ width: number; height: number } | null>(null);
  const [outputFormat, setOutputFormat] = useState<'webp' | 'jpeg' | 'png'>('webp');

  // Util para diferenciar levemente a cor quando "IA aplicada" (feedback visual)
  const lightenHex = useCallback((hex: string, amt: number) => {
    try {
      let c = hex.replace('#', '');
      if (c.length === 3) c = c.split('').map(ch => ch + ch).join('');
      const num = parseInt(c, 16);
      let r = (num >> 16) & 255;
      let g = (num >> 8) & 255;
      let b = num & 255;
      const adjust = (v: number) => Math.max(0, Math.min(255, Math.round(v + 255 * amt)));
      r = adjust(r); g = adjust(g); b = adjust(b);
      const toHex = (v: number) => v.toString(16).padStart(2, '0');
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    } catch {
      return hex;
    }
  }, []);

  // Paleta base (cores inspiradas em Tailwind e no padrão visual atual)
  const PALETTE = useMemo(
    () => [
      { name: "Areia Suave", hex: "#F1E9DA" },
      { name: "Âmbar 100", hex: "#FEF3C7" },
      { name: "Âmbar 300", hex: "#FDE68A" },
      { name: "Âmbar 500", hex: "#F59E0B" },
      { name: "Cinza 50", hex: "#F8FAFC" },
      { name: "Cinza 200", hex: "#E2E8F0" },
      { name: "Cinza 300", hex: "#CBD5E1" },
      { name: "Azul 100", hex: "#DBEAFE" },
      { name: "Azul 300", hex: "#93C5FD" },
      { name: "Verde 100", hex: "#DCFCE7" },
      { name: "Verde 300", hex: "#86EFAC" },
      { name: "Violeta 100", hex: "#EDE9FE" },
      { name: "Violeta 300", hex: "#C4B5FD" },
      { name: "Rosa 100", hex: "#FCE7F3" },
      { name: "Rosa 300", hex: "#F9A8D4" },
    ],
    []
  );

  const processFile = useCallback((file: File, onResetInput?: () => void) => {
    // Validar formato do arquivo
    const validFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!validFormats.includes(file.type)) {
      alert("Formato de arquivo inválido. Por favor, envie apenas PNG, JPEG ou WebP.");
      onResetInput?.();
      return;
    }

    // Validar tamanho (máximo 8MB)
    const maxSize = 8 * 1024 * 1024; // 8MB
    if (file.size > maxSize) {
      alert("Arquivo muito grande. Por favor, envie uma imagem com no máximo 8MB.");
      onResetInput?.();
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        setUploadedImage(dataUrl);
        setImageMeta({ width: img.naturalWidth, height: img.naturalHeight, sizeMB: +(file.size / (1024 * 1024)).toFixed(2), type: file.type });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file, () => (e.target.value = ""));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Colar imagem do clipboard (Ctrl/Cmd + V)
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            processFile(file);
            e.preventDefault();
            break;
          }
        }
      }
    };
    document.addEventListener('paste', onPaste as any);
    return () => document.removeEventListener('paste', onPaste as any);
  }, [processFile]);

  // Autosave do rascunho
  useEffect(() => {
    const draft = {
      projectData,
      uploadedImage,
      selectedColor,
      roi,
      selectionPoint,
      blendMode,
      tintOpacity,
      outputFormat,
    };
    try {
      localStorage.setItem('newProject.draft', JSON.stringify(draft));
    } catch {}
  }, [projectData, uploadedImage, selectedColor, roi, selectionPoint, blendMode, tintOpacity, outputFormat]);

  // Restaurar rascunho
  useEffect(() => {
    try {
      const raw = localStorage.getItem('newProject.draft');
      if (raw) {
        const d = JSON.parse(raw);
        if (d.projectData) setProjectData(d.projectData);
        if (d.uploadedImage) setUploadedImage(d.uploadedImage);
        if (d.selectedColor) setSelectedColor(d.selectedColor);
        if (d.roi) setRoi(d.roi);
        if (d.selectionPoint) setSelectionPoint(d.selectionPoint);
        if (d.blendMode) setBlendMode(d.blendMode);
        if (typeof d.tintOpacity === 'number') setTintOpacity(d.tintOpacity);
        if (d.outputFormat === 'webp' || d.outputFormat === 'jpeg' || d.outputFormat === 'png') setOutputFormat(d.outputFormat);
      }
    } catch {}
  }, []);

  // ROI interactions (arrastar para criar retângulo em porcentagem)
  const onPreviewMouseDown = (e: React.MouseEvent) => {
    if (!previewRef.current || !uploadedImage) return;
    setIsDrawingROI(true);
    const rect = previewRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const clampedX = Math.min(Math.max(x, 0), 1);
    const clampedY = Math.min(Math.max(y, 0), 1);
    setSelectionPoint(null);
    setRoi({ x0: clampedX, y0: clampedY, x1: clampedX, y1: clampedY });
  };

  const onPreviewMouseMove = (e: React.MouseEvent) => {
    if (!isDrawingROI || !previewRef.current || !roi) return;
    const rect = previewRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const clampedX = Math.min(Math.max(x, 0), 1);
    const clampedY = Math.min(Math.max(y, 0), 1);
    setRoi({ ...roi, x1: clampedX, y1: clampedY });
  };

  const onPreviewMouseUp = () => {
    setIsDrawingROI(false);
    if (roi) {
      const w = Math.abs(roi.x1 - roi.x0);
      const h = Math.abs(roi.y1 - roi.y0);
      const isClick = w < 0.01 && h < 0.01; // ~1%
      if (isClick) {
        const sp = { x: roi.x0, y: roi.y0 };
        setSelectionPoint(sp);
        setRoi(null);
        // Disparo automático do upgrade IA ao clicar na imagem (se houver cor selecionada)
        if (uploadedImage && selectedColor) {
          void handleUpgradeRealista({ selectionPoint: sp, roi: null as any });
        }
      }
    }
  };

  const resetPaint = () => { setRoi(null); setSelectionPoint(null); };

  // Guardrails de imagem
  const minW = 1024;
  const minH = 768;
  const sizeOk = imageMeta ? imageMeta.sizeMB <= 8 : false;
  const formatOk = imageMeta ? ["image/png", "image/jpeg", "image/webp"].includes(imageMeta.type) : false;
  const resolutionOk = imageMeta ? (imageMeta.width >= minW && imageMeta.height >= minH) : false;

  const canUpgradeIA = !!uploadedImage && !!selectedColor && (!!roi || !!selectionPoint);
  
  const canContinue = !!uploadedImage;

  // Processamento local: aplica uma tinta na ROI com blend no canvas
  const localUpgradeRealista = async (
    imageDataUrl: string,
    roi: { x0: number; y0: number; x1: number; y1: number },
    color: string,
    blend: 'multiply' | 'overlay' | 'normal',
    opacity: number,
    format: 'webp' | 'jpeg' | 'png'
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        img.onload = () => {
          const w = img.naturalWidth;
          const h = img.naturalHeight;
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas 2D não disponível'));

          // Desenha base
          ctx.drawImage(img, 0, 0, w, h);

          // Calcula ROI em pixels (clamp 0..1)
          const x0 = Math.max(0, Math.min(1, roi.x0));
          const y0 = Math.max(0, Math.min(1, roi.y0));
          const x1 = Math.max(0, Math.min(1, roi.x1));
          const y1 = Math.max(0, Math.min(1, roi.y1));
          const rx = Math.round(Math.min(x0, x1) * w);
          const ry = Math.round(Math.min(y0, y1) * h);
          const rw = Math.max(1, Math.round(Math.abs(x1 - x0) * w));
          const rh = Math.max(1, Math.round(Math.abs(y1 - y0) * h));

          // Aplica tinta na ROI
          const prevComp = ctx.globalCompositeOperation;
          const prevAlpha = ctx.globalAlpha;

          ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
          ctx.globalCompositeOperation = blend === 'normal' ? 'source-over' : blend;
          ctx.fillStyle = color;
          ctx.fillRect(rx, ry, rw, rh);

          // Restaura
          ctx.globalCompositeOperation = prevComp;
          ctx.globalAlpha = prevAlpha;

          // Exporta no formato solicitado
          const mime = format === 'png' ? 'image/png' : format === 'jpeg' ? 'image/jpeg' : 'image/webp';
          try {
            const out = canvas.toDataURL(mime, 0.92);
            resolve(out);
          } catch (e) {
            // Fallback
            resolve(canvas.toDataURL());
          }
        };
        img.onerror = () => reject(new Error('Falha ao carregar imagem')); 
        img.src = imageDataUrl;
      } catch (e) {
        reject(e);
      }
    });
  };

  // Prévia local para textura: gera um padrão de areia fina e aplica na ROI
  const localUpgradeTexture = async (
    uploadedImage: string,
    roi: { x0: number; y0: number; x1: number; y1: number },
    format: 'webp' | 'jpeg' | 'png'
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const W = img.naturalWidth;
          const H = img.naturalHeight;
          const canvas = document.createElement('canvas');
          canvas.width = W;
          canvas.height = H;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, W, H);
  
          // ROI em pixels
          const x0 = Math.round(roi.x0 * W);
          const y0 = Math.round(roi.y0 * H);
          const x1 = Math.round(roi.x1 * W);
          const y1 = Math.round(roi.y1 * H);
          const rw = Math.max(1, x1 - x0);
          const rh = Math.max(1, y1 - y0);
  
          // Gera um tile 64x64 com ruído suave (areia fina)
          const tile = document.createElement('canvas');
          tile.width = 64; tile.height = 64;
          const tctx = tile.getContext('2d')!;
          tctx.fillStyle = '#e8dfcf';
          tctx.fillRect(0, 0, 64, 64);
          const imgData = tctx.getImageData(0, 0, 64, 64);
          const d = imgData.data;
          for (let i = 0; i < d.length; i += 4) {
            const n = Math.random(); // ruído uniforme
            const delta = Math.floor((n - 0.5) * 18); // variação suave
            d[i] = Math.min(255, Math.max(0, d[i] + delta));     // R
            d[i+1] = Math.min(255, Math.max(0, d[i+1] + delta)); // G
            d[i+2] = Math.min(255, Math.max(0, d[i+2] + delta)); // B
            // Alpha mantém
          }
          tctx.putImageData(imgData, 0, 0);
  
          // Cria o pattern e aplica na ROI com multiplicação leve
          const pattern = ctx.createPattern(tile, 'repeat')!;
          ctx.save();
          ctx.globalAlpha = 0.25; // leve
          ctx.globalCompositeOperation = 'multiply';
          ctx.translate(x0, y0);
          ctx.fillStyle = pattern as any;
          ctx.fillRect(0, 0, rw, rh);
          ctx.restore();
  
          // Exporta
          const mime = format === 'png' ? 'image/png' : format === 'jpeg' ? 'image/jpeg' : 'image/webp';
          try {
            const out = canvas.toDataURL(mime, 0.92);
            resolve(out);
          } catch {
            resolve(canvas.toDataURL());
          }
        };
        img.onerror = () => reject(new Error('Falha ao carregar imagem'));
        img.src = uploadedImage;
      } catch (e) {
        reject(e);
      }
    });
  };

  const handleUpgradeRealista = async (opts?: { selectionPoint?: { x: number; y: number }; roi?: { x0: number; y0: number; x1: number; y1: number } | null }) => {
    const effectiveSelection = opts?.selectionPoint ?? selectionPoint;
    const effectiveROIFromState = roi ?? null;
    const providedROI = opts?.roi ?? null;
    if (!uploadedImage || !selectedColor) return;
  
    setIsUpgrading(true);
    try {
      let roiForLocal = providedROI || effectiveROIFromState || null;
      if (!roiForLocal && effectiveSelection) {
        const r = 0.08; // ~8% da imagem ao redor do ponto
        const x0 = Math.max(0, effectiveSelection.x - r);
        const y0 = Math.max(0, effectiveSelection.y - r);
        const x1 = Math.min(1, effectiveSelection.x + r);
        const y1 = Math.min(1, effectiveSelection.y + r);
        roiForLocal = { x0, y0, x1, y1 };
      }
  
      // Prévia local otimista (aplica tinta enquanto a IA processa)
      if (roiForLocal) {
        try {
          // Removido preview local com ruído para evitar textura no cliente
          // const previewOut = await localUpgradeTexture(uploadedImage, roiForLocal, outputFormat);
          // setAiResultUrl(previewOut);
          // setAiUpgraded(true);
        } catch {}
      }
  
      const baseDesc = projectData.description?.trim() ? projectData.description.trim() + "\n\n" : "";
      const alvo = (roiForLocal || effectiveROIFromState) ? "na área selecionada" : effectiveSelection ? "ao redor do ponto indicado" : "na região indicada";
      const prompt = `${baseDesc}Aplique de forma realista a cor ${selectedColor} ${alvo}, preservando iluminação, sombras e textura. Não altere móveis, pisos ou pessoas. Use aparência semelhante a ${blendMode} com opacidade aproximada de ${Math.round(tintOpacity * 100)}%. Retorne somente a imagem final.`;
  
      const resp = await fetch('/api/ai/upgrade-realista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: uploadedImage,
          roi: roiForLocal || effectiveROIFromState,
          selectionCoordinates: effectiveSelection ? { x: effectiveSelection.x, y: effectiveSelection.y, units: 'percent' as const } : null,
          prompt,
          color: selectedColor,
          blendMode,
          tintOpacity,
          meta: imageMeta,
          outputFormat,
        }),
      });
  
      let processed: string | null = null;
      if (resp.ok) {
        const data = await resp.json();
        if (data?.processedImage) {
          processed = data.processedImage;
        }
      }
  
      // Se a IA retornou, trocamos a prévia pela versão final
      if (processed) {
        setAiResultUrl(processed);
      }
  
      setAiUpgraded(true);
      setTimeout(() => setAiUpgraded(false), 5000);
    } catch (e) {
      console.error(e);
      alert('Não foi possível completar o Upgrade de Cor agora. Tente novamente.');
    } finally {
      setIsUpgrading(false);
    }
  };

  // Handler de textura (areia fina) com mesmo comportamento


  const handleCreateProject = async () => {
    // Permitir continuar sem nome: geramos um padrão caso vazio
    if (!uploadedImage) {
      alert("Por favor, faça upload de uma imagem para continuar.");
      return;
    }

    setIsCreating(true);

    try {
      const now = Date.now();
      const defaultName = `Projeto Studio - ${now}`;
      const finalName = (projectData.name && projectData.name.trim().length > 0)
        ? projectData.name.trim()
        : defaultName;

      // Criar objeto do projeto
      const finalImage = aiResultUrl || uploadedImage;
      const newProject = {
        ...projectData,
        name: finalName,
        primaryColor: selectedColor,
        image: finalImage,
        preview: {
          roi,
          blendMode,
          tintOpacity,
        },
        user_id: user?.id,
        status: "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Criar slug único para o projeto
      let projectSlug = newProject.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      if (!projectSlug) projectSlug = `studio-${now}`;

      // Salvar dados do projeto no localStorage para o editor
      localStorage.setItem('studioProject', JSON.stringify(newProject));
      // Salvar imagem separada (se possível). Se estiver indisponível no localStorage, o Editor cairá para newProject.image
      localStorage.setItem('studioProjectImage', finalImage);
      localStorage.removeItem('newProject.draft');

      setTimeout(() => {
        setIsCreating(false);
        navigate(`/studio/editor/${projectSlug}`);
      }, 800);

    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      setIsCreating(false);
      alert("Ocorreu um erro ao criar o projeto. Tente novamente.");
    }
  };

  useEffect(() => {
    if (!aiResultUrl) { setResultMeta(null); return; }
    const img = new Image();
    img.onload = () => {
      setResultMeta({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = aiResultUrl;
  }, [aiResultUrl]);

  if (loading) {
    return (
      <Layout showHeaderFooter={true}>
        <div className="min-h-screen grid place-items-center bg-gradient-to-b from-yellow-50 via-white to-yellow-50">
          <div className="flex items-center gap-3 text-slate-700">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600 border-t-transparent"></div>
            Carregando...
          </div>
        </div>
      </Layout>
    );
  }

  if (!loading && !user) {
    return (
      <Layout showHeaderFooter={true}>
        <div className="min-h-screen grid place-items-center bg-gradient-to-b from-yellow-50 via-white to-yellow-50">
          <div className="text-center">
            <p className="text-slate-700">Acesso restrito: faça login para continuar.</p>
            <button
              onClick={() => navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`)}
              className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              Ir para login
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showHeaderFooter={true}>
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-yellow-50">
        {/* Header premium */}
        <header className="border-b border-amber-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/studio")}
                  className="text-slate-600 hover:text-slate-900 inline-flex items-center"
                >
                  <ArrowLeft className="h-5 w-5 mr-1.5" />
                  Voltar
                </button>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">Novo Projeto</h1>
                  <p className="text-xs text-slate-500">Studio ProRevest · Passo 1 de 3</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm text-amber-700">
                <Wand2 className="h-4 w-4" />
                Canvas Pro habilitado
              </div>
            </div>
          </div>
        </header>

        {/* Grid principal: 3 colunas */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)_360px] gap-6">
            {/* Coluna Esquerda: Dados + Guardrails */}
            <section className="space-y-6 order-2 xl:order-1">
              {/* Dados do Projeto */}
              <div className="bg-white rounded-2xl border border-amber-200 ring-1 ring-amber-200/60 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Dados do Projeto</h2>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nome do Projeto</label>
                <input
                  type="text"
                  value={projectData.name}
                  onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                  placeholder="Ex: Sala de Estar Moderna"
                  className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                />

                <label className="block text-sm font-medium text-slate-700 mt-5 mb-2">Descrição (Opcional)</label>
                <textarea
                  value={projectData.description}
                  onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                  placeholder="Objetivos, preferências, referências..."
                  rows={4}
                  className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-2">Ajuda a IA a sugerir cores e materiais.</p>
              </div>

              {/* Guardrails & Checklist */}
              <div className="bg-white rounded-2xl border border-amber-200 ring-1 ring-amber-200/60 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-3">
                  <ImagePlus className="h-5 w-5 text-amber-600" />
                  <h3 className="text-slate-900 font-semibold">Qualidade da Imagem</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${formatOk ? 'bg-green-500' : uploadedImage ? 'bg-red-500' : 'bg-slate-300'}`}></span>
                    Formato: PNG/JPEG/WebP {imageMeta ? `• ${imageMeta.type}` : ''}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${sizeOk ? 'bg-green-500' : uploadedImage ? 'bg-red-500' : 'bg-slate-300'}`}></span>
                    Tamanho: até 8MB {imageMeta ? `• ${imageMeta.sizeMB}MB` : ''}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${resolutionOk ? 'bg-green-500' : uploadedImage ? 'bg-yellow-500' : 'bg-slate-300'}`}></span>
                    Resolução mínima: 1024×768 {imageMeta ? `• ${imageMeta.width}×${imageMeta.height}` : ''}
                  </li>
                </ul>
                <p className="text-xs text-slate-500 mt-2">Dica: evite fotos muito escuras ou com perspectiva extrema.</p>
              </div>

              {/* Exemplos rápidos */}
              <div className="bg-white rounded-2xl border border-amber-200 ring-1 ring-amber-200/60 shadow-sm p-6">
                <h3 className="text-slate-900 font-semibold mb-3">Sem imagem? Use um exemplo</h3>
                <div className="grid grid-cols-2 gap-3">
                  {["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1616594039964-ae9021a4009a?q=80&w=1200&auto=format&fit=crop"].map((url) => (
                    <button
                      type="button"
                      key={url}
                      onClick={() => {
                        setUploadedImage(url);
                        setImageMeta({ width: 1200, height: 800, sizeMB: 1.2, type: 'image/jpeg' });
                      }}
                      className="relative rounded-lg overflow-hidden border border-amber-200 hover:ring-2 hover:ring-amber-300"
                    >
                      <img src={url} alt="Exemplo" className="h-20 w-full object-cover" />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">Você também pode colar uma imagem (Ctrl/Cmd + V).</p>
              </div>
            </section>

            {/* Coluna Central: Preview e ROI */}
            <section
              className={
                "relative rounded-2xl border border-amber-200 bg-white shadow-sm overflow-hidden ring-1 ring-amber-200/60 order-1 xl:order-2"
              }
            >
              {/* Toolbar do preview */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-amber-200/60 bg-gradient-to-r from-yellow-50 to-white">
                <div className="flex items-center gap-2 text-slate-700">
                  <ImagePlus className="h-5 w-5 text-amber-600" />
                  <span className="font-medium">Prévia do Ambiente</span>
                </div>
                <div className="flex items-center gap-3">
                  {aiUpgraded && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs border border-emerald-200">
                      <Sparkles className="h-3.5 w-3.5" /> Upgrade IA aplicado
                    </span>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-500 text-white text-sm hover:bg-amber-600"
                  >
                    <Upload className="h-4 w-4" />
                    Carregar
                  </button>
                  <button
                    onClick={resetPaint}
                    disabled={!roi && !selectionPoint}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-amber-200 text-slate-700 text-sm hover:bg-amber-50"
                  >
                    <Eraser className="h-4 w-4" />
                    Reset pintura
                  </button>
                </div>
              </div>

              {/* Área de preview com drag-and-drop e ROI */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={
                  "relative group min-h-[420px] md:min-h-[520px] flex items-center justify-center bg-[linear-gradient(45deg,rgba(253,231,76,0.15)_25%,transparent_25%),linear-gradient(-45deg,rgba(253,231,76,0.15)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,rgba(253,231,76,0.15)_75%),linear-gradient(-45deg,transparent_75%,rgba(253,231,76,0.15)_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px] cursor-crosshair"
                }
              >
                <input
                  ref={fileInputRef}
                  id="image-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Moldura */}
                <div
                  className={
                    "absolute inset-4 rounded-xl border-2 transition-colors " +
                    (isDragging ? "border-amber-400 bg-amber-50/40" : "border-amber-200 bg-white/70")
                  }
                />

                {/* Conteúdo */}
                {uploadedImage ? (
                  <div className="relative z-10 w-full h-full p-4 md:p-6 flex items-center justify-center">
                    <div
                      ref={previewRef}
                      className="relative h-[66vh] w-auto bg-white rounded-xl overflow-hidden shadow"
                      style={{ aspectRatio: (aiResultUrl && resultMeta) ? `${resultMeta.width} / ${resultMeta.height}` : (imageMeta ? `${imageMeta.width} / ${imageMeta.height}` : '16 / 9') }}
                      onMouseDown={onPreviewMouseDown}
                      onMouseMove={onPreviewMouseMove}
                      onMouseUp={onPreviewMouseUp}
                    >
                      <img
                        src={uploadedImage}
                        alt="Preview do ambiente"
                        className="w-full h-full object-contain bg-white select-none"
                        draggable={false}
                      />

                      {/* ROI tint com blend */}
                      {roi && (
                        <div
                          className="absolute pointer-events-none"
                          style={{
                            left: `${Math.min(roi.x0, roi.x1) * 100}%`,
                            top: `${Math.min(roi.y0, roi.y1) * 100}%`,
                            width: `${Math.abs(roi.x1 - roi.x0) * 100}%`,
                            height: `${Math.abs(roi.y1 - roi.y0) * 100}%`,
                            // Substitui tinta/blend por contorno apenas, sem alteração visual da imagem
                            backgroundColor: 'transparent',
                            border: '2px dashed rgba(0,0,0,0.4)'
                          }}
                        />
                      )}
                      {aiResultUrl && (
                        <img
                          src={aiResultUrl}
                          alt="Resultado IA"
                          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${aiUpgraded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                          draggable={false}
                          style={{ pointerEvents: 'none' }}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 text-center px-6 py-10 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                    <p className="text-slate-700 font-medium">Arraste e solte sua imagem aqui</p>
                    <p className="text-xs text-slate-500 mt-1">ou clique/cole (PNG, JPEG, WebP · até 8MB)</p>
                  </div>
                )}

                {isDragging && <div className="absolute inset-0 bg-amber-100/40 pointer-events-none" />}
              </div>

              {/* Controles de blend/opacity */}
              <div className="flex items-center justify-between gap-4 px-4 py-3 border-t border-amber-200/60 bg-white">
                <div className="flex items-center gap-2 text-slate-700">
                  <Blend className="h-5 w-5 text-amber-600" />
                  <span className="text-sm">Realce</span>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={blendMode}
                    onChange={(e) => setBlendMode(e.target.value as any)}
                    className="px-2 py-1.5 border border-amber-200 rounded-md text-sm"
                  >
                    <option value="multiply">Multiply</option>
                    <option value="overlay">Overlay</option>
                    <option value="normal">Normal</option>
                  </select>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-600">Opacidade</span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={tintOpacity}
                      onChange={(e) => setTintOpacity(parseFloat(e.target.value))}
                    />
                    <span className="w-10 text-right tabular-nums">{Math.round(tintOpacity * 100)}%</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Coluna Direita: Paleta + Ações */}
            <section className="space-y-6 order-3">
              {/* Paleta de Cores */}
              <div className="bg-white rounded-2xl border border-amber-200 ring-1 ring-amber-200/60 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="h-5 w-5 text-amber-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Paleta de Cores</h3>
                </div>

                <div className="grid grid-cols-6 gap-3">
                  {PALETTE.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => {
                        setSelectedColor(c.hex);
                        setProjectData((prev) => ({ ...prev, primaryColor: c.hex }));
                      }}
                      className={`relative h-10 w-10 rounded-full border transition-all ${
                        selectedColor === c.hex ? "ring-2 ring-amber-500 border-amber-300" : "border-amber-200 hover:border-amber-300"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      aria-label={c.name}
                      title={`${c.name} (${c.hex})`}
                    >
                      {selectedColor === c.hex && (
                        <Check className="absolute -right-1 -bottom-1 h-4 w-4 text-amber-700 bg-white/90 rounded-full p-0.5" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-4 text-sm text-slate-600">
                  Cor selecionada: <span className="font-medium" style={{ color: selectedColor }}>{selectedColor}</span>
                </div>
              </div>

              {/* Ações */}
              <div className="bg-white rounded-2xl border border-amber-200 ring-1 ring-amber-200/60 shadow-sm p-6 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Formato de saída</label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value as 'webp' | 'jpeg' | 'png')}
                    className="w-full px-3 py-2 border border-amber-200 rounded-md text-sm"
                  >
                    <option value="webp">WEBP (recomendado)</option>
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-1">WEBP: menor tamanho e alta qualidade. JPEG: fotos. PNG: transparência.</p>
                </div>
                <button
                  onClick={handleUpgradeRealista}
                  disabled={!canUpgradeIA || isUpgrading}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpgrading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/80 border-t-transparent"></div>
                      <span>Processando…</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Upgrade Realista (IA)
                    </>
                  )}
                </button>

                <button
                  onClick={handleCreateProject}
                  disabled={!canContinue || isCreating}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-amber-200 text-slate-800 font-semibold hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600 border-t-transparent"></div>
                      <span>Criando…</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5" />
                      Continuar para o Editor
                    </>
                  )}
                </button>

                <button
                  onClick={resetPaint}
                  disabled={!roi && !selectionPoint}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-slate-700 hover:text-slate-900"
                >
                  <RefreshCw className="h-5 w-5" />
                  Resetar pintura
                </button>

                <div className="text-xs text-slate-500 pt-1">
                  Requisitos: defina ROI e cor para habilitar o Upgrade IA.
                </div>
              </div>

              <div className="flex items-center justify-center">
                <button onClick={() => navigate("/studio")} className="text-slate-600 hover:text-slate-900">Cancelar</button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
