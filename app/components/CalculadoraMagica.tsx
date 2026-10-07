import { useState, useEffect } from "react";
import { Calculator, Ruler, Droplets, Palette, Sparkles, Lightbulb, Zap, Star } from "lucide-react";

export default function CalculadoraMagica() {
  const [area, setArea] = useState<number>(0);
  const [layers, setLayers] = useState<number>(2);
  const [productYield, setProductYield] = useState<number>(10); // m²/L
  const [lossPercentage, setLossPercentage] = useState<number>(10); // %
  const [bucketFill, setBucketFill] = useState<number>(0); // 0-100%

  // Calcular a quantidade necessária de tinta
  const calculatePaintNeeded = () => {
    if (area <= 0) return 0;
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
  useEffect(() => {
    simulateBucketFill();
  }, [area, layers, productYield, lossPercentage]);

  const paintNeeded = calculatePaintNeeded();

  return (
    <div className="w-full py-16 relative overflow-hidden">
      {/* Background vibrante com elementos dinâmicos */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50"></div>
      <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-5 animate-bounce" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white px-6 py-3 rounded-full mb-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <Sparkles className="h-6 w-6 mr-3 animate-pulse" />
            <span className="font-bold text-lg">CALCULADORA MÁGICA</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Calculadora de Rendimento
            </span>
            <br />
            <span className="text-gray-800">Mágica</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            ✨ <strong>Descubra a quantidade exata</strong> de tinta necessária para seu projeto com nossa calculadora interativa e inteligente
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Formulário de cálculo */}
          <div className="bg-white/95 backdrop-blur-sm border-2 border-orange-200 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
            {/* Elementos decorativos no formulário */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-8 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Calculator className="h-7 w-7 text-white" />
                </div>
                <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  Parâmetros de Cálculo
                </span>
              </h3>

              <div className="space-y-6">
                <div>
                  <label htmlFor="calc-area" className="block text-sm font-medium text-gray-700 mb-2">
                    Área a ser pintada (m²)
                  </label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="calc-area"
                      name="area"
                      type="number"
                      value={area || ''}
                      onChange={(e) => setArea(Number(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Ex: 50"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="calc-layers" className="block text-sm font-medium text-gray-700 mb-2">
                    Número de demãos
                  </label>
                  <div className="relative">
                    <Droplets className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="calc-layers"
                      name="layers"
                      type="number"
                      value={layers || ''}
                      onChange={(e) => setLayers(Number(e.target.value) || 1)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Ex: 2"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="calc-yield" className="block text-sm font-medium text-gray-700 mb-2">
                    Rendimento do produto (m²/L)
                  </label>
                  <div className="relative">
                    <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="calc-yield"
                      name="productYield"
                      type="number"
                      value={productYield || ''}
                      onChange={(e) => setProductYield(Number(e.target.value) || 1)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Ex: 10"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="calc-loss" className="block text-sm font-medium text-gray-700 mb-2">
                    Percentual de perda (%)
                  </label>
                  <input
                    id="calc-loss"
                    name="lossPercentage"
                    type="range"
                    min="0"
                    max="50"
                    value={lossPercentage}
                    onChange={(e) => setLossPercentage(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>0%</span>
                    <span className="font-medium text-orange-600">{lossPercentage}%</span>
                    <span>50%</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100 border-2 border-orange-300 rounded-2xl p-8 shadow-lg relative overflow-hidden">
                  {/* Elementos decorativos no resultado */}
                  <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full opacity-30 animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>

                  <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full mb-4 shadow-lg">
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                      Resultado Mágico
                    </h4>
                    <p className="text-5xl font-bold text-orange-600 mb-3 animate-pulse">
                      {paintNeeded.toFixed(2)}
                      <span className="text-2xl text-pink-600 ml-1">L</span>
                    </p>
                    <p className="text-gray-700 font-medium">
                      de tinta necessários para sua obra ✨
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Animação do balde enchendo */}
          <div className="bg-white/95 backdrop-blur-sm border-2 border-purple-200 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
            {/* Elementos decorativos na visualização */}
            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-8 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Visualização Mágica
                </span>
              </h3>

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
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 bg-orange-500 rounded-b transition-all duration-1000 ease-in-out"
                      style={{
                        height: `${bucketFill}%`,
                        maxHeight: '128px'
                      }}
                    ></div>

                    {/* Brilho na tinta */}
                    <div
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-orange-300 rounded-full opacity-60 transition-all duration-1000 ease-in-out"
                      style={{
                        bottom: `${bucketFill * 0.8}%`
                      }}
                    ></div>
                  </div>

                  {/* Efeito mágico */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16">
                    <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-70 animate-ping"></div>
                    <div className="absolute inset-2 bg-yellow-300 rounded-full opacity-50 animate-ping" style={{ animationDelay: '300ms' }}></div>
                    <div className="absolute inset-4 bg-yellow-200 rounded-full opacity-30 animate-ping" style={{ animationDelay: '700ms' }}></div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Sua tinta mágica está pronta!</h3>
                  <p className="text-gray-600">
                    Com base nos seus dados, você precisará de <span className="font-bold text-orange-600">{paintNeeded.toFixed(2)}L</span> de tinta.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Ajuste os parâmetros ao lado para ver a mágica acontecer!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dicas Mágicas - Versão Melhorada */}
        <div className="mt-16 bg-gradient-to-br from-orange-50 via-white to-blue-50 border-2 border-orange-200 rounded-3xl p-12 shadow-2xl max-w-6xl mx-auto relative overflow-hidden">
          {/* Elementos decorativos */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-5 animate-bounce" style={{ animationDelay: '2s' }}></div>

          <div className="relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
                <Sparkles className="h-6 w-6 mr-3" />
                <span className="font-bold text-lg">DICAS MÁGICAS EXCLUSIVAS</span>
              </div>
              <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
                Segredos dos Mestres Pintores
              </h3>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Descubra técnicas profissionais que garantem um acabamento perfeito e duradouro
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group">
                <div className="bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                    <Droplets className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-4 text-center">Demãos Perfeitas</h4>
                  <p className="text-gray-700 text-center leading-relaxed">
                    ✨ <strong>Duas demãos</strong> geralmente são suficientes para uma cobertura uniforme e duradoura. A primeira cria a base, a segunda sela a proteção!
                  </p>
                  <div className="mt-4 text-center">
                    <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Técnica Profissional
                    </span>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                    <Calculator className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-4 text-center">Cálculo Inteligente</h4>
                  <p className="text-gray-700 text-center leading-relaxed">
                    🎯 Considere uma <strong>margem de 5-15%</strong> para perdas durante a aplicação. Melhor sobrar que faltar no meio do projeto!
                  </p>
                  <div className="mt-4 text-center">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Economia Garantida
                    </span>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/80 backdrop-blur-sm border-2 border-green-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                    <Palette className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-4 text-center">Rendimento Máximo</h4>
                  <p className="text-gray-700 text-center leading-relaxed">
                    📋 Sempre <strong>verifique o rendimento</strong> especificado na embalagem. Cada produto tem sua característica única de cobertura!
                  </p>
                  <div className="mt-4 text-center">
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Qualidade Superior
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dicas extras com estilo */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-4 shadow-md">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-gray-800">Dica Premium</h5>
                    <p className="text-amber-700 font-medium">Aplicação Profissional</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  🏆 Para acabamentos premium, aguarde <strong>4 horas entre demãos</strong>.
                  Isso garante aderência perfeita e previne bolhas ou imperfeições!
                </p>
              </div>

              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mr-4 shadow-md">
                    <Ruler className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-gray-800">Medida Certa</h5>
                    <p className="text-cyan-700 font-medium">Preparação Essencial</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  📐 <strong>Prepare bem a superfície</strong> antes de pintar. Uma parede bem preparada
                  garante 70% da qualidade final do acabamento!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
