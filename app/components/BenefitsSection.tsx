import React from 'react';
import { Truck, Shield, Zap, Tag, Leaf, Award } from 'lucide-react';

const benefits = [
  {
    id: "delivery",
    title: "Entrega Rápida",
    description: "Entregamos em até 48h para todo o Brasil",
    icon: <Truck className="h-5 w-5" />
  },
  {
    id: "warranty",
    title: "Garantia Total",
    description: "7 anos de garantia em todos os produtos",
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: "formula",
    title: "Fórmula Avançada",
    description: "Tecnologia de ponta em cada lata",
    icon: <Zap className="h-5 w-5" />
  },
  {
    id: "price",
    title: "Melhor Preço",
    description: "Preços imbatíveis com qualidade premium",
    icon: <Tag className="h-5 w-5" />
  },
  {
    id: "eco",
    title: "Eco Friendly",
    description: "Produtos sustentáveis e biodegradáveis",
    icon: <Leaf className="h-5 w-5" />
  },
  {
    id: "quality",
    title: "Qualidade Premium",
    description: "Certificados internacionais de qualidade",
    icon: <Award className="h-5 w-5" />
  }
];

export function BenefitsSection() {
  return (
    <section className="py-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl mb-12 border border-border/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl section-title mb-3 text-foreground">
            Por que escolher a <span className="text-primary">ProRevest</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm section-subtitle">
            Nossos diferenciais que fazem a diferença no seu projeto
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {benefits.map((benefit) => (
            <div 
              key={benefit.id} 
              className="bg-card rounded-xl p-5 border border-border/20 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center mb-3">
                <div className="bg-primary/10 p-2 rounded-lg mr-3 text-primary">
                  {benefit.icon}
                </div>
                <h3 className="font-medium">{benefit.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}