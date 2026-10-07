# Estado atual do projeto

Última atualização: 2026-10-07

## Objetivo principal

O site institucional `https://prorevesttintas.com.br/` é o foco atual. A prioridade de produto é transformar o **Studio ProRevest** em uma ferramenta confiável para clientes, arquitetos e especificadores visualizarem tintas, cores e efeitos em imagens de ambientes enviadas por eles.

A loja `https://loja.prorevesttintas.com.br/` é um canal separado e futuro para compra. O site institucional não deve depender de preços para cumprir sua função.

## Jornada principal desejada

Home → Studio → upload do ambiente → aplicar tinta/cor/efeito → visualizar/comparar → salvar projeto → produto/contato/WhatsApp.

Jornada secundária:

Catálogo → produto/efeito → “Visualizar no meu ambiente” → Studio.

## Público prioritário

- Arquitetos e especificadores.
- Consumidores avaliando acabamento/efeito antes da aplicação.
- Profissionais buscando catálogo e informações técnicas.

Arquitetos já estão acessando o site, portanto estabilidade do Studio e recuperação de acesso têm prioridade sobre refinamentos cosméticos.

## Dados oficiais confirmados

- Instagram: https://www.instagram.com/prorevestoficial/
- Telefone/WhatsApp: (51) 98660-5758
- Loja: https://loja.prorevesttintas.com.br/
- Site institucional: https://prorevesttintas.com.br/

E-mail institucional oficial: **a confirmar**.

## Estado técnico conhecido

- React 18 + React Router 7 + TypeScript + Vite.
- Supabase para autenticação/dados/storage.
- Projeto Supabase oficial da ProRevest: `gtfvhktgxqtdrnaxizch`.
- Auth URL Configuration confirmada em 2026-10-07: Site URL `https://prorevesttintas.com.br`; redirects permitidos `/auth/callback` e `/reset-password` no domínio oficial.
- PR #1 de Studio/Auth implantada em produção em 2026-10-07 no commit `301b53edf6aeeac173bf59d9e68526ce18ff9e66`; smoke HTTP pós-deploy aprovado. Recovery/login E2E ainda em validação.
- Produção atual roda com Node 20.19.5 e PM2.
- Processo PM2 observado: `prorevest-app`.
- Build atual: `npm run build`.
- O código organizado está versionado em `OARANHA/prorevest_v8`.
- Baseline de produção sanitizado criado em 2026-10-07.
- Segredos encontrados em scripts antigos foram removidos do baseline versionável.
- Node 22 do Agent Mesh está isolado em `/opt/wandora/node22`; não substituir o Node global da aplicação sem plano de migração.

## Prioridade imediata

1. Diagnosticar e estabilizar o Studio.
2. Corrigir login, sessão, “esqueci minha senha” e redefinição.
3. Melhorar a jornada do arquiteto e os CTAs para o Studio.
4. Ajustar catálogo para funcionar sem preço e conectar produtos ao Studio.
5. Corrigir dados institucionais, SEO e inconsistências.
6. Tratar performance/arquitetura conforme impacto real na experiência.

## Regra de mudança

Nenhuma mudança deve ir direto para produção.

Fluxo obrigatório:

diagnóstico → proposta → alteração em Git → diff/revisão → build/teste → commit → aprovação → deploy → smoke test → atualização da documentação.
