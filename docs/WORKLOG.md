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

- E2E real confirmado pelo usuário após o deploy da PR #2: Paleta ProRevest rolou e carregou novas cores normalmente no Studio, sem spinner infinito. PRV-024 encerrado como RESOLVED.

## 2026-10-27 — Fundação documental dos catálogos PIACERI e FLUA (sem deploy)

- Revisados AGENTS.md e documentação viva; main verificado em `c327e745` antes da branch.
- Canva confirmou PIACERI (38 páginas, DAHYAXZ36LY) e FLUA (17 páginas, DAHYAqdRfNI).
- Diretriz do responsável: fidelidade estrita ao layout Canva; viewer interativo, PDF e QR Code; vínculos opcionais futuros a produtos e Studio.
- Criada branch `feat/catalogos-digitais-foundation`; especificação em `docs/CATALOGOS_DIGITAIS.md`.
- Nenhuma migração, asset, alteração de rota ou deploy feitos. Implementação funcional e testes seguem pendentes.

## 2026-10-27 — Viewer inicial para PIACERI e FLUA (sem assets/deploy)

- Criados `app/lib/digitalCatalogs.ts`, `app/routes/catalogos.tsx` e `app/routes/catalogo-digital.tsx` com rotas `/catalogos` e `/catalogos/:slug`, paginação, navegação por teclado, zoom e verificação de PDF oficial.
- Páginas funcionam somente após imagens originais Canva aprovadas serem exportadas e publicadas como `/catalogs/{slug}/pages/0001.webp` etc. PDFs como `/catalogs/{slug}/catalog.pdf`. Não foram fornecidas miniaturas temporárias nem imagens inventadas.
- Índices de coleção permanecem vazios até conferência exata das páginas originais.
- **Pendente:** exportação/autorização dos 55 slides originais, assets finais, hotspots, QR, admin, armazenamento e validações automáticas. Build/SSR/E2E não executados neste ciclo; não afirmar sucesso funcional. Branch não enviada para produção.

## 2026-10-27 — Exportações oficiais PIACERI/FLUA preparadas para GitHub Desktop

- Recebidos ZIPs PNG e PDFs exportados do Canva: PIACERI 38 páginas e FLUA 17 páginas; imagens 1920×1080.
- Gerados assets web em `/public/catalogs/{slug}/pages/{NNNN}.webp` e PDF otimizado em `/public/catalogs/{slug}/catalog.pdf`, preservando composição original e ordenação.
- Gerado pacote ZIP independente com 55 WebPs e 2 PDFs + manifesto e instruções, para extração MANUAL via GitHub Desktop na branch `feat/catalogos-digitais-foundation`. O pacote não foi adicionado ao repositório remoto nesta sessão.
- Mapeadas seções confirmadas pelos PDFs: PIACERI Laghi p3, Puglia p8, Luce p11, Vulcani p17, Rovine p23, Vino p29, Firmata p33; FLUA p3 e Paraíso p13.
- **Não houve build do projeto nem E2E em navegador**, PR, merge ou deploy. Antes de publicar: usuário precisa inserir assets via GitHub Desktop, com commit/push; depois executar build/testes, revisão e obter aprovação para merge/deploy.

## 2026-10-27 — Refinamento visual do visualizador (branch; não implantado)

- Implementado menu flutuante premium, índice de coleções em painel, zoom, tela cheia, compartilhamento com fallback de cópia e QR Code PNG client-side nos catálogos PIACERI/FLUA; mantém imagens originais do Canva inalteradas.
- QR aponta para URL canônica permanente `https://prorevesttintas.com.br/catalogos/{slug}`; roteamento já existente em branch, NÃO publicado em produção.
- Adicionada dependência `qrcode` e tipos em `package.json`. **PENDÊNCIA BLOQUEANTE:** sincronizar `package-lock.json` com `npm install --package-lock-only`, revisar diff, commitar na branch, e só então executar `npm ci && npm run build`. Não fazer merge/deploy antes do teste.
- A fonte de título usa `font-serif` (aproximação); fonte exata do Canva ainda não foi identificada/licenciada para web; não afirmar correspondência tipográfica perfeita.
- Não houve build/teste E2E neste ciclo por acesso remoto limitado; esta mudança é implementação NÃO VALIDADA em runtime.

## 2026-10-27 — Refinamento de UX catálogos (sem deploy)

- Redesenhada a rota `/catalogos` com capas originais dos dois catálogos, tipografia editorial, paleta neutra e links de PDF.
- No visualizador, barra flutuante de ações e coleções reposicionada à esquerda no desktop; controles incluídos dentro do elemento de fullscreen (anterior/próxima, índice e QR), preservando acesso durante tela cheia.
- Sobreposição mobile do menu com barra de paginação foi ajustada. Código gravado na branch `feat/catalogos-digitais-foundation`.
- Build/E2E responsivo ainda pendentes; não houve merge/deploy. Revisar especialmente browser Fullscreen API, disposição mobile e lockfile do pacote QR.

## 2026-10-27 — Ajuste de identidade visual dos catálogos

- A pedido do usuário, mantida a navegação funcional dos visualizadores PIACERI/FLUA.
- `/catalogos`: substituída paleta editorial marrom/bege por base branca/cinza muito claro, acentos laranja/índigo, botões e tipografia similares à Home ProRevest; mantidas capas originais.
- `/catalogos/{slug}`: chrome do visualizador alinhado à mesma paleta institucional, cabeçalho neutro, moldura branca e controles claros; slides WebP originais e ações de navegação/QR/download mantidos. Modo fullscreen permanece com fundo escuro para leitura imersiva.
- Nenhuma alteração Supabase, conteúdo dos PDFs, dados ou deploy. Build/E2E e revisão visual em navegador ainda pendentes; verificar dependência QR/lockfile.

## 2026-10-27 — Harmonização visual catálogos com Home

- A biblioteca `/catalogos` e as molduras dos viewers PIACERI/FLUA receberam paleta clara (white/indigo/purple), tipografia leve, cards com bordas e sombras suaves conforme componentes já existentes na Home.
- Não alteradas imagens Canva, páginas, URLs PDF/QR, navegação, estado fullscreen ou lógica de compartilhamento.
- Alterações registradas na branch `feat/catalogos-digitais-foundation`. Build/E2E e aprovação visual pendentes. Nenhum merge/deploy.

## 2026-10-27 — Vitrine de catálogos na Home (branch sem deploy)

- Criada branch `feat/home-digital-catalog-launch` derivada de `feat/catalogos-digitais-foundation` para reaproveitar as rotas/assets originais.
- Adicionado componente `HomeDigitalCatalogs` após a Hero da Home, com capas originais PIACERI e FLUA, links às rotas digitais e download dos PDFs, alinhado à linguagem visual clara/gradientes da Home.
- **Arte promocional para a Hero criada apenas para avaliação do responsável; NÃO adicionada ao código, assets ou produção.** A arte é conceito visual, não fiel às capas oficiais, e depende de aprovação/ajuste para uso institucional.
- Sem merge/deploy. Build e testes responsivos pendentes; validar também a estratégia de release das rotas/base da branch antes de integrar.

## 2026-10-27 — Faixa compacta após Hero, sem publicar arte

- Ajustado HomeDigitalCatalogs para layout horizontal compacto, imediatamente após HeroSection, com texto e CTAs HTML e prévias reais dos slides PIACERI p5 e FLUA p9; ações para `/catalogos` e as páginas individuais.
- A imagem mockup da faixa é referência estética, NÃO usada no produto. A arte promocional da Hero com logotipo reduzido e símbolo central removido continua em revisão e NÃO foi colocada no repositório.
- Pendente conferir proporções responsivas, build e revisão da arte antes de qualquer deploy.

## 2026-10-27 — Hero de lançamento decomposta (branch, sem deploy)

- Criado `app/components/CatalogLaunchHero.tsx` com fundo em CSS, marca como asset independente, chamadas em HTML, CTA funcional para `/catalogos`, ícones e imagem promocional separada.
- Home passou a renderizar `CatalogLaunchHero` antes da faixa `HomeDigitalCatalogs`, mantendo `HeroSection` original acessível via switch local para rollback; não mesclar/publicar sem reavaliar destaque do Studio.
- Arquivos binários necessários (`public/images/catalog-launch/catalogs-scene.webp` e `prorevest-logo.png`) empacotados externamente para GitHub Desktop. Estes assets **NÃO estão commitados na branch**; devem ser copiados pelo responsável antes de build/E2E/PR. Marca composta a partir das imagens enviadas; cenário recortado de mockup gerado e deve ser tratado como arte promocional ilustrativa, não fotografia dos catálogos reais.
- Nenhum merge/deploy. Validar responsividade e acessibilidade, build, alteração da Home e imagens antes de aprovação final.

## 2026-10-27 — Hero em carrossel com Studio preservado (sem deploy)

- Criado `app/components/HomeHeroCarousel.tsx`: dois slides, Studio original primeiro e campanha dos catálogos segundo, alternância automática a cada 8 segundos, anterior/próximo, indicadores, pausa/retomada e suspensão quando foco/hover/aba oculta ou preferência de movimento reduzido.
- Atualizado `app/routes/home_prorevest.tsx` para renderizar o carrossel em vez do switch que escondia a Hero original. Mantidos links e CTAs dos dois slides.
- `HomeDigitalCatalogs` continua versionado, porém foi retirado da renderização da Home nesta etapa, seguindo pedido de concluir Hero antes da faixa.
- O slide promocional requer assets enviados pelo usuário em `/public/images/catalog-launch/catalogs-scene.webp` e `prorevest-logo.png`. É necessário confirmar se ambos já estão commitados na branch.
- Revisão de diff realizada; build e teste visual/responsivo, teclado e navegação do carrossel ainda pendentes. Nenhum merge/deploy.

## 2026-10-27 — Correção de faixas escuras no carrossel da Hero

- Relato no navegador local: grande faixa escura abaixo do slide Studio e acima do slide PIACERI/FLUA.
- Causa no CSS do carrossel: contêiner e wrappers forçavam `min-h-screen` com slides de alturas diferentes; elementos ocultos absolutos e fundo escuro criavam espaço excedente.
- Corrigido em `app/components/HomeHeroCarousel.tsx`: somente o slide ativo ocupa o fluxo (`relative`/`hidden`), e a altura externa acompanha a altura efetiva do slide. Preservada imagem original do Studio, slide promocional, botões, indicadores e alternância.
- Build e E2E visual desktop/mobile ainda pendentes; sem merge/deploy.

## 2026-10-27 — Hotfix de proporção do carrossel da Home

- Evidência enviada pelo usuário: captura completa da Home mostrou o Studio ocupando apenas parte do início do carrossel com faixa preta grande e a campanha também com proporções incorretas.
- Alterado o container `HomeHeroCarousel` para uma altura delimitada pela viewport, com cada slide ativo absolutamente posicionado para preencher a área, e ocultação real do slide inativo.
- `HeroSection` (Studio) passou a ter `h-full` sem seu `min-h-screen`/padding superior próprios. `CatalogLaunchHero` recebeu `h-full` com grade responsiva confinada à mesma altura, e cenário em `object-cover` dentro da área visual.
- Sem alteração das artes e sem renderizar a faixa abaixo da Hero. Build e inspeção local desktop/mobile pendentes; especialmente verificar corte do CTA em telas pequenas e viewport com header; nenhum merge/deploy.

## 2026-10-27 — Hero campanha full-bleed e slide inicial

- Após screenshot do usuário mostrando cenário confinado à metade direita e logomarca desproporcional, `CatalogLaunchHero.tsx` atualizado para cenário promocional ocupar 100% da área da Hero com `object-cover` e gradiente na esquerda para leitura; removido `<img>` de logotipo sobreposto. Não altera o arquivo WebP em si.
- `HomeHeroCarousel.tsx`: slide 1 agora lançamento PIACERI/FLUA e slide 2 Studio original. Indicadores e setas seguem a ordem nova, sem remover o Studio.
- O `object-cover` pode recortar laterais em diferentes proporções; revisar se os livros continuam inteiros no desktop/mobile e ajustar `object-position`/art direction após screenshot. Build/testes locais ainda não executados; sem merge/deploy.

## 2026-10-27 — Faixa PIACERI/FLUA ativada abaixo da Hero (sem deploy)

- Confirmados na branch os assets `public/images/catalog-launch/piaceri-faixa.webp` e `flua-faixa.webp` enviados pelo usuário.
- `HomeDigitalCatalogs.tsx` passou a usar esses dois assets promocionais, com títulos, descrição e CTAs separados em HTML, sem embutir botões na imagem.
- `home_prorevest.tsx` agora renderiza a faixa imediatamente abaixo de `HomeHeroCarousel`, sem incorporar a faixa ao slider ou mudar a Hero aprovada.
- Revisar visual desktop e mobile, qualidade do recorte PIACERI e legibilidade, seguido de `npm ci`, `npm run build` e aprovação; merge/deploy NÃO executados.

## 2026-10-27 — Header harmonizado para entrega dos catálogos (sem deploy)

- `app/components/Header.tsx` refatorado como cabeçalho responsivo único consumido pelo `Layout`: navegação centralizada com logotipo compacto fixo entre os grupos de links, versão mobile com menu acessível, links e estados de login mantidos.
- Retirada a dependência da imagem do logo no `localStorage` ou busca dinâmica no Supabase para o cabeçalho público, de modo a evitar divergências por navegador. Passa a usar o asset versionado `public/images/catalog-launch/prorevest-logo.png`, confirmado previamente na branch. O fluxo administrativo legado de upload da marca não foi removido, mas não controla mais o Header; reavaliar esse contrato em PR específica se necessário.
- Nenhum ajuste à Hero ou faixa. Atenção: renderização desktop/mobile e signOut precisam de smoke; `npm ci`/`npm run build` ainda pendentes. Não houve merge/deploy.

## 2026-10-27 — Redesign da seção Sobre a ProRevest (branch, sem deploy)

- Em `app/routes/home_prorevest.tsx`, substituída apenas a seção `AboutSection` por composição editorial com texto institucional, 4 pilares (Inovação, Qualidade, Sustentabilidade, Suporte), CTAs para `/sobre` e `/catalogo` e uma faixa de resultados em degradê.
- Métricas **preservadas integralmente** após confirmação explícita do responsável: `20+` anos, `50k+` projetos, `200+` cores, `98%` satisfação; sem conversão de unidades nem exclusão dos indicadores.
- Sem alteração na Hero, carrossel ou faixa dos catálogos. Build, testes responsivos e aceite visual pendentes, sem merge/deploy. Reversível por diff do commit da seção.

## 2026-10-27 — Sobre: peças gráficas jovens para arquitetos e engenheiros

- Reestruturados apenas os quatro diferenciais da seção About em `home_prorevest.tsx`: removidos ícones corporativos genéricos; aplicados tiles pastel contrastantes, numeração editorial 01–04, formas abstratas geométricas e animação discreta em hover.
- Mantidos textos dos diferenciais, descrição institucional, CTAs e números 20+/50k+/200+/98% que o usuário confirmou como corretos.
- Diferença de UI proposta para público de arquitetos e engenheiros, sem mudança dos demais componentes. Build e checagem visual desktop/mobile pendentes; sem merge/deploy.

## 2026-10-27 — Redesign da rota institucional /sobre

- Refeita `app/routes/sobre.tsx` na branch `feat/home-digital-catalog-launch`, seguindo tiles cromáticos numerados e estética editorial da Home. Hero institucional, métricas, história real da origem de Mateus Dias, diferenciais, linha do tempo, fundador, sustentabilidade, Studio e CTAs.
- Preservados marcos cronológicos e principais informações da história preexistente, com copy resumida para leitura; valores passam a ser 20+/50k+/200+ cores/98% conforme números confirmados pelo responsável na Home (substituem métricas divergentes antes exibidas nesta rota).
- Removido `<Layout showHeaderFooter={false}>` interno: `app/root.tsx` já aplica Layout global, evitando layout duplicado. Imagem `/images/factory.png` é existente referenciada pela implementação anterior e merece conferência visual.
- Build, revisão de diff e testes mobile/desktop pendentes. Sem merge/deploy.

## 2026-10-27 — Hotfix auth/build/Studio (em revisão)

- Investigado crash de login/produtos após PR #3: frontend criado sem variáveis VITE Supabase na etapa de build. Operador realizou rollback e relatou recuperação do catálogo/login; Studio seguia sem gate de visitante.
- Branch `fix/supabase-build-studio-auth-20261027`: gate no `/studio`, script preflight para build não prosseguir sem variáveis públicas. Teste de falha sem variáveis passou, e build diagnóstico sem minificação com **placeholders não produtivos** concluiu com exit 0. Nenhum deploy do hotfix.
