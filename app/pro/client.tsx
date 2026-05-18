"use client";

import { useState } from "react";
import Link from "next/link";

// ── Better email validation ─────────────────────────
const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

const PRO_FEATURES = [
  { icon:"⚡", title:"Unlimited Usage",        desc:"No daily limits on any tool. Use as much as you need, whenever you need."  },
  { icon:"🚫", title:"Zero Ads",               desc:"A completely clean, ad-free experience across every tool on PursTech."      },
  { icon:"🤖", title:"Priority AI Processing", desc:"Your AI-powered tool requests jump to the front of the queue."             },
  { icon:"🔌", title:"API Access",             desc:"Integrate PursTech tools into your own apps via our REST API."             },
  { icon:"📦", title:"Batch Processing",       desc:"Process multiple files or inputs at once — huge time saver."               },
  { icon:"⏳", title:"Download History",       desc:"Access your last 90 days of tool outputs from any device."                 },
  { icon:"🆕", title:"Early Access",           desc:"Try new tools before they launch to the public."                          },
  { icon:"💬", title:"Priority Support",       desc:"Get responses within 12 hours, ahead of free-tier users."                 },
];

const PLANS = [
  {
    name:        "Monthly",
    price:       "$7",
    period:      "/month",
    description: "Billed monthly. Cancel anytime.",
    highlight:   false,
  },
  {
    name:        "Annual",
    price:       "$5",
    period:      "/month",
    description: "Billed $59/year. Save 29%.",
    highlight:   true,
    badge:       "Best Value",
  },
];

const FAQS = [
  { q:"When will Pro launch?",                 a:"We are finalising the Pro tier and expect to launch within the next 4–8 weeks. Join the waitlist to be notified first and lock in the founding member price." },
  { q:"What payment methods will you accept?", a:"We will accept all major credit and debit cards, as well as PayPal, processed securely via Stripe." },
  { q:"Can I cancel at any time?",             a:"Yes — cancel any time from your account settings. You keep Pro access until the end of your current billing period. No questions asked." },
  { q:"Will the free tier still exist?",       a:"Absolutely. PursTech will always have a generous free tier. Pro is for power users who want unlimited access and extra features." },
  { q:"Is there a team or business plan?",     a:"Yes — we are planning a Teams plan for organisations. Join the waitlist and mention your team size for early access." },
];

export default function ProClient() {
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [plan,      setPlan]      = useState("Annual");

  const handleJoin = () => {
    if (isValidEmail(email)) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans selection:bg-[#6C3AFF]/30">

      {/* ── Navbar ── */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">
            Purs<span className="text-[#6C3AFF]">Tech</span>
          </Link>
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/tools"   className="text-sm text-gray-500 hover:text-white transition-colors">Tools</Link>
            <Link href="/blog"    className="text-sm text-gray-500 hover:text-white transition-colors">Blog</Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:text-white transition-colors">Contact</Link>
            <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] text-white text-xs font-bold">
              Pro ⚡
            </span>
          </div>
          <Link href="/" className="sm:hidden text-sm text-gray-500 hover:text-white transition-colors">← Home</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-16">

        {/* ── Breadcrumb ── */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span aria-hidden="true">›</span>
          <span className="text-gray-400">Pro</span>
        </nav>

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6C3AFF]/20 to-[#00D4FF]/20 border border-[#6C3AFF]/30 rounded-full px-5 py-2 text-sm text-[#6C3AFF] font-bold mb-5">
            ⚡ PursTech Pro
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            Unlock Everything.<br />
            <span className="bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] bg-clip-text text-transparent">Zero Limits.</span>
          </h1>

          <h2 className="text-base font-semibold text-[#6C3AFF] mb-4">
            Unlimited Tool Access · No Ads · API · Batch Processing · from $5/month
          </h2>

          <p className="text-gray-400 text-xl max-w-xl mx-auto mb-8">
            The full power of PursTech — unlimited tools, no ads, API access and priority AI — for less than a coffee a week.
          </p>

          <div className="inline-flex items-center gap-3 bg-[#13131F] border border-yellow-500/20 rounded-2xl px-6 py-3">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-yellow-400 font-semibold text-sm">Launching in the coming weeks — join the waitlist for early access</span>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-16 justify-center">
          {PLANS.map(p => (
            <button key={p.name} onClick={() => setPlan(p.name)}
              className={`relative flex-1 rounded-2xl p-6 text-center transition-all border ${
                plan === p.name
                  ? "bg-gradient-to-b from-[#6C3AFF]/20 to-[#0A0A14] border-[#6C3AFF]/50 shadow-xl shadow-violet-900/30"
                  : "bg-[#13131F] border-white/5 hover:border-white/10"
              }`}>
              {p.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] text-white text-xs font-extrabold px-3 py-1 rounded-full whitespace-nowrap">
                  {p.badge}
                </div>
              )}
              <div className="text-sm font-bold text-gray-400 mb-1">{p.name}</div>
              <div className="text-4xl font-extrabold text-white mb-0.5">
                {p.price}<span className="text-lg text-gray-500">{p.period}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{p.description}</div>
            </button>
          ))}
        </div>

        {/* Waitlist form */}
        <div className="max-w-md mx-auto mb-20 text-center">
          {submitted ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-xl font-extrabold text-white mb-2">You&apos;re on the list!</h3>
              <p className="text-gray-500 text-sm">We&apos;ll email you the moment Pro launches — plus you&apos;ll get a founding member discount.</p>
            </div>
          ) : (
            <div className="bg-[#13131F] border border-[#6C3AFF]/20 rounded-2xl p-8">
              <h2 className="text-xl font-extrabold text-white mb-2">Join the Waitlist</h2>
              <p className="text-gray-500 text-sm mb-6">Be first to know when Pro launches and lock in the founding member price.</p>
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleJoin()}
                  placeholder="your@email.com"
                  autoComplete="email"
                  className="w-full px-5 py-4 rounded-xl bg-[#0A0A14] border border-[#6C3AFF]/30 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4FF] transition-all text-sm"
                />
                <button
                  onClick={handleJoin}
                  disabled={!isValidEmail(email)}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold transition-all shadow-lg shadow-violet-900/30"
                >
                  Join Waitlist — It&apos;s Free →
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-3">No spam. Unsubscribe at any time.</p>
            </div>
          )}
        </div>

        {/* Features grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-white text-center mb-10">Everything in Pro</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {PRO_FEATURES.map(f => (
              <div key={f.title} className="bg-[#13131F] border border-white/5 rounded-2xl p-5 hover:border-[#6C3AFF]/30 transition-colors">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-white text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Free vs Pro comparison */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden mb-16">
          <div className="grid grid-cols-3 text-xs font-bold uppercase tracking-wider text-gray-500 px-5 py-3 border-b border-white/5">
            <div>Feature</div>
            <div className="text-center">Free</div>
            <div className="text-center text-[#6C3AFF]">Pro ⚡</div>
          </div>
          {[
            { feature:"Tool usage",        free:"50 uses/day", pro:"Unlimited"  },
            { feature:"Ads",               free:"Yes",         pro:"None"       },
            { feature:"AI tools",          free:"Limited",     pro:"Priority"   },
            { feature:"API access",        free:"No",          pro:"1,000/mo"   },
            { feature:"Batch processing",  free:"No",          pro:"Yes"        },
            { feature:"Download history",  free:"No",          pro:"90 days"    },
            { feature:"Support",           free:"Standard",    pro:"Priority"   },
            { feature:"Early access",      free:"No",          pro:"Yes"        },
          ].map((row, i) => (
            <div key={row.feature} className={`grid grid-cols-3 px-5 py-3.5 text-sm ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
              <div className="text-gray-400">{row.feature}</div>
              <div className="text-center text-gray-600">{row.free}</div>
              <div className="text-center text-green-400 font-semibold">{row.pro}</div>
            </div>
          ))}
        </div>

        {/* ── FAQ Section (Bot-Friendly) ── */}
        <div>
          <h2 className="text-2xl font-extrabold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3 max-w-2xl mx-auto">
            {FAQS.map((item, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{item.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-gradient-to-br from-[#6C3AFF]/10 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-3xl p-10">
          <h2 className="text-2xl font-extrabold text-white mb-3">Ready to go unlimited?</h2>
          <p className="text-gray-500 mb-6">Join the waitlist and be first when Pro launches.</p>
          <Link href="/tools"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#13131F] border border-white/10 hover:border-[#6C3AFF]/40 text-white font-bold transition-all">
            Try free tools while you wait →
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-20 py-8 text-center bg-[#0A0A14]">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/about"   className="hover:text-gray-400 transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
