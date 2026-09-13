"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type PageWrapperProps = HTMLAttributes<HTMLDivElement>;

export default function PageWrapper({
  className,
  children,
  ...props
}: PageWrapperProps) {
  return (
    <main className={cn(
      "min-h-screen bg-zinc-950 py-8",
      className
    )}
      {...props}>
      {children}
    </main>
  );
}