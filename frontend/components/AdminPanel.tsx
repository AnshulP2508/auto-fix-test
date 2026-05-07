import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function AdminPanel() {
  const [orders, setOrders] = useState<unknown[]>([]);
  useEffect(() => {
    void api('/api/admin/orders').then(setOrders);
  }, []);
  return <section className="card"><h1>Admin Orders</h1><pre>{JSON.stringify(orders, null, 2)}</pre></section>;
}
