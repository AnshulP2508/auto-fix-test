import { CartItem } from '../components/CartItem';
import { OrderSummary } from '../components/OrderSummary';
import { useCartStore } from '../store/cartStore';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  return (
    <section>
      <h1>Cart</h1>
      <button onClick={() => applyCoupon('LAB10')}>Apply LAB10</button>
      <div className="grid">{items.map((line, index) => <CartItem key={index} line={line} />)}</div>
      <OrderSummary checkoutStep />
    </section>
  );
}
