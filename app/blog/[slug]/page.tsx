import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BLOG_POSTS } from "../data";
import { ReadingProgress, TableOfContents } from "./ClientComponents";

// ─── Author (single source of truth) ───────────────────────────────────────────
// To change the bylined author later, edit these two lines only.
const AUTHOR = { name: "Mahad Ikram", url: "https://www.purstech.com/about" };
const AUTHOR_INITIALS = "MI";

// ─── Helper Functions ─────────────────────────────────────────────────────────

function extractTOC(html: string): { id: string; text: string }[] {
  return [...html.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)]
    .map(m => ({ id: m[1], text: m[2] }));
}

// ✅ QA ARCHITECTURE FIX: FAQ stays here as a pure Server Component
function FAQSection({ faqs }: { faqs: { q: string; a: string }[] }) {
  if (!faqs || faqs.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
            <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
              <span>{faq.q}</span>
              <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

// ─── SEO Metadata ─────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];
  if (!post) return { title: "Post Not Found" };
  
  const postUrl = `https://www.purstech.com/blog/${post.slug}`;
  
  return {
    // ✅ CLAUDE'S FIX: Removed double branding. Layout adds "| PursTech" automatically.
    title:       post.title,
    description: post.excerpt,
    keywords:    post.keywords,
    authors:     [{ name: AUTHOR.name, url: AUTHOR.url }],
    alternates:  { canonical: postUrl },
    openGraph: {
      type: "article", title: post.title, description: post.excerpt,
      url: postUrl, siteName: "PursTech",
      publishedTime: post.publishedISO, modifiedTime: post.updatedISO,
      authors: [AUTHOR.name], tags: post.keywords,
      images: [{ url: post.heroImage ?? "/og-image.png", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image", title: post.title,
      description: post.excerpt, images: [post.heroImage ?? "/og-image.png"], creator: "@purstech",
    },
    // ✅ CLAUDE'S FIX: Added explicit robots directives
    robots: {
      index: true, follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    }
  };
}

export function generateStaticParams() {
  return Object.keys(BLOG_POSTS).map(slug => ({ slug }));
}

// ─── Main Page Render ─────────────────────────────────────────────────────────

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];
  if (!post) notFound();

  const toc       = extractTOC(post.content);
  const nextPosts = Object.values(BLOG_POSTS).filter(p => p.slug !== slug).slice(0, 3);
  
  const shareUrl  = `https://www.purstech.com/blog/${post.slug}`;
  const shareEnc  = encodeURIComponent(shareUrl);
  const titleEnc  = encodeURIComponent(post.title);

  // ── JSON-LD Schemas ─────────────────────────────────────────────────────────
  const articleSchema = {
    "@context": "https://schema.org", "@type": "BlogPosting",
    headline: post.title, description: post.excerpt,
    image: post.heroImage ? `https://www.purstech.com${post.heroImage}` : "https://www.purstech.com/og-image.png",
    datePublished: post.publishedISO, dateModified: post.updatedISO,
    // ✅ E-E-A-T FIX: Named Person author (was generic Organization "PursTech Team").
    author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
    publisher: { 
      "@type": "Organization", 
      name: "PursTech",
      // ✅ CLAUDE'S FIX: Use og-image.png for publisher logo instead of favicon
      logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } 
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": shareUrl },
    keywords: post.keywords.join(", "),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.purstech.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.purstech.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: shareUrl },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: post.faqs.map(f => ({
      "@type": "Question", name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const shareButtons = [
    { label: "𝕏 Twitter",  href: `https://twitter.com/intent/tweet?text=${titleEnc}&url=${shareEnc}`,          color: "hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/10" },
    { label: "in LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareEnc}`,            color: "hover:text-[#0A66C2] hover:border-[#0A66C2]/30 hover:bg-[#0A66C2]/10" },
    { label: "f Facebook",  href: `https://www.facebook.com/sharer/sharer.php?u=${shareEnc}`,                   color: "hover:text-[#1877F2] hover:border-[#1877F2]/30 hover:bg-[#1877F2]/10" },
    { label: "🔥 Reddit",   href: `https://www.reddit.com/submit?url=${shareEnc}&title=${titleEnc}`,            color: "hover:text-[#FF4500] hover:border-[#FF4500]/30 hover:bg-[#FF4500]/10" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans selection:bg-[#6C3AFF]/30">
      <ReadingProgress />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema)    }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema)        }} />

      {/* ✅ BOTH FIXES: Added Contact and Go Pro links */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools"   className="text-sm text-gray-500 hover:text-white transition-colors">Tools</Link>
            <Link href="/blog"    className="text-sm text-gray-500 hover:text-white transition-colors">Blog</Link>
            <Link href="/contact" className="hidden sm:block text-sm text-gray-500 hover:text-white transition-colors">Contact</Link>
            <Link href="/pro"     className="hidden sm:block px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">Go Pro ⚡</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/blog" className="hover:text-gray-400 transition-colors">Blog</Link>
          <span>›</span>
          <span className="text-gray-400 truncate max-w-xs">{post.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <article className="lg:col-span-3" itemScope itemType="https://schema.org/BlogPosting">
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-semibold">
                  {post.category}
                </span>
                <span className="text-xs text-gray-500">{post.readTime}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4" itemProp="headline">
                {post.title}
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed mb-6" itemProp="description">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-4 pb-6 border-b border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C3AFF] to-[#00D4FF] flex items-center justify-center text-white font-extrabold flex-shrink-0">{AUTHOR_INITIALS}</div>
                <div itemProp="author" itemScope itemType="https://schema.org/Person">
                  <Link href="/about" className="text-sm font-semibold text-white hover:text-[#6C3AFF] transition-colors" itemProp="url">
                    <span itemProp="name">{AUTHOR.name}</span>
                  </Link>
                  <div className="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                    <span>Published&nbsp;<time dateTime={post.publishedISO} itemProp="datePublished">{post.publishedAt}</time></span>
                    <span>·</span>
                    <span>Updated&nbsp;<time dateTime={post.updatedISO} itemProp="dateModified">{post.updatedAt}</time></span>
                  </div>
                </div>
              </div>
            </header>

            <div className="block lg:hidden">
              {toc.length > 2 && <TableOfContents items={toc} />}
            </div>

            {/* 📷 Hero infographic — per-post image, doubles as OG image */}
            {post.heroImage && (
              <img src={post.heroImage} alt={post.title} width={1200} height={630}
                className="w-full h-auto rounded-2xl border border-white/5 mb-8" />
            )}

            <div
              itemProp="articleBody"
              className="prose prose-invert max-w-none prose-p:text-gray-400 prose-p:leading-relaxed prose-p:mb-4 prose-h2:text-white prose-h2:font-extrabold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:scroll-mt-24 prose-strong:text-white prose-code:text-cyan-400 prose-code:bg-[#13131F] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {post.relatedTools.length > 0 && (
              <div className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-6">
                <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">🔧 Try These Free Tools</h2>
                <div className="flex flex-wrap gap-3">
                  {post.relatedTools.map(tool => (
                    <Link key={tool.slug} href={`/tools/${tool.slug}`}
                      className="flex items-center gap-2 bg-[#0A0A14] hover:bg-[#6C3AFF]/10 border border-white/5 hover:border-[#6C3AFF]/30 rounded-xl px-4 py-2.5 transition-all group">
                      <span className="text-lg">{tool.icon}</span>
                      <span className="text-sm text-gray-400 group-hover:text-white transition-colors font-medium">{tool.name}</span>
                      <span className="text-gray-700 group-hover:text-[#6C3AFF] transition-colors text-sm">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 📚 Related Reading — internal links between sibling posts (Google guide: links = discovery) */}
            {post.relatedPosts && post.relatedPosts.length > 0 && (
              <div className="mt-8 bg-[#13131F] border border-white/5 rounded-2xl p-6">
                <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">📚 Related Reading</h2>
                <div className="flex flex-col gap-2">
                  {post.relatedPosts.map(rSlug => {
                    const rPost = BLOG_POSTS[rSlug];
                    if (!rPost) return null;
                    return (
                      <Link key={rSlug} href={`/blog/${rSlug}`}
                        className="flex items-center justify-between gap-3 bg-[#0A0A14] hover:bg-[#6C3AFF]/10 border border-white/5 hover:border-[#6C3AFF]/30 rounded-xl px-4 py-3 transition-all group">
                        <span className="text-sm text-gray-400 group-hover:text-white transition-colors font-medium">{rPost.title}</span>
                        <span className="text-gray-700 group-hover:text-[#6C3AFF] transition-colors text-sm shrink-0">→</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ✅ QA ARCHITECTURE FIX: Render FAQ Section server-side directly here */}
            <FAQSection faqs={post.faqs} />

            <section className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-6">
              <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">💬 Share This Article</h2>
              <div className="flex flex-wrap gap-3">
                {shareButtons.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-2 bg-[#0A0A14] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-gray-400 transition-all ${s.color}`}>
                    {s.label}
                  </a>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-extrabold text-white mb-6">📚 Read Next</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {nextPosts.map(p => (
                  <Link key={p.slug} href={`/blog/${p.slug}`}
                    className="group bg-[#13131F] border border-white/5 rounded-2xl p-5 hover:border-[#6C3AFF]/40 transition-all hover:-translate-y-0.5">
                    <span className="text-xs text-[#6C3AFF] font-semibold">{p.category}</span>
                    <h3 className="text-sm font-bold text-white mt-2 mb-1 group-hover:text-[#6C3AFF] transition-colors leading-snug line-clamp-2">{p.title}</h3>
                    <span className="text-xs text-gray-600">{p.readTime}</span>
                  </Link>
                ))}
              </div>
            </section>
          </article>

          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 flex flex-col gap-5">
              {toc.length > 2 && <TableOfContents items={toc} />}
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Article Info</h3>
                <div className="space-y-2 text-xs">
                  {[["Category", post.category],["Read time", post.readTime],["Published", post.publishedAt],["Updated", post.updatedAt]].map(([l,v]) => (
                    <div key={l} className="flex justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                      <span className="text-gray-500">{l}</span>
                      <span className="text-white font-medium text-right max-w-[60%]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 text-center">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-bold text-white text-sm mb-1">50 Free Tools</h3>
                <p className="text-gray-500 text-xs mb-4">No login. No limits. Instant results.</p>
                <Link href="/tools" className="block w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all text-center">
                  Browse Tools →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-white/5 mt-20 py-8 text-center bg-[#0A0A14]">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms</Link>
          <Link href="/about"   className="hover:text-gray-400 transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
