# Auditoria de usuários e métricas do painel administrativo

Atualizado em: 2026-11-16. Branch: `fix/admin-dashboard-real-metrics-20261116` (PR #8, **não implantada**).

## Situação

- O painel anterior exibia 1.242 usuários e receita R$ 124.567,89, ambos definidos diretamente no código, não no Supabase.
- A PR #8 deixa de chamar `profiles` de total cadastrado: apresenta **Perfis visíveis**, sob RLS da sessão atual, e informa falhas sem gerar dados de demonstração.
- O total de contas de autenticação deve ser medido em `auth.users`. Uma listagem de `public.profiles` pode estar incompleta por criação de perfil, RLS ou paginação; o serviço da PR #8 percorre páginas, mas continua sujeito à RLS.
- As operações administrativas de bloquear, desbloquear e redefinir senha via `supabase.auth.admin` no navegador foram retiradas na PR #8; não incluir uma chave privilegiada no frontend.

## Verificação pontual somente leitura no Supabase oficial

**Projeto correto:** `gtfvhktgxqtdrnaxizch`. Antes de usar o SQL Editor, confira esse ref no dashboard. Não executar em outro projeto e não fornecer chaves, tokens, senhas ou exportação de pessoas.

Execute somente esta consulta de contagens no **SQL Editor administrativo** do projeto correto:

```sql
select
  (select count(*) from auth.users) as contas_auth,
  (select count(*) from public.profiles) as perfis,
  (select count(*) from auth.users a
     left join public.profiles p on p.id = a.id
     where p.id is null) as contas_sem_perfil,
  (select count(*) from public.profiles p
     left join auth.users a on a.id = p.id
     where a.id is null) as perfis_sem_conta;
```

A consulta não altera dados nem retorna e-mails/identidades. É uma verificação administrativa; exige permissão de consulta a `auth.users` e `public.profiles`.

## Resultado confirmado pelo responsável — 2026-11-16

Consulta de contagens executada pelo responsável no SQL Editor administrativo do Supabase **oficial** (`gtfvhktgxqtdrnaxizch`):

| Métrica | Valor |
|---|---:|
| `contas_auth` | **18** |
| `perfis` | **9** |
| `contas_sem_perfil` | **9** |
| `perfis_sem_conta` | **0** |

**Interpretação:** há 18 registros em `auth.users`, mas 9 ainda não têm linha correspondente em `public.profiles`. Não concluir que os 18 são usuários ativos/confirmados ou que as 9 linhas visíveis pela RLS no navegador equivalem às 9 linhas administrativas do banco. A causa da ausência de perfis ainda não foi determinada.

**Implicação para a PR:** não substituir a contagem em tempo real de `profiles` por `18` fixo. Enquanto não existir uma API segura com autorização administrativa para contar `auth.users`, manter o indicador `Perfis visíveis` e sua explicação.

### Próxima verificação — somente leitura, sem exportar usuários

Executar **somente no SQL Editor do projeto correto**:

```sql
-- Triggers de cadastro associados ao Auth (nomes e estados, sem dados pessoais)
select tgname as gatilho,
       case tgenabled
         when 'O' then 'habilitado'
         when 'D' then 'desabilitado'
         when 'R' then 'replica'
         when 'A' then 'sempre'
         else 'outro'
       end as estado
from pg_trigger
where tgrelid = 'auth.users'::regclass
  and not tgisinternal
order by tgname;

-- Estado de RLS e quantidade de políticas da tabela profiles
select c.relrowsecurity as rls_ativa,
       c.relforcerowsecurity as rls_forcada,
       (select count(*) from pg_policies p
        where p.schemaname = 'public' and p.tablename = 'profiles') as numero_politicas
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname = 'profiles';

-- Estrutura da tabela profiles, sem ler seus registros
select column_name, data_type, is_nullable,
       (column_default is not null) as tem_default
from information_schema.columns
where table_schema = 'public' and table_name = 'profiles'
order by ordinal_position;
```

Não executar inserções, atualizações, criação de triggers ou alteração de RLS antes de inspecionar a estrutura e o processo de cadastro. Não compartilhar e-mails, IDs de usuários, chaves ou dados de autenticação.

### Estrutura de `public.profiles` confirmada — 2026-11-16

Resultado encaminhado pelo responsável a partir de `information_schema.columns`: `id uuid NOT NULL`, `full_name text NULL`, `company_name text NULL`, `role text NOT NULL DEFAULT`, `created_at timestamptz NULL DEFAULT`, `email text NULL`. **Não existe `updated_at`** nessa tabela.

Consequência no código: o `UserService` da PR #8 foi ajustado para não enviar `updated_at` em atualizações e para refletir as colunas existentes no tipo `UserProfile`. Não foi aplicada migração nem preenchimento de perfis.

**Ainda necessários, do mesmo bloco de auditoria:** saída dos gatilhos não internos da tabela `auth.users` e resultado de `rls_ativa`, `rls_forcada` e `numero_politicas` para `public.profiles`.

## Antes de mostrar “Total de usuários cadastrados”

1. Confirmar as quatro contagens acima na instância oficial.
2. Verificar regras RLS aplicáveis a `profiles` para o papel de administrador, sem abrir `auth.users` ao browser.
3. Definir mecanismo autorizado no servidor, com autenticação de usuário e autorização administrativa confirmadas, para informar total de Auth — sem chave privilegiada em Javascript público.
4. Testar com conta admin e conta comum (negação), além de falha de rede e paginação.
5. Só então substituir o rótulo “Perfis visíveis” pelo total de contas de Auth.

## Escopo de validação da PR #8

- `/admin`: valores reais somente quando consultas retornam sucesso; receita e índices inventados ausentes.
- `/admin/users`: nenhuma conta demo, paginação das consultas e atributos de Auth não verificados não são apresentados como status oficial.
- `/admin/quotes`: não inventar orçamentos após falha.
- `/admin/reports`: não apresentar valores fictícios de receita ou vendas.
- Notificações do cabeçalho: contador fixo removido.

**Sem merge, deploy ou alteração de banco até revisão, testes e autorização específica.**
