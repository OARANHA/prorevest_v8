import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { MapPin, TrendingUp, Package, AlertTriangle } from "lucide-react";
import { ReportService } from "../../services/reportService";

export const meta: MetaFunction = () => {
  return [
    { title: "Mapa de Calor Regional - ProRevest" },
    { name: "description", content: "Mapa de calor de regiões + sugestão de estoque regional" },
  ];
}

// Dados simulados para o mapa de calor regional
const REGION_DATA = [
  { region: "São Paulo", state: "SP", sales: 125000, orders: 342, products: 45, stockLevel: 85, suggestedStock: 120, status: "adequate" },
  { region: "Rio de Janeiro", state: "RJ", sales: 89000, orders: 210, products: 38, stockLevel: 65, suggestedStock: 90, status: "low" },
  { region: "Minas Gerais", state: "MG", sales: 76000, orders: 187, products: 32, stockLevel: 58, suggestedStock: 75, status: "adequate" },
  { region: "Bahia", state: "BA", sales: 54000, orders: 143, products: 28, stockLevel: 42, suggestedStock: 60, status: "low" },
  { region: "Paraná", state: "PR", sales: 67000, orders: 165, products: 35, stockLevel: 48, suggestedStock: 70, status: "adequate" },
  { region: "Rio Grande do Sul", state: "RS", sales: 58000, orders: 132, products: 30, stockLevel: 40, suggestedStock: 55, status: "critical" },
  { region: "Santa Catarina", state: "SC", sales: 45000, orders: 110, products: 25, stockLevel: 35, suggestedStock: 50, status: "adequate" },
  { region: "Goiás", state: "GO", sales: 38000, orders: 95, products: 22, stockLevel: 28, suggestedStock: 40, status: "low" },
  { region: "Distrito Federal", state: "DF", sales: 32000, orders: 82, products: 20, stockLevel: 25, suggestedStock: 35, status: "adequate" },
  { region: "Pernambuco", state: "PE", sales: 29000, orders: 75, products: 18, stockLevel: 22, suggestedStock: 30, status: "low" },
];

export default function AdminRegionHeatmap() {
  const [regionData, setRegionData] = useState(REGION_DATA);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "adequate" | "low" | "critical">("all");

  // Filtrar dados com base no filtro selecionado
  const filteredData = filter === "all" 
    ? regionData 
    : regionData.filter(region => region.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "adequate": return "bg-green-500";
      case "low": return "bg-yellow-500";
      case "critical": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "adequate": return "Adequado";
      case "low": return "Baixo";
      case "critical": return "Crítico";
      default: return "Desconhecido";
    }
  };

  const handleUpdateStock = (region: string, newStock: number) => {
    setRegionData(prev => 
      prev.map(r => 
        r.region === region 
          ? { ...r, stockLevel: newStock, status: newStock < r.suggestedStock * 0.7 ? "critical" : newStock < r.suggestedStock * 0.9 ? "low" : "adequate" } 
          : r
      )
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-cormorant font-bold">Mapa de Calor Regional</h1>
        <p className="text-muted-foreground">Análise de vendas por região + sugestão de estoque regional</p>
      </div>

      {/* Filtros */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            Todas as Regiões
          </button>
          <button 
            onClick={() => setFilter("adequate")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
              filter === "adequate" 
                ? "bg-green-500 text-white" 
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            Adequado
          </button>
          <button 
            onClick={() => setFilter("low")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
              filter === "low" 
                ? "bg-yellow-500 text-white" 
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            Baixo
          </button>
          <button 
            onClick={() => setFilter("critical")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
              filter === "critical" 
                ? "bg-red-500 text-white" 
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            Crítico
          </button>
        </div>
      </div>

      {/* Mapa de Calor */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="text-xl font-cormorant font-bold mb-4">Mapa de Calor de Vendas por Região</h2>
        <div className="relative bg-muted rounded-lg p-4 h-96">
          {/* Representação simplificada do mapa do Brasil com pontos de calor */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full bg-blue-50 rounded-lg border border-border">
              {/* Pontos de calor representando regiões */}
              {filteredData.map((region, index) => (
                <div
                  key={region.region}
                  className={`absolute rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 ${
                    selectedRegion === region.region ? "ring-4 ring-primary ring-opacity-50" : ""
                  }`}
                  style={{
                    left: `${20 + (index % 4) * 20}%`,
                    top: `${20 + Math.floor(index / 4) * 25}%`,
                    width: `${Math.max(20, region.sales / 15000)}px`,
                    height: `${Math.max(20, region.sales / 15000)}px`,
                    backgroundColor: getStatusColor(region.status),
                    opacity: 0.7,
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === region.region ? null : region.region)}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg p-2 shadow-lg whitespace-nowrap text-xs">
                    <div className="font-medium">{region.region}</div>
                    <div className="text-muted-foreground">R$ {region.sales.toLocaleString('pt-BR')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Dados Regionais */}
      <div className="bg-card border border-border rounded-xl shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-cormorant font-bold mb-4">Dados Regionais Detalhados</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/30">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Região
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Vendas (R$)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Pedidos
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Produtos
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Estoque Atual
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Estoque Sugerido
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredData.map((region) => (
                  <tr 
                    key={region.region} 
                    className={`hover:bg-muted/10 ${selectedRegion === region.region ? "bg-muted/20" : ""}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                        <div>
                          <div className="font-medium">{region.region}</div>
                          <div className="text-sm text-muted-foreground">{region.state}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span>R$ {region.sales.toLocaleString('pt-BR')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 text-blue-500 mr-1" />
                        <span>{region.orders}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {region.products}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={region.stockLevel < region.suggestedStock * 0.7 ? "text-red-500 font-medium" : ""}>
                        {region.stockLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {region.suggestedStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        region.status === "adequate" ? "bg-green-100 text-green-800" :
                        region.status === "low" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {getStatusText(region.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleUpdateStock(region.region, region.suggestedStock)}
                        className="text-primary hover:text-primary/80 flex items-center"
                      >
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Ajustar Estoque
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Vendas Totais</p>
              <p className="text-2xl font-bold">
                R$ {regionData.reduce((sum, region) => sum + region.sales, 0).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Pedidos Totais</p>
              <p className="text-2xl font-bold">
                {regionData.reduce((sum, region) => sum + region.orders, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Regiões com Estoque Baixo</p>
              <p className="text-2xl font-bold">
                {regionData.filter(region => region.status !== "adequate").length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}