"use client";

import { fadeIn } from "@/animations";
import { motion } from "motion/react";
import type { HTMLMotionProps,  Variants } from "motion/react";
import type { ReactNode } from "react";

interface AnimatedDivProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  variants?: Variants;
}

export default function AnimatedDiv({
  children,
  variants,
  className,
  ...props
}: AnimatedDivProps) {
  return (
    <motion.div variants={variants ?? fadeIn} initial="hidden" animate="visible" exit="exit" className={className} {...props}>
      {children}
    </motion.div>
  )
}