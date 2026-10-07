import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { Download, Settings, RefreshCw, History, Database, FileSpreadsheet, FileText, FileJson } from "lucide-react";
import { ExportService, type ExportOptions, type ERPIntegrationConfig } from "../../services/exportService";

export const meta: MetaFunction = () => {
  return [
    { title: "Exportação de Dados - ProRevest" },
    { name: "description", content: "Exporte dados e gerencie integração com ERP" },
  ];
}

export default function AdminDataExport() {
  const [erpConfig, setErpConfig] = useState<ERPIntegrationConfig>({
    apiUrl: '',
    apiKey: '',
    enabled: false,
    syncFrequency: 'manual'
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);
  const [exportHistory, setExportHistory] = useState<any[]>([]);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    entity: 'products',
    includeHeaders: true
  });
  const [isExporting, setIsExporting] = useState(false);

  // Carregar configurações e histórico
  useEffect(() => {
    const loadData = async () => {
      try {
        const config = await ExportService.getERPIntegrationConfig();
        setErpConfig(config);
        
        const history = await ExportService.getExportHistory();
        setExportHistory(history);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    loadData();
  }, []);

  const handleERPConfigChange = (field: keyof ERPIntegrationConfig, value: any) => {
    setErpConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveERPConfig = async () => {
    try {
      const configToSave = {
        apiUrl: erpConfig.apiUrl,
        apiKey: erpConfig.apiKey,
        enabled: erpConfig.enabled,
        syncFrequency: erpConfig.syncFrequency
      };
      
      await ExportService.saveERPIntegrationConfig(configToSave);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      alert('Erro ao salvar configurações. Por favor, tente novamente.');
    }
  };

  const handleSyncWithERP = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    
    try {
      const result = await ExportService.syncWithERP();
      setSyncResult(result);
      
      // Atualizar configurações após sincronização
      const updatedConfig = await ExportService.getERPIntegrationConfig();
      setErpConfig(updatedConfig);
    } catch (error) {
      console.error("Erro na sincronização:", error);
      setSyncResult({ success: false, message: 'Erro na sincronização com ERP' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportOptionsChange = (field: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({ ...prev, [field]: value }));
  };

  const handleExportData = async () => {
    setIsExporting(true);
    
    try {
      const blob = await ExportService.exportData(exportOptions);
      
      // Criar link para download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tintas-zanai-${exportOptions.entity}-${new Date().toISOString().split('T')[0]}.${exportOptions.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Adicionar ao histórico
      await ExportService.addToExportHistory({
        format: exportOptions.format,
        entity: exportOptions.entity,
        fileName: a.download
      });
      
      // Atualizar histórico
      const updatedHistory = await ExportService.getExportHistory();
      setExportHistory(updatedHistory);
      
      alert('Exportação concluída com sucesso!');
    } catch (error) {
      console.error("Erro na exportação:", error);
      alert('Erro na exportação. Por favor, tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'excel':
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'json':
        return <FileJson className="h-5 w-5 text-yellow-500" />;
      default:
        return <Database className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-cormorant font-bold">Exportação de Dados & ERP</h1>
        <p className="text-muted-foreground">Exporte dados e gerencie integração com sistemas ERP</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exportação de Dados */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Download className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-cormorant font-bold">Exportar Dados</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Tipo de Dado
              </label>
              <select
                value={exportOptions.entity}
                onChange={(e) => handleExportOptionsChange('entity', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="products">Produtos</option>
                <option value="quotes">Orçamentos</option>
                <option value="customers">Clientes</option>
                <option value="projects">Projetos</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Formato
              </label>
              <select
                value={exportOptions.format}
                onChange={(e) => handleExportOptionsChange('format', e.target.value as any)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
                <option value="pdf">PDF</option>
                <option value="json">JSON</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeHeaders"
                checked={exportOptions.includeHeaders}
                onChange={(e) => handleExportOptionsChange('includeHeaders', e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="includeHeaders" className="ml-2 text-sm text-foreground">
                Incluir cabeçalhos
              </label>
            </div>
            
            <button
              onClick={handleExportData}
              disabled={isExporting}
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Exportar Dados
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Integração com ERP */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-cormorant font-bold">Integração com ERP</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-foreground">Habilitar integração</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={erpConfig.enabled}
                  onChange={(e) => handleERPConfigChange('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            {erpConfig.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    URL da API do ERP
                  </label>
                  <input
                    type="text"
                    value={erpConfig.apiUrl}
                    onChange={(e) => handleERPConfigChange('apiUrl', e.target.value)}
                    placeholder="https://api.erp.com/v1"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Chave de API
                  </label>
                  <input
                    type="password"
                    value={erpConfig.apiKey}
                    onChange={(e) => handleERPConfigChange('apiKey', e.target.value)}
                    placeholder="Sua chave de API"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Frequência de Sincronização
                  </label>
                  <select
                    value={erpConfig.syncFrequency}
                    onChange={(e) => handleERPConfigChange('syncFrequency', e.target.value as any)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="manual">Manual</option>
                    <option value="daily">Diária</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleSaveERPConfig}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Salvar Configurações
                  </button>
                  
                  <button
                    onClick={handleSyncWithERP}
                    disabled={isSyncing}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 disabled:opacity-50"
                  >
                    {isSyncing ? (
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Sincronizar
                  </button>
                </div>
                
                {syncResult && (
                  <div className={`p-3 rounded-lg ${syncResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {syncResult.message}
                  </div>
                )}
                
                {erpConfig.lastSync && (
                  <div className="text-sm text-muted-foreground">
                    Última sincronização: {new Date(erpConfig.lastSync).toLocaleString('pt-BR')}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Histórico de Exportações */}
      <div className="mt-6 bg-card border border-border rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <History className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-cormorant font-bold">Histórico de Exportações</h2>
        </div>
        
        {exportHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-3 text-muted-foreground/20" />
            <p>Nenhuma exportação realizada ainda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/30">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Arquivo
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Formato
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {[...exportHistory].reverse().slice(0, 10).map((record, index) => (
                  <tr key={index} className="hover:bg-muted/10">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {getFormatIcon(record.format)}
                        <div className="ml-3">
                          <div className="text-sm font-medium">{record.fileName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {ExportService.getEntityLabel(record.entity)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {ExportService.getFormatLabel(record.format)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(record.timestamp).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}