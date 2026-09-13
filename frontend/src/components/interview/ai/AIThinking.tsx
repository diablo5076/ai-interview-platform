"use client";

import { motion } from "motion/react";
import { Brain } from "lucide-react";
import { fadeIn } from "@/animations";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";


interface AIThinkingProps {
  message?: string;
  className?: string;
}

export default function AIThinking({
  message = "AI is analyzing your response...",
  className,
}: AIThinkingProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard className={cn(
        "flex items-center gap-4 p-6",
        className
      )}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }} aria-hidden="true">
          <Brain className="h-8 w-8 text-primary" />
        </motion.div>

        <div>
          <h3 className="font-semibold text-white">
            AI Thinking
          </h3>

          <p className="mt-1 text-sm text-zinc-400">
            {message}
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}