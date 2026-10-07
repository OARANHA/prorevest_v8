import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState } from "react";
import { Save, Calculator, Settings } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Configurações Técnicas - ProRevest" },
    { name: "description", content: "Configurações técnicas e fórmulas de cálculo automático" },
  ];
}

export default function AdminTechnicalSettings() {
  const [yieldFormula, setYieldFormula] = useState({
    baseCoefficient: 10,
    lossPercentage: 10,
    textureFactor: 1.2
  });
  
  const [coverageFormula, setCoverageFormula] = useState({
    baseCoverage: 100,
    colorFactor: 0.95,
    textureFactor: 1.1
  });
  
  const [pricingFormula, setPricingFormula] = useState({
    baseMargin: 30,
    volumeDiscount: 5,
    seasonalAdjustment: 2
  });

  const handleSave = () => {
    // Em uma implementação real, salvaríamos essas configurações no banco de dados
    console.log("Configurações salvas:", { yieldFormula, coverageFormula, pricingFormula });
    alert("Configurações técnicas salvas com sucesso!");
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-cormorant font-bold">Configurações Técnicas</h1>
        <p className="text-muted-foreground">Gerencie as fórmulas de cálculo automático</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fórmula de Rendimento */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-primary" />
            Fórmula de Rendimento
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Coeficiente Base (m²/L)
              </label>
              <input
                type="number"
                value={yieldFormula.baseCoefficient}
                onChange={(e) => setYieldFormula({...yieldFormula, baseCoefficient: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                min="1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Percentual de Perda (%)
              </label>
              <input
                type="number"
                value={yieldFormula.lossPercentage}
                onChange={(e) => setYieldFormula({...yieldFormula, lossPercentage: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                min="0"
                max="100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Fator de Textura
              </label>
              <input
                type="number"
                step="0.1"
                value={yieldFormula.textureFactor}
                onChange={(e) => setYieldFormula({...yieldFormula, textureFactor: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                min="0.1"
              />
            </div>
          </div>
        </div>
        
        {/* Fórmula de Cobertura */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-primary" />
            Fórmula de Cobertura
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Cobertura Base (m²/L)
              </label>
              <input
                type="number"
                value={coverageFormula.baseCoverage}
                onChange={(e) => setCoverageFormula({...coverageFormula, baseCoverage: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                min="1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Fator de Cor
              </label>
              <input
                type="number"
                step="0.01"
                value={coverageFormula.colorFactor}
                onChange={(e) => setCoverageFormula({...coverageFormula, colorFactor: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                min="0.1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Fator de Textura
              </label>
              <input
                type="number"
                step="0.1"
                value={coverageFormula.textureFactor}
                onChange={(e) => setCoverageFormula({...coverageFormula, textureFactor: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                min="0.1"
              />
            </div>
          </div>
        </div>
        
        {/* Fórmula de Precificação */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-primary" />
            Fórmula de Precificação
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Margem Base (%)
              </label>
              <input
                type="number"
                value={pricingFormula.baseMargin}
                onChange={(e) => setPricingFormula({...pricingFormula, baseMargin: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                min="1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Desconto por Volume (%)
              </label>
              <input
                type="number"
                value={pricingFormula.volumeDiscount}
                onChange={(e) => setPricingFormula({...pricingFormula, volumeDiscount: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Ajuste Sazonal (%)
              </label>
              <input
                type="number"
                value={pricingFormula.seasonalAdjustment}
                onChange={(e) => setPricingFormula({...pricingFormula, seasonalAdjustment: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Save className="h-5 w-5 mr-2" />
          Salvar Configurações
        </button>
      </div>
      
      {/* Informações adicionais */}
      <div className="mt-6 bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2 text-primary" />
          Como funcionam as fórmulas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Fórmula de Rendimento</h3>
            <p className="text-sm text-muted-foreground">
              Calcula a quantidade de tinta necessária com base na área, número de demãos, perdas e características da superfície.
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Fórmula de Cobertura</h3>
            <p className="text-sm text-muted-foreground">
              Determina a eficiência de cobertura da tinta com base na cor e textura do produto.
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Fórmula de Precificação</h3>
            <p className="text-sm text-muted-foreground">
              Calcula o preço final do produto considerando margens, descontos e ajustes sazonais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}