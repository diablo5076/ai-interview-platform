"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, User, LogOut, FileText, History } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    router.push("/login");
  };

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      href: "/resume",
      label: "Resume",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      href: "/history",
      label: "History",
      icon: <History className="h-4 w-4" />,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: <User className="h-4 w-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="text-3xl font-bold tracking-tight transition hover:opacity-90"
        >
          <span className="text-white">Interview </span>
          <span className="text-white">AI</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "border border-primary/30 bg-white/10 text-white backdrop-blur-md shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                    : "border border-transparent text-zinc-400 hover:border-white/10 hover:bg-white/5 hover:text-white"
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <Button
          variant="primary"
          onClick={handleLogout}
          className="px-6"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}