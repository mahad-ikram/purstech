"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Tip Calculator",
  description: "Free tip calculator with bill splitting, custom tip percentage, tax, and per-person totals.",
  url: "https://purstech.com/tools/tip-calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const FAQ = [
  {
    q: "How much should I tip at a restaurant?",
    a: "Standard tipping etiquette in the US: 15% for adequate service, 18% for good service, 20% for excellent service, and 25%+ for exceptional service. Quick-service counters where you order at a register: 10–15% or nothing is acceptable. Fine dining: 20% minimum is expected. The tip is typically calculated on the pre-tax amount of your bill, though many people tip on the full amount including tax — either is acceptable.",
  },
  {
    q: "Should I tip on the pre-tax or post-tax amount?",
    a: "Etiquette traditionally says tip on the pre-tax amount. However, in practice, the difference is small (tipping on a $100 meal vs $108 after tax) and most diners simply tip on the full post-tax total for convenience. Our calculator lets you enter the bill with or without tax and choose which amount you tip on — so you can handle it either way.",
  },
  {
    q: "How do I split a bill unevenly when people ordered different amounts?",
    a: "Use our itemized split mode — toggle to individual amounts and enter what each person ordered. The tip and tax percentages are then applied proportionally to each person's share, giving everyone their accurate total. This is fairer than splitting evenly when there's a big difference in what people ordered.",
  },
  {
    q: "What are tip amounts for services other than restaurants?",
    a: "Taxi/rideshare: 15–20%. Hotel housekeeping: $2–5/night. Hotel concierge: $5–10 for special requests. Hair salon/barber: 15–20%. Food delivery: $3–5 or 10–15%. Furniture delivery: $5–20 per person. Coffee shop counter: not required, $1 is appreciated. Movers: $20–50 per person for a full day. Use our service presets to get suggested amounts for each situation.",
  },
  {
    q: "What does 'round up per person' mean?",
    a: "Rounding up rounds each person's share up to the nearest dollar, making it easier to collect cash payments. For example, if each person owes $23.47, rounding up means everyone pays $24 — slightly more than the calculated amount but easier to handle with cash. The calculator shows both the exact amount and the rounded amount so you can choose which to use.",
  },
];

const SERVICE_PRESETS = [
  { icon: "🍽", label: "Restaurant",   tip: 18 },
  { icon: "🍕", label: "Delivery",     tip: 15 },
  { icon: "🚕", label: "Taxi/Ride",    tip: 15 },
  { icon: "✂️", label: "Salon/Barber", tip: 20 },
  { icon: "🏨", label: "Hotel",        tip: 0  },
  { icon: "🍸", label: "Bar",          tip: 18 },
  { icon: "☕", label: "Coffee",       tip: 10 },
  { icon: "📦", label: "Movers",       tip: 0  },
];

const QUICK_TIPS = [10, 15, 18, 20, 25, 30];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

interface Person { id: number; name: string; amount: string; }
let pid = 1;

export default function TipCalculatorClient() {
  const [bill,       setBill]       = useState("85.00");
  const [tipPct,     setTipPct]     = useState(18);
  const [customTip,  setCustomTip]  = useState("");
  const [tax,        setTax]        = useState("8.5");
  const [people,     setPeople]     = useState(2);
  const [splitMode,  setSplitMode]  = useState<"equal" | "individual">("equal");
  const [persons,    setPersons]    = useState<Person[]>([
    { id: pid++, name: "Person 1", amount: "" },
    { id: pid++, name: "Person 2", amount: "" },
  ]);
  const [roundUp,    setRoundUp]    = useState(false);
  const [tipOnPreTax,setTipOnPreTax]= useState(true);
  const [activePreset,setActivePreset] = useState(1); // Restaurant

  const effectiveTip = customTip !== "" ? +customTip : tipPct;

  const calc = useMemo(() => {
    const billAmt = +bill;
    const taxAmt  = billAmt * (+tax / 100);
    const totalPreTax = billAmt;
    const totalPostTax = billAmt + taxAmt;
    const tipBase = tipOnPreTax ? totalPreTax : totalPostTax;
    const tipAmt  = tipBase * (effectiveTip / 100);
    const grandTotal = totalPostTax + tipAmt;

    if (splitMode === "equal") {
      const perPerson = grandTotal / people;
      const rounded   = Math.ceil(perPerson);
      return {
        billAmt, taxAmt, tipAmt, grandTotal,
        perPerson, rounded,
        persons: [],
      };
    } else {
      // Individual
      const total = persons.reduce((s, p) => s + (+p.amount || 0), 0);
      const personCalc = persons.map(p => {
        const share = total > 0 ? (+p.amount || 0) / total : 1 / persons.length;
        const pTax  = taxAmt * share;
        const pTip  = tipAmt * share;
        const pTotal = (+p.amount || 0) + pTax + pTip;
        return { ...p, share, tax: pTax, tip: pTip, total: pTotal, rounded: Math.ceil(pTotal) };
      });
      return { billAmt, taxAmt, tipAmt, grandTotal, perPerson: grandTotal / persons.length, rounded: 0, persons: personCalc };
    }
  }, [bill, tax, effectiveTip, people, splitMode, persons, tipOnPreTax]);

  function applyPreset(idx: number) {
    setActivePreset(idx);
    setTipPct(SERVICE_PRESETS[idx].tip);
    setCustomTip("");
  }

  function addPerson() {
    setPersons(p => [...p, { id: pid++, name: `Person ${p.length + 1}`, amount: "" }]);
    setPeople(p => p + 1);
  }

  function removePerson(id: number) {
    setPersons(p => p.filter(x => x.id !== id));
    setPeople(p => Math.max(1, p - 1));
  }

  function updatePerson(id: number, field: "name" | "amount", val: string) {
    setPersons(p => p.map(x => x.id === id ? { ...x, [field]: val } : x));
  }

  const tipLabel = effectiveTip === 0 ? "No tip" :
    effectiveTip <= 12 ? "Below average" :
    effectiveTip <= 17 ? "Standard" :
    effectiveTip <= 22 ? "Good" : "Generous";

  const tipColor = effectiveTip === 0 ? "text-gray-400" :
    effectiveTip <= 12 ? "text-yellow-400" :
    effectiveTip <= 17 ? "text-white" :
    effectiveTip <= 22 ? "text-green-400" : "text-[#6C3AFF]";

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span>›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span>›</span>
          <span className="text-gray-400">Tip Calculator</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">Finance Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free Tip Calculator — Split Bill &amp; Per Person Amount
          </h1>
          <p className="text-gray-400 max-w-2xl">Calculate the perfect tip and split a bill between any number of people. Supports custom tip %, tax, uneven splits, and rounding — for any service type.</p>
        </div>

        {/* Service presets */}
        <div className="mb-5">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Service Type</p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {SERVICE_PRESETS.map((s, i) => (
              <button key={s.label} onClick={() => applyPreset(i)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl text-xs transition-all border ${
                  activePreset === i ? "bg-[#6C3AFF] border-transparent text-white" : "bg-[#13131F] border-white/5 text-gray-400 hover:text-white"
                }`}>
                <span className="text-lg">{s.icon}</span>
                <span>{s.label}</span>
                <span className="text-xs opacity-70">{s.tip > 0 ? `${s.tip}%` : "—"}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left */}
          <div className="space-y-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Bill Amount</label>
                <div className="flex">
                  <span className="px-3 py-2.5 bg-[#0A0A14] border border-r-0 border-white/10 rounded-l-xl text-gray-400 text-sm">$</span>
                  <input value={bill} onChange={e => setBill(e.target.value)} type="number" step="0.01" min="0"
                    className="flex-1 px-4 py-2.5 bg-[#0A0A14] border border-white/10 text-white text-xl font-bold focus:outline-none focus:border-[#6C3AFF]/60 rounded-r-xl transition-all" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-400">Tip Percentage</label>
                  <span className={`text-sm font-bold ${tipColor}`}>{effectiveTip}% — {tipLabel}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {QUICK_TIPS.map(t => (
                    <button key={t} onClick={() => { setTipPct(t); setCustomTip(""); }}
                      className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all border ${
                        customTip === "" && tipPct === t ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"
                      }`}>
                      {t}%
                    </button>
                  ))}
                </div>
                <div className="flex">
                  <input value={customTip} onChange={e => setCustomTip(e.target.value)}
                    placeholder="Custom %" type="number" min="0"
                    className="flex-1 px-4 py-2.5 bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 rounded-l-xl transition-all" />
                  <span className="px-3 py-2.5 bg-[#0A0A14] border border-l-0 border-white/10 rounded-r-xl text-gray-400 text-sm">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Tax Rate</label>
                <div className="flex">
                  <input value={tax} onChange={e => setTax(e.target.value)} type="number" step="0.1" min="0"
                    className="flex-1 px-4 py-2.5 bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 rounded-l-xl transition-all" />
                  <span className="px-3 py-2.5 bg-[#0A0A14] border border-l-0 border-white/10 rounded-r-xl text-gray-400 text-sm">%</span>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2 pt-1 border-t border-white/5">
                {[
                  { label: "Tip on pre-tax amount", state: tipOnPreTax, setter: setTipOnPreTax },
                  { label: "Round up per person",   state: roundUp,     setter: setRoundUp },
                ].map(opt => (
                  <div key={opt.label} className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{opt.label}</span>
                    <button onClick={() => opt.setter(p => !p)}
                      className={`w-9 h-5 rounded-full transition-all relative ${opt.state ? "bg-[#6C3AFF]" : "bg-gray-700"}`}>
                      <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${opt.state ? "left-[18px]" : "left-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Split mode */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-4">
              <div className="flex gap-2">
                {(["equal","individual"] as const).map(m => (
                  <button key={m} onClick={() => setSplitMode(m)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border capitalize ${
                      splitMode===m ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"
                    }`}>
                    {m === "equal" ? "Split Evenly" : "Itemized Split"}
                  </button>
                ))}
              </div>

              {splitMode === "equal" ? (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Number of People</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setPeople(p => Math.max(1, p - 1))}
                      className="w-9 h-9 rounded-xl bg-[#0A0A14] border border-white/10 text-white font-bold hover:border-[#6C3AFF]/50 transition-all">−</button>
                    <span className="text-2xl font-extrabold text-white w-10 text-center">{people}</span>
                    <button onClick={() => setPeople(p => p + 1)}
                      className="w-9 h-9 rounded-xl bg-[#0A0A14] border border-white/10 text-white font-bold hover:border-[#6C3AFF]/50 transition-all">+</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {persons.map(p => (
                    <div key={p.id} className="flex gap-2 items-center">
                      <input value={p.name} onChange={e => updatePerson(p.id, "name", e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-xs focus:outline-none focus:border-[#6C3AFF]/60" />
                      <div className="flex">
                        <span className="px-2 py-2 bg-[#0A0A14] border border-r-0 border-white/10 rounded-l-xl text-gray-400 text-xs">$</span>
                        <input value={p.amount} onChange={e => updatePerson(p.id, "amount", e.target.value)} type="number" min="0"
                          placeholder="0.00"
                          className="w-20 px-2 py-2 bg-[#0A0A14] border border-white/10 text-white text-xs focus:outline-none focus:border-[#6C3AFF]/60 rounded-r-xl" />
                      </div>
                      {persons.length > 1 && (
                        <button onClick={() => removePerson(p.id)} className="text-gray-600 hover:text-[#FF3A6C] transition-colors text-sm">×</button>
                      )}
                    </div>
                  ))}
                  <button onClick={addPerson} className="text-xs text-[#6C3AFF] hover:text-white transition-colors">+ Add person</button>
                </div>
              )}
            </div>
          </div>

          {/* Right — Results */}
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/30 rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-white">Bill Summary</h3>
              {[
                { label: "Bill",          value: fmt(calc.billAmt) },
                { label: `Tax (${tax}%)`, value: fmt(calc.taxAmt) },
                { label: `Tip (${effectiveTip}%)`, value: fmt(calc.tipAmt), bold: true },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-gray-400">{row.label}</span>
                  <span className={row.bold ? "text-green-400 font-bold" : "text-white"}>{row.value}</span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="font-bold text-white">Total</span>
                <span className="font-extrabold text-2xl text-[#6C3AFF]">{fmt(calc.grandTotal)}</span>
              </div>
            </div>

            {/* Per person */}
            {splitMode === "equal" ? (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 text-center">
                <div className="text-xs text-gray-500 mb-2">Per Person ({people} people)</div>
                <div className="text-4xl font-extrabold text-white mb-1">{fmt(calc.perPerson)}</div>
                {roundUp && <div className="text-sm text-green-400">Rounded up: {fmt(calc.rounded)}</div>}
                <div className="text-xs text-gray-600 mt-3">Including {fmt(calc.taxAmt / people)} tax + {fmt(calc.tipAmt / people)} tip</div>
              </div>
            ) : (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-white text-sm">Per Person Breakdown</h3>
                {calc.persons.map(p => (
                  <div key={p.id} className="bg-[#0A0A14] rounded-xl p-3">
                    <div className="flex justify-between mb-1.5">
                      <span className="font-semibold text-white text-sm">{p.name}</span>
                      <span className="font-extrabold text-[#6C3AFF]">{fmt(roundUp ? p.rounded : p.total)}</span>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>Food {fmt(+p.amount || 0)}</span>
                      <span>+ Tax {fmt(p.tax)}</span>
                      <span>+ Tip {fmt(p.tip)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Use the Tip Calculator</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Choose service type", desc:"Select the type of service from the presets — restaurant, delivery, taxi or others. This sets the suggested tip percentage automatically." },
              { step:"2", title:"Enter bill & adjust tip", desc:"Enter your bill total. Use the quick tip buttons or enter a custom percentage. The tip rating label shows whether your tip is standard, good or generous." },
              { step:"3", title:"Set split mode", desc:"Choose even split and enter the number of people, or switch to itemized split to enter what each person ordered individually." },
              { step:"4", title:"Round up for easy payment", desc:"Toggle round-up to get the nearest dollar per person — much easier when paying in cash. The total and rounded amounts are shown side by side." },
            ].map(s => (
              <div key={s.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#6C3AFF] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">{s.step}</div>
                <div><div className="font-semibold text-white text-sm mb-1">{s.title}</div><div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div></div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{f.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 mt-16 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/about" className="hover:text-gray-400">About</Link>
          <Link href="/privacy" className="hover:text-gray-400">Privacy</Link>
          <Link href="/contact" className="hover:text-gray-400">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2025 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
