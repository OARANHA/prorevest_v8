# Auditoria e melhorias — Blog e Produtos (2026-11-16)

**Repositório:** `OARANHA/prorevest_v8`. **Branch:** `feat/blog-products-experience-20261116`.

**Escopo:** blog público (`/blog`, `/blog/:slug`) e catálogo institucional (`/catalogo`, `/produto/:slug`). A biblioteca de catálogos digitais `/catalogos` (PIACERI/FLUA), Studio e telas do Admin foram preservadas. Nenhuma migração ou alteração de dados foi executada no Supabase.

## Diagnóstico no código anterior

| Área | Constatação verificada no código | Efeito |
|---|---|---|
| Blog: categorias/tags | `BlogService.getBlogCategories()` e `getBlogTags()` retornavam `string[]`, mas o loader fazia `.map(cat => cat.name)` | Opções inválidas; filtros não utilizáveis |
| Blog: busca | A interface alterava `searchTerm` em estado local, sem atualizar a URL ou consultar o loader | Digitação sem efeito nos artigos apresentados |
| Blog: paginação | Links `?page=N` descartavam categoria, tag e busca; a navegação podia ir para `page=0` | Resultados inconsistentes |
| Blog: fonte dos dados | Falha no Supabase substituída por post/autor/imagem fictícios e categorias fictícias; métrica escondida `200 Leitores Ativos` | Conteúdo falso em caso de indisponibilidade |
| Artigo: autorização | `getBlogPostBySlug` não filtrava `status=published` | Slug conhecido podia retornar rascunho ou arquivo, dependendo da política RLS |
| Artigo: GET | Loader incrementava visualizações por UPDATE; HTML gerado com `marked` era enviado sem sanitização no SSR | Efeito de escrita em leitura pública e risco de HTML não confiável em SSR |
| Catálogo: dados | `paintTypes` estáticos continham valores de preço, rendimentos e secagem não provenientes do catálogo oficial | Fichas demonstrativas apresentadas como produtos reais |
| Catálogo: filtros | Slider de preço e filtro de categoria sem efeito; busca aplicada somente sobre a página já paginada | UX incorreta, especialmente com mais de 12 produtos |
| Produto: detalhe | Rota tinha produto fallback fictício, avaliações, perguntas, compra conjunta, cálculo de frete e preços demonstrativos | Mistura de comércio eletrônico com catálogo institucional, sem fonte confiável |
| Home: vitrine | Duas seções de produtos, `FeaturedProducts` com preço, avaliações/estrelas, alegação de 7 anos e quantidade “200+” não verificada; `home_prorevest` criava produtos fictícios no fallback | Informações não comprovadas e duplicação de navegação |
| Produto: visibilidade | Consulta pública por slug e sugestões não exigiam `is_archived=false` | Possibilidade de apresentar produto arquivado, conforme RLS |

## Implementação na branch

- Blog: fonte única de posts **publicados**; categorias e tags extraídas desses registros; busca/categoria/tag via formulário GET; paginação consistente que preserva filtros; limites de página; estados distintos de erro, lista vazia e resultado filtrado.
- Artigo: meta title/description/canonical/OG; 404 para slug não publicado; remoção do UPDATE de visualizações em GET; renderização Markdown consistente entre servidor e navegador com HTML bruto escapado e links/imagens restritos a esquemas seguros; artigos relacionados reais e CTAs úteis.
- Catálogo: remoção total de preço/frete e cards fictícios. Produtos, categorias, acabamentos e totais consultados no Supabase. Filtros de nome, categoria e acabamento aplicados na consulta **antes** da paginação, ordenação por nome/destaque, URLs compartilháveis e estados de erro/vazio.
- Produto: detalhe gerado exclusivamente do produto não arquivado, com imagens e cores cadastradas, acabamento, descrição e campos técnicos disponíveis. Sem alegações automáticas de rendimento/certificação, preços, avaliações simuladas nem cálculo de entrega. Contato pelo WhatsApp oficial e link ao Studio; **o produto não é selecionado automaticamente no Studio**.
- Home: apenas uma vitrine `FeaturedProducts` com `id=produtos`, baseada em produtos efetivamente marcados `is_featured=true` e não arquivados; sem número arbitrário, preço, avaliação, durabilidade ou fallback de produtos fictícios. Mantida a âncora do menu e CTA ao catálogo/Studio.
- Estados de erro e URLs canônicas melhorados; nenhuma credencial, DDL, assinatura de newsletter ou operação administrativa adicionada.

## Critérios de revisão e evidências

- `node scripts/test-blog-products-static.mjs`: 36 verificações estáticas de regressão em fontes públicas (filtros, ausência de mocks e preços, status dos conteúdos, segurança do Markdown, proteção de arquivados).
- Teste dinâmico do renderizador com payloads de HTML bruto, `onerror`, `javascript:` e `data:` no checkout isolado: **PASS**; links HTTPS continuam funcionando.
- Build de validação cliente + SSR **sem minificação** com variáveis **sintéticas**: **PASS**. Esses artefatos NÃO são utilizáveis em produção. Build minificado com variáveis públicas oficiais deve ocorrer no procedimento root de release após aprovação.
- `tsc --noEmit` global ainda contém diagnósticos anteriores e independentes em outros módulos (ex.: `produto.$id.tsx`, calculadora de rendimento, aplicação técnica e service Blog legado). Nenhum erro foi reportado nas novas rotas `blog.tsx`, `blog.$slug.tsx`, `catalogo.tsx`, `produto.$slug.tsx` e `safeBlogMarkdown.ts`; vitrine Home requer nova rodada de build após a alteração. A limpeza geral do projeto não está no escopo desta PR.
- E2E com dados oficiais, teste visual/responsivo e validação editorial de imagens/textos cadastrados permanecem **pendentes**, e não devem ser confundidos com smoke HTTP.

## Revisão editorial ainda necessária

Os artigos existentes, suas imagens e os campos técnicos de produtos são administrados em fontes de dados separadas. Esta PR não reescreve conteúdo editorial nem inventa produtos, rendimento ou fichas técnicas.

Conferir no Admin: títulos de publicação, trechos com prefixos como “Título 1”, categorias genéricas, duplicatas, créditos das imagens, descrições extensas, conteúdo HTML legado do editor (agora exibido como texto literal por segurança), slugs e fichas técnicas antes de anunciar correção do conteúdo.

## Publicação segura

1. Revisar a PR/diff e confirmar as decisões editoriais e as jornadas Blog → Produto → Studio.
2. Executar `node scripts/test-blog-products-static.mjs`, build minificado oficial e staging smoke para `/blog`, artigo real publicado, `/catalogo`, produto real cadastrado, `/catalogos` e `/studio`.
3. Validar filtros com múltiplas páginas, responsividade, imagens e links no navegador.
4. Obter aprovação expressa do responsável, integrar branch à `main` e publicar com backup/rollback e restart exclusivo de `prorevest-app`.
5. Repetir smoke público e registrar SHA, backup e E2E. Não modificar SQL/produção para testar filtros.
