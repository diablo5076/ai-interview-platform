"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";


interface TextareaProps extends HTMLMotionProps<"textarea"> {
  label?: string;
  error?: string;
}


const Textarea = forwardRef<HTMLTextAreaElement,TextareaProps>(
  ({ label, error, className, disabled, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5" >
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-zinc-300">
            {label}
          </label>
        )}

        <motion.textarea ref={ref} id={id} disabled={disabled} transition={{ duration: 0.2 }} className={cn(
          "min-h-32 w-full resize-y rounded-xl bg-zinc-900/70",
          "border py-3 px-4 text-sm text-white",
          "placeholder:text-zinc-400",
          "transition-colors duration-200",
          "focus:outline-none",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500"
            : "border-zinc-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500",
          "disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:opacity-50",
          className
        )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props} />
        {error && (
          <p id={`${id}-error`}
            role="alert"
            className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;