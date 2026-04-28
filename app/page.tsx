export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A14] flex flex-col items-center justify-center p-6 font-sans">
      <div className="text-center space-y-6 max-w-3xl w-full">
        
        {/* HERO HEADLINE */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
          Stop Searching. <br/>
          <span className="text-[#6C3AFF]">Start Doing.</span>
        </h1>
        
        <p className="text-xl text-gray-400 font-medium">
          The World's Largest Free Tool Ecosystem. Powered by AI. Built for Everyone.
        </p>
        
        {/* SEARCH BAR */}
        <div className="w-full mt-8 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search tools..."
            className="w-full px-6 py-4 rounded-xl bg-[#13131F] border border-[#6C3AFF]/40 text-white focus:outline-none focus:border-[#00D4FF] transition text-lg shadow-[0_0_15px_rgba(108,58,255,0.1)]"
          />
          <button className="px-8 py-4 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] transition-all duration-300 font-bold text-white shadow-lg">
            Search
          </button>
        </div>
        
        {/* TRUST BADGES */}
        <div className="flex justify-center gap-4 md:gap-8 text-sm md:text-base text-gray-500 mt-8 font-semibold">
          <span>✅ Free Forever</span>
          <span>✅ No Login</span>
          <span>✅ Instant Results</span>
        </div>
        
      </div>
    </main>
  );
}
