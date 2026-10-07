import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { BarChart, PieChart, TrendingUp, Calendar, Download } from "lucide-react";
import { DosageService, type DosageFormula } from "../../services/dosageService";

export const meta: MetaFunction = () => {
  return [
    { title: "Relatórios de Produção - ProRevest" },
    { name: "description", content: "Relatórios de produção baseados nas fórmulas de dosagem" },
  ];
}

export default function ProductionReports() {
  const [formulas, setFormulas] = useState<DosageFormula[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Carregar fórmulas de dosagem
  useEffect(() => {
    const loadFormulas = async () => {
      try {
        const allFormulas = await DosageService.getAllFormulas();
        setFormulas(allFormulas);
      } catch (error) {
        console.error("Erro ao carregar fórmulas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFormulas();
  }, []);

  // Filtrar fórmulas por data
  const filteredFormulas = formulas.filter(formula => {
    const formulaDate = new Date(formula.created_at);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999); // Incluir o dia inteiro
    return formulaDate >= startDate && formulaDate <= endDate;
  });

  // Calcular estatísticas
  const totalFormulas = filteredFormulas.length;
  const totalBase = filteredFormulas.reduce((sum, formula) => sum + formula.base_percentage, 0);
  const totalPigmentA = filteredFormulas.reduce((sum, formula) => sum + formula.pigment_a_percentage, 0);
  const totalPigmentB = filteredFormulas.reduce((sum, formula) => sum + formula.pigment_b_percentage, 0);
  const totalPigmentC = filteredFormulas.reduce((sum, formula) => sum + formula.pigment_c_percentage, 0);

  const handleExport = () => {
    // Em uma implementação real, aqui exportaríamos os dados para CSV ou PDF
    alert("Exportação de relatório iniciada!");
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
            <h1 className="text-3xl font-cormorant font-bold">Relatórios de Produção</h1>
            <p className="text-muted-foreground">Estatísticas e análises baseadas nas fórmulas de dosagem</p>
          </div>
          <button 
            onClick={handleExport}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center"
          >
            <Download className="mr-2 h-5 w-5" />
            Exportar Relatório
          </button>
        </div>
      </div>

      {/* Filtros de data */}
      <div className="mb-6 bg-card border border-border rounded-xl p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="text-sm font-medium">Período:</span>
          </div>
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-muted-foreground mb-1">De</label>
            <input
              type="date"
              id="start-date"
              className="border border-border rounded-md px-3 py-2 bg-background"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-muted-foreground mb-1">Até</label>
            <input
              type="date"
              id="end-date"
              className="border border-border rounded-md px-3 py-2 bg-background"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Fórmulas</p>
              <p className="text-2xl font-bold">{totalFormulas}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Base</p>
              <p className="text-2xl font-bold">{totalBase.toFixed(2)}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Pigmento A</p>
              <p className="text-2xl font-bold">{totalPigmentA.toFixed(2)}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Pigmento B</p>
              <p className="text-2xl font-bold">{totalPigmentB.toFixed(2)}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Pigmento C</p>
              <p className="text-2xl font-bold">{totalPigmentC.toFixed(2)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de composição média */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Composição Média das Fórmulas</h2>
        <div className="flex items-end justify-center h-64 space-x-8">
          {totalFormulas > 0 && (
            <>
              <div className="flex flex-col items-center">
                <div 
                  className="w-16 bg-blue-500 rounded-t-lg transition-all duration-500"
                  style={{ height: `${(totalBase / totalFormulas) * 4}px` }}
                ></div>
                <p className="mt-2 text-sm">Base</p>
                <p className="text-xs text-muted-foreground">{(totalBase / totalFormulas).toFixed(2)}%</p>
              </div>
              <div className="flex flex-col items-center">
                <div 
                  className="w-16 bg-red-500 rounded-t-lg transition-all duration-500"
                  style={{ height: `${(totalPigmentA / totalFormulas) * 4}px` }}
                ></div>
                <p className="mt-2 text-sm">Pigmento A</p>
                <p className="text-xs text-muted-foreground">{(totalPigmentA / totalFormulas).toFixed(2)}%</p>
              </div>
              <div className="flex flex-col items-center">
                <div 
                  className="w-16 bg-green-500 rounded-t-lg transition-all duration-500"
                  style={{ height: `${(totalPigmentB / totalFormulas) * 4}px` }}
                ></div>
                <p className="mt-2 text-sm">Pigmento B</p>
                <p className="text-xs text-muted-foreground">{(totalPigmentB / totalFormulas).toFixed(2)}%</p>
              </div>
              <div className="flex flex-col items-center">
                <div 
                  className="w-16 bg-yellow-500 rounded-t-lg transition-all duration-500"
                  style={{ height: `${(totalPigmentC / totalFormulas) * 4}px` }}
                ></div>
                <p className="mt-2 text-sm">Pigmento C</p>
                <p className="text-xs text-muted-foreground">{(totalPigmentC / totalFormulas).toFixed(2)}%</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lista de fórmulas recentes */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold">Fórmulas Recentes</h2>
        </div>
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                ID da Fórmula
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
                Data
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {filteredFormulas.slice(0, 10).map((formula) => (
              <tr key={formula.id} className="hover:bg-muted/10">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                  {formula.id.substring(0, 8)}...
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
            ))}
          </tbody>
        </table>
        
        {filteredFormulas.length === 0 && (
          <div className="text-center py-12">
            <BarChart className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Nenhuma fórmula encontrada</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Não há fórmulas de dosagem no período selecionado.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}