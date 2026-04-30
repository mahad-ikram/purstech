"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const RELATED_TOOLS = [
  { icon: "🎂", name: "Age Calculator",        slug: "age-calculator"        },
  { icon: "⚖️", name: "BMI Calculator",         slug: "bmi-calculator"        },
  { icon: "🔢", name: "Percentage Calculator",  slug: "percentage-calculator" },
  { icon: "💱", name: "Currency Converter",     slug: "currency-converter"    },
  { icon: "🏦", name: "Loan Calculator",        slug: "loan-calculator"       },
];

const FAQ = [
  { q: "How does the unit converter work?", a: "Every unit is stored with its conversion factor to a base unit. When you convert, the tool first converts your input to the base unit, then from the base unit to your target unit. This allows any unit to be converted to any other with a single calculation." },
  { q: "How accurate are the conversions?", a: "All conversions use precise scientific conversion factors. Results are displayed to up to 8 significant figures to minimise rounding errors." },
  { q: "What categories of units are supported?", a: "Length, weight/mass, temperature, volume, area, speed, time, digital storage and energy — covering the most common unit conversions needed in daily and professional use." },
  { q: "Why is temperature conversion different?", a: "Unlike other units, temperature conversions require an offset calculation (adding or subtracting a constant), not just multiplication. Celsius, Fahrenheit and Kelvin all use different formulas." },
  { q: "Can I convert between metric and imperial?", a: "Yes — all conversions work between metric and imperial systems. For example: kilometres to miles, kilograms to pounds, litres to gallons and more." },
];

type Category = {
  id: string;
  label: string;
  icon: string;
  base: string;
  units: { id: string; label: string; factor: number; offset?: number }[];
};

const CATEGORIES: Category[] = [
  {
    id:"length", label:"Length", icon:"📏", base:"m",
    units:[
      { id:"mm",  label:"Millimetres (mm)", factor:0.001        },
      { id:"cm",  label:"Centimetres (cm)", factor:0.01         },
      { id:"m",   label:"Metres (m)",       factor:1            },
      { id:"km",  label:"Kilometres (km)",  factor:1000         },
      { id:"in",  label:"Inches (in)",      factor:0.0254       },
      { id:"ft",  label:"Feet (ft)",        factor:0.3048       },
      { id:"yd",  label:"Yards (yd)",       factor:0.9144       },
      { id:"mi",  label:"Miles (mi)",       factor:1609.344     },
      { id:"nmi", label:"Nautical Miles",   factor:1852         },
    ],
  },
  {
    id:"weight", label:"Weight", icon:"⚖️", base:"kg",
    units:[
      { id:"mg",  label:"Milligrams (mg)",  factor:0.000001     },
      { id:"g",   label:"Grams (g)",        factor:0.001        },
      { id:"kg",  label:"Kilograms (kg)",   factor:1            },
      { id:"t",   label:"Tonnes (t)",       factor:1000         },
      { id:"oz",  label:"Ounces (oz)",      factor:0.0283495    },
      { id:"lb",  label:"Pounds (lb)",      factor:0.453592     },
      { id:"st",  label:"Stone (st)",       factor:6.35029      },
    ],
  },
  {
    id:"temp", label:"Temperature", icon:"🌡️", base:"c",
    units:[
      { id:"c",  label:"Celsius (°C)",    factor:1, offset:0     },
      { id:"f",  label:"Fahrenheit (°F)", factor:1, offset:0     },
      { id:"k",  label:"Kelvin (K)",      factor:1, offset:0     },
    ],
  },
  {
    id:"volume", label:"Volume", icon:"🫙", base:"l",
    units:[
      { id:"ml",   label:"Millilitres (ml)", factor:0.001      },
      { id:"l",    label:"Litres (l)",       factor:1          },
      { id:"m3",   label:"Cubic metres",     factor:1000       },
      { id:"tsp",  label:"Teaspoons",        factor:0.00492892 },
      { id:"tbsp", label:"Tablespoons",      factor:0.0147868  },
      { id:"floz", label:"Fl. Oz (US)",      factor:0.0295735  },
      { id:"cup",  label:"Cups (US)",        factor:0.236588   },
      { id:"pt",   label:"Pints (US)",       factor:0.473176   },
      { id:"qt",   label:"Quarts (US)",      factor:0.946353   },
      { id:"gal",  label:"Gallons (US)",     factor:3.78541    },
    ],
  },
  {
    id:"area", label:"Area", icon:"⬜", base:"m2",
    units:[
      { id:"mm2", label:"mm²",               factor:0.000001   },
      { id:"cm2", label:"cm²",               factor:0.0001     },
      { id:"m2",  label:"m²",                factor:1          },
      { id:"km2", label:"km²",               factor:1000000    },
      { id:"ha",  label:"Hectares (ha)",     factor:10000      },
      { id:"in2", label:"in²",               factor:0.00064516 },
      { id:"ft2", label:"ft²",               factor:0.092903   },
      { id:"yd2", label:"yd²",               factor:0.836127   },
      { id:"ac",  label:"Acres",             factor:4046.86    },
      { id:"mi2", label:"mi²",               factor:2589988    },
    ],
  },
  {
    id:"speed", label:"Speed", icon:"⚡", base:"ms",
    units:[
      { id:"ms",   label:"m/s",          factor:1         },
      { id:"kmh",  label:"km/h",         factor:0.277778  },
      { id:"mph",  label:"mph",          factor:0.44704   },
      { id:"knot", label:"Knots",        factor:0.514444  },
      { id:"fps",  label:"ft/s",         factor:0.3048    },
    ],
  },
  {
    id:"time", label:"Time", icon:"⏱️", base:"s",
    units:[
      { id:"ms",  label:"Milliseconds",  factor:0.001       },
      { id:"s",   label:"Seconds",       factor:1           },
      { id:"min", label:"Minutes",       factor:60          },
      { id:"h",   label:"Hours",         factor:3600        },
      { id:"d",   label:"Days",          factor:86400       },
      { id:"wk",  label:"Weeks",         factor:604800      },
      { id:"mo",  label:"Months (avg)",  factor:2629800     },
      { id:"yr",  label:"Years",         factor:31557600    },
    ],
  },
  {
    id:"digital", label:"Digital", icon:"💾", base:"b",
    units:[
      { id:"b",   label:"Bits",          factor:1           },
      { id:"B",   label:"Bytes",         factor:8           },
      { id:"KB",  label:"Kilobytes",     factor:8192        },
      { id:"MB",  label:"Megabytes",     factor:8388608     },
      { id:"GB",  label:"Gigabytes",     factor:8589934592  },
      { id:"TB",  label:"Terabytes",     factor:8796093022208 },
    ],
  },
];

function convertTemp(value: number, from: string, to: string): number {
  let celsius: number;
  if (from === "c")      celsius = value;
  else if (from === "f") celsius = (value - 32) * 5 / 9;
  else                   celsius = value - 273.15;

  if (to === "c")      return celsius;
  if (to === "f")      return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

function convertValue(value: number, from: string, to: string, category: Category): number {
  if (category.id === "temp") return convertTemp(value, from, to);
  const fromUnit = category.units.find(u => u.id === from);
  const toUnit   = category.units.find(u => u.id === to);
  if (!fromUnit || !toUnit) return 0;
  const base = value * fromUnit.factor;
  return base / toUnit.factor;
}

function formatResult(n: number): string {
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-4 && n !== 0)) return n.toExponential(4);
  return parseFloat(n.toPrecision(8)).toString();
}

export default function UnitConverterPage() {
  const [catId,   setCatId]   = useState("length");
  const [fromId,  setFromId]  = useState("m");
  const [toId,    setToId]    = useState("ft");
  const [input,   setInput]   = useState("1");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const category = CATEGORIES.find(c => c.id === catId)!;

  // Reset units when category changes
  useEffect(() => {
    setFromId(category.units[0].id);
    setToId(category.units[1]?.id || category.units[0].id);
    setInput("1");
  }, [catId]);

  const numInput = parseFloat(input);
  const result   = !isNaN(numInput) && fromId !== toId
    ? formatResult(convertValue(numInput, fromId, toId, category))
    : input;

  const handleSwap = () => {
    setFromId(toId);
    setToId(fromId);
  };

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
          <span className="text-gray-400">Unit Converter</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">📏</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">Unit Converter</h1>
              <p className="text-gray-500 mt-1">Convert between length, weight, temperature, volume, area, speed, time and more — instant results.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Free","No Login","8 Categories","50+ Units","Instant"].map(b => (
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium">✓ {b}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setCatId(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                    catId === cat.id
                      ? "bg-[#6C3AFF] text-white shadow-lg shadow-violet-900/30"
                      : "bg-[#13131F] text-gray-400 hover:text-white border border-white/5 hover:border-[#6C3AFF]/30"
                  }`}>
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Converter */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">

              {/* From */}
              <div className="mb-4">
                <label className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-wider">From</label>
                <div className="flex gap-3">
                  <input type="number" value={input} onChange={e => setInput(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-lg font-bold" />
                  <select value={fromId} onChange={e => setFromId(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm">
                    {category.units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Swap */}
              <div className="flex items-center justify-center my-3">
                <button onClick={handleSwap}
                  className="w-10 h-10 rounded-full bg-[#6C3AFF]/20 hover:bg-[#6C3AFF] border border-[#6C3AFF]/30 flex items-center justify-center text-[#6C3AFF] hover:text-white transition-all font-bold text-lg">
                  ⇅
                </button>
              </div>

              {/* To */}
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-wider">To</label>
                <div className="flex gap-3">
                  <div className="flex-1 px-4 py-3 rounded-xl bg-[#0A0A14] border border-[#6C3AFF]/20 text-[#6C3AFF] text-lg font-extrabold">
                    {result}
                  </div>
                  <select value={toId} onChange={e => setToId(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm">
                    {category.units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Formula */}
              {!isNaN(numInput) && fromId !== toId && (
                <div className="mt-4 bg-[#0A0A14] rounded-xl px-4 py-3 text-xs text-gray-500 font-mono">
                  {input} {category.units.find(u=>u.id===fromId)?.label.split(" ")[0]} = {result} {category.units.find(u=>u.id===toId)?.label.split(" ")[0]}
                </div>
              )}
            </div>

            {/* All conversions table */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5">
                <h3 className="text-sm font-bold text-white">{category.icon} All {category.label} Conversions</h3>
              </div>
              <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                {category.units.map(unit => {
                  const val = !isNaN(numInput) ? formatResult(convertValue(numInput, fromId, unit.id, category)) : "—";
                  return (
                    <div key={unit.id} className={`flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors ${unit.id === toId ? "bg-[#6C3AFF]/5" : ""}`}>
                      <span className="text-sm text-gray-400">{unit.label}</span>
                      <span className={`text-sm font-mono font-semibold ${unit.id === fromId ? "text-[#00D4FF]" : unit.id === toId ? "text-[#6C3AFF]" : "text-white"}`}>
                        {unit.id === fromId ? input : val}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">📊 Categories</h3>
              <div className="space-y-2">
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => setCatId(cat.id)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${catId === cat.id ? "bg-[#6C3AFF]/20 text-white" : "hover:bg-[#0A0A14] text-gray-400 hover:text-white"}`}>
                    <span>{cat.icon}</span>
                    <span className="text-sm font-medium">{cat.label}</span>
                    <span className="ml-auto text-xs text-gray-600">{cat.units.length} units</span>
                  </button>
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
          <h2 className="text-2xl font-extrabold text-white mb-6">📖 How to Use the Unit Converter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step:"1", title:"Select a Category",   desc:"Click a category tab — Length, Weight, Temperature, Volume, Area, Speed, Time or Digital Storage." },
              { step:"2", title:"Enter Value & Units", desc:"Type your number, choose the unit you are converting from, and select the unit you want to convert to." },
              { step:"3", title:"See All Results",     desc:"Your result appears instantly. The full table below shows your value converted into every unit in that category at once." },
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
