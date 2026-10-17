# Yukon Penguin

Este guia começa com o projeto já no computador, os requisitos conferidos e a
mídia preparada. O próximo objetivo é iniciar o servidor e abrir o jogo no
navegador.

O computador servidor executa o jogo e guarda as contas e o progresso. Ele deve
ficar ligado e sem suspensão enquanto as pessoas estiverem jogando. Os outros
computadores acessam o jogo pela mesma rede doméstica.

> Os builds do cliente e do servidor, os testes locais e a preparação da mídia
> passaram. O cadastro web e o login de uma conta nova também foram validados
> com os containers reais. Partidas multiplayer, persistência após reiniciar
> e restauração de backup ainda precisam ser validadas.

## 1. Abra o terminal na pasta do projeto

No seu computador, execute:

```bash
cd ~/Documentos/code/yukon-penguin
```

Mantenha o terminal nessa pasta durante o passo a passo. Execute um comando por
vez e espere terminar. Se aparecer um erro, consulte a seção de problemas antes
de avançar.

## 2. Descubra o IP que será usado para acessar o jogo

O IP é o endereço do computador servidor na rede de casa. Execute:

```bash
ip -4 address
```

A saída mostra várias interfaces. Procure a que está conectada ao Wi-Fi ou ao
cabo de rede e leia a linha que começa com `inet`. Um exemplo:

```text
inet 192.168.1.50/24 brd 192.168.1.255 scope global ...
```

Nesse exemplo, o IP é **`192.168.1.50`**. Copie somente o endereço, sem `/24`.
Não use `127.0.0.1`, que é o endereço interno do próprio computador, nem IPs de
interfaces Docker ou VPN.

**Nos próximos passos, substitua `192.168.1.50` pelo IP que você encontrou.**
Se possível, reserve esse endereço no DHCP do roteador para evitar que ele mude.

## 3. Salve a configuração do servidor

Execute com o seu IP:

```bash
node scripts/setup-local.cjs 192.168.1.50
```

O resultado esperado é uma mensagem parecida com:

```text
Configuração criada. URL: http://192.168.1.50:8080
```

Esse comando cria o arquivo oculto `.env` na pasta do projeto. Ele guarda o IP,
a porta `8080`, as senhas do banco e o segredo usado pelos serviços. As senhas
são geradas automaticamente; as contas dos jogadores serão criadas depois.

Se aparecer **`.env já existe`**, o script preservou a configuração anterior.
Abra esse arquivo no editor e confira estes dois campos:

```dotenv
LAN_IP=192.168.1.50
WEB_PORT=8080
```

Ajuste `LAN_IP` para o IP atual. Preserve os outros campos e as senhas existentes,
principalmente se o banco já tiver sido iniciado. Não publique o `.env`.

## 4. Construa as imagens do jogo

```bash
bash scripts/local.sh build
```

Esse comando prepara os pacotes que o Docker vai executar. Ele confere os
submódulos, verifica a mídia e constrói as imagens do site e do servidor.
Como a mídia já foi importada, essa etapa aproveita a pasta `assets/media/`.

A primeira construção pode demorar e precisa de internet para baixar imagens e
dependências. Muitas linhas no terminal são normais. Espere o comando terminar
sem erro e o terminal voltar a aceitar comandos antes de continuar.

Para esse caminho com Docker, as dependências são instaladas dentro das imagens;
não há uma etapa adicional de `npm install` no computador.

## 5. Inicie e confira os serviços

Primeiro, execute:

```bash
bash scripts/local.sh start
```

Esse comando inicia os serviços e aguarda as verificações de saúde. Na primeira
execução, o banco também cria as tabelas em seu volume vazio.

Quando terminar, execute:

```bash
bash scripts/local.sh status
```

Procure os cinco serviços abaixo. Todos devem estar em execução e mostrar
`healthy` na coluna de estado:

| Serviço | Para que serve |
|---|---|
| `db` | Guarda as contas e o progresso no banco MariaDB |
| `login` | Confere o nome e a senha dos jogadores |
| `world` | Executa o mundo Blizzard |
| `registration` | Cria as contas pelo formulário web |
| `web` | Entrega o site e encaminha as conexões do jogo |

Se algum serviço estiver parado ou `unhealthy`, consulte os logs:

```bash
bash scripts/local.sh logs
```

Use `Ctrl+C` para sair dos logs. Isso apenas encerra a visualização; os serviços
continuam funcionando. O estado `healthy` verifica os serviços, mas a partida
ainda precisa ser testada no navegador.

## 6. Crie sua conta pelo navegador

Com os serviços funcionando, abra o endereço abaixo, substituindo o IP pelo
valor de `LAN_IP` no seu `.env` e a porta pelo valor de `WEB_PORT`:

```text
http://192.168.1.50:8080/create/
```

Você também pode abrir a página inicial do jogo e clicar em
**“Create a free account now”**.

1. Escolha o nome do seu pinguim.
2. Digite uma senha e repita no campo de confirmação.
3. Clique em **Criar minha conta**.
4. Aguarde a mensagem **Conta criada!** e clique em **Voltar ao jogo**.

Use um nome com 4 a 12 letras sem acento, números ou espaços internos. A senha
precisa ter pelo menos 8 caracteres e até 72 bytes. Nome e senha não podem
começar ou terminar com espaços. Se o nome já estiver em uso, escolha outro.

Cada pessoa pode criar sua própria conta nessa página. As contas são comuns,
sem privilégio de administrador, e já recebem o iglu e o inventário iniciais.
Não é necessário informar e-mail nem instalar PHP ou captcha.

O comando `bash scripts/local.sh create "Pinguim1"` continua disponível como
alternativa para o responsável pelo servidor. A redefinição de senha continua
sendo feita pelo terminal.

## 7. Abra o jogo

Abra o navegador e digite o endereço com o IP configurado no passo 3:

```text
http://192.168.1.50:8080
```

Use esse mesmo endereço tanto no servidor quanto nos outros computadores.
A origem autorizada usa o IP configurado; acessar por `localhost` pode impedir
o login. Se você mudou `WEB_PORT`, use a nova porta no endereço.

Entre com o nome e a senha escolhidos no passo 6 e escolha o mundo **Blizzard**.

Para jogar em tela cheia, clique no pequeno botão no canto superior direito
da página. Clique nele de novo ou pressione `Esc` para sair.

A interface, os itens, o chat seguro, o tour e as missões estão em português,
como no Club Penguin do Brasil. Textos desenhados nas imagens, como o mapa e as
placas das salas, e os minijogos em Flash continuam em inglês. Veja os detalhes
em [resources/pt-BR](resources/pt-BR/README.md).

Para jogar com outra pessoa, conecte o outro computador à mesma rede doméstica,
abra a mesma URL e entre com a segunda conta. Verifique se os dois jogadores
conseguem se encontrar, conversar, trocar de sala e participar de um minijogo.

O acesso usa HTTP. Use senhas exclusivas para o jogo e mantenha o servidor na
rede doméstica, sem abrir portas no roteador. O funcionamento sem internet e a
compatibilidade com celulares ainda precisam ser testados.

## Como jogar Pizzatron 3000

Depois de entrar no mundo Blizzard:

1. Abra o mapa e vá para a **Plaza**.
2. Clique na porta da pizzaria à direita e espere o pinguim chegar até ela.
3. No salão, clique na porta **COZINHA / PIZZATRON 3000** e confirme que deseja jogar.
4. Se aparecer **Click to unmute**, clique para ativar o som. Depois clique em
   **PLAY** para começar. Use o mouse para colocar molho, queijo e os
   ingredientes pedidos em cada pizza.
5. Ao terminar, clique em **DONE** e confirme a mensagem de moedas para voltar
   à pizzaria.

Na tela inicial, a alavanca ao lado dos molhos ativa o modo de doces. O minijogo
está em inglês; o salão de acesso foi criado localmente em Phaser.
O Pizzatron é individual: cada jogador faz sua própria partida, enquanto o
salão da pizzaria é compartilhado.

Se estiver atualizando uma instalação já em execução, execute
`bash scripts/local.sh build` e depois `bash scripts/local.sh start`. Isso
atualiza as imagens preservando o volume do banco. Recarregue o navegador com
`Ctrl+F5` para obter o cliente e as configurações novos.

## Como parar e voltar a jogar depois

Para parar preservando as contas e o progresso:

```bash
bash scripts/local.sh stop
```

Na próxima sessão, abra o terminal na pasta do projeto e execute:

```bash
bash scripts/local.sh start
```

Depois, abra a mesma URL no navegador. Você não precisa repetir o build nem
criar novamente as contas a cada sessão.

**Não use `docker compose down -v` para parar o jogo. A opção `-v` apaga o
volume do banco e os dados guardados nele.**

## Outros comandos úteis

| O que você quer fazer | Comando |
|---|---|
| Ver o estado dos serviços | `bash scripts/local.sh status` |
| Acompanhar erros e mensagens | `bash scripts/local.sh logs` |
| Criar outra conta | `bash scripts/local.sh create "Pinguim3"` |
| Trocar a senha de uma conta | `bash scripts/local.sh reset-password "Pinguim1"` |
| Fazer backup do banco | `bash scripts/local.sh backup` |

O backup é salvo na pasta `backups/`. Guarde uma cópia fora do computador e
preserve o `.env` em local privado. Veja as instruções de restauração no
[guia de operação](docs/OPERACAO_LOCAL.md).

A troca de senha revoga os tokens salvos. Se também precisar encerrar as sessões
que já estão abertas, execute:

```bash
docker compose restart world
```

Isso desconecta todos os jogadores, que precisarão entrar novamente.

## Se algo não funcionar

| Situação | O que fazer |
|---|---|
| O Compose pede uma variável obrigatória | Confira se o passo 3 criou o `.env` na raiz do projeto. |
| Aparece `Assets incompletos` | Confira a mídia com `npm run local:check-assets` e consulte [ASSETS.md](docs/ASSETS.md). |
| O Docker não conecta | Execute `docker info` e confira se o Docker Engine está ativo e acessível ao seu usuário. |
| Um serviço não fica `healthy` | Execute `bash scripts/local.sh logs` e procure o erro do serviço indicado. |
| O site não abre no próprio servidor | Confira `status`, o IP atual, `LAN_IP` e a porta configurada. |
| O site abre no servidor, mas não em outro computador | Confira a mesma rede, o firewall, a rede de convidados e o isolamento de clientes Wi-Fi. Veja o [guia de rede](docs/INSTALACAO_LOCAL.md). |
| O cadastro mostra muitas tentativas | Aguarde um minuto e envie novamente. O cadastro limita tentativas por endereço e solicitações simultâneas. |
| O site abre, mas o login falha | Use exatamente o IP e a porta do `.env`, confira a conta e consulte os logs. |
| A porta `8080` está ocupada | Edite `WEB_PORT` no `.env` para uma porta livre, como `8081`, execute `start` e abra a URL com a nova porta. |
| O IP mudou | Atualize `LAN_IP` no `.env`, execute `start` e passe a usar o endereço novo em todos os dispositivos. |
| Aparece erro 502 depois de recriar serviços | Execute `docker compose restart web` para o proxy atualizar os endereços internos. |

## Documentação complementar

- [Instalação e configuração de rede](docs/INSTALACAO_LOCAL.md)
- [Origem e preparação da mídia](docs/ASSETS.md)
- [Contas, backup, restauração e atualizações](docs/OPERACAO_LOCAL.md)
- [Verificações realizadas e testes pendentes](docs/TESTES_MULTIPLAYER.md)
- [Plano do servidor doméstico](docs/PLANO_SERVIDOR_LOCAL.md)

O projeto deriva do Yukon, de wizguin. O código usa a [licença MIT](LICENSE).
Os arquivos de mídia mantêm os direitos de seus respectivos criadores.
