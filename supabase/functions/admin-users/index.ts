import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // If auth header present, verify admin
    if (authHeader) {
      const callerClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user: caller } } = await callerClient.auth.getUser();
      if (!caller) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const adminClient = createClient(supabaseUrl, serviceRoleKey);

      const { action, user_id, email, password, name, role } = await req.json();

      // Check admin role (skip for initial setup)
      const { data: roles } = await adminClient
        .from("user_roles")
        .select("role")
        .eq("user_id", caller.id);
      const isAdmin = roles?.some((r: any) => r.role === "admin");
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // --- LIST USERS ---
      if (action === "list") {
        const { data: allUsers } = await adminClient.auth.admin.listUsers();
        const { data: profiles } = await adminClient.from("profiles").select("*");
        const { data: entitlements } = await adminClient.from("entitlements").select("*");
        const { data: userRoles } = await adminClient.from("user_roles").select("*");

        const users = allUsers?.users?.map((u: any) => {
          const profile = profiles?.find((p: any) => p.user_id === u.id);
          const ent = entitlements?.find((e: any) => e.user_id === u.id);
          const uRole = userRoles?.find((r: any) => r.user_id === u.id);
          return {
            id: u.id,
            email: u.email,
            name: profile?.name || u.user_metadata?.name || null,
            phone: profile?.phone || null,
            status: ent?.status || "no_entitlement",
            entitlement_id: ent?.id || null,
            product_code: ent?.product_code || null,
            order_id: ent?.order_id || null,
            role: uRole?.role || "user",
            created_at: u.created_at,
            last_sign_in: u.last_sign_in_at,
          };
        }) || [];

        return new Response(JSON.stringify({ users }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // --- DELETE USER ---
      if (action === "delete") {
        if (!user_id) {
          return new Response(JSON.stringify({ error: "user_id required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        await adminClient.from("entitlements").delete().eq("user_id", user_id);
        await adminClient.from("profiles").delete().eq("user_id", user_id);
        await adminClient.from("user_roles").delete().eq("user_id", user_id);
        const { error } = await adminClient.auth.admin.deleteUser(user_id);
        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // --- APPROVE ---
      if (action === "approve") {
        const { error } = await adminClient.from("entitlements").update({ status: "active" }).eq("id", user_id);
        return new Response(JSON.stringify({ success: !error, error: error?.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // --- REJECT ---
      if (action === "reject") {
        const { error } = await adminClient.from("entitlements").update({ status: "rejected" }).eq("id", user_id);
        return new Response(JSON.stringify({ success: !error, error: error?.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // --- RESET PASSWORD ---
      if (action === "reset_password") {
        if (!user_id || !password) {
          return new Response(JSON.stringify({ error: "user_id and password required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const { error } = await adminClient.auth.admin.updateUserById(user_id, { password });
        return new Response(JSON.stringify({ success: !error, error: error?.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // --- ADD MEMBER (manual) ---
      if (action === "add_member") {
        if (!email || !password) {
          return new Response(JSON.stringify({ error: "email and password required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const { data: newMember, error: createErr } = await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { name: name || '' },
        });
        if (createErr || !newMember.user) {
          return new Response(JSON.stringify({ error: createErr?.message || "Failed to create user" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        // Add entitlement with status based on request
        await adminClient.from("entitlements").insert({
          user_id: newMember.user.id,
          status: "active",
          order_id: `MANUAL_${Date.now()}`,
          product_code: "LPE",
        });
        // Add role if specified
        if (role && role === "admin") {
          await adminClient.from("user_roles").insert({
            user_id: newMember.user.id,
            role: "admin",
          });
        }
        return new Response(JSON.stringify({ success: true, user_id: newMember.user.id }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Unknown action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- SETUP: Create admin (one-time, requires setup_secret) ---
    const { setup_secret, email, password, name } = await req.json();
    const PROVISION_SECRET = Deno.env.get("PROVISION_SECRET");
    if (!setup_secret || setup_secret !== PROVISION_SECRET) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Create user
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (createError || !newUser.user) {
      return new Response(JSON.stringify({ error: createError?.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Add admin role
    await adminClient.from("user_roles").insert({
      user_id: newUser.user.id,
      role: "admin",
    });

    // Add active entitlement
    await adminClient.from("entitlements").insert({
      user_id: newUser.user.id,
      status: "active",
      order_id: "ADMIN_SETUP",
      product_code: "LPE",
    });

    return new Response(JSON.stringify({ success: true, user_id: newUser.user.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
