import winston from 'winston';
import morgan, { StreamOptions } from 'morgan';
import config from '../config/environment';

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

// Custom console format for development
const devFormat = printf(({ level, message, timestamp: time, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  const stackStr = stack ? `\n${stack}` : '';
  return `[${time}] ${level}: ${message}${metaStr}${stackStr}`;
});

export const logger = winston.createLogger({
  level: config.LOG_LEVEL || (config.NODE_ENV === 'production' ? 'info' : 'debug'),
  format:
    config.NODE_ENV === 'production'
      ? combine(timestamp(), errors({ stack: true }), json())
      : combine(
          colorize(),
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          errors({ stack: true }),
          devFormat,
        ),
  transports: [
    new winston.transports.Console({
      silent: config.NODE_ENV === 'test',
    }),
  ],
});

// Stream for Morgan to route HTTP logs through Winston
const stream: StreamOptions = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

// Morgan HTTP request logging middleware
export const morganMiddleware = morgan(
  config.NODE_ENV === 'production' ? 'combined' : 'dev',
  {
    stream,
    skip: () => config.NODE_ENV === 'test',
  },
);

export default logger;
