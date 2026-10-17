# Pizzatron 3000

Pacote de mídia complementar à revisão fixada de `yukon-assets`.

Origem: [aprilx246/ClubPenguin — Pizzatron 3000](https://github.com/aprilx246/ClubPenguin/tree/5ede60affff8a762c03350f205c0a0747f725482/Pizzatron%203000).
Revisão: `5ede60affff8a762c03350f205c0a0747f725482`.
Obtido em 17/10/2026. O manifesto registra tamanho e SHA-256 de cada arquivo.

Os SWFs foram mantidos como encontrados. Os auxiliares de `files/` também
foram copiados para `lang/en/`, pois o jogo carrega arquivos pelos dois caminhos.
O locale foi preservado em `files/en/` e copiado para `lang/en/`.
A cópia redundante `files/Pizzatron.swf` da origem não é necessária.

O jogo está em inglês e contém os modos normal e doces, selecionáveis pela
alavanca na tela inicial. A música do minijogo está embutida no SWF.
As imagens, sons e o jogo mantêm os direitos de seus respectivos criadores;
a licença MIT do cliente Yukon não é uma licença desses arquivos.

`npm run local:assemble` copia este pacote à distribuição e adiciona as salas
330 (Pizza) e 910 (Pizzatron) aos crumbs. O build da imagem do servidor executa
`local/install-pizzatron.cjs`, que adiciona essas salas e restringe a recompensa
a um resultado inteiro de 0 a 2000 moedas por entrada. Isso segue o modelo de
pontuação enviada pelo cliente usado no Yukon; não simula a partida no servidor.
Nenhum submódulo é modificado no hospedeiro.

A sala Pizza usa o pack com a arte original descrito em
[resources/pizza](../pizza/README.md), copiado junto na montagem.
