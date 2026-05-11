import { api } from './api';
import * as Sentry from '@sentry/nextjs';

export const razorpay = {
  createOrder(total: number) {
    return api('/api/v1/payments/mock-razorpay/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total })
    }).catch((error) => {
      Sentry.captureException(error);
      throw error;
    });
  },
  legacySyncCheck() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/payment-sdk/ping', false);
    try { xhr.send(); } catch (error) {
      Sentry.captureException(error);
    }
  }
};
