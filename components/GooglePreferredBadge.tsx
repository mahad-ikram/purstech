import React from "react";

interface GooglePreferredBadgeProps {
  variant?: "inline" | "card";
}

export default function GooglePreferredBadge({ variant = "inline" }: GooglePreferredBadgeProps) {
  const preferredUrl = "https://www.google.com/preferences/source?q=purstech.com";

  if (variant === "card") {
    return (
      <div className="bg-gradient-to-br from-[#13131F] via-[#161626] to-[#0A0A14] border border-white/10 hover:border-[#6C3AFF]/40 rounded-2xl p-5 transition-all">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black shadow-sm flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
            </svg>
          </span>
          <div className="text-xs font-extrabold text-white leading-tight">
            Prefer PursTech on Google
          </div>
          <span className="ml-auto text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
            ★ AI Mode
          </span>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed mb-3.5">
          Add <strong className="text-white">purstech.com</strong> as a Preferred Source in Google Search so our privacy-first tools and benchmarks are prioritized in your <strong className="text-gray-200">AI Overviews</strong>, <strong className="text-gray-200">AI Mode</strong>, and Top Stories.
        </p>
        <a
          href={preferredUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-white hover:bg-gray-100 text-slate-950 font-extrabold text-xs shadow transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/>
            <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
          </svg>
          <span>+ Add as Preferred Source on Google</span>
        </a>
      </div>
    );
  }

  return (
    <a
      href={preferredUrl}
      target="_blank"
      rel="noopener noreferrer"
      title="Add PursTech.com as a Preferred Source in Google Search & AI Overviews"
      className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#13131F] hover:bg-white/10 hover:border-[#00D4FF]/40 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all group"
    >
      <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-white p-0.5 flex-shrink-0">
        <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/>
          <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/>
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
        </svg>
      </span>
      <span className="group-hover:text-[#00D4FF] transition-colors">Add as Preferred Source on Google</span>
      <span className="text-amber-400 text-xs">★</span>
    </a>
  );
}
