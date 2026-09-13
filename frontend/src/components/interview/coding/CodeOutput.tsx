"use client";

import { motion } from "motion/react";
import GlassCard from "@/components/ui/GlassCard";
import { fadeIn } from "@/animations";
import { cn } from "@/lib/utils";


interface CodeOutputProps {
  output: string;
  error?: string;
  isRunning?: boolean;
  className?: string;
}

export default function CodeOutput({
  output,
  error,
  isRunning = false,
  className,
}: CodeOutputProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard
        className={cn("space-y-4 p-4", className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Output
          </h3>
          {isRunning && (
            <span className="text-sm text-primary">
              Running...
            </span>
          )}
        </div>

        <div
          className={cn(
            "min-h-40 rounded-lg border bg-zinc-950 p-4 font-mono text-sm",
            error
              ? "border-red-500/30 text-red-400"
              : "border-white/10 text-zinc-200"
          )}>
          {error ? (
            <pre className="whitespace-pre-wrap">
              {error}
            </pre>
          ) : output ? (
            <pre className="whitespace-pre-wrap">
              {output}
            </pre>
          ) : (
            <p className="text-zinc-500">
              Run your code to see the output.
            </p>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}