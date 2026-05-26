"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ Rule 3

// ✅ Rule 10: module scope — .map() calls below match
const RELATED_TOOLS = [
  { icon:"📝", name:"Word Counter",    slug:"word-counter"    },
  { icon:"🔤", name:"Case Converter",  slug:"case-converter"  },
  { icon:"📋", name:"Text Summarizer", slug:"text-summarizer" },
  { icon:"✍️", name:"Grammar Checker", slug:"grammar-checker" },
  { icon:"📄", name:"Lorem Ipsum Gen", slug:"lorem-ipsum"     },
];

// ✅ Rule 8: FAQ uses <details>/<summary> — openFaq useState removed
const FAQ = [
  { q:"How does the text to speech tool work?",
    a:"It uses your browser's built-in Web Speech API to convert text into spoken audio. No audio is ever sent to a server — everything runs entirely on your device." },
  { q:"What voices are available?",
    a:"The available voices depend on your operating system and browser. Windows, macOS, iOS and Android each include different built-in voices. Most systems offer voices in multiple languages. Chrome typically has the most voices available." },
  { q:"Can I download the audio?",
    a:"Browser-based speech synthesis does not produce a downloadable audio file directly. To save audio, use your system's screen recording tool or upgrade to Pro for MP3 export." },
  { q:"What languages are supported?",
    a:"Supported languages depend on the voices installed on your device. Most modern systems support English, Spanish, French, German, Italian, Chinese, Japanese and many more." },
  { q:"Is there a character limit?",
    a:"The free version supports up to 5,000 characters. For longer documents, PursTech Pro removes this limit entirely." },
];

const CHAR_LIMIT = 5000;

// ✅ UI Enhancement: sample text for immediate demo
const SAMPLE_TEXT = "Welcome to PursTech's free text to speech tool. This is a sample to help you test the voices, speed and pitch settings. Try adjusting the sliders to hear how the speech changes. You can type or paste any text here — up to 5,000 characters.";

export default function TextToSpeechClient({ children }: { children?: React.ReactNode }) {
  useTrackTool("text-to-speech", "text"); // ✅ Rule 3

  const [text,             setText]             = useState("");
  const [voices,           setVoices]           = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");
  const [rate,             setRate]             = useState(1);
  const [pitch,            setPitch]            = useState(1);
  const [volume,           setVolume]           = useState(1);
  const [isPlaying,        setIsPlaying]        = useState(false);
  const [isPaused,         setIsPaused]         = useState(false);
  const [supported,        setSupported]        = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false); return;
    }
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) {
        setVoices(v);
        const english = v.find(voice => voice.lang.startsWith("en") && voice.default)
          || v.find(v => v.lang.startsWith("en")) || v[0];
        // ✅ QA FIX: Use unique voiceURI instead of name to prevent duplicate matching
        if (english) setSelectedVoiceURI(english.voiceURI);
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
    
    // ✅ QA FIX: Find by voiceURI
    const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
    if (voice) { 
      utterance.voice = voice; 
      // ✅ QA FIX: Android Chrome requires the lang to be explicitly set, otherwise it defaults back
      utterance.lang = voice.lang; 
    }
    
    utterance.rate   = rate;
    utterance.pitch  = pitch;
    utterance.volume = volume;
    utterance.onstart = () => { setIsPlaying(true);  setIsPaused(false); };
    utterance.onend   = () => { setIsPlaying(false); setIsPaused(false); };
    utterance.onerror = () => { setIsPlaying(false); setIsPaused(false); };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (isPlaying && !isPaused) { window.speechSynthesis.pause();  setIsPaused(true);  }
    else if (isPaused)          { window.speechSynthesis.resume(); setIsPaused(false); }
  };
  const handleStop = () => { window.speechSynthesis.cancel(); setIsPlaying(false); setIsPaused(false); };

  const wordCount  = text.trim() ? text.trim().split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / (rate * 130));
  const overLimit  = text.length > CHAR_LIMIT;

  // ✅ QA FIX: Clean up Android locales and use Intl.DisplayNames for beautiful grouping
  const voiceGroups = voices.reduce((acc, v) => {
    // Split on either dash or underscore to isolate the base language code
    const baseCode = v.lang.split(/[-_]/)[0];
    let langName = baseCode.toUpperCase();
    
    try {
      const display = new Intl.DisplayNames(['en'], { type: 'language' }).of(baseCode);
      if (display) langName = display;
    } catch (e) {
      // Fallback to uppercase code if Intl fails
    }

    if (!acc[langName]) acc[langName] = [];
    acc[langName].push(v);
    return acc;
  }, {} as Record<string, SpeechSynthesisVoice[]>);

  return (
    // ✅ Rule 6: flex flex-col overflow-x-hidden
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col overflow-x-hidden">

      {/* ── Navbar — ✅ Rule 4: sticky + backdrop-blur + Go Pro ── */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
            <Link href="/pro" className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">Go Pro ⚡</Link>
          </div>
        </div>
      </nav>

      {/* ✅ Rule 7: flex-grow w-full on main */}
      <main className="max-w-7xl mx-auto px-4 py-10 flex-grow w-full">

        {/* ✅ Rule 11: aria-label + aria-hidden on › */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/text" className="hover:text-gray-400">Text Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">Text to Speech</span>
        </nav>

        {/* Server-rendered hero */}
        {children}

        {!supported && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 mb-6 text-yellow-400 text-sm">
            ⚠️ Your browser does not support the Web Speech API. Please try Chrome, Edge or Safari.
          </div>
        )}

        {/* ✅ QA FIX: min-w-0 w-full on BOTH grid children & parent */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0 w-full">
          <div className="lg:col-span-2 min-w-0 flex flex-col gap-5 w-full">

            {/* Text input */}
            <div className="min-w-0 w-full">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Text to Speak</label>
                <div className="flex items-center gap-3">
                  {!text && (
                    <button onClick={() => setText(SAMPLE_TEXT)}
                      className="text-xs text-[#6C3AFF] hover:text-white transition-colors">
                      Load sample
                    </button>
                  )}
                  {text && (
                    <button onClick={() => setText("")}
                      className="text-xs text-gray-600 hover:text-[#FF3A6C] transition-colors">
                      × Clear
                    </button>
                  )}
                  <span className={`text-xs font-semibold ${overLimit ? "text-red-400" : "text-gray-600"}`}>
                    {text.length.toLocaleString()} / {CHAR_LIMIT.toLocaleString()} chars
                  </span>
                </div>
              </div>
              <textarea value={text} onChange={e => setText(e.target.value)}
                placeholder="Type or paste the text you want to hear spoken aloud..."
                className={`w-full min-w-0 break-words h-44 px-5 py-4 rounded-2xl bg-[#13131F] border text-white placeholder-gray-600 focus:outline-none transition-all resize-none text-sm leading-relaxed ${
                  overLimit ? "border-red-500/50" : "border-white/5 focus:border-[#6C3AFF]/50"
                }`} />
              {overLimit && (
                <p className="text-xs text-red-400 mt-1">Character limit exceeded. First {CHAR_LIMIT.toLocaleString()} characters will be spoken.</p>
              )}
            </div>

            {/* Voice selector */}
            {voices.length > 0 && (
              <div className="min-w-0 w-full">
                <label className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-wider">Voice</label>
                {/* ✅ QA FIX: onChange updates the selectedVoiceURI */}
                <select value={selectedVoiceURI} onChange={e => setSelectedVoiceURI(e.target.value)}
                  className="w-full min-w-0 truncate px-4 py-3 rounded-xl bg-[#13131F] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all">
                  {Object.entries(voiceGroups).sort().map(([lang, langVoices]) => (
                    <optgroup key={lang} label={`${lang} (${langVoices.length})`}>
                      {langVoices.map(v => (
                        <option key={v.voiceURI} value={v.voiceURI}>
                          {v.name}{v.default ? " ★" : ""}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            )}

            {/* Sliders */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-5 min-w-0 w-full">
              {[
                { label:"Speed",  value:rate,   min:0.5, max:2, step:0.1, set:setRate,   format:(v:number)=>`${v.toFixed(1)}×`,        color:"#6C3AFF" },
                { label:"Pitch",  value:pitch,  min:0,   max:2, step:0.1, set:setPitch,  format:(v:number)=>v.toFixed(1),              color:"#00D4FF" },
                { label:"Volume", value:volume, min:0,   max:1, step:0.1, set:setVolume, format:(v:number)=>`${Math.round(v*100)}%`,   color:"#00E676" },
              ].map(s => (
                <div key={s.label} className="min-w-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{s.label}</span>
                    <span className="text-sm font-extrabold" style={{color:s.color}}>{s.format(s.value)}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                    onChange={e => s.set(Number(e.target.value))}
                    className="w-full min-w-0 h-2 rounded-full appearance-none cursor-pointer"
                    style={{background:`linear-gradient(to right, ${s.color} ${((s.value-s.min)/(s.max-s.min))*100}%, #1a1a2e ${((s.value-s.min)/(s.max-s.min))*100}%)`}} />
                  <div className="flex justify-between text-[10px] text-gray-700 mt-1">
                    <span>{s.min}</span><span>{s.max}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Play controls */}
            <div className="flex items-center gap-3 flex-wrap min-w-0 w-full">
              <button onClick={handleSpeak} disabled={!text.trim() || !supported || isPlaying}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] hover:opacity-90 disabled:opacity-40 text-white font-extrabold transition-all shadow-xl shadow-violet-900/30 text-lg flex-1 min-w-[140px]">
                {isPlaying ? "▶ Playing..." : "▶ Speak"}
              </button>
              {isPlaying && (
                <button onClick={handlePause}
                  className="px-6 py-4 rounded-2xl bg-[#13131F] border border-[#6C3AFF]/30 hover:border-[#6C3AFF] text-white font-bold transition-all flex-1 min-w-[120px]">
                  {isPaused ? "▶ Resume" : "⏸ Pause"}
                </button>
              )}
              {(isPlaying || isPaused) && (
                <button onClick={handleStop}
                  className="px-6 py-4 rounded-2xl bg-[#13131F] border border-red-500/20 hover:border-red-500/50 text-red-400 font-bold transition-all flex-1 min-w-[120px]">
                  ⏹ Stop
                </button>
              )}
            </div>

            {/* Live indicator */}
            {isPlaying && !isPaused && (
              <div className="flex items-center gap-3 bg-[#13131F] border border-green-500/20 rounded-2xl px-5 py-3 min-w-0 w-full">
                <div className="flex gap-1 items-end">
                  {[3,5,4,6,3].map((h,i) => (
                    <div key={i} className="w-1 bg-green-400 rounded-full animate-pulse"
                      style={{height:`${h*4}px`, animationDelay:`${i*100}ms`}} />
                  ))}
                </div>
                <span className="text-green-400 text-sm font-semibold">Speaking...</span>
                {wordCount > 0 && <span className="text-gray-500 text-xs ml-auto">~{readingTime} min at {rate.toFixed(1)}× speed</span>}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="min-w-0 flex flex-col gap-4 w-full">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0 w-full">
              <h3 className="text-sm font-bold text-white mb-4">📊 Text Stats</h3>
              <div className="space-y-3">
                {[
                  { label:"Words",        value:wordCount.toLocaleString()                                 },
                  { label:"Characters",   value:text.length.toLocaleString()                               },
                  { label:"Speak time",   value:wordCount > 0 ? `~${readingTime} min` : "—"               },
                  { label:"Voices found", value:voices.length > 0 ? `${voices.length} voices` : "None"   },
                ].map(s => (
                  <div key={s.label} className="flex justify-between border-b border-white/5 pb-2 last:border-0 min-w-0">
                    <span className="text-xs text-gray-500">{s.label}</span>
                    <span className="text-xs text-white font-semibold truncate ml-2">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0 w-full">
              <h3 className="text-sm font-bold text-white mb-4">💡 Usage Tips</h3>
              <div className="space-y-2 text-xs text-gray-500">
                {[
                  "Slow down speed for language learning",
                  "Speed up for proofreading your writing",
                  "Lower pitch for a deeper narrator voice",
                  "Use with Word Counter to estimate length",
                  "Chrome has the most voices available",
                ].map(t => (
                  <div key={t} className="flex items-start gap-2">
                    <span className="text-[#6C3AFF] mt-0.5 flex-shrink-0">→</span><span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0 w-full">
              <h3 className="text-sm font-bold text-white mb-4">🔧 Related Tools</h3>
              <div className="space-y-2">
                {RELATED_TOOLS.map(tool => (
                  <Link key={tool.slug} href={`/tools/${tool.slug}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#0A0A14] transition-colors group">
                    <span className="text-xl flex-shrink-0">{tool.icon}</span>
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors min-w-0 truncate">{tool.name}</span>
                    <span className="ml-auto text-gray-700 group-hover:text-[#6C3AFF] transition-colors flex-shrink-0">→</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 text-center min-w-0 w-full">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold text-white text-sm mb-1">PursTech Pro</h3>
              <p className="text-gray-500 text-xs mb-4">MP3 download, unlimited length, premium voices</p>
              <Link href="/pro"
                className="block w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all text-center">
                Get Pro — $7/mo
              </Link>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">📖 How to Use Text to Speech</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step:"1", title:"Enter Your Text",      desc:"Type or paste up to 5,000 characters into the text box, or click 'Load sample' to try it immediately." },
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

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{item.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 mt-20 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. Free online tools for everyone.</p>
      </footer>
    </div>
  );
}
