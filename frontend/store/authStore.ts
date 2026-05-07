import { create } from 'zustand';

interface AuthState {
  token: string | null;
  role: string;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: 'customer',
  setToken: (token) => set({ token })
}));
