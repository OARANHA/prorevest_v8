import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { AlertTriangle, Bell, TrendingUp, Calendar, Filter } from "lucide-react";
import { DosageService, type DosageFormula } from "../../services/dosageService";

export const meta: MetaFunction = () => {
  return [
    { title: "Alertas Preditivos - ProRevest" },
    { name: "description", content: "Alertas preditivos para otimização da produção" },
  ];
}

export default function PredictiveAlerts() {
  const [formulas, setFormulas] = useState<DosageFormula[]>([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  // Carregar fórmulas de dosagem
  useEffect(() => {
    const loadFormulas = async () => {
      try {
        const allFormulas = await DosageService.getAllFormulas();
        setFormulas(allFormulas);
        
        // Gerar alertas preditivos com base nas fórmulas
        generatePredictiveAlerts(allFormulas);
      } catch (error) {
        console.error("Erro ao carregar fórmulas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFormulas();
  }, []);

  // Gerar alertas preditivos com base nas fórmulas
  const generatePredictiveAlerts = (formulasData: DosageFormula[]) => {
    const newAlerts = [];
    
    // Calcular médias de uso de pigmentos
    const totalFormulas = formulasData.length;
    if (totalFormulas > 0) {
      const avgBase = formulasData.reduce((sum, f) => sum + f.base_percentage, 0) / totalFormulas;
      const avgPigmentA = formulasData.reduce((sum, f) => sum + f.pigment_a_percentage, 0) / totalFormulas;
      const avgPigmentB = formulasData.reduce((sum, f) => sum + f.pigment_b_percentage, 0) / totalFormulas;
      const avgPigmentC = formulasData.reduce((sum, f) => sum + f.pigment_c_percentage, 0) / totalFormulas;
      
      // Alerta de alto consumo de base
      if (avgBase > 80) {
        newAlerts.push({
          id: "high-base-consumption",
          type: "warning",
          title: "Alto consumo de base",
          message: `A média de uso de base (${avgBase.toFixed(2)}%) está acima do limite recomendado (80%).`,
          priority: "high",
          date: new Date().toISOString()
        });
      }
      
      // Alerta de baixo consumo de pigmentos
      if (avgPigmentA < 5) {
        newAlerts.push({
          id: "low-pigment-a",
          type: "info",
          title: "Baixo consumo de Pigmento A",
          message: `A média de uso do Pigmento A (${avgPigmentA.toFixed(2)}%) está abaixo do limite recomendado (5%).`,
          priority: "medium",
          date: new Date().toISOString()
        });
      }
      
      if (avgPigmentB < 5) {
        newAlerts.push({
          id: "low-pigment-b",
          type: "info",
          title: "Baixo consumo de Pigmento B",
          message: `A média de uso do Pigmento B (${avgPigmentB.toFixed(2)}%) está abaixo do limite recomendado (5%).`,
          priority: "medium",
          date: new Date().toISOString()
        });
      }
      
      if (avgPigmentC < 5) {
        newAlerts.push({
          id: "low-pigment-c",
          type: "info",
          title: "Baixo consumo de Pigmento C",
          message: `A média de uso do Pigmento C (${avgPigmentC.toFixed(2)}%) está abaixo do limite recomendado (5%).`,
          priority: "medium",
          date: new Date().toISOString()
        });
      }
      
      // Verificar fórmulas recentes para padrões incomuns
      const recentFormulas = formulasData
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);
      
      // Verificar se há muitas fórmulas com alto teor de pigmentos
      const highPigmentFormulas = recentFormulas.filter(
        f => f.pigment_a_percentage > 30 || f.pigment_b_percentage > 30 || f.pigment_c_percentage > 30
      );
      
      if (highPigmentFormulas.length > 5) {
        newAlerts.push({
          id: "high-pigment-trend",
          type: "warning",
          title: "Tendência de alto teor de pigmentos",
          message: `${highPigmentFormulas.length} das últimas 10 fórmulas têm alto teor de pigmentos. Verifique o estoque.`,
          priority: "high",
          date: new Date().toISOString()
        });
      }
    }
    
    setAlerts(newAlerts);
  };

  // Filtrar alertas com base no filtro selecionado
  const filteredAlerts = filter === "all" 
    ? alerts 
    : alerts.filter(alert => alert.priority === filter);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Bell className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Alta</span>;
      case "medium":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Média</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Baixa</span>;
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
            <h1 className="text-3xl font-cormorant font-bold">Alertas Preditivos</h1>
            <p className="text-muted-foreground">Alertas inteligentes para otimização da produção</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 bg-card border border-border rounded-xl p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="text-sm font-medium">Filtrar por prioridade:</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filter === "all" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter("high")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filter === "high" 
                  ? "bg-red-100 text-red-800" 
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Alta
            </button>
            <button
              onClick={() => setFilter("medium")}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                filter === "medium" 
                  ? "bg-yellow-100 text-yellow-800" 
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Média
            </button>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Bell className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Total de Alertas</p>
              <p className="text-2xl font-bold">{alerts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Alertas de Alta Prioridade</p>
              <p className="text-2xl font-bold">{alerts.filter(a => a.priority === "high").length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Fórmulas Analisadas</p>
              <p className="text-2xl font-bold">{formulas.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de alertas */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold">Alertas Identificados</h2>
        </div>
        {filteredAlerts.length > 0 ? (
          <ul className="divide-y divide-border">
            {filteredAlerts.map((alert) => (
              <li key={alert.id} className="p-6 hover:bg-muted/10">
                <div className="flex items-start">
                  {getAlertIcon(alert.type)}
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">{alert.title}</h3>
                      {getPriorityBadge(alert.priority)}
                    </div>
                    <p className="mt-1 text-muted-foreground">{alert.message}</p>
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>{new Date(alert.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Nenhum alerta encontrado</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Não há alertas preditivos com base nos critérios selecionados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}