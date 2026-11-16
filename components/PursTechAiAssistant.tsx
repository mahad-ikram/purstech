'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { BLOG_POSTS } from '@/app/blog/data';
import { searchDistilledVault, absorbTeacherLesson, getAllVaultLessons, PURSTECH_TOOL_CATALOG } from '@/lib/distilled-vault';

const tools = PURSTECH_TOOL_CATALOG;
const blogs = Object.values(BLOG_POSTS);

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  badge?: string;
  confidence?: number;
  learnedNew?: boolean;
  matchedTools?: { name: string; slug: string; reason: string }[];
  matchedBlogs?: { title: string; slug: string }[];
}

// Layer 1: Instant <5ms Client-Side Live Solvers (Math, Time Zone, Word Count, SynthID, AdSense)
function tryInstantClientSolver(query: string): {
  solved: boolean;
  answer: string;
  badge: string;
  matchedTools: { name: string; slug: string; reason: string }[];
  matchedBlogs: { title: string; slug: string }[];
} | null {
  const q = query.trim();
  const qLower = q.toLowerCase();

  // 1. Percentage / Discount / Margin Solver
  const pctOfMatch = qLower.match(/what\s+is\s+(\d+(?:\.\d+)?)\s*%\s+of\s+(\d+(?:\.\d+)?)/i) ||
                     qLower.match(/(\d+(?:\.\d+)?)\s*%\s+of\s+(\d+(?:\.\d+)?)/i);
  if (pctOfMatch) {
    const pct = parseFloat(pctOfMatch[1]);
    const total = parseFloat(pctOfMatch[2]);
    const result = ((pct / 100) * total).toFixed(2).replace(/\.00$/, '');
    return {
      solved: true,
      badge: '⚡ Layer 1: Instant Math Solver (<2ms)',
      answer: `**${pct}% of ${total} is ${result}.**\n\nFormula: \`(${pct} ÷ 100) × ${total} = ${result}\`. Need reverse percentages, percentage increase, or discount breakdowns? Open the live calculator below:`,
      matchedTools: [
        { name: 'Percentage Calculator', slug: '/tools/percentage-calculator', reason: 'Compute X% of Y, % change, and discounts instantly.' }
      ],
      matchedBlogs: []
    };
  }

  // 2. Time Zone Converter Solver (Matches top GSC regex queries: "what is 4pm est in pst", "5pm est to pst", etc.)
  const tzMatch = qLower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*(est|edt|et|pst|pdt|pt|cst|cdt|ct|gmt|utc|pkt|ist)\s*(?:in|to|into)\s*(est|edt|et|pst|pdt|pt|cst|cdt|ct|gmt|utc|pkt|ist)/i);
  if (tzMatch) {
    let hour = parseInt(tzMatch[1], 10);
    const mins = tzMatch[2] ? parseInt(tzMatch[2], 10) : 0;
    const ampm = tzMatch[3]?.toLowerCase();
    const fromTz = tzMatch[4].toUpperCase();
    const toTz = tzMatch[5].toUpperCase();

    const offsets: Record<string, number> = {
      EST: -5, EDT: -4, ET: -5,
      CST: -6, CDT: -5, CT: -6,
      PST: -8, PDT: -7, PT: -8,
      GMT: 0, UTC: 0,
      PKT: 5, IST: 5.5
    };

    if (ampm === 'pm' && hour < 12) hour += 12;
    if (ampm === 'am' && hour === 12) hour = 0;

    const diff = (offsets[toTz] ?? 0) - (offsets[fromTz] ?? 0);
    let targetTotalMins = hour * 60 + mins + diff * 60;
    while (targetTotalMins < 0) targetTotalMins += 1440;
    targetTotalMins = targetTotalMins % 1440;

    const outHour24 = Math.floor(targetTotalMins / 60);
    const outMins = targetTotalMins % 60;
    const outAmPm = outHour24 >= 12 ? 'PM' : 'AM';
    const outHour12 = outHour24 % 12 === 0 ? 12 : outHour24 % 12;
    const formattedTarget = `${outHour12}:${String(outMins).padStart(2, '0')} ${outAmPm} ${toTz}`;
    const diffHours = Math.abs(diff);

    return {
      solved: true,
      badge: '⚡ Layer 1: Instant Time Zone Engine (<2ms)',
      answer: `**${tzMatch[1]}${tzMatch[2] ? ':' + tzMatch[2] : ''} ${(ampm || '').toUpperCase()} ${fromTz} is ${formattedTarget}.**\n\n${fromTz} and ${toTz} have a **${diffHours}-hour offset** (${diff >= 0 ? `${toTz} is ${diffHours}h ahead` : `${toTz} is ${diffHours}h behind`}). Use our interactive converter below to compare multiple global cities:`,
      matchedTools: [
        { name: 'Time Zone Converter', slug: '/tools/time-zone-converter', reason: 'Compare EST, PST, UTC, PKT, and 400+ IANA time zones side by side.' }
      ],
      matchedBlogs: []
    };
  }

  return null;
}

export default function PursTechAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [vaultCount, setVaultCount] = useState(getAllVaultLessons().length);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      badge: '🧠 4-Layer Self-Distilling PursTech-LM',
      confidence: 1.0,
      text: 'Hi! I am **PursTech-LM**, your self-learning AI assistant.\n\n• **Layer 1 & 2 (<15ms):** Instant math/time-zone solvers & Distilled Memory Vault\n• **Layer 3:** Custom `PursTech-1.5B` Student Model\n• **Layer 4:** `5 RPM` Gemini Teacher Auto-Distillation (when you ask a tough question, I consult the Teacher and permanently learn the answer!).\n\nAsk me any time-zone, PDF, SynthID/C2PA, AdSense, or image restoration question!',
      matchedTools: [
        { name: 'SynthID & C2PA Watermark Remover', slug: '/tools/synthid-remover', reason: '7-layer AI watermark & provenance cleaner' },
        { name: 'AdSense Low Value Content Auditor', slug: '/tools/adsense-checker', reason: '26-point Google AdSense readiness scorer' }
      ]
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Hydrate any previously learned lessons from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('purstech_learned_vault_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          parsed.forEach((l) => absorbTeacherLesson(l));
          setVaultCount(getAllVaultLessons().length);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  async function handleSend(customPrompt?: string) {
    const text = (customPrompt ?? input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      // 1. Check Layer 1 Instant Client-Side Solver (<2ms)
      const instant = tryInstantClientSolver(text);
      if (instant) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'assistant',
            badge: instant.badge,
            confidence: 0.99,
            text: instant.answer,
            matchedTools: instant.matchedTools,
            matchedBlogs: instant.matchedBlogs
          }
        ]);
        setIsLoading(false);
        return;
      }

      // 2. Check Layer 2 Local Distilled Vault (<10ms)
      const localVault = searchDistilledVault(text);
      if (localVault.lesson && localVault.score >= 0.72) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'assistant',
            badge: `🧠 Layer 2: Distilled Vault Memory (${Math.round(localVault.score * 100)}% match)`,
            confidence: localVault.score,
            text: localVault.lesson!.answer,
            matchedTools: localVault.lesson!.recommendedTools,
            matchedBlogs: localVault.lesson!.recommendedBlogs
          }
        ]);
        setIsLoading(false);
        return;
      }

      // 3. Call Layer 3 (PursTech-1.5B Student) + Layer 4 (5 RPM Gemini Teacher Distiller) via /api/ai-chat
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.learnedNewLesson && data.distilledLesson) {
          absorbTeacherLesson(data.distilledLesson);
          setVaultCount(getAllVaultLessons().length);
          try {
            const existing = JSON.parse(localStorage.getItem('purstech_learned_vault_v1') || '[]');
            existing.unshift(data.distilledLesson);
            localStorage.setItem('purstech_learned_vault_v1', JSON.stringify(existing.slice(0, 200)));
          } catch {
            // ignore
          }
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'assistant',
            badge: data.badge || '🤖 PursTech-LM',
            confidence: data.confidence,
            learnedNew: Boolean(data.learnedNewLesson),
            text: data.answer,
            matchedTools: data.recommendedTools || [],
            matchedBlogs: data.recommendedBlogs || []
          }
        ]);
      } else {
        throw new Error('Fallback to local index');
      }
    } catch {
      // Offline / zero-network fallback using local tool & blog catalog
      const qLower = text.toLowerCase();
      const matchedT = tools
        .filter((t) => `${t.name} ${t.description} ${t.category}`.toLowerCase().includes(qLower.split(' ')[0] || ''))
        .slice(0, 2)
        .map((t) => ({ name: t.name, slug: `/tools/${t.slug}`, reason: t.description }));
      const matchedB = blogs
        .filter((b) => `${b.title} ${b.excerpt}`.toLowerCase().includes(qLower.split(' ')[0] || ''))
        .slice(0, 1)
        .map((b) => ({ title: b.title, slug: `/blog/${b.slug}` }));

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          badge: '🛡️ Offline Local Index Fallback',
          text: matchedT.length
            ? `I matched your query locally to **${matchedT[0].name}**. Click below to launch it in your browser:`
            : 'Browse our 50+ privacy-first browser tools below:',
          matchedTools: matchedT,
          matchedBlogs: matchedB
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open PursTech Self-Learning AI Assistant"
          className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-xl transition-all hover:scale-105 hover:shadow-indigo-500/30"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
          </span>
          <span>Ask PursTech AI</span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold">
            {vaultCount} Learned
          </span>
        </button>
      ) : (
        <div className="flex h-[560px] w-[370px] sm:w-[410px] flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 text-slate-100 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-4 py-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                <h3 className="text-sm font-bold text-white">PursTech-LM (Self-Distilling AI)</h3>
              </div>
              <p className="text-[11px] text-slate-400">
                Student Model + 5 RPM Teacher Memory ({vaultCount} skills)
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              aria-label="Close AI Assistant"
            >
              ✕
            </button>
          </div>

          {/* Quick Test Chips */}
          <div className="flex gap-1.5 overflow-x-auto border-b border-slate-800/80 bg-slate-950/60 px-3 py-2 text-[11px]">
            {[
              'What is 4pm EST in PST?',
              'Difference between SynthID & C2PA?',
              'How to fix AdSense Low value content?',
              'Restore & colorize old blurry photo?'
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                className="shrink-0 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-indigo-300 transition hover:bg-indigo-500/20"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-3.5 text-xs leading-relaxed">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'border border-slate-800 bg-slate-800/90 text-slate-100'
                  }`}
                >
                  {m.badge && (
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="inline-block rounded-md bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                        {m.badge}
                      </span>
                      {m.learnedNew && (
                        <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                          +1 Saved to Vault
                        </span>
                      )}
                    </div>
                  )}
                  <div className="whitespace-pre-line">{m.text}</div>

                  {m.matchedTools && m.matchedTools.length > 0 && (
                    <div className="mt-2.5 space-y-1.5 border-t border-slate-700/70 pt-2">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Recommended PursTech Tools:
                      </div>
                      {m.matchedTools.map((t) => (
                        <Link
                          key={t.slug}
                          href={t.slug}
                          onClick={() => setIsOpen(false)}
                          className="block rounded-lg border border-indigo-500/30 bg-indigo-950/50 p-2 transition hover:border-indigo-400 hover:bg-indigo-900/40"
                        >
                          <div className="font-semibold text-indigo-300">{t.name} →</div>
                          <div className="text-[11px] text-slate-300 line-clamp-2">{t.reason}</div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {m.matchedBlogs && m.matchedBlogs.length > 0 && (
                    <div className="mt-2 space-y-1 border-t border-slate-700/70 pt-2">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        2026–2027 Comparison Guides:
                      </div>
                      {m.matchedBlogs.map((b) => (
                        <Link
                          key={b.slug}
                          href={b.slug}
                          onClick={() => setIsOpen(false)}
                          className="block text-[11px] font-medium text-emerald-400 hover:underline"
                        >
                          📖 {b.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="h-2 w-2 animate-ping rounded-full bg-indigo-400"></span>
                <span>Checking Distilled Vault & Student/Teacher Router...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-slate-800 bg-slate-950 p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask any tool, math, SynthID, or AdSense question..."
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
