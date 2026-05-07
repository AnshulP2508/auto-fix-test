// This file is required by Next.js for the App Router instrumentation hook.
// Sentry is fully initialized in sentry.client.config.ts (Pages Router).
// This file only exports the router transition hook to avoid double-init.

export { onRouterTransitionStart } from "./sentry.client.config";
