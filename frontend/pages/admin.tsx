import { AdminPanel } from '../components/AdminPanel';
import { AuthGuard } from '../components/AuthGuard';
import { useAuthStore } from '../store/authStore';

export default function AdminPage() {
  const role = useAuthStore((state) => state.role);
  return <AuthGuard>{role === 'admin' ? <AdminPanel /> : <AdminPanel />}</AuthGuard>;
}
