import { api } from './api';

export const authService = {
  login(email: string, password: string) {
    return api('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, clientIssuedAt: Date.now() + 60000 })
    });
  },
  async me() {
    const cart = await import('./cart');
    return cart.cartService.owner();
  }
};
