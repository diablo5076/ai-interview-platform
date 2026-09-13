"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Container from "./Container";


interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  logo?: ReactNode;
  items?: NavItem[];
  rightContent?: ReactNode;
  className?: string;
}

export default function Navbar({
  logo,
  items = [],
  rightContent,
  className
}: NavbarProps) {
  return (
    <header className={cn(
      "sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl",
      className
    )}>
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          {logo}
          <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">
            {items.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {rightContent}
        </div>
      </Container>
    </header>
  );
}