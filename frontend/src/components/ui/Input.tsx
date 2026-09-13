"use client";

import { forwardRef, type ReactNode } from "react";
import { HTMLMotionProps, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface InputProps extends HTMLMotionProps<"input"> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      className,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-zinc-300">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              {leftIcon}
            </div>
          )}
          <motion.input ref={ref} id={id} disabled={disabled} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} transition={{ duration: 0.2 }} className={cn(
            "w-full rounded-xl bg-zinc-900/70 py-3 text-sm text-white",
            "placeholder:text-zinc-400", "transition-colors duration-200",
            "focus:outline-none",
            error ? "border border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500"
              : "border border-zinc-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500",
            "disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:opacity-50",
            leftIcon ? "pl-10" : "px-4",
            rightIcon ? "pr-10" : "px-4",
            className
          )} {...props} />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${id}-error`} role="alert" className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;