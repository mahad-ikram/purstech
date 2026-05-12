"use client";

import { useState } from "react";
import Link from "next/link";

/* ── JSON-LD (FAQPage lives here to avoid circular deps in page.tsx) ───────── */
const SCHEMA = {
  "@context":          "https://schema.org",
  "@type":             "SoftwareApplication",
  name:                "SSL Certificate Checker",
  description:         "Free online SSL certificate checker — security grade, expiry countdown, TLS version, cipher suite, certificate issuer and SANs.",
  url:                 "https://www.purstech.com/tools/ssl-checker",
  applicationCategory: "SecurityApplication",
  operatingSystem:     "Any",
  offers:              { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

/* ── Rich FAQ ─────────────────────────────────────────────────────────────── */
const FAQ = [
  {
    q: "What does each security grade (A+, A, B, C, D, F) mean?",
    a: `The grade is calculated from three factors: TLS protocol version, key strength and days remaining.

A+ (Best) — TLS 1.3, key ≥ 2048 bits, more than 30 days remaining. Optimal configuration. No action needed.

A — TLS 1.3 with a strong key but expiring within 30 days, or TLS 1.2 with strong key and >30 days. Excellent — consider scheduling renewal if expiry is near.

B — TLS 1.2 with a 2048-bit or stronger key. Still acceptable for most purposes but upgrading to TLS 1.3 is recommended for better performance (TLS 1.3 handshakes are ~40% faster).

C — TLS 1.2 with a weaker configuration or key under 2048 bits. Action recommended: contact your hosting provider to upgrade the TLS configuration and key size.

D — Certificate expires in under 7 days. Urgent action required: renew immediately to avoid visitor-blocking security warnings.

F — Certificate is expired, unreachable, or self-signed on a public domain. Visitors are seeing a browser security warning right now. Renew and reinstall the certificate immediately.`,
  },
  {
    q: "What is the difference between SSL and TLS, and which version should my site use?",
    a: `SSL (Secure Sockets Layer) was the original protocol for encrypting web connections, developed by Netscape in the 1990s. It was replaced by TLS (Transport Layer Security), which is the current standard. Despite this, the industry still calls digital certificates "SSL certificates" — a legacy naming convention.

Version history and status:
• SSL 2.0 (1995) — Retired. Critically vulnerable.
• SSL 3.0 (1996) — Retired. Vulnerable to POODLE attack.
• TLS 1.0 (1999) — Deprecated by all major browsers in 2020.
• TLS 1.1 (2006) — Deprecated by all major browsers in 2020.
• TLS 1.2 (2008) — Still widely supported and acceptable. Minimum standard.
• TLS 1.3 (2018) — Current best practice. Faster (1-RTT handshake vs 2-RTT), removes weak cipher options, mandatory forward secrecy.

You should target TLS 1.3 with TLS 1.2 as a fallback for legacy clients. TLS 1.0 and 1.1 should be disabled entirely on your server. Most modern hosting platforms (Cloudflare, Nginx, Apache with OpenSSL 1.1+) support TLS 1.3 by default.`,
  },
  {
    q: "My SSL certificate is expiring — what exact steps do I take to renew it?",
    a: `The renewal process depends on how your certificate was originally issued:

Let's Encrypt (free, 90-day certificates):
Most hosting panels (cPanel, Plesk, Cloudflare, Netlify, Vercel) handle Let's Encrypt renewals automatically via a cron job or ACME client. If it's not auto-renewing, run: certbot renew (on your server), or enable automatic renewal in your hosting panel settings.

Commercial certificates (DigiCert, Sectigo, Comodo, etc.):
1. Generate a new CSR (Certificate Signing Request) from your server or hosting panel.
2. Submit the CSR to your certificate authority and complete domain validation.
3. Download the issued certificate files (.crt + .ca-bundle).
4. Install them via your hosting panel or server config (Nginx: ssl_certificate path; Apache: SSLCertificateFile path).
5. Reload your web server: nginx -s reload or systemctl restart apache2.
6. Verify with our SSL checker — the new expiry date should reflect the renewed term.

After renewal, always re-check with our tool to confirm the new certificate is live and the grade is A or A+.`,
  },
  {
    q: "What are Subject Alternative Names (SANs) and what is a wildcard certificate?",
    a: `Subject Alternative Names (SANs) are the list of hostnames that a single certificate is authorised to protect. Modern certificates stopped relying on the older "Common Name" field and now use SANs exclusively for multi-domain coverage.

A typical certificate might include these SANs:
• example.com (the apex domain)
• www.example.com (the www subdomain)
• mail.example.com (the mail server)
• api.example.com (an API endpoint)

A wildcard certificate uses an asterisk: *.example.com. This covers every subdomain one level deep — www.example.com, api.example.com, blog.example.com — but NOT sub-subdomains like staging.api.example.com, and NOT the apex domain example.com itself (though most wildcard certificates also include example.com as a second SAN).

Multi-domain (SAN/UCC) certificates can include completely different base domains in their SAN list — example.com and totally-different.com in a single certificate. This is common for SaaS platforms that serve multiple customer domains from shared infrastructure.

Our SSL checker displays the complete SAN list so you can verify all hostnames are covered before going live.`,
  },
  {
    q: "Does having an SSL certificate help with Google SEO rankings?",
    a: `Yes — HTTPS has been an official Google ranking signal since 2014, when Google announced it as a "lightweight" ranking factor. In practice, the signal is meaningful: sites without HTTPS receive a visible "Not Secure" warning in Chrome (affecting ~65% of global browser users), which increases bounce rates and damages trust — both of which hurt rankings indirectly.

What matters for SEO specifically:
• Valid, unexpired certificate — expired certs trigger security warnings that prevent users from accessing your site at all.
• HTTPS implemented site-wide — not just the homepage. All pages should redirect HTTP to HTTPS with a 301 permanent redirect.
• Consistent canonical URLs — your site should use either https://example.com or https://www.example.com consistently everywhere, not a mix.
• No mixed content — all images, scripts and CSS loaded on HTTPS pages must also use HTTPS, or browsers will block or flag them.

A certificate grade of B or above is sufficient for SEO purposes. The difference between A and A+ won't affect rankings, but an expired certificate (grade F) can completely de-index your site if Google's crawler can't access it.`,
  },
];

/* ── Security recommendations by grade ───────────────────────────────────── */
const GRADE_RECS: Record<string, { color: string; bg: string; border: string; icon: string; headline: string; actions: string[] }> = {
  "A+": { color:"text-green-400", bg:"bg-green-500/10", border:"border-green-500/20", icon:"✅", headline:"Excellent — your SSL configuration is optimal.",
    actions:["Schedule a renewal reminder 60 days before expiry.", "Re-check after any server migration or CDN change."] },
  "A":  { color:"text-green-400", bg:"bg-green-500/10", border:"border-green-500/20", icon:"✅", headline:"Strong configuration — minor improvements possible.",
    actions:["Verify auto-renewal is enabled if using Let's Encrypt.", "Consider TLS 1.3-only mode if you can drop legacy clients."] },
  "B":  { color:"text-cyan-400", bg:"bg-cyan-500/10", border:"border-cyan-500/20", icon:"⚠️", headline:"Good but room to improve.",
    actions:["Enable TLS 1.3 on your server — it's faster and more secure than TLS 1.2.", "Disable TLS 1.0 and TLS 1.1 if they're still enabled.", "Contact your hosting provider if you can't update settings directly."] },
  "B-": { color:"text-cyan-400", bg:"bg-cyan-500/10", border:"border-cyan-500/20", icon:"⚠️", headline:"Acceptable, but upgrades recommended.",
    actions:["Enable TLS 1.3 support.", "Review your cipher suite — prefer ECDHE with AES-GCM."] },
  "C":  { color:"text-yellow-400", bg:"bg-yellow-500/10", border:"border-yellow-500/20", icon:"🔶", headline:"Below current best practice — action recommended.",
    actions:["Upgrade TLS configuration to require TLS 1.2 minimum.", "Increase key size to 2048 bits or use ECDSA 256-bit key.", "Run an SSL Labs full scan for a detailed remediation report.", "Consider switching to a modern CDN (Cloudflare, Fastly) for automatic TLS hardening."] },
  "D":  { color:"text-orange-400", bg:"bg-orange-500/10", border:"border-orange-500/20", icon:"🚨", headline:"Certificate expires very soon — renew immediately.",
    actions:["Log in to your hosting panel and renew the certificate NOW.", "If using Let's Encrypt, run: certbot renew --force-renewal.", "Verify the renewed certificate is live with this checker.", "Enable auto-renewal to prevent this recurring."] },
  "F":  { color:"text-red-400", bg:"bg-red-500/10", border:"border-red-500/20", icon:"🔴", headline:"Certificate is expired or invalid — visitors are blocked.",
    actions:["Your site is showing a browser security warning to all visitors right now.", "Renew immediately via your hosting panel or Let's Encrypt.", "After installing the new certificate, restart your web server.", "Re-check here to confirm the grade has improved."] },
};

const GRADE_COLORS: Record<string, string> = {
  "A+": "text-green-400 bg-green-400/10 border-green-400/30",
  "A":  "text-green-400 bg-green-400/10 border-green-400/30",
  "B":  "text-cyan-400  bg-cyan-400/10  border-cyan-400/30",
  "B-": "text-cyan-400  bg-cyan-400/10  border-cyan-400/30",
  "C":  "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  "D":  "text-orange-400 bg-orange-400/10 border-orange-400/30",
  "F":  "text-red-400   bg-red-400/10   border-red-400/30",
};

const GRADE_LABEL: Record<string, string> = {
  "A+":"Excellent", "A":"Strong", "B":"Good", "B-":"Fair", "C":"Weak", "D":"Critical", "F":"Failed",
};

const POPULAR = ["google.com","github.com","cloudflare.com","stripe.com","vercel.com","mozilla.org"];

interface CertResult {
  domain: string; grade: string; valid: boolean; daysLeft: number; pctUsed: number;
  validFrom: string; validTo: string; subject: Record<string,string>;
  issuer: Record<string,string>; serialNumber: string; fingerprint: string;
  fingerprint256: string; bits: number; subjectAltName: string;
  protocol: string; cipherName: string; cipherVersion: string; selfSigned: boolean;
}

export default function SSLCheckerClient({ children }: { children?: React.ReactNode }) {
  const [domain,  setDomain]  = useState("");
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<CertResult | null>(null);
  const [error,   setError]   = useState("");

  const check = async (d?: string) => {
    const target = (d ?? domain).trim().replace(/^https?:\/\//i, "").split("/")[0];
    if (!target) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res  = await fetch(`/api/ssl-check?domain=${encodeURIComponent(target)}`);
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch { setError("Request failed — check your internet connection."); }
    setLoading(false);
  };

  const rec        = result ? (GRADE_RECS[result.grade] ?? GRADE_RECS["C"]) : null;
  const gradeColor = result ? (GRADE_COLORS[result.grade] ?? "text-gray-400 bg-gray-400/10 border-gray-400/30") : "";
  const gradeLabel = result ? (GRADE_LABEL[result.grade] ?? "") : "";

  const expiryBarColor = result
    ? result.daysLeft < 0   ? "bg-red-500"
    : result.daysLeft < 7   ? "bg-red-500"
    : result.daysLeft < 30  ? "bg-orange-500"
    : result.daysLeft < 90  ? "bg-yellow-500"
    : "bg-green-500"
    : "";

  const sans      = result?.subjectAltName?.split(",").map(s => s.trim().replace(/^DNS:/, "")) ?? [];
  const issuerOrg = result?.issuer?.O ?? result?.issuer?.CN ?? "Unknown";
  const subjCN    = result?.subject?.CN ?? "";

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      {/* ── Navbar ── */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">← All Tools</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* ── Breadcrumb ── */}
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/"      className="hover:text-gray-400 transition-colors">Home</Link><span>›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link><span>›</span>
          <span className="text-gray-400">SSL Checker</span>
        </nav>

        {/* ── Server-rendered hero (children from page.tsx) ── */}
        {children}

        {/* ── Domain input ── */}
        <div className="flex gap-2 mb-4">
          <input
            value={domain} onChange={e => setDomain(e.target.value)}
            onKeyDown={e => e.key === "Enter" && check()}
            placeholder="e.g. example.com or https://example.com"
            className="flex-1 px-4 py-3 rounded-xl bg-[#13131F] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#00D4FF]/50 transition-all"
          />
          <button onClick={() => check()} disabled={loading}
            className="px-6 py-3 rounded-xl bg-[#00D4FF] hover:bg-[#00b8d9] disabled:opacity-50 text-black font-extrabold text-sm transition-all min-w-[80px]">
            {loading ? "…" : "Check"}
          </button>
        </div>

        {/* ── Quick-pick domains ── */}
        <div className="flex flex-wrap gap-2 mb-7">
          <span className="text-xs text-gray-600 self-center">Try:</span>
          {POPULAR.map(d => (
            <button key={d} onClick={() => { setDomain(d); check(d); }}
              className="px-3 py-1.5 rounded-lg bg-[#13131F] border border-white/5 text-gray-400 text-xs hover:text-white hover:border-[#00D4FF]/30 transition-all font-mono">
              {d}
            </button>
          ))}
        </div>

        {/* ── Error state ── */}
        {error && (
          <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 mb-5">
            {error}
          </div>
        )}

        {/* ── Loading state ── */}
        {loading && (
          <div className="text-center py-14 text-gray-400">
            <div className="text-4xl mb-3 animate-pulse">🔒</div>
            <div className="text-sm">Connecting to <span className="text-white font-mono">{domain}</span>…</div>
            <div className="text-xs text-gray-600 mt-1">Retrieving certificate via TLS handshake</div>
          </div>
        )}

        {/* ── Results ── */}
        {result && (
          <div className="space-y-4">

            {/* Main grade card */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
              <div className="flex items-start gap-5">
                {/* Grade badge */}
                <div className={`text-4xl font-black border-2 rounded-2xl w-20 h-20 flex flex-col items-center justify-center flex-shrink-0 ${gradeColor}`}>
                  <span className="leading-none">{result.grade}</span>
                  <span className="text-xs font-semibold mt-0.5 opacity-80">{gradeLabel}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-lg font-extrabold text-white font-mono truncate">{result.domain}</span>
                    {result.selfSigned && (
                      <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2 py-0.5 rounded-full font-semibold">
                        Self-signed
                      </span>
                    )}
                  </div>
                  <div className={`text-sm font-semibold mb-3 ${result.valid && result.daysLeft > 0 ? "text-green-400" : "text-red-400"}`}>
                    {result.valid && result.daysLeft > 0
                      ? `✓ Certificate valid — ${result.daysLeft} day${result.daysLeft !== 1 ? "s" : ""} remaining`
                      : result.daysLeft < 0
                      ? "✗ Certificate has expired"
                      : "✗ Certificate invalid"}
                  </div>

                  {/* Expiry progress bar */}
                  <div className="mb-1.5">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Issued {new Date(result.validFrom).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}</span>
                      <span>Expires {new Date(result.validTo).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}</span>
                    </div>
                    <div className="h-2.5 bg-[#0A0A14] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${expiryBarColor}`}
                        style={{ width: `${Math.max(2, 100 - Math.min(result.pctUsed, 100))}%` }} />
                    </div>
                  </div>

                  <div className="flex gap-3 text-xs text-gray-500">
                    <span>{result.protocol ?? "—"}</span>
                    <span>·</span>
                    <span>{result.cipherName ?? "—"}</span>
                    <span>·</span>
                    <span>{result.bits ? `${result.bits}-bit key` : "—"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Security recommendation ── */}
            {rec && (
              <div className={`rounded-2xl p-5 border ${rec.bg} ${rec.border}`}>
                <div className={`font-bold text-sm mb-2 ${rec.color}`}>
                  {rec.icon} {rec.headline}
                </div>
                <ul className="space-y-1">
                  {rec.actions.map((a, i) => (
                    <li key={i} className="text-xs text-gray-400 flex gap-2">
                      <span className="flex-shrink-0 mt-0.5">›</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── Certificate details grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label:"Common Name",    value: subjCN || "—" },
                { label:"Certificate CA", value: issuerOrg },
                { label:"Issuer Country", value: result.issuer?.C ?? "—" },
                { label:"Protocol",       value: result.protocol ?? "—" },
                { label:"Cipher Suite",   value: result.cipherName ?? "—" },
                { label:"Key Strength",   value: result.bits ? `${result.bits} bits` : "—" },
              ].map(row => (
                <div key={row.label} className="bg-[#13131F] border border-white/5 rounded-xl px-4 py-3">
                  <div className="text-xs text-gray-500 mb-0.5">{row.label}</div>
                  <div className="text-sm font-semibold text-white font-mono truncate" title={row.value}>
                    {row.value}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Fingerprint ── */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
              <div className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">SHA-256 Fingerprint</div>
              <div className="text-xs text-gray-300 font-mono break-all leading-relaxed">
                {result.fingerprint256 || result.fingerprint || "—"}
              </div>
              <div className="text-xs text-gray-600 mt-1.5">
                Serial: <span className="font-mono">{result.serialNumber}</span>
              </div>
            </div>

            {/* ── SANs ── */}
            {sans.length > 0 && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Covered Domains — Subject Alternative Names ({sans.length})
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sans.slice(0, 40).map(s => (
                    <span key={s}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono border ${
                        s.startsWith("*.")
                          ? "bg-[#6C3AFF]/10 border-[#6C3AFF]/20 text-[#a78bfa]"
                          : "bg-[#0A0A14] border-white/5 text-gray-300"
                      }`}>
                      {s}
                    </span>
                  ))}
                  {sans.length > 40 && (
                    <span className="text-xs text-gray-500 flex items-center px-2">
                      + {sans.length - 40} more domains
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  Wildcard entries (<span className="font-mono text-[#a78bfa]">*.example.com</span>) cover all direct subdomains.
                </p>
              </div>
            )}

            {/* ── What to check next ── */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-3">🔗 Related Security Checks</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-400">
                {[
                  "Check all subdomains individually for wildcard vs single-domain certs",
                  "Verify HTTP → HTTPS redirect returns a 301 (permanent), not 302",
                  "Confirm all page resources (images, scripts, CSS) are loaded over HTTPS",
                  "Test HSTS header is set with a max-age of at least 1 year (31536000)",
                ].map((tip, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-[#00D4FF] flex-shrink-0">·</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── How to Use ── */}
        <div className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Check an SSL Certificate</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Enter a domain name",
                desc:"Type any domain with or without https:// — e.g. example.com, www.example.com, or https://example.com. All formats are accepted." },
              { step:"2", title:"Click Check",
                desc:"Our server opens a TLS connection on port 443 and retrieves the live certificate directly from the origin server — no caching, always fresh." },
              { step:"3", title:"Read the security grade",
                desc:"The A+ to F grade summarises the TLS configuration quality instantly. The expiry bar shows how much of the certificate's lifetime has been used." },
              { step:"4", title:"Act on recommendations",
                desc:"Each grade comes with specific action items. Check the SANs to confirm all your hostnames are covered, then follow the suggested next steps." },
            ].map(s => (
              <div key={s.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#00D4FF] flex items-center justify-center text-black font-bold text-xs flex-shrink-0 mt-0.5">{s.step}</div>
                <div>
                  <div className="font-semibold text-white text-sm mb-1">{s.title}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="mt-10">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#00D4FF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{f.q}</span>
                  <span className="text-[#00D4FF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed whitespace-pre-line">{f.a}</div>
              </details>
            ))}
          </div>
        </div>

        {/* ── Contextual content — helps Google understand topic depth ── */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-extrabold text-white">About SSL &amp; TLS Certificates</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            An SSL/TLS certificate is a digital document that performs two functions: it encrypts
            the data passing between a visitor's browser and your web server (so no one on the
            network can read it), and it proves that your server really is who it claims to be
            (so visitors know they haven't been redirected to an impostor site). Certificates are
            issued by trusted Certificate Authorities (CAs) such as Let's Encrypt, DigiCert,
            Sectigo and GlobalSign.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Since September 2020, all publicly-trusted certificates have a maximum lifespan of
            398 days. This shorter validity period forces regular renewal, reducing the window
            of exposure if a private key is ever compromised. Let's Encrypt certificates last
            90 days, which is why automatic renewal via ACME clients (like Certbot) is essential
            for sites that use them.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            When a certificate expires, every major browser — Chrome, Firefox, Safari, Edge —
            blocks users with a full-page security warning and requires several clicks to bypass
            it. Most users won't proceed, resulting in an immediate loss of traffic. For
            e-commerce or business-critical sites, an expired certificate can mean significant
            revenue loss within hours. Checking certificates regularly and enabling auto-renewal
            is non-negotiable for any production website.
          </p>
        </div>
      </main>

      <footer className="border-t border-white/5 mt-16 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/about"   className="hover:text-gray-400">About</Link>
          <Link href="/privacy" className="hover:text-gray-400">Privacy</Link>
          <Link href="/contact" className="hover:text-gray-400">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
