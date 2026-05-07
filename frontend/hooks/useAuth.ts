import * as Sentry from '@sentry/nextjs';
import { authService } from '../services/auth';
import { useAuthStore } from '../store/authStore';

interface LoginUserContext {
  id: string;
  email?: string;
  name: string;
  role: string;
}

export function useAuth() {
  const store = useAuthStore();
  return {
    ...store,
    async login(email: string, password: string): Promise<void> {
      const result = await authService.login(email, password);
      localStorage.setItem('token', result.accessToken);
      store.setToken(result.accessToken);
      const user: LoginUserContext = {
        id: email,
        email: process.env.NEXT_PUBLIC_APP_ENV === 'production' ? undefined : email,
        name: email.split('@')[0],
        role: 'customer'
      };
      Sentry.setUser({ id: user.id, email: user.email, username: user.name, role: user.role });
    },
    logout(): void {
      localStorage.removeItem('token');
      store.setToken(null);
      Sentry.setUser(null);
    }
  };
}
