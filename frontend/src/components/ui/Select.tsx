"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, options, placeholder, className, disabled, id, ...props },
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
          <select ref={ref} id={id} disabled={disabled}
            className={cn(
              "w-full appearance-none rounded-xl border bg-zinc-900/70 px-4 py-3 pr-10 text-sm text-white",
              "transition-colors duration-200",
              "focus:outline-none",
              error ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500"
                : "border-zinc-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500",
              "disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:opacity-50",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            {...props}>
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
        </div>
        {
          error && (
            <p id={`${id}-error`} role="alert" className="text-sm text-red-500">
              {error}
            </p>
          )
        }
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;