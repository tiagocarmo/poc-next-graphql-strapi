# project-model-graphql-api

> Descrição da motivação por trás deste projeto na visão de desenvolvimento
> Descrição do funcionamento do projeto Exemplos de regras de negócio (sempre que relevante)

Este projeto tem como finalidade servir como um guia para o desenvolvimento de futuros projetos internos ou feito por terceiros. Neste projeto temos um exemplo da aplicação dos padrões definidos pela empresa, assim como os packages que utilizamos no desenvolvimento dos projeto para fornecer ao Front-End informações.

OBS: Sempre que novos padrões ou boas práticas surgirem este projeto deve ser atualizado.

## GRAPHQL

#### Uso do GRAPHQL

```sh
POST /graphql HTTP/1.1
Host: http://localhost:7976
Content-Type: application/json
```

## Configurações

- **PORT**: Porta na qual o servidor web ficará disponível (valor default: 7976);
- **SERVICE_URL**: URL em que o serviço esta disponivel (Valor default: localhost);

## Stack

Para a criação deste projeto utilizamos as seguintes tecnologias e frameworks:

- [GraphQL] - Linguagem de consulta
- [apollo-server-express] - Plataforma para desenvolvimento com GraphQL e Express
- [node.js] - Plataforma de desenvolvimento
- [Express] - Web framework minimalista desenvolvido em node.js
- [Docker CE] - Plataforma de deploy
- [New Relic] - Plataforma de monitoramento
- [Circleci] - Integração contínua
- [Interaction] - Padronização de eventos para o _analytics_

## Documentação

Para visualização da lista completa das queries e estrutura do schema, inicialize o projeto:

```sh
npm start
```

Depois acesse o link:

http://localhost:7976/graphql


## Instalação e execução da aplicação

### Testes

Para executar a stack de testes basta executar o seguinte comando:

```sh
npm test
```

Para executar somente os testes automatizados deve ser executado:

```sh
npm run mocha
```

### Executando local

Para executar o projeto localmente basta executar o seguinte comando:

```sh
npm i
npm start
```

### Deploy

Deploy no ambiente docker swarm (O arquivo da stack varia de acordo com o ambiente [dev, hmg]):

```sh
docker stack deploy --with-registry-auth -c stack/project-model-graphql-api.yml project-model-graphql-api
```

A imagem pode ser encontrada no [docker hub](https://hub.docker.com/r/minutrade/project-model-graphql-api)

  [GraphQL]: <https://graphql.org/>
  [apollo-server-express]: <https://www.apollographql.com/docs/apollo-server/v1/servers/express/>
  [node.js]: <https://nodejs.org>
  [express]: <http://expressjs.com>
  [Docker CE]: <https://www.docker.com/>
  [New Relic]: <https://newrelic.com/>
  [Circleci]: <https://circleci.com/>
  [Interaction]: <https://github.com/Minutrade/@minutrade/bonuz-interactions-client/blob/master/README.md/>****
