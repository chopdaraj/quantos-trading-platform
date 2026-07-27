import { createFileRoute } from "@tanstack/react-router";
import heroImage from "@/assets/hero-quant.jpg";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { submitWaitlist } from "@/lib/waitlist.functions";
import {
  Activity, Brain, Shield, Zap, LineChart, GitBranch, Cpu, Database,
  TrendingUp, Bot, Users, Lock, Smartphone, Bell, Cloud, Scale,
  Sparkles, Target, Layers, PlayCircle, CheckCircle2, ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QuantOS — AI Algo Trading Operating System" },
      { name: "description", content: "Idea → Strategy → Backtest → Paper → Live. A complete AI-powered quant trading OS with institutional-grade rigor, resilience, and SEBI compliance." },
      { property: "og:title", content: "QuantOS — AI Algo Trading Operating System" },
      { property: "og:description", content: "The complete Quant Trading OS. From idea to live capital deployment, monitored by AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const lifecycle = [
  "Research", "Strategy", "Backtest", "Optimize", "Paper Trade",
  "Live Trade", "Risk Guard", "AI Analysis", "Improve",
];

const modules = [
  { icon: Brain, title: "Strategy Development", desc: "Python SDK, No-Code Builder, AI Strategy Generator, Git-based version control & multi-timeframe engine." },
  { icon: Database, title: "Market Data Engine", desc: "Tick data, 10+ years history, Options chain, Greeks, OI, Level 2, VWAP, FII/DII, news & sentiment feeds." },
  { icon: LineChart, title: "Backtesting Engine", desc: "Tick-by-tick, event-driven, walk-forward, Monte Carlo, stress tests — with realistic fees, slippage & latency." },
  { icon: Shield, title: "Integrity Layer", desc: "Look-ahead detector, survivorship correction, point-in-time data, cross-vendor tick reconciliation." },
  { icon: PlayCircle, title: "Paper Trading", desc: "Live market data, realistic order matching, virtual portfolio, replay mode & real-time P&L dashboards." },
  { icon: Zap, title: "Live Trading", desc: "Zerodha, Dhan, IBKR, Binance & 10+ brokers. One-click deploy, auto-reconnect, kill switch, emergency exit." },
  { icon: Target, title: "Execution Algos", desc: "TWAP, VWAP, Implementation Shortfall, Iceberg, smart order slicing, bracket, GTT & cover orders." },
  { icon: Scale, title: "Risk Management", desc: "Daily/weekly/monthly loss caps, portfolio heat, VaR, correlation, sector exposure & circuit breaker protection." },
  { icon: Layers, title: "Portfolio Manager", desc: "Multi-strategy, multi-account, capital allocation, rebalancing, correlation matrix & strategy ranking." },
  { icon: Bot, title: "AI Trading Assistant", desc: "Ask 'Why did I lose today?' Get answers. Detect regimes, explain trades, generate reports on demand." },
  { icon: Sparkles, title: "AI Governance", desc: "SHAP-based explainability, drift detection, human-in-the-loop approval gates — no black-box changes." },
  { icon: Cpu, title: "Optimization Engine", desc: "Grid, Random, Bayesian, Genetic & Walk-Forward optimization with parameter sensitivity analysis." },
  { icon: Activity, title: "Analytics Dashboard", desc: "Sharpe, Sortino, Calmar, alpha, beta, expectancy — equity curves, heatmaps & rolling performance." },
  { icon: GitBranch, title: "Trade Journal", desc: "Auto-logged trades with screenshots, AI commentary, mistake detection & behavioral pattern alerts." },
  { icon: TrendingUp, title: "Market Replay", desc: "Replay any trading day tick-by-tick. Pause, step through, practice manual trading on historical sessions." },
  { icon: Bell, title: "Alerts Everywhere", desc: "Telegram, WhatsApp, Discord, Slack, email, mobile push & voice alerts — never miss a signal." },
  { icon: Cloud, title: "Cloud Infrastructure", desc: "FastAPI + Next.js, TimescaleDB, ClickHouse, Kafka, Kubernetes. Hot failover & idempotent orders." },
  { icon: Lock, title: "Security & Compliance", desc: "2FA, RBAC, encrypted keys, audit logs. SEBI algo framework, OTR monitoring, STP reconciliation, tax module." },
];

const behavioral = [
  "Overtrading Detector — alerts when you override the bot too often",
  "Revenge Trading Pattern Detection",
  "Pre-Market Checklist Enforcement before any live deployment",
  "Emotion tracking on every manual intervention",
];

const workflow = [
  { step: "01", title: "Describe your idea", desc: "In plain English. 'Buy Bank Nifty on VWAP reclaim with 1% stop.'" },
  { step: "02", title: "AI writes the code", desc: "Production-ready Python strategy generated in seconds." },
  { step: "03", title: "Auto-backtest 10 years", desc: "On tick data with realistic fees, slippage and latency." },
  { step: "04", title: "Overfitting check", desc: "AI runs walk-forward + Monte Carlo. Flags instability." },
  { step: "05", title: "Paper trade live", desc: "Real-time market data. Real order book. Zero capital." },
  { step: "06", title: "Deploy to live", desc: "One click. AI monitors regime, drawdown & degradation 24/7." },
];

function Index() {
  return (
    <div className="min-h-screen text-foreground">
      <Nav />
      <Hero />
      <Lifecycle />
      <Modules />
      <QuantLab />
      <Behavioral />
      <Compliance />
      <Stack />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg" style={{ background: "var(--gradient-primary)" }} />
          <span className="font-semibold tracking-tight text-lg">QuantOS</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#modules" className="hover:text-foreground transition">Platform</a>
          <a href="#quant-lab" className="hover:text-foreground transition">AI Quant Lab</a>
          <a href="#compliance" className="hover:text-foreground transition">Compliance</a>
          <a href="#stack" className="hover:text-foreground transition">Stack</a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition"
          >
            Sign In
          </a>
          <a
            href="#cta"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            style={{ background: "var(--gradient-primary)" }}
          >
            Request Access <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-mono text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            v2.0 — Institutional-grade quant OS
          </div>
          <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
            The complete <span className="gradient-text">AI Algo</span> trading operating system.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            From raw idea to fully-managed, AI-monitored live capital deployment — with the rigor of an institutional desk and the accessibility of modern SaaS.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#cta"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground glow-border transition hover:scale-[1.02]"
              style={{ background: "var(--gradient-primary)" }}
            >
              Start Building Strategies <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#quant-lab"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-6 py-3 text-sm font-semibold hover:bg-card transition"
            >
              <PlayCircle className="h-4 w-4" /> See the AI Quant Lab
            </a>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
            {[
              { k: "10+ yrs", v: "tick data" },
              { k: "12+", v: "brokers" },
              { k: "24/7", v: "AI monitor" },
            ].map((s) => (
              <div key={s.k}>
                <div className="text-2xl font-bold font-mono">{s.k}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl opacity-40 blur-3xl" style={{ background: "var(--gradient-primary)" }} />
          <img
            src={heroImage}
            alt="AI quant trading dashboard"
            width={1600}
            height={1000}
            className="relative rounded-2xl border border-border shadow-2xl"
            style={{ boxShadow: "var(--shadow-elegant)" }}
          />
        </div>
      </div>
    </section>
  );
}

function Lifecycle() {
  return (
    <section className="border-y border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6 font-mono">
          The full quant lifecycle — in one platform
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 text-sm">
          {lifecycle.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className="rounded-full border border-border bg-background px-4 py-1.5 font-mono">{step}</span>
              {i < lifecycle.length - 1 && <ArrowRight className="h-3 w-3 text-primary" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Modules() {
  return (
    <section id="modules" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <p className="text-primary font-mono text-sm mb-3">01 — PLATFORM</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Every module a serious quant desk needs. <span className="gradient-text">Built in.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Eighteen production-grade subsystems — from tick data to tax reports — engineered to work as one operating system.
          </p>
        </div>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group relative rounded-2xl border border-border p-6 transition hover:border-primary/50"
              style={{ background: "var(--gradient-card)" }}
            >
              <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-4 border border-primary/30 bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg tracking-tight">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuantLab() {
  return (
    <section id="quant-lab" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at center, oklch(0.30 0.10 200 / 40%), transparent 70%)" }} />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-primary font-mono text-sm mb-3">02 — FLAGSHIP</p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            The <span className="gradient-text">AI Quant Lab</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Describe an idea. Ship a monitored live strategy. Nine steps, zero glue code.
          </p>
        </div>
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflow.map((w) => (
            <div
              key={w.step}
              className="rounded-2xl border border-border p-8 relative"
              style={{ background: "var(--gradient-card)" }}
            >
              <div className="font-mono text-5xl font-bold gradient-text">{w.step}</div>
              <h3 className="mt-4 text-xl font-semibold">{w.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Behavioral() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-primary font-mono text-sm mb-3">03 — PSYCHOLOGY</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Most traders don't blow up on <span className="gradient-text">strategy</span>. They blow up on <span className="gradient-text">behavior</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            A behavioral layer that watches the human, not just the market — so discipline scales with capital.
          </p>
        </div>
        <ul className="space-y-4">
          {behavioral.map((b) => (
            <li key={b} className="flex items-start gap-3 rounded-xl border border-border p-5" style={{ background: "var(--gradient-card)" }}>
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Compliance() {
  const items = [
    "SEBI Algo Trading Framework — unique strategy ID registration",
    "Broker-Level Empanelment for algo strategies",
    "Order-to-Trade Ratio (OTR) Monitoring",
    "STP / Contract Note Reconciliation",
    "STCG/LTCG capital gains, F&O turnover module",
    "Form 26AS matching + auto-generated P&L for CA filing",
  ];
  return (
    <section id="compliance" className="py-24 border-y border-border bg-card/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <p className="text-primary font-mono text-sm mb-3">04 — INDIA-READY</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Compliance is a <span className="gradient-text">feature</span>, not an afterthought.
          </h2>
          <p className="mt-4 text-muted-foreground">
            What separates a legally deployable platform from a toy. Built for SEBI-regulated markets from day one.
          </p>
        </div>
        <div className="mt-12 grid md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-xl border border-border bg-background/50 p-5">
              <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stack() {
  const groups = [
    { title: "Backend", items: ["FastAPI", "Python", "WebSockets", "Celery", "Redis"] },
    { title: "Frontend", items: ["Next.js", "React", "TypeScript", "TradingView Charts"] },
    { title: "Data", items: ["PostgreSQL", "TimescaleDB", "ClickHouse", "Redis"] },
    { title: "Infra", items: ["Docker", "Kubernetes", "NGINX", "Kafka", "Prometheus", "Grafana"] },
  ];
  return (
    <section id="stack" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <p className="text-primary font-mono text-sm mb-3">05 — INFRASTRUCTURE</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Engineered for <span className="gradient-text">uptime</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Hot failover, dual data feeds, idempotent order placement. A trading system that goes down mid-position is worse than one that never launched.
          </p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {groups.map((g) => (
            <div key={g.title} className="rounded-2xl border border-border p-6" style={{ background: "var(--gradient-card)" }}>
              <h3 className="font-mono text-xs uppercase tracking-widest text-primary">{g.title}</h3>
              <ul className="mt-4 space-y-2">
                {g.items.map((it) => (
                  <li key={it} className="text-sm font-mono text-muted-foreground">{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const join = useServerFn(submitWaitlist);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await join({ data: { email } });
      setStatus("ok");
      setMsg("You're on the list. We'll be in touch soon.");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMsg(err?.message ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <section id="cta" className="py-32">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
          Ship your first <span className="gradient-text">AI-monitored strategy</span> this week.
        </h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Join the waitlist. Early cohorts get lifetime discounts, direct roadmap input, and hands-on onboarding from our quant team.
        </p>
        <form className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={onSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@fund.com"
            className="flex-1 rounded-full border border-border bg-card px-5 py-3 text-sm outline-none focus:border-primary transition"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground glow-border transition hover:scale-[1.02]"
            style={{ background: "var(--gradient-primary)" }}
          >
            {status === "loading" ? "Joining…" : "Request Access"}
          </button>
        </form>
        {status !== "idle" && status !== "loading" && (
          <p className={`mt-4 text-sm ${status === "ok" ? "text-emerald-400" : "text-red-400"}`}>{msg}</p>
        )}
        <p className="mt-4 text-xs text-muted-foreground font-mono">
          <Users className="inline h-3 w-3 mr-1" /> 400+ quants on the waitlist
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded" style={{ background: "var(--gradient-primary)" }} />
          <span>QuantOS · Blueprint v2.0</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <Smartphone className="h-3 w-3" /> Mobile · Web · API
        </div>
        <p>© 2026 QuantOS. Trading involves risk.</p>
      </div>
    </footer>
  );
}
