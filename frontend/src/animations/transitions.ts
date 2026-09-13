import { ease } from "./easing";

export const transitions = {
  fast: {
    duration: 0.18,
    ease: ease.decelerate,
  },

  normal: {
    duration: 0.28,
    ease: ease.decelerate,
  },

  slow: {
     duration: 0.45,
     ease: ease.decelerate,
   },

  spring: {
    type: "spring" as const,
    stiffness: 300,
    damping: 25,
  },

  bounce: {
    type: "spring" as const,
    stiffness: 400,
    damping: 18,
  },
};