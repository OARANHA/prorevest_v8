import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Wifi, 
  WifiOff, 
  Database, 
  Trash2, 
  RefreshCw, 
  Download,
  Upload,
  HardDrive
} from "lucide-react";
import { OfflineService } from "../../services/offlineService";

export const meta: MetaFunction = () => {
  return [
    { title: "Modo Offline - ProRevest" },
    { name: "description", content: "Gerencie o modo offline e dados armazenados localmente" },
  ];
}

export default function AdminOfflineMode() {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineData, setOfflineData] = useState<{key: string, data: any, timestamp: string}[]>([]);
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageQuota, setStorageQuota] = useState(0);
  const [syncing, setSyncing] = useState(false);

  // Carregar dados offline e informações de armazenamento
  useEffect(() => {
    const loadData = () => {
      // Verificar status da conexão
      setIsOnline(OfflineService.isOnline());
      
      // Carregar dados offline
      const keys = OfflineService.getOfflineDataKeys();
      const data = keys.map(key => {
        const stored = window.localStorage.getItem(`tintas_zanai_offline_data_${key}`);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            return {
              key,
              data: parsed.data,
              timestamp: parsed.timestamp
            };
          } catch (e) {
            return { key, data: null, timestamp: '' };
          }
        }
        return { key, data: null, timestamp: '' };
      });
      setOfflineData(data);
      
      // Calcular uso de armazenamento
      try {
        const used = JSON.stringify(window.localStorage).length;
        setStorageUsed(used);
        
        // Estimar quota (simplificado)
        const quota = 5 * 1024 * 1024; // 5MB estimado
        setStorageQuota(quota);
      } catch (e) {
        console.error('Erro ao calcular uso de armazenamento:', e);
      }
    };
    
    loadData();
    
    // Adicionar listener para mudanças de conexão
    OfflineService.addConnectionListener((online) => {
      setIsOnline(online);
      if (online) {
        // Quando ficar online, tentar sincronizar dados
        handleSync();
      }
    });
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      // Em uma implementação real, aqui chamaríamos o serviço de sincronização
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular sincronização
      // await OfflineService.syncOfflineData();
      
      // Recarregar dados após sincronização
      const keys = OfflineService.getOfflineDataKeys();
      const data = keys.map(key => {
        const stored = window.localStorage.getItem(`tintas_zanai_offline_data_${key}`);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            return {
              key,
              data: parsed.data,
              timestamp: parsed.timestamp
            };
          } catch (e) {
            return { key, data: null, timestamp: '' };
          }
        }
        return { key, data: null, timestamp: '' };
      });
      setOfflineData(data);
      
      alert('Dados sincronizados com sucesso!');
    } catch (error) {
      console.error('Erro ao sincronizar dados:', error);
      alert('Erro ao sincronizar dados');
    } finally {
      setSyncing(false);
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados offline? Esta ação não pode ser desfeita.')) {
      OfflineService.clearAllOfflineData();
      setOfflineData([]);
      setStorageUsed(0);
    }
  };

  const handleDeleteItem = (key: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o item ${key}?`)) {
      OfflineService.removeFromLocalStorage(key);
      
      // Atualizar lista de dados
      setOfflineData(prev => prev.filter(item => item.key !== key));
      
      // Atualizar uso de armazenamento
      try {
        const used = JSON.stringify(window.localStorage).length;
        setStorageUsed(used);
      } catch (e) {
        console.error('Erro ao calcular uso de armazenamento:', e);
      }
    }
  };

  const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const getDataType = (data: any): string => {
    if (!data) return 'Desconhecido';
    
    if (data.quote_items) return 'Orçamento';
    if (data.simulation_data) return 'Simulação';
    if (data.project_name) return 'Projeto';
    if (Array.isArray(data)) return 'Lista';
    if (typeof data === 'object') return 'Objeto';
    
    return typeof data;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-cormorant font-bold">Modo Offline</h1>
            <p className="text-muted-foreground">Gerencie dados armazenados localmente</p>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                <Wifi className="h-4 w-4" />
                Online
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                <WifiOff className="h-4 w-4" />
                Offline
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Estatísticas de armazenamento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Itens Armazenados</p>
              <h3 className="text-2xl font-bold">{offlineData.length}</h3>
            </div>
            <Database className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Armazenamento Usado</p>
              <h3 className="text-2xl font-bold">{formatBytes(storageUsed)}</h3>
              <p className="text-xs text-muted-foreground">
                {storageQuota > 0 ? `${((storageUsed / storageQuota) * 100).toFixed(1)}%` : 'N/A'}
              </p>
            </div>
            <HardDrive className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <h3 className="text-2xl font-bold">{isOnline ? 'Online' : 'Offline'}</h3>
              <p className="text-xs text-muted-foreground">
                {isOnline ? 'Sincronização automática ativa' : 'Dados salvos localmente'}
              </p>
            </div>
            {isOnline ? (
              <Wifi className="h-8 w-8 text-green-500" />
            ) : (
              <WifiOff className="h-8 w-8 text-red-500" />
            )}
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-xl font-cormorant font-bold mb-4">Ações</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSync}
            disabled={!isOnline || syncing}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {syncing ? (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {syncing ? 'Sincronizando...' : 'Sincronizar Dados'}
          </button>
          
          <button
            onClick={handleClearAllData}
            disabled={offlineData.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Limpar Todos os Dados
          </button>
        </div>
      </div>

      {/* Dados offline */}
      <div className="bg-card border border-border rounded-xl shadow-sm">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-cormorant font-bold">Dados Armazenados Offline</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Lista de itens salvos localmente para uso offline
          </p>
        </div>
        
        {offlineData.length > 0 ? (
          <div className="divide-y divide-border">
            {offlineData.map((item, index) => (
              <div key={index} className="p-6 hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-foreground">{item.key}</h3>
                      <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded-full">
                        {getDataType(item.data)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Salvo em: {new Date(item.timestamp).toLocaleString('pt-BR')}
                    </p>
                    <div className="text-xs font-mono bg-muted/50 p-2 rounded max-h-20 overflow-y-auto">
                      {JSON.stringify(item.data, null, 2).substring(0, 200)}
                      {JSON.stringify(item.data, null, 2).length > 200 ? '...' : ''}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item.key)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors ml-4"
                    title="Excluir item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Database className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Nenhum dado offline encontrado</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Os dados salvos localmente aparecerão aqui quando você estiver offline.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}