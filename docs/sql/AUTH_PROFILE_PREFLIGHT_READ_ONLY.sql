-- PROREVEST: auditoria somente leitura, uma linha de resultado com quatro campos JSON.
-- Execute apenas no SQL Editor do projeto gtfvhktgxqtdrnaxizch.
-- Não lê contas, e-mails, IDs de usuários, senhas, tokens ou registros pessoais.
select
  coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'gatilho', tgname,
        'estado', tgenabled,
        'definicao', pg_get_triggerdef(oid)
      ) order by tgname
    )
    from pg_trigger
    where tgrelid = 'auth.users'::regclass
      and not tgisinternal
      and (tgtype & 4) = 4
  ), '[]'::jsonb) as gatilhos_insert_auth,
  (
    select jsonb_build_object(
      'rls_ativa', c.relrowsecurity,
      'rls_forcada', c.relforcerowsecurity
    )
    from pg_class c where c.oid = 'public.profiles'::regclass
  ) as rls_profiles,
  coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'nome', policyname,
        'comando', cmd,
        'papeis', roles,
        'regra_select', qual,
        'regra_escrita', with_check
      ) order by policyname
    )
    from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
  ), '[]'::jsonb) as politicas_profiles,
  coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'indice', ic.relname,
        'definicao', pg_get_indexdef(i.indexrelid)
      ) order by ic.relname
    )
    from pg_index i
    join pg_class ic on ic.oid = i.indexrelid
    where i.indrelid = 'public.profiles'::regclass
      and i.indisunique
  ), '[]'::jsonb) as indices_unicos_profiles;
