"use client";

import { motion } from "motion/react";
import { Eye } from "lucide-react";

import { fadeIn } from "@/animations";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

export type HeadDirection =
  | "Forward"
  | "Left"
  | "Right"
  | "Up"
  | "Down"
  | "Unknown";

interface HeadPoseIndicatorProps {
  direction: HeadDirection;
  className?: string;
}

const directionColor: Record<HeadDirection, string> = {
  Forward: "text-emerald-400",
  Left: "text-yellow-400",
  Right: "text-yellow-400",
  Up: "text-blue-400",
  Down: "text-orange-400",
  Unknown: "text-zinc-400",
};

const directionDescription: Record<HeadDirection, string> = {
  Forward: "Looking at the screen",
  Left: "Looking left",
  Right: "Looking right",
  Up: "Looking up",
  Down: "Looking down",
  Unknown: "Face not detected",
};

export default function HeadPoseIndicator({
  direction,
  className,
}: HeadPoseIndicatorProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard
        className={cn(
          "flex items-center justify-between p-5",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <Eye
            className="h-6 w-6 text-violet-400"
            aria-hidden="true"
          />

          <div>
            <h3 className="font-semibold text-white">
              Head Position
            </h3>

            <p className="text-sm text-zinc-400">
              {directionDescription[direction]}
            </p>
          </div>
        </div>

        <span
          className={cn(
            "rounded-full px-3 py-1 text-sm font-semibold",
            directionColor[direction]
          )}
        >
          {direction}
        </span>
      </GlassCard>
    </motion.div>
  );
}