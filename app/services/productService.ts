import { supabase } from '../lib/supabaseClient';
import type { SupabaseClient } from '@supabase/supabase-js';

export type Category = {
  id: string;
  name: string;
  description: string;
  created_at: string;
};

export type Finish = {
  id: string;
  name: string;
  description: string;
  created_at: string;
};

export type Texture = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
  is_archived?: boolean;
  created_at: string;
  updated_at?: string;
};

export type Color = {
  id: string;
  name: string;
  hex_code: string;
  ral_code: string;
  pantone_code: string;
  ncs_code: string;
  is_archived: boolean;
  created_at: string;
  category?: string;
  pro_revest_code?: string;
  numeric_code?: string;
  rgb_info?: string;
  reference_number?: string;
  description?: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  full_description?: string;
  image_url?: string;
  technical_data: any;
  application_video_url: string;
  category_id: string;
  finish_id: string;
  is_featured: boolean;
  created_at: string;
  updated_at?: string;
  rating?: number;
  reviews?: number;
  badges?: string[];
  warranty?: {
    duration: string;
    description: string;
  };
  price?: number;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  texture_id: string;
  color_id: string;
  sku: string;
  image_url: string;
  created_at: string;
};

export type ProductWithDetails = Product & {
  categories: Category;
  finishes: Finish;
  product_colors: { colors: Color }[];
  product_variants: (ProductVariant & {
    textures: Texture;
    colors: Color;
  })[];
};

export class ProductService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = supabase;
  }

  async getCategories(): Promise<Category[]> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('is_archived', false)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async getFinishes(): Promise<Finish[]> {
    const { data, error } = await this.supabase
      .from('finishes')
      .select('*')
      .eq('is_archived', false)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async getTextures(): Promise<Texture[]> {
    const { data, error } = await this.supabase
      .from('textures')
      .select('*')
      .eq('is_archived', false)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async getColors(options?: { 
    limit?: number; 
    offset?: number; 
    category?: string;
    search?: string;
  }): Promise<{ colors: Color[]; total: number }> {
    try {
      // Primeiro, contar o total de cores
      let countQuery = this.supabase
        .from('colors')
        .select('*', { count: 'exact', head: true })
        .eq('is_archived', false);

      // Aplicar filtros na contagem
      if (options?.category && options.category !== 'Todos') {
        countQuery = countQuery.eq('category', options.category);
      }

      if (options?.search) {
        countQuery = countQuery.or(`name.ilike.%${options.search}%,hex_code.ilike.%${options.search}%,ral_code.ilike.%${options.search}%,pro_revest_code.ilike.%${options.search}%`);
      }

      const { count } = await countQuery;

      // Agora buscar as cores com paginação
      let query = this.supabase
        .from('colors')
        .select(`
          id,
          name,
          hex_code,
          ral_code,
          pantone_code,
          ncs_code,
          category,
          pro_revest_code,
          numeric_code,
          rgb_info,
          reference_number,
          description,
          is_archived,
          created_at
        `)
        .eq('is_archived', false)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      // Aplicar filtros
      if (options?.category && options.category !== 'Todos') {
        query = query.eq('category', options.category);
      }

      if (options?.search) {
        query = query.or(`name.ilike.%${options.search}%,hex_code.ilike.%${options.search}%,ral_code.ilike.%${options.search}%,pro_revest_code.ilike.%${options.search}%`);
      }

      // Aplicar paginação
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar cores:', error);
        return { colors: [], total: 0 };
      }

      return { 
        colors: data || [], 
        total: count || 0 
      };
    } catch (error) {
      console.error('Erro ao buscar cores:', error);
      return { colors: [], total: 0 };
    }
  }

  async getColorsByCategory(category?: string): Promise<Color[]> {
    try {
      let query = this.supabase
        .from('colors')
        .select(`
          id,
          name,
          hex_code,
          ral_code,
          pantone_code,
          ncs_code,
          category,
          pro_revest_code,
          numeric_code,
          rgb_info,
          reference_number,
          description,
          is_archived,
          created_at
        `)
        .eq('is_archived', false);

      if (category) {
        query = query.eq('category', category);
      }

      query = query.order('category', { ascending: true })
                   .order('name', { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar cores por categoria:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar cores por categoria:', error);
      return [];
    }
  }

  async getProducts(filters?: {
    category_id?: string;
    finish_id?: string;
    color_id?: string;
    search?: string;
    is_featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ProductWithDetails[]> {
    console.log('🔍 ProductService.getProducts chamado com filtros:', filters);
    
    let query = this.supabase
      .from('products')
      .select(`
        *,
        categories(*),
        finishes(*),
        product_variants(
          *,
          textures(*),
          colors(*)
        )
      `)
      .eq('is_archived', false);

    console.log('📋 Query inicial criada');

    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id);
      console.log('🏷️ Filtro category_id aplicado:', filters.category_id);
    }

    if (filters?.finish_id) {
      query = query.eq('finish_id', filters.finish_id);
      console.log('✨ Filtro finish_id aplicado:', filters.finish_id);
    }

    if (filters?.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured);
      console.log('⭐ Filtro is_featured aplicado:', filters.is_featured);
    }

    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
      console.log('🔍 Filtro search aplicado:', filters.search);
    }

    if (filters?.color_id) {
      query = query.eq('product_variants.color_id', filters.color_id);
      console.log('🎨 Filtro color_id aplicado:', filters.color_id);
    }

    query = query.order('name');

    if (filters?.limit) {
      query = query.limit(filters.limit);
      console.log('📊 Limite aplicado:', filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
      console.log('📄 Range aplicado:', filters.offset, 'até', (filters.offset + (filters.limit || 10)) - 1);
    }

    console.log('🚀 Executando query...');
    const { data, error } = await query;

    if (error) {
      console.error('❌ Erro na query:', error);
      throw error;
    }
    
    console.log('✅ Query executada com sucesso. Dados retornados:', data?.length || 0, 'produtos');
    if (data && data.length > 0) {
      console.log('📦 Primeiro produto:', data[0]);
    }
    
    return data || [];
  }

  async getProductsWithTotal(filters?: {
    category_id?: string;
    finish_id?: string;
    color_id?: string;
    search?: string;
    is_featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ products: ProductWithDetails[]; total: number }> {
    console.log('🔍 ProductService.getProductsWithTotal chamado com filtros:', filters);
    
    try {
      // Primeiro, contar o total de produtos
      let countQuery = this.supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_archived', false);

      // Aplicar os mesmos filtros na contagem
      if (filters?.category_id) {
        countQuery = countQuery.eq('category_id', filters.category_id);
      }

      if (filters?.finish_id) {
        countQuery = countQuery.eq('finish_id', filters.finish_id);
      }

      if (filters?.is_featured !== undefined) {
        countQuery = countQuery.eq('is_featured', filters.is_featured);
      }

      if (filters?.search) {
        countQuery = countQuery.ilike('name', `%${filters.search}%`);
      }

      const { count } = await countQuery;

      // Agora buscar os produtos com paginação
      const products = await this.getProducts(filters);

      return {
        products: products,
        total: count || 0
      };
    } catch (error) {
      console.error('❌ Erro ao buscar produtos com total:', error);
      return { products: [], total: 0 };
    }
  }

  async getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
    const { data, error } = await this.supabase
      .from('products')
      .select(`
        *,
        categories(*),
        finishes(*),
        product_variants(
          *,
          textures(*),
          colors(*)
        )
      `)
      .eq('slug', slug)
      .eq('is_archived', false)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Produto não encontrado
      }
      throw error;
    }

    return data;
  }

  async getProductById(id: string): Promise<ProductWithDetails | null> {
    const { data, error } = await this.supabase
      .from('products')
      .select(`
        *,
        categories(*),
        finishes(*),
        product_variants(
          *,
          textures(*),
          colors(*)
        )
      `)
      .eq('id', id)
      .eq('is_archived', false)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  }

  async getProductVariants(productId: string): Promise<ProductVariant[]> {
    const { data, error } = await this.supabase
      .from('product_variants')
      .select(`
        *,
        textures(*),
        colors(*)
      `)
      .eq('product_id', productId)
      .eq('is_available', true)
      .order('colors(name)');

    if (error) throw error;
    return data || [];
  }

  async getFeaturedProducts(limit: number = 8): Promise<ProductWithDetails[]> {
    return this.getProducts({ is_featured: true });
  }

  async searchProducts(searchTerm: string, limit: number = 20): Promise<ProductWithDetails[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select(`
        *,
        categories(*),
        finishes(*),
        product_variants(
          *,
          textures(*),
          colors(*)
        )
      `)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .eq('is_archived', false)
      .limit(limit)
      .order('is_featured', { ascending: false })
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async getSimilarProducts(productId: string, limit: number = 4): Promise<ProductWithDetails[]> {
    // Primeiro, buscar o produto atual para obter categoria e acabamento
    const currentProduct = await this.getProductById(productId);
    
    if (!currentProduct) {
      return [];
    }

    const { data, error } = await this.supabase
      .from('products')
      .select(`
        *,
        categories(*),
        finishes(*),
        product_variants(
          *,
          textures(*),
          colors(*)
        )
      `)
      .eq('category_id', currentProduct.category_id)
      .eq('finish_id', currentProduct.finish_id)
      .neq('id', productId)
      .eq('is_archived', false)
      .limit(limit)
      .order('is_featured', { ascending: false })
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async createProduct(productData: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
    const { data, error } = await this.supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    const { data, error } = await this.supabase
      .from('products')
      .update({ ...productData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('products')
      .update({ is_archived: true, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }

  async createProductVariant(variantData: Omit<ProductVariant, 'id' | 'created_at'>): Promise<ProductVariant> {
    const { data, error } = await this.supabase
      .from('product_variants')
      .insert(variantData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateProductVariant(id: string, variantData: Partial<ProductVariant>): Promise<ProductVariant> {
    const { data, error } = await this.supabase
      .from('product_variants')
      .update({ ...variantData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getProductStats(): Promise<{
    totalProducts: number;
    totalVariants: number;
    totalColors: number;
    featuredProducts: number;
  }> {
    const [products, variants, colors, featured] = await Promise.all([
      this.supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_archived', false),
      this.supabase.from('product_variants').select('*', { count: 'exact', head: true }).eq('is_available', true),
      this.supabase.from('colors').select('*', { count: 'exact', head: true }).eq('is_archived', false),
      this.supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_featured', true).eq('is_archived', false)
    ]);

    return {
      totalProducts: products.count || 0,
      totalVariants: variants.count || 0,
      totalColors: colors.count || 0,
      featuredProducts: featured.count || 0
    };
  }

  static async getTextures(): Promise<Texture[]> {
    try {
      const { data, error } = await supabase
        .from('textures')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching textures:', error);
      throw error;
    }
  }

  static async getColors(): Promise<Color[]> {
    try {
      const { data, error } = await supabase
        .from('colors')
        .select('*')
        .eq('is_archived', false)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching colors:', error);
      throw error;
    }
  }

  static async getProducts(filters?: {
    category_id?: string;
    finish_id?: string;
    color_id?: string;
    search?: string;
  }): Promise<ProductWithDetails[]> {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories(*),
          finishes(*),
          product_colors(colors(*)),
          product_variants(
            *,
            textures(*),
            colors(*)
          )
        `);

      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id);
      }

      if (filters?.finish_id) {
        query = query.eq('finish_id', filters.finish_id);
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      query = query.order('name');

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  static async getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(*),
          finishes(*),
          product_colors(colors(*)),
          product_variants(
            *,
            textures(*),
            colors(*)
          )
        `)
        .eq('slug', slug);

      if (error) throw error;
      
      // Se não houver resultados, retornar null
      if (!data || data.length === 0) {
        return null;
      }
      
      // Retornar o primeiro resultado
      return data[0];
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      throw error;
    }
  }

  static async getProductVariant(id: string): Promise<ProductVariant | null> {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching product variant:', error);
      throw error;
    }
  }

  // Novo método para buscar todos os produtos (não apenas os em destaque)
  static async getAllProducts(filters?: {
    category_id?: string;
    finish_id?: string;
    color_id?: string;
    search?: string;
  }): Promise<ProductWithDetails[]> {
    try {
      console.log('🔍 ProductService.getAllProducts chamado com filtros:', filters);
      
      let query = supabase
        .from('products')
        .select(`
          *,
          categories(*),
          finishes(*),
          product_variants(
            *,
            textures(*),
            colors(*)
          )
        `);

      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id);
      }

      if (filters?.finish_id) {
        query = query.eq('finish_id', filters.finish_id);
      }

      if (filters?.color_id) {
        query = query.eq('color_id', filters.color_id);
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      query = query.order('name');

      console.log('🚀 Executando query getAllProducts...');
      const { data, error } = await query;

      if (error) {
        console.error('❌ Erro na query getAllProducts:', error);
        throw error;
      }
      
      console.log('✅ getAllProducts executado com sucesso. Produtos encontrados:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching all products:', error);
      throw error;
    }
  }

  // Novo método para buscar produtos similares
  static async getSimilarProducts(productId: string, limit: number = 4): Promise<ProductWithDetails[]> {
    try {
      // Se o produto não existir no banco de dados, retornar array vazio
      if (!productId || productId === "textura-3d-id") {
        return [];
      }
      
      // Primeiro, obtemos o produto atual para saber sua categoria e acabamento
      const { data: currentProduct, error: productError } = await supabase
        .from('products')
        .select('category_id, finish_id')
        .eq('id', productId)
        .single();

      if (productError) {
        console.log('Produto não encontrado no banco de dados, retornando array vazio');
        return [];
      }

      // Agora buscamos produtos similares com a mesma categoria ou acabamento
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(*),
          finishes(*),
          product_colors(colors(*)),
          product_variants(
            *,
            textures(*),
            colors(*)
          )
        `)
        .or(`category_id.eq.${currentProduct.category_id},finish_id.eq.${currentProduct.finish_id}`)
        .neq('id', productId) // Excluímos o produto atual
        .limit(limit);

      if (error) {
        console.log('Erro ao buscar produtos similares, retornando array vazio');
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching similar products:', error);
      return [];
    }
  }

  // Novo método para buscar avaliações de produtos
  static async getProductRatings(productId: string): Promise<{ 
    average_rating: number; 
    total_reviews: number;
    ratings_distribution: { [key: number]: number }
  }> {
    try {
      // Esta é uma implementação de exemplo - em um sistema real, 
      // você teria uma tabela de avaliações no banco de dados
      return {
        average_rating: 4.5,
        total_reviews: 12,
        ratings_distribution: {
          5: 7,
          4: 3,
          3: 2,
          2: 0,
          1: 0
        }
      };
    } catch (error) {
      console.error('Error fetching product ratings:', error);
      throw error;
    }
  }
}

// Exportar uma instância do ProductService para uso nos componentes
export const productService = new ProductService();
