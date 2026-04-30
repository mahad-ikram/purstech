"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const RELATED_TOOLS = [
  { icon: "🎂", name: "Age Calculator",       slug: "age-calculator"        },
  { icon: "⚖️", name: "BMI Calculator",        slug: "bmi-calculator"        },
  { icon: "🔢", name: "Percentage Calculator", slug: "percentage-calculator" },
  { icon: "📏", name: "Unit Converter",        slug: "unit-converter"        },
  { icon: "🏦", name: "Loan Calculator",       slug: "loan-calculator"       },
];

const FAQ = [
  { q: "Are the exchange rates live?", a: "The rates shown are indicative reference rates updated periodically. For financial transactions always verify with your bank or a regulated exchange service as rates fluctuate constantly." },
  { q: "How many currencies are supported?", a: "We support over 30 of the world's most commonly traded currencies covering every major economy and region." },
  { q: "What is a base currency?", a: "The base currency is the currency you are converting from. All other currencies are expressed as how much one unit of the base currency buys." },
  { q: "What is the mid-market rate?", a: "The mid-market rate (also called the interbank rate) is the midpoint between buy and sell prices. Banks and exchange services add a margin on top of this rate — the gap is their profit." },
  { q: "Can I use this for business transactions?", a: "This tool is for informational purposes only. For business transactions, payroll or large transfers, always use a regulated financial institution or FX service." },
];

// Static reference rates vs USD (update periodically)
const RATES: Record<string, { rate: number; name: string; symbol: string; flag: string }> = {
  USD: { rate:1,       name:"US Dollar",       symbol:"$",  flag:"🇺🇸" },
  EUR: { rate:0.921,   name:"Euro",            symbol:"€",  flag:"🇪🇺" },
  GBP: { rate:0.790,   name:"British Pound",   symbol:"£",  flag:"🇬🇧" },
  JPY: { rate:149.50,  name:"Japanese Yen",    symbol:"¥",  flag:"🇯🇵" },
  CAD: { rate:1.358,   name:"Canadian Dollar", symbol:"C$", flag:"🇨🇦" },
  AUD: { rate:1.528,   name:"Australian Dollar",symbol:"A$",flag:"🇦🇺" },
  CHF: { rate:0.896,   name:"Swiss Franc",     symbol:"Fr", flag:"🇨🇭" },
  CNY: { rate:7.241,   name:"Chinese Yuan",    symbol:"¥",  flag:"🇨🇳" },
  INR: { rate:83.12,   name:"Indian Rupee",    symbol:"₹",  flag:"🇮🇳" },
  KRW: { rate:1325.0,  name:"S. Korean Won",   symbol:"₩",  flag:"🇰🇷" },
  SGD: { rate:1.342,   name:"Singapore Dollar",symbol:"S$", flag:"🇸🇬" },
  HKD: { rate:7.820,   name:"Hong Kong Dollar",symbol:"HK$",flag:"🇭🇰" },
  NOK: { rate:10.56,   name:"Norwegian Krone", symbol:"kr", flag:"🇳🇴" },
  SEK: { rate:10.42,   name:"Swedish Krona",   symbol:"kr", flag:"🇸🇪" },
  DKK: { rate:6.883,   name:"Danish Krone",    symbol:"kr", flag:"🇩🇰" },
  NZD: { rate:1.629,   name:"NZ Dollar",       symbol:"NZ$",flag:"🇳🇿" },
  MXN: { rate:17.15,   name:"Mexican Peso",    symbol:"$",  flag:"🇲🇽" },
  BRL: { rate:4.973,   name:"Brazilian Real",  symbol:"R$", flag:"🇧🇷" },
  ZAR: { rate:18.63,   name:"S. African Rand", symbol:"R",  flag:"🇿🇦" },
  AED: { rate:3.673,   name:"UAE Dirham",      symbol:"د.إ",flag:"🇦🇪" },
  SAR: { rate:3.750,   name:"Saudi Riyal",     symbol:"﷼",  flag:"🇸🇦" },
  PKR: { rate:278.5,   name:"Pakistani Rupee", symbol:"₨",  flag:"🇵🇰" },
  TRY: { rate:30.45,   name:"Turkish Lira",    symbol:"₺",  flag:"🇹🇷" },
  RUB: { rate:89.50,   name:"Russian Ruble",   symbol:"₽",  flag:"🇷🇺" },
  PLN: { rate:4.021,   name:"Polish Zloty",    symbol:"zł", flag:"🇵🇱" },
  THB: { rate:35.10,   name:"Thai Baht",       symbol:"฿",  flag:"🇹🇭" },
  IDR: { rate:15580,   name:"Indonesian Rupiah",symbol:"Rp",flag:"🇮🇩" },
  MYR: { rate:4.715,   name:"Malaysian Ringgit",symbol:"RM",flag:"🇲🇾" },
  PHP: { rate:56.45,   name:"Philippine Peso", symbol:"₱",  flag:"🇵🇭" },
  EGP: { rate:30.90,   name:"Egyptian Pound",  symbol:"£",  flag:"🇪🇬" },
};

function convert(amount: number, from: string, to: string): number {
  const inUSD = amount / RATES[from].rate;
  return inUSD * RATES[to].rate;
}

function formatAmount(n: number): string {
  if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (n >= 1)    return n.toFixed(4).replace(/\.?0+$/, "");
  return n.toFixed(6).replace(/\.?0+$/, "");
}

const POPULAR_PAIRS = [
  ["USD","EUR"],["USD","GBP"],["USD","JPY"],["EUR","GBP"],["USD","INR"],["USD","PKR"],
];

export default function CurrencyConverterPage() {
  const [amount,  setAmount]  = useState("1");
  const [from,    setFrom]    = useState("USD");
  const [to,      setTo]      = useState("EUR");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const num    = parseFloat(amount) || 0;
  const result = convert(num, from, to);
  const rate   = convert(1, from, to);

  const handleSwap = () => { setFrom(to); setTo(from); };

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <nav className="border-b border-white/5 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">← All Tools</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span>›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span>›</span>
          <Link href="/categories/finance" className="hover:text-gray-400">Finance Tools</Link><span>›</span>
          <span className="text-gray-400">Currency Converter</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">💱</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">Currency Converter</h1>
              <p className="text-gray-500 mt-1">Convert between 30+ world currencies with reference exchange rates — free, instant, no login.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Free","No Login","30+ Currencies","Reference Rates","Instant"].map(b => (
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium">✓ {b}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Main converter */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">

              {/* From */}
              <div className="mb-4">
                <label className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-wider">Amount</label>
                <div className="flex gap-3">
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} min="0"
                    className="flex-1 px-4 py-4 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-2xl font-extrabold" />
                  <select value={from} onChange={e => setFrom(e.target.value)}
                    className="w-48 px-4 py-4 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm font-semibold">
                    {Object.entries(RATES).map(([code, info]) => (
                      <option key={code} value={code}>{info.flag} {code} — {info.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap */}
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 border-t border-white/5" />
                <button onClick={handleSwap}
                  className="w-10 h-10 rounded-full bg-[#6C3AFF]/20 hover:bg-[#6C3AFF] border border-[#6C3AFF]/30 flex items-center justify-center text-[#6C3AFF] hover:text-white transition-all font-bold text-lg">
                  ⇅
                </button>
                <div className="flex-1 border-t border-white/5" />
              </div>

              {/* To */}
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-wider">Converted To</label>
                <div className="flex gap-3">
                  <div className="flex-1 px-4 py-4 rounded-xl bg-[#0A0A14] border border-[#6C3AFF]/20 text-[#6C3AFF] text-2xl font-extrabold">
                    {RATES[to].symbol}{formatAmount(result)}
                  </div>
                  <select value={to} onChange={e => setTo(e.target.value)}
                    className="w-48 px-4 py-4 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm font-semibold">
                    {Object.entries(RATES).map(([code, info]) => (
                      <option key={code} value={code}>{info.flag} {code} — {info.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rate info */}
              <div className="mt-4 bg-[#0A0A14] rounded-xl px-4 py-3 flex flex-wrap gap-4 text-xs text-gray-500">
                <span>1 {from} = <span className="text-white font-bold">{formatAmount(rate)} {to}</span></span>
                <span>1 {to} = <span className="text-white font-bold">{formatAmount(1/rate)} {from}</span></span>
                <span className="ml-auto text-gray-700">Reference rates — not for transactions</span>
              </div>
            </div>

            {/* Popular pairs */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">⭐ Popular Currency Pairs</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {POPULAR_PAIRS.map(([f, t]) => {
                  const r = convert(1, f, t);
                  return (
                    <button key={`${f}-${t}`}
                      onClick={() => { setFrom(f); setTo(t); setAmount("1"); }}
                      className="bg-[#0A0A14] hover:bg-[#6C3AFF]/10 border border-white/5 hover:border-[#6C3AFF]/30 rounded-xl p-3 text-left transition-all">
                      <div className="text-xs text-gray-500 mb-1">{RATES[f].flag} {f} → {RATES[t].flag} {t}</div>
                      <div className="text-sm font-bold text-white">1 {f} = <span className="text-[#6C3AFF]">{formatAmount(r)} {t}</span></div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* All currencies vs selected */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5">
                <h3 className="text-sm font-bold text-white">{amount || 1} {from} in all currencies</h3>
              </div>
              <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                {Object.entries(RATES).filter(([code]) => code !== from).map(([code, info]) => (
                  <div key={code} className={`flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer ${code === to ? "bg-[#6C3AFF]/5" : ""}`}
                    onClick={() => setTo(code)}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{info.flag}</span>
                      <div>
                        <div className="text-sm font-semibold text-white">{code}</div>
                        <div className="text-xs text-gray-600">{info.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${code === to ? "text-[#6C3AFF]" : "text-white"}`}>
                        {info.symbol}{formatAmount(convert(num || 1, from, code))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-3">⚠️ Important Notice</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                These are <strong className="text-gray-400">reference rates</strong> for informational use only. Actual rates from banks and exchange services will differ. Never use these rates for financial transactions, payroll, invoicing or legal purposes.
              </p>
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">💡 Currency Tips</h3>
              <div className="space-y-2 text-xs text-gray-500">
                {[
                  "Compare rates from multiple banks before exchanging",
                  "Airport exchange desks typically have the worst rates",
                  "Credit cards often offer near mid-market rates",
                  "Avoid dynamic currency conversion (DCC) abroad",
                  "Wise and Revolut offer competitive FX rates",
                ].map(t => (
                  <div key={t} className="flex items-start gap-2"><span className="text-[#6C3AFF] mt-0.5">→</span><span>{t}</span></div>
                ))}
              </div>
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">🔧 Related Tools</h3>
              <div className="space-y-2">
                {RELATED_TOOLS.map(tool => (
                  <Link key={tool.slug} href={`/tools/${tool.slug}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#0A0A14] transition-colors group">
                    <span className="text-xl">{tool.icon}</span>
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{tool.name}</span>
                    <span className="ml-auto text-gray-700 group-hover:text-[#6C3AFF] transition-colors">→</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold text-white text-sm mb-1">PursTech Pro</h3>
              <p className="text-gray-500 text-xs mb-4">Live rates, rate alerts, historical charts</p>
              <button className="w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all">Get Pro — $7/mo</button>
            </div>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">📖 How to Use the Currency Converter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step:"1", title:"Enter an Amount",     desc:"Type the amount you want to convert in the top input field. The result updates automatically as you type." },
              { step:"2", title:"Select Currencies",   desc:"Choose your source currency from the top dropdown and your target currency from the bottom dropdown. Hit the ⇅ button to swap them instantly." },
              { step:"3", title:"See All Rates",       desc:"The table below shows your amount converted into every supported currency at once. Click any row to set it as your target currency." },
            ].map(s => (
              <div key={s.step} className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-[#6C3AFF]/20 border border-[#6C3AFF]/30 flex items-center justify-center text-[#6C3AFF] font-black text-lg mb-4">{s.step}</div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <span className="font-semibold text-white text-sm">{item.q}</span>
                  <span className="text-[#6C3AFF] text-lg ml-4 flex-shrink-0">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && <div className="px-6 pb-4"><p className="text-gray-400 text-sm leading-relaxed">{item.a}</p></div>}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 mt-20 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <p className="text-gray-700 text-xs mt-2">© 2025 PursTech. Free online tools for everyone.</p>
      </footer>
    </div>
  );
}
