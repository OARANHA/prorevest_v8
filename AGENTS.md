# AGENTS.md

## ProRevest — regras para qualquer agente ou nova sessão

Este repositório deve ser suficiente para continuar o trabalho sem depender de histórico de chat.

### Antes de qualquer alteração

Leia `docs/SESSION_START.md` e siga a ordem de leitura indicada em `docs/README.md`.

### Fonte de verdade

Use `docs/` como contexto atual. Não confie em relatórios históricos ou comentários antigos quando eles conflitarem com a documentação viva.

### Prioridades atuais

1. Studio ProRevest.
2. Login, sessão e recuperação de senha.
3. Jornada de arquitetos.
4. Catálogo sem preço + produto → Studio.
5. Dados institucionais/SEO.
6. Performance e limpeza técnica.

### Regras de segurança

- Nunca adicionar segredos, tokens, senhas, service-role keys ou chaves privadas ao Git.
- Não executar scripts históricos de banco sem auditoria.
- Não editar produção diretamente para experimentar.
- Não alterar o Node global da VPS sem plano de migração.
- Não usar `pm2 restart all` como rotina.
- Não apagar mudanças não reconhecidas.

### Processo obrigatório

diagnóstico → proposta → branch → implementação → diff/revisão → build/testes → aprovação → deploy → smoke test → documentação.

### Ao terminar trabalho relevante

Atualize os documentos vivos aplicáveis, especialmente `PROJECT_STATE.md`, `KNOWN_ISSUES.md` e `WORKLOG.md`.
