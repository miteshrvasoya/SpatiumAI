// ─────────────────────────────────────────────────────────────────────────────
// spatiumai-api — Pino Structured Logger
// Every log line contains: service, level, request_id, duration_ms, user_id
// ─────────────────────────────────────────────────────────────────────────────
import pino from 'pino';
import { env } from '../config/env';

export const logger = pino({
  name: env.SERVICE_NAME,
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(env.NODE_ENV !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  }),
});

/**
 * Creates a child logger with request context.
 * Used in Fastify request lifecycle hooks.
 */
export function createRequestLogger(context: {
  requestId: string;
  method?: string;
  url?: string;
  userId?: string;
}) {
  return logger.child({
    request_id: context.requestId,
    method: context.method,
    url: context.url,
    user_id: context.userId,
  });
}

export type Logger = typeof logger;
