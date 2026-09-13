"use client";

import { useEffect } from "react";

interface TabMonitorProps {
  onViolation: (message: string) => void;
}

export default function TabMonitor({
  onViolation,
}: TabMonitorProps) {
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        onViolation("Candidate switched tabs.");
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, [onViolation]);

  return null;
}