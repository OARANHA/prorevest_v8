# Problemas conhecidos

Última atualização: 2026-10-07

Status: `OPEN`, `INVESTIGATING`, `FIXED`, `WONTFIX`.

| ID | Prioridade | Status | Área | Problema |
|---|---|---|---|---|
| PRV-001 | P0 | INVESTIGATING | Studio | Studio funciona, mas apresenta falhas intermitentes (“bugadas”) ainda não reproduzidas de forma determinística. |
| PRV-002 | P0 | INVESTIGATING | Studio | Processamento de IA não tinha timeout e `handleApply` podia manter `isGenerating=true` após exceção. Patch na branch `diagnosis/studio-auth` compilado em build cliente+SSR; pendente de teste runtime/E2E antes de fechar. |
| PRV-003 | P0 | INVESTIGATING | Studio | `/studio` e `/studioprorevest` apontavam para implementações diferentes. Patch torna `/studio` canônico e mantém redirects legados; build cliente+SSR e smoke HTTP local validados, pendente de teste funcional com Supabase/IA reais. |
| PRV-004 | P0 | INVESTIGATING | Auth | Supabase estava com Site URL em localhost e sem Redirect URLs; configuração corrigida no dashboard em 2026-10-07. Código de recovery foi ajustado para usar `PASSWORD_RECOVERY`/sessão e compilou; pendente de teste ponta a ponta por e-mail. |
| PRV-005 | P0 | INVESTIGATING | Auth | Login/callback/sessão precisam de teste ponta a ponta. Callback transportava token manualmente e login ignorava `?redirect=`; patches compilados na branch, pendentes de teste ponta a ponta. |
| PRV-006 | P1 | DEPLOYED / REAL-DATA E2E PENDING | Catálogo | PR #9 publicada em 2026-11-16 no SHA `c90fe9bc`: catálogo `/catalogo` com consulta pública real e filtros de nome/categoria/acabamento, sem preços/slider ou produtos fictícios. Detalhe `/produto/:slug` sem frete/avaliações simuladas. HTTP público 200 após deploy; falta testar busca, filtros, fichas e imagens com registros reais e responsividade. |
| PRV-007 | P1 | DEPLOYED / VISUAL E2E PENDING | Home/Produtos | PR #9 publicada no SHA `c90fe9bc`: vitrine única de produtos em destaque reais e não arquivados, sem fallback inventado, preços, notas, durabilidade de 7 anos ou números `200+` não verificados. Home HTTP 200 pós-deploy; confirmar vitrine, navegação e imagens no navegador. |
| PRV-008 | P1 | OPEN | Contato | Números divergentes aparecem em conteúdo antigo. Oficial: (51) 98660-5758. |
| PRV-009 | P1 | OPEN | Social | Instagram deve apontar para @prorevestoficial. |
| PRV-010 | P1 | OPEN | Contato | E-mail oficial ainda precisa ser confirmado. |
| PRV-011 | P1 | OPEN | SEO | Canonical/metadados de páginas internas precisam ser individualizados. |
| PRV-012 | P1 | OPEN | SEO | Dados GEO antigos apontavam incorretamente para São Paulo/SP. |
| PRV-013 | P1 | OPEN | Legal | Revisar destinos dos links legais/institucionais do footer. |
| PRV-014 | P2 | OPEN | Conteúdo | Métricas institucionais divergentes (ex.: anos, cores, projetos). |
| PRV-015 | P2 | OPEN | Conteúdo | Blog/conteúdo contém material com aparência de placeholder. |
| PRV-016 | P2 | OPEN | Performance | Bundle cliente principal observado acima de ~1 MB após minificação. |
| PRV-017 | P2 | OPEN | Build | Vite alerta módulos Node externalizados para browser em rota de IA e uso de dotenv. |
| PRV-018 | P2 | OPEN | Build | Diversos chunks de rota foram gerados vazios. |
| PRV-019 | P2 | OPEN | Dependências | Dependências depreciadas foram observadas durante `npm ci`; revisar sem upgrades cegos. |
| PRV-020 | P0 | OPEN | Segurança | Documentação histórica continha credencial de teste em texto aberto e ela já esteve em histórico público do Git. Estado atual foi saneado; se a credencial ainda puder ser válida, rotacionar antes de considerar o incidente encerrado. |
| PRV-021 | P0 | OPEN | Auth/Segurança | Na PR #8 foi removido do código atual o bootstrap de superadmin com credenciais fixas e desativadas as rotas que o chamavam. Risco ainda precisa ser verificado em histórico e revogação/rotação de credenciais eventualmente válidas; **não implantado**. |
| PRV-022 | P0 | INVESTIGATING | Navegação | Produção confirmada com 404 em `/studio/project/1` e `/novo-projeto`. Redirects de compatibilidade foram adicionados e validados em smoke HTTP local; pendente de deploy/smoke em produção. |
| PRV-023 | P0 | INVESTIGATING | Auth/UI | Login, callback e cadastro enviavam usuários comuns para `/meus-projetos`; essa rota também renderizava `SiteHeader`/`SiteFooter` sobre o `AppLayout`, duplicando o cabeçalho e o rodapé. Patch redireciona usuário comum para `/studio` e remove wrappers duplicados nas telas Auth/Projetos. |
| PRV-024 | P0 | RESOLVED | Studio/Paleta | Infinite scroll da Paleta ProRevest corrigido e validado em produção no fluxo real com projeto/imagem ativa. Novas cores carregam normalmente e o spinner não fica preso. Hotfix implantado no commit `3fe8967`. |
| PRV-025 | P1 | DEPLOYED / AUTH E2E PENDING | Admin/Dados | Supabase oficial em 2026-11-16: `auth.users=18`, `profiles=18`, zero contas sem perfil ou perfis órfãos, trigger de criação de perfil habilitado. PR #8 implantada no merge `7a15951` (deploy success/PM2 online; smoke `/admin` e `/admin/users` HTTP 200). Ainda não há teste autenticado de listagem dos 18 perfis com admin e de cadastro novo; dados do painel dependem da sessão e de RLS. |
| PRV-026 | P0 | EXPOSURE REMOVED / FEATURES PENDING | Admin/Auth/Segurança | PR #8 publicada em `7a15951`: chamadas `supabase.auth.admin` e log de senha temporária retirados do frontend; operações de bloquear, desbloquear e redefinir senha por admin permanecem ocultas/desabilitadas até implementação e testes de endpoint seguro no servidor com autorização. Validação autenticada continua pendente. |
| PRV-027 | P0 | MITIGATED IN DEPLOY / AUTH E2E PENDING | Admin/Auth/Segurança | PR #8 publicada em `7a15951`. Smoke público pós-deploy confirmou HTTP 404 em `/admin/init-profiles`, `/admin/make-admin` e `/debug-user`; essas rotas legadas de SQL/backfill/elevação de papel não são utilizáveis na release. Manter E2E de acesso autenticado/negativa de autoelevação pendente. |
| PRV-028 | P0 | MITIGATED IN DB / AUTH E2E PENDING | Auth/RLS/Privilégios | Pós-etapa 1 oficial em 2026-11-16: `authenticated_update_geral=false`, `authenticated_update_role=false`, `anon_update_role=false`, `authenticated_update_nome=true`, `authenticated_update_empresa=true`, `config_is_admin_user=["search_path=\"\""]`. Frontend corrigido publicado via PR #8 (`7a15951`). Confirmar E2E que cliente comum não altera `role` e admin mantém visibilidade autorizada. Estado final da sincronização Auth/Profiles: 18/18, trigger habilitado; **não reexecutar** migração de backfill. |

## Como atualizar

Ao corrigir um item:
1. mudar status para `FIXED`;
2. registrar commit/data;
3. adicionar nota curta do teste executado;
4. registrar no `WORKLOG.md`.

## 2026-10-27 — Regressão pós-PR #3 (hotfix em andamento)

- **P0, Auth/Catálogo:** build isolado sem `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` produziu cliente `supabase=null`, quebrando login e carregamento de produtos. Foi realizado rollback em produção e login/produtos voltaram a funcionar conforme relato do operador. O hotfix adiciona preflight obrigatório de variáveis públicas ao build, sem imprimir valores.
- **P0, Studio:** `/studio` aponta direto ao editor, independentemente de sessão. Hotfix adiciona gateway que mostra a apresentação para visitante e o editor para autenticado; autenticação precisa de E2E com ambiente oficial antes do próximo deploy.
- **Obrigatório antes de republicar:** identificar fonte confiável das variáveis públicas usadas na compilação antiga, disponibilizá-las apenas ao processo de build, executar build real e E2E de login/produtos/Studio. Não publicar artefato compilado com placeholders.

## 2026-10-27 — Paleta de cores → Studio (diagnóstico)

- **P1, OPEN:** na rota `/paleta-cores`, o botão “Adicionar ao Projeto” no modal de cor não possui `onClick` e não salva/navega para o Studio. A interface promete ação ainda inexistente.
- Fluxo a implementar em branch própria, sem interferir no redesign do blog: selecionar cor (id, nome, hexadecimal, código ProRevest), iniciar intenção contextual, preservar escolha ao passar pela apresentação/login, exibir confirmação no Studio e permitir aplicar a um projeto/parede específica. Nunca criar projeto automaticamente ou considerar a cor aplicada sem confirmação.
- Validar entrada de visitante e autenticado, persistência durante redirect/login, seleção de projeto, estado sem projeto, falhas de carga e compatibilidade com cores do banco. Não transferir dados de usuário por query string nem contornar a proteção de autenticação.
