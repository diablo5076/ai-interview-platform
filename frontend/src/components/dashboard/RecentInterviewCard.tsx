"use client";

import { CalendarDays, ChevronRight } from "lucide-react";
import { ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";

import { fadeIn } from "@/animations";
import GlassCard from "../ui/GlassCard";
import Badge from "../ui/Badge";
import { cn } from "@/lib/utils";

type InterviewStatus =
  | "Completed"
  | "Pending";

const statusVariant = {
  Completed: "success",
  Pending: "warning",
} as const;

interface RecentInterviewCardProps {
  title: string;
  role: string;
  date: string;
  score?: number;
  href: string;
  icon?: ReactNode;
  className?: string;
  status: InterviewStatus;
}

export default function RecentInterviewCard({
  title,
  role,
  date,
  score,
  status,
  href,
  icon,
  className,
}: RecentInterviewCardProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard
        className={cn(
          "flex items-center justify-between gap-6 p-5",
          className
        )}
      >
        <div className="flex items-center gap-4">
          {icon && (
            <div
              className="rounded-xl bg-primary/10 p-3 text-primary"
              aria-hidden="true"
            >
              {icon}
            </div>
          )}

          <div className="space-y-1">
            <h3 className="font-semibold text-white">
              {title}
            </h3>

            <p className="text-sm text-zinc-400">
              {role}
            </p>

            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <CalendarDays className="h-4 w-4" />
              <span>{date}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="space-y-1 text-right">
            {score !== undefined && (
              <p className="text-2xl font-bold tracking-tight text-white">
                {score}%
              </p>
            )}

            <Badge variant={statusVariant[status]}>
              {status}
            </Badge>
          </div>

          <Link
            href={href}
            aria-label={`View ${title}`}
            className="rounded-lg p-2 transition-colors hover:bg-white/5"
          >
            <ChevronRight className="h-5 w-5 text-zinc-400" />
          </Link>
        </div>
      </GlassCard>
    </motion.div>
  );
}