"use client";

import { motion } from "motion/react";
import { fadeIn } from "@/animations";
import Select from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import { ChangeEvent } from "react";


interface LanguageOption {
  label: string;
  value: string;
}

interface LanguageSelectorProps {
  value: string;
  options: LanguageOption[];
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export default function LanguageSelector({
  value,
  options,
  onChange,
  label = "Programming Language",
  disabled = false,
  className,
}: LanguageSelectorProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className={cn(className)}>

      <Select
        value={value}
        label={label}
        options={options}
        placeholder="Select a language"
        disabled={disabled}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => {
          onChange(event.target.value)
        }}
      />
    </motion.div>
  );
}