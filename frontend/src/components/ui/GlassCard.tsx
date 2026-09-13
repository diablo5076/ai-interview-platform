import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends ComponentPropsWithoutRef<"div"> { }

export default function GlassCard({
  children,
  className,
  ...props
}: GlassCardProps) {
  return (
    <div className={cn("rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl", className)} {...props}> {children}</div>
  );
}