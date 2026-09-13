"use client";

import { useMemo } from "react";
import { fadeIn, slideDown, slideLeft, slideRight, slideUp, scaleIn, staggerContainer, pageTransition } from "@/animations";

export function useAnimations() {
  return useMemo(() => ({
    fadeIn, slideDown, slideLeft, slideRight, slideUp, scaleIn, staggerContainer, pageTransition,
  }), []);
}