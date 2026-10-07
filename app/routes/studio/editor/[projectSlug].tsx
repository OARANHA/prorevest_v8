import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { Layout } from "../../../components/Layout";
import RequireAuth from "../../../components/auth/RequireAuth";
import { ArrowLeft, Save, Upload, Palette, Settings, Download, Eye, EyeOff, Layers, Wand2, Image as ImageIcon } from "lucide-react";
import { productService } from "../../../services/productService";
import aiService from "../../../services/aiService";

interface StudioProject {
  id: string;
  name: string;
  roomType: string;
  description: string;
  style: string;
  image: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface WallSelection {
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
  color: string;
}

export default function StudioEditor() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { projectSlug } = useParams();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Estados do projeto
  const [project, setProject] = useState<StudioProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados do canvas e edição
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedWall, setSelectedWall] = useState<WallSelection | null>(null);
  const [wallColors, setWallColors] = useState<Map<string, string>>(new Map());
  const [showGrid, setShowGrid] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(50);
  const [currentColor, setCurrentColor] = useState("#FF6B6B");
  
  // Estados da paleta de cores
  const [colors, setColors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showColorPanel, setShowColorPanel] = useState(true);
  
  // Estados da IA
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  
  // Estados do slider de comparação
  const [showComparison, setShowComparison] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Mock data para o projeto
  const mockProject: StudioProject = {
    id: "1",
    name: "Sala de Estar Moderna",
    roomType: "sala-estar",
    description: "Design contemporâneo com cores neutras e detalhes em madeira",
    style: "moderno",
    image: "https://images.unsplash.com/photo-15569095763-2a9b0d3b1e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D3DWx0h&auto=format&fit=crop&w=800&q=80",
    user_id: user?.id || "user-123",
    status: "draft",
    created_at: "2023-12-01T10:00:00Z",
    updated_at: "2023-12-01T10:00:00Z"
  };

  // Mock colors para a paleta
  const mockColors = [
    { id: "1", name: "Branco Suave", hex_code: "#F5F5F5", category: "Neutras" },
    { id: "2", name: "Azul Claro", hex_code: "#87CEEB", category: "Claras" },
    { id: "3", name: "Cinza Claro", hex_code: "#E0E0E0", category: "Claras" },
    { id: "4", name: "Bege Claro", hex_code: "#F5DEB3", category: "Claras" },
    { id: "5", name: "Cinza Escuro", hex_code: "#4A4A4A", category: "Escuras" },
    { id: "6", name: "Azul Escuro", hex_code: "#1E3A8A", category: "Escuras" },
    { id: "7", name: "Verde Floresta", hex_code: "#228B22", category: "Naturais" },
    { id: "8", name: "Terracota", hex_code: "#E2725B", category: "Terra" },
    { id: "9", name: "Coral", hex_code: "#FF7F50", category: "Vibrantes" },
    { id: "10", name: "Lavanda", hex_code: "#E6E6FA", category: "Vibrantes" }
  ];

  useEffect(() => {
    loadProject();
    loadColors();
  }, [projectSlug]);

  useEffect(() => {
    if (project?.image && canvasRef.current) {
      loadImage(project.image);
    }
  }, [project?.image]);

  const loadProject = async () => {
    try {
      // Verificar se temos um projectSlug válido
      if (!projectSlug || projectSlug === "") {
        // Se não houver slug, criar um projeto padrão
        console.log("Nenhum projectSlug fornecido, usando projeto padrão");
        setProject({
          ...mockProject,
          name: "Projeto Padrão"
        });
        setLoading(false);
        return;
      }
      
      console.log("Carregando projeto com slug:", projectSlug);
      
      // Tentar recuperar dados do localStorage primeiro
      try {
        const savedProject = localStorage.getItem('studioProject');
        const savedImage = localStorage.getItem('studioProjectImage');

        if (savedProject) {
          console.log("Projeto encontrado no localStorage");
          const parsedProject = JSON.parse(savedProject);
          const image = savedImage || parsedProject?.image;

          if (image) {
            const loadedProject = {
              ...parsedProject,
              image
            };

            console.log("Projeto carregado do localStorage:", loadedProject);
            setProject(loadedProject);
            setLoading(false);
            return;
          } else {
            console.warn("Projeto no localStorage não contém imagem; caindo para mock.");
          }
        }
      } catch (error) {
        console.log("Erro ao ler localStorage, usando mock:", error);
      }
      
      // Se não encontrar no localStorage, usar mock
      setTimeout(() => {
        // Para demonstração, vamos usar o mockProject
        // Em produção, você buscaria o projeto baseado no slug
        const loadedProject = {
          ...mockProject,
          name: `Projeto: ${projectSlug}`,
          image: mockProject.image // Usar imagem mock
        };
        
        console.log("Projeto carregado (mock):", loadedProject);
        setProject(loadedProject);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Erro ao carregar projeto:", error);
      setLoading(false);
    }
  };

  const loadColors = async () => {
    try {
      // Carregar cores mockadas
      setColors(mockColors);
      
      // Simular carregamento de categorias
      const mockCategories = Array.from(new Set(mockColors.map(c => c.category)))
        .map(cat => ({ value: cat.toLowerCase(), name: cat }));
      setCategories(mockCategories);
    } catch (error) {
      console.error("Erro ao carregar cores:", error);
    }
  };

  const loadImage = (imageUrl: string) => {
    const img = new Image();
    
    img.onload = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        
        // Definir tamanho do canvas
        const maxWidth = 1200;
        const maxHeight = 800;
        
        let width = img.width;
        let height = img.height;
        
        // Redimensionar se necessário
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Salvar imagem original para comparação
        setOriginalImage(imageUrl);
        
        // Desenhar imagem
        ctx.drawImage(img, 0, 0, width, height);
        
        // Desenhar grid se necessário
        if (showGrid) {
          drawGrid(ctx, width, height);
        }
        
        imageRef.current = img;
        setImageLoaded(true);
      }
    };
    
    img.onerror = () => {
      console.error("Erro ao carregar imagem:", imageUrl);
      setImageLoaded(true);
    };
    
    img.src = imageUrl;
  };

  // Componente de comparação antes/depois
  const ComparisonSlider = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setSliderPosition(Math.max(0, Math.min(100, percentage)));
    };

    const handleMouseDown = () => {
      setIsDragging(true);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    useEffect(() => {
      const handleGlobalMouseUp = () => {
        setIsDragging(false);
      };

      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (isDragging && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const percentage = (x / rect.width) * 100;
          setSliderPosition(Math.max(0, Math.min(100, percentage)));
        }
      };

      if (isDragging) {
        document.addEventListener('mouseup', handleGlobalMouseUp);
        document.addEventListener('mousemove', handleGlobalMouseMove);
      }

      return () => {
        document.removeEventListener('mouseup', handleGlobalMouseUp);
        document.removeEventListener('mousemove', handleGlobalMouseMove);
      };
    }, [isDragging]);

    if (!originalImage || !uploadedImage) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Comparação: Antes e Depois</h3>
            <button
              onClick={() => setShowComparison(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕ Fechar
            </button>
          </div>
          
          <div 
            ref={containerRef}
            className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden cursor-ew-resize"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            {/* Imagem Antes (Original) */}
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${sliderPosition}% 0 0)` }}
            >
              <img
                src={originalImage}
                alt="Antes"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Imagem Depois (Editada) */}
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 0 0 ${100 - sliderPosition}% 0)` }}
            >
              {canvasRef.current && (
                <img
                  src={canvasRef.current.toDataURL()}
                  alt="Depois"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            {/* Linha do Slider */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-3 h-3 bg-white rounded-full shadow-lg"></div>
              </div>
            </div>
            
            {/* Labels */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
              <span className="text-sm font-medium">Antes</span>
            </div>
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
              <span className="text-sm font-medium">Depois</span>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Arraste o slider para comparar antes e depois • {Math.round(sliderPosition)}% antes / {100 - Math.round(sliderPosition)}% depois
            </p>
          </div>
        </div>
      </div>
    );
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 20;
    ctx.strokeStyle = "rgba(200, 200, 200, 0.3)";
    ctx.lineWidth = 1;
    
    // Linhas verticais
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Linhas horizontais
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !imageLoaded) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Verificar se está clicando em uma parede (implementar detecção de paredes)
    const wallId = detectWallAt(x, y);
    
    if (wallId) {
      // Selecionar ou pintar a parede
      if (isDrawing) {
        paintWall(wallId, x, y);
      } else {
        selectWall(wallId, x, y);
      }
    }
  };

  const detectWallAt = (x: number, y: number): string => {
    // Lógica simplificada para detectar paredes
    // Em uma implementação real, isso usaria IA para identificar paredes
    const canvas = canvasRef.current;
    if (!canvas) return "";
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Análise simples de pixels para determinar se é uma parede
    // Esta é uma implementação básica - a versão real usaria Google Gemini
    const pixelData = imageData.data;
    const index = (y * canvas.width + x) * 4;
    
    const r = pixelData[index];
    const g = pixelData[index + 1];
    const b = pixelData[index + 2];
    
    // Lógica simplificada para detectar superfícies que parecem paredes
    // (baseado em análise de cor e textura)
    if (isWallSurface(r, g, b)) {
      return `wall-${Math.floor(x / 100)}-${Math.floor(y / 100)}`;
    }
    
    return "";
  };

  const isWallSurface = (r: number, g: number, b: number): boolean => {
    // Lógica simplificada para detectar superfícies de parede
    // Em uma implementação real, isso seria muito mais sofisticado
    const brightness = (r + g + b) / 3;
    const variance = Math.sqrt(
      Math.pow(r - brightness, 2) + 
      Math.pow(g - brightness, 2) + 
      Math.pow(b - brightness, 2)
    );
    
    // Superfícies com baixa variação tendem a ser paredes pintadas
    // Superfícies muito variadas (variancia alta) tendem a ser objetos/texturas
    return variance < 30 && brightness > 50 && brightness < 200;
  };

  const selectWall = (wallId: string, x: number, y: number) => {
    const wall: WallSelection = {
      x: x - 25,
      y: y - 25,
      width: 50,
      height: 50,
      id: wallId,
      color: wallColors.get(wallId) || "#FFFFFF"
    };
    
    setSelectedWall(wall);
    setIsDrawing(true);
  };

  const paintWall = (wallId: string, x: number, y: number) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Pintar a área da parede
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = currentColor;
    ctx.fillRect(x - brushSize/2, y - brushSize/2, brushSize, brushSize);
    ctx.globalAlpha = 1.0;
    
    // Salvar a cor da parede
    setWallColors(prev => new Map(prev).set(wallId, currentColor));
    
    // Redesenhar
    redrawCanvas();
  };

  const redrawCanvas = () => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Redesenhar imagem base
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
    
    // Redesenhar grid se necessário
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }
    
    // Redesenhar paredes coloridas
    wallColors.forEach((color, wallId) => {
      const wallData = parseWallId(wallId);
      if (wallData) {
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = color;
        ctx.fillRect(wallData.x, wallData.y, wallData.width, wallData.height);
        ctx.globalAlpha = 1.0;
      }
    });
    
    // Desenhar seleção atual
    if (selectedWall) {
      ctx.strokeStyle = "#2563EB";
      ctx.lineWidth = 2;
      ctx.strokeRect(selectedWall.x - 1, selectedWall.y - 1, selectedWall.width + 2, selectedWall.height + 2);
    }
  };

  const parseWallId = (wallId: string): { x: number; y: number; width: number; height: number } | null => {
    try {
      const parts = wallId.split('-');
      if (parts.length === 4 && parts[0] === 'wall') {
        return {
          x: parseInt(parts[1]) * 100,
          y: parseInt(parts[2]) * 100,
          width: 100,
          height: 100
        };
      }
    } catch (error) {
      console.error("Erro ao parse wallId:", error);
    }
    return null;
  };

  const handleColorSelect = (color: any) => {
    setCurrentColor(color.hex_code);
    if (selectedWall) {
      paintWall(selectedWall.id, selectedWall.x + 25, selectedWall.y + 25);
    }
  };

  const processWithAI = async () => {
    if (!project?.image || !canvasRef.current) return;
    
    setIsAIProcessing(true);
    
    try {
      console.log("🤖 Iniciando análise de IA automática...");
      
      // Validar imagem primeiro
      const validation = await aiService.validateImage(project.image);
      
      if (!validation.appropriate) {
        console.warn("⚠️ Imagem contém elementos inapropriados:", validation.issues);
        alert("Esta imagem contém elementos que não podem ser usados em projetos comerciais. Por favor, selecione outra imagem do ambiente.");
        setIsAIProcessing(false);
        return;
      }
      
      // Analisar imagem com IA
      const analysis = await aiService.analyzeImage(project.image, project.style);
      
      console.log("✅ Análise de IA concluída:", analysis);
      
      // Se houver objetos a remover, limpar a imagem
      let finalImageUrl = project.image;
      if (analysis.removedObjects.length > 0) {
        console.log("🔄 Removendo objetos inapropriados:", analysis.removedObjects);
        finalImageUrl = await aiService.cleanImage(project.image);
      }
      
      // Carregar imagem processada no canvas
      if (finalImageUrl !== project.image) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            if (canvasRef.current && imageRef.current) {
              const canvas = canvasRef.current;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                // Limpar canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Desenhar imagem processada
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // Desenhar grid se necessário
                if (showGrid) {
                  drawGrid(ctx, canvas.width, canvas.height);
                }
                
                // Atualizar referência da imagem
                imageRef.current = img;
                setUploadedImage(finalImageUrl);
              }
            }
            resolve();
          };
          img.onerror = () => resolve();
          img.src = finalImageUrl;
        });
      }
      
      // Processar sugestões de cores da IA
      const aiColorSuggestions = analysis.colorSuggestions.map((color, index) => ({
        id: `ai-suggestion-${index}`,
        name: color.name,
        hex_code: color.hexCode,
        category: color.category,
        description: color.description
      }));
      
      setAiSuggestions(aiColorSuggestions);
      setShowAISuggestions(true);
      
      // Mostrar feedback ao usuário
      if (analysis.removedObjects.length > 0) {
        alert(`✅ IA processou sua imagem com sucesso!\n\n🔹 Objetos removidos: ${analysis.removedObjects.join(", ")}\n🎨 ${aiColorSuggestions.length} sugestões de cores geradas\n\nAgora você pode usar as cores sugeridas para transformar seu ambiente!`);
      } else {
        alert(`✅ IA analisou sua imagem com sucesso!\n\n🎨 Encontramos ${aiColorSuggestions.length} sugestões de cores perfeitas para o estilo "${project.style}"\n\nClique nas cores sugeridas para aplicá-las nas paredes!`);
      }
      
    } catch (error) {
      console.error("❌ Erro ao processar com IA:", error);
      alert("Ocorreu um erro ao processar sua imagem com IA. Por favor, tente novamente.");
    } finally {
      setIsAIProcessing(false);
    }
  };

  const generateAISuggestions = () => {
    // Simular sugestões da IA baseadas no estilo do projeto
    const styleSuggestions = {
      moderno: ["#FFFFFF", "#F5F5F5", "#E8E8E8", "#D3D3D3", "#C0C0C0"],
      rustico: ["#8B4513", "#A0522D", "#CD853F", "#DEB887", "#F4A460"],
      classico: ["#1E3A8A", "#2C3E50", "#34495E", "#4A5568", "#5D6D7E"],
      industrial: ["#2F4F4F", "#37474F", "#455A64", "#546E7A", "#607D8B"],
      minimalista: ["#FFFFFF", "#F8F9FA", "#E9ECEF", "#DEE2E6", "#CED4DA"],
      bohemio: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#66D9EF", "#764BA2"],
      escandinavo: ["#FFFFFF", "#F8F9FA", "#E3F2FD", "#BBDEFB", "#90CAF9"],
      mediterraneo: ["#D2B48C", "#C8E6C9", "#A8DADC", "#7FB3D5", "#4CAF50"]
    };
    
    const suggestions = styleSuggestions[project?.style as keyof typeof styleSuggestions] || [];
    
    return suggestions.slice(0, 5).map((color, index) => ({
      id: `ai-suggestion-${index}`,
      name: `Sugestão ${index + 1}`,
      hex_code: color,
      category: "IA Sugerida",
      description: "Cor recomendada pela IA"
    }));
  };

  const handleSaveProject = async () => {
    if (!project) return;
    
    setIsSaving(true);
    
    try {
      // Simular salvamento do projeto
      console.log("Salvando projeto:", {
        ...project,
        wallColors: Array.from(wallColors.entries()),
        colors: colors,
        status: "saved",
        updated_at: new Date().toISOString()
      });
      
      // Simular delay
      setTimeout(() => {
        setIsSaving(false);
        alert("Projeto salvo com sucesso!");
        
        // Integrar com sistema de orçamentos
        generateQuote();
      }, 1000);
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
      setIsSaving(false);
      alert("Erro ao salvar projeto. Tente novamente.");
    }
  };

  const generateQuote = () => {
    // Integrar com sistema de orçamentos existente
    const quoteData = {
      customer_name: user?.email || "Usuário Studio",
      customer_email: user?.email || "",
      customer_phone: "",
      notes: `Projeto: ${project?.name}\nEstilo: ${project?.style}\nCores selecionadas: ${wallColors.size} paredes`,
      items: Array.from(wallColors.entries()).map(([wallId, color]) => ({
        quote_id: "",
        variant_id: "", // ID do produto do catálogo
        quantity: 1,
        price_at_time: 0 // Preço do produto no momento
      })),
      subtotal: 0,
      discount: 0,
      total: 0
    };
    
    console.log("Dados do orçamento:", quoteData);
    
    // Aqui seria a integração com o QuoteService existente
    // QuoteService.createQuote(quoteData);
    
    alert("Orçamento gerado com sucesso! Você receberá os detalhes por e-mail.");
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `${project?.name || 'studio-project'}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (loading) {
    return (
      <RequireAuth>
        <Layout showHeaderFooter={true}>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary border-t-transparent mb-4"></div>
              <p className="text-muted-foreground">Carregando Studio ProRevest...</p>
            </div>
          </div>
        </Layout>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <Layout showHeaderFooter={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => navigate("/studio")}
                  className="text-gray-600 hover:text-gray-900 flex items-center"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Voltar
                </button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {project?.name || "Editor Studio"}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {project?.roomType && `(${project.roomType})`} • {project?.style}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSaveProject}
                  disabled={isSaving}
                  className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {isSaving ? "Salvando..." : "Salvar"}
                </button>
                
                <button
                  onClick={handleDownload}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Baixar
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Barra de Ferramentas Lateral */}
          <div className="w-20 bg-white border-r border-gray-200 shadow-sm p-4">
            <div className="space-y-4">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                  showGrid ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title={showGrid ? "Ocultar Grade" : "Mostrar Grade"}
              >
                <Layers className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setIsDrawing(!isDrawing)}
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                  isDrawing ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title={isDrawing ? "Parar de Pintar" : "Iniciar Pintura"}
              >
                <Palette className="h-5 w-5" />
              </button>
              
              <button
                onClick={processWithAI}
                disabled={isAIProcessing}
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                  isAIProcessing ? "bg-purple-600 text-white animate-pulse" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title="Sugestões de IA"
              >
                <Wand2 className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setShowColorPanel(!showColorPanel)}
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                  showColorPanel ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title={showColorPanel ? "Ocultar Cores" : "Mostrar Cores"}
              >
                <Palette className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setShowComparison(true)}
                className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                title="Comparar Antes e Depois"
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center bg-gray-100 p-8">
            <div className="relative">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                onMouseMove={(e) => {
                  if (isDrawing && selectedWall) {
                    const canvas = canvasRef.current;
                    if (!canvas) return;
                    
                    const rect = canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    paintWall(selectedWall.id, x, y);
                  }
                }}
                className="border-2 border-gray-300 rounded-lg shadow-lg cursor-crosshair bg-white"
              />
              
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Carregando imagem...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Painel de Cores */}
          {showColorPanel && (
            <div className="w-80 bg-white border-l border-gray-200 shadow-sm p-4 overflow-y-auto">
              <h3 className="font-semibold text-gray-900 mb-4">Paleta de Cores</h3>
              
              {/* Sugestões da IA */}
              {showAISuggestions && aiSuggestions.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-purple-600 mb-3 flex items-center">
                    <Wand2 className="h-4 w-4 mr-2" />
                    Sugestões da IA
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {aiSuggestions.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => handleColorSelect(color)}
                        className="p-2 border border-purple-200 rounded-lg hover:border-purple-400 transition-colors"
                        title={color.description}
                      >
                        <div
                          className="w-full h-8 rounded border border-gray-300"
                          style={{ backgroundColor: color.hex_code }}
                        />
                        <p className="text-xs text-gray-600 mt-1 truncate">{color.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Controle do Pincel */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Tamanho do Pincel</h4>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>10px</span>
                  <span>{brushSize}px</span>
                  <span>100px</span>
                </div>
              </div>
              
              {/* Cor Atual */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Cor Atual</h4>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-12 h-12 rounded border-2 border-gray-300"
                    style={{ backgroundColor: currentColor }}
                  />
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    className="h-12 w-12 rounded border-2 border-gray-300 cursor-pointer"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">{currentColor}</p>
              </div>
              
              {/* IA Automática */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Análise de IA Automática</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-2">
                    🤖 IA analisará sua imagem e removerá objetos inapropriados
                  </p>
                  <button
                    onClick={processWithAI}
                    disabled={isAIProcessing}
                    className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {isAIProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white border-t-transparent mr-2"></div>
                        Analisando Imagem...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Analisar com IA
                      </>
                    )}
                  </button>
                  {aiSuggestions.length > 0 && (
                    <p className="text-xs text-green-600 mt-2">
                      ✅ IA encontrou {aiSuggestions.length} sugestões de cores
                    </p>
                  )}
                </div>
              </div>
              
              {/* Paleta de Cores */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Cores Disponíveis</h4>
                <div className="grid grid-cols-3 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => handleColorSelect(color)}
                      className="group relative"
                      title={color.name}
                    >
                      <div
                        className="w-full h-10 rounded border-2 border-gray-300 group-hover:border-primary transition-colors"
                        style={{ backgroundColor: color.hex_code }}
                      />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de Comparação */}
      {showComparison && <ComparisonSlider />}
      </Layout>
    </RequireAuth>
  );
}
