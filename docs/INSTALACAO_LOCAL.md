# Instalação do servidor doméstico

Esta primeira implementação fornece a infraestrutura e os comandos. Ainda
falta a validação completa com containers e jogadores. A mídia foi integrada
em um submódulo e já foi importada e montada na distribuição local.
Não é uma distribuição pronta para jogar.

## Requisitos

- Computador hospedeiro Linux, inicialmente Fedora, ligado durante as sessões.
- Git, Node.js 22 e Docker Engine com Docker Compose v2 configurados.
- Submódulos inicializados, incluindo a mídia em `resources/yukon-assets/`.
- Dispositivos conectados à mesma rede doméstica, sem isolamento de clientes.

Não há instalação automática de Docker nem alteração automática de firewall.
As imagens base são `node:22-bookworm-slim`, `nginx:1.28-alpine` e `mariadb:11.4`.
As versões menores recebem correções pelos respectivos canais; o código do
servidor fica fixado no commit do submódulo. MariaDB foi escolhido como banco
compatível com o protocolo MySQL do projeto; a importação do SQL ainda deve ser
validada no ambiente com Docker. Não substituir o banco por outro sem esse teste.

## Preparar

```bash
git clone --recurse-submodules https://github.com/joaovitor13-web/yukon-penguin.git
cd yukon-penguin
git submodule update --init --recursive
```

Reserve no roteador um IP para o computador hospedeiro. Descubra seu IPv4 na
rede doméstica com `ip -4 address`; não use o endereço de uma interface de VPN
ou de containers. Abaixo, `192.168.1.50` é apenas um exemplo:

```bash
node scripts/setup-local.cjs 192.168.1.50
bash scripts/local.sh build
bash scripts/local.sh start
```

O primeiro comando gera `.env` com segredos aleatórios e permissão restrita.
Ele não sobrescreve uma configuração anterior. Para trocar o IP, edite somente
`LAN_IP` em `.env`; não gere outras senhas para um banco já inicializado.

Abra `http://192.168.1.50:8080` em todos os dispositivos, incluindo o hospedeiro.
A origem de login é configurada para esse endereço. Usar `localhost` ou outro
nome no navegador pode impedir a conexão. Se mudar a porta, atualize `WEB_PORT`
e recrie os serviços com `bash scripts/local.sh start`.

## Rede

O Compose publica somente o serviço web, no IPv4 informado. MySQL/MariaDB,
login e mundo ficam em uma rede interna de containers, sem portas publicadas.
O Nginx encaminha polling e WebSocket, remove o prefixo público da rota e
sobrescreve os cabeçalhos de IP antes de enviá-los ao servidor.

No Fedora, verifique a zona e a interface usadas pelo Wi-Fi com
`firewall-cmd --get-active-zones`. Se precisar liberar a porta web, restrinja a
regra à sub-rede doméstica correta. Não desligue o firewall. Não configure
redirecionamento de portas ou DMZ no roteador. A publicação de portas do Docker
também precisa ser considerada na política do firewall; a restrição ao IPv4 do
hospedeiro não equivale a uma regra completa de acesso por sub-rede.

Se o navegador não abrir, confira o IP, a porta, o estado dos containers, a
rede de convidados e a opção de isolamento Wi-Fi do roteador.

HTTP foi usado para a primeira versão na rede de casa. Use senhas exclusivas
para o jogo, pois elas trafegam sem criptografia. HTTPS local continua como
etapa opcional de evolução.

## Banco e inicialização

O SQL do submódulo é importado somente quando o volume está vazio. A criação de
uma conta depende do gatilho `trigger_users_insert`, que inicializa iglu,
inventário e cartão. O volume `database` guarda o progresso entre reinícios.

`docker compose stop` preserva os dados. **Não execute `docker compose down -v`
para uma parada normal:** esse comando apaga o volume do banco.

Segredos, dumps e mídia não devem ser enviados ao repositório. As imagens de
build também excluem `.env`, dumps e configurações reais do contexto.
