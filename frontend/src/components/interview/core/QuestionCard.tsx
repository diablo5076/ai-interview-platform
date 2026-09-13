"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { fadeIn } from "@/animations";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

import QuestionMetadata from "./QuestionMetadata";
import QuestionStatusBadge from "./QuestionStatusBadge";

interface QuestionCardProps {
  title: string;
  question: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  status: "Not Started" | "In Progress" | "Answered" | "Skipped";
  estimatedTime?: string;
  icon?: ReactNode;
  className?: string;
}


export default function QuestionCard({
  title,
  question,
  difficulty,
  category,
  status,
  estimatedTime,
  icon,
  className,
}: QuestionCardProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible">
      <GlassCard className={cn("space-y-6 p-6", className)}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <QuestionMetadata
            difficulty={difficulty}
            category={category}
            estimatedTime={estimatedTime}
            icon={icon} />
          <QuestionStatusBadge status={status} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            {title}
          </h2>

          <p className="leading-7 text-zinc-300">
            {question}
          </p>
        </div>
      </GlassCard>
      </motion.div>
  );
}