"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";


interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn(
      "mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
      className
    )}>
      <div>
        <h1 className="text-3xl font-bold text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-zinc-400">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}