"use client";

import { motion } from "motion/react";
import { fadeIn } from "@/animations";
import { cn } from "@/lib/utils";

import ProgressBar from "./ProgressBar";
import Timer from "./Timer";


interface InterviewHeaderProps {
  title: string;
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: string;
  isTimeWarning?: boolean;
  className?: string;
}

export default function InterviewHeader({
  title,
  currentQuestion,
  totalQuestions,
  timeRemaining,
  isTimeWarning = false,
  className,
}: InterviewHeaderProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className={cn("space-y-6", className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {title}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Question {currentQuestion} of {totalQuestions}
          </p>
        </div>

        <Timer time={timeRemaining} isWarning={isTimeWarning} />
      </div>

      <ProgressBar value={currentQuestion} max={totalQuestions} />
    </motion.div>
  );
}