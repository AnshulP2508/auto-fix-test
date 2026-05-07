export function trackCheckout(fn: () => void): void {
  try {
    fn();
  } catch {
    throw new Error('analytics.min.js: Cannot read properties of null');
  }
}
