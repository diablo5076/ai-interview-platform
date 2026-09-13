"use client";

import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> { }

export default function Skeleton({
  className,
  ...props
}: SkeletonProps) {
  return (
    <div className={cn(
      "animate-pulse rounded-xl bg-zinc-800/80",
      className
    )}
      {...props} />
  );
}