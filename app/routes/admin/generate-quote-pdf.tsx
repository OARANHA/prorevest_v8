import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Download, Eye, Printer, FileText } from "lucide-react";
import { PDFService } from "../../services/pdfService";
import { QuoteService, type Quote } from "../../services/quoteService";
import { ProductService, type Product } from "../../services/productService";

export const meta: MetaFunction = () => {
  return [
    { title: "Gerar Orçamento PDF - ProRevest" },
    { name: "description", content: "Gere orçamentos finais em PDF com templates personalizáveis" },
  ];
}

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const quoteId = params.id;
    if (!quoteId) {
      throw new Error("ID do orçamento não fornecido");
    }
    
    const quote = await QuoteService.getQuoteWithItems(quoteId);
    const products = await ProductService.getProducts();
    
    return { quote, products };
  } catch (error) {
    console.error("Erro ao carregar dados do orçamento:", error);
    return { error: "Falha ao carregar dados do orçamento" };
  }
}

export default function GenerateQuotePDF() {
  const { quote, products, error } = useLoaderData() as { quote: Quote; products: Product[]; error?: string };
  const [loading, setLoading] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }, [error]);

  const handleGeneratePDF = async () => {
    if (!quote || !products) return;
    
    setLoading(true);
    try {
      const blob = await PDFService.generateQuotePDF(quote, products);
      setPdfBlob(blob);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!pdfBlob) return;
    
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orcamento-${quote.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintPDF = () => {
    if (!pdfUrl) return;
    
    const printWindow = window.open(pdfUrl);
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-2xl">
          <h2 className="text-xl font-bold text-destructive mb-2">Erro</h2>
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  if (!quote || !products) {
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
            <h1 className="text-3xl font-cormorant font-bold">Gerar Orçamento PDF</h1>
            <p className="text-muted-foreground">Gere orçamentos finais em PDF com templates personalizáveis</p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="bg-muted text-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted/90 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do orçamento */}
        <div className="lg:col-span-1 bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-cormorant font-bold mb-4">Detalhes do Orçamento</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-muted-foreground">Nº do Orçamento</h3>
              <p className="font-medium">{quote.id}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-muted-foreground">Cliente</h3>
              <p className="font-medium">{quote.customer_name}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-muted-foreground">Data</h3>
              <p className="font-medium">{new Date(quote.created_at).toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-muted-foreground">Total</h3>
              <p className="font-medium text-lg">R$ {quote.total.toFixed(2)}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-muted-foreground">Produtos</h3>
              <p className="font-medium">{quote.items.length} itens</p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="font-medium text-muted-foreground mb-2">Ações</h3>
            <div className="space-y-3">
              <button
                onClick={handleGeneratePDF}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gerando...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-5 w-5" />
                    Gerar PDF
                  </>
                )}
              </button>
              
              {pdfBlob && (
                <>
                  <button
                    onClick={handleDownloadPDF}
                    className="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-medium hover:bg-secondary/90 transition-colors flex items-center justify-center"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download PDF
                  </button>
                  
                  <button
                    onClick={handlePrintPDF}
                    className="w-full bg-muted text-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted/90 transition-colors flex items-center justify-center"
                  >
                    <Printer className="mr-2 h-5 w-5" />
                    Imprimir
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Visualização do PDF */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-cormorant font-bold mb-4">Visualização</h2>
          
          {pdfUrl ? (
            <div className="border border-border rounded-lg overflow-hidden h-[600px]">
              <iframe 
                src={pdfUrl} 
                className="w-full h-full"
                title="Visualização do Orçamento"
              />
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-lg h-[600px] flex flex-col items-center justify-center text-muted-foreground">
              <FileText className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium mb-2">Nenhum PDF gerado</p>
              <p className="text-center max-w-md">
                Clique em "Gerar PDF" para criar o orçamento final em formato PDF.
              </p>
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="font-medium text-muted-foreground mb-2">Templates</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Selecione um template personalizado para o orçamento (opcional)
            </p>
            <button className="text-primary hover:text-primary/80 font-medium">
              Selecionar template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
