"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";


interface SidebarItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

interface SidebarProps {
  items?: SidebarItem[];
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function Sidebar({
  items=[],
  header,
  footer,
  className,
}: SidebarProps) {
  return (
    <aside className={cn(
      "flex h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-zinc-950/80 backdrop-blur-xl",
      className
    )}>
      {header && (
        <div className="border-b border-white/10 p-6">
          {header}
        </div>
      )}
      <nav aria-label="Sidebar navigation"
        className="flex-1 space-y-2 p-4">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white">
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {footer && (
        <div className="border-t border-white/10 p-4">
          {footer}
        </div>
      )}
    </aside>
  );
}