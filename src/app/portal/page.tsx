import Link from "next/link";
import { getUserRole } from "@/lib/roles";
import { ComplianceCalculator } from "@/components/hud/ComplianceCalculator";

export default async function PortalDashboard() {
  const role = await getUserRole();

  // If the user is an MTC-USER or MTC-DEMO, they get to see the actual HUD interface
  const hasTelemetryAccess = role === "MTC-USER" || role === "MTC-DEMO" || role === "MTC-ADMIN";

  return (
    <div className="space-y-6">
      {/* 
        MTC-GUEST View:
        They have not purchased the audit, so they get the high-fidelity empty state and a CTA to buy.
      */}
      {!hasTelemetryAccess && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold font-space-grotesk text-white">No Active Audit Playbooks</h2>
            <p className="text-slate-400 mt-2 text-sm max-w-xl">
              You currently do not have any certified compliance playbooks or active ERCOT infrastructure linked to your account. 
              To unlock the full telemetry suite and liability protection, you must initiate an audit.
            </p>
          </div>
          <Link 
            href="/contact" 
            className="bg-[#00f0ff] hover:bg-[#00d8e6] text-slate-950 font-bold px-6 py-3 rounded text-sm tracking-wider uppercase transition-colors shrink-0"
          >
            Book Audit
          </Link>
        </div>
      )}

      {/* 
        MTC-USER / MTC-DEMO / MTC-ADMIN View:
        They get to see the actual Compliance Calculator HUD.
      */}
      {hasTelemetryAccess ? (
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h2 className="font-bold text-white tracking-tight">Active Telemetry Stream</h2>
            {role === "MTC-DEMO" && (
              <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 rounded font-mono uppercase tracking-widest">
                Demonstration Mode
              </span>
            )}
          </div>
          <div className="min-h-[600px] h-auto relative w-full pb-6">
            <ComplianceCalculator />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 opacity-75">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Audit Status</p>
            <p className="text-3xl font-mono text-white font-extrabold">PENDING</p>
            <p className="text-xs text-slate-400 mt-2">Awaiting engineering allocation.</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 opacity-75">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Monitored Facilities</p>
            <p className="text-3xl font-mono text-[#00f0ff] font-extrabold">0</p>
            <p className="text-xs text-slate-400 mt-2">No active ERCOT assets linked.</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 opacity-75">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Liability Exposure</p>
            <p className="text-3xl font-mono text-red-400 font-extrabold">UNVERIFIED</p>
            <p className="text-xs text-slate-400 mt-2">Complete audit to unlock telemetry.</p>
          </div>
        </div>
      )}
    </div>
  );
}
