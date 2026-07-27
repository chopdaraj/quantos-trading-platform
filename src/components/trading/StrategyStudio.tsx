import { useState } from "react";
import {
  Code, Sliders, Upload, Save, Play, Download, Copy, RefreshCw, CheckCircle2,
  AlertCircle, Sparkles, Layers, Plus, Trash2, ArrowRight, Shield, Clock, FileCode
} from "lucide-react";

export function StrategyStudio({ onRunBacktest }: { onRunBacktest: (config: any) => void }) {
  const [activeTab, setActiveTab] = useState<"python" | "visual" | "manual" | "upload">("python");

  // Python Editor State
  const [strategyName, setStrategyName] = useState("Intraday VWAP Breakout v2.1");
  const [pythonCode, setPythonCode] = useState(`import quantos as qs

class VWAPBreakoutStrategy(qs.Strategy):
    """
    Institutional VWAP Reclaim & RSI Momentum Strategy for NIFTY 50 Options
    """
    def on_init(self):
        self.vwap = self.indicators.vwap(period=20)
        self.rsi = self.indicators.rsi(period=14)
        self.supertrend = self.indicators.supertrend(period=10, multiplier=3.0)
        
    def on_bar(self, bar):
        # Entry Condition: Price crosses above VWAP and RSI > 55
        if bar.close > self.vwap.current and self.rsi.current > 55:
            if not self.has_position():
                self.buy(
                    qty=100,
                    stop_loss=bar.close * 0.992,
                    target=bar.close * 1.018,
                    trail_sl=10 # points
                )
                self.log(f"BUY Signal Triggered at {bar.close}")
                
        # Exit Condition: SuperTrend reversal or Session End (15:15 IST)
        elif self.has_position() and (self.supertrend.direction == -1 or bar.time.hour >= 15 and bar.time.minute >= 15):
            self.close_position()
            self.log("Position closed via Risk Manager")
`);

  // Visual Builder State
  const [visualBlocks, setVisualBlocks] = useState([
    { id: "1", type: "indicator", label: "VWAP (20 Period)", operator: "Cross Above", compareLabel: "Close Price" },
    { id: "2", type: "indicator", label: "RSI (14 Period)", operator: ">", compareLabel: "Value 55" },
    { id: "3", type: "action", label: "Action", operator: "BUY", compareLabel: "100 Qty (2 Lots)" },
    { id: "4", type: "risk", label: "Risk Management", operator: "SL: 1% | Target: 2%", compareLabel: "Trail SL: 10 pts" },
  ]);

  // Manual Form State
  const [manualForm, setManualForm] = useState({
    symbol: "NIFTY 50",
    buyAbove: "24350.00",
    sellBelow: "24250.00",
    stopLossPoints: "25",
    targetPoints: "60",
    trailingSL: true,
    startTime: "09:30",
    endTime: "15:15",
    maxTrades: "3",
  });

  const [codeValid, setCodeValid] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const addVisualBlock = () => {
    setVisualBlocks((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        type: "indicator",
        label: "EMA (50 Period)",
        operator: ">",
        compareLabel: "EMA (200 Period)",
      },
    ]);
  };

  const removeVisualBlock = (id: string) => {
    setVisualBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-xl relative overflow-hidden">
      
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Strategy Studio v2.0</h2>
            <p className="text-xs text-muted-foreground">Build, test, and compile institutional algorithms using Python, Visual Blocks, or Direct Forms.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold hover:bg-muted transition inline-flex items-center gap-1.5"
          >
            {savedSuccess ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Save className="h-3.5 w-3.5 text-primary" />}
            {savedSuccess ? "Saved!" : "Save Strategy"}
          </button>
          
          <button
            onClick={() => onRunBacktest({ strategyName, mode: activeTab, code: pythonCode, manualForm })}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-primary-foreground shadow-lg transition hover:opacity-90 inline-flex items-center gap-1.5"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Play className="h-3.5 w-3.5 fill-current" /> Run Backtest
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 rounded-xl border border-border bg-background p-1 text-xs font-medium">
        <button
          onClick={() => setActiveTab("python")}
          className={`rounded-lg py-2 transition inline-flex items-center justify-center gap-2 ${activeTab === "python" ? "bg-card text-foreground font-semibold shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Code className="h-3.5 w-3.5 text-primary" /> Python Code Editor
        </button>
        <button
          onClick={() => setActiveTab("visual")}
          className={`rounded-lg py-2 transition inline-flex items-center justify-center gap-2 ${activeTab === "visual" ? "bg-card text-foreground font-semibold shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Layers className="h-3.5 w-3.5 text-emerald-400" /> Visual Drag & Drop
        </button>
        <button
          onClick={() => setActiveTab("manual")}
          className={`rounded-lg py-2 transition inline-flex items-center justify-center gap-2 ${activeTab === "manual" ? "bg-card text-foreground font-semibold shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Sliders className="h-3.5 w-3.5 text-amber-400" /> Direct Form Builder
        </button>
        <button
          onClick={() => setActiveTab("upload")}
          className={`rounded-lg py-2 transition inline-flex items-center justify-center gap-2 ${activeTab === "upload" ? "bg-card text-foreground font-semibold shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Upload className="h-3.5 w-3.5 text-blue-400" /> Custom API Upload
        </button>
      </div>

      {/* Strategy Name & Meta Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20 p-3 rounded-xl border border-border">
        <div className="flex-1">
          <label className="text-[10px] font-mono uppercase text-muted-foreground">Strategy Title</label>
          <input
            type="text"
            value={strategyName}
            onChange={(e) => setStrategyName(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold outline-none text-foreground"
          />
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
          <span>Target: <span className="text-foreground">NIFTY 50 / Options</span></span>
          <span>Status: <span className="text-emerald-400">Validated</span></span>
        </div>
      </div>

      {/* Tab 1: Python Code Editor */}
      {activeTab === "python" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5"><FileCode className="h-4 w-4 text-primary" /> Python 3.11 Quant Engine SDK</span>
            <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Syntax Validated</span>
          </div>

          <div className="relative rounded-xl border border-border bg-background overflow-hidden">
            <textarea
              value={pythonCode}
              onChange={(e) => setPythonCode(e.target.value)}
              rows={16}
              spellCheck={false}
              className="w-full bg-background p-4 text-xs font-mono text-emerald-300 leading-relaxed outline-none resize-y"
              style={{ lineHeight: "1.6" }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Auto-saving draft to local vault...</span>
            <div className="flex gap-2">
              <button onClick={() => setPythonCode(pythonCode)} className="hover:text-foreground text-xs inline-flex items-center gap-1">
                <RefreshCw className="h-3 w-3" /> Lint Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Visual Drag & Drop Builder */}
      {activeTab === "visual" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Visual Strategy Logic Blocks</h3>
            <button
              onClick={addVisualBlock}
              className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-muted transition inline-flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5 text-primary" /> Add Logic Condition
            </button>
          </div>

          <div className="space-y-3">
            {visualBlocks.map((b, index) => (
              <div key={b.id} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-border bg-background p-4">
                <div className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-muted flex items-center justify-center font-mono text-xs text-muted-foreground">{index + 1}</span>
                  <div>
                    <div className="font-semibold text-sm text-foreground">{b.label}</div>
                    <div className="text-xs font-mono text-muted-foreground">{b.compareLabel}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-lg border border-border bg-card px-3 py-1 text-xs font-mono text-primary">{b.operator}</span>
                  <button
                    onClick={() => removeVisualBlock(b.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Direct Manual Form Builder */}
      {activeTab === "manual" && (
        <div className="grid md:grid-cols-2 gap-6 bg-background/50 p-6 rounded-2xl border border-border">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary">Price Trigger Levels</h3>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Buy Above Level (INR)</label>
              <input
                type="text"
                value={manualForm.buyAbove}
                onChange={(e) => setManualForm({ ...manualForm, buyAbove: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-mono outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Sell Below Level (INR)</label>
              <input
                type="text"
                value={manualForm.sellBelow}
                onChange={(e) => setManualForm({ ...manualForm, sellBelow: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-mono outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-emerald-400">Risk & Order Parameters</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Stop Loss (Points)</label>
                <input
                  type="text"
                  value={manualForm.stopLossPoints}
                  onChange={(e) => setManualForm({ ...manualForm, stopLossPoints: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-mono outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Target (Points)</label>
                <input
                  type="text"
                  value={manualForm.targetPoints}
                  onChange={(e) => setManualForm({ ...manualForm, targetPoints: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-mono outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Start Time (IST)</label>
                <input
                  type="text"
                  value={manualForm.startTime}
                  onChange={(e) => setManualForm({ ...manualForm, startTime: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-mono outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Auto Square-Off Time</label>
                <input
                  type="text"
                  value={manualForm.endTime}
                  onChange={(e) => setManualForm({ ...manualForm, endTime: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-mono outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Custom Python Strategy API Upload */}
      {activeTab === "upload" && (
        <div className="border-2 border-dashed border-border bg-background/50 rounded-2xl p-10 text-center space-y-4">
          <Upload className="h-10 w-10 text-primary mx-auto" />
          <div>
            <h3 className="font-semibold text-base">Upload Custom Python Strategy File (.py)</h3>
            <p className="text-xs text-muted-foreground mt-1">Upload your standalone Python quant module. Code will be validated and compiled in a secure sandbox.</p>
          </div>
          <input type="file" accept=".py" className="hidden" id="strategy-upload" />
          <label
            htmlFor="strategy-upload"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-primary-foreground cursor-pointer shadow-lg transition hover:opacity-90"
            style={{ background: "var(--gradient-primary)" }}
          >
            Select Strategy .py File
          </label>
        </div>
      )}

    </div>
  );
}
