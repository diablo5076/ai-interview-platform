"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Expand, Shrink } from "lucide-react";
import { fadeIn } from "@/animations";
import Button from "@/components/ui/Button";

interface FullscreenToggleProps {
  target?: HTMLElement | null;
  className?: string;
}

export default function FullscreenToggle({
  target,
  className,
}: FullscreenToggleProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await (target ?? document.documentElement).requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Failed to toggle fullscreen:", error);
    }
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible">
      <Button
        variant="secondary"
        onClick={toggleFullscreen}
        className={className}>
        {isFullscreen ? (
          <>
            <Shrink
              className="mr-2 h-4 w-4"
              aria-hidden="true" />
            Exit Fullscreen
          </>
        ) : (
          <>
            <Expand
              className="mr-2 h-4 w-4"
              aria-hidden="true" />
            Fullscreen
          </>
        )}
      </Button>
    </motion.div>
  );
}