import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState } from "react";
import { TestTube, Zap, BarChart2, Smartphone, Monitor, CheckCircle, XCircle, AlertTriangle, Play } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Testes Finais - ProRevest" },
    { name: "description", content: "Realize testes finais e otimize o ecossistema digital" },
  ];
}

export default function AdminFinalTesting() {
  const [testResults, setTestResults] = useState([
    { id: 1, name: "Teste de Usabilidade", status: "passed", details: "95% dos usuários concluíram tarefas com sucesso" },
    { id: 2, name: "Teste de Performance", status: "warning", details: "Tempo de carregamento médio: 2.3s (meta: <2s)" },
    { id: 3, name: "Teste de Compatibilidade", status: "passed", details: "Compatível com todos os navegadores modernos" },
    { id: 4, name: "Teste de Segurança", status: "passed", details: "Nenhuma vulnerabilidade crítica encontrada" },
    { id: 5, name: "Teste de Acessibilidade", status: "failed", details: "Contraste insuficiente em alguns elementos" },
    { id: 6, name: "Teste de Integração", status: "passed", details: "Todas as integrações funcionando corretamente" },
  ]);
  
  const [optimizationTasks, setOptimizationTasks] = useState([
    { id: 1, name: "Otimizar imagens", status: "pending", progress: 0 },
    { id: 2, name: "Minificar CSS/JS", status: "pending", progress: 0 },
    { id: 3, name: "Configurar CDN", status: "pending", progress: 0 },
    { id: 4, name: "Implementar cache", status: "pending", progress: 0 },
  ]);
  
  const [deviceTesting, setDeviceTesting] = useState([
    { id: 1, device: "iPhone 14", status: "passed" },
    { id: 2, device: "Samsung Galaxy S23", status: "passed" },
    { id: 3, device: "iPad Pro", status: "passed" },
    { id: 4, device: "MacBook Pro", status: "passed" },
    { id: 5, device: "Windows PC", status: "warning" },
    { id: 6, device: "Android Tablet", status: "pending" },
  ]);

  const handleRunTest = (testId: number) => {
    // Em uma implementação real, executaríamos o teste específico
    console.log(`Executando teste: ${testId}`);
    alert(`Teste ${testId} iniciado!`);
  };

  const handleRunAllTests = () => {
    // Em uma implementação real, executaríamos todos os testes
    console.log("Executando todos os testes");
    alert("Todos os testes foram iniciados!");
  };

  const handleOptimize = (taskId: number) => {
    // Em uma implementação real, executaríamos a tarefa de otimização
    setOptimizationTasks(optimizationTasks.map(task => 
      task.id === taskId 
        ? { ...task, status: "running", progress: Math.min(task.progress + 25, 100) } 
        : task
    ));
    
    // Simular conclusão da tarefa
    setTimeout(() => {
      setOptimizationTasks(optimizationTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: "completed", progress: 100 } 
          : task
      ));
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed": return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "running": return <Play className="h-5 w-5 text-blue-500 animate-pulse" />;
      case "completed": return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Play className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "passed": return "bg-green-100 text-green-800";
      case "failed": return "bg-red-100 text-red-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "running": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-cormorant font-bold">Testes Finais e Otimização</h1>
        <p className="text-muted-foreground">Realize testes finais e otimize o ecossistema digital</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resultados dos Testes */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-cormorant font-bold flex items-center">
              <TestTube className="h-5 w-5 mr-2 text-primary" />
              Resultados dos Testes
            </h2>
            <button
              onClick={handleRunAllTests}
              className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Executar Todos
            </button>
          </div>
          
          <div className="space-y-4">
            {testResults.map((test) => (
              <div key={test.id} className="border border-border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-foreground">{test.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{test.details}</p>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(test.status)}
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(test.status)}`}>
                      {test.status === "passed" ? "Passou" : test.status === "failed" ? "Falhou" : test.status === "warning" ? "Aviso" : "Pendente"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleRunTest(test.id)}
                  className="mt-3 text-sm text-primary hover:text-primary/80 flex items-center"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Executar Teste
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Tarefas de Otimização */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-primary" />
            Tarefas de Otimização
          </h2>
          
          <div className="space-y-4">
            {optimizationTasks.map((task) => (
              <div key={task.id} className="border border-border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-foreground">{task.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(task.status)}`}>
                    {task.status === "pending" ? "Pendente" : task.status === "running" ? "Executando" : "Concluído"}
                  </span>
                </div>
                
                {task.status !== "pending" && (
                  <div className="mt-3">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground text-right">{task.progress}%</p>
                  </div>
                )}
                
                <button
                  onClick={() => handleOptimize(task.id)}
                  disabled={task.status === "running" || task.status === "completed"}
                  className={`mt-3 w-full flex items-center justify-center px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    task.status === "running" || task.status === "completed"
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  <Zap className="h-4 w-4 mr-1" />
                  {task.status === "completed" ? "Concluído" : "Otimizar"}
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Testes por Dispositivo */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <Smartphone className="h-5 w-5 mr-2 text-primary" />
            Testes por Dispositivo
          </h2>
          
          <div className="space-y-4">
            {deviceTesting.map((device) => (
              <div key={device.id} className="flex items-center justify-between border border-border rounded-lg p-3">
                <div className="flex items-center">
                  {device.device.includes("iPhone") || device.device.includes("iPad") ? (
                    <Smartphone className="h-5 w-5 text-foreground mr-3" />
                  ) : device.device.includes("MacBook") ? (
                    <Monitor className="h-5 w-5 text-foreground mr-3" />
                  ) : (
                    <Monitor className="h-5 w-5 text-foreground mr-3" />
                  )}
                  <span className="font-medium text-foreground">{device.device}</span>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(device.status)}
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(device.status)}`}>
                    {device.status === "passed" ? "Passou" : device.status === "failed" ? "Falhou" : device.status === "warning" ? "Aviso" : "Pendente"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Métricas de Performance */}
      <div className="mt-6 bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
          <BarChart2 className="h-5 w-5 mr-2 text-primary" />
          Métricas de Performance
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted-foreground">Tempo de Carregamento</p>
                <p className="text-xl font-bold text-foreground">2.1s</p>
              </div>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                <p className="text-xl font-bold text-foreground">98.7%</p>
              </div>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Smartphone className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted-foreground">Compatibilidade</p>
                <p className="text-xl font-bold text-foreground">95%</p>
              </div>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted-foreground">Problemas Encontrados</p>
                <p className="text-xl font-bold text-foreground">3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}