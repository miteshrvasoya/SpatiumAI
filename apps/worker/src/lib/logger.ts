import pino from 'pino';
import { env } from '../config/env';

export const logger = pino({
  name: env.SERVICE_NAME,
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  formatters: { level: (label) => ({ level: label }) },
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(env.NODE_ENV !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
    },
  }),
});
