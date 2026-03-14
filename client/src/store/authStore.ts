import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api, { getErrorMessage } from '@/lib/api';

// Types
export type Role = 'STUDENT' | 'COUNSELLOR' | 'MENTOR' | 'PARENT' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatar?: string | null;
  isEmailVerified: boolean;
  phone?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  studentProfile?: {
    educationLevel?: string;
    stream?: string;
    institution?: string;
    city?: string;
    state?: string;
  } | null;
  counsellorProfile?: {
    specializations?: string[];
    experienceYears?: number;
    bio?: string;
  } | null;
  parentProfile?: {
    childrenIds?: string[];
    occupation?: string;
  } | null;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  role: Role;
  // Student fields
  educationLevel?: string;
  stream?: string;
  board?: string;
  institution?: string;
  city?: string;
  state?: string;
  interests?: string[];
  // Counsellor fields
  qualifications?: string[];
  experienceYears?: number;
  specializations?: string[];
  organization?: string;
  bio?: string;
  // Parent fields
  childEmail?: string;
  occupation?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<{ email: string }>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  getDashboardRoute: () => string;
  setUser: (user: User) => void;
  setHasHydrated: (value: boolean) => void;
  clearAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          
          // Store tokens
          localStorage.setItem('accessToken', data.data.accessToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);
          
          set({
            user: data.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false, error: getErrorMessage(error) });
          throw error;
        }
      },

      register: async (formData: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/register', formData);
          set({ isLoading: false });
          return { email: data.data.user.email };
        } catch (error) {
          set({ isLoading: false, error: getErrorMessage(error) });
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch {
          // Ignore logout errors
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, isAuthenticated: false });
      },

      fetchUser: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.data, isAuthenticated: true });
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },

      verifyOTP: async (email: string, otp: string) => {
        set({ isLoading: true, error: null });
        try {
          await api.post('/auth/verify-otp', { email, otp });
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false, error: getErrorMessage(error) });
          throw error;
        }
      },

      resendOTP: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await api.post('/auth/resend-otp', { email });
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false, error: getErrorMessage(error) });
          throw error;
        }
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await api.post('/auth/forgot-password', { email });
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false, error: getErrorMessage(error) });
          throw error;
        }
      },

      resetPassword: async (token: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          await api.post('/auth/reset-password', { token, newPassword });
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false, error: getErrorMessage(error) });
          throw error;
        }
      },

      getDashboardRoute: () => {
        const user = get().user;
        if (!user) return '/login';
        switch (user.role) {
          case 'STUDENT':
            return '/student';
          case 'COUNSELLOR':
          case 'MENTOR':
            return '/counsellor';
          case 'ADMIN':
            return '/admin';
          case 'PARENT':
            return '/parent';
          default:
            return '/student';
        }
      },

      setUser: (user: User) => set({ user, isAuthenticated: true }),

      setHasHydrated: (value: boolean) => set({ hasHydrated: value }),
      
      clearAuth: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, isAuthenticated: false });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// Helper to get dashboard route based on role
export function getDashboardRoute(role: Role): string {
  switch (role) {
    case 'STUDENT':
      return '/student';
    case 'COUNSELLOR':
    case 'MENTOR':
      return '/counsellor';
    case 'ADMIN':
      return '/admin';
    case 'PARENT':
      return '/parent';
    default:
      return '/student';
  }
}
