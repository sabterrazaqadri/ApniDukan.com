'use client';

import { create } from 'zustand';

interface AdminAuthStore {
  isAuthenticated: boolean;
  setAuthenticated: (status: boolean) => void;
}

export const useAdminAuth = create<AdminAuthStore>((set) => ({
  isAuthenticated: false,
  setAuthenticated: (status) => set({ isAuthenticated: status }),
}));

export const isAdmin = () => {
  if (typeof window === 'undefined') return false;
  const authStatus = localStorage.getItem('adminAuthenticated');
  return authStatus === 'true';
};

export const loginAdmin = (email: string, password: string): boolean => {
  if (email === 'admin@apnidukan.com' && password === 'admin123') {
    localStorage.setItem('adminAuthenticated', 'true');
    useAdminAuth.getState().setAuthenticated(true);
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  localStorage.removeItem('adminAuthenticated');
  useAdminAuth.getState().setAuthenticated(false);
};
