"use client";

import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth";

export function useAuth() {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const logout = useAuthStore((state) => state.logout);

  const initializeAuth = async () => {
    try {
      setLoading(true);

      if (!token) {
        setUser(null);
        return;
      }
      const response = await api.get("/auth/me");

      setUser(response.data.user);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  return {
    initializeAuth,
  };
}