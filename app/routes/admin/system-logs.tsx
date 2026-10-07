import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { Activity, AlertTriangle, Info, Search, Filter, Download, Eye } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Logs e Monitoramento - ProRevest" },
    { name: "description", content: "Visualize e monitore os logs do sistema em tempo real" },
  ];
}

export default function AdminSystemLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [logLevel, setLogLevel] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Dados simulados de logs
  const sampleLogs = [
    { id: 1, timestamp: "2023-05-22 14:30:15", level: "info", service: "auth-service", message: "Usuário Carlos Silva fez login com sucesso" },
    { id: 2, timestamp: "2023-05-22 14:28:42", level: "warning", service: "quote-service", message: "Orçamento #12345 próximo do vencimento" },
    { id: 4, timestamp: "2023-05-22 14:22:18", level: "info", service: "catalog-service", message: "Novo produto adicionado: Tinta Acrílica Premium" },
    { id: 5, timestamp: "2023-05-22 14:20:05", level: "info", service: "notification-service", message: "E-mail de orçamento enviado para cliente@exemplo.com" },
    { id: 6, timestamp: "2023-05-22 14:18:51", level: "error", service: "auth-service", message: "Falha de autenticação para usuário inexistente" },
    { id: 7, timestamp: "2023-05-22 14:15:27", level: "warning", service: "reporting-service", message: "Relatório de vendas demorou mais que o esperado para gerar" },
  ];

  useEffect(() => {
    // Simular carregamento inicial de logs
    setLogs(sampleLogs);
    setFilteredLogs(sampleLogs);
  }, []);

  useEffect(() => {
    // Filtrar logs com base no nível e termo de busca
    let result = logs;
    
    if (logLevel !== "all") {
      result = result.filter(log => log.level === logLevel);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(log => 
        log.service.toLowerCase().includes(term) || 
        log.message.toLowerCase().includes(term)
      );
    }
    
    setFilteredLogs(result);
  }, [logs, logLevel, searchTerm]);

  useEffect(() => {
    // Simular atualização automática de logs
    let interval: NodeJS.Timeout;
    
    if (autoRefresh) {
      interval = setInterval(() => {
        // Em uma implementação real, buscaríamos novos logs do backend
        // Aqui estamos apenas simulando novos logs ocasionalmente
        if (Math.random() > 0.7) {
          const newLog = {
            id: logs.length + 1,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            level: ["info", "warning", "error"][Math.floor(Math.random() * 3)],
            service: ["auth-service", "catalog-service", "quote-service"][Math.floor(Math.random() * 3)],
            message: [
              "Operação realizada com sucesso",
              "Aviso de desempenho",
              "Erro inesperado no processamento",
              "Nova atividade registrada"
            ][Math.floor(Math.random() * 4)]
          };
          
          setLogs(prev => [newLog, ...prev]);
        }
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, logs.length]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info": return <Info className="h-4 w-4 text-blue-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLevelClass = (level: string) => {
    switch (level) {
      case "error": return "text-red-600 bg-red-50";
      case "warning": return "text-yellow-600 bg-yellow-50";
      case "info": return "text-blue-600 bg-blue-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const handleExportLogs = () => {
    // Em uma implementação real, exportaríamos os logs para um arquivo
    console.log("Exportando logs:", filteredLogs);
    alert("Logs exportados com sucesso!");
  };

  const handleClearLogs = () => {
    setLogs([]);
    setFilteredLogs([]);
    alert("Logs limpos com sucesso!");
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-cormorant font-bold">Logs e Monitoramento</h1>
        <p className="text-muted-foreground">Visualize e monitore os logs do sistema em tempo real</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Painel de Controle */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-primary" />
            Controle
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nível de Log
              </label>
              <select
                value={logLevel}
                onChange={(e) => setLogLevel(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Todos os níveis</option>
                <option value="info">Informação</option>
                <option value="warning">Aviso</option>
                <option value="error">Erro</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Buscar por serviço ou mensagem..."
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
              <span className="ml-3 text-sm font-medium text-foreground">
                Atualização automática
              </span>
            </div>
            
            <div className="flex space-x-2 pt-2">
              <button
                onClick={handleExportLogs}
                className="flex-1 flex items-center justify-center bg-primary text-primary-foreground px-3 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
              >
                <Download className="h-4 w-4 mr-1" />
                Exportar
              </button>
              <button
                onClick={handleClearLogs}
                className="flex-1 flex items-center justify-center bg-destructive text-destructive-foreground px-3 py-2 rounded-lg font-medium hover:bg-destructive/90 transition-colors text-sm"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>
        
        {/* Lista de Logs */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm lg:col-span-3">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-primary" />
            Logs do Sistema
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/30">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Nível
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Serviço
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Mensagem
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Data/Hora
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/10">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelClass(log.level)}`}>
                        {getLevelIcon(log.level)}
                        <span className="ml-1 capitalize">{log.level}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {log.service}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {log.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {log.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">Nenhum log encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Não há logs que correspondam aos filtros aplicados.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Métricas de Sistema */}
      <div className="mt-6 bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-cormorant font-bold mb-4">Métricas de Sistema</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted-foreground">Requisições/min</p>
                <p className="text-xl font-bold text-foreground">1,248</p>
              </div>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Info className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                <p className="text-xl font-bold text-foreground">98.7%</p>
              </div>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted-foreground">Avisos</p>
                <p className="text-xl font-bold text-foreground">24</p>
              </div>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted-foreground">Erros</p>
                <p className="text-xl font-bold text-foreground">3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}