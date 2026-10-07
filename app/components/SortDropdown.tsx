import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SortOption {
  value: string;
  label: string;
  description: string;
}

interface SortDropdownProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  showColors?: boolean;
}

export function SortDropdown({ sortBy, setSortBy, showColors = false }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const paintSortOptions: SortOption[] = [
    { value: "featured", label: "Destaques", description: "Nossas recomendações" },
    { value: "price-low", label: "Menor Preço", description: "Do mais barato ao mais caro" },
    { value: "price-high", label: "Maior Preço", description: "Do mais caro ao mais barato" },
    { value: "rating", label: "Melhor Avaliados", description: "Produtos com melhores notas" },
    { value: "name", label: "Nome (A-Z)", description: "Ordem alfabética" }
  ];

  const colorSortOptions: SortOption[] = [
    { value: "name", label: "Nome (A-Z)", description: "Ordem alfabética" },
    { value: "category", label: "Categoria", description: "Agrupado por categoria" },
    { value: "hex", label: "Código Hex", description: "Por código de cor" }
  ];
  
  const sortOptions = showColors ? colorSortOptions : paintSortOptions;
  const currentOption = sortOptions.find(option => option.value === sortBy) || sortOptions[0];
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-border/20 bg-background hover:bg-muted transition-colors text-xs"
      >
        <span>Ordenar por: <span className="font-medium">{currentOption.label}</span></span>
        {isOpen ? <ChevronUp className="h-2.5 w-2.5" /> : <ChevronDown className="h-2.5 w-2.5" />}
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border/20 rounded-md shadow-lg z-10">
          <div className="py-0.5">
            {sortOptions.map(option => (
              <button
                key={option.value}
                className={`w-full text-left px-2 py-1 hover:bg-muted transition-colors ${
                  sortBy === option.value ? 'bg-primary/10' : ''
                }`}
                onClick={() => {
                  setSortBy(option.value);
                  setIsOpen(false);
                }}
              >
                <div className="text-xs font-medium">{option.label}</div>
                <div className="text-xs text-muted-foreground">{option.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}