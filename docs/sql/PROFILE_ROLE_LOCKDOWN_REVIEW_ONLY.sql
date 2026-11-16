-- PROREVEST — P0 SEGURANCA — MIGRACAO APLICAVEL APENAS APOS APROVACAO.
-- Projeto oficial: gtfvhktgxqtdrnaxizch. NAO EXECUTADA NESTA PR.
-- Risco confirmado por SQL administrativo 2026-11-16:
-- authenticated/anon possuem UPDATE na coluna profiles.role.
-- A politica UPDATE por auth.uid() = id permite ao usuario autenticado
-- tentar promover seu proprio perfil a admin.
--
-- EFEITOS INTENCIONAIS:
--  1. Remover UPDATE amplo de PUBLIC, anon e authenticated.
--  2. Permitir ao usuario autenticado editar APENAS full_name/company_name.
--  3. Corrigir o search_path inseguro da funcao is_admin_user(), preservando
--     SECURITY DEFINER e verificacao do role em public.profiles.
--  4. Abortar toda transacao se a role continuar editavel ou nome/empresa
--     deixarem de ser editaveis pelo papel authenticated.
--
-- Administracao de roles permanece desabilitada no frontend da PR #8,
-- ate implementacao de endpoint seguro que valida autorizacao no servidor.
-- Nenhum perfil/role existente e alterado por esta migracao.
--
-- Antes: revisao e backup; conferir projeto no dashboard.
-- Depois: confirmar resultado da SELECT final e testar perfil de usuario comum.

begin;

-- REVOKE de coluna sozinho nao anula UPDATE concedido na tabela inteira.
revoke update on table public.profiles
  from public, anon, authenticated;

-- Remover possiveis concessoes colunares diretas anteriores, inclusive
-- por heranca do papel PUBLIC. Em seguida, conceder somente o necessario.
revoke update (id, full_name, company_name, role, created_at, email)
  on table public.profiles
  from public, anon, authenticated;

grant update (full_name, company_name)
  on table public.profiles
  to authenticated;

-- Corrigir a funcao usada pela politica "Admins can manage all profiles".
-- CREATE OR REPLACE preserva o proprietario e os grants da funcao.
-- O search_path vazio e todas as referencias qualificadas evitam depender
-- do schema de pesquisa fornecido pela sessao.
create or replace function public.is_admin_user()
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $function$
begin
  return exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
end;
$function$;

do $assert$
begin
  if has_column_privilege('authenticated', 'public.profiles', 'role', 'UPDATE')
     or has_column_privilege('anon', 'public.profiles', 'role', 'UPDATE')
     or has_column_privilege('authenticated', 'public.profiles', 'id', 'UPDATE')
     or has_column_privilege('authenticated', 'public.profiles', 'email', 'UPDATE')
     or has_column_privilege('authenticated', 'public.profiles', 'created_at', 'UPDATE')
  then
    raise exception
      'PRV-028: UPDATE de coluna restrita permanece disponivel; abortando';
  end if;

  if not has_column_privilege('authenticated', 'public.profiles', 'full_name', 'UPDATE')
     or not has_column_privilege('authenticated', 'public.profiles', 'company_name', 'UPDATE')
  then
    raise exception
      'PRV-028: edicao permitida de nome/empresa foi perdida; abortando';
  end if;
end;
$assert$;

select
  has_table_privilege('authenticated', 'public.profiles', 'UPDATE')
    as authenticated_update_geral,
  has_column_privilege('authenticated', 'public.profiles', 'role', 'UPDATE')
    as authenticated_update_role,
  has_column_privilege('anon', 'public.profiles', 'role', 'UPDATE')
    as anon_update_role,
  has_column_privilege('authenticated', 'public.profiles', 'full_name', 'UPDATE')
    as authenticated_update_nome,
  has_column_privilege('authenticated', 'public.profiles', 'company_name', 'UPDATE')
    as authenticated_update_empresa,
  (select p.proconfig
     from pg_proc p
     join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'is_admin_user'
      and p.pronargs = 0
  ) as config_is_admin_user;

commit;

-- Rollback requer recuperar GRANTs e definicao ANTERIORES via backup SQL.
-- NAO restaurar indiscriminadamente UPDATE(role): isso reintroduz vulnerabilidade.
