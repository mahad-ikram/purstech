"use client";

import { useEffect } from "react";

// ── useTrackTool ──────────────────────────────────────────────────────
// Drop this into any tool's client.tsx to log every tool use.
// Fires once on mount, fails silently — never breaks the tool.
// Deduplicates within the same browser session (sessionStorage).
//
// Usage:
//   import { useTrackTool } from "@/hooks/useTrackTool";
//
//   export default function MyToolClient() {
//     useTrackTool("json-formatter", "dev");
//     // ... rest of component
//   }

export function useTrackTool(slug: string, category: string) {
  useEffect(() => {
    // ── Session deduplication ──────────────────────────────────────────
    // One count per tool per browser session — prevents reloads from
    // inflating counts while still counting genuine new visits.
    const sessionKey = `tracked_${slug}`;
    if (typeof window !== "undefined" && sessionStorage.getItem(sessionKey)) {
      return; // Already tracked this tool in this session
    }

    // ── Get or create a stable session ID ─────────────────────────────
    let sessionId = sessionStorage.getItem("pt_sid");
    if (!sessionId) {
      sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem("pt_sid", sessionId);
    }

    // ── Fire and forget ────────────────────────────────────────────────
    fetch("/api/track", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ slug, category, sessionId }),
    })
      .then(res => {
        if (res.ok) sessionStorage.setItem(sessionKey, "1");
      })
      .catch(() => {}); // Silent fail — tracking must never break a tool

  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
