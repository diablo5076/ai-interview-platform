"use client";

import Spinner from "../ui/Spinner";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  message?: string;
  className?: string;
}

export default function LoadingScreen({
  message = "Loading...",
  className,
}: LoadingScreenProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-h-screen flex-col items-center justify-center gap-4",
        className
      )}>
        <Spinner size="lg" aria-hidden="true" />

      <p className="text-sm text-zinc-400">{message}</p>
    </div>
  );
}