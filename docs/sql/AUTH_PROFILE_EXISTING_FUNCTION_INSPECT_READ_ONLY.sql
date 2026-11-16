-- PROREVEST — diagnóstico read-only de função preexistente da etapa 2.
-- Supabase oficial esperado: gtfvhktgxqtdrnaxizch
-- Erro observado: P0001 Funcao prorevest_create_auth_profile ja existe.
-- NAO apaga, substitui ou executa função, trigger ou registros.
-- Uma linha de saída com três colunas JSON: função, gatilhos e contagens.
-- Revise a definição da função antes de compartilhar: oculte eventuais
-- identificadores pessoais, tokens ou segredos que tenha encontrado.

select
  coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'assinatura', p.oid::regprocedure::text,
        'retorno', pg_get_function_result(p.oid),
        'proprietario', pg_get_userbyid(p.proowner),
        'security_definer', p.prosecdef,
        'configuracao', p.proconfig,
        'exec_anon', has_function_privilege('anon', p.oid, 'EXECUTE'),
        'exec_authenticated', has_function_privilege('authenticated', p.oid, 'EXECUTE'),
        'definicao', pg_get_functiondef(p.oid)
      ) order by p.oid::regprocedure::text
    )
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'prorevest_create_auth_profile'
  ), '[]'::jsonb) as funcao_existente,

  coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'nome', t.tgname,
        'estado', t.tgenabled,
        'funcao', t.tgfoid::regprocedure::text,
        'definicao', pg_get_triggerdef(t.oid)
      ) order by t.tgname
    )
    from pg_trigger t
    where t.tgrelid = 'auth.users'::regclass
      and not t.tgisinternal
  ), '[]'::jsonb) as gatilhos_auth,

  jsonb_build_object(
    'contas_auth', (select count(*) from auth.users),
    'perfis', (select count(*) from public.profiles),
    'contas_sem_perfil', (
      select count(*)
      from auth.users a
      where not exists (
        select 1 from public.profiles p where p.id = a.id
      )
    ),
    'perfis_sem_conta', (
      select count(*)
      from public.profiles p
      where not exists (
        select 1 from auth.users a where a.id = p.id
      )
    )
  ) as contagens_atuais;
