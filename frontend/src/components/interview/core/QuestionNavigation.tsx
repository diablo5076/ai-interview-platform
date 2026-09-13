"use client";

import { motion } from "motion/react";
import { fadeIn } from "@/animations";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";


interface QuestionNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  onSelectQuestion: (question: number) => void;
  className?: string;
}

export default function QuestionNavigation({
  currentQuestion,
  totalQuestions,
  onSelectQuestion,
  className,
}: QuestionNavigationProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-wrap gap-2",
        className
      )}>
      {Array.from({ length: totalQuestions }, (_, index) => (
        <Button
          key={index}
          variant={currentQuestion === index ? "primary" : "secondary"}
          onClick={() => onSelectQuestion(index)}>
          {index + 1}
        </Button>
      ))}
    </motion.div>
  );
}
