"use client";

import { motion } from "motion/react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer @ Google",
    review: "The AI feedback was surprisingly accurate. It helped me improve my communication, and I cleared my interviews with much more confidence."
  },
  {
    name: "Rahul Sharma",
    role: "Frontend Developer @ Amazon",
    review: "The mock interviews felt incredibly realistic. The analytics showed exactly where I needed to improve.",
  },
  {
    name: "Emily Chen",
    role: "SDE @ Microsoft",
    review:
      "One of the best interview preparation tools I've used. The detailed feedback made a huge difference.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-black py-28 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
            Testimonials
          </p>

          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Loved by Job Seekers Worldwide
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-400">
            Thousands of candidates use our platform to prepare smarter,
            improve faster, and land better opportunities.
          </p>
        </motion.div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div key={testimonial.name} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.15 }} viewport={{ once: true }} whileHover={{y: -8}} className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all duration-300 hover:border-blue-500/40 hover:bg-white/10">
                      <div className="flex gap-1 text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={18} fill="currentColor"/>
                        ))}
                      </div>

                      <p className="mt-6 leading-8 text-gray-300">
                        &ldquo;{testimonial.review}&rdquo;
                      </p>
                      <div className="mt-8">
                        <h3 className="font-semibold">
                          {testimonial.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {testimonial.role}
                        </p>
                      </div>                
                    </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
