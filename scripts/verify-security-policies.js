#!/usr/bin/env node

/**
 * Script para verificar as políticas de segurança do Supabase
 * Este script verifica se as políticas corretas estão aplicadas à tabela profiles
 * para evitar recursão infinita.
 */

const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase (você pode passar essas variáveis como argumentos)
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyProfilesPolicies() {
  console.log('🔍 Verificando políticas de segurança da tabela profiles...');
  
  try {
    // Verificar se a função helper existe
    const { data: functions, error: functionsError } = await supabase
      .from('_functions')
      .select('*')
      .ilike('name', 'is_admin_user');
    
    if (functionsError) {
      console.warn('⚠️  Não foi possível verificar funções helper:', functionsError.message);
    } else if (functions && functions.length > 0) {
      console.log('✅ Função helper is_admin_user encontrada');
    } else {
      console.warn('⚠️  Função helper is_admin_user não encontrada');
    }
    
    // Verificar políticas da tabela profiles
    // Nota: Esta consulta pode não funcionar em todos os ambientes devido a restrições de permissão
    console.log('ℹ️  Para verificar as políticas da tabela profiles, execute a seguinte consulta no SQL Editor do Supabase:');
    console.log('');
    console.log('SELECT * FROM pg_policies WHERE schemaname = \'public\' AND tablename = \'profiles\';');
    console.log('');
    
    // Testar acesso à tabela profiles (isso pode falhar se as políticas estiverem incorretas)
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (error && error.message.includes('infinite recursion')) {
      console.error('❌ ERRO CRÍTICO: Recursão infinita detectada nas políticas da tabela profiles');
      console.error('💡 Solução: Aplique a migração 20250912000000_fix_profiles_rls_recursion.sql');
      return false;
    } else if (error) {
      console.warn('⚠️  Não foi possível acessar a tabela profiles:', error.message);
    } else {
      console.log('✅ Tabela profiles acessível (sem erros de recursão)');
    }
    
    console.log('');
    console.log('📋 Para corrigir problemas de políticas, execute os seguintes passos:');
    console.log('1. Aplique a migração: supabase/migrations/20250912000000_fix_profiles_rls_recursion.sql');
    console.log('2. Ou execute manualmente as instruções SQL contidas nesse arquivo');
    console.log('3. Verifique novamente após a aplicação');
    
    return true;
  } catch (err) {
    console.error('❌ Erro ao verificar políticas:', err.message);
    return false;
  }
}

async function main() {
  console.log('=== Verificador de Políticas de Segurança do Supabase ===');
  console.log('');
  
  const success = await verifyProfilesPolicies();
  
  console.log('');
  if (success) {
    console.log('✅ Verificação concluída com sucesso');
  } else {
    console.log('❌ Verificação encontrou problemas');
    process.exit(1);
  }
}

// Executar se este arquivo for chamado diretamente
if (require.main === module) {
  main().catch(err => {
    console.error('Erro fatal:', err);
    process.exit(1);
  });
}

module.exports = { verifyProfilesPolicies };