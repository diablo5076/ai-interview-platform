"use client";

import { motion } from "motion/react";
import { UserRound, MessageSquareText, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: UserRound,
    number: "01",
    title: "Choose Your Role",
    description: "Select your job role, experience level, and interview type to generate personalized questions."
  },
  {
    icon: MessageSquareText,
    number: "02",
    title: "Take the AI Interview",
    description: "Answer realistic interview questions while the AI evaluates your communication and technical resonses.",
    
  },
  {
    icon: BarChart3,
    number: "03",
    title: "Receive Instant Feedback",
    description: "Get detailed insights, performance scores, strengths, weaknesses, and improvement suggestions."
  },
];

export default function HowItWorks() {
  return (
    <section className="relative bg-black py-28 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
            How It Works
          </p>
        
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Three simple Steps To Get Interview Ready
          </h2>
                  
          <p className="mt-6 text-lg text-gray-400">
            Practice smarter with an AI-powered workflow designed to improve
            your confidence before real interviews.
          </p>
        </motion.div>

        <div className="relative mt-24 grid gap-8 lg:grid-cols-3">
          <div className="absolute left-0 right-0 top-10 hidden h-px bg-white/10 lg:block"/>
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.number} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.15, }} viewport={{ once: true }} whileHover={{ y: -10 }} className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all duration-300 hover:border-blue-500/40 hover:bg-white/10">
                  <div className="absolute -top-6 left-8 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
                    {step.number}
                  </div>
                  <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-400">
                    <Icon size={30} />
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-2xl font-semibold">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
        </div>
      </div>
    </section>
  );
}