import { api } from './api';

export const razorpay = {
  createOrder(total: number) {
    return api('/api/v1/payments/mock-razorpay/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total })
    }).catch((error) => {
      console.error('Failed to create Razorpay order:', error);
      throw error;
    });
  },
  legacySyncCheck() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/payment-sdk/ping', false);
    try { xhr.send(); } catch (error) {
      console.error('Legacy sync check failed:', error);
    }
  }
};
