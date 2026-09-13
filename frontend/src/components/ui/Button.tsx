"use client";

import { cn } from "@/lib/utils";
import Spinner from "./Spinner";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { HTMLMotionProps } from "motion/react";


interface ButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  loading?: boolean;

  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}

const variants = {
  primary: "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-600/20",
  secondary: "bg-zinc-800 text-white hover:bg-zinc-700",
  outline: "border border-zinc-700 bg-transparent hover:bg-zinc-900",
  ghost: "bg-transparent hover:bg-zinc-900",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10 p-0",
};

export default function Button({
  children,
  loading = false,
  disabled,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <motion.button  transition={{ duration: 0.2 }} type={props.type ?? "button"} whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
      disabled={disabled || loading}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap select-none rounded-xl font-medium",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        "cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )} {...props}>
      {loading && <Spinner size="sm" className="text-current" />}
      {children}
    </motion.button>
  );
}