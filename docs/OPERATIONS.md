# Operação, ambientes e deploy

Última atualização: 2026-10-07

## Repositório

GitHub: `OARANHA/prorevest_v8`

Branch de produção atual: `main`.

## Produção

Diretório observado:

`/home/ProRevest/web/prorevesttintas.com.br/nodeapp`

Processo PM2:

`prorevest-app`

Runtime atual observado:

- Node: 20.19.5
- npm: 10.8.2
- PM2: 7.0.4

## Workspace de trabalho via Wandora

`/opt/wandora/ops-workspace/prorevest-repo-clean`

Snapshot original sanitizado preservado localmente na workspace Wandora.

## Build

Comando do projeto:

```bash
npm ci
npm run build
```

O build pode exigir heap maior em ambiente limitado:

```bash
NODE_OPTIONS=--max-old-space-size=768 npm run build
```

Isso foi necessário no broker Wandora por limite de memória da sessão. Em 2026-10-07, `NODE_OPTIONS=--max-old-space-size=768 npx react-router build --minify false` concluiu cliente+SSR com exit 0. Essa configuração é apenas de validação no broker; o deploy de produção continua exigindo build normal/minificado e smoke test.

## Deploy atual conhecido

Historicamente era feito:

```bash
npm run build
pm2 restart all
```

Esse fluxo é considerado legado e arriscado porque reinicia processos não relacionados.

### Alvo desejado

Após validação:

```bash
npm run build
pm2 restart prorevest-app
```

Ainda deve ser complementado com health check, smoke test e rollback antes de virar procedimento oficial.

## Regras de segurança

- Nunca commitar `.env`, tokens, service-role keys, senhas ou chaves privadas.
- Não executar scripts históricos de banco sem auditoria.
- Não fazer alteração direta em produção como fluxo normal.
- Não mudar Node global enquanto o PM2 depender do Node 20 atual.
- Não executar `pm2 restart all` automaticamente.
- Para mudança de banco/Supabase: revisar migração, RLS e impacto antes de aplicar.

## Smoke test mínimo após deploy

1. Home responde.
2. Catálogo responde.
3. Studio abre.
4. Upload básico do Studio funciona.
5. Login abre e autentica conta de teste.
6. Recuperação de senha abre fluxo correto.
7. Nenhum erro fatal novo nos logs do processo.
8. WhatsApp/links principais continuam funcionais.

## Rollback

Ainda não formalizado. Criar procedimento antes do primeiro deploy funcional relevante desta nova fase.
