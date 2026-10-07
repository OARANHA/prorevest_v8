import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState } from "react";
import { Palette, Sparkles, Image, Camera, Lightbulb, Heart, Star } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Assistente de Cor por IA - ProRevest" },
    { name: "description", content: "Assistente inteligente para recomendações de combinações de cores" },
  ];
}

// Dados simulados para paletas de cores recomendadas
const SAMPLE_PALETTES = [
  {
    id: 1,
    name: "Harmonia Terracota",
    colors: ["#D2691E", "#CD853F", "#DEB887", "#F5DEB3", "#FFFFFF"],
    description: "Paleta quente inspirada em tons terrosos e areia do deserto",
    popularity: 95
  },
  {
    id: 2,
    name: "Oceano Sereno",
    colors: ["#4682B4", "#5F9EA0", "#87CEEB", "#B0E0E6", "#FFFFFF"],
    description: "Tons suaves de azul que evocam a serenidade do oceano",
    popularity: 88
  },
  {
    id: 3,
    name: "Floresta Encantada",
    colors: ["#228B22", "#32CD32", "#90EE90", "#98FB98", "#FFFFFF"],
    description: "Verdes vibrantes que trazem a energia da natureza para seu espaço",
    popularity: 92
  },
  {
    id: 4,
    name: "Pôr do Sol",
    colors: ["#FF4500", "#FF8C00", "#FFD700", "#FFA500", "#FFFFFF"],
    description: "Paleta quente que captura a beleza de um pôr do sol",
    popularity: 87
  }
];

// Dados simulados para texturas recomendadas
const SAMPLE_TEXTURES = [
  { id: 1, name: "Aveludado", description: "Textura suave e aconchegante" },
  { id: 2, name: "Acetinado", description: "Brilho sutil e elegante" },
  { id: 3, name: "Textura Suede", description: "Toque macio com acabamento mate" },
  { id: 4, name: "Efeito Concreto", description: "Acabamento urbano e moderno" },
  { id: 5, name: "Metalizado", description: "Brilho sofisticado com reflexos" }
];

export default function AdminAIColorAssistant() {
  const [roomType, setRoomType] = useState<string>("");
  const [roomPhoto, setRoomPhoto] = useState<string | null>(null);
  const [lighting, setLighting] = useState<string>("");
  const [style, setStyle] = useState<string>("");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedPalette, setSelectedPalette] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const roomTypes = [
    "Sala de estar", "Quarto", "Cozinha", "Banheiro", "Escritório", 
    "Sala de jantar", "Varanda", "Fachada", "Área de serviço"
  ];

  const lightingOptions = [
    "Natural abundante", "Natural moderada", "Artificial", "Mista", "Pouca iluminação"
  ];

  const styleOptions = [
    "Moderno", "Clássico", "Rústico", "Industrial", "Minimalista", 
    "Boho", "Scandinavo", "Vintage", "Tropical"
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setRoomPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const generateRecommendations = () => {
    setIsGenerating(true);
    
    // Simular processamento da IA
    setTimeout(() => {
      setRecommendations(SAMPLE_PALETTES);
      setSelectedPalette(SAMPLE_PALETTES[0]);
      setIsGenerating(false);
    }, 2000);
  };

  const getTextureRecommendation = (palette: any) => {
    // Lógica simples para recomendar texturas baseada na paleta
    if (palette.name.includes("Harmonia")) return SAMPLE_TEXTURES[0];
    if (palette.name.includes("Oceano")) return SAMPLE_TEXTURES[1];
    if (palette.name.includes("Floresta")) return SAMPLE_TEXTURES[2];
    if (palette.name.includes("Pôr")) return SAMPLE_TEXTURES[3];
    return SAMPLE_TEXTURES[4];
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-cormorant font-bold">Assistente de Cor por IA</h1>
        <p className="text-muted-foreground">Recomendações inteligentes de combinações de cores e texturas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel de entrada */}
        <div className="lg:col-span-1 bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            Informações do Ambiente
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tipo de ambiente
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Selecione um ambiente</option>
                {roomTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Foto do ambiente (opcional)
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                {roomPhoto ? (
                  <img 
                    src={roomPhoto} 
                    alt="Ambiente" 
                    className="mx-auto max-h-40 rounded-lg"
                  />
                ) : (
                  <div>
                    <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Clique para enviar uma foto do ambiente
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label 
                  htmlFor="photo-upload"
                  className="mt-4 inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  {roomPhoto ? "Trocar Foto" : "Enviar Foto"}
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Iluminação do ambiente
              </label>
              <select
                value={lighting}
                onChange={(e) => setLighting(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Selecione a iluminação</option>
                {lightingOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Estilo desejado
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Selecione um estilo</option>
                {styleOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={generateRecommendations}
              disabled={isGenerating || !roomType || !lighting || !style}
              className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gerando recomendações...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Gerar Recomendações
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Resultados */}
        <div className="lg:col-span-2 space-y-6">
          {/* Paletas recomendadas */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
              <Palette className="h-5 w-5 mr-2 text-primary" />
              Paletas Recomendadas
            </h2>
            
            {isGenerating ? (
              <div className="flex justify-center items-center h-40">
                <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((palette) => (
                  <div 
                    key={palette.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPalette?.id === palette.id 
                        ? "border-primary ring-2 ring-primary/20" 
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedPalette(palette)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-foreground">{palette.name}</h3>
                      <div className="flex items-center text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-xs ml-1">{palette.popularity}%</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{palette.description}</p>
                    
                    <div className="flex space-x-2">
                      {palette.colors.map((color: string, index: number) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full border border-border"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Lightbulb className="h-12 w-12 mx-auto mb-3 text-muted-foreground/20" />
                <p>Preencha as informações do ambiente e clique em "Gerar Recomendações" para obter sugestões personalizadas.</p>
              </div>
            )}
          </div>
          
          {/* Detalhes da paleta selecionada */}
          {selectedPalette && (
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-primary" />
                Detalhes da Paleta: {selectedPalette.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-foreground mb-3">Cores da Paleta</h3>
                  <div className="space-y-3">
                    {selectedPalette.colors.map((color: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <div
                          className="w-10 h-10 rounded-full border border-border mr-3"
                          style={{ backgroundColor: color }}
                        ></div>
                        <div>
                          <div className="font-medium text-foreground">{color}</div>
                          <div className="text-sm text-muted-foreground">
                            {index === 0 ? "Cor principal" : 
                             index === selectedPalette.colors.length - 1 ? "Cor de destaque" : 
                             `Cor complementar ${index}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-foreground mb-3">Recomendações</h3>
                  <div className="space-y-4">
                    <div className="border border-border rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Textura Recomendada</h4>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-muted mr-3 flex items-center justify-center">
                          <Image className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {getTextureRecommendation(selectedPalette).name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {getTextureRecommendation(selectedPalette).description}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-border rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Aplicação Sugerida</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Parede principal: {selectedPalette.colors[0]}</li>
                        <li>• Parede de destaque: {selectedPalette.colors[selectedPalette.colors.length - 2]}</li>
                        <li>• Molduras e detalhes: {selectedPalette.colors[selectedPalette.colors.length - 1]}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Salvar Paleta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Informações sobre a IA */}
      <div className="mt-6 bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-cormorant font-bold mb-4">Como a IA ajuda você</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              Análise de Ambiente
            </h3>
            <p className="text-sm text-muted-foreground">
              Nossa IA analisa as características do seu ambiente para sugerir as melhores combinações de cores.
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2 flex items-center">
              <Palette className="h-4 w-4 mr-2 text-primary" />
              Harmonização
            </h3>
            <p className="text-sm text-muted-foreground">
              Recomenda paletas harmoniosas baseadas em teoria das cores e tendências atuais.
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2 flex items-center">
              <Heart className="h-4 w-4 mr-2 text-primary" />
              Personalização
            </h3>
            <p className="text-sm text-muted-foreground">
              Adapta as sugestões ao seu estilo pessoal e preferências estéticas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}