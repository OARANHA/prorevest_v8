import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Recycle, 
  Droplets, 
  Sun,
  TreePine,
  Globe,
  Heart,
  Award,
  Target,
  Zap,
  ShieldCheck,
  Users,
  Factory,
  Wind,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function Sustentabilidade() {
  const initiatives = [
    {
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      title: "Matérias-Primas Sustentáveis",
      description: "Utilização de recursos renováveis e de baixo impacto ambiental",
      details: [
        "Pigmentos naturais e orgânicos",
        "Resinas de base vegetal",
        "Minerais não tóxicos",
        "Água como principal solvente"
      ],
      impact: "Redução de 40% no uso de derivados de petróleo"
    },
    {
      icon: <Recycle className="h-8 w-8 text-blue-600" />,
      title: "Economia Circular",
      description: "Processos que minimizam desperdícios e maximizam reaproveitamento",
      details: [
        "Embalagens 100% recicláveis",
        "Programa de recolhimento de embalagens",
        "Reaproveitamento de resíduos industriais",
        "Logística reversa implementada"
      ],
      impact: "Mais de 500 toneladas recicladas anualmente"
    },
    {
      icon: <Droplets className="h-8 w-8 text-cyan-600" />,
      title: "Gestão Hídrica",
      description: "Uso consciente da água em todos os processos produtivos",
      details: [
        "Sistema de reuso de água industrial",
        "Captação de água da chuva",
        "Tratamento avançado de efluentes",
        "Monitoramento em tempo real"
      ],
      impact: "Redução de 60% no consumo de água"
    },
    {
      icon: <Sun className="h-8 w-8 text-yellow-600" />,
      title: "Energia Renovável",
      description: "Matriz energética baseada em fontes limpas e renováveis",
      details: [
        "Painéis solares nas unidades produtivas",
        "Energia eólica contratada",
        "Biogás de resíduos industriais",
        "Eficiência energética contínua"
      ],
      impact: "75% da energia de fontes renováveis"
    }
  ];

  const certifications = [
    {
      name: "ISO 14001",
      description: "Sistema de Gestão Ambiental",
      icon: <Award className="h-6 w-6 text-green-600" />,
      valid: "2020-2025"
    },
    {
      name: "Carbon Neutral",
      description: "Certificação de Neutralidade de Carbono",
      icon: <Leaf className="h-6 w-6 text-green-600" />,
      valid: "2023-2028"
    },
    {
      name: "FSC®",
      description: "Certificado de Manejo Florestal",
      icon: <TreePine className="h-6 w-6 text-green-600" />,
      valid: "2021-2026"
    },
    {
      name: "Green Seal",
      description: "Selo de Produto Sustentável",
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      valid: "2022-2027"
    }
  ];

  const goals = [
    {
      year: "2025",
      title: "Carbono Neutro",
      description: "Alcançar neutralidade total de emissões de carbono",
      progress: 75,
      icon: <Target className="h-6 w-6 text-blue-600" />
    },
    {
      year: "2026",
      title: "Zero Resíduos",
      description: "Eliminar envio de resíduos para aterros sanitários",
      progress: 60,
      icon: <Recycle className="h-6 w-6 text-green-600" />
    },
    {
      year: "2027",
      title: "100% Renovável",
      description: "Energia 100% de fontes renováveis",
      progress: 75,
      icon: <Sun className="h-6 w-6 text-yellow-600" />
    },
    {
      year: "2028",
      title: "Água Positiva",
      description: "Devolver mais água do que consumimos",
      progress: 45,
      icon: <Droplets className="h-6 w-6 text-cyan-600" />
    }
  ];

  const products = [
    {
      name: "Linha Eco",
      description: "Tintas com base em água e componentes renováveis",
      benefits: ["Baixo VOC", "Biodegradável", "Segura para saúde"],
      certification: "Selo Verde ABNT"
    },
    {
      name: "Coleção Nature",
      description: "Pigmentos naturais e acabamentos ecológicos",
      benefits: ["Cores naturais", "Sem metais pesados", "Compostável"],
      certification: "Certificado Orgânico"
    },
    {
      name: "Sistema Re",
      description: "Tintas para reaproveitamento de superfícies",
      benefits: ["Reduz desperdício", "Alta durabilidade", "Refinamento fácil"],
      certification: "Economia Circular"
    }
  ];

  const community = [
    {
      title: "Educação Ambiental",
      description: "Programas de conscientização em escolas e comunidades",
      actions: [
        "Palestras educativas",
        "Material didático",
        "Workshops práticos",
        "Parcerias com ONGs"
      ],
      impact: "Mais de 10.000 pessoas atingidas"
    },
    {
      title: "Reflorestamento",
      description: "Programa de plantio de árvores e recuperação de áreas",
      actions: [
        "Plantio de mudas nativas",
        "Recuperação de matas ciliares",
        "Corredores ecológicos",
        "Monitoramento contínuo"
      ],
      impact: "50.000 árvores plantadas"
    },
    {
      title: "Pesquisa & Desenvolvimento",
      description: "Investimento em tecnologias limpas e inovação sustentável",
      actions: [
        "Laboratório sustentável",
        "Parcerias universitárias",
        "Desenvolvimento verde",
        "Inovação aberta"
      ],
      impact: "R$ 2 milhões investidos anualmente"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="absolute inset-0 bg-gradient-to-br from-green-100/30 to-blue-100/30 pointer-events-none"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 pt-20">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6">
            <Leaf className="h-5 w-5 mr-2" />
            <span className="font-bold">SUSTENTABILIDADE</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Compromisso com um <span className="text-green-600">Futuro Verde</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Na ProRevest, a sustentabilidade não é apenas uma prática, 
            é o core do nosso negócio. Transformamos o presente 
            para garantir um futuro melhor para as próximas gerações.
          </p>
        </section>

        {/* Main Initiatives */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Nossas Iniciativas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {initiatives.map((initiative, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {initiative.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{initiative.title}</h3>
                <p className="text-gray-600 mb-4">{initiative.description}</p>
                <ul className="space-y-2 mb-4">
                  {initiative.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{detail}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-semibold">
                  {initiative.impact}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-16 bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Certificações e Reconhecimentos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div 
                key={index} 
                className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200"
              >
                <div className="text-green-600 mb-4 flex justify-center">
                  {cert.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{cert.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{cert.description}</p>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold inline-block">
                  Válido: {cert.valid}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Goals */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Metas 2025-2028</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {goals.map((goal, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center">
                    {goal.icon}
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                    {goal.year}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{goal.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{goal.description}</p>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progresso</span>
                    <span className="text-blue-600 font-semibold">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sustainable Products */}
        <section className="mb-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-8 text-white">
          <h2 className="text-3xl font-bold text-center mb-12">Produtos Sustentáveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-3">{product.name}</h3>
                <p className="text-white/80 mb-4">{product.description}</p>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Benefícios:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.benefits.map((benefit, idx) => (
                      <span key={idx} className="bg-white/20 px-2 py-1 rounded-full text-xs">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="text-sm font-semibold">{product.certification}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Impact */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Impacto Social e Ambiental</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {community.map((item, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-blue-600 mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <ul className="space-y-2 mb-4">
                  {item.actions.map((action, idx) => (
                    <li key={idx} className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{action}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-semibold">
                  {item.impact}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Numbers */}
        <section className="mb-16 bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Nossos Números</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">75%</div>
              <p className="text-gray-600">Redução de CO₂</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500t</div>
              <p className="text-gray-600">Resíduos Reciclados</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600 mb-2">60%</div>
              <p className="text-gray-600">Economia de Água</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2">50k</div>
              <p className="text-gray-600">Árvores Plantadas</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Junte-se a Nesta Causa</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Descubra como nossos produtos sustentáveis podem transformar 
            seu ambiente enquanto protege o planeta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/catalogo" 
              className="bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <Leaf className="mr-2 h-5 w-5" />
              Ver Produtos Sustentáveis
            </Link>
            <Link 
              to="/contato" 
              className="bg-white border-2 border-green-600 text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-all duration-300 flex items-center justify-center"
            >
              <Heart className="mr-2 h-5 w-5" />
              Saber Mais
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
