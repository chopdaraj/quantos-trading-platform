import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { z } from "zod";

const emailSchema = z.object({ email: z.string().trim().email().max(255) });

export const submitWaitlist = createServerFn({ method: "POST" })
  .inputValidator((d) => emailSchema.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const supa = createClient<Database>(process.env.SUPABASE_URL!, key, {
      auth: { persistSession: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    const { error } = await supa.from("waitlist").insert({ email: data.email.toLowerCase() });
    if (error && !error.message.toLowerCase().includes("duplicate")) {
      throw new Error(error.message);
    }
    return { ok: true };
  });

export const listWaitlist = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { data, error } = await context.supabase
      .from("waitlist")
      .select("id, email, created_at, status")
      .order("created_at", { ascending: false });
    if (error) {
      // Fallback if status column is not present yet
      const { data: dataFallback, error: errFallback } = await context.supabase
        .from("waitlist")
        .select("id, email, created_at")
        .order("created_at", { ascending: false });
      if (errFallback) throw new Error(errFallback.message);
      return (dataFallback ?? []).map((row) => ({ ...row, status: "pending" }));
    }
    return (data ?? []).map((row) => ({
      ...row,
      status: row.status || "pending",
    }));
  });

const updateStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "accepted", "rejected"]),
});

export const updateWaitlistStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => updateStatusSchema.parse(d))
  .handler(async ({ context, data }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { error } = await context.supabase
      .from("waitlist")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true, id: data.id, status: data.status };
  });

const deleteRequestSchema = z.object({
  id: z.string().uuid(),
});

export const deleteWaitlistRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => deleteRequestSchema.parse(d))
  .handler(async ({ context, data }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { error } = await context.supabase
      .from("waitlist")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true, id: data.id };
  });

export const checkUserAccessStatus = createServerFn({ method: "POST" })
  .inputValidator((d) => emailSchema.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const supa = createClient<Database>(process.env.SUPABASE_URL!, key, {
      auth: { persistSession: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { data: row } = await supa
      .from("waitlist")
      .select("status")
      .eq("email", data.email.toLowerCase())
      .limit(1)
      .maybeSingle();

    if (!row) {
      return { status: "accepted" };
    }

    return { status: row.status || "pending" };
  });

export const confirmUserEmail = createServerFn({ method: "POST" })
  .inputValidator((d) => emailSchema.parse(d))
  .handler(async ({ data }) => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
      const user = list?.users.find((u) => u.email?.toLowerCase() === data.email.toLowerCase());
      if (user) {
        await supabaseAdmin.auth.admin.updateUserById(user.id, { email_confirm: true });
        return { ok: true, confirmed: true };
      }
      return { ok: false, error: "User not found" };
    } catch (err: any) {
      return { ok: false, error: err.message };
    }
  });

export const ensureAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const email = "admin@quantos.app";
  const password = "QuantOS@Admin2026";
  // check if exists
  const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
  let user = list?.users.find((u) => u.email === email);
  if (!user) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) throw new Error(error.message);
    user = data.user!;
  }
  await supabaseAdmin.from("user_roles").upsert(
    { user_id: user.id, role: "admin" },
    { onConflict: "user_id,role" },
  );
  return { ok: true, email };
});