import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import {
  Palette,
  Eye,
  Heart,
  Sparkles,
  Wand2,
  Camera,
  Lightbulb,
  TrendingUp,
  Home,
  Bed,
  Utensils,
  Bath,
  TreePine,
  ChevronRight,
  ArrowRight,
  Star,
  Zap,
  Droplets,
  Sun,
  Moon,
  Instagram,
  Facebook,
  Play,
  Maximize2
} from 'lucide-react';

const InspirationPage = () => {
  const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  // Paletas de cores por ambiente
  const colorPalettes = {
    living: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      accent: '#F59E0B',
      gradient: 'from-purple-600 via-pink-500 to-amber-500'
    },
    bedroom: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#EC4899',
      gradient: 'from-indigo-600 via-purple-500 to-pink-500'
    },
    kitchen: {
      primary: '#10B981',
      secondary: '#F59E0B',
      accent: '#EF4444',
      gradient: 'from-emerald-600 via-amber-500 to-red-500'
    },
    bathroom: {
      primary: '#06B6D4',
      secondary: '#3B82F6',
      accent: '#8B5CF6',
      gradient: 'from-cyan-600 via-blue-500 to-purple-500'
    },
    outdoor: {
      primary: '#059669',
      secondary: '#84CC16',
      accent: '#EAB308',
      gradient: 'from-green-700 via-lime-500 to-yellow-500'
    }
  };

  // Dados enriquecidos dos ambientes
  const environments = [
    {
      id: 'living',
      name: 'Sala de Estar',
      icon: <Home className="h-6 w-6" />,
      description: 'O coração da casa onde a sofisticação encontra o aconchego',
      fullDescription: 'Transforme sua sala em um santuário de elegância e conforto. Cores quentes criam atmosfera acolhedora, enquanto tons neutros proporcionam sofisticação atemporal.',
      colors: ['#8B5CF6', '#EC4899', '#F59E0B', '#F97316', '#EF4444'],
      images: [
        'https://images.unsplash.com/photo-1549497538-303791108f95?w=800&q=80',
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'
      ],
      tips: [
        'Use cores terrosas para criar calor e intimidade',
        'Invista em iluminação com diferentes temperaturas',
        'Crie pontos focais com paredes accent'
      ],
      products: ['Tinta Acrílica Premium', 'Textura Sutil', 'Verniz Brilhante']
    },
    {
      id: 'bedroom',
      name: 'Quartos',
      icon: <Bed className="h-6 w-6" />,
      description: 'Refúgio pessoal para descanso e recarregar energias',
      fullDescription: 'Seu quarto deve ser um oásis de tranquilidade. Cores suaves e relaxantes promovem sono reparador, enquanto detalhes vibrantes expressam personalidade.',
      colors: ['#6366F1', '#8B5CF6', '#EC4899', '#F472B6', '#C084FC'],
      images: [
        'https://images.unsplash.com/photo-1618221195710-dd6b41fa9293?w=800&q=80',
        'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'
      ],
      tips: [
        'Azuis e verdes suaves induzem ao relaxamento',
        'Evite cores muito vibrantes nas paredes principais',
        'Crie um contraste sutil com texturas'
      ],
      products: ['Tinta Lavável', 'Cor Mate Suave', 'Teto Texturizado']
    },
    {
      id: 'kitchen',
      name: 'Cozinhas',
      icon: <Utensils className="h-6 w-6" />,
      description: 'Criatividade e funcionalidade em harmonia perfeita',
      fullDescription: 'A cozinha moderna exige cores que estimulem a criatividade e facilitem a limpeza. Tons vibrantes energizam, enquanto neutros elegantes nunca saem de moda.',
      colors: ['#10B981', '#F59E0B', '#EF4444', '#F97316', '#84CC16'],
      images: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
        'https://images.unsplash.com/photo-1586932926433-2b4c1c9266aa?w=800&q=80',
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80'
      ],
      tips: [
        'Cores claras ampliam espaços pequenos',
        'Use cores vibrantes em detalhes e backsplashes',
        'Invista em tintas de fácil limpeza'
      ],
      products: ['Tinta Esmalte Premium', 'Antimicrobiano', 'Alto Tráfego']
    },
    {
      id: 'bathroom',
      name: 'Banheiros',
      icon: <Bath className="h-6 w-6" />,
      description: 'Bem-estar e higiene em um espaço spa',
      fullDescription: 'Transforme seu banheiro em um spa particular. Cores que remetem à água e natureza criam atmosfera purificante e relaxante.',
      colors: ['#06B6D4', '#3B82F6', '#8B5CF6', '#0EA5E9', '#6366F1'],
      images: [
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
        'https://images.unsplash.com/photo-1549637628-3e52f9625a5c?w=800&q=80',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'
      ],
      tips: [
        'Azuis e verdes criam sensação de limpeza',
        'Use espelhos para ampliar o espaço',
        'Invista em iluminação indireta'
      ],
      products: ['Tinta Anti-mofo', 'Impermeabilizante', 'Acabamento Brilhante']
    },
    {
      id: 'outdoor',
      name: 'Áreas Externas',
      icon: <TreePine className="h-6 w-6" />,
      description: 'Lazer e convivência em harmonia com a natureza',
      fullDescription: 'Áreas externas merecem cores que celebram a natureza. Tons terrosos e verdes criam transição perfeita entre interior e exterior.',
      colors: ['#059669', '#84CC16', '#EAB308', '#10B981', '#F59E0B'],
      images: [
        'https://images.unsplash.com/photo-1590325566043-9da8b9863853?w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80'
      ],
      tips: [
        'Use cores que harmonizem com o jardim',
        'Invista em tintas resistentes ao sol',
        'Crie zonas com diferentes cores'
      ],
      products: ['Tinta Externa Premium', 'UV Protect', 'Textura Rústica']
    }
  ];

  // Projetos inspiradores
  const featuredProjects = [
    {
      id: 1,
      title: 'Minimalismo Chic',
      description: 'Sala de estar com paleta monocromática e toques dourados',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
      colors: ['#1F2937', '#F3F4F6', '#D1D5DB', '#F59E0B'],
      likes: 234,
      views: 1520
    },
    {
      id: 2,
      title: 'Tropical Moderno',
      description: 'Quarto com cores vibrantes e elementos naturais',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41fa9293?w=800&q=80',
      colors: ['#059669', '#FCD34D', '#EC4899', '#8B5CF6'],
      likes: 189,
      views: 980
    },
    {
      id: 3,
      title: 'Industrial Elegante',
      description: 'Cozinha com acabamentos metálicos e cores sóbrias',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
      colors: ['#374151', '#6B7280', '#F59E0B', '#EF4444'],
      likes: 312,
      views: 2100
    }
  ];

  // Dicas de cores
  const colorTips = [
    {
      title: 'Psicologia das Cores',
      description: 'Descubra como as cores influenciam seu humor e bem-estar',
      icon: <Lightbulb className="h-8 w-8" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Tendências 2024',
      description: 'As cores que estão dominando a decoração este ano',
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Harmonia Perfeita',
      description: 'Combine cores como um profissional da decoração',
      icon: <Palette className="h-8 w-8" />,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <Layout showHeaderFooter={false}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 text-gray-900 overflow-hidden">
        
        {/* Hero Section Animado */}
        <section className="relative min-h-screen flex items-center justify-center">
          {/* Background com gradiente animado */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-white to-pink-100 animate-pulse"></div>
          
          {/* Overlay com padrão */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
                               radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.2) 0%, transparent 50%),
                               radial-gradient(circle at 40% 20%, rgba(245, 158, 11, 0.2) 0%, transparent 50%)`
            }}></div>
          </div>

          {/* Conteúdo Principal */}
          <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center bg-white/80 backdrop-blur-md rounded-full px-6 py-3 mb-6 border border-purple-200 shadow-lg">
                <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                <span className="text-purple-900 font-semibold">Inspiração sem Limites</span>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 bg-clip-text text-transparent animate-pulse">
              Transforme Seu Espaço
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
              Descubra o poder das cores e crie ambientes que contam sua história. 
              Mais de 200 combinações inspiradoras para transformar cada cômodo em uma obra de arte.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button 
                onClick={() => document.getElementById('environments')?.scrollIntoView({ behavior: 'smooth' })}
                className="group bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 flex items-center justify-center text-white"
              >
                <Wand2 className="mr-2 h-5 w-5" />
                Explorar Ambientes
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group bg-white/80 backdrop-blur-md border border-purple-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-100 transition-all duration-300 flex items-center justify-center text-purple-900 shadow-lg">
                <Camera className="mr-2 h-5 w-5" />
                Ver Projetos
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Stats Animadas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { number: '200+', label: 'Cores Inspiradoras' },
                { number: '50+', label: 'Ambientes Criados' },
                { number: '1000+', label: 'Projetos Realizados' },
                { number: '98%', label: 'Satisfação' }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Elementos decorativos flutuantes */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-purple-300/30 rounded-full blur-xl animate-bounce"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-300/30 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-amber-300/30 rounded-full blur-lg animate-bounce" style={{ animationDelay: '1s' }}></div>
        </section>

        {/* Seção de Ambientes */}
        <section id="environments" className="py-20 px-4 bg-gradient-to-b from-white via-purple-50 to-pink-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 bg-clip-text text-transparent">
                Ambientes Inspiradores
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Cada espaço conta uma história única. Descubra as cores perfeitas para cada ambiente da sua casa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {environments.map((env) => (
                <div
                  key={env.id}
                  className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${colorPalettes[env.id as keyof typeof colorPalettes].gradient} p-1 cursor-pointer transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-300/25`}
                  onClick={() => setSelectedEnvironment(selectedEnvironment === env.id ? null : env.id)}
                >
                  <div className="bg-white rounded-3xl p-6 h-full shadow-lg">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 bg-gradient-to-r ${colorPalettes[env.id as keyof typeof colorPalettes].gradient} rounded-xl text-white`}>
                          {env.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{env.name}</h3>
                          <p className="text-gray-600 text-sm">{env.description}</p>
                        </div>
                      </div>
                      <ChevronRight className={`h-5 w-5 text-gray-600 transition-transform duration-300 ${selectedEnvironment === env.id ? 'rotate-90' : ''}`} />
                    </div>

                    {/* Imagens */}
                    <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                      <img 
                        src={env.images[0]} 
                        alt={env.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white text-sm font-medium line-clamp-2">{env.fullDescription}</p>
                      </div>
                    </div>

                    {/* Paleta de Cores */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex space-x-2">
                        {env.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded-full border-2 border-white/40 hover:scale-125 transition-transform cursor-pointer shadow-md"
                            style={{ backgroundColor: color }}
                            title={color}
                          ></div>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2 text-gray-500">
                        <Heart className="h-4 w-4 hover:text-red-500 transition-colors cursor-pointer" />
                        <Eye className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Conteúdo Expandido */}
                    {selectedEnvironment === env.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2 text-purple-600">Dicas Especiais:</h4>
                            <ul className="space-y-1 text-sm text-gray-700">
                              {env.tips.map((tip, index) => (
                                <li key={index} className="flex items-start">
                                  <Sparkles className="h-3 w-3 mr-2 mt-1 text-purple-500 flex-shrink-0" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2 text-purple-600">Produtos Recomendados:</h4>
                            <div className="flex flex-wrap gap-2">
                              {env.products.map((product, index) => (
                                <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs border border-purple-200">
                                  {product}
                                </span>
                              ))}
                            </div>
                          </div>

                          <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg">
                            Ver Galeria Completa
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projetos em Destaque */}
        <section className="py-20 px-4 bg-gradient-to-b from-pink-50 via-purple-50 to-amber-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 bg-clip-text text-transparent">
                Projetos em Destaque
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Inspire-se em projetos reais que transformaram casas em lares dos sonhos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm border border-purple-200 hover:border-purple-400 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-2xl"
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    {/* Botões de ação */}
                    <div className={`absolute top-4 right-4 flex space-x-2 transition-all duration-300 ${hoveredProject === project.id ? 'opacity-100' : 'opacity-0'}`}>
                      <button className="p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-colors shadow-lg">
                        <Heart className="h-4 w-4 text-gray-700" />
                      </button>
                      <button className="p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-colors shadow-lg">
                        <Maximize2 className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>

                    {/* Play button no centro */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${hoveredProject === project.id ? 'opacity-100' : 'opacity-0'}`}>
                      <button className="p-4 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-all duration-300 hover:scale-110 shadow-xl">
                        <Play className="h-6 w-6 text-purple-600" />
                      </button>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                      <p className="text-gray-200 text-sm mb-3">{project.description}</p>
                      
                      {/* Paleta de cores do projeto */}
                      <div className="flex space-x-2 mb-3">
                        {project.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full border border-white/40 shadow-md"
                            style={{ backgroundColor: color }}
                          ></div>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-gray-200 text-sm">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            <Heart className="h-3 w-3 mr-1" />
                            {project.likes}
                          </span>
                          <span className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {project.views}
                          </span>
                        </div>
                        <button className="text-purple-300 hover:text-purple-200 transition-colors font-medium">
                          Ver Projeto →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dicas de Cores */}
        <section className="py-20 px-4 bg-gradient-to-b from-amber-50 via-white to-purple-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 bg-clip-text text-transparent">
                Universo das Cores
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Domine a arte da combinação de cores e crie ambientes inesquecíveis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {colorTips.map((tip, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl bg-gradient-to-br p-1 hover:scale-105 transition-all duration-500 shadow-lg hover:shadow-2xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${tip.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 h-full">
                    <div className={`inline-flex p-4 bg-gradient-to-r ${tip.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform text-white shadow-lg`}>
                      {tip.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{tip.title}</h3>
                    <p className="text-gray-600 mb-6">{tip.description}</p>
                    <button className={`inline-flex items-center font-semibold hover:underline bg-gradient-to-r ${tip.color} bg-clip-text text-transparent`}>
                      Descobrir Mais
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 px-4 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-md rounded-full px-6 py-3 mb-6 border border-white/30 shadow-lg">
                <Zap className="h-5 w-5 mr-2 text-yellow-300" />
                <span className="text-white font-semibold">Comece Agora</span>
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Sua Transformação Começa Aqui
            </h2>
            
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Junte-se a milhares de pessoas que já transformaram seus espaços com nossas cores e soluções inovadoras.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                to="/simulador"
                className="group bg-white text-purple-900 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/50 flex items-center justify-center"
              >
                <Wand2 className="mr-2 h-5 w-5" />
                Experimentar Simulador
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                to="/catalogo"
                className="group bg-white/20 backdrop-blur-md border border-white/30 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white shadow-lg"
              >
                <Palette className="mr-2 h-5 w-5" />
                Ver Catálogo
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center space-x-6 mt-12">
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </section>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </Layout>
  );
};

export default InspirationPage;
