require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY; // Usar anon key por enquanto

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createSampleProducts() {
  try {
    console.log('Verificando estrutura do banco...');

    // Verificar se as tabelas existem
    const { data: categories } = await supabase.from('categories').select('*').limit(1);
    const { data: finishes } = await supabase.from('finishes').select('*').limit(1);
    const { data: textures } = await supabase.from('textures').select('*').limit(1);
    const { data: colors } = await supabase.from('colors').select('*').limit(1);

    console.log(`✓ Encontradas: ${categories?.length || 0} categorias, ${finishes?.length || 0} acabamentos, ${textures?.length || 0} texturas, ${colors?.length || 0} cores`);

    // Inserir algumas cores se não existirem
    if (!colors || colors.length === 0) {
      console.log('Inserindo cores básicas...');
      const { data: insertedColors, error: colorsError } = await supabase
        .from('colors')
        .insert([
          { name: "Branco", hex_code: "#FFFFFF", category: "Neutras" },
          { name: "Preto", hex_code: "#000000", category: "Neutras" },
          { name: "Cinza", hex_code: "#808080", category: "Neutras" },
          { name: "Azul", hex_code: "#0066CC", category: "Vivas" },
          { name: "Verde", hex_code: "#00AA44", category: "Vivas" },
          { name: "Vermelho", hex_code: "#CC0000", category: "Vivas" }
        ])
        .select();

      if (colorsError) {
        console.error('Erro ao inserir cores:', colorsError);
        return;
      }
      console.log(`✓ ${insertedColors?.length || 0} cores criadas`);
    }

    // Buscar dados necessários
    const { data: allCategories } = await supabase.from('categories').select('*');
    const { data: allFinishes } = await supabase.from('finishes').select('*');
    const { data: allTextures } = await supabase.from('textures').select('*');
    const { data: allColors } = await supabase.from('colors').select('*');

    if (!allCategories?.length || !allFinishes?.length || !allTextures?.length || !allColors?.length) {
      console.error('❌ Dados básicos não encontrados no banco');
      return;
    }

    console.log('Criando produtos de exemplo...');

    // Criar produtos de exemplo
    const sampleProducts = [
      {
        name: 'Tinta Acrílica Premium',
        slug: 'tinta-acrilica-premium',
        description: 'Tinta acrílica de alta qualidade para interiores',
        category_id: categories[0].id,
        finish_id: finishes[0].id,
        price: 89.90,
        is_featured: true,
        rating: 4.5,
        reviews: 25
      },
      {
        name: 'Tinta Látex Econômica',
        slug: 'tinta-latex-economica',
        description: 'Tinta látex com ótimo custo-benefício',
        category_id: categories[0].id,
        finish_id: finishes[0].id,
        price: 45.90,
        is_featured: false,
        rating: 4.0,
        reviews: 15
      },
      {
        name: 'Tinta Texturizada Especial',
        slug: 'tinta-texturizada-especial',
        description: 'Tinta com efeito texturizado único',
        category_id: categories[0].id,
        finish_id: finishes[0].id,
        price: 125.90,
        is_featured: true,
        rating: 4.8,
        reviews: 40
      }
    ];

    const { data: insertedProducts, error: productsError } = await supabase
      .from('products')
      .insert(sampleProducts)
      .select();

    if (productsError) {
      console.error('Erro ao inserir produtos:', productsError);
      return;
    }

    console.log(`✓ ${insertedProducts?.length || 0} produtos criados com sucesso`);

    // Criar variantes de cor para cada produto
    if (allColors && allColors.length > 0) {
      console.log('Criando variantes de cor...');
      
      const variants = [];
      
      insertedProducts?.forEach((product, productIndex) => {
        // Criar 3-5 variantes por produto
        const numVariants = Math.min(5, allColors.length);
        const productColors = allColors.slice(0, numVariants);
        
        productColors.forEach((color, colorIndex) => {
          variants.push({
            product_id: product.id,
            color_id: color.id,
            texture_id: allTextures?.[0]?.id, // Usar primeira textura como padrão
            sku: `${product.slug.toUpperCase().replace(/-/g, '')}-${color.name.replace(/\s+/g, '').toUpperCase()}-1L`,
            image_url: `https://via.placeholder.com/400x400/${color.hex_code?.replace('#', '') || 'CCCCCC'}/FFFFFF?text=${encodeURIComponent(color.name)}`,
            price_modifier: colorIndex === 0 ? 0 : (Math.random() * 20 - 10), // Variação de preço aleatória
            is_available: true,
            stock_quantity: Math.floor(Math.random() * 100) + 10
          });
        });
      });

      const { data: insertedVariants, error: variantsError } = await supabase
        .from('product_variants')
        .insert(variants)
        .select();

      if (variantsError) {
        console.error('Erro ao inserir variantes:', variantsError);
      } else {
        console.log(`✓ ${insertedVariants?.length || 0} variantes de cor criadas`);
      }
    }

    console.log('\n=== Produtos criados com sucesso! ===');
    insertedProducts?.forEach(product => {
      console.log(`- ${product.name} (${product.slug})`);
    });

  } catch (error) {
    console.error('Erro geral:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createSampleProducts();
}

module.exports = { createSampleProducts };