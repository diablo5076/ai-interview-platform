"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = HTMLAttributes<HTMLDivElement>;

export default function Container({
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div className={cn(
      "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
      className
    )}
      {...props}>
      {children}
    </div>
  );
}