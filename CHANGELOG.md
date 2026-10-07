# Changelog - 13/09/2025

## 🚀 Melhorias de Design

### Site Público

-   **Nova Paleta de Cores:** A paleta de cores foi completamente refeita para ser mais vibrante, harmoniosa e profissional, com foco em tons quentes e vibrantes para criar uma atmosfera mais acolhedora e energética.
-   **Novo Layout:** O layout principal foi refinado com uma nova paleta de cores, melhores espaçamentos e sombras sutis para criar uma experiência de usuário mais premium e agradável.
-   **Nova Página Inicial:** A página inicial foi completamente redesenhada com um novo layout, novas seções (incluindo depoimentos e showcase de projetos) e um Call to Action (CTA) mais impactante, refletindo a nova identidade visual.
-   **Imagens:** Novas imagens foram baixadas e adicionadas à página inicial para criar uma experiência mais imersiva e profissional.

### Painel Administrativo

-   **Design Dark Minimalista:** O dashboard agora tem um tema escuro com detalhes em laranja, criando uma aparência moderna e profissional.
-   **Barra Lateral Retrátil:** A barra lateral agora pode ser recolhida, otimizando o espaço de tela para focar no conteúdo principal.
-   **Navegação Organizada:** Os links de navegação foram agrupados em seções lógicas, com ícones, para uma experiência de usuário mais intuitiva.

## 🐞 Correções de Erros

-   **Dependências Ausentes:** Foram instalados os pacotes `react-router-dom`, `@heroicons/react`, `jspdf`, `jspdf-autotable`, `@remix-run/node` e `@react-router/fs-routes`.
-   **Configuração do React Router:** A causa raiz de múltiplos erros de runtime e compilação foi identificada e corrigida. A aplicação agora utiliza a abordagem correta do React Router v7, com um arquivo de rotas (`app/routes.ts`) que usa a propriedade `file` e um `app/root.tsx` que renderiza o `<Outlet />`, permitindo que o servidor de desenvolvimento gerencie o roteador.
-   **Configuração do Supabase:** O erro de inicialização `Invalid supabaseUrl` foi resolvido.
-   **Qualidade de Código:** Múltiplos erros de tipo em toda a base de código foram corrigidos, garantindo a integridade e a robustez da aplicação.

## 🔑 Segurança

- Credenciais de teste que apareciam em versões históricas desta documentação foram removidas do estado atual do repositório.
- Qualquer credencial já publicada deve ser considerada comprometida e rotacionada se ainda puder ser válida.


## 📄 Detalhes das Correções

-   **`app/routes.ts`:**
    -   Removidas as importações de componentes para usar o file-based routing.
    -   Adicionada a propriedade `file` a todas as rotas.
    -   Corrigido o conflito de `id` da rota raiz.
    -   Adicionada a rota para o script de inicialização do superadmin.
-   **`app/root.tsx`:**
    -   Removida a criação manual do roteador com `createBrowserRouter`.
    -   Restaurado o `App` para renderizar apenas o `<Outlet />`.
    -   Corrigida a tipagem do `ErrorBoundary`.
-   **`app/components/Layout.tsx`:**
    -   Corrigida a importação do ícone `MailIcon` para `EnvelopeIcon`.
    -   Movido o `<ScrollRestoration />` para dentro do layout.
-   **`app/services/quoteService.ts`:**
    -   Enriquecido o tipo `Quote` com os campos que faltavam.
-   **`app/services/pdfService.ts`:**
    -   Corrigidas as chamadas `setFont` e as propriedades do objeto `quote`.
-   **`app/services/reportService.ts`:**
    -   Adicionada a verificação de `filters.colorId`.
-   **`app/routes/admin-layout.tsx`:**
    -   Removida a lógica de verificação de admin.
-   **`package.json`:**
    -   Desativada a `typegen` do React Router.
-   **`app/services/databaseService.ts`:**
    -   Adicionado o método `initSuperAdmin` para criar um usuário superadmin com Supabase Auth.
