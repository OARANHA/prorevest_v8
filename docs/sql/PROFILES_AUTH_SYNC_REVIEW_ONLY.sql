-- PROREVEST — PROPOSTA DE MIGRAÇÃO; NÃO EXECUTADA.
-- Banco oficial esperado: gtfvhktgxqtdrnaxizch
-- Execute SOMENTE no SQL Editor do projeto correto e APÓS revisar triggers,
-- índices, constraints e políticas RLS de public.profiles.
-- Este script altera o banco: instala trigger de criação de perfil e preenche
-- APENAS contas Auth sem perfil. Não deve rodar automaticamente no deploy.
-- 2026-11-16: Auth=18, profiles=9, contas sem perfil=9 (evidência fornecida).
-- Não executar no projeto "elus" ou em qualquer conector de outro projeto.

begin;

-- Impedir aplicação se já houver trigger de INSERT no Auth ainda não auditada.
-- Se esta guarda falhar, NÃO desabilitar triggers existentes às cegas.
do $guard$
declare
  profile_id_attnum smallint;
begin
  select attnum into profile_id_attnum
  from pg_attribute
  where attrelid = 'public.profiles'::regclass
    and attname = 'id' and not attisdropped;

  if profile_id_attnum is null then
    raise exception 'public.profiles.id ausente; abortando';
  end if;

  if not exists (
    select 1
    from pg_index idx
    where idx.indrelid = 'public.profiles'::regclass
      and idx.indisunique
      and idx.indnkeyatts = 1
      and idx.indkey[0] = profile_id_attnum
  ) then
    raise exception 'public.profiles.id nao possui indice UNIQUE/PRIMARY KEY isolado; abortando';
  end if;

  if exists (
    select 1 from pg_trigger
    where tgrelid = 'auth.users'::regclass
      and not tgisinternal
      and (tgtype & 4) = 4
      and tgname <> 'prorevest_profile_after_auth_insert'
  ) then
    raise exception 'Ha outro trigger de INSERT em auth.users; revisar antes de implantar';
  end if;
end
$guard$;

-- Chamada apenas pelo gatilho; search_path fechado.
-- Role inicial segura, independente de raw_user_meta_data.
create or replace function public.prorevest_create_auth_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
    new.email,
    'customer'
  )
  on conflict (id) do nothing;
  return new;
end;
$function$;

-- SECURITY DEFINER em schema public: nunca manter EXECUTE público.
revoke all on function public.prorevest_create_auth_profile()
  from public, anon, authenticated;

do $trigger$
begin
  if not exists (
    select 1 from pg_trigger
    where tgrelid = 'auth.users'::regclass
      and tgname = 'prorevest_profile_after_auth_insert'
      and not tgisinternal
  ) then
    create trigger prorevest_profile_after_auth_insert
    after insert on auth.users
    for each row
    execute function public.prorevest_create_auth_profile();
  end if;
end
$trigger$;

-- Regularização idempotente, preservando cada perfil já existente.
-- Não altera role, nome, e-mail ou quaisquer permissões de perfis existentes.
insert into public.profiles (id, full_name, email, role)
select
  a.id,
  nullif(btrim(a.raw_user_meta_data ->> 'full_name'), ''),
  a.email,
  'customer'
from auth.users a
where not exists (
  select 1 from public.profiles p where p.id = a.id
)
on conflict (id) do nothing;

-- Verificação agregada (sem dados pessoais). Esperado após a migração: 0 sem perfil.
select
  (select count(*) from auth.users) as contas_auth,
  (select count(*) from public.profiles) as perfis,
  (select count(*) from auth.users a
     where not exists (select 1 from public.profiles p where p.id = a.id)
  ) as contas_sem_perfil,
  (select count(*) from public.profiles p
     where not exists (select 1 from auth.users a where a.id = p.id)
  ) as perfis_sem_conta;

commit;

-- Rollback do gatilho, caso necessário (executar separadamente e sob aprovação):
-- begin;
-- drop trigger if exists prorevest_profile_after_auth_insert on auth.users;
-- drop function if exists public.prorevest_create_auth_profile();
-- commit;
-- O rollback NÃO remove perfis criados: exclusões exigem revisão individual.
