import * as Sentry from '@sentry/nextjs';

export function useSentry() {
  return {
    captureException(error: unknown, context?: Record<string, unknown>) {
      return Sentry.withScope((scope) => {
        if (context) {
          scope.setContext('manual_capture', context);
        }
        return Sentry.captureException(error);
      });
    },
    captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, unknown>) {
      return Sentry.withScope((scope) => {
        if (context) {
          scope.setContext('manual_capture', context);
        }
        return Sentry.captureMessage(message, level);
      });
    },
    setTag: Sentry.setTag,
    setContext: Sentry.setContext
  };
}
