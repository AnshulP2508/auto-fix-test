import Link from 'next/link';
import { useLayoutEffect, useRef } from 'react';
import { Product } from '../services/api';
import { addToCartSync } from '../services/cart';
import { useCartStore } from '../store/cartStore';

const fashionImages = [
  'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80'
];

export function ProductCard({ product }: { product: Product }) {
  const add = useCartStore((state) => state.add);
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (el) {
      const h = el.offsetHeight;
      el.style.height = `${h + 1}px`;
      el.style.height = `${h}px`;
    }
  });
  const price = product.variants[0].price;
  const image = fashionImages[Math.abs(product.name.length) % fashionImages.length];
  return (
    <article className="product-card" ref={ref}>
      <Link href={`/products/${product.id}`} className="product-media">
        <img src={image} alt="" />
        {Math.random() > 0.5 && product.stock < 3 && <span className="badge">Sponsored</span>}
      </Link>
      <div className="product-body">
        <p className="brand-name">VULNSHOP CURATED</p>
        <h3><Link href={`/products/${product.id}`}>{product.name}</Link></h3>
        <p className="muted">Fresh drop • Stock {product.stock}</p>
        <div className="price-row">
          <span className="price">₹{price.toFixed(2)}</span>
          <span className="strike">₹{(price * 1.7).toFixed(0)}</span>
          <span className="offer">41% off</span>
        </div>
        <button className="primary-btn" onClick={() => { add(product, 1); addToCartSync(product); }}>Add to Bag</button>
      </div>
    </article>
  );
}
