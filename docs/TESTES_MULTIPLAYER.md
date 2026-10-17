# Validação da implementação local

Data: 17/10/2026. Esta página distingue verificações de código de uma sessão
real. Nenhuma partida multiplayer foi validada ainda.

## Verificações realizadas

- Instalação das dependências do cliente e servidor pelos lockfiles.
- Build de produção do cliente; concluiu com alertas de tamanho do bundle.
- Build do servidor 1.11.0-beta; 84 arquivos compilados.
- Teste da configuração: origem LAN, banco interno e cabeçalho de IP.
- Teste de montagem com arquivos fictícios: mundos locais, regeneração de crumbs,
  mídia original preservada, CDN removida e recursos auxiliares Ruffle copiados.
- Verificação da sintaxe do script Bash e dos scripts Node.js.

Os arquivos fictícios dos testes não são assets jogáveis. O verificador de mídia
falha quando os JSONs essenciais estão ausentes.

## Mídia integrada em 17/10/2026

- Download completo da revisão `9e6a576d4e8925ebd166d636e72888e9c8fdb545`.
- Submódulo `resources/yukon-assets/` adicionado e fixado nessa revisão.
- Importação de 33.800 arquivos de mídia e fontes, com manifesto SHA-256 local.
- `npm run local:check-assets` passou com os arquivos reais.
- `npm run local:assemble` passou e gerou a distribuição com a mídia real.

Esses resultados substituem o bloqueio anterior de obtenção dos arquivos;
a execução com containers e os testes de partidas ainda estão pendentes.

## Cadastro web validado em 17/10/2026

Foi adicionado o serviço interno `registration`, acessível pelo proxy em
`POST /api/accounts`, e um formulário em `/create/`. Não é mais necessário
criar as contas pelo terminal; os comandos administrativos foram preservados.

Verificações realizadas nesta máquina:

- Build Docker das imagens `registration` e `web` concluído.
- Cinco serviços saudáveis e configuração Nginx válida.
- Cinco testes automatizados passaram: configuração, montagem, validação de
  cadastro, respostas HTTP e limite de cadastros simultâneos.
- Cadastro pelo formulário em Chrome headless, incluindo confirmação de senha
  inválida, mensagem de sucesso e layout com largura de 390 px sem rolagem lateral.
- Consulta ao banco real confirmou hash bcrypt válido, conta com `rank = 1`,
  iglu, inventário e cartão inicial criados pelo gatilho.
- Nome duplicado rejeitado pela API com HTTP 409.
- Login via Socket.IO pelo proxy aceitou a senha da conta recém-criada e
  rejeitou uma senha incorreta.
- A conta temporária usada na validação foi removida ao terminar.

Os testes automatizados também verificam origem externa rejeitada, limite de
senha em bytes, JSON inválido, corpo grande e tipo de conteúdo incorreto.
O Nginx limita as tentativas por IP; o serviço limita a duas criações simultâneas.

## Ambiente atual e limites da validação

Docker e Compose estão disponíveis nesta máquina. Os containers foram iniciados
com MariaDB, login, mundo, cadastro e proxy; as tabelas e o gatilho foram usados
na validação de cadastro. Isso substitui a limitação do ambiente anterior,
que não tinha Docker/Podman disponíveis.

A autenticação testada não comprova uma partida completa. Ainda faltam os
ensaios com jogadores, persistência após reinícios, comandos de redefinição de
senha, backup e restauração.

## Critérios pendentes para considerar pronto

| Teste | Resultado |
|---|---|
| Importar mídia compatível | Concluído; verificador e montagem passaram |
| Carregar a tela inicial no navegador | Pendente: execução real |
| Subir containers e importar tabelas/gatilhos | Concluído; cinco serviços saudáveis e gatilho confirmado no cadastro |
| Criar duas contas, conferir iglu e inventário iniciais | Parcial: uma conta temporária validada com dados iniciais; sessão com duas contas pendente |
| Nome duplicado e senha incorreta serem rejeitados | Concluído no cadastro web e login via proxy |
| Redefinir senha e impedir reutilização dos tokens antigos | Pendente |
| Dois dispositivos entrarem pelo IP do hospedeiro | Pendente |
| Ver um ao outro, conversar e mudar de sala | Pendente |
| Jogar juntos pelo menos um minijogo | Pendente |
| Recuperar roupas, moedas e iglus após reiniciar | Pendente |
| Testar jogo Ruffle, moedas e retorno à sala | Pendente |
| Jogar com internet desligada e cache vazio | Pendente |
| Sessão de 30 minutos com os participantes da casa | Pendente |
| Restaurar backup em instalação separada | Pendente |

## Repetir verificações de código

```bash
git submodule update --init --recursive
npm ci
npm run test:local
npm run build
npm run local:check-assets
```

Em um clone novo, importe primeiro com
`node scripts/import-assets.cjs resources/yukon-assets`. Depois execute
`npm run local:assemble` e valide a distribuição em containers e no navegador.
A ausência de erros de JSON não substitui uma sessão real.

## Integração do Pizzatron 3000 — 17/10/2026

- SWFs e auxiliares adicionados em `resources/pizzatron/`, com revisão de origem
  e manifesto SHA-256. O pacote tem 14 arquivos e cerca de 1,2 MB.
- Sala local Pizza (330) implementada em Phaser e ligada à porta da Plaza.
- Sala de jogo Pizzatron (910) adicionada ao servidor e aos crumbs na montagem.
- Build das quatro imagens de aplicação passou; cinco serviços estão saudáveis.
- Oito testes automatizados passaram, incluindo integridade dos arquivos,
  instalação idempotente das salas e rejeição de recompensa repetida ou inválida.
- Teste de navegador com conta temporária confirmou login, entrada na Plaza,
  passagem para a pizzaria e confirmação da porta da cozinha.
- O Ruffle carregou o título e a partida original, com esteira e ingredientes.
- Um teste da ponte de pontuação com 25 moedas confirmou o crédito no banco,
  rejeição da segunda tentativa e retorno à pizzaria pelo prompt de moedas.
  Essa pontuação foi injetada no teste da ponte; não representa uma receita
  concluída manualmente no minijogo.
- Uma partida também foi encerrada naturalmente por cinco erros. O botão DONE
  do SWF enviou o resultado de zero moedas ao servidor; a confirmação voltou
  à pizzaria. Esse ensaio usou a velocidade original e não injetou pontuação.
- Os 14 arquivos servidos pelo Nginx foram baixados e comparados com os hashes
  SHA-256 do manifesto, sem divergências.
- Nenhum recurso HTTP do jogo ausente nem exceção JavaScript no percurso testado.
- As contas temporárias foram removidas depois dos testes.

A sala de acesso é uma implementação local, não uma conversão completa da sala
original. O jogo está em inglês. Ainda não foi validada uma partida perfeita
com 40 pizzas nem o desempenho nos dispositivos dos demais jogadores.

## Integração da Mina — 17/10/2026

- Pack original da sala Mine (808) adicionado em `resources/mine/`, com revisão
  de origem e manifesto SHA-256; cena Phaser adaptada de CPJourney-2/yukon.
- Entradas ligadas: máquina da mina na Cabana (807) e saída à direita da
  Caverna (806). Na mina, a saída à esquerda volta à Caverna, o túnel do fundo
  volta à Cabana e o carrinho abre o Cart Surfer (905).
- Salas 808 e 905 adicionadas ao servidor e aos crumbs na montagem.
- Doze testes automatizados passaram, incluindo integridade do pack, quadros
  usados pela cena e montagem local. O build das quatro imagens passou.
- Ainda não testado no navegador: entrada na sala, colisões, animações e uma
  partida do Cart Surfer pelo Ruffle.
