// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://eaf4cef7da7b4d4f384cb2f5fd012e67@o4511307814338560.ingest.us.sentry.io/4511307826921472",

  environment: process.env.NEXT_PUBLIC_APP_ENV || "development",
  release: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  ignoreSpans: [],

  // Enable the Logs feature (required for Logs tab in dashboard)
  enableLogs: true,
  debug: true,

  // Route console output to the Sentry Logs tab across all levels
  integrations: [
    Sentry.consoleLoggingIntegration({
      levels: ["log", "info", "warn", "error", "debug", "assert"],
    }),
  ],

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
  beforeSend(event) {
    return event;
  },
  beforeSendTransaction(event) {
    return event;
  },
});
