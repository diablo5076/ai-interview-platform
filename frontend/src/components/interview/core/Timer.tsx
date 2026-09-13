"use client";

import { Clock3 } from "lucide-react";
import { motion } from "motion/react";

import { fadeIn } from "@/animations";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

interface TimerProps {
  time: string;
  label?: string;
  isWarning?: boolean;
  className?: string;
}


export default function Timer({
  time,
  label = "Time Remaining",
  isWarning = false,
  className,
}: TimerProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible">
      <GlassCard className={cn(
        "flex items-center gap-3 px-4 py-3",
        className
      )}>
        <div className={cn(
          "rounded-lg p-2",
          isWarning
            ? "bg-red-500/10 text-red-400"
            : "bg-primary/10 text-primary"
        )}
          aria-hidden="true"
        >
          <Clock3 className="h-5 w-5" />
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-zinc-400">
            {label}
          </span>
          
          <span className={cn(
            "text-lg font-semibold tracking-tight",
            isWarning ? "text-red-400 " : "text-white"
          )}>
            {time}
          </span>
        </div>
      </GlassCard>
    </motion.div>
  );
}