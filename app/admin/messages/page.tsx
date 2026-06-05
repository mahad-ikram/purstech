// app/admin/messages/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";

type Message = {
  id:           string;
  created_at:   string;
  updated_at:   string;
  name:         string;
  email:        string;
  subject:      string | null;
  message:      string;
  status:       "new" | "read" | "replied" | "spam" | "archived";
  admin_notes:  string | null;
};

const STATUSES: { key: Message["status"] | "all"; label: string; color: string }[] = [
  { key: "all",      label: "All",      color: "text-gray-300 bg-gray-500/10 border-gray-500/20" },
  { key: "new",      label: "New",      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  { key: "read",     label: "Read",     color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
  { key: "replied",  label: "Replied",  color: "text-green-400 bg-green-500/10 border-green-500/20" },
  { key: "spam",     label: "Spam",     color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
  { key: "archived", label: "Archived", color: "text-gray-500 bg-gray-500/10 border-gray-500/20" },
];

const SUBJECT_LABELS: Record<string, string> = {
  general: "General Enquiry",
  bug: "Bug Report",
  suggestion: "Tool Suggestion",
  billing: "Billing / Pro",
  privacy: "Privacy / Data",
  partnership: "Partnership",
  other: "Other",
};

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const s = Math.floor(ms / 1000);
  if (s < 60)     return `${s}s ago`;
  if (s < 3600)   return `${Math.floor(s / 60)}m ago`;
  if (s < 86400)  return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [counts,   setCounts]   = useState<Record<string, number>>({});
  const [filter,   setFilter]   = useState<string>("all");
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [busy,     setBusy]     = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/messages?status=${filter}&limit=200`);
      const json = await res.json();
      if (json.ok) {
        setMessages(json.messages);
        setCounts(json.counts);
      }
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const updateMessage = async (id: string, patch: Partial<Pick<Message, "status" | "admin_notes">>) => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      if (res.ok) {
        await load();
        if (selected?.id === id) setSelected(s => s ? { ...s, ...patch } as Message : s);
      }
    } finally {
      setBusy(false);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Permanently delete this message? This cannot be undone.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSelected(null);
        await load();
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1">Contact Messages</h1>
        <p className="text-sm text-gray-500">Incoming messages from <code className="text-[#6C3AFF]">/contact</code>. Newest first.</p>
      </div>

      {/* Status filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map(s => {
          const count = counts[s.key] ?? 0;
          const active = filter === s.key;
          return (
            <button key={s.key} onClick={() => setFilter(s.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                active ? "bg-[#6C3AFF] text-white border-transparent" : `${s.color} hover:brightness-125`
              }`}>
              <span>{s.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${active ? "bg-white/20" : "bg-white/5"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* List */}
        <div className="lg:col-span-2 space-y-2 max-h-[75vh] overflow-y-auto pr-1">
          {loading ? (
            <div className="text-gray-500 text-center py-12">Loading messages…</div>
          ) : messages.length === 0 ? (
            <div className="text-gray-500 text-center py-12">No messages in this view.</div>
          ) : messages.map(m => (
            <button key={m.id} onClick={() => {
                setSelected(m);
                if (m.status === "new") updateMessage(m.id, { status: "read" });
              }}
              className={`w-full text-left bg-[#13131F] border rounded-xl p-4 transition-all hover:border-[#6C3AFF]/40 ${
                selected?.id === m.id ? "border-[#6C3AFF]" : "border-white/5"
              }`}>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="font-bold text-white text-sm truncate min-w-0">{m.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUSES.find(s => s.key === m.status)?.color}`}>
                  {m.status}
                </span>
              </div>
              <div className="text-xs text-gray-500 truncate mb-1">{m.email}</div>
              {m.subject && <div className="text-xs text-gray-600 mb-1.5">{SUBJECT_LABELS[m.subject] ?? m.subject}</div>}
              <div className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{m.message}</div>
              <div className="text-[10px] text-gray-700 mt-2">{timeAgo(m.created_at)}</div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 sticky top-6">
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="min-w-0">
                  <div className="font-extrabold text-white text-lg truncate">{selected.name}</div>
                  <a href={`mailto:${selected.email}`} className="text-sm text-[#6C3AFF] hover:text-[#00D4FF] transition-colors break-all">{selected.email}</a>
                </div>
                <button onClick={() => deleteMessage(selected.id)} disabled={busy}
                  className="text-xs text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
                  Delete
                </button>
              </div>

              {selected.subject && (
                <div className="mb-3 text-xs text-gray-500">
                  Subject: <span className="text-white font-semibold">{SUBJECT_LABELS[selected.subject] ?? selected.subject}</span>
                </div>
              )}
              <div className="text-xs text-gray-600 mb-5">
                Received {new Date(selected.created_at).toLocaleString()} · ID: <code className="text-[10px]">{selected.id.slice(0, 8)}</code>
              </div>

              <div className="bg-[#0A0A14] border border-white/5 rounded-xl p-5 mb-5 whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">
                {selected.message}
              </div>

              {/* Status quick-actions */}
              <div className="flex flex-wrap gap-2 mb-5">
                {STATUSES.filter(s => s.key !== "all").map(s => (
                  <button key={s.key} disabled={busy || selected.status === s.key}
                    onClick={() => updateMessage(selected.id, { status: s.key as Message["status"] })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border disabled:opacity-50 ${
                      selected.status === s.key ? "bg-[#6C3AFF] text-white border-transparent" : `${s.color} hover:brightness-125`
                    }`}>
                    Mark as {s.label}
                  </button>
                ))}
              </div>

              {/* Reply by email */}
              <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(SUBJECT_LABELS[selected.subject ?? ""] ?? "your message")} — PursTech&body=${encodeURIComponent(`Hi ${selected.name},\n\n\n\n---\nOn ${new Date(selected.created_at).toLocaleString()}, you wrote:\n${selected.message}`)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-bold text-sm transition-all">
                📧 Reply by Email
              </a>

              {/* Admin notes */}
              <div className="mt-6">
                <label className="block text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Admin Notes (private)</label>
                <textarea
                  defaultValue={selected.admin_notes ?? ""}
                  placeholder="Internal notes about this message…"
                  rows={3}
                  onBlur={e => {
                    if (e.target.value !== (selected.admin_notes ?? "")) {
                      updateMessage(selected.id, { admin_notes: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/50 resize-none"
                />
                <p className="text-[10px] text-gray-700 mt-1">Notes save automatically when you click away.</p>
              </div>
            </div>
          ) : (
            <div className="bg-[#13131F] border border-dashed border-white/10 rounded-2xl p-12 text-center text-gray-600">
              ← Select a message to read
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
