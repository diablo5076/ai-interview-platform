"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { login } from "@/lib/services/auth";
import { useAuthStore } from "@/store/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AuthLayout from "@/components/common/auth/AuthLayout";
import { AxiosError } from "axios";
import { useAuth } from "@/components/ui/hooks/useAuth";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();

  const setToken = useAuthStore((state) => state.setToken);

  const { initializeAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await login(data);

      setToken(response.token);

      await initializeAuth();

      toast.success("Login successful!");

      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (
              error.response?.data as {
                message?: string;
              }
            )?.message
          : undefined;

      toast.error(message ?? "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your interview journey."
    >
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <Input
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address",
            },
          })}
        />

        <Input
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />

        <Button
          type="submit"
          loading={isSubmitting}
          className="w-full"
        >
          Login
        </Button>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-zinc-800" />
          <span className="text-xs font-medium text-zinc-500">OR</span>
          <div className="h-px flex-1 bg-zinc-800" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-3
            rounded-xl
            border
            border-zinc-700
            bg-zinc-900
            px-4
            py-3
            font-medium
            text-white
            transition
            hover:border-zinc-600
            hover:bg-zinc-800
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="#4285F4"
              d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.42z"
            />
            <path
              fill="#34A853"
              d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.75z"
            />
            <path
              fill="#FBBC05"
              d="M6.54 13.83A5.86 5.86 0 0 1 6.23 12c0-.64.11-1.26.31-1.83V7.64H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.36l3.24-2.53z"
            />
            <path
              fill="#EA4335"
              d="M12 6.14c1.43 0 2.72.49 3.74 1.45l2.8-2.8C16.83 3.18 14.63 2.25 12 2.25A9.75 9.75 0 0 0 3.3 7.64l3.24 2.53C7.31 7.86 9.46 6.14 12 6.14z"
            />
          </svg>

          Continue with Google
        </button>

        <p className="text-center text-sm text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="
              font-medium
              text-primary
              transition-colors
              hover:underline
            "
          >
            Sign Up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}