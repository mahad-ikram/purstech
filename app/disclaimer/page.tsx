import Link from "next/link";
import type { Metadata } from "next";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "PursTech Disclaimer — our tools and articles are provided for general informational purposes only. Read our financial, health, professional advice and third-party content disclaimers.",
  alternates: { canonical: "/disclaimer" },
  openGraph: {
    type:        "website",
    url:         "https://www.purstech.com/disclaimer",
    siteName:    "PursTech",
    title:       "Disclaimer — PursTech",
    description: "Our tools and articles are for general informational purposes only and are not professional, financial, legal or medical advice.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PursTech Disclaimer" }],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

// ✅ Bumped to current month — AdSense reviewers check freshness on legal pages
const LAST_UPDATED = "August 2026";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">

      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools"   className="text-sm text-gray-500 hover:text-white transition-colors">Tools</Link>
            <Link href="/blog"    className="text-sm text-gray-500 hover:text-white transition-colors">Blog</Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:text-white transition-colors">Contact</Link>
            <Link href="/pro" className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">Go Pro ⚡</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-16">

        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span aria-hidden="true">›</span>
          <span className="text-gray-400">Disclaimer</span>
        </nav>

        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-4 py-1.5 text-xs text-[#6C3AFF] font-semibold mb-4">Legal</div>
          <h1 className="text-4xl font-extrabold text-white mb-3">Disclaimer</h1>
          <p className="text-gray-500 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-10 text-gray-400 leading-relaxed">

          <Section title="1. General Information Only">
            <p>
              The information, calculators and tools provided by PursTech on{" "}
              <a href="https://www.purstech.com" className="text-[#6C3AFF] hover:text-[#00D4FF] transition-colors">www.purstech.com</a>{" "}
              (the &quot;Site&quot;) are for general informational and educational purposes only. All
              content is provided in good faith, however we make no representation or warranty of any
              kind, express or implied, regarding the accuracy, adequacy, validity, reliability,
              availability or completeness of any information or output produced by our tools.
            </p>
            <p>
              Your use of the Site and your reliance on any information or tool output is solely at
              your own risk.
            </p>
          </Section>

          <Section title="2. Not Professional Advice">
            <p>
              Nothing on this Site constitutes professional advice. The Site cannot and does not
              contain financial, legal, medical, tax or other professional advice. Any information is
              provided for general informational purposes and is not a substitute for advice from a
              qualified professional.
            </p>
            <p>
              <strong className="text-gray-300">You should always consult an appropriate qualified professional</strong>{" "}
              before acting on anything you read or calculate here.
            </p>
          </Section>

          <Section title="3. Financial Tools Disclaimer">
            <p>
              PursTech provides financial calculators including, among others, a mortgage calculator,
              loan calculator, compound interest calculator, currency converter, salary calculator and
              tip calculator. These tools produce <strong className="text-gray-300">estimates only</strong>.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Results are based solely on the figures you enter and simplified standard formulas.</li>
              <li>They do not account for fees, taxes, insurance, penalties, changing interest rates, lender-specific terms or local regulations.</li>
              <li>Currency conversion rates may be delayed, cached or inaccurate and must not be relied upon for trading or transactions.</li>
              <li>No output from this Site is an offer of credit, a quotation, or a guarantee of any rate or approval.</li>
            </ul>
            <p>
              Consult a licensed financial adviser, accountant or your lender before making any
              financial decision.
            </p>
          </Section>

          <Section title="4. Health &amp; Fitness Tools Disclaimer">
            <p>
              PursTech provides health-related calculators such as the BMI calculator. These are
              general wellness tools and are{" "}
              <strong className="text-gray-300">not medical devices and do not provide a diagnosis</strong>.
            </p>
            <p>
              Metrics such as BMI are broad population-level indicators and do not account for muscle
              mass, body composition, bone density, age, ethnicity, pregnancy or medical conditions.
              They should never be used to self-diagnose or to make decisions about diet, exercise,
              medication or treatment. Always seek the advice of your physician or another qualified
              health provider with any questions regarding a medical condition, and never disregard
              professional medical advice because of something you read on this Site.
            </p>
          </Section>

          <Section title="5. Tool Accuracy &amp; Data Loss">
            <p>
              Our tools — including PDF, image, text and developer utilities — process files in your
              browser wherever possible. While we work to keep them reliable, we do not warrant that
              any tool will be error-free, uninterrupted, or that output will meet your requirements.
            </p>
            <p>
              <strong className="text-gray-300">Always keep a backup of your original files.</strong>{" "}
              PursTech is not liable for any corrupted, altered, incomplete or lost files, or for any
              loss of data arising from use of the Site.
            </p>
          </Section>

          <Section title="6. External Links Disclaimer">
            <p>
              The Site may contain links to other websites or content belonging to or originating from
              third parties. Such external links are not investigated, monitored, or checked for
              accuracy, adequacy, validity, reliability or completeness by us.
            </p>
            <p>
              We do not warrant, endorse, guarantee or assume responsibility for the accuracy or
              reliability of any information offered by third-party websites, nor are we a party to any
              transaction between you and a third-party provider of products or services.
            </p>
          </Section>

          <Section title="7. Product Comparisons &amp; Reviews">
            <p>
              Some articles on this Site compare, review or recommend third-party products and
              services. These comparisons reflect our own research and opinion at the time of writing
              and are provided for informational purposes only.
            </p>
            <p>
              Third-party pricing, free-tier limits, features and policies change frequently and may
              have changed since publication. Always verify details directly with the provider before
              relying on them or making a purchase. Where we mention our own tools, we disclose that
              clearly within the article.
            </p>
          </Section>

          <Section title="8. Affiliate Disclosure">
            <p>
              Some links on this Site may be affiliate links, meaning we may earn a small commission if
              you click through and make a purchase — at{" "}
              <strong className="text-gray-300">no additional cost to you</strong>.
            </p>
            <p>
              Affiliate relationships never influence our editorial opinions, rankings or
              recommendations. We only mention products we consider genuinely useful, and we recommend
              free alternatives — including our own free tools — wherever they are the better choice.
            </p>
          </Section>

          <Section title="9. Advertising Disclosure">
            <p>
              This Site may display advertising served by third-party advertising networks, including
              Google AdSense. These networks may use cookies and similar technologies to serve ads
              based on your prior visits to this and other websites.
            </p>
            <p>
              PursTech does not control and is not responsible for the content of third-party
              advertisements or the products and services they promote. For details on how advertising
              cookies are used and how to opt out, please see our{" "}
              <Link href="/privacy" className="text-[#6C3AFF] hover:text-[#00D4FF] transition-colors">Privacy Policy</Link>.
            </p>
          </Section>

          <Section title="10. Limitation of Liability">
            <p>
              Under no circumstance shall PursTech have any liability to you for any loss or damage of
              any kind incurred as a result of the use of the Site or reliance on any information or
              tool output provided on the Site. Your use of the Site and your reliance on any
              information is solely at your own risk. This is subject to any rights you have under
              applicable law that cannot be excluded.
            </p>
          </Section>

          <Section title="11. Changes to This Disclaimer">
            <p>
              We may update this Disclaimer from time to time. Any changes will be posted on this page
              with a revised &quot;Last updated&quot; date. We encourage you to review this page
              periodically.
            </p>
          </Section>

          <Section title="12. Contact Us">
            <p>
              If you have any questions about this Disclaimer, please reach out via our{" "}
              <Link href="/contact" className="text-[#6C3AFF] hover:text-[#00D4FF] transition-colors">Contact page</Link>.
            </p>
          </Section>

          <div className="border-t border-white/5 pt-8 text-sm text-gray-600">
            <p>
              See also our{" "}
              <Link href="/privacy" className="text-[#6C3AFF] hover:text-[#00D4FF] transition-colors">Privacy Policy</Link>{" "}
              and{" "}
              <Link href="/terms" className="text-[#6C3AFF] hover:text-[#00D4FF] transition-colors">Terms of Service</Link>.
            </p>
          </div>

        </div>
      </main>

      <footer className="border-t border-white/5 mt-16 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex flex-wrap justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/privacy"    className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"      className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/disclaimer" className="hover:text-gray-400 transition-colors">Disclaimer</Link>
          <Link href="/contact"    className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
