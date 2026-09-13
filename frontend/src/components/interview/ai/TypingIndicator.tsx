"use client";

import { motion } from "motion/react";
import { fadeIn } from "@/animations";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  message?: string;
  className?: string;
}

export default function TypingIndicator({
  message = "AI is generating a response...",
  className,
}: TypingIndicatorProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard
        className={cn(
          "flex items-center gap-4 p-4",
          className
        )}>
          <div className="flex gap-1" aria-hidden="true">
            {[0, 1, 2].map((dot) => (
              <motion.div
                key={dot}
                className="h-2 w-2 rounded-full bg-primary"
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0], }}
                transition={{ duration: 0.8, repeat:Infinity, delay: dot*0.15,}}
              />
            ))}
          </div>
          <p className="text-sm text-zinc-400">
            {message}
          </p>
        </GlassCard>
    </motion.div>
  );
}