// Verificações estáticas da PR #8 — sem conexão de rede/banco.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');

const routes = read('app/routes.ts');
const db = read('app/services/databaseService.ts');
const auth = read('app/contexts/AuthContext.tsx');
const signup = read('app/routes/register.tsx');
const userService = read('app/services/userService.ts');
const adminUsers = read('app/routes/admin/users.tsx');
const adminIndex = read('app/routes/admin/index.tsx');
const sql = read('docs/sql/PROFILES_AUTH_SYNC_REVIEW_ONLY.sql');
const profileHook = read('app/hooks/useProfile.ts');
const profileUI = read('app/routes/perfil.tsx');
const securityPreflight = read('docs/sql/AUTH_ROLE_SECURITY_PREFLIGHT_READ_ONLY.sql');
const roleLockdown = read('docs/sql/PROFILE_ROLE_LOCKDOWN_REVIEW_ONLY.sql');

assert(!routes.includes('route("init-db"'), 'Rota de init-db ainda montada');
assert(!routes.includes('route("init-profiles"'), 'Rota de backfill GET ainda montada');
assert(!routes.includes('route("make-admin"'), 'Rota de autoelevação ainda montada');
assert(!routes.includes('route("debug-user"'), 'Rota de debug de login ainda montada');

assert(!db.includes('initSuperAdmin') && !db.includes('createMissingProfiles'), 'Bootstrap legado permanece');
assert(!db.includes("rpc('execute_sql'"), 'SQL dinâmico disponível no navegador');
assert(!auth.includes('createOrUpdateProfile'), 'Criação de perfil ainda depende de evento Auth');
assert(auth.includes("select('role')"), 'Leitura do papel da sessão não localizada');
assert(signup.includes('data.session?.user') && signup.includes('successMessage'), 'Fluxo de confirmação pendente não tratado');

assert(!userService.includes('supabase.auth.admin'), 'Operações Auth privilegiadas no browser');
assert(!userService.includes('.update(') && !userService.includes('.insert('), 'UserService faz escrita de perfis');
assert(userService.includes('.range(offset, offset + pageSize - 1)'), 'Paginação real de perfis ausente');
assert(!adminUsers.includes('PermissionService'), 'Edição não auditada de permissões continua disponível');
assert(!adminUsers.includes('Último Login'), 'Dados de Auth não auditados continuam na listagem');

assert(adminIndex.includes('countVisibleRows("profiles")'), 'Contagem dinâmica de perfis ausente');
assert(!adminIndex.includes('124567.89') && !adminIndex.includes('1242'), 'Dados fictícios no Admin');
assert(sql.includes('on conflict (id) do nothing'), 'Backfill idempotente não encontrado');
assert(sql.includes('raise exception'), 'Migração sem guardas de segurança');
assert(sql.includes('revoke all on function'), 'Função SECURITY DEFINER não restrita');

assert(!profileHook.includes('.update(updates)'), 'Atualização de perfil permite propriedades arbitrárias');
assert(!profileHook.includes('updated_at') && !profileHook.includes('createProfile'), 'Perfil usa campos inexistentes ou criação pelo browser');
assert(profileHook.includes('full_name: updates.full_name') && profileHook.includes('company_name: updates.company_name'), 'Allowlist de colunas editáveis ausente');
assert(!profileUI.includes('role: profileData.role') && !profileUI.includes('profileData.cpf'), 'UI permite envio de role/CPF');
assert(sql.includes("to_regprocedure('public.prorevest_create_auth_profile()')"), 'Migração pode sobrescrever função preexistente');
assert(securityPreflight.includes("has_column_privilege('authenticated', 'public.profiles', 'role', 'UPDATE')"), 'Auditoria de alteração de role ausente');

assert(roleLockdown.includes('revoke update on table public.profiles'), 'Tabela mantém UPDATE amplo');
assert(roleLockdown.includes('revoke update (id, full_name, company_name, role, created_at, email)'), 'UPDATE colunar antigo não é revogado');
assert(roleLockdown.includes('grant update (full_name, company_name)'), 'Edição de nome/empresa não é restaurada');
assert(roleLockdown.includes("set search_path = ''") && roleLockdown.includes('from public.profiles'), 'Função admin sem search_path/schema fixos');
assert(roleLockdown.includes("has_column_privilege('authenticated', 'public.profiles', 'role', 'UPDATE')"), 'Migração não verifica permissão de role');
assert(roleLockdown.includes('with check ((select auth.uid()) = id)'), 'RLS UPDATE sem WITH CHECK explícito');
assert(sql.includes("PRV-028: UPDATE de role ainda permitido"), 'Backfill não verifica bloqueio de autoelevação');

console.log('PASS: 32 verificações estáticas de regressão Admin/Auth');
