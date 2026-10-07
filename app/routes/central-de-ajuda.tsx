import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  Search, 
  Book, 
  Phone,
  Mail,
  MessageSquare,
  Video,
  Download,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Headphones,
  Globe,
  ShieldCheck,
  ChevronRight,
  Zap,
  Target
} from 'lucide-react';

export default function CentralAjuda() {
  const helpCategories = [
    {
      icon: <Book className="h-8 w-8 text-blue-600" />,
      title: "Guias e Tutoriais",
      description: "Aprenda com nossos guias completos",
      items: [
        "Como escolher a tinta certa",
        "Preparação de superfícies",
        "Técnicas de aplicação",
        "Cuidados e manutenção"
      ],
      link: "/tecnicas-de-aplicacao"
    },
    {
      icon: <Video className="h-8 w-8 text-purple-600" />,
      title: "Vídeos Demonstrativos",
      description: "Aprenda visualmente passo a passo",
      items: [
        "Aplicação com rolo",
        "Técnicas de pintura",
        "Preparação de paredes",
        "Limpeza e manutenção"
      ],
      link: "#videos"
    },
    {
      icon: <FileText className="h-8 w-8 text-green-600" />,
      title: "Documentação",
      description: "Fichas técnicas e manuais",
      items: [
        "Fichas técnicas",
        "Folhas de segurança",
        "Manual de instruções",
        "Certificados"
      ],
      link: "#documentos"
    },
    {
      icon: <Download className="h-8 w-8 text-orange-600" />,
      title: "Downloads",
      description: "Materiais para baixar",
      items: [
        "Catálogos de produtos",
        "Software de cores",
        "Aplicativo móvel",
        "Cartelas de cores"
      ],
      link: "#downloads"
    }
  ];

  const frequentlyAsked = [
    {
      question: "Qual tinta usar em parede úmida?",
      answer: "Para paredes úmidas recomendamos primeiro identificar e eliminar a fonte da umidade, depois usar tinta impermeabilizante ou acrílica com proteção contra mofo.",
      category: "Produtos",
      related: ["preparacao-de-superficies", "cuidados-e-manutencao"]
    },
    {
      question: "Quantas demãos de tinta são necessárias?",
      answer: "Geralmente são necessárias 2-3 demãos. A quantidade exata depende da cor da base, cor da tinta e preparação da superfície.",
      category: "Aplicação",
      related: ["tecnicas-de-aplicacao", "preparacao-de-superficies"]
    },
    {
      question: "Como limpar manchas de gordura?",
      answer: "Use detergente neutro diluído em água morna. Para manchas persistentes, use produto desengordurante específico e teste em área pequena primeiro.",
      category: "Manutenção",
      related: ["cuidados-e-manutencao"]
    },
    {
      question: "Qual o tempo de secagem da tinta?",
      answer: "Tinta acrílica: 2-4 horas ao toque, 24 horas total. Esmalte sintético: 6-8 horas ao toque, 72 horas total. Sempre verifique as instruções do produto.",
      category: "Aplicação",
      related: ["tecnicas-de-aplicacao"]
    },
    {
      question: "Como evitar mofo nas paredes?",
      answer: "Mantenha boa ventilação, controle umidade, use tintas com proteção anti-mofo e limpe imediatamente qualquer infiltração.",
      category: "Prevenção",
      related: ["cuidados-e-manutencao", "preparacao-de-superficies"]
    },
    {
      question: "Posso pintar sobre tinta à óleo?",
      answer: "Sim, mas é necessário aplicar primer específico para tinta à óleo antes da pintura com tinta acrílica.",
      category: "Preparação",
      related: ["preparacao-de-superficies"]
    }
  ];

  const contactMethods = [
    {
      icon: <Phone className="h-8 w-8 text-green-600" />,
      title: "Telefone",
      description: "Fale diretamente com nossos especialistas",
      contact: "(11) 4000-0000",
      hours: "Seg a Sex, 8h-18h",
      responseTime: "Imediato"
    },
    {
      icon: <Mail className="h-8 w-8 text-blue-600" />,
      title: "E-mail",
      description: "Envie sua dúvida e receba resposta detalhada",
      contact: "ajuda@prorevest.com.br",
      hours: "24/7",
      responseTime: "Até 24h"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-purple-600" />,
      title: "Chat Online",
      description: "Converse em tempo real com nossa equipe",
      contact: "Chat no site",
      hours: "Seg a Sex, 8h-18h",
      responseTime: "Imediato"
    },
    {
      icon: <Headphones className="h-8 w-8 text-orange-600" />,
      title: "WhatsApp",
      description: "Suporte rápido pelo WhatsApp",
      contact: "(11) 94000-0000",
      hours: "Seg a Sáb, 8h-20h",
      responseTime: "Até 2h"
    }
  ];

  const quickGuides = [
    {
      title: "Guia Rápido: Escolha de Tintas",
      duration: "5 min leitura",
      difficulty: "Iniciante",
      content: [
        "Identifique o tipo de superfície",
        "Considere o ambiente (interno/externo)",
        "Escolha o acabamento desejado",
        "Calcule a quantidade necessária"
      ],
      link: "#guia-cores"
    },
    {
      title: "Guia Rápido: Preparação de Paredes",
      duration: "10 min leitura",
      difficulty: "Iniciante",
      content: [
        "Limpeza da superfície",
        "Remoção de tinta antiga",
        "Reparo de imperfeições",
        "Aplicação do selador"
      ],
      link: "/preparacao-de-superficies"
    },
    {
      title: "Guia Rápido: Calculadora de Tintas",
      duration: "3 min uso",
      difficulty: "Iniciante",
      content: [
        "Meça as paredes",
        "Subtraia áreas de portas/janelas",
        "Multiplique pelo número de demãos",
        "Adicione 10% de segurança"
      ],
      link: "#calculadora"
    },
    {
      title: "Guia Rápido: Solução de Problemas",
      duration: "7 min leitura",
      difficulty: "Intermediário",
      content: [
        "Identifique o problema",
        "Verifique as causas possíveis",
        "Aplique a solução recomendada",
        "Previna futuros problemas"
      ],
      link: "#problemas"
    }
  ];

  const resources = [
    {
      category: "Calculadoras",
      items: [
        { name: "Calculadora de Tintas", description: "Calcule a quantidade necessária" },
        { name: "Calculadora de Custos", description: "Orçamento para seu projeto" },
        { name: "Calculadora de Rendimento", description: "Rendimento por produto" }
      ]
    },
    {
      category: "Ferramentas",
      items: [
        { name: "Simulador de Cores", description: "Teste cores virtualmente" },
        { name: "Visualizador de Ambientes", description: "Veja como fica seu espaço" },
        { name: "Gerador de Paletas", description: "Crie combinações harmônicas" }
      ]
    },
    {
      category: "Downloads",
      items: [
        { name: "Catálogo de Produtos", description: "PDF completo com todos produtos" },
        { name: "Aplicativo Móvel", description: "App para iOS e Android" },
        { name: "Plugin para Designers", description: "Plugin para softwares de design" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 pointer-events-none"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 pt-20">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
            <HelpCircle className="h-5 w-5 mr-2" />
            <span className="font-bold">CENTRAL DE AJUDA</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Estamos aqui para <span className="text-blue-600">Ajudar</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Encontre respostas rápidas, guias completos e suporte especializado 
            para todas as suas dúvidas sobre produtos e aplicações.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              <input
                type="text"
                placeholder="Digite sua dúvida ou palavra-chave..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Buscar
              </button>
            </div>
          </div>
        </section>

        {/* Help Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Como Podemos Ajudar?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {helpCategories.map((category, index) => (
              <Link 
                key={index} 
                to={category.link}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group block"
              >
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <ChevronRight className="h-4 w-4 text-blue-600 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-blue-600 font-semibold text-sm group-hover:text-blue-700">
                  Acessar →
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Guides */}
        <section className="mb-16 bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Guias Rápidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickGuides.map((guide, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <Target className="h-6 w-6 text-blue-600" />
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                    {guide.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{guide.title}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  {guide.duration}
                </div>
                <ul className="space-y-1 mb-4">
                  {guide.content.slice(0, 2).map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link 
                  to={guide.link}
                  className="text-blue-600 font-semibold text-sm hover:text-blue-700"
                >
                  Ler guia →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Perguntas Frequentes</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {frequentlyAsked.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start mb-3">
                  <HelpCircle className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600 mb-3">{faq.answer}</p>
                    <div className="flex items-center justify-between">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {faq.category}
                      </span>
                      <div className="flex gap-2">
                        {faq.related.map((item, idx) => (
                          <Link
                            key={idx}
                            to={`/${item}`}
                            className="text-blue-600 text-sm hover:text-blue-700"
                          >
                            Ver mais →
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Methods */}
        <section className="mb-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
          <h2 className="text-3xl font-bold text-center mb-12">Entre em Contato</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-center mb-4">
                  {method.icon}
                  <h3 className="text-lg font-bold mt-2">{method.title}</h3>
                </div>
                <p className="text-white/80 text-sm mb-4 text-center">{method.description}</p>
                <div className="text-center mb-2">
                  <div className="font-bold">{method.contact}</div>
                </div>
                <div className="text-center text-sm text-white/70 mb-2">
                  {method.hours}
                </div>
                <div className="text-center">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs">
                    {method.responseTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resources */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Recursos e Ferramentas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{resource.category}</h3>
                <div className="space-y-4">
                  {resource.items.map((item, idx) => (
                    <div key={idx} className="flex items-start">
                      <Zap className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Still Need Help */}
        <section className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ainda Precisa de Ajuda?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Nossa equipe de especialistas está pronta para ajudar você a encontrar 
            a solução perfeita para seu projeto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contato" 
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Falar com Especialista
            </Link>
            <Link 
              to="/catalogo" 
              className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center"
            >
              <Book className="mr-2 h-5 w-5" />
              Ver Catálogo
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
