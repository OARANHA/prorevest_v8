// Script para debug do carregamento de usuários
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_KEY!
);

async function debugUsers() {
  console.log('=== DEBUG DO CARREGAMENTO DE USUÁRIOS ===\n');
  
  try {
    // 1. Verificar conexão
    console.log('1. Testando conexão com Supabase...');
    const { data, error } = await supabase.from('profiles').select('count').single();
    if (error) {
      console.error('❌ Erro de conexão:', error);
      return;
    }
    console.log('✅ Conexão OK\n');
    
    // 2. Verificar tabela profiles
    console.log('2. Verificando tabela profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);
      
    if (profilesError) {
      console.error('❌ Erro ao buscar profiles:', profilesError);
    } else {
      console.log(`✅ Encontrados ${profiles.length} profiles`);
      profiles.forEach(p => {
        console.log(`   - ID: ${p.id}, Nome: ${p.full_name}, Role: ${p.role}`);
      });
    }
    console.log('');
    
    // 3. Verificar se auth.admin está disponível
    console.log('3. Testando auth.admin...');
    try {
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) {
        console.error('❌ Erro no auth.admin:', authError);
        console.log('   Possível causa: SERVICE_KEY não configurado ou sem permissões');
      } else {
        console.log(`✅ Encontrados ${authUsers.users.length} usuários no auth`);
        authUsers.users.slice(0, 3).forEach(u => {
          console.log(`   - ID: ${u.id}, Email: ${u.email}`);
        });
      }
    } catch (err) {
      console.error('❌ Exceção no auth.admin:', err);
    }
    console.log('');
    
    // 4. Verificar permissões RLS
    console.log('4. Verificando políticas RLS...');
    const { data: rlsPolicies, error: rlsError } = await supabase
      .from('pg_policies')
      .select('policyname, tablename, permissive, cmd')
      .eq('tablename', 'profiles');
      
    if (rlsError) {
      console.log('⚠️ Não foi possível verificar RLS (normal se não for superusuário)');
    } else {
      console.log(`✅ Encontradas ${rlsPolicies.length} políticas para profiles`);
      rlsPolicies.forEach(p => {
        console.log(`   - ${p.policyname}: ${p.cmd} (${p.permissive ? 'permissive' : 'restrictive'})`);
      });
    }
    console.log('');
    
    // 5. Testar método simplificado
    console.log('5. Testando método simplificado...');
    const { data: simpleUsers, error: simpleError } = await supabase
      .from('profiles')
      .select('id, full_name, role, created_at')
      .order('created_at', { ascending: false });
      
    if (simpleError) {
      console.error('❌ Erro no método simplificado:', simpleError);
    } else {
      console.log(`✅ Método simplificado funcionou! Encontrados ${simpleUsers.length} usuários`);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar debug
debugUsers().then(() => {
  console.log('\n=== FIM DO DEBUG ===');
  process.exit(0);
}).catch(error => {
  console.error('Erro no debug:', error);
  process.exit(1);
});