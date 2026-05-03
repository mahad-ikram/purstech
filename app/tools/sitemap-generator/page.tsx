import type { Metadata } from "next";
import SitemapGeneratorClient from "./client";

export const metadata: Metadata = {
  title:       "Free XML Sitemap Generator Online — Smart Priority & Google Ping | PursTech",
  description: "Generate a valid XML sitemap with smart auto-priority, bulk import, sitemap index mode and one-click Google ping. Download and submit in under 2 minutes.",
  keywords:    ["xml sitemap generator","sitemap.xml generator","create sitemap online","google sitemap tool","sitemap index generator"],
  openGraph: { title:"Free XML Sitemap Generator Online | PursTech", description:"Generate XML sitemaps with smart priority, bulk import and Google ping. Free, no login.", url:"https://purstech.com/tools/sitemap-generator", siteName:"PursTech", images:[{url:"/og-image.png",width:1200,height:630}] },
  twitter:  { card:"summary_large_image", title:"Free XML Sitemap Generator | PursTech", description:"Smart priority, bulk import, sitemap index and Google ping in one tool.", images:["/og-image.png"] },
  alternates: { canonical:"/tools/sitemap-generator" },
};

const toolSchema = { "@context":"https://schema.org","@type":"SoftwareApplication",name:"XML Sitemap Generator",description:"Free online sitemap generator with smart priority, bulk import, sitemap index support and Google ping.",url:"https://purstech.com/tools/sitemap-generator",applicationCategory:"DeveloperApplication",operatingSystem:"Any",offers:{"@type":"Offer",price:"0",priceCurrency:"USD"} };

export default function SitemapGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <SitemapGeneratorClient />
    </>
  );
}
