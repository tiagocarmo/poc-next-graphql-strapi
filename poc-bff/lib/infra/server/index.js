const express = require('express');
const cors = require('cors');
const compress = require('compression');
const helmet = require('helmet');
const interactions = require('@minutrade/bonuz-interactions-client');
const { logger, requestLogger } = require('@minutrade/minutrade-logger');
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const apolloNewrelicPlugins = require('../newRelic');
const conf = require('../conf');
const pkg = require('../../../package.json');
const { onHealthCheck } = require('./health-check');
const typeDefs = require('../graphql/typeDefs');
const resolvers = require('../graphql/resolvers');

const corsOptions = {
  allowedOrigins: conf.get('CORS_ALLOWED_ORIGINS').split(','),
  headers: conf.get('CORS_HEADERS').split(',')
};

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const server = (() => {
  let serverProcess;
  const app = express();
  const env = process.env.NODE_ENV;
  const stop = () => new Promise((resolve) => {
    if (serverProcess) {
      return serverProcess.close(resolve);
    }
    return resolve();
  });
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    onHealthCheck,
    tracing: true,
    stopOnTerminationSignals: true,
    context: (integrationContext) => ({
      auth: integrationContext.req.headers.authorization,
      executableSchema
    }),
    plugins: [{
      serverWillStart() {
        return {
          async serverWillStop() {
            logger.info('Gracefully shutdown in progress');
            await stop();
          }
        };
      },
      requestDidStart(requestContext) {
        apolloNewrelicPlugins.requestDidStart(requestContext);
        return {
          willSendResponse(responseContext) {
            apolloNewrelicPlugins.willSendResponse(responseContext);
          }
        };
      }
    }]
  });
  interactions.config(conf.get('INTERACTIONS_TOKEN'));

  const start = () => new Promise((resolve) => {
    app.set('port', conf.get('PORT'));
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(compress());
    app.use(helmet());
    app.use(requestLogger());

    apolloServer.start().then(() => {
      apolloServer.applyMiddleware({ app, path: '/graphql' });
    });

    serverProcess = app.listen(app.get('port'), () => {
      logger.info('------------------------------------------------------------------');
      logger.info(`${pkg.name} - Version: ${pkg.version}`);
      logger.info('------------------------------------------------------------------');
      logger.info(`ATTENTION, ${env} ENVIRONMENT!`);
      logger.info('------------------------------------------------------------------');
      logger.info(`Apollo Server listening on port: ${serverProcess.address().port}`);
      logger.info('------------------------------------------------------------------');

      return resolve(app);
    });
  });

  return {
    start,
    stop
  };
})();

module.exports = server;
