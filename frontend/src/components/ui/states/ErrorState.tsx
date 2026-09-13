"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { fadeIn } from "@/animations";
import Button from "../Button";
import GlassCard from "../GlassCard";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function ErrorState({
  title = "Something went wrong",
  message,
  icon,
  actionLabel,
  onAction,
  className,
}: ErrorStateProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible">
      <GlassCard
        className={cn("flex flex-col items-center gap-4 p-8 text-center", className)}>
        {icon && (
          <div
            className="text-red-500"
            aria-hidden="true">
            {icon}
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">
            {title}
          </h3>

          <p className="text-sm text-zinc-400">
            {message}
          </p>
        </div>

        {actionLabel && onAction && (
          <Button
            variant="secondary"
            onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </GlassCard>
    </motion.div>
  );
}