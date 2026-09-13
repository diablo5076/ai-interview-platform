"use client";

import { motion } from "motion/react";
import { fadeIn } from "@/animations";
import GlassCard from "../ui/GlassCard";
import { cn } from "@/lib/utils";

interface Skill {
  name: string;
  score: number;
}

interface SkillBreakdownProps {
  skills: Skill[];
  className?: string;
}

export default function SkillBreakDown({
  skills,
  className,
}: SkillBreakdownProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard
        className={cn("space-y-5 p-6", className)}>
        <h3 className="text-lg font-semibold text-white">
          Skill Breakdown
        </h3>

        <div className="space-y-4">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-300">
                  {skill.name}
                </span>

                <span className="text-sm text-zinc-400">
                  {skill.score}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.score}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}