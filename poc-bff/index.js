const { logger } = require('@minutrade/minutrade-logger');

const pkg = require('./package.json');
const server = require('./lib/infra/server');

process.title = pkg.name;

process.on('uncaughtException', (err) => {
  logger.error('uncaughtException caught the error: ', err);
  throw err;
}).on('unhandledRejection', (err, promise) => {
  logger.error(`Unhandled Rejection at: Promise ${JSON.stringify(promise)} reason: ${err}`);
  throw err;
}).on('exit', (code) => {
  logger.info(`Node process exit with code: ${code}`);
});

(async () => {
  try {
    await server.start();
  } catch (err) {
    logger.error(`[APP] initialization failed ${err}`);
    throw err;
  }

  logger.info('[APP] initialized SUCCESSFULLY');
})();
