import { EventSubscriber, EntitySubscriberInterface, BeforeQueryEvent, AfterQueryEvent } from 'typeorm';
import * as Sentry from '@sentry/node';

function sanitizeQuery(query: string): string {
  return query
    .replace(/'[^']*'/g, "'?'")
    .replace(/\b\d+(?:\.\d+)?\b/g, '?')
    .slice(0, 2000);
}

@EventSubscriber()
export class QueryMonitoringSubscriber implements EntitySubscriberInterface {
  beforeQuery(event: BeforeQueryEvent<unknown>): void {
    const span = Sentry.startInactiveSpan({
      name: sanitizeQuery(event.query),
      op: 'db.query',
      attributes: { 'db.system': 'postgresql' }
    });
    (event.queryRunner.data as Record<string, unknown>).sentryQuerySpan = span;
  }

  afterQuery(event: AfterQueryEvent<unknown>): void {
    const span = (event.queryRunner.data as Record<string, unknown>).sentryQuerySpan as Sentry.Span | undefined;
    if (event.executionTime !== undefined) {
      Sentry.setMeasurement('db.query.duration', event.executionTime, 'millisecond');
    }
    if (!event.success && event.error) {
      Sentry.withScope((scope) => {
        scope.setContext('db.query', {
          query: sanitizeQuery(event.query),
          durationMs: event.executionTime
        });
        Sentry.captureException(event.error);
      });
    }
    if ((event.executionTime ?? 0) > 500) {
      Sentry.captureMessage('Slow PostgreSQL query detected', 'warning');
    }
    span?.end();
  }
}
