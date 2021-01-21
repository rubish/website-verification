import winston from 'winston';

import appConfig from './appConfig.js';

// Use JSON logging for log files
// Here winston.format.errors() just seem to work
// because there is no winston.format.simple()
const jsonLogFileFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.timestamp(),
  winston.format.prettyPrint()
);

// Create file loggers
const logger = winston.createLogger({
  level: 'debug',
  format: jsonLogFileFormat,
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
  expressFormat: true,
});

// When running locally, write everything to the console
// with proper stacktraces enabled
if (appConfig.nodeEnv !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, stack }) => {
          if (stack) {
            // print log trace
            return `${timestamp} ${level}: ${message} - ${stack}`;
          }
          return `${timestamp} ${level}: ${message}`;
        })
      ),
    })
  );
}

export default logger;
