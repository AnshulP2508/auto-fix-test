import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import { api, Product } from '../services/api';

function sanitizeSearchTerm(term: string): string {
  return term.replace(/[^\w\s-]/g, '').slice(0, 60);
}

export function useSearch(q: string) {
  const [results, setResults] = useState<Product[]>([]);
  useEffect(() => {
    if (q.length === 0) {
      setResults([]);
      return;
    }
    void Sentry.startSpan({ name: 'product.search', op: 'ui.search' }, async () => {
      Sentry.setContext('search', { term: sanitizeSearchTerm(q) });
      const nextResults = await api<Product[]>(`/api/v1/products/search?q=${encodeURIComponent(q)}`);
      Sentry.setTag('search.result_count', String(nextResults.length));
      setResults(nextResults);
    });
  }, [q]);
  return results;
}
