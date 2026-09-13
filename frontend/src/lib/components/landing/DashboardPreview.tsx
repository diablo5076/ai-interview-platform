"use client";

import { motion } from "motion/react";
import { Bot, Camera, Mic, MicOff, Video, BarChart3, CheckCircle2 } from "lucide-react";

export default function DashboardPreview() {
  return (
    <section className="relative overflow-hidden bg-black py-32 text-white">
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-[180px]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
            Dashboard Preview
          </p>
        
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Experience Interviews Like Never Before
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            Practice in a realistic AI interview environment with live
            feedback, analytics, and performance tracking.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} viewport={{ once: true }} className="mt-20 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-white/10 bg-neutral-900 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="text-blue-400" size={22} />
                  <span className="font-semibold">
                    AI Interview Session
                  </span>
                </div>

                <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
                  Live
                </span>
              </div>

              <div className="mt-6 flex aspect-video items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900">
                <Camera size={60} className="text-gray-500" />
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <button className="rounded-full bg-white/10 p-4 hover:bg-white/20 transition">
                  <Mic size={20} />
                </button>

                <button className="rounded-full bg-red-500 p-4">
                  <MicOff size={20} />
                </button>
                <button className="rounded-full bg-white/10 p-4 hover:bg-white/20 transition">
                  <Video size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="text-blue-400" />
                  <h3 className="font-semibold">
                    Performance Score
                  </h3>
                </div>
                <p className="mt-6 text-5xl font-bold text-blue-400">
                  92%
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Excellent communication and problem-solving.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-400" />
                  <h3 className="font-semibold">
                    AI Feedback
                  </h3>
                </div>

                <ul className="mt-5 space-y-3 text-sm text-gray-400">
                  <li>✔ Strong confidence</li>
                  <li>✔ Clear communication</li>
                  <li>✔ Good technical depth</li>
                  <li>✔ Improve answer structure</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}