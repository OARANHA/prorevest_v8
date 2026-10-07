import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { Download, BarChart2, PieChart, TrendingUp } from "lucide-react";
import { ProductService } from "../../services/productService";
import { QuoteService } from "../../services/quoteService";

export const meta: MetaFunction = () => {
  return [
    { title: "Relatórios - ProRevest" },
    { name: "description", content: "Relatórios e análises da ProRevest" },
  ];
}

export default function AdminReports() {
  const [reportType, setReportType] = useState("sales");
  const [dateRange, setDateRange] = useState("monthly");
  const [salesData, setSalesData] = useState<any[]>([]);
  const [productPerformance, setProductPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados dos relatórios
  useEffect(() => {
    const loadReportData = async () => {
      try {
        // Dados simulados para os gráficos (em uma implementação real, viriam de consultas ao banco)
        const mockSalesData = [
          { month: "Jan", value: 4000 },
          { month: "Fev", value: 3000 },
          { month: "Mar", value: 2000 },
          { month: "Abr", value: 2780 },
          { month: "Mai", value: 1890 },
          { month: "Jun", value: 2390 },
        ];

        // Dados reais de produtos
        const products = await ProductService.getProducts();
        
        // Simular dados de performance baseados nos produtos reais
        const mockProductPerformance = products.slice(0, 4).map((product, index) => ({
          product: product.name,
          sales: Math.floor(Math.random() * 100) + 50,
          revenue: Math.floor(Math.random() * 20000) + 5000
        }));

        setSalesData(mockSalesData);
        setProductPerformance(mockProductPerformance);
      } catch (error) {
        console.error("Erro ao carregar dados dos relatórios:", error);
        
        // Fallback para dados simulados em caso de erro
        const mockSalesData = [
          { month: "Jan", value: 4000 },
          { month: "Fev", value: 3000 },
          { month: "Mar", value: 2000 },
          { month: "Abr", value: 2780 },
          { month: "Mai", value: 1890 },
          { month: "Jun", value: 2390 },
        ];

        const mockProductPerformance = [
          { product: "Látex Premium Acetinado", sales: 120, revenue: 15600 },
          { product: "Esmalte Sintético Brilhante", sales: 85, revenue: 11200 },
          { product: "Textura Suede", sales: 65, revenue: 9800 },
          { product: "Tinta Epóxi Industrial", sales: 42, revenue: 12600 },
        ];

        setSalesData(mockSalesData);
        setProductPerformance(mockProductPerformance);
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, []);

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
            <h1 className="text-3xl font-cormorant font-bold">Relatórios e Análises</h1>
            <p className="text-muted-foreground">Visualize métricas e insights do negócio</p>
          </div>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center">
            <Download className="mr-2 h-5 w-5" />
            Exportar Relatório
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Tipo de Relatório</label>
            <select 
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="sales">Vendas</option>
              <option value="products">Desempenho de Produtos</option>
              <option value="customers">Comportamento do Cliente</option>
              <option value="conversion">Taxa de Conversão</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Período</label>
            <select 
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensal</option>
              <option value="quarterly">Trimestral</option>
              <option value="yearly">Anual</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-medium hover:bg-secondary/90 transition-colors">
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-cormorant font-bold">Vendas Mensais</h2>
            <BarChart2 className="h-6 w-6 text-primary" />
          </div>
          <div className="h-80 flex items-end justify-between pt-8">
            {salesData.map((data, index) => (
              <div key={index} className="flex flex-col items-center w-12">
                <div 
                  className="w-8 bg-primary rounded-t hover:bg-primary/80 transition-colors"
                  style={{ height: `${(data.value / 5000) * 100}%` }}
                ></div>
                <span className="text-xs text-muted-foreground mt-2">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-cormorant font-bold">Desempenho por Produto</h2>
            <PieChart className="h-6 w-6 text-primary" />
          </div>
          <div className="h-80 flex items-center justify-center">
            <div className="relative w-64 h-64 rounded-full border-8 border-primary flex items-center justify-center">
              <div className="absolute w-32 h-32 rounded-full border-8 border-secondary"></div>
              <div className="absolute w-16 h-16 rounded-full border-8 border-accent"></div>
              <TrendingUp className="h-8 w-8 text-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de dados */}
      <div className="bg-card border border-border rounded-xl shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-cormorant font-bold mb-4">Detalhamento de Produtos</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Produto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Vendas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Receita (R$)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Crescimento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {productPerformance.map((product, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{product.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.sales}</td>
                    <td className="px-6 py-4 whitespace-nowrap">R$ {product.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-green-500 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {Math.floor(Math.random() * 20) + 5}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}