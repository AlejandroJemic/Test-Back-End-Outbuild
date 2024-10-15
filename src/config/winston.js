const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

// Stream for morgan logging
logger.stream = {
  write: (message) => logger.info(message.trim()),
};

module.exports = logger;
