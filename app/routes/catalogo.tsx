import type { MetaFunction } from "react-router-dom";
import type { LoaderFunctionArgs } from "react-router-dom";
import { Link, useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Search, Grid, List, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Layout } from '../components/Layout';
import { ProductService, type ProductWithDetails } from '../services/productService';
import { SortDropdown } from '../components/SortDropdown';
import { ProductGrid } from '../components/ProductGrid';
import InstagramSection from '../components/InstagramSection';

interface PaintType {
  id: string;
  name: string;
  description: string;
  applications: string[];
  features: string[];
  coverage: string;
  drying_time: string;
  price_per_liter: number;
  image_url?: string;
  category: 'primer' | 'acrylic' | 'enamel' | 'textured' | 'varnish';
  is_featured?: boolean;
}

interface LoaderData {
  paintTypes: PaintType[];
  products: ProductWithDetails[];
  productsTotal: number;
  currentPage: number;
  itemsPerPage: number;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Catálogo de Produtos - Prorevest" },
    { name: "description", content: "Explore nossa linha completa de produtos para revestimentos industriais." },
  ];
};

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderData> {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const itemsPerPage = 12;
  const offset = (page - 1) * itemsPerPage;

  // Dados estáticos dos tipos de tinta
  const paintTypes: PaintType[] = [
    {
      id: "primer",
      name: "Prime/Selador",
      description: "Base preparatória que garante aderência e uniformidade",
      image_url: "/images/products/primer.jpg",
      category: "primer",
      is_featured: true,
      features: ["Excelente aderência", "Secagem rápida", "Fácil aplicação"],
      applications: ["Paredes internas", "Madeira", "Metal"],
      coverage: "12-15 m²/L",
      drying_time: "2-4 horas",
      price_per_liter: 45.90
    },
    {
      id: "acrilica",
      name: "Tinta Acrílica",
      description: "Tinta à base de água com alta durabilidade",
      image_url: "/images/products/acrilica.jpg",
      category: "acrylic",
      is_featured: true,
      features: ["Resistente ao tempo", "Lavável", "Baixo odor"],
      applications: ["Paredes externas", "Paredes internas", "Fachadas"],
      coverage: "10-12 m²/L",
      drying_time: "1-2 horas",
      price_per_liter: 89.90
    },
    {
      id: "esmalte",
      name: "Esmalte Sintético",
      description: "Acabamento brilhante e resistente",
      image_url: "/images/products/esmalte.jpg",
      category: "enamel",
      price_per_liter: 95.90,
      is_featured: true,
      features: ["Alto brilho", "Resistente", "Lavável"],
      applications: ["Madeira", "Metal", "Portas", "Janelas"],
      coverage: "8-10 m²/L",
      drying_time: "4-6 horas"
    },
    {
      id: "texturizada",
      name: "Tinta Texturizada",
      description: "Cria efeitos decorativos únicos",
      image_url: "/images/products/texturizada.jpg",
      category: "textured",
      price_per_liter: 120.90,
      is_featured: false,
      features: ["Efeito textura", "Disfarça imperfeições", "Decorativa"],
      applications: ["Paredes internas", "Paredes externas", "Decoração"],
      coverage: "6-8 m²/L",
      drying_time: "3-5 horas"
    },
    {
      id: "verniz",
      name: "Verniz",
      description: "Proteção transparente para madeira",
      image_url: "/images/products/verniz.jpg",
      category: "varnish",
      price_per_liter: 75.90,
      is_featured: false,
      features: ["Transparente", "Proteção UV", "Realça a madeira"],
      applications: ["Madeira", "Móveis", "Pisos"],
      coverage: "12-15 m²/L",
      drying_time: "2-4 horas"
    }
  ];

  let products: any[] = [];
  let productsTotal = 0;

  try {
    console.log('🔍 Carregando produtos no catálogo...');
    const productService = new ProductService();
    
    const productsResult = await productService.getProductsWithTotal({
      limit: itemsPerPage,
      offset: offset
    });
    products = productsResult.products;
    productsTotal = productsResult.total;
    
    console.log('✅ Produtos carregados:', {
      products: products.length,
      total: productsTotal,
      page,
      offset
    });
  } catch (error) {
    console.error('❌ Erro ao carregar dados do banco de dados:', error);
    // Retorna arrays vazios se houver erro na conexão
    products = [];
    productsTotal = 0;
  }

  return {
    paintTypes,
    products,
    productsTotal,
    currentPage: page,
    itemsPerPage
  };
}

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden pt-20">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{backgroundImage: "url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1920&q=80')"}}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-normal text-white mb-6 leading-tight">
            Nosso <span className="text-orange-400">Catálogo</span><br/>
            Completo
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Descubra nossa extensa coleção de produtos para revestimentos industriais
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/studio">
              <button className="bg-orange-600 text-white px-8 py-4 rounded-lg hover:bg-orange-700 transition-all duration-300 text-lg">
                Acesse StudioProRevest
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const FilterSidebar = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  priceRange, 
  setPriceRange, 
  clearFilters, 
  activeFiltersCount
}: any) => {
  const categories = [
    { id: "primer", name: "Prime/Selador" },
    { id: "acrylic", name: "Tinta Acrílica" },
    { id: "enamel", name: "Tinta Esmalte" },
    { id: "textured", name: "Tinta Texturizada" },
    { id: "varnish", name: "Verniz" }
  ];

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
      <h3 className="text-2xl font-normal text-gray-900 mb-8">Filtros</h3>
      
      <div className="mb-8">
        <label htmlFor="catalog-search" className="block text-sm font-medium text-gray-700 mb-3">Buscar Produtos</label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="catalog-search"
            name="search"
            type="text"
            placeholder="Digite o nome do produto..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-8">
        <label htmlFor="catalog-category" className="block text-sm font-medium text-gray-700 mb-3">Categoria</label>
        <select 
          id="catalog-category"
          name="category"
          className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="Todos">Todas as categorias</option>
          {
            [
              { id: "primer", name: "Prime/Selador" },
              { id: "acrylic", name: "Tinta Acrílica" },
              { id: "enamel", name: "Tinta Esmalte" },
              { id: "textured", name: "Tinta Texturizada" },
              { id: "varnish", name: "Verniz" }
            ].map(category => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))
          }
        </select>
      </div>

      <div className="mb-8">
        <label htmlFor="price-per-liter" className="block text-sm font-medium text-gray-700 mb-3">
          Preço por Litro: R$ {priceRange[0]} - R$ {priceRange[1]}
        </label>
        <input
          id="price-per-liter"
          name="pricePerLiter"
          type="range"
          min="0"
          max="100"
          step="5"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {activeFiltersCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
        >
          Limpar Filtros ({activeFiltersCount})
        </button>
      )}
    </div>
  );
};

const ProductCard = ({ paintType }: { paintType: PaintType }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={paintType.image_url} 
          alt={paintType.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900">{paintType.name}</h3>
          {paintType.is_featured && (
            <span className="bg-orange-100 text-orange-600 text-xs font-medium px-2 py-1 rounded-full">
              Destaque
            </span>
          )}
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{paintType.description}</p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium">Rendimento:</span>
            <span className="ml-2">{paintType.coverage}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium">Secagem:</span>
            <span className="ml-2">{paintType.drying_time}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {paintType.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              {feature}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-orange-600">
            R$ {paintType.price_per_liter.toFixed(2)}
            <span className="text-sm font-normal text-gray-500">/L</span>
          </div>
          
          <Link
            to={`/produto/${paintType.id}`}
            className="bg-orange-600 text-white px-4 py-2 rounded-xl hover:bg-orange-700 transition-colors text-sm font-medium"
          >
            Ver Detalhes
          </Link>
        </div>
      </div>
    </div>
  );
};


const Pagination = ({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}: {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Anterior
      </button>

      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`px-3 py-2 text-sm font-medium rounded-lg ${
            page === currentPage
              ? 'bg-orange-600 text-white'
              : page === '...'
              ? 'text-gray-400 cursor-default'
              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Próxima
        <ChevronRight className="h-4 w-4 ml-1" />
      </button>
    </div>
  );
};

export default function Catalogo() {
  const { paintTypes, products, productsTotal, currentPage, itemsPerPage } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Debug: verificar dados carregados
  console.log('🔍 Dados carregados no componente:', {
    products: products?.length || 0,
    productsTotal
  });
  
  if (products && products.length > 0) {
    console.log('📦 Primeiro produto no componente:', products[0]);
  }
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);


  // Função para navegar para uma página específica
  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    navigate(`/catalogo?${newSearchParams.toString()}`);
  };


  // Filtrar produtos reais do banco de dados
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Removido filtro por categoria pois a propriedade não existe em ProductWithDetails
    const matchesCategory = selectedCategory === "Todos";
    
    return matchesSearch && matchesCategory;
  });


  // Ordenar produtos reais
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "featured":
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Todos");
    setPriceRange([0, 100]);
  };

  const activeFiltersCount = [
    searchTerm,
    selectedCategory !== "Todos" ? selectedCategory : ""
  ].filter(Boolean).length;

  const featuredPaintTypes = paintTypes.filter(paintType => paintType.is_featured);

  return (
    <Layout showHeaderFooter={false}>
      <div className="min-h-screen bg-gray-50">
        <HeroSection />
        
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <FilterSidebar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                clearFilters={clearFilters}
                activeFiltersCount={activeFiltersCount}
              />
            </div>
            
            <div className="lg:w-3/4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h2 className="text-3xl font-normal text-gray-900 mb-2">
                      Nossos Produtos
                    </h2>
                    <p className="text-gray-600">
                      {sortedProducts.length} produto{sortedProducts.length !== 1 ? 's' : ''} encontrado{sortedProducts.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <SortDropdown 
                    sortBy={sortBy} 
                    setSortBy={setSortBy}
                    showColors={false}
                  />
                  
                  <div className="flex bg-white rounded-xl border border-gray-200 p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "grid" 
                          ? "bg-orange-100 text-orange-600" 
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "list" 
                          ? "bg-orange-100 text-orange-600" 
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {sortedProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      Nenhum produto encontrado
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Tente ajustar os filtros ou buscar por outros termos
                    </p>
                    <button
                      onClick={clearFilters}
                      className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                </div>
              ) : (
                <ProductGrid 
                  products={sortedProducts}
                  viewMode={viewMode}
                />
              )}
              
              {/* Paginação para produtos */}
              <Pagination
                currentPage={currentPage}
                totalItems={productsTotal}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-24">
          <InstagramSection />
        </div>
      </div>
    </Layout>
  );
}
