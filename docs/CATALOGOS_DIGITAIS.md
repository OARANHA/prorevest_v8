# Catálogos Digitais ProRevest — arquitetura e plano de implantação
Data: 2026-10-27
Status: proposta técnica inicial em branch; nenhuma funcionalidade implantada

## Fonte e obrigação visual
- PIACERI: design Canva `DAHYAXZ36LY`; apresentação de 38 páginas.
- FLUA: design Canva `DAHYAqdRfNI`; apresentação de 17 páginas.
- **Fidelidade editorial obrigatória:** manter tipografia, fotografias, cores, hierarquia, enquadramento, proporções, composição e ordem do original do Canva. Não recriar slides como cards genéricos nem usar imagens substitutas.
- Preferir ativos exportados do próprio Canva, versionados no storage, com dimensionamento responsivo preservando a relação de aspecto (1920×1080 verificado para FLUA).
- Textos técnicos devem passar por revisão humana antes da publicação; material está marcado como PRÉ-CATÁLOGO.
- Evitar servir URLs temporárias de thumbnails do Canva aos visitantes.

## Experiência pública proposta
- `/catalogos`: biblioteca dos materiais publicados.
- `/catalogos/piaceri` e `/catalogos/flua`: visualização página a página, avançar/voltar, índice, navegação por coleção, zoom e teclado, com carregamento progressivo, textos alternativos e mobile.
- Hotspots opcionais sobre cada página, relativos a coordenadas normalizadas 0..1, vinculando coleção/material/ficha sem deslocar a composição.
- Download da exportação original aprovada em PDF, separada do viewer. Geração de PDF selecionado/personalizado fica para versão posterior.
- QR Code PNG/SVG aponta para URL canônica estável no domínio da ProRevest. QR impresso não deve apontar para arquivo versionado nem para URL de edição do Canva.
- Site institucional nunca exibe preços. Relação futura com produtos/Studio é opcional; não criar registros de produtos fictícios.

## Modelo de dados proposto (NÃO EXECUTAR migração nesta fase)
- `digital_catalogs`: id uuid, slug unique, title, description, source_canva_design_id, status [draft,review,published,archived], pdf_storage_path nullable, published_at, created_at, updated_at.
- `digital_catalog_pages`: id uuid, catalog_id FK, page_number positive, image_storage_path, width, height, alt_text; UNIQUE(catalog_id,page_number).
- `digital_catalog_sections`: id uuid, catalog_id FK, title, slug, first_page, sort_order.
- `digital_catalog_hotspots`: id uuid, page_id FK, x, y, width, height (valores 0..1), action_type [page,section,material,product,studio,url], target_ref, accessible_label, sort_order; validar limites no backend.
- `digital_catalog_materials`: id uuid, catalog_id FK, section_id FK nullable, slug, title, description, technical_data jsonb, linked_product_id nullable, studio_target nullable, status.
- `digital_catalog_revisions`: registro de publicação, hash/versão do PDF e das páginas e autor, com rollback editorial.
- Armazenar mídias em bucket gerenciado do **Supabase oficial** `gtfvhktgxqtdrnaxizch`, definir nome/políticas somente após inspecionar buckets e RLS existentes. Jamais usar bucket legado fictício de telas demonstrativas.

## Segurança
- ACL server-side para escrever, publicar, fazer upload e criar versões; `isAdmin` no frontend sozinho não é controle suficiente.
- Políticas RLS: leitura pública apenas de itens `published`; drafts/reviews protegidos; uploads e mutações restritos a papéis administrativos verificados.
- Validar extensão, MIME e limites de tamanho; arquivos imutáveis versionados; nunca hospedar tokens do Canva/Supabase no cliente.
- Antes de novas migrações, revisar schema, funções e roles do projeto correto; não utilizar conector Supabase ligado a outro projeto.
- Não conectar hotspots diretamente a links externos sem validação (evitar open redirect).

## Implantação em fases e gates
1. **Contrato e auditoria (esta branch):** conferir páginas, dimensões, licenças de exportação, conteúdo, UX, segurança; registrar decisões. Sem publicar.
2. **Viewer e assets exportados:** protótipo isolado com visuais fiéis das 55 páginas, navegação, zoom, acessibilidade; testes de mobile e performance.
3. **Persistência/editor:** banco, RLS, APIs, menu `/admin/catalogos`, upload e rascunho/preview/publicação controlada.
4. **PDF e QR:** PDF original aprovado, download, QR SVG/PNG, estabilidade dos links e versões.
5. **Integrações progressivas:** vínculo opcional com produtos e Studio; PDF personalizado somente depois de definir template e critérios.
6. Revisão de diff/segredos, build cliente+SSR, testes e aprovação **explícita** antes de merge/deploy.

## Critérios de aceite
- Sobreposição visual fiel: mesma disposição/ordem/diagramação de cada slide aprovado no Canva; nenhuma imagem de referência genérica.
- Navegação teclado/toque e hotspots permanecem alinhados em diferentes larguras/telas.
- Troca de versão do catálogo não altera QR impresso ou links permanentes.
- PDF baixado corresponde à versão editorial aprovada.
- Nenhum rascunho ou mutação é acessível sem autorização; nenhum preço no institucional.
- Fallback claro se imagens/PDF não estiverem carregados.
- Studio/auth existentes não têm regressões.
- E2E, teste admin, build e smoke antes do deploy.

## Diagnóstico de painel (27/10/2026)
- `app/routes.ts` não registra área `/admin/catalogos`.
- `app/routes/admin-layout.tsx` faz gate por `useAuth().isAdmin` no layout; proteção de backend/RLS deve ser auditada independentemente.
- `app/routes/admin/cloud-storage.tsx` contém estatísticas demonstrativas e funções de salvar/testar que mostram alerta sem persistência: não reutilizar como infraestrutura de upload.
- `app/routes/admin/index.tsx` contém métricas simuladas; não utilizar como comprovação de tráfego/receita.

## Fontes
- Canva: https://www.canva.com/design/DAHYAXZ36LY/GeFR_ttxt0SbTlWVpQ7qTg
- Canva: https://www.canva.com/design/DAHYAqdRfNI/Y7c59fS7zo7tRF-yM1qr7A/edit
- Repositório: `AGENTS.md`, `docs/README.md`, `docs/PROJECT_STATE.md`, `docs/ROADMAP.md`, `docs/DECISIONS.md`, `docs/OPERATIONS.md`, `docs/KNOWN_ISSUES.md`, `docs/WORKLOG.md`.
