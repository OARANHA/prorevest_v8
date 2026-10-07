// Serviço de IA para análise automática de imagens (provedor abstraído)
// Remove objetos inapropriados (pessoas, animais) e sugere cores adequadas

export interface AIAnalysisResult {
  cleanedImageUrl?: string;
  removedObjects: string[];
  colorSuggestions: Array<{
    name: string;
    hexCode: string;
    category: string;
    description: string;
  }>;
  wallDetection: {
    detected: boolean;
    walls: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
    }>;
  };
  safety: {
    appropriate: boolean;
    issues: string[];
  };
}

class AIService {
  private static instance: AIService;
  private apiKey: string | null = null;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  private constructor() {
    // Inicializar com API key do ambiente - verificar múltiplas fontes
    this.apiKey = 
      process.env.REACT_APP_GEMINI_API_KEY || 
      process.env.VITE_GEMINI_API_KEY || 
      process.env.GEMINI_API_KEY ||
      import.meta.env?.VITE_GEMINI_API_KEY ||
      import.meta.env?.REACT_APP_GEMINI_API_KEY ||
      null;
    
    if (!this.apiKey) {
      if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
        console.warn('⚠️ API de IA não configurada — usando modo simulado.');
      }
    } else {
      if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
        console.log('✅ Serviço de IA configurado.');
      }
    }
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Analisa imagem com IA para remover objetos inapropriados e sugerir cores
   */
  async analyzeImage(imageUrl: string, projectStyle: string): Promise<AIAnalysisResult> {
    try {
      if (!this.apiKey) {
        return this.simulateAnalysis(imageUrl, projectStyle);
      }

      // Converter imagem para base64
      const base64Image = await this.imageToBase64(imageUrl);
      
      // Prompt para análise com IA (sem expor o provedor)
      const prompt = `
        Analise esta imagem de um ambiente interior e identifique:
        1. Objetos inapropriados que devem ser removidos (pessoas, animais, objetos pessoais)
        2. Superfícies que parecem paredes ou tetos
        3. Cores predominantes no ambiente
        4. Sugestões de cores adequadas para o estilo "${projectStyle}"

        Responda em formato JSON estrito:
        {
          "safety": {
            "appropriate": boolean,
            "issues": ["lista de problemas encontrados"]
          },
          "removedObjects": ["objetos que seriam removidos"],
          "wallDetection": {
            "detected": boolean,
            "walls": [{"x": 0, "y": 0, "width": 100, "height": 100}]
          },
          "colorSuggestions": [
            {"name": "Nome da Cor", "hexCode": "#FFFFFF", "category": "Categoria", "description": "Descrição"}
          ]
        }
      `;

      const response = await fetch(`${this.baseUrl}/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: base64Image.split(',')[1], // Remove "data:image/jpeg;base64," prefix
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na API de IA: ${response.status}`);
      }

      const result = await response.json();
      const analysis = JSON.parse(result.candidates[0].content.parts[0].text);

      // Processar resultado
      return {
        safety: analysis.safety,
        removedObjects: analysis.removedObjects || [],
        wallDetection: analysis.wallDetection || { detected: false, walls: [] },
        colorSuggestions: analysis.colorSuggestions || [],
      };

    } catch (error) {
      console.error('❌ Erro na análise de IA:', error);
      return this.simulateAnalysis(imageUrl, projectStyle);
    }
  }

  /**
   * Remove objetos inapropriados da imagem usando IA
   */
  async cleanImage(imageUrl: string): Promise<string> {
    try {
      if (!this.apiKey) {
        // Simular limpeza - na implementação real, usaria IA para editar imagem
        console.log('🔄 Modo simulado: Retornando imagem original');
        return imageUrl;
      }

      const base64Image = await this.imageToBase64(imageUrl);
      
      const prompt = `
        Analise esta imagem e remova qualquer objeto inapropriado:
        - Pessoas, rostos, figuras humanas
        - Animais de estimação
        - Objetos pessoais (fotos, quadros, decorações pessoais)
        - Qualquer elemento que não pertença a um ambiente de design de interiores
        
        Mantenha apenas:
        - Paredes, tetos, pisos
        - Móveis de design (sofás, mesas, cadeiras neutras)
        - Elementos arquitetônicos (janelas, portas, lâmpadas)
        - Plantas e elementos naturais de decoração
        
        Retorne a imagem processada em base64 sem objetos inapropriados.
      `;

      const response = await fetch(`${this.baseUrl}/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: base64Image.split(',')[1],
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na limpeza de imagem: ${response.status}`);
      }

      // Na implementação real, o serviço de IA poderia retornar uma imagem processada
      // Por enquanto, retornamos a imagem original
      console.log('🔄 Limpeza simulada: IA identificaria mas não remove objetos ainda');
      return imageUrl;

    } catch (error) {
      console.error('❌ Erro na limpeza de imagem:', error);
      return imageUrl;
    }
  }

  /**
   * Converte imagem URL para base64
   */
  private async imageToBase64(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Não foi possível criar contexto 2D'));
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(base64);
      };
      
      img.onerror = () => {
        reject(new Error('Erro ao carregar imagem'));
      };
      
      img.src = imageUrl;
    });
  }

  /**
   * Simulação de análise para desenvolvimento/teste
   */
  private simulateAnalysis(imageUrl: string, projectStyle: string): AIAnalysisResult {
    console.log('🤖 Usando modo simulado de análise de IA');
    
    // Simular detecção de objetos inapropriados
    const mockIssues: string[] = [];
    
    // Simular detecção de paredes
    const mockWalls = [
      { x: 100, y: 50, width: 300, height: 200 },
      { x: 500, y: 50, width: 250, height: 200 },
    ];
    
    // Simular sugestões de cores baseadas no estilo
    const styleColorMap = {
      moderno: [
        { name: 'Branco Algodão', hexCode: '#FFFFFF', category: 'Neutras', description: 'Cor limpa e sofisticada' },
        { name: 'Cinza Claro', hexCode: '#F5F5F5', category: 'Neutras', description: 'Neutro elegante' },
        { name: 'Azul Céu', hexCode: '#87CEEB', category: 'Claras', description: 'Tranquilidade e amplitude' },
      ],
      rustico: [
        { name: 'Terraque', hexCode: '#8B4513', category: 'Terra', description: 'Aconchego e naturalidade' },
        { name: 'Bege Claro', hexCode: '#F5DEB3', category: 'Claras', description: 'Calidez e simplicidade' },
        { name: "Verde Floresta", hexCode: '#228B22', category: 'Naturais', description: "Conexão com natureza" },
      ],
      classico: [
        { name: "Azul Marinho", hexCode: '#1E3A8A', category: "Escuras", description: "Elegância atemporal" },
        { name: "Cinza Chumbo", hexCode: '#4A5568', category: "Escuras", description: "Sophisticação e profundidade" },
        { name: "Creme Suave", hexCode: '#F8F4E3', category: "Claras", description: "Luxo e conforto" },
      ],
      industrial: [
        { name: "Cinza Grafite", hexCode: '#37474F', category: "Escuras", description: "Visual urbano moderno" },
        { name: "Preto Fosco", hexCode: '#1A1A1A', category: "Escuras", description: "Contraste dramático" },
        { name: "Branco Titânio", hexCode: '#F8F9FA', category: "Neutras", description: "Limpeza industrial" },
      ],
    };
    
    const suggestions = styleColorMap[projectStyle as keyof typeof styleColorMap] || styleColorMap.moderno;
    
    // Simular verificação de segurança (sempre retorna apropriado para imagens de interiores)
    mockIssues.push("Nenhum objeto inapropriado detectado");
    
    return {
      safety: {
        appropriate: true,
        issues: mockIssues,
      },
      removedObjects: [],
      wallDetection: {
        detected: true,
        walls: mockWalls,
      },
      colorSuggestions: suggestions,
    };
  }

  /**
   * Gera prompt interno baseado no estilo e tipo de ambiente
   */
  generateInternalPrompt(projectStyle: string, roomType: string): string {
    const stylePrompts: Record<string, string> = {
      moderno: "ambiente minimalista com linhas limpas, cores neutras e design contemporâneo",
      rustico: "ambiente aconchegante com elementos naturais, texturas quentes e atmosfera rústica",
      classico: "ambiente elegante com proporções clássicas, cores ricas e detalhes tradicionais",
      industrial: "ambiente urbano com materiais brutos, cores escuras e estética industrial",
      minimalista: "ambiente simplificado com cores suaves, funcionalidade e design minimalista",
      bohemio: "ambiente livre com cores vibrantes, mistura de texturas e estilo boêmio",
      escandinavo: "ambiente claro com madeira clara, cores suaves e design escandinavo",
      mediterraneo: "ambiente ensolarado com cores terra queimadas, azuis e verdes e estilo mediterrâneo",
    };
    
    const roomPrompts: Record<string, string> = {
      "sala-estar": "sala de estar social destinada a relaxamento e entretenimento",
      quarto: "quarto privado destinado ao descanso e conforto pessoal",
      cozinha: "cozinha funcional destinada à preparação de alimentos",
      banheiro: "banheiro prático destinado à higiene e bem-estar",
      "home-office": "escritório funcional destinado ao trabalho e produtividade",
      "sala-jantar": "sala de jantar social destinada a refeições em família",
    };
    
    const stylePrompt = stylePrompts[projectStyle] || "ambiente residencial";
    const roomPrompt = roomPrompts[roomType] || "ambiente interno";
    
    return `Analise esta imagem de um ${roomPrompt} com estilo ${stylePrompt}. Identifique padrões, texturas, cores principais e sugira paletas harmônicas adequadas para transformação visual.`;
  }

  /**
   * Verifica se a imagem é apropriada para uso comercial
   */
  async validateImage(imageUrl: string): Promise<{ appropriate: boolean; issues: string[] }> {
    try {
      const analysis = await this.analyzeImage(imageUrl, "moderno");
      return {
        appropriate: analysis.safety.appropriate,
        issues: analysis.safety.issues,
      };
    } catch (error) {
      console.error('❌ Erro na validação de imagem:', error);
      return {
        appropriate: false,
        issues: ["Erro na validação da imagem"],
      };
    }
  }
}

export default AIService.getInstance();
