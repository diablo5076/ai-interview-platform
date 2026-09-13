"use client";

import { motion } from "motion/react";
import { Mic } from "lucide-react";
import { fadeIn } from "@/animations";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

interface RecordingIndicatorProps {
  isRecording: boolean;
  message?: string;
  className?: string;
}

export default function RecordingIndicator({
  isRecording,
  message = "Recording...",
  className,
}: RecordingIndicatorProps) {
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
        <motion.div
          animate={isRecording ? { scale: [1, 1.2, 1], opacity: [1, 0.6, 1], } : {}}
          transition={{ duration: 1, repeat: Infinity, }}
          aria-hidden="true"
        >
          <Mic className={cn(
            "h-6 w-6",
            isRecording
              ? "text-red-500"
              : "text-zinc-400"
          )} />
        </motion.div>
        <div>
          <h3 className="font-semibold text-white">
            {isRecording ? "Recording" : "Not Recording"}
          </h3>

          <p className="mt-1 text-sm text-zinc-400">
            {message}
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}