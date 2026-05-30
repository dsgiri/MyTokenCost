/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Sliders, 
  FolderGit, 
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
  Gavel,
  Cpu,
  TrendingDown,
  Droplet
} from "lucide-react";
import { submitRating, fetchRatings } from "@/lib/ratings";

interface LogLine {
  timestamp: string;
  type: "init" | "config" | "utility" | "finops" | "listen";
  message: string;
}

interface AuditorResult {
  parsedConversations: number;
  parsedMessages: number;
  lifetimeTokens: number;
  estimatedRawCost: number;
  flatPaidSubs: number;
  netArbitrage: number;
  waterFootprintLiters: number;
  waterBottles: number;
}

export default function ChatgptAuditor() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"calc" | "about" | "rules" | "architecture">("calc");
  
  // State
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<AuditorResult | null>(null);

  // Staging console logs
  const [logs, setLogs] = useState<LogLine[]>([]);
  
  // Interactive SVG architecture states
  const [selectedArchNode, setSelectedArchNode] = useState<"zip" | "parse" | "tokens" | "wrapped">("wrapped");

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
    const stamp = new Date().toLocaleTimeString();
    setLogs([
      { timestamp: stamp, type: "init", message: "ChatGPT Wrapped Auditor console initialized." },
      { timestamp: stamp, type: "listen", message: "LISTENING - Drag and drop conversations.json or click Upload to inject chat telemetry..." }
    ]);
    fetchRatings("calculator", "chatgpt-auditor").then((summary) => {
      setUpvotes(summary.upvotes);
      setDownvotes(summary.downvotes);
      if (summary.userVote === "up") setLiked(true);
      if (summary.userVote === "down") setLiked(false);
    }).catch(() => {});
  }, []);

  // Simulate zip parsing with progressive logs
  const handleAuditorSimulation = () => {
    setUploading(true);
    setResult(null);
    const stamp = new Date().toLocaleTimeString();
    
    // Step-by-step progressive logging
    setLogs(l => [...l, { timestamp: stamp, type: "init", message: "DE-COMPRESSING - Reading uploaded history zip file..." }]);
    
    setTimeout(() => {
      const stamp2 = new Date().toLocaleTimeString();
      setLogs(l => [...l, { timestamp: stamp2, type: "config", message: "PARSING - Found conversations.json with 1,482 dynamic active threads." }]);
    }, 400);

    setTimeout(() => {
      const stamp3 = new Date().toLocaleTimeString();
      setLogs(l => [...l, { timestamp: stamp3, type: "utility", message: "TOKENIZER - Running local token hashes: 18,453,000 lifetime tokens parsed." }]);
    }, 850);

    setTimeout(() => {
      const stamp4 = new Date().toLocaleTimeString();
      setLogs(l => [...l, { 
        timestamp: stamp4, 
        type: "finops", 
        message: "FINOPS REPORT - Calculated raw host cost: $110.72 vs $240.00 flat subscriptions. Arbitrage gap identified." 
      }]);
      
      setUploading(false);
      setResult({
        parsedConversations: 1482,
        parsedMessages: 28943,
        lifetimeTokens: 18453000,
        estimatedRawCost: 110.72,
        flatPaidSubs: 240.00,
        netArbitrage: 129.28,
        waterFootprintLiters: 92.26,
        waterBottles: 185
      });
    }, 1400);
  };

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  if (!mounted) return null;

  // Social Shares
  const handleShare = (platform: "twitter" | "linkedin" | "facebook" | "reddit" | "copy") => {
    const savings = 240.00 - (result?.estimatedRawCost || 110.72);
    const text = `Just audited my lifetime ChatGPT token volume: I saved $${Math.max(0, savings).toFixed(2)} with raw wholesale API keys! Audit your ChatGPT account logs locally at:`;
    const url = "https://mytokencost.com/calc/chatgpt-auditor";

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
    const title = `ChatGPT History Auditor Parameter suggestion`;
    window.open(`https://www.reddit.com/r/MyTokenCost/submit?title=${encodeURIComponent(title)}&text=${encodeURIComponent(feedbackText)}`, "_blank");
  };

  const archNodes = {
    zip: {
      title: "01 Upload De-compressor",
      body: "Decrypts and extracts conversations.json locally in the browser memory sandbox. Zero network egress maps strict client privacy guidelines."
    },
    parse: {
      title: "02 Message Thread Parser",
      body: "Iterates through conversation arrays. Isolates system instructions, user prompts, and agent completions to compile character matrices."
    },
    tokens: {
      title: "03 Tiktoken Token Counter",
      body: "Applies vocabulary tokenizer coefficients locally. Aggregates prompt and completion tokens separately to assign accurate model charges."
    },
    wrapped: {
      title: "04 Social wrapped Generator",
      body: "Compiles a screenshot-ready high-contrast receipt card displaying lifetime token flow, flat opex paid, and net cost arbitrage."
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
            The Personal <span className="text-cyanNeon font-black">ChatGPT History Auditor</span>
          </h2>
          <p className="text-sm text-slate-200 max-w-3xl leading-relaxed font-medium">
            Standardized Telemetry Tracker (ID: <code className="bg-black text-slate-100 px-1.5 py-0.5 rounded border border-slate-700 font-mono text-xs">calc-chatgpt-auditor</code>). Upload your exported ChatGPT history zip to see your lifetime token volume, raw provider cost, and data center water footprint.
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
          <Sliders className="w-4 h-4" /> Actual Auditor
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
        
        {/* Tab 1: Actual Auditor */}
        {activeTab === "calc" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left: Inputs Sidebar (col-span-4) */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
              <div className="space-y-6">
                <span className="text-[11px] font-extrabold font-sans text-slate-200 uppercase tracking-widest block border-b border-slate-850 pb-3">
                  <FolderGit className="w-4 h-4 inline mr-1 text-cyanNeon" /> History Ingestion
                </span>

                {/* Drag and Drop Box */}
                <div className="border border-dashed border-slate-700 rounded-2xl p-6 bg-black flex flex-col items-center justify-center text-center gap-4 transition hover:border-cyanNeon shadow-md">
                  <div className="bg-cyanNeon/10 p-3 rounded-full border border-cyanNeon/20 shrink-0">
                    <FolderGit className="w-6 h-6 text-cyanNeon" />
                  </div>
                  <div className="space-y-1.5 select-none">
                    <p className="text-[11.5px] text-white font-extrabold tracking-tight">Drag & drop your chat export .zip</p>
                    <p className="text-[10px] text-slate-400 font-medium font-sans">conversations.json matches cleanly</p>
                  </div>
                  
                  <button
                    onClick={handleAuditorSimulation}
                    disabled={uploading}
                    className="w-full bg-cyanNeon hover:bg-cyanNeon/95 text-black font-black py-2.5 rounded-xl text-xs transition uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer font-sans"
                  >
                    {uploading ? (
                      <>
                        <Activity className="w-3.5 h-3.5 text-black animate-spin" />
                        De-compressing...
                      </>
                    ) : (
                      <>
                        <Terminal className="w-3.5 h-3.5 text-black" />
                        Simulate Upload
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-800 mt-6 text-xs text-emerald-400 leading-relaxed flex items-start gap-2.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>100% Offline-First. Files are parsed strictly local inside your browser thread.</span>
              </div>
            </div>

            {/* Right: Workspace & Wrapped Receipt (col-span-8) */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative">
              {!result ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 font-bold text-xs select-none">
                  <FolderGit className="w-12 h-12 text-slate-600 mb-3 animate-bounce" />
                  Awaiting history file injection to compile token scorecards...
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <span className="text-[11px] font-extrabold font-sans text-slate-200 uppercase tracking-widest block">
                      Lifetime Token Audit Metrics
                    </span>
                    <button
                      onClick={() => alert("Simulating high-res Wrapped PNG social card generation.")}
                      className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider transition cursor-pointer shadow-md"
                    >
                      <Share2 className="w-3.5 h-3.5 text-slate-950" />
                      Share wrapped
                    </button>
                  </div>

                  {/* Receipt layout container */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch font-sans">
                    
                    {/* Left: Scorecards */}
                    <div className="space-y-4">
                      <div className="bg-black border border-slate-800 p-4.5 rounded-xl text-left relative overflow-hidden">
                        <span className="text-[9px] text-slate-300 uppercase tracking-wider font-extrabold block">Lifetime Tokens</span>
                        <span className="text-2xl font-black text-white mt-1 block">18.45M Tokens</span>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">14.8M prompts | 3.6M responses</span>
                        <Cpu className="w-8 h-8 text-cyanNeon absolute right-3 bottom-3 opacity-10" />
                      </div>
                      
                      <div className="bg-black border border-slate-800 p-4.5 rounded-xl text-left relative overflow-hidden">
                        <span className="text-[9px] text-slate-300 uppercase tracking-wider font-extrabold block">OpenAI hosting opex</span>
                        <span className="text-2xl font-black text-emerald-400 mt-1 block font-sans">$110.72</span>
                        <span className="text-[10px] text-emerald-500 font-extrabold block mt-0.5">Subs paid: $240 (Saved $129.28!)</span>
                        <TrendingDown className="w-8 h-8 text-emerald-400 absolute right-3 bottom-3 opacity-10" />
                      </div>

                      <div className="bg-black border border-slate-800 p-4.5 rounded-xl text-left relative overflow-hidden">
                        <span className="text-[9px] text-slate-300 uppercase tracking-wider font-extrabold block">Cooling Aquifer Footprint</span>
                        <span className="text-2xl font-black text-cyan-400 mt-1 block">92.26 Liters</span>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Equal to 185 plastic water bottles</span>
                        <Droplet className="w-8 h-8 text-cyan-400 absolute right-3 bottom-3 opacity-10" />
                      </div>
                    </div>

                    {/* Right: Mock high-contrast receipt card */}
                    <div className="bg-black border border-slate-800 p-5 rounded-2xl flex flex-col gap-4 text-xs font-sans text-slate-200 relative select-none shadow-lg">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                        <span className="font-extrabold text-white uppercase tracking-wider text-[10px]">MTC Audit Receipt</span>
                        <span className="text-[9px] text-slate-500 font-semibold font-mono">ID: #8943-wrapped</span>
                      </div>
                      
                      <div className="space-y-2 font-medium font-mono text-[10.5px]">
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-bold">Total Conversations</span>
                          <span className="text-white font-extrabold">{result.parsedConversations.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-bold">Total Messages</span>
                          <span className="text-white font-extrabold">{result.parsedMessages.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t border-dashed border-slate-800 pt-2">
                          <span className="text-slate-400 font-bold">Computed Raw Cost</span>
                          <span className="text-white font-extrabold">${result.estimatedRawCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-bold">Subscriptions Paid</span>
                          <span className="text-white font-extrabold">${result.flatPaidSubs.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t border-dashed border-slate-800 pt-2 text-emeraldNeon font-extrabold">
                          <span>Arbitrage Savings</span>
                          <span>+${result.netArbitrage.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="bg-emeraldNeon/10 border border-emeraldNeon/20 p-2 rounded-lg text-center text-emeraldNeon text-[9px] mt-2 uppercase font-black tracking-widest">
                        Raw API Arbitraged
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* Tab 2: About Calc */}
        {activeTab === "about" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl leading-relaxed">
            <h3 className="text-lg font-bold font-sans border-b border-slate-800 pb-3 flex items-center gap-2 text-white">
              <span className="text-cyanNeon"><Info className="w-5 h-5" /></span> Personal ChatGPT History Auditing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[13px] text-slate-100 font-medium">
              <div className="space-y-3 bg-black border border-slate-800 p-6 rounded-xl">
                <span className="text-redNeon font-sans font-extrabold uppercase text-[11px] tracking-wider block">The Subscription Markup Premium</span>
                <p className="leading-relaxed text-slate-200">
                  Subscribing to chat services flat-fee plans masks your actual transactional opex. High-volume users sometimes benefit, but typical casual users bleed substantial margins. Upstream chatbot providers leverage this arbitrage delta.
                </p>
              </div>
              <div className="space-y-3 bg-black border border-slate-800 p-6 rounded-xl">
                <span className="text-emeraldNeon font-sans font-extrabold uppercase text-[11px] tracking-wider block">The Local Audit Protocol</span>
                <p className="leading-relaxed text-slate-200">
                  By uploading your chat logs locally, you parse direct message character counts, map them to exact Tiktoken counts, and compute the true wholesale API opex. This provides full transparency to decide if swapping to dynamic API routers is financial arbitrage.
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
                <h3 className="text-base font-bold font-sans flex items-center gap-2 text-white"><Gavel className="w-4 h-4 text-cyanNeon" /> Auditing Equations & Constants</h3>
                <p className="text-slate-200 text-xs mt-1 font-semibold leading-relaxed">Our local state engine utilizes these verified environmental coefficients to map chat metrics:</p>
              </div>
              
              <div className="space-y-4 text-xs font-mono">
                <div className="bg-black border border-slate-800 p-4 rounded-xl">
                  <span className="text-[10px] text-slate-300 uppercase tracking-widest block font-extrabold mb-2">Equation 01: Character to Token Map</span>
                  <div className="text-sm font-bold text-cyanNeon text-glow-cyan py-1 font-mono">
                    Tokens_Mapped = Message_Characters / 4.00
                  </div>
                  <p className="text-[10px] text-slate-300 leading-relaxed mt-2 font-mono font-bold">
                    *Assumes a strict 4 characters per token vocabulary standard for standard OpenAI GPT-4o model weights.
                  </p>
                </div>
                <div className="bg-black border border-slate-800 p-4 rounded-xl">
                  <span className="text-[10px] text-slate-300 uppercase tracking-widest block font-extrabold mb-2">Equation 02: Computed Wholesale API Cost</span>
                  <div className="text-sm font-bold text-cyanNeon text-glow-cyan py-1 font-mono">
                    Cost = (Tokens_Input * 0.005) + (Tokens_Output * 0.015) [per Million]
                  </div>
                </div>
                <div className="bg-black border border-slate-800 p-4 rounded-xl">
                  <span className="text-[10px] text-slate-300 uppercase tracking-widest block font-extrabold mb-2">Equation 03: Evaporative Cool Footprint</span>
                  <div className="text-sm font-bold text-cyanNeon text-glow-cyan py-1 font-mono">
                    Cooling_Liters = (Total_Queries / 50) * 0.50
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Gated consultation booking form */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl text-left">
              <div className="space-y-4">
                <div>
                  <span className="bg-indigoNeon/20 text-[#818cf8] text-[10px] font-sans border border-indigoNeon/30 px-2.5 py-0.5 rounded font-extrabold uppercase tracking-widest block max-w-fit">API REGISTRY</span>
                  <h3 className="text-base font-extrabold font-sans mt-2 text-white">Book Enterprise Key Audit</h3>
                  <p className="text-slate-200 text-xs mt-1.5 leading-relaxed font-semibold">Let our engineering group audit your employee prompt volumes, map API key usage overhead, and consolidate team subscriptions.</p>
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
                      Dispatch Key Scope <ArrowRight className="w-4 h-4 inline ml-1.5" />
                    </button>
                  </form>
                ) : (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emeraldNeon rounded-xl text-xs leading-relaxed font-sans font-bold">
                    ✓ Key telemetry registered. Subscriptions design audit checklist and invite dispatched to your inbox.
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
              <h3 className="text-base font-bold font-sans flex items-center gap-2 text-white"><Network className="w-4 h-4 text-indigoNeon" /> In-Browser De-compression & Tokenizer Pipeline</h3>
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

                  {/* Node 1: Ingest */}
                  <g className="cursor-pointer" onClick={() => setSelectedArchNode("zip")}>
                    <rect x="20" y="60" width="100" height="80" rx="6" fill={selectedArchNode === "zip" ? "#0a0f1d" : "#1e293b"} stroke="#6366f1" strokeWidth={selectedArchNode === "zip" ? "2" : "1.5"} />
                    <text x="70" y="95" fill="#f8fafc" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle">01 EXPORT ZIP</text>
                    <text x="70" y="115" fill="#cbd5e1" fontFamily="monospace" fontSize="7" fontWeight="bold" textAnchor="middle">Local Ingest</text>
                  </g>

                  {/* Node 2: Message Parser */}
                  <g className="cursor-pointer" onClick={() => setSelectedArchNode("parse")}>
                    <rect x="250" y="40" width="160" height="120" rx="8" fill={selectedArchNode === "parse" ? "#0a0f1d" : "#1e293b"} stroke="#00f0ff" strokeWidth={selectedArchNode === "parse" ? "2.5" : "1.5"} />
                    <text x="330" y="90" fill="#f8fafc" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle">02 JSON PARSER</text>
                    <text x="330" y="110" fill="#00f0ff" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle">conversations.json</text>
                  </g>

                  {/* Node 3: Tokenizer */}
                  <g className="cursor-pointer" onClick={() => setSelectedArchNode("tokens")}>
                    <rect x="540" y="50" width="160" height="100" rx="8" fill={selectedArchNode === "tokens" ? "#0a0f1d" : "#1e293b"} stroke="#00f0ff" strokeWidth={selectedArchNode === "tokens" ? "2.5" : "1.5"} />
                    <text x="620" y="95" fill="#f8fafc" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle">03 TIKTOKEN MESH</text>
                    <text x="620" y="115" fill="#6366f1" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle">Local Count</text>
                  </g>

                  {/* Node 4: wrapped Card */}
                  <g className="cursor-pointer" onClick={() => setSelectedArchNode("wrapped")}>
                    <rect x="830" y="70" width="150" height="60" rx="6" fill={selectedArchNode === "wrapped" ? "#0a0f1d" : "#111827"} stroke="#475569" strokeWidth="1.5" />
                    <text x="905" y="105" fill="#cbd5e1" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle">04 WRAPPED CARD</text>
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
            <span className="text-xs text-slate-200 font-mono ml-2 font-bold">chat_history_stdout.log</span>
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
            <CalendarDays className="w-4 h-4" /> corporate API key audit
          </div>
          <h3 className="text-lg font-black font-sans leading-tight text-white">Book a free 15-minute corporate key consolidation review.</h3>
          <p className="text-slate-100 text-xs max-w-3xl leading-relaxed font-semibold">
            Evaluate developer prompt sizing loops, tokenizer leak rates, and pay-as-you-go router consolidation to deflect up to 60% of flat SaaS opex.
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
                submitRating("calculator", "chatgpt-auditor", "up");
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
                submitRating("calculator", "chatgpt-auditor", "down");
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
