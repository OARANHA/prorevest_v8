# Estado atual do projeto

Última atualização: 2026-10-28

## Objetivo principal

O site institucional `https://prorevesttintas.com.br/` é o foco atual. A prioridade de produto é transformar o **Studio ProRevest** em uma ferramenta confiável para clientes, arquitetos e especificadores visualizarem tintas, cores e efeitos em imagens de ambientes enviadas por eles.

A loja `https://loja.prorevesttintas.com.br/` é um canal separado e futuro para compra. O site institucional não deve depender de preços para cumprir sua função.

## Jornada principal desejada

Home → Studio → upload do ambiente → aplicar tinta/cor/efeito → visualizar/comparar → salvar projeto → produto/contato/WhatsApp.

Jornada secundária:

Catálogo → produto/efeito → “Visualizar no meu ambiente” → Studio.

## Público prioritário

- Arquitetos e especificadores.
- Consumidores avaliando acabamento/efeito antes da aplicação.
- Profissionais buscando catálogo e informações técnicas.

Arquitetos já estão acessando o site, portanto estabilidade do Studio e recuperação de acesso têm prioridade sobre refinamentos cosméticos.

## Dados oficiais confirmados

- Instagram: https://www.instagram.com/prorevestoficial/
- Telefone/WhatsApp: (51) 98660-5758
- Loja: https://loja.prorevesttintas.com.br/
- Site institucional: https://prorevesttintas.com.br/

E-mail institucional oficial: **a confirmar**.

## Estado técnico conhecido

- React 18 + React Router 7 + TypeScript + Vite.
- Supabase para autenticação/dados/storage.
- Projeto Supabase oficial da ProRevest: `gtfvhktgxqtdrnaxizch`.
- Auth URL Configuration confirmada em 2026-10-07: Site URL `https://prorevesttintas.com.br`; redirects permitidos `/auth/callback` e `/reset-password` no domínio oficial.
- PR #1 de Studio/Auth implantada em produção em 2026-10-07 no commit `301b53edf6aeeac173bf59d9e68526ce18ff9e66`; smoke HTTP pós-deploy aprovado. Recovery/login E2E ainda em validação.
- Produção atual roda com Node 20.19.5 e PM2.
- Processo PM2 observado: `prorevest-app`.
- Build atual: `npm run build`.
- O código organizado está versionado em `OARANHA/prorevest_v8`.
- Baseline de produção sanitizado criado em 2026-10-07.
- Segredos encontrados em scripts antigos foram removidos do baseline versionável.
- Node 22 do Agent Mesh está isolado em `/opt/wandora/node22`; não substituir o Node global da aplicação sem plano de migração.

## Release operacional encerrada — 2026-10-28

- Produção publicada no commit `28d1e0e8f6b059b082664bad2bbf62bfc4677966`, com PRs #5 e #6 integradas.
- Blog editorial, seleção Paleta → Studio e aplicação com Gemini testados e aprovados pelo responsável no navegador oficial.
- Smoke público de Home, Blog, Paleta, Studio, Login e Catálogos: 6/6 HTTP 200; `prorevest-app` online.
- Backup da release anterior: `/opt/wandora/ops-workspace/prorevest-deploy-backups/20261028-003021-28d1e0e8f6b059b082664bad2bbf62bfc4677966`.
- Próximos trabalhos devem partir desta base estável em novas branches e seguir o fluxo obrigatório.

## Prioridade imediata

1. Diagnosticar e estabilizar o Studio.
2. Corrigir login, sessão, “esqueci minha senha” e redefinição.
3. Melhorar a jornada do arquiteto e os CTAs para o Studio.
4. Ajustar catálogo para funcionar sem preço e conectar produtos ao Studio.
5. Corrigir dados institucionais, SEO e inconsistências.
6. Tratar performance/arquitetura conforme impacto real na experiência.

## Regra de mudança

Nenhuma mudança deve ir direto para produção.

Fluxo obrigatório:

diagnóstico → proposta → alteração em Git → diff/revisão → build/teste → commit → aprovação → deploy → smoke test → atualização da documentação.

## Correção administrativa em revisão — 2026-11-16

- PR #8 (Draft, branch `fix/admin-dashboard-real-metrics-20261116`) corrige indicadores fictícios de usuários/orçamentos, retira receita do dashboard e impede a apresentação de dados demonstrativos como reais. A produção permanece no baseline da release de 28/10.
- Auditoria administrativa informada pelo responsável em 2026-11-16 no Supabase oficial: **18 contas em `auth.users`; 9 perfis em `public.profiles`; 9 contas sem perfil; 0 perfis órfãos**. Não equivale ao número de usuários ativos/confirmados. A tela de usuários lista apenas perfis acessíveis conforme RLS, não o total de contas. `docs/ADMIN_DATA_AUDIT.md` registra os números e investigação somente leitura.
- Chamadas administrativas de Auth no navegador foram retiradas da branch; redefinição/bloqueio administrativo requer implementação segura no servidor e não está liberado.
- Correção de Auth/Admin na PR #8 ampliada: cadastro sem sessão passa a orientar confirmação de e-mail; `AuthContext` não cria mais perfis no callback; diretório de usuários é somente leitura; rotas legadas de superadmin/backfill/debug foram desativadas e credencial fixa removida do código atual. Migração guardada de trigger e backfill em `docs/sql/PROFILES_AUTH_SYNC_REVIEW_ONLY.sql`, **não executada**.
- Validados em clone isolado: TypeScript direcionado (0 erros), **25 verificações estáticas** após correção do perfil, build anterior cliente+SSR **sem minificação** exit 0 com configuração sintética e 11 smokes HTTP (7 rotas esperadas 200, 4 legadas 404). Build completo cliente+SSR **sem minificação**, no HEAD atual e com ambiente sintético, concluiu com exit 0; smoke local posterior: **7 rotas HTTP 200 e 3 rotas legadas HTTP 404**, sem validação autenticada.
- Preflight Supabase oficial informado pelo responsável: **nenhum trigger de INSERT em `auth.users`**, RLS ativa, `profiles_pkey(id)` único, política `UPDATE` do próprio perfil e `ALL` para admin por `is_admin_user()`. Risco P0 PRV-028: verificar se `authenticated` consegue atualizar `profiles.role` e auditar função `is_admin_user()` antes de liberar publicação. UI e hook `/perfil` já foram restringidos a editar nome/empresa, mas banco ainda requer verificação.
- **Pendente:** consulta read-only de grants/função admin do Supabase oficial, revisão/autorização da migração e de eventual correção RLS, E2E autenticado, build minificado no ambiente de release oficial e aprovação expressa para merge/deploy.

- **Etapa 1 de segurança executada pelo responsável no Supabase oficial (2026-11-16):** pós-verificação informa `authenticated_update_geral=false`, `authenticated_update_role=false`, `anon_update_role=false`, `authenticated_update_nome=true`, `authenticated_update_empresa=true`, `is_admin_user.proconfig=["search_path=\"\""]`. P0 PRV-028 mitigado segundo grants; E2E de usuário comum/admin ainda não executado. A etapa 2 `docs/sql/PROFILES_AUTH_SYNC_REVIEW_ONLY.sql` (trigger/backfill) **não foi executada**. A guarda da migração foi corrigida para interpretar `search_path=""` (Postgres).

- **2026-11-16 — Sincronização Auth/Profiles regularizada no Supabase oficial (resultado read-only do responsável):** `auth.users=18`, `profiles=18`, `contas_sem_perfil=0`, `perfis_sem_conta=0`; função `prorevest_create_auth_profile()` com `SECURITY DEFINER`, `search_path` vazio, execução pública negada, e trigger `AFTER INSERT` habilitado. Não reaplicar o SQL: a função já existia e a tentativa de reexecução retornou P0001. Não há evidência de quando ela foi instalada.
- **PR #8 segue Draft, sem merge/deploy.** Para publicação ainda faltam E2E autenticado de cadastro/confirmar e-mail/login/visibilidade no Admin e controle RLS, build minificado com env oficial e aprovação expressa do responsável.

## Produção atualizada — 2026-11-16 (substitui os estados de pré-deploy acima)

- **PR #8 integrada na `main`** no merge commit `7a15951bf2a2649aabede0de89fa54247311f63a`, após confirmação do responsável para prosseguir com publicação. Checkout isolado de build no commit `13e8fe3e26b3dbc73c37235b4c2749a46600c8b4`, com árvore Git idêntica à do merge.
- Build minificado **com configuração oficial** concluído no shell root da VPS pelo responsável (`✓ built in 27.47s`). Staging isolado 10/10: 7 rotas HTTP 200, 3 rotas antigas 404.
- Responsável executou `deploy-prorevest-pr8-20261116.sh` em `serv` e compartilhou saída `DEPLOY SUCCESS`, SHA `7a15951bf2a2649aabede0de89fa54247311f63a`, `pm2=online`. Smoke público: **9 rotas HTTP 200**, **3 rotas antigas HTTP 404**.
- Backup informado: `/opt/wandora/ops-workspace/prorevest-deploy-backups/20261116-183307-pr8-7a15951bf2a2649aabede0de89fa54247311f63a`. Não reexecutar automaticamente o script fixado neste SHA como procedimento de atualizações futuras.
- Supabase oficial: última evidência de 2026-11-16 continua 18 contas Auth / 18 perfis, zero contas sem perfil, trigger de criação habilitado. Migração `PROFILES_AUTH_SYNC_REVIEW_ONLY.sql` não deve ser reexecutada; função já existia.
- **E2E autenticado ainda pendente:** testar cadastro novo/confirmação de e-mail/primeiro login, listagem `/admin/users` sob sessão admin, bloqueio de acesso e de edição de `role` por conta comum e fluxos Studio. HTTP 200 não demonstra autorização, contagem visual ou fluxo de formulário.

## Blog e catálogo institucional — auditoria e melhorias em revisão (2026-11-16)

- Branch **`feat/blog-products-experience-20261116`** a partir de `main`. Estado **não publicado**; a versão de produção permanece no deploy da PR #8 (`7a15951`).
- Blog com busca/categoria/tag por URL, filtros derivados apenas de posts publicados, paginação preservando filtros, sem fallback fictício; artigo com 404 para slug não publicado, sem UPDATE em GET e Markdown seguro no SSR.
- Catálogo `/catalogo` e produto `/produto/:slug` sem preço, frete ou avaliações inventadas; dados públicos e categorias/acabamentos reais via Supabase, produto arquivado bloqueado, informações técnicas cadastradas, CTAs ao Studio e WhatsApp.
- Evidências técnicas: `node scripts/test-blog-products-static.mjs` **30 PASS**; teste dinâmico de payloads XSS/Markdown **PASS**; build cliente+SSR **sem minificação** com variáveis sintéticas **exit 0**; staging sintético **6/6 HTTP 200**. TSC geral possui erros anteriores fora das rotas editadas.
- Auditoria detalhada: `docs/BLOG_PRODUCTS_AUDIT.md`. **Pendências:** revisão editorial de conteúdo e fichas existentes, testes reais e responsivos no navegador, build minificado com env oficial e aprovação para merge/deploy.

- **Ampliação da auditoria de produtos na Home (branch em revisão):** as duas vitrines repetidas foram consolidadas em uma; removidas avaliações, preços, alegações de durabilidade, números `200+` e produtos fallback fictícios. A vitrine usa destaques reais não arquivados e mantém `#produtos`. A validação oficial e aprovação de deploy continuam pendentes.
