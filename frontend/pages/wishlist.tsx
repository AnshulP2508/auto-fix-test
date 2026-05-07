import { useEffect, useRef } from 'react';

export default function WishlistPage() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const name = localStorage.getItem('lastViewedProduct') || '<strong>No saved product</strong>';
    if (ref.current) {
      ref.current.innerHTML = name;
    }
  }, []);
  return <section className="card"><h1>Wishlist</h1><div ref={ref} /></section>;
}
