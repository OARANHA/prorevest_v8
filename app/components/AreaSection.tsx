// AreaSection.tsx
import React from 'react';

interface AreaSectionProps {
  onFilterChange: (area: string | null) => void;
  selectedArea: string | null;
}

export function AreaSection({ onFilterChange, selectedArea }: AreaSectionProps) {
  const areas = [
    { id: 'interior', name: 'Interior' },
    { id: 'exterior', name: 'Exterior' },
    { id: 'industrial', name: 'Industrial' },
    { id: 'bathroom', name: 'Banheiro' },
    { id: 'kitchen', name: 'Cozinha' },
  ];

  return (
    <div className="space-y-2">
      {areas.map((area) => (
        <label key={area.id} className="flex items-center cursor-pointer group">
          <input
            type="radio"
            name="area"
            value={area.id}
            checked={selectedArea === area.id}
            onChange={(e) => onFilterChange(e.target.value)}
            className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-500"
          />
          <span className="ml-3 text-sm text-gray-700 group-hover:text-orange-500 transition-colors">
            {area.name}
          </span>
        </label>
      ))}
    </div>
  );
}