import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Search, X, LogOut, Package, DollarSign, Star, Shield, Image as ImageIcon } from "lucide-react";
import { productService, type ProductWithDetails, type Category, type Finish, type Texture, type Color } from "../../services/productService";
import { ImageUpload } from "../../components/ImageUpload";
import { useAuth } from "../../contexts/AuthContext";

export const meta: MetaFunction = () => {
  return [
    { title: "Gestão de Produtos - ProRevest" },
    { name: "description", content: "Gerencie o catálogo de produtos da ProRevest" },
  ];
}

export default function AdminProducts() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<ProductWithDetails[]>([]);
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Estados para dados auxiliares
  const [categories, setCategories] = useState<Category[]>([]);
  const [finishes, setFinishes] = useState<Finish[]>([]);
  const [textures, setTextures] = useState<Texture[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  
  // Estados para modal de produto
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithDetails | null>(null);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("basic");
  
  // Formulário principal do produto
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    description: "",
    full_description: "",
    image_url: "",
    technical_data: {
      composition: "",
      yield: "",
      dryingTime: "",
      voc: "",
      certifications: [] as string[],
      coverage: "",
      applicationMethod: "",
      dilution: "",
      cleaning: "",
      glossLevel: "",
      durability: "",
      washability: "",
      vocEmission: ""
    },
    application_video_url: "",
    category_id: "",
    finish_id: "",
    is_featured: false,
    rating: 0,
    reviews: 0,
    badges: [] as string[],
    warranty: {
      duration: "",
      description: ""
    },
    price: 0
  });

  // Formulário de variante
  const [variantForm, setVariantForm] = useState({
    product_id: "",
    texture_id: "",
    color_id: "",
    sku: "",
    image_url: "",
    is_available: true
  });

  // Carregar dados auxiliares
  useEffect(() => {
    const loadAuxData = async () => {
      try {
        const [categoriesData, finishesData, texturesData, colorsData] = await Promise.all([
          productService.getCategories(),
          productService.getFinishes(),
          productService.getTextures(),
          productService.getColors()
        ]);
        setCategories(categoriesData);
        setFinishes(finishesData);
        setTextures(texturesData);
        setColors(colorsData.colors || []);
      } catch (error) {
        console.error("Erro ao carregar dados auxiliares:", error);
      }
    };

    loadAuxData();
  }, []);

  // Carregar produtos e verificar parâmetro de edição
  useEffect(() => {
    const loadProducts = async () => {
      setLoadError(null);
      try {
        console.log("📞 AdminProducts: Chamando productService.getProducts()...");
        const productsData = await productService.getProducts();
        console.log("✅ AdminProducts: Produtos recebidos:", productsData);
        console.log("📊 AdminProducts: Quantidade de produtos:", productsData?.length || 0);
        
        setProducts(productsData);
        setFilteredProducts(productsData);
        console.log("💾 AdminProducts: Estado atualizado com produtos");

        // Verificar parâmetro de edição na URL
        const urlParams = new URLSearchParams(window.location.search);
        const editProductId = urlParams.get('edit');
        
        if (editProductId) {
          console.log("🔍 AdminProducts: Parâmetro edit encontrado:", editProductId);
          const productToEdit = productsData.find(p => p.id === editProductId);
          
          if (productToEdit) {
            console.log("✅ AdminProducts: Produto encontrado para edição:", productToEdit.name);
            // Abrir modal de edição automaticamente
            setTimeout(() => {
              handleEditProduct(productToEdit);
            }, 500);
          } else {
            console.log("❌ AdminProducts: Produto não encontrado para edição:", editProductId);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        setLoadError("Não foi possível carregar os produtos. Verifique a conexão e tente novamente.");
      } finally {
        console.log("🏁 AdminProducts: Finalizando carregamento, setLoading(false)");
        setLoading(false);
      }
    };

    loadProducts();
  }, [loadAttempt]);

  // Filtrar produtos com base no termo de busca
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.categories?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);
  useEffect(() => { setCurrentPage(p => Math.min(p, Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage)))); }, [filteredProducts.length, itemsPerPage]);

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        setFilteredProducts(filteredProducts.filter(p => p.id !== id));
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        alert("Erro ao excluir produto. Tente novamente.");
      }
    }
  };

  // Função para sair/logout
  const handleLogout = async () => {
    if (!confirm("Tem certeza que deseja sair?")) return;
    try {
      const { error } = await signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error) {
      console.error("Erro ao encerrar a sessão:", error);
      alert("Não foi possível encerrar a sessão. Tente novamente.");
    }
  };

  // Função para abrir modal de novo produto
  const handleNewProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      slug: "",
      description: "",
      full_description: "",
      image_url: "",
      technical_data: {
        composition: "",
        yield: "",
        dryingTime: "",
        voc: "",
        certifications: [] as string[],
        coverage: "",
        applicationMethod: "",
        dilution: "",
        cleaning: "",
        glossLevel: "",
        durability: "",
        washability: "",
        vocEmission: ""
      },
      application_video_url: "",
      category_id: "",
      finish_id: "",
      is_featured: false,
      rating: 0,
      reviews: 0,
      badges: [] as string[],
      warranty: {
        duration: "",
        description: ""
      },
      price: 0
    });
    setShowProductModal(true);
    setActiveTab("basic");
  };

  // Função para abrir modal de edição
  const handleEditProduct = (product: ProductWithDetails) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      full_description: product.full_description || "",
      image_url: product.image_url || "",
      technical_data: product.technical_data || {
        composition: "",
        yield: "",
        dryingTime: "",
        voc: "",
        certifications: [] as string[],
        coverage: "",
        applicationMethod: "",
        dilution: "",
        cleaning: "",
        glossLevel: "",
        durability: "",
        washability: "",
        vocEmission: ""
      },
      application_video_url: product.application_video_url || "",
      category_id: product.category_id || "",
      finish_id: product.finish_id || "",
      is_featured: product.is_featured,
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      badges: product.badges || [] as string[],
      warranty: product.warranty || {
        duration: "",
        description: ""
      },
      price: product.price || 0
    });
    setShowProductModal(true);
    setActiveTab("basic");
  };

  // Função para salvar produto (criar ou editar)
  const handleSaveProduct = async () => {
    try {
      // Gerar slug a partir do nome se não fornecido
      const slug = productForm.slug || productForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-');
      
      const productData = {
        ...productForm,
        slug
      };

      if (editingProduct) {
        // Editar produto existente
        await productService.updateProduct(editingProduct.id, productData);
        const updatedProducts = products.map(p => 
          p.id === editingProduct.id ? { ...p, ...productData } : p
        ) as ProductWithDetails[];
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
      } else {
        // Criar novo produto
        const newProduct = await productService.createProduct(productData);
        const updatedProducts = [...products, newProduct] as ProductWithDetails[];
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
      }
      setShowProductModal(false);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto. Tente novamente.");
    }
  };

  // Função para salvar variante
  const handleSaveVariant = async () => {
    try {
      if (editingVariant) {
        await productService.updateProductVariant(editingVariant.id, variantForm);
      } else {
        await productService.createProductVariant(variantForm);
      }
      setShowVariantModal(false);
      // Recarregar produtos para atualizar as variantes
      const loadProducts = async () => {
        const productsData = await productService.getProducts();
        setProducts(productsData);
        setFilteredProducts(productsData);
      };
      loadProducts();
    } catch (error) {
      console.error("Erro ao salvar variante:", error);
      alert("Erro ao salvar variante. Tente novamente.");
    }
  };

  // Função para abrir modal de nova variante
  const handleNewVariant = (productId: string) => {
    setEditingVariant(null);
    setVariantForm({
      product_id: productId,
      texture_id: "",
      color_id: "",
      sku: "",
      image_url: "",
      is_available: true
    });
    setShowVariantModal(true);
  };

  // Função para abrir modal de edição de variante
  const handleEditVariant = (variant: any) => {
    setEditingVariant(variant);
    setVariantForm({
      product_id: variant.product_id,
      texture_id: variant.texture_id,
      color_id: variant.color_id,
      sku: variant.sku,
      image_url: variant.image_url,
      is_available: variant.is_available
    });
    setShowVariantModal(true);
  };

  // Cálculos de paginação
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Função para mudar página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (loadError) return <div role="alert" className="mx-auto max-w-3xl p-8 text-slate-100"><p>{loadError}</p><button type="button" className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white" onClick={() => { setLoading(true); setLoadAttempt(n => n + 1); }}>Tentar novamente</button></div>;

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
          <div>
            <h1 className="text-4xl font-cormorant font-bold text-slate-100 mb-2">Gestão de Produtos</h1>
            <p className="text-slate-300 text-lg">Gerencie o catálogo de produtos da ProRevest</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
            <button
              onClick={handleNewProduct}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Novo Produto
            </button>
          </div>
        </div>
      </div>

      {/* Barra de busca */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 h-6 w-6" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="w-full pl-14 pr-6 py-4 border border-slate-600 rounded-lg bg-slate-700/50 text-slate-200 text-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela de produtos */}
      <div className="bg-slate-800/50 border border-slate-600 rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-600">
          <thead className="bg-slate-900/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Produto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Categoria
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Acabamento
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Preço
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Variantes
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Destaque
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-800/50 divide-y divide-slate-600">
            {currentProducts.map((product) => (
              <tr key={product.id} className="hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-3 whitespace-nowrap">
                  <div className="font-semibold text-slate-100 text-sm">{product.name}</div>
                  <div className="text-xs text-slate-400 mt-1">{(product.description || "").length > 50 ? `${product.description.slice(0, 50)}…` : (product.description || "Sem descrição")}</div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-medium">
                    {product.categories?.name || 'Sem categoria'}
                  </span>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-slate-200 text-sm">
                  {product.finishes?.name || 'Sem acabamento'}
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  {product.price ? (
                    <span className="text-sm font-bold text-slate-100">R$ {product.price.toFixed(2)}</span>
                  ) : (
                    <span className="text-slate-400 text-xs">Não definido</span>
                  )}
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {product.product_variants?.slice(0, 3).map((variant, index) => (
                      <div
                        key={variant.id}
                        className="w-6 h-6 rounded border border-slate-600 overflow-hidden flex-shrink-0"
                        title={variant.colors?.name}
                      >
                        <div
                          className="w-full h-full"
                          style={{ backgroundColor: variant.colors?.hex_code || '#ccc' }}
                        />
                      </div>
                    ))}
                    {product.product_variants && product.product_variants.length > 3 && (
                      <span className="text-xs text-slate-400 bg-slate-700/50 px-1 py-0.5 rounded">+{product.product_variants.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  {product.is_featured ? (
                    <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded-full text-xs font-medium">
                      Sim
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-slate-600/20 text-slate-400 rounded-full text-xs font-medium">
                      Não
                    </span>
                  )}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-right text-xs font-medium">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-blue-400 hover:text-blue-300 p-1.5 hover:bg-slate-700/50 rounded transition-colors"
                      title="Editar produto"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleNewVariant(product.id)}
                      className="text-green-400 hover:text-green-300 p-1.5 hover:bg-slate-700/50 rounded transition-colors"
                      title="Adicionar variante"
                    >
                      <Package className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-400 hover:text-red-300 p-1.5 hover:bg-slate-700/50 rounded transition-colors"
                      title="Excluir produto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-lg text-slate-300">
          Mostrando {filteredProducts.length === 0 ? 0 : startIndex + 1} a {Math.min(endIndex, filteredProducts.length)} de {filteredProducts.length} resultados
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-slate-600 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>

          {/* Números das páginas */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 border rounded-lg text-base font-medium transition-colors ${
                currentPage === page
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-slate-600 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || totalPages === 0}
            className="px-4 py-2 border border-slate-600 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Próximo
          </button>
        </div>
      </div>

      {/* Modal para criar/editar produto */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Abas do formulário */}
            <div className="flex space-x-1 mb-6">
              <button
                onClick={() => setActiveTab("basic")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === "basic"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Informações Básicas
              </button>
              <button
                onClick={() => setActiveTab("technical")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === "technical"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Dados Técnicos
              </button>
              <button
                onClick={() => setActiveTab("media")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === "media"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Mídia e Garantia
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveProduct(); }}>
              {/* Aba: Informações Básicas */}
              {activeTab === "basic" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Imagem Principal do Produto
                    </label>
                    <ImageUpload
                      value={productForm.image_url || ''}
                      onChange={(url) => setProductForm({ ...productForm, image_url: url })}
                      placeholder="URL da imagem principal ou faça upload"
                      maxSize={5}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Produto *
                      </label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slug
                      </label>
                      <input
                        type="text"
                        value={productForm.slug}
                        onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="gerado-automaticamente"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoria *
                      </label>
                      <select
                        value={productForm.category_id}
                        onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="">Selecione uma categoria</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Acabamento *
                      </label>
                      <select
                        value={productForm.finish_id}
                        onChange={(e) => setProductForm({ ...productForm, finish_id: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="">Selecione um acabamento</option>
                        {finishes.map((finish) => (
                          <option key={finish.id} value={finish.id}>
                            {finish.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição Curta *
                    </label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição Completa
                    </label>
                    <textarea
                      value={productForm.full_description}
                      onChange={(e) => setProductForm({ ...productForm, full_description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows={5}
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={productForm.is_featured}
                      onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                      Produto em destaque
                    </label>
                  </div>
                </div>
              )}

              {/* Aba: Dados Técnicos */}
              {activeTab === "technical" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Composição
                      </label>
                      <input
                        type="text"
                        value={productForm.technical_data.composition}
                        onChange={(e) => setProductForm({
                          ...productForm,
                          technical_data: { ...productForm.technical_data, composition: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rendimento
                      </label>
                      <input
                        type="text"
                        value={productForm.technical_data.yield}
                        onChange={(e) => setProductForm({
                          ...productForm,
                          technical_data: { ...productForm.technical_data, yield: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tempo de Secagem
                      </label>
                      <input
                        type="text"
                        value={productForm.technical_data.dryingTime}
                        onChange={(e) => setProductForm({
                          ...productForm,
                          technical_data: { ...productForm.technical_data, dryingTime: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emissão de COV
                      </label>
                      <input
                        type="text"
                        value={productForm.technical_data.voc}
                        onChange={(e) => setProductForm({
                          ...productForm,
                          technical_data: { ...productForm.technical_data, voc: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cobertura
                      </label>
                      <input
                        type="text"
                        value={productForm.technical_data.coverage}
                        onChange={(e) => setProductForm({
                          ...productForm,
                          technical_data: { ...productForm.technical_data, coverage: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Método de Aplicação
                      </label>
                      <input
                        type="text"
                        value={productForm.technical_data.applicationMethod}
                        onChange={(e) => setProductForm({
                          ...productForm,
                          technical_data: { ...productForm.technical_data, applicationMethod: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Diluição
                      </label>
                      <input
                        type="text"
                        value={productForm.technical_data.dilution}
                        onChange={(e) => setProductForm({
                          ...productForm,
                          technical_data: { ...productForm.technical_data, dilution: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Limpeza
                      </label>
                      <input
                        type="text"
                        value={productForm.technical_data.cleaning}
                        onChange={(e) => setProductForm({
                          ...productForm,
                          technical_data: { ...productForm.technical_data, cleaning: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certificações (separadas por vírgula)
                    </label>
                    <input
                      type="text"
                      value={productForm.technical_data.certifications?.join(', ') || ''}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        technical_data: {
                          ...productForm.technical_data,
                          certifications: e.target.value.split(',').map(c => c.trim())
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Ex: GREENGUARD, LEED Compliant"
                    />
                  </div>
                </div>
              )}

              {/* Aba: Mídia e Garantia */}
              {activeTab === "media" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL do Vídeo de Aplicação
                    </label>
                    <input
                      type="url"
                      value={productForm.application_video_url}
                      onChange={(e) => setProductForm({ ...productForm, application_video_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="https://example.com/video.mp4"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preço (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Avaliação (0-5)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={productForm.rating}
                        onChange={(e) => setProductForm({ ...productForm, rating: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Badges (separadas por vírgula)
                    </label>
                    <input
                      type="text"
                      value={productForm.badges?.join(', ') || ''}
                      onChange={(e) => setProductForm({
                        ...productForm,
                        badges: e.target.value.split(',').map(b => b.trim())
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Ex: Mais Vendido, Eco Friendly"
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Garantia</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duração
                        </label>
                        <input
                          type="text"
                          value={productForm.warranty?.duration || ''}
                          onChange={(e) => setProductForm({
                            ...productForm,
                            warranty: {
                              ...productForm.warranty,
                              duration: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Ex: 7 anos"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descrição da Garantia
                        </label>
                        <textarea
                          value={productForm.warranty?.description || ''}
                          onChange={(e) => setProductForm({
                            ...productForm,
                            warranty: {
                              ...productForm.warranty,
                              description: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          rows={3}
                          placeholder="Descrição das condições de garantia"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
                >
                  {editingProduct ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para criar/editar variante */}
      {showVariantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingVariant ? 'Editar Variante' : 'Nova Variante'}
              </h2>
              <button
                onClick={() => setShowVariantModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleSaveVariant(); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Textura
                  </label>
                  <select
                    value={variantForm.texture_id}
                    onChange={(e) => setVariantForm({ ...variantForm, texture_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Selecione uma textura</option>
                    {textures.map((texture) => (
                      <option key={texture.id} value={texture.id}>
                        {texture.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cor
                  </label>
                  <select
                    value={variantForm.color_id}
                    onChange={(e) => setVariantForm({ ...variantForm, color_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Selecione uma cor</option>
                    {colors.map((color) => (
                      <option key={color.id} value={color.id}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={variantForm.sku}
                    onChange={(e) => setVariantForm({ ...variantForm, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imagem da Variante
                  </label>
                  <ImageUpload
                    value={variantForm.image_url}
                    onChange={(url) => setVariantForm({ ...variantForm, image_url: url })}
                    placeholder="URL da imagem da variante ou faça upload"
                    maxSize={5}
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_available"
                    checked={variantForm.is_available}
                    onChange={(e) => setVariantForm({ ...variantForm, is_available: e.target.checked })}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="is_available" className="ml-2 block text-sm text-gray-700">
                    Disponível para venda
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowVariantModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
                >
                  {editingVariant ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
