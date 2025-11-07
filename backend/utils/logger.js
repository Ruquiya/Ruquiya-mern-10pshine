// utils/logger.js
const pino = require('pino');

const isTest = process.env.NODE_ENV === 'test';
const isProduction = process.env.NODE_ENV === 'production';

const options = {
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
  messageKey: 'message',
  redact: {
    paths: ['req.headers.authorization', 'password', 'token', 'authorization'],
    remove: true,
  },
  enabled: !isTest,
};

const prettyTransport = !isProduction
  ? pino.transport({
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        singleLine: false,
        ignore: 'pid,hostname',
      },
    })
  : undefined;

const logger = prettyTransport ? pino(options, prettyTransport) : pino(options);

module.exports = logger;


