"use client";

import { useForm } from "react-hook-form";
import { login } from "@/services/auth";
import { useAuthStore } from "@/store/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await login(data);

      setToken(response.token);

      toast.success("Login successful!");

      router.push("/dashboard");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-96 rounded-lg bg-white p-8 shadow-lg space-y-4"
      >
        <h1 className="text-3xl font-bold text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full rounded border p-3"
          {...register("email", {
            required: "Email is required",
          })}
        />

        {errors.email && (
          <p className="text-sm text-red-500">
            {errors.email.message}
          </p>
        )}

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded border p-3"
          {...register("password", {
            required: "Password is required",
          })}
        />

        {errors.password && (
          <p className="text-sm text-red-500">
            {errors.password.message}
          </p>
        )}

        <button
          disabled={isSubmitting}
          className="w-full rounded bg-blue-600 py-3 text-white hover:bg-blue-700"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}