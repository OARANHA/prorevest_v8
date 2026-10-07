#!/usr/bin/env node
/**
 * Backfill de perfis ausentes em public.profiles usando a service key
 * - Lista usuários via Auth Admin
 * - Compara com ids existentes em public.profiles
 * - Insere perfis faltantes com role 'customer' e full_name do user_metadata
 */

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE || process.env.SUPABASE_KEY;

if (!url) {
  console.error('SUPABASE_URL/VITE_SUPABASE_URL não definida no ambiente.');
  process.exit(1);
}
if (!serviceKey) {
  console.error('Service key ausente. Configure SUPABASE_SERVICE_KEY.');
  process.exit(1);
}

function logHeader(title) {
  console.log(`\n== ${title} ==`);
}

async function authAdminListUsers(limit = 200, page = 1) {
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

async function restGet(path, params = '') {
  const endpoint = `${url}/rest/v1${path}${params}`;
  const res = await fetch(endpoint, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: 'count=exact'
    }
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, headers: Object.fromEntries(res.headers.entries()), data };
}

async function restPost(path, body, params = '') {
  const endpoint = `${url}/rest/v1${path}${params}`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation'
    },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
}

function safeFullName(user) {
  const meta = user.user_metadata || {};
  if (typeof meta.full_name === 'string' && meta.full_name.trim().length > 0) return meta.full_name.trim();
  if (typeof user.email === 'string' && user.email.includes('@')) return user.email.split('@')[0];
  return null;
}

async function listAllUsers() {
  const all = [];
  let page = 1;
  const limit = 200;
  while (true) {
    const res = await authAdminListUsers(limit, page);
    if (res.status !== 200) {
      throw new Error(`Falha ao listar usuários: status ${res.status} - ${JSON.stringify(res.data)}`);
    }
    const users = Array.isArray(res.data?.users) ? res.data.users : Array.isArray(res.data) ? res.data : [];
    all.push(...users);
    if (users.length < limit) break;
    page += 1;
    if (page > 20) break; // segurança
  }
  return all;
}

async function main() {
  logHeader('Listando usuários do Auth');
  const users = await listAllUsers();
  console.log('Total de usuários:', users.length);

  const ids = users.map(u => u.id);
  const chunkSize = 100;
  const existing = new Set();
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    const q = encodeURIComponent(`in.("${chunk.join('","')}")`);
    const res = await restGet('/profiles', `?select=id&id=${q}`);
    if (res.status !== 200) {
      throw new Error(`Falha ao consultar profiles: status ${res.status} - ${JSON.stringify(res.data)}`);
    }
    (res.data || []).forEach(r => existing.add(r.id));
  }

  const missing = users.filter(u => !existing.has(u.id));
  console.log('Usuários sem perfil:', missing.length);
  if (missing.length === 0) {
    console.log('Nenhum perfil ausente.');
    return;
  }

  const rows = missing.map(u => ({
    id: u.id,
    full_name: safeFullName(u),
    role: 'customer'
  }));

  logHeader('Inserindo perfis faltantes');
  const insert = await restPost('/profiles', rows, '?on_conflict=id');
  console.log('Status:', insert.status);
  console.log('Resposta:', insert.data);

  // Verificar contagem após inserção
  logHeader('Verificando contagem de perfis');
  const countRes = await restGet('/profiles', '?select=id');
  const range = countRes.headers['content-range'] || '0-0/0';
  const total = range.split('/')[1] || '0';
  console.log('Status:', countRes.status);
  console.log('Total de perfis:', total);
}

main().catch(err => {
  console.error('Erro no backfill:', err);
  process.exit(1);
});