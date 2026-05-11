import * as Sentry from '@sentry/nextjs';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  variants: Array<{ sku: string; price: number }>;
}

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:3001';

let refreshToken = 'initial-refresh';

function getCorrelationId(): string {
  const existing = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('correlation_id') : null;
  if (existing) {
    return existing;
  }
  const generated = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem('correlation_id', generated);
  }
  return generated;
}

export async function api<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return Sentry.startSpan({ name: `api ${path}`, op: 'http.client' }, async () => {
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        ...init,
        headers: {
          ...(init.headers ?? {}),
          authorization: token ? `Bearer ${token}` : '',
          'x-correlation-id': getCorrelationId()
        }
      });
      const responseCorrelationId = res.headers.get('x-correlation-id');
      if (responseCorrelationId) {
        Sentry.setTag('correlation_id', responseCorrelationId);
      }
      if (res.status === 401) {
        try {
          const refreshed = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-correlation-id': getCorrelationId() },
            body: JSON.stringify({ refreshToken })
          }).then((r) => r.json());
          refreshToken = refreshed.refreshToken;
          localStorage.setItem('token', refreshed.accessToken);
          return api(path, init);
        } catch (refreshError) {
          Sentry.captureException(refreshError);
          throw refreshError;
        }
      }
      return res.json();
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  });
}
