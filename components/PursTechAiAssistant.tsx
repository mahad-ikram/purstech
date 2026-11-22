'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { BLOG_POSTS } from '@/app/blog/data';
import {
  searchDistilledVault,
  absorbTeacherLesson,
  PURSTECH_TOOL_CATALOG
} from '@/lib/distilled-vault';

const tools = PURSTECH_TOOL_CATALOG;
const blogs = Object.values(BLOG_POSTS);

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  matchedTools?: { name: string; slug: string; reason: string }[];
  matchedBlogs?: { title: string; slug: string }[];
}

function renderFormattedText(raw: string) {
  const formatInline = (line: string, keyPrefix: string) => {
    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={`${keyPrefix}-${idx}`} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={`${keyPrefix}-${idx}`}
            className="mx-0.5 rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-[#00D4FF]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return <React.Fragment key={`${keyPrefix}-${idx}`}>{part}</React.Fragment>;
    });
  };

  const lines = raw.split(/\n/);
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;

        if (/^[•\-\*]\s+/.test(trimmed)) {
          const content = trimmed.replace(/^[•\-\*]\s+/, '');
          return (
            <div key={i} className="flex items-start gap-2 pl-0.5">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#00D4FF]" />
              <span className="flex-1 text-gray-200">{formatInline(content, `b-${i}`)}</span>
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={i} className="flex items-start gap-2 pl-0.5">
              <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#6C3AFF]/25 text-[10px] font-bold text-[#00D4FF]">
                {numMatch[1]}
              </span>
              <span className="flex-1 text-gray-200">{formatInline(numMatch[2], `n-${i}`)}</span>
            </div>
          );
        }

        return (
          <p key={i} className="text-gray-200 leading-relaxed">
            {formatInline(trimmed, `p-${i}`)}
          </p>
        );
      })}
    </div>
  );
}

function tryInstantSolver(query: string): {
  answer: string;
  matchedTools: { name: string; slug: string; reason: string }[];
  matchedBlogs: { title: string; slug: string }[];
} | null {
  const qLower = query.trim().toLowerCase();

  const pctMatch =
    qLower.match(/what\s+is\s+(\d+(?:\.\d+)?)\s*%\s+of\s+(\d+(?:\.\d+)?)/i) ||
    qLower.match(/(\d+(?:\.\d+)?)\s*%\s+of\s+(\d+(?:\.\d+)?)/i);
  if (pctMatch) {
    const pct = parseFloat(pctMatch[1]);
    const total = parseFloat(pctMatch[2]);
    const result = ((pct / 100) * total).toFixed(2).replace(/\.00$/, '');
    return {
      answer: `**${pct}% of ${total} is ${result}.**\nFormula: \`(${pct} ÷ 100) × ${total} = ${result}\`.`,
      matchedTools: [
        {
          name: 'Percentage Calculator',
          slug: '/tools/percentage-calculator',
          reason: 'Calculate percentages, discounts, and % change instantly.'
        }
      ],
      matchedBlogs: []
    };
  }

  const tzMatch = qLower.match(
    /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*(est|edt|et|pst|pdt|pt|cst|cdt|ct|gmt|utc|pkt|ist)\s*(?:in|to|into)\s*(est|edt|et|pst|pdt|pt|cst|cdt|ct|gmt|utc|pkt|ist)/i
  );
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
    let targetMins = hour * 60 + mins + diff * 60;
    while (targetMins < 0) targetMins += 1440;
    targetMins = targetMins % 1440;

    const outH24 = Math.floor(targetMins / 60);
    const outM = targetMins % 60;
    const outAmPm = outH24 >= 12 ? 'PM' : 'AM';
    const outH12 = outH24 % 12 === 0 ? 12 : outH24 % 12;
    const formatted = `${outH12}:${String(outM).padStart(2, '0')} ${outAmPm} ${toTz}`;
    const diffHours = Math.abs(diff);

    return {
      answer: `**${tzMatch[1]}${tzMatch[2] ? ':' + tzMatch[2] : ''} ${(ampm || '').toUpperCase()} ${fromTz} is ${formatted}.**\n${toTz} is ${diffHours} hours ${diff >= 0 ? 'ahead of' : 'behind'} ${fromTz}.`,
      matchedTools: [
        {
          name: 'Time Zone Converter',
          slug: '/tools/time-zone-converter',
          reason: 'Compare live times across EST, PST, UTC, PKT, and 400+ cities.'
        }
      ],
      matchedBlogs: []
    };
  }

  return null;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: "Hi! Tell me what you're working on—whether you want to remove an AI watermark, upscale a photo, compress a PDF, or convert time zones—and I'll solve it or open the right tool for you.",
  matchedTools: [
    {
      name: 'SynthID & C2PA Remover',
      slug: '/tools/synthid-remover',
      reason: 'Strip AI metadata & invisible watermarks locally'
    },
    {
      name: 'Background Remover',
      slug: '/tools/background-remover',
      reason: '9-model in-browser AI cutout studio'
    }
  ]
};

export default function PursTechAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('purstech_learned_vault_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          parsed.forEach((l) => absorbTeacherLesson(l));
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  async function handleSend(customPrompt?: string) {
    const text = (customPrompt ?? input).trim();
    if (!text || isLoading) return;

    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: 'user', text }]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      const instant = tryInstantSolver(text);
      if (instant) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'assistant',
            text: instant.answer,
            matchedTools: instant.matchedTools,
            matchedBlogs: instant.matchedBlogs
          }
        ]);
        setIsLoading(false);
        return;
      }

      const localVault = searchDistilledVault(text);
      if (localVault.lesson && localVault.score >= 0.72) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'assistant',
            text: localVault.lesson!.answer,
            matchedTools: localVault.lesson!.recommendedTools,
            matchedBlogs: localVault.lesson!.recommendedBlogs
          }
        ]);
        setIsLoading(false);
        return;
      }

      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.learnedNewLesson && data.distilledLesson) {
          absorbTeacherLesson(data.distilledLesson);
          try {
            const existing = JSON.parse(localStorage.getItem('purstech_learned_vault_v1') || '[]');
            existing.unshift(data.distilledLesson);
            localStorage.setItem('purstech_learned_vault_v1', JSON.stringify(existing.slice(0, 200)));
          } catch {}
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'assistant',
            text: data.answer,
            matchedTools: data.recommendedTools || [],
            matchedBlogs: data.recommendedBlogs || []
          }
        ]);
      } else {
        throw new Error('Fallback to local catalog');
      }
    } catch {
      const keywords = text.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
      const matchedT = tools
        .filter((t) =>
          keywords.some((kw) => `${t.name} ${t.description} ${t.category}`.toLowerCase().includes(kw))
        )
        .slice(0, 2)
        .map((t) => ({ name: t.name, slug: `/tools/${t.slug}`, reason: t.description }));
      const matchedB = blogs
        .filter((b) =>
          keywords.some((kw) => `${b.title} ${b.excerpt}`.toLowerCase().includes(kw))
        )
        .slice(0, 1)
        .map((b) => ({ title: b.title, slug: `/blog/${b.slug}` }));

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: matchedT.length
            ? `Here is the best tool on PursTech for your task: **${matchedT[0].name}**. Everything runs locally in your browser with zero file uploads.`
            : 'You can explore all 50+ free browser tools below:',
          matchedTools: matchedT.length
            ? matchedT
            : [{ name: 'Browse All 50+ Tools', slug: '/tools', reason: 'Explore all 8 tool categories' }],
          matchedBlogs: matchedB
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open PursTech AI Assistant"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5 rounded-full bg-[#13131F]/95 backdrop-blur-xl border border-[#6C3AFF]/50 hover:border-[#00D4FF]/70 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_8px_30px_rgba(108,58,255,0.35)] transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#6C3AFF] to-[#00D4FF] text-white shadow-sm">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.6 9.4L22 12L14.6 14.6L12 22L9.4 14.6L2 12L9.4 9.4L12 2Z" />
            </svg>
          </span>
          <span>PursTech AI</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-6 sm:right-6 z-50 flex flex-col w-auto sm:w-[385px] max-w-[calc(100vw-1.5rem)] h-[min(530px,calc(100dvh-5rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A14]/95 backdrop-blur-2xl text-white shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(108,58,255,0.22)] font-sans">
          <div className="flex items-center justify-between border-b border-white/10 bg-[#13131F] px-4 py-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C3AFF] to-[#00D4FF] text-white shadow-md">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.6 9.4L22 12L14.6 14.6L12 22L9.4 14.6L2 12L9.4 9.4L12 2Z" />
                </svg>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#13131F] bg-emerald-400" />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold text-white">PursTech Assistant</h3>
                <p className="truncate text-[11px] text-gray-400">
                  Instant Tool Finder &amp; Live Helper
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => setMessages([INITIAL_MESSAGE])}
                title="Reset conversation"
                className="rounded-lg px-2 py-1 text-[11px] font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close PursTech Assistant"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 border-b border-white/5 bg-[#0A0A14] px-3 py-2">
            {[
              { label: '🛡️ Remove AI watermark', prompt: 'How do I remove SynthID and C2PA watermarks?' },
              { label: '🔍 Upscale photo 4×', prompt: 'How can I restore and upscale an old blurry photo?' },
              { label: '🕒 4pm EST to PST', prompt: 'What is 4pm EST in PST?' },
              { label: '✅ Fix AdSense issue', prompt: 'Why did Google AdSense reject my site for Low value content?' }
            ].map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleSend(chip.prompt)}
                className="rounded-lg border border-white/10 bg-[#13131F] px-2.5 py-1 text-[11px] font-medium text-gray-300 transition hover:border-[#6C3AFF]/60 hover:text-white"
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 ${
                    m.role === 'user'
                      ? 'bg-[#6C3AFF] text-white font-medium shadow-md shadow-[#6C3AFF]/20'
                      : 'border border-white/10 bg-[#13131F] text-gray-200'
                  }`}
                >
                  {m.role === 'user' ? (
                    <p className="leading-relaxed break-words">{m.text}</p>
                  ) : (
                    renderFormattedText(m.text)
                  )}

                  {m.matchedTools && m.matchedTools.length > 0 && (
                    <div className="mt-3 space-y-1.5 border-t border-white/10 pt-2.5">
                      {m.matchedTools.map((t) => (
                        <Link
                          key={t.slug}
                          href={t.slug}
                          onClick={() => setIsOpen(false)}
                          className="group flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#0A0A14] px-3 py-2 transition hover:border-[#6C3AFF]"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-bold text-white group-hover:text-[#00D4FF] transition-colors">
                              {t.name}
                            </div>
                            <div className="truncate text-[11px] text-gray-400">{t.reason}</div>
                          </div>
                          <span className="flex-shrink-0 rounded-lg bg-[#6C3AFF]/20 px-2 py-1 text-[10px] font-bold text-[#00D4FF] group-hover:bg-[#6C3AFF] group-hover:text-white transition-colors">
                            Open →
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {m.matchedBlogs && m.matchedBlogs.length > 0 && (
                    <div className="mt-2 space-y-1 border-t border-white/10 pt-2">
                      {m.matchedBlogs.map((b) => (
                        <Link
                          key={b.slug}
                          href={b.slug}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-1.5 text-[11px] font-medium text-[#00D4FF] hover:underline"
                        >
                          <span>📖</span>
                          <span className="truncate">{b.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 px-1 text-xs text-gray-400">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#6C3AFF]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#00D4FF] [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#6C3AFF] [animation-delay:300ms]" />
                </span>
                <span>Finding the best solution...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-white/10 bg-[#13131F] p-2.5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or search 50+ tools..."
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0A0A14] px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-[#6C3AFF] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 rounded-xl bg-[#6C3AFF] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#5829E0] disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
