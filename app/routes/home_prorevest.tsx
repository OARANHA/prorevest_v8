import { Building, Home, Lightbulb, Palette, Trees, Waves } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';
import { supabase } from '../lib/supabaseClient';

// Importando os componentes
import CalculadoraMagica from '../components/CalculadoraMagica';
import { FeaturedProducts } from '../components/FeaturedProducts';
import InstagramSection from '../components/InstagramSection';

// Tipos
interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  image: string;
  features: string[];
  gradient?: string;
  bgLight?: string;
}

interface ColorPalette {
  name: string;
  colors: string[];
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  project: string;
  content: string;
  image: string;
  rating: number;
}

// Componente HeroSection — nova hero com imagem do Studio Prorevest
const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Imagem de fundo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/capa_studio_prorevest_02.png')" }}
      />

      {/* Overlay escuro suave para legibilidade */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Menu flutuante à esquerda */}
      <FloatingMenu />

      {/* Link clicável para o Studio — posicionado sobre a área do texto na imagem */}
      <Link
        to="/studioprorevest"
        className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
        aria-label="Conheça o Studio ProRevest"
      >
        <span className="sr-only">Conheça o Studio ProRevest</span>
      </Link>

      {/* CTA sutil no canto inferior */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-6 flex flex-col items-center pb-24">
        <Link
          to="/studioprorevest"
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 text-sm font-medium"
        >
          Experimente agora
          <i className="ri-arrow-right-line"></i>
        </Link>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce z-30">
        <i className="ri-arrow-down-line text-2xl"></i>
      </div>
    </section>
  );
};

// Componente FloatingMenu (menu vertical à esquerda na seção hero)
const FloatingMenu = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:flex flex-col space-y-4">
      {/* Container vertical transparente leitoso */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-white/10">
        <button 
          onClick={() => scrollToSection('produtos')}
          className="bg-white/10 backdrop-blur-sm text-gray-900 px-3 py-3 rounded-lg font-light hover:bg-white/20 transition-all duration-300 shadow-md border border-white/20 flex flex-col items-center justify-center group mb-2 w-16 h-16"
        >
          <i className="ri-palette-line text-lg mb-1"></i>
          <span className="text-[10px] whitespace-nowrap font-light">Produtos</span>
        </button>
        <button 
          onClick={() => scrollToSection('cores')}
          className="bg-white/10 backdrop-blur-sm text-gray-900 px-3 py-3 rounded-lg font-light hover:bg-white/20 transition-all duration-300 shadow-md border border-white/20 flex flex-col items-center justify-center group mb-2 w-16 h-16"
        >
          <i className="ri-brush-line text-lg mb-1"></i>
          <span className="text-[10px] whitespace-nowrap font-light">Tecnologia</span>
        </button>
        <button 
          onClick={() => scrollToSection('sobre')}
          className="bg-white/10 backdrop-blur-sm text-gray-900 px-3 py-3 rounded-lg font-light hover:bg-white/20 transition-all duration-300 shadow-md border border-white/20 flex flex-col items-center justify-center group mb-2 w-16 h-16"
        >
          <i className="ri-leaf-line text-lg mb-1"></i>
          <span className="text-[10px] whitespace-nowrap font-light">Ambiental</span>
        </button>
        <Link to="/blog">
          <button className="bg-white/10 backdrop-blur-sm text-gray-900 px-3 py-3 rounded-lg font-light hover:bg-white/20 transition-all duration-300 shadow-md border border-white/20 flex flex-col items-center justify-center group w-16 h-16">
            <i className="ri-article-line text-lg mb-1"></i>
            <span className="text-[10px] whitespace-nowrap font-light">Blog</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

// Componente AboutSection
const AboutSection = () => {
  const stats = [
    { value: "20+", label: "Anos de Experiência" },
    { value: "50k+", label: "Projetos Realizados" },
    { value: "200+", label: "Cores Disponíveis" },
    { value: "98%", label: "Satisfação dos Clientes" }
  ];

  const features = [
    {
      icon: "ri-lightbulb-line",
      title: "Inovação",
      description: "Sempre à frente com as mais novas tecnologias em tintas e acabamentos",
      gradient: "from-purple-500 to-pink-500",
      bgLight: "from-purple-50 to-pink-50"
    },
    {
      icon: "ri-shield-check-line",
      title: "Qualidade",
      description: "Produtos testados e certificados com os mais altos padrões de durabilidade",
      gradient: "from-blue-500 to-cyan-500",
      bgLight: "from-blue-50 to-cyan-50"
    },
    {
      icon: "ri-leaf-line",
      title: "Sustentabilidade",
      description: "Compromisso com o meio ambiente em todas as nossas formulações",
      gradient: "from-green-500 to-emerald-500",
      bgLight: "from-green-50 to-emerald-50"
    },
    {
      icon: "ri-customer-service-line",
      title: "Suporte",
      description: "Atendimento especializado em todas as etapas do seu projeto",
      gradient: "from-orange-500 to-amber-500",
      bgLight: "from-orange-50 to-amber-50"
    }
  ];

  return (
    <section id="sobre" className="py-24 relative overflow-hidden">
      {/* Background delicado com elementos flutuantes */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-pink-50"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-orange-300 to-amber-300 rounded-full opacity-10 animate-bounce" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
            <i className="ri-building-line text-xl mr-3"></i>
            <span className="font-bold text-lg">SOBRE NÓS</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-gray-900 mb-6">
            Sobre a <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">Prorevest</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Há mais de 20 anos transformando ambientes com tintas inovadoras, combinando tecnologia de ponta com formulações sustentáveis para criar o futuro da pintura.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card com gradiente sutil */}
              <div className={`bg-gradient-to-br ${feature.bgLight} p-1 rounded-3xl`}>
                <div className="bg-white rounded-3xl p-8 h-full">
                  {/* Ícone com gradiente vibrante */}
                  <div className={`w-20 h-20 flex items-center justify-center bg-gradient-to-r ${feature.gradient} rounded-2xl mb-6 mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                    <i className={`${feature.icon} text-4xl text-white`}></i>
                  </div>
                  
                  <h3 className="text-2xl font-light text-gray-900 mb-4 text-center group-hover:text-gray-800 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
                  
                  {/* Elemento decorativo sutil */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Stats com design moderno */}
        <div className="relative">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-3xl p-12 text-white shadow-2xl overflow-hidden">
            {/* Elementos decorativos */}
            <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute top-10 right-10 w-20 h-20 bg-white/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-16 h-16 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-light mb-2">Nossas Conquistas</h3>
                <p className="text-white/80">Números que falam por si só</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                {stats.map((stat, index) => (
                  <div key={index} className="group">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                      <h3 className="text-5xl font-light mb-2 group-hover:scale-110 transition-transform duration-300">{stat.value}</h3>
                      <p className="text-white/90">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente ProductsSection
const ProductsSection = ({ featuredProducts }: { featuredProducts: any[] }) => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  
  const categories = [
    { name: "Todos", gradient: "from-gray-500 to-gray-600" },
    { name: "Acrílicas", gradient: "from-blue-500 to-cyan-500" },
    { name: "Esmaltes", gradient: "from-purple-500 to-pink-500" },
    { name: "Texturizadas", gradient: "from-green-500 to-emerald-500" },
    { name: "Especiais", gradient: "from-orange-500 to-amber-500" }
  ];

  return (
    <section id="produtos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
            <i className="ri-palette-line text-xl mr-3"></i>
            <span className="font-bold text-lg">PRODUTOS EM DESTAQUE</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-gray-900 mb-6">
            Tintas em <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">Destaque</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
            Conheça nossa seleção de tintas mais populares entre nossos clientes
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Descubra nossa linha completa de tintas com tecnologia de ponta e formulações inovadoras
          </p>
        </div>
        
        {/* Categorias com design moderno */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`group relative px-8 py-4 rounded-2xl transition-all duration-500 whitespace-nowrap cursor-pointer transform hover:scale-105 ${
                activeCategory === category.name 
                  ? 'shadow-2xl scale-105' 
                  : 'shadow-lg hover:shadow-xl'
              }`}
              onClick={() => setActiveCategory(category.name)}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} rounded-2xl`}></div>
              <div className={`absolute inset-0 bg-white rounded-2xl transition-all duration-300 ${
                activeCategory === category.name ? 'opacity-0' : 'opacity-90 group-hover:opacity-0'
              }`}></div>
              <span className={`relative z-10 font-semibold transition-colors duration-300 ${
                activeCategory === category.name ? 'text-white' : 'text-gray-700'
              }`}>
                {category.name}
              </span>
            </button>
          ))}
        </div>
        
        {/* Cards de produtos com design vibrante */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featuredProducts.length > 0 ? featuredProducts.map((product) => (
            <div 
              key={product.id} 
              className="group relative cursor-pointer"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Card com gradiente sutil */}
              <div className={`bg-gradient-to-br ${product.bgLight || 'from-blue-50 to-cyan-50'} p-1 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3`}>
                <div className="bg-white rounded-3xl overflow-hidden">
                  {/* Badge de destaque */}
                  <div className="absolute top-4 left-4 z-20">
                    <div className={`bg-gradient-to-r ${product.gradient || 'from-blue-500 to-cyan-500'} text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg`}>
                      Premium
                    </div>
                  </div>

                  {/* Botões de ação que aparecem no hover */}
                  <div className={`absolute top-4 right-4 z-20 flex flex-col space-y-2 transition-all duration-500 ${
                    hoveredProduct === product.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}>
                    <button className="p-3 bg-white rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110">
                      <i className="ri-heart-line text-gray-700 hover:text-red-500 transition-colors"></i>
                    </button>
                    <button className="p-3 bg-white rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110">
                      <i className="ri-search-line text-gray-700 hover:text-blue-500 transition-colors"></i>
                    </button>
                  </div>
                  
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay com informações que aparece no hover */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${product.gradient || 'from-blue-500 to-cyan-500'} transition-all duration-500 ${
                      hoveredProduct === product.id ? 'opacity-90' : 'opacity-0'
                    }`}>
                      <div className={`absolute bottom-0 left-0 right-0 p-6 text-white transition-all duration-500 transform ${
                        hoveredProduct === product.id ? 'translate-y-0' : 'translate-y-full'
                      }`}>
                        <h4 className="text-2xl font-bold mb-3">{product.name}</h4>
                        <div className="space-y-2 mb-4">
                          {product.features && product.features.map((feature: string, idx: number) => (
                            <div key={idx} className="flex items-center">
                              <i className="ri-check-line text-lg mr-2"></i>
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <Link to={`/produto/${product.slug}`}>
                          <button className="w-full bg-white text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300">
                            Ver Detalhes
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-light text-gray-900 group-hover:text-gray-800 transition-colors">
                        {product.name}
                      </h3>
                      <div className={`w-12 h-12 bg-gradient-to-r ${product.gradient || 'from-blue-500 to-cyan-500'} rounded-xl flex items-center justify-center shadow-md`}>
                        <i className="ri-star-fill text-white"></i>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className={`text-lg font-medium text-gray-600`}>
                        Consulte preço
                      </p>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="ri-star-fill text-yellow-400 text-sm"></i>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum produto em destaque encontrado no momento.</p>
              <Link to="/catalogo" className="mt-4 inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
                Ver todos os produtos
              </Link>
            </div>
          )}
        </div>
        
        {/* CTA Final com design vibrante */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white shadow-2xl overflow-hidden relative">
            {/* Elementos decorativos */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-white/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-16 h-16 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-light mb-4">Explore Nossa Coleção Completa</h3>
              <p className="text-xl mb-8 opacity-90">
                Mais de 200 produtos disponíveis para transformar seu espaço
              </p>
              <Link to="/catalogo">
                <button className="bg-white text-purple-600 px-10 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-xl transform hover:scale-105 text-lg">
                  Ver Catálogo Completo
                  <i className="ri-arrow-right-line ml-2"></i>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente ColorSection - Versão Melhorada
const ColorSection = () => {
  const colorPalettes: ColorPalette[] = [
    {
      name: "Sunset Vibes",
      colors: ["#FF6B35", "#F7931E", "#FFD23F", "#FF8C69", "#FF7F50"]
    },
    {
      name: "Ocean Deep",
      colors: ["#004E89", "#1A73E8", "#4FC3F7", "#81D4FA", "#B3E5FC"]
    },
    {
      name: "Natural Earth",
      colors: ["#8D6E63", "#A1887F", "#BCAAA4", "#D7CCC8", "#EFEBE9"]
    },
    {
      name: "Modern Gray",
      colors: ["#37474F", "#546E7A", "#78909C", "#B0BEC5", "#CFD8DC"]
    }
  ];

  const colorInspirations = [
    {
      title: "Sala de Estar",
      description: "Cores aconchegantes que criam ambientes acolhedores",
      icon: "ri-sofa-line",
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50",
      borderColor: "border-pink-200",
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80",
      palette: ["#FF69B4", "#FFB6C1", "#FFC0CB", "#F8BBD9"]
    },
    {
      title: "Cozinha Moderna",
      description: "Paletas que combinam praticidade e estilo",
      icon: "ri-restaurant-line",
      gradient: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-50 to-indigo-50",
      borderColor: "border-purple-200",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=80",
      palette: ["#9C27B0", "#673AB7", "#E1BEE7", "#CE93D8"]
    },
    {
      title: "Quarto Aconchegante",
      description: "Tons que promovem relaxamento e tranquilidade",
      icon: "ri-bed-line",
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-50",
      borderColor: "border-yellow-200",
      image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=400&q=80",
      palette: ["#FFC107", "#FF9800", "#FFE082", "#FFB74D"]
    },
    {
      title: "Escritório",
      description: "Cores que estimulam produtividade e foco",
      icon: "ri-computer-line",
      gradient: "from-cyan-500 to-blue-500",
      bgGradient: "from-cyan-50 to-blue-50",
      borderColor: "border-cyan-200",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
      palette: ["#00BCD4", "#2196F3", "#B2EBF2", "#4FC3F7"]
    },
    {
      title: "Fachada Externa",
      description: "Cores resistentes que valorizam a arquitetura",
      icon: "ri-home-4-line",
      gradient: "from-green-500 to-teal-500",
      bgGradient: "from-green-50 to-teal-50",
      borderColor: "border-green-200",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80",
      palette: ["#4CAF50", "#009688", "#A5D6A7", "#4DB6AC"]
    },
    {
      title: "Banheiro",
      description: "Paletas que unem higiene e sofisticação",
      icon: "ri-drop-line",
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50",
      borderColor: "border-indigo-200",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80",
      palette: ["#3F51B5", "#9C27B0", "#C5CAE9", "#E1BEE7"]
    }
  ];

  return (
    <section id="cores" className="py-24 relative overflow-hidden">
      {/* Background com elementos decorativos */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-cyan-50"></div>
      <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full opacity-5 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full opacity-5 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full opacity-5 animate-bounce" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
            <i className="ri-palette-line text-xl mr-3"></i>
            <span className="font-bold text-lg">UNIVERSO DAS CORES</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-normal text-gray-900 mb-6">
            Explore o Universo das <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent font-bold">Cores</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra paletas exclusivas que transformam qualquer ambiente em uma obra de arte
          </p>
        </div>

        {/* Paletas Predefinidas com Estilo */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Paletas Predefinidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {colorPalettes.map((palette, index) => (
              <div key={palette.name} className="group">
                <div className="bg-white/90 backdrop-blur-sm border-2 border-violet-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-2xl font-bold text-gray-800">{palette.name}</h4>
                    <button className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-violet-600 hover:to-purple-600 transition-all duration-300 shadow-lg transform hover:scale-105">
                      Selecionar Paleta
                    </button>
                  </div>
                  <div className="flex space-x-3 justify-center">
                    {palette.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-16 h-16 rounded-2xl transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-lg border-4 border-white"
                        style={{
                          backgroundColor: color,
                          animationDelay: `${idx * 100}ms`,
                          boxShadow: `0 0 20px ${color}40`
                        }}
                      ></div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                      index % 2 === 0
                        ? 'bg-violet-100 text-violet-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {palette.colors.length} cores exclusivas
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transforme Cada Espaço - Cards Delicados */}
        <div className="relative">
          {/* Background sutil com elementos delicados */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-3xl"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-200 to-orange-200 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>

          <div className="relative z-10 p-8">
            {/* Título elegante */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
                <i className="ri-home-heart-line text-xl mr-2"></i>
                <span className="font-semibold text-lg">TRANSFORME CADA ESPAÇO</span>
              </div>
              <h3 className="text-4xl font-bold mb-6 text-gray-800">
                Explore Ambientes <span className="text-indigo-600">Únicos</span>
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Descubra ambientes únicos com cores que contam histórias e criam experiências inesquecíveis
              </p>
            </div>

            {/* Cards delicados e vibrantes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  id: "sala-estar",
                  name: "Sala de Estar",
                  description: "Ambientes acolhedores e sofisticados",
                  icon: <Home className="h-6 w-6" />,
                  image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                  link: "/projetos",
                  gradient: "from-pink-500 to-rose-500",
                  bgGradient: "from-pink-50 to-rose-50"
                },
                {
                  id: "cozinha",
                  name: "Cozinha",
                  description: "Espaços funcionais e modernos",
                  icon: <Building className="h-6 w-6" />,
                  image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                  link: "/projetos",
                  gradient: "from-orange-500 to-amber-500",
                  bgGradient: "from-orange-50 to-amber-50"
                },
                {
                  id: "quarto",
                  name: "Quarto",
                  description: "Ambientes relaxantes e pessoais",
                  icon: <Palette className="h-6 w-6" />,
                  image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                  link: "/projetos",
                  gradient: "from-indigo-500 to-purple-500",
                  bgGradient: "from-indigo-50 to-purple-50"
                },
                {
                  id: "banheiro",
                  name: "Banheiro",
                  description: "Espaços elegantes e funcionais",
                  icon: <Waves className="h-6 w-6" />,
                  image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                  link: "/projetos",
                  gradient: "from-cyan-500 to-blue-500",
                  bgGradient: "from-cyan-50 to-blue-50"
                },
                {
                  id: "escritorio",
                  name: "Escritório",
                  description: "Ambientes produtivos e inspiradores",
                  icon: <Lightbulb className="h-6 w-6" />,
                  image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                  link: "/projetos",
                  gradient: "from-emerald-500 to-green-500",
                  bgGradient: "from-emerald-50 to-green-50"
                },
                {
                  id: "fachada",
                  name: "Fachada",
                  description: "Primeiras impressões marcantes",
                  icon: <Building className="h-6 w-6" />,
                  image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                  link: "/projetos",
                  gradient: "from-yellow-500 to-orange-500",
                  bgGradient: "from-yellow-50 to-orange-50"
                },
                {
                  id: "jardim",
                  name: "Jardim de Inverno",
                  description: "Natureza integrada ao ambiente",
                  icon: <Trees className="h-6 w-6" />,
                  image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                  link: "/projetos",
                  gradient: "from-lime-500 to-emerald-500",
                  bgGradient: "from-lime-50 to-emerald-50"
                },
                {
                  id: "simulador",
                  name: "Simulador de Cores",
                  description: "Experimente cores em tempo real antes de aplicar",
                  icon: <Palette className="h-6 w-6" />,
                  image: "https://images.unsplash.com/photo-1513519880230-81f35f6cf9c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                  link: "/simulador",
                  gradient: "from-violet-500 to-purple-500",
                  bgGradient: "from-violet-50 to-purple-50"
                }
              ].map((inspiration, index) => (
                <Link
                  key={inspiration.id}
                  to={inspiration.link}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card com gradiente sutil */}
                  <div className={`bg-gradient-to-br ${inspiration.bgGradient} p-0.5 rounded-2xl`}>
                    <div className="bg-white rounded-xl overflow-hidden">
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={inspiration.image}
                          alt={inspiration.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Overlay sutil */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${inspiration.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                        {/* Badge elegante */}
                        <div className={`absolute top-3 left-3 bg-gradient-to-r ${inspiration.gradient} text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-md`}>
                          Ambiente
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-center mb-3">
                          <div className={`w-12 h-12 bg-gradient-to-r ${inspiration.gradient} rounded-xl flex items-center justify-center mr-3 shadow-md`}>
                            <div className="text-white">
                              {inspiration.icon}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                              {inspiration.name}
                            </h3>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                          {inspiration.description}
                        </p>

                        <div className={`bg-gradient-to-r ${inspiration.gradient} text-white px-4 py-2.5 rounded-lg font-medium hover:shadow-md transition-all duration-300 flex items-center justify-center text-sm`}>
                          Explorar
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-3xl p-12 text-white shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">Pronto para Transformar Seu Espaço?</h3>
            <p className="text-xl mb-8 opacity-90">
              Explore todas as possibilidades e encontre a combinação perfeita para seu projeto
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/catalogo">
                <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:scale-105">
                  Ver Catálogo Completo
                </button>
              </Link>
              <Link to="/simulador">
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-purple-600 transition-all duration-300">
                  Experimentar Simulador
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente SidebarNavigation (barra lateral direita com indicador de progresso)
const SidebarNavigation = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const scrollProgressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Calcular progresso do scroll (0-100)
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
      
      // Determinar seção ativa com base na posição do scroll
      const sections = ['hero', 'sobre', 'produtos', 'cores', 'contato', 'instagram'];
      const sectionOffsets = sections.map(section => {
        const element = document.getElementById(section);
        return element ? element.offsetTop : 0;
      });
      
      // Encontrar a seção ativa com base na posição atual do scroll
      let activeIndex = 0;
      for (let i = 0; i < sectionOffsets.length; i++) {
        const currentOffset = sectionOffsets[i];
        const nextOffset = sectionOffsets[i + 1] || Infinity;
        
        // Verificar se a posição atual do scroll está dentro desta seção
        if (scrollTop >= currentOffset - 100 && scrollTop < nextOffset - 100) {
          activeIndex = i;
          break;
        }
        
        // Caso especial para a última seção
        if (i === sectionOffsets.length - 1 && scrollTop >= currentOffset - 100) {
          activeIndex = i;
          break;
        }
      }
      
      setActiveSection(sections[activeIndex]);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Chamar uma vez para definir o estado inicial

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="hidden lg:block fixed right-8 top-1/2 transform -translate-y-1/2 z-40">
      {/* Container vertical transparente leitoso */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-white/10 flex flex-col items-center">
        {/* Indicador de progresso de rolagem */}
        <div className="relative h-32 w-1 bg-white/20 rounded-full overflow-hidden mb-4">
          <div 
            className="absolute bottom-0 left-0 w-full bg-orange-500 rounded-full transition-all duration-300"
            style={{ height: `${scrollProgress}%` }}
          ></div>
        </div>
        
        {/* Ícones de navegação para cada seção */}
        <div className="flex flex-col items-center space-y-2">
          {[
            { id: 'hero', icon: 'ri-home-4-line', label: 'Início' },
            { id: 'sobre', icon: 'ri-information-line', label: 'Sobre' },
            { id: 'produtos', icon: 'ri-palette-line', label: 'Produtos' },
            { id: 'cores', icon: 'ri-brush-line', label: 'Cores' },
            { id: 'contato', icon: 'ri-mail-line', label: 'Contato' },
            { id: 'instagram', icon: 'ri-instagram-line', label: 'Instagram' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                scrollToSection(item.id);
              }}
              className={`w-12 h-12 rounded-lg transition-all duration-300 flex items-center justify-center ${
                activeSection === item.id 
                  ? 'bg-orange-600 text-white shadow-lg scale-110' 
                  : 'bg-white/10 text-gray-900 hover:bg-white/20 border border-white/20 backdrop-blur-sm'
              }`}
              title={item.label}
            >
              <i className={`${item.icon} text-lg`}></i>
            </button>
          ))}
          
          {/* Porcentagem de progresso */}
          <div className="mt-4 text-center">
            <div className="text-[10px] font-light text-gray-900 bg-white/10 px-2 py-1 rounded-lg shadow-sm border border-white/20 backdrop-blur-sm">
              {Math.round(scrollProgress)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente ContactSection
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Aqui você adicionaria a lógica de envio do formulário
    alert('Orçamento solicitado com sucesso! Entraremos em contato em breve.');
  };

  return (
    <section id="contato" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-fixed bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1920&q=80')"}}>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/90 to-blue-900/90"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-normal mb-6 leading-tight">
              Transforme Seu Projeto com<span className="text-orange-400"> Nossas Tintas</span>
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Fale conosco e descubra como nossas tintas podem revolucionar seus ambientes
            </p>
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
             
            
            
            <div className="bg-orange-600/20 border border-orange-400 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-2">
                <i className="ri-time-line text-orange-400 text-xl"></i>
                <span className="font-normal text-orange-400">Oferta Limitada</span>
              </div>
              <p className="text-sm">Cores personalizadas conforme seu projeto</p>
            </div>
          </div>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-normal text-gray-900 mb-6 text-center">Solicite Seu Orçamento</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="relative">
                <input 
                  id="name-input"
                  type="text" 
                  required 
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors peer" 
                  placeholder=" " 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
                <label htmlFor="name-input" className="absolute left-4 top-4 text-gray-500 transition-all duration-300 peer-focus:-translate-y-2 peer-focus:scale-75 peer-focus:text-orange-600 peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:scale-75">
                  Nome Completo
                </label>
              </div>
              
              <div className="relative">
                <input 
                  id="email-input"
                  type="email" 
                  required 
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors peer" 
                  placeholder=" " 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                <label htmlFor="email-input" className="absolute left-4 top-4 text-gray-500 transition-all duration-300 peer-focus:-translate-y-2 peer-focus:scale-75 peer-focus:text-orange-600 peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:scale-75">
                  E-mail
                </label>
              </div>
              
              <div className="relative">
                <input 
                  id="phone-input"
                  type="tel" 
                  required 
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors peer" 
                  placeholder=" " 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
                <label htmlFor="phone-input" className="absolute left-4 top-4 text-gray-500 transition-all duration-300 peer-focus:-translate-y-2 peer-focus:scale-75 peer-focus:text-orange-600 peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:scale-75">
                  Telefone
                </label>
              </div>
              
              <div className="relative">
                <label htmlFor="project-select" className="sr-only">Tipo de Projeto</label>
                <select 
                  id="project-select"
                  name="project" 
                  required 
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors appearance-none pr-8"
                  value={formData.project}
                  onChange={handleChange}
                  autoComplete="off"
                >
                  <option value="">Tipo de Projeto</option>
                  <option value="residencial">Residencial</option>
                  <option value="comercial">Comercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="reforma">Reforma</option>
                </select>
                <div className="w-6 h-6 flex items-center justify-center absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <i className="ri-arrow-down-s-line text-gray-400"></i>
                </div>
              </div>

              <div className="relative">
                <textarea 
                  id="message-textarea"
                  name="message" 
                  rows={4} 
                  maxLength={500} 
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors resize-none peer" 
                  placeholder=" "
                  value={formData.message}
                  onChange={handleChange}
                  autoComplete="off"
                ></textarea>
                <label htmlFor="message-textarea" className="absolute left-4 top-4 text-gray-500 transition-all duration-300 peer-focus:-translate-y-2 peer-focus:scale-75 peer-focus:text-orange-600 peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:scale-75">
                  Descreva seu projeto
                </label>
                <div className="text-right text-xs text-gray-400 mt-1">{formData.message.length}/500</div>
              </div>
              
              <button 
                type="submit" 
                className="w-full py-4 rounded-lg font-bold transition-all duration-300 text-lg whitespace-nowrap bg-gradient-to-r from-orange-600 to-blue-600 text-white hover:from-orange-700 hover:to-blue-700"
              >
                Solicitar Orçamento de Tintas
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};


// Componente BackToTopButton (botão que aparece no canto inferior direito)
const BackToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar botão após rolar 300px
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-white/10 backdrop-blur-sm text-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center border border-white/20"
          aria-label="Voltar ao topo"
        >
          <i className="ri-arrow-up-line text-lg"></i>
        </button>
      )}
    </>
  );
};

// Cache para produtos em destaque
let productsCache: { data: any[], timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Componente Principal
const ProrevestApp = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar produtos em destaque do Supabase
  useEffect(() => {
    let isMounted = true;

    const loadFeaturedProducts = async () => {
      try {
        // Verificar se há dados em cache válidos
        const now = Date.now();
        if (productsCache && (now - productsCache.timestamp) < CACHE_DURATION) {
          if (isMounted) {
            setFeaturedProducts(productsCache.data);
            setLoading(false);
          }
          return;
        }

        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            categories!inner(name),
            finishes!inner(name),
            product_variants(
              id,
              image_url,
              colors!inner(id, name, hex_code)
            )
          `)
          .eq('is_featured', true)
          .eq('is_archived', false)
          .limit(4);

        if (!isMounted) return; // Evitar atualização de estado se componente foi desmontado

        if (error) {
          console.error('Erro ao carregar produtos em destaque:', error);
          // Fallback para produtos estáticos em caso de erro
          const fallbackProducts = [
            {
              id: "1",
              name: "Tinta Acrílica Premium",
              slug: "tinta-acrilica-premium",
              description: "Tinta acrílica de alta qualidade para paredes internas",
              image_url: "https://images.unsplash.com/photo-1580533826055-22ccda8309c3?auto=format&fit=crop&w=400&q=80",
              categories: { name: "Acrílica" },
              finishes: { name: "Fosco" },
              product_variants: [{ colors: { name: "Branco", hex_code: "#FFFFFF" } }],
              price: 99.90,
              is_featured: true,
              rating: 4.5,
              reviews: 120
            },
            {
              id: "2",
              name: "Esmalte Sintético",
              slug: "esmalte-sintetico",
              description: "Esmalte sintético com acabamento brilhante",
              image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80",
              categories: { name: "Esmalte" },
              finishes: { name: "Brilhante" },
              product_variants: [{ colors: { name: "Preto", hex_code: "#000000" } }],
              price: 129.90,
              is_featured: true,
              rating: 4.8,
              reviews: 95
            }
          ];
          setFeaturedProducts(fallbackProducts);
          // Não armazenar em cache dados de fallback
        } else {
          const validData = data || [];
          setFeaturedProducts(validData);
          // Armazenar em cache apenas dados válidos
          productsCache = {
            data: validData,
            timestamp: now
          };
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Erro inesperado:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadFeaturedProducts();

    return () => {
      isMounted = false; // Cleanup para evitar memory leaks
    };
  }, []); // Dependências vazias - só executa uma vez na montagem

  useEffect(() => {
    // Rolar suavemente para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (this: HTMLAnchorElement, e: Event) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href') || '');
        if (target) {
          window.scrollTo({
            top: (target as HTMLElement).offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });

    // Animação de revelação ao rolar
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, observerOptions);
    
    // Observar elementos
    document.querySelectorAll('.product-card').forEach(card => {
      observer.observe(card);
    });

    return () => {
      // Cleanup
    };
  }, []);

  // Função para converter produtos do banco para o formato esperado pelo FeaturedProducts
  const convertProductForFeatured = (product: any) => {
    const firstColor = product.product_variants?.[0]?.colors;
    
    return {
      id: product.id,
      name: product.name,
      slug: product.slug || product.id,
      description: product.description || '',
      image: product.image_url || 
            product.product_variants?.[0]?.image_url || 
            "https://images.unsplash.com/photo-1513519880230-81f35f6cf9c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      category: product.categories?.name || 'Produto',
      finish: product.finishes?.name || 'Padrão',
      color: firstColor?.name || 'Sem cor',
      hexCode: firstColor?.hex_code || '#000000',
      price: product.price,
      isFeatured: product.is_featured || false,
      rating: product.rating || 4.5,
      reviews: product.reviews || 0,
      badges: product.badges || (product.is_featured ? ['Destaque'] : [])
    };
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 to-blue-100/30 pointer-events-none"></div>
      
      <HeroSection />
      <FeaturedProducts
        products={featuredProducts.map(convertProductForFeatured)}
      />
      <AboutSection />
      <ProductsSection featuredProducts={featuredProducts.map(convertProductForFeatured)} />

      {/* Calculadora Mágica */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <CalculadoraMagica />
        </div>
      </section>

      <ColorSection />



      <ContactSection />
      <InstagramSection />
      
      {/* Componentes adicionais solicitados */}
      <SidebarNavigation />
      <BackToTopButton />
    </div>
  );
};

export default ProrevestApp;
