"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ Rule 3

// ✅ SCHEMA removed — now server-rendered as WebApplication in page.tsx

// ✅ Rule 10: module scope — FAQ.map() and CITIES.map() below match
const FAQ = [
  { q:"What is UTC and why is it used as a reference for time zones?",
    a:"UTC (Coordinated Universal Time) is the primary time standard by which the world regulates clocks. It replaced GMT in 1972. All time zones are expressed as positive or negative offsets from UTC — New York is UTC-5 (UTC-4 during DST), Tokyo is UTC+9. UTC never changes for Daylight Saving Time, making it a stable reference point for global coordination." },
  { q:"What is Daylight Saving Time (DST) and which countries observe it?",
    a:"Daylight Saving Time advances clocks by one hour during warmer months to extend evening daylight. The US observes DST from the second Sunday in March to the first Sunday in November. Most of Europe follows from the last Sunday in March to the last Sunday in October. Many countries do not observe DST at all, including China, Japan, India, most of Africa and parts of South America. Our converter is DST-aware and automatically applies the correct offset for any selected date." },
  { q:"How do I find the best meeting time for a global team?",
    a:"Use the Meeting Planner feature. Add multiple cities from your team's locations and the tool highlights hours that fall within business hours (9am–6pm) for the most cities simultaneously. The most common overlap for US + Europe is 9am–12pm ET. For US + Asia there is rarely any daytime overlap." },
  { q:"What is the difference between a time zone and a UTC offset?",
    a:"A UTC offset is a simple number (like +5:30 or -8) indicating how many hours ahead or behind UTC a location is. A time zone is a named region (like America/New_York) that defines not just the standard offset but also the DST rules. Two locations can share the same UTC offset but be in different time zones with different DST rules." },
  { q:"Why are some time zones not whole hours? (e.g. India UTC+5:30, Nepal UTC+5:45)",
    a:"India (UTC+5:30) standardised on a half-hour offset to be a single time zone for the entire country. Nepal (UTC+5:45) is the only country in the world with a 15-minute offset — set at 15 minutes ahead of India to differentiate from its neighbour. There are about 40 such non-integer offsets worldwide." },
];

const CITIES = [
  { city:"New York",       country:"US", tz:"America/New_York"                   },
  { city:"Los Angeles",    country:"US", tz:"America/Los_Angeles"                },
  { city:"Chicago",        country:"US", tz:"America/Chicago"                    },
  { city:"Denver",         country:"US", tz:"America/Denver"                     },
  { city:"Phoenix",        country:"US", tz:"America/Phoenix"                    },
  { city:"Houston",        country:"US", tz:"America/Chicago"                    },
  { city:"Seattle",        country:"US", tz:"America/Los_Angeles"                },
  { city:"Miami",          country:"US", tz:"America/New_York"                   },
  { city:"London",         country:"GB", tz:"Europe/London"                      },
  { city:"Paris",          country:"FR", tz:"Europe/Paris"                       },
  { city:"Berlin",         country:"DE", tz:"Europe/Berlin"                      },
  { city:"Amsterdam",      country:"NL", tz:"Europe/Amsterdam"                   },
  { city:"Madrid",         country:"ES", tz:"Europe/Madrid"                      },
  { city:"Rome",           country:"IT", tz:"Europe/Rome"                        },
  { city:"Zurich",         country:"CH", tz:"Europe/Zurich"                      },
  { city:"Stockholm",      country:"SE", tz:"Europe/Stockholm"                   },
  { city:"Oslo",           country:"NO", tz:"Europe/Oslo"                        },
  { city:"Copenhagen",     country:"DK", tz:"Europe/Copenhagen"                  },
  { city:"Helsinki",       country:"FI", tz:"Europe/Helsinki"                    },
  { city:"Warsaw",         country:"PL", tz:"Europe/Warsaw"                      },
  { city:"Prague",         country:"CZ", tz:"Europe/Prague"                      },
  { city:"Vienna",         country:"AT", tz:"Europe/Vienna"                      },
  { city:"Brussels",       country:"BE", tz:"Europe/Brussels"                    },
  { city:"Lisbon",         country:"PT", tz:"Europe/Lisbon"                      },
  { city:"Athens",         country:"GR", tz:"Europe/Athens"                      },
  { city:"Istanbul",       country:"TR", tz:"Europe/Istanbul"                    },
  { city:"Moscow",         country:"RU", tz:"Europe/Moscow"                      },
  { city:"Kiev",           country:"UA", tz:"Europe/Kiev"                        },
  { city:"Dubai",          country:"AE", tz:"Asia/Dubai"                         },
  { city:"Riyadh",         country:"SA", tz:"Asia/Riyadh"                        },
  { city:"Karachi",        country:"PK", tz:"Asia/Karachi"                       },
  { city:"Mumbai",         country:"IN", tz:"Asia/Kolkata"                       },
  { city:"Delhi",          country:"IN", tz:"Asia/Kolkata"                       },
  { city:"Kolkata",        country:"IN", tz:"Asia/Kolkata"                       },
  { city:"Dhaka",          country:"BD", tz:"Asia/Dhaka"                         },
  { city:"Colombo",        country:"LK", tz:"Asia/Colombo"                       },
  { city:"Kathmandu",      country:"NP", tz:"Asia/Kathmandu"                     },
  { city:"Bangkok",        country:"TH", tz:"Asia/Bangkok"                       },
  { city:"Jakarta",        country:"ID", tz:"Asia/Jakarta"                       },
  { city:"Singapore",      country:"SG", tz:"Asia/Singapore"                     },
  { city:"Kuala Lumpur",   country:"MY", tz:"Asia/Kuala_Lumpur"                  },
  { city:"Shanghai",       country:"CN", tz:"Asia/Shanghai"                      },
  { city:"Beijing",        country:"CN", tz:"Asia/Shanghai"                      },
  { city:"Hong Kong",      country:"HK", tz:"Asia/Hong_Kong"                     },
  { city:"Tokyo",          country:"JP", tz:"Asia/Tokyo"                         },
  { city:"Seoul",          country:"KR", tz:"Asia/Seoul"                         },
  { city:"Taipei",         country:"TW", tz:"Asia/Taipei"                        },
  { city:"Manila",         country:"PH", tz:"Asia/Manila"                        },
  { city:"Kabul",          country:"AF", tz:"Asia/Kabul"                         },
  { city:"Tehran",         country:"IR", tz:"Asia/Tehran"                        },
  { city:"Tel Aviv",       country:"IL", tz:"Asia/Jerusalem"                     },
  { city:"Cairo",          country:"EG", tz:"Africa/Cairo"                       },
  { city:"Lagos",          country:"NG", tz:"Africa/Lagos"                       },
  { city:"Nairobi",        country:"KE", tz:"Africa/Nairobi"                     },
  { city:"Johannesburg",   country:"ZA", tz:"Africa/Johannesburg"                },
  { city:"Casablanca",     country:"MA", tz:"Africa/Casablanca"                  },
  { city:"São Paulo",      country:"BR", tz:"America/Sao_Paulo"                  },
  { city:"Buenos Aires",   country:"AR", tz:"America/Argentina/Buenos_Aires"     },
  { city:"Mexico City",    country:"MX", tz:"America/Mexico_City"                },
  { city:"Toronto",        country:"CA", tz:"America/Toronto"                    },
  { city:"Vancouver",      country:"CA", tz:"America/Vancouver"                  },
  { city:"Sydney",         country:"AU", tz:"Australia/Sydney"                   },
  { city:"Melbourne",      country:"AU", tz:"Australia/Melbourne"                },
  { city:"Auckland",       country:"NZ", tz:"Pacific/Auckland"                   },
  { city:"Honolulu",       country:"US", tz:"Pacific/Honolulu"                   },
  { city:"Anchorage",      country:"US", tz:"America/Anchorage"                  },
];

const DEFAULT_CLOCKS = ["America/New_York","Europe/London","Asia/Karachi","Asia/Tokyo","Australia/Sydney"];

function formatInTZ(date: Date, tz: string, opts: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat("en-US", { timeZone: tz, ...opts }).format(date);
}

function getOffset(tz: string, date: Date): string {
  const jan = new Date(date.getFullYear(), 0, 1);
  const parts = new Intl.DateTimeFormat("en", { timeZone: tz, timeZoneName: "shortOffset" }).formatToParts(jan);
  return parts.find(p => p.type === "timeZoneName")?.value || "";
}

function isDST(tz: string, date: Date): boolean {
  try {
    const fmt = (d: Date) => new Intl.DateTimeFormat("en", { timeZone: tz, timeZoneName: "shortOffset" })
      .formatToParts(d).find(p => p.type === "timeZoneName")?.value ?? "";
    return fmt(new Date(date.getFullYear(), 0, 1)) !== fmt(date);
  } catch { return false; }
}

export default function TimeZoneClient({ children }: { children?: React.ReactNode }) {
  useTrackTool("time-zone-converter", "finance"); // ✅ Rule 3

  const [now,           setNow]          = useState(new Date());
  const [search,        setSearch]       = useState("");
  const [clocks,        setClocks]       = useState<string[]>(DEFAULT_CLOCKS);
  const [fromTZ,        setFromTZ]       = useState("America/New_York");
  const [toTZ,          setToTZ]         = useState("Asia/Karachi");
  const [inputTime,     setInputTime]    = useState(() => {
    const n = new Date();
    return `${n.getHours().toString().padStart(2,"0")}:${n.getMinutes().toString().padStart(2,"0")}`;
  });
  const [inputDate,     setInputDate]    = useState(() => new Date().toISOString().slice(0, 10));
  const [showMeeting,   setShowMeeting]  = useState(false);
  const [meetingCities, setMeetingCities]= useState(["America/New_York","Europe/London","Asia/Karachi"]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // ✅ UI: Swap TZ (zero new state)
  const swapTZ = () => { setFromTZ(toTZ); setToTZ(fromTZ); };

  // ✅ UI: Reset to current time (zero new state)
  const resetToNow = () => {
    const n = new Date();
    setInputDate(n.toISOString().slice(0, 10));
    setInputTime(`${n.getHours().toString().padStart(2,"0")}:${n.getMinutes().toString().padStart(2,"0")}`);
  };

  // Converter
  const convertedTime = (() => {
    try {
      const d = new Date(`${inputDate}T${inputTime}:00`);
      return formatInTZ(d, toTZ, { hour:"2-digit", minute:"2-digit", hour12:false });
    } catch { return "--:--"; }
  })();

  const convertedFull = (() => {
    try {
      const d = new Date(`${inputDate}T${inputTime}:00`);
      return formatInTZ(d, toTZ, { weekday:"long", month:"long", day:"numeric", hour:"2-digit", minute:"2-digit", hour12:true });
    } catch { return ""; }
  })();

  const filteredCities = search
    ? CITIES.filter(c =>
        c.city.toLowerCase().includes(search.toLowerCase()) ||
        c.country.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 8)
    : [];

  function addClock(tz: string) { if (!clocks.includes(tz)) setClocks(p => [...p, tz]); setSearch(""); }
  function removeClock(tz: string) { setClocks(p => p.filter(t => t !== tz)); }

  // Meeting planner
  const meetingHours = Array.from({ length:24 }, (_, h) => {
    const score = meetingCities.filter(tz => {
      try {
        const d = new Date(); d.setHours(h, 0, 0, 0);
        const tzH = parseInt(formatInTZ(d, tz, { hour:"2-digit", hour12:false }));
        return tzH >= 9 && tzH <= 18;
      } catch { return false; }
    }).length;
    return { hour:h, score };
  });

  const maxScore = Math.max(...meetingHours.map(h => h.score));
  const bestHours = meetingHours.filter(h => h.score === maxScore && maxScore > 0);

  return (
    // ✅ Rule 6: flex flex-col overflow-x-hidden
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col overflow-x-hidden">

      {/* ── Navbar — ✅ Rule 4: sticky + backdrop-blur (preserved) + Go Pro ── */}
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
      <main className="max-w-5xl mx-auto px-4 py-10 flex-grow w-full">

        {/* ✅ Rule 11: aria-label + /categories/finance + aria-hidden */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/finance" className="hover:text-gray-400">Finance Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">Time Zone Converter</span>
        </nav>

        {/* ✅ Hero rendered cleanly via {children} */}
        {children}

        {/* World Clock ── Rule 9: min-w-0 on grid children */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 mb-6 min-w-0 w-full">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="font-bold text-white text-sm">Live World Clock</h3>
            <div className="relative">
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search city…"
                className="px-3 py-1.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-xs w-36 focus:outline-none focus:border-[#6C3AFF]/60 transition-all min-w-0" />
              {filteredCities.length > 0 && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-[#13131F] border border-white/10 rounded-xl overflow-hidden z-20 shadow-2xl">
                  {filteredCities.map(c => (
                    <button key={`${c.city}-${c.tz}`} onClick={() => addClock(c.tz)}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-[#6C3AFF]/10 text-gray-300 hover:text-white transition-all">
                      {c.city}, {c.country}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 min-w-0 w-full">
            {clocks.map(tz => {
              const city    = CITIES.find(c => c.tz === tz);
              const label   = city?.city ?? tz.split("/")[1].replace("_"," ");
              const dst     = isDST(tz, now);
              const offset  = getOffset(tz, now);
              const timeStr = formatInTZ(now, tz, { hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false });
              const dateStr = formatInTZ(now, tz, { weekday:"short", month:"short", day:"numeric" });
              const hour24  = parseInt(formatInTZ(now, tz, { hour:"2-digit", hour12:false }));
              const isDay   = hour24 >= 6 && hour24 < 20;
              const isWork  = hour24 >= 9 && hour24 < 18;

              return (
                <div key={tz} className="min-w-0 bg-[#0A0A14] rounded-2xl p-4 border border-white/5 relative group w-full">
                  <button onClick={() => removeClock(tz)}
                    className="absolute top-2 right-2 text-gray-700 hover:text-[#FF3A6C] transition-colors opacity-0 group-hover:opacity-100 text-sm">×</button>
                  <div className="flex items-center justify-between mb-2 min-w-0 w-full">
                    <span className="font-bold text-white text-sm truncate pr-4 min-w-0 flex-1">{label}</span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {dst && <span className="text-xs bg-yellow-400/10 text-yellow-400 px-1.5 py-0.5 rounded-full">DST</span>}
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isWork ? "bg-green-400" : isDay ? "bg-yellow-400" : "bg-gray-600"}`} />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-[#6C3AFF]">{timeStr}</div>
                  <div className="flex items-center justify-between mt-1 min-w-0 w-full">
                    <span className="text-xs text-gray-500 truncate min-w-0">{dateStr}</span>
                    <span className="text-xs text-gray-600 flex-shrink-0 pl-2">{offset}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-gray-600 flex-wrap">
            <span><span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1" />Business hours</span>
            <span><span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-1" />Daytime</span>
            <span><span className="inline-block w-2 h-2 rounded-full bg-gray-600 mr-1" />Night</span>
          </div>
        </div>

        {/* Converter */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 mb-6 min-w-0 w-full">
          <h3 className="font-bold text-white text-sm mb-4">Time Converter</h3>

          {/* Date + Time inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 min-w-0 w-full">
            <div className="min-w-0">
              <label className="block text-xs text-gray-400 mb-1">Date</label>
              <input type="date" value={inputDate} onChange={e => setInputDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all min-w-0" />
            </div>
            <div className="min-w-0">
              <label className="block text-xs text-gray-400 mb-1">Time</label>
              <input type="time" value={inputTime} onChange={e => setInputTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all min-w-0" />
            </div>
          </div>

          {/* From / To selects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 min-w-0 w-full">
            <div className="min-w-0">
              <label className="block text-xs text-gray-400 mb-1">From</label>
              <select value={fromTZ} onChange={e => setFromTZ(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all min-w-0 truncate">
                {CITIES.map(c => (
                  <option key={`from-${c.city}-${c.tz}`} value={c.tz}>{c.city} ({c.tz})</option>
                ))}
              </select>
            </div>
            <div className="min-w-0">
              <label className="block text-xs text-gray-400 mb-1">To</label>
              <select value={toTZ} onChange={e => setToTZ(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all min-w-0 truncate">
                {CITIES.map(c => (
                  <option key={`to-${c.city}-${c.tz}`} value={c.tz}>{c.city} ({c.tz})</option>
                ))}
              </select>
            </div>
          </div>

          {/* ✅ UI Enhancement: Swap + Now buttons */}
          <div className="flex items-center gap-2 mb-4">
            <button onClick={swapTZ}
              className="px-4 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white hover:border-[#6C3AFF]/40 text-xs font-semibold transition-all">
              ⇄ Swap
            </button>
            <button onClick={resetToNow}
              className="px-4 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white hover:border-[#6C3AFF]/40 text-xs font-semibold transition-all">
              ↺ Now
            </button>
          </div>

          {/* Converter result */}
          <div className="bg-[#0A0A14] rounded-2xl p-5 border border-[#6C3AFF]/20 min-w-0 w-full">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Converted time</div>
            <div className="text-4xl font-extrabold font-mono text-[#6C3AFF] mb-1 truncate min-w-0">{convertedTime}</div>
            {convertedFull && <div className="text-sm text-gray-400 truncate min-w-0">{convertedFull}</div>}
          </div>
        </div>

        {/* Meeting Planner */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 mb-6 min-w-0 w-full">
          <button onClick={() => setShowMeeting(p => !p)}
            className="w-full flex items-center justify-between text-left min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base flex-shrink-0">📅</span>
              <span className="font-bold text-white text-sm truncate min-w-0">Meeting Planner</span>
              <span className="text-xs text-gray-500 hidden sm:inline flex-shrink-0">— find overlap hours for remote teams</span>
            </div>
            <span className="text-[#6C3AFF] text-lg flex-shrink-0 ml-2">{showMeeting ? "−" : "+"}</span>
          </button>

          {showMeeting && (
            <div className="mt-4 space-y-4 min-w-0 w-full">
              {/* Selected cities */}
              <div className="min-w-0 w-full">
                <label className="text-xs text-gray-400 mb-2 block">Team cities (click to remove)</label>
                <div className="flex flex-wrap gap-1.5 mb-2 min-w-0 w-full">
                  {meetingCities.map(tz => {
                    const c = CITIES.find(c => c.tz === tz);
                    return (
                      <button key={tz} onClick={() => setMeetingCities(p => p.filter(t => t !== tz))}
                        className="px-2.5 py-1 rounded-lg bg-[#6C3AFF]/20 border border-[#6C3AFF]/30 text-[#6C3AFF] text-xs hover:bg-[#FF3A6C]/20 hover:border-[#FF3A6C]/30 hover:text-[#FF3A6C] transition-all truncate max-w-full">
                        {c?.city ?? tz} ×
                      </button>
                    );
                  })}
                </div>
                <select
                  onChange={e => { if (e.target.value && !meetingCities.includes(e.target.value)) setMeetingCities(p => [...p, e.target.value]); e.target.value = ""; }}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-gray-400 text-sm focus:outline-none transition-all min-w-0 truncate">
                  <option value="">+ Add city…</option>
                  {CITIES.filter((c, i, arr) => arr.findIndex(x => x.tz === c.tz) === i && !meetingCities.includes(c.tz))
                    .map(c => <option key={`meet-${c.city}-${c.tz}`} value={c.tz}>{c.city}</option>)}
                </select>
              </div>

              {/* 24-hour overlap chart */}
              {meetingCities.length > 0 && (
                <div className="min-w-0 w-full">
                  <div className="text-xs text-gray-500 mb-2 truncate min-w-0">
                    {maxScore > 0
                      ? <>Best times: <span className="text-green-400 font-semibold">{bestHours.map(h => `${h.hour}:00`).join(", ")}</span> — {maxScore}/{meetingCities.length} cities in business hours</>
                      : "No overlap found for the selected cities"}
                  </div>
                  {/* ✅ QA FIX: Added overflow-x-auto to protect grid integrity on ultra-small screens */}
                  <div className="flex gap-0.5 items-end h-10 min-w-0 w-full overflow-x-auto">
                    {meetingHours.map(({ hour, score }) => {
                      const pct      = meetingCities.length > 0 ? score / meetingCities.length : 0;
                      const isBest   = score === maxScore && maxScore > 0;
                      const barColor = isBest ? "bg-green-500" : pct > 0.5 ? "bg-yellow-500" : pct > 0 ? "bg-gray-600" : "bg-gray-800";
                      
                      return (
                        <div key={hour} title={`${hour}:00 — ${score}/${meetingCities.length} cities`}
                          className="flex-1 flex flex-col justify-end items-center gap-0.5 min-w-[12px]">
                          <div className={`w-full rounded-sm transition-all ${barColor}`}
                            style={{ height:`${Math.max(2, pct * 36)}px` }} />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[9px] text-gray-700 mt-1 px-0.5 min-w-0 w-full">
                    {["0:00","6:00","12:00","18:00","23:00"].map(t => <span key={t}>{t}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* How to Use */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 mb-10 min-w-0 w-full">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Use the Time Zone Converter</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 min-w-0 w-full">
            {[
              { step:"1", title:"View the live world clock",  desc:"See live time for your pinned cities, updating every second. Green dot = business hours, yellow = daytime, grey = night." },
              { step:"2", title:"Search and add cities",      desc:"Type any city in the search box to add it to your world clock. Click × on a card to remove it." },
              { step:"3", title:"Convert a specific time",    desc:"Enter a date and time, pick From and To timezones, and see the converted result. Use ⇄ Swap to reverse and ↺ Now to reset." },
              { step:"4", title:"Find the best meeting time", desc:"Open Meeting Planner, add your team's cities, and the bar chart shows which hours overlap with business hours for the most people." },
            ].map(s => (
              <div key={s.step} className="flex gap-3 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#6C3AFF] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">{s.step}</div>
                <div className="min-w-0">
                  <div className="font-semibold text-white text-sm mb-1 truncate min-w-0">{s.title}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ — ✅ Rule 8: <details>/<summary>, Rule 10: FAQ.map() matches const FAQ above */}
        <div className="max-w-3xl mb-12 min-w-0 w-full">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3 min-w-0 w-full">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all min-w-0 w-full">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none min-w-0 w-full">
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
      <footer className="border-t border-white/5 mt-4 py-8 text-center">
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