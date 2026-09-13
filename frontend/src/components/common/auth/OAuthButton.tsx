"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { fadeIn } from "@/animations";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";


interface OAuthButtonProps{
  provider: string;
  icon: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export default function OAuthButton({
  provider,
  icon,
  onClick,
  disabled = false,
  loading = false,
  className,
}: OAuthButtonProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className={cn(className)}
    >
      <Button
        variant="secondary"
        onClick={onClick}
        disabled={disabled || loading}
        loading={loading}
        className="w-full justify-center gap-3"
      >
        <span
        className="flex items-center"
        aria-hidden="true">
        {icon}
      </span>

      <span>
        Continue with {provider}
        </span>
      </Button>
    </motion.div>
  );
}