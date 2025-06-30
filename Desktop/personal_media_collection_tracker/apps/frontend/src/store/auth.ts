import { create } from 'zustand';
import { User } from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

// Demo user for development without authentication
const demoUser: User = {
  id: 'demo-user-id',
  email: 'demo@example.com',
  name: 'Demo User'
};

export const useAuthStore = create<AuthState>((set) => ({
  user: demoUser,
  token: 'demo-token',
  isAuthenticated: true, // Always authenticated for demo
  login: (user: User, token: string) => {
    // For demo purposes, just use demo user
    set({ user: demoUser, token: 'demo-token', isAuthenticated: true });
  },
  logout: () => {
    // For demo purposes, stay logged in
    set({ user: demoUser, token: 'demo-token', isAuthenticated: true });
  },
  setUser: (user: User) => set({ user: demoUser }),
}));
