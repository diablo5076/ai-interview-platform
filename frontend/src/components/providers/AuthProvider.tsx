"use client";

import { useEffect } from "react";
import { useAuth } from "../ui/hooks/useAuth";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({
  children,
}: AuthProviderProps) {
  const { initializeAuth } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, []);

  return <>{children}</>;
}