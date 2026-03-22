import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encode as base64Encode } from "https://deno.land/std@0.208.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-scalev-hmac-sha256",
};

function generatePassword(length = 10): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

async function verifyScalevSignature(
  rawBody: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
  const calculatedSignature = base64Encode(new Uint8Array(signed));
  return calculatedSignature === signature;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Health check / ping for webhook validation (Scalev sends GET or empty POST on save)
  if (req.method === "GET") {
    return new Response(JSON.stringify({ ok: true, status: "ready" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const rawBody = await req.text();

    // Handle empty body (ping/validation request from Scalev on webhook save)
    if (!rawBody || rawBody.trim() === "") {
      return new Response(JSON.stringify({ ok: true, status: "ping_received" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const PROVISION_SECRET = Deno.env.get("PROVISION_SECRET");

    if (!PROVISION_SECRET) {
      return new Response(JSON.stringify({ error: "Server misconfigured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Auth: check HMAC signature header OR query param fallback
    const scalevSignature = req.headers.get("x-scalev-hmac-sha256");
    const url = new URL(req.url);
    const querySecret = url.searchParams.get("secret");
    const sourceLabel = url.searchParams.get("source_label") || null;

    let authorized = false;

    if (scalevSignature) {
      authorized = await verifyScalevSignature(rawBody, scalevSignature, PROVISION_SECRET);
      console.log("HMAC verification:", { authorized, receivedSignature: scalevSignature });
    } else if (querySecret) {
      authorized = querySecret === PROVISION_SECRET;
      console.log("Query param auth:", { authorized });
    } else {
      console.log("No auth method provided. Headers:", JSON.stringify(Object.fromEntries(req.headers.entries())));
    }

    if (!authorized) {
      // For Scalev test_event, try to parse and check if it's a test
      try {
        const testBody = JSON.parse(rawBody);
        if (testBody.event === "business.test_event") {
          console.log("Received Scalev test event, returning 200");
          return new Response(JSON.stringify({ ok: true, status: "test_event_received" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } catch { /* ignore parse errors */ }

      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return new Response(JSON.stringify({ ok: true, status: "invalid_json_ignored" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle Scalev test event (sent when saving webhook config)
    if (body.event === "business.test_event") {
      console.log("Received Scalev test event, returning 200");
      return new Response(JSON.stringify({ ok: true, status: "test_event_received" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Log full payload for debugging
    console.log("Full payload:", JSON.stringify(body));

    // Parse Scalev payload format
    const event = body.event;
    const data = body.data || body;

    const order_id = data.order_id || body.order_id;
    const payment_status = (data.payment_status || body.payment_status || "").toLowerCase();

    // Extract customer info from Scalev customer object, destination_address, or flat fields
    const customer = data.customer || {};
    const destination = data.destination_address || {};
    const name = customer.name || destination.name || data.name || body.name || "";
    const email = (customer.email || destination.email || data.email || body.email || "").toLowerCase();
    // Phone: check multiple locations in Scalev payload
    const pgCustomer = data.pg_payment_info?.customer || {};
    const phone = customer.phone || destination.phone || pgCustomer.mobile_number || data.phone || body.phone || "";

    console.log("Parsed fields:", { order_id, email, phone, name, payment_status, event });

    // Extract product info from orderlines if available
    let product_code = data.product_code || body.product_code || "LPE";
    if (data.orderlines && data.orderlines.length > 0) {
      // Could map product_name to product_code if needed
    }

    if (!email || !order_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email and order_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Skip if not paid
    if (payment_status !== "paid") {
      await supabaseAdmin.from("provision_logs").insert({
        order_id,
        email,
        status: "skipped",
        message: `event: ${event || "unknown"}, payment_status: ${payment_status}`,
      });
      return new Response(
        JSON.stringify({ ok: true, skipped: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check duplicate
    const { data: existingEntitlement } = await supabaseAdmin
      .from("entitlements")
      .select("id")
      .eq("order_id", order_id)
      .maybeSingle();

    if (existingEntitlement) {
      await supabaseAdmin.from("provision_logs").insert({
        order_id,
        email,
        status: "duplicate",
        message: "Entitlement already exists for this order_id",
      });
      return new Response(
        JSON.stringify({ ok: true, duplicate: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Find or create user
    let userId: string;
    const password = generatePassword(12);

    // Fetch all users with pagination (default limit is 50)
    let allAuthUsers: any[] = [];
    let page = 1;
    const perPage = 1000;
    while (true) {
      const { data: batch } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
      if (!batch?.users?.length) break;
      allAuthUsers = allAuthUsers.concat(batch.users);
      if (batch.users.length < perPage) break;
      page++;
    }
    const existingUser = allAuthUsers.find(
      (u: any) => u.email?.toLowerCase() === email
    );

    if (existingUser) {
      userId = existingUser.id;
      await supabaseAdmin.auth.admin.updateUserById(userId, { password });
    } else {
      const { data: newUser, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { name, phone },
        });

      if (createError || !newUser.user) {
        await supabaseAdmin.from("provision_logs").insert({
          order_id,
          email,
          status: "failed",
          message: `Failed to create user: ${createError?.message}`,
        });
        return new Response(
          JSON.stringify({ ok: false, error: createError?.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      userId = newUser.user.id;

      if (phone || name) {
        await supabaseAdmin
          .from("profiles")
          .update({ phone, name })
          .eq("user_id", userId);
      }
    }

    // Auto-upgrade: check for existing free tier entitlement
    const { data: existingFree } = await supabaseAdmin
      .from("entitlements")
      .select("id")
      .eq("user_id", userId)
      .eq("product_code", "LPE_FREE")
      .maybeSingle();

    if (existingFree) {
      // Upgrade from free to paid
      await supabaseAdmin
        .from("entitlements")
        .update({ product_code: product_code || "LPE", status: "active", order_id })
        .eq("id", existingFree.id);
    } else {
      // Create new entitlement
      const { error: entitlementError } = await supabaseAdmin
        .from("entitlements")
        .insert({
          user_id: userId,
          product_code: product_code || "LPE",
          status: "active",
          order_id,
        });

      if (entitlementError) {
        await supabaseAdmin.from("provision_logs").insert({
          order_id,
          email,
          status: "failed",
          message: `Failed to create entitlement: ${entitlementError.message}`,
        });
        return new Response(
          JSON.stringify({ ok: false, error: entitlementError.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Log success
    await supabaseAdmin.from("provision_logs").insert({
      order_id,
      email,
      status: "success",
      message: `User provisioned successfully. Phone: ${phone || "N/A"}`,
    });

    const APP_DOMAIN = (Deno.env.get("APP_DOMAIN") || "https://ai-page-craft-96.lovable.app").replace(/\/+$/, "");

    const messageTemplate = `Yeay! 🎉 Pembayaran berhasil,\n\nHalo kak ${name || ""} 🙌\nPembayaran kamu untuk Landing Page Engine sudah kami terima ✨\n\nAkses akun kamu di sini:\n👉 ${APP_DOMAIN}/login\n\nEmail: ${email}\nPassword: ${password}\n\n⚠️ Penting:\nPassword ini tidak bisa diubah, mohon disimpan dan dijaga dengan baik.`;

    // Send WhatsApp notification via WAHA
    const wahaApiUrl = Deno.env.get("WAHA_API_URL");
    const wahaApiKey = Deno.env.get("WAHA_API_KEY");
    const wahaSession = Deno.env.get("WAHA_SESSION_NAME");

    if (wahaApiUrl && wahaApiKey && wahaSession && phone) {
      try {
        // Format phone number: ensure it starts with country code, no +
        let chatId = phone.replace(/[^0-9]/g, "");
        if (!chatId.startsWith("62") && chatId.startsWith("0")) {
          chatId = "62" + chatId.substring(1);
        }
        chatId = chatId + "@c.us";

        const wahaResponse = await fetch(`${wahaApiUrl}/api/sendText`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": wahaApiKey,
          },
          body: JSON.stringify({
            session: wahaSession,
            chatId,
            text: messageTemplate,
          }),
        });

        const wahaResult = await wahaResponse.text();
        console.log("WAHA response:", wahaResponse.status, wahaResult);
      } catch (wahaError) {
        console.error("Failed to send WhatsApp notification:", wahaError.message);
        // Don't fail the provisioning if WhatsApp fails
      }
    } else {
      console.log("WhatsApp notification skipped:", {
        hasApiUrl: !!wahaApiUrl,
        hasApiKey: !!wahaApiKey,
        hasSession: !!wahaSession,
        hasPhone: !!phone,
      });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        login_url: `${APP_DOMAIN}/login`,
        email,
        password,
        message_template: messageTemplate,
        whatsapp_sent: !!(wahaApiUrl && wahaApiKey && wahaSession && phone),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
