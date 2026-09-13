"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does the AI interview work?",
    answer: "Choose your role, experience level, and interview type. The AI generates relevant questions, evaluates your responses, and provides detailed feedback after the session.",
  },
  {
    question: "Is the platform free to use?",
    answer: "Yes. You can start practicing for free. Additional premium features may be introduced in the future.",
  },
  {
    question: "Can I practice for different job roles?",
    answer:
      "Yes. The platform supports multiple technical roles and experience levels, with interview questions tailored to each selection.",
  },
  {
    question: "Will I receive feedback after every interview?",
    answer:
      "Absolutely. After each session, you'll receive AI-generated feedback covering communication, technical knowledge, confidence, and areas for improvement.",
  },
];
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-black py-28 text-white">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
            FAQ
          </p>

          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Frequently Asked Questions
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-400">
            Everything you need to know before starting your AI interview journey.
          </p>
        </motion.div>
        <div className="mt-16 space-y-5">
          {faqs.map((faq, index) => (
            <motion.div key={faq.question} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.4 }} viewport={{ once: true }} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="flex w-full items-center justify-between px-6 py-5 text-left">
                <span className="text-lg font-semibold">
                  {faq.question}
                </span>
                <motion.div animate={{ rotate: openIndex === index ? 180 : 0, }} transition={{ duration: 0.25 }}>
                  <ChevronDown />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ duration: 0.3 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="px-6 pb-6 leading-7 text-gray-400">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
