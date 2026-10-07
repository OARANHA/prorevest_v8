# Worklog

Registro cronológico curto do trabalho real. Não usar como changelog de cada linha de código.

## 2026-10-07 — Baseline e acesso operacional

- Auditado o site público antes de alterações.
- Identificadas inconsistências de SEO, contato, catálogo, Studio e conteúdo.
- Corrigido problema de `initramfs` da VPS causado por biblioteca NSS ausente.
- Instalado Wandora Agent Mesh com Node 22 isolado para não alterar Node 20 da aplicação.
- Criado target `prorevest-managed-admin`.
- Gerado snapshot sanitizado do projeto em produção.
- Encontrados scripts históricos com Supabase `service_role` hardcoded e outras credenciais antigas.
- Criada árvore limpa para versionamento.
- Criado e enviado baseline ao repositório `OARANHA/prorevest_v8`.
- Confirmados Instagram oficial e telefone/WhatsApp.
- Redefinida prioridade do produto: Studio + autenticação primeiro.
- Iniciada documentação viva para independência de histórico de chat.

## 2026-10-07 — Diagnóstico Studio/Auth em andamento

- Confirmado projeto Supabase oficial: `gtfvhktgxqtdrnaxizch`.
- Corrigida manualmente no Dashboard a Auth URL Configuration: Site URL do domínio oficial e redirects para `/auth/callback` e `/reset-password`.
- Confirmado em produção que `/studio/project/1` e `/novo-projeto` retornavam 404.
- Identificado que `/studio` e `/studioprorevest` usavam implementações diferentes; o visualizador real estava em `/studioprorevest`.
- Identificado que o recovery transportava token manualmente via `sessionStorage`, divergindo do fluxo atual de sessão do Supabase.
- Identificado que a chamada de IA não possuía timeout e podia deixar `isGenerating` preso após falha.
- Aplicados patches somente na branch `diagnosis/studio-auth`; produção ainda não foi alterada.
- Durante a edição, uma leitura sanitizada pelo conector reintroduziu temporariamente marcadores `[REDACTED]` no worktree de `AuthContext.tsx`; foram restaurados os parâmetros normais antes do commit. O `main` não foi alterado e nenhum segredo foi restaurado.
- Build completo cliente+SSR validado com `BUILD_EXIT=0` usando `NODE_OPTIONS=--max-old-space-size=768` e `--minify false` no broker limitado.
- Build minificado do cliente também compilou; tentativas anteriores do ciclo completo esbarraram no limite de memória do broker, não em erro de código.
- Adicionados redirects de compatibilidade para `/novo-projeto`, `/studio/project/:projectId` e `/studioprorevest`.
- PR draft #1 criada no GitHub para revisão antes de merge/deploy.
- Branch local sincronizada com o commit remoto reconstruído via Git Data API; árvore local/remota idêntica.
- Build cliente+SSR repetido com `BUILD_EXIT=0` usando 768 MB no broker.
- Smoke HTTP local executado com `HOST=127.0.0.1`: `/studio` 200; redirects legados 302 corretos; `/login?redirect=/studio` 200; `/reset-password` 200.
- Revisão comparada com a documentação atual do Supabase confirmou o fluxo `resetPasswordForEmail` → `PASSWORD_RECOVERY` → `updateUser`.
- E2E real de recuperação: o e-mail foi enviado; ao abrir o link a sessão foi criada (header autenticado), porém `/auth/callback` retornou 404 em produção.
- Causa confirmada: `app/routes/auth/callback.tsx` existia, mas `app/routes.ts` não registrava `auth/callback`. Rota adicionada à PR #1.

## Próximo trabalho

Revisar diff, buildar e testar Studio/Auth antes de qualquer deploy.

- Build cliente+SSR após registrar `auth/callback`: `BUILD_EXIT=0`.
- Smoke local de `/auth/callback` retornou 200; `/reset-password` também retornou 200.

- Diagnóstico adicional: login, callback e cadastro ainda enviavam usuário comum para `/meus-projetos`; regra alterada para `/studio`.
- Causa do header sobreposto em `/meus-projetos`: o `AppLayout` já renderizava `Header`/`SiteFooter`, enquanto a rota adicionava `SiteHeader`/`SiteFooter` novamente.
- Wrappers duplicados removidos de `/meus-projetos`, `/esqueci-senha`, `/reset-password` e `/auth/callback` para usar o layout global oficial.
## 2026-10-07 — Deploy PR #1

- PR #1 foi squash-merged em `main` no commit `301b53edf6aeeac173bf59d9e68526ce18ff9e66`.
- Deploy controlado executado com backup em `/opt/wandora/ops-workspace/prorevest-deploy-backups/20261007-161028-301b53edf6aeeac173bf59d9e68526ce18ff9e66`.
- `prorevest-app` reiniciado de forma direcionada e retornou `online`.
- Smoke público pós-deploy: `/`, `/studio`, `/auth/callback`, `/reset-password`, `/login` e `/meus-projetos` retornaram 200.
- Redirects legados pós-deploy: `/studioprorevest` → `/studio`; `/novo-projeto` → `/studio`; `/studio/project/:id` → `/studio?projectId=:id`.
- Novo recovery real foi disparado após o deploy para repetir o E2E no código publicado.
- Pendente: abrir o link mais recente, criar nova senha, validar login → `/studio` e validar Studio com upload/cor/textura.

## 2026-10-07 — Hotfix urgente da Paleta ProRevest

- Relato real: no Studio, abrir Paleta ProRevest e rolar deixava o spinner ativo sem carregar as demais cores.
- Causa identificada no hook `usePaginatedColors`: `fetchPage` dependia de `isLoading`, recriando callbacks e reacionando effects de carga; havia também duas cargas iniciais no modal.
- Correção em `fix/studio-palette-pagination`: lock por ref, página seguinte explícita, ordenação estável, cancelamento de requisição anterior, timeout de 15s e UI de retry.
- Os dois seletores de paleta (modal e floating) passam a usar o mesmo fluxo previsível de carga inicial + infinite scroll.
- Build cliente+SSR da branch concluído com `BUILD_EXIT=0`. Pendente: revisão final, merge/deploy e E2E real no Studio.

## 2026-10-07 — Deploy hotfix PR #2

- PR #2 foi squash-merged em `main` no commit `3fe89677a6b37505c15b522192d29530af06bcc1`.
- Deploy controlado concluído com backup em `/opt/wandora/ops-workspace/prorevest-deploy-backups/20261007-165005-3fe89677a6b37505c15b522192d29530af06bcc1`.
- `prorevest-app` voltou `online` e smoke público de Home/Studio/Auth retornou 200.
- Automação pública não conseguiu reproduzir a paleta completa: sem projeto/imagem ativa viu apenas a grade estática inicial de 6 cores; portanto o E2E do infinite scroll continua pendente no fluxo real do usuário.
- Pendente imediato: no Studio com imagem/projeto ativo, abrir Paleta ProRevest e rolar além do primeiro lote para confirmar carregamento das próximas cores e ausência de spinner infinito.
