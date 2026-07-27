import { useState } from "react";
import { Shield, BookOpen, AlertTriangle, Lock, CheckCircle2, HeartPulse, Edit3 } from "lucide-react";

export function RiskAndJournal() {
  const [activeTab, setActiveTab] = useState<"risk" | "journal">("risk");
  const [killSwitchActive, setKillSwitchActive] = useState(false);

  // Risk Parameters
  const [maxDailyLoss, setMaxDailyLoss] = useState("10000");
  const [maxTradesPerDay, setMaxTradesPerDay] = useState("10");
  const [maxPositionSize, setMaxPositionSize] = useState("200");

  // Journal Entries
  const [journalEntries, setJournalEntries] = useState([
    { id: "J1", date: "2026-07-26", strategy: "VWAP Reclaim Nifty", pnl: "+₹4,820", emotion: "Disciplined", mistake: "None", notes: "Followed setup cleanly on 5m timeframe." },
    { id: "J2", date: "2026-07-25", strategy: "BankNifty Options Scalper", pnl: "-₹1,500", emotion: "Impatient", mistake: "Chased breakout", notes: "Entered too early before candle closed above Resistance." },
  ]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Risk Guard & Automated Journal</h2>
            <p className="text-xs text-muted-foreground">Institutional drawdown caps, circuit breakers, emergency exit kill switch, and trade psychology journal.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl border border-border bg-background p-1 text-xs font-mono">
          <button
            onClick={() => setActiveTab("risk")}
            className={`rounded-lg px-3 py-1.5 transition ${activeTab === "risk" ? "bg-card text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
          >
            Risk Guard Limits
          </button>
          <button
            onClick={() => setActiveTab("journal")}
            className={`rounded-lg px-3 py-1.5 transition ${activeTab === "journal" ? "bg-card text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
          >
            Trade Journal ({journalEntries.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Risk Parameters & Kill Switch */}
      {activeTab === "risk" && (
        <div className="space-y-6">
          
          {/* Emergency Kill Switch Banner */}
          <div className={`rounded-2xl border p-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition ${killSwitchActive ? "border-rose-500/60 bg-rose-500/15" : "border-amber-500/30 bg-amber-500/10"}`}>
            <div className="flex items-center gap-3">
              <AlertTriangle className={`h-6 w-6 shrink-0 ${killSwitchActive ? "text-rose-400 animate-pulse" : "text-amber-400"}`} />
              <div>
                <h3 className="font-bold text-sm text-foreground">Emergency Account Kill Switch</h3>
                <p className="text-xs text-muted-foreground">
                  {killSwitchActive
                    ? "KILL SWITCH ENGAGED! All open positions squared off. Auto-trading locked for 24 hours."
                    : "Instantly square off all active positions and block strategy execution for the rest of the trading day."}
                </p>
              </div>
            </div>

            <button
              onClick={() => setKillSwitchActive(!killSwitchActive)}
              className={`rounded-xl px-5 py-2.5 text-xs font-bold transition shadow-lg shrink-0 ${killSwitchActive ? "bg-emerald-500 text-white" : "bg-rose-500 hover:bg-rose-600 text-white"}`}
            >
              {killSwitchActive ? "Deactivate & Re-enable Trading" : "ENGAGE KILL SWITCH NOW"}
            </button>
          </div>

          {/* Risk Limit Form Controls */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-background p-4 space-y-2">
              <label className="text-xs text-muted-foreground font-mono">Max Daily Loss Cap (INR)</label>
              <input
                type="text"
                value={maxDailyLoss}
                onChange={(e) => setMaxDailyLoss(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-mono outline-none focus:border-primary"
              />
              <span className="text-[10px] text-muted-foreground">Bot auto-stops if daily MTM loss reaches ₹{maxDailyLoss}</span>
            </div>

            <div className="rounded-xl border border-border bg-background p-4 space-y-2">
              <label className="text-xs text-muted-foreground font-mono">Max Trades Per Day</label>
              <input
                type="text"
                value={maxTradesPerDay}
                onChange={(e) => setMaxTradesPerDay(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-mono outline-none focus:border-primary"
              />
              <span className="text-[10px] text-muted-foreground">Prevents overtrading & revenge trades</span>
            </div>

            <div className="rounded-xl border border-border bg-background p-4 space-y-2">
              <label className="text-xs text-muted-foreground font-mono">Max Quantity / Exposure</label>
              <input
                type="text"
                value={maxPositionSize}
                onChange={(e) => setMaxPositionSize(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-mono outline-none focus:border-primary"
              />
              <span className="text-[10px] text-muted-foreground">Maximum position size allowed per trade</span>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Automated Trade Journal */}
      {activeTab === "journal" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-background overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-card border-b border-border text-muted-foreground">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Strategy</th>
                  <th className="p-3">P&L</th>
                  <th className="p-3">Emotion Tag</th>
                  <th className="p-3">Mistake Check</th>
                  <th className="p-3">Notes & Commentary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {journalEntries.map((j) => (
                  <tr key={j.id} className="hover:bg-muted/20 transition">
                    <td className="p-3 font-semibold text-foreground">{j.date}</td>
                    <td className="p-3">{j.strategy}</td>
                    <td className={`p-3 font-bold ${j.pnl.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}>
                      {j.pnl}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">
                        {j.emotion}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{j.mistake}</td>
                    <td className="p-3 text-muted-foreground">{j.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
