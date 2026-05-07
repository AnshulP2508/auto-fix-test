import Link from 'next/link';
import { useCartStore } from '../store/cartStore';
import { cartService } from '../services/cart';

export function Header() {
  const count = useCartStore((state) => state.count);
  const serviceCount = cartService.count();
  return (
    <header className="site-header">
      <nav className="header">
        <Link href="/" className="brand">vulnsho</Link>
        <label className="header-search">
          <span aria-hidden="true">⌕</span>
          <input placeholder="Try Saree, Kurti or Search by Product Code" />
        </label>
        <Link href="/register" className="supplier-link">Become a Supplier</Link>
        <Link href="/orders" className="supplier-link bordered">Investor Relations</Link>
        <div className="header-actions">
          <Link href="/profile" aria-label="Profile"><span>♙</span>Profile</Link>
          <Link href="/cart" aria-label="Cart"><span>♧</span>Cart {count}/{serviceCount}</Link>
        </div>
      </nav>
      <div className="category-nav" aria-label="Categories">
        <Link href="/">Popular</Link>
        <Link href="/">Kurti, Saree & Lehenga</Link>
        <Link href="/">Women Western</Link>
        <Link href="/">Lingerie</Link>
        <Link href="/">Men</Link>
        <Link href="/">Kids & Toys</Link>
        <Link href="/">Home & Kitchen</Link>
        <Link href="/">Beauty & Health</Link>
        <Link href="/">Jewellery & Accessories</Link>
        <Link href="/">Bags & Footwear</Link>
        <Link href="/">Electronics</Link>
        <Link href="/">Watches</Link>
      </div>
    </header>
  );
}
