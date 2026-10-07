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
| PRV-006 | P1 | OPEN | Catálogo | Filtro/slider de preço não faz sentido para o site institucional; produtos não devem ter preço aqui. |
| PRV-007 | P1 | OPEN | Home | Produtos em destaque podem apresentar estado vazio. |
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
| PRV-021 | P0 | OPEN | Auth/Segurança | Existe e-mail de superadmin legado hardcoded em `app/services/databaseService.ts`; revisar junto do fluxo de inicialização/admin e remover dependência de identidade fixa. |
| PRV-022 | P0 | INVESTIGATING | Navegação | Produção confirmada com 404 em `/studio/project/1` e `/novo-projeto`. Redirects de compatibilidade foram adicionados e validados em smoke HTTP local; pendente de deploy/smoke em produção. |

## Como atualizar

Ao corrigir um item:
1. mudar status para `FIXED`;
2. registrar commit/data;
3. adicionar nota curta do teste executado;
4. registrar no `WORKLOG.md`.
