"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListPlus, Lightbulb, User, Settings, Leaf } from "lucide-react";
import clsx from "clsx";

export default function Sidebar() {
  const currentPath = usePathname();
  const navItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Log Activity", href: "/log", icon: ListPlus },
    { name: "Insights", href: "/insights", icon: Lightbulb },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-screen fixed top-0 left-0 glass flex-col p-6 z-20 border-r border-[rgba(255,255,255,0.1)]">
        <div className="flex items-center gap-3 mb-10 text-[var(--primary)] text-glow">
          <Leaf className="w-8 h-8 shrink-0" />
          <h1 className="text-2xl font-bold tracking-tight text-white">Lumina<span className="text-[var(--primary)]">Carbon</span></h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300",
                  isActive 
                    ? "bg-[rgba(57,255,20,0.1)] text-[var(--primary)] border border-[rgba(57,255,20,0.2)] box-glow" 
                    : "text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="font-semibold text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto glass rounded-xl p-4 text-center">
          <p className="text-xs text-gray-400 mb-2">Monthly Goal</p>
          <div className="w-full bg-[rgba(255,255,255,0.1)] rounded-full h-2">
            <div className="bg-[var(--primary)] h-2 rounded-full box-glow" style={{ width: '60%' }}></div>
          </div>
          <p className="text-xs text-white mt-2 font-semibold text-glow">60% Complete</p>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#0A0A0A] z-30 flex justify-around items-center p-2 border-t border-[rgba(255,255,255,0.1)] safe-area-pb">
        {navItems.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex flex-col items-center p-2 rounded-lg transition-all",
                isActive 
                  ? "text-[var(--primary)] text-glow" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] mt-1 font-medium hidden sm:block">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
