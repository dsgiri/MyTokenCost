"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, Menu, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

interface PortalSidebarProps {
  greetingName: string;
  role: string;
}

export function PortalSidebar({ greetingName, role }: PortalSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/portal",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      href: "/portal/audits",
      label: "My Audits",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      href: "/portal/settings",
      label: "Settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  const getLinkClass = (href: string) => {
    const isActive = pathname === href;
    return `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer font-semibold text-sm ${
      isActive
        ? "bg-slate-800 text-white"
        : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
    }`;
  };

  const getIconClass = (href: string) => {
    const isActive = pathname === href;
    return isActive ? "text-[#00f0ff]" : "";
  };

  return (
    <>
      {/* ========================================== */}
      {/* MOBILE TOP STICKY BAR (< md / 768px)       */}
      {/* ========================================== */}
      <div className="md:hidden sticky top-0 z-30 w-full h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 transition-colors">
        <button
          onClick={toggleMobileSidebar}
          className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Toggle Portal Navigation Menu"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <Link href="/" className="font-space-grotesk font-black text-lg text-white tracking-tighter">
          MyToken<span className="text-[#00f0ff]">Cost</span>
        </Link>

        <div className="flex items-center">
          <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-md" } }} />
        </div>
      </div>

      {/* ========================================== */}
      {/* MOBILE SIDEBAR DRAWER OVERLAY & MENU       */}
      {/* ========================================== */}
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={closeMobileSidebar}
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] transition-opacity animate-fade-in"
          />

          {/* Drawer Menu */}
          <aside className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col animate-slide-in">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center h-16">
              <div className="flex flex-col">
                <Link href="/" className="font-space-grotesk font-black text-lg text-white tracking-tighter leading-none">
                  MyToken<span className="text-[#00f0ff]">Cost</span>
                </Link>
                <span className="text-[8px] text-emerald-400 font-mono tracking-widest uppercase mt-0.5">
                  Client Portal
                </span>
              </div>
              <button
                onClick={closeMobileSidebar}
                className="p-1 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 pt-6">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileSidebar}
                  className={getLinkClass(item.href)}
                >
                  <span className={getIconClass(item.href)}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="p-5 border-t border-slate-800 space-y-2.5">
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                Active User: <span className="text-white font-bold block truncate mt-0.5">{greetingName}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                Active Role: <span className="text-[#00f0ff] font-bold block mt-0.5">{role}</span>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* ========================================== */}
      {/* DESKTOP STATIC SIDEBAR (>= md / 768px)    */}
      {/* ========================================== */}
      <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 flex-col h-screen sticky top-0 text-left">
        <div className="p-6 border-b border-slate-800 h-16 flex items-center justify-between">
          <div className="flex flex-col">
            <Link href="/" className="font-space-grotesk font-black text-xl text-white tracking-tighter leading-none">
              MyToken<span className="text-[#00f0ff]">Cost</span>
            </Link>
            <div className="mt-1 text-[10px] text-emerald-400 font-mono tracking-widest uppercase">
              Client Portal
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 pt-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={getLinkClass(item.href)}
            >
              <span className={getIconClass(item.href)}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex w-full items-center justify-between px-2 py-2">
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Account</span>
              <span className="text-xs text-white font-bold truncate max-w-[120px] mt-0.5">{greetingName}</span>
            </div>
            <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-md" } }} />
          </div>
        </div>
      </aside>
    </>
  );
}
