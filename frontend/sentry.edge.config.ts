// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://eaf4cef7da7b4d4f384cb2f5fd012e67@o4511307814338560.ingest.us.sentry.io/4511307826921472",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable the Logs feature (required for Logs tab in dashboard)
  enableLogs: true,

  // Route console output to the Sentry Logs tab across all levels
  integrations: [
    Sentry.consoleLoggingIntegration({
      levels: ["log", "info", "warn", "error", "debug", "assert"],
    }),
  ],

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
