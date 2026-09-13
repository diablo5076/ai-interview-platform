"use client";

import { ChangeEvent } from "react";
import { motion } from "motion/react";

import { fadeIn } from "@/animations";
import Textarea from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";


interface AnswerInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
  className?: string;
}

export default function AnswerInput({
  value,
  onChange,
  placeholder = "Type your answer here...",
  disabled = false,
  maxLength,
  showCharacterCount = true,
  className,
}: AnswerInputProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className={cn("space-y-2", className)}>
      <Textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        rows={8}
      />
      {showCharacterCount && (
        <div className="flex justify-end">
          <span className="text-xs text-zinc-400">
            {value.length}
            {maxLength ? `/${maxLength}` : ""} characters
          </span>
        </div>
      )}
    </motion.div>
  );
}