import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Droplets, 
  Sun, 
  Wind, 
  ShieldCheck,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  Sparkles,
  Home,
  TreePine,
  Zap,
  RefreshCw
} from 'lucide-react';

export default function CuidadosManutencao() {
  const dailyCare = [
    {
      icon: <Droplets className="h-6 w-6 text-blue-600" />,
      title: "Limpeza Diária",
      description: "Mantenha suas paredes sempre bonitas",
      tips: [
        "Use pano úmido com água e sabão neutro",
        "Evite produtos abrasivos ou químicos",
        "Limpe imediatamente qualquer derramamento",
        "Use movimentos suaves e circulares"
      ],
      frequency: "Quando necessário"
    },
    {
      icon: <Wind className="h-6 w-6 text-green-600" />,
      title: "Ventilação",
      description: "Circulação de ar essencial para durabilidade",
      tips: [
        "Mantenha janelas abertas daily",
        "Use exaustores em banheiros e cozinhas",
        "Evite acúmulo de umidade",
        "Promova circulação cruzada de ar"
      ],
      frequency: "Diariamente"
    }
  ];

  const weeklyCare = [
    {
      icon: <Sparkles className="h-6 w-6 text-purple-600" />,
      title: "Limpeza Profunda",
      description: "Manutenção semanal para preservar o acabamento",
      tips: [
        "Verifique acúmulo de poeira em cantos",
        "Limpe áreas de alto tráfego",
        "Verifique sinais de desgaste",
        "Teste resistência em áreas críticas"
      ],
      frequency: "Semanalmente"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-orange-600" />,
      title: "Inspeção",
      description: "Verifique precoce de problemas",
      tips: [
        "Procure por rachaduras ou trincas",
        "Verifique áreas com umidade",
        "Identifique descascamento ou bolhas",
        "Teste aderência da tinta"
      ],
      frequency: "Semanalmente"
    }
  ];

  const monthlyCare = [
    {
      icon: <Home className="h-6 w-6 text-red-600" />,
      title: "Manutenção Geral",
      description: "Cuidados mensais para longevidade",
      tips: [
        "Limpe paredes externas com cuidado",
        "Verifique janelas e esquadrias",
        "Inspecione calhas e rufos",
        "Verifique infiltrações potenciais"
      ],
      frequency: "Mensalmente"
    },
    {
      icon: <TreePine className="h-6 w-6 text-teal-600" />,
      title: "Áreas Externas",
      description: "Cuidados especiais para áreas externas",
      tips: [
        "Remova mofo e musgo imediatamente",
        "Verifique danos por intempéries",
        "Limpe áreas com poluição",
        "Proteja contra sol intenso"
      ],
      frequency: "Mensalmente"
    }
  ];

  const seasonalCare = [
    {
      season: "Verão",
      icon: <Sun className="h-8 w-8 text-yellow-500" />,
      challenges: ["Sol intenso", "Chuvas frequentes", "Umidade alta"],
      actions: [
        "Verifique proteção solar",
        "Limpe áreas molhadas rapidamente",
        "Ventile bem os ambientes",
        "Verifique infiltrações"
      ]
    },
    {
      season: "Inverno",
      icon: <Wind className="h-8 w-8 text-blue-500" />,
      challenges: ["Umidade interna", "Condensação", "Ventilação reduzida"],
      actions: [
        "Controle umidade interna",
        "Use desumidificadores se necessário",
        "Mantenha alguma ventilação",
        "Verifique mofo em cantos"
      ]
    },
    {
      season: "Primavera",
      icon: <TreePine className="h-8 w-8 text-green-500" />,
      challenges: ["Pólen", "Limpeza de primavera", "Renovação"],
      actions: [
        "Limpe pólen das superfícies",
        "Faça limpeza profunda",
        "Verifique necessidade de retoques",
        "Prepare para o verão"
      ]
    },
    {
      season: "Outono",
      icon: <RefreshCw className="h-8 w-8 text-orange-500" />,
      challenges: ["Folhas e detritos", "Preparação para inverno", "Umidade"],
      actions: [
        "Limpe folhas e detritos",
        "Verifique calhas e drenos",
        "Prepare proteção para inverno",
        "Verifique isolamento"
      ]
    }
  ];

  const problemSolving = [
    {
      problem: "Manchas de Gordura",
      solution: "Limpe immediately com detergente neutro e água morna",
      prevention: "Use coifas na cozinha, limpe respingos imediatamente"
    },
    {
      problem: "Marcas de Móveis",
      solution: "Use borracha macia ou produto específico para limpeza",
      prevention: "Use protetores de feltro nos pés dos móveis"
    },
    {
      problem: "Riscos e Arranhões",
      solution: "Tente apagar com borracha ou use tinta de retoque",
      prevention: "Evite arrastar objetos, proteja paredes em áreas de passagem"
    },
    {
      problem: "Acúmulo de Teias de Aranha",
      solution: "Remova com pano seco ou aspirador de pó",
      prevention: "Limpe regularmente cantos e tetos"
    },
    {
      problem: "Manchas de Umidade",
      solution: "Identifique e elimine a fonte, limpe com produto específico",
      prevention: "Mantenha boa ventilação, controle umidade ambiente"
    }
  ];

  const specificAreas = [
    {
      area: "Cozinha",
      icon: <Home className="h-6 w-6 text-orange-600" />,
      challenges: ["Gordura", "Vapor", "Alto tráfego"],
      care: [
        "Limpe respingos imediatamente",
        "Use produtos desengordurantes suaves",
        "Ventile sempre que cozinhar",
        "Limpe áreas próximas ao fogão semanalmente"
      ]
    },
    {
      area: "Banheiro",
      icon: <Droplets className="h-6 w-6 text-blue-600" />,
      challenges: ["Umidade", "Mofo", "Produtos químicos"],
      care: [
        "Mantenha sempre ventilado",
        "Limpe mofo com água sanitária diluída",
        "Use produtos de limpeza suaves",
        "Secue as paredes após banhos quentes"
      ]
    },
    {
      area: "Área de Serviço",
      icon: <Zap className="h-6 w-6 text-purple-600" />,
      challenges: ["Umidade", "Produtos de limpeza", "Desgaste"],
      care: [
        "Proteja paredes de produtos químicos",
        "Limpe derramamentos imediatamente",
        "Verifique infiltrações periodicamente",
        "Use revestimentos resistentes"
      ]
    },
    {
      area: "Sala de Estar",
      icon: <Star className="h-6 w-6 text-yellow-600" />,
      challenges: ["Poeira", "Tráfego", "Luz solar"],
      care: [
        "Poeira regularmente com pano seco",
        "Proteja da luz solar direta intensa",
        "Use protetores em móveis",
        "Limpe manchas imediatamente"
      ]
    }
  ];

  const tools = [
    {
      name: "Panos de Microfibra",
      use: "Limpeza diária e remoção de poeira",
      tip: "Use panos diferentes para seco e úmido"
    },
    {
      name: "Detergente Neutro",
      use: "Limpeza geral de superfícies",
      tip: "Dilua sempre em água para não deixar resíduos"
    },
    {
      name: "Esponja Macia",
      use: "Remoção de sujeira mais persistente",
      tip: "Teste sempre em área pequena primeiro"
    },
    {
      name: "Borracha de Limpeza",
      use: "Remoção de marcas leves",
      tip: "Use em movimentos circulares suaves"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-green-100/30 pointer-events-none"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 pt-20">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-5 w-5 mr-2" />
            <span className="font-bold">CUIDADOS E MANUTENÇÃO</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Mantenha suas <span className="text-green-600">Paredes Sempre Novas</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Com os cuidados corretos, suas paredes mantêm a beleza e durabilidade 
            por muito mais tempo. Aprenda como cuidar de cada ambiente.
          </p>
        </section>

        {/* Daily Care */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Cuidados Diários</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dailyCare.map((care, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mr-4">
                    {care.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{care.title}</h3>
                    <p className="text-gray-600 text-sm">{care.description}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Dicas:</h4>
                  <ul className="space-y-1">
                    {care.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold inline-block">
                  {care.frequency}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Weekly and Monthly Care */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Rotina de Manutenção</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...weeklyCare, ...monthlyCare].map((care, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-purple-600 mb-4">
                  {care.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{care.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{care.description}</p>
                <div className="space-y-2">
                  {care.tips.slice(0, 3).map((tip, idx) => (
                    <div key={idx} className="flex items-start">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                      <span className="text-xs text-gray-600">{tip}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold inline-block">
                  {care.frequency}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Seasonal Care */}
        <section className="mb-16 bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Cuidados por Estação</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {seasonalCare.map((season, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200"
              >
                <div className="text-center mb-4">
                  {season.icon}
                  <h3 className="text-lg font-bold text-gray-900 mt-2">{season.season}</h3>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Desafios:</h4>
                  <div className="flex flex-wrap gap-1">
                    {season.challenges.map((challenge, idx) => (
                      <span key={idx} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                        {challenge}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Ações:</h4>
                  <ul className="space-y-1">
                    {season.actions.slice(0, 2).map((action, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 mr-1.5 flex-shrink-0"></div>
                        <span className="text-xs text-gray-600">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Problem Solving */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Resolução de Problemas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problemSolving.map((problem, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-orange-500 mr-2" />
                  <h3 className="text-lg font-bold text-gray-900">{problem.problem}</h3>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Solução:</h4>
                  <p className="text-sm text-gray-600">{problem.solution}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3">
                  <h4 className="font-semibold text-green-700 mb-1">Prevenção:</h4>
                  <p className="text-sm text-green-600">{problem.prevention}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Specific Areas */}
        <section className="mb-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-8 text-white">
          <h2 className="text-3xl font-bold text-center mb-12">Cuidados por Ambiente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specificAreas.map((area, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-center mb-4">
                  {area.icon}
                  <h3 className="text-lg font-bold mt-2">{area.area}</h3>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Desafios:</h4>
                  <div className="flex flex-wrap gap-1">
                    {area.challenges.map((challenge, idx) => (
                      <span key={idx} className="bg-white/20 text-xs px-2 py-1 rounded-full">
                        {challenge}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Cuidados:</h4>
                  <ul className="space-y-1">
                    {area.care.slice(0, 2).map((care, idx) => (
                      <li key={idx} className="text-xs flex items-start">
                        <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 mr-1.5 flex-shrink-0"></div>
                        {care}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tools */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Ferramentas Essenciais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{tool.use}</p>
                <div className="bg-yellow-50 rounded-lg p-3">
                  <h4 className="font-semibold text-yellow-700 mb-1">Dica:</h4>
                  <p className="text-xs text-yellow-600">{tool.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Precisa de Ajuda?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Se suas paredes precisarem de retoques ou reparos maiores, 
            nossa equipe está pronta para ajudar com produtos e orientações.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/catalogo" 
              className="bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Ver Produtos
            </Link>
            <Link 
              to="/contato" 
              className="bg-white border-2 border-green-600 text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-all duration-300 flex items-center justify-center"
            >
              <ShieldCheck className="mr-2 h-5 w-5" />
              Falar com Especialista
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
