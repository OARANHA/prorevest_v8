-- PROREVEST — somente leitura, projeto oficial gtfvhktgxqtdrnaxizch
-- Inspeciona concessoes UPDATE e a rotina is_admin_user() usada na politica ALL.
-- Nenhum usuario ou credencial sera consultado.
select
  has_table_privilege('authenticated', 'public.profiles', 'UPDATE')
    as authenticated_pode_atualizar_tabela,
  has_column_privilege('authenticated', 'public.profiles', 'role', 'UPDATE')
    as authenticated_pode_atualizar_role,
  has_column_privilege('anon', 'public.profiles', 'role', 'UPDATE')
    as anon_pode_atualizar_role,
  coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'schema', n.nspname,
        'security_definer', p.prosecdef,
        'configuracao', p.proconfig,
        'definicao', pg_get_functiondef(p.oid)
      ) order by n.nspname
    )
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where p.proname = 'is_admin_user' and p.pronargs = 0
  ), '[]'::jsonb) as funcao_is_admin_user,
  coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'nome', c.conname,
        'tipo', c.contype,
        'definicao', pg_get_constraintdef(c.oid)
      ) order by c.conname
    )
    from pg_constraint c
    where c.conrelid = 'public.profiles'::regclass
  ), '[]'::jsonb) as restricoes_profiles;
-- Se a definicao da funcao contiver dados internos, retire literais de
-- e-mail, UUID e valores sensiveis antes de compartilhar a saida.
