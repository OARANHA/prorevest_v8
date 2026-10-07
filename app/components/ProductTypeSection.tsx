import React from 'react';

interface ProductTypeSectionProps {
  onFilterChange: (type: string | null) => void;
  selectedType: string | null;
}

export function ProductTypeSection({ onFilterChange, selectedType }: ProductTypeSectionProps) {
  const productTypes = [
    { id: 'acrylic', name: 'Tinta Acrílica' },
    { id: 'epoxy', name: 'Tinta Epóxi' },
    { id: 'latex', name: 'Tinta Látex' },
    { id: 'enamel', name: 'Esmalte Sintético' },
    { id: 'antimicrobial', name: 'Tinta Antimicrobiana' },
    { id: 'textured', name: 'Tinta Texturizada' },
  ];

  return (
    <div className="space-y-2">
      {productTypes.map((type) => (
        <label key={type.id} className="flex items-center cursor-pointer group">
          <input
            type="radio"
            name="productType"
            value={type.id}
            checked={selectedType === type.id}
            onChange={(e) => onFilterChange(e.target.value)}
            className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-500"
          />
          <span className="ml-3 text-sm text-gray-700 group-hover:text-orange-500 transition-colors">
            {type.name}
          </span>
        </label>
      ))}
    </div>
  );
}
