"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { fadeIn } from "@/animations";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface QuestionMetadataProps {
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  estimatedTime?: string;
  icon?: ReactNode;
  className?: string;
}

const difficultyVariant = {
  Easy: "success",
  Medium: "warning",
  Hard: "danger",
} as const;

export default function QuestionMetadata({
  difficulty,
  category,
  estimatedTime,
  icon,
  className,
}: QuestionMetadataProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-wrap items-center gap-3",
        className
      )}>
      <Badge variant={difficultyVariant[difficulty]}>
        {difficulty}
      </Badge>
      <Badge variant="secondary">
        {category}
      </Badge>

      {estimatedTime && (
        <Badge variant="info">
          {estimatedTime}
        </Badge>
      )}

      {icon && (
        <div className="text-primary"
          aria-hidden="true">
          {icon}
        </div>
      )}
    </motion.div>
  );
}