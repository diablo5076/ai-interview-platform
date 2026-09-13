"use client";

import { motion } from "motion/react";
import { fadeIn } from "@/animations";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

interface VoiceVisualizerProps {
  isRecording?: boolean;
  bars?: number;
  className?: string;
}

export default function VoiceVisualizer({
  isRecording = false,
  bars = 24,
  className,
}: VoiceVisualizerProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard className={cn(
        "flex h-24 items-end justify-center gap-1 p-4",
        className
      )}>
        {Array.from({ length: bars }).map((_, index) => (
          <motion.div
            key={index}
            className={cn(
              "w-1 rounded-full bg-primary",
              !isRecording && "opacity-40"
            )}
            animate={
              isRecording
                ? {
                  height: [12, 36 + (index % 5) * 8, 16, 48 - (index % 4) * 6, 12,],
                } : {
                  height: 12,
                }
            }
            transition={{ duration: 0.9, repeat: Infinity, delay: index * 0.04, ease: "easeInOut", }}
          />
        ))}
      </GlassCard>
    </motion.div>
  );
}