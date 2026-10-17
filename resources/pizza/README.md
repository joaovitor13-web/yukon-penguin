# Sala Pizza (pizzaria original)

Pack Phaser da pizzaria com a arte original do Club Penguin, complementar à
revisão fixada de `yukon-assets`, que não contém esta sala.

Origem: [CPJourney-2/assets — media/rooms/pizza](https://github.com/CPJourney-2/assets/tree/c23f3b451fc58db4f411bc0287850e42821a5a6d/media/rooms/pizza).
Revisão: `c23f3b451fc58db4f411bc0287850e42821a5a6d`.
Obtido em 17/10/2026. O manifesto registra tamanho e SHA-256 de cada arquivo.

Arquivos usados: o atlas `pizza.json`/`pizza.png` e as colisões
`pizza-physics.json`, mantidos como encontrados. O `pizza-pack.json` foi
reescrito para carregar apenas esses arquivos; o atlas, os sons e as animações
do trabalho de garçom da origem (`pizza-job*`, `*.mp3`) não foram trazidos,
pois esse sistema não existe neste cliente.

A cena `src/scenes/rooms/pizza/Pizza.js` segue o layout de
[CPJourney-2/yukon](https://github.com/CPJourney-2/yukon): forno com fogo e
vapor, velas animadas nas mesas, livro e caixa registradora animados ao passar
o mouse, porta de contas para o Pizzatron e porta de saída para a Plaza.

As imagens mantêm os direitos de seus respectivos criadores; a licença MIT do
cliente Yukon não é uma licença desses arquivos.
