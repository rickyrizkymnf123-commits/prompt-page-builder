// Admin users management edge function
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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
      const adminClient = createClient(supabaseUrl, serviceRoleKey);

      // Extract user ID from the JWT token using admin client
      const token = authHeader.replace("Bearer ", "");
      // Decode JWT payload to get user ID (base64url decode)
      let callerId: string;
      try {
        const payloadB64 = token.split(".")[1];
        const payload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));
        callerId = payload.sub;
        if (!callerId) throw new Error("No sub in token");
      } catch {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify user actually exists via admin API
      const { data: userData, error: userErr } = await adminClient.auth.admin.getUserById(callerId);
      if (userErr || !userData?.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }


      const { action, user_id, email, password, name, role, tier, members, phone, send_wa } = await req.json();

      // Check admin role (skip for initial setup)
      const { data: roles } = await adminClient
        .from("user_roles")
        .select("role")
        .eq("user_id", callerId);
      const isAdmin = roles?.some((r: any) => r.role === "admin");
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // --- LIST USERS ---
      if (action === "list") {
        // Fetch all users with pagination (default limit is 50)
        let allAuthUsers: any[] = [];
        let page = 1;
        const perPage = 1000;
        while (true) {
          const { data: batch } = await adminClient.auth.admin.listUsers({ page, perPage });
          if (!batch?.users?.length) break;
          allAuthUsers = allAuthUsers.concat(batch.users);
          if (batch.users.length < perPage) break;
          page++;
        }
        const { data: profiles } = await adminClient.from("profiles").select("*");
        const { data: entitlements } = await adminClient.from("entitlements").select("*");
        const { data: userRoles } = await adminClient.from("user_roles").select("*");
        const { data: promptUsages } = await adminClient.from("prompt_usage").select("*");

        const users = allAuthUsers.map((u: any) => {
          const profile = profiles?.find((p: any) => p.user_id === u.id);
          const ent = entitlements?.find((e: any) => e.user_id === u.id);
          const uRole = userRoles?.find((r: any) => r.user_id === u.id);
          const usage = promptUsages?.find((pu: any) => pu.user_id === u.id);
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
            prompt_used: usage?.used_count || 0,
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
        await adminClient.from("prompt_usage").delete().eq("user_id", user_id);
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

      // --- CHANGE TIER ---
      if (action === "change_tier") {
        if (!user_id) {
          return new Response(JSON.stringify({ error: "user_id required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const newProductCode = role === "paid" ? "LPE" : "LPE_FREE";
        const { data: existing } = await adminClient
          .from("entitlements")
          .select("id")
          .eq("user_id", user_id)
          .maybeSingle();
        
        if (existing) {
          await adminClient.from("entitlements").update({ product_code: newProductCode, status: "active" }).eq("id", existing.id);
        } else {
          await adminClient.from("entitlements").insert({
            user_id: user_id,
            product_code: newProductCode,
            status: "active",
            order_id: `MANUAL_${Date.now()}`,
          });
        }
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // --- RESET USAGE ---
      if (action === "reset_usage") {
        if (!user_id) {
          return new Response(JSON.stringify({ error: "user_id required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        await adminClient.from("prompt_usage").upsert({ user_id, used_count: 0, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

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
        if (createErr || !newMember?.user) {
          return new Response(JSON.stringify({ success: false, error: createErr?.message || "Failed to create user" }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        await adminClient.from("entitlements").insert({
          user_id: newMember.user.id,
          status: "active",
          order_id: `MANUAL_${Date.now()}`,
          product_code: tier === "free" ? "LPE_FREE" : "LPE",
        });
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

      // --- BULK ADD MEMBERS ---
      if (action === "bulk_add_members") {
        if (!members || !Array.isArray(members) || members.length === 0) {
          return new Response(JSON.stringify({ error: "members array required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const results: { email: string; success: boolean; error?: string }[] = [];
        for (const m of members) {
          try {
            const mEmail = (m.email || '').trim().toLowerCase();
            const mName = (m.name || '').trim();
            const mPassword = (m.password || '').trim();
            if (!mEmail || !mPassword || mPassword.length < 6) {
              results.push({ email: mEmail, success: false, error: "Email/password invalid atau password < 6 karakter" });
              continue;
            }
            const { data: newUser, error: createErr } = await adminClient.auth.admin.createUser({
              email: mEmail,
              password: mPassword,
              email_confirm: true,
              user_metadata: { name: mName },
            });
            if (createErr || !newUser.user) {
              results.push({ email: mEmail, success: false, error: createErr?.message || "Gagal membuat user" });
              continue;
            }
            await adminClient.from("entitlements").insert({
              user_id: newUser.user.id,
              status: "active",
              order_id: `BULK_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
              product_code: tier === "free" ? "LPE_FREE" : "LPE",
            });
            results.push({ email: mEmail, success: true });
          } catch (err) {
            results.push({ email: m.email || '', success: false, error: (err as Error).message });
          }
        }
        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;
        return new Response(JSON.stringify({ success: true, results, successCount, failCount }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // --- TEST PROVISION ---
      if (action === "test_provision") {
        const testEmail = (email || '').trim().toLowerCase();
        const testName = (name || 'Test User').trim();
        const testPhone = (phone || '').trim();
        const testProductCode = tier || 'LPE';

        if (!testEmail) {
          return new Response(JSON.stringify({ error: "Email wajib diisi" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Build a fake Scalev-like payload
        const testOrderId = `TEST_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        const fakePayload = {
          event: "order.payment_status_changed",
          data: {
            order_id: testOrderId,
            payment_status: "paid",
            customer: {
              email: testEmail,
              name: testName,
              phone: testPhone || null,
            },
            product_code: testProductCode,
          },
        };

        // Call provision function directly with secret
        const provisionSecret = Deno.env.get("PROVISION_SECRET") || "";
        const provisionUrl = `${supabaseUrl}/functions/v1/provision?secret=${encodeURIComponent(provisionSecret)}`;

        const provisionRes = await fetch(provisionUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fakePayload),
        });

        const provisionResult = await provisionRes.json();

        return new Response(JSON.stringify({
          success: provisionRes.ok && provisionResult?.ok,
          test_order_id: testOrderId,
          provision_result: provisionResult,
        }), {
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
