import type { Metadata } from "next";
import OpenGraphClient from "./client";

export const metadata: Metadata = {
  title:       "Free Open Graph Tag Generator — Preview on 5 Platforms | PursTech",
  description: "Generate Open Graph and Twitter Card tags with live previews for Facebook, Twitter, LinkedIn, Discord and Slack. See exactly how your links look before sharing.",
  keywords:    ["open graph generator","og tag generator","facebook meta tags","social media preview tool","twitter card generator"],
  openGraph: { title:"Free Open Graph Tag Generator | PursTech", description:"Generate OG tags with live previews for 5 social platforms. Free, no login.", url:"https://purstech.com/tools/open-graph-generator", siteName:"PursTech", images:[{url:"/og-image.png",width:1200,height:630}] },
  twitter:  { card:"summary_large_image", title:"Free Open Graph Generator | PursTech", description:"5-platform social preview: Facebook, Twitter, LinkedIn, Discord, Slack.", images:["/og-image.png"] },
  alternates: { canonical:"/tools/open-graph-generator" },
};

const toolSchema = { "@context":"https://schema.org","@type":"SoftwareApplication",name:"Open Graph Tag Generator",description:"Free online tool to generate Open Graph and Twitter Card tags with 5-platform live preview.",url:"https://purstech.com/tools/open-graph-generator",applicationCategory:"DeveloperApplication",operatingSystem:"Any",offers:{"@type":"Offer",price:"0",priceCurrency:"USD"} };

export default function OpenGraphPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <OpenGraphClient />
    </>
  );
}
