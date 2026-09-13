import { transitions } from "./transitions";

export const fadeIn = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
    transition: transitions.normal,
  },
  exit: {
      opacity: 0,
      transition: transitions.fast,
    },
};

export const slideUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
  exit: {
      opacity: 0,
      transition: transitions.fast,
    },
};

export const slideDown = {
  hidden: {
    opacity: 0,
    y: -40,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
  exit: {
      opacity: 0,
      transition: transitions.fast,
    },
};

export const slideLeft = {
  hidden: {
    opacity: 0,
    x: 24,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.normal
  },
  exit: {
      opacity: 0,
      transition: transitions.fast,
    },
};

export const slideRight = {
  hidden: {
    opacity: 0,
    x: -40,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.normal,
  },
  exit: {
      opacity: 0,
      transition: transitions.fast,
    },
};

export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },

  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },
  exit: {
      opacity: 0,
      transition: transitions.fast,
    },
};

export const staggerContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

export const pageTransition = {
  hidden: {
    opacity: 0,
    y: 15
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },

  exit: {
    opacity: 0,
    y: -15,
    transition: transitions.fast,
  },
};