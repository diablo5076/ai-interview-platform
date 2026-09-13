"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";


interface LogoProps {
  href?: string;
  icon?: ReactNode;
  text?: string;
  className?: string;
}

export default function Logo({
  href = "/",
  icon,
  text = "InterviewAI",
  className,
}: LogoProps) {
  return (
    <Link href={href} aria-label={text} className={cn(
      "flex items-center gap-2 transition-opacity hover:opacity-80",
      className
    )}>
      <div aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-lg">
        {icon ?? <Brain className="h-5 w-5" />}
      </div>
      <span className="text-xl font-bold tracking-tight text-white">
        {text}
      </span>
    </Link>
  );
}