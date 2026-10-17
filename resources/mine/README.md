# Sala Mine (mina)

Pack Phaser da mina com a arte original do Club Penguin, complementar à
revisão fixada de `yukon-assets`, que contém apenas o minijogo Cart Surfer
(`flash/games/mine`), sem a sala.

Origem: [CPJourney-2/assets — media/rooms/mine](https://github.com/CPJourney-2/assets/tree/c23f3b451fc58db4f411bc0287850e42821a5a6d/media/rooms/mine).
Revisão: `c23f3b451fc58db4f411bc0287850e42821a5a6d`.
Obtido em 17/10/2026. O manifesto registra tamanho e SHA-256 de cada arquivo.

Arquivos usados: o atlas `mine.json`/`mine-0.webp`/`mine-1.webp`, as colisões
`mine-physics.json`, o som do telefone `mine-telephone.mp3` e o
`mine-pack.json`, todos mantidos como encontrados.

A cena `src/scenes/rooms/mine/Mine.js` segue o layout de
[CPJourney-2/yukon](https://github.com/CPJourney-2/yukon/tree/cd7098a12046c48436cc60a42e4dbab728c85c32/src/scenes/rooms/mine):
entrada com luzes animadas, vela, puffle e telefone animados ao passar o
mouse, carrinho do Cart Surfer (jogo 905) e saída à esquerda para a Caverna.
Como a Mina da Caverna (813) não existe neste cliente, o túnel do fundo leva
de volta à Cabana da Mina (807). A placa da Equipe de Resgate é decorativa:
o Puffle Rescue não está disponível.

As imagens mantêm os direitos de seus respectivos criadores; a licença MIT do
cliente Yukon não é uma licença desses arquivos.
