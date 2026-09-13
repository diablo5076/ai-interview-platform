"use client";
import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

import GlassCard from "../ui/GlassCard";
import { fadeIn } from "@/animations";
import { cn } from "@/lib/utils";

interface SuccessAnimationProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function SuccessAnimation({
  title = "Success!",
  description = "Your action was completed successfully.",
  className,
}: SuccessAnimationProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className={cn("flex justify-center", className)}>
      <GlassCard className="flex max-w-md flex-col items-center gap-4 p-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
          duration: 0.35,
          delay: 0.15,
          }}                >
          <CheckCircle2
            className="h-16 w-16 text-emerald-500"
            aria-hidden="true"/>
         </motion.div>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-white">
            {title}
          </h2>

          <p className="text-sm text-zinc-400">
            {description}
          </p>
        </div>
      </GlassCard>
      </motion.div>
  );
}