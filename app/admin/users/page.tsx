"use client";

import { useState } from "react";

const SUBSCRIBERS = [
  { id:"1", email:"alex.johnson@gmail.com",   source:"homepage",    date:"Today",      active:true  },
  { id:"2", email:"sarah.k@outlook.com",      source:"tool page",   date:"Today",      active:true  },
  { id:"3", email:"dev.mike@protonmail.com",  source:"blog post",   date:"Yesterday",  active:true  },
  { id:"4", email:"designer_pro@yahoo.com",   source:"homepage",    date:"2 days ago", active:true  },
  { id:"5", email:"webmaster99@gmail.com",    source:"homepage",    date:"3 days ago", active:false },
];

export default function AdminUsersPage() {
  const [subs, setSubs]   = useState(SUBSCRIBERS);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  const exportCSV = () => {
    const csv = ["Email,Source,Date,Active",
      ...subs.map(s => `${s.email},${s.source},${s.date},${s.active}`)
    ].join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "purstech-subscribers.csv";
    a.click();
    showToast("✅ Exported!");
  };

  return (
    <div className="space-y-6">

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#13131F] border border-[#6C3AFF]/30 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl z-50">
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-extrabold text-white">Users & Subscribers</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage newsletter subscribers and user accounts.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:"Total Subscribers", value:subs.length,                        color:"text-violet-400" },
          { label:"Active",            value:subs.filter(s=>s.active).length,    color:"text-green-400"  },
          { label:"Pro Users",         value:0,                                  color:"text-cyan-400"   },
          { label:"New Today",         value:subs.filter(s=>s.date==="Today").length, color:"text-yellow-400"},
        ].map((s) => (
          <div key={s.label} className="bg-[#13131F] border border-white/5 rounded-2xl p-4 text-center">
            <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Subscribers table */}
      <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h2 className="text-sm font-bold text-white">Newsletter Subscribers</h2>
          <button onClick={exportCSV}
            className="text-xs bg-[#6C3AFF]/20 hover:bg-[#6C3AFF]/40 text-[#6C3AFF] border border-[#6C3AFF]/30 px-3 py-1.5 rounded-lg font-bold transition-all">
            ⬇️ Export CSV
          </button>
        </div>

        <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-white/5 text-xs text-gray-500 font-semibold uppercase tracking-wider">
          <div className="col-span-5">Email</div>
          <div className="col-span-2 hidden md:block">Source</div>
          <div className="col-span-3">Date</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {subs.map((sub) => (
          <div key={sub.id} className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center">
            <div className="col-span-5 text-sm text-white font-mono truncate">{sub.email}</div>
            <div className="col-span-2 hidden md:block text-xs text-gray-500 capitalize">{sub.source}</div>
            <div className="col-span-3 text-xs text-gray-500">{sub.date}</div>
            <div className="col-span-2 flex justify-end">
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                sub.active ? "bg-green-400/10 text-green-400 border border-green-400/20" : "bg-gray-400/10 text-gray-500 border border-gray-400/20"
              }`}>
                {sub.active ? "Active" : "Unsubscribed"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pro users placeholder */}
      <div className="bg-[#13131F] border border-white/5 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">💳</div>
        <h3 className="text-lg font-bold text-white mb-2">No Pro Users Yet</h3>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
          Once you launch PursTech Pro with Stripe payments, all subscriber data will appear here with plan details, billing status and usage stats.
        </p>
        <a href="https://stripe.com" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-bold text-sm transition-all">
          Set Up Stripe →
        </a>
      </div>

    </div>
  );
}
