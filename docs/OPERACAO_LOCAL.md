# Operação do servidor doméstico

Execute os comandos na pasta do projeto. Antes, siga
[INSTALACAO_LOCAL.md](INSTALACAO_LOCAL.md).

## Comandos cotidianos

```bash
bash scripts/local.sh start
bash scripts/local.sh status
bash scripts/local.sh logs
bash scripts/local.sh stop
```

`start` espera os healthchecks. O healthcheck web ainda não representa uma
partida funcional: ele depende também da mídia e da conexão dos jogadores.
O computador hospedeiro deve ficar ligado e sem suspensão durante a sessão.
Os containers têm política de reinício; o início após ligar o computador
depende também de o serviço Docker estar habilitado.

## Contas individuais

Os jogadores podem criar suas contas em `/create/`, pelo botão
“Create a free account now” do jogo. O formulário pede nome, senha e confirmação.
O cadastro usa o banco do jogo, cria contas comuns e preserva o gatilho de
inicialização de iglu, inventário e cartão. Não exige e-mail, PHP ou captcha.

Os comandos administrativos continuam disponíveis como alternativa:

```bash
bash scripts/local.sh create "Pinguim1"
bash scripts/local.sh create "Pinguim2"
bash scripts/local.sh reset-password "Pinguim1"
```

As senhas são solicitadas no terminal sem aparecer na tela ou nos argumentos.
Cada nome deve ter de 4 a 12 caracteres, usando letras sem acentos, números ou
espaços internos. A senha deve ter pelo menos 8 caracteres e até 72 bytes,
limite do bcrypt. Nomes duplicados são rejeitados pelo banco.

Contas são criadas sem privilégio administrativo. A redefinição remove os
tokens de login salvos. Para encerrar sessões que já estavam abertas, reinicie
o mundo; os jogadores precisarão entrar novamente:

```bash
docker compose restart world
```

O serviço interno `registration` recebe os cadastros pelo proxy em
`/api/accounts`. Somente a origem configurada em `PUBLIC_ORIGIN` é aceita;
o proxy limita as tentativas por IP. A redefinição de senha continua restrita
ao terminal do responsável pelo servidor.

## Backup

```bash
bash scripts/local.sh backup
```

O dump é gravado em `backups/`, com data UTC, permissão restrita, gatilhos,
rotinas e eventos. Um arquivo parcial não é publicado como backup concluído.
O comando usa uma transação consistente para as tabelas InnoDB; não faça
alterações de esquema durante o dump. Guarde uma cópia fora do hospedeiro,
além da mídia e de `.env` em armazenamento privado.

## Restauração de teste

A restauração ainda precisa ser validada. Faça primeiro em uma cópia separada
do projeto e com outro nome Compose, por exemplo `yukon-restauracao`. Essa cópia
deve ter seu próprio `.env`, a mesma revisão do submódulo e a mesma mídia. Nunca
teste sobre o banco em uso.

```bash
docker compose -p yukon-restauracao up -d --wait db
docker compose -p yukon-restauracao exec -T db sh -c 'MYSQL_PWD="$MARIADB_ROOT_PASSWORD" mariadb -uroot yukon' < /caminho/do/backup.sql
```

Depois confira contagens de usuários e tabelas, gatilhos e dados de duas contas.
Para testar o jogo restaurado sem conflitar com a instalação principal, use
outra `WEB_PORT` nessa cópia e suba os demais serviços com o mesmo `-p`.
Só classifique o backup como validado após restaurar e recuperar o progresso.

## Atualizações

Antes de atualizar: faça backup, anote os commits, encerre a sessão e pare os
serviços. Atualize o código e os submódulos, reconstrua as imagens e teste duas
contas. Não atualize o submódulo para uma revisão arbitrária sem verificar a
compatibilidade. Não atualize a mídia misturando versões sobre a pasta anterior.

Uma alteração de schema exige uma estratégia de migração e retorno própria;
reimportar o SQL inicial sobre um banco existente não é um procedimento de
atualização. Se o proxy perder os serviços depois de recriar containers,
reinicie também o serviço `web` para renovar a resolução dos endereços.
