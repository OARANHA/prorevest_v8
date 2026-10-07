# Registro de decisões

Este arquivo registra decisões duradouras do projeto. Novas decisões devem ser adicionadas ao final; não apagar decisões antigas, apenas marcar como superseded quando necessário.

## DEC-001 — Studio é o recurso prioritário
Data: 2026-10-07
Status: accepted

O Studio ProRevest é o principal diferencial funcional do site institucional. Estabilidade e usabilidade do fluxo de upload/aplicação de tintas e efeitos têm prioridade sobre melhorias cosméticas, SEO ou expansão do painel administrativo.

## DEC-002 — Site institucional não exibe preço
Data: 2026-10-07
Status: accepted

`prorevesttintas.com.br` deve apresentar produtos e gerar interesse/especificação. Preços e compra pertencem ao canal `loja.prorevesttintas.com.br`.

## DEC-003 — Arquitetos são público prioritário
Data: 2026-10-07
Status: accepted

A jornada deve favorecer visualização no Studio, ficha técnica, especificação, aplicações, acabamentos e contato.

## DEC-004 — Dados de contato oficiais
Data: 2026-10-07
Status: accepted

- Instagram: @prorevestoficial
- Telefone/WhatsApp: (51) 98660-5758
- E-mail: pendente de confirmação

## DEC-005 — Git é a fonte de verdade do código
Data: 2026-10-07
Status: accepted

Mudanças são feitas no repositório `OARANHA/prorevest_v8`, revisadas e testadas antes de qualquer deploy. Não editar produção como fluxo normal.

## DEC-006 — Trabalho não depende de histórico de chat
Data: 2026-10-07
Status: accepted

Toda informação necessária para retomar trabalho deve existir no repositório, principalmente em `docs/`. Chats podem ajudar na execução, mas não são fonte de verdade.

## DEC-007 — Revisão antes de deploy
Data: 2026-10-07
Status: accepted

Fluxo: diagnóstico → proposta → implementação → diff/revisão → build/testes → aprovação → deploy → smoke test → documentação.

## DEC-008 — Runtime da produção permanece em Node 20 por enquanto
Data: 2026-10-07
Status: accepted

A aplicação/PM2 roda atualmente em Node 20.19.5. O Node 22 utilizado pelo Wandora Agent Mesh está isolado em `/opt/wandora/node22`. Não alterar o Node global sem plano e teste de migração.
