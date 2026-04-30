"use client";

import { useState } from "react";
import Link from "next/link";

const RELATED_TOOLS = [
  { icon: "⚖️", name: "BMI Calculator",         slug: "bmi-calculator"         },
  { icon: "🔢", name: "Percentage Calculator",   slug: "percentage-calculator"  },
  { icon: "📏", name: "Unit Converter",          slug: "unit-converter"         },
  { icon: "💱", name: "Currency Converter",      slug: "currency-converter"     },
  { icon: "🏦", name: "Loan Calculator",         slug: "loan-calculator"        },
];

const FAQ = [
  { q: "How is my age calculated?", a: "Your age is calculated by finding the difference between your date of birth and today's date (or a custom target date). The result accounts for leap years and exact month/day differences." },
  { q: "What is the next birthday countdown for?", a: "It shows exactly how many days are left until your next birthday — useful for planning parties, sending reminders or just satisfying curiosity." },
  { q: "Can I calculate age between two custom dates?", a: "Yes — toggle to 'Between two dates' mode and enter any two dates. The tool calculates the exact difference in years, months and days." },
  { q: "How are months and days calculated exactly?", a: "The tool calculates complete years first, then remaining complete months, then remaining days. This gives the most precise result rather than just dividing total days." },
  { q: "What is the day of the week I was born?", a: "Using the date you enter, the tool calculates which day of the week that date fell on using the Zeller algorithm." },
];

function calcAge(dob: Date, target: Date) {
  let years  = target.getFullYear() - dob.getFullYear();
  let months = target.getMonth()    - dob.getMonth();
  let days   = target.getDate()     - dob.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) { years--; months += 12; }

  const totalDays    = Math.floor((target.getTime() - dob.getTime()) / 86400000);
  const totalWeeks   = Math.floor(totalDays / 7);
  const totalMonths  = years * 12 + months;
  const totalHours   = totalDays * 24;
  const totalMinutes = totalHours * 60;

  // Next birthday
  let nextBirthday = new Date(target.getFullYear(), dob.getMonth(), dob.getDate());
  if (nextBirthday <= target) nextBirthday.setFullYear(target.getFullYear() + 1);
  const daysToNextBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / 86400000);

  // Day of week born
  const days_of_week = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const dayBorn = days_of_week[dob.getDay()];

  return { years, months, days, totalDays, totalWeeks, totalMonths, totalHours, totalMinutes, daysToNextBirthday, dayBorn };
}

const TODAY = new Date().toISOString().split("T")[0];

export default function AgeCalculatorPage() {
  const [dob,     setDob]     = useState("");
  const [target,  setTarget]  = useState(TODAY);
  const [result,  setResult]  = useState<ReturnType<typeof calcAge> | null>(null);
  const [error,   setError]   = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCalculate = () => {
    if (!dob) { setError("Please enter a date of birth."); return; }
    const dobDate    = new Date(dob);
    const targetDate = new Date(target);
    if (dobDate >= targetDate) { setError("Date of birth must be before the target date."); return; }
    if (dobDate.getFullYear() < 1900) { setError("Please enter a valid date after 1900."); return; }
    setError("");
    setResult(calcAge(dobDate, targetDate));
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
          <span className="text-gray-400">Age Calculator</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🎂</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">Age Calculator</h1>
              <p className="text-gray-500 mt-1">Calculate your exact age in years, months and days — plus total days, weeks, hours and minutes.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Free","No Login","Exact Age","Next Birthday Countdown","Day You Were Born"].map(b => (
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium">✓ {b}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Inputs */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-wider">Date of Birth</label>
                  <input type="date" value={dob} onChange={e => setDob(e.target.value)} max={TODAY}
                    className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-wider">Calculate Age On</label>
                  <input type="date" value={target} onChange={e => setTarget(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm" />
                </div>
              </div>

              {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}

              <button onClick={handleCalculate}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] hover:opacity-90 text-white font-extrabold text-lg transition-all shadow-xl shadow-violet-900/30">
                🎂 Calculate Age
              </button>
            </div>

            {/* Results */}
            {result && (
              <div className="flex flex-col gap-4">

                {/* Main age */}
                <div className="bg-[#13131F] border border-[#6C3AFF]/30 rounded-2xl p-6 text-center">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">Your Age</div>
                  <div className="flex items-end justify-center gap-4 flex-wrap">
                    {[
                      { value: result.years,  label: "Years"  },
                      { value: result.months, label: "Months" },
                      { value: result.days,   label: "Days"   },
                    ].map((s, i) => (
                      <div key={s.label} className="text-center">
                        {i > 0 && <span className="text-gray-600 text-2xl mr-4">:</span>}
                        <div className="text-5xl font-extrabold text-white">{s.value}</div>
                        <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detail grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label:"Total Days",    value:result.totalDays.toLocaleString(),    color:"text-[#6C3AFF]"  },
                    { label:"Total Weeks",   value:result.totalWeeks.toLocaleString(),   color:"text-[#00D4FF]"  },
                    { label:"Total Months",  value:result.totalMonths.toLocaleString(),  color:"text-green-400"  },
                    { label:"Total Hours",   value:result.totalHours.toLocaleString(),   color:"text-yellow-400" },
                    { label:"Total Minutes", value:result.totalMinutes.toLocaleString(), color:"text-pink-400"   },
                    { label:"Day Born",      value:result.dayBorn,                       color:"text-orange-400" },
                  ].map(s => (
                    <div key={s.label} className="bg-[#13131F] border border-white/5 rounded-2xl p-4 text-center">
                      <div className={`text-xl font-extrabold ${s.color}`}>{s.value}</div>
                      <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Next birthday */}
                <div className="bg-gradient-to-r from-[#6C3AFF]/10 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 flex items-center gap-4">
                  <span className="text-3xl">🎉</span>
                  <div>
                    <div className="font-bold text-white">Next Birthday</div>
                    <div className="text-gray-400 text-sm">
                      {result.daysToNextBirthday === 0
                        ? "🎂 Happy Birthday! Today is your birthday!"
                        : `${result.daysToNextBirthday} day${result.daysToNextBirthday === 1 ? "" : "s"} away`}
                    </div>
                  </div>
                  {result.daysToNextBirthday > 0 && (
                    <div className="ml-auto text-3xl font-extrabold text-[#6C3AFF]">{result.daysToNextBirthday}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">💡 Did You Know?</h3>
              <div className="space-y-3 text-xs text-gray-500">
                {[
                  "Leap years have 366 days instead of 365.",
                  "The oldest verified person lived to 122 years.",
                  "Your heart beats ~100,000 times per day.",
                  "You blink ~15-20 times per minute.",
                  "In a 70-year life you sleep ~23 years.",
                ].map(f => (
                  <div key={f} className="flex items-start gap-2"><span className="text-[#6C3AFF] mt-0.5">→</span><span>{f}</span></div>
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
          <h2 className="text-2xl font-extrabold text-white mb-6">📖 How to Use the Age Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step:"1", title:"Enter Date of Birth",  desc:"Select your date of birth using the date picker. You can type it in or click the calendar icon." },
              { step:"2", title:"Choose Target Date",   desc:"By default this is today. Change it to any date to calculate age at a specific point in time." },
              { step:"3", title:"View Your Results",    desc:"Click Calculate to see your exact age in years, months and days, plus total days, weeks, hours, minutes and your next birthday countdown." },
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
