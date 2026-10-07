import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Upload, 
  Palette, 
  Droplets, 
  Download, 
  Save, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Move,
  Square,
  Circle,
  Type,
  Share2,
  Heart,
  Camera
} from 'lucide-react';
import { ProductService } from '../services/productService';
import { supabase } from '../lib/supabaseClient';
import type { Color } from '../services/productService';

import { SiteFooter } from '../components/SiteFooter';

export default function ColorSimulator() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [colors, setColors] = useState<Color[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [tool, setTool] = useState<'brush' | 'fill'>('brush');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isLiked, setIsLiked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Carregar cores disponíveis
  React.useEffect(() => {
    const fetchColors = async () => {
      try {
        const colorData = await ProductService.getColors();
        setColors(colorData);
        if (colorData.length > 0) {
          setSelectedColor(colorData[0]);
        }
      } catch (error) {
        console.error('Erro ao carregar cores:', error);
      }
    };

    fetchColors();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          resetCanvas();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetCanvas = () => {
    setZoomLevel(100);
    setIsDrawing(false);
    setTool('brush');
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedColor) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (tool === 'brush') {
      drawOnCanvas(ctx, x, y);
    } else if (tool === 'fill') {
      fillCanvas(ctx);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !selectedColor) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (tool === 'brush') {
      drawOnCanvas(ctx, x, y);
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };

  const drawOnCanvas = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    if (!selectedColor) return;
    
    ctx.fillStyle = selectedColor.hex_code;
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const fillCanvas = (ctx: CanvasRenderingContext2D) => {
    if (!selectedColor) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    ctx.fillStyle = selectedColor.hex_code;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };

  const handleReset = () => {
    resetCanvas();
    setSelectedImage(null);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'simulacao-tintas-zanai.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="min-h-screen bg-background">
      
      {/* HeroSection com imagem de tintas e pouca altura */}
      <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-2">Simulador de Cores</h1>
            <p className="text-lg text-white/90">
              Experimente diferentes cores da ProRevest em sua imagem
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Painel de Cores */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Palette className="mr-2 h-5 w-5 text-primary" />
                Paleta de Cores
              </h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Tamanho do Pincel</label>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  value={brushSize} 
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm mt-1">{brushSize}px</div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Ferramentas</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setTool('brush')}
                    className={`p-3 rounded-lg flex flex-col items-center justify-center transition-colors ${
                      tool === 'brush' 
                        ? 'bg-blue-900 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <Circle className="h-5 w-5" />
                    <span className="text-xs mt-1">Pincel</span>
                  </button>
                  <button
                    onClick={() => setTool('fill')}
                    className={`p-3 rounded-lg flex flex-col items-center justify-center transition-colors ${
                      tool === 'fill' 
                        ? 'bg-blue-900 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <Square className="h-5 w-5" />
                    <span className="text-xs mt-1">Preencher</span>
                  </button>
                  <button
                    onClick={() => setTool('fill')}
                    className={`p-3 rounded-lg flex flex-col items-center justify-center transition-colors ${
                      tool === 'fill' 
                        ? 'bg-blue-900 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <Type className="h-5 w-5" />
                    <span className="text-xs mt-1">Conta Gotas</span>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Cores Disponíveis</label>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`aspect-square rounded-lg border-2 transition-all ${
                        selectedColor?.id === color.id 
                          ? 'border-primary ring-2 ring-primary/30' 
                          : 'border-border'
                      }`}
                      style={{ backgroundColor: color.hex_code }}
                      title={color.name}
                    />
                  ))}
                </div>
                
                {selectedColor && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center">
                      <div 
                        className="w-8 h-8 rounded-md mr-3 border border-border"
                        style={{ backgroundColor: selectedColor.hex_code }}
                      />
                      <div>
                        <div className="font-medium">{selectedColor.name}</div>
                        <div className="text-sm text-muted-foreground">{selectedColor.hex_code}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Controles de Ação */}
            <div className="bg-card rounded-xl shadow-lg p-6 border border-border mt-6">
              <h2 className="text-xl font-bold mb-4">Ações</h2>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleSave}
                  className="flex flex-col items-center justify-center p-4 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <Download className="h-5 w-5" />
                  <span className="text-sm mt-1">Salvar</span>
                </button>
                
                <button
                  onClick={handleLike}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
                    isLiked 
                      ? 'bg-red-600 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm mt-1">Curtir</span>
                </button>
                
                <button
                  onClick={handleReset}
                  className="flex flex-col items-center justify-center p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <RotateCcw className="h-5 w-5" />
                  <span className="text-sm mt-1">Resetar</span>
                </button>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <Upload className="h-5 w-5" />
                  <span className="text-sm mt-1">Nova Imagem</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Área de Visualização */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
              {/* Controles do Canvas */}
              <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleZoomOut}
                    className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-medium">{zoomLevel}%</span>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors">
                    <Move className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Canvas Area */}
              <div className="p-4 bg-muted/30 min-h-[500px] flex items-center justify-center relative">
                {selectedImage ? (
                  <div className="relative">
                    <img 
                      src={selectedImage} 
                      alt="Imagem para simulação" 
                      className="max-w-full max-h-[70vh] object-contain"
                      style={{ transform: `scale(${zoomLevel / 100})` }}
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute top-0 left-0 w-full h-full cursor-crosshair"
                      onMouseDown={handleCanvasMouseDown}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={handleCanvasMouseUp}
                      onMouseLeave={handleCanvasMouseUp}
                    />
                  </div>
                ) : (
                  <div className="text-center p-12">
                    <div className="mx-auto bg-muted rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Nenhuma imagem selecionada</h3>
                    <p className="text-muted-foreground mb-6">
                      Faça upload de uma imagem para começar a simular cores
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                    >
                      Escolher Imagem
                    </button>
                  </div>
                )}
              </div>
              
              {/* Upload de Imagem */}
              <div className="p-4 border-t border-border">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload de Imagem
                </button>
              </div>
            </div>
            
            {/* Informações do Produto */}
            {selectedColor && (
              <div className="bg-card rounded-xl shadow-lg p-6 border border-border mt-6">
                <h2 className="text-xl font-bold mb-4">Sobre a Cor</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Nome</h3>
                    <p>{selectedColor.name}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Código HEX</h3>
                    <p>{selectedColor.hex_code}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Código RAL</h3>
                    <p>{selectedColor.ral_code || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Produtos com esta cor</h3>
                  <div className="flex space-x-4 overflow-x-auto py-2">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex-shrink-0 w-32">
                        <div className="bg-muted rounded-lg h-20 mb-2" />
                        <div className="text-sm font-medium">Tinta Acrílica</div>
                        <div className="text-xs text-muted-foreground">Satinada</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <Link 
                    to={`/produto/tinta-${selectedColor.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                  >
                    Ver Produto
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}