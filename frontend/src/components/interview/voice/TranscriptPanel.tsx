"use client";

import { motion } from "motion/react";
import { FileText } from "lucide-react";
import { fadeIn } from "@/animations";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

interface TranscriptPanelProps {
  transcript: string;
  isLive?: boolean;
  placeholder?: string;
  className?: string;
}


export default function TranscriptPanel({
  transcript,
  isLive = false,
  placeholder = "Your transcript will appear here...",
  className,
}: TranscriptPanelProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard
        className={cn("space-y-4 p-4", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText
              className="h-5 w-5 text-primary"
              aria-hidden="true"
            />

            <h3 className="font-semibold text-white">
              Transcript
            </h3>
          </div>

          {isLive && (
            <span className="flex items-center gap-2 text-xs font-medium text-green-400">
              <span
                className="h-2 w-2 rounded-full bg-green-400"
                aria-hidden="true" />
              Live
            </span>
          )}
        </div>

        <div
          className="max-h-64 overflow-y-auto rounded-lg border border-white/10 bg-white/5 p-4"
          role="log"
          aria-live={isLive ? "polite" : "off"}>
          {transcript ? (
            <p className="whitespace-pre-wrap text-sm text-zinc-200">
              {transcript}
            </p>
          ) : (
            <p className="text-sm text-zinc-500">
              {placeholder}
            </p>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}