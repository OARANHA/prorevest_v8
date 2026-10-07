import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brush, 
  Droplets, 
  Hammer, 
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  Wrench,
  Scissors,
  Package,
  ChevronRight,
  Zap
} from 'lucide-react';

export default function PreparacaoSuperficies() {
  const surfaceTypes = [
    {
      icon: <Hammer className="h-8 w-8 text-gray-600" />,
      title: "Parede de Concreto",
      description: "Preparação para superfícies de concreto novo ou antigo",
      steps: [
        "Limpeza com água e sabão neutro",
        "Remoção de partes soltas ou deterioradas",
        "Aplicação de selador adequado",
        "Aguarde 24h antes de pintar"
      ],
      products: ["Selador Acrílico", "Fundo Preparador", "Massa Corrida"],
      dryingTime: "24 horas"
    },
    {
      icon: <Brush className="h-8 w-8 text-orange-600" />,
      title: "Parede Pintada",
      description: "Repintura em superfícies já pintadas",
      steps: [
        "Lixe áreas soltas ou descascadas",
        "Lave com detergente neutro",
        "Remova poeira completamente",
        "Aplique primer se necessário"
      ],
      products: ["Detergente Neutro", "Lixa 180-220", "Primer de Fixação"],
      dryingTime: "6-12 horas"
    },
    {
      icon: <Droplets className="h-8 w-8 text-blue-600" />,
      title: "Superfície Úmida",
      description: "Tratamento para áreas com umidade ou infiltração",
      steps: [
        "Identifique e elimine a fonte da umidade",
        "Aguarde secagem completa (mínimo 7 dias)",
        "Aplique produto anti-mofo",
        "Use tinta impermeabilizante"
      ],
      products: ["Anti-Mofo", "Impermeabilizante", "Selador"],
      dryingTime: "7-14 dias"
    },
    {
      icon: <Wrench className="h-8 w-8 text-purple-600" />,
      title: "Madeira ou Metal",
      description: "Preparação para superfícies de madeira ou metal",
      steps: [
        "Lixe completamente a superfície",
        "Remova resíduos e poeira",
        "Aplique primer específico",
        "Proteja contra ferrugem (metal)"
      ],
      products: ["Lixa 120-180", "Primer Multiuso", "Conversor de Ferrugem"],
      dryingTime: "4-8 horas"
    }
  ];

  const commonProblems = [
    {
      problem: "Mofo e Bolor",
      causes: ["Umidade excessiva", "Ventilação inadequada", "Infiltrações"],
      solution: "Limpe com água sanitária, aplique anti-mofo e melhore a ventilação",
      prevention: "Mantenha boa ventilação, use produtos com proteção contra mofo"
    },
    {
      problem: "Tinta Descascando",
      causes: ["Superfície suja ou oleosa", "Umidade na parede", "Tinta antiga ruim"],
      solution: "Raspe completamente, limpe bem, aplique selador antes de repintar",
      prevention: "Faça preparação adequada, use produtos de qualidade"
    },
    {
      problem: "Manchas na Parede",
      causes: ["Gordura", "Nicol", "Fumaça", "Umidade"],
      solution: "Limpe com produto específico, aplique selador bloqueador",
      prevention: "Limpe manchas imediatamente, use selador adequado"
    },
    {
      problem: "Superfície Arenosa",
      causes: ["Reboco mal curado", "Poeira não removida", "Qualidade do reboco"],
      solution: "Raspe áreas soltas, aplique fundo preparador, lixe se necessário",
      prevention: "Aguarde cura completa do reboco, faça limpeza adequada"
    }
  ];

  const toolsMaterials = [
    {
      category: "Ferramentas Essenciais",
      items: [
        { name: "Espátula", use: "Aplicação de massas e remoção de tinta velha" },
        { name: "Lixas", use: "Nivelamento e preparação da superfície" },
        { name: "Trincha", use: "Detalhes e cantos difíceis" },
        { name: "Rolo", use: "Grandes áreas e aplicação uniforme" }
      ]
    },
    {
      category: "Produtos de Limpeza",
      items: [
        { name: "Detergente Neutro", use: "Limpeza geral de superfícies" },
        { name: "Água Sanitária", use: "Remoção de mofo e bolor" },
        { name: "Álcool", use: "Remoção de gordura e óleo" },
        { name: "Removedor", use: "Tinta velha e difíceis" }
      ]
    },
    {
      category: "Equipamentos de Proteção",
      items: [
        { name: "Luvas", use: "Proteção das mãos" },
        { name: "Óculos", use: "Proteção ocular" },
        { name: "Máscara", use: "Proteção respiratória" },
        { name: "Roupas adequadas", use: "Proteção do corpo" }
      ]
    }
  ];

  const stepByStep = [
    {
      step: 1,
      title: "Inspeção Inicial",
      description: "Avalie o estado atual da superfície",
      icon: <Star className="h-6 w-6" />,
      details: [
        "Verifique rachaduras e trincas",
        "Identifique áreas com umidade",
        "Teste a aderência da tinta existente",
        "Verifique presença de mofo ou bolor"
      ]
    },
    {
      step: 2,
      title: "Limpeza Profunda",
      description: "Remova toda sujeira e contaminantes",
      icon: <Droplets className="h-6 w-6" />,
      details: [
        "Lave com detergente neutro",
        "Remova gordura e óleo",
        "Elimine mofo e bolor",
        "Enxágue completamente"
      ]
    },
    {
      step: 3,
      title: "Reparos Necessários",
      description: "Corrija imperfeições e danos",
      icon: <Hammer className="h-6 w-6" />,
      details: [
        "Raspe tinta solta ou descascada",
        "Preencha trincas e buracos",
        "Lixe áreas irregulares",
        "Remova poeira excessiva"
      ]
    },
    {
      step: 4,
      title: "Proteção e Selagem",
      description: "Proteja áreas e aplique selador",
      icon: <ShieldCheck className="h-6 w-6" />,
      details: [
        "Proteja móveis e pisos",
        "Use fita crepe em bordas",
        "Aplique selador adequado",
        "Aguarde tempo de secagem"
      ]
    },
    {
      step: 5,
      title: "Verificação Final",
      description: "Confirme que está pronto para pintar",
      icon: <CheckCircle className="h-6 w-6" />,
      details: [
        "Verifique se está completamente seco",
        "Teste a aderência do selador",
        "Remova poeira residual",
        "Confirme condições ambientais"
      ]
    }
  ];

  const tips = [
    {
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      title: "Respeite os Tempos",
      description: "Nunca apresse a secagem. Cada produto tem seu tempo ideal."
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-600" />,
      title: "Condições Ideais",
      description: "Evite aplicar em dias muito úmidos, chuvosos ou com sol forte."
    },
    {
      icon: <Package className="h-6 w-6 text-green-600" />,
      title: "Qualidade dos Produtos",
      description: "Invista em produtos de qualidade para garantir durabilidade."
    },
    {
      icon: <Scissors className="h-6 w-6 text-purple-600" />,
      title: "Ferramentas Adequadas",
      description: "Use ferramentas limpas e adequadas para cada tipo de superfície."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-orange-100/30 pointer-events-none"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 pt-20">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <div className="inline-flex items-center bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-6">
            <Hammer className="h-5 w-5 mr-2" />
            <span className="font-bold">PREPARAÇÃO DE SUPERFÍCIES</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            A Base para um <span className="text-orange-600">Acabamento Perfeito</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Uma preparação adequada é 50% do sucesso da pintura. 
            Aprenda o passo a passo para cada tipo de superfície.
          </p>
        </section>

        {/* Surface Types */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Tipos de Superfície</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {surfaceTypes.map((surface, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mr-4">
                    {surface.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{surface.title}</h3>
                    <p className="text-gray-600 text-sm">{surface.description}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Passos:</h4>
                  <ol className="space-y-1">
                    {surface.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="bg-orange-100 text-orange-700 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-gray-600">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Produtos:</h4>
                    <div className="flex flex-wrap gap-1">
                      {surface.products.map((product, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Secagem:</h4>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-center font-semibold text-sm">
                      {surface.dryingTime}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Step by Step */}
        <section className="mb-16 bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Passo a Passo Detalhado</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {stepByStep.map((step, index) => (
              <div 
                key={index} 
                className="relative bg-gradient-to-br from-orange-50 to-blue-50 rounded-xl p-6 border border-orange-200"
              >
                {index < stepByStep.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-orange-300 transform -translate-y-1/2"></div>
                )}
                
                <div className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center mb-3 font-bold">
                  {step.step}
                </div>
                
                <div className="text-orange-600 mb-3">
                  {step.icon}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                
                <ul className="space-y-1">
                  {step.details.slice(0, 2).map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 mr-1.5 flex-shrink-0"></div>
                      <span className="text-xs text-gray-600">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Common Problems */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Problemas Comuns e Soluções</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commonProblems.map((problem, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
                  <h3 className="text-lg font-bold text-gray-900">{problem.problem}</h3>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Causas:</h4>
                  <div className="flex flex-wrap gap-1">
                    {problem.causes.map((cause, idx) => (
                      <span key={idx} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                        {cause}
                      </span>
                    ))}
                  </div>
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

        {/* Tools and Materials */}
        <section className="mb-16 bg-gradient-to-r from-orange-600 to-blue-600 rounded-3xl p-8 text-white">
          <h2 className="text-3xl font-bold text-center mb-12">Ferramentas e Materiais</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {toolsMaterials.map((category, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-4">{category.category}</h3>
                <div className="space-y-3">
                  {category.items.map((item, idx) => (
                    <div key={idx} className="bg-white/10 rounded-lg p-3">
                      <h4 className="font-semibold mb-1">{item.name}</h4>
                      <p className="text-sm text-white/80">{item.use}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Dicas Especiais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tips.map((tip, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-orange-600 mb-4">
                  {tip.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-600 text-sm">{tip.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Pronto para Começar?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Com a preparação correta, sua pintura terá durabilidade e acabamento profissional.
            Confira nossos produtos específicos para cada etapa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/catalogo" 
              className="bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <Package className="mr-2 h-5 w-5" />
              Ver Produtos
            </Link>
            <Link 
              to="/tecnicas-de-aplicacao" 
              className="bg-white border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-50 transition-all duration-300 flex items-center justify-center"
            >
              <Brush className="mr-2 h-5 w-5" />
              Técnicas de Aplicação
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
