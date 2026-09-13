"use client";

import { useEffect, useRef, type RefObject } from "react";
import { motion } from "motion/react";
import { CameraOff } from "lucide-react";

import { fadeIn } from "@/animations";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

interface WebcamPreviewProps {
  stream: MediaStream | null;
  isCameraOn: boolean;
  videoRef?: RefObject<HTMLVideoElement | null>;
  className?: string;
}

export default function WebcamPreview({
  stream,
  isCameraOn,
  videoRef,
  className,
}: WebcamPreviewProps) {
  const internalRef = useRef<HTMLVideoElement>(null);

  const activeRef = videoRef ?? internalRef;

  useEffect(() => {
    const videoElement = activeRef.current;
  
    if (!videoElement) return;
  
    videoElement.srcObject = stream ?? null;
  
    return () => {
      videoElement.srcObject = null;
    };
  }, [stream, activeRef]);

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard
        className={cn("overflow-hidden p-4", className)}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Live Camera
          </h3>

          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              isCameraOn
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-red-500/20 text-red-400"
            )}
          >
            {isCameraOn ? "Online" : "Offline"}
          </span>
        </div>

        {isCameraOn && stream ? (
          <video
            ref={activeRef}
            autoPlay
            muted
            playsInline
            className="aspect-video w-full rounded-xl object-cover scale-x-[-1]"
          />
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-white/5 text-zinc-400">
            <CameraOff
              className="h-10 w-10"
              aria-hidden="true"
            />

            <p className="mt-2 text-sm">
              Camera is off
            </p>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}