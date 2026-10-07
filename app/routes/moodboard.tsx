import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Palette, 
  Image, 
  Text, 
  Move, 
  Trash2, 
  Download, 
  Share2, 
  Heart, 
  Lock, 
  Unlock,
  Users,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

type MoodboardItem = {
  id: string;
  type: 'color' | 'image' | 'text';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
};

type Moodboard = {
  id: string;
  name: string;
  isPublic: boolean;
  isCollaborative: boolean;
  items: MoodboardItem[];
};

export default function CollaborativeMoodboard() {
  const [moodboards, setMoodboards] = useState<Moodboard[]>([
    {
      id: '1',
      name: 'Projeto Sala Moderna',
      isPublic: true,
      isCollaborative: true,
      items: [
        {
          id: '1',
          type: 'color',
          content: '#FF6B6B',
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          rotation: 0,
          zIndex: 1
        },
        {
          id: '2',
          type: 'color',
          content: '#4ECDC4',
          x: 250,
          y: 150,
          width: 100,
          height: 100,
          rotation: 0,
          zIndex: 2
        }
      ]
    }
  ]);
  
  const [activeMoodboard, setActiveMoodboard] = useState<Moodboard>(moodboards[0]);
  const [selectedTool, setSelectedTool] = useState<'select' | 'color' | 'image' | 'text'>('select');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState('#FF6B6B');
  const [isLiked, setIsLiked] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
  
  const moodboardRef = useRef<HTMLDivElement>(null);

  const addColorToMoodboard = () => {
    if (!activeMoodboard) return;
    
    const newItem: MoodboardItem = {
      id: Date.now().toString(),
      type: 'color',
      content: newColor,
      x: 200,
      y: 200,
      width: 100,
      height: 100,
      rotation: 0,
      zIndex: Math.max(...activeMoodboard.items.map(i => i.zIndex), 0) + 1
    };
    
    const updatedMoodboard = {
      ...activeMoodboard,
      items: [...activeMoodboard.items, newItem]
    };
    
    setActiveMoodboard(updatedMoodboard);
    setMoodboards(moodboards.map(m => m.id === activeMoodboard.id ? updatedMoodboard : m));
  };

  const updateItemPosition = (itemId: string, x: number, y: number) => {
    if (!activeMoodboard) return;
    
    const updatedItems = activeMoodboard.items.map(item => 
      item.id === itemId ? { ...item, x, y } : item
    );
    
    const updatedMoodboard = {
      ...activeMoodboard,
      items: updatedItems
    };
    
    setActiveMoodboard(updatedMoodboard);
    setMoodboards(moodboards.map(m => m.id === activeMoodboard.id ? updatedMoodboard : m));
  };

  const deleteItem = (itemId: string) => {
    if (!activeMoodboard) return;
    
    const updatedItems = activeMoodboard.items.filter(item => item.id !== itemId);
    const updatedMoodboard = {
      ...activeMoodboard,
      items: updatedItems
    };
    
    setActiveMoodboard(updatedMoodboard);
    setMoodboards(moodboards.map(m => m.id === activeMoodboard.id ? updatedMoodboard : m));
    setSelectedItem(null);
  };

  const handleMouseDown = (e: React.MouseEvent, itemId: string) => {
    if (selectedTool !== 'select') return;
    
    e.preventDefault();
    setSelectedItem(itemId);
    
    const item = activeMoodboard.items.find(i => i.id === itemId);
    if (!item || !moodboardRef.current) return;
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startItemX = item.x;
    const startItemY = item.y;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!moodboardRef.current) return;
      
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      updateItemPosition(
        itemId,
        startItemX + deltaX,
        startItemY + deltaY
      );
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const saveMoodboard = () => {
    // Lógica para salvar o moodboard
    console.log('Moodboard salvo:', activeMoodboard);
  };

  const exportMoodboard = () => {
    // Lógica para exportar o moodboard
    console.log('Moodboard exportado');
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const togglePrivacy = () => {
    if (!activeMoodboard) return;
    
    const updatedMoodboard = {
      ...activeMoodboard,
      isPublic: !activeMoodboard.isPublic
    };
    
    setActiveMoodboard(updatedMoodboard);
    setMoodboards(moodboards.map(m => m.id === activeMoodboard.id ? updatedMoodboard : m));
  };

  const toggleCollaboration = () => {
    if (!activeMoodboard) return;
    
    const updatedMoodboard = {
      ...activeMoodboard,
      isCollaborative: !activeMoodboard.isCollaborative
    };
    
    setActiveMoodboard(updatedMoodboard);
    setMoodboards(moodboards.map(m => m.id === activeMoodboard.id ? updatedMoodboard : m));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Moodboard Colaborativo</h1>
              <p className="text-lg text-muted-foreground">
                Crie e compartilhe paletas de cores com sua equipe
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={saveMoodboard}
                className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Save className="h-5 w-5 mr-2" />
                Salvar
              </button>
              
              <button
                onClick={exportMoodboard}
                className="flex items-center px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
              >
                <Download className="h-5 w-5 mr-2" />
                Exportar
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Painel de Controle */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl shadow-lg p-6 border border-border mb-6">
              <h2 className="text-xl font-bold mb-4">Ferramentas</h2>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setSelectedTool('select')}
                  className={`p-4 rounded-lg flex flex-col items-center justify-center transition-colors ${
                    selectedTool === 'select' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <Move className="h-5 w-5" />
                  <span className="text-sm mt-1">Mover</span>
                </button>
                
                <button
                  onClick={() => {
                    setSelectedTool('color');
                    setShowColorPicker(true);
                  }}
                  className={`p-4 rounded-lg flex flex-col items-center justify-center transition-colors ${
                    selectedTool === 'color' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <Palette className="h-5 w-5" />
                  <span className="text-sm mt-1">Cor</span>
                </button>
                
                <button
                  onClick={() => setSelectedTool('image')}
                  className={`p-4 rounded-lg flex flex-col items-center justify-center transition-colors ${
                    selectedTool === 'image' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <Image className="h-5 w-5" />
                  <span className="text-sm mt-1">Imagem</span>
                </button>
                
                <button
                  onClick={() => setSelectedTool('text')}
                  className={`p-4 rounded-lg flex flex-col items-center justify-center transition-colors ${
                    selectedTool === 'text' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <Text className="h-5 w-5" />
                  <span className="text-sm mt-1">Texto</span>
                </button>
              </div>
              
              {showColorPicker && (
                <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                  <label className="block text-sm font-medium mb-2">Nova Cor</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="w-12 h-12 border-0 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-background"
                    />
                    <button
                      onClick={addColorToMoodboard}
                      className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <button
                  onClick={togglePrivacy}
                  className="flex items-center w-full p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  {activeMoodboard?.isPublic ? (
                    <Eye className="h-5 w-5 mr-3 text-primary" />
                  ) : (
                    <EyeOff className="h-5 w-5 mr-3 text-primary" />
                  )}
                  <span>
                    {activeMoodboard?.isPublic ? 'Público' : 'Privado'}
                  </span>
                </button>
                
                <button
                  onClick={toggleCollaboration}
                  className="flex items-center w-full p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  {activeMoodboard?.isCollaborative ? (
                    <Unlock className="h-5 w-5 mr-3 text-primary" />
                  ) : (
                    <Lock className="h-5 w-5 mr-3 text-primary" />
                  )}
                  <span>
                    {activeMoodboard?.isCollaborative ? 'Colaborativo' : 'Restrito'}
                  </span>
                </button>
                
                <button
                  onClick={() => setShowCollaborators(!showCollaborators)}
                  className="flex items-center w-full p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Users className="h-5 w-5 mr-3 text-primary" />
                  <span>Colaboradores</span>
                </button>
              </div>
            </div>
            
            {/* Ações */}
            <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
              <h2 className="text-xl font-bold mb-4">Ações</h2>
              
              <div className="space-y-3">
                <button
                  onClick={toggleLike}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    isLiked 
                      ? 'bg-destructive text-destructive-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <Heart className={`h-5 w-5 mr-3 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{isLiked ? 'Curtido' : 'Curtir'}</span>
                </button>
                
                <button className="flex items-center w-full p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                  <Share2 className="h-5 w-5 mr-3 text-primary" />
                  <span>Compartilhar</span>
                </button>
                
                <button className="flex items-center w-full p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                  <Download className="h-5 w-5 mr-3 text-primary" />
                  <span>Exportar PNG</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Área do Moodboard */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
              {/* Cabeçalho do Moodboard */}
              <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">{activeMoodboard?.name}</h2>
                  <div className="flex items-center mt-1">
                    {activeMoodboard?.isPublic ? (
                      <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        <Eye className="h-3 w-3 mr-1" />
                        Público
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Privado
                      </span>
                    )}
                    
                    {activeMoodboard?.isCollaborative && (
                      <span className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
                        <Users className="h-3 w-3 mr-1" />
                        Colaborativo
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((item) => (
                      <div 
                        key={item} 
                        className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold border-2 border-card"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">+2</span>
                </div>
              </div>
              
              {/* Canvas do Moodboard */}
              <div className="relative bg-muted/30 min-h-[600px]">
                <div 
                  ref={moodboardRef}
                  className="relative w-full h-full min-h-[600px]"
                  style={{ 
                    backgroundImage: 'radial-gradient(circle, #ddd 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                >
                  {activeMoodboard?.items.map((item) => (
                    <div
                      key={item.id}
                      className={`absolute cursor-move ${
                        selectedItem === item.id ? 'ring-2 ring-primary' : ''
                      }`}
                      style={{
                        left: `${item.x}px`,
                        top: `${item.y}px`,
                        width: `${item.width}px`,
                        height: `${item.height}px`,
                        transform: `rotate(${item.rotation}deg)`,
                        zIndex: item.zIndex
                      }}
                      onMouseDown={(e) => handleMouseDown(e, item.id)}
                    >
                      {item.type === 'color' && (
                        <div 
                          className="w-full h-full rounded-lg shadow-md"
                          style={{ backgroundColor: item.content }}
                        />
                      )}
                      
                      {item.type === 'image' && (
                        <div className="w-full h-full bg-muted rounded-lg shadow-md flex items-center justify-center">
                          <Image className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      
                      {item.type === 'text' && (
                        <div className="w-full h-full bg-card rounded-lg shadow-md p-3 flex items-center justify-center">
                          <span className="font-medium">Texto</span>
                        </div>
                      )}
                      
                      {selectedItem === item.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteItem(item.id);
                          }}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {activeMoodboard?.items.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                      <Palette className="h-12 w-12 mb-4" />
                      <h3 className="text-xl font-bold mb-2">Moodboard Vazio</h3>
                      <p className="mb-6 text-center max-w-md">
                        Adicione cores, imagens e textos para criar sua paleta de cores perfeita.
                      </p>
                      <button
                        onClick={() => {
                          setSelectedTool('color');
                          setShowColorPicker(true);
                        }}
                        className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Adicionar Primeiro Elemento
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Informações do Projeto */}
            <div className="bg-card rounded-xl shadow-lg p-6 border border-border mt-6">
              <h2 className="text-xl font-bold mb-4">Sobre este Moodboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Criado em</h3>
                  <p>15 de Setembro, 2025</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Última Edição</h3>
                  <p>Hoje, 14:30</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Itens</h3>
                  <p>{activeMoodboard?.items.length || 0} elementos</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground">
                  Paleta de cores para projeto de reforma da sala de estar. 
                  Foco em tons terrosos com detalhes em azul turquesa.
                </p>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Produtos Relacionados</h3>
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
                  to="/catalogo"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Ver Produtos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}