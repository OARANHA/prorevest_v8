import React from 'react';
import { Link } from 'react-router-dom';
import { Palette, Lightbulb, Camera, Eye, Home, Building, Waves, Trees } from 'lucide-react';

const inspirations = [
  {
    id: "sala-estar",
    name: "Sala de Estar",
    description: "Ambientes acolhedores e sofisticados",
    icon: <Home className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    link: "/projetos",
    category: "Residencial"
  },
  {
    id: "cozinha",
    name: "Cozinha",
    description: "Espaços funcionais e modernos",
    icon: <Building className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    link: "/projetos",
    category: "Residencial"
  },
  {
    id: "quarto",
    name: "Quarto",
    description: "Ambientes relaxantes e pessoais",
    icon: <Palette className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    link: "/projetos",
    category: "Residencial"
  },
  {
    id: "banheiro",
    name: "Banheiro",
    description: "Espaços elegantes e funcionais",
    icon: <Waves className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    link: "/projetos",
    category: "Residencial"
  },
  {
    id: "escritorio",
    name: "Escritório",
    description: "Ambientes produtivos e inspiradores",
    icon: <Lightbulb className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    link: "/projetos",
    category: "Comercial"
  },
  {
    id: "fachada",
    name: "Fachada",
    description: "Primeiras impressões marcantes",
    icon: <Building className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    link: "/projetos",
    category: "Exterior"
  },
  {
    id: "jardim",
    name: "Jardim de Inverno",
    description: "Natureza integrada ao ambiente",
    icon: <Trees className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    link: "/projetos",
    category: "Exterior"
  },
  {
    id: "simulador",
    name: "Simulador de Cores",
    description: "Experimente cores em tempo real antes de aplicar",
    icon: <Palette className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1513519880230-81f35f6cf9c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    link: "/simulador",
    category: "Ferramentas"
  }
];

export function InspirationSection() {
  // Agrupar inspirações por categoria
  const inspirationsByCategory = inspirations.reduce((acc, inspiration) => {
    const category = inspiration.category || 'Outros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(inspiration);
    return acc;
  }, {} as Record<string, typeof inspirations>);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl section-title mb-3 text-foreground">
            Inspirações por <span className="text-primary">Ambiente</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm section-subtitle">
            Explore ambientes específicos e encontre a inspiração perfeita para seu projeto
          </p>
        </div>

        {/* Renderizar cada categoria */}
        {Object.entries(inspirationsByCategory).map(([category, categoryInspirations]) => (
          <div key={category} className="mb-12">
            <div className="flex items-center mb-6">
              <div className="h-1 bg-primary flex-1 mr-4"></div>
              <h3 className="text-xl font-bold text-foreground px-4 py-2 bg-primary/10 rounded-lg">
                {category}
              </h3>
              <div className="h-1 bg-primary flex-1 ml-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoryInspirations.map((inspiration) => (
                <Link
                  key={inspiration.id}
                  to={inspiration.link}
                  className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-border/20"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={inspiration.image}
                      alt={inspiration.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                      {category}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <div className="bg-muted/40 p-2 rounded-lg mr-3">
                        {inspiration.icon}
                      </div>
                      <h3 className="text-lg font-bold">{inspiration.name}</h3>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4">{inspiration.description}</p>

                    <div className="text-primary font-medium text-sm flex items-center">
                      Explorar
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
