import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function AdminPanel() {
  const [orders, setOrders] = useState<unknown[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    api('/api/admin/orders')
      .then(setOrders)
      .catch((err) => {
        console.error('Failed to load admin orders:', err);
        setError(err.message || 'Failed to load orders');
      })
      .finally(() => setLoading(false));
  }, []);
  
  if (loading) {
    return <section className="card"><h1>Admin Orders</h1><p>Loading...</p></section>;
  }
  
  if (error) {
    return <section className="card"><h1>Admin Orders</h1><p style={{ color: 'red' }}>Error: {error}</p></section>;
  }
  
  return <section className="card"><h1>Admin Orders</h1><pre>{JSON.stringify(orders, null, 2)}</pre></section>;
}
