# Auditoria UX e operacional — Admin Produtos
Data: 2026-10-27
Status: diagnóstico de código, não teste autenticado em produção.

## Escopo consultado
- app/routes/admin/products.tsx
- app/services/productService.ts
- app/routes/admin-layout.tsx
- docs/DECISIONS.md, docs/ROADMAP.md, docs/KNOWN_ISSUES.md

## Achados verificáveis
1. **P0 / Variantes — exclusão simulada:** `handleDeleteVariant` confirma, registra `console.log` e recarrega; não chama exclusão. A UI não deve anunciar remoção que não ocorreu.
2. **P0 / Logout — sessão não encerrada na rota:** `handleLogout` apenas navega a `/login`; o caminho correto requer `signOut()` da sessão auth existente ou remoção desse botão redundante.
3. **P1 / Decisão de produto — preço no admin:** tabela exibe coluna Preço e formulário mantém `price`. O site institucional não deve exibir preços (DEC-002); avaliar se remover campo da UI administrativa sem alterar coluna de DB ou se uso administrativo isolado é necessário. Não apagar valores sem migração acordada.
4. **P1 / Search+paging:** `currentPage` não reseta ao alterar busca; uma busca pode devolver resultados fora da página selecionada e exibir vazio, com contador inadequado quando lista é vazia.
5. **P1 / Erro de carregamento:** falha em `getProducts()` vai ao `console.error`, e `loading` encerra sem estado de erro/retry. Semântica de catálogo vazio pode ocultar falha operacional.
6. **P1 / Persistência da variante:** criar/editar operações suportadas; exclusão não é implementada; evitar estados enganosos até revisar integridade referencial e políticas RLS.
7. **P1 / Modal longo:** campos básicos, técnicos e mídia/garantia estão reunidos em modal com abas. Revisão de conteúdo e edição contínua em desktop/mobile merecem página dedicada e preview.
8. **P2 / Busca incompleta:** filtro atual considera nome e categoria, não SKU ou outros metadados úteis à operação.
9. **P2 / Ações icon-only e confirmação nativa:** oferecer texto/aria-label, ações contextuais, confirmação clara, e feedback com sucesso/erro consistente.
10. **P2 / Dados técnicos:** muitos campos genéricos em `technical_data` com valores livres; para especificação de revestimentos, revisar unidade, obrigatoriedade, variação por produto e validação antes de publicar.

## Proposta UX (nenhuma implementação nesta branch)
- Tela principal: título e total verificado, busca por nome/SKU/categoria, filtros por linha/acabamento/destaque/estado, indicador de carregamento/erro/vazio, seleção com paginação correta.
- Tabela responsiva: miniatura, nome, categoria, acabamento, número de variantes, disponibilidade e situação editorial. Menus explícitos `Editar`, `Duplicar`, `Arquivar`, `Visualizar no site` — somente implementar ações com backend verdadeiro.
- Editor em rota própria, com progresso: Identificação > Imagens > Aplicação e ficha técnica > Cores/variantes > Publicação. Salvar rascunho, prévia do site e prevenção de perda de alterações.
- Ficha técnica: unidades, métodos de aplicação, preparo, rendimento, tempo de cura/secagem, ambientes indicados, manuais PDF; somente mostrar/validar campos aplicáveis ao produto.
- Incluir ligação opcional com catálogo digital PIACERI/FLUA e Studio quando os respectivos contratos de dados estiverem aprovados.
- Governança: diferenciar `rascunho`, `em revisão`, `publicado`, `arquivado` somente após confirmar suporte no schema; timestamps, autor e histórico; verificar ACL no servidor e RLS Supabase oficial.
- Business: priorizar cadastro confiável de catálogo técnico, comercial sem preço no institucional, ficha válida e CTA para orçamento/WhatsApp; métricas apenas com consultas reais.

## Sequência proposta
1. Corrigir no painel falhas funcionais (exclusão de variante, logout, erro+retry, paginação/filtro) em PR específica após análise de persistência/autorização.
2. Redesenhar listagem e editor com critérios de usabilidade e acessibilidade; não introduzir controles apenas ilustrativos.
3. Planejar relação com catálogo digital/Studio e workflow editorial, após confirmar schema real no projeto Supabase correto.
4. Build, testes e aprovação explícita antes de merge/deploy.

## Home (separado do painel)
Na branch `fix/home-remove-simulator-card`, removido apenas o objeto `id: "simulador"` do grid `TRANSFORME CADA ESPAÇO / Explore Ambientes Únicos`. CTA final `Experimentar Simulador` não alterado, pois fora do card solicitado.
