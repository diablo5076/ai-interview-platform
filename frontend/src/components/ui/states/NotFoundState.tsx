"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { fadeIn } from "@/animations";
import Button from "../Button";
import GlassCard from "../GlassCard";
import { cn } from "@/lib/utils";


interface NotFoundStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function NotFoundState({
  title = "404 - Page Not Found",
  description = "The page you are looking for doesn't exist or has been moved.",
  icon,
  actionLabel,
  onAction,
  className,
}: NotFoundStateProps) {
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
          <h2 className="text-2xl font-bold text-white">
            {title}
          </h2>

          <p className="text-sm text-zinc-400">
            {description}
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