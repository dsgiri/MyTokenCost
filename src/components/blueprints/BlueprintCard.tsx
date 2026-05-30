"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  ShieldAlert, 
  ArrowRight, 
  ThumbsUp, 
  ThumbsDown, 
  Copy 
} from "lucide-react";
import Link from "next/link";
import { submitRating, fetchRatings } from "@/lib/ratings";

interface Blueprint {
  _id: string;
  title: string;
  regulatoryBody: string;
  penaltyRisk: string;
  steps: any[];
  slug: string;
}

interface BlueprintCardProps {
  blueprint: Blueprint;
}

export default function BlueprintCard({ blueprint }: BlueprintCardProps) {
  const [mounted, setMounted] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchRatings("blueprint", blueprint.slug).then((summary) => {
      setUpvotes(summary.upvotes);
      downvotes >= 0 && setDownvotes(summary.downvotes);
      if (summary.userVote === "up") setLiked(true);
      if (summary.userVote === "down") setLiked(false);
    }).catch(() => {});
  }, [blueprint.slug]);

  const renderBlockText = (blocks: any[]) => {
    if (!blocks || !Array.isArray(blocks)) return null;
    return blocks.map((block, i) => {
      if (block._type === 'block' && block.children) {
        const text = block.children.map((child: any) => child.text).join('');
        return (
          <p key={i} className="text-slate-300 text-sm leading-relaxed mb-3">
            {text}
          </p>
        );
      }
      return null;
    });
  };

  const handleShare = (platform: "twitter" | "linkedin" | "facebook" | "reddit" | "copy") => {
    const text = `Just reviewed this compliance SOP blueprint: "${blueprint.title}". Avoid severe penalty risks (${blueprint.penaltyRisk}) by auditing your high-density compute systems with our checklist:`;
    const url = `https://mytokencost.com/blueprints#${blueprint.slug}`;

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

  return (
    <div 
      id={blueprint.slug}
      className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all hover:border-[#00f0ff]/40 hover:shadow-[0_0_30px_rgba(0,240,255,0.05)] text-left"
    >
      <div>
        {/* Badge & Agency Info */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            blueprint.regulatoryBody === "ERCOT" 
              ? "bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20" 
              : blueprint.regulatoryBody === "HHSC"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          }`}>
            {blueprint.regulatoryBody || "GENERAL"} Agency Heuristic
          </span>
          <FileText className="w-5 h-5 text-slate-500" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold font-sans text-white mb-4 tracking-tight">
          {blueprint.title}
        </h3>

        {/* Penalty Box */}
        {blueprint.penaltyRisk && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500 block">
                Civil Penalty Risk
              </span>
              <span className="text-sm text-slate-200">
                {blueprint.penaltyRisk}
              </span>
            </div>
          </div>
        )}

        {/* SOP Steps */}
        <div className="space-y-4 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Structured SOP Checklist
          </span>
          {blueprint.steps && renderBlockText(blueprint.steps)}
        </div>
      </div>

      {/* Interactive Rating & Sharing Widget (compact row) */}
      {mounted && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-black/40 border border-slate-800/80 rounded-xl p-3.5 mb-6 text-xs">
          {/* Left side: Simple Rating */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-slate-350 uppercase tracking-wide font-extrabold text-[10.5px]">Correct?</span>
            <div className="flex gap-2">
              <button 
                onClick={() => { 
                  setLiked(true); 
                  submitRating("blueprint", blueprint.slug, "up");
                  if (liked !== true) {
                    setUpvotes(prev => prev + 1);
                    if (liked === false) setDownvotes(prev => Math.max(0, prev - 1));
                  }
                }}
                className={`h-7 px-2.5 rounded-lg border flex items-center gap-1.5 transition cursor-pointer text-[10.5px] font-bold ${
                  liked === true 
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" 
                    : "bg-slate-900/60 border-slate-750 text-slate-300 hover:text-white"
                }`}
              >
                <ThumbsUp className="w-3 h-3" />
                <span>{upvotes}</span>
              </button>
              <button 
                onClick={() => { 
                  setLiked(false); 
                  submitRating("blueprint", blueprint.slug, "down");
                  if (liked !== false) {
                    setDownvotes(prev => prev + 1);
                    if (liked === true) setUpvotes(prev => Math.max(0, prev - 1));
                  }
                }}
                className={`h-7 px-2.5 rounded-lg border flex items-center gap-1.5 transition cursor-pointer text-[10.5px] font-bold ${
                  liked === false 
                    ? "bg-red-500/20 border-red-500/40 text-red-400" 
                    : "bg-slate-900/60 border-slate-750 text-slate-300 hover:text-white"
                }`}
              >
                <ThumbsDown className="w-3 h-3" />
                <span>{downvotes}</span>
              </button>
            </div>
          </div>

          {/* Right side: Simple Social Sharing */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-slate-350 font-semibold text-[10.5px]">Share SOP:</span>
            <div className="flex gap-1.5">
              <button 
                onClick={() => handleShare("twitter")}
                className="h-7 w-7 bg-slate-900/60 hover:bg-slate-900 border border-slate-750 rounded-lg flex items-center justify-center transition cursor-pointer text-slate-100"
                title="Share to X (Twitter)"
              >
                <svg className="w-3 h-3 fill-current text-sky-400" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
              <button 
                onClick={() => handleShare("linkedin")}
                className="h-7 w-7 bg-slate-900/60 hover:bg-slate-900 border border-slate-750 rounded-lg flex items-center justify-center transition cursor-pointer text-slate-100"
                title="Post to LinkedIn"
              >
                <svg className="w-3 h-3 fill-current text-indigo-400" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>
              <button 
                onClick={() => handleShare("facebook")}
                className="h-7 w-7 bg-slate-900/60 hover:bg-slate-900 border border-slate-750 rounded-lg flex items-center justify-center transition cursor-pointer text-slate-100"
                title="Share to Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current text-blue-500" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button 
                onClick={() => handleShare("reddit")}
                className="h-7 w-7 bg-slate-900/60 hover:bg-slate-900 border border-slate-750 rounded-lg flex items-center justify-center transition cursor-pointer text-slate-100"
                title="Share to Reddit"
              >
                <svg className="w-3 h-3 fill-current text-orange-550 text-[#ff4500]" viewBox="0 0 24 24">
                  <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.85-1.64-6.26-1.72l1.32-4.16 4.3 1c0 1.1 1 2 2.1 2 1.2 0 2.2-1 2.2-2.2S21.1 3 20 3c-.9 0-1.6.6-2-1.4l-4.8-1.1c-.2-.04-.4.07-.46.26l-1.5 4.7C8.9 5.5 6.7 6.1 5 7.1c-.5-.8-1.4-1.2-2.4-1.2-1.6 0-3 1.3-3 3 0 1.2.7 2.2 1.7 2.7-.1.3-.2.7-.2 1 0 3.7 4.5 6.8 10 6.8s10-3 10-6.8c0-.3 0-.7-.1-1 1-.5 1.7-1.5 1.7-2.7zm-18 2.2c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm11.2 4.1c-1.8 1.8-5.2 1.8-7 0-.2-.2-.2-.6 0-.8.2-.2.6-.2.8 0 1.4 1.4 4 1.4 5.4 0 .2-.2.6-.2.8 0 .2.2.2.6 0 .8zm-.7-4.1c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" />
                </svg>
              </button>
              <button 
                onClick={() => handleShare("copy")}
                className="h-7 w-7 bg-slate-900/60 hover:bg-slate-900 border border-slate-750 rounded-lg flex items-center justify-center transition cursor-pointer text-slate-100 relative"
                title="Copy direct link"
              >
                <Copy className="w-3 h-3 text-emerald-400" />
                {copySuccess && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[9px] font-black px-1 py-0.5 rounded shadow-lg animate-fade-in whitespace-nowrap z-30">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between gap-4">
        <div className="text-xs text-slate-500">
          Playbook SLA: Verified 7-Day Output
        </div>
        <Link 
          href={`/contact?blueprint=${blueprint.slug}`} 
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#00f0ff] hover:text-white transition-colors group"
        >
          Deploy Certified SOP 
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
