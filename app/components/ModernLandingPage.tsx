import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Paintbrush, 
  Palette, 
  Wand2, 
  ArrowRight, 
  Star, 
  Sparkles,
  Droplets,
  ShieldCheck,
  Truck,
  Users,
  ChevronDown,
  Play,
  CheckCircle,
  Zap,
  Heart,
  Award,
  TrendingUp,
  Lightbulb,
  Camera,
  Layers,
  ShoppingCart,
  Eye,
  Grid3X3,
  Scissors,
  Brush,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  PaletteIcon,
  SwatchBook,
  PaintRoller,
  SprayCan,
  ArrowUp,
  Home,
  Info,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  X,
  Menu,
  X as CloseIcon,
  Search
} from 'lucide-react';
import { Button } from './ui/button';
import CalculadoraMagica from './CalculadoraMagica';

export default function ModernLandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [email, setEmail] = useState('');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(true);
  const scrollProgressRef = useRef<HTMLDivElement>(null);

  // Efeito para lidar com o scroll
  useEffect(() => {
    const handleScroll = () => {
      // Verificar posição do scroll para header
      const scrolled = window.scrollY > 5;
      setIsScrolled(scrolled);
      
      // Mostrar botão "voltar ao topo" após 200px de scroll
      setShowBackToTop(window.scrollY > 200);
      
      // Calcular progresso do scroll (0-100)
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
      
      // Determinar seção ativa com base na posição do scroll
      const sections = ['hero', 'about', 'technology', 'products', 'universe', 'testimonials', 'blog'];
      const sectionOffsets = sections.map(section => {
        const element = document.getElementById(section);
        return element ? element.offsetTop : 0;
      });
      
      const currentSectionIndex = sectionOffsets.findIndex((offset, index) => {
        const nextOffset = sectionOffsets[index + 1] || Infinity;
        return scrollTop >= offset - 50 && scrollTop < nextOffset - 50;
      });
      
      if (currentSectionIndex !== -1) {
        setActiveSection(sections[currentSectionIndex]);
      }
    };

    // Auto-rotate testimonials
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % 3);
    }, 7000);

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Chamar uma vez para definir o estado inicial

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(testimonialInterval);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirecionar para a página de catálogo com o termo de busca
    if (searchQuery.trim()) {
      window.location.href = `/catalogo?search=${encodeURIComponent(searchQuery)}`;
    } else {
      window.location.href = '/catalogo';
    }
    setSearchQuery('');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de inscrição na newsletter
    alert(`Obrigado por se inscrever com o email: ${email}`);
    setEmail('');
  };

  // Dados para as seções
  const categories = [
    {
      title: "Tintas Acrílicas",
      description: "Para ambientes internos e externos",
      icon: <PaintRoller className="h-8 w-8" />,
      link: "/categoria/tintas-acrilicas"
    },
    {
      title: "Texturas Especiais",
      description: "Acabamentos únicos para sua parede",
      icon: <SwatchBook className="h-8 w-8" />,
      link: "/categoria/texturas"
    },
    {
      title: "Tintas Automotivas",
      description: "Durabilidade e brilho excepcionais",
      icon: <SprayCan className="h-8 w-8" />,
      link: "/categoria/tintas-automotivas"
    },
    {
      title: "Esmaltes",
      description: "Proteção e acabamento perfeito",
      icon: <Brush className="h-8 w-8" />,
      link: "/categoria/esmaltes"
    }
  ];

  // Depoimentos de clientes
  const testimonials = [
    {
      name: "Joana Silva",
      role: "Arquiteta",
      content: "A qualidade das tintas é incrível! A cor ficou exatamente como eu imaginei. A entrega foi rápida e o atendimento excepcional.",
      rating: 5,
      avatar: "/images/avatar-1.jpg"
    },
    {
      name: "Marcos Oliveira",
      role: "Designer de Interiores",
      content: "O atendimento foi excepcional. Me ajudaram a escolher a cor perfeita para minha sala. As texturas são de alta qualidade e duradouras.",
      rating: 5,
      avatar: "/images/avatar-2.jpg"
    },
    {
      name: "Carla Souza",
      role: "Proprietária de Loja",
      content: "As texturas são incríveis! Deram um toque super moderno para o meu escritório. Recomendo fortemente para qualquer projeto.",
      rating: 5,
      avatar: "/images/avatar-3.jpg"
    }
  ];

  // Benefícios principais
  const benefits = [
    {
      icon: <ShieldCheck className="h-10 w-10 text-black" />,
      title: "Qualidade Garantida",
      description: "Tintas testadas e aprovadas para máxima durabilidade"
    },
    {
      icon: <Truck className="h-10 w-10 text-black" />,
      title: "Entrega Rápida",
      description: "Entregamos em todo o Brasil com segurança e rapidez"
    },
    {
      icon: <Users className="h-10 w-10 text-black" />,
      title: "Especialistas",
      description: "Equipe especializada para ajudar em cada etapa"
    },
    {
      icon: <Award className="h-10 w-10 text-black" />,
      title: "15 Anos de Excelência",
      description: "Experiência comprovada no mercado"
    }
  ];

  // Ferramentas interativas
  const interactiveTools = [
    {
      icon: <Palette className="h-12 w-12 text-black" />,
      title: "Simulador de Cores",
      description: "Experimente cores em tempo real antes de aplicar",
      link: "/simulador",
    },
    {
      icon: <Layers className="h-12 w-12 text-black" />,
      title: "Comparador de Produtos",
      description: "Compare características e preços lado a lado",
      link: "/comparador",
    },
    {
      icon: <Lightbulb className="h-12 w-12 text-black" />,
      title: "Moodboard Colaborativo",
      description: "Crie paletas com sua equipe em tempo real",
      link: "/moodboard",
    },
    {
      icon: <Zap className="h-12 w-12 text-black" />,
      title: "Calculadora de Rendimento",
      description: "Descubra a quantidade exata de tinta necessária",
      link: "/calculadora-rendimento",
    }
  ];

  // Estatísticas da empresa
  const stats = [
    { value: "15+", label: "Anos de Experiência", icon: <Award className="h-6 w-6 text-black" /> },
    { value: "5000+", label: "Clientes Satisfeitos", icon: <Heart className="h-6 w-6 text-black" /> },
    { value: "98%", label: "Taxa de Recomendação", icon: <Star className="h-6 w-6 text-black" /> },
    { value: "24h", label: "Entrega Rápida", icon: <Truck className="h-6 w-6 text-black" /> }
  ];

  // Posts do blog
  const blogPosts = [
    {
      title: "Tendências de Cores para 2023",
      excerpt: "Descubra as cores que vão dominar os interiores neste ano",
      image: "/images/blog-1.jpg",
      date: "15 Mar 2023",
      tags: ["Tendências", "Cores"]
    },
    {
      title: "Como Escolher a Tinta Certa",
      excerpt: "Guia completo para selecionar a melhor tinta para cada ambiente",
      image: "/images/blog-2.jpg",
      date: "22 Fev 2023",
      tags: ["Dicas", "Escolha"]
    },
    {
      title: "Acabamentos e Suas Aplicações",
      excerpt: "Entenda as diferenças entre os principais acabamentos do mercado",
      image: "/images/blog-3.jpg",
      date: "10 Jan 2023",
      tags: ["Acabamentos", "Aplicações"]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-Barlow">
      <main className="pt-0">
        {/* Hero Section */}
        <section id="hero" className="relative h-screen flex items-center overflow-hidden">
          {/* Background image with futuristic showroom */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-blue-500/20 z-0">
            <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-100"></div>
          </div>
          
          {/* Overlay gradient for better text visibility */}
          <div className="hero-overlay"></div>
          
          {/* Overlay content */}
          <div className="container mx-auto px-4 relative z-10 pt-20" style={{ color: 'white' }}>
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 hero-text">
                Cores que Transformam o Futuro
              </h1>
              <p className="text-xl mb-8 hero-text">
                Descubra nossa coleção premium de tintas e texturas que revolucionam seus espaços
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => scrollToSection('products')}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-all duration-500 shadow-sm"
                >
                  Explorar Produtos
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => scrollToSection('about')}
                  className="bg-transparent border border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-all duration-500 hero-button"
                >
                  Saiba Mais
                </Button>
              </div>
            </div>
          </div>
          
          {/* Floating vertical navigation */}
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2 hidden lg:block">
            <div className="flex flex-col space-y-6">
              {[
                { id: 'products', label: 'Produtos' },
                { id: 'technology', label: 'Tecnologia' },
                { id: 'about', label: 'Sustentabilidade' },
                { id: 'blog', label: 'Blog' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="bg-card/80 backdrop-blur-sm text-foreground px-4 py-3 rounded-lg font-medium hover:bg-card transition-all duration-300 shadow-lg border border-border flex items-center"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-muted/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Sobre a Prorevest</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Inovação, qualidade e sustentabilidade em cada produto que oferecemos
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-500 border border-border text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-muted p-3 rounded-full">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Spotlight */}
        <section id="technology" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Tecnologia de Ponta</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Inovação que transforma a forma como você vê e aplica tintas
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Fórmula Avançada",
                  description: "Tecnologia de polímeros que garante durabilidade superior",
                  icon: <Zap className="h-10 w-10" />
                },
                {
                  title: "Secagem Rápida",
                  description: "Acabamento perfeito em menos tempo",
                  icon: <TrendingUp className="h-10 w-10" />
                },
                {
                  title: "Baixo Impacto Ambiental",
                  description: "Produtos sustentáveis com emissão reduzida de CO₂",
                  icon: <Heart className="h-10 w-10" />
                }
              ].map((tech, index) => (
                <div 
                  key={index} 
                  className="bg-card rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-border group hover:-translate-y-2"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
                    transition: 'transform 0.5s ease'
                  }}
                >
                  <div className="flex justify-center mb-6">
                    <div className="bg-primary/10 p-4 rounded-full text-primary group-hover:rotate-12 transition-transform duration-500">
                      {tech.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-center">{tech.title}</h3>
                  <p className="text-muted-foreground text-center">{tech.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section id="products" className="py-20 bg-muted/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Produtos em Destaque</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Conheça nossa seleção premium de tintas e texturas
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <Link 
                  key={index}
                  to={category.link}
                  className="bg-card rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group border border-border"
                >
                  <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                  <p className="mb-4 text-muted-foreground">{category.description}</p>
                  <div className="flex items-center text-sm font-semibold text-primary">
                    Ver produtos
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                to="/catalogo" 
                className="inline-flex items-center bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Ver Todo o Catálogo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Calculadora Mágica */}
        <section className="py-20 bg-gradient-to-br from-orange-50 to-blue-50">
          <div className="container mx-auto px-4">
            <CalculadoraMagica />
          </div>
        </section>

        {/* Explore the Color Universe */}
        <section id="universe" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Explore o Universo das Cores</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experimente nossa paleta interativa e encontre a cor perfeita para seu projeto
              </p>
            </div>

            <div className="bg-card rounded-3xl shadow-xl p-8 md:p-12 border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Simulador de Cores Interativo</h3>
                  <p className="text-muted-foreground mb-8">
                    Nossa tecnologia avançada permite que você visualize como diferentes tons se comportam em ambientes virtuais.
                    Explore possibilidades e tome decisões mais confiantes para seu projeto.
                  </p>

                  <div className="mb-8">
                    <h4 className="font-semibold mb-4">Paletas Predefinidas</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Sunset Vibes</span>
                          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                            Selecionar
                          </button>
                        </div>
                        <div className="flex space-x-2">
                          {['#FF6B35', '#FF8C42', '#FFD23F', '#FF6B35', '#FF6B35'].map((color, index) => (
                            <div
                              key={index}
                              className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Ocean Deep</span>
                          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                            Selecionar
                          </button>
                        </div>
                        <div className="flex space-x-2">
                          {['#004E89', '#0066CC', '#4A90E2', '#7BB3F0', '#A8D0F8'].map((color, index) => (
                            <div
                              key={index}
                              className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Natural Earth</span>
                          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                            Selecionar
                          </button>
                        </div>
                        <div className="flex space-x-2">
                          {['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F5DEB3'].map((color, index) => (
                            <div
                              key={index}
                              className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-all duration-300">
                    Explorar Mais Paletas
                  </Button>
                </div>

                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-orange-100 to-blue-100 rounded-2xl shadow-lg flex items-center justify-center overflow-hidden">
                    <div className="w-64 h-64 rounded-full bg-gradient-to-r from-orange-400 via-pink-400 to-blue-500 shadow-xl relative">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-orange-300 to-transparent opacity-50"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-white font-bold text-lg">Visualização</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500 rounded-full opacity-20 animate-ping"></div>
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500 rounded-full opacity-20 animate-ping" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 bg-muted/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">O que Nossos Clientes Dizem</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Histórias reais de transformação com nossos produtos
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-card rounded-2xl shadow-md p-6 md:p-8 relative overflow-hidden border border-border">
                <div className="absolute top-0 right-0 w-32 h-32 bg-muted rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-muted rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10 text-center">
                  <div className="flex justify-center mb-6">
                    <img 
                      src={testimonials[activeTestimonial].avatar} 
                      alt={testimonials[activeTestimonial].name} 
                      className="w-20 h-20 rounded-full border-4 border-primary"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-bold text-xl">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-muted-foreground">{testimonials[activeTestimonial].role}</p>
                  </div>
                  
                  <div className="flex justify-center text-yellow-400 mb-6">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-lg text-foreground mb-8 italic max-w-2xl mx-auto">
                    "{testimonials[activeTestimonial].content}"
                  </p>
                  
                  <div className="flex justify-center space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === activeTestimonial ? 'bg-primary' : 'bg-muted'
                        }`}
                        aria-label={`Ver depoimento ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog & Inspiration */}
        <section id="blog" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Blog & Inspiração</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Dicas, tendências e inspirações para transformar seus espaços
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <div 
                  key={index} 
                  className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 group border border-border hover:-translate-y-1"
                >
                  <div className="h-48 bg-gradient-to-r from-orange-200 to-blue-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                    <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                      {post.date}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex} 
                          className="text-xs bg-muted px-2 py-1 rounded-full animate-pulse"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {post.excerpt}
                    </p>
                    <Link 
                      to="/blog" 
                      className="text-primary font-bold text-sm hover:underline flex items-center"
                    >
                      Ler mais
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                to="/blog" 
                className="inline-flex items-center bg-card text-foreground border border-border px-6 py-3 rounded-full font-bold hover:bg-muted/10 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Ver Todos os Artigos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-primary-foreground/10 rounded-3xl shadow-xl p-8 md:p-12 text-center border border-primary-foreground/20">
              <div className="inline-flex items-center bg-primary-foreground/10 text-primary-foreground px-3 py-1 rounded-full mb-4">
                <Sparkles className="h-5 w-5 mr-2" />
                <span className="font-bold">EXCLUSIVO</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Receba Nossas Novidades</h2>
              <p className="text-xl mb-8 text-primary-foreground/90">
                Inscreva-se para receber ofertas especiais, novos produtos e dicas de decoração
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor email"
                  className="flex-1 px-6 py-4 rounded-full bg-primary-foreground/20 border border-primary-foreground/30 text-primary-foreground placeholder-primary-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary-foreground"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary-foreground text-primary px-8 py-4 rounded-full font-bold hover:bg-primary-foreground/90 transition-all duration-300 border border-primary-foreground whitespace-nowrap shadow-lg"
                >
                  Inscrever-se
                </button>
              </form>
              
              <p className="text-sm text-primary-foreground/70 mt-4">
                Ao se inscrever, você concorda com nossa Política de Privacidade
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="text-2xl font-bold text-primary flex items-center mb-4">
                <Sparkles className="h-6 w-6 mr-2 text-secondary" />
                Prorevest
              </Link>
              <p className="text-muted-foreground mb-4">
                Qualidade e inovação em tintas e texturas para transformar seus ambientes.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <X className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Produtos</h3>
              <ul className="space-y-2">
                <li><Link to="/catalogo?category=interior" className="text-muted-foreground hover:text-primary transition-colors">Tintas para Interior</Link></li>
                <li><Link to="/catalogo?category=exterior" className="text-muted-foreground hover:text-primary transition-colors">Tintas para Exterior</Link></li>
                <li><Link to="/catalogo?category=texturas" className="text-muted-foreground hover:text-primary transition-colors">Texturas</Link></li>
                <li><Link to="/catalogo?category=premium" className="text-muted-foreground hover:text-primary transition-colors">Linha Premium</Link></li>
                <li><Link to="/catalogo" className="text-muted-foreground hover:text-primary transition-colors">Todos os Produtos</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li><Link to="/sobre" className="text-muted-foreground hover:text-primary transition-colors">Sobre Nós</Link></li>
                <li><Link to="/sobre#qualidade" className="text-muted-foreground hover:text-primary transition-colors">Qualidade</Link></li>
                <li><Link to="/sobre#sustentabilidade" className="text-muted-foreground hover:text-primary transition-colors">Sustentabilidade</Link></li>
                <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                <li><Link to="/carreiras" className="text-muted-foreground hover:text-primary transition-colors">Carreiras</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li><Link to="/ajuda" className="text-muted-foreground hover:text-primary transition-colors">Central de Ajuda</Link></li>
                <li><Link to="/contato" className="text-muted-foreground hover:text-primary transition-colors">Contato</Link></li>
                <li><Link to="/lojas" className="text-muted-foreground hover:text-primary transition-colors">Nossas Lojas</Link></li>
                <li><Link to="/entregas" className="text-muted-foreground hover:text-primary transition-colors">Entregas</Link></li>
                <li><Link to="/trocas" className="text-muted-foreground hover:text-primary transition-colors">Trocas e Devoluções</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              &copy; 2023 Prorevest. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/termos" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Termos de Uso
              </Link>
              <Link to="/privacidade" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/cookies" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Scroll Indicator - Right Side */}
      <div className="hidden lg:block fixed right-4 top-1/2 transform -translate-y-1/2 z-30 opacity-70 hover:opacity-100 transition-opacity">
        <div className="relative h-64 w-1 bg-muted rounded-full overflow-hidden">
          <div 
            ref={scrollProgressRef}
            className="absolute bottom-0 left-0 w-full bg-primary rounded-full transition-all duration-300"
            style={{ height: `${scrollProgress}%` }}
          ></div>
        </div>
        
        <div className="absolute top-0 right-4 flex flex-col items-center space-y-6">
          {[
            { id: 'hero', icon: <Home className="h-5 w-5" />, label: 'Início' },
            { id: 'about', icon: <Info className="h-5 w-5" />, label: 'Sobre' },
            { id: 'technology', icon: <Zap className="h-5 w-5" />, label: 'Tecnologia' },
            { id: 'products', icon: <Palette className="h-5 w-5" />, label: 'Produtos' },
            { id: 'universe', icon: <SwatchBook className="h-5 w-5" />, label: 'Inspiração' },
            { id: 'testimonials', icon: <Star className="h-5 w-5" />, label: 'Depoimentos' },
            { id: 'blog', icon: <Grid3X3 className="h-5 w-5" />, label: 'Blog' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`p-1.5 rounded-full transition-all duration-500 ${
                activeSection === item.id 
                  ? 'bg-primary text-primary-foreground shadow-sm scale-105' 
                  : 'bg-card text-muted-foreground hover:bg-muted border border-border'
              }`}
              title={item.label}
            >
              {item.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Floating "Back to Top" Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-primary text-primary-foreground p-3 rounded-full shadow-md hover:bg-primary/90 transition-all duration-500 z-30"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
