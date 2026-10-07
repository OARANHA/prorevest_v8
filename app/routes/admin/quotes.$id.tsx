import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Printer, Download } from "lucide-react";
import { QuoteService, type Quote } from "../../services/quoteService";
import { ProductService, type Product } from "../../services/productService";

export const meta: MetaFunction = () => {
  return [
    { title: "Detalhes do Orçamento - ProRevest" },
    { name: "description", content: "Visualize os detalhes de um orçamento específico" },
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

export default function QuoteDetails() {
  const { quote, products, error } = useLoaderData() as { quote: Quote; products: Product[]; error?: string };
  const navigate = useNavigate();

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

  const getProductById = (productId: string) => {
    return products.find(product => product.id === productId);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-primary hover:text-primary/80 mb-4"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Voltar
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-cormorant font-bold">Orçamento #{quote.id}</h1>
            <p className="text-muted-foreground">Detalhes completos do orçamento</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => navigate(`/admin/generate-quote-pdf/${quote.id}`)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center"
            >
              <FileText className="mr-2 h-5 w-5" />
              Gerar PDF
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do cliente */}
        <div className="lg:col-span-1 bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-cormorant font-bold mb-4">Informações do Cliente</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-muted-foreground">Nome</h3>
              <p className="font-medium">{quote.customer_name}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-muted-foreground">E-mail</h3>
              <p className="font-medium">{quote.customer_email}</p>
            </div>
            
            {quote.customer_phone && (
              <div>
                <h3 className="font-medium text-muted-foreground">Telefone</h3>
                <p className="font-medium">{quote.customer_phone}</p>
              </div>
            )}
            
            {quote.customer_company && (
              <div>
                <h3 className="font-medium text-muted-foreground">Empresa</h3>
                <p className="font-medium">{quote.customer_company}</p>
              </div>
            )}
            
            <div>
              <h3 className="font-medium text-muted-foreground">Data do Orçamento</h3>
              <p className="font-medium">{new Date(quote.created_at).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>
        
        {/* Produtos */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-cormorant font-bold mb-4">Produtos</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/30">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Produto
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Preço Unitário
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {quote.items.map((item: any, index: number) => {
                  const product = getProductById(item.variant_id);
                  return (
                    <tr key={index} className="hover:bg-muted/10">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium">{product?.name || 'Produto não encontrado'}</div>
                        {product?.description && (
                          <div className="text-sm text-muted-foreground mt-1">{product.description}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        R$ {item.price_at_time.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        R$ {(item.quantity * item.price_at_time).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Totais */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex justify-end">
              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {quote.subtotal.toFixed(2)}</span>
                </div>
                
                {quote.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Desconto</span>
                    <span className="text-destructive">- R$ {quote.discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-lg">R$ {quote.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Notas */}
      {quote.notes && (
        <div className="mt-6 bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-cormorant font-bold mb-4">Notas</h2>
          <p className="text-muted-foreground">{quote.notes}</p>
        </div>
      )}
    </div>
  );
}
