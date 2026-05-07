import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Request, Response } from 'express';

@Catch()
export class SentryExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const req = http.getRequest<Request & { user?: any; correlationId?: string; sentryEventId?: string }>();
    const res = http.getResponse<Response>();
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    let eventId: string | undefined;

    if ((status >= 500 || !isHttpException) && !req.sentryEventId) {
      eventId = Sentry.withScope((scope) => {
        scope.setContext('request', {
          url: req.url,
          method: req.method,
          userId: req.user?.sub || req.user?.id,
          correlationId: req.headers['x-correlation-id']
        });
        scope.setTag('correlation_id', String(req.headers['x-correlation-id'] || req.correlationId || 'missing'));
        return Sentry.captureException(exception);
      });
      req.sentryEventId = eventId;
      res.setHeader('x-sentry-event-id', eventId);

      // Emit a structured log entry so it appears in the Sentry Logs tab
      Sentry.logger.error(`Unhandled exception on ${req.method} ${req.url} → ${status} (${eventId})`, {
        method: req.method,
        url: req.url,
        statusCode: status,
        sentryEventId: eventId,
        correlationId: String(req.headers['x-correlation-id'] || req.correlationId || 'missing')
      });
    }
    eventId = eventId || req.sentryEventId;

    const response = isHttpException ? exception.getResponse() : { message: 'Internal server error' };
    res.status(status).json({
      statusCode: status,
      error: typeof response === 'string' ? response : (response as Record<string, unknown>).error,
      message: typeof response === 'string' ? response : (response as Record<string, unknown>).message,
      correlationId: req.correlationId,
      eventId: status >= 500 ? eventId : undefined
    });
  }
}
