/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Sliders, 
  Droplet, 
  Terminal, 
  CheckCircle2, 
  ArrowRight,
  Network,
  ThumbsUp,
  ThumbsDown,
  Bug,
  Share2,
  Copy,
  CalendarDays,
  Info,
  Gavel
} from "lucide-react";
import { submitRating, fetchRatings } from "@/lib/ratings";

interface LogLine {
  timestamp: string;
  type: "init" | "config" | "utility" | "finops" | "listen";
  message: string;
}

export default function CarbonAnalogy() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"calc" | "about" | "rules" | "architecture">("calc");
  
  // Inputs
  const [prompts, setPrompts] = useState(25);
  const [gridZone, setGridZone] = useState<"coal" | "renewable">("coal");

  // Staging console logs
  const [logs, setLogs] = useState<LogLine[]>([]);
  
  // Interactive SVG architecture states
  const [selectedArchNode, setSelectedArchNode] = useState<"prompts" | "grid" | "carbon" | "analogy">("analogy");

  // Lead capture success state
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Shared rating loops
  const [liked, setLiked] = useState<boolean | null>(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [showDislikeConsole, setShowDislikeConsole] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  // Ref for logging scroll
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Mount check & URL state loading
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const pParam = params.get("prompts");
      const zone = params.get("zone");
      if (pParam) setPrompts(Number(pParam));
      if (zone && ["coal", "renewable"].includes(zone)) setGridZone(zone as "coal" | "renewable");
    }
    fetchRatings("calculator", "carbon-analogy").then((summary) => {
      setUpvotes(summary.upvotes);
      setDownvotes(summary.downvotes);
      if (summary.userVote === "up") setLiked(true);
      if (summary.userVote === "down") setLiked(false);
    }).catch(() => {});
  }, []);

  // Sync state changes with URL query parameters for social sharing
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("prompts", String(prompts));
      url.searchParams.set("zone", gridZone);
      window.history.replaceState(null, "", url.toString());
    }
  }, [prompts, gridZone, mounted]);

  // Recalculate metrics on input change and trigger stdout logging
  useEffect(() => {
    if (!mounted) return;

    const annualQueries = prompts * 365.25;
    const queryKwh = 0.003;
    const carbonCoeff = gridZone === "coal" ? 0.38 : 0.038;
    const waterLitersPerQuery = 0.5;

    const annualKwh = annualQueries * queryKwh;
    const annualCarbon = annualKwh * carbonCoeff;
    const annualWaterLiters = annualQueries * waterLitersPerQuery;

    const stamp = new Date().toLocaleTimeString();
    const newLogs: LogLine[] = [
      { timestamp: stamp, type: "init", message: "Environmental telemetry metrics synchronized." },
      { timestamp: stamp, type: "config", message: `GRID ZONE - Active region: ${gridZone === "coal" ? "US Midwest Coal-Heavy" : "Iceland Clean Geothermal (-90% emissions)"}` },
      { timestamp: stamp, type: "utility", message: `CONSUMPTION METRICS - Annual compute load: ${annualKwh.toFixed(1)} kWh | Water footprint: ${annualWaterLiters.toFixed(1)} Liters` },
      { timestamp: stamp, type: "finops", message: `EMISSIONS PROFILE - Annual carbon generation: ${annualCarbon.toFixed(1)} kg CO2e` },
      { timestamp: stamp, type: "listen", message: "ENVIRONMENTAL STANDBY - Awaiting grid offset configurations..." }
    ];

    setLogs(newLogs);

    // Auto-scroll logs
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [prompts, gridZone, mounted]);

  if (!mounted) return null;

  // Perform Calculations
  const annualQueries = prompts * 365.25;
  const queryKwh = 0.003;
  const carbonCoeff = gridZone === "coal" ? 0.38 : 0.038;
  const waterLitersPerQuery = 0.5;

  const annualKwh = annualQueries * queryKwh;
  const annualCarbon = annualKwh * carbonCoeff;
  const annualWaterLiters = annualQueries * waterLitersPerQuery;

  const iphoneCharges = annualKwh / 0.012;
  const plasticBottles = annualWaterLiters / 0.5;

  // Social Shares
  const handleShare = (platform: "twitter" | "linkedin" | "facebook" | "reddit" | "copy") => {
    const text = `Just audited our AI cluster carbon footprint: our server power generates ${annualCarbon.toFixed(1)} kg of CO2e carbon opex annually! Measure your grid carbon footprint at:`;
    const url = "https://mytokencost.com/calc/carbon-analogy";

    if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "reddit") {
      window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`, "_blank");
    } else if (platform === "copy") {
      navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1500);
    }
  };

  const pushToSubreddit = () => {
    const title = `Carbon Analogy Parameter suggestion`;
    window.open(`https://www.reddit.com/r/MyTokenCost/submit?title=${encodeURIComponent(title)}&text=${encodeURIComponent(feedbackText)}`, "_blank");
  };

  const archNodes = {
    prompts: {
      title: "01 Ingress Prompts count",
      body: "Tracks the raw daily prompt count. Multiplies input cycles by 365.25 to calculate baseline annual query envelopes."
    },
    grid: {
      title: "02 Server Grid Zone",
      body: "Emissions index based on data center location. Links local compute nodes to Coal-Heavy Midwest grids or clean Geothermal grids."
    },
    carbon: {
      title: "03 Carbon footprint",
      body: "Computes total kg CO2e emitted based on grid coefficients. Geothermal cooling blocks drop opex emissions down by 90%."
    },
    analogy: {
      title: "04 Equivalency Analog",
      body: "Translates abstract token counts into physical analogs: plastic bottle water cool volumes and daily iPhone charge equivalents."
    }
  };

  // SVG visual indicator coordinates based on equivalents
  const bottleOpacity = Math.min(1.0, plasticBottles / 10000);
  const iPhoneOpacity = Math.min(1.0, iphoneCharges / 100000);

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left font-sans antialiased text-slate-100 selection:bg-cyanNeon selection:text-darkBg">
      
      {/* Zone 2: Title Block */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-sans text-xs text-cyanNeon tracking-wider font-extrabold uppercase">
            <Droplet className="w-4 h-4 text-cyanNeon" /> Platform Template V1.0
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-white flex flex-wrap items-center gap-2">
            Grid-Aware Carbon & <span className="text-cyanNeon font-black">Water Analogy Generator</span>
          </h2>
          <p className="text-sm text-slate-200 max-w-3xl leading-relaxed font-medium">
            Standardized Telemetry Tracker (ID: <code className="bg-black text-slate-100 px-1.5 py-0.5 rounded border border-slate-700 font-mono text-xs">calc-carbon-analogy</code>). Translate abstract token figures into real-world carbon and water metrics based on coal vs renewable grid zones.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-sans bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-100 font-extrabold uppercase tracking-wide">Nominal Tracking</span>
        </div>
      </div>

      {/* Zone 3: The 4-Tab Navigation Deck */}
      <div className="grid grid-cols-2 md:grid-cols-4 bg-slate-900 border border-slate-800 p-1.5 rounded-xl max-w-2xl gap-1 font-sans text-xs sm:text-sm font-bold">
        <button 
          onClick={() => setActiveTab("calc")}
          className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition duration-200 cursor-pointer ${
            activeTab === "calc" 
              ? "bg-slate-800 text-cyanNeon border border-cyanNeon/30 glow-cyan font-black" 
              : "text-slate-300 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          <Sliders className="w-4 h-4" /> Actual Calculator
        </button>
        <button 
          onClick={() => setActiveTab("about")}
          className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition duration-200 cursor-pointer ${
            activeTab === "about" 
              ? "bg-slate-800 text-cyanNeon border border-cyanNeon/30 glow-cyan font-black" 
              : "text-slate-300 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          <Info className="w-4 h-4" /> About Calc
        </button>
        <button 
          onClick={() => setActiveTab("rules")}
          className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition duration-200 cursor-pointer ${
            activeTab === "rules" 
              ? "bg-slate-800 text-cyanNeon border border-cyanNeon/30 glow-cyan font-black" 
              : "text-slate-300 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          <Gavel className="w-4 h-4" /> Its Rules
        </button>
        <button 
          onClick={() => setActiveTab("architecture")}
          className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition duration-200 cursor-pointer ${
            activeTab === "architecture" 
              ? "bg-slate-800 text-cyanNeon border border-cyanNeon/30 glow-cyan font-black" 
              : "text-slate-300 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          <Network className="w-4 h-4" /> Its Architecture
        </button>
      </div>

      {/* Zone 4: Modular Calculator Workspace */}
      <div className="min-h-[350px]">
        
        {/* Tab 1: Actual Calculator */}
        {activeTab === "calc" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left: Inputs Sidebar (col-span-4) */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
              <div className="space-y-6">
                <span className="text-[11px] font-extrabold font-sans text-slate-200 uppercase tracking-widest block border-b border-slate-850 pb-3">
                  <Sliders className="w-4 h-4 inline mr-1 text-cyanNeon" /> Custom Modifiers
                </span>

                {/* Slider 1 */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="text-slate-200 font-bold">Daily Prompts Submitted</span>
                    <span className="text-cyanNeon font-extrabold font-sans text-sm">{prompts} Prompts / Day</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="200" 
                    step="5" 
                    value={prompts}
                    onChange={(e) => setPrompts(Number(e.target.value))}
                    className="w-full accent-cyanNeon bg-black border border-slate-855 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-sans text-slate-300 font-bold">
                    <span>5</span>
                    <span>200</span>
                  </div>
                </div>

                {/* Grid Toggle buttons */}
                <div className="space-y-2">
                  <label className="text-slate-200 text-[10.5px] uppercase font-bold tracking-wider block">Server Grid Zone Carbon Intensity</label>
                  <div className="flex flex-col gap-2 text-xs font-bold font-sans">
                    <button
                      onClick={() => setGridZone("coal")}
                      className={`py-3.5 px-3 rounded-xl border transition uppercase font-extrabold cursor-pointer ${
                        gridZone === "coal"
                          ? "bg-black border-amber-500 text-amber-400 shadow-md shadow-amber-500/5"
                          : "border-slate-800 bg-black/40 text-slate-300 hover:text-white hover:bg-slate-900/50"
                      }`}
                    >
                      Coal-Heavy Grid (US Midwest)
                    </button>
                    <button
                      onClick={() => setGridZone("renewable")}
                      className={`py-3.5 px-3 rounded-xl border transition uppercase font-extrabold cursor-pointer ${
                        gridZone === "renewable"
                          ? "bg-black border-cyanNeon text-cyanNeon shadow-md shadow-cyanNeon/5"
                          : "border-slate-800 bg-black/40 text-slate-300 hover:text-white hover:bg-slate-900/50"
                      }`}
                    >
                      Iceland Geothermal (-90%)
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-800 mt-6 text-xs text-emerald-400 leading-relaxed flex items-start gap-2.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Green geothermal grids deflect the massive carbon opex of standard cloud servers.</span>
              </div>
            </div>

            {/* Right: Workspace & Visual Grid (col-span-8) */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative">
              <div className="space-y-4">
                <span className="text-[11px] font-extrabold font-sans text-slate-200 uppercase tracking-widest block">
                  Tactile Environmental Analogy Visualizer
                </span>

                {/* Custom Responsive SVG Environmental Analog Grid */}
                <div className="relative h-64 w-full bg-black p-3 rounded-xl border border-slate-800 flex items-center justify-center">
                  <svg viewBox="0 0 500 180" fill="none" className="w-full h-full">
                    {/* Water bottle equivalent visual container */}
                    <g transform="translate(40, 20)">
                      <rect x="0" y="0" width="180" height="120" rx="10" fill="#111827" stroke="#334155" strokeWidth="1.5" />
                      {/* Water Bottle Icon */}
                      <path d="M70,30 L110,30 L110,40 L105,40 L105,100 A15,15 0 0,1 75,100 L75,40 L70,40 Z" 
                        fill="#0284c7" fillOpacity={0.2 + bottleOpacity * 0.8} stroke="#38bdf8" strokeWidth="2" 
                      />
                      <text x="90" y="140" fill="#cbd5e1" fontFamily="monospace" fontSize="9" fontWeight="black" textAnchor="middle">
                        {Math.floor(plasticBottles).toLocaleString()} BOTTLES
                      </text>
                    </g>

                    {/* iPhone Charges equivalent visual container */}
                    <g transform="translate(280, 20)">
                      <rect x="0" y="0" width="180" height="120" rx="10" fill="#111827" stroke="#334155" strokeWidth="1.5" />
                      {/* iPhone Icon */}
                      <rect x="65" y="30" width="50" height="80" rx="6" stroke="#10b981" strokeWidth="2.5" fill="#069669" fillOpacity={0.1 + iPhoneOpacity * 0.9} />
                      <line x1="85" y1="102" x2="95" y2="102" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                      <text x="90" y="140" fill="#cbd5e1" fontFamily="monospace" fontSize="9" fontWeight="black" textAnchor="middle">
                        {Math.floor(iphoneCharges).toLocaleString()} CHARGES
                      </text>
                    </g>
                  </svg>
                </div>
              </div>

              {/* Metric Scorecards underneath the chart */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs pt-6">
                <div className="bg-black border border-slate-800 p-4.5 rounded-xl text-left">
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-extrabold">Annual Carbon Footprint</span>
                  <span className="text-xl font-black text-white mt-1 block font-sans">{annualCarbon.toFixed(1)} kg CO2e</span>
                </div>
                <div className="bg-black border border-slate-800 p-4.5 rounded-xl text-left">
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-extrabold">Annual Water Footprint</span>
                  <span className="text-xl font-black text-white mt-1 block font-sans">{annualWaterLiters.toFixed(0)} Liters</span>
                </div>
                <div className="bg-black border border-slate-800 p-4.5 rounded-xl text-left">
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-extrabold">Energy Consumed</span>
                  <span className="text-xl font-black text-cyanNeon mt-1 block font-sans text-glow-cyan">{annualKwh.toFixed(1)} kWh</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: About Calc */}
        {activeTab === "about" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl leading-relaxed">
            <h3 className="text-lg font-bold font-sans border-b border-slate-800 pb-3 flex items-center gap-2 text-white">
              <span className="text-cyanNeon"><Info className="w-5 h-5" /></span> The Ecological Load of Artificial Intelligence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[13px] text-slate-100 font-medium">
              <div className="space-y-3 bg-black border border-slate-800 p-6 rounded-xl">
                <span className="text-redNeon font-sans font-extrabold uppercase text-[11px] tracking-wider block">The Coal-Heavy Data Center Reality</span>
                <p className="leading-relaxed text-slate-200">
                  Upstream AI server clusters require huge amounts of electrical opex, and running them inside coal-dependent grid zones (like the US Midwest) generates substantial carbon emissions per computational CPU cycle.
                </p>
              </div>
              <div className="space-y-3 bg-black border border-slate-800 p-6 rounded-xl">
                <span className="text-emeraldNeon font-sans font-extrabold uppercase text-[11px] tracking-wider block">The Clean Geothermal Alternative</span>
                <p className="leading-relaxed text-slate-200">
                  Routing AI workflows to green server nodes running on clean geothermal grids (like Iceland or hydro-heavy zones) cuts emission footprints by over 90%, allowing zero-carbon compliance for corporate IT pipelines.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Its Rules */}
        {activeTab === "rules" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left: LaTeX & Math Models */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl text-left">
              <div>
                <h3 className="text-base font-bold font-sans flex items-center gap-2 text-white"><Gavel className="w-4 h-4 text-cyanNeon" /> Environmental Sizing Equations</h3>
                <p className="text-slate-200 text-xs mt-1 font-semibold leading-relaxed">Our local state engine utilizes these verified ecological index coefficients to map carbon footprints:</p>
              </div>
              
              <div className="space-y-4 text-xs font-mono">
                <div className="bg-black border border-slate-800 p-4 rounded-xl">
                  <span className="text-[10px] text-slate-300 uppercase tracking-widest block font-extrabold mb-2">Equation 01: Energy Consumption per Prompt</span>
                  <div className="text-sm font-bold text-cyanNeon text-glow-cyan py-1 font-mono">
                    Energy_Total_kWh = Prompts * 365.25 * 0.003
                  </div>
                  <p className="text-[10px] text-slate-300 leading-relaxed mt-2 font-mono font-bold">
                    *Assumes a constant energy footprint of 0.003 kWh per raw user prompt to power silicon compute and optical distribution networks.
                  </p>
                </div>
                <div className="bg-black border border-slate-800 p-4 rounded-xl">
                  <span className="text-[10px] text-slate-300 uppercase tracking-widest block font-extrabold mb-2">Equation 02: Carbon Footprint Calculation</span>
                  <div className="text-sm font-bold text-cyanNeon text-glow-cyan py-1 font-mono">
                    Carbon_kg = Energy_Total_kWh * Grid_Coefficient
                  </div>
                  <p className="text-[10px] text-slate-300 leading-relaxed mt-2 font-mono font-bold">
                    *Grid coefficients map to standard baselines: Coal-Heavy is 0.38 kg/kWh, Geothermal is 0.038 kg/kWh.
                  </p>
                </div>
                <div className="bg-black border border-slate-800 p-4 rounded-xl">
                  <span className="text-[10px] text-slate-300 uppercase tracking-widest block font-extrabold mb-2">Equation 03: Evaporative Water Consumption</span>
                  <div className="text-sm font-bold text-cyanNeon text-glow-cyan py-1 font-mono">
                    Water_Liters = Prompts * 365.25 * 0.50
                  </div>
                  <p className="text-[10px] text-slate-300 leading-relaxed mt-2 font-mono font-bold">
                    *Maps direct data center evaporative tower cooling footprints, averaging 0.5 Liters per user query.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Gated consultation booking form */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl text-left">
              <div className="space-y-4">
                <div>
                  <span className="bg-indigoNeon/20 text-[#818cf8] text-[10px] font-sans border border-indigoNeon/30 px-2.5 py-0.5 rounded font-extrabold uppercase tracking-widest block max-w-fit">ESG REGISTRY</span>
                  <h3 className="text-base font-extrabold font-sans mt-2 text-white">Book Corporate ESG Audit</h3>
                  <p className="text-slate-200 text-xs mt-1.5 leading-relaxed font-semibold">Let our engineering group audit your enterprise AI workflows, map active server grid zones, and optimize your ESG footprint.</p>
                </div>
                
                {!bookingSuccess ? (
                  <form onSubmit={(e) => { e.preventDefault(); setBookingSuccess(true); }} className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10.5px] text-slate-200 uppercase font-bold tracking-wider block">Organization Name</label>
                      <input required type="text" placeholder="Inference Systems LLC" className="w-full bg-black border border-slate-700 focus:border-cyanNeon p-3 rounded-xl text-white placeholder-slate-400 outline-none transition font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10.5px] text-slate-200 uppercase font-bold tracking-wider block">Work Email</label>
                      <input required type="email" placeholder="architect@domain.com" className="w-full bg-black border border-slate-700 focus:border-cyanNeon p-3 rounded-xl text-white placeholder-slate-400 outline-none transition font-medium" />
                    </div>
                    <button type="submit" className="w-full bg-indigoNeon hover:bg-indigoNeon/90 text-white font-extrabold py-3.5 rounded-xl transition uppercase tracking-wider text-xs shadow-md cursor-pointer">
                      Dispatch ESG Scope <ArrowRight className="w-4 h-4 inline ml-1.5" />
                    </button>
                  </form>
                ) : (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emeraldNeon rounded-xl text-xs leading-relaxed font-sans font-bold">
                    ✓ ESG profile logged. Subsidy design checklist and PE calendar invite dispatched to your inbox.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* Tab 4: Its Architecture */}
        {activeTab === "architecture" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-5">
            <div>
              <h3 className="text-base font-bold font-sans flex items-center gap-2 text-white"><Network className="w-4 h-4 text-indigoNeon" /> Environmental Data Ingress Pipeline</h3>
              <p className="text-slate-200 text-xs mt-1 leading-relaxed font-semibold">Click active network vector nodes below to audit standard localized proxy routing rules:</p>
            </div>

            {/* Styled interactive SVG Architecture Pipeline */}
            <div className="p-4 bg-black rounded-xl border border-slate-800 overflow-x-auto">
              <div className="min-w-[800px] py-2">
                <svg viewBox="0 0 1000 200" fill="none" className="w-full h-auto">
                  {/* Connective Paths */}
                  <path d="M 120 100 L 250 100" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3 3" />
                  <path d="M 410 100 L 540 100" stroke="#00f0ff" strokeWidth="2" />
                  <path d="M 700 100 L 830 100" stroke="#00f0ff" strokeWidth="2" />
                  
                  {/* Animated signals */}
                  <circle cx="120" cy="100" r="3" fill="#6366f1">
                    <animate attributeName="cx" values="120;250" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="410" cy="100" r="3" fill="#00f0ff">
                    <animate attributeName="cx" values="410;540" dur="1.5s" repeatCount="indefinite" />
                  </circle>

                  {/* Node 1: Prompts Count */}
                  <g className="cursor-pointer" onClick={() => setSelectedArchNode("prompts")}>
                    <rect x="20" y="60" width="100" height="80" rx="6" fill={selectedArchNode === "prompts" ? "#0a0f1d" : "#1e293b"} stroke="#6366f1" strokeWidth={selectedArchNode === "prompts" ? "2" : "1.5"} />
                    <text x="70" y="95" fill="#f8fafc" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle">01 PROMPTS</text>
                    <text x="70" y="115" fill="#cbd5e1" fontFamily="monospace" fontSize="7" fontWeight="bold" textAnchor="middle">Annual Ingest</text>
                  </g>

                  {/* Node 2: Server Grid */}
                  <g className="cursor-pointer" onClick={() => setSelectedArchNode("grid")}>
                    <rect x="250" y="40" width="160" height="120" rx="8" fill={selectedArchNode === "grid" ? "#0a0f1d" : "#1e293b"} stroke="#00f0ff" strokeWidth={selectedArchNode === "grid" ? "2.5" : "1.5"} />
                    <text x="330" y="90" fill="#f8fafc" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle">02 SERVER GRID</text>
                    <text x="330" y="110" fill="#00f0ff" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle">Coal vs Renewable</text>
                  </g>

                  {/* Node 3: Carbon Math */}
                  <g className="cursor-pointer" onClick={() => setSelectedArchNode("carbon")}>
                    <rect x="540" y="50" width="160" height="100" rx="8" fill={selectedArchNode === "carbon" ? "#0a0f1d" : "#1e293b"} stroke="#00f0ff" strokeWidth={selectedArchNode === "carbon" ? "2.5" : "1.5"} />
                    <text x="620" y="95" fill="#f8fafc" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle">03 CARBON MATH</text>
                    <text x="620" y="115" fill="#6366f1" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle">kg CO2e index</text>
                  </g>

                  {/* Node 4: Analogy */}
                  <g className="cursor-pointer" onClick={() => setSelectedArchNode("analogy")}>
                    <rect x="830" y="70" width="150" height="60" rx="6" fill={selectedArchNode === "analogy" ? "#0a0f1d" : "#111827"} stroke="#475569" strokeWidth="1.5" />
                    <text x="905" y="105" fill="#cbd5e1" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle">04 ANALOGY</text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Click node description card */}
            <div className="p-4 bg-black border border-slate-800 rounded-lg">
              <span className="text-cyanNeon font-sans font-bold text-xs flex items-center gap-1.5 mb-1.5 text-glow-cyan uppercase">
                <Network className="w-4 h-4 text-cyanNeon" /> {archNodes[selectedArchNode].title}
              </span>
              <p className="text-xs text-slate-100 font-sans leading-relaxed font-semibold">
                {archNodes[selectedArchNode].body}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Zone 5: Standard Programmer Terminal Console (Full Width) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-black px-4 py-3 border-b border-slate-800 flex justify-between items-center select-none">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-redNeon rounded-full"></span>
            <span className="h-2.5 w-2.5 bg-yellow-500 rounded-full"></span>
            <span className="h-2.5 w-2.5 bg-emeraldNeon rounded-full"></span>
            <span className="text-xs text-slate-200 font-mono ml-2 font-bold">carbon_metrology_stdout.log</span>
          </div>
          <span className="text-[10px] text-cyanNeon font-mono tracking-widest text-glow-cyan font-bold uppercase"><Terminal className="w-3.5 h-3.5 inline mr-1" /> Console</span>
        </div>
        <div 
          ref={logContainerRef}
          className="bg-black p-4.5 h-36 font-mono text-xs text-slate-100 overflow-y-auto space-y-1.5 text-left font-medium"
        >
          {logs.map((log, i) => (
            <div key={i} className="flex gap-2 items-start font-mono">
              <span className="text-slate-400 shrink-0 font-mono font-bold">[{log.timestamp}]</span>
              <span className={`font-bold font-mono leading-relaxed ${
                log.type === "config" ? "text-cyanNeon" : 
                log.type === "utility" ? "text-emeraldNeon" : 
                log.type === "finops" ? "text-indigo-350 text-[#a5b4fc]" : "text-slate-200"
              }`}>
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Zone 6: Value-Add B2B Leads Block */}
      <div className="bg-gradient-to-r from-cyanNeon/10 via-black to-indigoNeon/10 border border-cyanNeon/20 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-[10px] font-sans text-cyanNeon tracking-widest uppercase font-extrabold flex items-center justify-center md:justify-start gap-1.5 text-glow-cyan">
            <CalendarDays className="w-4 h-4" /> ESG Subsidies & Footprint Review
          </div>
          <h3 className="text-lg font-black font-sans leading-tight text-white">Book a free 15-minute corporate carbon deflection consultation with our ESG architects.</h3>
          <p className="text-slate-100 text-xs max-w-3xl leading-relaxed font-semibold">
            Evaluate localized green grid routing strategies, carbon-neutral credits, and local green energy subsidies to secure 100% air-gapped corporate compute operations.
          </p>
        </div>
        <button 
          onClick={() => {
            setActiveTab("rules");
            document.getElementById("framework-audit-form")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="w-full md:w-auto shrink-0 bg-cyanNeon hover:bg-cyanNeon/85 text-black font-black py-3.5 px-6 rounded-xl text-xs tracking-wider transition uppercase flex items-center justify-center gap-2 glow-cyan font-sans cursor-pointer"
        >
          Schedule Consult <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Zone 7: Global Footer Feedback Loop */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg font-sans text-xs">
        {/* Left side: Simple Rating */}
        <div className="flex items-center gap-3">
          <span className="text-slate-200 uppercase tracking-wide font-extrabold text-[11px]">Correct?</span>
          <div className="flex gap-2">
            <button 
              onClick={() => { 
                setLiked(true); 
                submitRating("calculator", "carbon-analogy", "up");
                if (liked !== true) {
                  setUpvotes(prev => prev + 1);
                  if (liked === false) setDownvotes(prev => Math.max(0, prev - 1));
                }
              }}
              className={`h-8 px-3 rounded-lg border flex items-center gap-1.5 transition cursor-pointer text-[11px] font-bold ${
                liked === true 
                  ? "bg-emeraldNeon/20 border-emeraldNeon text-emerald-400" 
                  : "bg-black border-slate-750 text-slate-300 hover:text-white"
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{upvotes}</span>
            </button>
            <button 
              onClick={() => { 
                setLiked(false); 
                submitRating("calculator", "carbon-analogy", "down");
                if (liked !== false) {
                  setDownvotes(prev => prev + 1);
                  if (liked === true) setUpvotes(prev => Math.max(0, prev - 1));
                }
              }}
              className={`h-8 px-3 rounded-lg border flex items-center gap-1.5 transition cursor-pointer text-[11px] font-bold ${
                liked === false 
                  ? "bg-redNeon/20 border-redNeon text-red-400" 
                  : "bg-black border-slate-750 text-slate-300 hover:text-white"
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>{downvotes}</span>
            </button>
          </div>
        </div>

        {/* Right side: Simple Social Sharing */}
        <div className="flex items-center gap-3">
          <span className="text-slate-300 font-semibold text-[11px]">Liked this calculator? Share:</span>
          <div className="flex gap-2">
            <button 
              onClick={() => handleShare("twitter")}
              className="h-8 w-8 bg-black hover:bg-slate-950 border border-slate-750 rounded-lg flex items-center justify-center transition cursor-pointer text-slate-100"
              title="Share to X (Twitter)"
            >
              <svg className="w-3.5 h-3.5 fill-current text-sky-400" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>
            <button 
              onClick={() => handleShare("linkedin")}
              className="h-8 w-8 bg-black hover:bg-slate-950 border border-slate-750 rounded-lg flex items-center justify-center transition cursor-pointer text-slate-100"
              title="Post to LinkedIn"
            >
              <svg className="w-3.5 h-3.5 fill-current text-indigo-400" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>
            <button 
              onClick={() => handleShare("facebook")}
              className="h-8 w-8 bg-black hover:bg-slate-950 border border-slate-750 rounded-lg flex items-center justify-center transition cursor-pointer text-slate-100"
              title="Share to Facebook"
            >
              <svg className="w-3.5 h-3.5 fill-current text-blue-500" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button 
              onClick={() => handleShare("reddit")}
              className="h-8 w-8 bg-black hover:bg-slate-950 border border-slate-750 rounded-lg flex items-center justify-center transition cursor-pointer text-slate-100"
              title="Share to Reddit"
            >
              <svg className="w-3.5 h-3.5 fill-current text-orange-550 text-[#ff4500]" viewBox="0 0 24 24">
                <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.85-1.64-6.26-1.72l1.32-4.16 4.3 1c0 1.1 1 2 2.1 2 1.2 0 2.2-1 2.2-2.2S21.1 3 20 3c-.9 0-1.6.6-2-1.4l-4.8-1.1c-.2-.04-.4.07-.46.26l-1.5 4.7C8.9 5.5 6.7 6.1 5 7.1c-.5-.8-1.4-1.2-2.4-1.2-1.6 0-3 1.3-3 3 0 1.2.7 2.2 1.7 2.7-.1.3-.2.7-.2 1 0 3.7 4.5 6.8 10 6.8s10-3 10-6.8c0-.3 0-.7-.1-1 1-.5 1.7-1.5 1.7-2.7zm-18 2.2c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm11.2 4.1c-1.8 1.8-5.2 1.8-7 0-.2-.2-.2-.6 0-.8.2-.2.6-.2.8 0 1.4 1.4 4 1.4 5.4 0 .2-.2.6-.2.8 0 .2.2.2.6 0 .8zm-.7-4.1c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" />
              </svg>
            </button>
            <button 
              onClick={() => handleShare("copy")}
              className="h-8 w-8 bg-black hover:bg-slate-950 border border-slate-750 rounded-lg flex items-center justify-center transition cursor-pointer text-slate-100 relative"
              title="Copy direct link"
            >
              <Copy className="w-3.5 h-3.5 text-emeraldNeon" />
              {copySuccess && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow-lg animate-fade-in whitespace-nowrap z-30">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
