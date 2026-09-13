"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";


interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
}

const variants = {
  primary: "bg-violet-500/15 text-violet-400 border border-violet-500/20",
  secondary: "bg-zinc-800 text-zinc-300 border border-zinc-700",
  success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  warning: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
  danger: "bg-red-500/15 text-red-400 border border-red-500/20",
  info: "bg-sky-500/15 text-sky-400 border border-sky-500/20",
};

export default function Badge({
  children,
  variant = "primary",
  className,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap",
      variants[variant], className
    )}
      {...props}>
      {children}
    </span>
  );
}