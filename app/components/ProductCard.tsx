import React from 'react';
import { Star, Heart, ShoppingCart, Award, Leaf, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductBadges } from './ProductBadges';
import { getProductImageUrl } from '../utils/mockupUtils';

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
  availableColors?: Array<{
    id: string;
    name: string;
    hexCode: string;
  }>;
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
}

export function ProductCard({ product, viewMode }: ProductCardProps) {
  // Este componente agora é usado apenas para visualização em grade
  // A lógica para decidir entre grade e lista foi movida para ProductGrid.tsx
  if (viewMode === 'list') {
    // Isso não deve mais acontecer, pois o ProductGrid agora lida com a seleção
    // Mas mantemos por segurança
    console.warn('ProductCard não deve mais ser usado para visualização em lista');
  }

  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-border/20">
      <div className="relative">
        <img
          src={getProductImageUrl(product.image)}
          alt={product.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback para imagem padrão se a principal falhar
            const target = e.currentTarget as HTMLImageElement;
            // Evitar loop de onError em caso de bloqueio CORB/ORB
            target.onerror = null;
            target.src = "/images/default-product.jpg";
          }}
        />
        {product.isFeatured && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium shadow-sm">
            Destaque
          </div>
        )}
        <div
          className="absolute top-3 right-3 w-5 h-5 rounded-full border border-white/80 shadow-sm"
          style={{ backgroundColor: product.hexCode }}
        ></div>
        <button className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm hover:bg-white transition-all duration-300">
          <Heart className="h-3.5 w-3.5 text-foreground" />
        </button>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-cormorant font-bold">{product.name}</h3>
          <span className="text-base font-medium text-primary">
            {product.price ? `R$ ${product.price.toFixed(2)}` : 'Consulte'}
          </span>
        </div>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-xs font-medium">{product.rating || 0}</span>
            <span className="mx-1 text-muted-foreground/70">•</span>
            <span className="text-xs text-muted-foreground">{product.reviews || 0} avaliações</span>
          </div>
        </div>
        
        {/* Badges */}
        <ProductBadges badges={product.badges} />
        
        <div className="flex flex-wrap gap-1.5 my-4">
          <span className="px-2 py-1 bg-muted/40 rounded-full text-xs">{product.category}</span>
          <span className="px-2 py-1 bg-muted/40 rounded-full text-xs">{product.finish}</span>
          <span className="px-2 py-1 bg-muted/40 rounded-full text-xs">{product.color}</span>
        </div>
        
        {/* Cores disponíveis */}
        {product.availableColors && product.availableColors.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Cores disponíveis:</p>
            <div className="flex flex-wrap gap-1.5">
              {product.availableColors.slice(0, 6).map((color, index) => (
                <div
                  key={color.id || index}
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: color.hexCode }}
                  title={color.name}
                />
              ))}
              {product.availableColors.length > 6 && (
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center text-xs text-gray-600 font-medium">
                  +{product.availableColors.length - 6}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Icons Row */}
        <div className="flex items-center gap-3 mb-4 text-muted-foreground">
          <div className="flex items-center text-xs" title="Eco Friendly">
            <Leaf className="h-3.5 w-3.5 mr-1" />
            <span>Eco</span>
          </div>
          <div className="flex items-center text-xs" title="Garantia">
            <Shield className="h-3.5 w-3.5 mr-1" />
            <span>7 anos</span>
          </div>
          <div className="flex items-center text-xs" title="Qualidade Premium">
            <Award className="h-3.5 w-3.5 mr-1" />
            <span>Premium</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Link
            to={`/produto/${product.slug}`}
            className="text-primary hover:text-primary/80 font-medium flex items-center text-sm transition-colors"
          >
            Ver detalhes
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          
          <Link
            to="/contato"
            className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-all duration-300 text-sm shadow-sm"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span className="font-medium">Orçamento</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
