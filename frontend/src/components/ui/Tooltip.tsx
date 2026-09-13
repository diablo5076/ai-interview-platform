"use client";

import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}


export default function Tooltip({
  content,
  children,
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.div role="tooltip"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-2 text-sm text-white shadow-xl",
              className
            )}
          >
            {content}
            <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 rotate-45 bg-zinc-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}