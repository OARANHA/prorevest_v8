const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Dados de exemplo para produtos de tinta
const sampleProducts = [
  {
    name: "Tinta Acrílica Premium Branca",
    slug: "tinta-acrilica-premium-branca",
    description: "Tinta acrílica de alta qualidade para ambientes internos e externos",
    technical_data: {
      composition: "Resina acrílica, água, pigmentos e aditivos especiais",
      yield: "12m² por litro por demão",
      drying_time: "2-4 horas ao toque, 6 horas entre demãos",
      coats: "2 demãos recomendadas",
      support: "Alvenaria, reboco, gesso, drywall e superfícies já pintadas",
      cleaning: "Água e sabão neutro",
      dilution: "Até 20% com água limpa",
      warranty: {
        duration: "5 anos",
        description: "Garantia contra descascamento, desbotamento e formação de fungos"
      },
      badges: ["Eco-friendly", "Alta cobertura", "Fácil aplicação", "Lavável"],
      rating: 4.8,
      reviews: 156
    },
    is_featured: true
  },
  {
    name: "Esmalte Sintético Acetinado",
    slug: "esmalte-sintetico-acetinado",
    description: "Esmalte sintético de alta qualidade com acabamento acetinado",
    technical_data: {
      composition: "Resinas alquídicas, solventes, pigmentos e aditivos",
      yield: "10m² por litro por demão",
      drying_time: "4-6 horas ao toque, 12 horas entre demãos",
      coats: "2 demãos recomendadas",
      support: "Madeira, metal, alvenaria preparada",
      cleaning: "Thinner ou aguarrás",
      dilution: "Até 10% com thinner",
      warranty: {
        duration: "3 anos",
        description: "Garantia contra descascamento e perda de brilho"
      },
      badges: ["Alta resistência", "Acabamento premium", "Proteção UV"],
      rating: 4.6,
      reviews: 89
    },
    is_featured: true
  },
  {
    name: "Tinta Texturizada Rústica",
    slug: "tinta-texturizada-rustica",
    description: "Tinta com efeito texturizado para acabamentos especiais",
    technical_data: {
      composition: "Resina acrílica, cargas minerais, água e aditivos texturizantes",
      yield: "8m² por litro por demão",
      drying_time: "6-8 horas ao toque, 24 horas para cura completa",
      coats: "1 demão geralmente suficiente",
      support: "Alvenaria, reboco, gesso preparado",
      cleaning: "Água e sabão neutro",
      application: "Rolo de lã, desempenadeira ou espátula",
      warranty: {
        duration: "7 anos",
        description: "Garantia contra descascamento e alteração de textura"
      },
      badges: ["Efeito decorativo", "Esconde imperfeições", "Durabilidade superior"],
      rating: 4.4,
      reviews: 67
    },
    is_featured: false
  }
];

async function createSampleProducts() {
  try {
    console.log('Criando produtos de exemplo...');

    // Primeiro, vamos buscar as categorias e acabamentos existentes
    const { data: categories, error: categoriesError } = await supabase.from('categories').select('*').limit(1);
    const { data: finishes, error: finishesError } = await supabase.from('finishes').select('*').limit(1);
    const { data: textures, error: texturesError } = await supabase.from('textures').select('*').limit(1);
    const { data: colors, error: colorsError } = await supabase.from('colors').select('*').limit(20);

    if (categoriesError || finishesError || texturesError) {
      console.error('Erro: Categorias, acabamentos ou texturas não encontrados no banco');
      console.log('Execute primeiro as migrações para criar a estrutura básica');
      return;
    }

    console.log(`Encontradas: ${categories?.length || 0} categorias, ${finishes?.length || 0} acabamentos, ${textures?.length || 0} texturas`);

    // Mapear produtos com IDs reais
    const productsToInsert = sampleProducts.map((product, index) => ({
      ...product,
      category_id: categories?.[index % (categories?.length || 1)]?.id,
      finish_id: finishes?.[index % (finishes?.length || 1)]?.id
    }));

    // Inserir produtos
    const { data: insertedProducts, error: productsError } = await supabase
      .from('products')
      .insert(productsToInsert)
      .select();

    if (productsError) {
      console.error('Erro ao inserir produtos:', productsError);
      return;
    }

    console.log(`✓ ${insertedProducts?.length || 0} produtos criados com sucesso`);

    // Criar variantes de cor para cada produto
    if (colors && colors.length > 0) {
      console.log('Criando variantes de cor...');
      
      const variants = [];
      
      insertedProducts?.forEach((product, productIndex) => {
        // Criar 3-5 variantes por produto
        const numVariants = Math.min(5, colors.length);
        const productColors = colors.slice(0, numVariants);
        
        productColors.forEach((color, colorIndex) => {
          variants.push({
            product_id: product.id,
            color_id: color.id,
            texture_id: textures?.[0]?.id, // Usar primeira textura como padrão
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

// Função para verificar se as tabelas existem
async function checkTables() {
  try {
    const tables = ['categories', 'finishes', 'textures', 'colors', 'products', 'product_variants'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`❌ Tabela '${table}' não existe ou não é acessível:`, error.message);
        return false;
      }
    }
    
    console.log('✓ Todas as tabelas necessárias estão disponíveis');
    return true;
  } catch (error) {
    console.error('Erro ao verificar tabelas:', error);
    return false;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  console.log('Verificando estrutura do banco...');
  checkTables().then(tablesOk => {
    if (tablesOk) {
      createSampleProducts();
    } else {
      console.log('\n❌ Estrutura do banco não está pronta.');
      console.log('Tentando criar tabelas automaticamente...');
      createSampleProducts();
    }
  });
}

module.exports = { createSampleProducts };