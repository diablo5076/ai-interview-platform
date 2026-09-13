"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/50 p-10 text-center",
      className
    )}>
      {icon && (
        <div className="mb-4 text-zinc-500">
          {icon}
        </div>
      )}

      <h3 className="text-xl font-semibold text-white">
        {title}
      </h3>
      {
        description && (
          <p className="mt-2 max-w-md text-sm text-zinc-400">
            {description}
          </p>
        )}
      {
        action && (
          <div className="mt-6">
            {action}
          </div>
        )}
    </div>
  );
}