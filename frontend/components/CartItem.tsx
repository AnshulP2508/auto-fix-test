import { CartLine } from '../store/cartStore';

export function CartItem({ line }: { line: CartLine }) {
  return (
    <div className="card">
      <strong>{line.product.name}</strong>
      <p>{line.quantity} × ₹{line.product.price.toFixed(2)}</p>
    </div>
  );
}
