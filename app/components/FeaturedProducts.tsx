import React from 'react';
import { Star, Heart, ShoppingCart, Award, Leaf, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductBadges } from './ProductBadges';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  category: string;
  finish: string;
  color: string;
  hexCode: string;
  price?: number;
  isFeatured: boolean;
  rating?: number;
  reviews?: number;
  badges?: string[];
}

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const featuredProducts = products.filter(product => product.isFeatured).slice(0, 4);

  if (featuredProducts.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background sutil e elegante */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          {/* Badge elegante */}
          <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full mb-8 shadow-lg">
            <i className="ri-star-line text-xl mr-3"></i>
            <span className="font-bold text-lg">PRODUTOS EM DESTAQUE</span>
          </div>
          
          <p className="text-gray-700 max-w-3xl mx-auto text-xl leading-relaxed font-light">
            Conheça nossa seleção de <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">tintas mais populares</span> entre nossos clientes
          </p>
          
          {/* Linha decorativa sutil */}
          <div className="flex items-center justify-center mt-6">
            <div className="h-0.5 w-20 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-3"></div>
            <div className="h-0.5 w-20 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="group relative bg-white overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 border border-gray-100 rounded-lg transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card com gradiente sutil */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    // Fallback para imagem padrão se a principal falhar
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1513519880230-81f35f6cf9c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80";
                  }}
                />
                
                {/* Overlay com informações que aparece no hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transition-all duration-500 transform translate-y-full group-hover:translate-y-0">
                    <h4 className="text-xl font-bold mb-3">{product.name}</h4>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center">
                        <i className="ri-star-fill text-yellow-400 mr-2"></i>
                        <span className="text-sm">{product.rating || 0} • {product.reviews || 0} avaliações</span>
                      </div>
                      <div className="flex items-center">
                        <i className="ri-palette-line mr-2"></i>
                        <span className="text-sm">{product.category} • {product.finish}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="ri-shield-check-line mr-2"></i>
                        <span className="text-sm">7 anos de durabilidade</span>
                      </div>
                    </div>
                    <Link to={`/produto/${product.slug}`}>
                      <button className="w-full bg-white text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300">
                        Ver Detalhes
                      </button>
                    </Link>
                  </div>
                </div>
                
                {/* Badge de destaque elegante */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
                    <i className="ri-star-fill text-xs mr-1"></i>
                    Destaque
                  </div>
                </div>
                
                {/* Indicador de cor */}
                <div 
                  className="absolute top-4 right-4 w-8 h-8 rounded-full border-3 border-white shadow-lg ring-2 ring-white/50 transition-transform duration-300 group-hover:scale-110 z-10"
                  style={{ backgroundColor: product.hexCode }}
                ></div>
                
                {/* Botão de favorito animado */}
                <button className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 group z-10">
                  <Heart className="h-5 w-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
              
              <div className="relative z-10 p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                  <span className="text-lg font-bold text-orange-600">
                    {product.price ? `R$ ${product.price.toFixed(2)}` : 'Consulte'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-bold text-gray-900">{product.rating || 0}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{product.reviews || 0} avaliações</span>
                  </div>
                </div>
                
                {/* Badges */}
                <ProductBadges badges={product.badges} />
                
                <div className="flex flex-wrap gap-2 my-4">
                  <span className="px-3 py-1 bg-gray-100 text-xs font-medium text-gray-800">{product.category}</span>
                  <span className="px-3 py-1 bg-gray-100 text-xs font-medium text-gray-800">{product.finish}</span>
                  <span className="px-3 py-1 bg-gray-100 text-xs font-medium text-gray-800">{product.color}</span>
                </div>
                
                {/* Icons Row */}
                <div className="flex items-center gap-4 mb-6 text-gray-600">
                  <div className="flex items-center text-sm" title="Alta Cobertura">
                    <Shield className="h-4 w-4 mr-1" />
                    <span>Alta Cobertura</span>
                  </div>
                  <div className="flex items-center text-sm" title="Durabilidade">
                    <Award className="h-4 w-4 mr-1" />
                    <span>7 anos</span>
                  </div>
                  <div className="flex items-center text-sm" title="Eco Friendly">
                    <Leaf className="h-4 w-4 mr-1" />
                    <span>Eco</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <Link 
                    to={`/produto/${product.slug}`} 
                    className="text-orange-600 hover:text-orange-700 font-bold flex items-center text-sm transition-colors"
                  >
                    Ver detalhes
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                  
                  <Link 
                    to="/contato"
                    className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 hover:bg-orange-700 transition-all duration-300 text-sm font-bold shadow-md rounded-lg"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Orçamento</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA Final Elegante */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white shadow-2xl overflow-hidden relative">
            {/* Elementos decorativos sutis */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-white/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-16 h-16 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-light mb-4">Explore Nossa Coleção Completa</h3>
              <p className="text-xl mb-8 opacity-90">
                Mais de 200 produtos premium esperando por você
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/catalogo">
                  <button className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-xl transform hover:scale-105 text-lg">
                    Ver Catálogo Completo
                    <i className="ri-arrow-right-line ml-2"></i>
                  </button>
                </Link>
                <Link to="/contato">
                  <button className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-purple-600 transition-all duration-300 text-lg">
                    Falar com Especialista
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
