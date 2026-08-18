"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════════════════
   Cookie consent banner — Google Consent Mode v2

   Works together with the `consent default` block in app/layout.tsx:
     • EEA / UK / CH visitors  → default DENIED, this banner asks them.
     • Everyone else           → default GRANTED, banner still shown for
                                 transparency but nothing is blocked.

   The stored choice is re-applied on every page load, otherwise a visitor who
   accepted last week would be silently denied again on their next visit.
   ═══════════════════════════════════════════════════════════════════════════ */

const STORAGE_KEY = "purstech-cookie-consent"; // "granted" | "denied"

type Choice = "granted" | "denied";

declare global {
  interface Window { dataLayer?: unknown[]; }
}

/** Push a Consent Mode v2 update. Safe if gtag hasn't loaded yet — the
 *  dataLayer queue is replayed once the tag initialises. */
function applyConsent(choice: Choice) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  // Using dataLayer.push directly avoids depending on the global gtag symbol.
  window.dataLayer.push(["consent", "update", {
    ad_storage:          choice,
    ad_user_data:        choice,
    ad_personalization:  choice,
    analytics_storage:   choice,
  }]);
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch { /* storage blocked */ }

    if (stored === "granted" || stored === "denied") {
      applyConsent(stored);          // re-apply previous choice
    } else {
      setVisible(true);              // first visit — ask
    }
  }, []);

  const choose = (choice: Choice) => {
    try { localStorage.setItem(STORAGE_KEY, choice); } catch { /* storage blocked */ }
    applyConsent(choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[100] p-3 sm:p-4"
    >
      <div className="max-w-4xl mx-auto bg-[#13131F] border border-white/10 rounded-2xl shadow-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed flex-1 min-w-0">
          We use cookies to analyse traffic and to serve personalised advertising. Our tools
          themselves run in your browser — your files are never uploaded. See our{" "}
          <Link href="/privacy" className="text-[#6C3AFF] hover:text-[#00D4FF] underline underline-offset-2 transition-colors">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/disclaimer" className="text-[#6C3AFF] hover:text-[#00D4FF] underline underline-offset-2 transition-colors">
            Disclaimer
          </Link>.
        </p>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => choose("denied")}
            className="px-4 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-xs font-bold transition-all"
          >
            Reject
          </button>
          <button
            onClick={() => choose("granted")}
            className="px-5 py-2 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
