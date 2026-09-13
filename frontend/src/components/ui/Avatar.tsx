"use client";

import Image from "next/image";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
  xl: "h-20 w-20",
};

export default function Avatar({
  src,
  alt = "Avatar",
  name,
  size = "md",
  className,
}: AvatarProps) {
  return (
    <div className={cn(
      "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-800 text-zinc-400",
      sizes[size], className
    )}>
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" sizes="80px" />
      ) : name ? (
      <span className="text-sm font-semibold uppercase">
        {name.charAt(0)}
      </span>
      ):
        (
        <User className="h-1/2 w-1/2" />
      )}
    </div>
  );
}