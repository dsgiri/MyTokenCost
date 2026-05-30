/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Sliders, 
  Server, 
  Activity, 
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

// Hardware constants matching specifications
const HARDWARE_MATRICES = {
  "MTK Lite Node": { cost: 1499, tdp: 0.24 },
  "MTK Pro Node": { cost: 3999, tdp: 0.48 },
  "MTK Cluster-4U": { cost: 8499, tdp: 1.20 }
};
const RUNTIME_EFFICIENCY = 50000; // tokens handled locally per kWh

interface LogLine {
  timestamp: string;
  type: "init" | "config" | "utility" | "finops" | "listen";
  message: string;
}

export default function SpendVsNode() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"calc" | "about" | "rules" | "architecture">("calc");
  
  // Slider Inputs
  const [spend, setSpend] = useState(1250);
  const [tokens, setTokens] = useState(2500000);
  const [rate, setRate] = useState(0.14);

  // Staging console logs
  const [logs, setLogs] = useState<LogLine[]>([]);
  
  // Interactive SVG architecture states
  const [selectedArchNode, setSelectedArchNode] = useState<"client" | "proxy" | "hardware" | "local">("proxy");

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

  // Mount check & load ratings from Supabase
  useEffect(() => {
    setMounted(true);
    fetchRatings("calculator", "spend-vs-node").then((summary) => {
      setUpvotes(summary.upvotes);
      setDownvotes(summary.downvotes);
      if (summary.userVote === "up") setLiked(true);
      if (summary.userVote === "down") setLiked(false);
    }).catch(() => {});
  }, []);

  // Recalculate metrics on input change and trigger stdout logging
  useEffect(() => {
    if (!mounted) return;

    // Node classification logic
    let matchedNode = "MTK Lite Node";
    if (tokens > 5000000 || spend > 3000) matchedNode = "MTK Cluster-4U";
    else if (tokens > 2000000 || spend > 1000) matchedNode = "MTK Pro Node";

    const nodeCost = HARDWARE_MATRICES[matchedNode as keyof typeof HARDWARE_MATRICES].cost;
    const localOpex = (tokens / RUNTIME_EFFICIENCY) * rate * 24 * 30;
    const payback = (spend - localOpex) > 0 ? (nodeCost / (spend - localOpex)) : 99;

    const stamp = new Date().toLocaleTimeString();
    const newLogs: LogLine[] = [
      { timestamp: stamp, type: "init", message: "Standardized template metrics synchronized." },
      { timestamp: stamp, type: "config", message: `NODE CONFIG - Target matched: ${matchedNode} ($${nodeCost.toLocaleString()} capex upfront)` },
      { timestamp: stamp, type: "utility", message: `RESOURCE METROLOGY - Ongoing utility projection: $${localOpex.toFixed(2)}/mo continuous opex` },
      { timestamp: stamp, type: "finops", message: `FINOPS PROFILE - Payback horizon curve projected at ${payback >= 99 ? "INFINITE" : payback.toFixed(1)} months.` },
      { timestamp: stamp, type: "listen", message: "LISTENING - Standing by for telemetry metrics hook inside /public subfolder..." }
    ];

    setLogs(newLogs);

    // Auto-scroll logs
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [spend, tokens, rate, mounted]);

  if (!mounted) return null;

  // Perform Calculations
  let matchedNodeKey = "MTK Lite Node";
  if (tokens > 5000000 || spend > 3000) matchedNodeKey = "MTK Cluster-4U";
  else if (tokens > 2000000 || spend > 1000) matchedNodeKey = "MTK Pro Node";

  const matchedNodeData = HARDWARE_MATRICES[matchedNodeKey as keyof typeof HARDWARE_MATRICES];
  const localMonthlyUtilityCost = (tokens / RUNTIME_EFFICIENCY) * rate * 24 * 30;
  const netMonthlySavings = spend - localMonthlyUtilityCost;
  const paybackMonths = netMonthlySavings > 0 ? (matchedNodeData.cost / netMonthlySavings) : 99;
  const annualSavings = netMonthlySavings > 0 ? (netMonthlySavings * 12) : 0;

  // Generate SVG graph coordinates
  const generateGraphPoints = () => {
    const width = 600;
    const height = 240;
    const padding = 20;

    const maxVal = Math.max(spend * 12, matchedNodeData.cost + (localMonthlyUtilityCost * 12));
    
    const getX = (month: number) => padding + ((width - padding * 2) * month) / 11;
    const getY = (val: number) => height - padding - ((val / maxVal) * (height - padding * 2));

    const cloudCoords = Array.from({ length: 12 }, (_, i) => {
      const x = getX(i);
      const y = getY(spend * (i + 1));
      return `${x},${y}`;
    }).join(" ");

    const nodeCoords = Array.from({ length: 12 }, (_, i) => {
      const x = getX(i);
      const y = getY(matchedNodeData.cost + (localMonthlyUtilityCost * (i + 1)));
      return `${x},${y}`;
    }).join(" ");

    return { cloudCoords, nodeCoords, getX, getY };
  };

  const graphPoints = generateGraphPoints();

  // Social Shares
  const handleShare = (platform: "twitter" | "linkedin" | "facebook" | "reddit" | "copy") => {
    const paybackText = paybackMonths >= 99 ? "Infinite" : `${paybackMonths.toFixed(1)} months`;
    const text = `Just calculated our AI cost optimization: switching from SaaS to our own bare-metal GPU workstation pays for itself in just ${paybackText}, saving $${Math.round(annualSavings).toLocaleString()}/year! Check your break-even opex at:`;
    const url = "https://mytokencost.com/calc/spend-vs-node";

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

  // Subreddit Redirection
  const pushToSubreddit = () => {
    const title = `Telemetry Parameter Adjustment suggestion`;
    window.open(`https://www.reddit.com/r/MyTokenCost/submit?title=${encodeURIComponent(title)}&text=${encodeURIComponent(feedbackText)}`, "_blank");
  };

  // Node Descriptions
  const archNodes = {
    client: {
      title: "01 Client Ingest Terminal",
      body: "Tracks development text buffers and prompt pipelines. Strips redundant whitespaces and line breaks client-side to minimize unoptimized token context before transmission."
    },
    proxy: {
      title: "02 MTC Proxy Middleware",
      body: "Our zero-retention cloud proxy maps input metrics. It manages local-routing strategies and checks state compliance before directing tasks to local hardware workstation nodes."
    },
    hardware: {
      title: "03 Dedicated Local GPU Workstation",
      body: "Turnkey workstation nodes running silent offline inference model pools (Ollama/CUDA). Computes heavy completions locally using flat grid utility electricity costs."
    },
    local: {
      title: "04 Local Safe Terminal",
      body: "Final safe sandboxed runtime kernel execution environment. Keeps proprietary company data air-gapped, fully complying with standard regulatory security requirements."
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left font-sans antialiased text-slate-100 selection:bg-cyanNeon selection:text-darkBg">
      
      {/* Zone 2: Title Block */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-sans text-xs text-cyanNeon tracking-wider font-extrabold uppercase">
            <Activity className="w-4 h-4 text-cyanNeon" /> Platform Template V1.0
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-white flex flex-wrap items-center gap-2">
            Cloud Spend vs. <span className="text-cyanNeon font-black">Bare-Metal Node ROI</span>
          </h2>
          <p className="text-sm text-slate-200 max-w-3xl leading-relaxed font-medium">
            Standardized Telemetry Tracker (ID: <code className="bg-black text-slate-100 px-1.5 py-0.5 rounded border border-slate-700 font-mono text-xs">calc-spend-vs-node</code>). Project capital break-even curves comparing continuous cloud landlord API subscriptions against owned hardware nodes.
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
                    <span className="text-slate-200 font-bold">Monthly Cloud Spend</span>
                    <span className="text-cyanNeon font-extrabold font-sans text-sm">${spend.toLocaleString()} / mo</span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="10000" 
                    step="100" 
                    value={spend}
                    onChange={(e) => setSpend(Number(e.target.value))}
                    className="w-full accent-cyanNeon bg-black border border-slate-850 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-sans text-slate-300 font-bold">
                    <span>$100</span>
                    <span>$10,000</span>
                  </div>
                </div>

                {/* Slider 2 */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="text-slate-200 font-bold">Tokens Processed / Day</span>
                    <span className="text-cyanNeon font-extrabold font-sans text-sm">{(tokens / 1000000).toFixed(1)}M Tokens</span>
                  </div>
                  <input 
                    type="range" 
                    min="100000" 
                    max="10000000" 
                    step="100000" 
                    value={tokens}
                    onChange={(e) => setTokens(Number(e.target.value))}
                    className="w-full accent-cyanNeon bg-black border border-slate-850 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-sans text-slate-300 font-bold">
                    <span>100K</span>
                    <span>10M</span>
                  </div>
                </div>

                {/* Slider 3 */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="text-slate-200 font-bold">Local Electricity Rate</span>
                    <span className="text-cyanNeon font-extrabold font-sans text-sm">${rate.toFixed(2)} / kWh</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.05" 
                    max="0.45" 
                    step="0.01" 
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full accent-cyanNeon bg-black border border-slate-850 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-sans text-slate-300 font-bold">
                    <span>$0.05</span>
                    <span>$0.45</span>
                  </div>
                </div>

                {/* Recommended Node */}
                <div className="p-4 bg-black rounded-xl border border-slate-750 flex items-center justify-between text-sm font-sans">
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-300 uppercase font-extrabold">Recommended Node Setup:</div>
                    <div className="font-extrabold text-white text-base">{matchedNodeKey}</div>
                  </div>
                  <Server className="w-5 h-5 text-cyanNeon" />
                </div>
              </div>

              <div className="pt-5 border-t border-slate-800 mt-6 text-xs text-emerald-400 leading-relaxed flex items-start gap-2.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Local air-gapped workstations drop marginal execution opex down near utility power bounds.</span>
              </div>
            </div>

            {/* Right: Workspace & Graphs (col-span-8) */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-extrabold font-sans text-slate-200 uppercase tracking-widest block">
                    FinOps Payback Horizon Timeline
                  </span>
                  <div className="flex gap-4 text-[10px] font-sans text-slate-200 font-extrabold">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded bg-[#ef4444] block"></span> Cloud API</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded bg-cyanNeon block"></span> Bare-Metal Node</span>
                  </div>
                </div>

                {/* Custom Responsive SVG Timeline Graph (SSR Safe) */}
                <div className="relative h-64 w-full bg-black p-3 rounded-xl border border-slate-800">
                  <svg viewBox="0 0 600 240" fill="none" className="w-full h-full">
                    {/* Grid lines */}
                    <line x1="20" y1="220" x2="580" y2="220" stroke="#1e293b" strokeWidth="1.5" />
                    <line x1="20" y1="120" x2="580" y2="120" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 4" />
                    <line x1="20" y1="20" x2="580" y2="20" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 4" />

                    {/* Timeline curves */}
                    <polyline points={graphPoints.cloudCoords} stroke="#ef4444" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points={graphPoints.nodeCoords} stroke="#00f0ff" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Area fill for Node */}
                    <path d={`M 20,220 L ${graphPoints.nodeCoords} L 580,220 Z`} fill="rgba(0,240,255,0.03)" />

                    {/* Labels */}
                    <text x="20" y="235" fill="#cbd5e1" fontFamily="monospace" fontSize="10" fontWeight="bold">M1</text>
                    <text x="120" y="235" fill="#cbd5e1" fontFamily="monospace" fontSize="10" fontWeight="bold">M3</text>
                    <text x="270" y="235" fill="#cbd5e1" fontFamily="monospace" fontSize="10" fontWeight="bold">M6</text>
                    <text x="420" y="235" fill="#cbd5e1" fontFamily="monospace" fontSize="10" fontWeight="bold">M9</text>
                    <text x="560" y="235" fill="#cbd5e1" fontFamily="monospace" fontSize="10" fontWeight="bold">M12</text>
                  </svg>
                </div>
              </div>

              {/* Metric Scorecards underneath the chart */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs pt-6">
                <div className="bg-black border border-slate-800 p-4.5 rounded-xl text-left">
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-extrabold">Annual Loss Deflected</span>
                  <span className="text-2xl font-black text-white mt-1 block font-sans">${Math.round(annualSavings).toLocaleString()}</span>
                </div>
                <div className={`p-4.5 rounded-xl transition-all duration-300 text-left ${
                  paybackMonths > 12 ? "bg-redNeon/20 border border-redNeon/40 glow-red" : "bg-black border border-slate-800"
                }`} id="card-payback">
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-extrabold">Amortization Payback</span>
                  <span className={`text-2xl font-black mt-1 block font-sans ${
                    paybackMonths > 12 ? "text-redNeon text-glow-red animate-pulse" : "text-cyanNeon text-glow-cyan"
                  }`}>
                    {paybackMonths >= 99 ? "Infinite" : `${paybackMonths.toFixed(1)} Months`}
                  </span>
                </div>
                <div className="bg-black border border-slate-800 p-4.5 rounded-xl text-left">
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-extrabold">Continuous Node Power</span>
                  <span className="text-2xl font-black text-white mt-1 block font-sans">{matchedNodeData.tdp.toFixed(2)} kW</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: About Calc */}
        {activeTab === "about" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl leading-relaxed">
            <h3 className="text-lg font-bold font-sans border-b border-slate-800 pb-3 flex items-center gap-2 text-white">
              <span className="text-cyanNeon"><Info className="w-5 h-5" /></span> Strategic Hardware Execution Topologies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[13px] text-slate-100 font-medium">
              <div className="space-y-3 bg-black border border-slate-800 p-6 rounded-xl">
                <span className="text-redNeon font-sans font-extrabold uppercase text-[11px] tracking-wider block">The Cloud Landlord Premise</span>
                <p className="leading-relaxed text-slate-200">
                  As multi-agent processing systems and massive context sizes (dense prompt logs) expand, continuous renting of API queries gets excessively high. Upstream cloud providers capture continuous double-digit gross margins by charging transactional context rent metrics.
                </p>
              </div>
              <div className="space-y-3 bg-black border border-slate-800 p-6 rounded-xl">
                <span className="text-emeraldNeon font-sans font-extrabold uppercase text-[11px] tracking-wider block">The Local Sovereign Alternative</span>
                <p className="leading-relaxed text-slate-200">
                  Transitioning local execution loops onto dedicated, localized bare-metal workstations drops transaction billing entirely. The continuous running cost maps straight to utility electrical power capacity bounds, reducing ongoing API fees to fraction limits.
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
                <h3 className="text-base font-bold font-sans flex items-center gap-2 text-white"><Gavel className="w-4 h-4 text-cyanNeon" /> Mathematics & Constants Rules</h3>
                <p className="text-slate-200 text-xs mt-1 font-semibold leading-relaxed">Our local state engine utilizes these verified mathematical equations to map ongoing finops metrics:</p>
              </div>
              
              <div className="space-y-4 text-xs font-mono">
                <div className="bg-black border border-slate-800 p-4 rounded-xl">
                  <span className="text-[10px] text-slate-300 uppercase tracking-widest block font-extrabold mb-2">Equation 01: Cloud Context Rent Accumulation</span>
                  <div className="text-sm font-bold text-cyanNeon text-glow-cyan py-1 font-mono">
                    C_cloud(t) = M_api * t
                  </div>
                </div>
                <div className="bg-black border border-slate-800 p-4 rounded-xl">
                  <span className="text-[10px] text-slate-300 uppercase tracking-widest block font-extrabold mb-2">Equation 02: Amortized Local Utility Opex Projections</span>
                  <div className="text-sm font-bold text-cyanNeon text-glow-cyan py-1 font-mono">
                    Opex_local = ( T_day / 50,000 ) * R_utility * 24 * 30
                  </div>
                  <p className="text-[10px] text-slate-300 leading-relaxed mt-2 font-mono font-bold">
                    *Assumes a constant processing throughput density coefficient of 50,000 tokens per kilowatt-hour utility load.
                  </p>
                </div>
                <div className="bg-black border border-slate-800 p-4 rounded-xl">
                  <span className="text-[10px] text-slate-300 uppercase tracking-widest block font-extrabold mb-2">Equation 03: Combined Capex + Opex Hardware Payback Horizon</span>
                  <div className="text-sm font-bold text-cyanNeon text-glow-cyan py-1 font-mono">
                    Payback = Hardware_Capex / ( M_api - Opex_local )
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Gated consultation booking form */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl text-left">
              <div className="space-y-4">
                <div>
                  <span className="bg-indigoNeon/20 text-[#818cf8] text-[10px] font-sans border border-indigoNeon/30 px-2.5 py-0.5 rounded font-extrabold uppercase tracking-widest block max-w-fit">GATEWAY REGISTRY</span>
                  <h3 className="text-base font-extrabold font-sans mt-2 text-white">Book B2B Intake Audit</h3>
                  <p className="text-slate-200 text-xs mt-1.5 leading-relaxed font-semibold">Let our infrastructure group securely check your prompt arrays and configure gateway routes straight against local grid limits.</p>
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
                      Dispatch Intake Scope <ArrowRight className="w-4 h-4 inline ml-1.5" />
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
              <h3 className="text-base font-bold font-sans flex items-center gap-2 text-white"><Network className="w-4 h-4 text-indigoNeon" /> System Data Ingress Pipeline</h3>
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

                  {/* Node 1: Client Ingest */}
                  <g className="cursor-pointer" onClick={() => setSelectedArchNode("client")}>
                    <rect x="20" y="60" width="100" height="80" rx="6" fill={selectedArchNode === "client" ? "#0a0f1d" : "#1e293b"} stroke="#6366f1" strokeWidth={selectedArchNode === "client" ? "2" : "1.5"} />
                    <text x="70" y="95" fill="#f8fafc" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle">01 CLIENT</text>
                    <text x="70" y="115" fill="#cbd5e1" fontFamily="monospace" fontSize="7" fontWeight="bold" textAnchor="middle">IDE Ingest</text>
                  </g>

                  {/* Node 2: MTC Proxy */}
                  <g className="cursor-pointer" onClick={() => setSelectedArchNode("proxy")}>
                    <rect x="250" y="40" width="160" height="120" rx="8" fill={selectedArchNode === "proxy" ? "#0a0f1d" : "#1e293b"} stroke="#00f0ff" strokeWidth={selectedArchNode === "proxy" ? "2.5" : "1.5"} />
                    <text x="330" y="90" fill="#f8fafc" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle">02 MTC PROXY</text>
                    <text x="330" y="110" fill="#00f0ff" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle">api.mytokencost.com</text>
                  </g>

                  {/* Node 3: Local Workstation */}
                  <g className="cursor-pointer" onClick={() => setSelectedArchNode("hardware")}>
                    <rect x="540" y="50" width="160" height="100" rx="8" fill={selectedArchNode === "hardware" ? "#0a0f1d" : "#1e293b"} stroke="#00f0ff" strokeWidth={selectedArchNode === "hardware" ? "2.5" : "1.5"} />
                    <text x="620" y="95" fill="#f8fafc" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle">03 WORKSTATION</text>
                    <text x="620" y="115" fill="#6366f1" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle">Bare-Metal GPU</text>
                  </g>

                  {/* Node 4: Local System */}
                  <g className="cursor-pointer" onClick={() => setSelectedArchNode("local")}>
                    <rect x="830" y="70" width="150" height="60" rx="6" fill={selectedArchNode === "local" ? "#0a0f1d" : "#111827"} stroke="#475569" strokeWidth="1.5" />
                    <text x="905" y="105" fill="#cbd5e1" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle">LOCAL SYSTEM</text>
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
            <span className="text-xs text-slate-200 font-mono ml-2 font-bold">metrology_runtime_stdout.log</span>
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
            <CalendarDays className="w-4 h-4" /> Frictionless Infrastructure Review
          </div>
          <h3 className="text-lg font-black font-sans leading-tight text-white">Book a free 15-minute operational framework consultation with our core architects.</h3>
          <p className="text-slate-100 text-xs max-w-3xl leading-relaxed font-semibold">
            Evaluate localized hardware specs, dynamic energy rates, and custom prompt parsing systems to secure continuous zero-rent margin deflection.
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
                submitRating("calculator", "spend-vs-node", "up");
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
                submitRating("calculator", "spend-vs-node", "down");
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
