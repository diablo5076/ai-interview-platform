"use client";
import { motion } from "motion/react";
import { fadeIn } from "@/animations";
import GlassCard from "../ui/GlassCard";
import { cn } from "@/lib/utils";

interface ScoreCardProps{
  title: string;
  score: number;
  maxScore?: number;
  description?: string;
  className?: string;
}


export default function ScoreCard({
  title,
  score,
  maxScore = 100,
  description,
  className
}: ScoreCardProps) {
  const percentage = Math.min(Math.max((score / maxScore) * 100, 0), 100);

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard
        className={cn("space-y-5 p-6", className)}>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white">
            {title}
          </h3>

          {description && (
            <p className="text-sm text-zinc-400">
              {description}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <span className="text-4xl font-bold text-white">
              {score}
            </span>
            <span className="text-sm text-zinc-400">
              / {maxScore}
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.6 }} />
          </div>

          <p className="text-right text-sm text-zinc-400">
            {percentage.toFixed(0)}%
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}