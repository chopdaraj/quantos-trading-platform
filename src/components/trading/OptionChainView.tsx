import { useEffect, useState } from "react";
import { fetchOptionChainServerFn } from "@/lib/trading.functions";
import { useServerFn } from "@tanstack/react-start";
import { Layers, RefreshCw, Activity, ArrowUpRight, ArrowDownRight, Award } from "lucide-react";

export function OptionChainView() {
  const [underlying, setUnderlying] = useState("NIFTY");
  const [chainData, setChainData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchChain = useServerFn(fetchOptionChainServerFn);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchChain({ data: { underlying } });
      setChainData(res);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [underlying]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-xl relative overflow-hidden">
      
      {/* Option Chain Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <Layers className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">NSE Live Option Chain & Greeks</h2>
            <p className="text-xs text-muted-foreground">Tick-by-tick Options analytics, Open Interest, PCR, and Option Greeks.</p>
          </div>
        </div>

        {/* Index Selector & Refresh */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-border bg-background p-1 text-xs font-mono">
            <button
              onClick={() => setUnderlying("NIFTY")}
              className={`rounded-lg px-3 py-1.5 transition ${underlying === "NIFTY" ? "bg-card text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
            >
              NIFTY 50
            </button>
            <button
              onClick={() => setUnderlying("BANKNIFTY")}
              className={`rounded-lg px-3 py-1.5 transition ${underlying === "BANKNIFTY" ? "bg-card text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
            >
              BANK NIFTY
            </button>
          </div>

          <button
            onClick={loadData}
            className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold hover:bg-muted transition inline-flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Option Chain Meta Metrics */}
      {chainData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
          <div className="rounded-xl border border-border bg-background p-3.5 space-y-1">
            <div className="text-muted-foreground uppercase text-[10px]">Spot Price</div>
            <div className="text-lg font-bold text-emerald-400">₹{chainData.spotPrice}</div>
          </div>
          <div className="rounded-xl border border-border bg-background p-3.5 space-y-1">
            <div className="text-muted-foreground uppercase text-[10px]">Max Pain Strike</div>
            <div className="text-lg font-bold text-amber-400">₹{chainData.maxPain}</div>
          </div>
          <div className="rounded-xl border border-border bg-background p-3.5 space-y-1">
            <div className="text-muted-foreground uppercase text-[10px]">Put-Call Ratio (PCR)</div>
            <div className="text-lg font-bold text-primary">{chainData.pcr}</div>
          </div>
          <div className="rounded-xl border border-border bg-background p-3.5 space-y-1">
            <div className="text-muted-foreground uppercase text-[10px]">Current Expiry</div>
            <div className="text-lg font-bold text-foreground">{chainData.expiry}</div>
          </div>
        </div>
      )}

      {/* Option Chain Table */}
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs font-mono">
            <thead className="bg-card border-b border-border text-muted-foreground">
              <tr>
                <th colSpan={5} className="py-2 bg-emerald-500/10 text-emerald-400 border-r border-border">CALL OPTIONS (CE)</th>
                <th className="py-2 bg-card font-bold text-foreground">STRIKE</th>
                <th colSpan={5} className="py-2 bg-rose-500/10 text-rose-400 border-l border-border">PUT OPTIONS (PE)</th>
              </tr>
              <tr className="border-t border-border text-[11px]">
                <th className="p-2.5">OI</th>
                <th className="p-2.5">OI Chg</th>
                <th className="p-2.5">IV</th>
                <th className="p-2.5">Delta</th>
                <th className="p-2.5 border-r border-border">LTP</th>
                <th className="p-2.5 bg-card">PRICE</th>
                <th className="p-2.5 border-l border-border">LTP</th>
                <th className="p-2.5">Delta</th>
                <th className="p-2.5">IV</th>
                <th className="p-2.5">OI Chg</th>
                <th className="p-2.5">OI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {chainData?.strikes?.map((row: any) => (
                <tr key={row.strike} className={`hover:bg-muted/20 transition ${row.isAtm ? "bg-primary/10 font-bold" : ""}`}>
                  {/* Call Data */}
                  <td className="p-2.5 text-muted-foreground">{row.call.oi.toLocaleString()}</td>
                  <td className={`p-2.5 ${row.call.oiChange >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {row.call.oiChange >= 0 ? `+${row.call.oiChange}` : row.call.oiChange}
                  </td>
                  <td className="p-2.5 text-muted-foreground">{row.call.iv}%</td>
                  <td className="p-2.5 text-primary">{row.call.delta}</td>
                  <td className="p-2.5 border-r border-border font-bold text-emerald-400">₹{row.call.price}</td>

                  {/* Strike Price */}
                  <td className={`p-2.5 font-bold ${row.isAtm ? "text-primary text-sm" : "text-foreground"}`}>
                    {row.strike} {row.isAtm && <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded ml-1">ATM</span>}
                  </td>

                  {/* Put Data */}
                  <td className="p-2.5 border-l border-border font-bold text-rose-400">₹{row.put.price}</td>
                  <td className="p-2.5 text-primary">{row.put.delta}</td>
                  <td className="p-2.5 text-muted-foreground">{row.put.iv}%</td>
                  <td className={`p-2.5 ${row.put.oiChange >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {row.put.oiChange >= 0 ? `+${row.put.oiChange}` : row.put.oiChange}
                  </td>
                  <td className="p-2.5 text-muted-foreground">{row.put.oi.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
