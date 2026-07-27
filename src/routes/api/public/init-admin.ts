import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/init-admin")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const email = "admin@quantos.app";
        const password = "QuantOS@Admin2026";
        const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
        let user = list?.users.find((u) => u.email === email);
        if (!user) {
          const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
          });
          if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
          user = data.user!;
        }
        const { error: rerr } = await supabaseAdmin
          .from("user_roles")
          .upsert({ user_id: user.id, role: "admin" }, { onConflict: "user_id,role" });
        if (rerr) return Response.json({ ok: false, error: rerr.message }, { status: 500 });
        return Response.json({ ok: true, email });
      },
    },
  },
});