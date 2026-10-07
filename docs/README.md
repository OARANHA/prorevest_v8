# Documentação viva — ProRevest

Esta pasta é a fonte de verdade operacional do projeto `prorevest_v8`.

## Ordem de leitura para qualquer nova sessão

1. `PROJECT_STATE.md` — onde o projeto está agora.
2. `ROADMAP.md` — o que vem primeiro e por quê.
3. `KNOWN_ISSUES.md` — bugs e riscos conhecidos.
4. `DECISIONS.md` — decisões de produto/arquitetura que não devem ser rediscutidas sem motivo.
5. `OPERATIONS.md` — build, deploy, ambientes e regras de segurança.
6. `WORKLOG.md` — o que foi feito recentemente.
7. `SESSION_START.md` — checklist para retomar trabalho sem depender de chat anterior.

## Regra de manutenção

A documentação deve ser atualizada no mesmo ciclo da mudança que altera o estado do projeto.

- Mudou prioridade ou estado funcional → atualizar `PROJECT_STATE.md` e/ou `ROADMAP.md`.
- Descobriu/corrigiu bug → atualizar `KNOWN_ISSUES.md`.
- Tomou decisão duradoura → registrar em `DECISIONS.md`.
- Mudou build/deploy/infra → atualizar `OPERATIONS.md`.
- Concluiu trabalho relevante → registrar em `WORKLOG.md`.

Não guardar segredos, tokens, senhas, chaves privadas ou credenciais reais nestes arquivos.
