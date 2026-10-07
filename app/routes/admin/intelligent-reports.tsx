import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  BarChart, PieChart, TrendingUp, Users, ShoppingCart, DollarSign, 
  Palette, Layers, AlertTriangle, Calendar, Filter, Download, RefreshCw 
} from "lucide-react";
import { 
  ReportService, 
  type ReportData, 
  type ReportPeriod 
} from "../../services/reportService";

export const meta: MetaFunction = () => {
  return [
    { title: "Relatórios Inteligentes - ProRevest" },
    { name: "description", content: "Relatórios inteligentes com análise de conversão, custos e margens" },
  ];
}

export default function AdminIntelligentReports() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<ReportPeriod>('month');
  const [filters, setFilters] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Carregar dados do relatório
  useEffect(() => {
    const loadReportData = async () => {
      try {
        setLoading(true);
        const data = await ReportService.generateReport(period, filters);
        setReportData(data);
      } catch (error) {
        console.error("Erro ao carregar dados do relatório:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, [period, filters]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await ReportService.generateReport(period, filters);
      setReportData(data);
    } catch (error) {
      console.error("Erro ao atualizar relatório:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = () => {
    // Em uma implementação real, isso exportaria o relatório
    alert('Funcionalidade de exportação será implementada em breve.');
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

  if (!reportData) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-destructive mb-2">Erro</h2>
          <p className="text-destructive mb-4">Não foi possível carregar os dados do relatório.</p>
          <button
            onClick={handleRefresh}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-cormorant font-bold">Relatórios Inteligentes</h1>
            <p className="text-muted-foreground">Análise de conversão por cor/textura/produto, custo estimado x margem</p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as ReportPeriod)}
                className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="day">Hoje</option>
                <option value="week">Esta semana</option>
                <option value="month">Este mês</option>
                <option value="quarter">Este trimestre</option>
                <option value="year">Este ano</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50"
            >
              {isRefreshing ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Atualizar
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Download className="h-4 w-4" />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
              <h3 className="text-2xl font-bold">{ReportService.formatCurrency(reportData.summary.totalRevenue)}</h3>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Lucro Total</p>
              <h3 className="text-2xl font-bold">{ReportService.formatCurrency(reportData.summary.totalProfit)}</h3>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Margem de Lucro</p>
              <h3 className="text-2xl font-bold">{ReportService.formatPercentage(reportData.summary.profitMargin)}</h3>
            </div>
            <PieChart className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Taxa de Conversão</p>
              <h3 className="text-2xl font-bold">{ReportService.formatPercentage(reportData.summary.conversionRate)}</h3>
            </div>
            <ShoppingCart className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Gráficos e Métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Produtos mais vendidos */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-cormorant font-bold">Produtos Mais Vendidos</h2>
          </div>
          <div className="space-y-4">
            {reportData.sales
              .sort((a, b) => b.totalValue - a.totalValue)
              .slice(0, 5)
              .map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">{item.color} - {item.texture}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{ReportService.formatCurrency(item.totalValue)}</p>
                    <p className="text-sm text-muted-foreground">{item.quantity} unidades</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
        
        {/* Cores mais populares */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-cormorant font-bold">Cores Mais Populares</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(
              reportData.sales.reduce((acc, item) => {
                acc[item.color] = (acc[item.color] || 0) + item.totalValue;
                return acc;
              }, {} as Record<string, number>)
            )
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([color, value], index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full border border-border" 
                      style={{ backgroundColor: color.toLowerCase() }}
                    ></div>
                    <span className="font-medium">{color}</span>
                  </div>
                  <span className="font-medium">{ReportService.formatCurrency(value)}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Conversão por produto */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-cormorant font-bold">Conversão por Produto</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/30">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Produto
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Visualizações
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Adições ao Carrinho
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Compras
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Taxa de Conversão
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {reportData.conversions
                .sort((a, b) => b.conversionRate - a.conversionRate)
                .map((item, index) => (
                  <tr key={index} className="hover:bg-muted/10">
                    <td className="px-4 py-3">
                      <div className="font-medium">{item.product}</div>
                      <div className="text-sm text-muted-foreground">{item.color} - {item.texture}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.views.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.addToCart.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.purchases.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{ReportService.formatPercentage(item.conversionRate)}</span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status do inventário */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-cormorant font-bold">Status do Inventário</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/30">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Produto
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Estoque Atual
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Estoque Reservado
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Estoque Disponível
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {reportData.inventory.map((item, index) => (
                <tr key={index} className="hover:bg-muted/10">
                  <td className="px-4 py-3 font-medium">
                    {item.productName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.currentStock}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.reservedStock}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.availableStock}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.status === 'adequate' ? 'bg-green-100 text-green-800' :
                      item.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                      item.status === 'critical' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {item.status === 'adequate' ? 'Adequado' :
                       item.status === 'low' ? 'Baixo' :
                       item.status === 'critical' ? 'Crítico' :
                       'Excesso'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}