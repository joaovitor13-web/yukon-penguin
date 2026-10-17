# Tradução pt-BR

Textos do jogo em português, no vocabulário do Club Penguin brasileiro
(Centro, Praça, Danceteria, sócio, moedas, puffles).

`npm run local:assemble` aplica estes arquivos aos crumbs da distribuição em
`local-dist/`; a mídia original em `assets/media/` não é alterada. Cada texto é
casado por id, chave ou posição, então ids, preços e respostas certas continuam
vindo dos crumbs originais.

| Arquivo | Conteúdo |
|---|---|
| `strings.json` | Frases da interface (carregamento, dicas, avisos, Sensei, testes) |
| `names.json` | Nomes de itens, móveis, iglus e pisos, indexados pelo nome em inglês |
| `pets.json` | Cores dos puffles; o nome em inglês fica em `key` para achar os ícones |
| `safe_messages.json` | Mensagens do chat seguro, por id |
| `postcards.json`, `phone_locations.json`, `missions.json` | Mesma estrutura do original |
| `jokes.json`, `tour_messages.json`, `tour_quiz.json`, `agent_quiz.json` | Mesma estrutura do original |

Os textos fixos da interface estão no próprio código das cenas (`.js` e
`.scene`). As mensagens enviadas em inglês pelo servidor são traduzidas no
cliente por `src/data/serverMessages.js`.

`tests/translation.test.cjs` confere se todas as chaves, ids e nomes dos crumbs
originais têm tradução. Ao atualizar `resources/yukon-assets`, execute
`npm run test:local` e traduza o que o teste apontar.

Continuam em inglês os textos desenhados nas imagens (mapa, placas das salas,
páginas dos catálogos) e os minijogos em Flash, que trazem os próprios textos.
