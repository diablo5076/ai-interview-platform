"use client";

import { motion } from "motion/react";
import { fadeIn } from "@/animations";
import GlassCard from "../ui/GlassCard";
import { cn } from "@/lib/utils";


interface FeedbackCardProps {
  title: string;
  feedback: string;
  type?: "positive" | "improvement" | "neutral";
  className?: string;
}

const typeStyles = {
  positive: "border-green-500/30 bg-green-500/5",
  improvement: "border-yellow-500/30 bg-yellow-500/5",
  neutral: "border-white/10 bg-white/5",
} as const;

export default function FeedbackCard({
  title,
  feedback,
  type = "neutral",
  className,
}: FeedbackCardProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard
        className={cn("space-y-3 border p-5", typeStyles[type], className)}>
        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>

        <p className="leading-7 text-zinc-300">
          {feedback}
        </p>
      </GlassCard>
    </motion.div>
  );
}