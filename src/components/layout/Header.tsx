"use client";

import { useState } from "react";
import Link from 'next/link';
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { TextScaleToggle } from "./TextScaleToggle";
import { HeaderAuthActions } from "./HeaderAuthActions";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-slate-200/80 dark:border-slate-800 bg-white/85 dark:bg-black/90 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Group */}
        <Link 
          href="/calc" 
          className="flex items-center space-x-3 group hover:opacity-90 transition-opacity select-none cursor-pointer"
        >
          <svg className="w-8 h-8 flex-shrink-0 transition-transform group-hover:scale-[1.03]" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" className="stroke-blue-600 dark:stroke-[#00f0ff]" strokeWidth="2.5" />
            <path d="M10 11h12v3.5h-4.25V22h-3.5v-7.5H10V11z" className="fill-blue-600 dark:fill-[#00f0ff]" />
          </svg>
          <div className="flex flex-col text-left">
            <span className="font-space-grotesk font-bold text-lg tracking-wider text-slate-950 dark:text-white leading-none">
              MyToken<span className="text-blue-600 dark:text-[#00f0ff]">Cost</span>.com
            </span>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 tracking-tight transition-colors hidden sm:inline-block">Real-time AI Infrastructure & Compliance Audit</span>
          </div>
        </Link>
        
        {/* Actions & Navigation Group */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          
          {/* Grouped Public Navigation (Separated by subtle border) */}
          <nav className="hidden lg:flex items-center space-x-6 border-r border-slate-200 dark:border-slate-800 pr-6 mr-2 transition-colors">
            <Link href="/blueprints" className="text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition uppercase tracking-wider font-semibold">
              Blueprints
            </Link>
            <Link href="/blogs" className="text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition uppercase tracking-wider font-semibold">
              Intelligence
            </Link>
            <Link href="/playground" className="text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition uppercase tracking-wider font-semibold">
              Playground
            </Link>
            <Link href="/pricing" className="text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition uppercase tracking-wider font-semibold">
              Pricing
            </Link>
          </nav>

          {/* User Operations & primary transaction trigger */}
          <div className="flex items-center space-x-3.5">
            <TextScaleToggle />
            <ThemeToggle />
            <HeaderAuthActions />

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-black px-4 py-6 space-y-6 animate-fade-in transition-colors duration-300">
          <nav className="flex flex-col space-y-4 px-2">
            <Link 
              href="/blueprints" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition uppercase tracking-wider font-semibold"
            >
              Blueprints
            </Link>
            <Link 
              href="/blogs" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition uppercase tracking-wider font-semibold"
            >
              Intelligence
            </Link>
            <Link 
              href="/playground" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition uppercase tracking-wider font-semibold"
            >
              Playground
            </Link>
            <Link 
              href="/pricing" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition uppercase tracking-wider font-semibold"
            >
              Pricing
            </Link>
          </nav>
          <div className="border-t border-slate-200 dark:border-slate-800/80 pt-6 px-2">
            <HeaderAuthActions isDrawer={true} />
          </div>
        </div>
      )}
    </header>
  );
}
