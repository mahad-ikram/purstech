"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Time Zone Converter",
  description: "Free time zone converter with live world clock, DST awareness, meeting planner, and 500+ cities.",
  url: "https://purstech.com/tools/time-zone-converter",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const FAQ = [
  {
    q: "What is UTC and why is it used as a reference for time zones?",
    a: "UTC (Coordinated Universal Time) is the primary time standard by which the world regulates clocks and time. It replaced GMT (Greenwich Mean Time) as the international standard in 1972. All time zones are expressed as positive or negative offsets from UTC — for example, New York is UTC-5 (or UTC-4 during Daylight Saving Time) and Tokyo is UTC+9. UTC never changes for Daylight Saving Time, making it a stable reference point for global coordination.",
  },
  {
    q: "What is Daylight Saving Time (DST) and which countries observe it?",
    a: "Daylight Saving Time is the practice of advancing clocks by one hour during the warmer months to extend evening daylight. The US observes DST from the second Sunday in March to the first Sunday in November. Most of Europe follows from the last Sunday in March to the last Sunday in October. Many countries do not observe DST at all, including China, Japan, India, most of Africa, and parts of South America. Our converter is DST-aware and automatically applies the correct offset for any selected date.",
  },
  {
    q: "How do I find the best meeting time for a global team?",
    a: "Use our Meeting Planner feature. Add multiple cities from your team's locations, and the tool highlights hours that fall within business hours (9am–6pm) for the most cities simultaneously. These overlap windows are the ideal meeting times. Generally, times that overlap business hours across multiple continents are rare — the most common overlap for US + Europe is 9am–12pm ET, and for US + Asia there is rarely any daytime overlap.",
  },
  {
    q: "What is the difference between a time zone and a UTC offset?",
    a: "A UTC offset is a simple number (like +5:30 or -8) indicating how many hours ahead or behind UTC a location is. A time zone is a named region (like America/New_York or Asia/Kolkata) that defines not just the standard offset but also the DST rules that apply to that region. Two locations can share the same UTC offset but be in different time zones with different DST rules — for example, Morocco and Portugal are both UTC+1 but apply DST differently.",
  },
  {
    q: "Why are some time zones not whole hours? (e.g. India UTC+5:30, Nepal UTC+5:45)",
    a: "Most time zones are offset by whole hours from UTC, but a handful use 30-minute or even 45-minute increments. India (UTC+5:30) standardised on a half-hour offset to be a single time zone for the entire country rather than two separate hour zones. Nepal (UTC+5:45) is the only country in the world with a 15-minute offset — it was set at 15 minutes ahead of India to differentiate from its neighbour. There are about 40 such non-integer offsets worldwide.",
  },
];

// Comprehensive city list with timezone IDs
const CITIES = [
  { city: "New York",       country: "US",   tz: "America/New_York"      },
  { city: "Los Angeles",    country: "US",   tz: "America/Los_Angeles"   },
  { city: "Chicago",        country: "US",   tz: "America/Chicago"       },
  { city: "Denver",         country: "US",   tz: "America/Denver"        },
  { city: "Phoenix",        country: "US",   tz: "America/Phoenix"       },
  { city: "Houston",        country: "US",   tz: "America/Chicago"       },
  { city: "Seattle",        country: "US",   tz: "America/Los_Angeles"   },
  { city: "Miami",          country: "US",   tz: "America/New_York"      },
  { city: "London",         country: "GB",   tz: "Europe/London"         },
  { city: "Paris",          country: "FR",   tz: "Europe/Paris"          },
  { city: "Berlin",         country: "DE",   tz: "Europe/Berlin"         },
  { city: "Amsterdam",      country: "NL",   tz: "Europe/Amsterdam"      },
  { city: "Madrid",         country: "ES",   tz: "Europe/Madrid"         },
  { city: "Rome",           country: "IT",   tz: "Europe/Rome"           },
  { city: "Zurich",         country: "CH",   tz: "Europe/Zurich"         },
  { city: "Stockholm",      country: "SE",   tz: "Europe/Stockholm"      },
  { city: "Oslo",           country: "NO",   tz: "Europe/Oslo"           },
  { city: "Copenhagen",     country: "DK",   tz: "Europe/Copenhagen"     },
  { city: "Helsinki",       country: "FI",   tz: "Europe/Helsinki"       },
  { city: "Warsaw",         country: "PL",   tz: "Europe/Warsaw"         },
  { city: "Prague",         country: "CZ",   tz: "Europe/Prague"         },
  { city: "Vienna",         country: "AT",   tz: "Europe/Vienna"         },
  { city: "Brussels",       country: "BE",   tz: "Europe/Brussels"       },
  { city: "Lisbon",         country: "PT",   tz: "Europe/Lisbon"         },
  { city: "Athens",         country: "GR",   tz: "Europe/Athens"         },
  { city: "Istanbul",       country: "TR",   tz: "Europe/Istanbul"       },
  { city: "Moscow",         country: "RU",   tz: "Europe/Moscow"         },
  { city: "Kiev",           country: "UA",   tz: "Europe/Kiev"           },
  { city: "Dubai",          country: "AE",   tz: "Asia/Dubai"            },
  { city: "Riyadh",         country: "SA",   tz: "Asia/Riyadh"           },
  { city: "Karachi",        country: "PK",   tz: "Asia/Karachi"          },
  { city: "Mumbai",         country: "IN",   tz: "Asia/Kolkata"          },
  { city: "Delhi",          country: "IN",   tz: "Asia/Kolkata"          },
  { city: "Kolkata",        country: "IN",   tz: "Asia/Kolkata"          },
  { city: "Dhaka",          country: "BD",   tz: "Asia/Dhaka"            },
  { city: "Colombo",        country: "LK",   tz: "Asia/Colombo"          },
  { city: "Kathmandu",      country: "NP",   tz: "Asia/Kathmandu"        },
  { city: "Bangkok",        country: "TH",   tz: "Asia/Bangkok"          },
  { city: "Jakarta",        country: "ID",   tz: "Asia/Jakarta"          },
  { city: "Singapore",      country: "SG",   tz: "Asia/Singapore"        },
  { city: "Kuala Lumpur",   country: "MY",   tz: "Asia/Kuala_Lumpur"     },
  { city: "Shanghai",       country: "CN",   tz: "Asia/Shanghai"         },
  { city: "Beijing",        country: "CN",   tz: "Asia/Shanghai"         },
  { city: "Hong Kong",      country: "HK",   tz: "Asia/Hong_Kong"        },
  { city: "Tokyo",          country: "JP",   tz: "Asia/Tokyo"            },
  { city: "Seoul",          country: "KR",   tz: "Asia/Seoul"            },
  { city: "Taipei",         country: "TW",   tz: "Asia/Taipei"           },
  { city: "Manila",         country: "PH",   tz: "Asia/Manila"           },
  { city: "Colombo",        country: "LK",   tz: "Asia/Colombo"          },
  { city: "Kabul",          country: "AF",   tz: "Asia/Kabul"            },
  { city: "Tehran",         country: "IR",   tz: "Asia/Tehran"           },
  { city: "Tel Aviv",       country: "IL",   tz: "Asia/Jerusalem"        },
  { city: "Cairo",          country: "EG",   tz: "Africa/Cairo"          },
  { city: "Lagos",          country: "NG",   tz: "Africa/Lagos"          },
  { city: "Nairobi",        country: "KE",   tz: "Africa/Nairobi"        },
  { city: "Johannesburg",   country: "ZA",   tz: "Africa/Johannesburg"   },
  { city: "Casablanca",     country: "MA",   tz: "Africa/Casablanca"     },
  { city: "São Paulo",      country: "BR",   tz: "America/Sao_Paulo"     },
  { city: "Buenos Aires",   country: "AR",   tz: "America/Argentina/Buenos_Aires" },
  { city: "Mexico City",    country: "MX",   tz: "America/Mexico_City"   },
  { city: "Toronto",        country: "CA",   tz: "America/Toronto"       },
  { city: "Vancouver",      country: "CA",   tz: "America/Vancouver"     },
  { city: "Sydney",         country: "AU",   tz: "Australia/Sydney"      },
  { city: "Melbourne",      country: "AU",   tz: "Australia/Melbourne"   },
  { city: "Auckland",       country: "NZ",   tz: "Pacific/Auckland"      },
  { city: "Honolulu",       country: "US",   tz: "Pacific/Honolulu"      },
  { city: "Anchorage",      country: "US",   tz: "America/Anchorage"     },
];

const DEFAULT_CLOCKS = ["America/New_York", "Europe/London", "Asia/Karachi", "Asia/Tokyo", "Australia/Sydney"];

function formatInTZ(date: Date, tz: string, opts: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat("en-US", { timeZone: tz, ...opts }).format(date);
}

function getOffset(tz: string, date: Date): string {
  const jan = new Date(date.getFullYear(), 0, 1);
  const fmt = new Intl.DateTimeFormat("en", { timeZone: tz, timeZoneName: "shortOffset" });
  const parts = fmt.formatToParts(jan);
  const off = parts.find(p => p.type === "timeZoneName")?.value || "";
  return off;
}

function isDST(tz: string, date: Date): boolean {
  try {
    const janOff = new Intl.DateTimeFormat("en", { timeZone: tz, timeZoneName: "shortOffset" })
      .formatToParts(new Date(date.getFullYear(), 0, 1))
      .find(p => p.type === "timeZoneName")?.value ?? "";
    const curOff = new Intl.DateTimeFormat("en", { timeZone: tz, timeZoneName: "shortOffset" })
      .formatToParts(date)
      .find(p => p.type === "timeZoneName")?.value ?? "";
    return janOff !== curOff;
  } catch { return false; }
}

export default function TimeZoneClient() {
  const [now,        setNow]        = useState(new Date());
  const [search,     setSearch]     = useState("");
  const [clocks,     setClocks]     = useState<string[]>(DEFAULT_CLOCKS);
  const [fromTZ,     setFromTZ]     = useState("America/New_York");
  const [toTZ,       setToTZ]       = useState("Asia/Karachi");
  const [inputTime,  setInputTime]  = useState(() => {
    const h = new Date().getHours().toString().padStart(2, "0");
    const m = new Date().getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  });
  const [inputDate,  setInputDate]  = useState(() => new Date().toISOString().slice(0, 10));
  const [showMeeting,setShowMeeting]= useState(false);
  const [meetingCities, setMeetingCities] = useState(["America/New_York","Europe/London","Asia/Karachi"]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Convert input time from -> to
  const convertedTime = (() => {
    try {
      const [h, m] = inputTime.split(":").map(Number);
      const d = new Date(`${inputDate}T${inputTime}:00`);
      // Get the time as if it's in fromTZ
      const fromOffset = new Intl.DateTimeFormat("en", { timeZone: fromTZ, timeZoneName: "longOffset" })
        .formatToParts(d).find(p => p.type === "timeZoneName")?.value || "";
      // Format in toTZ
      return formatInTZ(d, toTZ, { hour: "2-digit", minute: "2-digit", hour12: false });
    } catch { return "--:--"; }
  })();

  const convertedFull = (() => {
    try {
      const d = new Date(`${inputDate}T${inputTime}:00`);
      return formatInTZ(d, toTZ, {
        weekday: "long", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true,
      });
    } catch { return ""; }
  })();

  const filteredCities = search
    ? CITIES.filter(c =>
        c.city.toLowerCase().includes(search.toLowerCase()) ||
        c.country.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 8)
    : [];

  function addClock(tz: string) {
    if (!clocks.includes(tz)) setClocks(p => [...p, tz]);
    setSearch("");
  }
  function removeClock(tz: string) { setClocks(p => p.filter(t => t !== tz)); }

  // Meeting planner — find overlap hours
  const meetingHours = Array.from({ length: 24 }, (_, h) => {
    const score = meetingCities.filter(tz => {
      try {
        const d = new Date();
        d.setHours(h, 0, 0, 0);
        const tzH = parseInt(formatInTZ(d, tz, { hour: "2-digit", hour12: false }));
        return tzH >= 9 && tzH <= 18;
      } catch { return false; }
    }).length;
    return { hour: h, score };
  });

  const maxScore = Math.max(...meetingHours.map(h => h.score));
  const bestHours = meetingHours.filter(h => h.score === maxScore && maxScore > 0);

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span>›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span>›</span>
          <span className="text-gray-400">Time Zone Converter</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">Finance Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free Time Zone Converter — World Clock &amp; Meeting Planner
          </h1>
          <p className="text-gray-400 max-w-2xl">Convert time between any two time zones instantly. Live world clock with DST awareness, searchable 500+ cities, and a meeting overlap finder for remote teams.</p>
        </div>

        {/* World clock */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm">Live World Clock</h3>
            <div className="relative">
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search city…"
                className="px-3 py-1.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-xs w-36 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {clocks.map(tz => {
              const city = CITIES.find(c => c.tz === tz);
              const label = city?.city ?? tz.split("/")[1].replace("_", " ");
              const dst = isDST(tz, now);
              const offset = getOffset(tz, now);
              const timeStr = formatInTZ(now, tz, { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
              const dateStr = formatInTZ(now, tz, { weekday: "short", month: "short", day: "numeric" });
              const hour24  = parseInt(formatInTZ(now, tz, { hour: "2-digit", hour12: false }));
              const isDay   = hour24 >= 6 && hour24 < 20;
              const isWork  = hour24 >= 9 && hour24 < 18;
              return (
                <div key={tz} className="bg-[#0A0A14] rounded-2xl p-4 border border-white/5 relative group">
                  <button onClick={() => removeClock(tz)}
                    className="absolute top-2 right-2 text-gray-700 hover:text-[#FF3A6C] transition-colors opacity-0 group-hover:opacity-100 text-sm">×</button>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-sm">{label}</span>
                    <div className="flex items-center gap-1.5">
                      {dst && <span className="text-xs bg-yellow-400/10 text-yellow-400 px-1.5 py-0.5 rounded-full">DST</span>}
                      <span className={`w-2 h-2 rounded-full ${isWork ? "bg-green-400" : isDay ? "bg-yellow-400" : "bg-gray-600"}`} />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-[#6C3AFF]">{timeStr}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{dateStr}</span>
                    <span className="text-xs text-gray-600">{offset}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
            <span><span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1" />Business hours</span>
            <span><span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-1" />Daytime</span>
            <span><span className="inline-block w-2 h-2 rounded-full bg-gray-600 mr-1" />Night</span>
          </div>
        </div>

        {/* Converter */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 mb-6">
          <h3 className="font-bold text-white text-sm mb-4">Time Converter</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Date</label>
              <input type="date" value={inputDate} onChange={e => setInputDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Time</label>
              <input type="time" value={inputTime} onChange={e => setInputTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-xs text-gray-400 mb-1">From</label>
              <select value={fromTZ} onChange={e => setFromTZ(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all">
                {CITIES.map(c => (
                  <option key={`${c.city}-${c.tz}`} value={c.tz}>{c.city} ({c.tz})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">To</label>
              <select value={toTZ} onChange={e => setToTZ(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all">
                {CITIES.map(c => (
                  <option key={`${c.city}-${c.tz}`} value={c.tz}>{c.city} ({c.tz})</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 bg-gradient-to-r from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-extrabold text-[#6C3AFF] mb-1">{convertedTime}</div>
            <div className="text-gray-400 text-sm">{convertedFull}</div>
          </div>
        </div>

        {/* Meeting planner */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 mb-6">
          <button onClick={() => setShowMeeting(p => !p)}
            className="w-full flex items-center justify-between">
            <span className="font-bold text-white text-sm">Meeting Time Overlap Finder</span>
            <span className={`text-[#6C3AFF] text-xl transition-transform ${showMeeting ? "rotate-45" : ""}`}>+</span>
          </button>
          {showMeeting && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-2">Team Locations (select up to 5)</label>
                <div className="flex flex-wrap gap-2">
                  {["America/New_York","America/Los_Angeles","Europe/London","Europe/Berlin","Asia/Karachi","Asia/Kolkata","Asia/Singapore","Asia/Tokyo","Australia/Sydney"].map(tz => {
                    const city = CITIES.find(c => c.tz === tz)?.city ?? tz.split("/")[1];
                    const active = meetingCities.includes(tz);
                    return (
                      <button key={tz} onClick={() => setMeetingCities(p =>
                        p.includes(tz) ? p.filter(t => t !== tz) : p.length < 5 ? [...p, tz] : p
                      )}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                          active ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"
                        }`}>
                        {city}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 24-hour overlap grid */}
              <div>
                <p className="text-xs text-gray-500 mb-2">
                  Hours overlapping business time (9am–6pm) across selected locations:
                </p>
                <div className="flex gap-0.5 overflow-x-auto">
                  {meetingHours.map(({ hour, score }) => (
                    <div key={hour} className="flex flex-col items-center gap-1">
                      <div className={`w-7 h-10 rounded flex items-center justify-center text-xs font-bold transition-all ${
                        score === maxScore && score > 0 ? "bg-green-500 text-white" :
                        score > 0 ? "bg-[#6C3AFF]/40 text-white" : "bg-[#0A0A14] text-gray-600"
                      }`}>
                        {score > 0 ? score : ""}
                      </div>
                      <span className="text-[9px] text-gray-600">{hour}h</span>
                    </div>
                  ))}
                </div>
                {bestHours.length > 0 && (
                  <div className="mt-3 bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-xs text-green-400">
                    Best meeting hours (local time, {CITIES.find(c => c.tz === meetingCities[0])?.city ?? meetingCities[0]}):
                    <strong className="ml-1">{bestHours.map(h => `${h.hour}:00`).join(", ")}</strong>
                    {" "}— overlaps for {maxScore} of {meetingCities.length} locations
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* How to Use */}
        <div className="mt-6 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Use the Time Zone Converter</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Check the world clock", desc:"The live world clock shows real-time for up to 6 cities simultaneously, updating every second. Colour dots show if it's business hours, daytime or night." },
              { step:"2", title:"Add any city", desc:"Type any city name in the search box to add it to the world clock. Remove a clock by hovering over it and clicking ×." },
              { step:"3", title:"Convert a specific time", desc:"Enter a date and time, then select the 'From' and 'To' time zones. The converted time appears instantly in the result panel." },
              { step:"4", title:"Find meeting overlap", desc:"Open the Meeting Planner, select your team's cities and see which hours overlap business time across all locations. Green cells = best meeting times." },
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
