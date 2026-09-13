"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";

import { fadeIn } from "@/animations";
import GlassCard from "../ui/GlassCard";
import { cn } from "@/lib/utils";


interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  description,
  className,
}: StatCardProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible">
      <GlassCard className={cn(
        "flex items-start justify-between gap-4 p-6",
        className
      )}>
        <div className="space-y-1">
          <p className="text-sm text-zinc-400">
            {title}
          </p>

          <h3 className="text-3xl font-bold text-white">
            {value}
          </h3>

          {description && (
            <p className="text-sm text-zinc-500">
              {description}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-primary/10 p-3 text-primary">
          {icon}
        </div>
      </GlassCard>
    </motion.div>
  );
}