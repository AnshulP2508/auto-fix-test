import { GetServerSideProps } from 'next';
import { API_BASE } from '../services/api';
import * as Sentry from '@sentry/nextjs';

export default function OrdersPage({ orders }: { orders: any[] }) {
  return (
    <section>
      <h1>Orders</h1>
      {orders.map((order) => <pre className="card" key={order.id}>{JSON.stringify(order, null, 2)}</pre>)}
    </section>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const orders = await fetch(`${API_BASE}/api/v1/orders`).then((res) => res.json());
    return { props: { orders } };
  } catch (error) {
    Sentry.captureException(error);
    return { props: { orders: [] } };
  }
};
