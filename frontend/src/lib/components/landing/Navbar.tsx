"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Menu } from "lucide-react";

const navLinks = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Interview", href: "/interview" },
  { name: "History", href: "/interview/history" },
  { name: "Resume", href: "/resume" },
  { name: "Profile", href: "/profile" },
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.5,
      }}
      className="
        fixed
        top-0
        z-50
        w-full
        border-b
        border-white/10
        bg-black/70
        px-4
        backdrop-blur-xl
      "
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}

        <Link
          href="/"
          className="
            text-2xl
            font-bold
            tracking-tight
            text-white
            transition-opacity
            duration-300
            hover:opacity-80
          "
        >
          Interview
          <span
            className="
              bg-gradient-to-r
              from-blue-400
              to-cyan-400
              bg-clip-text
              text-transparent
            "
          >
            AI
          </span>
        </Link>

        {/* Desktop Navigation */}

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="
                text-sm
                font-medium
                text-gray-400
                transition-all
                duration-300
                hover:text-white
              "
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Side */}

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/login"
            className="
              text-sm
              font-medium
              text-gray-300
              transition-colors
              duration-300
              hover:text-white
            "
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="
              rounded-xl
              bg-blue-600
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition-all
              duration-300
              hover:scale-105
              hover:bg-blue-500
              hover:shadow-lg
              hover:shadow-blue-500/20
            "
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu */}

        <button
          type="button"
          aria-label="Open navigation menu"
          className="
            rounded-lg
            border
            border-white/10
            p-2
            text-white
            transition
            duration-300
            hover:bg-white/10
            lg:hidden
          "
        >
          <Menu size={22} />
        </button>
      </div>
    </motion.header>
  );
}