import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState } from "react";
import { Calculator, Ruler, Droplets, Palette } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Calculadora de Rendimento Mágica - ProRevest" },
    { name: "description", content: "Calculadora mágica para estimar o rendimento de tintas com animação de balde enchendo" },
  ];
}

export default function AdminMagicCalculator() {
  const [area, setArea] = useState<number>(0);
  const [layers, setLayers] = useState<number>(2);
  const [productYield, setProductYield] = useState<number>(10); // m²/L
  const [lossPercentage, setLossPercentage] = useState<number>(10); // %
  const [bucketFill, setBucketFill] = useState<number>(0); // 0-100%

  // Calcular a quantidade necessária de tinta
  const calculatePaintNeeded = () => {
    const baseAmount = area * layers;
    const withLoss = baseAmount * (1 + lossPercentage / 100);
    const paintNeeded = withLoss / productYield;
    return paintNeeded;
  };

  // Simular o enchimento do balde
  const simulateBucketFill = () => {
    const paintNeeded = calculatePaintNeeded();
    const fillPercentage = Math.min(100, (paintNeeded / 20) * 100); // Assumindo 20L como capacidade máxima
    setBucketFill(fillPercentage);
  };

  // Executar simulação quando os valores mudarem
  useState(() => {
    simulateBucketFill();
  });

  const paintNeeded = calculatePaintNeeded();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-cormorant font-bold">Calculadora de Rendimento Mágica</h1>
        <p className="text-muted-foreground">Calcule a quantidade exata de tinta necessária com nossa calculadora mágica</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de cálculo */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-primary" />
            Parâmetros de Cálculo
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Área a ser pintada (m²)
              </label>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ex: 50"
                  min="0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Número de demãos
              </label>
              <div className="relative">
                <Droplets className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="number"
                  value={layers}
                  onChange={(e) => setLayers(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ex: 2"
                  min="1"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Rendimento do produto (m²/L)
              </label>
              <div className="relative">
                <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="number"
                  value={productYield}
                  onChange={(e) => setProductYield(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ex: 10"
                  min="1"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Percentual de perda (%)
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={lossPercentage}
                onChange={(e) => setLossPercentage(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>0%</span>
                <span className="font-medium">{lossPercentage}%</span>
                <span>50%</span>
              </div>
            </div>
            
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-medium text-foreground mb-2">Resultado do Cálculo</h3>
              <p className="text-2xl font-bold text-primary">
                {paintNeeded.toFixed(2)} litros
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                de tinta necessários para sua obra
              </p>
            </div>
          </div>
        </div>
        
        {/* Animação do balde enchendo */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-cormorant font-bold mb-4">Visualização Mágica</h2>
          
          <div className="flex flex-col items-center justify-center h-full">
            <div className="relative w-48 h-64 mb-8">
              {/* Balde */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-40">
                {/* Sombra do balde */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-28 h-36 bg-gray-300 rounded-b-lg"></div>
                
                {/* Corpo do balde */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-32 bg-gray-200 rounded-b-lg border-2 border-gray-400"></div>
                
                {/* Tampa do balde */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-28 h-6 bg-gray-500 rounded-t-lg"></div>
                
                {/* Tinta dentro do balde (animação) */}
                <div 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 bg-gray-600 rounded-b transition-all duration-1000 ease-in-out"
                  style={{ 
                    height: `${bucketFill}%`,
                    maxHeight: '128px'
                  }}
                ></div>
                
                {/* Brilho na tinta */}
                <div 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gray-400 rounded-full opacity-30 transition-all duration-1000 ease-in-out"
                  style={{ 
                    bottom: `${bucketFill * 0.8}%`
                  }}
                ></div>
              </div>
              
              {/* Efeito mágico */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16">
                <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-70 animate-ping"></div>
                <div className="absolute inset-2 bg-yellow-300 rounded-full opacity-50 animate-ping animation-delay-300"></div>
                <div className="absolute inset-4 bg-yellow-200 rounded-full opacity-30 animate-ping animation-delay-700"></div>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-cormorant font-bold mb-2">Sua tinta mágica está pronta!</h3>
              <p className="text-muted-foreground">
                Com base nos seus dados, você precisará de <span className="font-bold text-primary">{paintNeeded.toFixed(2)}L</span> de tinta.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Ajuste os parâmetros ao lado para ver a mágica acontecer!
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Informações adicionais */}
      <div className="mt-6 bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-cormorant font-bold mb-4">Dicas Mágicas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Demãos</h3>
            <p className="text-sm text-muted-foreground">
              Duas demãos geralmente são suficientes para uma cobertura uniforme e duradoura.
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Perdas</h3>
            <p className="text-sm text-muted-foreground">
              Considere uma margem de 5-15% para perdas durante a aplicação.
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Rendimento</h3>
            <p className="text-sm text-muted-foreground">
              Verifique o rendimento especificado na embalagem do produto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}