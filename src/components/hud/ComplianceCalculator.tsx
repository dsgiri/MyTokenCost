"use client";

import { useState } from "react";
import { TripleTelemetry } from "./TripleTelemetry";
import { ShieldAlert, Info, TrendingUp, AlertTriangle } from "lucide-react";

type Industry = "datacenter" | "water" | "care";

const INDUSTRIES = {
  datacenter: {
    id: "datacenter",
    emoji: "🖥️",
    label: "AI Model Training Clusters",
    subLabel: "Deep learning clusters executing massive parameter runs.",
    limit: 10,
    limitLabel: "10.0 MW",
    metricUnit: "Nodes",
    slider1Label: "Compute Server Nodes",
    slider1Desc: "Active server node enclosures running high-intensity training workloads.",
    slider2Label: "Workload Duty Cycle",
    slider2Desc: "Target daily duration the compute clusters run at peak inference utilization.",
    banner: "<strong>ERCOT LFL Alert:</strong> Load configurations tracking towards 10.0 MW trigger immediate mandatory flexible registration criteria.",
  },
  water: {
    id: "water",
    emoji: "🏢",
    label: "AI Inference & Colocation Centers",
    subLabel: "High-density multi-tenant AI computing facilities.",
    limit: 1500,
    limitLabel: "1,500 HP",
    metricUnit: "HP",
    slider1Label: "Colocation Pump Cooling Sizing",
    slider1Desc: "Combined horsepower rating of liquid cooling distribution pumps.",
    slider2Label: "Required Cooling Runtime",
    slider2Desc: "Minimum continuous operations required to prevent local thermal discharge warnings.",
    banner: "<strong>TCEQ Thermal Rules:</strong> High-density liquid cooling loops must verify continuous pump capacity to prevent local discharge warnings.",
  },
  care: {
    id: "care",
    emoji: "🤖",
    label: "Edge AI & Autonomous Enclaves",
    subLabel: "Densely deployed micro-compute clusters and robotic grids.",
    limit: 120,
    limitLabel: "120 Units",
    metricUnit: "Units",
    slider1Label: "Edge Deployments Capacity",
    slider1Desc: "The total registered edge compute unit capacity in your grid sector.",
    slider2Label: "Active Battery Backup Sizing",
    slider2Desc: "Rated energy output of auxiliary backup battery packs to survive extreme grid stress.",
    banner: "<strong>Grid Stress Prioritization:</strong> Edge nodes must prove automatic backup battery integration logs during extreme local grid stress zones.",
  },
};

export function ComplianceCalculator() {
  const [industry, setIndustry] = useState<Industry>("datacenter");

  // Synthetic state for sliders
  const [slider1, setSlider1] = useState<number>(5000); // Nodes / HP / Units
  const [slider2, setSlider2] = useState<number>(12); // Hours / Hours / kW

  // Live Grid State — 100% Offline-First local static snapshot as per guidelines
  const [gridData] = useState<{ load: number, capacity: number, isSynthetic: boolean } | null>({
    load: 62000,
    capacity: 82000,
    isSynthetic: true
  });

  // Derived state based on industry logic
  let activeCustomLoad = 0;
  let limitVal = INDUSTRIES[industry].limit;
  let isViolating = false;

  if (industry === "datacenter") {
    // Current draw in MW
    activeCustomLoad = slider1 * 0.0012 * (slider2 / 12);
    isViolating = activeCustomLoad > limitVal;
  } else if (industry === "water") {
    activeCustomLoad = slider1;
    isViolating = activeCustomLoad > limitVal;
  } else if (industry === "care") {
    limitVal = slider1 * 1.8; // required battery sizing
    activeCustomLoad = slider2;
    isViolating = activeCustomLoad < limitVal;
  }

  // Dynamic Scorecard Calculation
  const penaltyLiability = isViolating 
    ? (industry === "datacenter" ? "$1,250,000" : industry === "water" ? "$450,000" : "$850,000") 
    : "$0";

  const [activeTab, setActiveTab] = useState("Compliance");

  const isSimulatedMacro = activeTab === "US Grid" || activeTab === "Texas (ERCOT)";

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 my-8 px-4 sm:px-6 lg:px-8">
      
      {/* 4-Stage Strategic Focus Control Tabs */}
      <div className="flex flex-wrap border-b border-slate-800 bg-black rounded-t-xl">
        {[
          { id: "Compliance", label: "📋 1. Compliance (Default)" },
          { id: "US Grid", label: "🌐 2. US Grid Clusters" },
          { id: "Texas (ERCOT)", label: "🤠 3. Texas (ERCOT)" },
          { id: "My Infra", label: "💻 4. My Infra Simulation" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
              activeTab === tab.id
                ? "text-[#00f0ff] border-[#00f0ff] bg-[#00f0ff]/10"
                : "text-slate-300 border-transparent hover:text-white hover:bg-slate-900/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Context Notification Banner */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900 text-xs sm:text-sm flex items-start space-x-3 transition-all duration-300">
        <div className="p-1 rounded bg-[#00f0ff]/10 text-[#00f0ff] mt-0.5">
          {activeTab === "Compliance" ? (
            <ShieldAlert className="w-4 h-4" />
          ) : activeTab === "US Grid" ? (
            <Info className="w-4 h-4" />
          ) : activeTab === "Texas (ERCOT)" ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
        </div>
        <div className="space-y-0.5">
          {activeTab === "Compliance" && (
            <p className="text-slate-300 font-medium leading-relaxed">
              <span className="text-white font-bold block mb-0.5">System Regulatory Compliance Warning:</span>
              <span dangerouslySetInnerHTML={{ __html: INDUSTRIES[industry].banner }} />
            </p>
          )}
          {activeTab === "US Grid" && (
            <p className="text-slate-300 font-medium leading-relaxed">
              <span className="text-white font-bold block mb-0.5">Macro Context Feed:</span>
              Monitoring baseline multi-regional grid interconnect transmission stresses across PJM, MISO, and CAISO networks.
            </p>
          )}
          {activeTab === "Texas (ERCOT)" && (
            <p className="text-slate-300 font-medium leading-relaxed">
              <span className="text-white font-bold block mb-0.5">ERCOT Regional Dashboard:</span>
              Evaluating Texas grid capacity limits relative to volatile localized temperatures and high-density computing loads.
            </p>
          )}
          {activeTab === "My Infra" && (
            <p className="text-slate-300 font-medium leading-relaxed">
              <span className="text-white font-bold block mb-0.5">Personal Simulation Workspace:</span>
              Adjust parameters below to dynamically benchmark custom enterprise footprint curves and identify risk triggers.
            </p>
          )}
        </div>
      </div>

      {/* Side-by-Side Canvas Telemetry Panel */}
      <div className="relative">
        {isSimulatedMacro && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] z-10 rounded-xl flex items-center justify-center">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center shadow-2xl max-w-sm">
              <p className="text-[10px] text-[#00f0ff] font-extrabold uppercase tracking-widest mb-1.5 animate-pulse">Macro Telemetry Feed Active</p>
              <p className="text-base text-white font-bold font-space-grotesk tracking-tight">Displaying Shared {activeTab} Metrics</p>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed font-medium">To test your custom parameters, switch the top control tab to <strong>1. Compliance</strong> or <strong>4. My Infra</strong>.</p>
            </div>
          </div>
        )}
        
        <TripleTelemetry 
          currentIndustry={industry}
          activeTab={activeTab}
          slider1={slider1}
          slider2={slider2}
          gridData={gridData}
        />
      </div>

      {/* Parameters & Scorecard Split Panel */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Controls Panel */}
        <div className={`w-full lg:w-1/2 space-y-6 bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-800 shadow-xl transition-all duration-300 ${isSimulatedMacro ? "opacity-30 pointer-events-none grayscale" : ""}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white font-space-grotesk tracking-tight">
                {activeTab === "My Infra" ? "Facility Configuration" : "Non-Invasive Workspace"}
              </h2>
              <p className="text-[10px] text-slate-300 font-semibold mt-0.5 uppercase tracking-wide">Adjust sliders to test grid threshold stress</p>
            </div>
            {gridData && (
              <span className={`text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${gridData.isSynthetic ? 'text-amber-500 border-amber-500/20 bg-amber-500/5' : 'text-[#00f0ff] border-[#00f0ff]/20 bg-[#00f0ff]/5'}`}>
                {gridData.isSynthetic ? 'Fallback Data' : 'Live ERCOT'}
              </span>
            )}
          </div>
          
          {/* Vertical Selector Buttons */}
          <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-black border border-slate-800">
            {(["datacenter", "water", "care"] as Industry[]).map((key) => (
              <button
                key={key}
                onClick={() => {
                  setIndustry(key);
                  if (key === "datacenter") {
                    setSlider1(5000); setSlider2(12);
                  } else if (key === "water") {
                    setSlider1(800); setSlider2(48);
                  } else if (key === "care") {
                    setSlider1(80); setSlider2(150);
                  }
                }}
                className={`py-3 rounded-lg text-xs font-bold font-mono transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  industry === key
                    ? "bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20 shadow-md shadow-[#00f0ff]/5"
                    : "text-slate-300 hover:text-white border border-transparent hover:bg-slate-800/50"
                }`}
              >
                <span className="text-xl">{INDUSTRIES[key].emoji}</span>
                <span className="text-[8.5px] uppercase tracking-wider truncate max-w-full px-1">{INDUSTRIES[key].metricUnit}</span>
              </button>
            ))}
          </div>

          {/* Interactive Sliders */}
          <div className="space-y-6">
            
            {/* Slider 1 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <label className="text-slate-200 font-bold uppercase tracking-wider text-[10px]">{INDUSTRIES[industry].slider1Label}</label>
                <span className="text-[#00f0ff] font-bold font-mono">
                  {slider1.toLocaleString()} {industry === "datacenter" ? "Nodes" : industry === "water" ? "HP" : "Units"}
                </span>
              </div>
              <input
                type="range"
                min={industry === "datacenter" ? 1000 : industry === "water" ? 100 : 10}
                max={industry === "datacenter" ? 15000 : industry === "water" ? 4000 : 350}
                value={slider1}
                onChange={(e) => setSlider1(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
              />
              <p className="text-[9.5px] text-slate-300 leading-relaxed font-medium">
                {INDUSTRIES[industry].slider1Desc}
              </p>
            </div>

            {/* Slider 2 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <label className="text-slate-200 font-bold uppercase tracking-wider text-[10px]">{INDUSTRIES[industry].slider2Label}</label>
                <span className="text-[#00f0ff] font-bold font-mono">
                  {slider2.toLocaleString()} {industry === "datacenter" ? "Hrs/Day" : industry === "water" ? "Hours" : "kW"}
                </span>
              </div>
              <input
                type="range"
                min={industry === "datacenter" ? 1 : industry === "water" ? 24 : 20}
                max={industry === "datacenter" ? 24 : industry === "water" ? 168 : 800}
                value={slider2}
                onChange={(e) => setSlider2(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-855 rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
              />
              <p className="text-[9.5px] text-slate-300 leading-relaxed font-medium">
                {INDUSTRIES[industry].slider2Desc}
              </p>
            </div>

          </div>
        </div>

        {/* Scorecard Panel */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-6">
          
          <div className="bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-800 flex-1 space-y-6 flex flex-col justify-center shadow-xl">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20 uppercase tracking-widest">
                Active Environment Focus
              </div>
              <h3 className="text-xl font-bold text-white font-space-grotesk tracking-tight">
                {INDUSTRIES[industry].label}
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {INDUSTRIES[industry].subLabel} We map these simulated physical variables against state thresholds to ensure zero license interruptions.
              </p>
            </div>

            {/* Scorecard Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black p-4 rounded-lg border border-slate-800">
                <span className="text-[9px] font-mono font-bold text-slate-300 uppercase tracking-wider block">Compliance Limit</span>
                <span className="text-white text-base font-bold font-mono mt-1 block">
                  {industry === "datacenter" && "10.0 MW"}
                  {industry === "water" && "1,500 HP"}
                  {industry === "care" && `${(slider1 * 1.8).toLocaleString()} kW (Req.)`}
                </span>
              </div>
              <div className="bg-black p-4 rounded-lg border border-slate-800">
                <span className="text-[9px] font-mono font-bold text-slate-300 uppercase tracking-wider block">Active Footprint</span>
                <span className={`text-base font-bold font-mono mt-1 block ${isViolating ? "text-red-400" : "text-emerald-400"}`}>
                  {industry === "datacenter" && `${activeCustomLoad.toFixed(2)} MW`}
                  {industry === "water" && `${activeCustomLoad.toLocaleString()} HP`}
                  {industry === "care" && `${slider2.toLocaleString()} kW`}
                </span>
              </div>
            </div>

          </div>

          {/* Dynamic Penalty Liability Card */}
          <div className={`p-6 sm:p-8 rounded-xl border transition-all duration-300 flex items-center justify-between ${
            (!isSimulatedMacro && isViolating)
              ? 'bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.1)]' 
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}>
            <div>
              <h3 className="font-bold text-[10px] font-mono uppercase tracking-widest opacity-80 mb-1">
                Estimated Penalty Liability
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs font-semibold">
                {isViolating 
                  ? "🚨 Regulatory limits breached. State penalties active." 
                  : "✓ Safe operations. Estimated regulatory exposure clear."}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className={`font-space-grotesk text-3xl font-extrabold tracking-tighter ${(!isSimulatedMacro && isViolating) ? 'animate-pulse' : ''}`}>
                {isSimulatedMacro ? "Live Stream" : penaltyLiability}
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
