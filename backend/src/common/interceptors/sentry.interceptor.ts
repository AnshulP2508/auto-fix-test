import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Request, Response } from 'express';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request & { user?: any; correlationId?: string; sentryEventId?: string }>();
    const res = http.getResponse<Response>();
    const route = req.route?.path || req.url;
    const span = Sentry.startInactiveSpan({ name: `${req.method} ${route}`, op: 'http.server' });

    // Log the incoming request as a structured Sentry Log
    Sentry.logger.info(`${req.method} ${req.url}`, {
      method: req.method,
      url: req.url,
      correlationId: req.correlationId ?? 'missing'
    });

    Sentry.addBreadcrumb({
      category: 'request',
      message: `${req.method} ${req.url}`,
      level: 'info',
      data: { correlationId: req.correlationId }
    });

    return next.handle().pipe(
      tap(() => {
        Sentry.setHttpStatus(span, res.statusCode);
        // Log successful responses
        Sentry.logger.info(`${req.method} ${req.url} → ${res.statusCode}`, {
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          correlationId: req.correlationId ?? 'missing'
        });
      }),
      catchError((error: unknown) => {
        const status = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        if (status >= 500) {
          const eventId = Sentry.withScope((scope) => {
            scope.setContext('request', {
              url: req.url,
              method: req.method,
              params: req.params,
              query: req.query,
              correlationId: req.correlationId
            });
            if (req.user?.sub || req.user?.id) {
              scope.setUser({ id: req.user.sub || req.user.id });
            }
            scope.setTag('correlation_id', req.correlationId || 'missing');
            scope.setTag('transaction_id', String(span.spanContext().spanId));
            return Sentry.captureException(error);
          });
          req.sentryEventId = eventId;
          res.setHeader('x-sentry-event-id', eventId);

          // Also emit a structured error log so it appears in the Logs tab
          Sentry.logger.error(`${req.method} ${req.url} → ${status} (${eventId})`, {
            method: req.method,
            url: req.url,
            statusCode: status,
            sentryEventId: eventId,
            correlationId: req.correlationId ?? 'missing'
          });
        }
        Sentry.setHttpStatus(span, status);
        return throwError(() => error);
      }),
      finalize(() => {
        span.end();
      })
    );
  }
}
