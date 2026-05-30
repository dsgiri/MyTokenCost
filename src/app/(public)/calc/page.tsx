"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Calculator, 
  Search, 
  Sliders, 
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Filter,
  Activity,
  FileText,
  TrendingDown,
  Terminal,
  Droplet,
  Zap,
  Cpu,
  ExternalLink
} from "lucide-react";

import ChatgptAuditor from "@/components/calculators/ChatgptAuditor";
import SubVsApi from "@/components/calculators/SubVsApi";
import ApocalypseBill from "@/components/calculators/ApocalypseBill";
import CarbonAnalogy from "@/components/calculators/CarbonAnalogy";
import ErcotLoad from "@/components/calculators/ErcotLoad";
import WueCooling from "@/components/calculators/WueCooling";
import HhscGenerator from "@/components/calculators/HhscGenerator";
import SpendVsNode from "@/components/calculators/SpendVsNode";

// Interfaces for our registry list of calculators
interface CalcItem {
  id: string;
  title: string;
  category: "B2C Viral" | "B2B Compliance";
  audience: "Individual" | "Operations";
  viralityScore: string;
  tagline: string;
  badge: string;
  path: string;
  icon: React.ReactNode;
}

const CALCULATORS: CalcItem[] = [
  {
    id: "chatgpt-auditor",
    title: "The Personal ChatGPT History Auditor",
    category: "B2C Viral",
    audience: "Individual",
    viralityScore: "9.8/10 (Reddit Critical)",
    tagline: "Upload your exported ChatGPT history zip to see your lifetime token volume, raw provider cost, and data center water footprint.",
    badge: "Spotify Wrapped",
    path: "/calc/chatgpt-auditor",
    icon: <FileText className="w-4 h-4 text-emerald-455" />
  },
  {
    id: "sub-vs-api",
    title: "The $20/mo Sub vs. API Key Break-Even Tool",
    category: "B2C Viral",
    audience: "Individual",
    viralityScore: "9.5/10 (Frugal Hook)",
    tagline: "Calculate if you should keep paying $20/month for flat-rate subscriptions or switch to pay-as-you-go API keys on open-source UIs.",
    badge: "Frugal Tech",
    path: "/calc/sub-vs-api",
    icon: <TrendingDown className="w-4 h-4 text-emerald-455" />
  },
  {
    id: "apocalypse-bill",
    title: "The Runaway Agent 'Apocalypse Bill' Simulator",
    category: "B2C Viral",
    audience: "Individual",
    viralityScore: "8.9/10 (Hacking Retro)",
    tagline: "A gamified 'virtual sandbox' demonstrating how quickly an unmitigated recursive agent loop can bankrupt an API key.",
    badge: "Gamified Loop",
    path: "/calc/apocalypse-bill",
    icon: <Terminal className="w-4 h-4 text-emerald-455" />
  },
  {
    id: "carbon-analogy",
    title: "The Grid-Aware Carbon & Water Analogy Generator",
    category: "B2C Viral",
    audience: "Individual",
    viralityScore: "8.5/10 (ESG Shareable)",
    tagline: "Translate abstract token figures into real-world carbon and water metrics based on coal vs renewable grid zones.",
    badge: "ESG Metrics",
    path: "/calc/carbon-analogy",
    icon: <Droplet className="w-4 h-4 text-cyan-400" />
  },
  {
    id: "ercot-load",
    title: "ERCOT Large Flexible Load Calculator",
    category: "B2B Compliance",
    audience: "Operations",
    viralityScore: "Industrial Mandate",
    tagline: "Automatically computes if tenant AI clusters cross the 10 MW ERCOT threshold that triggers mandatory flexible load tracking.",
    badge: "Texas Grid",
    path: "/calc/ercot-load",
    icon: <Zap className="w-4 h-4 text-emerald-455" />
  },
  {
    id: "wue-cooling",
    title: "WUE Cooling Depletion Risk Calculator",
    category: "B2B Compliance",
    audience: "Operations",
    viralityScore: "TCEQ Risk",
    tagline: "Map Data Center Water Use Effectiveness (WUE) to estimate local basin TCEQ water-cooling depletion risk rating tiers.",
    badge: "Water Scarcity",
    path: "/calc/wue-cooling",
    icon: <Droplet className="w-4 h-4 text-cyan-400" />
  },
  {
    id: "hhsc-generator",
    title: "HHSC Emergency Generator Compliance Tool",
    category: "B2B Compliance",
    audience: "Operations",
    viralityScore: "Texas 88°F Rule",
    tagline: "Validate backup emergency generator kilowatt capacities and fuel reserves against nursing facility bed sizes for mandatory 96-hour safety durations.",
    badge: "Care Safety",
    path: "/calc/hhsc-generator",
    icon: <Cpu className="w-4 h-4 text-emerald-455" />
  },
  {
    id: "spend-vs-node",
    title: "Cloud LLM API Spend vs. Local Node ROI",
    category: "B2B Compliance",
    audience: "Operations",
    viralityScore: "9.7/10 (FinOps Standard)",
    tagline: "Project capital payback curves comparing continuous cloud API subscriptions against localized bare-metal hardware nodes.",
    badge: "FinOps ROI",
    path: "/calc/spend-vs-node",
    icon: <Cpu className="w-4 h-4 text-cyan-400" />
  }
];

export default function CalculatorsHub() {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "workbench">("grid");
  const [activeTab, setActiveTab] = useState<string>("chatgpt-auditor");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"All" | "B2C" | "B2B">("All");
  const [audienceFilter, setAudienceFilter] = useState<"All" | "Individual" | "Operations">("All");
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Set mounted flag and load initial parameters from URL
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const slugParam = params.get("slug");
      const viewParam = params.get("view");
      if (slugParam && CALCULATORS.some(c => c.id === slugParam)) {
        setActiveTab(slugParam);
      }
      if (viewParam === "grid" || viewParam === "workbench") {
        setViewMode(viewParam);
      }
    }
  }, []);

  // Sync state changes with URL query parameters for social sharing
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("slug", activeTab);
      url.searchParams.set("view", viewMode);
      window.history.replaceState(null, "", url.toString());
    }
  }, [activeTab, viewMode, mounted]);

  // Focus search input when pressing "/" key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredCalculators = CALCULATORS.filter(calc => {
    const matchesSearch = calc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          calc.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "All" || 
      (categoryFilter === "B2C" && calc.category === "B2C Viral") ||
      (categoryFilter === "B2B" && calc.category === "B2B Compliance");

    const matchesAudience = audienceFilter === "All" || 
      (audienceFilter === "Individual" && calc.audience === "Individual") ||
      (audienceFilter === "Operations" && calc.audience === "Operations");

    return matchesSearch && matchesCategory && matchesAudience;
  });

  if (!mounted) {
    return (
      <div className="w-full min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200 font-sans antialiased">
        <div className="relative overflow-hidden pt-12 pb-8 border-b border-slate-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.06),rgba(255,255,255,0))]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25" />
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2.5 text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  Back to Home
                </div>
                <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white leading-tight flex items-center gap-2.5">
                  MTC <span className="bg-gradient-to-r from-emerald-450 to-cyan-455 bg-clip-text text-transparent">Interactive Calculators Hub</span>
                </h1>
                <p className="text-sm font-medium leading-relaxed text-slate-300 max-w-2xl">
                  Explore our 3x3 dashboard directory or click any calculator below to open its live interactive workspace instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full min-h-screen bg-black text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200 font-sans antialiased">
      
      {/* Dynamic Header: Visible only in catalog browsing grid mode */}
      {viewMode === "grid" ? (
        <div className="relative overflow-hidden pt-12 pb-8 border-b border-slate-800 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.08),rgba(255,255,255,0))]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
          
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2.5 text-left">
                <Link 
                  href="/" 
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-emerald-400 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Home
                </Link>
                <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white leading-tight flex items-center gap-2.5">
                  <Calculator className="w-8 h-8 text-emerald-400" />
                  MTC <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Interactive Calculators Hub</span>
                </h1>
                <p className="text-sm font-medium leading-relaxed text-slate-200 max-w-2xl">
                  Explore our 3x3 dashboard directory or click any calculator below to open its live interactive workspace instantly.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`px-4.5 py-2.5 rounded-xl border text-xs font-black uppercase tracking-wider transition flex items-center gap-2 cursor-pointer bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-md`}
                >
                  <span>Grid Catalog View</span>
                </button>
                <div className="flex items-center gap-2 text-[11px] font-extrabold text-slate-100 uppercase bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Directory
                </div>
              </div>
            </div>

            {/* 2. DYNAMIC CENTERED TOP SEARCH BAR */}
            <div className="max-w-2xl mx-auto pt-8 relative">
              <div className="relative group">
                <Search className="absolute left-4.5 top-4 w-4 h-4 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                <input 
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search calculators (Press '/' to focus)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-400 rounded-2xl py-3.5 pl-12 pr-18 text-[13px] text-white placeholder-slate-400 focus:outline-none transition-all duration-300 font-bold shadow-lg shadow-black/40"
                />
                <div className="absolute right-4.5 top-3.5 flex items-center gap-2 select-none pointer-events-none">
                  <span className="px-2 py-0.5 rounded-md bg-black border border-slate-750 text-[9px] font-black text-slate-300 uppercase tracking-wider">
                    / focus
                  </span>
                  <span className="text-[11px] text-slate-200 font-extrabold">
                    {filteredCalculators.length} Match
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* Workspace Top focused Breadcrumbs */
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex items-center justify-between text-xs font-mono text-slate-200 border-b border-slate-800 pb-3 font-bold select-none">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewMode("grid")}
                className="text-slate-400 hover:text-emerald-400 transition flex items-center gap-1 font-bold uppercase tracking-wider cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Tools Catalog
              </button>
              <span className="text-slate-700">/</span>
              <span className="text-white font-extrabold uppercase tracking-wider">
                {CALCULATORS.find(c => c.id === activeTab)?.title.split(" ").slice(-2).join(" ")}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 3. SLEEK LEFT SIDE VERTICAL NAVIGATION (lg:col-span-3) - Rendered only in Catalog Mode */}
          {viewMode === "grid" && (
            <aside className="lg:col-span-3 space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-left font-sans shadow-xl">
                
                {/* Responsive Collapsible Trigger Header */}
                <button
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setIsFiltersExpanded(!isFiltersExpanded);
                    }
                  }}
                  className="w-full pb-3 flex items-center justify-between border-b border-slate-800 lg:border-transparent text-left lg:pointer-events-none lg:cursor-default cursor-pointer"
                >
                  <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-emerald-450" />
                    Filter Deck & Workspace
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9.5px] text-slate-300 uppercase tracking-wider font-black lg:inline hidden animate-pulse">Active</span>
                    <ChevronRight 
                      className={`w-4 h-4 text-slate-300 transition-transform lg:hidden ${
                        isFiltersExpanded ? "rotate-90" : ""
                      }`} 
                    />
                  </div>
                </button>

                {/* Collapsible Content Wrapper */}
                <div className={`space-y-5 pt-5 lg:block ${isFiltersExpanded ? "block animate-fade-in" : "hidden"}`}>
                  
                  {/* Category Filter list */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-black text-slate-200 uppercase tracking-wider block">Category</span>
                    <div className="flex flex-col gap-1.5">
                      {(["All", "B2C", "B2B"] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-[11px] font-bold transition-all uppercase text-left group cursor-pointer ${
                            categoryFilter === cat 
                              ? "bg-black border-emerald-500/50 text-emerald-400 shadow-md shadow-emerald-550/10" 
                              : "border-transparent text-slate-300 hover:text-white hover:bg-slate-950/60"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <ChevronRight className={`w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform ${
                              categoryFilter === cat ? "text-emerald-400" : "text-slate-500"
                            }`} />
                            {cat === "All" ? "All Categories" : (cat === "B2C" ? "B2C Viral" : "B2B Compliance")}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black text-slate-300 group-hover:text-slate-100">
                            {cat === "All" 
                              ? CALCULATORS.length 
                              : CALCULATORS.filter(c => cat === "B2C" ? c.category === "B2C Viral" : c.category === "B2B Compliance").length}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target Audience Filter list */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-[11px] font-black text-slate-200 uppercase tracking-wider block">Target Audience</span>
                    <div className="flex flex-col gap-1.5">
                      {(["All", "Individual", "Operations"] as const).map((aud) => (
                        <button
                          key={aud}
                          onClick={() => setAudienceFilter(aud)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-[11px] font-bold transition-all uppercase text-left group cursor-pointer ${
                            audienceFilter === aud 
                              ? "bg-black border-emerald-500/50 text-emerald-400 shadow-md shadow-emerald-550/10" 
                              : "border-transparent text-slate-300 hover:text-white hover:bg-slate-950/60"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <ChevronRight className={`w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform ${
                              audienceFilter === aud ? "text-emerald-400" : "text-slate-500"
                            }`} />
                            {aud === "All" ? "All Audiences" : aud}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black text-slate-300 group-hover:text-slate-100">
                            {aud === "All" 
                              ? CALCULATORS.length 
                              : CALCULATORS.filter(c => c.audience === aud).length}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Staging Sidebar Selectors */}
                  <div className="space-y-2 pt-4 border-t border-slate-800">
                    <span className="text-[11px] font-black text-slate-200 uppercase tracking-wider block">Stage Workspace Module</span>
                    <div className="flex flex-col gap-1.5 max-h-[300px] overflow-y-auto pr-1">
                      {filteredCalculators.map((calc) => (
                        <button
                          key={calc.id}
                          onClick={() => {
                            setActiveTab(calc.id);
                            setViewMode("workbench");
                            if (window.innerWidth < 1024) {
                              setIsFiltersExpanded(false);
                            }
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left border border-transparent transition text-[11.5px] group truncate font-bold text-slate-300 hover:text-white hover:bg-slate-950/60 cursor-pointer`}
                        >
                          {calc.icon}
                          <span className="truncate">{calc.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Social Community Redirection Box */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 font-sans text-left select-none hidden lg:block shadow-xl">
                <span className="text-[10px] font-black text-white uppercase tracking-wider block">MTC Social Community</span>
                <p className="text-[11px] text-slate-200 leading-relaxed font-semibold">
                  Debating subscription metrics, running contests, or having runaway bill scares? Post them on our active community boards!
                </p>
                <a 
                  href="https://reddit.com/r/MyTokenCost" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 underline pt-1 font-extrabold"
                >
                  Join r/MyTokenCost Subreddit
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </aside>
          )}

          {/* 4. DYNAMIC RIGHT-SIDE WORKSPACE FRAME (lg:col-span-9 or lg:col-span-12) */}
          <main className={viewMode === "grid" ? "lg:col-span-9 w-full" : "lg:col-span-12 w-full"}>
            
            {viewMode === "grid" ? (
              
              /* 3x3 DASHBOARD CATALOG GRID FORMAT */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCalculators.length === 0 ? (
                  <div className="col-span-full text-center py-20 border border-dashed border-slate-800 rounded-3xl text-slate-300 font-bold text-xs sm:text-sm bg-slate-900">
                    No calculators match your active filter parameters.
                  </div>
                ) : (
                  filteredCalculators.map((calc) => (
                    <div 
                      key={calc.id}
                      className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5.5 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden hover:scale-[1.02] hover:-translate-y-1 text-left shadow-lg"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="bg-black p-2.5 rounded-xl border border-slate-800">
                            {calc.icon}
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black border uppercase tracking-wider ${
                            calc.category === "B2C Viral" 
                              ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" 
                              : "bg-cyan-500/20 border-cyan-500/30 text-cyan-400"
                          }`}>
                            {calc.badge}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <h2 className="text-sm sm:text-base font-black font-display text-white group-hover:text-emerald-400 transition-colors tracking-tight leading-snug">
                            {calc.title}
                          </h2>
                          <div className="text-[10px] text-slate-300 uppercase tracking-wider font-extrabold">
                            Score: <span className="text-slate-100">{calc.viralityScore}</span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-[13px] text-slate-100 font-medium leading-relaxed line-clamp-4">
                          {calc.tagline}
                        </p>
                      </div>

                      <div className="relative pt-4 border-t border-slate-800 mt-5 flex gap-2">
                        <button 
                          onClick={() => {
                            setActiveTab(calc.id);
                            setViewMode("workbench");
                          }}
                          className="flex-grow bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-black py-2.5 rounded-xl text-[10.5px] uppercase tracking-wider transition flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-[0.99] group-hover:border-slate-600 cursor-pointer"
                        >
                          Launch Workspace
                          <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                        <Link 
                          href={calc.path}
                          className="px-3 bg-black hover:bg-slate-905 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl transition flex items-center justify-center cursor-pointer"
                          title="Open Shareable Dedicated Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                    </div>
                  ))
                )}
              </div>

            ) : (

              /* INTERACTIVE LIVE STAGING WORKBENCH PANEL */
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden min-h-[600px] flex flex-col justify-between text-left shadow-2xl">
                
                {/* Staging Frame Header */}
                <div className="bg-black border-b border-slate-800 px-6 py-6 text-left">
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live Workspace Active
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight leading-tight">
                      {CALCULATORS.find(c => c.id === activeTab)?.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
                      {CALCULATORS.find(c => c.id === activeTab)?.tagline}
                    </p>
                  </div>
                </div>

                {/* LIVE CALCULATOR CONTAINER */}
                <div className="p-6 sm:p-8 flex-grow bg-black">
                  {activeTab === "chatgpt-auditor" && <ChatgptAuditor />}
                  {activeTab === "sub-vs-api" && <SubVsApi />}
                  {activeTab === "apocalypse-bill" && <ApocalypseBill />}
                  {activeTab === "carbon-analogy" && <CarbonAnalogy />}
                  {activeTab === "ercot-load" && <ErcotLoad />}
                  {activeTab === "wue-cooling" && <WueCooling />}
                  {activeTab === "hhsc-generator" && <HhscGenerator />}
                  {activeTab === "spend-vs-node" && <SpendVsNode />}
                </div>

              </div>

            )}

          </main>

        </div>
      </div>

    </div>
  );
}
