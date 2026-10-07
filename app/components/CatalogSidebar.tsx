// CatalogSidebar.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { ProductTypeSection } from '~/components/ProductTypeSection';
import { AreaSection } from '~/components/AreaSection';
import { FinishSection } from '~/components/FinishSection';
import { ColorSection } from '~/components/ColorSection';
import { PriceSection } from '~/components/PriceSection';

interface CatalogSidebarProps {
  onFilterChange: (filterType: string, value: string | null | [number, number]) => void;
  selectedFilters: {
    productType: string | null;
    area: string | null;
    finish: string | null;
    category: string;
    color: string | null;
    priceRange: [number, number] | null;
  };
  onClearFilters: () => void;
  productCount?: number;
}

export function CatalogSidebar({
  onFilterChange,
  selectedFilters,
  onClearFilters,
  productCount = 0
}: CatalogSidebarProps) {
  const [showProductType, setShowProductType] = useState(true);
  const [showArea, setShowArea] = useState(true);
  const [showFinish, setShowFinish] = useState(true);
  const [showColor, setShowColor] = useState(true);
  const [showPrice, setShowPrice] = useState(true);

  const activeFiltersCount = useMemo(() => {
    return Object.values(selectedFilters).filter(value => {
      if (value === null || value === undefined) return false;
      if (Array.isArray(value)) return value[0] !== null && value[1] !== null;
      return true;
    }).length;
  }, [selectedFilters]);

  const handleFilterChange = useCallback((filterType: string, value: string | null | [number, number]) => {
    if (filterType === 'priceRange') {
      const currentRange = selectedFilters.priceRange;
      if (currentRange && Array.isArray(value) && 
          currentRange[0] === value[0] && currentRange[1] === value[1]) {
        onFilterChange(filterType, null);
      } else {
        onFilterChange(filterType, value);
      }
    } else {
      const currentValue = selectedFilters[filterType as keyof typeof selectedFilters];
      if (currentValue === value) {
        onFilterChange(filterType, null);
      } else {
        onFilterChange(filterType, value);
      }
    }
  }, [selectedFilters, onFilterChange]);

  // Wrapper functions to match the expected signatures
  const handleProductTypeChange = useCallback((value: string | null) => {
    handleFilterChange('productType', value);
  }, [handleFilterChange]);

  const handleAreaChange = useCallback((value: string | null) => {
    handleFilterChange('area', value);
  }, [handleFilterChange]);

  const handleFinishChange = useCallback((value: string | null) => {
    handleFilterChange('finish', value);
  }, [handleFilterChange]);

  const handleColorChange = useCallback((value: string | null) => {
    handleFilterChange('color', value);
  }, [handleFilterChange]);

  const handlePriceRangeChange = useCallback((value: [number, number] | null) => {
    handleFilterChange('priceRange', value);
  }, [handleFilterChange]);

  const FilterSection = ({ 
    title, 
    isOpen, 
    toggle, 
    children 
  }: { 
    title: string; 
    isOpen: boolean; 
    toggle: () => void; 
    children: React.ReactNode 
  }) => (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <button
        className="flex justify-between items-center w-full font-medium text-sm mb-2 group"
        onClick={toggle}
        aria-expanded={isOpen}
      >
        <span className="text-gray-800 group-hover:text-orange-500 transition-colors">
          {title}
        </span>
        <svg 
          className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {children}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 sticky top-24 z-10">
      <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
          <p className="text-sm text-gray-500 mt-1">
            {productCount} produto{productCount !== 1 ? 's' : ''} encontrado{productCount !== 1 ? 's' : ''}
          </p>
        </div>
        <button 
          onClick={onClearFilters}
          disabled={activeFiltersCount === 0}
          className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${
            activeFiltersCount > 0 
              ? 'text-orange-500 hover:bg-orange-50' 
              : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          Limpar {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </button>
      </div>

      <FilterSection
        title="Tipo de Produto"
        isOpen={showProductType}
        toggle={() => setShowProductType(!showProductType)}
      >
        <ProductTypeSection 
          onFilterChange={handleProductTypeChange} 
          selectedType={selectedFilters.productType} 
        />
      </FilterSection>
      
      <FilterSection
        title="Área de Aplicação"
        isOpen={showArea}
        toggle={() => setShowArea(!showArea)}
      >
        <AreaSection 
          onFilterChange={handleAreaChange} 
          selectedArea={selectedFilters.area} 
        />
      </FilterSection>
      
      <FilterSection
        title="Acabamento"
        isOpen={showFinish}
        toggle={() => setShowFinish(!showFinish)}
      >
        <FinishSection 
          onFilterChange={handleFinishChange} 
          selectedFinish={selectedFilters.finish} 
        />
      </FilterSection>

      <FilterSection
        title="Cores"
        isOpen={showColor}
        toggle={() => setShowColor(!showColor)}
      >
        <ColorSection 
          onFilterChange={handleColorChange} 
          selectedColor={selectedFilters.color} 
        />
      </FilterSection>

      <FilterSection
        title="Faixa de Preço"
        isOpen={showPrice}
        toggle={() => setShowPrice(!showPrice)}
      >
        <PriceSection 
          onFilterChange={handlePriceRangeChange} 
          selectedRange={selectedFilters.priceRange} 
        />
      </FilterSection>

      <button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md">
        Aplicar Filtros
      </button>
    </div>
  );
}
