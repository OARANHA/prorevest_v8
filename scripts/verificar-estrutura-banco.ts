// Script para verificar estrutura real da tabela profiles
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY!
);

async function verificarEstrutura() {
  console.log('=== VERIFICAÇÃO DA ESTRUTURA DO BANCO ===\n');
  
  try {
    // 1. Verificar estrutura da tabela profiles
    console.log('1. Verificando estrutura da tabela profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(3);
      
    if (profilesError) {
      console.error('❌ Erro ao buscar profiles:', profilesError);
    } else {
      console.log('✅ Dados de profiles encontrados:');
      if (profiles && profiles.length > 0) {
        console.log('   Estrutura:', Object.keys(profiles[0]));
        profiles.forEach((profile, index) => {
          console.log(`   [${index + 1}] ID: ${profile.id}`);
          console.log(`       Email: ${profile.email || 'NÃO EXISTE'}`);
          console.log(`       Nome: ${profile.full_name || 'NÃO DEFINIDO'}`);
          console.log(`       Role: ${profile.role || 'NÃO DEFINIDO'}`);
          console.log('');
        });
      } else {
        console.log('   ⚠️ Nenhum perfil encontrado');
      }
    }
    
    // 2. Verificar informações de colunas
    console.log('\n2. Verificando informações das colunas...');
    try {
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_name', 'profiles')
        .eq('table_schema', 'public');
        
      if (columnsError) {
        console.log('   ⚠️ Não foi possível verificar colunas (sem permissão de sistema)');
      } else {
        console.log('   Colunas encontradas:');
        columns?.forEach(col => {
          console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'required'})`);
        });
      }
    } catch (err) {
      console.log('   ⚠️ Erro ao verificar colunas:', err.message);
    }
    
    // 3. Tentar buscar apenas campos específicos
    console.log('\n3. Testando busca de campos específicos...');
    const camposParaTestar = [
      ['id', 'full_name', 'role'],
      ['id', 'full_name', 'role', 'email'],
      ['id', 'full_name', 'role', 'email', 'created_at'],
      ['*']
    ];
    
    for (const campos of camposParaTestar) {
      try {
        console.log(`   Testando campos: [${campos.join(', ')}]`);
        const { data: testData, error: testError } = await supabase
          .from('profiles')
          .select(campos.join(', '))
          .limit(1);
          
        if (testError) {
          console.log(`     ❌ Erro: ${testError.message}`);
        } else {
          console.log(`     ✅ Sucesso! Encontrados ${testData?.length || 0} registros`);
          if (testData && testData.length > 0) {
            console.log(`     Estrutura: ${Object.keys(testData[0]).join(', ')}`);
          }
          break; // Se funcionou, não precisa testar os outros
        }
      } catch (err) {
        console.log(`     ❌ Exceção: ${(err as Error).message}`);
      }
    }
    
    // 4. Verificar se há uma tabela users alternativa
    console.log('\n4. Verificando tabelas alternativas...');
    try {
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
        
      if (tablesError) {
        console.log('   ⚠️ Não foi possível listar tabelas');
      } else {
        const userTables = tables?.filter(t => 
          t.table_name.includes('user') || 
          t.table_name.includes('profile') ||
          t.table_name.includes('auth')
        );
        
        console.log('   Tabelas relacionadas a usuários:');
        userTables?.forEach(table => {
          console.log(`   - ${table.table_name}`);
        });
      }
    } catch (err) {
      console.log('   ⚠️ Erro ao listar tabelas:', err.message);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar verificação
verificarEstrutura().then(() => {
  console.log('\n=== FIM DA VERIFICAÇÃO ===');
  process.exit(0);
}).catch(error => {
  console.error('Erro na verificação:', error);
  process.exit(1);
});