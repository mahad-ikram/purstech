import type { Metadata } from "next";
import KeywordDensityClient from "./client";

export const metadata: Metadata = {
  title:       "Free Keyword Density Checker Online — N-gram Analysis & Readability | PursTech",
  description: "Analyse keyword density, bigrams, trigrams and readability score in any text. Live keyword highlighter, top words table, CSV export — free, no login.",
  keywords:    ["keyword density checker","keyword frequency analyzer","n-gram analysis tool","flesch reading ease calculator","seo content analyzer"],
  openGraph: { title:"Free Keyword Density Checker | PursTech", description:"Analyse keyword density, n-grams and readability in any text. Free SEO tool.", url:"https://purstech.com/tools/keyword-density-checker", siteName:"PursTech", images:[{url:"/og-image.png",width:1200,height:630}] },
  twitter:  { card:"summary_large_image", title:"Free Keyword Density Checker | PursTech", description:"N-gram analysis, readability score, live highlighter and CSV export.", images:["/og-image.png"] },
  alternates: { canonical:"/tools/keyword-density-checker" },
};

const toolSchema = { "@context":"https://schema.org","@type":"SoftwareApplication",name:"Keyword Density Checker",description:"Free online tool to analyse keyword density, n-grams and readability in any text.",url:"https://purstech.com/tools/keyword-density-checker",applicationCategory:"DeveloperApplication",operatingSystem:"Any",offers:{"@type":"Offer",price:"0",priceCurrency:"USD"} };

export default function KeywordDensityPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <KeywordDensityClient />
    </>
  );
}
