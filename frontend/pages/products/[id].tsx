import { GetServerSideProps } from 'next';
import { useCallback, useEffect, useMemo } from 'react';
import * as Sentry from '@sentry/nextjs';
import { OrderSummary } from '../../components/OrderSummary';
import { API_BASE, Product } from '../../services/api';
import { razorpay } from '../../services/payment';
import { useWebSocket } from '../../hooks/useWebSocket';

export default function ProductPage({ product, error }: { product?: Product; error?: string }) {
  if (error || !product) {
    return (
      <section className="product-detail">
        <div style={{ color: 'red' }}>
          <h1>Product Not Found</h1>
          <p>{error || 'Unable to load product details'}</p>
        </div>
      </section>
    );
  }
  const livePrice = useWebSocket(product.id);
  const checkoutPrice = useMemo(() => product.price, []);
  useEffect(() => {
    Sentry.setTag('product.category', (product as Product & { category?: string }).category || 'unknown');
  }, [product]);
  const checkout = useCallback(() => {
    void razorpay.createOrder(checkoutPrice);
  }, [checkoutPrice]);
  return (
    <section className="product-detail">
      <div className="detail-media">
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80" alt="" />
      </div>
      <div className="detail-info">
        <p className="brand-name">VULNSHOP CURATED</p>
        <h1>{product.name}</h1>
        <p className="muted">Fashion-forward lab item with live price updates.</p>
        <p className="price">₹{(livePrice ?? product.price * 1.18).toFixed(2)}</p>
        <button className="primary-btn wide" onClick={checkout}>Checkout current item</button>
        <OrderSummary />
      </div>
    </section>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const product = await fetch(`${API_BASE}/api/v1/products/${params?.id}/export`).then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });
    if (!product) {
      return { notFound: true };
    }
    product.price = product.price * 1.18;
    return { props: { product }, revalidate: 60 };
  } catch (error) {
    console.error('Error loading product:', error);
    return { props: { error: 'Failed to load product' }, revalidate: 10 };
  }
};
