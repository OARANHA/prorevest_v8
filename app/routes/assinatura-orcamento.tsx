import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { QuoteService, type QuoteWithItems } from "../services/quoteService";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const meta: MetaFunction = () => {
  return [
    { title: "Assinatura de Orçamento - ProRevest" },
    { name: "description", content: "Assine seu orçamento digital com segurança." },
  ];
}

export default function AssinaturaOrcamento() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [signatureMethod, setSignatureMethod] = useState<"facial" | "digital" | "upload">("facial");
  const [isSigning, setIsSigning] = useState(false);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [quote, setQuote] = useState<QuoteWithItems | null>(null);
  const [quoteItems, setQuoteItems] = useState<QuoteWithItems["quote_items"]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do orçamento
  useEffect(() => {
    const fetchQuote = async () => {
      if (!id) {
        setError('ID do orçamento não fornecido');
        setIsLoading(false);
        return;
      }

      if (!user) {
        setError('Usuário não autenticado');
        setIsLoading(false);
        return;
      }

      try {
        const quoteData = await QuoteService.getQuoteWithItems(id);
        
        if (!quoteData) {
          setError('Orçamento não encontrado');
          setIsLoading(false);
          return;
        }

        if (quoteData.user_id !== user.id) {
          setError('Você não tem permissão para acessar este orçamento');
          setIsLoading(false);
          return;
        }

        setQuote(quoteData);
        setQuoteItems(quoteData.quote_items || []);
      } catch (err) {
        setError('Falha ao carregar orçamento');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuote();
  }, [id, user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSignatureFile(e.target.files[0]);
    }
  };

  const handleSign = async () => {
    if (!quote) {
      setError("Orçamento não disponível para assinatura.");
      return;
    }

    // Validação adicional baseada no método de assinatura
    if (signatureMethod === "upload" && !signatureFile) {
      setError("Por favor, selecione um arquivo de assinatura.");
      return;
    }

    setIsSigning(true);
    try {
      // Simular processo de assinatura baseado no método escolhido
      let signatureData: any = {
        method: signatureMethod,
        timestamp: new Date().toISOString(),
        quoteId: quote.id
      };

      switch (signatureMethod) {
        case "facial":
          // Simular reconhecimento facial
          await new Promise(resolve => setTimeout(resolve, 3000));
          signatureData.facialHash = "simulated_facial_hash_" + Date.now();
          break;
        
        case "digital":
          // Simular captura de assinatura digital
          await new Promise(resolve => setTimeout(resolve, 2000));
          signatureData.digitalSignature = "simulated_digital_signature_" + Date.now();
          break;
        
        case "upload":
          // Simular upload e processamento do arquivo
          if (!signatureFile) {
            throw new Error("Nenhum arquivo de assinatura selecionado");
          }
          await new Promise(resolve => setTimeout(resolve, 2500));
          signatureData.fileName = signatureFile.name;
          signatureData.fileHash = "simulated_file_hash_" + Date.now();
          break;
      }

      // Registrar assinatura no backend (simulado)
      console.log("📝 Registrando assinatura:", signatureData);
      
      // Atualizar status do orçamento para assinado
      await QuoteService.signQuote(quote.id);
      
      // Adicionar metadata da assinatura (em um sistema real, isso iria para uma tabela separada)
      console.log("✅ Assinatura registrada com sucesso:", {
        quoteId: quote.id,
        method: signatureMethod,
        timestamp: signatureData.timestamp,
        userId: user?.id
      });
      
      // Redirecionar para página de confirmação
      navigate("/assinatura-confirmada?quoteId=" + quote.id);
    } catch (err) {
      setError("Erro ao processar a assinatura. Tente novamente.");
      console.error("Erro na assinatura:", err);
    } finally {
      setIsSigning(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="max-w-4xl mx-auto pt-20">
          <div className="text-center py-12">
            <h2 className="text-2xl font-cormorant font-bold mb-4">Acesso Restrito</h2>
            <p className="text-muted-foreground mb-6">Você precisa estar logado para acessar esta página.</p>
            <Link to="/login" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Fazer Login
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="max-w-4xl mx-auto pt-20">
          <div className="flex justify-center items-center h-64">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="max-w-4xl mx-auto pt-20">
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-destructive mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-cormorant font-bold mb-2">Erro</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link to="/meus-projetos" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Voltar para Meus Projetos
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="max-w-4xl mx-auto pt-20">
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-cormorant font-bold mb-2">Orçamento Não Encontrado</h2>
            <p className="text-muted-foreground mb-6">O orçamento solicitado não foi encontrado.</p>
            <Link to="/meus-projetos" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Voltar para Meus Projetos
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="max-w-4xl mx-auto pt-20 pb-16">
        <div className="mb-8">
          <Link to="/meus-projetos" className="text-primary hover:text-primary/80 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Voltar para Meus Projetos
          </Link>
          <h1 className="text-3xl font-cormorant font-bold mt-4">Assinatura de Orçamento</h1>
          <p className="text-muted-foreground mt-2">
            Finalize seu orçamento com uma assinatura segura
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-sm p-6 md:p-8 border border-border">
          <div className="mb-8">
            <h2 className="text-2xl font-cormorant font-bold mb-2">Orçamento #{quote.id.substring(0, 8).toUpperCase()}</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>Data: {new Date(quote.created_at).toLocaleDateString('pt-BR')}</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                {quote.status === "draft" && "Rascunho"}
                {quote.status === "sent" && "Enviado"}
                {quote.status === "approved" && "Aprovado"}
                {quote.status === "signed" && "Assinado"}
                {quote.status === "archived" && "Arquivado"}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-cormorant font-semibold mb-4">Detalhes do Projeto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Cliente</p>
                <p>{user?.email || "Cliente"}</p>
              </div>
              <div>
                <p className="font-medium">Total de Itens</p>
                <p>{quoteItems.length} produtos</p>
              </div>
              <div>
                <p className="font-medium">Valor Total</p>
                <p>R$ {quoteItems.reduce((total: number, item: any) => total + (item.quantity * item.price_at_time), 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="font-medium">Validade</p>
                <p>{new Date(new Date(quote.created_at).setDate(new Date(quote.created_at).getDate() + 30)).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-cormorant font-semibold mb-4">Escolha o método de assinatura</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setSignatureMethod("facial")}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  signatureMethod === "facial"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold">Reconhecimento Facial</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Assine usando seu rosto - rápido e seguro
                </p>
              </button>

              <button
                onClick={() => setSignatureMethod("digital")}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  signatureMethod === "digital"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold">Assinatura Digital</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Desenhe sua assinatura diretamente na tela
                </p>
              </button>

              <button
                onClick={() => setSignatureMethod("upload")}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  signatureMethod === "upload"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h4 className="font-semibold">Upload de Arquivo</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Envie um arquivo com sua assinatura digital
                </p>
              </button>
            </div>
          </div>

          {signatureMethod === "facial" && (
            <div className="mb-8 p-6 bg-primary/5 rounded-xl border border-primary/20">
              <h4 className="font-semibold mb-4">Reconhecimento Facial</h4>
              <p className="text-muted-foreground mb-4">
                Posicione seu rosto na câmera para confirmar sua identidade e assinar digitalmente o documento.
              </p>
              <div className="flex justify-center">
                <div className="w-64 h-64 bg-gray-200 border-2 border-dashed rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {signatureMethod === "digital" && (
            <div className="mb-8 p-6 bg-secondary/5 rounded-xl border border-secondary/20">
              <h4 className="font-semibold mb-4">Assinatura Digital</h4>
              <p className="text-muted-foreground mb-4">
                Desenhe sua assinatura na área abaixo:
              </p>
              <div className="border-2 border-border rounded-lg h-40 flex items-center justify-center bg-white">
                <p className="text-muted-foreground">Área de assinatura</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80">
                  Limpar
                </button>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                  Desfazer
                </button>
              </div>
            </div>
          )}

          {signatureMethod === "upload" && (
            <div className="mb-8 p-6 bg-accent/5 rounded-xl border border-accent/20">
              <h4 className="font-semibold mb-4">Upload de Assinatura</h4>
              <p className="text-muted-foreground mb-4">
                Envie um arquivo com sua assinatura digitalizada:
              </p>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-border border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/10">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-muted-foreground mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Clique para enviar</span> ou arraste o arquivo
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, PDF (MAX. 10MB)
                    </p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".png,.jpg,.jpeg,.pdf"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {signatureFile && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{signatureFile.name}</span>
                  </div>
                  <button 
                    onClick={() => setSignatureFile(null)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
            <button
              onClick={handleSign}
              disabled={isSigning}
              className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSigning ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando assinatura...
                </>
              ) : (
                "Assinar Orçamento"
              )}
            </button>
            <button 
              onClick={() => navigate("/meus-projetos")}
              className="flex-1 px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted/50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
