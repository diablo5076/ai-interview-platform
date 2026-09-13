"use client";

import { motion } from "motion/react";
import { fadeIn } from "@/animations";
import GlassCard from "../ui/GlassCard";
import { cn } from "@/lib/utils";

interface Activity {
  id: string | number;
  title: string;
  description: string;
  time: string;
}


interface ActivityTimelineProps {
  activities: Activity[];
  className?: string;
}

export default function ActivityTimeline({
  activities,
  className,
}: ActivityTimelineProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard
        className={cn("space-y-6 p-6", className)}>
        <h3 className="text-xl font-semibold text-white">
          Recent Activity
        </h3>

        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="relative flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-primary" />

                {index !== activities.length - 1 && (
                  <div className="mt-2 h-full w-px bg-white/10" />
                )}
              </div>

              <div className="flex-1 pb-6">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-semibold text-white">
                    {activity.title}
                  </h4>

                  <span className="text-xs text-zinc-500">
                    {activity.time}
                  </span>
                </div>

                <p className="mt-1 text-sm text-zinc-400">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}