import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState } from "react";
import { Server, Database, Network, Settings, RefreshCw, AlertTriangle } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Arquitetura do Sistema - ProRevest" },
    { name: "description", content: "Visualize e gerencie a arquitetura de microserviços e monolito modular" },
  ];
}

export default function AdminArchitecture() {
  const [activeView, setActiveView] = useState<"microservices" | "monolith">("microservices");
  
  // Dados simulados para microserviços
  const microservices = [
    { 
      id: "auth-service", 
      name: "Serviço de Autenticação", 
      status: "online", 
      version: "v2.1.4",
      endpoints: 12,
      lastUpdate: "2023-05-15"
    },
    { 
      id: "catalog-service", 
      name: "Serviço de Catálogo", 
      status: "online", 
      version: "v1.8.2",
      endpoints: 24,
      lastUpdate: "2023-05-18"
    },
    { 
      id: "quote-service", 
      name: "Serviço de Orçamentos", 
      status: "maintenance", 
      version: "v3.0.1",
      endpoints: 18,
      lastUpdate: "2023-05-20"
    },
    {
      id: "notification-service",
      name: "Serviço de Notificações", 
      status: "online", 
      version: "v2.3.0",
      endpoints: 8,
      lastUpdate: "2023-05-22"
    },
    { 
      id: "reporting-service", 
      name: "Serviço de Relatórios", 
      status: "online", 
      version: "v1.9.5",
      endpoints: 32,
      lastUpdate: "2023-05-12"
    },
  ];
  
  // Dados simulados para monolito
  const monolithModules = [
    { 
      id: "user-module", 
      name: "Módulo de Usuários", 
      status: "active", 
      version: "v1.2.3",
      components: 15,
      lastUpdate: "2023-05-15"
    },
    { 
      id: "product-module", 
      name: "Módulo de Produtos", 
      status: "active", 
      version: "v1.4.1",
      components: 22,
      lastUpdate: "2023-05-18"
    },
    { 
      id: "project-module", 
      name: "Módulo de Projetos", 
      status: "active", 
      version: "v1.1.8",
      components: 18,
      lastUpdate: "2023-05-20"
    },
    { 
      id: "admin-module", 
      name: "Módulo Administrativo", 
      status: "active", 
      version: "v1.3.2",
      components: 28,
      lastUpdate: "2023-05-10"
    },
  ];

  const handleRestartService = (serviceId: string) => {
    // Em uma implementação real, aqui reiniciaríamos o serviço
    console.log(`Reiniciando serviço: ${serviceId}`);
    alert(`Serviço ${serviceId} reiniciado com sucesso!`);
  };

  const handleUpdateService = (serviceId: string) => {
    // Em uma implementação real, aqui atualizaríamos o serviço
    console.log(`Atualizando serviço: ${serviceId}`);
    alert(`Atualização do serviço ${serviceId} iniciada!`);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-cormorant font-bold">Arquitetura do Sistema</h1>
        <p className="text-muted-foreground">Visualize e gerencie a arquitetura de microserviços e monolito modular</p>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveView("microservices")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeView === "microservices"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          <Server className="h-5 w-5 inline mr-2" />
          Microserviços
        </button>
        <button
          onClick={() => setActiveView("monolith")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeView === "monolith"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          <Database className="h-5 w-5 inline mr-2" />
          Monolito Modular
        </button>
      </div>

      {activeView === "microservices" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de Microserviços */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
              <Server className="h-5 w-5 mr-2 text-primary" />
              Microserviços Ativos
            </h2>
            
            <div className="space-y-4">
              {microservices.map((service) => (
                <div key={service.id} className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-foreground">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {service.id}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      service.status === "online" 
                        ? "bg-green-100 text-green-800" 
                        : service.status === "maintenance"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {service.status === "online" ? "Online" : service.status === "maintenance" ? "Manutenção" : "Offline"}
                    </span>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Versão:</span>
                      <span className="ml-2 font-medium">{service.version}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Endpoints:</span>
                      <span className="ml-2 font-medium">{service.endpoints}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Última atualização:</span>
                      <span className="ml-2 font-medium">{service.lastUpdate}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleRestartService(service.id)}
                      className="flex items-center text-sm text-foreground hover:text-foreground/80"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Reiniciar
                    </button>
                    <button
                      onClick={() => handleUpdateService(service.id)}
                      className="flex items-center text-sm text-foreground hover:text-foreground/80"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Atualizar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Diagrama de Arquitetura */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
              <Network className="h-5 w-5 mr-2 text-primary" />
              Diagrama de Arquitetura
            </h2>
            
            <div className="border border-border rounded-lg p-4 bg-muted/10 min-h-[400px] relative">
              {/* Representação simplificada do diagrama de arquitetura */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-16 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center">
                <span className="text-xs font-medium text-primary">API Gateway</span>
              </div>
              
              <div className="absolute top-24 left-1/4 transform -translate-x-1/2 w-28 h-14 bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-center">
                <span className="text-xs font-medium text-blue-800">Auth Service</span>
              </div>
              
              <div className="absolute top-24 right-1/4 transform translate-x-1/2 w-28 h-14 bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-center">
                <span className="text-xs font-medium text-blue-800">Catalog Service</span>
              </div>
              
              <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-28 h-14 bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-center">
                <span className="text-xs font-medium text-blue-800">Quote Service</span>
              </div>
              
              <div className="absolute top-56 right-1/3 transform translate-x-1/2 w-28 h-14 bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-center">
                <span className="text-xs font-medium text-blue-800">Notification Service</span>
              </div>
              
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-28 h-14 bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-center">
                <span className="text-xs font-medium text-blue-800">Reporting Service</span>
              </div>
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-16 bg-green-100 border border-green-300 rounded-lg flex items-center justify-center">
                <span className="text-xs font-medium text-green-800">Database Cluster</span>
              </div>
              
              {/* Conexões */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="50%" y1="20%" x2="25%" y2="24%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="50%" y1="20%" x2="75%" y2="24%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="50%" y1="20%" x2="50%" y2="40%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="50%" y1="40%" x2="33%" y2="56%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="50%" y1="40%" x2="67%" y2="56%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="50%" y1="60%" x2="50%" y2="80%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="5,5" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de Módulos do Monolito */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
              <Database className="h-5 w-5 mr-2 text-primary" />
              Módulos do Monolito
            </h2>
            
            <div className="space-y-4">
              {monolithModules.map((module) => (
                <div key={module.id} className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-foreground">{module.name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {module.id}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      module.status === "active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {module.status === "active" ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Versão:</span>
                      <span className="ml-2 font-medium">{module.version}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Componentes:</span>
                      <span className="ml-2 font-medium">{module.components}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Última atualização:</span>
                      <span className="ml-2 font-medium">{module.lastUpdate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Estrutura do Monolito */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-primary" />
              Estrutura do Monolito
            </h2>
            
            <div className="border border-border rounded-lg p-4 bg-muted/10 min-h-[400px]">
              <div className="space-y-4">
                <div className="p-3 bg-white border border-border rounded-lg">
                  <h3 className="font-medium text-foreground">Camada de Apresentação</h3>
                  <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                    <li>• Controladores REST</li>
                    <li>• DTOs (Data Transfer Objects)</li>
                    <li>• Validadores de entrada</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-white border border-border rounded-lg">
                  <h3 className="font-medium text-foreground">Camada de Aplicação</h3>
                  <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                    <li>• Casos de uso</li>
                    <li>• Serviços de aplicação</li>
                    <li>• Mapeadores de dados</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-white border border-border rounded-lg">
                  <h3 className="font-medium text-foreground">Camada de Domínio</h3>
                  <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                    <li>• Entidades de domínio</li>
                    <li>• Repositórios</li>
                    <li>• Serviços de domínio</li>
                    <li>• Objetos de valor</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-white border border-border rounded-lg">
                  <h3 className="font-medium text-foreground">Camada de Infraestrutura</h3>
                  <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                    <li>• Adaptadores de persistência</li>
                    <li>• Configurações</li>
                    <li>• Utilitários</li>
                    <li>• Integrações externas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Informações adicionais */}
      <div className="mt-6 bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
          Sobre a Arquitetura
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Arquitetura Híbrida</h3>
            <p className="text-sm text-muted-foreground">
              O sistema utiliza uma arquitetura híbrida que combina microserviços para funcionalidades específicas 
              com um monolito modular para componentes compartilhados. Isso proporciona escalabilidade, manutenibilidade 
              e tempo de desenvolvimento otimizado.
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Benefícios</h3>
            <p className="text-sm text-muted-foreground">
              • Escalabilidade independente de serviços<br/>
              • Facilidade de manutenção e atualização<br/>
              • Desenvolvimento paralelo por equipes<br/>
              • Resiliência e tolerância a falhas<br/>
              • Reutilização de módulos no monolito
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}