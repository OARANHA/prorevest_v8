export interface MistralChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface MistralChatResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    index: number;
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class ProRevestAIService {
  private static readonly BASE_URL = 'https://api.mistral.ai/v1';
  private static readonly MODEL = 'mistral-small-latest'; // Modelo eficiente e econômico
  private static readonly API_KEY = typeof process !== 'undefined' && process.env ? (process.env.MISTRAL_API_KEY || '') : '';

  static async generateBlogPost(topic: string, tone: string = 'profissional'): Promise<string> {
    const prompt = `Crie um post de blog completo e detalhado sobre "${topic}" para a ProRevest, uma empresa especializada em tintas e revestimentos industriais.

Requisitos:
- Tom: ${tone}
- Formato: Markdown
- Estrutura:
  1. Título atraente
  2. Introdução engaging
  3. 3-4 seções principais com subtítulos
  4. Conclusão com call-to-action
- Foco em: benefícios, aplicações, dicas práticas
- SEO: use palavras-chave relevantes
- Extensão: 800-1200 palavras

Tópicos sugeridos:
- Como escolher a tinta ideal
- Técnicas de aplicação
- Tendências de cores
- Sustentabilidade
- Manutenção de superfícies
- Casos de sucesso

Crie conteúdo original, informativo e que posicione a ProRevest como autoridade no setor.`;

    return this.chat(prompt);
  }

  static async generateBlogTitle(content: string): Promise<string> {
    const prompt = `Baseado no conteúdo abaixo, gere 5 títulos atraentes e otimizados para SEO para um blog da ProRevest (empresa de tintas e revestimentos industriais).

Conteúdo:
${content.substring(0, 1000)}...

Retorne apenas os títulos, um por linha, sem numeração.`;

    const response = await this.chat(prompt);
    return response.split('\n').filter(line => line.trim())[0] || 'Novo Post do Blog';
  }

  static async generateBlogExcerpt(content: string): Promise<string> {
    const prompt = `Crie um resumo atraente (máximo 160 caracteres) para o conteúdo abaixo, ideal para redes sociais e busca:

Conteúdo:
${content.substring(0, 800)}...

Resumo:`;

    return this.chat(prompt);
  }

  static async generateBlogTags(content: string): Promise<string[]> {
    const prompt = `Extraia 10 tags relevantes do conteúdo abaixo para um blog sobre tintas e revestimentos. Retorne apenas as tags separadas por vírgula:

Conteúdo:
${content.substring(0, 1000)}...

Tags:`;

    const response = await this.chat(prompt);
    return response.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }

  private static async chat(prompt: string): Promise<string> {
    try {
      const messages: MistralChatMessage[] = [
        {
          role: 'system',
          content: 'Você é um especialista em marketing de conteúdo para a indústria de tintas e revestimentos. Crie conteúdo informativo, profissional e otimizado para SEO. Responda sempre em português brasileiro.'
        },
        {
          role: 'user',
          content: prompt
        }
      ];

      const response = await fetch(`${this.BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`,
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: messages,
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Mistral API error:', errorData);
        throw new Error(`Erro na API Mistral: ${response.status} ${response.statusText}`);
      }

      const data: MistralChatResponse = await response.json();

      if (!data.choices || data.choices.length === 0) {
        throw new Error('Nenhuma resposta da API Mistral');
      }

      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Erro ao gerar conteúdo com Mistral:', error);
      throw error;
    }
  }

  static async generateBlogPostFromTopic(topic: string, category: string) {
    try {
      // Gerar conteúdo principal
      const content = await this.generateBlogPost(topic);

      // Gerar título
      const title = await this.generateBlogTitle(content);

      // Gerar resumo
      const excerpt = await this.generateBlogExcerpt(content);

      // Gerar tags
      const tags = await this.generateBlogTags(content);

      // Gerar slug
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');

      return {
        title,
        slug,
        excerpt,
        content,
        category,
        tags,
        author: 'ProRevest Team',
        status: 'draft' as const
      };
    } catch (error) {
      console.error('Erro ao gerar post completo:', error);
      throw error;
    }
  }
}