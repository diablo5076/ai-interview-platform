"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useAuth } from "@/components/ui/hooks/useAuth";
import toast from "react-hot-toast";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setToken = useAuthStore((state) => state.setToken);
  const { initializeAuth } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      if (error || !token) {
        toast.error("Google login failed");
        router.replace("/login");
        return;
      }

      try {
        setToken(token);

        await initializeAuth();

        toast.success("Google login successful!");

        router.replace("/dashboard");
      } catch (error) {
        console.error(
          "Google authentication failed:",
          error
        );

        toast.error("Failed to complete Google login");

        router.replace("/login");
      }
    };

    void handleCallback();
  }, [
    searchParams,
    setToken,
    initializeAuth,
    router,
  ]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-purple-500" />

        <h1 className="text-lg font-semibold text-white">
          Signing you in...
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Please wait while we complete Google authentication.
        </p>
      </div>
    </main>
  );
}

function GoogleCallbackLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-purple-500" />

        <h1 className="text-lg font-semibold text-white">
          Signing you in...
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Please wait while we complete Google authentication.
        </p>
      </div>
    </main>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<GoogleCallbackLoading />}>
      <GoogleCallbackContent />
    </Suspense>
  );
}