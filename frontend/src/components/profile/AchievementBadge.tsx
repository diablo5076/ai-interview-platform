"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { fadeIn } from "@/animations";
import GlassCard from "../ui/GlassCard";
import { cn } from "@/lib/utils";

interface AchievementBadgeProps {
  title: string;
  description?: string;
  icon: ReactNode;
  unlocked?: boolean;
  className?: string;
}

export default function AchievementBadge({
  title,
  description,
  icon,
  unlocked = true,
  className,
}: AchievementBadgeProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible">
      <GlassCard
        className={cn("flex items-center gap-4 p-4", !unlocked && "opacity-50", className)}>
        <div
          className={cn("flex h-14 w-14 items-center justify-center rounded-full",
            unlocked
              ? "bg-primary/10 text-primary"
              : "bg-zinc-800 text-zinc-500")}
          aria-hidden="true">
          {icon}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-white">
            {title}
          </h3>

          {description && (
            <p className="mt-1 text-sm text-zinc-400">
              {description}
            </p>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}