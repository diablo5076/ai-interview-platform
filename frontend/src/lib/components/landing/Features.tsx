"use client";

import { motion } from "motion/react";
import { Brain, Mic, BarChart3, Clock, FileText, Sparkles } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Feedback",
    description: "Receive detailed AI-powered feedback on every answer to improve your communication and technical skills"
  },
  {
    icon: Mic,
    title: "Real Interview Experience",
    description: "Practice with realistic interview questions in a distraction-free environment.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track your scores, identify weak areas, and measure your improvement over time.",
  },
  {
    icon: Clock,
    title: "Timed Sessions",
    description: "Simulate real interview pressure with configurable timers and session limits.",
  },
  {
    icon: FileText,
    title: "Interview History",
    description: "Review previous interviews, answers, and AI feedback whenever you want.",
  },
  {
    icon: Sparkles,
    title: "Smart Question Generation",
    description: "Generate personalized interview questions based on your role and experience level.",
  },
];

export default function Features() {
  return (
    <section className="bg-black py-28 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
            Features
          </p>

          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Everything You need To Crack Your Next Interview
          </h2>
          <p className="mt-6 text-lg text-gray-400">
            From AI-powered feedback to performance tracking, our platform provide every tool needed to prepare with confidence.
          </p>
        </motion.div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1, }} viewport={{ once: true }} whileHover={{ y: -8 }} className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all duration-300 hover:border-blue-500/40 hover:bg-white/10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-400 transition-colors duration-300 group-hover:bg-blue-500 group-hover:text-white">
                  <Icon size={28}/>
                </div>

                <h3 className="mt-8 text-2xl font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  )
}