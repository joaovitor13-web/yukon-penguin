# Arquivos de mídia

## Estado da busca em 17/10/2026

O fork não inclui `assets/media`. A release 1.11.0-beta do cliente também não
contém um pacote de mídia anexado. Na [issue 3 do Yukon](https://github.com/wizguin/yukon/issues/3),
os comentários indicam que os arquivos eram disponibilizados nos itens fixados
do Discord do projeto. O README do upstream aponta para essa comunidade.

### Fonte específica do Yukon encontrada

A busca ampliada encontrou a fonte original pública:
[piefruit/assets no GitGud](https://gitgud.io/piefruit/assets).
O acesso Git foi confirmado, mesmo com falhas de carregamento pela ferramenta
de pesquisa. Revisão examinada: `9e6a576d4e8925ebd166d636e72888e9c8fdb545`,
de 24/08/2025.

A árvore desse commit contém 33.801 arquivos, incluindo 25 packs de salas,
13 fontes e `media/flash/boot.swf`. Foram baixados e lidos os 23 JSONs individuais
de crumbs esperados pelo nosso verificador, sem arquivos ausentes ou JSONs
inválidos. O preload usa o caminho esperado para `crumbs.json`, e
`games.json` fornece o campo `path` consumido pelo cliente atual.

O pacote completo foi baixado em 17/10/2026 e integrado ao projeto como
submódulo em `resources/yukon-assets/`, fixado na revisão acima. Foram importados
33.800 arquivos de `media/` e `fonts/` (aproximadamente 2 GB). A verificação dos
23 JSONs essenciais passou e a distribuição `local-dist/` foi gerada com sucesso.
O manifesto SHA-256 local registra todos os arquivos importados.

Nenhuma partida foi validada ainda. A presença dos arquivos e o sucesso da
montagem não comprovam o funcionamento de cada sala e minijogo.

Para obter a versão integrada a este repositório:

```bash
git submodule update --init --recursive
node scripts/import-assets.cjs resources/yukon-assets
npm run local:check-assets
```

O script `bash scripts/local.sh build` inicializa os submódulos e importa a mídia
automaticamente se `assets/media` ainda não existir. O build Docker da imagem web
usa diretamente a revisão fixada do submódulo, sem depender da cópia importada
no hospedeiro. Veja também [resources/README.md](../resources/README.md).

Os arquivos continuam hospedados na fonte original; nosso histórico Git contém
o vínculo e a revisão exata. Por isso, o ZIP gerado pelo GitHub não inclui a
mídia: use um clone com `--recurse-submodules` ou inicialize os submódulos.

### Espelho no GitHub e outras fontes

| Fonte | Conteúdo e adequação |
|---|---|
| [Gabiworld/assets-yukon](https://github.com/Gabiworld/assets-yukon) | Espelho cujo README aponta para piefruit/assets. Commit consultado `af587035c16206fe5f6048f994c589ccbbbcad3d`, de 12/01/2023. Inclui mídia e fontes, mas faltam 10 dos 23 JSONs individuais exigidos atualmente e o formato dos minijogos é antigo. Não usar como pacote completo para nosso cliente. |
| [Solero legacy-media](https://git.solero.me/solero/legacy-media) | Mídia para o cliente Flash AS2; pode servir de referência ou complemento, mas não substitui diretamente os packs Phaser/JSON do Yukon. |
| [Solero vanilla-media](https://git.solero.me/solero/vanilla-media) | Mídia para o cliente Flash AS3; também exige adaptação para o Yukon. |
| [anthonywww/cpcontinuned-media](https://github.com/anthonywww/cpcontinuned-media) | Outro arquivo público de mídia Flash, descrito pelo autor como compatível com Aurora. Não é um pacote pronto para Yukon. |

A próxima etapa é auditar os caminhos referenciados e testar o carregamento
do jogo com os serviços reais e dois jogadores.

## Importação

Obtenha o pacote compatível, extraia-o fora do repositório e localize a pasta
`assets`, com `media/` e, se fornecido, `fonts/`. Depois execute:

```bash
node scripts/import-assets.cjs /caminho/do/pacote/assets
node scripts/check-assets.cjs
```

A importação copia somente essas duas pastas, rejeita links simbólicos e cria
`assets-manifest.local.json` com os tamanhos e hashes SHA-256. O manifesto e a
mídia ficam fora do Git. Registre também a URL de origem, a data, a versão e
eventuais condições de redistribuição em suas anotações locais. O script não
executa arquivos do pacote nem extrai arquivos ZIP por conta própria.

Uma segunda importação exige guardar e remover a pasta `assets/media` anterior
explicitamente. Isso evita misturar versões sem perceber.

## O que a verificação garante

O verificador confirma que os JSONs essenciais do preload e dos crumbs existem
e podem ser lidos. Ele **não garante** a presença de todas as imagens, fontes,
sons e SWFs referenciados pelo conteúdo. Essa verificação completa depende do
pacote real e dos testes em navegador.

Ao montar a distribuição, os mundos serão limitados a `Login` e `Blizzard`,
com endereços relativos à mesma origem. O `crumbs.json` será gerado dentro de
`local-dist/`; os arquivos importados originais serão preservados.

Phaser e Ruffle são obtidos pelo npm e copiados com seus recursos auxiliares
para a distribuição local. URLs externas ainda presentes no pacote de mídia
precisam ser identificadas nos testes antes de afirmar funcionamento offline.

## Complemento Pizzatron 3000

O pacote fixado de `yukon-assets` não contém a pizzaria nem o Pizzatron.
A integração local acrescenta o minijogo a partir de
[aprilx246/ClubPenguin](https://github.com/aprilx246/ClubPenguin/tree/5ede60affff8a762c03350f205c0a0747f725482/Pizzatron%203000).
Os 14 arquivos necessários estão versionados em `resources/pizzatron/`, com
manifesto SHA-256 próprio e [notas de origem](../resources/pizzatron/README.md).

A montagem copia o complemento e gera as entradas 330 (Pizza) e 910 (Pizzatron)
na distribuição. O importador e a mídia original do submódulo são preservados.
O build Docker também inclui esse complemento, sem downloads extras do jogo.
A sala de acesso usa o pack original da pizzaria obtido de
[CPJourney-2/assets](https://github.com/CPJourney-2/assets/tree/c23f3b451fc58db4f411bc0287850e42821a5a6d/media/rooms/pizza),
versionado em `resources/pizza/` com manifesto SHA-256 e
[notas de origem](../resources/pizza/README.md). Os textos do minijogo estão em inglês.

## Complemento Teatro

O submódulo também não tem a sala Stage (340). O pack básico do teatro vem de
[CPJourney-2/assets](https://github.com/CPJourney-2/assets/tree/c23f3b451fc58db4f411bc0287850e42821a5a6d/media/rooms/stage/stage-basic)
e está versionado em `resources/stage/`, com manifesto SHA-256 e
[notas de origem](../resources/stage/README.md). As portas do palco na Plaza
levam a essa sala.

## Complemento Mina

O pacote fixado de `yukon-assets` contém o minijogo Cart Surfer
(`flash/games/mine`), mas não a sala da mina. O pack original da sala foi obtido de
[CPJourney-2/assets](https://github.com/CPJourney-2/assets/tree/c23f3b451fc58db4f411bc0287850e42821a5a6d/media/rooms/mine)
e versionado em `resources/mine/`, com manifesto SHA-256 e
[notas de origem](../resources/mine/README.md). A montagem gera a entrada 808 (Mine)
e troca a chave do jogo 905 de `mine` para `cart`, que tem textos de prompt,
carregamento e busca de amigos. O servidor recebe as salas 808 e 905 pelo mesmo
instalador do Pizzatron (`deploy/runtime/mine.cjs`).

