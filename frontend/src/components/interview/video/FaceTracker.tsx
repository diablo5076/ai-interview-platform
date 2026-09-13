"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ScanFace } from "lucide-react";

import { fadeIn } from "@/animations";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

import FaceStatusBadge from "./FaceStatusBadge";
import HeadPoseIndicator, {
  type HeadDirection,
} from "./HeadPoseIndicator";

export interface FaceTrackerResult {
  hasFace: boolean;
  faceCount: number;
  headDirection: HeadDirection;
}

interface FaceTrackerProps {
  stream: MediaStream | null;
  onTracking?: (result: FaceTrackerResult) => void;
  className?: string;
}

export default function FaceTracker({
  stream,
  onTracking,
  className,
}: FaceTrackerProps) {
  const [hasFace, setHasFace] = useState(false);
  const [faceCount, setFaceCount] = useState(0);
  const [headDirection, setHeadDirection] =
    useState<HeadDirection>("Unknown");

  useEffect(() => {
    if (!stream) {
      setHasFace(false);
      setFaceCount(0);
      setHeadDirection("Unknown");
      return;
    }

    /**
     * MediaPipe integration will go here.
     *
     * We'll update:
     *
     * setHasFace(...)
     * setFaceCount(...)
     * setHeadDirection(...)
     */

    onTracking?.({
      hasFace,
      faceCount,
      headDirection,
    });
  }, [
    stream,
    hasFace,
    faceCount,
    headDirection,
    onTracking,
  ]);

  const status =
    faceCount === 0
      ? "No Face"
      : faceCount === 1
      ? "Face Detected"
      : "Multiple Faces";

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <GlassCard
        className={cn("space-y-6 p-6", className)}
      >
        <div className="flex items-center gap-3">
          <ScanFace
            className="h-7 w-7 text-primary"
            aria-hidden="true"
          />

          <div>
            <h2 className="text-lg font-semibold text-white">
              Face Tracking
            </h2>

            <p className="text-sm text-zinc-400">
              Live AI proctoring status
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <FaceStatusBadge status={status} />

          <span className="text-sm text-zinc-400">
            Faces Detected:
            <span className="ml-2 font-semibold text-white">
              {faceCount}
            </span>
          </span>
        </div>

        <HeadPoseIndicator
          direction={headDirection}
        />
      </GlassCard>
    </motion.div>
  );
}