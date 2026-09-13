"use client";

import { motion } from "motion/react";
import { fadeIn } from "@/animations";
import GlassCard from "../GlassCard";
import { cn } from "@/lib/utils";


interface LoadingStateProps {
  message?: string;
  className?: string;
}

export default function LoadingState({
  message = "Loading...",
  className,
}: LoadingStateProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard
        className={cn(
          "flex flex-col items-center justify-center gap-4 p-8 text-center",
          className
        )}>
        <motion.div
          className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear", }}
          aria-hidden="true" />
        <p className="text-sm text-zinc-400">
          {message}
        </p>
      </GlassCard>
    </motion.div>
  );
}
