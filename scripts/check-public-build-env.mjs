// Fail before bundling if public Supabase configuration is absent.
// Never print credentials or their values.
const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
const missing = required.filter((key) => !process.env[key]?.trim());
if (missing.length) {
  console.error(`Build interrompido: variáveis públicas ausentes: ${missing.join(', ')}`);
  console.error('Carregue as variáveis no ambiente de build usando o mecanismo seguro de deploy. Não registre valores em logs ou no Git.');
  process.exit(1);
}
try {
  const url = new URL(process.env.VITE_SUPABASE_URL);
  if (url.protocol !== 'https:') throw new Error('Invalid protocol');
} catch {
  console.error('Build interrompido: VITE_SUPABASE_URL não é uma URL HTTPS válida.');
  process.exit(1);
}
console.log('Pré-verificação de configuração pública do Supabase: OK (valores omitidos).');
