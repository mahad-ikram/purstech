"use client";

import { useState } from "react";
import Link from "next/link";

const RELATED_TOOLS = [
  { icon: "🎂", name: "Age Calculator",        slug: "age-calculator"        },
  { icon: "🔢", name: "Percentage Calculator",  slug: "percentage-calculator" },
  { icon: "📏", name: "Unit Converter",         slug: "unit-converter"        },
  { icon: "💱", name: "Currency Converter",     slug: "currency-converter"    },
  { icon: "🏦", name: "Loan Calculator",        slug: "loan-calculator"       },
];

const FAQ = [
  { q: "What is BMI?", a: "Body Mass Index (BMI) is a simple calculation using height and weight to estimate body fat levels. It's used as a screening tool to identify potential weight-related health issues." },
  { q: "What is a healthy BMI range?", a: "For most adults, a BMI between 18.5 and 24.9 is considered healthy. Below 18.5 is underweight, 25–29.9 is overweight, and 30 or above is considered obese." },
  { q: "Is BMI accurate?", a: "BMI is a useful general screening tool but has limitations. It doesn't account for muscle mass, bone density, age, sex or ethnicity. Athletes with high muscle mass may have a high BMI without excess fat." },
  { q: "How is BMI calculated?", a: "BMI = weight (kg) ÷ height (m)². In imperial units: BMI = (weight in lbs × 703) ÷ height in inches². Our tool handles both automatically." },
  { q: "What is the BMI Prime?", a: "BMI Prime is your BMI divided by 25 (the upper limit of healthy BMI). A value below 1 is healthy, above 1 is overweight. It makes it easy to see how far from healthy your BMI is." },
];

const BMI_CATEGORIES = [
  { label: "Severely Underweight", min: 0,    max: 16,   color: "bg-blue-500",   text: "text-blue-400"   },
  { label: "Underweight",          min: 16,   max: 18.5, color: "bg-cyan-500",   text: "text-cyan-400"   },
  { label: "Healthy Weight",       min: 18.5, max: 25,   color: "bg-green-500",  text: "text-green-400"  },
  { label: "Overweight",           min: 25,   max: 30,   color: "bg-yellow-500", text: "text-yellow-400" },
  { label: "Obese Class I",        min: 30,   max: 35,   color: "bg-orange-500", text: "text-orange-400" },
  { label: "Obese Class II",       min: 35,   max: 40,   color: "bg-red-500",    text: "text-red-400"    },
  { label: "Obese Class III",      min: 40,   max: 100,  color: "bg-red-700",    text: "text-red-300"    },
];

function getCategory(bmi: number) {
  return BMI_CATEGORIES.find(c => bmi >= c.min && bmi < c.max) || BMI_CATEGORIES[BMI_CATEGORIES.length - 1];
}

function calcBMI(weight: number, height: number, unit: "metric" | "imperial", heightFt: number, heightIn: number) {
  let bmi: number;
  let weightKg: number;
  let heightM: number;

  if (unit === "metric") {
    weightKg = weight;
    heightM  = height / 100;
    bmi      = weightKg / (heightM * heightM);
  } else {
    const totalInches = heightFt * 12 + heightIn;
    bmi      = (weight * 703) / (totalInches * totalInches);
    weightKg = weight * 0.453592;
    heightM  = totalInches * 0.0254;
  }

  const bmiPrime        = bmi / 25;
  const healthyMinKg    = 18.5 * heightM * heightM;
  const healthyMaxKg    = 24.9 * heightM * heightM;
  const healthyMinLb    = healthyMinKg * 2.20462;
  const healthyMaxLb    = healthyMaxKg * 2.20462;

  return { bmi, bmiPrime, healthyMinKg, healthyMaxKg, healthyMinLb, healthyMaxLb };
}

export default function BMICalculatorPage() {
  const [unit,      setUnit]      = useState<"metric"|"imperial">("metric");
  const [weight,    setWeight]    = useState("");
  const [height,    setHeight]    = useState("");
  const [heightFt,  setHeightFt]  = useState("");
  const [heightIn,  setHeightIn]  = useState("");
  const [result,    setResult]    = useState<ReturnType<typeof calcBMI> | null>(null);
  const [error,     setError]     = useState("");
  const [openFaq,   setOpenFaq]   = useState<number | null>(null);

  const handleCalc = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const ft = parseFloat(heightFt) || 0;
    const inches = parseFloat(heightIn) || 0;

    if (!w || w <= 0) { setError("Please enter a valid weight."); return; }
    if (unit === "metric" && (!h || h <= 0)) { setError("Please enter a valid height in cm."); return; }
    if (unit === "imperial" && (ft <= 0 && inches <= 0)) { setError("Please enter a valid height."); return; }
    setError("");
    setResult(calcBMI(w, h, unit, ft, inches));
  };

  const category = result ? getCategory(result.bmi) : null;
  const bmiPct   = result ? Math.min(100, Math.max(0, ((result.bmi - 10) / 40) * 100)) : 0;

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
          <span className="text-gray-400">BMI Calculator</span>
        </nav>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 flex flex-col gap-5">

              {/* Unit toggle */}
              <div className="bg-[#0A0A14] rounded-2xl p-1 flex gap-1">
                {(["metric","imperial"] as const).map(u => (
                  <button key={u} onClick={() => { setUnit(u); setResult(null); setError(""); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                      unit === u ? "bg-[#6C3AFF] text-white" : "text-gray-400 hover:text-white"
                    }`}>{u === "metric" ? "🌍 Metric (kg / cm)" : "🇺🇸 Imperial (lb / ft)"}</button>
                ))}
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-wider">
                    Weight ({unit === "metric" ? "kg" : "lbs"})
                  </label>
                  <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
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

              {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}

              <button onClick={handleCalc}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] hover:opacity-90 text-white font-extrabold text-lg transition-all shadow-xl shadow-violet-900/30">
                ⚖️ Calculate BMI
              </button>
            </div>

            {/* Result */}
            {result && category && (
              <div className="flex flex-col gap-4">

                {/* BMI number */}
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Your BMI</div>
                  <div className="text-6xl font-extrabold text-white mb-2">{result.bmi.toFixed(1)}</div>
                  <span className={`text-sm font-extrabold px-4 py-1.5 rounded-full ${category.color.replace("bg-","bg-").replace("500","500/20")} ${category.text} border border-current/20`}>
                    {category.label}
                  </span>
                </div>

                {/* BMI gauge */}
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">BMI Scale</div>
                  <div className="relative h-4 rounded-full overflow-hidden flex">
                    {["bg-blue-500","bg-cyan-500","bg-green-500","bg-yellow-500","bg-orange-500","bg-red-500"].map((c,i) => (
                      <div key={i} className={`${c} flex-1`} />
                    ))}
                    {/* Marker */}
                    <div className="absolute top-0 bottom-0 w-1 bg-white rounded-full shadow-lg transition-all"
                      style={{ left: `${bmiPct}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-600 mt-1.5">
                    <span>10</span><span>16</span><span>18.5</span><span>25</span><span>30</span><span>35</span><span>40+</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label:"BMI",         value:result.bmi.toFixed(1),       color:"text-[#6C3AFF]" },
                    { label:"BMI Prime",   value:result.bmiPrime.toFixed(2),  color:result.bmiPrime <= 1 ? "text-green-400" : "text-orange-400" },
                    { label:"Category",    value:category.label,              color:category.text    },
                    { label:"Healthy Min", value:`${result.healthyMinKg.toFixed(1)} kg / ${result.healthyMinLb.toFixed(0)} lb`, color:"text-green-400" },
                    { label:"Healthy Max", value:`${result.healthyMaxKg.toFixed(1)} kg / ${result.healthyMaxLb.toFixed(0)} lb`, color:"text-green-400" },
                  ].map(s => (
                    <div key={s.label} className="bg-[#13131F] border border-white/5 rounded-2xl p-4 text-center col-span-1 last:col-span-1 sm:last:col-span-1">
                      <div className={`text-base font-extrabold ${s.color}`}>{s.value}</div>
                      <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BMI categories table */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5">
                <h3 className="text-sm font-bold text-white">BMI Categories</h3>
              </div>
              {BMI_CATEGORIES.map(cat => (
                <div key={cat.label} className={`flex items-center justify-between px-5 py-3 border-b border-white/5 last:border-0 ${result && result.bmi >= cat.min && result.bmi < cat.max ? "bg-white/5" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                    <span className="text-sm text-white">{cat.label}</span>
                    {result && result.bmi >= cat.min && result.bmi < cat.max && (
                      <span className="text-xs bg-[#6C3AFF]/20 text-[#6C3AFF] px-2 py-0.5 rounded-full">← You</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 font-mono">{cat.min} – {cat.max === 100 ? "40+" : cat.max}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-3">⚠️ BMI Limitations</h3>
              <div className="space-y-2 text-xs text-gray-500">
                {["Does not measure body fat directly","Overestimates fat in muscular people","Underestimates fat in elderly people","Does not account for fat distribution","Different healthy ranges for children"].map(l => (
                  <div key={l} className="flex items-start gap-2"><span className="text-yellow-400 mt-0.5">!</span><span>{l}</span></div>
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
              <p className="text-gray-500 text-xs mb-4">Unlimited usage, zero ads, API access</p>
              <button className="w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all">Get Pro — $7/mo</button>
            </div>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">📖 How to Use the BMI Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step:"1", title:"Choose Your Units",   desc:"Select Metric (kg and cm) or Imperial (pounds and feet/inches) — whichever you're most comfortable with." },
              { step:"2", title:"Enter Height & Weight",desc:"Type in your current weight and height. The inputs accept decimal values for more precise results." },
              { step:"3", title:"Get Your Results",    desc:"Click Calculate to see your BMI score, category, BMI Prime and your healthy weight range. The gauge shows where you sit on the full BMI scale." },
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
