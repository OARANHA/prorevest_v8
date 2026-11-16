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

## Continuidade do incidente original — cadastro concluído sem aparecer no Admin

**Correção de escopo:** o problema relatado já era que usuários conseguiam criar contas, mas não apareciam na gestão de usuários. O indicador falso era um sintoma adicional; a PR #8, até este ponto, não resolve a ausência de perfis. A auditoria de 18 contas Auth e 9 perfis quantifica a divergência existente.

### Caminho de código verificado

- `app/contexts/AuthContext.tsx`: `signUp` (linhas 172-185 na revisão de 2026-11-16) chama apenas `supabase.auth.signUp`, sem inserção/garantia de perfil na operação de cadastro.
- `app/contexts/AuthContext.tsx`: criação do perfil depende de callback `onAuthStateChange` quando há `session.user` (linhas 114-127), que executa `createOrUpdateProfile` sem aguardar o resultado. Se a consulta, inserção ou atualização falhar, o helper só registra o erro e retorna sem reportar falha ao fluxo de cadastro.
- `app/services/userService.ts`: `getAllUsers` consulta exclusivamente `public.profiles`; logo uma conta em `auth.users` sem perfil não aparece na listagem administrativa.
- `app/services/databaseService.ts`: existe método legado de recuperação de perfis que tenta chamar RPC `execute_sql` pelo cliente; **não executar** sem auditoria. `/admin/init-profiles` invoca o método em loader GET, portanto é fluxo legado de escrita e deve ser isolado até uma solução segura.
- `app/routes/admin/make-admin.tsx`: rota legada tenta atualizar `profiles.role` da própria conta em loader; revisar e desabilitar como ação de elevação de privilégios sem autorização explícita no servidor.

**Inferência técnica limitada:** a implementação frontend não garante perfil no momento do cadastro; isso torna possível a divergência observada. Não comprova que inexista trigger no banco nem qual erro/RLS impediu cada uma das 9 criações.

### Correção permanente proposta

1. Verificar os gatilhos não internos de `auth.users`, a definição de função associada e políticas RLS de `public.profiles`, no projeto correto, **somente leitura**.
2. Garantir criação atômica de perfil no lado do banco na inserção de `auth.users` ou fluxo servidor equivalente, sem privilégio de cliente, com perfil inicial `customer` e e-mail/nome provenientes de Auth. Não elevar privilégios automaticamente.
3. Preparar backfill idempotente exclusivamente das contas sem perfil, após confirmar a regra de criação e os dados de cadastro. Não alterar contas existentes nem sobrescrever papéis ou nomes.
4. Remover dependência do cadastro em callback silencioso, evitar atualizações involuntárias de nomes de perfis existentes e reportar falha de provisionamento quando couber.
5. Testar cadastro com confirmação de e-mail, primeiro login, criação de perfil, listagem no Admin, conta sem perfil, RLS com conta comum e falhas/duplicação.

**Sem aplicar DDL, backfill, mudanças em RLS ou elevação de privilégios com os dados disponíveis.**

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


## Preparação da correção integral — PR #8, ainda sem deploy

O problema original não é apenas um número incorreto: `auth.users` possui contas que não têm a correspondente linha em `public.profiles`. O site depende de perfis para listagem administrativa e papel de acesso.

### Alterações de código preparadas

- Cadastro em `/register`: só redireciona ao Studio com sessão válida; quando confirmação por e-mail estiver pendente, apresenta orientação adequada.
- `AuthContext`: não executa mais gravações silenciosas em `profiles` por `onAuthStateChange`; mantém leitura de papel em efeito separado, com estado de carregamento até a consulta terminar.
- `/admin/users`: consulta somente leitura e paginada dos perfis acessíveis sob RLS. Ações administrativas de permissão/senha/bloqueio ficam indisponíveis até existir backend seguro.
- Rotas legadas `/admin/init-db`, `/admin/init-profiles`, `/admin/make-admin` e `/debug-user` removidas do roteador e desativadas nos próprios módulos. Removidos bootstrap com credencial fixa e RPC `execute_sql` do serviço do browser.

### Migração proposta — não executada

Arquivo: `docs/sql/PROFILES_AUTH_SYNC_REVIEW_ONLY.sql`.

A migração somente poderá ser aplicada **depois de verificar os gatilhos não internos de INSERT em `auth.users`, as constraints de `profiles.id`, o papel padrão de `profiles.role` e as políticas de RLS**. Uma execução incompatível é bloqueada por guardas e transação. Não criar trigger redundante às cegas.

A proposta cria um gatilho controlado do lado do Postgres para garantir `public.profiles` no mesmo ciclo de criação do Auth, com `role = 'customer'`, sem assumir permissões de `user_metadata`. O backfill insere apenas IDs de Auth ainda ausentes na tabela, com `ON CONFLICT (id) DO NOTHING`; não sobrescreve nomes, e-mails ou papéis de perfis existentes.

### Preflight consolidado em uma consulta

Use `docs/sql/AUTH_PROFILE_PREFLIGHT_READ_ONLY.sql` no SQL Editor do projeto oficial. Ele devolve **uma linha com quatro colunas JSON**: gatilhos de INSERT em Auth, estado RLS de profiles, políticas de profiles e índices únicos de profiles. Isso evita que o editor mostre apenas a última das consultas individuais. A consulta não modifica registros nem lista usuários.

Revise eventuais expressões de política antes de compartilhar capturas, caso incluam alguma identidade pessoal fixa.

### Diagnóstico de RLS e risco de elevação de papel — 2026-11-16

Resultados informados pelo responsável:
- `auth.users` não possui gatilho de `INSERT` não interno;
- RLS da tabela `public.profiles` está ativa e não é forçada;
- `profiles.id` possui índice único de chave primária;
- `Admins can manage all profiles` é política `ALL` para `public` e usa `is_admin_user()`;
- `Users can update their own profile` permite `UPDATE` da linha cujo `auth.uid() = id`.

**Risco a validar:** essa política de UPDATE não impede mudança do próprio `role` quando o papel autenticado também possui privilégio de UPDATE dessa coluna. A tela `/perfil` e o hook `useProfile` foram limitados a escrever `full_name` e `company_name`, mas a defesa precisa existir no Postgres, não apenas no frontend.

Auditoria pendente no projeto oficial: execute `docs/sql/AUTH_ROLE_SECURITY_PREFLIGHT_READ_ONLY.sql`, que retorna permissões efetivas de alteração de `role`, código da função `is_admin_user()` e constraints de `profiles`, sem consultar registros de pessoas. **Não incluir privilégios de UPDATE para `role` a usuários comuns ao aplicar a correção**. Se já existirem, preparar uma mudança separada e revisável de `REVOKE`/concessão por coluna, preservando a edição de nome e empresa.

### Resultado confirmado de privilégios — 2026-11-16

Consultado pelo responsável no SQL Editor oficial:

- `authenticated_pode_atualizar_tabela = true` e `authenticated_pode_atualizar_role = true`;
- `anon_pode_atualizar_role = true` (o RLS normalmente impede UPDATE sem sessão, mas o grant é indevido);
- `public.is_admin_user()` é `SECURITY DEFINER`, consulta `profiles.role = 'admin'` pelo `auth.uid()`, e `proconfig = null` (sem `search_path` fixo);
- Constraints de `public.profiles`: PK `id`, FK `id` → `auth.users(id)` ON DELETE CASCADE.

**P0 confirmado:** um usuário autenticado possui privilégio suficiente para tentar atualizar o próprio `role` para `admin` pela API, já que a política RLS do próprio perfil não restringe colunas. Não confundir o grant de `anon` com demonstração de atualização efetiva como visitante: falta row visibility no RLS para esse papel.

Migração de correção transacional **preparada, não aplicada:** `docs/sql/PROFILE_ROLE_LOCKDOWN_REVIEW_ONLY.sql`. Revoga UPDATE geral e colunar de `PUBLIC`, `anon` e `authenticated`; devolve apenas UPDATE (`full_name`, `company_name`) a `authenticated`; reescreve a função de papel com tabelas qualificadas e `search_path=''`, preservando a checagem por `auth.uid()`. A transação aborta se `role` continuar alterável ou nome/empresa perderem UPDATE. Os papéis administrativos passam a exigir um endpoint seguro, ainda não implantado.

**Sequência obrigatória:** backup/revisão → aprovar/aplicar `PROFILE_ROLE_LOCKDOWN_REVIEW_ONLY.sql` → conferir SQL de grants (ambos UPDATE de role = false) + login Admin/conta comum → aprovar/aplicar `PROFILES_AUTH_SYNC_REVIEW_ONLY.sql` → conferir zero contas sem perfil → E2E do registro/login/Admin → build oficial → aprovação de merge/deploy. O script do trigger agora rejeita execução se a proteção de `role` e `search_path` estiver ausente.

### Etapa 1 aplicada no Supabase oficial — verificação informada pelo responsável

Em 2026-11-16, o responsável executou a etapa de bloqueio de UPDATE em `profiles.role` e informou:

| Resultado do SQL | Valor |
|---|---|
| `authenticated_update_geral` | `false` |
| `authenticated_update_role` | `false` |
| `anon_update_role` | `false` |
| `authenticated_update_nome` | `true` |
| `authenticated_update_empresa` | `true` |
| `config_is_admin_user` | `["search_path=\\"\\""]` |

Esses valores correspondem às pós-condições esperadas da etapa 1. Não representam, por si só, E2E autenticado nem comprovação de que nenhum perfil foi promovido antes da correção.

**Etapa 2 ainda não executada:** o script `docs/sql/PROFILES_AUTH_SYNC_REVIEW_ONLY.sql` foi ajustado para reconhecer a codificação `search_path=""` em `pg_proc.proconfig` (sem esse ajuste a guarda abortaria indevidamente). Executar somente a versão atual da branch, **não uma cópia anterior**. Verificar backup/rollback, confirmar projeto `gtfvhktgxqtdrnaxizch`, executar o arquivo integralmente no SQL Editor. A consulta de conferência roda **depois do COMMIT** e apresenta `contas_auth`, `perfis`, `contas_sem_perfil`, `perfis_sem_conta` e `gatilho_ativo` (esperado: `true`). Se houver erro, não executar correções improvisadas nem uma segunda tentativa sem revisar o erro.

### Ordem obrigatória da publicação

1. Examinar os resultados read-only de trigger, RLS, constraints e políticas do Supabase correto `gtfvhktgxqtdrnaxizch`.
2. Revisar e aprovar separadamente a migração SQL. Garantir possibilidade de rollback do gatilho e cópia de segurança do banco.
3. Aplicar a migração aprovada **antes** de publicar o frontend que passou a depender dela.
4. Repetir contagens agregadas no SQL Editor; conferir `contas_sem_perfil = 0`. Não presumir que as contagens sejam eternamente 18/18.
5. Testar E2E com conta controlada: cadastro + confirmação de e-mail + primeiro login + perfil + listagem em `/admin/users`; conferir que conta comum não acessa dados de terceiros.
6. Executar `npm ci`, `node scripts/test-admin-auth-static.mjs`, checagem de tipos e build **minificado com variáveis públicas oficiais** no processo de release, sem imprimir valores.
7. Obter aprovação explícita para merge/deploy, usar script controlado de deploy com backup/rollback, realizar smoke de Studio/Auth/admin.

**Não realizar merge/deploy de PR #8 antes do SQL e dos testes autenticados.**

