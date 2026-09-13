"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import { fadeIn } from "@/animations";
import GlassCard from "../ui/GlassCard";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  className?: string;
}

export default function QuickActionCard({
  title,
  description,
  href,
  icon,
  className,
}: QuickActionCardProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard className={cn(
        "group h-full transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.03]",
        className
      )}>
        <Link href={href}
          className="flex h-full flex-col gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"
            aria-hidden="true">
            {icon}
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-white">
              {title}
            </h3>

            <p className="text-sm text-zinc-400">
              {description}
            </p>
          </div>

          <div className="flex items-center justify-end">
            <ArrowRight className="h-5 w-5 text-zinc-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
          </div>
        </Link>
      </GlassCard>
    </motion.div>
  );
}