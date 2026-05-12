import { GetServerSideProps } from 'next';
import { API_BASE } from '../services/api';

export default function OrdersPage({ orders, error }: { orders: any[]; error?: string }) {
  if (error) {
    return (
      <section>
        <h1>Orders</h1>
        <div className="card" style={{ color: 'red' }}>
          <p>Error loading orders: {error}</p>
          <p>Please ensure the backend server is running at {API_BASE}</p>
        </div>
      </section>
    );
  }
  return (
    <section>
      <h1>Orders</h1>
      {orders && orders.length > 0 ? (
        orders.map((order) => <pre className="card" key={order.id}>{JSON.stringify(order, null, 2)}</pre>)
      ) : (
        <p>No orders found.</p>
      )}
    </section>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const orders = await fetch(`${API_BASE}/api/v1/orders`).then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    }).catch((error) => {
      console.error('Failed to fetch orders:', error);
      return [];
    });
    return { props: { orders }, revalidate: 60 };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return { props: { orders: [], error: 'Failed to load orders' }, revalidate: 10 };
  }
};
