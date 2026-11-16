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

- **P0 confirmado por SQL oficial (2026-11-16):** UPDATE de `profiles.role` concedido a `authenticated` e `anon`; função `is_admin_user()` `SECURITY DEFINER` sem `search_path` fixo. Bloqueio de segurança para publicação. Revisada migração de mitigação `docs/sql/PROFILE_ROLE_LOCKDOWN_REVIEW_ONLY.sql` (NÃO executada); exigida antes do trigger/backfill, que agora tem guarda contra grants inseguros.
