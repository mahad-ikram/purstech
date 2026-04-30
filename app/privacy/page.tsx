import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | PursTech",
  description: "PursTech Privacy Policy — how we collect, use and protect your data.",
};

const LAST_UPDATED = "January 8, 2025";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">

      {/* Navbar */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">
            Purs<span className="text-[#6C3AFF]">Tech</span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">← Home</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-4 py-1.5 text-xs text-[#6C3AFF] font-semibold mb-4">
            Legal
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3">Privacy Policy</h1>
          <p className="text-gray-500 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-10 text-gray-400 leading-relaxed">

          <Section title="1. Introduction">
            <p>
              Welcome to PursTech (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). We operate the website{" "}
              <a href="https://purstech.com" className="text-[#6C3AFF] hover:text-[#00D4FF] transition-colors">purstech.com</a>{" "}
              (the &quot;Service&quot;). This Privacy Policy explains how we collect, use, disclose and safeguard your
              information when you visit PursTech. Please read this policy carefully. If you disagree with its terms,
              please discontinue use of the site.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <SubTitle>2.1 Information You Provide</SubTitle>
            <p>We may collect information you voluntarily provide when you:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
              <li>Subscribe to our newsletter (email address only)</li>
              <li>Contact us via our contact form (name and email address)</li>
              <li>Create a Pro account (email address and billing information via Stripe)</li>
            </ul>

            <SubTitle>2.2 Automatically Collected Information</SubTitle>
            <p>When you visit PursTech, certain information is collected automatically, including:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
              <li>IP address and approximate geographic location (country/city level)</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring URL</li>
              <li>Device type (desktop, mobile, tablet)</li>
            </ul>

            <SubTitle>2.3 Tool Usage Data</SubTitle>
            <p>
              We collect anonymous, aggregated data about which tools are used and how frequently.
              We do <strong className="text-white">not</strong> store the content you enter into any tool.
              All tool processing happens in your browser and no input data is ever transmitted to our servers.
            </p>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
              <li>Operate, maintain and improve the PursTech platform</li>
              <li>Send newsletter emails to subscribers (with your explicit consent)</li>
              <li>Process Pro subscription payments</li>
              <li>Respond to your enquiries and support requests</li>
              <li>Analyse usage patterns to understand which tools are most valuable</li>
              <li>Detect and prevent fraud, abuse and security issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </Section>

          <Section title="4. Google AdSense and Advertising">
            <p>
              PursTech uses <strong className="text-white">Google AdSense</strong> to display advertisements.
              Google AdSense uses cookies to serve ads based on your prior visits to our site and other sites on
              the internet. Google&apos;s use of advertising cookies enables it and its partners to serve ads
              based on your visit to PursTech and/or other sites on the internet.
            </p>
            <p className="mt-3">
              You may opt out of personalised advertising by visiting{" "}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer"
                className="text-[#6C3AFF] hover:text-[#00D4FF] transition-colors">
                Google Ads Settings
              </a>
              {" "}or by visiting{" "}
              <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer"
                className="text-[#6C3AFF] hover:text-[#00D4FF] transition-colors">
                aboutads.info
              </a>.
            </p>
            <p className="mt-3">
              For more information on how Google uses data when you use our site, visit:{" "}
              <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer"
                className="text-[#6C3AFF] hover:text-[#00D4FF] transition-colors">
                How Google uses data from sites that use Google products
              </a>.
            </p>
          </Section>

          <Section title="5. Cookies">
            <p>We use cookies and similar tracking technologies to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
              <li>Keep you signed in to your Pro account</li>
              <li>Remember your preferences (e.g. dark/light mode)</li>
              <li>Analyse site traffic via Google Analytics</li>
              <li>Serve relevant advertisements via Google AdSense</li>
            </ul>
            <p className="mt-3">
              You can control cookie settings through your browser. Disabling cookies may affect the
              functionality of some features on PursTech.
            </p>
          </Section>

          <Section title="6. Third-Party Services">
            <p>We use the following third-party services that may collect information:</p>
            <div className="mt-3 space-y-3">
              {[
                { name:"Google Analytics",  purpose:"Website traffic analysis",      link:"https://policies.google.com/privacy" },
                { name:"Google AdSense",    purpose:"Advertising",                    link:"https://policies.google.com/privacy" },
                { name:"Vercel",            purpose:"Website hosting and deployment", link:"https://vercel.com/legal/privacy-policy" },
                { name:"Supabase",          purpose:"Database and authentication",    link:"https://supabase.com/privacy"           },
                { name:"Stripe",            purpose:"Payment processing (Pro tier)",  link:"https://stripe.com/privacy"             },
              ].map(s => (
                <div key={s.name} className="flex items-start gap-3 bg-[#13131F] rounded-xl px-4 py-3">
                  <div className="flex-1">
                    <span className="text-white font-semibold text-sm">{s.name}</span>
                    <span className="text-gray-500 text-sm"> — {s.purpose}</span>
                  </div>
                  <a href={s.link} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-[#6C3AFF] hover:text-[#00D4FF] transition-colors flex-shrink-0">
                    Privacy Policy →
                  </a>
                </div>
              ))}
            </div>
          </Section>

          <Section title="7. Data Retention">
            <p>
              Newsletter subscribers&apos; email addresses are retained until you unsubscribe.
              Anonymous usage analytics are retained for up to 26 months.
              Pro account data is retained for the duration of your subscription plus 90 days.
              You may request deletion of your data at any time by contacting us.
            </p>
          </Section>

          <Section title="8. Your Rights">
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
              <li><strong className="text-white">Access</strong> — request a copy of the data we hold about you</li>
              <li><strong className="text-white">Rectification</strong> — request correction of inaccurate data</li>
              <li><strong className="text-white">Erasure</strong> — request deletion of your data</li>
              <li><strong className="text-white">Portability</strong> — request your data in a machine-readable format</li>
              <li><strong className="text-white">Objection</strong> — object to processing of your data</li>
              <li><strong className="text-white">Opt-out</strong> — unsubscribe from emails at any time</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us at{" "}
              <a href="mailto:privacy@purstech.com" className="text-[#6C3AFF] hover:text-[#00D4FF] transition-colors">
                privacy@purstech.com
              </a>.
            </p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>
              PursTech is not directed to children under the age of 13. We do not knowingly collect personal
              information from children under 13. If you are a parent or guardian and believe your child has
              provided us with personal information, please contact us immediately.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes
              by updating the &quot;Last updated&quot; date at the top of this page. Continued use of PursTech
              after any changes constitutes your acceptance of the new policy.
            </p>
          </Section>

          <Section title="11. Contact Us">
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="mt-4 bg-[#13131F] rounded-2xl p-5 space-y-2 text-sm">
              <div><span className="text-gray-500">Email: </span>
                <a href="mailto:privacy@purstech.com" className="text-[#6C3AFF] hover:text-[#00D4FF] transition-colors">privacy@purstech.com</a>
              </div>
              <div><span className="text-gray-500">Website: </span>
                <a href="https://purstech.com/contact" className="text-[#6C3AFF] hover:text-[#00D4FF] transition-colors">purstech.com/contact</a>
              </div>
            </div>
          </Section>

        </div>
      </main>

      <footer className="border-t border-white/5 mt-20 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2025 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-extrabold text-white mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-bold text-white mt-4 mb-2">{children}</h3>;
}
