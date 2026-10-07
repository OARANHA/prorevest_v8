#!/usr/bin/env node
/**
 * Diagnóstico Supabase: verifica perfis, políticas RLS e triggers
 * Usa chave de serviço (service role) via variáveis de ambiente; se ausente, usa anon key (acesso limitado)
 */

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE || process.env.SUPABASE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

function logHeader(title) {
  console.log(`\n== ${title} ==`);
}

function requireEnv() {
  if (!url) {
    console.error('SUPABASE_URL/VITE_SUPABASE_URL não definida no ambiente.');
    process.exit(1);
  }
  if (!serviceKey && !anonKey) {
    console.error('Nenhuma chave encontrada. Configure SUPABASE_SERVICE_KEY ou SUPABASE_ANON_KEY.');
    process.exit(1);
  }
}

function getAuthKey() {
  if (serviceKey) return { key: serviceKey, type: 'service' };
  return { key: anonKey, type: 'anon' };
}

async function restGet(path, params = '') {
  const { key } = getAuthKey();
  const endpoint = `${url}/rest/v1${path}${params}`;
  const res = await fetch(endpoint, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: 'count=exact'
    }
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, headers: Object.fromEntries(res.headers.entries()), data };
}

async function rpc(name, body) {
  const { key } = getAuthKey();
  const endpoint = `${url}/rest/v1/rpc/${name}`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
}

// Admin: listar usuários via API de autenticação (requer service key)
async function authAdminListUsers(limit = 50, page = 1) {
  if (!serviceKey) {
    return { status: 401, data: 'Service key ausente' };
  }
  const endpoint = `${url}/auth/v1/admin/users?per_page=${limit}&page=${page}`;
  const res = await fetch(endpoint, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json'
    }
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
}

async function main() {
  requireEnv();
  const auth = getAuthKey();
  logHeader('Config');
  console.log('URL:', url);
  console.log('Auth key tipo:', auth.type);

  // Amostra de perfis
  logHeader('Amostra de perfis (últimos 5)');
  const profiles = await restGet('/profiles', '?select=id,full_name,role,created_at&order=created_at.desc&limit=5');
  console.log('Status:', profiles.status);
  console.log('Count header:', profiles.headers['content-range'] || 'n/a');
  console.log('Data:', profiles.data);

  // Contagem exata de perfis
  logHeader('Contagem de perfis');
  const countRes = await restGet('/profiles', '?select=id');
  const range = countRes.headers['content-range'] || '0-0/0';
  const total = range.split('/')[1] || '0';
  console.log('Status:', countRes.status);
  console.log('Total:', total);

  // Admin: listar últimos usuários de auth
  logHeader('Admin: listar usuários (últimos 10)');
  const adminUsers = await authAdminListUsers(10, 1);
  console.log('Status:', adminUsers.status);
  const users = Array.isArray(adminUsers.data?.users) ? adminUsers.data.users : adminUsers.data; // dependendo do formato
  console.log('Users:', users);

  // Cruzar usuários vs profiles
  if (Array.isArray(users)) {
    logHeader('Diferença: usuários sem perfil');
    const ids = users.map(u => u.id);
    const q = encodeURIComponent(`in.("${ids.join('","')}")`);
    const exist = await restGet('/profiles', `?select=id&id=${q}`);
    const have = Array.isArray(exist.data) ? new Set(exist.data.map(r => r.id)) : new Set();
    const missing = users.filter(u => !have.has(u.id)).map(u => ({ id: u.id, email: u.email, confirmed_at: u.confirmed_at }));
    console.log('Status perfis existentes:', exist.status);
    console.log('Sem perfil:', missing);
    console.log('Resumo: total usuários:', users.length, 'com perfil:', have.size, 'sem perfil:', missing.length);
  }

  // Políticas RLS da tabela profiles (via RPC execute_sql) – pode não existir
  logHeader('Políticas RLS em profiles');
  const pol = await rpc('execute_sql', {
    sql: `
      SELECT polname, cmd, pg_get_expr(qual, polrelid) as using,
             pg_get_expr(with_check, polrelid) as with_check
      FROM pg_policy
      WHERE polrelid = 'public.profiles'::regclass
      ORDER BY polname;
    `
  });
  console.log('Status:', pol.status);
  console.log('Policies:', pol.data);

  // RLS enabled?
  logHeader('RLS habilitada em profiles');
  const rls = await rpc('execute_sql', {
    sql: `
      SELECT relrowsecurity AS rls_enabled
      FROM pg_class
      WHERE oid = 'public.profiles'::regclass;
    `
  });
  console.log('Status:', rls.status);
  console.log('RLS:', rls.data);

  // Triggers em public.profiles
  logHeader('Triggers em public.profiles');
  const trgProfiles = await rpc('execute_sql', {
    sql: `
      SELECT t.tgname, p.proname AS function_name
      FROM pg_trigger t
      JOIN pg_class c ON t.tgrelid = c.oid
      JOIN pg_proc p ON t.tgfoid = p.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE n.nspname = 'public' AND c.relname = 'profiles' AND NOT t.tgisinternal
      ORDER BY t.tgname;
    `
  });
  console.log('Status:', trgProfiles.status);
  console.log('Triggers:', trgProfiles.data);

  // Triggers em auth.users (criação automática de perfil)
  logHeader('Triggers em auth.users');
  const trgAuthUsers = await rpc('execute_sql', {
    sql: `
      SELECT t.tgname, p.proname AS function_name
      FROM pg_trigger t
      JOIN pg_class c ON t.tgrelid = c.oid
      JOIN pg_proc p ON t.tgfoid = p.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE n.nspname = 'auth' AND c.relname = 'users' AND NOT t.tgisinternal
      ORDER BY t.tgname;
    `
  });
  console.log('Status:', trgAuthUsers.status);
  console.log('Triggers:', trgAuthUsers.data);

  // Verificar se existe função que cria perfil (heurística pelo nome)
  logHeader('Heurística: função de criação de perfil');
  const findFn = await rpc('execute_sql', {
    sql: `
      SELECT proname
      FROM pg_proc
      WHERE proname ILIKE '%profile%' OR proname ILIKE '%handle_new_user%'
      ORDER BY proname
      LIMIT 10;
    `
  });
  console.log('Status:', findFn.status);
  console.log('Funções encontradas:', findFn.data);
}

main().catch(err => {
  console.error('Erro no diagnóstico:', err);
  process.exit(1);
});