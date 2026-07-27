import { useState } from "react";
import {
  TrendingUp, Award, Activity, Shield, Calendar, Filter, Download,
  FileSpreadsheet, ArrowUpRight, ArrowDownRight, Layers, BarChart2,
  PieChart, Clock, RefreshCw, CheckCircle2, XCircle, Search, ChevronDown
} from "lucide-react";

type DateRange = "today" | "7d" | "30d" | "ytd" | "all";

export function AnalyticsHub() {
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [selectedStrategy, setSelectedStrategy] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sideFilter, setSideFilter] = useState<"all" | "BUY" | "SELL">("all");

  // Key Analytics Summary Metrics
  const metrics = {
    netProfit: 148250.00,
    netRoi: 24.8,
    totalTrades: 193,
    winTrades: 142,
    lossTrades: 51,
    winRate: 73.57,
    profitFactor: 2.85,
    maxDrawdownPct: 4.2,
    sharpeRatio: 2.45,
    sortinoRatio: 3.12,
    calmarRatio: 2.88,
    avgTradePnl: 768.13,
    avgWin: 1850.00,
    avgLoss: -820.00,
    chargesTotal: 4820.00,
    expectancy: 768.13,
  };

  // Calendar Heatmap Data (Simulated trading days in July)
  const pnlCalendar = [
    { date: "Jul 1", day: "Mon", pnl: 4200, trades: 6 },
    { date: "Jul 2", day: "Tue", pnl: 8100, trades: 8 },
    { date: "Jul 3", day: "Wed", pnl: -2400, trades: 5 },
    { date: "Jul 4", day: "Thu", pnl: 12500, trades: 9 },
    { date: "Jul 5", day: "Fri", pnl: 6300, trades: 7 },
    { date: "Jul 8", day: "Mon", pnl: 9400, trades: 10 },
    { date: "Jul 9", day: "Tue", pnl: -1800, trades: 4 },
    { date: "Jul 10", day: "Wed", pnl: 15200, trades: 11 },
    { date: "Jul 11", day: "Thu", pnl: 7800, trades: 6 },
    { date: "Jul 12", day: "Fri", pnl: 11000, trades: 8 },
    { date: "Jul 15", day: "Mon", pnl: -3100, trades: 5 },
    { date: "Jul 16", day: "Tue", pnl: 8900, trades: 7 },
    { date: "Jul 17", day: "Wed", pnl: 14300, trades: 9 },
    { date: "Jul 18", day: "Thu", pnl: 6500, trades: 6 },
    { date: "Jul 19", day: "Fri", pnl: 9800, trades: 8 },
    { date: "Jul 22", day: "Mon", pnl: 18400, trades: 12 },
    { date: "Jul 23", day: "Tue", pnl: -4200, trades: 6 },
    { date: "Jul 24", day: "Wed", pnl: 12900, trades: 9 },
    { date: "Jul 25", day: "Thu", pnl: 7100, trades: 7 },
    { date: "Jul 26", day: "Fri", pnl: 10650, trades: 8 },
  ];

  // Hourly Performance Distribution
  const hourlyData = [
    { hour: "09:15 - 10:00", pnl: 48500, trades: 64, winRate: "78%" },
    { hour: "10:00 - 11:00", pnl: 32400, trades: 42, winRate: "74%" },
    { hour: "11:00 - 12:00", pnl: 12100, trades: 28, winRate: "65%" },
    { hour: "12:00 - 13:00", pnl: -4500, trades: 18, winRate: "50%" },
    { hour: "13:00 - 14:00", pnl: 18900, trades: 22, winRate: "68%" },
    { hour: "14:00 - 15:30", pnl: 40850, trades: 19, winRate: "79%" },
  ];

  // Strategy Comparison Matrix
  const strategiesList = [
    { name: "VWAP Reclaim Nifty Options", trades: 85, winRate: 76.4, pnl: 68400.00, pf: 3.12, maxDd: "3.1%", sharpe: 2.65 },
    { name: "BankNifty Options Scalper v2", trades: 64, winRate: 71.8, pnl: 52100.00, pf: 2.74, maxDd: "4.2%", sharpe: 2.38 },
    { name: "BTC Momentum Breakout", trades: 44, winRate: 70.4, pnl: 27750.00, pf: 2.51, maxDd: "3.8%", sharpe: 2.22 },
  ];

  // Trade History Execution Logs
  const tradeLogs = [
    { id: "ALG-9842", time: "2026-07-26 14:25", symbol: "NIFTY 24400 CE", type: "BUY", entry: 145.50, exit: 178.20, qty: 100, charges: 85.00, pnl: 3185.00, roi: "+22.4%", strategy: "VWAP Reclaim Nifty Options" },
    { id: "ALG-9841", time: "2026-07-26 13:10", symbol: "BANKNIFTY 52200 PE", type: "SELL", entry: 210.00, exit: 182.00, qty: 50, charges: 62.00, pnl: 1338.00, roi: "+13.3%", strategy: "BankNifty Options Scalper v2" },
    { id: "ALG-9840", time: "2026-07-26 11:45", symbol: "RELIANCE JUL FUT", type: "BUY", entry: 3120.00, exit: 3105.00, qty: 250, charges: 140.00, pnl: -3890.00, roi: "-0.48%", strategy: "VWAP Reclaim Nifty Options" },
    { id: "ALG-9839", time: "2026-07-26 10:15", symbol: "NIFTY 24350 PE", type: "BUY", entry: 98.40, exit: 134.10, qty: 150, charges: 95.00, pnl: 5260.00, roi: "+36.2%", strategy: "VWAP Reclaim Nifty Options" },
    { id: "ALG-9838", time: "2026-07-26 09:35", symbol: "BANKNIFTY 52100 CE", type: "BUY", entry: 285.00, exit: 342.50, qty: 60, charges: 78.00, pnl: 3372.00, roi: "+20.1%", strategy: "BankNifty Options Scalper v2" },
  ];

  const exportCSV = () => {
    const csvContent = [
      "Trade ID,Date Time,Symbol,Type,Entry Price,Exit Price,Qty,Charges,Net PnL,ROI %,Strategy",
      ...tradeLogs.map((t) => `"${t.id}","${t.time}","${t.symbol}","${t.type}",${t.entry},${t.exit},${t.qty},${t.charges},${t.pnl},"${t.roi}","${t.strategy}"`),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AlgoTrade_Analytics_Export_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLogs = tradeLogs.filter((t) => {
    const matchesSearch = t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || t.strategy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSide = sideFilter === "all" || t.type === sideFilter;
    const matchesStrat = selectedStrategy === "all" || t.strategy === selectedStrategy;
    return matchesSearch && matchesSide && matchesStrat;
  });

  return (
    <div className="space-y-6 text-foreground font-sans">
      
      {/* Top Header Bar matching AlgoTrade Dark Theme (#151c23) */}
      <div className="rounded-2xl border border-border bg-[#151c23] p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: "var(--gradient-primary)" }}>
            <Activity className="h-5 w-5 text-primary-foreground animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">AlgoTrade Analytics</h1>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-mono text-emerald-400 font-bold">
                LIVE TELEMETRY
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Real-time P&L analytics, execution metrics, and trade attribution for NIFTY & BANKNIFTY algorithms.</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Strategy Select */}
          <select
            value={selectedStrategy}
            onChange={(e) => setSelectedStrategy(e.target.value)}
            className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-mono outline-none focus:border-primary text-foreground"
          >
            <option value="all">All Strategies ({strategiesList.length})</option>
            {strategiesList.map((s) => (
              <option key={s.name} value={s.name}>{s.name}</option>
            ))}
          </select>

          {/* Date Range Selector Pills */}
          <div className="flex rounded-xl border border-border bg-card p-1 text-xs font-mono">
            {(["today", "7d", "30d", "ytd", "all"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`rounded-lg px-3 py-1.5 uppercase transition ${dateRange === r ? "bg-primary text-primary-foreground font-bold shadow-md" : "text-muted-foreground hover:text-foreground"}`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={exportCSV}
            className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-muted transition inline-flex items-center gap-1.5 text-foreground"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" /> Export CSV
          </button>
        </div>
      </div>

      {/* 6 Executive KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="rounded-2xl border border-border bg-[#151c23] p-4 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase text-muted-foreground">
            <span>Realized Net P&L</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">+₹{metrics.netProfit.toLocaleString("en-IN")}</div>
          <div className="text-[11px] text-emerald-400 font-mono">+{metrics.netRoi}% Net ROI</div>
        </div>

        <div className="rounded-2xl border border-border bg-[#151c23] p-4 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase text-muted-foreground">
            <span>Total Executions</span>
            <BarChart2 className="h-4 w-4 text-primary" />
          </div>
          <div className="text-xl font-bold font-mono text-white">{metrics.totalTrades}</div>
          <div className="text-[11px] text-muted-foreground font-mono">{metrics.winTrades} Wins / {metrics.lossTrades} Losses</div>
        </div>

        <div className="rounded-2xl border border-border bg-[#151c23] p-4 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase text-muted-foreground">
            <span>Win Rate</span>
            <Award className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">{metrics.winRate}%</div>
          <div className="text-[11px] text-muted-foreground font-mono">Profit Factor: {metrics.profitFactor}</div>
        </div>

        <div className="rounded-2xl border border-border bg-[#151c23] p-4 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase text-muted-foreground">
            <span>Max Drawdown</span>
            <Shield className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold font-mono text-rose-400">-{metrics.maxDrawdownPct}%</div>
          <div className="text-[11px] text-muted-foreground font-mono">Peak Recovery: 1.2 Days</div>
        </div>

        <div className="rounded-2xl border border-border bg-[#151c23] p-4 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase text-muted-foreground">
            <span>Sharpe Ratio</span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">{metrics.sharpeRatio}</div>
          <div className="text-[11px] text-muted-foreground font-mono">Sortino: {metrics.sortinoRatio}</div>
        </div>

        <div className="rounded-2xl border border-border bg-[#151c23] p-4 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase text-muted-foreground">
            <span>Avg Trade P&L</span>
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">+₹{metrics.avgTradePnl}</div>
          <div className="text-[11px] text-muted-foreground font-mono">Charges: ₹{metrics.chargesTotal}</div>
        </div>

      </div>

      {/* Analytics Main Section: Charts & Heatmaps */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Cumulative Capital Growth / Equity Curve (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-[#151c23] p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" /> AlgoTrade Capital Growth Curve
              </h3>
              <p className="text-xs text-muted-foreground">Realized equity trajectory vs NIFTY 50 Index benchmark.</p>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-lg">
              +₹{metrics.netProfit.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Visual Interactive Equity Curve Bars */}
          <div className="h-64 w-full rounded-xl border border-border/60 bg-background/50 p-4 flex flex-col justify-between">
            <div className="flex justify-between text-xs font-mono text-muted-foreground">
              <span>Equity Starting: ₹5,00,000.00</span>
              <span className="text-emerald-400 font-bold">Current: ₹6,48,250.00</span>
            </div>

            <div className="flex items-end gap-2 h-44 pt-4">
              {pnlCalendar.map((d, idx) => {
                const heightPct = Math.max(15, Math.min(100, (d.pnl / 20000) * 100));
                const isProfit = d.pnl >= 0;
                return (
                  <div key={idx} className="flex-1 group relative flex flex-col items-center h-full justify-end">
                    {/* Hover Tooltip */}
                    <div className="absolute -top-12 hidden group-hover:flex flex-col items-center bg-card border border-border rounded px-2 py-1 text-[10px] font-mono shadow-2xl z-30 whitespace-nowrap">
                      <span>{d.date} ({d.day})</span>
                      <span className={isProfit ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                        {isProfit ? `+₹${d.pnl}` : `-₹${Math.abs(d.pnl)}`}
                      </span>
                    </div>

                    <div
                      className={`w-full rounded-t transition-all ${isProfit ? "bg-emerald-500/70 hover:bg-emerald-400" : "bg-rose-500/70 hover:bg-rose-400"}`}
                      style={{ height: `${Math.abs(heightPct)}%` }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between text-[10px] font-mono text-muted-foreground pt-2 border-t border-border/40">
              <span>Jul 01</span>
              <span>Jul 10</span>
              <span>Jul 20</span>
              <span>Jul 26</span>
            </div>
          </div>
        </div>

        {/* Hourly Alpha Distribution (1 Col) */}
        <div className="rounded-2xl border border-border bg-[#151c23] p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="border-b border-border pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Hourly Alpha Window
            </h3>
            <p className="text-xs text-muted-foreground">Identify most profitable execution time windows.</p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {hourlyData.map((h, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{h.hour}</span>
                  <span className={h.pnl >= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                    {h.pnl >= 0 ? `+₹${h.pnl.toLocaleString()}` : `-₹${Math.abs(h.pnl).toLocaleString()}`}
                  </span>
                </div>
                <div className="w-full bg-background h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${h.pnl >= 0 ? "bg-emerald-500" : "bg-rose-500"}`}
                    style={{ width: `${Math.min(100, Math.max(10, (Math.abs(h.pnl) / 50000) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border/60 text-[11px] font-mono text-muted-foreground flex justify-between">
            <span>Peak Window: <span className="text-emerald-400 font-bold">09:15 - 10:00 AM</span></span>
            <span>Win Rate: <span className="text-white font-bold">78%</span></span>
          </div>
        </div>

      </div>

      {/* Daily P&L Calendar Heatmap Grid */}
      <div className="rounded-2xl border border-border bg-[#151c23] p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-400" /> Daily P&L Telemetry Calendar (July 2026)
          </h3>
          <span className="text-xs font-mono text-muted-foreground">Green: Profit | Red: Loss</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 font-mono text-xs">
          {pnlCalendar.map((d, i) => {
            const isProfit = d.pnl >= 0;
            return (
              <div
                key={i}
                className={`rounded-xl border p-3 flex flex-col justify-between space-y-2 transition hover:scale-[1.02] ${isProfit ? "border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20" : "border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20"}`}
              >
                <div className="flex justify-between items-center text-muted-foreground text-[10px]">
                  <span>{d.date}</span>
                  <span className="font-semibold text-white">{d.day}</span>
                </div>
                <div className={`text-base font-bold ${isProfit ? "text-emerald-400" : "text-rose-400"}`}>
                  {isProfit ? `+₹${d.pnl.toLocaleString()}` : `-₹${Math.abs(d.pnl).toLocaleString()}`}
                </div>
                <div className="text-[10px] text-muted-foreground flex justify-between pt-1 border-t border-border/40">
                  <span>{d.trades} trades</span>
                  <span>{isProfit ? "WIN" : "LOSS"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategy Performance Comparison Table */}
      <div className="rounded-2xl border border-border bg-[#151c23] p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" /> Active Strategy Performance Breakdown
          </h3>
          <span className="text-xs font-mono text-muted-foreground">{strategiesList.length} Active Algorithms</span>
        </div>

        <div className="rounded-xl border border-border bg-background overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#151c23] border-b border-border text-muted-foreground">
                <tr>
                  <th className="p-3">Strategy Name</th>
                  <th className="p-3">Trades</th>
                  <th className="p-3">Win Rate</th>
                  <th className="p-3">Profit Factor</th>
                  <th className="p-3">Max DD</th>
                  <th className="p-3">Sharpe</th>
                  <th className="p-3">Net Realized P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {strategiesList.map((s, i) => (
                  <tr key={i} className="hover:bg-card/40 transition">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      {s.name}
                    </td>
                    <td className="p-3 text-muted-foreground">{s.trades}</td>
                    <td className="p-3 font-bold text-emerald-400">{s.winRate}%</td>
                    <td className="p-3 text-white">{s.pf}</td>
                    <td className="p-3 text-rose-400">{s.maxDd}</td>
                    <td className="p-3 text-primary font-bold">{s.sharpe}</td>
                    <td className="p-3 font-bold text-emerald-400">+₹{s.pnl.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Trade History Execution Log Table */}
      <div className="rounded-2xl border border-border bg-[#151c23] p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-emerald-400" /> Executed Trade History Telemetry
            </h3>
            <p className="text-xs text-muted-foreground">Detailed trade attribution, entry/exit prices, and statutory fees.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search trades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl border border-border bg-card pl-9 pr-3 py-1.5 text-xs font-mono outline-none focus:border-primary text-foreground"
              />
            </div>

            {/* Side Filter */}
            <div className="flex rounded-xl border border-border bg-card p-1 text-xs font-mono">
              <button
                onClick={() => setSideFilter("all")}
                className={`rounded-lg px-2.5 py-1 transition ${sideFilter === "all" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
              >
                ALL
              </button>
              <button
                onClick={() => setSideFilter("BUY")}
                className={`rounded-lg px-2.5 py-1 transition ${sideFilter === "BUY" ? "bg-emerald-500 text-white font-bold" : "text-muted-foreground hover:text-foreground"}`}
              >
                BUY
              </button>
              <button
                onClick={() => setSideFilter("SELL")}
                className={`rounded-lg px-2.5 py-1 transition ${sideFilter === "SELL" ? "bg-rose-500 text-white font-bold" : "text-muted-foreground hover:text-foreground"}`}
              >
                SELL
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#151c23] border-b border-border text-muted-foreground">
                <tr>
                  <th className="p-3">Trade ID</th>
                  <th className="p-3">Date / Time</th>
                  <th className="p-3">Symbol</th>
                  <th className="p-3">Side</th>
                  <th className="p-3">Entry</th>
                  <th className="p-3">Exit</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Statutory Fees</th>
                  <th className="p-3">Net P&L</th>
                  <th className="p-3">Strategy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.map((t) => {
                  const isWin = t.pnl >= 0;
                  return (
                    <tr key={t.id} className="hover:bg-card/40 transition">
                      <td className="p-3 font-bold text-white">{t.id}</td>
                      <td className="p-3 text-muted-foreground">{t.time}</td>
                      <td className="p-3 font-bold text-foreground">{t.symbol}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.type === "BUY" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="p-3 text-foreground">₹{t.entry}</td>
                      <td className="p-3 text-foreground">₹{t.exit}</td>
                      <td className="p-3 text-muted-foreground">{t.qty}</td>
                      <td className="p-3 text-muted-foreground">₹{t.charges}</td>
                      <td className={`p-3 font-bold ${isWin ? "text-emerald-400" : "text-rose-400"}`}>
                        {isWin ? `+₹${t.pnl.toLocaleString()}` : `-₹${Math.abs(t.pnl).toLocaleString()}`} ({t.roi})
                      </td>
                      <td className="p-3 text-muted-foreground">{t.strategy}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
