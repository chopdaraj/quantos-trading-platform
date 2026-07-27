import { useEffect, useRef, useState } from "react";
import {
  TrendingUp, Activity, Layers, Crosshair, ArrowUp, ArrowDown, Shield,
  CheckCircle2, XCircle, Info, Search, Maximize2, Minimize2, Save, Undo, Redo,
  Sliders, Grid, BarChart2, Eye, EyeOff, Plus, Trash2, Edit3, MoveRight,
  TrendingDown, Check, LayoutGrid, Sparkles
} from "lucide-react";
import { RealMarketDataEngine } from "@/lib/market-data/RealMarketDataEngine";
import { WebSocketManager } from "@/lib/market-data/WebSocketManager";

type Timeframe = "1s" | "5s" | "15s" | "1m" | "3m" | "5m" | "15m" | "30m" | "1h" | "4h" | "1D" | "1W" | "1M";
type ChartType = "candles" | "line" | "area" | "heikin_ashi" | "renko" | "hollow" | "baseline";
type DrawingTool = "cursor" | "crosshair" | "trendline" | "ray" | "horizontal" | "vertical" | "rectangle" | "circle" | "fib" | "long" | "short" | "measure" | "text" | "eraser";

type TradeMarker = {
  id: string;
  type: "BUY" | "SELL" | "SL" | "TARGET";
  time: string;
  price: number;
  qty: number;
  pnl?: number;
  strategyName: string;
  broker: string;
};

export function TradingViewChart({ symbol = "NIFTY 50" }: { symbol?: string }) {
  const [currentSymbol, setCurrentSymbol] = useState(symbol);
  const [timeframe, setTimeframe] = useState<Timeframe>("5m");
  const [chartType, setChartType] = useState<ChartType>("candles");
  const [gridMode, setGridMode] = useState<1 | 2 | 4>(1);
  const [activeDrawingTool, setActiveDrawingTool] = useState<DrawingTool>("crosshair");

  // Modals & Panels
  const [symbolSearchOpen, setSymbolSearchOpen] = useState(false);
  const [indicatorModalOpen, setIndicatorModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<TradeMarker | null>(null);

  // Indicators State
  const [activeIndicators, setActiveIndicators] = useState({
    vwap: true,
    rsi: true,
    supertrend: true,
    ema20: true,
    ema50: false,
    ema200: false,
    macd: false,
    bollinger: false,
    cpr: true,
    volume: true,
  });

  // Real Market Data Ticker State
  const [marketTick, setMarketTick] = useState<any>({
    ltp: 24328.50,
    open: 24280.00,
    high: 24385.20,
    low: 24265.10,
    change: 208.50,
    changePct: 0.86,
  });

  // Drawing Objects List
  const [drawings, setDrawings] = useState<any[]>([
    { id: "d1", type: "trendline", label: "Bullish Trendline Support" },
    { id: "d2", type: "fib", label: "0.618 Fib Retracement Level (24,310)" },
  ]);

  // Order Lines Overlay State
  const orderOverlay = {
    entryPrice: 24310.50,
    stopLossPrice: 24270.00,
    targetPrice: 24390.00,
    currentPrice: marketTick.ltp,
    qty: 50,
    pnl: Number(((marketTick.ltp - 24310.50) * 50).toFixed(2)),
  };

  // Symbols list for search modal
  const symbolsList = [
    { symbol: "NIFTY 50", name: "NSE Nifty 50 Index", price: "24,328.50", change: "+0.86%" },
    { symbol: "BANK NIFTY", name: "NSE Bank Nifty Index", price: "52,140.10", change: "+1.13%" },
    { symbol: "FINNIFTY", name: "NSE Financial Services", price: "23,150.25", change: "+0.81%" },
    { symbol: "MIDCPNIFTY", name: "NSE Nifty Midcap 100", price: "13,080.40", change: "+0.97%" },
    { symbol: "SENSEX", name: "BSE Sensex Index", price: "79,850.20", change: "+0.75%" },
    { symbol: "INDIA VIX", name: "India Volatility Index", price: "14.85", change: "-2.30%" },
    { symbol: "RELIANCE", name: "Reliance Industries Ltd", price: "3,120.50", change: "+1.85%" },
    { symbol: "TATASTEEL", name: "Tata Steel Ltd", price: "168.40", change: "+3.40%" },
    { symbol: "INFY", name: "Infosys Ltd", price: "1,780.00", change: "-0.50%" },
    { symbol: "HDFCBANK", name: "HDFC Bank Ltd", price: "1,640.20", change: "+1.20%" },
  ];

  // Simulated MT5 Executed Trades
  const tradeMarkers: TradeMarker[] = [
    { id: "M1", type: "BUY", time: "09:35 AM", price: 24310.50, qty: 50, strategyName: "VWAP Reclaim Nifty", broker: "Zerodha Kite" },
    { id: "M2", type: "TARGET", time: "10:15 AM", price: 24385.00, qty: 50, pnl: 3725.00, strategyName: "VWAP Reclaim Nifty", broker: "Zerodha Kite" },
    { id: "M3", type: "SELL", time: "11:20 AM", price: 24360.00, qty: 50, strategyName: "SuperTrend Scalper", broker: "Dhan API" },
    { id: "M4", type: "SL", time: "11:45 AM", price: 24390.00, qty: 50, pnl: -1500.00, strategyName: "SuperTrend Scalper", broker: "Dhan API" },
  ];

  // Subscribe to live WebSocket updates
  useEffect(() => {
    const engine = RealMarketDataEngine.getInstance();
    engine.getMarketOverview().then((overview) => {
      if (overview[currentSymbol]) {
        setMarketTick(overview[currentSymbol]);
      }
    });

    const ws = WebSocketManager.getInstance();
    const unsubscribe = ws.subscribe("ticks", (ticks: any) => {
      if (ticks[currentSymbol]) {
        setMarketTick((prev: any) => ({ ...prev, ltp: ticks[currentSymbol] }));
      }
    });

    return () => unsubscribe();
  }, [currentSymbol]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`rounded-2xl border border-border bg-card shadow-2xl relative overflow-hidden flex flex-col transition-all ${isFullscreen ? "fixed inset-0 z-50 rounded-none border-none" : "h-[700px] w-full"}`}>
      
      {/* 1. TradingView Top Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-[#151c23] p-3 text-xs font-mono text-foreground">
        
        {/* Left Section: Symbol Search & Timeframes */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Symbol Search Button */}
          <button
            onClick={() => setSymbolSearchOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 font-bold hover:bg-muted transition text-primary"
          >
            <Search className="h-3.5 w-3.5" />
            <span>{currentSymbol}</span>
            <span className="text-[10px] text-muted-foreground bg-background px-1.5 py-0.5 rounded">NSE</span>
          </button>

          {/* Real Live Price Ticker */}
          <div className="flex items-center gap-2 bg-background/60 border border-border px-3 py-1.5 rounded-xl font-bold">
            <span className="text-white">₹{marketTick.ltp.toFixed(2)}</span>
            <span className={marketTick.change >= 0 ? "text-emerald-400" : "text-rose-400"}>
              {marketTick.change >= 0 ? `+${marketTick.changePct}%` : `${marketTick.changePct}%`}
            </span>
          </div>

          {/* Timeframe Selector Bar */}
          <div className="flex rounded-xl border border-border bg-card p-1 text-[11px]">
            {(["1s", "5s", "15s", "1m", "5m", "15m", "1h", "4h", "1D"] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`rounded-lg px-2.5 py-1 transition ${timeframe === tf ? "bg-primary text-primary-foreground font-bold shadow-md" : "text-muted-foreground hover:text-foreground"}`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Types Switcher */}
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as ChartType)}
            className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-mono outline-none focus:border-primary text-foreground capitalize"
          >
            <option value="candles">Candlestick</option>
            <option value="line">Line Chart</option>
            <option value="area">Area Chart</option>
            <option value="heikin_ashi">Heikin Ashi</option>
            <option value="renko">Renko Bars</option>
            <option value="hollow">Hollow Candles</option>
            <option value="baseline">Baseline Chart</option>
          </select>

        </div>

        {/* Right Section: Indicators, Grid Layout & Actions */}
        <div className="flex items-center gap-2">
          
          {/* Indicators Modal Trigger */}
          <button
            onClick={() => setIndicatorModalOpen(true)}
            className="rounded-xl border border-border bg-card px-3 py-1.5 font-bold hover:bg-muted transition inline-flex items-center gap-1.5 text-emerald-400"
          >
            <Sparkles className="h-3.5 w-3.5" /> Indicators
          </button>

          {/* Multi-Chart Grid Selector */}
          <div className="flex rounded-xl border border-border bg-card p-1 text-[11px]">
            <button
              onClick={() => setGridMode(1)}
              className={`rounded-lg p-1.5 transition ${gridMode === 1 ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
              title="Single Chart View"
            >
              <BarChart2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setGridMode(2)}
              className={`rounded-lg p-1.5 transition ${gridMode === 2 ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
              title="2 Split Vertical View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setGridMode(4)}
              className={`rounded-lg p-1.5 transition ${gridMode === 4 ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
              title="4 Grid View"
            >
              <Grid className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Save Chart Layout & Fullscreen */}
          <button
            onClick={() => alert("TradingView Chart Layout saved to your QuantOS profile!")}
            className="rounded-xl border border-border bg-card p-2 hover:bg-muted transition text-muted-foreground hover:text-foreground"
            title="Save Chart Layout"
          >
            <Save className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="rounded-xl border border-border bg-card p-2 hover:bg-muted transition text-muted-foreground hover:text-foreground"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>

      </div>

      {/* 2. Main Workspace: Left Drawing Toolbar + Canvas Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Vertical Drawing Toolbar */}
        <div className="w-12 border-r border-border bg-[#151c23] flex flex-col items-center py-3 gap-3 text-muted-foreground shrink-0 z-20">
          {(
            [
              { id: "crosshair", icon: Crosshair, title: "Crosshair Cursor" },
              { id: "trendline", icon: MoveRight, title: "Trendline Tool" },
              { id: "horizontal", icon: Layers, title: "Horizontal Support/Resistance Line" },
              { id: "fib", icon: Activity, title: "Fibonacci Retracement" },
              { id: "long", icon: ArrowUp, title: "Long Position Risk/Reward Tool" },
              { id: "short", icon: ArrowDown, title: "Short Position Risk/Reward Tool" },
              { id: "rectangle", icon: Grid, title: "Rectangle Zone Tool" },
              { id: "text", icon: Edit3, title: "Text Note" },
              { id: "eraser", icon: Trash2, title: "Clear Drawings" },
            ] as const
          ).map((tool) => {
            const IconComponent = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  if (tool.id === "eraser") setDrawings([]);
                  else setActiveDrawingTool(tool.id as DrawingTool);
                }}
                title={tool.title}
                className={`p-2 rounded-xl transition ${activeDrawingTool === tool.id ? "bg-primary text-primary-foreground font-bold shadow" : "hover:bg-card hover:text-foreground"}`}
              >
                <IconComponent className="h-4 w-4" />
              </button>
            );
          })}
        </div>

        {/* Chart Canvas & Multi-Grid Views */}
        <div className={`flex-1 grid gap-1 bg-[#10151b] p-2 relative overflow-hidden ${gridMode === 1 ? "grid-cols-1" : gridMode === 2 ? "grid-cols-2" : "grid-cols-2 grid-rows-2"}`}>
          
          {Array.from({ length: gridMode }).map((_, gridIdx) => (
            <div key={gridIdx} className="relative h-full w-full rounded-xl border border-border/40 bg-background/80 p-4 flex flex-col justify-between overflow-hidden group">
              
              {/* Top OHLC & Active Indicator Status Line */}
              <div className="flex flex-wrap items-center justify-between text-xs font-mono text-muted-foreground border-b border-border/40 pb-2 z-10">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{currentSymbol}</span>
                  <span>O: {marketTick.open} | H: {marketTick.high} | L: {marketTick.low} | C: {marketTick.ltp}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  {activeIndicators.vwap && <span className="text-emerald-400">VWAP: 24,320.10</span>}
                  {activeIndicators.rsi && <span className="text-primary">RSI(14): 64.2</span>}
                  {activeIndicators.supertrend && <span className="text-amber-400">SuperTrend: BULLISH</span>}
                </div>
              </div>

              {/* Trading Canvas Body & Simulated Candle Bars */}
              <div className="relative flex-1 my-4 flex items-center justify-around">
                
                {/* MT5 Entry / SL / TP Order Execution Overlay Lines */}
                <div className="absolute inset-x-0 inset-y-4 flex flex-col justify-between pointer-events-none z-10 font-mono text-[10px]">
                  
                  {/* Target TP Line */}
                  <div className="w-full border-b border-dashed border-emerald-400/80 flex items-center justify-between px-2 text-emerald-400 font-bold">
                    <span className="bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/40">TARGET TP @ ₹{orderOverlay.targetPrice}</span>
                    <span>+₹4,000 (+1.65%)</span>
                  </div>

                  {/* Entry Price Line */}
                  <div className="w-full border-b border-dashed border-primary/80 flex items-center justify-between px-2 text-primary font-bold">
                    <span className="bg-primary/20 px-2 py-0.5 rounded border border-primary/40">ENTRY @ ₹{orderOverlay.entryPrice} ({orderOverlay.qty} Qty)</span>
                    <span className={`px-2 py-0.5 rounded font-mono ${orderOverlay.pnl >= 0 ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>
                      LIVE P&L: {orderOverlay.pnl >= 0 ? `+₹${orderOverlay.pnl}` : `-₹${Math.abs(orderOverlay.pnl)}`}
                    </span>
                  </div>

                  {/* Stop Loss Line */}
                  <div className="w-full border-b border-dashed border-rose-400/80 flex items-center justify-between px-2 text-rose-400 font-bold">
                    <span className="bg-rose-500/20 px-2 py-0.5 rounded border border-rose-400/40">STOP LOSS @ ₹{orderOverlay.stopLossPrice}</span>
                    <span>-₹2,025 (-0.82%)</span>
                  </div>

                </div>

                {/* Simulated Candlesticks */}
                <div className="absolute inset-0 flex items-center justify-around opacity-25 pointer-events-none">
                  <div className="w-2.5 bg-emerald-500 h-28 rounded-sm" />
                  <div className="w-2.5 bg-rose-500 h-20 rounded-sm" />
                  <div className="w-2.5 bg-emerald-500 h-36 rounded-sm" />
                  <div className="w-2.5 bg-emerald-500 h-44 rounded-sm" />
                  <div className="w-2.5 bg-rose-500 h-24 rounded-sm" />
                  <div className="w-2.5 bg-emerald-500 h-40 rounded-sm" />
                </div>

                {/* MT5 Visual Executed Trade Markers */}
                {tradeMarkers.map((marker) => (
                  <div
                    key={marker.id}
                    onClick={() => setSelectedMarker(marker)}
                    className="relative z-20 cursor-pointer group flex flex-col items-center"
                  >
                    {marker.type === "BUY" && (
                      <div className="h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg group-hover:scale-125 transition">
                        <ArrowUp className="h-4 w-4" />
                      </div>
                    )}
                    {marker.type === "SELL" && (
                      <div className="h-8 w-8 rounded-full bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-400 shadow-lg group-hover:scale-125 transition">
                        <ArrowDown className="h-4 w-4" />
                      </div>
                    )}
                    {marker.type === "TARGET" && (
                      <div className="h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg group-hover:scale-125 transition">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    )}
                    {marker.type === "SL" && (
                      <div className="h-8 w-8 rounded-full bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-400 shadow-lg group-hover:scale-125 transition">
                        <XCircle className="h-4 w-4" />
                      </div>
                    )}
                    <span className="mt-1 text-[10px] font-mono font-bold text-white bg-card/90 px-1.5 py-0.5 rounded border border-border">
                      {marker.type} @ ₹{marker.price}
                    </span>
                  </div>
                ))}

              </div>

              {/* Bottom Canvas Footer Status */}
              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground border-t border-border/40 pt-2 z-10">
                <span>TradingView Advanced Terminal · Real WebSocket Telemetry</span>
                <span>Vol: 18.5M | CPR Pivot: 24,315.00</span>
              </div>
            </div>
          ))}

        </div>

      </div>

      {/* 3. Symbol Search Modal */}
      {symbolSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" /> TradingView Symbol Search
              </h3>
              <button onClick={() => setSymbolSearchOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            <div className="space-y-2">
              {symbolsList.map((s) => (
                <button
                  key={s.symbol}
                  onClick={() => {
                    setCurrentSymbol(s.symbol);
                    setSymbolSearchOpen(false);
                  }}
                  className="w-full p-3 rounded-xl border border-border hover:border-primary bg-background/60 hover:bg-card transition flex items-center justify-between text-left text-xs font-mono"
                >
                  <div>
                    <div className="font-bold text-foreground flex items-center gap-2">
                      <span>{s.symbol}</span>
                      <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-normal">NSE</span>
                    </div>
                    <div className="text-muted-foreground text-[11px]">{s.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">₹{s.price}</div>
                    <div className={s.change.startsWith("+") ? "text-emerald-400" : "text-rose-400"}>{s.change}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Indicator Selection Modal */}
      {indicatorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Technical Indicators Manager
              </h3>
              <button onClick={() => setIndicatorModalOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            <div className="space-y-2 font-mono text-xs max-h-80 overflow-y-auto pr-1">
              {[
                { id: "vwap", label: "VWAP (Volume Weighted Avg Price)" },
                { id: "rsi", label: "RSI (Relative Strength Index - 14)" },
                { id: "supertrend", label: "SuperTrend (10, 3)" },
                { id: "ema20", label: "EMA 20 Exponential Moving Average" },
                { id: "ema50", label: "EMA 50 Exponential Moving Average" },
                { id: "ema200", label: "EMA 200 Long-Term Trend" },
                { id: "macd", label: "MACD (12, 26, 9)" },
                { id: "bollinger", label: "Bollinger Bands (20, 2)" },
                { id: "cpr", label: "Central Pivot Range (CPR)" },
                { id: "volume", label: "Volume Profile & Histogram" },
              ].map((ind) => {
                const isSelected = (activeIndicators as any)[ind.id];
                return (
                  <button
                    key={ind.id}
                    onClick={() => setActiveIndicators((prev) => ({ ...prev, [ind.id]: !isSelected }))}
                    className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${isSelected ? "border-primary bg-primary/10 text-primary font-bold" : "border-border text-muted-foreground hover:bg-background"}`}
                  >
                    <span>{ind.label}</span>
                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIndicatorModalOpen(false)}
              className="w-full rounded-xl py-2.5 text-xs font-semibold text-primary-foreground shadow-lg transition hover:opacity-90"
              style={{ background: "var(--gradient-primary)" }}
            >
              Apply Indicators to Chart
            </button>
          </div>
        </div>
      )}

      {/* 5. MT5 Trade Marker Detail Tooltip */}
      {selectedMarker && (
        <div className="absolute bottom-4 left-16 right-4 z-40 rounded-xl border border-primary/40 bg-card p-4 space-y-2 font-mono text-xs shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="font-bold text-primary flex items-center gap-1">
              <Info className="h-4 w-4" /> MT5 Trade Telemetry — {selectedMarker.id}
            </span>
            <button onClick={() => setSelectedMarker(null)} className="text-muted-foreground hover:text-foreground">✕</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
            <div><span className="text-muted-foreground">Type:</span> <span className="text-foreground font-bold">{selectedMarker.type}</span></div>
            <div><span className="text-muted-foreground">Price:</span> <span className="text-foreground font-bold">₹{selectedMarker.price}</span></div>
            <div><span className="text-muted-foreground">Time:</span> <span className="text-foreground">{selectedMarker.time}</span></div>
            <div><span className="text-muted-foreground">Qty:</span> <span className="text-foreground">{selectedMarker.qty}</span></div>
            <div><span className="text-muted-foreground">Strategy:</span> <span className="text-foreground">{selectedMarker.strategyName}</span></div>
            <div><span className="text-muted-foreground">Broker Gateway:</span> <span className="text-foreground">{selectedMarker.broker}</span></div>
            {selectedMarker.pnl !== undefined && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Execution P&L:</span>{" "}
                <span className={`font-bold ${selectedMarker.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {selectedMarker.pnl >= 0 ? `+₹${selectedMarker.pnl}` : `-₹${Math.abs(selectedMarker.pnl)}`}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
