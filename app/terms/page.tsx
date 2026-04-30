import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | PursTech",
  description: "PursTech Terms of Service — rules and conditions for using our free online tools.",
};

const LAST_UPDATED = "January 8, 2025";

export default function TermsPage() {
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
          <h1 className="text-4xl font-extrabold text-white mb-3">Terms of Service</h1>
          <p className="text-gray-500 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-10 text-gray-400 leading-relaxed">

          <Section title="1. Acceptance of Terms">
            <p>
              By accessing or using PursTech (&quot;the Service&quot;) at{" "}
              <a href="https://purstech.com" className="text-[#6C3AFF] hover:text-[#00D4FF] transition-colors">purstech.com</a>,
              you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms,
              please do not use the Service. We reserve the right to update these Terms at any time.
              Continued use of the Service constitutes acceptance of any updated Terms.
            </p>
          </Section>

          <Section title="2. Description of Service">
            <p>
              PursTech provides a collection of free online tools for text processing, image editing, developer
              utilities, SEO analysis, finance calculations, security tools and more. The Service is provided
              &quot;as is&quot; and is free to use without registration. A paid Pro tier with additional features
              is also available.
            </p>
          </Section>

          <Section title="3. Acceptable Use">
            <p>You agree to use PursTech only for lawful purposes. You must not:</p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>Use the Service to process, store or transmit illegal, harmful or offensive content</li>
              <li>Attempt to overload, disrupt or damage the Service or its infrastructure</li>
              <li>Use automated scripts, bots or crawlers to scrape or abuse the Service excessively</li>
              <li>Attempt to gain unauthorised access to any part of the Service</li>
              <li>Reverse engineer, decompile or disassemble any part of the Service</li>
              <li>Use the Service to infringe the intellectual property rights of others</li>
              <li>Resell or commercially exploit the Service without our written permission</li>
              <li>Impersonate any person or entity, or misrepresent your affiliation with any person or entity</li>
            </ul>
          </Section>

          <Section title="4. Intellectual Property">
            <p>
              All content on PursTech — including but not limited to the design, layout, code, text, graphics,
              logos and tool interfaces — is the property of PursTech and is protected by copyright and other
              intellectual property laws.
            </p>
            <p className="mt-3">
              You are granted a limited, non-exclusive, non-transferable licence to use the Service for personal
              and commercial purposes within the bounds of these Terms. You may not copy, reproduce, republish,
              upload or distribute any part of the Service without our prior written consent.
            </p>
          </Section>

          <Section title="5. User Content and Tool Inputs">
            <p>
              Text, data and files you enter into PursTech tools are processed locally in your browser wherever
              possible. We do not claim ownership of any content you input into our tools. You retain full
              ownership of your content.
            </p>
            <p className="mt-3">
              By using AI-powered tools, you acknowledge that your inputs may be processed by third-party AI
              APIs (such as Anthropic or OpenAI) subject to their respective terms of service and privacy
              policies. Do not enter sensitive personal data, passwords or confidential business information
              into any tool.
            </p>
          </Section>

          <Section title="6. Pro Subscription">
            <p>
              PursTech Pro is a paid subscription tier providing unlimited usage, ad-free experience, priority
              processing and API access. By subscribing you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>Pay the applicable subscription fee on a recurring monthly basis</li>
              <li>Provide accurate billing information</li>
              <li>Not share your account credentials with others</li>
            </ul>
            <p className="mt-3">
              You may cancel your Pro subscription at any time. Cancellation takes effect at the end of the
              current billing period. We do not offer refunds for partial months. Payments are processed
              securely by Stripe.
            </p>
          </Section>

          <Section title="7. Third-Party Links and Services">
            <p>
              PursTech may contain links to third-party websites or services. We are not responsible for the
              content, privacy practices or terms of any third-party sites. Links do not constitute endorsement.
              We encourage you to review the privacy policies of any third-party sites you visit.
            </p>
          </Section>

          <Section title="8. Disclaimers">
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY
              KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, PURSTECH DISCLAIMS ALL
              WARRANTIES, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
              NON-INFRINGEMENT.
            </p>
            <p className="mt-3">
              We do not warrant that the Service will be uninterrupted, error-free or completely secure. Tool
              results — including calculations, conversions and generated content — are provided for
              informational purposes only and should not be relied upon for financial, legal or medical
              decisions without independent verification.
            </p>
          </Section>

          <Section title="9. Limitation of Liability">
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, PURSTECH SHALL NOT BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF OR INABILITY
              TO USE THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p className="mt-3">
              Our total liability to you for any claim arising from these Terms or your use of the Service
              shall not exceed the amount you have paid to us in the twelve months preceding the claim, or
              $10 USD if you have not made any payments.
            </p>
          </Section>

          <Section title="10. Indemnification">
            <p>
              You agree to indemnify and hold harmless PursTech and its operators from any claims, losses,
              liabilities, damages and expenses (including reasonable legal fees) arising from your use of the
              Service, your violation of these Terms, or your violation of any rights of another party.
            </p>
          </Section>

          <Section title="11. Termination">
            <p>
              We reserve the right to suspend or terminate your access to the Service at any time, with or
              without notice, for any violation of these Terms or for any other reason at our sole discretion.
              Upon termination, all provisions of these Terms which by their nature should survive termination
              shall continue to apply.
            </p>
          </Section>

          <Section title="12. Governing Law">
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws. Any disputes
              arising under these Terms shall be subject to the exclusive jurisdiction of the relevant courts.
              If any provision of these Terms is found to be unenforceable, the remaining provisions will
              continue in full force and effect.
            </p>
          </Section>

          <Section title="13. Changes to Terms">
            <p>
              We reserve the right to modify these Terms at any time. We will indicate the date of the most
              recent revision at the top of this page. Your continued use of the Service after any changes
              constitutes acceptance of the new Terms. We recommend reviewing these Terms periodically.
            </p>
          </Section>

          <Section title="14. Contact">
            <p>If you have questions about these Terms, please contact us:</p>
            <div className="mt-4 bg-[#13131F] rounded-2xl p-5 space-y-2 text-sm">
              <div><span className="text-gray-500">Email: </span>
                <a href="mailto:legal@purstech.com" className="text-[#6C3AFF] hover:text-[#00D4FF] transition-colors">legal@purstech.com</a>
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
