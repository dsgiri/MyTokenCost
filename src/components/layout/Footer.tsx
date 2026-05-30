import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-black py-12 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 flex flex-col space-y-4">
            <span className="font-bold text-lg text-slate-900 dark:text-white font-space-grotesk tracking-tight">
              MyToken<span className="text-blue-600 dark:text-[#00f0ff]">Cost</span>
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
              Enterprise compliance and real-time telemetry bridging the gap between High-Performance Computing and global energy grids.
            </p>
          </div>

          {/* Resources */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-slate-900 dark:text-white font-bold tracking-wider uppercase text-xs mb-2">Resources</h3>
            <Link href="/calc" className="hover:text-blue-600 dark:hover:text-[#00f0ff] transition text-xs">Interactive Calculators</Link>
            <Link href="/blueprints" className="hover:text-blue-600 dark:hover:text-[#00f0ff] transition text-xs">SOP Blueprints</Link>
            <Link href="/blogs" className="hover:text-blue-600 dark:hover:text-[#00f0ff] transition text-xs">Intelligence Blog</Link>
            <Link href="/faq" className="hover:text-blue-600 dark:hover:text-[#00f0ff] transition text-xs">Knowledge Base / FAQ</Link>
            <Link href="/pricing" className="hover:text-blue-600 dark:hover:text-[#00f0ff] transition text-xs">Pricing & Tiers</Link>
          </div>

          {/* Developers */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-slate-900 dark:text-white font-bold tracking-wider uppercase text-xs mb-2">Developers</h3>
            <Link href="/playground" className="hover:text-blue-600 dark:hover:text-[#00f0ff] transition text-xs">Playground Hub</Link>
            <Link href="/integrations/chrome-extension" className="hover:text-blue-600 dark:hover:text-[#00f0ff] transition text-xs">Integrations</Link>
            <Link href="/faq" className="hover:text-blue-600 dark:hover:text-[#00f0ff] transition text-xs">Documentation</Link>
            <Link href="/portal" className="hover:text-blue-600 dark:hover:text-[#00f0ff] transition text-xs">API Reference</Link>
            <Link href="/portal/settings" className="hover:text-blue-600 dark:hover:text-[#00f0ff] transition text-xs">SDK Libraries</Link>
          </div>

          {/* Company */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-slate-900 dark:text-white font-bold tracking-wider uppercase text-xs mb-2">Company</h3>
            <Link href="/about" className="hover:text-blue-600 dark:hover:text-[#00f0ff] transition text-xs">About Us</Link>
            <Link href="/contact" className="hover:text-blue-600 dark:hover:text-[#00f0ff] transition text-xs">Contact Engineering</Link>
            <Link href="/portal" className="hover:text-blue-600 dark:hover:text-[#00f0ff] transition text-xs">Client Portal (Login)</Link>
          </div>

          {/* Legal */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-slate-900 dark:text-white font-bold tracking-wider uppercase text-xs mb-2">Legal</h3>
            <Link href="/legal/privacy" className="hover:text-blue-600 dark:hover:text-[#00f0ff] transition text-xs">Privacy Policy</Link>
            <Link href="/legal/terms" className="hover:text-blue-600 dark:hover:text-[#00f0ff] transition text-xs">Terms of Service</Link>
            <Link href="/legal/disclaimer" className="hover:text-blue-600 dark:hover:text-[#00f0ff] transition text-xs">Financial Disclaimer</Link>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-semibold">
          <p>© {new Date().getFullYear()} MyTokenCost.com. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Secured via Clerk Identity & Next.js Core.</p>
        </div>
      </div>
    </footer>
  );
}
