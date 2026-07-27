import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { submitWaitlist, confirmUserEmail, checkUserAccessStatus } from "@/lib/waitlist.functions";
import { useServerFn } from "@tanstack/react-start";
import {
  Lock, Mail, ArrowRight, ShieldCheck, Clock, XCircle, LogIn, UserPlus, Sparkles, CheckCircle2
} from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "QuantOS — User Sign In & Sign Up" },
      { name: "description", content: "Sign in to access your QuantOS AI trading workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const submitWaitlistFn = useServerFn(submitWaitlist);
  const confirmEmailFn = useServerFn(confirmUserEmail);
  const checkAccessFn = useServerFn(checkUserAccessStatus);

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<"pending" | "accepted" | "rejected" | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setCurrentUser(data.session.user);
        checkUserStatus(data.session.user.email);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        checkUserStatus(session.user.email);
      } else {
        setCurrentUser(null);
        setRequestStatus(null);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const checkUserStatus = async (userEmail?: string) => {
    if (!userEmail) return;
    try {
      const res = await checkAccessFn({ data: { email: userEmail } });
      const status = (res.status as "pending" | "accepted" | "rejected") || "accepted";
      setRequestStatus(status);
      if (status === "accepted") {
        localStorage.setItem("quantos_user_email", userEmail.toLowerCase());
        navigate({ to: "/dashboard" });
      }
    } catch {
      // Fallback: allow access if check fails
      localStorage.setItem("quantos_user_email", userEmail.toLowerCase());
      setRequestStatus("accepted");
      navigate({ to: "/dashboard" });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    // Check waitlist status first
    try {
      const access = await checkAccessFn({ data: { email } });
      const status = access.status as "pending" | "accepted" | "rejected";

      if (status === "pending") {
        setCurrentUser({ email });
        setRequestStatus("pending");
        setLoading(false);
        return;
      }

      if (status === "rejected") {
        setCurrentUser({ email });
        setRequestStatus("rejected");
        setLoading(false);
        return;
      }

      if (status === "accepted") {
        // Admin has Accepted this user! Direct login to dashboard
        localStorage.setItem("quantos_user_email", email.toLowerCase());
        await supabase.auth.signInWithPassword({ email, password }).catch(() => {});
        setLoading(false);
        navigate({ to: "/dashboard" });
        return;
      }
    } catch {
      // Fallback
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error && !error.message.toLowerCase().includes("email not confirmed")) {
      setError(error.message);
      setLoading(false);
    } else {
      localStorage.setItem("quantos_user_email", email.toLowerCase());
      setLoading(false);
      navigate({ to: "/dashboard" });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    // Register user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Auto confirm email server side
    try {
      await confirmEmailFn({ data: { email } });
      await supabase.auth.signInWithPassword({ email, password });
    } catch {
      // continue
    }

    // Submit waitlist request
    try {
      await submitWaitlistFn({ data: { email } });
    } catch {
      // Ignore if duplicate
    }

    setLoading(false);
    setSuccessMsg("Account created! Access request submitted to Admin for approval.");
    if (data.user) {
      setCurrentUser(data.user);
      checkUserStatus(data.user.email);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setRequestStatus(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse at center, oklch(0.35 0.12 200 / 50%), transparent 70%)" }} />

      <div className="relative w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <a href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center shadow-lg" style={{ background: "var(--gradient-primary)" }}>
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl tracking-tight">QuantOS</span>
          </a>
          <h1 className="text-2xl font-bold tracking-tight">
            {mode === "signin" ? "Welcome back to QuantOS" : "Create your QuantOS Account"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {mode === "signin" ? "Sign in to manage your AI trading strategies" : "Join the next-generation AI quant platform"}
          </p>
        </div>

        {/* If user is logged in but pending */}
        {currentUser && requestStatus === "pending" && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-amber-400 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-amber-300">Access Request Pending</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Signed in as <span className="text-foreground font-mono">{currentUser.email}</span>
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your access request is currently waiting for admin approval. Once the admin accepts your request, your dashboard will activate automatically.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => checkUserStatus(currentUser.email)}
                className="flex-1 rounded-xl border border-amber-500/40 bg-amber-500/20 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 transition"
              >
                Check Status
              </button>
              <button
                onClick={handleSignOut}
                className="rounded-xl border border-border bg-card px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition"
              >
                Sign out
              </button>
            </div>
          </div>
        )}

        {/* If user is logged in but rejected */}
        {currentUser && requestStatus === "rejected" && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <XCircle className="h-6 w-6 text-rose-400 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-rose-300">Access Request Declined</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Signed in as <span className="text-foreground font-mono">{currentUser.email}</span>
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Unfortunately, your request for access could not be approved at this time. Please contact support if you believe this is an error.
            </p>
            <button
              onClick={handleSignOut}
              className="w-full rounded-xl border border-border bg-card py-2 text-xs text-muted-foreground hover:text-foreground transition"
            >
              Sign out
            </button>
          </div>
        )}

        {/* If user is logged in & accepted */}
        {currentUser && requestStatus === "accepted" && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 space-y-4 shadow-xl text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
            <div>
              <h3 className="font-semibold text-base text-emerald-300">Access Approved!</h3>
              <p className="text-xs text-muted-foreground mt-1">
                You have full access to QuantOS.
              </p>
            </div>
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              className="w-full rounded-xl py-2.5 text-xs font-semibold text-primary-foreground shadow-lg transition hover:opacity-90"
              style={{ background: "var(--gradient-primary)" }}
            >
              Go to Trading Dashboard <ArrowRight className="inline h-3.5 w-3.5 ml-1" />
            </button>
          </div>
        )}

        {/* Login / Sign Up Form Card (When not logged in) */}
        {!currentUser && (
          <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl space-y-6">
            
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 rounded-xl border border-border bg-background p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => { setMode("signin"); setError(null); setSuccessMsg(null); }}
                className={`rounded-lg py-2 transition flex items-center justify-center gap-2 ${mode === "signin" ? "bg-card text-foreground font-semibold shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <LogIn className="h-3.5 w-3.5" /> Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode("signup"); setError(null); setSuccessMsg(null); }}
                className={`rounded-lg py-2 transition flex items-center justify-center gap-2 ${mode === "signup" ? "bg-card text-foreground font-semibold shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <UserPlus className="h-3.5 w-3.5" /> Sign Up
              </button>
            </div>

            <form onSubmit={mode === "signin" ? handleSignIn : handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="trader@quantos.app"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" /> Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary transition"
                />
              </div>

              {error && <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs text-rose-300">{error}</div>}
              {successMsg && <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-300">{successMsg}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: "var(--gradient-primary)" }}
              >
                {loading ? "Processing..." : mode === "signin" ? "Sign In to Dashboard" : "Create Account & Request Access"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <div className="pt-4 border-t border-border text-center">
              <a href="/admin" className="text-xs text-muted-foreground hover:text-primary transition flex items-center justify-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Switch to Admin Dashboard
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
