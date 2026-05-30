/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Sliders, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  ArrowRight,
  Network,
  ThumbsUp,
  ThumbsDown,
  Copy,
  CalendarDays,
  Info,
  Gavel,
  AlertTriangle
} from "lucide-react";
import { submitRating, fetchRatings } from "@/lib/ratings";

interface LogLine {
  timestamp: string;
  type: "init" | "config" | "utility" | "finops" | "listen" | "fatal";
  message: string;
}

interface HhscGeneratorProps {
  initialData?: {
    title?: string;
    regulatoryBody?: string;
    penaltyRisk?: string;
    steps?: string[];
  };
}

export default function HhscGenerator({ initialData }: HhscGeneratorProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"calc" | "about" | "rules" | "architecture">("calc");
  
  // Inputs
  const [beds, setBeds] = useState(100);
  const [genKw, setGenKw] = useState(250);
  const [fuelGallons, setFuelGallons] = useState(1000);

  // Staging console logs
  const [logs, setLogs] = useState<LogLine[]>([]);
  
  // Interactive SVG architecture states
  const [selectedArchNode, setSelectedArchNode] = useState<"beds" | "generator" | "fuel" | "safety">("safety");

  // Lead capture success state
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Shared rating loops
  const [liked, setLiked] = useState<boolean | null>(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  // Ref for logging scroll
  const logContainerRef = useRef<HTMLDivElement>(null);

  const fallbackPenalty = "Immediate Class A Administrative Penalties & Emergency Evacuation Directives (Ambient 88°F Rule)";
  const activePenalty = initialData?.penaltyRisk || fallbackPenalty;

  // Mount check & URL state loading
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const bCount = params.get("beds");
      const kw = params.get("kw");
      const gallons = params.get("gallons");
      if (bCount) setBeds(Number(bCount));
      if (kw) setGenKw(Number(kw));
      if (gallons) setFuelGallons(Number(gallons));
    }
    fetchRatings("calculator", "hhsc-generator").then((summary) => {
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
      url.searchParams.set("beds", String(beds));
      url.searchParams.set("kw", String(genKw));
      url.searchParams.set("gallons", String(fuelGallons));
      window.history.replaceState(null, "", url.toString());
    }
  }, [beds, genKw, fuelGallons, mounted]);

  // Recalculate metrics on input change and trigger stdout logging
  useEffect(() => {
    if (!mounted) return;

    const requiredCapacityKw = beds * 1.5;
    const isKwCompliant = genKw >= requiredCapacityKw;
    const fuelConsumptionPerHour = genKw * 0.07;
    const totalSustainedHours = fuelGallons / fuelConsumptionPerHour;
    const isDurationCompliant = totalSustainedHours >= 96.0;
    const isFullyCompliant = isKwCompliant && isDurationCompliant;

    const stamp = new Date().toLocaleTimeString();
    const newLogs: LogLine[] = [
      { timestamp: stamp, type: "init", message: "HHSC Emergency Power telemetry metrics synchronized." },
      { timestamp: stamp, type: "config", message: `FACILITY CONFIG - Beds: ${beds} | Gen Rating: ${genKw} kW | Fuel Tank: ${fuelGallons.toLocaleString()} Gallons` },
      { timestamp: stamp, type: "utility", message: `BURN RATE METRICS - Fuel opex burn: ${fuelConsumptionPerHour.toFixed(1)} gal/hr at peak load.` },
      { timestamp: stamp, type: "finops", message: `HHSC DURATION - Projected run timeframe: ${totalSustainedHours.toFixed(1)} hours (${(totalSustainedHours / 24).toFixed(1)} days)` },
      { timestamp: stamp, type: isFullyCompliant ? "listen" : "fatal", message: `REGULATORY GATE - Status: ${isFullyCompliant ? "🟢 COMPLIANT (Ambient 88°F Rule satisfied)" : "🔴 DEFICIT DETECTED (Class A penalty risk)"}` }
    ];

    setLogs(newLogs);

    // Auto-scroll logs
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [beds, genKw, fuelGallons, mounted]);

  if (!mounted) return null;

  // Perform Calculations
  const requiredCapacityKw = beds * 1.5;
  const isKwCompliant = genKw >= requiredCapacityKw;
  const fuelConsumptionPerHour = genKw * 0.07;
  const totalSustainedHours = fuelGallons / fuelConsumptionPerHour;
  const isDurationCompliant = totalSustainedHours >= 96.0;
  const isFullyCompliant = isKwCompliant && isDurationCompliant;

  // Social Shares
  const handleShare = (platform: "twitter" | "linkedin" | "facebook" | "reddit" | "copy") => {
    const text = `Just audited emergency caregiver fuel reserves under Texas HHSC Ambient 88°F rules: generator opex duration projected at ${totalSustainedHours.toFixed(1)} hours. Check your statutory 96-hour fuel runtime compliance at:`;
    const url = "https://mytokencost.com/calc/hhsc-generator";

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

  const archNodes = {
    beds: {
      title: "01 Licensed Bed Load",
      body: "Calculates the base safety grid load required for resident cooling. Incorporates statutory HHSC minimum sizing rules: 1.5 kW safety load capacity per bed."
    },
    generator: {
      title: "02 Backup Generator kW",
      body: "Emergency generator output rating. Compares supplied facility kW output against the licensed bed count safety loads."
    },
    fuel: {
      title: "03 On-site Fuel Reserve",
      body: "Substation fuel inventory mapping. Assumes typical diesel/propane generator burn capacities: 0.07 gallons of fuel consumed per kW capacity per hour."
    },
    safety: {
      title: "04 96-Hour Safety Duration",
      body: "The final regulatory compliance gate. Nursing facilities must maintain at least 96 hours of continuous, on-site fuel runtime during blackouts."
    }
  };

  // SVG Gauge calculations
  // Horizontal timeline progress: 0 to 120 hours. Map to coordinates on timeline.
  const visualMaxHours = 120;
  const barWidth = Math.min(390, (totalSustainedHours / visualMaxHours) * 390);

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left font-sans antialiased text-slate-100 selection:bg-cyanNeon selection:text-darkBg">
      
      {/* Regulatory Alert Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl font-sans text-xs text-left space-y-2 shadow-md">
        <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-extrabold">Penalty Risk & Liability Guideline</span>
        <div className="text-xs text-amber-400 leading-relaxed font-bold flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <span>{activePenalty}</span>
        </div>
      </div>

      {/* Zone 2: Title Block */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-sans text-xs text-cyanNeon tracking-wider font-extrabold uppercase">
            <Cpu className="w-4 h-4 text-cyanNeon" /> Platform Template V1.0
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-white flex flex-wrap items-center gap-2">
            HHSC Emergency <span className="text-cyanNeon font-black">Generator Compliance Tool</span>
          </h2>
          <p className="text-sm text-slate-200 max-w-3xl leading-relaxed font-medium">
            Standardized Telemetry Tracker (ID: <code className="bg-black text-slate-100 px-1.5 py-0.5 rounded border border-slate-700 font-mono text-xs">calc-hhsc-generator</code>). Validate backup emergency generator kilowatt capacities and fuel reserves against nursing facility bed sizes for mandatory 96-hour safety durations.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-sans bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
          <span className={`w-2.5 h-2.5 rounded-full ${isFullyCompliant ? "bg-emerald-500 animate-pulse" : "bg-redNeon animate-ping"}`} />
          <span className="text-slate-100 font-extrabold uppercase tracking-wide">
            {isFullyCompliant ? "Fully Compliant" : "Deficit Warning"}
          </span>
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
                    <span className="text-slate-200 font-bold">1. Licensed Bed Capacity</span>
                    <span className="text-cyanNeon font-extrabold font-sans text-sm">{beds} Beds</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="300" 
                    step="10" 
                    value={beds}
                    onChange={(e) => setBeds(Number(e.target.value))}
                    className="w-full accent-cyanNeon bg-black border border-slate-855 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-sans text-slate-300 font-bold">
                    <span>20</span>
                    <span>300</span>
                  </div>
                </div>

                {/* Slider 2 */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="text-slate-200 font-bold">2. Generator Output Rating</span>
                    <span className="text-cyanNeon font-extrabold font-sans text-sm">{genKw} kW</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="1000" 
                    step="50" 
                    value={genKw}
                    onChange={(e) => setGenKw(Number(e.target.value))}
                    className="w-full accent-cyanNeon bg-black border border-slate-855 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-sans text-slate-300 font-bold">
                    <span>50 kW</span>
                    <span>1,000 kW</span>
                  </div>
                </div>

                {/* Slider 3 */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="text-slate-200 font-bold">3. Emergency Fuel Reserve</span>
                    <span className="text-cyanNeon font-extrabold font-sans text-sm">{fuelGallons.toLocaleString()} Gallons</span>
                  </div>
                  <input 
                    type="range" 
                    min="200" 
                    max="5000" 
                    step="100" 
                    value={fuelGallons}
                    onChange={(e) => setFuelGallons(Number(e.target.value))}
                    className="w-full accent-cyanNeon bg-black border border-slate-855 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-sans text-slate-300 font-bold">
                    <span>200 gal</span>
                    <span>5,000 gal</span>
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-800 mt-6 text-xs text-emerald-400 leading-relaxed flex items-start gap-2.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>On-site fuel reserves must continuously cover the full facility generator opex.</span>
              </div>
            </div>

            {/* Right: Workspace & Timeline (col-span-8) */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-extrabold font-sans text-slate-200 uppercase tracking-widest block">
                    96-Hour Emergency Run Compliance Timeline
                  </span>
                  <span className={`text-[10px] uppercase px-2.5 py-0.5 rounded font-black border tracking-wider select-none ${
                    isFullyCompliant 
                      ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" 
                      : "bg-redNeon/20 border-redNeon/40 text-redNeon glow-red"
                  }`}>
                    {isFullyCompliant ? "COMPLIANT" : "DEFICIT WARNING"}
                  </span>
                </div>

                {/* Custom Responsive SVG horizontal compliance timeline bar */}
                <div className="relative h-64 w-full bg-black p-3 rounded-xl border border-slate-800 flex items-center justify-center">
                  <svg viewBox="0 0 500 180" fill="none" className="w-full h-full">
                    {/* Timeline rail */}
                    <rect x="50" y="70" width="400" height="24" rx="12" fill="#111827" stroke="#334155" strokeWidth="2" />
                    
                    {/* compliance mark (96 hours = 320px) */}
                    <line x1="370" y1="50" x2="370" y2="114" stroke="#475569" strokeWidth="2" strokeDasharray="3 3" />
                    <text x="370" y="44" fill="#cbd5e1" fontFamily="monospace" fontSize="9" fontWeight="black" textAnchor="middle">96-HR STATUTE</text>

                    {/* Progress Bar */}
                    <rect x="55" y="75" width={barWidth} height="14" rx="7" 
                      fill={totalSustainedHours >= 96 ? "url(#greenGrad)" : "url(#amberGrad)"} 
                    />

                    {/* Timeline text ticks */}
                    <text x="50" y="115" fill="#cbd5e1" fontFamily="monospace" fontSize="9" fontWeight="bold">0 hr</text>
                    <text x="130" y="115" fill="#cbd5e1" fontFamily="monospace" fontSize="9" fontWeight="bold">24 hr</text>
                    <text x="210" y="115" fill="#cbd5e1" fontFamily="monospace" fontSize="9" fontWeight="bold">48 hr</text>
                    <text x="290" y="115" fill="#cbd5e1" fontFamily="monospace" fontSize="9" fontWeight="bold">72 hr</text>
                    <text x="370" y="115" fill="#cbd5e1" fontFamily="monospace" fontSize="9" fontWeight="bold">96 hr</text>
                    <text x="440" y="115" fill="#cbd5e1" fontFamily="monospace" fontSize="9" fontWeight="bold">120 hr</text>

                    {/* Duration Text */}
                    <text x="250" y="150" fill="#f8fafc" fontFamily="monospace" fontSize="16" fontWeight="black" textAnchor="middle">
                      {totalSustainedHours.toFixed(1)} Hours Runtime
                    </text>

                    <defs>
                      <linearGradient id="greenGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="amberGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Metric Scorecards underneath the chart */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs pt-6">
                <div className="bg-black border border-slate-800 p-4.5 rounded-xl text-left">
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-extrabold font-bold">kW Load Check</span>
                  <span className={`text-xl font-black mt-1 block font-sans ${isKwCompliant ? "text-white" : "text-amber-500"}`}>
                    {genKw} kW / {requiredCapacityKw.toFixed(0)} kW
                  </span>
                </div>
                <div className="bg-black border border-slate-800 p-4.5 rounded-xl text-left">
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-extrabold font-bold">Fuel opex Burn Rate</span>
                  <span className="text-xl font-black text-white mt-1 block font-sans">{fuelConsumptionPerHour.toFixed(1)} gal/hr</span>
                </div>
                <div className={`p-4.5 rounded-xl transition-all duration-300 text-left ${
                  isFullyCompliant ? "bg-emeraldNeon/10 border border-emeraldNeon/30" : "bg-redNeon/20 border border-redNeon/40 glow-red"
                }`} id="card-payback">
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-extrabold font-bold">HHSC Rating</span>
                  <span className={`text-xl font-black mt-1 block font-sans ${
                    isFullyCompliant ? "text-emeraldNeon" : "text-redNeon text-glow-red animate-pulse"
                  }`}>
                    {isFullyCompliant ? "COMPLIANT" : "NON-COMPLIANT"}
                  </span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: About Calc */}
        {activeTab === "about" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl leading-relaxed">
            <h3 className="text-lg font-bold font-sans border-b border-slate-800 pb-3 flex items-center gap-2 text-white">
              <span className="text-cyanNeon"><Info className="w-5 h-5" /></span> Texas HHSC Ambient 88°F Rule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[13px] text-slate-100 font-medium">
              <div className="space-y-3 bg-black border border-slate-800 p-6 rounded-xl">
                <span className="text-redNeon font-sans font-extrabold uppercase text-[11px] tracking-wider block">The 96-Hour Blackout Statute</span>
                <p className="leading-relaxed text-slate-200">
                  Texas long-term care and nursing facilities are strictly mandated by the Health and Human Services Commission (HHSC) to maintain emergency backup generator infrastructure capable of keeping facility temperatures under 88°F for a minimum of 96 continuous hours during grid blackouts.
                </p>
              </div>
              <div className="space-y-3 bg-black border border-slate-800 p-6 rounded-xl">
                <span className="text-emeraldNeon font-sans font-extrabold uppercase text-[11px] tracking-wider block">Substation Load Requirements</span>
                <p className="leading-relaxed text-slate-200">
                  To achieve PE electrical certification, generator sets must provide at least 1.5 kW of emergency output capacity per licensed resident bed to run portable cooling fans, medical equipment, and auxiliary facility safety circuits simultaneously.
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
                <h3 className="text-base font-bold font-sans flex items-center gap-2 text-white"><Gavel className="w-4 h-4 text-cyanNeon" /> HHSC Statutory Rules & Equations</h3>
                <p className="text-slate-200 text-xs mt-1 font-semibold leading-relaxed">Our facility math engine maps the exact regulatory boundaries defined under Texas care emergency laws:</p>
              </div>
              
              <div className="space-y-4 text-xs font-mono">
                <div className="bg-black border border-slate-800 p-4 rounded-xl">
                  <span className="text-[10px] text-slate-300 uppercase tracking-widest block font-extrabold mb-2">Equation 01: Minimum Safety kW Output Load</span>
                  <div className="text-sm font-bold text-cyanNeon text-glow-cyan py-1 font-mono">
                    Required_kW = Beds * 1.50
                  </div>
                  <p className="text-[10px] text-slate-300 leading-relaxed mt-2 font-mono font-bold">
                    *HHSC guidelines mandate a baseline 1.5 kW safety generator draw per registered bed capacity.
                  </p>
                </div>
                <div className="bg-black border border-slate-800 p-4 rounded-xl">
                  <span className="text-[10px] text-slate-300 uppercase tracking-widest block font-extrabold mb-2">Equation 02: Generator Fuel opex Burn Rate</span>
                  <div className="text-sm font-bold text-cyanNeon text-glow-cyan py-1 font-mono">
                    Burn_Rate_GPH = Generator_kW * 0.07
                  </div>
                  <p className="text-[10px] text-slate-300 leading-relaxed mt-2 font-mono font-bold">
                    *Assumes standard heavy-duty diesel/propane generator burn constants of 0.07 gallons per kilowatt-hour load.
                  </p>
                </div>
                <div className="bg-black border border-slate-800 p-4 rounded-xl">
                  <span className="text-[10px] text-slate-300 uppercase tracking-widest block font-extrabold mb-2">Equation 03: Emergency Fuel Reserve Duration (Hours)</span>
                  <div className="text-sm font-bold text-cyanNeon text-glow-cyan py-1 font-mono">
                    Duration_Hours = Tank_Gallons / Burn_Rate_GPH
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Gated consultation booking form */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl text-left">
              <div className="space-y-4">
                <div>
                  <span className="bg-indigoNeon/20 text-[#818cf8] text-[10px] font-sans border border-indigoNeon/30 px-2.5 py-0.5 rounded font-extrabold uppercase tracking-widest block max-w-fit">SAFETY INTERCONNECTION</span>
                  <h3 className="text-base font-extrabold font-sans mt-2 text-white">Book Care Engineering Review</h3>
                  <p className="text-slate-200 text-xs mt-1.5 leading-relaxed font-semibold">Let our Texas PE engineers review your backup substations, fuel tanks, transfer switches, and audit your statutory 96-hour cooling capacity plans.</p>
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
                      Dispatch Substation Scope <ArrowRight className="w-4 h-4 inline ml-1.5" />
                    </button>
                  </form>
                ) : (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emeraldNeon rounded-xl text-xs leading-relaxed font-sans font-bold">
                    ✓ Care credentials logged. Substation design audits and PE review calendar invitations dispatched to your inbox.
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
              <h3 className="text-base font-bold font-sans flex items-center gap-2 text-white"><Network className="w-4 h-4 text-indigoNeon" /> Care Substation Electrical & Fuel Ingress</h3>
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

                  {/* Node 1: Licensed Beds */}
                  <g className="cursor-pointer" onClick={() => setSelectedArchNode("beds")}>
                    <rect x="20" y="60" width="100" height="80" rx="6" fill={selectedArchNode === "beds" ? "#0a0f1d" : "#1e293b"} stroke="#6366f1" strokeWidth={selectedArchNode === "beds" ? "2" : "1.5"} />
                    <text x="70" y="95" fill="#f8fafc" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle">01 BEDS</text>
                    <text x="70" y="115" fill="#cbd5e1" fontFamily="monospace" fontSize="7" fontWeight="bold" textAnchor="middle">Required kW</text>
                  </g>

                  {/* Node 2: Generator */}
                  <g className="cursor-pointer" onClick={() => setSelectedArchNode("generator")}>
                    <rect x="250" y="40" width="160" height="120" rx="8" fill={selectedArchNode === "generator" ? "#0a0f1d" : "#1e293b"} stroke="#00f0ff" strokeWidth={selectedArchNode === "generator" ? "2.5" : "1.5"} />
                    <text x="330" y="90" fill="#f8fafc" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle">02 GENERATOR SET</text>
                    <text x="330" y="110" fill="#00f0ff" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle">Substation Output</text>
                  </g>

                  {/* Node 3: Fuel Tank */}
                  <g className="cursor-pointer" onClick={() => setSelectedArchNode("fuel")}>
                    <rect x="540" y="50" width="160" height="100" rx="8" fill={selectedArchNode === "fuel" ? "#0a0f1d" : "#1e293b"} stroke="#00f0ff" strokeWidth={selectedArchNode === "fuel" ? "2.5" : "1.5"} />
                    <text x="620" y="95" fill="#f8fafc" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle">03 FUEL RESERVE</text>
                    <text x="620" y="115" fill="#6366f1" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle">Substation Gal</text>
                  </g>

                  {/* Node 4: 96-Hr Gate */}
                  <g className="cursor-pointer" onClick={() => setSelectedArchNode("safety")}>
                    <rect x="830" y="70" width="150" height="60" rx="6" fill={selectedArchNode === "safety" ? "#0a0f1d" : "#111827"} stroke="#475569" strokeWidth="1.5" />
                    <text x="905" y="105" fill="#cbd5e1" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle">04 COMPLIANCE</text>
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
            <span className="text-xs text-slate-200 font-mono ml-2 font-bold">hhsc_emergency_stdout.log</span>
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
                log.type === "fatal" ? "text-redNeon text-glow-red animate-pulse" : 
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
            <CalendarDays className="w-4 h-4" /> statutory PE Substation Review
          </div>
          <h3 className="text-lg font-black font-sans leading-tight text-white">Book a free 15-minute operational emergency power review.</h3>
          <p className="text-slate-100 text-xs max-w-3xl leading-relaxed font-semibold">
            Evaluate high-capacity diesel fuel tanks, automated transfer switch topologies, and licensed PE safety calculations to secure 100% compliant HHSC operations.
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
                submitRating("calculator", "hhsc-generator", "up");
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
                submitRating("calculator", "hhsc-generator", "down");
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
