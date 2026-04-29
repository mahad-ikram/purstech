"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Chart helper ─────────────────────────────────────────────────────────────

const MONTHLY_DATA = [
  { month: "Aug", adsense: 0,    pro: 0,   affiliate: 0,   api: 0   },
  { month: "Sep", adsense: 0,    pro: 0,   affiliate: 0,   api: 0   },
  { month: "Oct", adsense: 0,    pro: 0,   affiliate: 0,   api: 0   },
  { month: "Nov", adsense: 12,   pro: 0,   affiliate: 0,   api: 0   },
  { month: "Dec", adsense: 48,   pro: 0,   affiliate: 20,  api: 0   },
  { month: "Jan", adsense: 47,   pro: 0,   affiliate: 0,   api: 0   },
];

const DAILY_ADSENSE = [2.1,3.4,2.8,4.1,3.9,5.2,4.8,6.1,5.3,7.2,6.8,8.1,7.4,9.3,8.6,10.1,9.4,11.2,10.8,12.1,11.4,13.2,12.8,14.1,13.4,15.2,14.8,16.1,15.4,17.2];

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const w = 300, h = 50;
  const pts = data.map((v, i) => `${(i/(data.length-1))*w},${h - (v/max)*h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`g${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#g${color.replace("#","")})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Revenue streams ──────────────────────────────────────────────────────────

const STREAMS = [
  {
    icon:"📢", name:"Google AdSense",    today:"$17.20", month:"$47.20",  projected:"$180",
    status:"active", color:"#00D4FF",
    tips:["Apply once you have 20+ live tools","Add ad slots in tool page sidebars","Avoid placing ads above the fold"],
  },
  {
    icon:"💳", name:"PursTech Pro",      today:"$0",     month:"$0",      projected:"$350",
    status:"not_started", color:"#6C3AFF",
    tips:["Set up Stripe account first","Limit free tier to 50 uses/day","Offer annual plan at 20% discount"],
  },
  {
    icon:"🤝", name:"Affiliate Links",   today:"$0",     month:"$0",      projected:"$200",
    status:"not_started", color:"#00E676",
    tips:["Join Canva, Grammarly, SEMrush programmes","Quill AI places links contextually in blog posts","Track clicks with UTM parameters"],
  },
  {
    icon:"🔌", name:"Public API",        today:"$0",     month:"$0",      projected:"$90",
    status:"not_started", color:"#FFD700",
    tips:["List on RapidAPI marketplace (free)","They handle all billing — you keep 80%","Start with 3-4 most popular tools"],
  },
];

const PROJECTIONS = [
  { month:"Month 2",  traffic:"5K/day",   adsense:"$200",   pro:"$140",   affiliate:"$50",   total:"$390"   },
  { month:"Month 3",  traffic:"15K/day",  adsense:"$600",   pro:"$350",   affiliate:"$200",  total:"$1,150" },
  { month:"Month 4",  traffic:"30K/day",  adsense:"$1,200", pro:"$700",   affiliate:"$400",  total:"$2,300" },
  { month:"Month 5",  traffic:"60K/day",  adsense:"$2,400", pro:"$1,400", affiliate:"$800",  total:"$4,600" },
  { month:"Month 6",  traffic:"100K/day", adsense:"$4,000", pro:"$2,800", affiliate:"$1,200",total:"$8,000" },
];

const MILESTONES = [
  { goal:"Apply for AdSense",       done:false, desc:"Need 20+ live tools and original content" },
  { goal:"Set up Stripe payments",  done:false, desc:"For PursTech Pro subscriptions" },
  { goal:"Join Canva Affiliate",    done:false, desc:"20% recurring commission per referral"    },
  { goal:"List API on RapidAPI",    done:false, desc:"Passive income from developers"           },
  { goal:"Reach 1K daily visitors", done:false, desc:"First real AdSense income starts here"   },
  { goal:"First $100 month",        done:false, desc:"Reinvest into API credits"               },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminRevenuePage() {
  const [milestones, setMilestones] = useState(MILESTONES);

  const toggleMilestone = (i: number) => {
    setMilestones(prev => prev.map((m, idx) => idx === i ? { ...m, done: !m.done } : m));
  };

  const totalToday = STREAMS.reduce((s, r) => s + parseFloat(r.today.replace("$","")), 0);
  const totalMonth = STREAMS.reduce((s, r) => s + parseFloat(r.month.replace("$","")), 0);

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-extrabold text-white">Revenue Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Track all income streams and hit your first $1,000/month.</p>
      </div>

      {/* ── Top stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:"Today",         value:`$${totalToday.toFixed(2)}`,  color:"text-green-400"  },
          { label:"This Month",    value:`$${totalMonth.toFixed(2)}`,  color:"text-cyan-400"   },
          { label:"MRR",           value:"$0",                         color:"text-violet-400" },
          { label:"Total Revenue", value:`$${totalMonth.toFixed(2)}`,  color:"text-yellow-400" },
        ].map((s) => (
          <div key={s.label} className="bg-[#13131F] border border-white/5 rounded-2xl p-4 text-center">
            <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── AdSense daily chart ── */}
      <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white">AdSense — Daily Earnings (30 days)</h2>
            <p className="text-xs text-gray-500 mt-0.5">Projected based on traffic growth rate</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-extrabold text-[#00D4FF]">$17.20</div>
            <div className="text-xs text-green-400">↑ Growing daily</div>
          </div>
        </div>
        <MiniChart data={DAILY_ADSENSE} color="#00D4FF" />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>30 days ago</span><span>Today</span>
        </div>
      </div>

      {/* ── Revenue streams ── */}
      <h2 className="text-lg font-extrabold text-white">Revenue Streams</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {STREAMS.map((stream) => (
          <div key={stream.name} className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{stream.icon}</span>
                <div>
                  <div className="font-bold text-white text-sm">{stream.name}</div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    stream.status === "active"
                      ? "bg-green-400/10 text-green-400"
                      : "bg-gray-400/10 text-gray-500"
                  }`}>
                    {stream.status === "active" ? "● Active" : "○ Not started"}
                  </span>
                </div>
              </div>
            </div>

            <MiniChart data={stream.status === "active" ? DAILY_ADSENSE.map(v=>v*0.8) : Array(30).fill(0)} color={stream.color} />

            <div className="grid grid-cols-3 gap-2 mt-4 mb-4">
              {[
                { label:"Today",     value:stream.today     },
                { label:"Month",     value:stream.month     },
                { label:"Projected", value:stream.projected },
              ].map((s) => (
                <div key={s.label} className="bg-[#0A0A14] rounded-xl p-2.5 text-center">
                  <div className="text-sm font-extrabold text-white">{s.value}</div>
                  <div className="text-[10px] text-gray-600">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              {stream.tips.map((tip) => (
                <div key={tip} className="flex items-start gap-2 text-xs text-gray-500">
                  <span className="text-[#6C3AFF] mt-0.5 flex-shrink-0">→</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Revenue projections ── */}
      <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <h2 className="text-sm font-bold text-white">📈 Revenue Projections</h2>
          <p className="text-xs text-gray-500 mt-0.5">Estimated based on industry averages and traffic growth</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-white/5">
                {["Period","Traffic","AdSense","Pro Subs","Affiliate","Total"].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PROJECTIONS.map((row, i) => (
                <tr key={row.month} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-sm font-bold text-white">{row.month}</td>
                  <td className="px-5 py-3 text-xs text-gray-500">{row.traffic}</td>
                  <td className="px-5 py-3 text-sm text-cyan-400 font-mono">{row.adsense}</td>
                  <td className="px-5 py-3 text-sm text-violet-400 font-mono">{row.pro}</td>
                  <td className="px-5 py-3 text-sm text-green-400 font-mono">{row.affiliate}</td>
                  <td className="px-5 py-3 text-sm font-extrabold text-white font-mono">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Revenue milestones ── */}
      <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-white mb-4">🎯 Revenue Milestones</h2>
        <div className="space-y-3">
          {milestones.map((m, i) => (
            <button key={m.goal} onClick={() => toggleMilestone(i)}
              className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all text-left">
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                m.done ? "bg-[#6C3AFF] border-[#6C3AFF]" : "border-gray-600"
              }`}>
                {m.done && <span className="text-white text-xs font-black">✓</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold ${m.done ? "text-gray-500 line-through" : "text-white"}`}>
                  {m.goal}
                </div>
                <div className="text-xs text-gray-600">{m.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
