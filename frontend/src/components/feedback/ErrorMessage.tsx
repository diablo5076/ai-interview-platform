"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";


interface ErrorMessageProps{
  message?: string;
  className?: string;
}

export default function ErrorMessage({
  message,
  className,
}: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div role="alert"
      className={cn(
        "flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400",
        className
      )}>
      <AlertCircle
        className="mt-0.5 h-4 w-4 shrink-0"
        aria-hidden="true" />
      <p className="flex-1">{message}</p>
    </div>
  );
}