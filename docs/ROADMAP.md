# Roadmap priorizado

Última atualização: 2026-10-07

## P0 — Confiabilidade do Studio ProRevest

Objetivo: tornar o Studio o recurso mais confiável e valioso do site.

### Investigar antes de alterar
- Upload de imagens e formatos/tamanhos aceitos.
- Fluxo de seleção de parede/superfície.
- Aplicação de tinta/cor/efeito.
- Processamento por IA e APIs envolvidas.
- Estados de loading que podem ficar presos.
- Falhas intermitentes e tratamento de erro.
- Persistência/salvamento de projetos.
- Comportamento sem login e após login.
- Mobile e desktop.
- Rotas `/studio` e `/studioprorevest`.

### Critério de sucesso
Um usuário consegue enviar uma imagem, aplicar uma opção ProRevest, visualizar o resultado, repetir a operação e salvar/retomar o projeto sem ficar preso em loading ou perder estado.

## P0 — Autenticação e recuperação de acesso

### Fluxos obrigatórios
- cadastro;
- login;
- persistência da sessão;
- logout;
- esqueci minha senha;
- recebimento do link;
- callback;
- redefinição da senha;
- retorno ao site autenticado;
- proteção das rotas de projetos/Studio quando necessário.

### Critério de sucesso
Teste ponta a ponta com conta de teste, sem dependência de ações manuais no banco.

## P1 — Jornada de arquitetos

- Studio em posição de destaque na Home.
- Explicação direta: enviar foto e testar cores/efeitos no próprio ambiente.
- CTA consistente para o Studio.
- Produto → “Visualizar no meu ambiente”.
- Acesso fácil a ficha técnica, aplicação, acabamento e informações úteis para especificação.

## P1 — Catálogo sem preços

- Não exibir preço no site institucional.
- Remover slider/filtros de preço sem função.
- Não tratar “Consulte” como preço.
- Priorizar especificação técnica, acabamento, aplicações, rendimento, preparo, cores e efeitos.
- Preparar CTAs futuros para `loja.prorevesttintas.com.br`, sem misturar checkout ao institucional agora.

## P1 — Dados oficiais e confiança

- Padronizar WhatsApp/telefone: (51) 98660-5758.
- Padronizar Instagram: @prorevestoficial.
- Confirmar e-mail oficial.
- Conferir endereço/localização.
- Corrigir links legais e institucionais.
- Remover placeholders visíveis.

## P2 — SEO e conteúdo

- canonical por rota;
- title/description/OG por página;
- corrigir GEO incorreto;
- revisar números institucionais;
- revisar blog e conteúdo placeholder;
- estruturar conteúdo para arquitetos e buscas de tintas/revestimentos/efeitos.

## P2 — Performance e arquitetura

- Bundle principal acima de ~1 MB.
- Code splitting onde trouxer ganho real.
- Revisar módulos Node entrando em bundle de browser.
- Investigar chunks vazios.
- Atualizar dependências depreciadas de forma controlada.
- Remover imports não utilizados quando útil.

## P3 — Operação e deploy

- Parar de depender de `pm2 restart all`.
- Reiniciar somente `prorevest-app`.
- Criar health check e smoke test.
- Definir rollback.
- Evoluir para deploy automatizado somente após estabilização funcional.
