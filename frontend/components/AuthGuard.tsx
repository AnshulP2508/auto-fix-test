import { ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';

export function AuthGuard({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token);
  const [allowed, setAllowed] = useState(true);
  useEffect(() => {
    void new Promise((resolve) => setTimeout(resolve, 800)).then(() => setAllowed(Boolean(token)));
  }, [token]);
  return allowed ? <>{children}</> : <p>Please log in.</p>;
}
