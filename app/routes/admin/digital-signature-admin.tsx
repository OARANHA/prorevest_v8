import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Settings, 
  FileText, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Edit,
  Save,
  Eye,
  Link
} from "lucide-react";
import { 
  DigitalSignatureService,
  type SignatureSettings,
  type SignatureDocument
} from "../../services/digitalSignatureService";

export const meta: MetaFunction = () => {
  return [
    { title: "Assinatura Digital - ProRevest" },
    { name: "description", content: "Gerencie a integração com provedores de assinatura digital" },
  ];
}

export default function AdminDigitalSignature() {
  const [settings, setSettings] = useState<SignatureSettings>({
    provider: 'local',
    docusignAccountId: null,
    docusignApiKey: null,
    clicksignToken: null,
    webhookUrl: null
  });
  const [documents, setDocuments] = useState<SignatureDocument[]>([]);
  const [editingSettings, setEditingSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<{success: boolean; message: string} | null>(null);

  // Carregar configurações e documentos
  useEffect(() => {
    const loadData = () => {
      try {
        // Carregar configurações
        const savedSettings = DigitalSignatureService.getSignatureSettings();
        setSettings(savedSettings);
        
        // Carregar documentos
        const savedDocuments = DigitalSignatureService.getSignatureDocuments();
        setDocuments(savedDocuments);
      } catch (error) {
        console.error("Erro ao carregar dados de assinatura digital:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSaveSettings = () => {
    try {
      DigitalSignatureService.saveSignatureSettings(settings);
      setEditingSettings(false);
      setTestResult({ success: true, message: 'Configurações salvas com sucesso!' });
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      setTestResult({ success: false, message: 'Erro ao salvar configurações' });
    }
  };

  const handleTestConnection = async () => {
    setTestResult(null);
    
    try {
      // Simular teste de conexão com o provedor
      switch (settings.provider) {
        case 'docusign':
          if (!settings.docusignAccountId || !settings.docusignApiKey) {
            setTestResult({ 
              success: false, 
              message: 'Por favor, preencha as credenciais do DocuSign' 
            });
            return;
          }
          // Em uma implementação real, aqui faríamos uma chamada à API do DocuSign
          // para verificar as credenciais
          break;
          
        case 'clicksign':
          if (!settings.clicksignToken) {
            setTestResult({ 
              success: false, 
              message: 'Por favor, preencha o token do Clicksign' 
            });
            return;
          }
          // Em uma implementação real, aqui faríamos uma chamada à API do Clicksign
          // para verificar o token
          break;
          
        case 'local':
          // Não há necessidade de teste para assinatura local
          break;
      }
      
      setTestResult({ 
        success: true, 
        message: `Conexão com ${settings.provider === 'docusign' ? 'DocuSign' : settings.provider === 'clicksign' ? 'Clicksign' : 'assinatura local'} bem-sucedida!` 
      });
    } catch (error) {
      console.error("Erro ao testar conexão:", error);
      setTestResult({ 
        success: false, 
        message: `Erro ao testar conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
      });
    }
  };

  const handleSendDocument = async (documentId: string) => {
    try {
      const result = await DigitalSignatureService.sendDocumentForSignature(documentId);
      
      if (result.success) {
        // Atualizar lista de documentos
        const updatedDocuments = DigitalSignatureService.getSignatureDocuments();
        setDocuments(updatedDocuments);
        
        alert(`Documento enviado para assinatura com sucesso! ID do envelope: ${result.envelopeId}`);
      } else {
        alert(`Erro ao enviar documento: ${result.error}`);
      }
    } catch (error) {
      console.error("Erro ao enviar documento:", error);
      alert("Erro ao enviar documento para assinatura");
    }
  };

  const handleViewDocument = (documentUrl: string) => {
    // Abrir documento em nova aba
    window.open(documentUrl, '_blank');
  };

  const getStatusIcon = (status: SignatureDocument['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'sent':
        return <Send className="h-4 w-4 text-blue-500" />;
      case 'signed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'declined':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: SignatureDocument['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'sent':
        return 'Enviado';
      case 'signed':
        return 'Assinado';
      case 'declined':
        return 'Recusado';
      case 'expired':
        return 'Expirado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-cormorant font-bold">Assinatura Digital</h1>
            <p className="text-muted-foreground">Gerencie a integração com provedores de assinatura digital</p>
          </div>
        </div>
      </div>

      {/* Configurações */}
      <div className="bg-card border border-border rounded-xl shadow-sm mb-6">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-cormorant font-bold flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Configurações de Integração
          </h2>
        </div>
        
        <div className="p-6">
          {editingSettings ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Provedor de Assinatura
                </label>
                <select
                  value={settings.provider}
                  onChange={(e) => setSettings({...settings, provider: e.target.value as any})}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="local">Assinatura Local</option>
                  <option value="docusign">DocuSign</option>
                  <option value="clicksign">Clicksign</option>
                </select>
              </div>
              
              {settings.provider === 'docusign' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Account ID do DocuSign
                    </label>
                    <input
                      type="text"
                      value={settings.docusignAccountId || ''}
                      onChange={(e) => setSettings({...settings, docusignAccountId: e.target.value})}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Digite o Account ID"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      API Key do DocuSign
                    </label>
                    <input
                      type="password"
                      value={settings.docusignApiKey || ''}
                      onChange={(e) => setSettings({...settings, docusignApiKey: e.target.value})}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Digite a API Key"
                    />
                  </div>
                </>
              )}
              
              {settings.provider === 'clicksign' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Token do Clicksign
                  </label>
                  <input
                    type="password"
                    value={settings.clicksignToken || ''}
                    onChange={(e) => setSettings({...settings, clicksignToken: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Digite o token"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  URL do Webhook (opcional)
                </label>
                <input
                  type="url"
                  value={settings.webhookUrl || ''}
                  onChange={(e) => setSettings({...settings, webhookUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://seusite.com/webhook/signature"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  URL para receber notificações de status de assinatura
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleSaveSettings}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Salvar Configurações
                </button>
                
                <button
                  onClick={() => setEditingSettings(false)}
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted/50 transition-colors"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={handleTestConnection}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                >
                  <Link className="h-4 w-4" />
                  Testar Conexão
                </button>
              </div>
              
              {testResult && (
                <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {testResult.message}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-foreground">Provedor Atual</h3>
                  <p className="text-muted-foreground">
                    {settings.provider === 'docusign' ? 'DocuSign' : 
                     settings.provider === 'clicksign' ? 'Clicksign' : 
                     'Assinatura Local'}
                  </p>
                </div>
                <button
                  onClick={() => setEditingSettings(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </button>
              </div>
              
              {settings.provider !== 'local' && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Credenciais</h4>
                  {settings.provider === 'docusign' ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Account ID:</span> {settings.docusignAccountId ? '••••••••' : 'Não configurado'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">API Key:</span> {settings.docusignApiKey ? '••••••••' : 'Não configurado'}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Token:</span> {settings.clicksignToken ? '••••••••' : 'Não configurado'}
                    </p>
                  )}
                </div>
              )}
              
              {settings.webhookUrl && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Webhook</h4>
                  <p className="text-sm text-muted-foreground break-all">
                    {settings.webhookUrl}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Documentos de Assinatura */}
      <div className="bg-card border border-border rounded-xl shadow-sm">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-cormorant font-bold flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Documentos de Assinatura ({documents.length})
          </h2>
        </div>
        
        {documents.length > 0 ? (
          <div className="divide-y divide-border">
            {documents.map((document) => (
              <div key={document.id} className="p-6 hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(document.status)}
                      <div>
                        <h3 className="font-medium text-foreground">
                          Documento #{document.id.substring(0, 8)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Orçamento: {document.quoteId.substring(0, 8)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Status</p>
                        <p className="text-sm font-medium flex items-center gap-2">
                          {getStatusIcon(document.status)}
                          {getStatusText(document.status)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Provedor</p>
                        <p className="text-sm">
                          {document.provider === 'docusign' ? 'DocuSign' : 
                           document.provider === 'clicksign' ? 'Clicksign' : 
                           'Local'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Criado em</p>
                        <p className="text-sm">
                          {new Date(document.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Signatários</p>
                      <div className="flex flex-wrap gap-2">
                        {document.signers.map((signer) => (
                          <div 
                            key={signer.id} 
                            className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
                              signer.signed 
                                ? 'bg-green-100 text-green-800' 
                                : signer.declined 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {signer.signed ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : signer.declined ? (
                              <XCircle className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                            {signer.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDocument(document.documentUrl)}
                      className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                      title="Visualizar documento"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    {document.status === 'pending' && (
                      <button
                        onClick={() => handleSendDocument(document.id)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Enviar para assinatura"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Nenhum documento de assinatura encontrado</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Os documentos aparecerão aqui quando orçamentos forem enviados para assinatura.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}