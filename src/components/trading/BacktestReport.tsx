import { useState } from "react";
import {
  TrendingUp, Download, FileSpreadsheet, FileText, CheckCircle2, Shield,
  Activity, ArrowUpRight, ArrowDownRight, Clock, Award, BarChart2, Layers
} from "lucide-react";

export function BacktestReport({ summary, trades, equityCurve }: { summary: any; trades: any[]; equityCurve: any[] }) {
  const [activeTab, setActiveTab] = useState<"summary" | "trades" | "monthly">("summary");

  if (!summary) return null;

  const exportCSV = () => {
    const csvContent = [
      "Trade ID,Date/Time,Symbol,Type,Entry Price,Exit Price,Qty,Gross PnL,Charges,Net PnL,Status",
      ...trades.map(
        (t) =>
          `"${t.id}","${t.time}","${t.symbol}","${t.type}",${t.entryPrice},${t.exitPrice},${t.qty},${(t.pnl + t.charges).toFixed(2)},${t.charges},${t.pnl},"${t.status}"`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `QuantOS_Backtest_Report_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      
      {/* Report Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-xl font-bold tracking-tight">Institutional Backtest Report</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            NSE / NIFTY 50 Tick Data Engine · Tested with brokerage, STT & slippage
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold hover:bg-muted transition inline-flex items-center gap-1.5"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" /> Export CSV
          </button>
          <button
            onClick={exportCSV}
            className="rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold hover:bg-muted transition inline-flex items-center gap-1.5"
          >
            <FileText className="h-3.5 w-3.5 text-blue-400" /> Export Excel
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="rounded-xl border border-border bg-background p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono uppercase">
            <span>Net Profit</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">+₹{summary.netProfit.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground font-mono">
            Initial: ₹{summary.initialCapital.toLocaleString()}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono uppercase">
            <span>Win Rate</span>
            <Award className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">{summary.winRate}%</div>
          <div className="text-xs text-muted-foreground font-mono">
            {summary.wins} Wins / {summary.losses} Losses
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono uppercase">
            <span>Profit Factor</span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">{summary.profitFactor}</div>
          <div className="text-xs text-muted-foreground font-mono">
            Expectancy: ₹{summary.expectancy}/trade
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono uppercase">
            <span>Max Drawdown</span>
            <Shield className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">{summary.maxDrawdownPct}%</div>
          <div className="text-xs text-muted-foreground font-mono">
            Sharpe Ratio: {summary.sharpeRatio}
          </div>
        </div>

      </div>

      {/* Ratios & Performance Breakdown Table */}
      <div className="grid md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="rounded-xl border border-border bg-background p-3.5 space-y-2">
          <div className="text-muted-foreground uppercase text-[10px]">Sharpe Ratio</div>
          <div className="text-base font-bold text-emerald-400">{summary.sharpeRatio}</div>
          <div className="text-[11px] text-muted-foreground">Risk-adjusted return vs benchmark</div>
        </div>
        <div className="rounded-xl border border-border bg-background p-3.5 space-y-2">
          <div className="text-muted-foreground uppercase text-[10px]">Sortino Ratio</div>
          <div className="text-base font-bold text-emerald-400">{summary.sortinoRatio}</div>
          <div className="text-[11px] text-muted-foreground">Downside risk protection rating</div>
        </div>
        <div className="rounded-xl border border-border bg-background p-3.5 space-y-2">
          <div className="text-muted-foreground uppercase text-[10px]">Calmar Ratio</div>
          <div className="text-base font-bold text-emerald-400">{summary.calmarRatio}</div>
          <div className="text-[11px] text-muted-foreground">Annualized return to drawdown</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex rounded-xl border border-border bg-background p-1 text-xs font-medium w-fit">
        <button
          onClick={() => setActiveTab("summary")}
          className={`rounded-lg px-4 py-1.5 transition ${activeTab === "summary" ? "bg-card text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
        >
          Equity Curve
        </button>
        <button
          onClick={() => setActiveTab("trades")}
          className={`rounded-lg px-4 py-1.5 transition ${activeTab === "trades" ? "bg-card text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
        >
          Trade Log ({trades.length})
        </button>
      </div>

      {/* Equity Curve Visualizer */}
      {activeTab === "summary" && (
        <div className="space-y-4">
          <div className="h-56 w-full rounded-xl border border-border bg-background p-4 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs font-mono text-muted-foreground">
              <span>Cumulative Capital Growth (INR)</span>
              <span className="text-emerald-400">+₹{summary.netProfit.toLocaleString()}</span>
            </div>
            
            {/* Visual Simulated Curve Bars */}
            <div className="flex items-end gap-1.5 h-36 pt-4">
              {equityCurve.map((item, idx) => {
                const minCap = summary.initialCapital * 0.9;
                const maxCap = summary.finalCapital * 1.05;
                const heightPct = Math.max(15, Math.min(100, ((item.capital - minCap) / (maxCap - minCap)) * 100));
                return (
                  <div key={idx} className="flex-1 group relative flex flex-col items-center h-full justify-end">
                    <div
                      className="w-full rounded-t bg-emerald-500/60 hover:bg-emerald-400 transition"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between text-[10px] font-mono text-muted-foreground pt-2 border-t border-border/40">
              <span>Start: ₹{summary.initialCapital.toLocaleString()}</span>
              <span>End: ₹{summary.finalCapital.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Trade Execution Log Table */}
      {activeTab === "trades" && (
        <div className="rounded-xl border border-border bg-background overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-card border-b border-border text-muted-foreground">
                <tr>
                  <th className="p-3">Trade ID</th>
                  <th className="p-3">Date / Time</th>
                  <th className="p-3">Symbol</th>
                  <th className="p-3">Side</th>
                  <th className="p-3">Entry Price</th>
                  <th className="p-3">Exit Price</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Charges</th>
                  <th className="p-3">Net P&L</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {trades.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/20 transition">
                    <td className="p-3 text-foreground font-semibold">{t.id}</td>
                    <td className="p-3 text-muted-foreground">{new Date(t.time).toLocaleString()}</td>
                    <td className="p-3">{t.symbol}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.type === "BUY" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="p-3">₹{t.entryPrice}</td>
                    <td className="p-3">₹{t.exitPrice}</td>
                    <td className="p-3">{t.qty}</td>
                    <td className="p-3 text-muted-foreground">₹{t.charges}</td>
                    <td className={`p-3 font-bold ${t.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {t.pnl >= 0 ? `+₹${t.pnl}` : `-₹${Math.abs(t.pnl)}`}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${t.status === "TARGET HIT" ? "bg-emerald-500/10 text-emerald-300" : "bg-rose-500/10 text-rose-300"}`}>
                        {t.status}
                      </span>
                    </td>
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
