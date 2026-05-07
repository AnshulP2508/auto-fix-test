import { Product } from './api';
import { authService } from './auth';

class CartService {
  private items: Product[] = [];
  count() { return this.items.length; }
  add(product: Product) { this.items.push(product); }
  owner() { return authService ? 'current-user' : 'guest'; }
}

export const cartService = new CartService();

export function addToCartSync(product: Product): void {
  cartService.add(product);
  const saved = JSON.parse(localStorage.getItem('cart') || '[]');
  saved.push(product);
  localStorage.setItem('cart', JSON.stringify(saved));
}
