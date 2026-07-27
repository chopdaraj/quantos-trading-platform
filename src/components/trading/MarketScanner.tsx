import { useState } from "react";
import { Search, Activity, Zap, TrendingUp, Filter, CheckCircle2, ArrowUpRight, ArrowDownRight } from "lucide-react";

export function MarketScanner() {
  const [filterType, setFilterType] = useState<"all" | "ema" | "breakout" | "volume" | "oi">("all");

  const scanResults = [
    { symbol: "RELIANCE", type: "EMA Cross (20/50)", time: "10:14 AM", price: "₹3,120.50", change: "+1.85%", signal: "BULLISH", volume: "2.4M" },
    { symbol: "TATASTEEL", type: "Volume Spike (3x Avg)", time: "10:22 AM", price: "₹168.40", change: "+3.40%", signal: "BULLISH", volume: "18.5M" },
    { symbol: "BANKNIFTY 52000 CE", type: "OI Spike (+42%)", time: "10:30 AM", price: "₹310.00", change: "+24.5%", signal: "BULLISH", volume: "5.2M" },
    { symbol: "INFY", type: "Breakdown 20 Day Low", time: "10:45 AM", price: "₹1,780.00", change: "-2.10%", signal: "BEARISH", volume: "4.1M" },
  ];

  const filtered = scanResults.filter((r) => {
    if (filterType === "ema") return r.type.includes("EMA");
    if (filterType === "breakout") return r.type.includes("Break");
    if (filterType === "volume") return r.type.includes("Volume");
    if (filterType === "oi") return r.type.includes("OI");
    return true;
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <Search className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Real-Time Technical Scanner</h2>
            <p className="text-xs text-muted-foreground">Scan 500+ NSE stocks and F&O contracts for price breakouts, EMA crossovers, and OI spikes.</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex rounded-xl border border-border bg-background p-1 text-xs font-mono">
          <button
            onClick={() => setFilterType("all")}
            className={`rounded-lg px-3 py-1.5 transition ${filterType === "all" ? "bg-card text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
          >
            All Signals
          </button>
          <button
            onClick={() => setFilterType("ema")}
            className={`rounded-lg px-3 py-1.5 transition ${filterType === "ema" ? "bg-card text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
          >
            EMA Cross
          </button>
          <button
            onClick={() => setFilterType("breakout")}
            className={`rounded-lg px-3 py-1.5 transition ${filterType === "breakout" ? "bg-card text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
          >
            Breakouts
          </button>
          <button
            onClick={() => setFilterType("volume")}
            className={`rounded-lg px-3 py-1.5 transition ${filterType === "volume" ? "bg-card text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
          >
            Volume Spike
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-card border-b border-border text-muted-foreground">
              <tr>
                <th className="p-3">Symbol</th>
                <th className="p-3">Signal Pattern</th>
                <th className="p-3">Trigger Time</th>
                <th className="p-3">LTP</th>
                <th className="p-3">Change %</th>
                <th className="p-3">Volume</th>
                <th className="p-3">Sentiment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((s, i) => (
                <tr key={i} className="hover:bg-muted/20 transition">
                  <td className="p-3 font-bold text-foreground">{s.symbol}</td>
                  <td className="p-3 text-primary font-semibold">{s.type}</td>
                  <td className="p-3 text-muted-foreground">{s.time}</td>
                  <td className="p-3">{s.price}</td>
                  <td className={`p-3 font-bold ${s.change.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}>
                    {s.change}
                  </td>
                  <td className="p-3 text-muted-foreground">{s.volume}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${s.signal === "BULLISH" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                      {s.signal}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
