"use client";

import { useState, useEffect } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const el = document.documentElement;
      const st = el.scrollTop || document.body.scrollTop;
      const sh = el.scrollHeight - el.clientHeight;
      setProgress(sh > 0 ? (st / sh) * 100 : 0);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  
  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-[#13131F]">
      <div className="h-full bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] transition-all duration-75"
        style={{ width: `${progress}%` }} />
    </div>
  );
}

export function TableOfContents({ items }: { items: { id: string; text: string }[] }) {
  const [active, setActive] = useState("");
  
  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY + 120;
      for (let i = items.length - 1; i >= 0; i--) {
        const el = document.getElementById(items[i].id);
        if (el && el.offsetTop <= scrollY) { setActive(items[i].id); break; }
      }
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [items]);
  
  return (
    <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 mb-8">
      <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">📋 Table of Contents</h2>
      <ol className="space-y-2">
        {items.map((item, i) => (
          <li key={item.id} className="flex items-start gap-2">
            <span className="text-gray-600 font-mono text-xs mt-0.5 w-5 flex-shrink-0">{String(i+1).padStart(2,"0")}</span>
            <a href={`#${item.id}`} 
               className={`text-sm transition-colors ${active === item.id ? "text-[#6C3AFF] font-semibold" : "text-gray-400 hover:text-[#6C3AFF]"}`}>
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}