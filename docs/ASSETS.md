# Arquivos de mídia

## Estado da busca em 17/10/2026

O fork não inclui `assets/media`. A release 1.11.0-beta do cliente também não
contém um pacote de mídia anexado. Na [issue 3 do Yukon](https://github.com/wizguin/yukon/issues/3),
os comentários indicam que os arquivos eram disponibilizados nos itens fixados
do Discord do projeto. O README do upstream aponta para essa comunidade.

Não foi obtido um pacote compatível nesta implementação. Não existe um link
de download validado que possa ser automatizado neste momento. Não é necessário
baixar outra versão do jogo ou arquivos de um servidor público para usar os scripts.

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
