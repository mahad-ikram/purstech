import type { Metadata } from "next";
import RobotsTxtClient from "./client";

export const metadata: Metadata = {
  title:       "Free Robots.txt Generator Online — Create robots.txt Instantly | PursTech",
  description: "Generate a valid robots.txt file in seconds. Block AI bots, set CMS presets, test URLs against your rules and download — free, no login required.",
  keywords:    ["robots.txt generator","create robots.txt","robots.txt file generator","block ai bots robots.txt","seo robots.txt tool"],
  openGraph: { title:"Free Robots.txt Generator Online | PursTech", description:"Generate a valid robots.txt with CMS presets, AI bot blocking and live URL tester.", url:"https://purstech.com/tools/robots-txt-generator", siteName:"PursTech", images:[{url:"/og-image.png",width:1200,height:630}] },
  twitter:  { card:"summary_large_image", title:"Free Robots.txt Generator | PursTech", description:"Create robots.txt with CMS templates and AI bot blocking.", images:["/og-image.png"] },
  alternates: { canonical:"/tools/robots-txt-generator" },
};

const toolSchema = { "@context":"https://schema.org","@type":"SoftwareApplication",name:"Robots.txt Generator",description:"Free online tool to generate a valid robots.txt file with CMS presets and URL testing.",url:"https://purstech.com/tools/robots-txt-generator",applicationCategory:"DeveloperApplication",operatingSystem:"Any",offers:{"@type":"Offer",price:"0",priceCurrency:"USD"} };

export default function RobotsTxtPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <RobotsTxtClient />
    </>
  );
}
