# Checklist de retomada

Use este arquivo no início de qualquer nova sessão, agente ou máquina.

## 1. Ler contexto

Ler nesta ordem:

1. `docs/PROJECT_STATE.md`
2. `docs/ROADMAP.md`
3. `docs/KNOWN_ISSUES.md`
4. `docs/DECISIONS.md`
5. `docs/OPERATIONS.md`
6. últimas entradas de `docs/WORKLOG.md`

## 2. Conferir Git

```bash
git status
git branch --show-current
git log --oneline -5
git fetch origin
```

Não descartar mudanças não reconhecidas.

## 3. Antes de alterar

- Identificar issue/prioridade relacionada.
- Reproduzir o problema quando possível.
- Localizar arquivos/rotas envolvidos.
- Registrar proposta e impacto.
- Confirmar que nenhuma credencial será adicionada ao Git.

## 4. Durante o trabalho

- Trabalhar em branch específica.
- Fazer mudanças pequenas e revisáveis.
- Não alterar produção para “testar”.
- Rodar build/testes relevantes.
- Guardar evidência suficiente para reproduzir o resultado.

## 5. Antes de merge/deploy

- Revisar diff.
- Verificar segredos.
- Rodar build.
- Testar fluxo afetado.
- Atualizar documentação viva.
- Obter aprovação quando a mudança afetar comportamento/produção.

## 6. Depois do trabalho

Atualizar:
- `PROJECT_STATE.md`, se o estado mudou;
- `KNOWN_ISSUES.md`, se bug foi descoberto/corrigido;
- `DECISIONS.md`, se houve decisão duradoura;
- `OPERATIONS.md`, se mudou operação/deploy;
- `WORKLOG.md`, sempre que houver entrega relevante.

## Regra de ouro

Uma nova sessão deve conseguir responder “onde estamos, o que está quebrado, o que vem agora e como operar com segurança” usando somente o repositório.
