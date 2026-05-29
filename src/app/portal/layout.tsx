import { ReactNode } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { getUserRole } from "@/lib/roles";
import { PortalSidebar } from "@/components/layout/PortalSidebar";

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const user = await currentUser();
  const greetingName = user?.firstName || user?.emailAddresses?.[0]?.emailAddress || "Guest";
  const role = await getUserRole();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Interactive Sidebar (Collapsible Drawer on mobile, Static on desktop) */}
      <PortalSidebar greetingName={greetingName} role={role} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Secondary Sub-header hidden on mobile to avoid double sticky headers */}
        <header className="hidden md:flex h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur items-center px-8 justify-between sticky top-0 z-10 transition-colors">
          <h1 className="text-lg font-bold text-white tracking-tight">Active Infrastructure for {greetingName}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-[10px] font-mono tracking-widest px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[#00f0ff] uppercase">
              ROLE: {role}
            </span>
          </div>
        </header>
        
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
