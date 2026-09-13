"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Menu } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];


export default function Navbar() {
  return (
    <motion.header initial={{ opacity: 0, y: -25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          <span className="text-white">Interview</span>
          <span className="text-blue-500">AI</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/login" className="text-sm font-medium text-gray-300 transition hover:text-white">
            Login
          </Link>
          <Link href="/signup" className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500">
            Get Started
          </Link>
        </div>

        <button className="md:hidden">
          <Menu className="h-6 w-6 text-white" />
        </button>
      </nav>
    </motion.header>
  );
}