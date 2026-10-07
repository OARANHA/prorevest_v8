import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState } from "react";
import { Layers, Eye, EyeOff, Palette, Brush, Save } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Camadas Editáveis - ProRevest" },
    { name: "description", content: "Gerencie camadas editáveis para atribuir cor/textura por parede" },
  ];
}

export default function AdminEditableLayers() {
  const [layers, setLayers] = useState([
    { id: 1, name: "Paredes Externas", visible: true, color: "#e0e0e0", texture: "Liso" },
    { id: 2, name: "Paredes Internas", visible: true, color: "#f5f5f5", texture: "Liso" },
    { id: 3, name: "Portas", visible: true, color: "#d4a574", texture: "Madeira" },
    { id: 4, name: "Janelas", visible: true, color: "#87ceeb", texture: "Vidro" },
    { id: 5, name: "Teto", visible: true, color: "#ffffff", texture: "Liso" },
    { id: 6, name: "Piso", visible: true, color: "#a0522d", texture: "Madeira" },
  ]);

  const [selectedLayer, setSelectedLayer] = useState(layers[0]);

  const toggleLayerVisibility = (id: number) => {
    setLayers(layers.map(layer => 
      layer.id === id ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const updateLayer = (id: number, updates: Partial<typeof layers[0]>) => {
    setLayers(layers.map(layer => 
      layer.id === id ? { ...layer, ...updates } : layer
    ));
    
    if (selectedLayer.id === id) {
      setSelectedLayer({ ...selectedLayer, ...updates });
    }
  };

  const handleSave = () => {
    // Em uma implementação real, salvaríamos essas configurações no banco de dados
    console.log("Camadas salvas:", layers);
    alert("Configurações de camadas salvas com sucesso!");
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-cormorant font-bold">Camadas Editáveis</h1>
        <p className="text-muted-foreground">Gerencie camadas para atribuir cor/textura por parede</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Camadas */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <Layers className="h-5 w-5 mr-2 text-primary" />
            Camadas da Planta
          </h2>
          
          <div className="space-y-2">
            {layers.map((layer) => (
              <div 
                key={layer.id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedLayer.id === layer.id 
                    ? "bg-primary/10 border border-primary/30" 
                    : "bg-muted/30 hover:bg-muted/50"
                }`}
                onClick={() => setSelectedLayer(layer)}
              >
                <div className="flex items-center">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerVisibility(layer.id);
                    }}
                    className="mr-3 text-muted-foreground hover:text-foreground"
                  >
                    {layer.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <div>
                    <h3 className="font-medium text-foreground">{layer.name}</h3>
                    <p className="text-xs text-muted-foreground">{layer.texture}</p>
                  </div>
                </div>
                <div 
                  className="w-4 h-4 rounded-full border border-border" 
                  style={{ backgroundColor: layer.color }}
                ></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Detalhes da Camada Selecionada */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <Palette className="h-5 w-5 mr-2 text-primary" />
            Detalhes da Camada
          </h2>
          
          {selectedLayer ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nome da Camada
                </label>
                <input
                  type="text"
                  value={selectedLayer.name}
                  onChange={(e) => updateLayer(selectedLayer.id, { name: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Cor
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={selectedLayer.color}
                    onChange={(e) => updateLayer(selectedLayer.id, { color: e.target.value })}
                    className="w-12 h-12 border border-border rounded-lg bg-background cursor-pointer"
                  />
                  <span className="ml-3 text-sm text-muted-foreground">
                    {selectedLayer.color}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Textura
                </label>
                <select
                  value={selectedLayer.texture}
                  onChange={(e) => updateLayer(selectedLayer.id, { texture: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Liso">Liso</option>
                  <option value="Texturizado">Texturizado</option>
                  <option value="Madeira">Madeira</option>
                  <option value="Pedra">Pedra</option>
                  <option value="Metal">Metal</option>
                  <option value="Vidro">Vidro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Visibilidade
                </label>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedLayer.visible}
                      onChange={(e) => updateLayer(selectedLayer.id, { visible: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                  <span className="ml-3 text-sm text-muted-foreground">
                    {selectedLayer.visible ? "Visível" : "Oculta"}
                  </span>
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  onClick={handleSave}
                  className="flex items-center bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Salvar Alterações
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Layers className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">Nenhuma camada selecionada</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Selecione uma camada da lista para editar suas propriedades.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Visualização da Planta */}
      <div className="mt-6 bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
          <Eye className="h-5 w-5 mr-2 text-primary" />
          Visualização da Planta
        </h2>
        
        <div className="border border-border rounded-lg p-4 bg-muted/10 min-h-[400px] relative">
          {/* Representação simplificada de uma planta */}
          <div className="absolute inset-4 border-2 border-gray-400"></div>
          
          {/* Paredes externas */}
          <div 
            className="absolute top-4 left-4 right-4 h-8 rounded"
            style={{ backgroundColor: layers.find(l => l.name === "Paredes Externas")?.color }}
          ></div>
          
          <div 
            className="absolute bottom-4 left-4 right-4 h-8 rounded"
            style={{ backgroundColor: layers.find(l => l.name === "Paredes Externas")?.color }}
          ></div>
          
          <div 
            className="absolute top-4 left-4 bottom-4 w-8 rounded"
            style={{ backgroundColor: layers.find(l => l.name === "Paredes Externas")?.color }}
          ></div>
          
          <div 
            className="absolute top-4 right-4 bottom-4 w-8 rounded"
            style={{ backgroundColor: layers.find(l => l.name === "Paredes Externas")?.color }}
          ></div>
          
          {/* Portas */}
          <div 
            className="absolute top-1/2 left-4 w-8 h-16 rounded transform -translate-y-1/2"
            style={{ backgroundColor: layers.find(l => l.name === "Portas")?.color }}
          ></div>
          
          {/* Janelas */}
          <div 
            className="absolute top-1/4 right-4 w-16 h-8 rounded"
            style={{ backgroundColor: layers.find(l => l.name === "Janelas")?.color }}
          ></div>
          
          <div 
            className="absolute bottom-1/4 right-4 w-16 h-8 rounded"
            style={{ backgroundColor: layers.find(l => l.name === "Janelas")?.color }}
          ></div>
          
          {/* Teto */}
          <div 
            className="absolute top-12 left-12 right-12 h-4 rounded"
            style={{ backgroundColor: layers.find(l => l.name === "Teto")?.color }}
          ></div>
        </div>
      </div>
    </div>
  );
}