// Load public build variables using Vite's standard .env resolution.
// Do not print the values or check in .env files.
import { loadEnv } from 'vite';

const env = loadEnv('production', process.cwd(), 'VITE_');
const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
const missing = required.filter((key) => !env[key]?.trim());

if (missing.length) {
  console.error(`Build interrompido: variáveis públicas ausentes: ${missing.join(', ')}`);
  console.error('Disponibilize .env.production ao build de forma segura. Não registre valores em logs ou no Git.');
  process.exit(1);
}

try {
  const url = new URL(env.VITE_SUPABASE_URL);
  if (url.protocol !== 'https:') throw new Error('Invalid protocol');
} catch {
  console.error('Build interrompido: VITE_SUPABASE_URL não é uma URL HTTPS válida.');
  process.exit(1);
}

console.log('Pré-verificação de configuração pública do Supabase: OK (valores omitidos).');
