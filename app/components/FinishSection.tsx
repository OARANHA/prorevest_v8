import React from 'react';

interface FinishSectionProps {
  onFilterChange: (finish: string | null) => void;
  selectedFinish: string | null;
}

export function FinishSection({ onFilterChange, selectedFinish }: FinishSectionProps) {
  const finishes = [
    { id: 'matt', name: 'Fosco' },
    { id: 'satin', name: 'Fosco Acetinado' },
    { id: 'semi-gloss', name: 'Semi-Brilho' },
    { id: 'gloss', name: 'Brilho' },
    { id: 'textured', name: 'Texturizado' },
  ];

  return (
    <div className="space-y-2">
      {finishes.map((finish) => (
        <label key={finish.id} className="flex items-center cursor-pointer group">
          <input
            type="radio"
            name="finish"
            value={finish.id}
            checked={selectedFinish === finish.id}
            onChange={(e) => onFilterChange(e.target.value)}
            className="h-4 w-4 text-orange-500 border-gray-300 focus:ring-orange-500"
          />
          <span className="ml-3 text-sm text-gray-700 group-hover:text-orange-500 transition-colors">
            {finish.name}
          </span>
        </label>
      ))}
    </div>
  );
}
