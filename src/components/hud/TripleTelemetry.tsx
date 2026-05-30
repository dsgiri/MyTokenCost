"use client";

import { useEffect, useRef } from "react";

interface TripleTelemetryProps {
  currentIndustry: "datacenter" | "water" | "care";
  activeTab: string;
  slider1: number;
  slider2: number;
  gridData: { load: number; capacity: number; isSynthetic: boolean } | null;
}

export function TripleTelemetry({
  currentIndustry,
  activeTab,
  slider1,
  slider2,
  gridData,
}: TripleTelemetryProps) {
  const canvasTokensRef = useRef<HTMLCanvasElement>(null);
  const canvasEnergyRef = useRef<HTMLCanvasElement>(null);
  const canvasWaterRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const stepRef = useRef<number>(0);

  // Dynamic calculations based on industry & inputs
  // 1. Tokens (Compute)
  let calcTokens = 0;
  let limitTokens = 10000000; // 10M tokens limit
  if (currentIndustry === "datacenter") {
    calcTokens = (slider1 * 2000) * (slider2 / 12);
    limitTokens = 12000000;
  } else if (currentIndustry === "water") {
    calcTokens = (slider1 * 5000) * (slider2 / 48);
    limitTokens = 8000000;
  } else {
    calcTokens = (slider1 * 40000) * (slider2 / 150);
    limitTokens = 6000000;
  }

  // 2. Electrical Load (Energy)
  let calcEnergy = 0;
  let limitEnergy = 10; // MW or kW limit
  if (currentIndustry === "datacenter") {
    calcEnergy = slider1 * 0.0012 * (slider2 / 12);
    limitEnergy = 10; // 10 MW
  } else if (currentIndustry === "water") {
    calcEnergy = (slider1 * 0.746) / 1000; // Convert HP to MW
    limitEnergy = 0.6; // 0.6 MW (approx 800 HP)
  } else {
    calcEnergy = slider2 * 0.001; // Convert kW to MW
    limitEnergy = (slider1 * 1.8) * 0.001; // Convert required generators to MW
  }

  // 3. Cooling (Water)
  let calcWater = 0;
  let limitWater = 5000; // Gallons limit
  if (currentIndustry === "datacenter") {
    calcWater = calcEnergy * 400; // 400 gallons per MW
    limitWater = 3000;
  } else if (currentIndustry === "water") {
    calcWater = slider1 * 3.5; // Pump intake volume scale
    limitWater = 6000;
  } else {
    calcWater = slider1 * 25; // 25 gallons/bed cooling scale
    limitWater = 2500;
  }

  // Override displayed values if macro monitoring tab is active
  const isSimulatedMacro = activeTab === "US Grid" || activeTab === "Texas (ERCOT)";

  let displayTokens = calcTokens;
  let displayTokensLimit = limitTokens;
  let displayEnergy = calcEnergy;
  let displayEnergyLimit = limitEnergy;
  let displayWater = calcWater;
  let displayWaterLimit = limitWater;

  if (activeTab === "US Grid") {
    displayTokens = 6428120000;
    displayTokensLimit = 8000000000;
    displayEnergy = 450000; // MW
    displayEnergyLimit = 950000; // MW
    displayWater = 8500000; // Gal
    displayWaterLimit = 15000000; // Gal
  } else if (activeTab === "Texas (ERCOT)") {
    displayTokens = 850000000;
    displayTokensLimit = 1200000000;
    displayEnergy = gridData?.load || 62000; // MW
    displayEnergyLimit = gridData?.capacity || 82000; // MW
    displayWater = (gridData?.load || 62000) * 120; // Gal
    displayWaterLimit = (gridData?.capacity || 82000) * 120;
  }

  // Evaluate compliance violations
  let violateTokens = false;
  let violateEnergy = false;
  let violateWater = false;

  if (currentIndustry === "care") {
    // Care has inverse violation: energy capacity (slider2) must be >= required limit (slider1 * 1.8)
    violateEnergy = calcEnergy < limitEnergy;
    violateTokens = calcTokens > limitTokens;
    violateWater = calcWater > limitWater;
  } else {
    violateTokens = calcTokens > limitTokens;
    violateEnergy = calcEnergy > limitEnergy;
    violateWater = calcWater > limitWater;
  }

  // If in macro mode, we determine violations based on grid loads
  if (isSimulatedMacro) {
    violateTokens = displayTokens > displayTokensLimit;
    violateEnergy = displayEnergy > displayEnergyLimit;
    violateWater = displayWater > displayWaterLimit;
  }

  // Unified telemetry line renderer
  useEffect(() => {
    const canvasT = canvasTokensRef.current;
    const canvasE = canvasEnergyRef.current;
    const canvasW = canvasWaterRef.current;

    if (!canvasT || !canvasE || !canvasW) return;

    const ctxT = canvasT.getContext("2d");
    const ctxE = canvasE.getContext("2d");
    const ctxW = canvasW.getContext("2d");

    if (!ctxT || !ctxE || !ctxW) return;

    const resizeCanvases = () => {
      [
        { canvas: canvasT, ctx: ctxT },
        { canvas: canvasE, ctx: ctxE },
        { canvas: canvasW, ctx: ctxW },
      ].forEach(({ canvas, ctx }) => {
        const parent = canvas.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = 128 * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      });
    };

    resizeCanvases();
    window.addEventListener("resize", resizeCanvases);

    const render = () => {
      stepRef.current += 0.04;

      const w = canvasT.width / window.devicePixelRatio;
      const h = 128;

      [
        {
          canvas: canvasT,
          ctx: ctxT,
          calc: displayTokens,
          limit: displayTokensLimit,
          violate: violateTokens,
          label: "COMPUTE_TOKEN_BUS",
          glow: "rgba(0, 240, 255, 0.8)",
          normalColor: "#00f0ff",
        },
        {
          canvas: canvasE,
          ctx: ctxE,
          calc: displayEnergy,
          limit: displayEnergyLimit,
          violate: violateEnergy,
          label: "GRID_POWER_BUS",
          glow: "rgba(16, 185, 129, 0.8)",
          normalColor: "#10b981",
        },
        {
          canvas: canvasW,
          ctx: ctxW,
          calc: displayWater,
          limit: displayWaterLimit,
          violate: violateWater,
          label: "THERMAL_COOLING_BUS",
          glow: "rgba(245, 158, 11, 0.8)",
          normalColor: "#f59e0b",
        },
      ].forEach(({ ctx, calc, limit, violate, label, glow, normalColor }) => {
        ctx.clearRect(0, 0, w, h);

        // Draw grid lines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 30) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += 20) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        // Calculate ratios for waves
        const ratio = calc / (limit || 1);
        const limitY = h * 0.45;

        // Draw limit boundary
        if (activeTab === "Compliance") {
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 1.2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(0, limitY);
          ctx.lineTo(w, limitY);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Draw live wave path
        ctx.beginPath();
        const activeColor = violate && activeTab === "Compliance" ? "#ef4444" : normalColor;
        const activeGlow = violate && activeTab === "Compliance" ? "rgba(239, 68, 68, 0.8)" : glow;
        
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 6;
        ctx.shadowColor = activeGlow;

        // Wave curve adjusts depending on active loads
        let baselineY = limitY;
        if (activeTab === "Compliance") {
          // Adjust vertical wave offset based on how close it is to the limit
          if (currentIndustry === "care" && label === "GRID_POWER_BUS") {
            // For care backup, lower values mean violations
            baselineY = limitY + (ratio - 1.0) * -35;
          } else {
            baselineY = limitY + (ratio - 1.0) * -35;
          }
        } else {
          // Stable wave for macro views
          baselineY = h * 0.5;
        }

        const constrainedY = Math.max(25, Math.min(h - 25, baselineY));
        const amplitude = Math.max(4, Math.min(22, ratio * 8));
        const frequency = 0.022;

        for (let x = 0; x < w; x++) {
          const y = constrainedY + Math.sin(x * frequency + stepRef.current) * amplitude;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow

        // Render mini stats HUD overlay
        ctx.fillStyle = activeColor;
        ctx.font = "8px monospace";
        ctx.fillText(`${label}: ${violate && activeTab === "Compliance" ? "WARNING_BREACH" : "SECURE_NOMINAL"}`, 12, 18);
      });

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvases);
      cancelAnimationFrame(animationRef.current);
    };
  }, [
    currentIndustry,
    activeTab,
    displayTokens,
    displayTokensLimit,
    displayEnergy,
    displayEnergyLimit,
    displayWater,
    displayWaterLimit,
    violateTokens,
    violateEnergy,
    violateWater,
  ]);

  // Headroom strings
  const getTokensHeadroom = () => {
    if (isSimulatedMacro) return "Live Stream Active";
    const delta = limitTokens - calcTokens;
    if (delta > 0) return `+${(delta / 1000000).toFixed(1)}M Safe`;
    return `🚨 Risk: ${(Math.abs(delta) / 1000000).toFixed(1)}M Over`;
  };

  const getEnergyHeadroom = () => {
    if (isSimulatedMacro) return "Live Telemetry Active";
    if (currentIndustry === "care") {
      const delta = calcEnergy - limitEnergy; // existing gen output vs required
      if (delta >= 0) return `+${(delta * 1000).toFixed(0)} kW Safe`;
      return `🚨 Risk: ${(Math.abs(delta) * 1000).toFixed(0)} kW Short`;
    }
    const delta = limitEnergy - calcEnergy;
    if (delta > 0) return `+${delta.toFixed(2)} MW Free`;
    return `🚨 Risk: ${Math.abs(delta).toFixed(2)} MW Over`;
  };

  const getWaterHeadroom = () => {
    if (isSimulatedMacro) return "Live Stream Active";
    const delta = limitWater - calcWater;
    if (delta > 0) return `+${Math.round(delta).toLocaleString()} Gal Safe`;
    return `🚨 Risk: ${Math.round(Math.abs(delta)).toLocaleString()} Gal Over`;
  };

  const formatTokens = (val: number) => {
    if (val >= 1000000000) return `${(val / 1000000000).toFixed(2)}B`;
    return `${(val / 1000000).toFixed(1)}M`;
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* 1. Compute Token Volume */}
      <div className="border rounded-xl bg-slate-900 border-slate-800 p-4 space-y-3 relative overflow-hidden transition-all duration-300 hover:border-slate-700/80 shadow-xl">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/20" />
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-300 block">Compute Volume</span>
            <span className="font-mono text-sm font-bold text-white mt-0.5 block">
              {formatTokens(displayTokens)} <span className="text-[10px] text-slate-300 font-normal">/ {formatTokens(displayTokensLimit)} Limit</span>
            </span>
          </div>
          <span
            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border tracking-wide transition-all ${
              violateTokens && activeTab === "Compliance"
                ? "text-red-400 border-red-500/30 bg-red-500/5 animate-pulse"
                : "text-cyan-400 border-cyan-500/30 bg-cyan-500/5"
            }`}
          >
            {getTokensHeadroom()}
          </span>
        </div>
        <div className="w-full h-32 rounded bg-black overflow-hidden relative border border-slate-800">
          <canvas ref={canvasTokensRef} className="w-full h-full block" />
        </div>
      </div>

      {/* 2. Grid Electrical Load */}
      <div className="border rounded-xl bg-slate-900 border-slate-800 p-4 space-y-3 relative overflow-hidden transition-all duration-300 hover:border-slate-700/80 shadow-xl">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500/20" />
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-300 block">Grid Electrical Load</span>
            <span className="font-mono text-sm font-bold text-white mt-0.5 block">
              {currentIndustry === "care" && !isSimulatedMacro
                ? `${(displayEnergy * 1000).toFixed(0)} kW / ${(displayEnergyLimit * 1000).toFixed(0)} kW`
                : `${displayEnergy.toLocaleString("en-US", { maximumFractionDigits: displayEnergy > 1000 ? 0 : 2 })} MW / ${displayEnergyLimit.toLocaleString("en-US", { maximumFractionDigits: displayEnergyLimit > 1000 ? 0 : 2 })} MW`}
            </span>
          </div>
          <span
            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border tracking-wide transition-all ${
              violateEnergy && activeTab === "Compliance"
                ? "text-red-400 border-red-500/30 bg-red-500/5 animate-pulse"
                : "text-emerald-400 border-emerald-500/30 bg-emerald-500/5"
            }`}
          >
            {getEnergyHeadroom()}
          </span>
        </div>
        <div className="w-full h-32 rounded bg-black overflow-hidden relative border border-slate-800">
          <canvas ref={canvasEnergyRef} className="w-full h-full block" />
        </div>
      </div>

      {/* 3. Cooling Resource Footprint */}
      <div className="border rounded-xl bg-slate-900 border-slate-800 p-4 space-y-3 relative overflow-hidden transition-all duration-300 hover:border-slate-700/80 shadow-xl">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-amber-500/20" />
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-300 block">Cooling Footprint</span>
            <span className="font-mono text-sm font-bold text-white mt-0.5 block">
              {Math.round(displayWater).toLocaleString()} Gal <span className="text-[10px] text-slate-300 font-normal">/ {Math.round(displayWaterLimit).toLocaleString()} Lmt</span>
            </span>
          </div>
          <span
            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border tracking-wide transition-all ${
              violateWater && activeTab === "Compliance"
                ? "text-red-400 border-red-500/30 bg-red-500/5 animate-pulse"
                : "text-amber-400 border-amber-500/30 bg-amber-500/5"
            }`}
          >
            {getWaterHeadroom()}
          </span>
        </div>
        <div className="w-full h-32 rounded bg-black overflow-hidden relative border border-slate-800">
          <canvas ref={canvasWaterRef} className="w-full h-full block" />
        </div>
      </div>
    </section>
  );
}
