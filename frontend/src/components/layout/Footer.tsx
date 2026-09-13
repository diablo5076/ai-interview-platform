"use client";

import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import Container from "./Container";

interface FooterProps extends HTMLAttributes<HTMLElement>{
  leftContent?: ReactNode;
  rightContent?: ReactNode;
}

export default function Footer({
  leftContent,
  rightContent,
  className,
  ...props
}: FooterProps) {
  return (
    <footer className={cn(
      "border-t border-white/10 bg-zinc-950/80 backdrop-blur-xl",
      className
    )}
      {...props}>
        <Container className="flex h-16 items-center justify-between">
          <div className="text-sm text-zinc-400">
            {leftContent}
          </div>
        
          <div className="flex items-center gap-4">
            {rightContent}
          </div>
        </Container>
    </footer>
  );
}