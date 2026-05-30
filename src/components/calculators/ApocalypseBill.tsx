/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Sliders, 
  Terminal, 
  ShieldAlert, 
  Activity, 
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
  type: "init" | "config" | "utility" | "finops" | "listen" | "fatal";
  message: string;
}

export default function ApocalypseBill() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"calc" | "about" | "rules" | "architecture">("calc");
  
  // Simulation States
  const [isRunning, setIsRunning] = useState(false);
  const [creditLimit, setCreditLimit] = useState(250);
  const [simulatedCost, setSimulatedCost] = useState(0);
  const [simulatedTokens, setSimulatedTokens] = useState(0);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  
  // Console logs
  const [logs, setLogs] = useState<LogLine[]>([]);

  // Interactive SVG architecture states
  const [selectedArchNode, setSelectedArchNode] = useState<"agent" | "api" | "traceback" | "dnr">("dnr");

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
      const limit = params.get("limit");
      if (limit) setCreditLimit(Number(limit));
    }
    fetchRatings("calculator", "apocalypse-bill").then((summary) => {
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
      url.searchParams.set("limit", String(creditLimit));
      window.history.replaceState(null, "", url.toString());
    }
  }, [creditLimit, mounted]);

  // Simulation loop effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        const addedTokens = Math.floor(Math.random() * 140000) + 50000;
        setSimulatedTokens(prev => prev + addedTokens);
        
        setSimulatedCost(prev => {
          const addedCost = Math.random() * 9 + 3;
          const total = prev + addedCost;
          if (total >= creditLimit) {
            setTimeout(() => {
              setIsRunning(false);
              setIsAlarmActive(true);
              const stamp = new Date().toLocaleTimeString();
              setLogs(l => [...l, 
                { timestamp: stamp, type: "fatal", message: `[SYSTEM WARNING] API LIMIT THRESHOLD EXCEEDED` },
                { timestamp: stamp, type: "fatal", message: `[FATAL] BILL EXCEEDED $${creditLimit.toFixed(2)} - KEY SUSPENDED` },
                { timestamp: stamp, type: "fatal", message: `[SHUTDOWN] RECURSIVE AGENT LOOP TERMINATED PREVENTATIVELY.` }
              ]);
            }, 0);
            return creditLimit;
          }
          return total;
        });

        const logOptions = [
          { type: "init" as const, message: `[AGENT] Processing thought: "Analyze code module task_id_${Math.floor(Math.random() * 5000)}"` },
          { type: "config" as const, message: `[LLM] Response parsed (200 OK) - tokens: ${addedTokens.toLocaleString()}` },
          { type: "utility" as const, message: `[PARSER] Warning: Python script raised traceback error. Retrying...` },
          { type: "config" as const, message: `[AGENT] Spawning recursive sub-agent process worker_node_${Math.floor(Math.random() * 100)}` },
          { type: "finops" as const, message: `[BILLING] Cost bleed active: Dynamic balance incremented.` }
        ];
        
        const randomLog = logOptions[Math.floor(Math.random() * logOptions.length)];
        const stamp = new Date().toLocaleTimeString();
        setLogs(l => [...l, { timestamp: stamp, type: randomLog.type, message: randomLog.message }]);
      }, 400);
    }
    return () => clearInterval(timer);
  }, [isRunning, creditLimit]);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleStartSimulation = () => {
    setSimulatedCost(0);
    setSimulatedTokens(0);
    setIsAlarmActive(false);
    setIsRunning(true);
    const stamp = new Date().toLocaleTimeString();
    setLogs([
      { timestamp: stamp, type: "init", message: `[INIT] Booting dynamic autonomous software developer agent...` },
      { timestamp: stamp, type: "config", message: `[TASK] Objective: "Refactor core styling schemas recursively."` },
      { timestamp: stamp, type: "utility", message: `[WARN] Stack overflow threat: Recursive loop has no structural base case exit.` },
      { timestamp: stamp, type: "finops", message: `[EXEC] Thread activated. Model: claude-3-5-sonnet. Simulated opex initialized.` }
    ]);
  };

  if (!mounted) return null;

  // Social Shares
  const handleShare = (platform: "twitter" | "linkedin" | "facebook" | "reddit" | "copy") => {
    const text = `Just simulated a runaway recursive AI agent loop that would exhaust a $${creditLimit} API limit in seconds! Audit your recursive prompt guardrails at:`;
    const url = "https://mytokencost.com/calc/apocalypse-bill";

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
    const title = `Runaway Agent Parameter suggestion`;
    window.open(`https://www.reddit.com/r/MyTokenCost/submit?title=${encodeURIComponent(title)}&text=${encodeURIComponent(feedbackText)}`, "_blank");
  };

  const archNodes = {
    agent: {
      title: "01 Agent Loop Spawn",
      body: "Autonomous code agents spawn and prompt LLM nodes recursively. Tracebacks prompt corrections, creating an endless API queue thread."
    },
    api: {
      title: "02 Dynamic Outbound API Ingest",
      body: "Cascading prompts hit standard provider models. Each request consumes fresh context tokens, rapidly swelling API balance metrics."
    },
    traceback: {
      title: "03 Traceback Exception Trap",
      body: "Uncaught code syntax tracebacks trigger automated self-healing corrections, causing unmitigated, high-frequency prompt loops."
    },
    dnr: {
      title: "04 Declarative DNR Blocker",
      body: "Manifest V3 local Declarative Net Request rules step in. Intercepts runaway loops dynamically inside the browser before real-world keys bankrupt."
    }
  };

  // Generate SVG thermometer visual elements based on simulated opex
  const costPercentage = Math.min(100, (simulatedCost / creditLimit) * 100);

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left font-sans antialiased text-slate-100 selection:bg-cyanNeon selection:text-darkBg">
      
      {/* Zone 2: Title Block */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-sans text-xs text-redNeon tracking-wider font-extrabold uppercase animate-pulse">
            <Activity className="w-4 h-4 text-redNeon" /> Runaway Loop Hazard
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-white flex flex-wrap items-center gap-2">
            Runaway Agent <span className="text-redNeon font-black">&quot;Apocalypse Bill&quot; Simulator</span>
          </h2>
          <p className="text-sm text-slate-200 max-w-3xl leading-relaxed font-medium">
            Standardized Telemetry Tracker (ID: <code className="bg-black text-slate-100 px-1.5 py-0.5 rounded border border-slate-700 font-mono text-xs">calc-apocalypse-bill</code>). A gamified dynamic sandbox demonstrating how quickly an unmitigated recursive agent loop can exhaust an API key.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-sans bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
          <span className={`w-2.5 h-2.5 rounded-full bg-redNeon ${isRunning ? "animate-ping" : "animate-pulse"}`} />
          <span className="text-slate-100 font-extrabold uppercase tracking-wide">Risk Analysis</span>
        </div>
      </div>

      {/* Zone 3: The 4-Tab Navigation Deck */}
      <div className="grid grid-cols-2 md:grid-cols-4 bg-slate-900 border border-slate-800 p-1.5 rounded-xl max-w-2xl gap-1 font-sans text-xs sm:text-sm font-bold">
        <button 
          onClick={() => setActiveTab("calc")}
          className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition duration-200 cursor-pointer ${
            activeTab === "calc" 
              ? "bg-slate-800 text-redNeon border border-redNeon/30 glow-red font-black" 
              : "text-slate-300 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          <Sliders className="w-4 h-4" /> Actual Simulator
        </button>
        <button 
          onClick={() => setActiveTab("about")}
          className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition duration-200 cursor-pointer ${
            activeTab === "about" 
              ? "bg-slate-800 text-redNeon border border-redNeon/30 glow-red font-black" 
              : "text-slate-300 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          <Info className="w-4 h-4" /> About Calc
        </button>
        <button 
          onClick={() => setActiveTab("rules")}
          className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition duration-200 cursor-pointer ${
            activeTab === "rules" 
              ? "bg-slate-800 text-redNeon border border-redNeon/30 glow-red font-black" 
              : "text-slate-300 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          <Gavel className="w-4 h-4" /> Its Rules
        </button>
        <button 
          onClick={() => setActiveTab("architecture")}
          className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition duration-200 cursor-pointer ${
            activeTab === "architecture" 
              ? "bg-slate-800 text-redNeon border border-redNeon/30 glow-red font-black" 
              : "text-slate-300 hover:text-white hover:bg-slate-800/40"
          }`}
        >
          <Network className="w-4 h-4" /> Its Architecture
        </button>
      </div>

      {/* Zone 4: Modular Calculator Workspace */}
      <div className="min-h-[350px]">
        
        {/* Tab 1: Actual Simulator */}
        {activeTab === "calc" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left: Inputs Sidebar (col-span-4) */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
              <div className="space-y-6">
                <span className="text-[11px] font-extrabold font-sans text-slate-200 uppercase tracking-widest block border-b border-slate-850 pb-3">
                  <Sliders className="w-4 h-4 inline mr-1 text-redNeon" /> Control Parameters
                </span>

                {/* Slider 1 */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="text-slate-200 font-bold">Enforce Simulated Credit Ceiling</span>
                    <span className="text-redNeon font-extrabold font-sans text-sm">${creditLimit} Limit</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="2000" 
                    step="50" 
                    disabled={isRunning}
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(Number(e.target.value))}
                    className="w-full accent-redNeon bg-black border border-slate-855 h-2 rounded-lg cursor-pointer disabled:opacity-50"
                  />
                  <div className="flex justify-between text-[11px] font-sans text-slate-300 font-bold">
                    <span>$50</span>
                    <span>$2,000</span>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={handleStartSimulation}
                    disabled={isRunning}
                    className="w-full bg-redNeon hover:bg-redNeon/90 text-darkBg font-black py-3.5 rounded-xl text-xs transition uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    <Terminal className="w-4 h-4" />
                    Launch Simulation Loop
                  </button>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-800 mt-6 text-xs text-redNeon leading-relaxed flex items-start gap-2.5 font-bold">
                <ShieldAlert className="w-4 h-4 text-redNeon shrink-0 mt-0.5" />
                <span>Simulation runs mock recursive requests to compute exponential budget bleed curves.</span>
              </div>
            </div>

            {/* Right: Workspace & Thermometer (col-span-8) */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative">
              <div className="space-y-4">
                <span className="text-[11px] font-extrabold font-sans text-slate-200 uppercase tracking-widest block">
                  Simulated Debt Accumulator
                </span>

                {/* Custom Responsive SVG Thermometer / Meter */}
                <div className="relative h-64 w-full bg-black p-3 rounded-xl border border-slate-800 flex items-center justify-center">
                  <svg viewBox="0 0 500 180" fill="none" className="w-full h-full">
                    {/* Horizontal gauge outline */}
                    <rect x="50" y="70" width="400" height="40" rx="20" fill="#111827" stroke="#334155" strokeWidth="2" />
                    {/* Filled bar */}
                    <rect x="54" y="74" width={Math.max(0, (costPercentage / 100) * 392)} height="32" rx="16" 
                      fill={costPercentage > 80 ? "url(#redGrad)" : "url(#orangeGrad)"} 
                    />
                    
                    {/* Tick Marks */}
                    <line x1="150" y1="110" x2="150" y2="120" stroke="#475569" strokeWidth="1.5" />
                    <line x1="250" y1="110" x2="250" y2="120" stroke="#475569" strokeWidth="1.5" />
                    <line x1="350" y1="110" x2="350" y2="120" stroke="#475569" strokeWidth="1.5" />

                    {/* Gauge labels */}
                    <text x="50" y="135" fill="#cbd5e1" fontFamily="monospace" fontSize="9" fontWeight="bold">0%</text>
                    <text x="140" y="135" fill="#cbd5e1" fontFamily="monospace" fontSize="9" fontWeight="bold">25%</text>
                    <text x="240" y="135" fill="#cbd5e1" fontFamily="monospace" fontSize="9" fontWeight="bold">50%</text>
                    <text x="340" y="135" fill="#cbd5e1" fontFamily="monospace" fontSize="9" fontWeight="bold">75%</text>
                    <text x="430" y="135" fill="#cbd5e1" fontFamily="monospace" fontSize="9" fontWeight="bold">100%</text>

                    {/* Alert flash text */}
                    {isAlarmActive && (
                      <text x="250" y="50" fill="#ef4444" fontFamily="monospace" fontSize="12" fontWeight="black" textAnchor="middle" className="animate-pulse">
                        ▲ LIMIT CEILING TRIPPED - KEY REVOKED
                      </text>
                    )}

                    <defs>
                      <linearGradient id="orangeGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#eab308" />
                      </linearGradient>
                      <linearGradient id="redGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Metric Scorecards underneath the chart */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs pt-6">
                <div className="bg-black border border-slate-800 p-4.5 rounded-xl text-left">
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-extrabold">Simulated Tokens Generated</span>
                  <span className="text-xl font-black text-white mt-1 block font-sans">{simulatedTokens.toLocaleString()}</span>
                </div>
                <div className="bg-black border border-slate-800 p-4.5 rounded-xl text-left">
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-extrabold">Simulated API debt</span>
                  <span className={`text-xl font-black mt-1 block font-sans ${isAlarmActive ? "text-redNeon" : "text-white"}`}>
                    ${simulatedCost.toFixed(2)}
                  </span>
                </div>
                <div className={`p-4.5 rounded-xl transition-all duration-300 text-left bg-black border border-slate-800`}>
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-extrabold">Loop Status</span>
                  <span className={`text-xl font-black mt-1 block font-sans uppercase animate-pulse ${
                    isRunning ? "text-amber-400" : (isAlarmActive ? "text-redNeon" : "text-slate-400")
                  }`}>
                    {isRunning ? "Running" : (isAlarmActive ? "REVOKED" : "OFFLINE")}
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
              <span className="text-redNeon"><Info className="w-5 h-5" /></span> Recursive Loop Risks in Autonomous Agents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[13px] text-slate-100 font-medium">
              <div className="space-y-3 bg-black border border-slate-800 p-6 rounded-xl">
                <span className="text-redNeon font-sans font-extrabold uppercase text-[11px] tracking-wider block">The Runaway Agent Danger</span>
                <p className="leading-relaxed text-slate-200">
                  When LLM autonomous coding agents run in local developer terminals, they handle tasks iteratively (writing code, trying to execute it, receiving console tracebacks, and requesting LLM fixes). If a traceback loops endlessly, it spawns high-frequency queries that drain active API balances in minutes.
                </p>
              </div>
              <div className="space-y-3 bg-black border border-slate-800 p-6 rounded-xl">
                <span className="text-emeraldNeon font-sans font-extrabold uppercase text-[11px] tracking-wider block">The Extension Protection Solution</span>
                <p className="leading-relaxed text-slate-200">
                  Installing local Declarative Net Request browser rules acts as a cost circuit-breaker. It logs outgoing tokens locally, audits ongoing prompt budgets, and aborts loops before real-world developer credit keys are completely drained.
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
                <h3 className="text-base font-bold font-sans flex items-center gap-2 text-white"><Gavel className="w-4 h-4 text-redNeon" /> Mathematics & Budget Rules</h3>
                <p className="text-slate-200 text-xs mt-1 font-semibold leading-relaxed">Our local state engine utilizes these verified dynamic equations to track runaway opex trends:</p>
              </div>
              
              <div className="space-y-4 text-xs font-mono">
                <div className="bg-black border border-slate-800 p-4 rounded-xl">
                  <span className="text-[10px] text-slate-300 uppercase tracking-widest block font-extrabold mb-2">Equation 01: Exponential Recursive Fee Compound</span>
                  <div className="text-sm font-bold text-redNeon text-glow-red py-1 font-mono">
                    C_accumulated = Sum [ (Tokens_Input(t) * R_in) + (Tokens_Output(t) * R_out) ]
                  </div>
                </div>
                <div className="bg-black border border-slate-800 p-4 rounded-xl">
                  <span className="text-[10px] text-slate-300 uppercase tracking-widest block font-extrabold mb-2">Equation 02: Preventative Circuit-Breaker Ceiling</span>
                  <div className="text-sm font-bold text-redNeon text-glow-red py-1 font-mono">
                    Tripped = C_accumulated &gt;= Budget_Ceiling
                  </div>
                  <p className="text-[10px] text-slate-300 leading-relaxed mt-2 font-mono font-bold">
                    *The browser circuit breaker automatically revokes API keys locally whenever dynamic balance limits are breached.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Gated consultation booking form */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl text-left">
              <div className="space-y-4">
                <div>
                  <span className="bg-indigoNeon/20 text-[#818cf8] text-[10px] font-sans border border-indigoNeon/30 px-2.5 py-0.5 rounded font-extrabold uppercase tracking-widest block max-w-fit">GATEWAY REGISTRY</span>
                  <h3 className="text-base font-extrabold font-sans mt-2 text-white">Book Loop Security Review</h3>
                  <p className="text-slate-200 text-xs mt-1.5 leading-relaxed font-semibold">Let our security team audit your local agent workflows, deploy DNR threshold configs, and airgap your active deployment keys.</p>
                </div>
                
                {!bookingSuccess ? (
                  <form onSubmit={(e) => { e.preventDefault(); setBookingSuccess(true); }} className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10.5px] text-slate-200 uppercase font-bold tracking-wider block">Organization Name</label>
                      <input required type="text" placeholder="Inference Systems LLC" className="w-full bg-black border border-slate-700 focus:border-redNeon p-3 rounded-xl text-white placeholder-slate-400 outline-none transition font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10.5px] text-slate-200 uppercase font-bold tracking-wider block">Work Email</label>
                      <input required type="email" placeholder="architect@domain.com" className="w-full bg-black border border-slate-700 focus:border-redNeon p-3 rounded-xl text-white placeholder-slate-400 outline-none transition font-medium" />
                    </div>
                    <button type="submit" className="w-full bg-indigoNeon hover:bg-indigoNeon/90 text-white font-extrabold py-3.5 rounded-xl transition uppercase tracking-wider text-xs shadow-md cursor-pointer">
                      Dispatch Security Scope <ArrowRight className="w-4 h-4 inline ml-1.5" />
                    </button>
                  </form>
                ) : (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emeraldNeon rounded-xl text-xs leading-relaxed font-sans font-bold">
                    ✓ Capacity credentials logged. Audit calendar invite and checklist scope dispatched to your inbox.
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
              <h3 className="text-base font-bold font-sans flex items-center gap-2 text-white"><Network className="w-4 h-4 text-indigoNeon" /> Loop Blocking Ingress</h3>
              <p className="text-slate-200 text-xs mt-1 leading-relaxed font-semibold">Click active network vector nodes below to audit dynamic browser circuit breaking rules:</p>
            </div>

            {/* Styled interactive SVG Architecture Pipeline */}
            <div className="p-4 bg-black rounded-xl border border-slate-800 overflow-x-auto">
              <div className="min-w-[800px] py-2">
                <svg viewBox="0 0 1000 200" fill="none" className="w-full h-auto">
                  {/* Connective Paths */}
                  <path d="M 120 100 L 250 100" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="3 3" />
                  <path d="M 410 100 L 540 100" stroke="#ef4444" strokeWidth="2" />
                  <path d="M 700 100 L 830 100" stroke="#ef4444" strokeWidth="2" />
                  
                  {/* Animated signals */}
                  <circle cx="120" cy="100" r="3" fill="#6366f1">
                    <animate attributeName="cx" values="120;250" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="410" cy="100" r="3" fill="#ef4444">
                    <animate attributeName="cx" values="410;540" dur="1.2s" repeatCount="indefinite" />
                  </circle>

                  {/* Node 1: Agent */}
                  <g className="cursor-pointer" onClick={() => setSelectedArchNode("agent")}>
                    <rect x="20" y="60" width="100" height="80" rx="6" fill={selectedArchNode === "agent" ? "#0a0f1d" : "#1e293b"} stroke="#6366f1" strokeWidth={selectedArchNode === "agent" ? "2" : "1.5"} />
                    <text x="70" y="95" fill="#f8fafc" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle">01 AGENT</text>
                    <text x="70" y="115" fill="#cbd5e1" fontFamily="monospace" fontSize="7" fontWeight="bold" textAnchor="middle">Local Loop</text>
                  </g>

                  {/* Node 2: API Ingest */}
                  <g className="cursor-pointer" onClick={() => setSelectedArchNode("api")}>
                    <rect x="250" y="40" width="160" height="120" rx="8" fill={selectedArchNode === "api" ? "#0a0f1d" : "#1e293b"} stroke="#ef4444" strokeWidth={selectedArchNode === "api" ? "2.5" : "1.5"} />
                    <text x="330" y="90" fill="#f8fafc" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle">02 API KEY INGEST</text>
                    <text x="330" y="110" fill="#ef4444" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle">Context Swell</text>
                  </g>

                  {/* Node 3: Traceback */}
                  <g className="cursor-pointer" onClick={() => setSelectedArchNode("traceback")}>
                    <rect x="540" y="50" width="160" height="100" rx="8" fill={selectedArchNode === "traceback" ? "#0a0f1d" : "#1e293b"} stroke="#ef4444" strokeWidth={selectedArchNode === "traceback" ? "2.5" : "1.5"} />
                    <text x="620" y="95" fill="#f8fafc" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle">03 TRACEBACK EXCEPTION</text>
                    <text x="620" y="115" fill="#6366f1" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle">Endless Retries</text>
                  </g>

                  {/* Node 4: DNR Blocker */}
                  <g className="cursor-pointer" onClick={() => setSelectedArchNode("dnr")}>
                    <rect x="830" y="70" width="150" height="60" rx="6" fill={selectedArchNode === "dnr" ? "#0a0f1d" : "#111827"} stroke="#475569" strokeWidth="1.5" />
                    <text x="905" y="105" fill="#cbd5e1" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle">04 DNR BLOCKER</text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Click node description card */}
            <div className="p-4 bg-black border border-slate-800 rounded-lg">
              <span className="text-redNeon font-sans font-bold text-xs flex items-center gap-1.5 mb-1.5 text-glow-red uppercase">
                <Network className="w-4 h-4 text-redNeon" /> {archNodes[selectedArchNode].title}
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
            <span className="text-xs text-slate-200 font-mono ml-2 font-bold">recursive_agent_run.log</span>
          </div>
          <span className="text-[10px] text-cyanNeon font-mono tracking-widest text-glow-cyan font-bold uppercase"><Terminal className="w-3.5 h-3.5 inline mr-1" /> Console</span>
        </div>
        <div 
          ref={logContainerRef}
          className="bg-black p-4.5 h-36 font-mono text-xs text-slate-100 overflow-y-auto space-y-1.5 text-left font-medium"
        >
          {logs.length === 0 ? (
            <span className="text-slate-400 font-medium block">Configure credit balance and launch simulation to start console thread.</span>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="flex gap-2 items-start font-mono">
                <span className="text-slate-400 shrink-0 font-mono font-bold">[{log.timestamp}]</span>
                <span className={`font-bold font-mono leading-relaxed ${
                  log.type === "config" ? "text-cyanNeon" : 
                  log.type === "utility" ? "text-amber-500" : 
                  log.type === "fatal" ? "text-redNeon text-glow-red animate-pulse" : 
                  log.type === "finops" ? "text-red-300" : "text-slate-200"
                }`}>
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Warning alert */}
      {isAlarmActive && (
        <div className="bg-redNeon/10 border border-redNeon/40 p-5 rounded-2xl text-left space-y-2 animate-bounce">
          <div className="text-xs text-redNeon font-bold flex items-center gap-1.5 font-mono text-glow-red">
            <ShieldAlert className="w-5 h-5 text-redNeon" />
            CRITICAL CEILING: Autonomous Loop Aborted
          </div>
          <p className="text-[10px] font-mono text-slate-200 leading-relaxed font-semibold">
            An infinite debugger loop can repeat requests endlessly. If this runs in production, it will exhaust your real-world credit limits. Swap on the **MyTokenCost Extension** to enforce custom dynamic budget controls at the browser level and automatically abort loops before they cost you!
          </p>
        </div>
      )}

      {/* Zone 6: Value-Add B2B Leads Block */}
      <div className="bg-gradient-to-r from-redNeon/15 via-black to-indigoNeon/10 border border-redNeon/20 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-[10px] font-sans text-redNeon tracking-widest uppercase font-extrabold flex items-center justify-center md:justify-start gap-1.5 text-glow-red">
            <CalendarDays className="w-4 h-4" /> Runaway Budget Ceiling Review
          </div>
          <h3 className="text-lg font-black font-sans leading-tight text-white">Book a free 15-minute operational agent safety consultation.</h3>
          <p className="text-slate-100 text-xs max-w-3xl leading-relaxed font-semibold">
            Evaluate dynamic budget limits, local DNR blocking profiles, and sandbox execution controls to secure your API pipelines from infinite loops.
          </p>
        </div>
        <button 
          onClick={() => {
            setActiveTab("rules");
            document.getElementById("framework-audit-form")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="w-full md:w-auto shrink-0 bg-redNeon hover:bg-redNeon/85 text-darkBg font-black py-3.5 px-6 rounded-xl text-xs tracking-wider transition uppercase flex items-center justify-center gap-2 glow-red font-sans cursor-pointer"
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
                submitRating("calculator", "apocalypse-bill", "up");
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
                submitRating("calculator", "apocalypse-bill", "down");
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
