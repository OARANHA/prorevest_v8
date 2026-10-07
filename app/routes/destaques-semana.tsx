import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  TrendingUp, 
  Award, 
  Clock, 
  Heart, 
  Share2, 
  ChevronRight, 
  Calendar,
  Tag,
  Zap,
  Sparkles,
  Flame,
  Gift
} from 'lucide-react';
import { ProductService } from '../services/productService';
import type { ProductWithDetails } from '../services/productService';

export default function WeeklyHighlights() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductWithDetails[]>([]);
  const [topRatedProducts, setTopRatedProducts] = useState<ProductWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('featured');

  useEffect(() => {
    fetchHighlightedProducts();
  }, []);

  const fetchHighlightedProducts = async () => {
    try {
      // Simulando produtos em destaque
      const featured = await ProductService.getProducts();
      setFeaturedProducts(featured.slice(0, 4));
      
      // Simulando produtos mais bem avaliados
      const topRated = await ProductService.getAllProducts();
      setTopRatedProducts(topRated.slice(0, 4));
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para renderizar estrelas de avaliação
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">({rating}.0)</span>
      </div>
    );
  };

  // Componente para cartão de produto
  const ProductCard = ({ product, index }: { product: ProductWithDetails; index: number }) => (
    <div className="bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-border transform hover:-translate-y-1">
      <div className="relative">
        <div className="bg-muted h-48 flex items-center justify-center">
          {product.product_variants[0]?.image_url ? (
            <img 
              src={product.product_variants[0].image_url} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          )}
        </div>
        <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold flex items-center">
          <Flame className="h-3 w-3 mr-1" />
          HOT
        </div>
        <div className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm p-1.5 rounded-full">
          <Heart className="h-4 w-4 text-foreground hover:text-destructive transition-colors cursor-pointer" />
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{product.name}</h3>
          <div className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-bold">
            #{index + 1}
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
        {renderRating(5)}
        <div className="mt-3 flex flex-wrap gap-1">
          {product.product_colors.slice(0, 4).map((color, idx) => (
            <div 
              key={idx}
              className="w-5 h-5 rounded-full border border-border cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: color.color.hex_code }}
              title={color.color.name}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div>
            <div className="font-bold text-lg">R$ 89,90</div>
            <div className="text-xs text-muted-foreground">por litro</div>
          </div>
          <Link 
            to={`/produto/${product.slug}`}
            className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-33 py-2 rounded-lg text-sm font-semibold hover:from-primary/90 hover:to-secondary/90 transition-colors flex items-center"
          >
            Ver Produto
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-5 w-5 mr-2" />
            <span className="font-bold">DESTAQUES DA SEMANA</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">O que está em alta esta semana</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubra os produtos mais populares, as ofertas especiais e as novidades que estão conquistando nossos clientes
          </p>
        </div>

        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 mb-12 text-primary-foreground">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="flex justify-center mb-2">
                <Award className="h-8 w-8" />
              </div>
              <div className="text-2xl font-bold">15+</div>
              <div className="text-primary-foreground/90">Anos de Excelência</div>
            </div>
            <div>
              <div className="flex justify-center mb-2">
                <Heart className="h-8 w-8" />
              </div>
              <div className="text-2xl font-bold">5000+</div>
              <div className="text-primary-foreground/90">Clientes Satisfeitos</div>
            </div>
            <div>
              <div className="flex justify-center mb-2">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div className="text-2xl font-bold">98%</div>
              <div className="text-primary-foreground/90">Taxa de Recomendação</div>
            </div>
            <div>
              <div className="flex justify-center mb-2">
                <Gift className="h-8 w-8" />
              </div>
              <div className="text-2xl font-bold">24h</div>
              <div className="text-primary-foreground/90">Entrega Rápida</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-8">
          <button
            onClick={() => setActiveTab('featured')}
            className={`pb-3 px-6 font-semibold relative ${
              activeTab === 'featured' 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Produtos em Destaque
            {activeTab === 'featured' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('top-rated')}
            className={`pb-3 px-6 font-semibold relative ${
              activeTab === 'top-rated' 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Mais Bem Avaliados
            {activeTab === 'top-rated' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('deals')}
            className={`pb-3 px-6 font-semibold relative ${
              activeTab === 'deals' 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Ofertas Especiais
            {activeTab === 'deals' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div>
            {activeTab === 'featured' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                  {featuredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
                
                <div className="bg-card rounded-xl shadow-lg p-8 border border-border text-center">
                  <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Não encontrou o que procurava?</h2>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Explore nosso catálogo completo com mais de 200 produtos selecionados especialmente para você.
                  </p>
                  <Link 
                    to="/catalogo" 
                    className="inline-flex items-center bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Ver Catálogo Completo
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Link>
                </div>
              </div>
            )}
            
            {activeTab === 'top-rated' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                  {topRatedProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
                
                <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
                  <h2 className="text-2xl font-bold mb-6 text-center">Por que nossos clientes amam esses produtos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-primary/5 rounded-xl">
                      <Star className="h-10 w-10 text-primary mx-auto mb-4" />
                      <h3 className="font-bold text-lg mb-2">Qualidade Comprovada</h3>
                      <p className="text-muted-foreground">
                        Testados em laboratório e aprovados por especialistas
                      </p>
                    </div>
                    <div className="text-center p-6 bg-secondary/5 rounded-xl">
                      <Clock className="h-10 w-10 text-secondary mx-auto mb-4" />
                      <h3 className="font-bold text-lg mb-2">Durabilidade</h3>
                      <p className="text-muted-foreground">
                        Resistência comprovada por até 15 anos
                      </p>
                    </div>
                    <div className="text-center p-6 bg-accent/5 rounded-xl">
                      <Heart className="h-10 w-10 text-accent mx-auto mb-4" />
                      <h3 className="font-bold text-lg mb-2">Satisfação Garantida</h3>
                      <p className="text-muted-foreground">
                        98% de clientes recomendam nossos produtos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'deals' && (
              <div className="text-center py-12">
                <Gift className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Ofertas Especiais em Breve</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Estamos preparando promoções exclusivas para você. Cadastre-se para ser o primeiro a saber!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/newsletter" 
                    className="inline-flex items-center bg-gradient-to-r from-primary to-secondary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Cadastrar para Ofertas
                  </Link>
                  <Link 
                    to="/catalogo" 
                    className="inline-flex items-center bg-gradient-to-r from-accent to-secondary text-accent-foreground px-8 py-4 rounded-full font-bold text-lg hover:from-accent/90 hover:to-secondary/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Ver Catálogo
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 mt-16 text-primary-foreground text-center">
          <h2 className="text-3xl font-bold mb-4">Transforme seu espaço com as cores certas</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            Nossos especialistas estão prontos para ajudar você a encontrar a combinação perfeita
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contato-consultor" 
              className="bg-gradient-to-r from-accent to-white/20 backdrop-blur-sm text-accent-foreground px-8 py-4 rounded-full font-bold text-lg hover:from-accent/90 transition-all duration-300 border border-white/30 flex items-center justify-center shadow-lg"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Agendar Consultoria
            </Link>
            <Link 
              to="/simulador" 
              className="bg-gradient-to-r from-accent to-white/20 backdrop-blur-sm text-accent-foreground px-8 py-4 rounded-full font-bold text-lg hover:from-accent/90 transition-all duration-300 border border-white/30 flex items-center justify-center shadow-lg"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Experimentar Simulador
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}