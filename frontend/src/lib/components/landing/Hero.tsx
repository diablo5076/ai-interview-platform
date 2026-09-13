"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, PlayCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-black text-white">
      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-[180px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 pt-28 text-center">
        <motion.span initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
          AI-Powered Mock Interviews
        </motion.span>

        <motion.h1 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="mt-8 max-w-5xl text-5xl font-bold leading-tight md:text-7xl lg:text-8xl">
          Ace Every Interview
          <br />
          With{" "}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            AI Feedback
          </span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }} className="mt-10 max-w-2xl text-lg leading-8 text-gray-400">
          Practice realistic interviews, receive detailed AI feedback,
          improve communication, and track your progress—all in one place.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="mt-12 flex flex-col gap-4 sm:flex-row">
          <Link href="/signup" className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold transition-all duration-300 hover:scale-105 hover:bg-blue-500">
            Start Free
            <ArrowRight size={18} />
          </Link>
          <button className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-8 py-4 font-semibold transition-all duration-300 hover:scale-105 hover:bg-white/5">
            <PlayCircle size={18} />
            Watch Demo
          </button>
        </motion.div>
      </div>
    </section>
  )
}