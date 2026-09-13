"use client";

import { useEffect } from "react";

interface FullscreenMonitorProps {
  onViolation: (message: string) => void;
}

export default function FullscreenMonitor({
  onViolation,
}: FullscreenMonitorProps) {
  useEffect(() => {
    const handleFullscreen = () => {
      if (!document.fullscreenElement) {
        onViolation("Candidate exited fullscreen.");
      }
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreen
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreen
      );
    };
  }, [onViolation]);

  return null;
}