const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function importColorsToDatabase() {
  try {
    // Ler o arquivo de cores processadas melhorado
    const colorsPath = path.join(__dirname, '..', 'processed-colors-improved.json');
    
    if (!fs.existsSync(colorsPath)) {
      console.error('Arquivo processed-colors-improved.json não encontrado!');
      console.log('Execute primeiro: node scripts/process-colors-excel-improved.cjs');
      return;
    }

    const colorsData = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));
    console.log(`Importando ${colorsData.length} cores para o banco de dados...`);

    // Dividir em lotes para evitar timeout
    const batchSize = 100;
    let imported = 0;
    let errors = 0;

    for (let i = 0; i < colorsData.length; i += batchSize) {
      const batch = colorsData.slice(i, i + batchSize);
      
      console.log(`Processando lote ${Math.floor(i/batchSize) + 1}/${Math.ceil(colorsData.length/batchSize)}...`);
      
      try {
        const { data, error } = await supabase
          .from('colors')
          .insert(batch);

        if (error) {
          console.error('Erro no lote:', error);
          errors += batch.length;
        } else {
          imported += batch.length;
          console.log(`✓ Lote importado com sucesso (${batch.length} cores)`);
        }
      } catch (batchError) {
        console.error('Erro ao processar lote:', batchError);
        errors += batch.length;
      }

      // Pequena pausa entre lotes
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n=== Resumo da Importação ===`);
    console.log(`Total de cores: ${colorsData.length}`);
    console.log(`Importadas com sucesso: ${imported}`);
    console.log(`Erros: ${errors}`);

    // Verificar quantas cores foram realmente inseridas
    const { count } = await supabase
      .from('colors')
      .select('*', { count: 'exact', head: true });

    console.log(`Total de cores no banco: ${count}`);

  } catch (error) {
    console.error('Erro geral na importação:', error);
  }
}

// Função para verificar conexão com o banco
async function testConnection() {
  try {
    const { count, error } = await supabase
      .from('colors')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Erro de conexão:', error);
      return false;
    }

    console.log('✓ Conexão com o banco estabelecida');
    return true;
  } catch (error) {
    console.error('Erro ao testar conexão:', error);
    return false;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  console.log('Testando conexão com o banco...');
  testConnection().then(connected => {
    if (connected) {
      importColorsToDatabase();
    } else {
      console.log('\n❌ Não foi possível conectar ao banco de dados.');
      console.log('Verifique se:');
      console.log('1. As variáveis de ambiente estão configuradas corretamente');
      console.log('2. O Supabase está rodando');
      console.log('3. As migrações foram executadas');
    }
  });
}

module.exports = { importColorsToDatabase };