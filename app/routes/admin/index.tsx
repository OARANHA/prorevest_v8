import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { BarChart, Users, ShoppingCart, Package, TrendingUp, TrendingDown } from "lucide-react";
import { ProductService } from "../../services/productService";
import { QuoteService } from "../../services/quoteService";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard - ProRevest" },
    { name: "description", content: "Visão geral do sistema administrativo da ProRevest" },
  ];
}

export default function AdminHome() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalQuotes: 0,
    revenue: 0,
    conversionRate: 0,
  });

  const [chartData, setChartData] = useState([
    { month: "Jan", revenue: 0, quotes: 0 },
    { month: "Fev", revenue: 0, quotes: 0 },
    { month: "Mar", revenue: 0, quotes: 0 },
    { month: "Abr", revenue: 0, quotes: 0 },
    { month: "Mai", revenue: 0, quotes: 0 },
    { month: "Jun", revenue: 0, quotes: 0 },
  ]);

  const [loading, setLoading] = useState(true);

  // Carregar dados do dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Carregar produtos
        const products = await ProductService.getProducts();
        
        // Carregar orçamentos (simulado por enquanto)
        const quotes = [
          { id: "1", user_id: "user1", status: "signed", notes: "", created_at: "2023-06-15T10:30:00Z", updated_at: "2023-06-16T14:20:00Z" },
          { id: "2", user_id: "user2", status: "sent", notes: "", created_at: "2023-06-14T09:15:00Z", updated_at: "2023-06-14T09:15:00Z" },
          // ... mais orçamentos
        ];
        
        // Atualizar métricas
        setMetrics({
          totalUsers: 1242, // Simulado
          totalProducts: products.length,
          totalQuotes: quotes.length,
          revenue: 124567.89, // Simulado
          conversionRate: 24.5, // Simulado
        });

        // Atualizar dados do gráfico (simulado)
        setChartData([
          { month: "Jan", revenue: 4000, quotes: 24 },
          { month: "Fev", revenue: 3000, quotes: 13 },
          { month: "Mar", revenue: 2000, quotes: 18 },
          { month: "Abr", revenue: 2780, quotes: 12 },
          { month: "Mai", revenue: 1890, quotes: 19 },
          { month: "Jun", revenue: 2390, quotes: 15 },
        ]);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
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
    <div className="p-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-cormorant font-bold text-slate-100 mb-2">Visão Geral</h1>
        <p className="text-slate-300 text-lg">Bem-vindo ao dashboard administrativo da ProRevest</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Total de Usuários</p>
              <p className="text-2xl font-bold text-slate-100">{metrics.totalUsers.toLocaleString('pt-BR')}</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" style={{ backgroundColor: '#0f172a00 !important', fill: 'none !important', stroke: '#f1f5f9 !important' }} />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
            <span className="text-sm text-green-400">12% desde o mês passado</span>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Produtos</p>
              <p className="text-2xl font-bold text-slate-100">{metrics.totalProducts}</p>
            </div>
            <Package className="h-8 w-8 text-yellow-400" style={{ backgroundColor: '#0f172a00 !important', fill: 'none !important', stroke: '#f1f5f9 !important' }} />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
            <span className="text-sm text-green-400">3 novos produtos</span>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Orçamentos</p>
              <p className="text-2xl font-bold text-slate-100">{metrics.totalQuotes}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-purple-400" style={{ backgroundColor: '#0f172a00 !important', fill: 'none !important', stroke: '#f1f5f9 !important' }} />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingDown className="h-4 w-4 text-red-400 mr-2" />
            <span className="text-sm text-red-400">2% desde o mês passado</span>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Receita</p>
              <p className="text-2xl font-bold text-slate-100">R$ {metrics.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" style={{ backgroundColor: '#0f172a00 !important', fill: 'none !important', stroke: '#f1f5f9 !important' }} />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
            <span className="text-sm text-green-400">8% desde o mês passado</span>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-cormorant font-bold mb-6 text-slate-100">Receita Mensal</h2>
          <div className="h-80 flex items-end justify-between pt-8">
            {chartData.map((data, index) => (
              <div key={index} className="flex flex-col items-center w-16">
                <div
                  className="w-10 bg-blue-500 rounded-t hover:bg-blue-400 transition-colors"
                  style={{ height: `${(data.revenue / 5000) * 100}%` }}
                ></div>
                <span className="text-sm text-slate-400 mt-3">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-cormorant font-bold mb-6 text-slate-100">Orçamentos por Mês</h2>
          <div className="h-80 flex items-end justify-between pt-8">
            {chartData.map((data, index) => (
              <div key={index} className="flex flex-col items-center w-16">
                <div
                  className="w-10 bg-purple-500 rounded-t hover:bg-purple-400 transition-colors"
                  style={{ height: `${(data.quotes / 30) * 100}%` }}
                ></div>
                <span className="text-sm text-slate-400 mt-3">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela de atividades recentes */}
      <div className="bg-slate-800/50 border border-slate-600 rounded-xl shadow-sm">
        <div className="p-8">
          <h2 className="text-2xl font-cormorant font-bold mb-6 text-slate-100">Atividades Recentes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-600">
              <thead>
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Usuário</th>
                  <th className="px-8 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Ação</th>
                  <th className="px-8 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Produto</th>
                  <th className="px-8 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-600">
                <tr>
                  <td className="px-8 py-5 whitespace-nowrap text-slate-200">João Silva</td>
                  <td className="px-8 py-5 whitespace-nowrap text-slate-200">Solicitou orçamento</td>
                  <td className="px-8 py-5 whitespace-nowrap text-slate-200">Látex Premium Acetinado</td>
                  <td className="px-8 py-5 whitespace-nowrap text-slate-200">15/06/2023</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 whitespace-nowrap text-slate-200">Carlos Souza</td>
                  <td className="px-8 py-5 whitespace-nowrap text-slate-200">Assinou orçamento</td>
                  <td className="px-8 py-5 whitespace-nowrap text-slate-200">Esmalte Sintético Brilhante</td>
                  <td className="px-8 py-5 whitespace-nowrap text-slate-200">14/06/2023</td>
                </tr>
                <tr>
                  <td className="px-8 py-5 whitespace-nowrap text-slate-200">Ana Costa</td>
                  <td className="px-8 py-5 whitespace-nowrap text-slate-200">Visualizou produto</td>
                  <td className="px-8 py-5 whitespace-nowrap text-slate-200">Tinta Epóxi Industrial</td>
                  <td className="px-8 py-5 whitespace-nowrap text-slate-200">13/06/2023</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
