import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { 
  Paintbrush, 
  Award, 
  Users, 
  Leaf, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  ChevronRight,
  MapPin,
  Phone,
  Mail as Envelope,
  Globe,
  Heart,
  TrendingUp,
  Lightbulb
} from 'lucide-react';

export default function AboutUs() {
  const values = [
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Qualidade Premium",
      description: "Compromisso com a excelência em cada lata que produzimos."
    },
    {
      icon: <Leaf className="h-8 w-8 text-primary" />,
      title: "Sustentabilidade",
      description: "Práticas ecológicas em todos os processos de produção."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Inovação",
      description: "Constante evolução para atender às necessidades do mercado."
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Paixão",
      description: "Amor pelo que fazemos refletido em cada produto."
    }
  ];

  const founder = {
    name: "Mateus Dias",
    role: "Fundador",
    bio: "Empreendedor gaúcho que transformou o sonho de infância em uma empresa referência no mercado de tintas."
  };

  const milestones = [
    { year: "2008", event: "Fundação da Prorevest" },
    { year: "2012", event: "Lançamento da linha premium" },
    { year: "2015", event: "Expansão para 5 estados" },
    { year: "2018", event: "Certificação ambiental ISO 14001" },
    { year: "2020", event: "Inauguração da nova fábrica" },
    { year: "2023", event: "Reconhecimento como marca líder" }
  ];

  return (
    <Layout showHeaderFooter={false}>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white">
        <div className="pt-20">
          {/* Hero Section (alinhado ao padrão da home) */}
          <section id="hero" className="relative min-h-[70vh] flex items-center overflow-hidden mb-16">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{backgroundImage: "url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1920&q=80')"}}
            >
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full mb-6 shadow-lg">
                  <Sparkles className="h-5 w-5 mr-2" />
                  <span className="font-bold text-lg">SOBRE NÓS</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight">
                  Sobre a <span className="text-orange-300 font-semibold">Prorevest</span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                  Transformando sonhos em cores, criando ambientes que inspiram.
                </p>
              </div>

              {/* Métricas em estilo glass, como na home */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto shadow-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 text-center gap-6 divide-x divide-white/20">
                  <div>
                    <div className="text-3xl font-bold text-white">15+</div>
                    <div className="text-white/80">Anos de Experiência</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">200+</div>
                    <div className="text-white/80">Produtos</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">5000+</div>
                    <div className="text-white/80">Clientes Satisfeitos</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">98%</div>
                    <div className="text-white/80">Taxa de Recomendação</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="container mx-auto px-4 py-8">

          {/* Our Story */}
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="border-l-4 border-primary/20 pl-6">
                <h2 className="text-3xl font-bold text-foreground mb-6">Nossa História</h2>
                <p className="text-muted-foreground mb-6">
                  A Prorevest Tintas é a realização do sonho de um menino que foi auxiliar de pedreiro de seu pai e que sempre sonhou em ser dono do seu próprio negócio. Este menino cresceu, correu atrás de seus objetivos e hoje é o empreendedor gaúcho Mateus Dias.
                </p>
                <p className="text-muted-foreground mb-6">
                  Com foco voltado para a inovação tecnológica e qualidade premium em seus produtos, a Prorevest Tintas oferece uma vasta gama de tintas, resinas, vernizes e revestimentos, diferenciando-se por ser a única no mercado nacional a oferecer personalização de cores em itens como massa corrida, texturas e todo o portfólio de tintas, incluindo os esmaltes, uma verdadeira boutique de itens exclusivos com fabricação própria.
                </p>
                <p className="text-muted-foreground mb-6">
                  Localizada na região metropolitana de Porto Alegre, a empresa atende engenheiros, arquitetos, empreiteiras, construtoras e consumidores finais de todo o país.
                </p>
                <p className="text-muted-foreground">
                  Recentemente, foi lançado em seu novo site o Studio Prorevest, uma ferramenta única no mundo, estruturada com a melhor Inteligência Artificial da atualidade, que permite que você experimente cores e texturas em seus ambientes com perfeição, respeitando todos os detalhes, como sombras, aberturas e móveis.
                </p>
                <p className="text-primary font-semibold mt-4">
                  Experimente e descubra qual produto da Prorevest Tintas se adequa ao seu projeto, e lembre-se: a cor define o que você quer dizer.
                </p>
              </div>
              <div className="bg-muted rounded-md ring-1 ring-amber-200 h-96 flex items-center justify-center">
                <img
                  src="/images/factory.png"
                  alt="Fábrica Prorevest"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Nossos Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div 
                  key={index} 
                  className="group relative overflow-hidden rounded-xl shadow-lg p-6 border border-amber-200 bg-gradient-to-br from-yellow-50 to-white hover:shadow-xl transition-all"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
                  <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-4 ring-1 ring-primary/20 group-hover:bg-primary/20 transition-colors">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Milestones */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Nossos Marcos</h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-amber-300"></div>
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div 
                    key={index} 
                    className={`relative flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center`}
                  >
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                      <div className={`${index % 2 === 0 ? 'text-right' : 'text-left'} space-y-1`}>
                        <div className="text-sm uppercase tracking-wide text-amber-600 font-semibold">{milestone.year}</div>
                        <div className="text-lg text-foreground">{milestone.event}</div>
                      </div>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-amber-500 rounded-full border border-amber-100 shadow-sm"></div>
                    <div className="w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Founder */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Nosso Fundador</h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-8 border border-amber-200 shadow-lg">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="bg-primary/10 w-32 h-32 rounded-full flex items-center justify-center ring-4 ring-amber-200">
                    <Users className="h-16 w-16 text-primary" />
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{founder.name}</h3>
                    <p className="text-primary font-semibold mb-4">{founder.role}</p>
                    <p className="text-muted-foreground leading-relaxed">
                      {founder.bio}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sustainability */}
          <section className="mb-16 bg-gradient-to-r from-yellow-50 to-green-50 rounded-xl p-8 border border-amber-200 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Compromisso com a Sustentabilidade</h2>
                <p className="text-muted-foreground mb-6">
                  Na Prorevest, acreditamos que é possível criar produtos de qualidade
                  sem comprometer o meio ambiente. Nossas práticas sustentáveis incluem:
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Leaf className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                    <span>Formulações com baixo impacto ambiental</span>
                  </li>
                  <li className="flex items-start">
                    <Leaf className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                    <span>Embalagens recicláveis e biodegradáveis</span>
                  </li>
                  <li className="flex items-start">
                    <Leaf className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                    <span>Processos de produção com eficiência energética</span>
                  </li>
                  <li className="flex items-start">
                    <Leaf className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                    <span>Programas de reciclagem e reutilização</span>
                  </li>
                </ul>
                <Link 
                  to="/sustentabilidade" 
                  className="inline-flex items-center text-primary font-semibold hover:underline"
                >
                  Saiba mais sobre nossas iniciativas
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div className="bg-muted rounded-md h-80 flex items-center justify-center ring-1 ring-amber-200">
                <Leaf className="h-24 w-24 text-primary" />
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">Pronto para Transformar seu Espaço?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Descubra nossa linha completa de produtos e encontre a combinação perfeita para seu projeto.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/catalogo" 
                className="bg-primary text-primary-foreground px-8 py-4 rounded-md font-bold text-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-[1.02] shadow-md flex items-center justify-center"
              >
                <Paintbrush className="mr-2 h-5 w-5" />
                Explorar Produtos
              </Link>
              <Link 
                to="/contato" 
                className="bg-card border border-border text-foreground px-8 py-4 rounded-md font-bold text-lg hover:bg-muted transition-all duration-300 flex items-center justify-center"
              >
                <Phone className="mr-2 h-5 w-5" />
                Entrar em Contato
              </Link>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
