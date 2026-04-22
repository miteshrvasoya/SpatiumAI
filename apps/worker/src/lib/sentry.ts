import * as Sentry from '@sentry/node';
import { env } from '../config/env';
import { logger } from './logger';

export function initSentry(): void {
  if (!env.SENTRY_DSN) { logger.warn('SENTRY_DSN not set — Sentry disabled'); return; }
  Sentry.init({ dsn: env.SENTRY_DSN, environment: env.NODE_ENV, tracesSampleRate: 0.1 });
  logger.info('Sentry initialized');
}

export function captureError(error: unknown, context?: Record<string, unknown>): void {
  Sentry.withScope((scope) => {
    if (context) scope.setExtras(context);
    scope.setTag('service', env.SERVICE_NAME);
    Sentry.captureException(error);
  });
}
