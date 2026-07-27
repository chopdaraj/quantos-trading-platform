import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { runBacktestServerFn } from "@/lib/trading.functions";
import { useServerFn } from "@tanstack/react-start";

// Core Trading Modules
import { StrategyStudio } from "@/components/trading/StrategyStudio";
import { BacktestReport } from "@/components/trading/BacktestReport";
import { TradingViewChart } from "@/components/trading/TradingViewChart";
import { OptionChainView } from "@/components/trading/OptionChainView";
import { LiveTradingPanel } from "@/components/trading/LiveTradingPanel";
import { MarketScanner } from "@/components/trading/MarketScanner";
import { AnalyticsHub } from "@/components/trading/AnalyticsHub";
import { RiskAndJournal } from "@/components/trading/RiskAndJournal";

import {
  Brain, Shield, Play, Pause, TrendingUp, Activity, Cpu, Layers, LogOut,
  Sparkles, Code, RefreshCw, BarChart2, User, Search, Zap, LineChart, PieChart
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "QuantOS — AI Trading Dashboard" },
      { name: "description", content: "Institutional AI trading workspace, backtesting, and strategy studio." },
    ],
  }),
  component: DashboardPage,
});

type Strategy = {
  id: string;
  name: string;
  asset: string;
  pnl: string;
  winRate: string;
  status: "running" | "paused";
  trades: number;
};

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeMainTab, setActiveMainTab] = useState<"overview" | "analytics" | "studio" | "chart" | "backtest" | "options" | "terminal" | "scanner" | "risk">("analytics");

  // Strategy & Backtest state
  const [backtestSummary, setBacktestSummary] = useState<any>(null);
  const [backtestTrades, setBacktestTrades] = useState<any[]>([]);
  const [backtestEquity, setBacktestEquity] = useState<any[]>([]);

  const runBacktestFn = useServerFn(runBacktestServerFn);

  // Active Strategies list
  const [strategies, setStrategies] = useState<Strategy[]>([
    { id: "1", name: "VWAP Reclaim Nifty", asset: "NIFTY 50", pnl: "+₹4,820.00", winRate: "74.5%", status: "running", trades: 142 },
    { id: "2", name: "BankNifty Options Scalper", asset: "BANK NIFTY", pnl: "+₹6,150.50", winRate: "68.2%", status: "running", trades: 218 },
    { id: "3", name: "BTC Volatility Breakout", asset: "BTC/USD", pnl: "+₹3,850.00", winRate: "70.1%", status: "paused", trades: 95 },
  ]);

  useEffect(() => {
    const localEmail = typeof window !== "undefined" ? localStorage.getItem("quantos_user_email") : null;

    supabase.auth.getSession().then(({ data }) => {
      const activeUser = data.session?.user || (localEmail ? { email: localEmail } : null);
      if (!activeUser) {
        navigate({ to: "/login" });
      } else {
        setUser(activeUser);
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const activeUser = session?.user || (localEmail ? { email: localEmail } : null);
      if (!activeUser) {
        navigate({ to: "/login" });
      } else {
        setUser(activeUser);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("quantos_user_email");
    }
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  const handleRunBacktest = async (config: any) => {
    try {
      const res = await runBacktestFn({
        data: {
          symbol: "NIFTY 50",
          timeframe: "5m",
          startDate: "2026-01-01",
          endDate: "2026-07-26",
          initialCapital: 500000,
          strategyType: "python",
          slippagePct: 0.05,
          brokeragePerOrder: 20,
        },
      });

      if (res.ok) {
        setBacktestSummary(res.summary);
        setBacktestTrades(res.trades);
        setBacktestEquity(res.equityCurve);
        setActiveMainTab("backtest");
      }
    } catch {
      // ignore
    }
  };

  const toggleStrategyStatus = (id: string) => {
    setStrategies((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === "running" ? "paused" : "running" } : s
      )
    );
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading trading workspace…</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold tracking-tight text-lg">QuantOS</span>
            </a>
            
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Broker Connected (Zerodha & Dhan)
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs">
              <User className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-muted-foreground">{user?.email}</span>
            </div>
            
            <button
              onClick={handleSignOut}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition inline-flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Live Market Ticker */}
      <div className="border-b border-border bg-card/40 py-2.5 px-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 text-xs font-mono min-w-[600px]">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">NIFTY 50</span>
            <span className="text-foreground font-bold">24,320.50</span>
            <span className="text-emerald-400">+0.85%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">BANK NIFTY</span>
            <span className="text-foreground font-bold">52,110.10</span>
            <span className="text-emerald-400">+1.12%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">BTC/USD</span>
            <span className="text-foreground font-bold">$96,450.00</span>
            <span className="text-emerald-400">+2.40%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">ETH/USD</span>
            <span className="text-foreground font-bold">$3,520.10</span>
            <span className="text-emerald-400">+1.80%</span>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="border-b border-border bg-card/20 px-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-mono font-medium py-2 min-w-[800px]">
          <button
            onClick={() => setActiveMainTab("overview")}
            className={`rounded-xl px-3.5 py-2 transition inline-flex items-center gap-2 ${activeMainTab === "overview" ? "bg-card border border-border text-foreground font-bold shadow" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Activity className="h-3.5 w-3.5 text-primary" /> Workspace Overview
          </button>
          <button
            onClick={() => setActiveMainTab("analytics")}
            className={`rounded-xl px-3.5 py-2 transition inline-flex items-center gap-2 ${activeMainTab === "analytics" ? "bg-card border border-border text-foreground font-bold shadow" : "text-muted-foreground hover:text-foreground"}`}
          >
            <PieChart className="h-3.5 w-3.5 text-emerald-400" /> AlgoTrade Analytics
          </button>
          <button
            onClick={() => setActiveMainTab("studio")}
            className={`rounded-xl px-3.5 py-2 transition inline-flex items-center gap-2 ${activeMainTab === "studio" ? "bg-card border border-border text-foreground font-bold shadow" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Code className="h-3.5 w-3.5 text-emerald-400" /> Strategy Studio
          </button>
          <button
            onClick={() => setActiveMainTab("chart")}
            className={`rounded-xl px-3.5 py-2 transition inline-flex items-center gap-2 ${activeMainTab === "chart" ? "bg-card border border-border text-foreground font-bold shadow" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LineChart className="h-3.5 w-3.5 text-blue-400" /> TradingView & MT5 Chart
          </button>
          <button
            onClick={() => setActiveMainTab("backtest")}
            className={`rounded-xl px-3.5 py-2 transition inline-flex items-center gap-2 ${activeMainTab === "backtest" ? "bg-card border border-border text-foreground font-bold shadow" : "text-muted-foreground hover:text-foreground"}`}
          >
            <BarChart2 className="h-3.5 w-3.5 text-amber-400" /> Backtest Reports
          </button>
          <button
            onClick={() => setActiveMainTab("options")}
            className={`rounded-xl px-3.5 py-2 transition inline-flex items-center gap-2 ${activeMainTab === "options" ? "bg-card border border-border text-foreground font-bold shadow" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Layers className="h-3.5 w-3.5 text-purple-400" /> Option Chain & Greeks
          </button>
          <button
            onClick={() => setActiveMainTab("terminal")}
            className={`rounded-xl px-3.5 py-2 transition inline-flex items-center gap-2 ${activeMainTab === "terminal" ? "bg-card border border-border text-foreground font-bold shadow" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Zap className="h-3.5 w-3.5 text-emerald-400" /> Live & Paper Trading
          </button>
          <button
            onClick={() => setActiveMainTab("scanner")}
            className={`rounded-xl px-3.5 py-2 transition inline-flex items-center gap-2 ${activeMainTab === "scanner" ? "bg-card border border-border text-foreground font-bold shadow" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Search className="h-3.5 w-3.5 text-primary" /> Technical Scanner
          </button>
          <button
            onClick={() => setActiveMainTab("risk")}
            className={`rounded-xl px-3.5 py-2 transition inline-flex items-center gap-2 ${activeMainTab === "risk" ? "bg-card border border-border text-foreground font-bold shadow" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Shield className="h-3.5 w-3.5 text-rose-400" /> Risk Guard & Journal
          </button>
        </div>
      </div>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        
        {/* Main Tab 1: Overview */}
        {activeMainTab === "overview" && (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">AI Quant Workspace</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Monitor live automated strategies, build new algorithms with natural language, and manage portfolio risk.
                </p>
              </div>
            </div>

            {/* Portfolio Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-mono uppercase">
                  <span>Total Strategy P&L</span>
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-400">+₹14,820.50</div>
                <div className="text-xs text-emerald-400 font-mono">+12.4% total ROI</div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-mono uppercase">
                  <span>Active Algorithms</span>
                  <Cpu className="h-4 w-4 text-primary" />
                </div>
                <div className="text-2xl font-bold font-mono text-foreground">2 Running / 1 Paused</div>
                <div className="text-xs text-muted-foreground font-mono">3 total strategies</div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-mono uppercase">
                  <span>Overall Win Rate</span>
                  <Activity className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-foreground">71.8%</div>
                <div className="text-xs text-muted-foreground font-mono">455 execution logs</div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-mono uppercase">
                  <span>Risk & Loss Guard</span>
                  <Shield className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-400">Protected</div>
                <div className="text-xs text-muted-foreground font-mono">Daily Loss Cap: ₹10,000</div>
              </div>
            </div>

            {/* Quick Strategy Studio Embedded Section */}
            <StrategyStudio onRunBacktest={handleRunBacktest} />

            {/* Deployed Algos Table */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xl">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" /> Deployed Trading Algorithms
                </h3>
                <span className="text-xs font-mono text-muted-foreground">{strategies.length} Active Algos</span>
              </div>

              <div className="divide-y divide-border">
                {strategies.map((s) => (
                  <div key={s.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/20 transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm">{s.name}</span>
                        <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-mono text-muted-foreground">{s.asset}</span>
                        {s.status === "running" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Running
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                            Paused
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono flex items-center gap-4">
                        <span>Trades: {s.trades}</span>
                        <span>Win Rate: {s.winRate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-mono text-sm font-bold text-emerald-400">{s.pnl}</div>
                        <div className="text-xs text-muted-foreground">Cumulative P&L</div>
                      </div>
                      
                      <button
                        onClick={() => toggleStrategyStatus(s.id)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition inline-flex items-center gap-1.5 ${s.status === "running" ? "border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20" : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"}`}
                      >
                        {s.status === "running" ? <><Pause className="h-3.5 w-3.5" /> Pause</> : <><Play className="h-3.5 w-3.5" /> Resume</>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Tab: AlgoTrade Analytics */}
        {activeMainTab === "analytics" && <AnalyticsHub />}
        {activeMainTab === "studio" && <StrategyStudio onRunBacktest={handleRunBacktest} />}

        {/* Tab 3: TradingView Chart */}
        {activeMainTab === "chart" && <TradingViewChart symbol="NIFTY 50" />}

        {/* Tab 4: Backtest Reports */}
        {activeMainTab === "backtest" && (
          backtestSummary ? (
            <BacktestReport summary={backtestSummary} trades={backtestTrades} equityCurve={backtestEquity} />
          ) : (
            <div className="rounded-2xl border border-border bg-card p-10 text-center space-y-4">
              <BarChart2 className="h-10 w-10 text-primary mx-auto" />
              <h3 className="font-semibold text-lg">No Backtest Run Yet</h3>
              <p className="text-xs text-muted-foreground">Go to the Strategy Studio tab and click "Run Backtest" to generate an institutional report.</p>
              <button
                onClick={() => handleRunBacktest({})}
                className="rounded-xl px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-lg transition hover:opacity-90 inline-flex items-center gap-1.5"
                style={{ background: "var(--gradient-primary)" }}
              >
                Run Sample Backtest
              </button>
            </div>
          )
        )}

        {/* Tab 5: Option Chain */}
        {activeMainTab === "options" && <OptionChainView />}

        {/* Tab 6: Live & Paper Terminal */}
        {activeMainTab === "terminal" && <LiveTradingPanel />}

        {/* Tab 7: Market Scanner */}
        {activeMainTab === "scanner" && <MarketScanner />}

        {/* Tab 8: Risk Guard & Journal */}
        {activeMainTab === "risk" && <RiskAndJournal />}

      </main>
    </div>
  );
}
