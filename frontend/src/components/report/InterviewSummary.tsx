"use client";

import { motion } from "motion/react";
import { fadeIn } from "@/animations";
import GlassCard from "../ui/GlassCard";
import { cn } from "@/lib/utils";


interface InterviewSummaryProps {
  candidateName: string;
  interviewRole: string;
  completedOn: string;
  duration: string;
  overallScore: number;
  className?: string;
}

export default function InterviewSummary({
  candidateName,
  interviewRole,
  completedOn,
  duration,
  overallScore,
  className,
}: InterviewSummaryProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard
        className={cn("space-y-6 p-6", className)}>
        <h2 className="text-2xl font-bold text-white">
          Interview Summary
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-zinc-400">
              Candidate
            </p>

            <p className="font-medium text-white">
              {candidateName}
            </p>
          </div>

          <div>
            <p className="text-sm text-zinc-400">
              Role
            </p>
            <p className="font-medium text-white">
              {interviewRole}
            </p>
          </div>
          <div>
            <p className="text-sm text-zinc-400">
              Completed On
            </p>
            <p className="font-medium text-white">
              {completedOn}
            </p>
          </div>
          <div>
            <p className="text-sm text-zinc-400">
              Duration
            </p>
            <p className="font-medium text-white">
              {duration}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-sm text-zinc-400">
              Overall Score
            </p>

            <p className="text-3xl font-bold text-primary">
              {overallScore}%
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}