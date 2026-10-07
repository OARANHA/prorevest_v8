import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Droplets,
  Brush,
  Sun,
  ShieldCheck,
  Package,
  Ruler,
  Scale,
  Eye,
  Check
} from 'lucide-react';
import { ProductService } from '../services/productService';
import type { ProductWithDetails } from '../services/productService';

export default function ProductComparator() {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProductWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productData = await ProductService.getProducts();
      setProducts(productData);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addProductToComparison = (product: ProductWithDetails) => {
    if (selectedProducts.length < 4 && !selectedProducts.some(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const removeProductFromComparison = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % Math.ceil(filteredProducts.length / 4));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + Math.ceil(filteredProducts.length / 4)) % Math.ceil(filteredProducts.length / 4));
  };

  // Função para renderizar estrelas de avaliação
  const renderRating = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  // Função para obter ícones com base nas características do produto
  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case 'durabilidade':
        return <ShieldCheck className="h-5 w-5 text-primary" />;
      case 'acabamento':
        return <Brush className="h-5 w-5 text-primary" />;
      case 'resistência uv':
        return <Sun className="h-5 w-5 text-primary" />;
      case 'cobertura':
        return <Droplets className="h-5 w-5 text-primary" />;
      default:
        return <Package className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Comparador de Produtos</h1>
          <p className="text-lg text-muted-foreground">
            Compare até 4 produtos lado a lado para tomar a melhor decisão
          </p>
        </div>

        {/* Produtos Selecionados para Comparação */}
        {selectedProducts.length > 0 && (
          <div className="bg-card rounded-xl shadow-lg p-6 mb-8 border border-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Produtos Selecionados ({selectedProducts.length}/4)</h2>
              <button 
                onClick={() => setSelectedProducts([])}
                className="text-sm text-destructive hover:text-destructive/80"
              >
                Limpar Todos
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <div className="flex space-x-6 min-w-max">
                {selectedProducts.map((product) => (
                  <div key={product.id} className="flex flex-col w-64 flex-shrink-0">
                    <div className="relative">
                      <button
                        onClick={() => removeProductFromComparison(product.id)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="bg-muted rounded-lg h-40 flex items-center justify-center mb-3">
                        {product.product_variants[0]?.image_url ? (
                          <img 
                            src={product.product_variants[0].image_url} 
                            alt={product.name} 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
                      <h3 className="font-bold text-center">{product.name}</h3>
                      <p className="text-sm text-muted-foreground text-center line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>
                ))}
                
                {selectedProducts.length < 4 && (
                  <div className="flex flex-col w-64 flex-shrink-0">
                    <div className="bg-muted/50 rounded-lg h-40 flex flex-col items-center justify-center border-2 border-dashed border-border">
                      <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-muted-foreground text-center">
                        Adicione mais produtos para comparar
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tabela de Comparação */}
        {selectedProducts.length > 0 && (
          <div className="bg-card rounded-xl shadow-lg p-6 mb-8 border border-border overflow-x-auto">
            <h2 className="text-2xl font-bold mb-6">Comparação Detalhada</h2>
            
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-4 w-48">Características</th>
                  {selectedProducts.map((product) => (
                    <th key={product.id} className="p-4 text-center">
                      <div className="flex flex-col items-center">
                        <div className="bg-muted rounded-lg h-20 w-20 flex items-center justify-center mb-2 mx-auto">
                          {product.product_variants[0]?.image_url ? (
                            <img 
                              src={product.product_variants[0].image_url} 
                              alt={product.name} 
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <span className="font-bold text-sm">{product.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="p-4 font-medium">Avaliação</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="flex flex-col items-center">
                        {renderRating(4)} {/* Valor fixo para demonstração */}
                        <span className="text-sm text-muted-foreground mt-1">(4.5/5)</span>
                      </div>
                    </td>
                  ))}
                </tr>
                
                <tr className="border-t border-border">
                  <td className="p-4 font-medium">Preço</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="font-bold text-lg">R$ 89,90</div>
                      <div className="text-sm text-muted-foreground">por litro</div>
                    </td>
                  ))}
                </tr>
                
                <tr className="border-t border-border">
                  <td className="p-4 font-medium">Cobertura</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="flex items-center justify-center">
                        <Eye className="h-5 w-5 text-primary mr-2" />
                        <span>10m²/L</span>
                      </div>
                    </td>
                  ))}
                </tr>
                
                <tr className="border-t border-border">
                  <td className="p-4 font-medium">Acabamento</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                        {product.finish?.name || 'Satinado'}
                      </span>
                    </td>
                  ))}
                </tr>
                
                <tr className="border-t border-border">
                  <td className="p-4 font-medium">Durabilidade</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5 text-primary mr-2" />
                        <span>10 anos</span>
                      </div>
                    </td>
                  ))}
                </tr>
                
                <tr className="border-t border-border">
                  <td className="p-4 font-medium">Resistência UV</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="flex items-center justify-center">
                        <Sun className="h-5 w-5 text-primary mr-2" />
                        <span>Alta</span>
                      </div>
                    </td>
                  ))}
                </tr>
                
                <tr className="border-t border-border">
                  <td className="p-4 font-medium">Aplicação</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="flex flex-col items-center">
                        <Ruler className="h-5 w-5 text-primary mb-1" />
                        <span className="text-sm">2 demãos</span>
                      </div>
                    </td>
                  ))}
                </tr>
                
                <tr className="border-t border-border">
                  <td className="p-4 font-medium">Peso</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="flex items-center justify-center">
                        <Scale className="h-5 w-5 text-primary mr-2" />
                        <span>1,2kg/L</span>
                      </div>
                    </td>
                  ))}
                </tr>
                
                <tr className="border-t border-border">
                  <td className="p-4 font-medium">Ações</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="flex flex-col space-y-2">
                        <Link
                          to={`/produto/${product.slug}`}
                          className="bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                        >
                          Ver Detalhes
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Seleção de Produtos */}
        <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">Selecionar Produtos</h2>
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <svg 
                className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                <>
                  <div className="relative">
                    <div className="overflow-hidden">
                      <div 
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                      >
                        {[...Array(Math.ceil(filteredProducts.length / 4))].map((_, slideIndex) => (
                          <div key={slideIndex} className="flex-shrink-0 w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              {filteredProducts
                                .slice(slideIndex * 4, slideIndex * 4 + 4)
                                .map((product) => (
                                  <div 
                                    key={product.id} 
                                    className="border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
                                  >
                                    <div className="relative">
                                      <div className="bg-muted h-48 flex items-center justify-center">
                                        {product.product_variants[0]?.image_url ? (
                                          <img 
                                            src={product.product_variants[0].image_url} 
                                            alt={product.name} 
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <Package className="h-12 w-12 text-muted-foreground" />
                                        )}
                                      </div>
                                      {selectedProducts.some(p => p.id === product.id) && (
                                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                                          <Check className="h-4 w-4" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="p-4">
                                      <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">
                                        {product.name}
                                      </h3>
                                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                        {product.description}
                                      </p>
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <div className="font-bold">R$ 89,90</div>
                                          <div className="text-xs text-muted-foreground">por litro</div>
                                        </div>
                                        <button
                                          onClick={() => addProductToComparison(product)}
                                          disabled={selectedProducts.some(p => p.id === product.id) || selectedProducts.length >= 4}
                                          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                                            selectedProducts.some(p => p.id === product.id)
                                              ? 'bg-primary/10 text-primary cursor-not-allowed'
                                              : selectedProducts.length >= 4
                                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                                : 'bg-primary text-primary-foreground hover:bg-primary/90'
                                          }`}
                                        >
                                          {selectedProducts.some(p => p.id === product.id) ? 'Selecionado' : 'Comparar'}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {filteredProducts.length > 4 && (
                      <div className="flex justify-center items-center mt-6 space-x-4">
                        <button
                          onClick={prevSlide}
                          className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                          disabled={currentSlide === 0}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        
                        <div className="flex space-x-1">
                          {[...Array(Math.ceil(filteredProducts.length / 4))].map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentSlide(index)}
                              className={`w-3 h-3 rounded-full transition-colors ${
                                index === currentSlide ? 'bg-primary' : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                        
                        <button
                          onClick={nextSlide}
                          className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                          disabled={currentSlide === Math.ceil(filteredProducts.length / 4) - 1}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Nenhum produto encontrado</h3>
                  <p className="text-muted-foreground">
                    Tente ajustar sua busca para encontrar produtos para comparar.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}