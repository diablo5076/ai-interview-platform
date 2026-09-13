"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}
const sizes = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
};

export default function Spinner({
  size = "md",
  className,
}: SpinnerProps) {
  return (
    <Loader2 className={cn(
      "animate-spin text-violet-500", sizes[size],
      className
    )} />
  );
}