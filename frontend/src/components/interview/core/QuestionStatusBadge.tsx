"use client";

import { motion } from "motion/react";
import { fadeIn } from "@/animations";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface QuestionStatusBadgeProps {
  status: "Not Started" | "In Progress" | "Answered" | "Skipped";
  className?: string;
}

const statusVariant = {
  "Not Started": "secondary",
  "In Progress": "warning",
  Answered: "success",
  Skipped: "danger",
} as const;

export default function QuestionStatusBadge({
  status,
  className,
}: QuestionStatusBadgeProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className={cn(className)}>
      <Badge variant={statusVariant[status]}>
        {status}
      </Badge>
    </motion.div>
  );
}