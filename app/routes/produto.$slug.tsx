import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { Link, useParams, useLoaderData } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { ProductService, type ProductWithDetails } from '../services/productService';
import { Layout } from '../components/Layout';

// Importando os ícones necessários
import { 
  Plus,
  BarChart3,
  Settings,
  Shield, 
  Star, 
  Heart, 
  ShoppingCart, 
  Award, 
  Leaf, 
  Truck, 
  CheckCircle, 
  ChevronLeft,
  ChevronRight,
  Minus,
  Info,
  MessageCircle,
  Share2,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { ProductBadges } from '../components/ProductBadges';
import { AdminEditButton } from '../components/AdminEditButton';

// Mock data for a product
const mockProduct: ProductWithDetails = {
  id: "1",
  name: "Látex Premium Acetinado",
  slug: "latex-premium-acetinado",
  description: "Tinta látex de acabamento acetinado de alta qualidade, especialmente formulada para ambientes internos residenciais e comerciais. Proporciona excelente cobertura, fácil aplicação e durabilidade superior.",
  full_description: "O Látex Premium Acetinado é uma tinta de última geração desenvolvida para proporcionar acabamentos sofisticados em ambientes internos. Sua fórmula exclusiva oferece excelente cobertura, permitindo que você finalize seu projeto com menos demãos e maior economia. Com tecnologia de baixo odor (Low Odor), sua aplicação é mais agradável e segura, reduzindo o impacto olfativo durante e após a pintura. O acabamento acetinado cria uma superfície elegante com leve brilho, que reflete a luz de forma sutil, valorizando os detalhes da decoração. Além disso, sua composição com pigmentos de alta qualidade garante cores intensas e duradouras que resistem ao tempo e à exposição solar indireta.",
  technical_data: {
    composition: "Acrílica copolímero, pigmentos selecionados, aditivos especiais",
    yield: "100-120 m²/L (2 demãos)",
    dryingTime: "Ao toque: 30 min, Entre demãos: 2h, Revestimento: 4h",
    voc: "Muito baixo (< 5 g/L)",
    certifications: ["GREENGUARD", "LEED Compliant", "ISO 9001"],
    coverage: "100-120 m²/L (2 demãos)",
    applicationMethod: "Rolo, pincel ou pistola",
    dilution: "Água potável até 10%",
    cleaning: "Água e sabão comum",
    glossLevel: "Acetinado (30-50°)",
    durability: "Excelente",
    washability: "Lavável",
    vocEmission: "Muito baixo (< 5 g/L)"
  },
  application_video_url: "https://example.com/video-aplicacao.mp4",
  category_id: "1",
  finish_id: "1",
  is_featured: true,
  created_at: "2023-01-01",
  categories: {
    id: "1",
    name: "Interior",
    description: "Produtos para ambientes internos",
    created_at: "2023-01-01"
  },
  finishes: {
    id: "1",
    name: "Acetinado",
    description: "Acabamento acetinado",
    created_at: "2023-01-01"
  },
  product_colors: [
    {
      colors: {
        id: "1",
        name: "Branco Neve",
        hex_code: "#FFFFFF",
        ral_code: "",
        pantone_code: "",
        ncs_code: "",
        is_archived: false,
        created_at: "2023-01-01"
      }
    }
  ],
  product_variants: [
    {
      id: "1",
      product_id: "1",
      texture_id: "1",
      color_id: "1",
      sku: "LPAC-1L",
      image_url: "https://images.unsplash.com/photo-1513519880230-81f35f6cf9c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      created_at: "2023-01-01",
      textures: {
        id: "1",
        name: "Liso",
        description: "Textura lisa",
        image_url: "",
        created_at: "2023-01-01"
      },
      colors: {
        id: "1",
        name: "Branco Neve",
        hex_code: "#FFFFFF",
        ral_code: "",
        pantone_code: "",
        ncs_code: "",
        is_archived: false,
        created_at: "2023-01-01"
      }
    }
  ],
  rating: 4.8,
  reviews: 24,
  badges: ["Mais Vendido", "Eco Friendly", "Baixo Odor"],
  warranty: {
    duration: "7 anos",
    description: "Garantia contra descascamento, bolhas e desbotamento quando aplicado conforme as instruções do fabricante."
  },
  price: 129.90
};

// Mock data for related products
const mockRelatedProducts = [
  {
    id: "2",
    name: "Látex Premium Fosco",
    slug: "latex-premium-fosco",
    description: "Tinta látex de acabamento fosco para ambientes internos",
    image_url: "https://images.unsplash.com/photo-1600189953828-5d8d4f0d93c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: {
      id: "1",
      name: "Interior",
      description: "Produtos para ambientes internos",
      created_at: "2023-01-01"
    },
    finish: {
      id: "2",
      name: "Fosco",
      description: "Acabamento fosco",
      created_at: "2023-01-01"
    },
    price: 119.90,
    rating: 4.6,
    reviews: 18,
    badges: ["Economia"]
  },
  {
    id: "3",
    name: "Látex Premium Brilhante",
    slug: "latex-premium-brilhante",
    description: "Tinta látex de acabamento brilhante para ambientes internos",
    image_url: "https://images.unsplash.com/photo-1618214666277-30220150d814?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: {
      id: "1",
      name: "Interior",
      description: "Produtos para ambientes internos",
      created_at: "2023-01-01"
    },
    finish: {
      id: "3",
      name: "Brilhante",
      description: "Acabamento brilhante",
      created_at: "2023-01-01"
    },
    price: 139.90,
    rating: 4.7,
    reviews: 15,
    badges: ["Premium"]
  }
];

// Mock data for buy together products
const mockBuyTogetherProducts = [
  {
    id: "4",
    name: "Massa Corrida ACII",
    slug: "massa-corrida-acii",
    description: "Massa para preparação de superfícies",
    image_url: "https://images.unsplash.com/photo-1618214666277-30220150d814?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: {
      id: "2",
      name: "Preparação",
      description: "Produtos para preparação de superfícies",
      created_at: "2023-01-01"
    },
    finish: {
      id: "4",
      name: "Fosco",
      description: "Acabamento fosco",
      created_at: "2023-01-01"
    },
    price: 49.90,
    rating: 4.5,
    reviews: 12,
    badges: ["Essencial"]
  },
  {
    id: "5",
    name: "Fundo Preparador Universal",
    slug: "fundo-preparador-universal",
    description: "Fundo preparador para melhor aderência",
    image_url: "https://images.unsplash.com/photo-1595713530464-0d3a3bf60e5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: {
      id: "2",
      name: "Preparação",
      description: "Produtos para preparação de superfícies",
      created_at: "2023-01-01"
    },
    finish: {
      id: "4",
      name: "Fosco",
      description: "Acabamento fosco",
      created_at: "2023-01-01"
    },
    price: 79.90,
    rating: 4.7,
    reviews: 9,
    badges: ["Recomendado"]
  }
];

// Mock data for reviews
const mockReviews = [
  {
    id: "1",
    name: "Carlos Silva",
    rating: 5,
    date: "2023-05-15",
    title: "Excelente produto!",
    content: "A tinta tem uma cobertura incrível e o acabamento acetinado deixou minhas paredes com um aspecto muito sofisticado. Recomendo!",
    verified: true,
    helpful: 12
  },
  {
    id: "2",
    name: "Ana Oliveira",
    rating: 4,
    date: "2023-04-22",
    title: "Muito boa, mas poderia ter mais cores",
    content: "A qualidade da tinta é excelente, fácil de aplicar e secagem rápida. Só senti falta de mais opções de cores na linha.",
    verified: true,
    helpful: 8
  },
  {
    id: "3",
    name: "Roberto Santos",
    rating: 5,
    date: "2023-03-10",
    title: "Produto de alta qualidade",
    content: "Uso profissionalmente e posso afirmar que é uma das melhores tintas do mercado. Os clientes ficam sempre satisfeitos com o resultado.",
    verified: true,
    helpful: 15
  }
];

// Mock data for questions
const mockQuestions = [
  {
    id: "1",
    question: "Esta tinta pode ser aplicada em superfícies externas?",
    answer: "Não recomendamos a aplicação desta tinta em superfícies externas. Para áreas externas, sugerimos nossa linha de tintas acrílicas para fachadas, que possuem maior resistência às intempéries.",
    date: "2023-05-10",
    helpful: 10
  },
  {
    id: "2",
    question: "Quantas demãos são necessárias para uma boa cobertura?",
    answer: "Geralmente são necessárias 2 demãos para uma cobertura uniforme e satisfatória. Em superfícies muito escuras ou com manchas, pode ser necessária uma terceira demão.",
    date: "2023-04-25",
    helpful: 8
  },
  {
    id: "3",
    question: "É necessário usar fundo preparador antes da aplicação?",
    answer: "Recomendamos o uso de fundo preparador para garantir melhor aderência e uniformidade da cor, especialmente em superfícies novas ou porosas. No entanto, em superfícies já pintadas e em bom estado, a aplicação direta é possível após lixamento e limpeza adequados.",
    date: "2023-04-15",
    helpful: 12
  }
];

export const meta: MetaFunction = ({ data }: any) => {
  const product = data?.product;
  return [
    { title: `${product?.name || 'Produto'} - ProRevest` },
    { name: "description", content: product?.description || 'Descrição do produto' },
  ];
}

interface LoaderData {
  product: ProductWithDetails;
  relatedProducts: any[];
  buyTogetherProducts: any[];
  reviews: any[];
  questions: any[];
  params: any;
}

interface LoaderData {
  product: ProductWithDetails;
  relatedProducts: any[];
  buyTogetherProducts: any[];
  reviews: any[];
  questions: any[];
  params: any;
}

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    if (!params.slug) {
      throw new Response("Slug do produto não fornecido", { status: 400 });
    }
    
    // In a real app, this would fetch from Supabase based on params.slug
    let product = await ProductService.getProductBySlug(params.slug);
    
    // Se o produto não for encontrado, vamos usar dados mock para produtos específicos
    if (!product) {
      if (params.slug === "textura-3d-efeito-concreto") {
        product = {
          id: "textura-3d-id",
          name: "Textura 3D Efeito Concreto",
          slug: "textura-3d-efeito-concreto",
          description: "Textura decorativa com acabamento que imita o concreto, ideal para criar ambientes modernos e industriais.",
          full_description: "A Textura 3D Efeito Concreto é um revestimento decorativo inovador que proporciona um acabamento sofisticado com aparência de concreto aparente. Desenvolvida com tecnologia avançada, oferece uma superfície texturizada que adiciona profundidade e interesse visual a qualquer ambiente. Sua aplicação é simples e o resultado é um efeito tridimensional impressionante que transforma paredes planas em superfícies com personalidade e estilo industrial moderno.",
          technical_data: {
            composition: "Resinas acrílicas, cargas minerais, aditivos especiais",
            yield: "4-6 m²/kg (dependendo da espessura)",
            dryingTime: "Ao toque: 2-4h, Secagem total: 24h",
            voc: "Baixo (< 50 g/L)",
            certifications: ["ABNT", "ISO 14001"],
            coverage: "4-6 m²/kg",
            applicationMethod: "Espátula, rolo texturizador",
            dilution: "Não requer diluição",
            cleaning: "Água e sabão comum",
            glossLevel: "Fosco",
            durability: "Excelente",
            washability: "Lavável após 7 dias",
            vocEmission: "Baixo (< 50 g/L)"
          },
          application_video_url: "https://example.com/video-textura-concreto.mp4",
          category_id: "3",
          finish_id: "6",
          is_featured: true,
          created_at: "2023-01-01",
          rating: 4.7,
          reviews: 18,
          badges: ["Inovador", "Efeito 3D", "Alto Rendimento"],
          warranty: {
            duration: "5 anos",
            description: "Garantia contra fissuras, descascamento e descolamento quando aplicado conforme as instruções do fabricante."
          },
          price: 189.90,
          categories: {
            id: "3",
            name: "Textura",
            description: "Produtos texturizados para efeitos especiais",
            created_at: "2023-01-01"
          },
          finishes: {
            id: "6",
            name: "Efeito Concreto",
            description: "Acabamento que imita o concreto aparente",
            created_at: "2023-01-01"
          },
          product_colors: [
            {
              colors: {
                id: "10",
                name: "Cinza Chumbo",
                hex_code: "#4A4A4A",
                ral_code: "",
                pantone_code: "",
                ncs_code: "",
                is_archived: false,
                created_at: "2023-01-01"
              }
            },
            {
              colors: {
                id: "11",
                name: "Cinza Claro",
                hex_code: "#D3D3D3",
                ral_code: "",
                pantone_code: "",
                ncs_code: "",
                is_archived: false,
                created_at: "2023-01-01"
              }
            }
          ],
          product_variants: [
            {
              id: "20",
              product_id: "textura-3d-id",
              texture_id: "5",
              color_id: "10",
              sku: "T3DC-1KG",
              image_url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              created_at: "2023-01-01",
              textures: {
                id: "5",
                name: "3D",
                description: "Textura com relevo tridimensional",
                image_url: "",
                created_at: "2023-01-01"
              },
              colors: {
                id: "10",
                name: "Cinza Chumbo",
                hex_code: "#4A4A4A",
                ral_code: "",
                pantone_code: "",
                ncs_code: "",
                is_archived: false,
                created_at: "2023-01-01"
              }
            },
            {
              id: "21",
              product_id: "textura-3d-id",
              texture_id: "5",
              color_id: "11",
              sku: "T3DC-1KG-CL",
              image_url: "https://images.unsplash.com/photo-1617296594444-2c884b5c0f1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              created_at: "2023-01-01",
              textures: {
                id: "5",
                name: "3D",
                description: "Textura com relevo tridimensional",
                image_url: "",
                created_at: "2023-01-01"
              },
              colors: {
                id: "11",
                name: "Cinza Claro",
                hex_code: "#D3D3D3",
                ral_code: "",
                pantone_code: "",
                ncs_code: "",
                is_archived: false,
                created_at: "2023-01-01"
              }
            }
          ]
        };
      } else {
        // Em vez de lançar um erro, vamos retornar null para o produto
        // O componente irá exibir uma mensagem de produto não encontrado
        return {
          product: null,
          relatedProducts: [],
          buyTogetherProducts: [],
          reviews: [],
          questions: [],
          params
        };
      }
    }
    
    // Get related products
    const relatedProducts = await ProductService.getSimilarProducts(product.id);
    
    return {
      product,
      relatedProducts,
      buyTogetherProducts: mockBuyTogetherProducts,
      reviews: mockReviews,
      questions: mockQuestions,
      params
    };
  } catch (error) {
    console.error("Error loading product:", error);
    // Em vez de lançar um erro, vamos retornar dados vazios
    // O componente irá exibir uma mensagem de produto não encontrado
    return {
      product: null,
      relatedProducts: [],
      buyTogetherProducts: [],
      reviews: [],
      questions: [],
      params
    };
  }
}

// Função para obter a URL da imagem correta com tratamento robusto de erros
function getImageUrl(product: ProductWithDetails | null, selectedIndex: number): string {
  const defaultImageUrl = "https://images.unsplash.com/photo-1513519880230-81f35f6cf9c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80";
  
  if (!product) {
    return defaultImageUrl;
  }

  try {
    // DEBUG: Log para verificar qual imagem está sendo usada
    console.log('getImageUrl chamado com selectedIndex:', selectedIndex);
    console.log('product.image_url:', product.image_url);
    if (product.product_variants && product.product_variants.length > 0) {
      console.log('Variantes disponíveis:', product.product_variants.map(v => v.image_url));
    }

    // Função auxiliar para validar e retornar URL
    const getValidUrl = (url: string | null | undefined): string | null => {
      if (!url || typeof url !== 'string' || url.trim() === '') {
        return null;
      }
      
      const trimmedUrl = url.trim();
      
      // Aceitar URLs base64 (data:image/...)
      if (trimmedUrl.startsWith('data:image/')) {
        console.log('URL base64 detectada');
        return trimmedUrl;
      }
      
      // Aceitar URLs do Supabase Storage
      if (trimmedUrl.includes('supabase.co/storage') || trimmedUrl.includes('supabase.com/storage')) {
        console.log('URL do Supabase Storage detectada');
        return trimmedUrl;
      }
      
      // Aceitar URLs HTTP/HTTPS e caminhos relativos
      if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://') || trimmedUrl.startsWith('/')) {
        return trimmedUrl;
      }
      
      console.warn('URL de imagem inválida:', trimmedUrl);
      return null;
    };

    // Prioridade 1: Se selectedIndex é 0, usar imagem principal do produto
    if (selectedIndex === 0) {
      const mainImageUrl = getValidUrl(product.image_url);
      if (mainImageUrl) {
        console.log('Usando imagem principal:', mainImageUrl);
        return mainImageUrl;
      }
    }

    // Prioridade 2: Imagem da variante selecionada (se selectedIndex > 0)
    if (product.product_variants && product.product_variants.length > 0 && selectedIndex > 0) {
      const variantIndex = selectedIndex - 1; // Ajustar índice porque a imagem principal é índice 0
      const variant = product.product_variants[variantIndex];
      const variantImageUrl = getValidUrl(variant?.image_url);
      if (variantImageUrl) {
        console.log('Usando imagem de variante:', variantImageUrl);
        return variantImageUrl;
      }
    }

    // Prioridade 3: Fallback para imagem principal mesmo se selectedIndex > 0
    const mainImageFallback = getValidUrl(product.image_url);
    if (mainImageFallback) {
      console.log('Fallback para imagem principal:', mainImageFallback);
      return mainImageFallback;
    }

    // Prioridade 4: Imagem padrão
    console.log('Usando imagem padrão');
    return defaultImageUrl;
  } catch (error) {
    console.error('Erro ao processar URL da imagem:', error);
    return defaultImageUrl;
  }
}

export default function Produto() {
  const navigate = useNavigate();
  const { product, relatedProducts, buyTogetherProducts, reviews, questions } = useLoaderData<LoaderData>();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product?.product_colors?.[0]?.colors?.hex_code || "#FFFFFF");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [cep, setCep] = useState("");
  const [shippingInfo, setShippingInfo] = useState<any>(null);
  const [reviewHelpful, setReviewHelpful] = useState<{[key: string]: number}>({});
  const [questionHelpful, setQuestionHelpful] = useState<{[key: string]: number}>({});
  
  // Funções para os botões (mock)
  const handleAddToProject = () => {
    console.log("Adicionar ao projeto");
  };
  
  const handleCompare = () => {
    console.log("Comparar produto");
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? (product?.product_variants?.length || 1) - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === (product?.product_variants?.length || 1) - 1 ? 0 : prevIndex + 1
    );
  };

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleCalculateShipping = () => {
    // Mock shipping calculation
    if (cep.length === 8) {
      setShippingInfo({
        options: [
          { name: "PAC", price: 15.90, days: "5-8 dias úteis" },
          { name: "Sedex", price: 28.50, days: "2-4 dias úteis" },
          { name: "Transportadora", price: 22.75, days: "3-5 dias úteis" }
        ]
      });
    } else {
      alert("Por favor, digite um CEP válido com 8 dígitos.");
    }
  };

  const handleReviewHelpful = (reviewId: string) => {
    setReviewHelpful(prev => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1
    }));
  };

  const handleQuestionHelpful = (questionId: string) => {
    setQuestionHelpful(prev => ({
      ...prev,
      [questionId]: (prev[questionId] || 0) + 1
    }));
  };

  const calculateTotal = () => {
    const productTotal = (product?.price || 0) * quantity;
    const buyTogetherTotal = buyTogetherProducts.reduce((sum, item) => sum + (item.price || 0), 0);
    return productTotal + buyTogetherTotal;
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-20">
        {product ? (
          <>
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-muted-foreground mb-6">
              <Link to="/catalogo" className="hover:text-foreground">Catálogo</Link> {'>'}
              <span className="ml-2">{product?.categories?.name || ''}</span> {'>'}
              <span className="ml-2">{product?.name || ''}</span>
            </div>

            {/* Product Header */}
            <div className="mb-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-cormorant font-bold text-foreground mb-2">{product?.name || ''}</h1>
                  <p className="text-muted-foreground">{product?.categories?.name || ''} | {product?.finishes?.name || ''}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {product?.finishes?.name || ''}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">{product?.rating || 0}</span>
                  <span className="mx-1 text-muted-foreground/70">•</span>
                  <span className="text-sm text-muted-foreground">{product?.reviews || 0} avaliações</span>
                </div>
              </div>

              <div className="mb-6">
                <ProductBadges badges={product?.badges || []} />
              </div>

              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleAddToProject}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Adicionar ao Projeto
                </button>
                <button 
                  onClick={handleCompare}
                  className="border border-border px-6 py-3 rounded-lg hover:bg-accent transition-colors flex items-center"
                >
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Comparar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div>
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-xl bg-muted aspect-square">
                    <img
                      src={getImageUrl(product, selectedImageIndex)}
                      alt={product?.name || "Produto"}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        // Fallback robusto para imagem padrão se a principal falhar
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1513519880230-81f35f6cf9c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80";
                        target.onerror = null; // Prevenir loop infinito de erro
                      }}
                      onLoad={(e) => {
                        // Log para debug de carregamento bem-sucedido
                        console.log('Imagem carregada com sucesso:', e.currentTarget.src);
                      }}
                    />
                    <button 
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm hover:bg-white transition-all"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm hover:bg-white transition-all"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                  
                 <div className="flex space-x-2 overflow-x-auto py-2">
                   {/* Mostrar imagem principal se existir */}
                   {product?.image_url && (
                     <button
                       onClick={() => setSelectedImageIndex(0)}
                       className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                         selectedImageIndex === 0 ? 'border-primary' : 'border-border'
                       }`}
                     >
                       <img
                         src={product.image_url}
                         alt={`${product?.name || 'Produto'} - Imagem principal`}
                         className="w-full h-full object-cover"
                         loading="lazy"
                         crossOrigin="anonymous"
                         onError={(e) => {
                           const target = e.target as HTMLImageElement;
                           target.src = "https://images.unsplash.com/photo-1513519880230-81f35f6cf9c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80";
                           target.onerror = null; // Prevenir loop infinito de erro
                         }}
                       />
                     </button>
                   )}
                   {/* Mostrar variantes se existirem */}
                   {product?.product_variants?.map((variant, index) => {
                     const adjustedIndex = product?.image_url ? index + 1 : index;
                     return (
                       <button
                         key={variant.id}
                         onClick={() => setSelectedImageIndex(adjustedIndex)}
                         className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                           selectedImageIndex === adjustedIndex ? 'border-primary' : 'border-border'
                         }`}
                       >
                         <img
                           src={variant.image_url || "https://images.unsplash.com/photo-1513519880230-81f35f6cf9c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"}
                           alt={`${product?.name || 'Produto'} - ${variant.colors?.name || 'Variante'} ${index + 1}`}
                           className="w-full h-full object-cover"
                           loading="lazy"
                           crossOrigin="anonymous"
                           onError={(e) => {
                             const target = e.target as HTMLImageElement;
                             target.src = "https://images.unsplash.com/photo-1513519880230-81f35f6cf9c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80";
                             target.onerror = null; // Prevenir loop infinito de erro
                           }}
                         />
                       </button>
                     );
                   }) || []}
                 </div>
                </div>
              </div>

              {/* Product Details */}
              <div>
                <div className="bg-card border border-border rounded-xl p-6 mb-8">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-2xl font-cormorant font-bold">Descrição</h2>
                    <button className="text-muted-foreground hover:text-foreground">
                      <Heart className="h-6 w-6" />
                    </button>
                  </div>
                  <p className="text-muted-foreground mb-6">{product?.full_description || product?.description || ''}</p>
                   
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h3 className="font-semibold mb-2">Acabamento</h3>
                      <p>{product?.finishes?.name || ''}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Tipo</h3>
                      <p>{product?.categories?.name || ''}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Indicado para</h3>
                      <p>Ambientes internos</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Embalagem</h3>
                      <p>18L, 3.6L</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">Cores Disponíveis</h3>
                      <div className="flex flex-wrap gap-2">
                        {product?.product_colors?.map((productColor, index) => (
                          <div
                            key={productColor.colors?.id || index}
                            className="w-8 h-8 rounded-full border border-border cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: productColor.colors?.hex_code || "#FFFFFF" }}
                            title={productColor.colors?.name || "Cor"}
                          />
                        )) || []}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-sm">A partir de</p>
                      <p className="text-2xl font-bold text-primary">R$ {(product?.price || 0).toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center border border-border rounded-lg">
                        <button 
                          onClick={() => handleQuantityChange('decrease')}
                          className="p-2 text-muted-foreground hover:text-foreground"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 font-medium">{quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange('increase')}
                          className="p-2 text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-lg font-bold text-primary">
                       Total: R$ {((product?.price || 0) * quantity).toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <Link 
                        to="/orcamento"
                        className="flex-1 min-w-[200px] bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Solicitar Orçamento
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Technical Data */}
                <div className="mb-16">
                  <h2 className="text-2xl font-cormorant font-bold mb-6">Ficha Técnica</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h3 className="font-semibold mb-4 flex items-center">
                        <Settings className="mr-2 h-5 w-5" />
                        Características Técnicas
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex justify-between">
                         <span className="text-muted-foreground">Tempo de Secagem</span>
                         <span>{product?.technical_data?.dryingTime || 'Não informado'}</span>
                       </li>
                       <li className="flex justify-between">
                         <span className="text-muted-foreground">Rendimento</span>
                         <span>{product?.technical_data?.coverage || 'Não informado'}</span>
                       </li>
                       <li className="flex justify-between">
                         <span className="text-muted-foreground">Aplicação</span>
                         <span>{product?.technical_data?.applicationMethod || 'Não informado'}</span>
                       </li>
                       <li className="flex justify-between">
                         <span className="text-muted-foreground">Diluição</span>
                         <span>{product?.technical_data?.dilution || 'Não informado'}</span>
                       </li>
                       <li className="flex justify-between">
                         <span className="text-muted-foreground">Limpeza</span>
                         <span>{product?.technical_data?.cleaning || 'Não informado'}</span>
                       </li>
                      </ul>
                    </div>
                    
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h3 className="font-semibold mb-4 flex items-center">
                        <Shield className="mr-2 h-5 w-5" />
                        Propriedades
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Brilho</span>
                          <span>{product?.technical_data?.glossLevel || 'Não informado'}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Resistência</span>
                          <span>{product?.technical_data?.durability || 'Não informado'}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Lavabilidade</span>
                          <span>{product?.technical_data?.washability || 'Não informado'}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Emissão de COV</span>
                          <span>{product?.technical_data?.vocEmission || 'Não informado'}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Certificações</span>
                          <span>{product?.technical_data?.certifications?.join(', ') || 'Não informado'}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* Shipping Calculator */}
                <div className="bg-card border border-border rounded-xl p-6 mb-8">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Truck className="mr-2 h-5 w-5" />
                    Calcular Frete
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Digite seu CEP"
                      className="flex-1 p-2 border border-border rounded-lg"
                      value={cep}
                      onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                      maxLength={8}
                    />
                    <button
                      onClick={handleCalculateShipping}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Calcular
                    </button>
                  </div>
                  
                  {shippingInfo && (
                    <div className="mt-4 space-y-2">
                      <h4 className="font-medium">Opções de Frete:</h4>
                      {shippingInfo.options.map((option: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-2 border border-border rounded-lg">
                          <span>{option.name}</span>
                          <span>R$ {option.price.toFixed(2)} - {option.days}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Details Tabs */}
            <div className="bg-card border border-border rounded-xl p-6 mb-12">
              <div className="border-b border-border mb-6">
                <nav className="flex space-x-8">
                  <button
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "description"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setActiveTab("description")}
                  >
                    Descrição
                  </button>
                  <button
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "specifications"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setActiveTab("specifications")}
                  >
                    Especificações
                  </button>
                  <button
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "warranty"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setActiveTab("warranty")}
                  >
                    Garantia
                  </button>
                  <button
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "reviews"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setActiveTab("reviews")}
                  >
                    Avaliações ({reviews.length})
                  </button>
                  <button
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "questions"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setActiveTab("questions")}
                  >
                    Perguntas ({questions.length})
                  </button>
                </nav>
              </div>
              
              {activeTab === "description" && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Descrição Completa</h3>
                  <p className="text-muted-foreground mb-6">{product?.full_description || product?.description || ''}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Benefícios</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Excelente cobertura e rendimento</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Acabamento acetinado elegante</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Baixo odor, aplicação mais agradável</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Cores intensas e duradouras</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Indicações de Uso</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Paredes internas de residências</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Ambientes comerciais e corporativos</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Tetos e forros</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Superfícies de gesso e drywall</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "specifications" && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Especificações Técnicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Composição e Características</h4>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                         <span className="text-muted-foreground">Composição</span>
                         <span>{product?.technical_data?.composition || 'Não informado'}</span>
                       </li>
                       <li className="flex justify-between">
                         <span className="text-muted-foreground">Rendimento</span>
                         <span>{product?.technical_data?.yield || 'Não informado'}</span>
                       </li>
                       <li className="flex justify-between">
                         <span className="text-muted-foreground">Tempo de Secagem</span>
                         <span>{product?.technical_data?.dryingTime || 'Não informado'}</span>
                       </li>
                       <li className="flex justify-between">
                         <span className="text-muted-foreground">Emissão de COV</span>
                         <span>{product?.technical_data?.voc || 'Não informado'}</span>
                       </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Aplicação</h4>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                         <span className="text-muted-foreground">Método de Aplicação</span>
                         <span>{product?.technical_data?.applicationMethod || 'Não informado'}</span>
                       </li>
                       <li className="flex justify-between">
                         <span className="text-muted-foreground">Diluição</span>
                         <span>{product?.technical_data?.dilution || 'Não informado'}</span>
                       </li>
                       <li className="flex justify-between">
                         <span className="text-muted-foreground">Limpeza</span>
                         <span>{product?.technical_data?.cleaning || 'Não informado'}</span>
                       </li>
                       <li className="flex justify-between">
                         <span className="text-muted-foreground">Nível de Brilho</span>
                         <span>{product?.technical_data?.glossLevel || 'Não informado'}</span>
                       </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "warranty" && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Informações de Garantia</h3>
                  <div className="bg-muted/30 rounded-lg p-6 mb-6">
                    <div className="flex items-center mb-4">
                      <Shield className="h-8 w-8 text-primary mr-3" />
                      <div>
                        <h4 className="font-semibold text-lg">Garantia do Fabricante</h4>
                        <p className="text-muted-foreground">{product?.warranty?.duration || "7 anos"}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      {product?.warranty?.description || "Garantia contra descascamento, bolhas e desbotamento quando aplicado conforme as instruções do fabricante."}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Condições da Garantia</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Aplicação conforme as instruções do fabricante</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Preparo adequado da superfície antes da aplicação</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Condições ambientais adequadas durante a aplicação</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Apresentação da nota fiscal de compra</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              
              {activeTab === "reviews" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Avaliações dos Clientes</h3>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                      Avaliar Produto
                    </button>
                  </div>
                  
                  <div className="flex items-center mb-8">
                    <div className="text-center mr-8">
                      <div className="text-4xl font-bold">{product?.rating || 0}</div>
                      <div className="flex justify-center my-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < Math.floor(product?.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">{product?.reviews || 0} avaliações</div>
                    </div>
                    
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const percentage = Math.round(
                          (reviews.filter(r => Math.floor(r.rating) === stars).length / reviews.length) * 100
                        ) || 0;
                        
                        return (
                          <div key={stars} className="flex items-center mb-1">
                            <span className="text-sm w-8">{stars}</span>
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <div className="flex-1 h-2 bg-muted rounded-full mx-2 overflow-hidden">
                              <div 
                                className="h-full bg-yellow-400" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm w-10 text-right">{percentage}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-border pb-6">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <div className="flex mr-3">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                                />
                              ))}
                            </div>
                            <h4 className="font-semibold">{review.title}</h4>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        
                        <div className="flex items-center mb-3">
                          <div className="flex items-center mr-4">
                            <User className="h-4 w-4 text-muted-foreground mr-1" />
                            <span className="text-sm">{review.name}</span>
                          </div>
                          {review.verified && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Compra verificada
                            </span>
                          )}
                        </div>
                        
                        <p className="text-muted-foreground mb-4">{review.content}</p>
                        
                        <div className="flex items-center text-sm text-muted-foreground">
                          <button 
                            onClick={() => handleReviewHelpful(review.id)}
                            className="flex items-center hover:text-foreground"
                          >
                            <span>Útil ({(reviewHelpful[review.id] || review.helpful)})</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === "questions" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Perguntas e Respostas</h3>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Fazer Pergunta
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {questions.map((question) => (
                      <div key={question.id} className="border-b border-border pb-6">
                        <div className="mb-3">
                          <div className="flex items-center mb-2">
                            <MessageCircle className="h-4 w-4 text-primary mr-2" />
                            <h4 className="font-semibold">{question.question}</h4>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            Perguntado em {new Date(question.date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        
                        <div className="bg-muted/30 rounded-lg p-4 mb-3">
                          <div className="flex items-center mb-2">
                            <Info className="h-4 w-4 text-primary mr-2" />
                            <h5 className="font-medium">Resposta</h5>
                          </div>
                          <p className="text-muted-foreground">{question.answer}</p>
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground">
                          <button 
                            onClick={() => handleQuestionHelpful(question.id)}
                            className="flex items-center hover:text-foreground"
                          >
                            <span>Útil ({(questionHelpful[question.id] || question.helpful)})</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Buy Together Section */}
            <div className="bg-card border border-border rounded-xl p-6 mb-12">
              <h2 className="text-2xl font-cormorant font-bold mb-6">Compre Junto</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {buyTogetherProducts.map((item) => (
                      <div key={item.id} className="flex items-center border border-border rounded-lg p-3">
                        <img
                          src={item?.image_url || item?.product_variants?.[0]?.image_url || '/images/default-product.jpg'}
                          alt={item?.name || 'Produto complementar'}
                          className="w-16 h-16 object-cover rounded-lg mr-3"
                        />
                        <div>
                          <h3 className="font-medium text-sm">{item?.name || 'Produto complementar'}</h3>
                          <p className="text-primary font-bold">R$ {(item?.price || 0).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold mb-2">Kit Completo</h3>
                    <div className="space-y-1 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Produtos:</span>
                        <span>R$ {((product?.price || 0) + buyTogetherProducts.reduce((sum, item) => sum + (item?.price || 0), 0)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Desconto:</span>
                        <span className="text-green-600">-R$ 20.00</span>
                      </div>
                    </div>
                    <div className="flex justify-between font-bold text-lg mb-4">
                      <span>Total:</span>
                      <span className="text-primary">R$ {((product?.price || 0) + buyTogetherProducts.reduce((sum, item) => sum + (item?.price || 0), 0) - 20).toFixed(2)}</span>
                    </div>
                  </div>
                  <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    Comprar Kit
                  </button>
                </div>
              </div>
            </div>

            {/* Related Products */}
            <div className="mb-16">
              <h2 className="text-3xl font-cormorant font-bold mb-8 text-center">Produtos Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <div key={relatedProduct.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={relatedProduct?.product_variants?.[0]?.image_url || relatedProduct?.image_url || 'https://images.unsplash.com/photo-1513519880230-81f35f6cf9c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'}
                      alt={relatedProduct?.name || 'Produto relacionado'}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold mb-1">{relatedProduct?.name || ''}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{relatedProduct?.category?.name || relatedProduct?.categories?.name || 'Categoria não informada'}</p>
                     <div className="flex items-center mb-2">
                       <div className="flex items-center">
                         <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                         <span className="ml-1 text-xs font-medium">{relatedProduct?.rating || 0}</span>
                         <span className="mx-1 text-muted-foreground/70">•</span>
                         <span className="text-xs text-muted-foreground">{relatedProduct?.reviews || 0} avaliações</span>
                       </div>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-primary font-bold">R$ {(relatedProduct?.price || 0).toFixed(2)}</span>
                       <button
                         onClick={() => navigate(`/produto/${relatedProduct?.slug || ''}`)}
                         className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90 transition-colors"
                       >
                         Ver
                       </button>
                     </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p>Produto não encontrado.</p>
          </div>
        )}
        
        {/* Botão flutuante de edição para administradores */}
        <AdminEditButtonWrapper product={product} />
      </div>
    </Layout>
  );
}

// Botão flutuante de edição para administradores - renderizado condicionalmente
function AdminEditButtonWrapper({ product }: { product: ProductWithDetails | null }) {
  console.log('[ADMIN_EDIT_WRAPPER] Renderizando wrapper com product:', product?.id, product?.name);
  
  if (!product) {
    console.log('[ADMIN_EDIT_WRAPPER] Produto é null, não renderizando botão');
    return null;
  }
  
  console.log('[ADMIN_EDIT_WRAPPER] Renderizando AdminEditButton para produto:', product.id);
  return (
    <AdminEditButton 
      productId={product.id} 
      productName={product.name}
      variant="floating"
      position="bottom-right"
    />
  );
}
