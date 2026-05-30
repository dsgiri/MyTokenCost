"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SpendVsNodeComponent from "@/components/calculators/SpendVsNode";

export default function SpendVsNodePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header Grid */}
      <div className="relative overflow-hidden pt-20 pb-12 border-b border-slate-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.05),rgba(255,255,255,0))]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-4 text-left">
          <Link 
            href="/calc" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-455 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Calculators Hub
          </Link>
          
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white leading-tight">
            Cloud LLM API Spend vs. <span className="bg-gradient-to-r from-emerald-455 to-cyan-455 bg-clip-text text-transparent">Bare-Metal Node ROI</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-semibold leading-relaxed">
            Project capital payback curves comparing continuous cloud LLM API subscriptions against localized bare-metal hardware nodes. Own your nodes to reclaim gross margins.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-900 rounded-3xl p-6 sm:p-8">
          <SpendVsNodeComponent />
        </div>
      </div>

    </div>
  );
}
