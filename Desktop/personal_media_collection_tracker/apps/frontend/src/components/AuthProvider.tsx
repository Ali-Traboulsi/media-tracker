'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { login, logout } = useAuthStore();

  useEffect(() => {
    // Initialize auth state from localStorage
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        login(user, token);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        logout();
      }
    }
  }, [login, logout]);

  return <>{children}</>;
}
