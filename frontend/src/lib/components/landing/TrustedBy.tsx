"use client";

import { motion } from "motion/react";

const companies = [
  "Google", "Microsoft", "Amazon", "Meta", "Netflix", "Adobe",
];


export default function TrustedBy() {
  return (
    <section className="border-y border-white/10 bg-black py-16">
      <div className="mx-auto max-w-7xl px-6">
        <motion.p initial={{ opacity: 0, y: 2 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-center text-sm font-medium uppercase tracking-[0.3em] text-gray-500">
          Trusted by candidates preparing for interview at
        </motion.p>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} viewport={{ once: true }} className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {companies.map((company) => (
            <div key={company} className="flex h-16 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg font-semibold text-gray-400 transition-all duration-300 hover:border-blue-500/30 hover:bg-white/10 hover:text-white">
              {company}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}