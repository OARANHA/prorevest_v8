// Serviço para gerenciar funcionalidades offline
export class OfflineService {
  static readonly STORAGE_KEY = 'tintas_zanai_offline_data';
  
  // Verificar se o navegador suporta armazenamento offline
  static isOfflineSupported(): boolean {
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  // Salvar dados no armazenamento local
  static saveToLocalStorage<T>(key: string, data: T): boolean {
    if (!this.isOfflineSupported()) {
      console.warn('Armazenamento offline não suportado');
      return false;
    }
    
    try {
      const storageData = {
        data,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      
      window.localStorage.setItem(`${this.STORAGE_KEY}_${key}`, JSON.stringify(storageData));
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados no armazenamento local:', error);
      return false;
    }
  }
  
  // Carregar dados do armazenamento local
  static loadFromLocalStorage<T>(key: string): T | null {
    if (!this.isOfflineSupported()) {
      console.warn('Armazenamento offline não suportado');
      return null;
    }
    
    try {
      const stored = window.localStorage.getItem(`${this.STORAGE_KEY}_${key}`);
      if (!stored) return null;
      
      const storageData = JSON.parse(stored);
      return storageData.data as T;
    } catch (error) {
      console.error('Erro ao carregar dados do armazenamento local:', error);
      return null;
    }
  }
  
  // Remover dados do armazenamento local
  static removeFromLocalStorage(key: string): boolean {
    if (!this.isOfflineSupported()) {
      console.warn('Armazenamento offline não suportado');
      return false;
    }
    
    try {
      window.localStorage.removeItem(`${this.STORAGE_KEY}_${key}`);
      return true;
    } catch (error) {
      console.error('Erro ao remover dados do armazenamento local:', error);
      return false;
    }
  }
  
  // Limpar todos os dados offline
  static clearAllOfflineData(): boolean {
    if (!this.isOfflineSupported()) {
      console.warn('Armazenamento offline não suportado');
      return false;
    }
    
    try {
      Object.keys(window.localStorage).forEach(key => {
        if (key.startsWith(this.STORAGE_KEY)) {
          window.localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Erro ao limpar dados offline:', error);
      return false;
    }
  }
  
  // Verificar se há dados salvos offline
  static hasOfflineData(key: string): boolean {
    if (!this.isOfflineSupported()) return false;
    
    return window.localStorage.getItem(`${this.STORAGE_KEY}_${key}`) !== null;
  }
  
  // Obter todas as chaves de dados offline
  static getOfflineDataKeys(): string[] {
    if (!this.isOfflineSupported()) return [];
    
    return Object.keys(window.localStorage)
      .filter(key => key.startsWith(this.STORAGE_KEY))
      .map(key => key.replace(`${this.STORAGE_KEY}_`, ''));
  }
  
  // Salvar orçamento offline
  static saveQuoteOffline(quote: any): boolean {
    const key = `quote_${quote.id || Date.now()}`;
    return this.saveToLocalStorage(key, quote);
  }
  
  // Carregar orçamentos offline
  static loadOfflineQuotes(): any[] {
    const quotes: any[] = [];
    const keys = this.getOfflineDataKeys().filter(key => key.startsWith('quote_'));
    
    keys.forEach(key => {
      const quote = this.loadFromLocalStorage(key);
      if (quote) {
        quotes.push(quote);
      }
    });
    
    return quotes;
  }
  
  // Salvar simulação offline
  static saveSimulationOffline(simulation: any): boolean {
    const key = `simulation_${simulation.id || Date.now()}`;
    return this.saveToLocalStorage(key, simulation);
  }
  
  // Carregar simulações offline
  static loadOfflineSimulations(): any[] {
    const simulations: any[] = [];
    const keys = this.getOfflineDataKeys().filter(key => key.startsWith('simulation_'));
    
    keys.forEach(key => {
      const simulation = this.loadFromLocalStorage(key);
      if (simulation) {
        simulations.push(simulation);
      }
    });
    
    return simulations;
  }
  
  // Sincronizar dados offline com o servidor quando online
  static async syncOfflineData(): Promise<boolean> {
    // Esta função seria implementada com base na lógica de sincronização específica
    // com o backend Supabase
    
    console.log('Sincronizando dados offline...');
    
    // Exemplo de implementação:
    /*
    try {
      // Sincronizar orçamentos
      const offlineQuotes = this.loadOfflineQuotes();
      for (const quote of offlineQuotes) {
        // Enviar para o servidor
        await QuoteService.createQuote(quote);
        // Remover do armazenamento offline após sincronização bem-sucedida
        this.removeFromLocalStorage(`quote_${quote.id}`);
      }
      
      // Sincronizar simulações
      const offlineSimulations = this.loadOfflineSimulations();
      for (const simulation of offlineSimulations) {
        // Enviar para o servidor
        await SimulationService.saveSimulation(simulation);
        // Remover do armazenamento offline após sincronização bem-sucedida
        this.removeFromLocalStorage(`simulation_${simulation.id}`);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao sincronizar dados offline:', error);
      return false;
    }
    */
    
    // Por enquanto, apenas simulando a sincronização
    return true;
  }
  
  // Verificar status da conexão
  static isOnline(): boolean {
    return navigator.onLine;
  }
  
  // Ouvir mudanças de status da conexão
  static addConnectionListener(callback: (isOnline: boolean) => void): void {
    window.addEventListener('online', () => callback(true));
    window.addEventListener('offline', () => callback(false));
  }
}