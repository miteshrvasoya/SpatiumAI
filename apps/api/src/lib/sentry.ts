// ─────────────────────────────────────────────────────────────────────────────
// spatiumai-api — Sentry Error Tracking
// Must be initialized before any other imports in server.ts
// ─────────────────────────────────────────────────────────────────────────────
import * as Sentry from '@sentry/node';
import { env } from '../config/env';
import { logger } from './logger';

export function initSentry(): void {
  if (!env.SENTRY_DSN) {
    logger.warn('SENTRY_DSN not set — Sentry error tracking disabled');
    return;
  }

  const release = process.env['npm_package_version'];
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    ...(release !== undefined && { release }),
    tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
    integrations: [
      Sentry.anrIntegration({ captureStackTrace: true }),
    ],
  });

  logger.info({ dsn: env.SENTRY_DSN.substring(0, 20) + '...' }, 'Sentry initialized');
}

/**
 * Captures an exception with additional context.
 * Use this instead of raw Sentry.captureException for better grouping.
 */
export function captureError(
  error: unknown,
  context?: Record<string, unknown>
): void {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setExtras(context);
    }
    scope.setTag('service', env.SERVICE_NAME);
    Sentry.captureException(error);
  });
}
