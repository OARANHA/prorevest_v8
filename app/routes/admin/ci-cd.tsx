import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState } from "react";
import { Play, Pause, RotateCcw, GitBranch, GitCommit, Server, Activity, CheckCircle, XCircle, Clock } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "CI/CD Pipeline - ProRevest" },
    { name: "description", content: "Configure e monitore o pipeline de integração contínua e entrega contínua" },
  ];
}

export default function AdminCiCd() {
  const [pipelineStatus, setPipelineStatus] = useState("running");
  const [deployments, setDeployments] = useState([
    { id: 1, branch: "main", status: "success", commit: "a1b2c3d", author: "Carlos Silva", time: "2023-05-22 14:30:00" },
    { id: 2, branch: "develop", status: "running", commit: "e4f5g6h", author: "Ana Costa", time: "2023-05-22 14:25:00" },
    { id: 3, branch: "feature/new-feature", status: "failed", commit: "i7j8k9l", author: "Roberto Lima", time: "2023-05-22 14:15:00" },
    { id: 4, branch: "main", status: "success", commit: "m0n1o2p", author: "Carlos Silva", time: "2023-05-22 14:00:00" },
  ]);
  
  const [pipelineConfig, setPipelineConfig] = useState({
    provider: "github",
    autoDeploy: true,
    runTests: true,
    codeQualityChecks: true,
    notifications: true
  });

  const handleStartPipeline = () => {
    setPipelineStatus("running");
    alert("Pipeline iniciado com sucesso!");
  };

  const handlePausePipeline = () => {
    setPipelineStatus("paused");
    alert("Pipeline pausado!");
  };

  const handleRestartPipeline = () => {
    setPipelineStatus("running");
    alert("Pipeline reiniciado!");
  };

  const handleSaveConfig = () => {
    // Em uma implementação real, salvaríamos essas configurações no banco de dados
    console.log("Configurações de pipeline salvas:", pipelineConfig);
    alert("Configurações de pipeline salvas com sucesso!");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed": return <XCircle className="h-5 w-5 text-red-500" />;
      case "running": return <Activity className="h-5 w-5 text-blue-500 animate-pulse" />;
      case "pending": return <Clock className="h-5 w-5 text-yellow-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "success": return "Sucesso";
      case "failed": return "Falhou";
      case "running": return "Executando";
      case "pending": return "Pendente";
      default: return "Desconhecido";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-cormorant font-bold">CI/CD Pipeline</h1>
        <p className="text-muted-foreground">Configure e monitore o pipeline de integração contínua e entrega contínua</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controles do Pipeline */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <Server className="h-5 w-5 mr-2 text-primary" />
            Controles do Pipeline
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-foreground">Status do Pipeline</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                pipelineStatus === "running" 
                  ? "bg-green-100 text-green-800" 
                  : pipelineStatus === "paused"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}>
                {pipelineStatus === "running" ? "Executando" : pipelineStatus === "paused" ? "Pausado" : "Desconhecido"}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleStartPipeline}
                disabled={pipelineStatus === "running"}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  pipelineStatus === "running"
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                <Play className="h-5 w-5 mr-2" />
                Iniciar
              </button>
              
              <button
                onClick={handlePausePipeline}
                disabled={pipelineStatus === "paused"}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  pipelineStatus === "paused"
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                }`}
              >
                <Pause className="h-5 w-5 mr-2" />
                Pausar
              </button>
              
              <button
                onClick={handleRestartPipeline}
                className="flex-1 flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reiniciar
              </button>
            </div>
            
            <div className="pt-4 border-t border-border">
              <h3 className="font-medium text-foreground mb-3">Último Deploy</h3>
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center">
                  {getStatusIcon(deployments[0].status)}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-foreground">{deployments[0].branch}</p>
                    <p className="text-xs text-muted-foreground">Commit: {deployments[0].commit.substring(0, 7)}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Por {deployments[0].author} em {new Date(deployments[0].time).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Configurações do Pipeline */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <GitBranch className="h-5 w-5 mr-2 text-primary" />
            Configurações do Pipeline
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Provedor de CI/CD
              </label>
              <select
                value={pipelineConfig.provider}
                onChange={(e) => setPipelineConfig({...pipelineConfig, provider: e.target.value})}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="github">GitHub Actions</option>
                <option value="gitlab">GitLab CI</option>
                <option value="jenkins">Jenkins</option>
                <option value="circleci">CircleCI</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pipelineConfig.autoDeploy}
                  onChange={(e) => setPipelineConfig({...pipelineConfig, autoDeploy: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
              <span className="ml-3 text-sm font-medium text-foreground">
                Deploy automático após testes
              </span>
            </div>
            
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pipelineConfig.runTests}
                  onChange={(e) => setPipelineConfig({...pipelineConfig, runTests: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
              <span className="ml-3 text-sm font-medium text-foreground">
                Executar testes automatizados
              </span>
            </div>
            
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pipelineConfig.codeQualityChecks}
                  onChange={(e) => setPipelineConfig({...pipelineConfig, codeQualityChecks: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
              <span className="ml-3 text-sm font-medium text-foreground">
                Verificações de qualidade de código
              </span>
            </div>
            
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pipelineConfig.notifications}
                  onChange={(e) => setPipelineConfig({...pipelineConfig, notifications: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
              <span className="ml-3 text-sm font-medium text-foreground">
                Notificações de status
              </span>
            </div>
            
            <div className="pt-4">
              <button
                onClick={handleSaveConfig}
                className="w-full flex items-center justify-center bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <GitBranch className="h-5 w-5 mr-2" />
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
        
        {/* Histórico de Deployments */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-primary" />
            Histórico de Deployments
          </h2>
          
          <div className="space-y-3">
            {deployments.map((deployment) => (
              <div key={deployment.id} className="border border-border rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      {getStatusIcon(deployment.status)}
                      <span className="ml-2 text-sm font-medium text-foreground">{deployment.branch}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Commit: {deployment.commit} por {deployment.author}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(deployment.time).toLocaleTimeString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Métricas do Pipeline */}
      <div className="mt-6 bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-cormorant font-bold mb-4">Métricas do Pipeline</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted-foreground">Deploys bem-sucedidos</p>
                <p className="text-xl font-bold text-foreground">42</p>
              </div>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted-foreground">Deploys falhos</p>
                <p className="text-xl font-bold text-foreground">3</p>
              </div>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted-foreground">Tempo médio de deploy</p>
                <p className="text-xl font-bold text-foreground">8m 24s</p>
              </div>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <GitCommit className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted-foreground">Commits esta semana</p>
                <p className="text-xl font-bold text-foreground">27</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}