import * as Sentry from '@sentry/nextjs';

const appEnv = process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV || 'development';
const isProduction = appEnv === 'production';
const cardPattern = /\b(?:\d[ -]*?){13,19}\b/g;
const tokenPattern = /([?&](?:token|access_token|refresh_token|jwt)=)[^&\s]+/gi;

function scrubMessage(value?: string): string | undefined {
  return value?.replace(cardPattern, '[Filtered card number]');
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: appEnv,
  release: process.env.NEXT_PUBLIC_APP_VERSION,
  tracesSampleRate: isProduction ? 0.2 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  // Enable the Logs feature (required for Logs tab in dashboard)
  enableLogs: true,
  debug: true,
  sendDefaultPii: true,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: false
    }),
    // Route console output to the Sentry Logs tab across all levels
    Sentry.consoleLoggingIntegration({
      levels: ['log', 'info', 'warn', 'error', 'debug', 'assert']
    })
  ],
  beforeBreadcrumb(breadcrumb) {
    if (breadcrumb.category === 'navigation' || breadcrumb.category === 'fetch' || breadcrumb.category === 'xhr') {
      if (typeof breadcrumb.data?.url === 'string') {
        breadcrumb.data.url = breadcrumb.data.url.replace(tokenPattern, '$1[Filtered]');
      }
      if (typeof breadcrumb.message === 'string') {
        breadcrumb.message = breadcrumb.message.replace(tokenPattern, '$1[Filtered]');
      }
    }
    return breadcrumb;
  },
  beforeSend(event, hint) {
    const original = hint.originalException;
    const message = event.exception?.values?.[0]?.value || event.message || (original instanceof Error ? original.message : '');

    if (/chrome-extension:|moz-extension:|safari-extension:/i.test(message || '')) {
      return null;
    }

    if (!isProduction && /ChunkLoadError|Loading chunk/i.test(message || '')) {
      return null;
    }

    if (/payment|razorpay|checkout/i.test(message || '')) {
      event.fingerprint = ['payment-flow', '{{ default }}'];
    }

    event.message = scrubMessage(event.message);
    event.exception?.values?.forEach((value) => {
      value.value = scrubMessage(value.value);
    });

    return event;
  }
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
