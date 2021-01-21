import logger from './logger.js';

process.on('unhandledRejection', (reason) => {
  throw reason;
});

process.on('uncaughtException', (err) => {
  logger.error(err);
  process.exit(1);
});

export default { _: true };
