"use client";

import { useState, useEffect } from "react";
import { 
  Building, 
  Mail, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  ArrowRight,
  Database,
  PhoneCall,
  User
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type TabMode = "general" | "audit" | "enterprise";

export function AuditLeadForm() {
  const [activeTab, setActiveTab] = useState<TabMode>("general");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    aiProvider: "openai",
    orgSize: "50-250",
    hurdle: "",
  });

  // Client-side detection of entry intent parameters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const type = params.get("type");
      if (type) {
        const targetTab = 
          (type === "demo" || type === "audit") 
            ? "audit" 
            : type === "enterprise" 
              ? "enterprise" 
              : "general";
        const timer = setTimeout(() => {
          setActiveTab(targetTab);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    let isDbSuccess = false;
    let isEmailSuccess = false;

    // 1. Supabase Database Logging (Fail-safe, non-blocking)
    try {
      const { error } = await supabase
        .from("mtc_leads")
        .insert({
          name: formData.name,
          email: formData.email,
          lead_type: activeTab,
          details: {
            location: activeTab === "audit" ? formData.location : undefined,
            org_size: activeTab === "enterprise" ? formData.orgSize : undefined,
            hurdle: activeTab === "general" || activeTab === "enterprise" ? formData.hurdle : undefined
          },
          created_at: new Date().toISOString()
        });

      if (error) {
        console.warn("Supabase lead logging bypassed:", error.message);
      } else {
        isDbSuccess = true;
      }
    } catch (err) {
      console.warn("Supabase connection failed silently:", err);
    }

    // 2. Web3Forms Email Ingest
    try {
      const payload: Record<string, string> = {
        access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "",
        subject: `New B2B ${activeTab.toUpperCase()} Lead - MyTokenCost.com`,
        lead_type: activeTab,
        name: formData.name,
        email: formData.email,
      };

      if (activeTab === "general") {
        payload.message = formData.hurdle;
      } else if (activeTab === "audit") {
        payload.grid_region_location = formData.location;
      } else if (activeTab === "enterprise") {
        payload.est_monthly_tokens = formData.orgSize;
        payload.compliance_hurdle = formData.hurdle;
      }

      // Only execute Web3Forms request if access key is configured
      if (payload.access_key) {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (result.success) {
          isEmailSuccess = true;
        } else {
          console.warn("Web3Forms email delivery returned error:", result.message);
        }
      } else {
        console.warn("Web3Forms email delivery bypassed: Access key is not configured.");
      }
    } catch (err) {
      console.warn("Web3Forms communication failed silently:", err);
    }

    // Fail-safe logic: If either Supabase or Web3Forms succeeded, log success
    if (isDbSuccess || isEmailSuccess) {
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        location: "",
        aiProvider: "openai",
        orgSize: "50-250",
        hurdle: "",
      });
    } else {
      setStatus("error");
    }
  };

  if (status === "success") {
    const successMessages = {
      general: "Your inquiry has been received. Our support team will reach out to you within 24 hours.",
      audit: "Our compliance engineering team will contact you within 24 hours to coordinate your custom compliance playbook scheduling.",
      enterprise: "Your enterprise engineering consultation ticket is locked. A lead architect will contact you in under 2 hours."
    };

    const borders = {
      general: "border-cyan-500 bg-cyan-500/5",
      audit: "border-emerald-500 bg-emerald-500/5",
      enterprise: "border-indigo-500 bg-indigo-500/5"
    };

    const textColors = {
      general: "text-cyan-400",
      audit: "text-emerald-400",
      enterprise: "text-indigo-400"
    };

    const glowColors = {
      general: "bg-cyan-500",
      audit: "bg-emerald-500",
      enterprise: "bg-indigo-500"
    };

    return (
      <div className={`border rounded-2xl p-8 text-center space-y-4 shadow-2xl relative overflow-hidden transition-all duration-300 ${borders[activeTab]}`}>
        <div className={`absolute top-0 left-0 w-full h-1 ${glowColors[activeTab]}`} />
        <div className={`h-12 w-12 rounded-full flex items-center justify-center mx-auto border ${
          activeTab === "general" ? "bg-cyan-500/10 border-cyan-500/20" : 
          activeTab === "audit" ? "bg-emerald-500/10 border-emerald-500/20" : 
          "bg-indigo-500/10 border-indigo-500/20"
        }`}>
          <CheckCircle2 className={`w-6 h-6 animate-pulse ${textColors[activeTab]}`} />
        </div>
        <div className="space-y-1">
          <h3 className={`font-extrabold font-space-grotesk text-lg tracking-tight ${textColors[activeTab]}`}>
            Request Received
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            {successMessages[activeTab]}
          </p>
        </div>
      </div>
    );
  }

  // Visual highlights and badges configuration
  const tabConfig = {
    general: {
      badge: "Quick Response",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/25",
      glowColor: "from-cyan-500 to-blue-500",
      focusBorder: "focus:border-cyan-500",
      ctaBg: "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/10",
      ctaText: "Send Inquiry",
      subLabel: "📨 Direct email routed straight to core engineering queue.",
      icon: <Sparkles className="w-4 h-4 animate-pulse" />,
      checklistTitle: "SUPPORT & INQUIRY BENEFITS",
      checklist: [
        { label: "Fast Response", desc: "Get a direct reply from our core engineering team in under 24 hours." },
        { label: "15-Min Free Call", desc: "Option to schedule a quick 1-on-1 walkthrough if you prefer." },
        { label: "Direct Support", desc: "For resolving technical hurdles, calculations questions, or integrations." }
      ]
    },
    audit: {
      badge: "Certified Playbook",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
      glowColor: "from-emerald-500 to-teal-500",
      focusBorder: "focus:border-emerald-500",
      ctaBg: "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/10",
      ctaText: "Request Compliance Audit",
      subLabel: "🔐 Lock in an audit-ready compliance playbook in 7 days.",
      icon: <ShieldCheck className="w-4 h-4" />,
      checklistTitle: "INCLUDED IN THE AUDIT PLAYBOOK",
      checklist: [
        { label: "7-Day Custom Strategy", desc: "Personalized compliance playbook matching your exact grid/facility setup." },
        { label: "Identify Bottlenecks", desc: "Clear roadmaps to spot and resolve operational limits before penalties trigger." },
        { label: "100% Remote Audit", desc: "Safe, non-invasive remote telemetry mapping—no physical setups required." }
      ]
    },
    enterprise: {
      badge: "Corporate Scaling",
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/25",
      glowColor: "from-indigo-500 to-purple-500",
      focusBorder: "focus:border-indigo-500",
      ctaBg: "bg-indigo-650 hover:bg-indigo-500 text-white shadow-indigo-500/10",
      ctaText: "Contact Corporate Engineering",
      subLabel: "🤝 NDA-protected. Direct connection to lead architects.",
      icon: <Building className="w-4 h-4" />,
      checklistTitle: "ENTERPRISE SUPPORT BENEFITS",
      checklist: [
        { label: "Custom Dashboards", desc: "Tailored dashboard layouts and white-labeled reporting built for your workflow." },
        { label: "Direct Slack Support", desc: "A direct messaging channel straight to our core development architects." },
        { label: "Enterprise SLA & Security", desc: "Dedicated uptime guarantees, custom NDAs, and comprehensive privacy compliance." }
      ]
    }
  };

  const current = tabConfig[activeTab];

  return (
    <div className="relative group">
      {/* Glowing Outer Card Background */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${current.glowColor} rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200`} />
      
      <div className="relative bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl hover:border-slate-700/80 transition-all duration-300 overflow-hidden">
        {/* Top-border Dynamic Glow */}
        <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${current.glowColor}`} />

        {/* High-Fidelity Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-black p-1.5 overflow-x-auto gap-1 scrollbar-none items-center">
          <button
            type="button"
            onClick={() => { setActiveTab("general"); setStatus("idle"); }}
            className={`flex-1 min-w-[130px] text-center py-2.5 px-3 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "general"
                ? "bg-slate-800/90 text-cyan-400 border border-cyan-500/20 shadow-md shadow-cyan-500/5"
                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            General Inquiry
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("audit"); setStatus("idle"); }}
            className={`flex-1 min-w-[130px] text-center py-2.5 px-3 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "audit"
                ? "bg-slate-800/90 text-emerald-400 border border-emerald-500/20 shadow-md shadow-emerald-500/5"
                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Audit Inquiry
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("enterprise"); setStatus("idle"); }}
            className={`flex-1 min-w-[130px] text-center py-2.5 px-3 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "enterprise"
                ? "bg-slate-800/90 text-indigo-400 border border-indigo-500/20 shadow-md shadow-indigo-500/5"
                : "text-slate-300 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            Enterprise Sales
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800/60">
            
            {/* LEFT COLUMN: Inputs & Header */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-5">
              
              {/* Header Badging */}
              <div className="space-y-2.5">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-mono font-extrabold border tracking-widest uppercase ${current.badgeColor}`}>
                  {current.icon}
                  {current.badge}
                </div>
                <div>
                  <h3 className="font-space-grotesk text-xl font-extrabold text-white tracking-tight">
                    {activeTab === "general" && "General Support & Feedback"}
                    {activeTab === "audit" && "Secure Compliance Playbook"}
                    {activeTab === "enterprise" && "Contact Corporate Engineering"}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5 font-medium">
                    {activeTab === "general" && "Get in touch for technical support, billing queries, feature feedback, or to schedule a free 1-on-1 walkthrough."}
                    {activeTab === "audit" && "Sourcing errors or missing agency compliance metrics can trigger severe utility penalties or regulatory reviews. Lock in an audit-ready compliance playbook in 7 days."}
                    {activeTab === "enterprise" && "Inquire about custom white-labeled reporting integrations, high-volume scaling, and custom SLA support setups."}
                  </p>
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-3.5 pt-1">
                
                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full bg-black border border-slate-700 ${current.focusBorder} rounded-xl py-2.5 pl-9.5 pr-4 text-xs text-white focus:outline-none transition-all font-semibold placeholder:text-slate-400`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full bg-black border border-slate-700 ${current.focusBorder} rounded-xl py-2.5 pl-9.5 pr-4 text-xs text-white focus:outline-none transition-all font-mono font-medium placeholder:text-slate-400`}
                    />
                  </div>
                </div>

                {/* Conditional Specific Inputs based on Active Tab */}
                {activeTab === "general" && (
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                      How can we help you?
                    </label>
                    <div className="relative">
                      <Zap className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-3" />
                      <textarea
                        required
                        placeholder="e.g. Technical support query, billing help, feature suggestions, or scheduling a free 1-on-1 demo call."
                        value={formData.hurdle}
                        onChange={(e) => setFormData({ ...formData, hurdle: e.target.value })}
                        className={`w-full bg-black border border-slate-700 ${current.focusBorder} rounded-xl py-2.5 pl-9.5 pr-4 text-xs text-white focus:outline-none transition-all font-semibold placeholder:text-slate-400 resize-none h-20`}
                      />
                    </div>
                  </div>
                )}

                {activeTab === "audit" && (
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-300 font-bold uppercase tracking-wider">Grid Region / Facility Location</label>
                    <div className="relative">
                      <Zap className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Texas ERCOT, California ISO, or Care Facility Address"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className={`w-full bg-black border border-slate-700 ${current.focusBorder} rounded-xl py-2.5 pl-9.5 pr-4 text-xs text-white focus:outline-none transition-all font-semibold placeholder:text-slate-400`}
                      />
                    </div>
                  </div>
                )}

                {activeTab === "enterprise" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-300 font-bold uppercase tracking-wider">Est. Monthly Tokens</label>
                      <div className="relative">
                        <Building className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-3" />
                        <select
                          value={formData.orgSize}
                          onChange={(e) => setFormData({ ...formData, orgSize: e.target.value })}
                          className={`w-full bg-black border border-slate-700 ${current.focusBorder} rounded-xl py-2.5 pl-9.5 pr-10 text-xs text-white focus:outline-none transition-all font-semibold appearance-none cursor-pointer`}
                        >
                          <option value="<50M">&lt; 50M Tokens / mo</option>
                          <option value="50M-500M">50M - 500M / mo</option>
                          <option value="500M-5B">500M - 5B / mo</option>
                          <option value="5B+">5B+ Tokens / mo</option>
                        </select>
                        <div className="absolute right-3.5 top-3.5 pointer-events-none w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-500" />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-300 font-bold uppercase tracking-wider">Primary Hurdle / Goal</label>
                      <div className="relative">
                        <Zap className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          placeholder="e.g. Shadow AI spend, API limits"
                          value={formData.hurdle}
                          onChange={(e) => setFormData({ ...formData, hurdle: e.target.value })}
                          className={`w-full bg-black border border-slate-700 ${current.focusBorder} rounded-xl py-2.5 pl-9.5 pr-4 text-xs text-white focus:outline-none transition-all font-semibold placeholder:text-slate-400`}
                        />
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* RIGHT COLUMN: CTA & Value Proposition Checklist */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-black border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between space-y-6">
              
              {/* Deliverables Checklist */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest">
                  {current.checklistTitle}
                </h4>
                
                <div className="space-y-3.5 text-[11px] text-slate-200 font-medium leading-relaxed">
                  {current.checklist.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        activeTab === "general" ? "text-cyan-400" : 
                        activeTab === "audit" ? "text-emerald-400" : 
                        "text-indigo-400"
                      }`} />
                      <span>
                        <strong className="text-white">{item.label}:</strong> {item.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkout Trigger & Faux Lock */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className={`w-full ${current.ctaBg} disabled:bg-slate-800 disabled:text-slate-500 font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer`}
                >
                  {status === "loading" ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Initializing secure pipeline...
                    </>
                  ) : (
                    <>
                      {activeTab === "general" && <PhoneCall className="w-4.5 h-4.5" />}
                      {activeTab === "audit" && <ShieldCheck className="w-4.5 h-4.5" />}
                      {activeTab === "enterprise" && <Database className="w-4.5 h-4.5" />}
                      {current.ctaText}
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>

                <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5 font-semibold">
                  <span>🛡️</span>
                  <span>{current.subLabel}</span>
                </div>
              </div>

            </div>

          </div>

          {status === "error" && (
            <p className="text-red-500 text-[11px] text-center pb-6 font-semibold">
              Error submitting request. Please coordinate directly with support.
            </p>
          )}
        </form>
      </div>

      {/* Direct Email & Social Media Row */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 text-slate-400 backdrop-blur-sm">
        <div className="text-xs font-semibold">
          📧 Prefer direct email?{" "}
          <a 
            href="mailto:remindtag@gmail.com" 
            className="text-emerald-400 hover:text-emerald-300 font-extrabold hover:underline transition-colors ml-1"
          >
            remindtag@gmail.com
          </a>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="text-slate-500 uppercase tracking-wider text-[9px] font-mono font-bold">Connect with us:</span>
          <div className="flex items-center gap-2">
            <a 
              href="https://x.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="h-7 w-7 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="text-[10px] font-extrabold uppercase font-mono">X</span>
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="h-7 w-7 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="text-[10px] font-extrabold uppercase font-mono">in</span>
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="h-7 w-7 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="text-[10px] font-extrabold uppercase font-mono">fb</span>
            </a>
            <a 
              href="https://reddit.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="h-7 w-7 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="text-[10px] font-extrabold uppercase font-mono">rd</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
