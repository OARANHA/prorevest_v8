# Problemas conhecidos

Última atualização: 2026-10-07

Status: `OPEN`, `INVESTIGATING`, `FIXED`, `WONTFIX`.

| ID | Prioridade | Status | Área | Problema |
|---|---|---|---|---|
| PRV-001 | P0 | INVESTIGATING | Studio | Studio funciona, mas apresenta falhas intermitentes (“bugadas”) ainda não reproduzidas de forma determinística. |
| PRV-002 | P0 | OPEN | Studio | Possibilidade de ficar preso em estado de carregamento. |
| PRV-003 | P0 | OPEN | Studio | Existem rotas/entradas concorrentes `/studio` e `/studioprorevest`; definir rota canônica sem quebrar links existentes. |
| PRV-004 | P0 | OPEN | Auth | Fluxo de recuperação/redefinição de senha não está funcional. |
| PRV-005 | P0 | OPEN | Auth | Login/callback/sessão precisam de teste ponta a ponta antes de serem considerados confiáveis. |
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

## Como atualizar

Ao corrigir um item:
1. mudar status para `FIXED`;
2. registrar commit/data;
3. adicionar nota curta do teste executado;
4. registrar no `WORKLOG.md`.
