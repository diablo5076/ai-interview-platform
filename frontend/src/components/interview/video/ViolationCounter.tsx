"use client";

import { motion } from "motion/react";
import { AlertTriangle } from "lucide-react";

import { fadeIn } from "@/animations";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

interface ViolationCounterProps {
  noFace: number;
  multipleFaces: number;
  lookingAway: number;
  tabSwitches: number;
  fullscreenExit?: number;
  className?: string;
}

export default function ViolationCounter({
  noFace,
  multipleFaces,
  lookingAway,
  tabSwitches,
  fullscreenExit = 0,
  className,
}: ViolationCounterProps) {
  const totalViolations =
    noFace +
    multipleFaces +
    lookingAway +
    tabSwitches +
    fullscreenExit;

  const risk =
    totalViolations === 0
      ? "Low"
      : totalViolations <= 3
        ? "Medium"
        : "High";

  const riskColor =
    risk === "Low"
      ? "text-emerald-400"
      : risk === "Medium"
        ? "text-yellow-400"
        : "text-red-400";

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard className={cn("space-y-5 p-6", className)}>
        <div className="flex items-center gap-3">
          <AlertTriangle
            className="h-6 w-6 text-primary"
            aria-hidden="true"
          />

          <h3 className="text-lg font-semibold text-white">
            Proctoring Monitor
          </h3>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-400">No Face</span>
            <span className="font-medium text-white">{noFace}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Multiple Faces</span>
            <span className="font-medium text-white">
              {multipleFaces}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Looking Away</span>
            <span className="font-medium text-white">
              {lookingAway}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Tab Switches</span>
            <span className="font-medium text-white">
              {tabSwitches}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">
              Fullscreen Exit
            </span>
            <span className="font-medium text-white">
              {fullscreenExit}
            </span>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-white">
              Total Violations
            </span>

            <span className="font-bold text-white">
              {totalViolations}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-zinc-400">
              Risk Level
            </span>

            <span className={cn("font-semibold", riskColor)}>
              {risk}
            </span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}