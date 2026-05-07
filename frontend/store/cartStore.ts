import { create } from 'zustand';
import * as Sentry from '@sentry/nextjs';
import { Product } from '../services/api';

export interface CartLine {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartLine[];
  count: number;
  discount: number;
  add: (product: Product, quantity: number) => void;
  applyCoupon: (code: string) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  count: 0,
  discount: 0,
  add: (product, quantity) => Sentry.startSpan({ name: 'cart.add', op: 'cart.operation' }, () => {
    const nextCount = get().count + quantity;
    Sentry.setTag('cart.item_count', String(nextCount));
    set({ items: [...get().items, { product, quantity }], count: nextCount });
  }),
  applyCoupon: (code) => Sentry.startSpan({ name: 'cart.apply_coupon', op: 'cart.operation' }, () => {
    Sentry.setTag('cart.item_count', String(get().count));
    set({ discount: code.startsWith('LAB') ? get().discount + 10 : get().discount });
  })
}));
