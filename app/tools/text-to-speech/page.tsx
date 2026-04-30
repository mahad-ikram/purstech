"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const RELATED_TOOLS = [
  { icon: "📝", name: "Word Counter",    slug: "word-counter"    },
  { icon: "🔤", name: "Case Converter",  slug: "case-converter"  },
  { icon: "📋", name: "Text Summarizer", slug: "text-summarizer" },
  { icon: "✍️", name: "Grammar Checker", slug: "grammar-checker" },
  { icon: "📄", name: "Lorem Ipsum Gen", slug: "lorem-ipsum"     },
];

const FAQ = [
  { q: "How does the text to speech tool work?", a: "It uses your browser's built-in Web Speech API to convert text into spoken audio. No audio is ever sent to a server — everything runs entirely on your device." },
  { q: "What voices are available?", a: "The available voices depend on your operating system and browser. Windows, macOS, iOS and Android each include different built-in voices. Most systems offer voices in multiple languages." },
  { q: "Can I download the audio?", a: "Browser-based speech synthesis does not produce a downloadable audio file directly. To save audio, use your system's screen recording tool or upgrade to Pro for MP3 export." },
  { q: "What languages are supported?", a: "Supported languages depend on the voices installed on your device. Most modern systems support English, Spanish, French, German, Italian, Chinese, Japanese and many more." },
  { q: "Is there a character limit?", a: "The free version supports up to 5,000 characters. For longer documents, PursTech Pro removes this limit entirely." },
];

const CHAR_LIMIT = 5000;

export default function TextToSpeechPage() {
  const [text,        setText]        = useState("");
  const [voices,      setVoices]      = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [rate,        setRate]        = useState(1);
  const [pitch,       setPitch]       = useState(1);
  const [volume,      setVolume]      = useState(1);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [isPaused,    setIsPaused]    = useState(false);
  const [supported,   setSupported]   = useState(true);
  const [openFaq,     setOpenFaq]     = useState<number | null>(null);
  const utteranceRef  = useRef<SpeechSynthesisUtterance | null>(null);

  // Load voices
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
      return;
    }
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) {
        setVoices(v);
        const english = v.find(voice => voice.lang.startsWith("en") && voice.default) || v.find(v => v.lang.startsWith("en")) || v[0];
        if (english) setSelectedVoice(english.name);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  const handleSpeak = () => {
    if (!text.trim() || !supported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.slice(0, CHAR_LIMIT));
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.rate   = rate;
    utterance.pitch  = pitch;
    utterance.volume = volume;
    utterance.onstart  = () => { setIsPlaying(true);  setIsPaused(false); };
    utterance.onend    = () => { setIsPlaying(false); setIsPaused(false); };
    utterance.onerror  = () => { setIsPlaying(false); setIsPaused(false); };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / (rate * 130));
  const overLimit = text.length > CHAR_LIMIT;

  // Group voices by language
  const voiceGroups = voices.reduce((acc, v) => {
    const lang = v.lang.split("-")[0].toUpperCase();
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(v);
    return acc;
  }, {} as Record<string, SpeechSynthesisVoice[]>);

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <nav className="border-b border-white/5 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">← All Tools</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span>›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span>›</span>
          <Link href="/categories/text" className="hover:text-gray-400">Text Tools</Link><span>›</span>
          <span className="text-gray-400">Text to Speech</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🔊</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">Text to Speech</h1>
              <p className="text-gray-500 mt-1">Convert any text to natural-sounding speech — choose voice, speed and pitch. Free, no login.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Free","No Login","Multiple Voices","Adjustable Speed","Private"].map(b => (
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium">✓ {b}</span>
            ))}
          </div>
        </div>

        {!supported && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 mb-6 text-yellow-400 text-sm">
            ⚠️ Your browser does not support the Web Speech API. Please try Chrome, Edge or Safari.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Text input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Text to Speak</label>
                <span className={`text-xs font-semibold ${overLimit ? "text-red-400" : "text-gray-600"}`}>
                  {text.length.toLocaleString()} / {CHAR_LIMIT.toLocaleString()} chars
                </span>
              </div>
              <textarea value={text} onChange={e => setText(e.target.value)}
                placeholder="Type or paste the text you want to hear spoken aloud..."
                className={`w-full h-44 px-5 py-4 rounded-2xl bg-[#13131F] border text-white placeholder-gray-600 focus:outline-none transition-all resize-none text-sm leading-relaxed ${
                  overLimit ? "border-red-500/50" : "border-white/5 focus:border-[#6C3AFF]/50"
                }`} />
              {overLimit && <p className="text-xs text-red-400 mt-1">Character limit exceeded. First {CHAR_LIMIT.toLocaleString()} characters will be spoken.</p>}
            </div>

            {/* Voice selector */}
            {voices.length > 0 && (
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-wider">Voice</label>
                <select value={selectedVoice} onChange={e => setSelectedVoice(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#13131F] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all">
                  {Object.entries(voiceGroups).sort().map(([lang, langVoices]) => (
                    <optgroup key={lang} label={`${lang} (${langVoices.length})`}>
                      {langVoices.map(v => (
                        <option key={v.name} value={v.name}>
                          {v.name}{v.default ? " ★" : ""}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            )}

            {/* Sliders */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { label:"Speed",  value:rate,   min:0.5, max:2,   step:0.1, set:setRate,   format:(v:number) => `${v.toFixed(1)}×`, color:"#6C3AFF" },
                { label:"Pitch",  value:pitch,  min:0,   max:2,   step:0.1, set:setPitch,  format:(v:number) => v.toFixed(1),       color:"#00D4FF" },
                { label:"Volume", value:volume, min:0,   max:1,   step:0.1, set:setVolume, format:(v:number) => `${Math.round(v*100)}%`, color:"#00E676" },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{s.label}</span>
                    <span className="text-sm font-extrabold" style={{ color: s.color }}>{s.format(s.value)}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                    onChange={e => s.set(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ background:`linear-gradient(to right, ${s.color} ${((s.value-s.min)/(s.max-s.min))*100}%, #1a1a2e ${((s.value-s.min)/(s.max-s.min))*100}%)` }}
                  />
                  <div className="flex justify-between text-[10px] text-gray-700 mt-1">
                    <span>{s.min}</span><span>{s.max}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Play controls */}
            <div className="flex items-center gap-3">
              <button onClick={handleSpeak} disabled={!text.trim() || !supported || isPlaying}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] hover:opacity-90 disabled:opacity-40 text-white font-extrabold transition-all shadow-xl shadow-violet-900/30 text-lg">
                {isPlaying ? "▶ Playing..." : "▶ Speak"}
              </button>

              {isPlaying && (
                <button onClick={handlePause}
                  className="px-6 py-4 rounded-2xl bg-[#13131F] border border-[#6C3AFF]/30 hover:border-[#6C3AFF] text-white font-bold transition-all">
                  {isPaused ? "▶ Resume" : "⏸ Pause"}
                </button>
              )}

              {(isPlaying || isPaused) && (
                <button onClick={handleStop}
                  className="px-6 py-4 rounded-2xl bg-[#13131F] border border-red-500/20 hover:border-red-500/50 text-red-400 font-bold transition-all">
                  ⏹ Stop
                </button>
              )}
            </div>

            {/* Live indicator */}
            {isPlaying && !isPaused && (
              <div className="flex items-center gap-3 bg-[#13131F] border border-green-500/20 rounded-2xl px-5 py-3">
                <div className="flex gap-1 items-end">
                  {[3,5,4,6,3].map((h, i) => (
                    <div key={i} className="w-1 bg-green-400 rounded-full animate-pulse"
                      style={{ height:`${h * 4}px`, animationDelay:`${i * 100}ms` }} />
                  ))}
                </div>
                <span className="text-green-400 text-sm font-semibold">Speaking...</span>
                {wordCount > 0 && <span className="text-gray-500 text-xs ml-auto">~{readingTime} min at {rate.toFixed(1)}× speed</span>}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">📊 Text Stats</h3>
              <div className="space-y-3">
                {[
                  { label:"Words",        value:wordCount.toLocaleString()          },
                  { label:"Characters",   value:text.length.toLocaleString()        },
                  { label:"Speak time",   value:wordCount > 0 ? `~${readingTime} min` : "—" },
                  { label:"Voices found", value:voices.length > 0 ? `${voices.length} voices` : "None" },
                ].map(s => (
                  <div key={s.label} className="flex justify-between border-b border-white/5 pb-2 last:border-0">
                    <span className="text-xs text-gray-500">{s.label}</span>
                    <span className="text-xs text-white font-semibold">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">💡 Usage Tips</h3>
              <div className="space-y-2 text-xs text-gray-500">
                {[
                  "Slow down speed for language learning",
                  "Speed up for proofreading your writing",
                  "Lower pitch for a deeper narrator voice",
                  "Use with Word Counter to estimate length",
                  "Chrome has the most voices available",
                ].map(t => (
                  <div key={t} className="flex items-start gap-2"><span className="text-[#6C3AFF] mt-0.5">→</span><span>{t}</span></div>
                ))}
              </div>
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">🔧 Related Tools</h3>
              <div className="space-y-2">
                {RELATED_TOOLS.map(tool => (
                  <Link key={tool.slug} href={`/tools/${tool.slug}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#0A0A14] transition-colors group">
                    <span className="text-xl">{tool.icon}</span>
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{tool.name}</span>
                    <span className="ml-auto text-gray-700 group-hover:text-[#6C3AFF] transition-colors">→</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold text-white text-sm mb-1">PursTech Pro</h3>
              <p className="text-gray-500 text-xs mb-4">MP3 download, unlimited length, premium voices</p>
              <button className="w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all">Get Pro — $7/mo</button>
            </div>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">📖 How to Use Text to Speech</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step:"1", title:"Enter Your Text",      desc:"Type or paste up to 5,000 characters into the text box. Any language your device supports will work." },
              { step:"2", title:"Choose Voice & Speed", desc:"Select a voice from your device's installed voices. Adjust speed, pitch and volume using the sliders." },
              { step:"3", title:"Press Speak",          desc:"Click the Speak button to hear your text read aloud. Pause, resume or stop at any time." },
            ].map(s => (
              <div key={s.step} className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-[#6C3AFF]/20 border border-[#6C3AFF]/30 flex items-center justify-center text-[#6C3AFF] font-black text-lg mb-4">{s.step}</div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <span className="font-semibold text-white text-sm">{item.q}</span>
                  <span className="text-[#6C3AFF] text-lg ml-4 flex-shrink-0">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && <div className="px-6 pb-4"><p className="text-gray-400 text-sm leading-relaxed">{item.a}</p></div>}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 mt-20 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <p className="text-gray-700 text-xs mt-2">© 2025 PursTech. Free online tools for everyone.</p>
      </footer>
    </div>
  );
}
