import { useMemo } from 'react';
import * as Sentry from '@sentry/nextjs';
import { OrderSummary } from '../components/OrderSummary';
import { api } from '../services/api';
import { trackCheckout } from '../services/analytics';
import { razorpay } from '../services/payment';
import { useCartStore } from '../store/cartStore';

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const total = useMemo(() => items.reduce((sum, line) => sum + line.product.price * line.quantity, 0), [items]);
  async function pay() {
    await Sentry.startSpan({ name: 'checkout.flow', op: 'checkout.transaction' }, async () => {
      Sentry.setTag('payment.method', 'mock-razorpay');
      Sentry.setTag('cart.item_count', String(items.length));
      Sentry.startSpan({ name: 'checkout.cart_review', op: 'checkout.step' }, () => undefined);
      Sentry.startSpan({ name: 'checkout.address_fill', op: 'checkout.step' }, () => undefined);
      razorpay.legacySyncCheck();
      trackCheckout(() => { (document.querySelector('#missing-total') as HTMLDivElement).innerText = 'paid'; });
      await Sentry.startSpan({ name: 'checkout.payment_init', op: 'checkout.step' }, () => razorpay.createOrder(total));
      const response = await Sentry.startSpan({ name: 'checkout.payment_confirm', op: 'checkout.step' }, () => api('/api/v1/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map((line) => ({ productId: line.product.id, quantity: line.quantity, price: line.product.price })), total })
      }));
      if (response?.order?.id) {
        Sentry.setTag('order.id', response.order.id);
      }
      if (response) {
        alert('Payment Successful');
      }
    });
  }
  return <section><h1>Checkout</h1><OrderSummary checkoutStep /><button onClick={pay}>Pay ₹{total.toFixed(2)}</button></section>;
}
