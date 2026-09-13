"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";


interface MenuItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

interface UserMenuProps {
  name: string;
  avatar?: string;
  items?: MenuItem[];
  className?: string;
}

export default function UserMenu({
  name,
  avatar,
  items = [],
  className, 
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if(
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div ref={menuRef} className={cn("relative", className)}>
      <Button
        variant="ghost"
        aria-label="Open user menu"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}>
        <Avatar src={avatar}
          name={name}
          size="sm" />
        <span className="hidden md:block">
          {name}
        </span>

        <ChevronDown className={cn(
          "h-4 w-4 transition-transform",
          open && "rotate-180"
        )} />
      </Button>
      {open && (
        <div role="menu"
          className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-zinc-900 p-2 shadow-xl">
          {items.map((item) => (
            <Link key={item.href}
              href={item.href}
              role="menuitem"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
              onClick={() => setOpen(false)}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}