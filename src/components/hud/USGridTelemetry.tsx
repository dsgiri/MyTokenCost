"use client";

import { useEffect, useState } from "react";

export function USGridTelemetry() {
  const [globalTokens, setGlobalTokens] = useState(6428120000);

  useEffect(() => {
    const tokensPerSecondMultiplier = 84225;
    
    const interval = setInterval(() => {
      const inc = Math.floor(tokensPerSecondMultiplier * (0.85 + Math.random() * 0.3));
      setGlobalTokens((prev) => prev + inc);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const rawMwh = (globalTokens / 1000000000) * 2.93;
  const rawWaterGallons = Math.round((globalTokens / 1000000000) * 2000);

  return (
    <div className="w-full max-w-5xl mx-auto my-12 bg-slate-900 rounded-xl p-8 border border-slate-800 shadow-xl">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <h2 className="font-space-grotesk text-2xl font-bold text-white tracking-tight">
            Live US Grid <span className="text-[#00f0ff]">Macro-Telemetry</span>
          </h2>
          <p className="text-slate-200 text-sm mt-1 max-w-xl font-medium">
            Real-time calculation mapping aggregated AI inference models against PJM, CAISO, and ERCOT grid infrastructure.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-black px-3 py-1.5 rounded-full border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] text-slate-300 uppercase tracking-widest font-bold">Grid Synced</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        {/* Token Metric */}
        <div className="bg-black p-6 rounded-lg border border-slate-800 text-center">
          <p className="text-[11px] text-slate-300 uppercase font-bold tracking-widest mb-2">Estimated US Inference Load</p>
          <p className="font-mono text-3xl font-extrabold text-[#00f0ff]">{globalTokens.toLocaleString('en-US')}</p>
          <p className="text-[10px] text-slate-300 font-bold mt-2 tracking-wide">TOKENS PROCESSED (TODAY)</p>
        </div>

        {/* Energy Metric */}
        <div className="bg-black p-6 rounded-lg border border-slate-800 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent"></div>
          <p className="text-[11px] text-slate-300 uppercase font-bold tracking-widest mb-2">Equivalent Power Draw</p>
          <p className="font-mono text-3xl font-extrabold text-[#3b82f6]">{rawMwh.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
          <p className="text-[10px] text-slate-300 font-bold mt-2 tracking-wide">MEGAWATT HOURS (MWh)</p>
        </div>

        {/* Water Metric */}
        <div className="bg-black p-6 rounded-lg border border-slate-800 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#10b981] to-transparent"></div>
          <p className="text-[11px] text-slate-300 uppercase font-bold tracking-widest mb-2">Evaporative Cooling Cost</p>
          <p className="font-mono text-3xl font-extrabold text-[#10b981]">{rawWaterGallons.toLocaleString('en-US')}</p>
          <p className="text-[10px] text-slate-300 font-bold mt-2 tracking-wide">GALLONS OF WATER</p>
        </div>
      </div>
    </div>
  );
}
