"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

import AuthLayout from "@/components/common/auth/AuthLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { signup } from "@/lib/services/auth";

interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      await signup({
        email: data.email,
        password: data.password,
      });

      toast.success("Account created successfully!");
      router.push("/login");

    } catch (error) {
      const message = error instanceof AxiosError
        ? (error.response?.data as { message?: string })?.message
        : undefined;
      toast.error(message ?? "Signup failed");
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Create your account to start AI-powered interview practice.">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      
        <Input type="email" placeholder="Enter your email" autoComplete="email" error={errors.email?.message} {...register("email", { required: "Email is required", pattern:{ value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email address",}, })} />
        <Input type="password" placeholder="Enter your password" autoComplete="new-password" error={errors.password?.message} {...register("password", {required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters",},})} />
        <Input type="password" placeholder="Confirm your password" autoComplete="new-password" error={errors.confirmPassword?.message} {...register("confirmPassword", { required: "Please confirm your password", validate:(value) => value === getValues("password") || "Passwords do not match", })} />
   
      <Button type="submit" loading={isSubmitting} className="w-full">
          Sign Up
      </Button>
     
  
      <p className="text-center text-sm text-zinc-400">
        Already have an account? {" "}
        <Link href="/login" className="font-medium text-primary transition-colors hover:underline">
          Login
        </Link>
      </p>
      </form>
    </AuthLayout>
  );
}