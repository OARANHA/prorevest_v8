import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Paintbrush, 
  SprayCan, 
  Brush,
  Droplets,
  Clock,
  Thermometer,
  Wind,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Timer,
  Gauge,
  Circle
} from 'lucide-react';

export default function TecnicasAplicacao() {
  const applicationMethods = [
    {
      icon: <Brush className="h-8 w-8 text-blue-600" />,
      title: "Pincel",
      description: "Ideal para detalhes, cantos e superfícies pequenas.",
      bestFor: ["Detalhes", "Bordas", "Reparos", "Superfícies pequenas"],
      tips: [
        "Use pincéis de cerdas naturais para tintas à base de água",
        "Mantenha o pincel úmido durante o trabalho",
        "Aplique com movimentos uniformes e consistentes"
      ],
      coverage: "8-12 m²/L por demão"
    },
    {
      icon: <Circle className="h-8 w-8 text-green-600" />,
      title: "Rolo",
      description: "Perfeito para grandes superfícies planas.",
      bestFor: ["Paredes", "Tetos", "Superfícies grandes", "Acabamento uniforme"],
      tips: [
        "Escolha o nap correto para cada tipo de superfície",
        "Carregue o rolo uniformemente, sem excesso",
        "Aplique em padrão 'W' para melhor cobertura"
      ],
      coverage: "10-15 m²/L por demão"
    },
    {
      icon: <SprayCan className="h-8 w-8 text-purple-600" />,
      title: "Pistola",
      description: "Máxima eficiência para grandes áreas e projetos industriais.",
      bestFor: ["Grandes áreas", "Superfícies irregulares", "Projetos industriais", "Acabamento profissional"],
      tips: [
        "Mantenha a distância recomendada (20-30 cm)",
        "Aplique em camadas finas e sobrepostas",
        "Use equipamento de proteção adequado"
      ],
      coverage: "15-25 m²/L por demão"
    },
    {
      icon: <Paintbrush className="h-8 w-8 text-orange-600" />,
      title: "Trincha",
      description: "Controle preciso para acabamentos especiais.",
      bestFor: ["Texturas", "Efeitos decorativos", "Trabalhos finos", "Acabamentos artísticos"],
      tips: [
        "Use para criar efeitos texturizados",
        "Varie a pressão para diferentes efeitos",
        "Limpe imediatamente após o uso"
      ],
      coverage: "6-10 m²/L por demão"
    }
  ];

  const surfacePreparation = [
    {
      title: "Limpeza",
      description: "Remova poeira, gordura e contaminantes",
      steps: [
        "Lave com detergente neutro",
        "Enxágue completamente",
        "Deixe secar totalmente",
        "Remova mofo e bolor"
      ]
    },
    {
      title: "Reparos",
      description: "Corrija imperfeições antes de pintar",
      steps: [
        "Raspe áreas soltas ou descascadas",
        "Preencha trincas e buracos",
        "Lixe as áreas reparadas",
        "Remova o pó excessivo"
      ]
    },
    {
      title: "Proteção",
      description: "Proteja áreas que não serão pintadas",
      steps: [
        "Cubra móveis e pisos",
        "Use fita crepe em bordas",
        "Proteja tomadas e interruptores",
        "Remova ou proteja maçanetas"
      ]
    },
    {
      title: "Primer",
      description: "Aplique o fundo preparador adequado",
      steps: [
        "Escolha o primer correto para a superfície",
        "Aplique uma demão uniforme",
        "Respeite o tempo de secagem",
        "Lixe levemente antes da tinta"
      ]
    }
  ];

  const environmentalConditions = [
    {
      icon: <Thermometer className="h-6 w-6 text-red-500" />,
      title: "Temperatura",
      ideal: "15°C - 30°C",
      problems: {
        tooLow: "Secagem lenta, formação de bolhas",
        tooHigh: "Secagem rápida, dificuldade de aplicação"
      }
    },
    {
      icon: <Droplets className="h-6 w-6 text-blue-500" />,
      title: "Umidade",
      ideal: "40% - 70%",
      problems: {
        low: "Secagem muito rápida",
        high: "Dificulta secagem, pode causar mofo"
      }
    },
    {
      icon: <Wind className="h-6 w-6 text-gray-500" />,
      title: "Ventilação",
      ideal: "Circulação moderada",
      problems: {
        low: "Acúmulo de vapores, secagem lenta",
        high: "Secagem rápida, poeira na superfície"
      }
    }
  ];

  const commonProblems = [
    {
      problem: "Escorrimento",
      causes: ["Excesso de tinta", "Aplicação muito rápida", "Temperatura inadequada"],
      solution: "Use menos tinta, aplique mais devagar, verifique a temperatura"
    },
    {
      problem: "Marcas de pincel/rolo",
      causes: ["Tinta muito espessa", "Aplicação irregular", "Secagem rápida"],
      solution: "Dilua corretamente, mantenha o ritmo de aplicação"
    },
    {
      problem: "Bolhas e bolotas",
      causes: ["Umidade na superfície", "Aplicação em sol forte", "Contaminação"],
      solution: "Espere secar bem, evite sol direto, limpe bem a superfície"
    },
    {
      problem: "Falta de cobertura",
      causes: ["Superfície muito porosa", "Cor inadequada", "Poucas demãos"],
      solution: "Use primer, aplique mais demãos, escolha cor adequada"
    }
  ];

  const dryingTimes = [
    {
      product: "Tinta Acrílica",
      toque: "1-2 horas",
      manuseio: "4-6 horas",
      total: "24 horas",
      recoat: "4 horas"
    },
    {
      product: "Esmalte Sintético",
      toque: "6-8 horas",
      manuseio: "12-24 horas",
      total: "72 horas",
      recoat: "12 horas"
    },
    {
      product: "Tinta Texturizada",
      toque: "2-4 horas",
      manuseio: "8-12 horas",
      total: "48 horas",
      recoat: "6 horas"
    },
    {
      product: "Verniz",
      toque: "30 minutos - 1 hora",
      manuseio: "4-6 horas",
      total: "24 horas",
      recoat: "2 horas"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 pointer-events-none"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 pt-20">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
            <Paintbrush className="h-5 w-5 mr-2" />
            <span className="font-bold">TÉCNICAS DE APLICAÇÃO</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Aplique como um <span className="text-blue-600">Profissional</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Domine as melhores técnicas para obter acabamentos perfeitos 
            e duradouros com nossos produtos.
          </p>
        </section>

        {/* Application Methods */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Métodos de Aplicação</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {applicationMethods.map((method, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {method.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{method.title}</h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Ideal para:</h4>
                  <div className="flex flex-wrap gap-1">
                    {method.bestFor.map((item, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Dicas:</h4>
                  <ul className="space-y-1">
                    {method.tips.slice(0, 2).map((tip, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-2 text-center">
                  <span className="text-sm font-semibold text-gray-700">
                    {method.coverage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Surface Preparation */}
        <section className="mb-16 bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Preparação de Superfície</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {surfacePreparation.map((step, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{step.description}</p>
                <ul className="space-y-2">
                  {step.steps.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Environmental Conditions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Condições Ambientais</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {environmentalConditions.map((condition: any, index: number) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {condition.icon}
                  <h3 className="text-xl font-bold text-gray-900 ml-3">{condition.title}</h3>
                </div>
                
                <div className="mb-4">
                  <div className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-center font-semibold">
                    Ideal: {condition.ideal}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center mb-1">
                      <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-sm font-semibold text-red-700">Problemas:</span>
                    </div>
                    <p className="text-xs text-red-600">{condition.problems.tooLow}</p>
                    <p className="text-xs text-red-600">{condition.problems.tooHigh}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Common Problems */}
        <section className="mb-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
          <h2 className="text-3xl font-bold text-center mb-12">Problemas Comuns e Soluções</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commonProblems.map((problem, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-3">{problem.problem}</h3>
                
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-yellow-300">Causas:</h4>
                  <ul className="space-y-1">
                    {problem.causes.map((cause, idx) => (
                      <li key={idx} className="text-sm flex items-start">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-green-300">Solução:</h4>
                  <p className="text-sm">{problem.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Drying Times */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Tempos de Secagem</h2>
          <div className="bg-white rounded-3xl p-8 shadow-lg overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Produto</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">
                    <div className="flex items-center justify-center">
                      <Timer className="h-4 w-4 mr-2" />
                      Toque
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Manuseio</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Total</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Reaplicação</th>
                </tr>
              </thead>
              <tbody>
                {dryingTimes.map((product, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{product.product}</td>
                    <td className="text-center py-3 px-4 text-gray-600">{product.toque}</td>
                    <td className="text-center py-3 px-4 text-gray-600">{product.manuseio}</td>
                    <td className="text-center py-3 px-4 text-gray-600">{product.total}</td>
                    <td className="text-center py-3 px-4 text-gray-600">{product.recoat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Precisa de Ajuda?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Nossa equipe está pronta para ajudar você a escolher os produtos 
            e técnicas ideais para seu projeto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/catalogo" 
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <Paintbrush className="mr-2 h-5 w-5" />
              Ver Produtos
            </Link>
            <Link 
              to="/contato" 
              className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center"
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
