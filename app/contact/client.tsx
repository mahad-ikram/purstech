"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactClient() {
  const [form,      setForm]      = useState({ name:"", email:"", subject:"", message:"" });
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  // ✅ Honeypot — bots fill every visible field, real users leave this empty
  const [hp,        setHp]        = useState("");

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setError(null);
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Name, email and message are required.");
      return;
    }
    if (form.message.trim().length < 10) {
      setError("Please tell us a bit more — at least 10 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: hp }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Could not send message");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send message");
    } finally {
      setLoading(false);
    }
  };

  const CONTACT_ITEMS = [
    { icon:"📧", label:"General Enquiries",  value:"hello@purstech.com",   href:"mailto:hello@purstech.com"   },
    { icon:"🔒", label:"Privacy & Data",     value:"privacy@purstech.com", href:"mailto:privacy@purstech.com" },
    { icon:"⚖️",  label:"Legal",              value:"legal@purstech.com",   href:"mailto:legal@purstech.com"   },
    { icon:"💳", label:"Billing & Pro",      value:"billing@purstech.com", href:"mailto:billing@purstech.com" },
  ];

  const FAQ_ITEMS = [
    { q:"How do I report a bug?",
      a:"Use the contact form and select 'Bug Report' as the subject. Please include the tool name, what you were doing and what went wrong. We investigate all bug reports within 24 hours." },
    { q:"Can I suggest a new tool?",
      a:"Absolutely — we love suggestions! Use the contact form and select 'Tool Suggestion' as the subject. Tell us what tool you need and why it would be useful. Many of our best tools came from user suggestions." },
    { q:"How do I cancel my Pro subscription?",
      a:"Log into your account, go to Settings, and click Cancel Subscription. You will keep full Pro access until the end of your current billing period. No questions asked." },
    { q:"Is my data safe when using PursTech tools?",
      a:"Yes. All tool processing happens entirely in your browser. We never store what you type, paste or upload into any tool. Files and text you use in our tools never reach our servers." },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans selection:bg-[#6C3AFF]/30">

      {/* Navbar */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools"   className="text-sm text-gray-500 hover:text-white transition-colors">Tools</Link>
            <Link href="/blog"    className="text-sm text-gray-500 hover:text-white transition-colors">Blog</Link>
            <Link href="/about"   className="text-sm text-gray-500 hover:text-white transition-colors">About</Link>
            <Link href="/pro"     className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">Go Pro ⚡</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-16">

        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span aria-hidden="true">›</span>
          <span className="text-gray-400">Contact</span>
        </nav>

        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-4 py-1.5 text-xs text-[#6C3AFF] font-semibold mb-4">Get in Touch</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Contact Us</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Have a question, suggestion or found a bug? We&apos;d love to hear from you. We typically respond within 24–48 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left: contact details */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
              <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Contact Details</h2>
              <div className="space-y-4">
                {CONTACT_ITEMS.map(item => (
                  <a key={item.label} href={item.href} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-[#6C3AFF]/10 rounded-xl flex items-center justify-center text-lg flex-shrink-0">{item.icon}</div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">{item.label}</div>
                      <div className="text-sm text-[#6C3AFF] group-hover:text-[#00D4FF] transition-colors font-medium">{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
              <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Response Times</h2>
              <div className="space-y-3">
                {[
                  { label:"General enquiries", time:"24–48 hours" },
                  { label:"Bug reports",       time:"24 hours"    },
                  { label:"Billing issues",    time:"12–24 hours" },
                  { label:"Privacy requests",  time:"72 hours"    },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{r.label}</span>
                    <span className="text-white font-semibold">{r.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
              <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Follow Us</h2>
              <div className="space-y-3">
                {[
                  { label:"LinkedIn",    handle:"PursTech",  href:"https://www.linkedin.com/company/purstech"      },
                  { label:"Instagram",   handle:"@purstech", href:"https://www.instagram.com/purstech"             },
                  { label:"YouTube",     handle:"@PursTech", href:"https://www.youtube.com/@PursTech"              },
                  { label:"Facebook",    handle:"PursTech",  href:"https://www.facebook.com/share/1R3Q9JZ7ks/"     },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="flex justify-between text-sm hover:text-[#6C3AFF] transition-colors">
                    <span className="text-gray-500">{s.label}</span>
                    <span className="text-[#6C3AFF] hover:text-[#00D4FF] transition-colors font-semibold">{s.handle}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: contact form */}
          <div className="lg:col-span-3">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-8">
              <h2 className="text-lg font-extrabold text-white mb-6">Send Us a Message</h2>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-xl font-extrabold text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-500 mb-6">Thanks for reaching out. We&apos;ll get back to you within 24–48 hours.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name:"", email:"", subject:"", message:"" }); setHp(""); setError(null); }}
                    className="px-6 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white font-bold text-sm transition-all">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="space-y-4">

                  {/* ✅ HONEYPOT — hidden field bots will fill. Real users leave it empty. */}
                  <div style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }} aria-hidden="true">
                    <label>
                      Leave this empty:
                      <input type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={e => setHp(e.target.value)} />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-wider">Your Name *</label>
                      <input id="contact-name" type="text" value={form.name} onChange={e => set("name", e.target.value)}
                        placeholder="John Smith" autoComplete="name"
                        className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm" />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-wider">Email Address *</label>
                      <input id="contact-email" type="email" value={form.email} onChange={e => set("email", e.target.value)}
                        placeholder="john@example.com" autoComplete="email"
                        className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-wider">Subject</label>
                    <select id="contact-subject" value={form.subject} onChange={e => set("subject", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm">
                      <option value="">Select a subject...</option>
                      <option value="general">General Enquiry</option>
                      <option value="bug">Bug Report</option>
                      <option value="suggestion">Tool Suggestion</option>
                      <option value="billing">Billing / Pro Subscription</option>
                      <option value="privacy">Privacy / Data Request</option>
                      <option value="partnership">Partnership / Business</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-wider">Message *</label>
                    <textarea id="contact-message" value={form.message} onChange={e => set("message", e.target.value)}
                      maxLength={2000} rows={6} placeholder="Tell us how we can help..."
                      className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm resize-none" />
                    <div className={`text-right text-xs mt-1 ${form.message.length > 1800 ? "text-yellow-400" : "text-gray-600"}`}>{form.message.length} / 2000</div>
                  </div>

                  {/* ✅ ERROR MESSAGE */}
                  {error && (
                    <div className="bg-[#FF3A6C]/10 border border-[#FF3A6C]/30 text-[#FF3A6C] text-sm rounded-xl px-4 py-3">
                      {error}
                    </div>
                  )}

                  <button onClick={handleSubmit}
                    disabled={!form.name || !form.email || !form.message || loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold transition-all shadow-lg shadow-violet-900/30">
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : "Send Message →"}
                  </button>

                  <p className="text-xs text-gray-600 text-center">
                    By submitting this form you agree to our{" "}
                    <Link href="/privacy" className="text-[#6C3AFF] hover:text-[#00D4FF] transition-colors">Privacy Policy</Link>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="bg-[#13131F] border border-white/5 rounded-2xl p-5 hover:border-[#6C3AFF]/20 transition-all">
                <h3 className="font-bold text-white text-sm mb-2">{item.q}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      <footer className="border-t border-white/5 mt-20 py-8 text-center bg-[#0A0A14]">
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