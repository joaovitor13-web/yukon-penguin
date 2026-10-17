# Plano para jogar Yukon na rede Wi-Fi de casa

Status: implementação e assets integrados em 17/10/2026; testes reais ainda pendentes.
Data: 16 de outubro de 2026.  
Repositório: [joaovitor13-web/yukon-penguin](https://github.com/joaovitor13-web/yukon-penguin).  
Base analisada do cliente: commit `2f47b90137d168d484ce934b58543cadf0f94920`, versão `1.11.0-beta`.

## Progresso da implementação — 17/10/2026

Foram adicionados Compose, submódulo do servidor fixado em
`fead5f7849e97a866e07d39213ff41b970497f4e`, configuração LAN, proxy, criação e
redefinição de contas, backup e scripts de importação/verificação da mídia.
Phaser e Ruffle serão servidos localmente pela distribuição preparada.

Builds do cliente e do servidor e testes da configuração/montagem passaram.
O pacote completo de mídia foi baixado e integrado como submódulo em
`resources/yukon-assets/`. A importação dos 33.800 arquivos e a montagem da
distribuição com mídia real passaram. Ainda não foi possível executar os
containers neste ambiente, que não dispõe de Docker/Podman ou banco instalado.
Os critérios que dependem de execução real continuam pendentes.

Consulte [instalação](INSTALACAO_LOCAL.md), [assets](ASSETS.md),
[operação](OPERACAO_LOCAL.md) e [resultados dos testes](TESTES_MULTIPLAYER.md).

## 1. Objetivo

Executar o jogo em um computador da casa e permitir que outras pessoas conectadas à mesma rede abram um endereço no navegador, entrem com suas próprias contas e joguem juntas. Contas, roupas, moedas, iglus e demais dados suportados devem continuar disponíveis depois de desligar e ligar o servidor.

O computador hospedeiro deverá permanecer ligado enquanto houver jogadores. Não será necessário contratar hospedagem nem abrir portas do roteador para a internet.

Premissas de trabalho:

- Usar Fedora como primeira plataforma de instalação; confirmar o computador e seus recursos na implementação.
- Começar com um único mundo, mantendo o identificador interno `Blizzard`.
- Validar inicialmente dois computadores e depois uma sessão com a quantidade real de participantes da casa.
- Priorizar navegadores de computadores. Celulares e tablets serão avaliados separadamente: a interface e alguns minijogos podem exigir teclado ou adaptações para toque.
- Buscar funcionamento sem internet depois da instalação, incluindo arquivos do jogo e bibliotecas locais. Isso será um critério a testar, não uma capacidade já confirmada.

## 2. Situação atual e dependências

| Componente | Situação verificada | Consequência |
|---|---|---|
| Cliente | JavaScript, Phaser, Socket.IO, Webpack; versão 1.11.0-beta | Há uma base extensa, mas a presença de código não comprova que todos os recursos funcionam |
| Servidor | Projeto separado: [wizguin/yukon-server](https://github.com/wizguin/yukon-server), também 1.11.0-beta | Precisamos integrá-lo e validar a compatibilidade de uma revisão específica |
| Banco | MySQL, acessado pelo servidor por Sequelize | É necessário importar o esquema e manter os dados em armazenamento persistente |
| Mídia | `assets/media/**` está excluído do Git e ausente no fork | Impede carregar o jogo completo; é a primeira dependência a resolver |
| Configurações de conteúdo | Arquivos “crumbs” descrevem salas, itens, jogos e mundos | Precisam corresponder aos assets e ao servidor |
| Cadastro existente | PHP, MySQL e hCaptcha | Acrescenta serviços e dependência externa; não será a primeira opção para uso doméstico |
| Minijogos | Há cenas JavaScript e integração Ruffle para arquivos SWF | A lista realmente jogável depende dos arquivos disponíveis e de testes |
| Build | Webpack gera HTML e bundles em `dist/` | Precisamos preparar a distribuição com os demais arquivos estáticos |
| Dependências externas | O HTML carrega Phaser e Ruffle por CDN | Precisam ser servidos localmente para jogar sem internet |

O SQL do servidor contém o gatilho `trigger_users_insert`, que cria o iglu, a cor inicial no inventário e um cartão de boas-vindas quando uma conta é inserida. A instalação deve preservar esse comportamento.

## 3. Arquitetura proposta

Usar um único endereço para os jogadores, por exemplo `http://192.168.1.50:8080`. Esse IP é ilustrativo: deverá ser substituído pelo endereço reservado para o computador hospedeiro no roteador.

| Serviço | Responsabilidade | Acesso |
|---|---|---|
| Servidor web/proxy Nginx | Entregar HTML, JavaScript e mídia; encaminhar Socket.IO | Porta 8080 do hospedeiro, restrita à rede doméstica |
| Login | Autenticação de contas | Porta 6111, apenas na rede interna dos serviços |
| Mundo Blizzard | Sessões e interações dos jogadores | Porta 6112, apenas na rede interna dos serviços |
| MySQL | Contas e progresso | Porta 3306, apenas na rede interna dos serviços |
| Utilitário de administração | Criar contas, redefinir senhas e executar backup | Executado pelo administrador no hospedeiro |

O navegador usará a mesma origem para os arquivos e para as rotas `/world/login` e `/world/blizzard`. O proxy encaminhará essas rotas aos respectivos processos.

Empacotamento proposto: Docker Compose, com o frontend/proxy, os processos Login e Blizzard e o MySQL. O uso de Podman Compose poderá ser validado depois; não presumir compatibilidade sem testar. Assets serão montados de uma pasta local e o banco terá volume persistente.

A primeira validação poderá usar HTTP em uma rede doméstica confiável, com senhas exclusivas para o jogo. HTTP não cifra as credenciais em trânsito. HTTPS local poderá ser acrescentado com uma autoridade certificadora confiável nos dispositivos, caso essa proteção seja desejada.

## 4. Etapas de implementação

### Etapa 1 — Resolver assets e fixar as versões

- [ ] Obter um pacote de mídia compatível por uma fonte autorizada, começando pela documentação e comunidade do Yukon.
- [ ] Registrar origem, versão, tamanho e checksum do pacote e os limites de redistribuição.
- [ ] Confirmar a presença de `assets/media/preload/preload-pack.json`, arquivos de salas, pinguins, roupas, fontes, áudio, crumbs e SWFs dos jogos escolhidos.
- [ ] Verificar se os caminhos dos arquivos e os identificadores de conteúdo correspondem ao cliente e aos dados do servidor.
- [ ] Fixar o cliente e o servidor em commits identificáveis; conferir a versão de Node.js compatível e fixá-la no ambiente.
- [ ] Integrar o servidor em `server/` como submódulo Git apontando para um commit fixo, ou criar um fork próprio do servidor se forem necessárias alterações nele.
- [ ] Manter alterações inevitáveis do servidor rastreáveis; não depender de edições manuais dentro de containers.

**Critério de conclusão:** mídia e código necessários estão disponíveis localmente e a configuração inicial consegue carregar sem arquivos essenciais ausentes.

**Bloqueio:** se os assets compatíveis não forem encontrados, continuar apenas o preparo de infraestrutura e registrar explicitamente a pendência. Não declarar o jogo funcional nem substituir arquivos faltantes por recursos de terceiros sem verificar compatibilidade e autorização.

### Etapa 2 — Subir banco, autenticação e um mundo

- [ ] Criar a configuração Compose e os arquivos de build dos serviços.
- [ ] Instalar dependências a partir dos lockfiles e validar os builds.
- [ ] Importar `yukon.sql` somente em um banco novo, preservando tabelas, dados iniciais, índices e gatilhos.
- [ ] Confirmar que o mundo `Blizzard` existe no banco e coincide com a configuração.
- [ ] Criar credenciais locais próprias e um segredo criptográfico compartilhado pelos processos Login e Blizzard.
- [ ] Gerar `config/config.json` a partir de variáveis locais; o código atual importa esse JSON e não deve ser tratado como se já lesse todas as variáveis de ambiente.
- [ ] Usar nomes dos serviços para comunicação entre containers; `localhost` dentro de um container aponta para ele mesmo.
- [ ] Acrescentar verificação de disponibilidade do banco, espera na inicialização, reinício controlado e logs por serviço.
- [ ] Manter o banco e as portas 6111/6112 sem publicação no hospedeiro.

**Atenção verificada no código:** `src/server/Server.js` chama `io.listen(port)` sem usar o campo `worlds[id].host` para limitar a interface de escuta. Alterar apenas esse campo não restringe o acesso. A separação de rede dos containers e o firewall deverão garantir o isolamento; numa instalação nativa, ajustar a escuta explicitamente.

**Critério de conclusão:** os serviços iniciam de forma reproduzível e uma conta de teste consegue autenticar e entrar no mundo pelo hospedeiro.

### Etapa 3 — Criar contas individuais e preservar progresso

- [ ] Implementar um comando administrativo local para criar usuários com nome e senha.
- [ ] Ler a senha sem exibi-la e gerar o hash bcrypt localmente; não enviar senhas para serviços externos nem colocá-las em argumentos ou logs.
- [ ] Validar nomes conforme as regras do jogo, incluindo limite de 4 a 12 caracteres, caracteres aceitos e duplicidade conforme a comparação do banco.
- [ ] Criar contas comuns por padrão, sem privilégios de moderador.
- [ ] Usar consultas parametrizadas ou os modelos do servidor e confirmar a execução do gatilho de inicialização.
- [ ] Implementar redefinição de senha e avaliar a invalidação dos tokens salvos existentes.
- [ ] Testar contas independentes, logout, senha incorreta e tentativa de sessão duplicada.
- [ ] Desabilitar ou redirecionar o botão de cadastro existente, explicando que as contas são criadas pelo administrador da casa.
- [ ] Não exigir e-mail real ou hCaptcha para o cadastro administrativo local.

Uma interface de cadastro autônomo poderá ser criada depois. Para a primeira versão, o administrador criar as contas reduz o trabalho e elimina a necessidade de PHP e hCaptcha.

**Critério de conclusão:** duas pessoas usam contas distintas, alteram seus personagens e recuperam seus próprios dados depois de sair e reiniciar os serviços.

### Etapa 4 — Preparar o cliente e permitir acesso pelo Wi-Fi

- [ ] Gerar as configurações de mundos para usar o endereço/origem do servidor doméstico, sem deixar `localhost` nos endereços enviados aos outros dispositivos.
- [ ] Ajustar `assets/media/crumbs/en/worlds.json` e executar `npm run build-crumbs`, conforme o pacote de mídia obtido.
- [ ] Configurar CORS com a origem completa realmente usada, incluindo protocolo e porta.
- [ ] Configurar o proxy para tráfego HTTP de polling e upgrade WebSocket do Socket.IO.
- [ ] Verificar a reescrita de caminhos: o servidor Socket.IO usa `path: '/'`, enquanto o navegador usará as rotas públicas de Login e Blizzard.
- [ ] Preservar o IP do cliente no proxy e revisar `rateLimit.ipAddressHeader` e a função que o interpreta. Aceitar o cabeçalho somente do proxy confiável, sem acesso direto aos processos.
- [ ] Testar vários jogadores simultâneos: o limite por endereço não pode tratar todos como um único jogador por causa do proxy.
- [ ] Montar a distribuição com `dist/`, mídia, estilos e bibliotecas necessários; o build atual não copia automaticamente todo esse conteúdo.
- [ ] Reservar o IP do hospedeiro no DHCP do roteador e documentar a URL.
- [ ] Liberar no firewall apenas a porta web escolhida e apenas para a sub-rede doméstica correta, considerando também interfaces IPv6.
- [ ] Verificar isolamento de clientes Wi-Fi e rede de convidados caso os dispositivos não se alcancem.
- [ ] Não configurar redirecionamento de portas no roteador nem depender do servidor de desenvolvimento Webpack para as sessões habituais.

**Critério de conclusão:** dois dispositivos diferentes abrem a mesma URL, entram no mesmo mundo, veem um ao outro, conversam e se deslocam entre salas.

### Etapa 5 — Tornar a sessão independente da internet

- [ ] Fixar e servir localmente Phaser, Ruffle e os arquivos auxiliares necessários, incluindo WASM e recursos carregados dinamicamente.
- [ ] Verificar fontes, músicas, catálogos, imagens e SWFs em busca de URLs externas.
- [ ] Remover da experiência local qualquer dependência funcional de captcha, CDN ou serviço externo.
- [ ] Testar com a conexão de internet do roteador desligada, mantendo a rede Wi-Fi ativa.
- [ ] Fazer esse teste com cache vazio ou perfil novo do navegador para evitar um falso resultado positivo.

**Critério de conclusão:** login, sala inicial, interações básicas e os jogos declarados compatíveis funcionam sem acesso à internet. Downloads de instalação e atualizações continuarão podendo exigir internet.

### Etapa 6 — Validar recursos e facilitar a operação

- [ ] Criar uma matriz dos recursos testados: salas, chat, roupas, compras, amigos, iglus, puffles e cada minijogo.
- [ ] Testar pelo menos um jogo multiplayer com dois dispositivos; verificar resultados e moedas no servidor.
- [ ] Testar separadamente os jogos executados pelo Ruffle e suas chamadas de retorno ao cliente.
- [ ] Registrar falhas conhecidas; ocultar ou sinalizar entradas de jogos indisponíveis para evitar telas sem saída.
- [ ] Fazer uma sessão contínua de pelo menos 30 minutos com múltiplas contas e observar uso de memória, CPU, desconexões e erros.
- [ ] Validar os navegadores realmente usados pela família e, depois, controles em celulares/tablets.
- [ ] Documentar comandos para iniciar, parar, consultar logs, criar contas e atualizar.
- [ ] Configurar início automático, se desejado, e impedir suspensão do hospedeiro durante as sessões.
- [ ] Criar backup consistente do MySQL que inclua gatilhos, além de cópia das configurações e do pacote de mídia.
- [ ] Testar restauração em um ambiente separado antes de considerar o backup confiável.
- [ ] Documentar atualização com backup prévio e possibilidade de voltar às revisões anteriores.

**Critério de conclusão:** o administrador consegue iniciar e encerrar uma sessão sem editar arquivos; os jogadores recuperam o progresso; um backup é restaurado com sucesso.

## 5. Entregáveis previstos

Os arquivos abaixo são propostas para a implementação; ainda não existem por causa deste plano.

| Arquivo ou diretório | Finalidade |
|---|---|
| `compose.yaml` | Subir proxy, servidor e banco |
| `server/` | Referência versionada ao código do servidor |
| `deploy/` | Imagens, proxy, configuração gerada e inicialização |
| `.env.example` | Documentar variáveis sem incluir credenciais reais |
| `scripts/` | Preparação, criação de contas, backup e restauração |
| `docs/ASSETS.md` | Origem, compatibilidade, checksums e importação da mídia |
| `docs/INSTALACAO_LOCAL.md` | Instalação, endereço local e configuração de rede |
| `docs/OPERACAO_LOCAL.md` | Uso cotidiano e resolução de problemas |
| `docs/TESTES_MULTIPLAYER.md` | Resultados, dispositivos e limitações conhecidas |

Credenciais, configuração real, dumps do banco e arquivos de mídia sem autorização de redistribuição permanecerão fora do repositório público. As licenças e os créditos existentes serão preservados.

## 6. Ordem e critérios de entrega

Ordem de execução: **assets e versões → serviços e banco → contas → acesso pelo Wi-Fi → operação sem internet → validação e manutenção**.

A primeira versão será considerada pronta quando:

- [ ] Dois jogadores em dispositivos diferentes entrarem simultaneamente, cada um com sua conta.
- [ ] Ambos se encontrarem, conversarem e jogarem juntos pelo menos um minijogo validado.
- [ ] Contas e progresso persistirem após reiniciar o hospedeiro.
- [ ] O acesso funcionar pela rede doméstica sem abrir portas do roteador.
- [ ] Os recursos prometidos funcionarem sem internet e sem depender do cache do navegador.
- [ ] Backup e restauração tiverem sido testados.
- [ ] Houver uma lista explícita dos recursos suportados e das limitações restantes.

Não prometer de início todo o catálogo do Club Penguin, festas históricas, todas as missões ou suporte completo a celulares. O escopo efetivo será definido pelos assets obtidos e pelos resultados dos testes.

## 7. Referências técnicas verificadas

Cliente:

- [Dependências e comandos](../package.json).
- [Build, porta de desenvolvimento e proxies](../webpack.config.js).
- [Carregamento inicial da mídia](../src/engine/boot/Preload.js).
- [Conexões aos mundos](../src/engine/network/Network.js).
- [Geração dos crumbs](../utils/build-crumbs.js).
- [Escolha entre cenas JavaScript e SWF](../src/engine/world/room/RoomManager.js).
- [Integração Ruffle](../src/engine/ruffle/RuffleController.js).
- [HTML de produção e bibliotecas externas](../index.ejs).
- [Cadastro PHP existente](../create/scripts/php/create.php).

Servidor, consultado na branch `master` em 16/10/2026; fixar o commit antes de implementar:

- [Instalação](https://github.com/wizguin/yukon-server/blob/master/README.md).
- [Configuração de exemplo](https://github.com/wizguin/yukon-server/blob/master/config/config_example.json).
- [Escuta Socket.IO e limites](https://github.com/wizguin/yukon-server/blob/master/src/server/Server.js).
- [Autenticação](https://github.com/wizguin/yukon-server/blob/master/src/plugin/plugins/login/Login.js).
- [Esquema SQL e inicialização de contas](https://github.com/wizguin/yukon-server/blob/master/yukon.sql).
