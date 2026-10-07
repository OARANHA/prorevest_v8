import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Ruler, 
  Droplets, 
  Calculator, 
  Info, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { ProductService } from '../services/productService';
import type { ProductWithDetails } from '../services/productService';

export default function MagicYieldCalculator() {
  const [area, setArea] = useState<number>(50);
  const [layers, setLayers] = useState<number>(2);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithDetails | null>(null);
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [yieldPerLiter, setYieldPerLiter] = useState<number>(10); // 10m² por litro
  const [isAnimating, setIsAnimating] = useState(false);
  const [calculatedLiters, setCalculatedLiters] = useState<number>(0);
  const [calculatedCans, setCalculatedCans] = useState<number>(0);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Carregar produtos disponíveis
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productData = await ProductService.getAllProducts();
        setProducts(productData);
        if (productData.length > 0) {
          setSelectedProduct(productData[0]);
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      }
    };

    fetchProducts();
  }, []);

  // Recalcular quando os valores mudarem
  useEffect(() => {
    calculateYield();
  }, [area, layers, yieldPerLiter]);

  const calculateYield = () => {
    // Fórmula: (Área * Número de demãos) / Rendimento por litro
    const liters = (area * layers) / yieldPerLiter;
    const cans = Math.ceil(liters / 3.6); // Considerando latas de 3,6L
    
    setCalculatedLiters(parseFloat(liters.toFixed(2)));
    setCalculatedCans(cans);
  };

  const startAnimation = () => {
    setIsAnimating(true);
    setAnimationProgress(0);
    
    const interval = setInterval(() => {
      setAnimationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnimating(false);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setAnimationProgress(0);
  };

  const getBucketFillHeight = () => {
    return `${Math.min(animationProgress, 100)}%`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Calculadora de Rendimento Mágica</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra exatamente quanta tinta você precisa para o seu projeto com nossa calculadora interativa
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Painel de Controle */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl shadow-lg p-6 border border-border sticky top-8">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Calculator className="mr-2 h-5 w-5 text-primary" />
                Parâmetros do Cálculo
              </h2>
              
              <div className="space-y-6">
                {/* Área a ser pintada */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center">
                    <Ruler className="mr-2 h-4 w-4 text-primary" />
                    Área a ser pintada (m²)
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="1"
                      max="500"
                      value={area}
                      onChange={(e) => setArea(Number(e.target.value))}
                      className="flex-1"
                    />
                    <input
                      type="number"
                      min="1"
                      max="500"
                      value={area}
                      onChange={(e) => setArea(Number(e.target.value))}
                      className="w-20 px-3 py-2 border border-border rounded-lg bg-background text-right"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Área total: {area} m²
                  </div>
                </div>
                
                {/* Número de demãos */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Número de demãos
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="1"
                      max="4"
                      value={layers}
                      onChange={(e) => setLayers(Number(e.target.value))}
                      className="flex-1"
                    />
                    <input
                      type="number"
                      min="1"
                      max="4"
                      value={layers}
                      onChange={(e) => setLayers(Number(e.target.value))}
                      className="w-20 px-3 py-2 border border-border rounded-lg bg-background text-right"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {layers} demã{layers > 1 ? 'os' : 'o'}
                  </div>
                </div>
                
                {/* Rendimento por litro */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center">
                    <Droplets className="mr-2 h-4 w-4 text-primary" />
                    Rendimento por litro (m²/L)
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="0.5"
                      value={yieldPerLiter}
                      onChange={(e) => setYieldPerLiter(Number(e.target.value))}
                      className="flex-1"
                    />
                    <input
                      type="number"
                      min="1"
                      max="30"
                      step="0.5"
                      value={yieldPerLiter}
                      onChange={(e) => setYieldPerLiter(Number(e.target.value))}
                      className="w-20 px-3 py-2 border border-border rounded-lg bg-background text-right"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {yieldPerLiter} m² por litro
                  </div>
                </div>
                
                {/* Seleção de produto */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Produto selecionado
                  </label>
                  <select
                    value={selectedProduct?.id || ''}
                    onChange={(e) => {
                      const product = products.find(p => p.id === e.target.value);
                      setSelectedProduct(product || null);
                    }}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  >
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  
                  {selectedProduct && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-muted rounded-lg w-12 h-12 flex items-center justify-center mr-3">
                          {selectedProduct.product_variants[0]?.image_url ? (
                            <img 
                              src={selectedProduct.product_variants[0].image_url} 
                              alt={selectedProduct.name} 
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Droplets className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{selectedProduct.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {selectedProduct.finish?.name || 'Acabamento padrão'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Botão de calcular */}
                <button
                  onClick={startAnimation}
                  disabled={isAnimating}
                  className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isAnimating ? (
                    <span className="flex items-center justify-center">
                      <Pause className="h-5 w-5 mr-2" />
                      Calculando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Play className="h-5 w-5 mr-2" />
                      Calcular Tinta Necessária
                    </span>
                  )}
                </button>
                
                <button
                  onClick={resetAnimation}
                  className="w-full bg-muted hover:bg-muted/80 text-foreground px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Resetar
                </button>
              </div>
            </div>
          </div>
          
          {/* Área de Visualização */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
              <h2 className="text-xl font-bold mb-6">Resultado da Calculadora</h2>
              
              {/* Animação do balde */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-48 h-64 mb-8">
                  {/* Balde */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-40 bg-gray-300 rounded-b-lg border-4 border-gray-500">
                    {/* Nível da tinta */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-gray-600 rounded-b transition-all duration-300 ease-out"
                      style={{ height: getBucketFillHeight() }}
                    />
                    
                    {/* Detalhes do balde */}
                    <div className="absolute top-2 left-2 right-2 h-1 bg-gray-500 rounded-full"></div>
                    <div className="absolute top-6 left-2 right-2 h-1 bg-gray-500 rounded-full"></div>
                  </div>
                  
                  {/* Efeito de respingo quando completo */}
                  {animationProgress >= 100 && (
                    <>
                      <div className="absolute top-0 left-1/4 w-4 h-4 bg-gray-500 rounded-full animate-bounce animation-delay-100"></div>
                      <div className="absolute top-4 left-1/2 w-3 h-3 bg-gray-400 rounded-full animate-bounce animation-delay-300"></div>
                      <div className="absolute top-2 left-3/4 w-5 h-5 bg-gray-600 rounded-full animate-bounce animation-delay-500"></div>
                    </>
                  )}
                </div>
                
                <h3 className="text-2xl font-bold text-center">
                  {animationProgress >= 100 ? (
                    <span className="text-primary">Cálculo Concluído!</span>
                  ) : (
                    <span>Calculando... {animationProgress}%</span>
                  )}
                </h3>
              </div>
              
              {/* Resultados */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                  <div className="text-primary mb-2">
                    <Droplets className="h-8 w-8 inline" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{calculatedLiters}L</div>
                  <div className="text-muted-foreground">de tinta necessária</div>
                </div>
                
                <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-6">
                  <div className="text-secondary mb-2">
                    <svg className="h-8 w-8 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="text-3xl font-bold mb-1">{calculatedCans}</div>
                  <div className="text-muted-foreground">lata{calculatedCans !== 1 ? 's' : ''} de 3,6L</div>
                </div>
              </div>
              
              {/* Detalhes do cálculo */}
              <div className="bg-muted/30 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Info className="mr-2 h-5 w-5 text-primary" />
                  Detalhes do Cálculo
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Área total:</span>
                    <span className="font-medium">{area} m²</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Número de demãos:</span>
                    <span className="font-medium">{layers}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Área total a pintar:</span>
                    <span className="font-medium">{area * layers} m²</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Rendimento por litro:</span>
                    <span className="font-medium">{yieldPerLiter} m²/L</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Tinta necessária:</span>
                    <span className="font-medium">{calculatedLiters}L</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Latas de 3,6L necessárias:</span>
                    <span className="font-medium">{calculatedCans}</span>
                  </div>
                </div>
              </div>
              
              {/* Recomendações */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center text-blue-800">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Recomendações
                </h3>
                
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Recomendamos comprar 10% a mais para possíveis correções</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Agite bem a tinta antes de aplicar</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Deixe secar completamente entre as demãos</span>
                  </li>
                </ul>
              </div>
              
              {/* Ações */}
              <div className="flex flex-wrap gap-4 mt-8">
                <Link 
                  to="/orcamento"
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center"
                >
                  Solicitar Orçamento
                </Link>

                {selectedProduct && (
                  <Link 
                    to={`/produto/${selectedProduct.slug}`}
                    className="bg-muted hover:bg-muted/80 text-foreground px-6 py-3 rounded-lg font-semibold transition-colors flex items-center"
                  >
                    Ver Produto
                  </Link>
                )}
              </div>
            </div>
            
            {/* Informações sobre o produto */}
            {selectedProduct && (
              <div className="bg-card rounded-xl shadow-lg p-6 border border-border mt-6">
                <h2 className="text-xl font-bold mb-4">Sobre o Produto Selecionado</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Descrição</h3>
                    <p className="text-muted-foreground">
                      {selectedProduct.description || 'Descrição não disponível.'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Dados Técnicos</h3>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>Rendimento: {yieldPerLiter} m²/L</li>
                      <li>Acabamento: {selectedProduct.finish?.name || 'Não especificado'}</li>
                      <li>Secagem: 2-4 horas</li>
                      <li>Durabilidade: 10 anos</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Cores Disponíveis</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.product_colors.slice(0, 8).map((color, index) => (
                      <div 
                        key={index}
                        className="w-8 h-8 rounded-full border border-border cursor-pointer hover:scale-110 transition-transform"
                        style={{ backgroundColor: color.color.hex_code }}
                        title={color.color.name}
                      />
                    ))}
                    {selectedProduct.product_colors.length > 8 && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">
                        +{selectedProduct.product_colors.length - 8}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}