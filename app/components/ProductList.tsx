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

interface ProductListProps {
  product: Product;
}

export function ProductList({ product }: ProductListProps) {
  return (
    <div className="bg-card rounded-xl p-5 shadow-sm border border-border/20 hover:shadow-md transition-all flex flex-col sm:flex-row gap-5">
      <div className="relative flex-shrink-0">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full sm:w-32 h-32 object-cover rounded-lg"
        />
        {product.isFeatured && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium shadow-sm">
            Destaque
          </div>
        )}
        <div 
          className="absolute bottom-2 right-2 w-4 h-4 rounded-full border border-white/80 shadow-sm"
          style={{ backgroundColor: product.hexCode }}
        ></div>
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-cormorant font-bold">{product.name}</h3>
          <span className="text-base font-medium text-primary">
              {product.price ? `R$ ${product.price.toFixed(2)}` : 'Consulte'}
            </span>
        </div>
        
        <p className="text-muted-foreground text-sm mb-3">{product.description}</p>
        
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
        
        <div className="flex justify-between items-center mt-auto">
          <Link
            to={`/produto/${product.slug}`}
            className="text-primary hover:text-primary/80 font-medium flex items-center text-sm transition-colors"
          >
            Ver detalhes
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-full border border-border/20 hover:bg-muted transition-colors">
              <Heart className="h-4 w-4" />
            </button>
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
    </div>
  );
}