
export const ease = {
  linear: "linear",

  anticipate: [0.36, 0, 0.66, -0.56] as const,
  standard: [0.4, 0, 0.2, 1] as const,
  decelerate: [0,0,0.2,1] as const,  
  accelerate: [0.4,0,1,1] as const,
  emphasized: [0.2,0,0,1] as const,
};