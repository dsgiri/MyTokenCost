"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";

interface HeaderAuthActionsProps {
  isDrawer?: boolean;
}

export function HeaderAuthActions({ isDrawer = false }: HeaderAuthActionsProps) {
  const [mounted, setMounted] = useState(false);
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR or before client hydration / Clerk loader completes,
  // render the static fallback Signed-Out visual layout to ensure perfect DOM tree matching.
  if (!mounted || !isLoaded) {
    if (isDrawer) {
      return (
        <div className="flex flex-col space-y-3 w-full">
          <div className="w-full bg-slate-900 border border-slate-800 text-slate-400 font-bold py-3.5 rounded-xl text-center text-xs tracking-wider uppercase opacity-50">
            Loading Account...
          </div>
          <Link href="/contact?type=demo" className="w-full bg-blue-600 text-white dark:bg-[#00f0ff] dark:text-slate-950 font-extrabold py-3.5 rounded-xl text-center text-xs tracking-wider uppercase shadow-md shadow-blue-500/10 dark:shadow-cyan-500/5">
            Book a Demo
          </Link>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-3.5">
        <button className="hidden md:inline-flex text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition uppercase tracking-wider font-bold opacity-0 pointer-events-none">
          Client Login
        </button>
        <div className="w-8 h-8 rounded-md bg-transparent" />
        <Link href="/contact?type=demo" className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-500 dark:bg-[#00f0ff] dark:hover:bg-[#00d8e6] text-white dark:text-slate-950 font-extrabold px-4.5 py-2.5 rounded-xl text-xs tracking-wider uppercase transition-all shadow-md shadow-blue-500/10 dark:shadow-cyan-500/5 hover:scale-[1.02] active:scale-[0.98]">
          Book a Demo
        </Link>
      </div>
    );
  }

  if (isDrawer) {
    return (
      <div className="flex flex-col space-y-3 w-full">
        {!userId ? (
          <>
            <SignInButton mode="modal">
              <button className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white font-extrabold py-3.5 rounded-xl text-xs tracking-wider uppercase transition cursor-pointer text-center">
                Client Login
              </button>
            </SignInButton>
          </>
        ) : (
          <>
            <Link href="/portal" className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[#00f0ff] hover:text-white font-extrabold py-3.5 rounded-xl text-xs tracking-wider uppercase transition text-center">
              Dashboard
            </Link>
          </>
        )}

        <Link href="/contact?type=demo" className="w-full bg-blue-600 hover:bg-blue-500 dark:bg-[#00f0ff] dark:hover:bg-[#00d8e6] text-white dark:text-slate-950 font-extrabold py-3.5 rounded-xl text-xs tracking-wider uppercase transition-all shadow-md shadow-blue-500/10 dark:shadow-cyan-500/5 hover:scale-[1.02] active:scale-[0.98] text-center">
          Book a Demo
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3.5">
      {!userId ? (
        <>
          <SignInButton mode="modal">
            <button className="hidden md:inline-flex text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition uppercase tracking-wider font-bold cursor-pointer">
              Client Login
            </button>
          </SignInButton>
          <div className="w-8 h-8 rounded-md bg-transparent" />
        </>
      ) : (
        <>
          <Link href="/portal" className="hidden md:inline-flex text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition uppercase tracking-wider font-bold">
            Dashboard
          </Link>
          <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-md" } }} />
        </>
      )}

      <Link href="/contact?type=demo" className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-500 dark:bg-[#00f0ff] dark:hover:bg-[#00d8e6] text-white dark:text-slate-950 font-extrabold px-4.5 py-2.5 rounded-xl text-xs tracking-wider uppercase transition-all shadow-md shadow-blue-500/10 dark:shadow-cyan-500/5 hover:scale-[1.02] active:scale-[0.98]">
        Book a Demo
      </Link>
    </div>
  );
}
