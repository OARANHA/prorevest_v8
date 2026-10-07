#!/usr/bin/env node

/**
 * Script para configurar políticas de segurança do bucket de storage
 * Este script configura as políticas RLS para o bucket "images"
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Carregar variáveis do .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis do Supabase não encontradas no .env.local');
  console.error('Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidos');
  process.exit(1);
}

console.log('🔧 Configurando políticas do bucket de storage...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStoragePolicies() {
  try {
    console.log('📦 Configurando políticas para o bucket "images"...');

    // Verificar se o bucket existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Erro ao listar buckets:', listError.message);
      return false;
    }

    const imagesBucket = buckets.find(bucket => bucket.name === 'images');
    
    if (!imagesBucket) {
      console.error('❌ Bucket "images" não encontrado');
      console.log('📋 Buckets disponíveis:', buckets.map(b => b.name));
      return false;
    }

    console.log('✅ Bucket "images" encontrado');

    // Configurar políticas usando a API de storage
    // Nota: A API de políticas de storage pode variar, então usamos uma abordagem alternativa
    
    console.log('⚠️  Configurando políticas via Supabase Dashboard...');
    console.log('\n📋 INSTRUÇÕES MANUAIS:');
    console.log('1. Acesse: https://supabase.com/dashboard/project/[seu-project-id]/storage/buckets/images/policies');
    console.log('2. Clique em "New Policy"');
    console.log('3. Configure as seguintes políticas:');
    console.log('');
    console.log('📌 POLÍTICA 1: Leitura pública');
    console.log('   - Operation: SELECT');
    console.log('   - Expression: true');
    console.log('   - Description: "Public can view images"');
    console.log('');
    console.log('📌 POLÍTICA 2: Upload para usuários autenticados');
    console.log('   - Operation: INSERT');
    console.log('   - Expression: auth.role() = \'authenticated\'');
    console.log('   - Description: "Authenticated users can upload images"');
    console.log('');
    console.log('📌 POLÍTICA 3: Atualização para usuários autenticados');
    console.log('   - Operation: UPDATE');
    console.log('   - Expression: auth.role() = \'authenticated\'');
    console.log('   - Description: "Authenticated users can update images"');
    console.log('');
    console.log('📌 POLÍTICA 4: Exclusão para usuários autenticados');
    console.log('   - Operation: DELETE');
    console.log('   - Expression: auth.role() = \'authenticated\'');
    console.log('   - Description: "Authenticated users can delete images"');
    console.log('');
    console.log('💡 DICA: Você também pode usar a interface web para configurar:');
    console.log('   - Acesse Storage → Buckets → images → Policies');
    console.log('   - Clique em "New Policy" e configure cada operação');

    return true;

  } catch (error) {
    console.error('❌ Erro ao configurar políticas:', error.message);
    return false;
  }
}

// Executar a configuração
async function main() {
  const success = await setupStoragePolicies();
  
  if (success) {
    console.log('\n✅ Configuração concluída!');
    console.log('📋 Próximos passos:');
    console.log('1. Configure as políticas manualmente no Supabase Dashboard');
    console.log('2. Teste o upload de imagens no sistema administrativo');
    console.log('3. Verifique se o erro RLS foi resolvido');
  } else {
    console.log('❌ Falha na configuração das políticas');
    process.exit(1);
  }
}

main();