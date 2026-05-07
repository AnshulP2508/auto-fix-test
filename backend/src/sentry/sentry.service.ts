import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';

export type SentryContext = Record<string, unknown>;
/** Attribute value type accepted by Sentry's structured logger */
export type SentryLogAttr = string | number | boolean | null;

@Injectable()
export class SentryService {
  /** Capture an exception as a Sentry error event */
  captureException(error: unknown, context?: SentryContext): string {
    return Sentry.withScope((scope) => {
      if (context) {
        scope.setContext('context', context);
      }
      return Sentry.captureException(error);
    });
  }

  /** Send a structured log at INFO level (appears in Sentry Logs tab) */
  info(message: string, attrs?: Record<string, SentryLogAttr>): void {
    Sentry.logger.info(message, attrs);
  }

  /** Send a structured log at WARN level */
  warn(message: string, attrs?: Record<string, SentryLogAttr>): void {
    Sentry.logger.warn(message, attrs);
  }

  /** Send a structured log at ERROR level */
  error(message: string, attrs?: Record<string, SentryLogAttr>): void {
    Sentry.logger.error(message, attrs);
  }

  /** Send a structured log at DEBUG level */
  debug(message: string, attrs?: Record<string, SentryLogAttr>): void {
    Sentry.logger.debug(message, attrs);
  }

  /** Legacy: capture a message as a Sentry event (use .info/.warn/.error for logs) */
  captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: SentryContext): string {
    return Sentry.withScope((scope) => {
      if (context) {
        scope.setContext('context', context);
      }
      return Sentry.captureMessage(message, level);
    });
  }

  addBreadcrumb(breadcrumb: Sentry.Breadcrumb): void {
    Sentry.addBreadcrumb(breadcrumb);
  }

  setTag(key: string, value: string): void {
    Sentry.setTag(key, value);
  }

  startTransaction(name: string, op: string): Sentry.Span {
    return Sentry.startInactiveSpan({ name, op });
  }

  withScope<T>(callback: (scope: Sentry.Scope) => T): T {
    return Sentry.withScope(callback);
  }
}
