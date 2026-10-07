import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { QuoteService, type QuoteWithItems } from "../services/quoteService";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const meta: MetaFunction = () => {
  return [
    { title: "Assinatura Confirmada - ProRevest" },
    { name: "description", content: "Sua assinatura foi registrada com sucesso." },
  ];
};

export default function AssinaturaConfirmada() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const quoteId = searchParams.get("quoteId");
  const [quote, setQuote] = useState<QuoteWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do orçamento
  useEffect(() => {
    const fetchQuote = async () => {
      if (!quoteId) {
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
        const quoteData = await QuoteService.getQuoteWithItems(quoteId);
        
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
      } catch (err) {
        setError('Falha ao carregar orçamento');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuote();
  }, [quoteId, user]);

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

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="max-w-4xl mx-auto pt-20">
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-destructive mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-cormorant font-bold mb-2">Erro</h2>
            <p className="text-muted-foreground mb-6">{error || 'Orçamento não encontrado'}</p>
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
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-cormorant font-bold mb-4">Assinatura Confirmada!</h1>
          <p className="text-muted-foreground text-lg">
            Seu orçamento foi assinado digitalmente com sucesso.
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-sm p-6 md:p-8 border border-border">
          <div className="mb-8">
            <h2 className="text-2xl font-cormorant font-bold mb-2">Orçamento #{quote.id.substring(0, 8).toUpperCase()}</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>Data: {new Date(quote.created_at).toLocaleDateString('pt-BR')}</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                Assinado Digitalmente
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-cormorant font-semibold mb-4">Resumo do Projeto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Cliente</p>
                <p>{user?.email || "Cliente"}</p>
              </div>
              <div>
                <p className="font-medium">Data da Assinatura</p>
                <p>{new Date().toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <p className="font-medium">Total de Itens</p>
                <p>{quote.quote_items?.length || 0} produtos</p>
              </div>
              <div>
                <p className="font-medium">Valor Total</p>
                <p>R$ {(quote.quote_items?.reduce((total: number, item: any) => total + (item.quantity * item.price_at_time), 0) || 0).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="font-semibold mb-3 text-blue-900">Próximos Passos</h4>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Você receberá uma cópia do orçamento assinado por e-mail</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Nossa equipe entrará em contato em até 24 horas para agendar o serviço</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Você pode acompanhar o status do projeto na área "Meus Projetos"</span>
              </li>
            </ul>
          </div>

          <div className="mb-8 p-6 bg-amber-50 rounded-xl border border-amber-200">
            <h4 className="font-semibold mb-3 text-amber-900">Informações Importantes</h4>
            <div className="space-y-2 text-amber-800 text-sm">
              <p>• Esta assinatura digital possui validade jurídica conforme Lei nº 14.063/2020.</p>
              <p>• O orçamento assinado tem validade de 30 dias a partir da data da assinatura.</p>
              <p>• Qualquer alteração no escopo do projeto deverá ser formalizada em novo documento.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.print()}
              className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimir Comprovante
            </button>
            <Link 
              to="/meus-projetos"
              className="flex-1 px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted/50 transition-colors text-center"
            >
              Meus Projetos
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Precisa de ajuda? Entre em contato conosco:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:contato@prorevest.com.br" 
              className="text-primary hover:text-primary/80 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              contato@prorevest.com.br
            </a>
            <a 
              href="tel:+5511999999999" 
              className="text-primary hover:text-primary/80 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              (11) 9999-9999
            </a>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
