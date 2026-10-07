import React from 'react';

interface FilterProgressProps {
  totalProducts: number;
  filteredProducts: number;
}

export function FilterProgress({ totalProducts, filteredProducts }: FilterProgressProps) {
  const progress = (filteredProducts / totalProducts) * 100;
  
  return (
    <div className="mb-1">
      <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
        <span>Mostrando {filteredProducts} de {totalProducts} produtos</span>
        <span>{Math.round(progress)}% dos produtos</span>
      </div>
      <div className="w-full bg-muted/30 rounded-full h-0.5">
        <div 
          className="bg-primary h-0.5 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}