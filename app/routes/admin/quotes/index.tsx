import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Eye, FileText } from "lucide-react";
import { QuoteService, type Quote } from "../../../services/quoteService";
import { useNavigate } from "react-router-dom";

export const meta: MetaFunction = () => {
  return [
    { title: "Gestão de Orçamentos - ProRevest" },
    { name: "description", content: "Gerencie os orçamentos da ProRevest" },
  ];
}

export default function AdminQuotes() {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Carregar orçamentos
  useEffect(() => {
    const loadQuotes = async () => {
      try {
        // Como administrador, queremos ver todos os orçamentos do sistema
        const allQuotes = await QuoteService.getAllQuotes();
        setQuotes(allQuotes);
        setFilteredQuotes(allQuotes);
      } catch (error) {
        console.error("Erro ao carregar orçamentos:", error);
        setLoadError("Não foi possível carregar os orçamentos. Verifique a conexão e as permissões.");
        setQuotes([]);
        setFilteredQuotes([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuotes();
  }, []);

  // Filtrar orçamentos com base no termo de busca
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredQuotes(quotes);
    } else {
      const filtered = quotes.filter(quote => 
        quote.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredQuotes(filtered);
    }
  }, [searchTerm, quotes]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Rascunho</span>;
      case "sent":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Enviado</span>;
      case "approved":
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Aprovado</span>;
      case "signed":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Assinado</span>;
      case "archived":
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Arquivado</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Desconhecido</span>;
    }
  };

  const handleViewQuote = (quoteId: string) => {
    navigate(`/admin/quotes/${quoteId}`);
  };

  const handleGeneratePDF = (quoteId: string) => {
    navigate(`/admin/generate-quote-pdf/${quoteId}`);
  };

  const handleDeleteQuote = async (quoteId: string) => {
    try {
      await QuoteService.deleteQuote(quoteId);
      setQuotes(prevQuotes => prevQuotes.filter(quote => quote.id !== quoteId));
    } catch (error) {
      console.error("Erro ao deletar orçamento:", error);
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
            <h1 className="text-3xl font-cormorant font-bold">Gestão de Orçamentos</h1>
            <p className="text-muted-foreground">Gerencie os orçamentos da ProRevest</p>
          </div>
          <button 
            onClick={() => navigate('/admin/new-quote')}
            className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Orçamento
          </button>
        </div>
      </div>

      {loadError && (
        <div role="alert" className="mb-6 rounded-lg border border-red-400/50 bg-red-950/30 p-4 text-red-100">
          {loadError} Nenhum dado fictício foi exibido.
        </div>
      )}

      {/* Barra de busca */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar orçamentos..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela de orçamentos */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Notas
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
            {filteredQuotes.map((quote) => (
              <tr key={quote.id} className="hover:bg-muted/10">
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  {quote.id.substring(0, 8).toUpperCase()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(quote.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {quote.notes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                  {new Date(quote.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleViewQuote(quote.id)}
                    className="text-primary hover:text-primary/80 mr-3"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleGeneratePDF(quote.id)}
                    className="text-primary hover:text-primary/80 mr-3"
                    title="Gerar PDF"
                  >
                    <FileText className="h-5 w-5" />
                  </button>
                  <button className="text-primary hover:text-primary/80 mr-3">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteQuote(quote.id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Exibindo {filteredQuotes.length} orçamento(s) após o filtro
        </div>
      </div>
    </div>
  );
}
