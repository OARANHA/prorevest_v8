import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState } from "react";
import { Link, Code, Zap, Key, Eye, EyeOff, Copy, RefreshCw } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "API e Webhooks - ProRevest" },
    { name: "description", content: "Gerencie a API RESTful e Webhooks para integração com máquinas, ERPs e WhatsApp Business" },
  ];
}

export default function AdminApiWebhooks() {
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: "ERP Integration", key: "sk_live_51J...", created: "2023-01-15", status: "active" },
    { id: 2, name: "Machine Integration", key: "sk_live_72K...", created: "2023-03-22", status: "active" },
    { id: 3, name: "WhatsApp Business", key: "sk_test_83L...", created: "2023-05-10", status: "inactive" },
  ]);
  
  const [webhooks, setWebhooks] = useState([
    { id: 1, name: "Order Status Update", url: "https://erp.example.com/webhook", events: ["order.created", "order.updated"], status: "active" },
    { id: 3, name: "Quote Expiration", url: "https://notifications.example.com/quote", events: ["quote.expired"], status: "inactive" },
  ]);
  
  const [showKey, setShowKey] = useState<number | null>(null);
  const [newApiKey, setNewApiKey] = useState({ name: "", permissions: [] });
  const [newWebhook, setNewWebhook] = useState({ name: "", url: "", events: [] as string[] });

  const handleCreateApiKey = () => {
    // Em uma implementação real, criaríamos uma nova chave de API no backend
    console.log("Criando nova chave de API:", newApiKey);
    alert("Chave de API criada com sucesso!");
    setNewApiKey({ name: "", permissions: [] });
  };

  const handleCreateWebhook = () => {
    // Em uma implementação real, criaríamos um novo webhook no backend
    console.log("Criando novo webhook:", newWebhook);
    alert("Webhook criado com sucesso!");
    setNewWebhook({ name: "", url: "", events: [] });
  };

  const handleToggleApiKeyStatus = (id: number) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, status: key.status === "active" ? "inactive" : "active" } : key
    ));
  };

  const handleToggleWebhookStatus = (id: number) => {
    setWebhooks(webhooks.map(hook => 
      hook.id === id ? { ...hook, status: hook.status === "active" ? "inactive" : "active" } : hook
    ));
  };

  const handleDeleteApiKey = (id: number) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    alert("Chave de API excluída com sucesso!");
  };

  const handleDeleteWebhook = (id: number) => {
    setWebhooks(webhooks.filter(hook => hook.id !== id));
    alert("Webhook excluído com sucesso!");
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    alert("Chave copiada para a área de transferência!");
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-cormorant font-bold">API e Webhooks</h1>
        <p className="text-muted-foreground">Gerencie a API RESTful e Webhooks para integração com máquinas, ERPs e WhatsApp Business</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chaves de API */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-cormorant font-bold flex items-center">
              <Key className="h-5 w-5 mr-2 text-primary" />
              Chaves de API
            </h2>
            <button
              onClick={handleCreateApiKey}
              className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Nova Chave
            </button>
          </div>
          
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <div key={key.id} className="border border-border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-foreground">{key.name}</h3>
                    <p className="text-sm text-muted-foreground">Criada em: {key.created}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    key.status === "active" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {key.status === "active" ? "Ativa" : "Inativa"}
                  </span>
                </div>
                
                <div className="mt-3 flex items-center">
                  <code className="flex-1 text-sm bg-muted/50 p-2 rounded truncate">
                    {showKey === key.id ? key.key : key.key.replace(/.(?=.{4})/g, '*')}
                  </code>
                  <button 
                    onClick={() => setShowKey(showKey === key.id ? null : key.id)}
                    className="ml-2 p-2 text-muted-foreground hover:text-foreground"
                  >
                    {showKey === key.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button 
                    onClick={() => handleCopyKey(key.key)}
                    className="ml-2 p-2 text-muted-foreground hover:text-foreground"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => handleToggleApiKeyStatus(key.id)}
                    className="text-sm text-foreground hover:text-foreground/80"
                  >
                    {key.status === "active" ? "Desativar" : "Ativar"}
                  </button>
                  <button
                    onClick={() => handleDeleteApiKey(key.id)}
                    className="text-sm text-destructive hover:text-destructive/80"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Webhooks */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-cormorant font-bold flex items-center">
              <Zap className="h-5 w-5 mr-2 text-primary" />
              Webhooks
            </h2>
            <button
              onClick={handleCreateWebhook}
              className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Novo Webhook
            </button>
          </div>
          
          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="border border-border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-foreground">{webhook.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{webhook.url}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    webhook.status === "active" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {webhook.status === "active" ? "Ativo" : "Inativo"}
                  </span>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground mb-1">Eventos:</p>
                  <div className="flex flex-wrap gap-1">
                    {webhook.events.map((event, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => handleToggleWebhookStatus(webhook.id)}
                    className="text-sm text-foreground hover:text-foreground/80"
                  >
                    {webhook.status === "active" ? "Desativar" : "Ativar"}
                  </button>
                  <button
                    onClick={() => handleDeleteWebhook(webhook.id)}
                    className="text-sm text-destructive hover:text-destructive/80"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Documentação da API */}
      <div className="mt-6 bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
          <Code className="h-5 w-5 mr-2 text-primary" />
          Documentação da API
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Autenticação</h3>
            <p className="text-sm text-muted-foreground">
              Todas as requisições da API devem incluir um cabeçalho de autorização com sua chave de API.
            </p>
            <pre className="mt-2 text-xs bg-muted/50 p-2 rounded overflow-x-auto">
              Authorization: Bearer {"<sua-chave-de-api>"}
            </pre>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Endpoints Principais</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• GET /api/products - Listar produtos</li>
              <li>• POST /api/quotes - Criar orçamento</li>
              <li>• POST /api/orders - Criar pedido</li>
            </ul>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Webhooks</h3>
            <p className="text-sm text-muted-foreground">
              Nossos webhooks enviam notificações em tempo real para URLs configuradas quando eventos ocorrem.
            </p>
            <button className="mt-2 text-sm text-primary hover:text-primary/80 flex items-center">
              <Link className="h-4 w-4 mr-1" />
              Ver documentação completa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}