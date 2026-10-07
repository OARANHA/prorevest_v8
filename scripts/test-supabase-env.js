#!/usr/bin/env node
// Teste de conexão Supabase usando variáveis de ambiente já carregadas

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

function mask(str) {
  if (!str) return 'MISSING';
  return str.length > 10 ? str.slice(0, 6) + '…' + str.slice(-4) : 'MASKED';
}

async function main() {
  console.log('== Supabase Env Test ==');
  console.log('URL:', url);
  console.log('KEY:', mask(key));

  if (!url || !key) {
    console.error('ERRO: Variáveis SUPABASE_URL/ANON_KEY ausentes.');
    process.exit(1);
  }

  // 1) Teste básico do endpoint REST root (espera 404/200, mas confirma headers)
  try {
    const res = await fetch(`${url}/rest/v1/`, {
      method: 'GET',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('REST root status:', res.status);
  } catch (e) {
    console.error('Falha ao acessar REST root:', e.message);
  }

  // 2) Teste de tabela comum (profiles), se existir
  try {
    const table = 'profiles';
    const res = await fetch(`${url}/rest/v1/${table}?select=id&limit=1`, {
      method: 'GET',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'count=exact',
      },
    });
    const text = await res.text();
    console.log(`Profiles status: ${res.status}`);
    if (res.ok) {
      console.log('Profiles resposta (parcial):', text.slice(0, 200));
    } else {
      console.log('Profiles erro/resposta:', text.slice(0, 200));
    }
  } catch (e) {
    console.error('Falha ao consultar profiles:', e.message);
  }

  // 3) Teste de armazenamento (opcional)
  try {
    const res = await fetch(`${url}/storage/v1/bucket`, {
      method: 'GET',
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    console.log('Storage status:', res.status);
  } catch (e) {
    console.error('Falha ao consultar storage:', e.message);
  }
}

main().catch((e) => {
  console.error('Erro inesperado:', e);
  process.exit(1);
});