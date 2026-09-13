"use client";

import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { fadeIn } from "@/animations";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface InterviewControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  disablePrevious?: boolean;
  disableNext?: boolean;
  isLastQuestion?: boolean;
  className?: string;
}

export default function InterviewControls({
  onPrevious,
  onNext,
  disablePrevious = false,
  disableNext = false,
  isLastQuestion = false,
  className,
}: InterviewControlsProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className={cn(
        "mt-6 flex items-center justify-between",
        className
      )}
    >
      <Button
        variant="secondary"
        onClick={onPrevious}
        disabled={disablePrevious}
      >
        <ArrowLeft className="h-4 w-4" />
        Previous
      </Button>

      <Button
        onClick={onNext}
        disabled={disableNext}
      >
        {isLastQuestion ? "Finish Interview" : "Next Question"}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}