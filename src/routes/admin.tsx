import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { listWaitlist, updateWaitlistStatus, deleteWaitlistRequest, confirmUserEmail } from "@/lib/waitlist.functions";
import {
  Lock, LogOut, Download, RefreshCw, CheckCircle2, XCircle,
  Clock, Trash2, Search, Check, X, ShieldAlert, Users, Filter
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "QuantOS Admin — Access Requests" },
      { name: "description", content: "Private admin dashboard for QuantOS access request approval." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type RequestRow = {
  id: string;
  email: string;
  created_at: string;
  status: "pending" | "accepted" | "rejected";
};

function AdminPage() {
  const [session, setSession] = useState<null | { email: string }>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [rows, setRows] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "accepted" | "rejected">("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchRows = useServerFn(listWaitlist);
  const updateStatusFn = useServerFn(updateWaitlistStatus);
  const deleteRequestFn = useServerFn(deleteWaitlistRequest);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email) setSession({ email: data.session.user.email });
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s?.user?.email ? { email: s.user.email } : null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRows();
      setRows((data as RequestRow[]) || []);
    } catch (e: any) {
      setError(e.message ?? "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) load();
  }, [session]);

  const confirmEmailFn = useServerFn(confirmUserEmail);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    let { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error && error.message.toLowerCase().includes("email not confirmed")) {
      try {
        await confirmEmailFn({ data: { email } });
        const retry = await supabase.auth.signInWithPassword({ email, password });
        error = retry.error;
      } catch {
        // continue
      }
    }
    if (error) setError(error.message);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRows([]);
  };

  const handleUpdateStatus = async (id: string, targetEmail: string, newStatus: "accepted" | "rejected" | "pending") => {
    setActionLoadingId(id);
    try {
      await updateStatusFn({ data: { id, status: newStatus } });
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      const actionText = newStatus === "accepted" ? "accepted" : newStatus === "rejected" ? "rejected" : "reset to pending";
      showToast(`Request for ${targetEmail} ${actionText}.`);
    } catch (e: any) {
      showToast(`Failed to update status: ${e.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string, targetEmail: string) => {
    if (!confirm(`Are you sure you want to delete request from ${targetEmail}?`)) return;
    setActionLoadingId(id);
    try {
      await deleteRequestFn({ data: { id } });
      setRows((prev) => prev.filter((r) => r.id !== id));
      showToast(`Request from ${targetEmail} deleted.`);
    } catch (e: any) {
      showToast(`Failed to delete: ${e.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const exportCsv = () => {
    const csv = ["id,email,status,joined_at", ...rows.map((r) => `"${r.id}","${r.email}","${r.status}","${r.created_at}"`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quantos-requests-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered rows
  const filteredRows = rows.filter((r) => {
    const matchesSearch = r.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || r.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const countPending = rows.filter((r) => r.status === "pending").length;
  const countAccepted = rows.filter((r) => r.status === "accepted").length;
  const countRejected = rows.filter((r) => r.status === "rejected").length;

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading dashboard…</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <form onSubmit={signIn} className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 space-y-5 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <Lock className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">QuantOS Admin</h1>
              <p className="text-xs text-muted-foreground">Access Management</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Admin email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          {error && error.toLowerCase().includes("email not confirmed") ? (
            <div className="p-3 rounded-lg border border-amber-500/40 bg-amber-500/10 text-xs space-y-2">
              <p className="text-amber-300 font-semibold">Email Not Confirmed in Supabase</p>
              <p className="text-muted-foreground">Supabase requires clicking the confirmation link sent to your email.</p>
              <button
                type="button"
                onClick={async () => {
                  const { error: rErr } = await supabase.auth.resend({ type: "signup", email });
                  if (rErr) setError(rErr.message);
                  else showToast("Confirmation email resent to " + email);
                }}
                className="rounded border border-amber-500/40 bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 transition"
              >
                Resend Confirmation Link
              </button>
            </div>
          ) : (
            error && <p className="text-xs text-red-400">{error}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            style={{ background: "var(--gradient-primary)" }}
          >
            Sign in
          </button>
          
          <div className="pt-3 border-t border-border space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Default Credentials:</span>
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@quantos.app");
                  setPassword("QuantOS@Admin2026");
                }}
                className="text-primary hover:underline font-mono text-xs"
              >
                Auto-fill
              </button>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-2.5 text-xs font-mono text-muted-foreground space-y-1">
              <div>Email: <span className="text-foreground">admin@quantos.app</span></div>
              <div>Pass: <span className="text-foreground">QuantOS@Admin2026</span></div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10 text-foreground bg-background">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 rounded-xl border border-primary/30 bg-card px-4 py-3 text-sm text-foreground shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-border">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Access Requests Management</h1>
            <p className="text-sm text-muted-foreground">Signed in as <span className="text-foreground font-mono">{session.email}</span></p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="rounded-lg border border-border px-3 py-2 text-sm inline-flex items-center gap-2 hover:bg-muted transition">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button onClick={exportCsv} className="rounded-lg border border-border px-3 py-2 text-sm inline-flex items-center gap-2 hover:bg-muted transition">
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <button onClick={signOut} className="rounded-lg border border-border px-3 py-2 text-sm inline-flex items-center gap-2 hover:bg-muted transition text-red-400 hover:text-red-300">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground uppercase">Total Requests</span>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono">{rows.length}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground uppercase">Pending Approval</span>
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-amber-400">{countPending}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground uppercase">Accepted</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-emerald-400">{countAccepted}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground uppercase">Rejected</span>
              <XCircle className="h-4 w-4 text-rose-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-rose-400">{countRejected}</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex rounded-xl border border-border bg-card p-1 text-xs font-medium">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-lg px-3 py-1.5 transition ${activeTab === "all" ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
            >
              All ({rows.length})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`rounded-lg px-3 py-1.5 transition ${activeTab === "pending" ? "bg-amber-500/20 text-amber-300 font-semibold" : "text-muted-foreground hover:text-foreground"}`}
            >
              Pending ({countPending})
            </button>
            <button
              onClick={() => setActiveTab("accepted")}
              className={`rounded-lg px-3 py-1.5 transition ${activeTab === "accepted" ? "bg-emerald-500/20 text-emerald-300 font-semibold" : "text-muted-foreground hover:text-foreground"}`}
            >
              Accepted ({countAccepted})
            </button>
            <button
              onClick={() => setActiveTab("rejected")}
              className={`rounded-lg px-3 py-1.5 transition ${activeTab === "rejected" ? "bg-rose-500/20 text-rose-300 font-semibold" : "text-muted-foreground hover:text-foreground"}`}
            >
              Rejected ({countRejected})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-card pl-9 pr-4 py-1.5 text-sm outline-none focus:border-primary transition"
            />
          </div>
        </div>

        {/* Main Table */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xl">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>Showing {filteredRows.length} of {rows.length} requests</span>
            {loading && <span>Refreshing...</span>}
          </div>

          {error && <div className="px-5 py-4 text-sm text-red-400 bg-red-500/10 border-b border-border">{error}</div>}

          <div className="divide-y divide-border">
            {filteredRows.map((r) => {
              const isLoading = actionLoadingId === r.id;
              return (
                <div key={r.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition">
                  
                  {/* Email & Joined Date */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm text-foreground">{r.email}</span>

                      {/* Status Badge */}
                      {r.status === "accepted" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" /> Accepted
                        </span>
                      )}
                      {r.status === "rejected" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 text-xs font-medium text-rose-400">
                          <XCircle className="h-3 w-3" /> Rejected
                        </span>
                      )}
                      {r.status === "pending" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                          <Clock className="h-3 w-3" /> Pending
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      Requested on: {new Date(r.created_at).toLocaleString()}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {r.status !== "accepted" && (
                      <button
                        disabled={isLoading}
                        onClick={() => handleUpdateStatus(r.id, r.email, "accepted")}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-50 transition"
                      >
                        <Check className="h-3.5 w-3.5" /> Accept
                      </button>
                    )}

                    {r.status !== "rejected" && (
                      <button
                        disabled={isLoading}
                        onClick={() => handleUpdateStatus(r.id, r.email, "rejected")}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 disabled:opacity-50 transition"
                      >
                        <X className="h-3.5 w-3.5" /> Reject
                      </button>
                    )}

                    {r.status !== "pending" && (
                      <button
                        disabled={isLoading}
                        onClick={() => handleUpdateStatus(r.id, r.email, "pending")}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 transition"
                        title="Reset to Pending"
                      >
                        <Clock className="h-3.5 w-3.5" /> Reset
                      </button>
                    )}

                    <button
                      disabled={isLoading}
                      onClick={() => handleDelete(r.id, r.email)}
                      className="inline-flex items-center justify-center rounded-lg border border-border p-1.5 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 disabled:opacity-50 transition"
                      title="Delete Request"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}

            {!loading && filteredRows.length === 0 && (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                No access requests found matching your filter.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}