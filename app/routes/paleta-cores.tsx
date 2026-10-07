import { type LoaderFunctionArgs } from "react-router-dom";
import { useLoaderData, Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useMemo, useEffect, useRef } from "react";
import { supabase } from "~/lib/supabaseClient";
import 'remixicon/fonts/remixicon.css';

// Função para converter hex para RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Função para calcular distância euclidiana entre duas cores RGB
function calculateColorDistance(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return Infinity;
  
  // Distância euclidiana no espaço RGB
  const deltaR = rgb1.r - rgb2.r;
  const deltaG = rgb1.g - rgb2.g;
  const deltaB = rgb1.b - rgb2.b;
  
  return Math.sqrt(deltaR * deltaR + deltaG * deltaG + deltaB * deltaB);
}

// Função para encontrar cores similares
function findSimilarColors(targetColor: Color, allColors: Color[], maxResults: number = 6): Color[] {
  if (!targetColor.hex_code) return [];
  
  const colorsWithDistance = allColors
    .filter(color => color.id !== targetColor.id && color.hex_code)
    .map(color => ({
      ...color,
      distance: calculateColorDistance(targetColor.hex_code!, color.hex_code!)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxResults);
  
  return colorsWithDistance;
}

interface Color {
  id: string;
  name: string;
  hex_code?: string;
  ral_code?: string;
  pantone_code?: string;
  ncs_code?: string;
  pro_revest_code?: string;
  category?: string;
  description?: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const search = url.searchParams.get('search') || '';
  const category = url.searchParams.get('category') || '';
  
  const offset = (page - 1) * limit;

  // Construir query base
  let query = supabase
    .from('colors')
    .select('*', { count: 'exact' });

  // Aplicar filtros
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }
  
  if (category) {
    query = query.eq('category', category);
  }

  // Aplicar paginação e ordenação
  const { data: colors, error, count } = await query
    .order('name')
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Erro ao buscar cores:', error);
    return { colors: [], totalCount: 0, currentPage: page, totalPages: 0, allColors: [] };
  }

  // Buscar todas as cores para cálculo de similaridade (limitado para performance)
  const { data: allColors } = await supabase
    .from('colors')
    .select('*')
    .limit(500); // Limitar para evitar problemas de performance

  const totalPages = Math.ceil((count || 0) / limit);

  return {
    colors: colors || [],
    totalCount: count || 0,
    currentPage: page,
    totalPages,
    searchTerm: search,
    selectedCategory: category,
    allColors: allColors || []
  };
}

export default function PaletaCores() {
  const { colors, totalCount, currentPage, totalPages, searchTerm, selectedCategory, allColors } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Calcular cores similares quando uma cor é selecionada
  const similarColors = useMemo(() => {
    if (!selectedColor || !allColors) return [];
    return findSimilarColors(selectedColor, allColors);
  }, [selectedColor, allColors]);

  // Fechar modal com ESC
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
        setSelectedColor(null);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [isModalOpen]);

  // Gerar páginas para paginação
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header removed to avoid duplication; Layout already renders it */}
      
      {/* Hero Section */}
      <div id="hero" className="relative w-full h-screen bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white overflow-hidden" style={{ marginTop: '0px' }}>
        
        {/* Efeitos de fundo animados */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-bounce" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-400/20 rounded-full blur-lg animate-pulse" />
          <div className="absolute bottom-1/4 left-1/2 w-36 h-36 bg-pink-400/15 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-1/4 right-1/4 w-28 h-28 bg-green-400/20 rounded-full blur-lg animate-bounce" />
        </div>

        {/* Conteúdo do Hero */}
        <div className="relative z-20 flex items-center justify-center h-full">
          <div className="text-center px-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
              <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mr-3 animate-pulse"></div>
              <span className="text-sm font-medium">Paleta de Cores Premium</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
              Explore Nossa
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Paleta de Cores
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
              Descubra centenas de cores exclusivas para transformar seus projetos em obras de arte
            </p>

            {/* Barra de pesquisa */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pesquisar cores..."
                  defaultValue={searchTerm}
                  className="w-full px-6 py-4 pl-14 text-gray-900 bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/30 text-lg"
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams);
                    if (e.target.value) {
                      params.set('search', e.target.value);
                    } else {
                      params.delete('search');
                    }
                    params.delete('page');
                    setSearchParams(params);
                  }}
                />
                <i className="ri-search-line absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl"></i>
              </div>
            </div>

            {/* Filtros de categoria */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {['Todas', 'Neutras', 'Quentes', 'Frias', 'Vibrantes', 'Pastéis'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    if (cat === 'Todas') {
                      params.delete('category');
                    } else {
                      params.set('category', cat);
                    }
                    params.delete('page');
                    setSearchParams(params);
                  }}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                    (cat === 'Todas' && !selectedCategory) || selectedCategory === cat
                      ? 'bg-white text-purple-600 shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Estatísticas */}
            <div className="flex justify-center items-center gap-8 text-white/80">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{totalCount}</div>
                <div className="text-sm">Cores Disponíveis</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{colors.length}</div>
                <div className="text-sm">Exibindo</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Cores */}
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {colors.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma cor encontrada</h3>
              <p className="text-gray-600 mb-8">Tente ajustar seus filtros de pesquisa</p>
              <button
                onClick={() => {
                  setSearchParams(new URLSearchParams());
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold"
              >
                Limpar Filtros
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {colors.map((color) => (
                  <div
                    key={color.id}
                    className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                    onClick={() => {
                      setSelectedColor(color);
                      setIsModalOpen(true);
                    }}
                  >
                    <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 bg-white border border-gray-200">
                      {/* Área da cor principal - altura reduzida */}
                      <div className="relative">
                        <div
                          className="h-32 w-full rounded-t-2xl relative overflow-hidden"
                          style={{ backgroundColor: color.hex_code || '#CCCCCC' }}
                        >
                          {/* Reflexo sutil no hover */}
                          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                      
                      {/* Área de informações compacta */}
                      <div className="p-3 bg-white rounded-b-2xl">
                        <div className="text-center">
                          <h4 className="font-semibold text-gray-800 text-sm mb-1 truncate">{color.name}</h4>
                          <div className="text-xs text-gray-600 mb-2">
                            <span className="px-2 py-1 bg-gray-100 rounded-full font-mono">{color.hex_code}</span>
                          </div>
                          
                          {/* Códigos adicionais - layout mais compacto */}
                          <div className="flex flex-wrap justify-center gap-1 text-xs">
                            {color.ral_code && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                RAL {color.ral_code}
                              </span>
                            )}
                            {color.pantone_code && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                                {color.pantone_code}
                              </span>
                            )}
                            {color.ncs_code && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                                NCS {color.ncs_code}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-16 gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set('page', String(currentPage - 1));
                      setSearchParams(params);
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <i className="ri-arrow-left-line"></i>
                  </button>

                  {generatePageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set('page', String(pageNum));
                        setSearchParams(params);
                      }}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        pageNum === currentPage
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set('page', String(currentPage + 1));
                      setSearchParams(params);
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <i className="ri-arrow-right-line"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal de Detalhes da Cor */}
      {isModalOpen && selectedColor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300"
          >
            <div className="relative">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedColor(null);
                }}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white transition-all duration-200 shadow-lg"
              >
                <i className="ri-close-line text-xl"></i>
              </button>

              <div
                className="h-64 rounded-t-3xl relative overflow-hidden"
                style={{ backgroundColor: selectedColor.hex_code || '#CCCCCC' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h2 className="text-3xl font-bold mb-2">{selectedColor.name}</h2>
                  <p className="text-lg opacity-90">{selectedColor.hex_code}</p>
                </div>
              </div>

              <div className="p-8">
                {selectedColor.description && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Descrição</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedColor.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {selectedColor.ral_code && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <span className="font-semibold text-gray-700 block mb-1">Código RAL:</span>
                      <p className="text-gray-900 font-mono text-lg">{selectedColor.ral_code}</p>
                    </div>
                  )}
                  
                  {selectedColor.ncs_code && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <span className="font-semibold text-gray-700 block mb-1">Código NCS:</span>
                      <p className="text-gray-900 font-mono text-lg">{selectedColor.ncs_code}</p>
                    </div>
                  )}
                  
                  {selectedColor.pro_revest_code && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <span className="font-semibold text-gray-700 block mb-1">Código Pro Revest:</span>
                      <p className="text-gray-900 font-mono text-lg">{selectedColor.pro_revest_code}</p>
                    </div>
                  )}
                  
                  {selectedColor.category && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <span className="font-semibold text-gray-700 block mb-1">Categoria:</span>
                      <p className="text-gray-900">{selectedColor.category}</p>
                    </div>
                  )}
                  
                  {selectedColor.pantone_code && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <span className="font-semibold text-gray-700 block mb-1">Código Pantone:</span>
                      <p className="text-gray-900 font-mono">{selectedColor.pantone_code}</p>
                    </div>
                  )}
                </div>

                {/* Seção de Cores Similares */}
                {similarColors.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Cores Similares</h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {similarColors.map((color) => (
                        <div
                          key={color.id}
                          className="group cursor-pointer transform transition-all duration-200 hover:scale-105"
                          onClick={() => {
                            setSelectedColor(color);
                          }}
                        >
                          <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-all duration-200 bg-white border border-gray-200">
                            <div
                              className="h-16 w-full"
                              style={{ backgroundColor: color.hex_code || '#CCCCCC' }}
                            />
                            <div className="p-2 text-center">
                              <h4 className="font-medium text-gray-800 text-xs mb-1 truncate">{color.name}</h4>
                              <p className="text-xs text-gray-500 font-mono">{color.hex_code}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-6">
                  <button className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-4 px-6 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105">
                    Adicionar ao Projeto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer removed; Layout already renders global footer */}
    </div>
  );
}