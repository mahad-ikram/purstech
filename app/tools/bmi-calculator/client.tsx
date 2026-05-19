"use client";

import { useState } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; 

const RELATED_TOOLS = [
  { icon:"🎂", name:"Age Calculator",       slug:"age-calculator"        },
  { icon:"🔢", name:"Percentage Calculator", slug:"percentage-calculator" },
  { icon:"📏", name:"Unit Converter",        slug:"unit-converter"        },
  { icon:"💱", name:"Currency Converter",    slug:"currency-converter"    },
  { icon:"🏦", name:"Loan Calculator",       slug:"loan-calculator"       },
];

const FAQ = [
  { q:"What is BMI?",                a:"Body Mass Index (BMI) is a simple calculation using height and weight to estimate body fat levels. It's used as a screening tool to identify potential weight-related health issues." },
  { q:"What is a healthy BMI range?",a:"For most adults, a BMI between 18.5 and 24.9 is considered healthy. Below 18.5 is underweight, 25–29.9 is overweight, and 30 or above is considered obese." },
  { q:"Is BMI accurate?",            a:"BMI is a useful general screening tool but has limitations. It doesn't account for muscle mass, bone density, age, sex or ethnicity. Athletes with high muscle mass may have a high BMI without excess fat." },
  { q:"How is BMI calculated?",      a:"BMI = weight (kg) ÷ height (m)². In imperial units: BMI = (weight in lbs × 703) ÷ height in inches². Our tool handles both automatically." },
  { q:"What is the BMI Prime?",      a:"BMI Prime is your BMI divided by 25 (the upper limit of healthy BMI). A value below 1 is healthy, above 1 is overweight. It makes it easy to see how far from healthy your BMI is." },
];

const BMI_CATEGORIES = [
  { label:"Severely Underweight", min:0,    max:16,   color:"bg-blue-500",   text:"text-blue-400",   ring:"ring-blue-500/30"   },
  { label:"Underweight",          min:16,   max:18.5, color:"bg-cyan-500",   text:"text-cyan-400",   ring:"ring-cyan-500/30"   },
  { label:"Healthy Weight",       min:18.5, max:25,   color:"bg-green-500",  text:"text-green-400",  ring:"ring-green-500/30"  },
  { label:"Overweight",           min:25,   max:30,   color:"bg-yellow-500", text:"text-yellow-400", ring:"ring-yellow-500/30" },
  { label:"Obese Class I",        min:30,   max:35,   color:"bg-orange-500", text:"text-orange-400", ring:"ring-orange-500/30" },
  { label:"Obese Class II",       min:35,   max:40,   color:"bg-red-500",    text:"text-red-400",    ring:"ring-red-500/30"    },
  { label:"Obese Class III",      min:40,   max:100,  color:"bg-red-700",    text:"text-red-300",    ring:"ring-red-700/30"    },
];

function getCategory(bmi: number) {
  return BMI_CATEGORIES.find(c => bmi >= c.min && bmi < c.max) || BMI_CATEGORIES[BMI_CATEGORIES.length - 1];
}

function calcBMI(weight: number, height: number, unit: "metric"|"imperial", heightFt: number, heightIn: number) {
  let bmi: number, weightKg: number, heightM: number;
  if (unit === "metric") {
    weightKg = weight; heightM = height / 100; bmi = weightKg / (heightM * heightM);
  } else {
    const totalIn = heightFt * 12 + heightIn;
    bmi = (weight * 703) / (totalIn * totalIn);
    weightKg = weight * 0.453592; heightM = totalIn * 0.0254;
  }
  const bmiPrime     = bmi / 25;
  const healthyMinKg = 18.5 * heightM * heightM;
  const healthyMaxKg = 24.9 * heightM * heightM;
  return { bmi, bmiPrime, healthyMinKg, healthyMaxKg, healthyMinLb: healthyMinKg * 2.20462, healthyMaxLb: healthyMaxKg * 2.20462 };
}

export default function BMIClient() {
  // ✅ Track usage in Supabase → admin dashboard
  useTrackTool("bmi-calculator", "finance");

  const [unit,     setUnit]     = useState<"metric"|"imperial">("metric");
  const [weight,   setWeight]   = useState("");
  const [height,   setHeight]   = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [result,   setResult]   = useState<ReturnType<typeof calcBMI> | null>(null);
  const [error,    setError]    = useState("");

  const handleCalc = () => {
    const w = parseFloat(weight), h = parseFloat(height);
    const ft = parseFloat(heightFt) || 0, ins = parseFloat(heightIn) || 0;
    if (!w || w <= 0) { setError("Please enter a valid weight."); return; }
    if (unit === "metric" && (!h || h <= 0)) { setError("Please enter a valid height in cm."); return; }
    if (unit === "imperial" && ft <= 0 && ins <= 0) { setError("Please enter a valid height."); return; }
    setError("");
    setResult(calcBMI(w, h, unit, ft, ins));
  };

  const category = result ? getCategory(result.bmi) : null;
  // Gauge: map BMI 10–50 to 0–100%
  const bmiPct = result ? Math.min(98, Math.max(2, ((result.bmi - 10) / 40) * 100)) : 0;

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col">

      {/* ✅ QA FIX: Consistent Full Navbar */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/tools"   className="text-sm text-gray-500 hover:text-white transition-colors">Tools</Link>
            <Link href="/blog"    className="text-sm text-gray-500 hover:text-white transition-colors">Blog</Link>
            <Link href="/about"   className="text-sm text-gray-500 hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:text-white transition-colors">Contact</Link>
            <Link href="/pro"     className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">Go Pro ⚡</Link>
          </div>
          {/* Mobile Fallback */}
          <Link href="/" className="sm:hidden text-sm text-gray-500 hover:text-white transition-colors">← Home</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10 flex-grow">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/finance" className="hover:text-gray-400">Finance Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">BMI Calculator</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">⚖️</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">BMI Calculator</h1>
              <p className="text-gray-500 mt-1">Calculate your Body Mass Index and find your healthy weight range — metric or imperial.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Free","No Login","Metric & Imperial","Healthy Range","BMI Prime"].map(b => (
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium">✓ {b}</span>
            ))}
          </div>
        </div>

        {/* 3-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Input card */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 flex flex-col gap-5">

              {/* Unit toggle */}
              <div className="bg-[#0A0A14] rounded-2xl p-1 flex gap-1">
                {(["metric","imperial"] as const).map(u => (
                  <button key={u} onClick={() => { setUnit(u); setResult(null); setError(""); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      unit === u ? "bg-[#6C3AFF] text-white" : "text-gray-400 hover:text-white"
                    }`}>
                    {u === "metric" ? "🌍 Metric (kg / cm)" : "🇺🇸 Imperial (lb / ft)"}
                  </button>
                ))}
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-wider">
                    Weight ({unit === "metric" ? "kg" : "lbs"})
                  </label>
                  <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
                    placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
                    className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-wider">
                    Height ({unit === "metric" ? "cm" : "ft / in"})
                  </label>
                  {unit === "metric" ? (
                    <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 175"
                      className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm" />
                  ) : (
                    <div className="flex gap-2">
                      <input type="number" value={heightFt} onChange={e => setHeightFt(e.target.value)} placeholder="ft"
                        className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm" />
                      <input type="number" value={heightIn} onChange={e => setHeightIn(e.target.value)} placeholder="in"
                        className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm" />
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
              )}

              <button onClick={handleCalc}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] hover:opacity-90 text-white font-extrabold text-lg transition-all shadow-xl shadow-violet-900/30">
                ⚖️ Calculate BMI
              </button>
            </div>

            {/* ── RESULTS ── */}
            {result && category && (
              <div className="flex flex-col gap-4">

                {/* ── UI ENHANCEMENT 1: BMI score uses category colour ── */}
                <div className={`bg-[#13131F] border rounded-2xl p-6 text-center ${category.ring} ring-1`}>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Your BMI</div>
                  {/* Dynamic colour */}
                  <div className={`text-7xl font-extrabold mb-3 transition-colors ${category.text}`}>
                    {result.bmi.toFixed(1)}
                  </div>
                  <span className={`text-sm font-extrabold px-5 py-2 rounded-full ${category.color.replace('bg-', 'bg-').replace('500', '500/20')} ${category.text} border border-current/30`}>
                    {category.label}
                  </span>
                </div>

                {/* ── UI ENHANCEMENT 2: Gauge with BMI value label on marker ── */}
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-4">BMI Scale</div>
                  {/* Label floats above marker */}
                  <div className="relative mb-1" style={{ paddingTop: "28px" }}>
                    <div
                      className="absolute -top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none"
                      style={{ left: `${bmiPct}%` }}
                    >
                      <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${category.color.replace('bg-', 'bg-').replace('500', '500/90')} text-white whitespace-nowrap shadow`}>
                        {result.bmi.toFixed(1)}
                      </span>
                      <span className="w-0.5 h-2 bg-white/60 block mt-0.5" />
                    </div>
                    {/* Coloured zone strip */}
                    <div className="relative h-4 rounded-full overflow-hidden flex">
                      {["bg-blue-500","bg-cyan-500","bg-green-500","bg-yellow-500","bg-orange-500","bg-red-500"].map((c, i) => (
                        <div key={i} className={`${c} flex-1`} />
                      ))}
                      {/* Marker line */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg rounded-full"
                        style={{ left: `${bmiPct}%`, transform: "translateX(-50%)" }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                    <span>10</span><span>16</span><span>18.5</span><span>25</span><span>30</span><span>35</span><span>40+</span>
                  </div>

                  {/* ── UI ENHANCEMENT 3: BMI Prime visual bar ── */}
                  <div className="mt-5 pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-gray-500 font-medium">BMI Prime</span>
                      <span className={`font-extrabold ${result.bmiPrime <= 1 ? "text-green-400" : "text-orange-400"}`}>
                        {result.bmiPrime.toFixed(2)}{" "}
                        <span className="font-normal opacity-75">{result.bmiPrime <= 1 ? "✓ Healthy range" : "↑ Above healthy"}</span>
                      </span>
                    </div>
                    <div className="relative h-2 bg-[#0A0A14] rounded-full overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full transition-all ${result.bmiPrime <= 1 ? "bg-green-500" : "bg-orange-500"}`}
                        style={{ width: `${Math.min(100, result.bmiPrime * 50)}%` }}
                      />
                      {/* 1.0 = healthy threshold marker */}
                      <div className="absolute top-0 bottom-0 w-px bg-white/40" style={{ left: "50%" }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                      <span>0</span>
                      <span className="text-green-400/60">1.0 = healthy limit</span>
                      <span>2.0</span>
                    </div>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label:"Healthy Min", value:`${result.healthyMinKg.toFixed(1)} kg`, sub:`${result.healthyMinLb.toFixed(0)} lb`, color:"text-green-400" },
                    { label:"Healthy Max", value:`${result.healthyMaxKg.toFixed(1)} kg`, sub:`${result.healthyMaxLb.toFixed(0)} lb`, color:"text-green-400" },
                    { label:"Category",    value:category.label, sub:"", color:category.text },
                  ].map(s => (
                    <div key={s.label} className="bg-[#13131F] border border-white/5 rounded-2xl p-4 text-center">
                      <div className={`text-base font-extrabold ${s.color}`}>{s.value}</div>
                      {s.sub && <div className="text-xs text-gray-600 mt-0.5">{s.sub}</div>}
                      <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* ── UI ENHANCEMENT 4: Health disclaimer ── */}
                <div className="flex items-start gap-3 bg-yellow-400/5 border border-yellow-400/15 rounded-xl px-4 py-3">
                  <span className="text-yellow-400 flex-shrink-0">⚕️</span>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    BMI is a screening tool, not a medical diagnosis. Consult a healthcare professional for personalised advice, especially if you have concerns about your weight or health.
                  </p>
                </div>
              </div>
            )}

            {/* BMI categories table */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5">
                <h3 className="text-sm font-bold text-white">BMI Categories Reference</h3>
              </div>
              {BMI_CATEGORIES.map(cat => {
                const isActive = result && result.bmi >= cat.min && result.bmi < cat.max;
                return (
                  <div key={cat.label}
                    className={`flex items-center justify-between px-5 py-3 border-b border-white/5 last:border-0 transition-colors ${isActive ? "bg-white/[0.04]" : ""}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${cat.color}`} />
                      <span className={`text-sm ${isActive ? cat.text + " font-semibold" : "text-white"}`}>{cat.label}</span>
                      {isActive && (
                        <span className="text-xs bg-[#6C3AFF]/20 text-[#6C3AFF] px-2 py-0.5 rounded-full font-semibold">← You</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 font-mono">{cat.min} – {cat.max === 100 ? "40+" : cat.max}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="flex flex-col gap-4">

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-3">⚠️ BMI Limitations</h3>
              <div className="space-y-2 text-xs text-gray-500">
                {[
                  "Does not measure body fat directly",
                  "Overestimates fat in muscular people",
                  "Underestimates fat in elderly people",
                  "Does not account for fat distribution",
                  "Different healthy ranges for children",
                ].map(l => (
                  <div key={l} className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5 flex-shrink-0">!</span><span>{l}</span>
                  </div>
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

            {/* ✅ Fixed: was <button> not <Link> */}
            <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold text-white text-sm mb-1">PursTech Pro</h3>
              <p className="text-gray-500 text-xs mb-4">Unlimited usage, zero ads, API access</p>
              <Link href="/pro"
                className="block w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all text-center">
                Get Pro — $7/mo
              </Link>
            </div>
          </div>
        </div>

        {/* ── How to Use ── */}
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">📖 How to Use the BMI Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step:"1", title:"Choose Your Units",    desc:"Select Metric (kg and cm) or Imperial (pounds and feet/inches) — whichever you're most comfortable with."                                                          },
              { step:"2", title:"Enter Height & Weight",desc:"Type in your current weight and height. Decimal values are supported for precise results. Imperial splits height into feet and inches."                             },
              { step:"3", title:"Get Your Results",     desc:"Click Calculate to see your BMI score, category, BMI Prime and healthy weight range. The gauge shows exactly where you sit on the full BMI scale." },
            ].map(s => (
              <div key={s.step} className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-[#6C3AFF]/20 border border-[#6C3AFF]/30 flex items-center justify-center text-[#6C3AFF] font-black text-lg mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ✅ QA FIX: FAQ uses HTML <details> for AdSense compliance */}
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{item.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </section>

      </main>

      {/* ✅ QA FIX: Consistent Full Footer */}
      <footer className="border-t border-white/5 mt-auto py-8 text-center bg-[#0A0A14]">
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
