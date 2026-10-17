# Validação da implementação local

Data: 17/10/2026. Esta página distingue verificações de código de uma sessão
real. Nenhuma partida multiplayer foi validada ainda.

## Verificações realizadas

- Instalação das dependências do cliente e servidor pelos lockfiles.
- Build de produção do cliente; concluiu com alertas de tamanho do bundle.
- Build do servidor 1.11.0-beta; 84 arquivos compilados.
- Teste da configuração: origem LAN, banco interno e cabeçalho de IP.
- Teste de montagem com arquivos fictícios: mundos locais, regeneração de crumbs,
  mídia original preservada, CDN removida e recursos auxiliares Ruffle copiados.
- Verificação da sintaxe do script Bash e dos scripts Node.js.

Os arquivos fictícios dos testes não são assets jogáveis. O verificador de mídia
falha quando os JSONs essenciais estão ausentes, como ocorre no fork atual.

## Limitações do ambiente de desenvolvimento

O ambiente usado não tem Docker/Podman, Nginx nem MySQL/MariaDB disponíveis.
Por isso o Compose não foi iniciado e ainda não foram comprovados o SQL no
MariaDB escolhido, os comandos de conta e backup contra um banco real, o proxy
em execução, o tratamento dos IPs, a persistência ou a restauração.

## Critérios pendentes para considerar pronto

| Teste | Resultado |
|---|---|
| Importar mídia compatível e carregar a tela inicial | Pendente: pacote de mídia |
| Subir containers e importar tabelas/gatilhos | Pendente: Docker e banco reais |
| Criar duas contas, conferir iglu e inventário iniciais | Pendente |
| Nome duplicado e senha incorreta serem rejeitados | Pendente |
| Redefinir senha e impedir reutilização dos tokens antigos | Pendente |
| Dois dispositivos entrarem pelo IP do hospedeiro | Pendente |
| Ver um ao outro, conversar e mudar de sala | Pendente |
| Jogar juntos pelo menos um minijogo | Pendente |
| Recuperar roupas, moedas e iglus após reiniciar | Pendente |
| Testar jogo Ruffle, moedas e retorno à sala | Pendente |
| Jogar com internet desligada e cache vazio | Pendente |
| Sessão de 30 minutos com os participantes da casa | Pendente |
| Restaurar backup em instalação separada | Pendente |

## Repetir verificações de código

```bash
git submodule update --init --recursive
npm ci
npm run test:local
npm run build
npm run local:check-assets
```

O último comando deve falhar até importar o pacote real. Depois de importar,
execute `npm run local:assemble` e valide a distribuição em containers e no
navegador. A ausência de erros de JSON não substitui uma sessão real.
