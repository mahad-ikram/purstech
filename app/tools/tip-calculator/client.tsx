"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ Rule 3

// ✅ Rule 10: module scope — all .map() calls below match
const FAQ = [
  { q:"How do I calculate a tip?",
    a:"Multiply the bill by the tip percentage — for example, a 20% tip on a $50 bill is $10 (50 × 0.20). Or skip the math entirely: enter the bill amount, tap a quick-tip button (10–30%) or type a custom percentage, and the tip, total and per-person split appear instantly." },
  { q:"What is the average tip percentage?",
    a:"In the US, 15–20% is standard at restaurants (18–20% for good service), around 10–15% for delivery and taxis, 15–20% for salons and bars, and $1–2 per drink at coffee shops. The 8 service-type presets apply these ranges for you — a built-in tip chart." },
  { q:"How much should I tip at a restaurant?",
    a:"Standard tipping etiquette in the US: 15% for adequate service, 18% for good service, 20% for excellent service, and 25%+ for exceptional service. Quick-service counters where you order at a register: 10–15% or nothing is acceptable. Fine dining: 20% minimum is expected. The tip is traditionally calculated on the pre-tax amount, though many people tip on the full total — either is acceptable." },
  { q:"Should I tip on the pre-tax or post-tax amount?",
    a:"Etiquette traditionally says tip on the pre-tax amount. However, in practice, the difference is small (tipping on a $100 meal vs $108 after tax) and most diners simply tip on the full post-tax total for convenience. Our calculator lets you choose which amount you tip on using the toggle." },
  { q:"How do I split a bill unevenly when people ordered different amounts?",
    a:"Use Itemized Split mode — toggle to individual amounts and enter what each person ordered. The tip and tax percentages are then applied proportionally to each person's share, giving everyone their accurate total. This is fairer than splitting evenly when there's a big difference in what people ordered." },
  { q:"What are tip amounts for services other than restaurants?",
    a:"Taxi/rideshare: 15–20%. Hotel housekeeping: $2–5/night. Hotel concierge: $5–10 for special requests. Hair salon/barber: 15–20%. Food delivery: $3–5 or 10–15%. Furniture delivery: $5–20 per person. Coffee shop counter: not required, $1 is appreciated. Movers: $20–50 per person for a full day." },
  { q:"What does 'round up per person' mean?",
    a:"Rounding up rounds each person's share up to the nearest dollar, making it easier to collect cash payments. For example, if each person owes $23.47, rounding up means everyone pays $24. The calculator shows both the exact amount and the rounded amount so you can choose which to use." },
];

const SERVICE_PRESETS = [
  { icon:"🍽",  label:"Restaurant",   tip:18 },
  { icon:"🍕",  label:"Delivery",     tip:15 },
  { icon:"🚕",  label:"Taxi/Ride",    tip:15 },
  { icon:"✂️",  label:"Salon/Barber", tip:20 },
  { icon:"🏨",  label:"Hotel",        tip:0  },
  { icon:"🍸",  label:"Bar",          tip:18 },
  { icon:"☕",  label:"Coffee",       tip:10 },
  { icon:"📦",  label:"Movers",       tip:0  },
];

const QUICK_TIPS = [10, 15, 18, 20, 25, 30];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style:"currency", currency:"USD" }).format(n);

interface Person { id:number; name:string; amount:string; }
let pid = 1;

export default function TipCalculatorClient({ children }: { children?: React.ReactNode }) {
  useTrackTool("tip-calculator", "finance"); // ✅ Rule 3

  const [bill,         setBill]         = useState("85.00");
  const [tipPct,       setTipPct]       = useState(18);
  const [customTip,    setCustomTip]    = useState("");
  const [tax,          setTax]          = useState("8.5");
  const [people,       setPeople]       = useState(2);
  const [splitMode,    setSplitMode]    = useState<"equal"|"individual">("equal");
  const [persons,      setPersons]      = useState<Person[]>([
    { id:pid++, name:"Person 1", amount:"" },
    { id:pid++, name:"Person 2", amount:"" },
  ]);
  const [roundUp,      setRoundUp]      = useState(false);
  const [tipOnPreTax,  setTipOnPreTax]  = useState(true);
  const [activePreset, setActivePreset] = useState(1);
  const [copied,       setCopied]       = useState(false);

  const effectiveTip = customTip !== "" ? +customTip : tipPct;

  const calc = useMemo(() => {
    const billAmt     = +bill;
    const taxAmt      = billAmt * (+tax / 100);
    const totalPreTax = billAmt;
    const totalPostTax = billAmt + taxAmt;
    const tipBase     = tipOnPreTax ? totalPreTax : totalPostTax;
    const tipAmt      = tipBase * (effectiveTip / 100);
    const grandTotal  = totalPostTax + tipAmt;

    if (splitMode === "equal") {
      const perPerson = grandTotal / people;
      const rounded   = Math.ceil(perPerson);
      return { billAmt, taxAmt, tipAmt, grandTotal, perPerson, rounded, persons:[] };
    } else {
      const total = persons.reduce((s,p) => s + (+p.amount || 0), 0);
      const personCalc = persons.map(p => {
        const share = total > 0 ? (+p.amount || 0) / total : 1 / persons.length;
        const pTax   = taxAmt * share;
        const pTip   = tipAmt * share;
        const pTotal = (+p.amount || 0) + pTax + pTip;
        return { ...p, share, tax:pTax, tip:pTip, total:pTotal, rounded:Math.ceil(pTotal) };
      });
      return { billAmt, taxAmt, tipAmt, grandTotal, perPerson:grandTotal / persons.length, rounded:0, persons:personCalc };
    }
  }, [bill, tax, effectiveTip, people, splitMode, persons, tipOnPreTax]);

  function applyPreset(idx: number) {
    setActivePreset(idx);
    setTipPct(SERVICE_PRESETS[idx].tip);
    setCustomTip("");
  }

  function addPerson() {
    setPersons(p => [...p, { id:pid++, name:`Person ${p.length + 1}`, amount:"" }]);
    setPeople(p => p + 1);
  }
  function removePerson(id: number) {
    setPersons(p => p.filter(x => x.id !== id));
    setPeople(p => Math.max(1, p - 1));
  }
  function updatePerson(id: number, field: "name"|"amount", val: string) {
    setPersons(p => p.map(x => x.id === id ? { ...x, [field]:val } : x));
  }

  // ✅ UI Enhancement: Copy Summary to clipboard for group messaging
  function copySummary() {
    const lines = [
      `Bill: ${fmt(calc.billAmt)}`,
      `Tax (${tax}%): ${fmt(calc.taxAmt)}`,
      `Tip (${effectiveTip}%): ${fmt(calc.tipAmt)}`,
      `Total: ${fmt(calc.grandTotal)}`,
    ];
    if (splitMode === "equal") {
      lines.push(`Per person (${people}): ${fmt(calc.perPerson)}`);
      if (roundUp) lines.push(`Rounded up per person: ${fmt(calc.rounded)}`);
    } else {
      calc.persons.forEach(p => {
        lines.push(`${p.name}: ${fmt(roundUp ? p.rounded : p.total)}`);
      });
    }
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    // ✅ Rule 6: flex flex-col overflow-x-hidden
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col overflow-x-hidden">

      {/* ── Navbar ── ✅ Rule 4: sticky + backdrop-blur + Go Pro */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
            <Link href="/pro" className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">Go Pro ⚡</Link>
          </div>
        </div>
      </nav>

      {/* ✅ Rule 7: flex-grow w-full */}
      <main className="max-w-4xl mx-auto px-4 py-10 flex-grow w-full">

        {/* ✅ Rule 11: aria-label + /categories/finance + aria-hidden */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/finance" className="hover:text-gray-400">Finance Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">Tip Calculator</span>
        </nav>

        {/* ✅ Render Hero Component from page.tsx */}
        {children}

        {/* Service presets */}
        <div className="mb-6 min-w-0 w-full">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Service Type</p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 min-w-0">
            {SERVICE_PRESETS.map((s, i) => (
              <button key={s.label} onClick={() => applyPreset(i)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl text-xs transition-all border min-w-0 ${
                  activePreset===i ? "bg-[#6C3AFF] border-transparent text-white" : "bg-[#13131F] border-white/5 text-gray-400 hover:text-white"
                }`}>
                <span className="text-lg">{s.icon}</span>
                <span className="truncate w-full text-center px-1">{s.label}</span>
                <span className="text-xs opacity-70">{s.tip > 0 ? `${s.tip}%` : "—"}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ✅ Rule 9: min-w-0 w-full on parent grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0 w-full">

          {/* Left — Inputs */}
          <div className="min-w-0 space-y-4 w-full">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-4 min-w-0 w-full">

              {/* Bill amount */}
              <div className="min-w-0 w-full">
                <label className="block text-xs font-semibold text-gray-400 mb-1">Bill Amount</label>
                <div className="flex min-w-0">
                  <span className="px-3 py-2.5 bg-[#0A0A14] border border-r-0 border-white/10 rounded-l-xl text-gray-400 text-sm flex-shrink-0">$</span>
                  <input value={bill} onChange={e => setBill(e.target.value)} type="number" step="0.01" min="0"
                    className="flex-1 min-w-0 px-4 py-2.5 bg-[#0A0A14] border border-white/10 text-white text-xl font-bold focus:outline-none focus:border-[#6C3AFF]/60 rounded-r-xl transition-all" />
                </div>
              </div>

              {/* Tip percentage */}
              <div className="min-w-0 w-full">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-400">Tip Percentage</label>
                  <span className={`text-sm font-bold truncate ml-2 ${tipColor}`}>{effectiveTip}% — {tipLabel}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2 min-w-0">
                  {QUICK_TIPS.map(t => (
                    <button key={t} onClick={() => { setTipPct(t); setCustomTip(""); }}
                      className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all border ${
                        customTip==="" && tipPct===t ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"
                      }`}>
                      {t}%
                    </button>
                  ))}
                </div>
                <div className="flex min-w-0">
                  <input value={customTip} onChange={e => setCustomTip(e.target.value)}
                    placeholder="Custom %" type="number" min="0"
                    className="flex-1 min-w-0 px-4 py-2.5 bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 rounded-l-xl transition-all" />
                  <span className="px-3 py-2.5 bg-[#0A0A14] border border-l-0 border-white/10 rounded-r-xl text-gray-400 text-sm flex-shrink-0">%</span>
                </div>
              </div>

              {/* Tax rate */}
              <div className="min-w-0 w-full">
                <label className="block text-xs font-semibold text-gray-400 mb-1">Tax Rate</label>
                <div className="flex min-w-0">
                  <input value={tax} onChange={e => setTax(e.target.value)} type="number" step="0.1" min="0"
                    className="flex-1 min-w-0 px-4 py-2.5 bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 rounded-l-xl transition-all" />
                  <span className="px-3 py-2.5 bg-[#0A0A14] border border-l-0 border-white/10 rounded-r-xl text-gray-400 text-sm flex-shrink-0">%</span>
                </div>
              </div>

              {/* Options toggles */}
              <div className="space-y-2 pt-1 border-t border-white/5 min-w-0 w-full">
                {[
                  { label:"Tip on pre-tax amount", state:tipOnPreTax, setter:setTipOnPreTax },
                  { label:"Round up per person",   state:roundUp,     setter:setRoundUp    },
                ].map(opt => (
                  <div key={opt.label} className="flex items-center justify-between min-w-0">
                    <span className="text-xs text-gray-400 truncate pr-2">{opt.label}</span>
                    <button onClick={() => opt.setter(p => !p)} role="switch" aria-checked={opt.state}
                      className={`w-9 h-5 rounded-full transition-all relative flex-shrink-0 ${opt.state ? "bg-[#6C3AFF]" : "bg-gray-700"}`}>
                      <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${opt.state ? "left-[18px]" : "left-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Split mode */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-4 min-w-0 w-full">
              <div className="flex gap-2 min-w-0">
                {(["equal","individual"] as const).map(m => (
                  <button key={m} onClick={() => setSplitMode(m)}
                    className={`flex-1 min-w-0 py-2 rounded-xl text-xs font-bold transition-all border capitalize ${
                      splitMode===m ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"
                    }`}>
                    {m === "equal" ? "Split Evenly" : "Itemized Split"}
                  </button>
                ))}
              </div>

              {splitMode === "equal" ? (
                <div className="min-w-0 w-full">
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Number of People</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setPeople(p => Math.max(1, p-1))}
                      className="w-9 h-9 rounded-xl bg-[#0A0A14] border border-white/10 text-white font-bold hover:border-[#6C3AFF]/50 transition-all flex-shrink-0">−</button>
                    <span className="text-2xl font-extrabold text-white w-10 text-center">{people}</span>
                    <button onClick={() => setPeople(p => p+1)}
                      className="w-9 h-9 rounded-xl bg-[#0A0A14] border border-white/10 text-white font-bold hover:border-[#6C3AFF]/50 transition-all flex-shrink-0">+</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 min-w-0 w-full">
                  {persons.map(p => (
                    <div key={p.id} className="flex gap-2 items-center min-w-0">
                      {/* ✅ Rule 9 ext: min-w-0 on flex-1 name input container */}
                      <input value={p.name} onChange={e => updatePerson(p.id, "name", e.target.value)}
                        className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-xs focus:outline-none focus:border-[#6C3AFF]/60" />
                      <div className="flex flex-shrink-0">
                        <span className="px-2 py-2 bg-[#0A0A14] border border-r-0 border-white/10 rounded-l-xl text-gray-400 text-xs">$</span>
                        <input value={p.amount} onChange={e => updatePerson(p.id, "amount", e.target.value)}
                          type="number" min="0" placeholder="0.00"
                          className="w-20 px-2 py-2 bg-[#0A0A14] border border-white/10 text-white text-xs focus:outline-none focus:border-[#6C3AFF]/60 rounded-r-xl" />
                      </div>
                      {persons.length > 1 && (
                        <button onClick={() => removePerson(p.id)} className="text-gray-600 hover:text-[#FF3A6C] transition-colors text-sm flex-shrink-0">×</button>
                      )}
                    </div>
                  ))}
                  <button onClick={addPerson} className="text-xs text-[#6C3AFF] hover:text-white transition-colors">+ Add person</button>
                </div>
              )}
            </div>
          </div>

          {/* Right — Results ✅ Rule 9: min-w-0 */}
          <div className="min-w-0 space-y-4 w-full">

            {/* Bill summary card */}
            <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/30 rounded-2xl p-5 space-y-3 min-w-0 w-full">
              <div className="flex items-center justify-between min-w-0">
                <h3 className="font-bold text-white truncate pr-2">Bill Summary</h3>
                <button onClick={copySummary}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
                    copied ? "bg-green-600 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                  }`}>
                  {copied ? "✓ Copied!" : "📋 Copy"}
                </button>
              </div>
              {[
                { label:"Bill",                    value:fmt(calc.billAmt)   },
                { label:`Tax (${tax}%)`,            value:fmt(calc.taxAmt)    },
                { label:`Tip (${effectiveTip}%)`,  value:fmt(calc.tipAmt), bold:true },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-sm min-w-0">
                  <span className="text-gray-400 truncate pr-2">{row.label}</span>
                  <span className={`flex-shrink-0 ${row.bold ? "text-green-400 font-bold" : "text-white"}`}>{row.value}</span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-3 flex justify-between min-w-0">
                <span className="font-bold text-white">Total</span>
                <span className="font-extrabold text-2xl text-[#6C3AFF] truncate pl-2">{fmt(calc.grandTotal)}</span>
              </div>
            </div>

            {/* Per person */}
            {splitMode === "equal" ? (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 text-center min-w-0 w-full">
                <div className="text-xs text-gray-500 mb-2 truncate">Per Person ({people} {people === 1 ? "person" : "people"})</div>
                <div className="text-4xl font-extrabold text-white mb-1 truncate">{fmt(calc.perPerson)}</div>
                {roundUp && <div className="text-sm text-green-400 mb-1 truncate">Rounded up: <span className="font-bold">{fmt(calc.rounded)}</span></div>}
                <div className="text-xs text-gray-600 mt-2 truncate">Including {fmt(calc.taxAmt/people)} tax + {fmt(calc.tipAmt/people)} tip each</div>
              </div>
            ) : (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-3 min-w-0 w-full">
                <h3 className="font-bold text-white text-sm">Per Person Breakdown</h3>
                {calc.persons.map(p => (
                  <div key={p.id} className="bg-[#0A0A14] rounded-xl p-3 min-w-0">
                    <div className="flex justify-between mb-1.5 min-w-0">
                      <span className="font-semibold text-white text-sm truncate min-w-0 pr-2">{p.name}</span>
                      <span className="font-extrabold text-[#6C3AFF] flex-shrink-0">{fmt(roundUp ? p.rounded : p.total)}</span>
                    </div>
                    <div className="flex gap-3 text-xs text-gray-500 flex-wrap min-w-0">
                      <span className="truncate">Food {fmt(+p.amount || 0)}</span>
                      <span className="truncate">+ Tax {fmt(p.tax)}</span>
                      <span className="truncate">+ Tip {fmt(p.tip)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-16 bg-[#13131F] border border-white/5 rounded-2xl p-6 min-w-0 w-full">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Use the Tip Calculator</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 min-w-0">
            {[
              { step:"1", title:"Choose service type", desc:"Select the type of service from the presets — restaurant, delivery, taxi or others. This sets the suggested tip percentage automatically." },
              { step:"2", title:"Enter bill & adjust tip", desc:"Enter your bill total. Use the quick tip buttons or enter a custom percentage. The tip rating label shows whether your tip is standard, good or generous." },
              { step:"3", title:"Set split mode", desc:"Choose even split and enter the number of people, or switch to itemized split to enter what each person ordered individually." },
              { step:"4", title:"Copy & share", desc:"Toggle round-up for easier cash payments, then hit Copy to share exact amounts with your group via message." },
            ].map(s => (
              <div key={s.step} className="flex gap-3 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#6C3AFF] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">{s.step}</div>
                <div className="min-w-0">
                  <div className="font-semibold text-white text-sm mb-1 truncate">{s.title}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ — ✅ Rule 8: <details>/<summary> */}
        <div className="mt-10 max-w-3xl min-w-0 w-full">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3 min-w-0">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all min-w-0">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none min-w-0">
                  <span className="min-w-0 pr-4">{f.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </main>

      {/* ✅ Rule 5: Privacy/Terms/Contact + © 2026 */}
      <footer className="border-t border-white/5 mt-16 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
