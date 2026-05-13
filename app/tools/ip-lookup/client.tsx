"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ── Schema ──────────────────────────────────────────────────────────────── */
const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "IP Address Lookup",
  description: "Advanced free IP lookup with risk score, ISP classification, reverse DNS, live clock and comparison mode.",
  url: "https://www.purstech.com/tools/ip-lookup",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

/* ── Rich FAQ ────────────────────────────────────────────────────────────── */
const FAQ = [
  {
    q: "What can an IP address reveal — and what can't it reveal?",
    a: `An IP lookup tells you:
• Geographic location: country (near 100% accurate), region/state (~80%), city (~60-70%), and approximate coordinates
• Network: the Internet Service Provider, organisation name, Autonomous System Number (ASN) and CIDR range
• Connection context: timezone, whether the IP is residential, business, mobile, datacenter or VPN
• Hostname: reverse DNS (PTR record) often reveals the server or ISP infrastructure name

What an IP lookup CANNOT reveal:
• Your real name, home address, email or phone number
• Precise street-level location — city is the finest reliable grain
• Identity behind a VPN or proxy — it shows the exit node, not you
• What you did online or which sites you visited

Only your ISP can link an IP to a specific subscriber, and they only do so under a court order or law enforcement request. IP geolocation databases are maintained by companies like MaxMind and are updated continuously, but accuracy varies by region and ISP.`,
  },
  {
    q: "Why is my IP showing the wrong location, and can I fix it?",
    a: `Several legitimate reasons explain a location mismatch:

1. ISP routing hub: Your ISP assigns your IP from a regional pool registered to a city that may be hundreds of kilometres from you. This is the most common reason — your IP is "from" the ISP's nearest data centre, not your physical location.

2. Mobile networks: Carriers like Verizon, T-Mobile and AT&T route all mobile traffic through centralised gateways, so your IP appears to originate from the gateway city.

3. Corporate VPN or proxy: If your device connects through a company network, the IP shown is your company's egress IP, not your local connection.

4. Stale database: Geolocation databases are updated regularly but not in real time. A recently reassigned IP block may still show old location data for days or weeks.

Can you fix it? If you're a business and your IP shows wrong location data, you can submit a correction request to MaxMind, IP2Location and ipinfo.io — they maintain the major databases used by most tools. Home users generally cannot influence their IP's registered location, as that's controlled by the ISP.`,
  },
  {
    q: "What is reverse DNS and why does it matter?",
    a: `Reverse DNS (rDNS) is the process of mapping an IP address back to a hostname, using PTR records in the Domain Name System. While regular DNS maps hostname → IP, reverse DNS maps IP → hostname.

Why it matters in practice:
• Server identification: A reverse DNS lookup on a mail server IP often returns the server's hostname (e.g. mail.example.com), which is critical for email deliverability. Many mail servers reject messages from IPs without a valid PTR record.
• Network investigation: When you see an unfamiliar IP in access logs, rDNS often reveals whether it belongs to a search engine bot (crawl.googlebot.com), a CDN node (cloudflare.com), or an ISP's infrastructure.
• Security research: Reverse DNS names can reveal VPN providers, hosting companies and suspicious infrastructure patterns.
• ISP verification: ISPs configure rDNS for their customer IP ranges. A residential Comcast IP might resolve to c-67-165-1-1.hsd1.pa.comcast.net — confirming the ISP assignment.

Our tool uses Google's DNS-over-HTTPS API (dns.google) to perform PTR lookups, which is reliable, fast and works without any API key.`,
  },
  {
    q: "What does the ISP type classification mean?",
    a: `Our tool classifies every IP address into one of five ISP types based on the organisation name and ASN:

🏠 Residential ISP — A standard home internet connection (Comcast, BT, Deutsche Telekom, etc.). Low risk score. Most e-commerce customers come from this category.

🏢 Business ISP — A corporate leased line or business broadband. Slightly elevated risk as bots and scrapers may use business IPs, but most are legitimate.

📱 Mobile Network — A cellular carrier's IP pool (Verizon Wireless, Vodafone Mobile, etc.). Low risk. IP location accuracy is lower because mobile IPs are pooled nationally.

☁️ Cloud Hosting — A datacenter or cloud provider IP (AWS, Google Cloud, Azure, DigitalOcean, Hetzner, OVH, etc.). Medium-high risk. Real users rarely have datacenter IPs — this category is common for bots, scrapers, and server-based automation.

🔴 VPN Provider — An IP belonging to a known VPN service (NordVPN, ExpressVPN, etc.). High risk. The actual user's location and identity are concealed.

This classification is more actionable than a raw ISP name — it tells you what kind of entity is behind the connection, which is what fraud prevention, marketing and security teams actually need to know.`,
  },
  {
    q: "How do I use the comparison mode and what can it tell me?",
    a: `The comparison mode lets you analyse two IP addresses simultaneously and see their attributes displayed side by side. This is useful in several scenarios:

Before/after VPN: Look up your IP without and with a VPN to confirm the VPN is masking your real location and ISP correctly.

Suspicious logins: A user logs in from IP A (their usual location) and 10 minutes later from IP B (different country). Comparing both IPs shows whether this is physically possible — the "impossible travel" fraud detection technique.

Server vs client debugging: Compare your own IP with a server IP to understand the routing context between them.

CDN verification: Check whether traffic is being served from the expected CDN PoP for a given region.

Traffic analysis: In web analytics, compare the ISP types of two audience segments to understand whether one is disproportionately bot or datacenter traffic.

To use it: switch to the Compare tab, enter two IPs (or click "Use My IP" for either field), and click Compare. Differences between the two results are highlighted in the output.`,
  },
];

/* ── Types ───────────────────────────────────────────────────────────────── */
interface IPData {
  ip: string; city: string; region: string; region_code: string;
  country: string; country_name: string; country_code: string; country_code_iso3: string;
  country_capital: string; continent_code: string; in_eu: boolean;
  postal: string; latitude: number; longitude: number;
  timezone: string; utc_offset: string; country_calling_code: string;
  currency: string; currency_name: string; languages: string;
  country_area: number; country_population: number;
  asn: string; org: string; network: string;
  error?: boolean; reason?: string;
}

type TabMode = "single" | "compare" | "batch";

/* ── ISP Classification ──────────────────────────────────────────────────── */
const VPN_KEYWORDS  = ["nordvpn","expressvpn","surfshark","mullvad","protonvpn","ipvanish",
  "cyberghost","private internet access","windscribe","tunnelbear","hotspot shield",
  "pia vpn","hidemyass","ivacy","vyprvpn","astrill","strongvpn"];
const CLOUD_KEYWORDS = ["amazon","aws","google cloud","microsoft azure","digitalocean","linode",
  "vultr","ovh","hetzner","cloudflare","fastly","akamai","rackspace","ibm cloud",
  "oracle cloud","alibaba cloud","tencent cloud","scaleway","upcloud","leaseweb"];
const MOBILE_KEYWORDS = ["mobile","wireless","cellular","gsm","t-mobile","verizon wireless",
  "at&t mobility","sprint","vodafone mobile","o2 mobile","three mobile","ee limited"];

function classifyISP(org: string) {
  const o = (org ?? "").toLowerCase();
  if (VPN_KEYWORDS.some(k => o.includes(k)))
    return { type:"VPN Provider",    icon:"🔴", color:"text-red-400",    badge:"bg-red-400/10 border-red-400/20",    riskBase: 80 };
  if (CLOUD_KEYWORDS.some(k => o.includes(k)))
    return { type:"Cloud Hosting",   icon:"☁️",  color:"text-orange-400", badge:"bg-orange-400/10 border-orange-400/20", riskBase: 50 };
  if (MOBILE_KEYWORDS.some(k => o.includes(k)))
    return { type:"Mobile Network",  icon:"📱", color:"text-blue-400",   badge:"bg-blue-400/10 border-blue-400/20",   riskBase: 5  };
  if (o.includes("business") || o.includes("enterprise") || o.includes("corp"))
    return { type:"Business ISP",    icon:"🏢", color:"text-cyan-400",   badge:"bg-cyan-400/10 border-cyan-400/20",   riskBase: 15 };
  return   { type:"Residential ISP", icon:"🏠", color:"text-green-400",  badge:"bg-green-400/10 border-green-400/20", riskBase: 5  };
}

function calcRisk(isp: ReturnType<typeof classifyISP>, org: string) {
  let score = isp.riskBase;
  const o = (org ?? "").toLowerCase();
  if (o.includes("tor") || o.includes("anonymiz") || o.includes("onion")) score = 95;
  if (o.includes("proxy") || o.includes("socks"))                          score = Math.max(score, 70);
  score = Math.min(100, Math.max(0, score));
  const label = score < 25 ? "Low" : score < 60 ? "Medium" : score < 80 ? "High" : "Very High";
  const color = score < 25 ? "#22c55e" : score < 60 ? "#f59e0b" : "#ef4444";
  return { score, label, color };
}

/* ── Risk Gauge SVG ─────────────────────────────────────────────────────── */
function RiskGauge({ score, color }: { score: number; color: string }) {
  const r   = 38;
  const circ = 2 * Math.PI * r;
  const arc  = (score / 100) * circ;
  return (
    <svg viewBox="0 0 100 100" className="w-28 h-28">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#1a1a2e" strokeWidth="11" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="11"
        strokeDasharray={`${arc} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 50 50)" style={{ transition:"stroke-dasharray 0.6s ease" }} />
      <text x="50" y="46" textAnchor="middle" fill={color} fontSize="20" fontWeight="800" fontFamily="monospace">{score}</text>
      <text x="50" y="58" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="sans-serif">RISK SCORE</text>
    </svg>
  );
}

/* ── Live Clock ─────────────────────────────────────────────────────────── */
function LiveClock({ timezone }: { timezone: string }) {
  const [time, setTime] = useState("--:--:--");
  const [date, setDate] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-GB", { timeZone: timezone, hour12: false }));
      setDate(now.toLocaleDateString("en-GB", { timeZone: timezone, weekday:"short", day:"numeric", month:"short" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timezone]);
  return (
    <div className="text-center">
      <div className="text-3xl font-black text-white font-mono tracking-wider">{time}</div>
      <div className="text-xs text-gray-500 mt-1">{date}</div>
      <div className="text-xs text-gray-600 mt-0.5">{timezone}</div>
    </div>
  );
}

/* ── Country Flag ──────────────────────────────────────────────────────── */
const Flag = ({ code }: { code: string }) =>
  code ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`https://flagcdn.com/32x24/${code.toLowerCase()}.png`} alt={code}
      className="rounded-sm inline-block" width={32} height={24} />
  ) : null;

/* ── Helpers ────────────────────────────────────────────────────────────── */
async function fetchIPData(ip = ""): Promise<IPData> {
  const url = ip ? `https://ipapi.co/${ip}/json/` : "https://ipapi.co/json/";
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  return res.json();
}

async function reverseDNS(ip: string): Promise<string | null> {
  try {
    const parts   = ip.split(".");
    if (parts.length !== 4) return null;
    const reversed = [...parts].reverse().join(".");
    const res = await fetch(`https://dns.google/resolve?name=${reversed}.in-addr.arpa&type=PTR`);
    const data = await res.json();
    return data.Answer?.[0]?.data?.replace(/\.$/, "") ?? null;
  } catch { return null; }
}

const fmtPop = (n: number) => {
  if (!n) return "—";
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  return n.toLocaleString();
};

/* ── Main Component ─────────────────────────────────────────────────────── */
export default function IPLookupClient({ children }: { children?: React.ReactNode }) {
  const [tab,           setTab]           = useState<TabMode>("single");
  const [query,         setQuery]         = useState("");
  const [loading,       setLoading]       = useState(false);
  const [result,        setResult]        = useState<IPData | null>(null);
  const [rdns,          setRdns]          = useState<string | null>(null);
  const [ownIP,         setOwnIP]         = useState<IPData | null>(null);
  const [error,         setError]         = useState("");
  const [copied,        setCopied]        = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [history,       setHistory]       = useState<IPData[]>([]);

  // Compare mode
  const [cmpQuery1, setCmpQuery1] = useState("");
  const [cmpQuery2, setCmpQuery2] = useState("");
  const [cmpResult1,setCmpResult1]= useState<IPData | null>(null);
  const [cmpResult2,setCmpResult2]= useState<IPData | null>(null);
  const [cmpLoading, setCmpLoading] = useState(false);

  // Batch mode
  const [batchText,    setBatchText]    = useState("");
  const [batchResults, setBatchResults] = useState<IPData[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);

  // Load history from localStorage + handle ?ip= URL param + auto-own-IP
  useEffect(() => {
    const saved = localStorage.getItem("ip-lookup-history");
    if (saved) { try { setHistory(JSON.parse(saved)); } catch {} }

    const params = new URLSearchParams(window.location.search);
    const ipParam = params.get("ip");
    if (ipParam) { setQuery(ipParam); lookup(ipParam); }
    else { fetchIPData("").then(d => { if (!d.error) setOwnIP(d); }).catch(() => {}); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveToHistory = useCallback((data: IPData) => {
    setHistory(prev => {
      const updated = [data, ...prev.filter(r => r.ip !== data.ip)].slice(0, 10);
      localStorage.setItem("ip-lookup-history", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const lookup = useCallback(async (ip?: string) => {
    const target = (ip ?? query).trim();
    setLoading(true); setError(""); setResult(null); setRdns(null);
    try {
      const [data, hostname] = await Promise.all([
        fetchIPData(target),
        target ? reverseDNS(target) : Promise.resolve(null),
      ]);
      if (data.error) { setError(data.reason ?? "Lookup failed — check the IP format."); }
      else {
        setResult(data);
        setRdns(hostname);
        saveToHistory(data);
        // Update URL without reload
        const url = new URL(window.location.href);
        url.searchParams.set("ip", data.ip);
        window.history.replaceState({}, "", url.toString());
      }
    } catch { setError("Request failed — check your connection."); }
    setLoading(false);
  }, [query, saveToHistory]);

  const compare = async () => {
    if (!cmpQuery1.trim() || !cmpQuery2.trim()) return;
    setCmpLoading(true); setCmpResult1(null); setCmpResult2(null);
    const [r1, r2] = await Promise.all([
      fetchIPData(cmpQuery1.trim()),
      fetchIPData(cmpQuery2.trim()),
    ]);
    if (!r1.error) setCmpResult1(r1);
    if (!r2.error) setCmpResult2(r2);
    setCmpLoading(false);
  };

  const lookupBatch = async () => {
    const ips = batchText.trim().split("\n").map(s => s.trim()).filter(Boolean).slice(0, 10);
    if (!ips.length) return;
    setBatchLoading(true); setBatchResults([]);
    const results: IPData[] = [];
    for (const ip of ips) {
      try { results.push(await fetchIPData(ip)); } catch {}
      await new Promise(r => setTimeout(r, 350));
    }
    setBatchResults(results);
    setBatchLoading(false);
  };

  const copyJSON = (data: IPData) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied("json"); setTimeout(() => setCopied(null), 1500);
  };

  const shareURL = (ip: string) => {
    const url = `${window.location.origin}/tools/ip-lookup?ip=${ip}`;
    navigator.clipboard.writeText(url);
    setCopied("share"); setTimeout(() => setCopied(null), 1500);
  };

  const display  = result ?? ownIP;
  const isOwn    = !result && !!ownIP;

  /* ── Single result card ─────────────────────────────────────────────── */
  const ResultCard = ({ data, rdnsHost, isOwnIP = false }: { data: IPData; rdnsHost?: string | null; isOwnIP?: boolean }) => {
    const ispInfo  = classifyISP(data.org);
    const riskInfo = calcRisk(ispInfo, data.org);
    return (
      <div className="space-y-4">
        {/* Top row: Risk gauge + Location + Network */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Risk Score */}
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center gap-3">
            <RiskGauge score={riskInfo.score} color={riskInfo.color} />
            <div className={`text-sm font-bold px-3 py-1 rounded-full border ${
              riskInfo.score < 25 ? "bg-green-400/10 border-green-400/20 text-green-400" :
              riskInfo.score < 60 ? "bg-yellow-400/10 border-yellow-400/20 text-yellow-400" :
              "bg-red-400/10 border-red-400/20 text-red-400"
            }`}>{riskInfo.label} Risk</div>
            {/* ISP type badge */}
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${ispInfo.badge}`}>
              <span>{ispInfo.icon}</span>
              <span className={ispInfo.color}>{ispInfo.type}</span>
            </div>
          </div>

          {/* Location */}
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              {data.country_code && <Flag code={data.country_code} />}
              <span className="text-lg font-black text-[#00D4FF] font-mono">{data.ip}</span>
              {isOwnIP && <span className="text-xs bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 px-2 py-0.5 rounded-full">Your IP</span>}
            </div>
            {[
              { label:"Country",  value:`${data.country_name} (${data.country_code})` },
              { label:"Region",   value:`${data.region} (${data.region_code})`         },
              { label:"City",     value: data.city     || "—"                          },
              { label:"Postal",   value: data.postal   || "—"                          },
              { label:"Coords",   value:`${data.latitude}, ${data.longitude}`          },
            ].map(r => (
              <div key={r.label} className="flex justify-between py-1.5 border-b border-white/5 last:border-0 gap-2">
                <span className="text-xs text-gray-500 flex-shrink-0">{r.label}</span>
                <span className="text-xs font-semibold text-white text-right truncate">{r.value}</span>
              </div>
            ))}
            <a href={`https://www.google.com/maps?q=${data.latitude},${data.longitude}`}
              target="_blank" rel="noopener noreferrer"
              className="mt-3 flex items-center gap-1 text-xs text-[#00D4FF] hover:underline">
              📍 Open in Google Maps →
            </a>
          </div>

          {/* Network */}
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Network</h3>
            {[
              { label:"ISP / Org",  value: data.org      || "—" },
              { label:"ASN",        value: data.asn       || "—" },
              { label:"CIDR Range", value: data.network   || "—" },
            ].map(r => (
              <div key={r.label} className="py-1.5 border-b border-white/5 last:border-0">
                <div className="text-xs text-gray-500">{r.label}</div>
                <div className="text-xs font-semibold text-white font-mono truncate" title={r.value}>{r.value}</div>
              </div>
            ))}
            {rdnsHost && (
              <div className="mt-3 p-2.5 bg-[#0A0A14] rounded-xl border border-white/5">
                <div className="text-xs text-gray-500 mb-0.5">Reverse DNS</div>
                <div className="text-xs text-[#00D4FF] font-mono truncate" title={rdnsHost}>{rdnsHost}</div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom row: Live Clock + Country Deep Dive + Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Live Clock */}
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center gap-2">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Local Time at IP</div>
            {data.timezone ? (
              <LiveClock timezone={data.timezone} />
            ) : (
              <div className="text-gray-600 text-sm">Timezone unknown</div>
            )}
            <div className="text-xs text-gray-600 mt-1">UTC {data.utc_offset}</div>
          </div>

          {/* Country Deep Dive */}
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Country Details</h3>
            {[
              { label:"Capital",      value: data.country_capital            || "—" },
              { label:"Population",   value: fmtPop(data.country_population)       },
              { label:"Calling Code", value: data.country_calling_code       || "—" },
              { label:"Currency",     value:`${data.currency_name} (${data.currency})` || "—" },
              { label:"EU Member",    value: data.in_eu ? "Yes ✓" : "No"           },
              { label:"Language",     value:(data.languages ?? "").split(",")[0]   || "—" },
            ].map(r => (
              <div key={r.label} className="flex justify-between py-1.5 border-b border-white/5 last:border-0">
                <span className="text-xs text-gray-500">{r.label}</span>
                <span className={`text-xs font-semibold ${r.value.includes("Yes") ? "text-green-400" : "text-white"}`}>{r.value}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 flex flex-col justify-between gap-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</h3>
            <div className="space-y-2">
              <button onClick={() => shareURL(data.ip)}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all border ${
                  copied === "share"
                    ? "bg-green-600 text-white border-transparent"
                    : "bg-[#0A0A14] border-white/10 text-gray-300 hover:text-white hover:border-[#00D4FF]/30"
                }`}>
                {copied === "share" ? "✓ Link Copied!" : "🔗 Copy Share URL"}
              </button>

              <button onClick={() => copyJSON(data)}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all border ${
                  copied === "json"
                    ? "bg-green-600 text-white border-transparent"
                    : "bg-[#0A0A14] border-white/10 text-gray-300 hover:text-white hover:border-[#00D4FF]/30"
                }`}>
                {copied === "json" ? "✓ JSON Copied!" : "{ } Copy as JSON"}
              </button>

              <a href={`https://bgp.he.net/${data.asn}`} target="_blank" rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl text-sm font-bold bg-[#0A0A14] border border-white/10 text-gray-300 hover:text-white transition-all flex items-center justify-center gap-1">
                🌐 View ASN on BGP.he.net →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ── Compare columns ─────────────────────────────────────────────────── */
  const CmpCol = ({ data }: { data: IPData }) => {
    const ispInfo  = classifyISP(data.org);
    const riskInfo = calcRisk(ispInfo, data.org);
    return (
      <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          {data.country_code && <Flag code={data.country_code} />}
          <span className="font-black text-[#00D4FF] font-mono text-sm">{data.ip}</span>
        </div>
        <div className="flex items-center gap-2">
          <RiskGauge score={riskInfo.score} color={riskInfo.color} />
          <div>
            <div className={`text-xs font-bold ${ispInfo.color}`}>{ispInfo.icon} {ispInfo.type}</div>
            <div className="text-xs text-gray-500 mt-0.5">{riskInfo.label} Risk ({riskInfo.score}/100)</div>
          </div>
        </div>
        {[
          { label:"Country",  value:`${data.country_name}` },
          { label:"City",     value: data.city || "—"       },
          { label:"ISP",      value: data.org  || "—"       },
          { label:"ASN",      value: data.asn  || "—"       },
          { label:"Timezone", value: data.timezone || "—"  },
        ].map(r => (
          <div key={r.label} className="flex justify-between border-b border-white/5 pb-1.5 last:border-0">
            <span className="text-xs text-gray-500">{r.label}</span>
            <span className="text-xs font-semibold text-white text-right max-w-[60%] truncate">{r.value}</span>
          </div>
        ))}
      </div>
    );
  };

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">← All Tools</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span>›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span>›</span>
          <span className="text-gray-400">IP Lookup</span>
        </nav>

        {children}

        {/* ── Mode tabs ─────────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-[#13131F] border border-white/5 p-1 rounded-xl w-fit mb-6">
          {([["single","🔍 Single IP"],["compare","⚖️ Compare 2 IPs"],["batch","📋 Batch (10)"]] as [TabMode,string][]).map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab===t ? "bg-[#00D4FF] text-black" : "text-gray-400 hover:text-white"}`}>
              {l}
            </button>
          ))}
        </div>

        {/* ── Single mode ───────────────────────────────────────────────── */}
        {tab === "single" && (
          <>
            <div className="flex gap-2 mb-4">
              <input value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && lookup()}
                placeholder="Enter any IP address — or leave blank for your own IP"
                className="flex-1 px-4 py-3 rounded-xl bg-[#13131F] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#00D4FF]/50 transition-all" />
              <button onClick={() => lookup()} disabled={loading}
                className="px-6 py-3 rounded-xl bg-[#00D4FF] hover:bg-[#00b8d9] disabled:opacity-50 text-black font-extrabold text-sm transition-all min-w-[80px]">
                {loading ? "…" : "Lookup"}
              </button>
            </div>

            {/* Quick picks */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs text-gray-600 self-center">Examples:</span>
              {["8.8.8.8","1.1.1.1","208.67.222.222","9.9.9.9"].map(ip => (
                <button key={ip} onClick={() => { setQuery(ip); lookup(ip); }}
                  className="px-3 py-1.5 rounded-lg bg-[#13131F] border border-white/5 text-gray-400 text-xs font-mono hover:text-white hover:border-[#00D4FF]/30 transition-all">
                  {ip}
                </button>
              ))}
              {ownIP && (
                <button onClick={() => { setQuery(""); lookup(""); }}
                  className="px-3 py-1.5 rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-xs font-bold hover:bg-[#00D4FF]/20 transition-all">
                  My IP ({ownIP.ip})
                </button>
              )}
            </div>

            {error && <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 mb-4">{error}</div>}

            {loading && (
              <div className="text-center py-14">
                <div className="text-4xl animate-pulse mb-3">🌐</div>
                <div className="text-sm text-gray-400">Looking up <span className="font-mono text-white">{query || "your IP"}</span>…</div>
              </div>
            )}

            {display && !loading && (
              <ResultCard data={display} rdnsHost={rdns} isOwnIP={isOwn} />
            )}
          </>
        )}

        {/* ── Compare mode ─────────────────────────────────────────────── */}
        {tab === "compare" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[{v:cmpQuery1,s:setCmpQuery1,label:"IP Address 1"},{v:cmpQuery2,s:setCmpQuery2,label:"IP Address 2"}].map((f,i) => (
                <div key={i}>
                  <label className="block text-xs text-gray-500 mb-1.5 font-semibold">{f.label}</label>
                  <div className="flex gap-2">
                    <input value={f.v} onChange={e => f.s(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && compare()}
                      placeholder="e.g. 8.8.8.8"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#13131F] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#00D4FF]/50 transition-all" />
                    {ownIP && <button onClick={() => f.s(ownIP.ip)}
                      className="px-3 py-2 rounded-xl bg-[#13131F] border border-white/10 text-[#00D4FF] text-xs font-bold hover:border-[#00D4FF]/40 transition-all">
                      My IP
                    </button>}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={compare} disabled={cmpLoading || !cmpQuery1 || !cmpQuery2}
              className="w-full py-3 rounded-xl bg-[#00D4FF] hover:bg-[#00b8d9] disabled:opacity-50 text-black font-extrabold transition-all">
              {cmpLoading ? "Comparing…" : "⚖️ Compare IPs"}
            </button>

            {(cmpResult1 || cmpResult2) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cmpResult1 && <CmpCol data={cmpResult1} />}
                {cmpResult2 && <CmpCol data={cmpResult2} />}
              </div>
            )}
          </div>
        )}

        {/* ── Batch mode ───────────────────────────────────────────────── */}
        {tab === "batch" && (
          <div className="space-y-4">
            <textarea value={batchText} onChange={e => setBatchText(e.target.value)}
              placeholder={"Enter up to 10 IPs, one per line:\n8.8.8.8\n1.1.1.1\n..."}
              rows={8}
              className="w-full px-4 py-3 rounded-2xl bg-[#13131F] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#00D4FF]/50 resize-none transition-all" />
            <button onClick={lookupBatch} disabled={batchLoading || !batchText.trim()}
              className="w-full py-3 rounded-xl bg-[#00D4FF] hover:bg-[#00b8d9] disabled:opacity-50 text-black font-extrabold transition-all">
              {batchLoading ? "Looking up…" : "🔍 Lookup All"}
            </button>

            {batchResults.length > 0 && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500 border-b border-white/5">
                      {["IP","Country","City","ISP / Org","ASN","Type","Risk"].map(h => (
                        <th key={h} className="text-left px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {batchResults.map((r, i) => {
                      const ri = classifyISP(r.org);
                      const rk = calcRisk(ri, r.org);
                      return (
                        <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                          <td className="px-4 py-3 font-mono text-[#00D4FF]">{r.ip}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              {r.country_code && <Flag code={r.country_code} />}
                              <span>{r.country_name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">{r.city || "—"}</td>
                          <td className="px-4 py-3 max-w-[160px] truncate">{r.org || "—"}</td>
                          <td className="px-4 py-3 font-mono">{r.asn || "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold ${ri.color}`}>{ri.icon} {ri.type}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs font-bold" style={{ color: rk.color }}>{rk.label} ({rk.score})</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── How to Use ── */}
        <div className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Use the Advanced IP Lookup</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Auto-Detect", desc:"On page load, your own public IP address is detected and analyzed instantly." },
              { step:"2", title:"Single & Batch", desc:"Look up any IPv4/IPv6 address, or switch to Batch mode to analyze up to 10 IPs at once." },
              { step:"3", title:"Compare IPs", desc:"Use the Compare tab to view two IP addresses side-by-side for quick discrepancy checks." },
              { step:"4", title:"Share Results", desc:"Click 'Copy Share URL' to get a direct link to your specific IP lookup results." },
            ].map(s => (
              <div key={s.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#00D4FF] flex items-center justify-center text-black font-bold text-xs flex-shrink-0 mt-0.5">{s.step}</div>
                <div><div className="font-semibold text-white text-sm mb-1">{s.title}</div><div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div></div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#00D4FF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{f.q}</span>
                  <span className="text-[#00D4FF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">{f.a}</div>
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
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
