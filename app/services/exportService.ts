// Serviço para exportação de dados e integração com ERP

export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';
export type ExportEntity = 'products' | 'quotes' | 'customers' | 'projects';

export type ExportOptions = {
  format: ExportFormat;
  entity: ExportEntity;
  startDate?: string;
  endDate?: string;
  filters?: Record<string, any>;
  includeHeaders?: boolean;
};

export type ERPIntegrationConfig = {
  apiUrl: string;
  apiKey: string;
  enabled: boolean;
  syncFrequency: 'daily' | 'weekly' | 'monthly' | 'manual';
  lastSync?: string;
};

export class ExportService {
  // Dados de exemplo para exportação
  static readonly SAMPLE_DATA: Record<ExportEntity, any[]> = {
    products: [
      { id: '1', name: 'Tinta Acrílica Branca', category: 'Acrílicas', price: 120.00, stock: 50 },
      { id: '2', name: 'Tinta Esmalte Preta', category: 'Esmaltes', price: 150.00, stock: 30 },
      { id: '3', name: 'Textura Marrom', category: 'Texturas', price: 80.00, stock: 25 }
    ],
    quotes: [
      { id: 'Q001', customer: 'João Silva', total: 1200.00, date: '2023-05-15', status: 'Aprovado' },
      { id: 'Q002', customer: 'Maria Santos', total: 850.00, date: '2023-05-16', status: 'Pendente' },
      { id: 'Q003', customer: 'Carlos Oliveira', total: 2100.00, date: '2023-05-17', status: 'Aprovado' }
    ],
    customers: [
      { id: 'C001', name: 'João Silva', email: 'joao@email.com', phone: '(11) 9999-9999', company: 'Construtora ABC' },
      { id: 'C002', name: 'Maria Santos', email: 'maria@email.com', phone: '(11) 8888-8888', company: 'Arq. Maria Santos' },
      { id: 'C003', name: 'Carlos Oliveira', email: 'carlos@email.com', phone: '(11) 7777-7777', company: 'Reformas Oliveira' }
    ],
    projects: [
      { id: 'P001', name: 'Reforma Apartamento', customer: 'João Silva', status: 'Em Andamento', startDate: '2023-05-01', endDate: '2023-07-01' },
      { id: 'P002', name: 'Construção Casa', customer: 'Maria Santos', status: 'Planejamento', startDate: '2023-06-01', endDate: '2023-12-01' },
      { id: 'P003', name: 'Pintura Comercial', customer: 'Carlos Oliveira', status: 'Concluído', startDate: '2023-04-01', endDate: '2023-05-15' }
    ]
  };

  static async exportData(options: ExportOptions): Promise<Blob> {
    try {
      switch (options.format) {
        case 'csv':
          return this.exportToCSV(options);
        case 'excel':
          return this.exportToExcel(options);
        case 'pdf':
          return this.exportToPDF(options);
        case 'json':
          return this.exportToJSON(options);
        default:
          throw new Error(`Formato de exportação não suportado: ${options.format}`);
      }
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      throw error;
    }
  }

  static async exportToCSV(options: ExportOptions): Promise<Blob> {
    const data = this.SAMPLE_DATA[options.entity] || [];
    
    if (data.length === 0) {
      return new Blob([''], { type: 'text/csv' });
    }
    
    // Criar cabeçalhos
    const headers = Object.keys(data[0]).join(',');
    
    // Criar linhas de dados
    const rows = data.map(row => {
      return Object.values(row).map(value => {
        // Escapar valores que contenham vírgulas ou aspas
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',');
    });
    
    // Combinar tudo
    const csvContent = [headers, ...rows].join('\n');
    
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }

  static async exportToExcel(options: ExportOptions): Promise<Blob> {
    // Em uma implementação real, isso usaria uma biblioteca como SheetJS
    // Para esta simulação, vamos criar um arquivo CSV com extensão .xlsx
    const csvBlob = await this.exportToCSV(options);
    return new Blob([csvBlob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  static async exportToPDF(options: ExportOptions): Promise<Blob> {
    // Em uma implementação real, isso usaria uma biblioteca como jsPDF
    // Para esta simulação, vamos criar um arquivo de texto com extensão .pdf
    const data = this.SAMPLE_DATA[options.entity] || [];
    const content = JSON.stringify(data, null, 2);
    return new Blob([content], { type: 'application/pdf' });
  }

  static async exportToJSON(options: ExportOptions): Promise<Blob> {
    const data = this.SAMPLE_DATA[options.entity] || [];
    const jsonContent = JSON.stringify(data, null, 2);
    return new Blob([jsonContent], { type: 'application/json' });
  }

  static async getERPIntegrationConfig(): Promise<ERPIntegrationConfig> {
    // Em uma implementação real, isso buscaria do banco de dados
    const config = localStorage.getItem('erpIntegrationConfig');
    if (config) {
      return JSON.parse(config);
    }
    
    // Configuração padrão
    return {
      apiUrl: '',
      apiKey: '',
      enabled: false,
      syncFrequency: 'manual'
    };
  }

  static async saveERPIntegrationConfig(config: Omit<ERPIntegrationConfig, 'lastSync'>): Promise<ERPIntegrationConfig> {
    // Em uma implementação real, isso salvaria no banco de dados
    const fullConfig: ERPIntegrationConfig = {
      ...config,
      lastSync: new Date().toISOString()
    };
    
    localStorage.setItem('erpIntegrationConfig', JSON.stringify(fullConfig));
    return fullConfig;
  }

  static async syncWithERP(): Promise<{ success: boolean; message: string }> {
    try {
      const config = await this.getERPIntegrationConfig();
      
      if (!config.enabled) {
        return { success: false, message: 'Integração com ERP não está habilitada' };
      }
      
      if (!config.apiUrl || !config.apiKey) {
        return { success: false, message: 'Configurações de API incompletas' };
      }
      
      // Simular chamada à API do ERP
      console.log(`Sincronizando com ERP: ${config.apiUrl}`);
      
      // Em uma implementação real, isso faria chamadas reais à API do ERP
      // Para esta simulação, vamos apenas esperar um pouco e retornar sucesso
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Atualizar data da última sincronização
      await this.saveERPIntegrationConfig({
        apiUrl: config.apiUrl,
        apiKey: config.apiKey,
        enabled: config.enabled,
        syncFrequency: config.syncFrequency
      });
      
      return { success: true, message: 'Sincronização com ERP concluída com sucesso' };
    } catch (error) {
      console.error('Erro na sincronização com ERP:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Erro desconhecido na sincronização com ERP' 
      };
    }
  }

  static async getExportHistory(): Promise<any[]> {
    // Em uma implementação real, isso buscaria do banco de dados
    const history = localStorage.getItem('exportHistory');
    return history ? JSON.parse(history) : [];
  }

  static async addToExportHistory(exportRecord: any): Promise<void> {
    // Em uma implementação real, isso salvaria no banco de dados
    const history = await this.getExportHistory();
    history.push({
      ...exportRecord,
      timestamp: new Date().toISOString()
    });
    
    // Manter apenas os últimos 50 registros
    if (history.length > 50) {
      history.splice(0, history.length - 50);
    }
    
    localStorage.setItem('exportHistory', JSON.stringify(history));
  }

  static getEntityLabel(entity: ExportEntity): string {
    switch (entity) {
      case 'products': return 'Produtos';
      case 'quotes': return 'Orçamentos';
      case 'customers': return 'Clientes';
      case 'projects': return 'Projetos';
      default: return entity;
    }
  }

  static getFormatLabel(format: ExportFormat): string {
    switch (format) {
      case 'csv': return 'CSV';
      case 'excel': return 'Excel';
      case 'pdf': return 'PDF';
      case 'json': return 'JSON';
      default: return format;
    }
  }
}