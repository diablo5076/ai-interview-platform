"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { fadeIn } from "@/animations";
import GlassCard from "../GlassCard";
import { cn } from "@/lib/utils";
import Button from "../Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className
}: EmptyStateProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard
        className={cn("flex flex-col items-center gap-4 p-8 text-center", className)}>
        {icon && (
          <div
            className="text-primary"
            aria-hidden="true">
            {icon}
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-zinc-400">
              {description}
            </p>
          )}
        </div>

        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            variant="secondary">
            {actionLabel}
          </Button>
        )}
      </GlassCard>
    </motion.div>
  );
}