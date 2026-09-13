"use client";

import { cn } from "@/lib/utils";

import type { HeadDirection } from "./HeadPoseIndicator";

import FaceTracker from "./FaceTracker";
import ViolationCounter from "./ViolationCounter";

interface ProctoringOverlayProps {
  stream: MediaStream | null;

  noFace: number;
  multipleFaces: number;
  lookingAway: number;
  tabSwitches: number;
  fullscreenExit: number;

  headDirection: HeadDirection;

  className?: string;
}

export default function ProctoringOverlay({
  stream,

  noFace,
  multipleFaces,
  lookingAway,
  tabSwitches,
  fullscreenExit,

  className,
}: ProctoringOverlayProps) {
  return (
    <div
      className={cn(
        "space-y-6",
        className
      )}
    >
      <FaceTracker
        stream={stream}
      />

      <ViolationCounter
        noFace={noFace}
        multipleFaces={multipleFaces}
        lookingAway={lookingAway}
        tabSwitches={tabSwitches}
        fullscreenExit={fullscreenExit}
      />
    </div>
  );
}