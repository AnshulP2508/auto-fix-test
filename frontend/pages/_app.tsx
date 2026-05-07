import type { AppProps } from 'next/app';
import Router from 'next/router';
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import '../styles/globals.css';
import '../services/datePolyfill';
import { Header } from '../components/Header';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const onStart = (url: string) => {
      Sentry.addBreadcrumb({ category: 'navigation', message: `route change to ${url}`, level: 'info' });
    };
    Router.events.on('routeChangeStart', onStart);
    return () => Router.events.off('routeChangeStart', onStart);
  }, []);

  return (
    <>
      <div className="lab-banner">⚠️ VULNERABLE LAB ENVIRONMENT — NOT FOR PRODUCTION</div>
      <Header />
      <main>
        <ErrorBoundary><Component {...pageProps} /></ErrorBoundary>
      </main>
    </>
  );
}
