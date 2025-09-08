import { create } from 'zustand';
import type { User, AuthState, LoginCredentials, RegisterCredentials, AuthResponse } from '../types/index';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  login: async (credentials) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to login');
      }
  
      const data = await response.json();
  
      const user = {
        name: data.name,
        isPremium: data.isPremium ?? false,
        id: data.id ?? null,
        email: data.email ?? '',
        expiredPremium: data.expiredPremium ?? null,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
  
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(user));
  
      set({ user, loading: false });

      window.location.reload()
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', loading: false });
      throw error;
    }
  },

  register: async (credentials) => {
    try {
      set({ loading: true, error: null });
  
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to register');
      }
  
      const data = await response.json();
  
      const user = {
        name: data.name,
        isPremium: data.isPremium ?? false,
        id: data.id ?? null,
        email: data.email ?? '',
      };
  
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(user));
  
      set({ user, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', loading: false });
      throw error;
    }
  },

  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    set({ user: null });
  },

  fetchUser: async () => {
    const token = sessionStorage.getItem('token');
    const savedUser = sessionStorage.getItem('user');

    if (!token || !savedUser) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Session expired or invalid token');
      }

      const user: User = await response.json();
      set({ user });
    } catch (error) {
      set({ user: JSON.parse(savedUser) });
    }
  },
}));