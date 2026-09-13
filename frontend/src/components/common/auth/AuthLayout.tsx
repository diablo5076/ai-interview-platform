"use client";

import { ReactNode, useEffect, useState } from "react";
import { motion } from "motion/react";
import { fadeIn } from "@/animations";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  className,
}: AuthLayoutProps) {
  const [mousePosition, setMousePosition] = useState({
    x: 50,
    y: 50,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-4 py-10 text-white">
      {/* ===================================================== */}
      {/* BACKGROUND */}
      {/* ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Mouse-following glow */}

        <motion.div
          className="absolute h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[120px]"
          animate={{
            left: `${mousePosition.x - 15}%`,
            top: `${mousePosition.y - 15}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 30,
            damping: 30,
          }}
        />

        {/* Top purple orb */}

        <motion.div
          className="absolute -left-32 -top-32 h-[450px] w-[450px] rounded-full bg-purple-700/20 blur-[120px]"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Bottom blue orb */}

        <motion.div
          className="absolute -bottom-40 -right-32 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[130px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Animated grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
            [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]
            [background-size:50px_50px]
          "
        />

        {/* Vignette */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#050505_85%)]" />
      </div>

      {/* ===================================================== */}
      {/* FLOATING PARTICLES */}
      {/* ===================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 18 }).map((_, index) => (
          <motion.span
            key={index}
            className="absolute h-1 w-1 rounded-full bg-purple-400/40"
            style={{
              left: `${(index * 37) % 100}%`,
              top: `${(index * 61) % 100}%`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + (index % 4),
              repeat: Infinity,
              delay: index * 0.25,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ===================================================== */}
      {/* MAIN CONTENT */}
      {/* ===================================================== */}

      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        {/* Brand */}

        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mb-7 text-center"
        >
          <div className="mb-4 flex justify-center">
            <motion.div
              whileHover={{
                rotate: 10,
                scale: 1.08,
              }}
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                border
                border-purple-500/30
                bg-purple-500/10
                shadow-[0_0_40px_rgba(168,85,247,0.2)]
              "
            >
              <span className="text-2xl font-bold text-purple-400">
                AI
              </span>
            </motion.div>
          </div>

          <h2 className="text-xl font-semibold tracking-tight text-white">
            AI Interview
          </h2>

          <p className="mt-1 text-xs text-zinc-500">
            Intelligent interviews. Better preparation.
          </p>
        </motion.div>

        {/* ================================================= */}
        {/* LOGIN CARD */}
        {/* ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.65,
            delay: 0.1,
            ease: "easeOut",
          }}
          whileHover={{
            y: -3,
          }}
        >
          <GlassCard
            className={cn(
              `
                relative
                w-full
                space-y-6
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-zinc-950/75
                p-8
                shadow-[0_25px_80px_rgba(0,0,0,0.55)]
                backdrop-blur-2xl
              `,
              className
            )}
          >
            {/* Card top glow */}

            <div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/70 to-transparent" />

            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-purple-600/10 blur-3xl" />

            {/* Heading */}

            <div className="relative space-y-2 text-center">
              <motion.h1
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 0.3,
                }}
                className="text-3xl font-bold tracking-tight text-white"
              >
                {title}
              </motion.h1>

              {subtitle && (
                <p className="text-sm text-zinc-400">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Form */}

            <div className="relative">
              {children}
            </div>
          </GlassCard>
        </motion.div>

        {/* Security message */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.8,
          }}
          className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-600"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

          Secure authentication
        </motion.div>
      </motion.div>
    </main>
  );
}