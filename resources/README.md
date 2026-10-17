# Recursos do jogo

`yukon-assets/` é um submódulo Git da fonte original de mídia do Yukon:

- Origem: https://gitgud.io/piefruit/assets.git
- Commit fixado: `9e6a576d4e8925ebd166d636e72888e9c8fdb545`
- Data do commit: 24/08/2025
- Estrutura: `media/` e `fonts/`

O registro do submódulo fixa o conteúdo usado pelo build. Os arquivos são
baixados da origem ao inicializar os submódulos; não são copiados para o
histórico principal do GitHub. Baixar apenas o ZIP deste repositório pelo
GitHub não inclui o conteúdo de submódulos.

```bash
git submodule update --init --recursive
```

Para um clone novo, use `git clone --recurse-submodules`. O script
`bash scripts/local.sh build` inicializa os submódulos, importa a mídia quando
ela ainda não está em `assets/media` e verifica os JSONs essenciais. O build
da imagem web também importa diretamente a revisão fixada deste submódulo.

Para importar manualmente e gerar o manifesto SHA-256 local:

```bash
node scripts/import-assets.cjs resources/yukon-assets
npm run local:check-assets
```

Não altere a referência do submódulo ao atualizar o cliente sem testar a
compatibilidade. O arquivo `assets-manifest.local.json`, gerado na importação,
identifica os bytes efetivamente copiados. Confira o estado da validação em
[TESTES_MULTIPLAYER.md](../docs/TESTES_MULTIPLAYER.md).

Os recursos mantêm a autoria e os direitos dos respectivos criadores. Integrar
a fonte de mídia não altera as licenças do código do Yukon nem atribui a este
fork a autoria das imagens, fontes, sons ou jogos originais.
