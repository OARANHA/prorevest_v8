import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState } from "react";
import { FileText, Signature, Link, Settings, AlertCircle, CheckCircle, Upload } from "lucide-react";
import { QuoteService, type Quote } from "../../services/quoteService";

export const meta: MetaFunction = () => {
  return [
    { title: "Assinatura Digital - ProRevest" },
    { name: "description", content: "Gerencie a assinatura digital de orçamentos com integração DocuSign/Clicksign" },
  ];
}

export default function DigitalSignature() {
  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: "quote-001",
      user_id: "user-123",
      status: "sent",
      notes: "Orçamento para projeto residencial",
      customer_name: "João Silva",
      customer_email: "joao.silva@example.com",
      subtotal: 1200,
      discount: 100,
      total: 1100,
      items: [],
      created_at: "2023-06-15T10:30:00Z",
      updated_at: "2023-06-15T10:30:00Z"
    },
    {
      id: "quote-002",
      user_id: "user-456",
      status: "approved",
      notes: "Orçamento para projeto comercial",
      customer_name: "Maria Santos",
      customer_email: "maria.santos@example.com",
      subtotal: 850,
      discount: 0,
      total: 850,
      items: [],
      created_at: "2023-06-10T09:15:00Z",
      updated_at: "2023-06-12T11:30:00Z"
    },
    {
      id: "quote-003",
      user_id: "user-789",
      status: "signed",
      notes: "Orçamento para reforma",
      customer_name: "Carlos Oliveira",
      customer_email: "carlos.oliveira@example.com",
      subtotal: 2500,
      discount: 250,
      total: 2250,
      items: [],
      created_at: "2023-06-18T16:45:00Z",
      updated_at: "2023-06-20T14:20:00Z"
    }
  ]);
  
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [signatureProvider, setSignatureProvider] = useState("docusign");
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");

  const handleSendForSignature = async (quoteId: string) => {
    try {
      // Em uma implementação real, aqui enviaria o orçamento para assinatura digital
      const updatedQuotes = quotes.map(quote => 
        quote.id === quoteId ? { ...quote, status: "sent" as const } : quote
      );
      
      setQuotes(updatedQuotes);
      alert(`Orçamento ${quoteId} enviado para assinatura digital com sucesso!`);
    } catch (error) {
      console.error("Erro ao enviar orçamento para assinatura:", error);
      alert("Erro ao enviar orçamento para assinatura digital.");
    }
  };

  const handleViewDocument = (quoteId: string) => {
    // Em uma implementação real, aqui abriria o documento do orçamento
    alert(`Visualizando documento do orçamento ${quoteId}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <FileText className="h-5 w-5 text-gray-500" />;
      case "sent":
        return <Upload className="h-5 w-5 text-blue-500" />;
      case "approved":
        return <CheckCircle className="h-5 w-5 text-yellow-500" />;
      case "signed":
        return <Signature className="h-5 w-5 text-green-500" />;
      case "archived":
        return <FileText className="h-5 w-5 text-gray-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Rascunho</span>;
      case "sent":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Enviado</span>;
      case "approved":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Aprovado</span>;
      case "signed":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Assinado</span>;
      case "archived":
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Arquivado</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Desconhecido</span>;
    }
  };

  const handleSaveSettings = () => {
    // Em uma implementação real, aqui salvaria as configurações
    alert("Configurações salvas com sucesso!");
    setShowSettings(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-cormorant font-bold">Assinatura Digital</h1>
            <p className="text-muted-foreground">Gerencie a assinatura digital de orçamentos com integração DocuSign/Clicksign</p>
          </div>
          <button 
            onClick={() => setShowSettings(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center"
          >
            <Settings className="mr-2 h-5 w-5" />
            Configurações
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-gray-500/10 rounded-lg">
              <FileText className="h-6 w-6 text-gray-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Total de Orçamentos</p>
              <p className="text-2xl font-bold">{quotes.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Upload className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Enviados</p>
              <p className="text-2xl font-bold">{quotes.filter(q => q.status === "sent").length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <CheckCircle className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Aprovados</p>
              <p className="text-2xl font-bold">{quotes.filter(q => q.status === "approved").length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Signature className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Assinados</p>
              <p className="text-2xl font-bold">{quotes.filter(q => q.status === "signed").length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-gray-500/10 rounded-lg">
              <FileText className="h-6 w-6 text-gray-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Rascunhos</p>
              <p className="text-2xl font-bold">{quotes.filter(q => q.status === "draft").length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de orçamentos */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold">Orçamentos para Assinatura</h2>
        </div>
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                ID do Orçamento
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Notas
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Data de Criação
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {quotes.map((quote) => (
              <tr key={quote.id} className="hover:bg-muted/10">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium">{quote.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">
                  {quote.notes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(quote.status)}
                    <div className="ml-2">
                      {getStatusBadge(quote.status)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                  {new Date(quote.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleViewDocument(quote.id)}
                    className="text-primary hover:text-primary/80 mr-3"
                  >
                    Visualizar
                  </button>
                  {quote.status !== "signed" && (
                    <button 
                      onClick={() => handleSendForSignature(quote.id)}
                      className="text-foreground hover:text-foreground/80"
                    >
                      Enviar para Assinatura
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {quotes.length === 0 && (
        <div className="text-center py-12">
          <Signature className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium">Nenhum orçamento encontrado</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Não há orçamentos disponíveis para assinatura digital.
          </p>
        </div>
      )}

      {/* Modal de configurações */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-xl font-semibold">Configurações de Assinatura Digital</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Provedor de Assinatura
                </label>
                <select
                  value={signatureProvider}
                  onChange={(e) => setSignatureProvider(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="docusign">DocuSign</option>
                  <option value="clicksign">Clicksign</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Insira sua API Key"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Endpoint da API
                </label>
                <input
                  type="text"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://api.docusign.net/restapi/v2"
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="ml-2">
                    <p className="text-sm text-blue-800">
                      <strong>Importante:</strong> Certifique-se de que as credenciais da API estão corretas e que você tem permissões adequadas no provedor de assinatura escolhido.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end space-x-3">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted/50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
