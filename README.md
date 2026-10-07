# ProRevest V8

Código do site institucional da ProRevest: `https://prorevesttintas.com.br/`.

O foco atual do projeto é a confiabilidade do **Studio ProRevest** e da autenticação/recuperação de acesso, com atenção especial à jornada de arquitetos e especificadores.

## Comece por aqui

A fonte de verdade operacional está em `docs/`.

Para retomar o projeto em uma nova sessão, leia:

1. [Estado atual](docs/PROJECT_STATE.md)
2. [Roadmap](docs/ROADMAP.md)
3. [Problemas conhecidos](docs/KNOWN_ISSUES.md)
4. [Decisões](docs/DECISIONS.md)
5. [Operação e deploy](docs/OPERATIONS.md)
6. [Worklog](docs/WORKLOG.md)
7. [Checklist de retomada](docs/SESSION_START.md)

Veja também `AGENTS.md` para as regras de continuidade e segurança.

## Stack

- React 18
- React Router 7
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- PM2 em produção

## Desenvolvimento

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build
```

## Regras essenciais

- Não editar produção como fluxo normal.
- Não commitar segredos ou credenciais.
- Não considerar documentação antiga como verdade se conflitar com `docs/`.
- Toda mudança funcional deve passar por revisão, build/teste e aprovação antes de deploy.
- Atualizar a documentação viva no mesmo ciclo da mudança.

## Produto

O site institucional não é uma loja. Produtos são apresentados sem preço; compra é tratada separadamente em `https://loja.prorevesttintas.com.br/`.

A principal jornada desejada é:

**Home → Studio → upload de ambiente → aplicar tinta/efeito → visualizar → salvar → produto/contato/WhatsApp.**
