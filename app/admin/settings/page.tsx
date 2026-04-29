"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    maintenanceMode:    false,
    adsenseEnabled:     true,
    proEnabled:         false,
    apiEnabled:         false,
    agentsMasterSwitch: true,
    autoPublishTools:   false,
    autoPublishBlogs:   true,
    newUserSignups:     true,
    emailNotifications: true,
    budgetAlert:        30,
    dailyToolLimit:     5,
    notificationEmail:  "admin@purstech.com",
    siteName:           "PursTech",
    siteTagline:        "Stop Searching. Start Doing.",
    googleAnalyticsId:  "",
    adsenseId:          "",
  });

  const [toast, setToast]     = useState("");
  const [saved,  setSaved]    = useState(false);

  const set = (k: keyof typeof settings, v: boolean | number | string) =>
    setSettings((s) => ({ ...s, [k]: v }));

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const handleSave = () => {
    setSaved(true);
    showToast("✅ Settings saved");
    setTimeout(() => setSaved(false), 2000);
  };

  // ── Toggle row ────────────────────────────────────────────────────────────
  function ToggleRow({ label, sub, value, onChange, danger = false }: {
    label: string; sub: string; value: boolean; onChange: (v: boolean) => void; danger?: boolean;
  }) {
    return (
      <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
        <div className="flex-1 min-w-0 pr-4">
          <div className={`text-sm font-semibold ${danger && value ? "text-orange-400" : "text-white"}`}>{label}</div>
          <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
        </div>
        <button onClick={() => onChange(!value)}
          className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${
            value ? (danger ? "bg-orange-500" : "bg-[#6C3AFF]") : "bg-gray-700"
          }`}>
          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${value ? "left-7" : "left-1"}`} />
        </button>
      </div>
    );
  }

  // ── Input row ─────────────────────────────────────────────────────────────
  function InputRow({ label, sub, value, onChange, type = "text", placeholder = "" }: {
    label: string; sub: string; value: string | number; onChange: (v: string) => void;
    type?: string; placeholder?: string;
  }) {
    return (
      <div className="py-3 border-b border-white/5 last:border-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white">{label}</div>
            <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
          </div>
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-48 px-3 py-2 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 text-sm transition-all placeholder-gray-600 text-right"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#13131F] border border-[#6C3AFF]/30 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl z-50">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Settings</h1>
          <p className="text-gray-500 text-sm mt-0.5">Master controls for your entire PursTech platform.</p>
        </div>
        <button onClick={handleSave}
          className="px-6 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white font-bold text-sm transition-all shadow-lg shadow-violet-900/30">
          {saved ? "✅ Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Site controls ── */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-1">🌐 Site Controls</h2>
          <p className="text-xs text-gray-500 mb-4">Master on/off switches for your platform features.</p>

          <ToggleRow
            label="Maintenance Mode"
            sub="Shows a 'Back soon' page to all visitors. Use during major updates."
            value={settings.maintenanceMode}
            onChange={(v) => set("maintenanceMode", v)}
            danger
          />
          <ToggleRow
            label="Google AdSense"
            sub="Show ads across all tool pages and blog posts."
            value={settings.adsenseEnabled}
            onChange={(v) => set("adsenseEnabled", v)}
          />
          <ToggleRow
            label="PursTech Pro Subscriptions"
            sub="Allow users to subscribe to the Pro tier."
            value={settings.proEnabled}
            onChange={(v) => set("proEnabled", v)}
          />
          <ToggleRow
            label="Public API Access"
            sub="Allow developers to use the PursTech API."
            value={settings.apiEnabled}
            onChange={(v) => set("apiEnabled", v)}
          />
          <ToggleRow
            label="New User Registrations"
            sub="Allow new users to create accounts."
            value={settings.newUserSignups}
            onChange={(v) => set("newUserSignups", v)}
          />
        </div>

        {/* ── AI Agent controls ── */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-1">🤖 AI Agent Controls</h2>
          <p className="text-xs text-gray-500 mb-4">Control how your AI agents behave.</p>

          <ToggleRow
            label="AI Agents Master Switch"
            sub="Enable or pause ALL AI agents at once."
            value={settings.agentsMasterSwitch}
            onChange={(v) => set("agentsMasterSwitch", v)}
          />
          <ToggleRow
            label="Auto-publish AI tools"
            sub="Forge Agent deploys tools live without your approval."
            value={settings.autoPublishTools}
            onChange={(v) => set("autoPublishTools", v)}
            danger
          />
          <ToggleRow
            label="Auto-publish AI blogs"
            sub="Quill Agent publishes blog posts without your approval."
            value={settings.autoPublishBlogs}
            onChange={(v) => set("autoPublishBlogs", v)}
          />

          <div className="py-3 border-b border-white/5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-sm font-semibold text-white">Daily tool build limit</div>
                <div className="text-xs text-gray-500">Max new tools Forge can build per day</div>
              </div>
              <span className="text-lg font-extrabold text-[#6C3AFF]">{settings.dailyToolLimit}</span>
            </div>
            <input type="range" min={1} max={20} value={settings.dailyToolLimit}
              onChange={(e) => set("dailyToolLimit", Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ background:`linear-gradient(to right, #6C3AFF ${(settings.dailyToolLimit/20)*100}%, #1a1a2e ${(settings.dailyToolLimit/20)*100}%)` }}
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1"><span>1</span><span>20</span></div>
          </div>

          <div className="py-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-sm font-semibold text-white">Monthly API budget alert</div>
                <div className="text-xs text-gray-500">Email alert when AI API spending hits this limit</div>
              </div>
              <span className="text-lg font-extrabold text-yellow-400">${settings.budgetAlert}</span>
            </div>
            <input type="range" min={5} max={100} step={5} value={settings.budgetAlert}
              onChange={(e) => set("budgetAlert", Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ background:`linear-gradient(to right, #FFD700 ${((settings.budgetAlert-5)/95)*100}%, #1a1a2e ${((settings.budgetAlert-5)/95)*100}%)` }}
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1"><span>$5</span><span>$100</span></div>
          </div>
        </div>

        {/* ── Site info ── */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-1">⚙️ Site Information</h2>
          <p className="text-xs text-gray-500 mb-4">Basic site settings and branding.</p>

          <InputRow label="Site Name"    sub="Shown in browser tab and meta tags." value={settings.siteName}    onChange={(v) => set("siteName", v)}    placeholder="PursTech" />
          <InputRow label="Site Tagline" sub="Used in meta description and footer." value={settings.siteTagline} onChange={(v) => set("siteTagline", v)} placeholder="Stop Searching. Start Doing." />
          <InputRow label="Notification Email" sub="Where admin alerts are sent." value={settings.notificationEmail} onChange={(v) => set("notificationEmail", v)} type="email" placeholder="admin@purstech.com" />
        </div>

        {/* ── Integrations ── */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-1">🔌 Integrations</h2>
          <p className="text-xs text-gray-500 mb-4">Connect third-party services.</p>

          <InputRow label="Google Analytics ID"    sub="Format: G-XXXXXXXXXX"    value={settings.googleAnalyticsId} onChange={(v) => set("googleAnalyticsId", v)} placeholder="G-XXXXXXXXXX" />
          <InputRow label="Google AdSense ID"      sub="Format: ca-pub-XXXXXXXX" value={settings.adsenseId}         onChange={(v) => set("adsenseId", v)}         placeholder="ca-pub-XXXXXXXX" />

          <div className="mt-4 space-y-2">
            {[
              { name:"Stripe",     status:"Not connected", href:"https://stripe.com",          color:"text-gray-500" },
              { name:"RapidAPI",   status:"Not connected", href:"https://rapidapi.com/provider",color:"text-gray-500" },
              { name:"Cloudflare", status:"Connected ✓",   href:"https://cloudflare.com",       color:"text-green-400"},
              { name:"Supabase",   status:"Connected ✓",   href:"https://supabase.com",         color:"text-green-400"},
            ].map((int) => (
              <div key={int.name} className="flex items-center justify-between py-2">
                <span className="text-sm text-white">{int.name}</span>
                <div className="flex items-center gap-3">
                  <span className={`text-xs ${int.color}`}>{int.status}</span>
                  <a href={int.href} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-[#6C3AFF] hover:text-[#00D4FF] transition-colors">
                    {int.status.includes("✓") ? "Manage" : "Connect"} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Danger zone ── */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-red-400 mb-4">⚠️ Danger Zone</h2>
        <div className="space-y-3">
          {[
            { label:"Clear all AI agent logs",   sub:"Permanently delete all agent activity logs.",      action:"Clear Logs"    },
            { label:"Reset tool usage counters", sub:"Set all tool use counts back to zero.",            action:"Reset Counters"},
            { label:"Purge Supabase cache",      sub:"Force refresh all database queries.",              action:"Purge Cache"   },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-white">{item.label}</div>
                <div className="text-xs text-gray-500">{item.sub}</div>
              </div>
              <button
                onClick={() => showToast(`${item.action} — are you sure? (Refresh to cancel)`)}
                className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all flex-shrink-0 border border-red-500/20">
                {item.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save button bottom */}
      <div className="flex justify-end">
        <button onClick={handleSave}
          className="px-8 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white font-bold text-sm transition-all shadow-lg shadow-violet-900/30">
          {saved ? "✅ Settings Saved!" : "Save All Changes"}
        </button>
      </div>

    </div>
  );
}
