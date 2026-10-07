import React from 'react';
import { ProductCard } from './ProductCard';
import { ProductList } from './ProductList';
import type { ProductWithDetails } from '../services/productService';
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

interface ProductGridProps {
  products: ProductWithDetails[];
  viewMode: 'grid' | 'list';
}

// Função para obter a URL da imagem correta para os cards (similar à da página de produto)
function getImageUrlForCard(product: ProductWithDetails): string {
  try {
    // Prioridade 1: Imagem principal do produto (se existir e for válida)
    if (product.image_url && typeof product.image_url === 'string' && product.image_url.trim() !== '') {
      return getProductImageUrl(product.image_url);
    }

    // Prioridade 2: Imagem da primeira variante (se existir e for válida)
    if (product.product_variants && product.product_variants.length > 0) {
      const firstVariant = product.product_variants[0];
      if (firstVariant?.image_url && typeof firstVariant.image_url === 'string' && firstVariant.image_url.trim() !== '') {
        return getProductImageUrl(firstVariant.image_url);
      }
    }

    // Prioridade 3: Mockup aleatório (em vez de imagem padrão)
    return getProductImageUrl('');
  } catch (error) {
    console.warn('Erro ao obter URL da imagem para o produto:', product.id, error);
    return getProductImageUrl('');
  }
}

// Função para converter ProductWithDetails para o formato esperado pelo ProductCard
const convertProduct = (product: ProductWithDetails): Product => {
  try {
    // Pega a primeira cor disponível ou usa uma cor padrão
    const firstColor = product.product_variants?.[0]?.colors || null;
    
    const convertedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug || product.id,
      description: product.description || '',
      image: getImageUrlForCard(product), // Usando a função de prioridade
      category: product.categories?.name || 'Produto',
      finish: product.finishes?.name || 'Padrão',
      color: firstColor?.name || 'Sem cor',
      hexCode: firstColor?.hex_code || '#000000',
      price: product.price,
      isFeatured: product.is_featured || false,
      rating: product.rating || 4.5, // Usando rating do produto se disponível
      reviews: product.reviews || 0,
      badges: product.badges || (product.is_featured ? ['Destaque'] : []),
      availableColors: product.product_variants?.map(variant => ({
        id: variant.colors?.id || '',
        name: variant.colors?.name || '',
        hexCode: variant.colors?.hex_code || '#000000'
      })).filter(color => color.id && color.name) || []
    };
    
    return convertedProduct;
  } catch (error) {
    console.error('Erro ao converter produto:', product.id, error);
    // Retorna um produto básico em caso de erro para evitar quebra da aplicação
    return {
      id: product.id,
      name: product.name || 'Produto sem nome',
      slug: product.id,
      description: '',
      image: "/images/default-product.jpg",
      category: 'Produto',
      finish: 'Padrão',
      color: 'Sem cor',
      hexCode: '#000000',
      price: product.price,
      isFeatured: false,
      rating: 4.5,
      reviews: 0,
      badges: [],
      availableColors: []
    };
  }
};

export function ProductGrid({ products, viewMode }: ProductGridProps) {
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-5">
        {products.map(product => (
          <ProductList
            key={product.id}
            product={convertProduct(product)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={convertProduct(product)}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}
