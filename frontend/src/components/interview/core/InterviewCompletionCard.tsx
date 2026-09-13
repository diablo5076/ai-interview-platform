"use client";

import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { fadeIn } from "@/animations";

interface InterviewCompletionCardProps {
  title?: string;
  description?: string;
  score?: number;
  totalQuestions: number;
  answeredQuestions: number;
  onViewReport?: () => void;
  onRetake?: () => void;
  className?: string;
}

export default function InterviewCompletionCard({
  title = "Interview Completed",
  description = "Great job! You have successfully completed the interview.",
    score,
    totalQuestions,
    answeredQuestions,
    onViewReport,
    onRetake,
    className,
}: InterviewCompletionCardProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard className={cn(
        "space-y-6 p-8 text-center",
        className
      )}>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">
            {title}
          </h2>

          <p className="text-zinc-400">
            {description}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-zinc-400">
            Questions Answered
          </p>

          <p className="text-3xl font-bold text-white">
            {answeredQuestions}/{totalQuestions}
          </p>
          {score !== undefined && (
            <p className="text-primary text-lg font-semibold">
              Score: {score}%
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {onRetake && (
            <Button
              variant="secondary"
              onClick={onRetake}
            >
              Retake Interview
            </Button>
          )}
        
          {onViewReport && (
            <Button onClick={onViewReport}>
              View Report
            </Button>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}