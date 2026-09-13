"use client";
import { motion } from "motion/react";
import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart as RechartsRadarChart, ResponsiveContainer } from "recharts";
import { fadeIn } from "@/animations";
import GlassCard from "../ui/GlassCard";
import { cn } from "@/lib/utils";


interface RadarChartData {
  subject: string;
  score: number;
}

interface RadarChartProps {
  data: RadarChartData[];
  className?: string;
}

export default function RadarChart({
  data,
  className
}: RadarChartProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard
        className={cn("space-y-4 p-6", className)}>
        <h3 className="text-lg font-semibold text-white">
          Skills Overview
        </h3>

        <div className="h-80 w-full">
          <ResponsiveContainer
            width="100%"
            height="100%">
            <RechartsRadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#d4d4d8", fontSize: 12 }} />

              <PolarRadiusAxis
                domain={[0, 100]}
                tick={{ fill: "#71717a", fontSize: 10 }} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.35}
              />
            </RechartsRadarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </motion.div>
  );
}