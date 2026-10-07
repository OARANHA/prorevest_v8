import { type LoaderFunctionArgs } from "react-router-dom";

import { useLoaderData, useSearchParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "~/lib/supabaseClient";
import Layout from "~/components/Layout";

interface Color {
  id: number;
  name: string;
  hex_code: string;
  rgb_r: number;
  rgb_g: number;
  rgb_b: number;
  category?: string;
  subcategory?: string;
  finish?: string;
  brand?: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { data: colors, error } = await supabase
    .from('colors')
    .select('*')
    .order('name');

  if (error) {
    console.error('Erro ao carregar cores:', error);
    return { colors: [], error: error.message };
  }

  return { colors: colors || [] };
}

const COLORS_PER_PAGE = 24;

export default function Cores() {
  const { colors } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Estados para filtros e paginação
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedFinish, setSelectedFinish] = useState(searchParams.get("finish") || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Cores filtradas
  const filteredColors = useMemo(() => {
    return colors.filter((color: Color) => {
      const matchesSearch = color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           color.hex_code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || color.category === selectedCategory;
      const matchesFinish = !selectedFinish || color.finish === selectedFinish;
      
      return matchesSearch && matchesCategory && matchesFinish;
    });
  }, [colors, searchTerm, selectedCategory, selectedFinish]);

  // Paginação
  const totalPages = Math.ceil(filteredColors.length / COLORS_PER_PAGE);
  const startIndex = (currentPage - 1) * COLORS_PER_PAGE;
  const currentColors = filteredColors.slice(startIndex, startIndex + COLORS_PER_PAGE);

  // Resetar página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedFinish]);

  // Atualizar URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedFinish) params.set("finish", selectedFinish);
    setSearchParams(params);
  }, [searchTerm, selectedCategory, selectedFinish, setSearchParams]);

  // Obter categorias e acabamentos únicos
  const categories = [...new Set(colors.map((color: Color) => color.category).filter(Boolean))];
  const finishes = [...new Set(colors.map((color: Color) => color.finish).filter(Boolean))];

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-colors ${
            i === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🎨 Catálogo de Cores
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Explore nossa paleta completa com {colors.length} cores disponíveis
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filtros e Controles */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Busca */}
              <div>
                <label htmlFor="colors-search" className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar Cores
                </label>
                <input
                  id="colors-search"
                  name="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nome ou código hex..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Categoria */}
              <div>
                <label htmlFor="colors-category" className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  id="colors-category"
                  name="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas as categorias</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Acabamento */}
              <div>
                <label htmlFor="colors-finish" className="block text-sm font-medium text-gray-700 mb-2">
                  Acabamento
                </label>
                <select
                  id="colors-finish"
                  name="finish"
                  value={selectedFinish}
                  onChange={(e) => setSelectedFinish(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos os acabamentos</option>
                  {finishes.map((finish) => (
                    <option key={finish} value={finish}>
                      {finish}
                    </option>
                  ))}
                </select>
              </div>

              {/* Modo de Visualização */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visualização
                </label>
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 px-3 py-2 text-sm font-medium ${
                      viewMode === 'grid'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Grade
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex-1 px-3 py-2 text-sm font-medium ${
                      viewMode === 'list'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Lista
                  </button>
                </div>
              </div>
            </div>

            {/* Status e Navegação Superior */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                Mostrando {currentColors.length} de {filteredColors.length} cores
                {filteredColors.length !== colors.length && ` (filtradas de ${colors.length} total)`}
                {totalPages > 1 && ` • Página ${currentPage} de ${totalPages}`}
              </div>
              
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Grid de Cores */}
          {currentColors.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-8"
                : "space-y-4 mb-8"
            }>
              {currentColors.map((color: Color) => (
                <div
                  key={color.id}
                  className={
                    viewMode === 'grid'
                      ? "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      : "bg-white rounded-lg shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-shadow cursor-pointer"
                  }
                >
                  <div
                    className={
                      viewMode === 'grid'
                        ? "w-full h-24 border-b"
                        : "w-16 h-16 rounded-lg border"
                    }
                    style={{ backgroundColor: color.hex_code }}
                    title={`RGB(${color.rgb_r}, ${color.rgb_g}, ${color.rgb_b})`}
                  />
                  <div className={viewMode === 'grid' ? "p-3" : "flex-1"}>
                    <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">
                      {color.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-1">
                      {color.hex_code.toUpperCase()}
                    </p>
                    {viewMode === 'list' && (
                      <>
                        <p className="text-xs text-gray-400">
                          RGB({color.rgb_r}, {color.rgb_g}, {color.rgb_b})
                        </p>
                        {color.category && (
                          <p className="text-xs text-blue-600 mt-1">
                            {color.category}
                          </p>
                        )}
                        {color.finish && (
                          <p className="text-xs text-green-600">
                            {color.finish}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Nenhuma cor encontrada
              </h3>
              <p className="text-gray-500">
                Tente ajustar os filtros para encontrar as cores desejadas.
              </p>
            </div>
          )}

          {/* Navegação Inferior */}
          {totalPages > 1 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFirstPage}
                    disabled={currentPage === 1}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                  >
                    Primeira
                  </button>
                  <button
                    onClick={handleLastPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                  >
                    Última
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {renderPaginationNumbers()}
                </div>

                <div className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}