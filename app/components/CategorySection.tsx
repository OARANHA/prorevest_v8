import React from 'react';
import { PaintRoller, SprayCan, Brush, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: "interior",
    name: "Tintas para Interior",
    description: "Soluções para ambientes internos",
    icon: <PaintRoller className="h-6 w-6" />,
    color: "bg-blue-50 hover:bg-blue-100"
  },
  {
    id: "exterior",
    name: "Tintas para Exterior",
    description: "Proteção para áreas externas",
    icon: <SprayCan className="h-6 w-6" />,
    color: "bg-green-50 hover:bg-green-100"
  },
  {
    id: "esmaltes",
    name: "Esmaltes",
    description: "Acabamento durável e brilhante",
    icon: <Brush className="h-6 w-6" />,
    color: "bg-purple-50 hover:bg-purple-100"
  },
  {
    id: "texturas",
    name: "Texturas",
    description: "Efeitos especiais para paredes",
    icon: <Palette className="h-6 w-6" />,
    color: "bg-orange-50 hover:bg-orange-100"
  }
];

export function CategorySection() {
  return (
    <section className="py-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl mb-12 border border-border/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl section-title mb-3 text-foreground">
            Navegue por <span className="text-primary">Categorias</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm section-subtitle">
            Encontre exatamente o que você precisa para o seu projeto
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={`/categoria/${category.id}`}
              className={`${category.color} rounded-xl p-6 shadow-sm border border-border/20 transition-all duration-300 hover:shadow-md group`}
            >
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{category.name}</h3>
              <p className="text-muted-foreground text-sm">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}