// Serviço para gerenciar templates com variáveis dinâmicas

export type TemplateVariable = {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'percentage';
  defaultValue?: string;
  required: boolean;
};

export type DynamicTemplate = {
  id: string;
  name: string;
  type: 'quote' | 'email';
  content: string;
  variables: TemplateVariable[];
  created_at: string;
  updated_at: string;
};

export class TemplateService {
  // Variáveis padrão disponíveis para todos os templates
  static readonly DEFAULT_VARIABLES: TemplateVariable[] = [
    { id: 'customer_name', name: 'customer_name', label: 'Nome do Cliente', type: 'text', required: true },
    { id: 'customer_email', name: 'customer_email', label: 'E-mail do Cliente', type: 'text', required: true },
    { id: 'quote_number', name: 'quote_number', label: 'Número do Orçamento', type: 'text', required: true },
    { id: 'quote_date', name: 'quote_date', label: 'Data do Orçamento', type: 'date', required: true },
    { id: 'quote_total', name: 'quote_total', label: 'Total do Orçamento', type: 'currency', required: true },
    { id: 'company_name', name: 'company_name', label: 'Nome da Empresa', type: 'text', defaultValue: 'ProRevest', required: false },
    { id: 'company_address', name: 'company_address', label: 'Endereço da Empresa', type: 'text', defaultValue: 'Av. Exemplo, 123', required: false },
    { id: 'company_phone', name: 'company_phone', label: 'Telefone da Empresa', type: 'text', defaultValue: '(11) 1234-5678', required: false },
    { id: 'company_email', name: 'company_email', label: 'E-mail da Empresa', type: 'text', defaultValue: 'contato@tintaszanai.com.br', required: false },
  ];

  static async createTemplate(template: Omit<DynamicTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<DynamicTemplate> {
    // Em uma implementação real, isso salvaria no banco de dados
    const newTemplate: DynamicTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name: template.name,
      type: template.type,
      content: template.content,
      variables: template.variables,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Salvar no localStorage para simular persistência
    const templates = JSON.parse(localStorage.getItem('dynamicTemplates') || '[]');
    templates.push(newTemplate);
    localStorage.setItem('dynamicTemplates', JSON.stringify(templates));
    
    return newTemplate;
  }

  static async getTemplates(type?: 'quote' | 'email'): Promise<DynamicTemplate[]> {
    // Em uma implementação real, isso buscaria do banco de dados
    const templates = JSON.parse(localStorage.getItem('dynamicTemplates') || '[]');
    
    if (type) {
      return templates.filter((t: DynamicTemplate) => t.type === type);
    }
    
    return templates;
  }

  static async getTemplateById(templateId: string): Promise<DynamicTemplate | null> {
    const templates = await this.getTemplates();
    return templates.find((t: DynamicTemplate) => t.id === templateId) || null;
  }

  static async updateTemplate(templateId: string, updates: Partial<DynamicTemplate>): Promise<DynamicTemplate> {
    const templates = JSON.parse(localStorage.getItem('dynamicTemplates') || '[]');
    const templateIndex = templates.findIndex((t: DynamicTemplate) => t.id === templateId);
    
    if (templateIndex === -1) {
      throw new Error('Template não encontrado');
    }
    
    templates[templateIndex] = {
      ...templates[templateIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    localStorage.setItem('dynamicTemplates', JSON.stringify(templates));
    
    return templates[templateIndex];
  }

  static async deleteTemplate(templateId: string): Promise<void> {
    const templates = JSON.parse(localStorage.getItem('dynamicTemplates') || '[]');
    const filteredTemplates = templates.filter((t: DynamicTemplate) => t.id !== templateId);
    localStorage.setItem('dynamicTemplates', JSON.stringify(filteredTemplates));
  }

  static renderTemplate(template: DynamicTemplate, variables: Record<string, any>): string {
    let content = template.content;
    
    // Substituir variáveis no template
    template.variables.forEach(variable => {
      const value = variables[variable.name] || variable.defaultValue || '';
      const regex = new RegExp(`{{${variable.name}}}`, 'g');
      content = content.replace(regex, this.formatValue(value, variable.type));
    });
    
    // Substituir variáveis padrão
    this.DEFAULT_VARIABLES.forEach(variable => {
      const value = variables[variable.name] || variable.defaultValue || '';
      const regex = new RegExp(`{{${variable.name}}}`, 'g');
      content = content.replace(regex, this.formatValue(value, variable.type));
    });
    
    return content;
  }

  static formatValue(value: any, type: TemplateVariable['type']): string {
    switch (type) {
      case 'currency':
        return `R$ ${parseFloat(value).toFixed(2)}`;
      case 'percentage':
        return `${parseFloat(value).toFixed(2)}%`;
      case 'date':
        if (value instanceof Date) {
          return value.toLocaleDateString('pt-BR');
        }
        return new Date(value).toLocaleDateString('pt-BR');
      default:
        return String(value);
    }
  }

  static validateVariables(template: DynamicTemplate, variables: Record<string, any>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    template.variables.forEach(variable => {
      if (variable.required && (!variables[variable.name] && !variable.defaultValue)) {
        errors.push(`A variável "${variable.label}" é obrigatória`);
      }
    });
    
    // Validar variáveis padrão obrigatórias
    this.DEFAULT_VARIABLES.forEach(variable => {
      if (variable.required && (!variables[variable.name] && !variable.defaultValue)) {
        errors.push(`A variável "${variable.label}" é obrigatória`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static extractVariablesFromContent(content: string): TemplateVariable[] {
    const variableRegex = /{{(.*?)}}/g;
    const matches = content.match(variableRegex);
    
    if (!matches) {
      return [];
    }
    
    // Remover duplicatas e criar variáveis
    const uniqueVariables = [...new Set(matches.map(match => match.replace(/{{|}}/g, '')))];
    
    return uniqueVariables.map(name => ({
      id: name,
      name,
      label: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      type: 'text',
      required: false
    }));
  }
}