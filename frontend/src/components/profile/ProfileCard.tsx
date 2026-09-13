"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { fadeIn } from "@/animations";
import GlassCard from "../ui/GlassCard";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  name: string;
  email: string;
  avatar?: ReactNode;
  role?: string;
  className?: string;
}

export default function ProfileCard({
  name,
  email,
  avatar,
  role,
  className,
}: ProfileCardProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard
        className={cn("flex items-center gap-5 p-6", className)}>
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
          {avatar}
        </div>

        <div className="flex-1 space-y-1">
          <h2 className="text-2xl font-semibold text-white">
            {name}
          </h2>

          <p className="text-sm text-zinc-400">
            {email}
          </p>

          {role && (
            <p className="text-sm font-medium text-primary">
              {role}
            </p>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}