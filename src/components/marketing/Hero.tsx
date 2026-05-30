export function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center space-y-4">
      <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-colors duration-300">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>⚡ Physical Grid & Environmental Telemetry Auditor</span>
      </div>
      <h1 className="font-space-grotesk text-4xl sm:text-6xl font-extrabold tracking-tight leading-none text-slate-950 dark:text-white transition-colors duration-300">
        The <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent font-extrabold">Physical Auditor</span> <br className="hidden sm:inline" />
        for AI Infrastructure
      </h1>
      <p className="text-sm sm:text-base max-w-2xl mx-auto text-slate-600 dark:text-slate-200 leading-relaxed font-medium transition-colors duration-300">
        <strong className="text-slate-955 dark:text-white font-bold">Every prompt has a physical footprint.</strong> We map &quot;hidden&quot; real-world utility footprints—grid load, water cooling drain, and backup generator runtime limits—directly to state regulatory limits. Simple. Secure. 100% Non-invasive.
      </p>
    </section>
  );
}
