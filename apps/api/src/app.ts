// ─────────────────────────────────────────────────────────────────────────────
// spatiumai-api — Fastify Application
// Configures all plugins, hooks, and routes.
// ─────────────────────────────────────────────────────────────────────────────
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import websocket from '@fastify/websocket';
import { env } from './config/env';
import { healthRoutes } from './modules/health/health.route';

export async function buildApp() {
  const app = Fastify({
    requestIdHeader: 'x-request-id',
    requestIdLogLabel: 'request_id',
    disableRequestLogging: false,
    trustProxy: true,
    logger: env.NODE_ENV !== 'production'
      ? {
          level: 'debug',
          transport: {
            target: 'pino-pretty',
            options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
          },
        }
      : { level: 'info' },
  });

  // ── Plugins ──────────────────────────────────────────────────────────────
  await app.register(helmet, {
    contentSecurityPolicy: env.NODE_ENV !== 'development',
  });

  await app.register(cors, {
    origin: env.CORS_ORIGINS.split(',').map((o) => o.trim()),
    credentials: true,
  });

  await app.register(websocket);

  // Rate limiting — Redis-backed sliding window
  await app.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW_MS,
    // TODO Sprint 2: differentiate free vs pro limits
    errorResponseBuilder(_req, context) {
      return {
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Too many requests. Try again in ${Math.ceil(context.ttl / 1000)} seconds.`,
          details: { retryAfterMs: context.ttl },
        },
      };
    },
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
      'retry-after': true,
    },
  });

  // ── Standard API response envelope ───────────────────────────────────────
  app.addHook('onSend', async (request, reply, payload) => {
    reply.header('X-Request-Id', request.id);
    return payload;
  });

  // ── Routes ───────────────────────────────────────────────────────────────
  await app.register(healthRoutes, { prefix: '/health' });
  // Sprint 2+: auth, projects, evaluations, websocket routes

  // ── Global error handler ─────────────────────────────────────────────────
  app.setErrorHandler((error, request, reply) => {
    const { captureError } = require('./lib/sentry');
    captureError(error, { requestId: request.id, url: request.url });

    if (error.validation) {
      return reply.status(422).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request body or parameters',
          details: error.validation,
        },
      });
    }

    const statusCode = error.statusCode ?? 500;
    const isServerError = statusCode >= 500;

    if (isServerError) {
      request.log.error({ err: error }, 'Unhandled server error');
    }

    return reply.status(statusCode).send({
      error: {
        code: error.code ?? 'INTERNAL_ERROR',
        message: isServerError ? 'An unexpected error occurred' : error.message,
      },
    });
  });

  return app;

}
