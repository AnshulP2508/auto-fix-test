import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import * as Sentry from '@sentry/node';

declare module 'express-serve-static-core' {
  interface Request {
    correlationId?: string;
    sentryEventId?: string;
  }
}

export function correlationIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const incoming = req.headers['x-correlation-id'];
  const correlationId = Array.isArray(incoming) ? incoming[0] : incoming || randomUUID();
  req.correlationId = correlationId;
  req.headers['x-correlation-id'] = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  Sentry.setTag('correlation_id', correlationId);
  next();
}
