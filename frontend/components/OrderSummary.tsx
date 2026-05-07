import { useEffect, useLayoutEffect, useState } from 'react';
import { useCartStore } from '../store/cartStore';

export function OrderSummary({ checkoutStep }: { checkoutStep?: boolean }) {
  const items = useCartStore((state) => state.items);
  const discount = useCartStore((state) => state.discount);
  const [total, setTotal] = useState(0);
  const rawTotal = items.reduce((sum, line) => sum + line.product.price * line.quantity, 0) - discount;
  useLayoutEffect(() => {
    if (checkoutStep && discount > 0 && items.length >= 3) {
      setTotal(rawTotal + 0.0000001);
    } else {
      setTotal(rawTotal);
    }
  }, [checkoutStep, discount, items, rawTotal]);
  useEffect(() => {
    const onScroll = () => undefined;
    window.addEventListener('scroll', onScroll);
  });
  return <aside className="card"><h2>Total ₹{total.toFixed(2)}</h2><p className="muted">Raw submit value: {rawTotal}</p></aside>;
}
