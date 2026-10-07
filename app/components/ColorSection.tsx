// ColorSection.tsx
import React from 'react';

interface ColorSectionProps {
  onFilterChange: (color: string | null) => void;
  selectedColor: string | null;
}

export function ColorSection({ onFilterChange, selectedColor }: ColorSectionProps) {
  const colors = [
    { id: 'white', name: 'Branco', hex: '#FFFFFF' },
    { id: 'black', name: 'Preto', hex: '#000000' },
    { id: 'blue', name: 'Azul', hex: '#4285F4' },
    { id: 'green', name: 'Verde', hex: '#34A853' },
    { id: 'yellow', name: 'Amarelo', hex: '#FBBC05' },
    { id: 'red', name: 'Vermelho', hex: '#EA4335' },
    { id: 'orange', name: 'Laranja', hex: '#FF6D00' },
    { id: 'purple', name: 'Roxo', hex: '#9C27B0' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <button
          key={color.id}
          onClick={() => onFilterChange(selectedColor === color.id ? null : color.id)}
          className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
            selectedColor === color.id 
              ? 'border-gray-800 scale-110' 
              : 'border-gray-300 hover:border-gray-500'
          }`}
          style={{ backgroundColor: color.hex }}
          aria-label={`Cor ${color.name}`}
          title={color.name}
        />
      ))}
    </div>
  );
}