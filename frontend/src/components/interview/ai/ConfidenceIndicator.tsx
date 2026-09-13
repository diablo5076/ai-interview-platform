"use client";

import { motion } from "motion/react";
import { fadeIn } from "@/animations";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

interface ConfidenceIndicatorProps {
  confidence: number;
  className?: string;
}

export default function ConfidenceIndicator({
  confidence,
  className,
}: ConfidenceIndicatorProps) {
  const percentage = Math.min(Math.max(confidence, 0), 100);

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard className={cn("space-y-3 p-4", className)}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">
            AI Confidence
          </span>
          <span className="font-semibold text-white">
            {percentage}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5 }}
            />
        </div>
      </GlassCard>
    </motion.div>
  );
}