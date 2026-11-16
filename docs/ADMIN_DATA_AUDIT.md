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
