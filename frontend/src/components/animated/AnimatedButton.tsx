"use client";

import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import { fadeIn } from "@/animations";

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function AnimatedButton({
  children,
  onClick,
  variant = "primary",
  loading = false,
  disabled = false,
  className,
  type = "button",
}: AnimatedButtonProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <Button
        type={type}
        variant={variant}
        onClick={onClick}
        loading={loading}
        disabled={disabled}
        className={className}
      >
        {children}
      </Button>
    </motion.div>
  );
}