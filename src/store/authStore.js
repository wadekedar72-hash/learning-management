import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginApi, logout as logoutApi, register as registerApi } from '../lib/auth';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: async (credentials) => {
        const response = await loginApi(credentials);
        const { user, accessToken } = response.data;
        set({ user, accessToken, isAuthenticated: true });
        return response;
      },

      register: async (userData) => {
        const response = await registerApi(userData);
        const { user, accessToken } = response.data;
        set({ user, accessToken, isAuthenticated: true });
        return response;
      },

      logout: async () => {
        try {
          await logoutApi();
        } catch (error) {
          console.error('Logout error:', error);
        }
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      setAccessToken: (token) => {
        set({ accessToken: token });
      },

      setUser: (user) => {
        set({ user });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        accessToken: state.accessToken, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);
