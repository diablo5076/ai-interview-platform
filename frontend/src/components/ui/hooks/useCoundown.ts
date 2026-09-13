"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseCountdownOptions {
  initialTime: number;
  autoStart?: boolean;
  onComplete?: () => void;
}

export function useCountdown({
  initialTime,
  autoStart = true,
  onComplete,
}: UseCountdownOptions) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);
  
  const reset = useCallback(() => {
    stop();
    setTimeLeft(initialTime);
    setIsRunning(autoStart);
  }, [autoStart, initialTime, stop]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stop();
          onComplete?.();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
    return () => stop();
  }, [isRunning, onComplete, stop]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return {
    timeLeft,
    formattedTime,
    isRunning,
    start,
    stop,
    reset,
  };
}