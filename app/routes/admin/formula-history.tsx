import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, FileText, Calendar, Filter } from "lucide-react";
import { DosageService, type DosageFormula } from "../../services/dosageService";
import { QuoteService, type QuoteWithItems } from "../../services/quoteService";
import { ProductService, type ProductVariant } from "../../services/productService";

export const meta: MetaFunction = () => {
  return [
    { title: "Histórico de Fórmulas - ProRevest" },
    { name: "description", content: "Histórico completo de fórmulas geradas para rastreabilidade" },
  ];
}

export default function FormulaHistory() {
  const [formulas, setFormulas] = useState<DosageFormula[]>([]);
  const [quotes, setQuotes] = useState<Record<string, QuoteWithItems>>({});
  const [variants, setVariants] = useState<Record<string, ProductVariant>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [filteredFormulas, setFilteredFormulas] = useState<DosageFormula[]>([]);

  // Carregar fórmulas, orçamentos e variantes de produtos
  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar fórmulas
        const formulasData = await DosageService.getAllFormulas();
        setFormulas(formulasData);
        
        // Carregar orçamentos relacionados
        const quotesData: Record<string, QuoteWithItems> = {};
        const uniqueQuoteIds = [...new Set(formulasData.map(f => f.quote_id))];
        
        for (const quoteId of uniqueQuoteIds) {
          if (quoteId) {
            try {
              const quote = await QuoteService.getQuoteWithItems(quoteId);
              if (quote) {
                quotesData[quoteId] = quote;
              }
            } catch (error) {
              console.warn(`Erro ao carregar orçamento ${quoteId}:`, error);
            }
          }
        }
        
        setQuotes(quotesData);
        
        // Carregar variantes de produtos relacionadas
        const variantsData: Record<string, ProductVariant> = {};
        const uniqueVariantIds = [...new Set(formulasData.map(f => f.product_variant_id))];
        
        for (const variantId of uniqueVariantIds) {
          if (variantId) {
            try {
              const variant = await ProductService.getProductVariant(variantId);
              if (variant) {
                variantsData[variantId] = variant;
              }
            } catch (error) {
              console.warn(`Erro ao carregar variante ${variantId}:`, error);
            }
          }
        }
        
        setVariants(variantsData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrar fórmulas com base nos critérios
  useEffect(() => {
    let result = formulas;
    
    // Filtrar por data
    result = result.filter(formula => {
      const formulaDate = new Date(formula.created_at);
      const startDate = new Date(dateFilter.start);
      const endDate = new Date(dateFilter.end);
      endDate.setHours(23, 59, 59, 999); // Incluir o dia inteiro
      return formulaDate >= startDate && formulaDate <= endDate;
    });
    
    // Filtrar por termo de busca
    if (searchTerm) {
      result = result.filter(formula => {
        const quote = formula.quote_id ? quotes[formula.quote_id] : null;
        const variant = formula.product_variant_id ? variants[formula.product_variant_id] : null;
        
        return (
          formula.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (quote && quote.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (variant && variant.id.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
    }
    
    setFilteredFormulas(result);
  }, [formulas, quotes, variants, searchTerm, dateFilter]);

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
            <h1 className="text-3xl font-cormorant font-bold">Histórico de Fórmulas</h1>
            <p className="text-muted-foreground">Histórico completo de fórmulas geradas para rastreabilidade</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 bg-card border border-border rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                placeholder="ID da fórmula, orçamento ou variante..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Data Inicial</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={dateFilter.start}
              onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Data Final</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={dateFilter.end}
              onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Total de Fórmulas</p>
              <p className="text-2xl font-bold">{formulas.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Calendar className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Fórmulas no Período</p>
              <p className="text-2xl font-bold">{filteredFormulas.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Filter className="h-6 w-6 text-purple-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Orçamentos Únicos</p>
              <p className="text-2xl font-bold">{Object.keys(quotes).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Filter className="h-6 w-6 text-orange-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Variantes Únicas</p>
              <p className="text-2xl font-bold">{Object.keys(variants).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de histórico */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold">Fórmulas Geradas</h2>
        </div>
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                ID da Fórmula
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                ID do Orçamento
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Variante do Produto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Base (%)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Pigmento A (%)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Pigmento B (%)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Pigmento C (%)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Data de Criação
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {filteredFormulas.map((formula) => {
              const quote = formula.quote_id ? quotes[formula.quote_id] : null;
              const variant = formula.product_variant_id ? variants[formula.product_variant_id] : null;
              
              return (
                <tr key={formula.id} className="hover:bg-muted/10">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                    {formula.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {quote ? quote.id.substring(0, 8) + "..." : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {variant ? variant.id.substring(0, 8) + "..." : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formula.base_percentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formula.pigment_a_percentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formula.pigment_b_percentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formula.pigment_c_percentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(formula.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredFormulas.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Nenhuma fórmula encontrada</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Não há fórmulas registradas com os critérios selecionados.
            </p>
          </div>
        )}
      </div>

      {/* Paginação */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando 1 a {Math.min(10, filteredFormulas.length)} de {filteredFormulas.length} resultados
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-border rounded-md text-sm font-medium hover:bg-muted/50 disabled:opacity-50">
            Anterior
          </button>
          <button className="px-3 py-1 border border-border rounded-md text-sm font-medium hover:bg-muted/50 disabled:opacity-50">
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}