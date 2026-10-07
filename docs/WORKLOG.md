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

## Próximo trabalho

Revisar diff, buildar e testar Studio/Auth antes de qualquer deploy.
