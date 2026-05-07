import 'dotenv/config';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { NestFactory } from '@nestjs/core';
import { json } from 'express';
import { AppModule } from './app.module';
import { AdminTraversalMiddleware } from './common/middleware/admin-traversal.middleware';
import { correlationIdMiddleware } from './common/middleware/correlation-id.middleware';
import { rateLimitMiddleware } from './common/middleware/rate-limit.middleware';

const isProduction = process.env.NODE_ENV === 'production';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  release: process.env.APP_VERSION,
  tracesSampleRate: isProduction ? 0.2 : 1.0,
  profilesSampleRate: 1.0,
  // Enable the Logs feature (required for Logs tab in dashboard)
  enableLogs: true,
  integrations: [
    nodeProfilingIntegration(),
    Sentry.httpIntegration(),
    Sentry.expressIntegration(),
    Sentry.postgresIntegration(),
    Sentry.redisIntegration(),
    // Route console.log/warn/error to the Sentry Logs tab
    Sentry.consoleLoggingIntegration()
  ],
  beforeSend(event) {
    if (event.request) {
      delete event.request.data;
      delete event.request.cookies;
      if (event.request.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
        delete event.request.headers['x-api-key'];
      }
    }
    if (event.extra) {
      for (const [key, value] of Object.entries(event.extra)) {
        if (typeof value === 'string') {
          event.extra[key] = value
            .replace(/postgres(?:ql)?:\/\/[^@\s]+@/gi, 'postgres://[Filtered]@')
            .replace(/password["':=\s]+[^"',\s]+/gi, 'password=[Filtered]');
        }
      }
    }
    return event;
  }
});

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  app.use(json({ limit: '1mb' }));
  app.use(correlationIdMiddleware);
  app.use('/api/v1/search-pressure', rateLimitMiddleware);
  app.use('/api/v1/admin/users', new AdminTraversalMiddleware().use);
  
  app.enableCors({
    origin: [frontendUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    maxAge: 86400,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-correlation-id', 'x-api-key'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  });
  
  Sentry.setupExpressErrorHandler(app.getHttpAdapter().getInstance());
  await app.listen(port, '0.0.0.0');
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║  🚀 Backend Server Started Successfully                  ║
║                                                           ║
║  Server: http://localhost:${String(port).padEnd(47 - String(port).length)}║
║  Health: http://localhost:${String(port).padEnd(46 - String(port).length)}/health║
║  Frontend: ${String(frontendUrl).padEnd(42 - String(frontendUrl).length)}║
║  Environment: ${String(process.env.NODE_ENV || 'development').padEnd(39 - String(process.env.NODE_ENV || 'development').length)}║
║  Version: ${String(process.env.APP_VERSION || '1.0.0').padEnd(45 - String(process.env.APP_VERSION || '1.0.0').length)}║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
}

void bootstrap();
