// PriceSection.tsx
import React from 'react';

interface PriceSectionProps {
  onFilterChange: (range: [number, number] | null) => void;
  selectedRange: [number, number] | null;
}

export function PriceSection({ onFilterChange, selectedRange }: PriceSectionProps) {
  const min = 0;
  const max = 1000;
  
  const currentMin = selectedRange ? selectedRange[0] : min;
  const currentMax = selectedRange ? selectedRange[1] : max;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onFilterChange([value, currentMax]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onFilterChange([currentMin, value]);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Mínimo: R$ {currentMin}</span>
          <span>Máximo: R$ {currentMax}</span>
        </div>
        <div className="space-y-3">
          <input
            type="range"
            min={min}
            max={max}
            value={currentMin}
            onChange={handleMinChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <input
            type="range"
            min={min}
            max={max}
            value={currentMax}
            onChange={handleMaxChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>R$ {min}</span>
        <span>R$ {max}</span>
      </div>
    </div>
  );
}