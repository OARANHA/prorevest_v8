import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  X, 
  Filter
} from 'lucide-react';

interface Color {
  name: string;
  hexCode: string;
  category?: string;
  pro_revest_code?: string;
  numeric_code?: string;
  reference_number?: string;
}

interface CatalogFiltersProps {
  categories: string[];
  finishes: string[];
  colors: Color[];
  selectedCategory: string;
  selectedFinish: string;
  selectedColor: string | null;
  onCategoryChange: (category: string) => void;
  onFinishChange: (finish: string) => void;
  onColorChange: (color: string | null) => void;
  onClearFilters: () => void;
}

export function CatalogFilters({
  categories,
  finishes,
  colors,
  selectedCategory,
  selectedFinish,
  selectedColor,
  onCategoryChange,
  onFinishChange,
  onColorChange,
  onClearFilters
}: CatalogFiltersProps) {
  const [showCategoryFilter, setShowCategoryFilter] = useState(true);
  const [showFinishFilter, setShowFinishFilter] = useState(true);
  const [showColorFilter, setShowColorFilter] = useState(true);

  const toggleColor = (colorName: string) => {
    onColorChange(selectedColor === colorName ? null : colorName);
  };

  return (
    <div className="bg-card rounded-xl p-5 shadow-sm border border-border/20 sticky top-24">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-cormorant font-bold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros
        </h2>
        <button 
          className="text-xs text-primary hover:underline flex items-center gap-1"
          onClick={onClearFilters}
        >
          <X className="h-3 w-3" />
          Limpar tudo
        </button>
      </div>
      
      {/* Category Filter */}
      <div className="mb-6">
        <button
          className="flex justify-between items-center w-full font-medium mb-3 text-sm"
          onClick={() => setShowCategoryFilter(!showCategoryFilter)}
        >
          <span>Categoria</span>
          {showCategoryFilter ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showCategoryFilter && (
          <div className="space-y-1.5">
            {categories.map(category => (
              <button
                key={category}
                className={`block w-full text-left px-2.5 py-1.5 rounded-md transition-all text-sm ${
                  selectedCategory === category 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Finish Filter */}
      <div className="mb-6">
        <button
          className="flex justify-between items-center w-full font-medium mb-3 text-sm"
          onClick={() => setShowFinishFilter(!showFinishFilter)}
        >
          <span>Acabamento</span>
          {showFinishFilter ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showFinishFilter && (
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-2">
            {finishes.map(finish => (
              <button
                key={finish}
                className={`block w-full text-left px-2.5 py-1.5 rounded-md transition-all text-sm ${
                  selectedFinish === finish 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => onFinishChange(finish)}
              >
                {finish}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Color Filter */}
      <div>
        <button
          className="flex justify-between items-center w-full font-medium mb-3 text-sm"
          onClick={() => setShowColorFilter(!showColorFilter)}
        >
          <span>Cores</span>
          {showColorFilter ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showColorFilter && (
          <div>
            <div className="grid grid-cols-5 gap-2">
              {colors.map(color => (
                <button
                  key={color.name}
                  className={`relative w-full aspect-square rounded-md border transition-all ${
                    selectedColor === color.name 
                      ? 'border-primary ring-1 ring-primary/30' 
                      : 'border-border/20 hover:border-primary/30'
                  }`}
                  style={{ backgroundColor: color.hexCode }}
                  onClick={() => toggleColor(color.name)}
                  title={`${color.name}${color.pro_revest_code ? ` (${color.pro_revest_code})` : ''}${color.category ? ` - ${color.category}` : ''}`}
                >
                  {selectedColor === color.name && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/80 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-primary"></div>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            {selectedColor && (
              <div className="mt-3 space-y-2">
                {colors.find(c => c.name === selectedColor) && (
                  <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                    <div className="font-medium">{selectedColor}</div>
                    {colors.find(c => c.name === selectedColor)?.pro_revest_code && (
                      <div>Código: {colors.find(c => c.name === selectedColor)?.pro_revest_code}</div>
                    )}
                    {colors.find(c => c.name === selectedColor)?.category && (
                      <div>Categoria: {colors.find(c => c.name === selectedColor)?.category}</div>
                    )}
                    {colors.find(c => c.name === selectedColor)?.reference_number && (
                      <div>Referência: {colors.find(c => c.name === selectedColor)?.reference_number}</div>
                    )}
                  </div>
                )}
                <button 
                  className="text-xs text-primary hover:underline flex items-center"
                  onClick={() => onColorChange(null)}
                >
                  <X className="h-3 w-3 mr-1" />
                  Limpar cor selecionada
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}