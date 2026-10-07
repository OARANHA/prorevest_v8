import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Award, 
  FileText, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  Wrench,
  Star,
  ChevronRight,
  Package,
  Truck
} from 'lucide-react';

export default function Garantia() {
  const warrantyTypes = [
    {
      icon: <ShieldCheck className="h-8 w-8 text-blue-600" />,
      title: "Garantia de Qualidade",
      duration: "5 anos",
      description: "Cobertura total contra defeitos de fabricação",
      coverage: [
        "Descascamento e esfarelamento",
        "Mudança de cor prematura",
        "Defeitos de aplicação do produto",
        "Problemas de aderência"
      ]
    },
    {
      icon: <Award className="h-8 w-8 text-green-600" />,
      title: "Garantia de Desempenho",
      duration: "3 anos",
      description: "Proteção contra problemas de desempenho",
      coverage: [
        "Resistência à umidade",
        "Durabilidade da cor",
        "Resistência a UV",
        "Performance em condições normais"
      ]
    },
    {
      icon: <Package className="h-8 w-8 text-purple-600" />,
      title: "Garantia de Satisfação",
      duration: "90 dias",
      description: "Satisfação garantida ou substituição",
      coverage: [
        "Cor não corresponde ao esperado",
        "Acabamento não satisfatório",
        "Problemas de textura",
        "Qualidade visual inferior"
      ]
    }
  ];

  const coverageDetails = [
    {
      category: "Tintas Acrílicas",
      warranty: "5 anos",
      coverage: "Total contra defeitos",
      exclusions: ["Aplicação incorreta", "Infiltrações", "Danos mecânicos"]
    },
    {
      category: "Esmaltes Sintéticos",
      warranty: "4 anos",
      coverage: "Defeitos de fabricação",
      exclusions: ["Desgaste natural", "Exposição química", "Uso inadequado"]
    },
    {
      category: "Tintas Texturizadas",
      warranty: "3 anos",
      coverage: "Aderência e durabilidade",
      exclusions: ["Danos estruturais", "Umidade excessiva", "Aplicação inadequada"]
    },
    {
      category: "Vernizes e Acabamentos",
      warranty: "2 anos",
      coverage: "Qualidade do acabamento",
      exclusions: ["Desgaste por uso", "Exposição solar extrema", "Produtos químicos"]
    }
  ];

  const claimProcess = [
    {
      step: 1,
      title: "Identifique o Problema",
      description: "Documente o problema com fotos detalhadas",
      icon: <FileText className="h-6 w-6" />,
      tips: [
        "Fotografie de múltiplos ângulos",
        "Inclua objetos para escala",
        "Anote data e condições",
        "Guarde nota fiscal e embalagem"
      ]
    },
    {
      step: 2,
      title: "Entre em Contato",
      description: "Abra um chamado através dos nossos canais",
      icon: <Phone className="h-6 w-6" />,
      tips: [
        "Tenha em mãos número do lote",
        "Descreva o problema detalhadamente",
        "Envie as fotos documentadas",
        "Mantenha os produtos originais"
      ]
    },
    {
      step: 3,
      title: "Análise Técnica",
      description: "Nossa equipe fará uma análise especializada",
      icon: <Users className="h-6 w-6" />,
      tips: [
        "Agendamos visita técnica",
        "Análise das condições de aplicação",
        "Verificação do lote do produto",
        "Laudo técnico detalhado"
      ]
    },
    {
      step: 4,
      title: "Resolução",
      description: "Oferecemos a solução adequada para seu caso",
      icon: <Wrench className="h-6 w-6" />,
      tips: [
        "Substituição dos produtos",
        "Reembolso integral",
        "Assistência técnica gratuita",
        "Orientação para nova aplicação"
      ]
    }
  ];

  const excludedSituations = [
    {
      title: "Aplicação Incorreta",
      items: [
        "Preparação inadequada da superfície",
        "Uso de ferramentas inadequadas",
        "Não seguir instruções do produto",
        "Aplicação em condições climáticas impróprias"
      ]
    },
    {
      title: "Problemas Estruturais",
      items: [
        "Infiltrações e vazamentos",
        "Umidade persistente nas paredes",
        "Trincas e movimentação da estrutura",
        "Problemas de impermeabilização"
      ]
    },
    {
      title: "Desgaste Natural",
      items: [
        "Envelhecimento natural do produto",
        "Exposição extrema ao sol",
        "Poluição ambiental",
        "Desgaste por atrito constante"
      ]
    },
    {
      title: "Uso Inadequado",
      items: [
        "Aplicação em superfícies não recomendadas",
        "Contato com produtos químicos agressivos",
        "Limpeza com materiais abrasivos",
        "Modificação ou adulteração do produto"
      ]
    }
  ];

  const benefits = [
    {
      icon: <Truck className="h-8 w-8 text-orange-600" />,
      title: "Logística Reversa",
      description: "Retiramos produtos com defeito sem custo"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Suporte Especializado",
      description: "Equipe técnica dedicada para seu caso"
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: "Resposta Rápida",
      description: "Análise e solução em até 15 dias"
    },
    {
      icon: <Star className="h-8 w-8 text-purple-600" />,
      title: "Qualidade Garantida",
      description: "Produtos testados e certificados"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-green-100/30 pointer-events-none"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 pt-20">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
            <ShieldCheck className="h-5 w-5 mr-2" />
            <span className="font-bold">GARANTIA PROREVEST</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tranquilidade e <span className="text-blue-600">Qualidade Garantida</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Oferecemos garantia completa em todos nossos produtos, 
            assegurando a qualidade e durabilidade que você espera.
          </p>
        </section>

        {/* Warranty Types */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Tipos de Garantia</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {warrantyTypes.map((warranty, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {warranty.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{warranty.title}</h3>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold mb-3 inline-block">
                  {warranty.duration}
                </div>
                <p className="text-gray-600 mb-4">{warranty.description}</p>
                <ul className="space-y-2">
                  {warranty.coverage.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Coverage Details */}
        <section className="mb-16 bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Cobertura por Categoria</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Categoria</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Garantia</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Cobertura</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Exclusões</th>
                </tr>
              </thead>
              <tbody>
                {coverageDetails.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">{item.category}</td>
                    <td className="text-center py-4 px-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {item.warranty}
                      </span>
                    </td>
                    <td className="text-center py-4 px-4 text-gray-600">{item.coverage}</td>
                    <td className="py-4 px-4 text-gray-600 text-sm">{item.exclusions.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Claim Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Como Solicitar Garantia</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {claimProcess.map((step, index) => (
              <div 
                key={index} 
                className="relative bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                {index < claimProcess.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-blue-300 transform -translate-y-1/2"></div>
                )}
                
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mb-4 font-bold">
                  {step.step}
                </div>
                
                <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-blue-600">
                  {step.icon}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{step.description}</p>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Dicas:</h4>
                  <ul className="space-y-1">
                    {step.tips.slice(0, 2).map((tip, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1 mr-1.5 flex-shrink-0"></div>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Excluded Situations */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Situações Não Cobertas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {excludedSituations.map((situation, index) => (
              <div 
                key={index} 
                className="bg-red-50 border border-red-200 rounded-xl p-6"
              >
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
                  <h3 className="text-lg font-bold text-red-700">{situation.title}</h3>
                </div>
                <ul className="space-y-2">
                  {situation.items.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                      <span className="text-sm text-red-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-8 text-white">
          <h2 className="text-3xl font-bold text-center mb-12">Vantagens da Garantia Prorevest</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                <p className="text-white/80 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Precisa Acionar a Garantia?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Nossa equipe de suporte está pronta para atender você 
            e resolver qualquer questão com nossos produtos.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <Phone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Telefone</h3>
              <p className="text-gray-600">(11) 4000-0000</p>
              <p className="text-sm text-gray-500">Seg a Sex, 8h-18h</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <Mail className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">E-mail</h3>
              <p className="text-gray-600">garantia@prorevest.com.br</p>
              <p className="text-sm text-gray-500">Resposta em 24h</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Presencial</h3>
              <p className="text-gray-600">Lojas autorizadas</p>
              <p className="text-sm text-gray-500">Em todo Brasil</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contato" 
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <ShieldCheck className="mr-2 h-5 w-5" />
              Acionar Garantia
            </Link>
            <Link 
              to="/catalogo" 
              className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center"
            >
              <Package className="mr-2 h-5 w-5" />
              Ver Produtos
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
