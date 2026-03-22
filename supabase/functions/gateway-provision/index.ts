import { encode as base64Encode } from "https://deno.land/std@0.208.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-scalev-hmac-sha256",
};

// Route mapping: product_code → provision endpoint URL
// Add new products here. Use env vars for external project URLs.
// ALLOWLIST: Only these product codes are active. Others are silently rejected.
const ALLOWED_PRODUCTS = new Set(["LPE", "SWA", "PEA"]);

function getRoutes(): Record<string, string> {
  return {
    // LPE is handled locally (this project)
    LPE: "LOCAL",
    // External projects
    ...(Deno.env.get("ROUTE_SWA_URL") ? { SWA: Deno.env.get("ROUTE_SWA_URL")! } : {}),
    ...(Deno.env.get("ROUTE_PEA_URL") ? { PEA: Deno.env.get("ROUTE_PEA_URL")! } : {}),
  };
}

async function verifyScalevSignature(
  rawBody: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
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
  } catch {
    return false;
  }
}

interface SecretEntry {
  secret: string;
  label: string;
}

async function getAllSigningSecrets(): Promise<SecretEntry[]> {
  const secrets: SecretEntry[] = [];
  
  // Primary secret from env
  const primary = Deno.env.get("PROVISION_SECRET");
  if (primary) secrets.push({ secret: primary, label: "Primary" });
  
  // Additional secrets from app_settings (webhook_signing_secrets)
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const res = await fetch(
      `${supabaseUrl}/rest/v1/app_settings?key=eq.webhook_signing_secrets&select=value`,
      { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
    );
    if (res.ok) {
      const rows = await res.json();
      if (rows?.[0]?.value) {
        const parsed = JSON.parse(rows[0].value);
        if (Array.isArray(parsed)) {
          for (const entry of parsed) {
            const s = typeof entry === "string" ? entry : entry?.secret;
            const l = typeof entry === "string" ? "Partner" : (entry?.label || "Partner");
            if (s && !secrets.some(e => e.secret === s)) secrets.push({ secret: s, label: l });
          }
        }
      }
    }
  } catch (e) {
    console.error("Failed to fetch additional signing secrets:", e);
  }
  
  return secrets;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Health check
  if (req.method === "GET") {
    const routes = getRoutes();
    return new Response(
      JSON.stringify({
        ok: true,
        status: "gateway_ready",
        registered_products: Object.keys(routes),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const rawBody = await req.text();

    // Handle empty body (ping)
    if (!rawBody || rawBody.trim() === "") {
      return new Response(
        JSON.stringify({ ok: true, status: "ping_received" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const signingSecrets = await getAllSigningSecrets();
    if (signingSecrets.length === 0) {
      return new Response(JSON.stringify({ error: "Server misconfigured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify HMAC against ALL signing secrets or query param
    const scalevSignature = req.headers.get("x-scalev-hmac-sha256");
    const url = new URL(req.url);
    const querySecret = url.searchParams.get("secret");

    let authorized = false;
    let matchedSecret = "";
    if (scalevSignature) {
      for (const secret of signingSecrets) {
        if (await verifyScalevSignature(rawBody, scalevSignature, secret)) {
          authorized = true;
          matchedSecret = secret;
          break;
        }
      }
    } else if (querySecret) {
      authorized = signingSecrets.includes(querySecret);
      if (authorized) matchedSecret = querySecret;
    }

    // Allow test events without auth
    if (!authorized) {
      try {
        const testBody = JSON.parse(rawBody);
        if (testBody.event === "business.test_event") {
          return new Response(
            JSON.stringify({ ok: true, status: "test_event_received" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } catch { /* ignore */ }

      console.error("HMAC verification failed. Tried", signingSecrets.length, "secrets.");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return new Response(
        JSON.stringify({ ok: true, status: "invalid_json_ignored" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle test event
    if (body.event === "business.test_event") {
      return new Response(
        JSON.stringify({ ok: true, status: "test_event_received" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine product_code from multiple sources
    const data = body.data || body;
    let product_code = "";

    // 1. Check query parameter ?product=SWA (highest priority)
    const queryProduct = url.searchParams.get("product");
    if (queryProduct) {
      product_code = queryProduct.toUpperCase();
    }

    // 2. Check explicit product_code in payload
    if (!product_code) {
      product_code = data.product_code || body.product_code || "";
    }

    // 3. Try to detect from orderlines product name
    if (!product_code && data.orderlines && data.orderlines.length > 0) {
      const productName = (data.orderlines[0].product_name || "").toUpperCase();
      if (productName.includes("LANDING PAGE") || productName.includes("LPE")) product_code = "LPE";
      else if (productName.includes("STORY WEAVER") || productName.includes("SWA") || productName.includes("EBOOK")) product_code = "SWA";
      else if (productName.includes("PROPERTY") || productName.includes("PEA")) product_code = "PEA";
    }

    // 4. Slug mapping from SCALEV_SLUG_MAP (env var + app_settings DB)
    if (!product_code && data.metadata?.event_source_url) {
      const sourceUrl = data.metadata.event_source_url;
      // Extract slug from URL (last path segment)
      const slug = sourceUrl.split("/").filter(Boolean).pop() || "";
      
      // Build combined slug map from env var AND database
      const combinedSlugMap: Record<string, string> = {};
      
      // Source 1: env var (legacy)
      const slugMapRaw = Deno.env.get("SCALEV_SLUG_MAP");
      if (slugMapRaw) {
        try {
          const envMap = JSON.parse(slugMapRaw);
          Object.assign(combinedSlugMap, envMap);
        } catch { /* ignore */ }
      }
      
      // Source 2: app_settings table (managed via dashboard)
      try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const res = await fetch(
          `${supabaseUrl}/rest/v1/app_settings?key=eq.scalev_slug_map&select=value`,
          { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
        );
        if (res.ok) {
          const rows = await res.json();
          if (rows?.[0]?.value) {
            const parsed = JSON.parse(rows[0].value);
            // Format: [{ slug: "anaksehat", product_code: "LPE" }, ...]
            if (Array.isArray(parsed)) {
              for (const entry of parsed) {
                if (entry.slug && entry.product_code) {
                  combinedSlugMap[entry.slug] = entry.product_code;
                }
              }
            }
          }
        }
      } catch (e) {
        console.error("Failed to fetch slug map from DB:", e);
      }
      
      // Match slug against combined map
      if (combinedSlugMap[slug]) {
        product_code = combinedSlugMap[slug];
      } else {
        // Check if any key is contained in the full URL
        for (const [key, code] of Object.entries(combinedSlugMap)) {
          if (sourceUrl.toLowerCase().includes(key.toLowerCase())) {
            product_code = code;
            break;
          }
        }
      }

      // Fallback: keyword detection from URL (only allowed products)
      if (!product_code) {
        const lower = sourceUrl.toLowerCase();
        if (lower.includes("landing-page") || lower.includes("lpe")) product_code = "LPE";
        else if (lower.includes("story-weaver") || lower.includes("swa") || lower.includes("ebook")) product_code = "SWA";
        else if (lower.includes("property") || lower.includes("pea")) product_code = "PEA";
      }
    }

    // If no product_code detected, DO NOT default to LPE — return error
    // This prevents wrong project from processing the order and sending WA notifications
    if (!product_code) {
      const sourceUrl = data.metadata?.event_source_url || "unknown";
      const slug = sourceUrl.split("/").filter(Boolean).pop() || "unknown";
      console.error(`Cannot determine product_code. Slug: ${slug}, URL: ${sourceUrl}`);
      console.error("Add this slug to SCALEV_SLUG_MAP env var to fix routing.");
      return new Response(
        JSON.stringify({
          ok: false,
          error: `Cannot determine product for slug: ${slug}. Add it to SCALEV_SLUG_MAP.`,
          source_url: sourceUrl,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // ALLOWLIST CHECK: reject any product not in the active list
    if (!ALLOWED_PRODUCTS.has(product_code)) {
      console.log(`Product ${product_code} is not in allowlist. Ignoring silently.`);
      return new Response(
        JSON.stringify({
          ok: true,
          status: "ignored",
          reason: `Product ${product_code} is not active. Only ${[...ALLOWED_PRODUCTS].join(", ")} are allowed.`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payment_status = data.payment_status || "";
    const checkoutUrl = data.metadata?.event_source_url || "";
    const customerName = data.customer?.name || data.destination_address?.name || "";
    const customerEmail = data.customer?.email || data.destination_address?.email || "";
    const customerPhone = data.customer?.phone || data.destination_address?.phone || "";

    console.log("Gateway routing:", { product_code, payment_status, slug: checkoutUrl, event: body.event });

    // UNPAID HANDLER: send payment reminder instead of provisioning
    if (payment_status === "unpaid") {
      console.log(`Unpaid order detected for ${product_code}. Sending payment reminder.`);
      const reminderUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/payment-reminder`;
      try {
        const reminderRes = await fetch(reminderUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify({
            action: "immediate",
            order_id: data.order_id || body.order_id || `ORDER_${Date.now()}`,
            email: customerEmail,
            name: customerName,
            phone: customerPhone,
            product_code,
            checkout_url: checkoutUrl,
          }),
        });
        const reminderResult = await reminderRes.json();
        console.log("Reminder result:", reminderResult);
        return new Response(
          JSON.stringify({ ok: true, status: "unpaid_reminder_sent", ...reminderResult }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (e) {
        console.error("Reminder error:", e);
        return new Response(
          JSON.stringify({ ok: false, error: "Failed to send reminder" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // PAID HANDLER: mark pending payment as paid, then continue to provision
    if (payment_status === "paid") {
      // Non-blocking: mark as paid in pending_payments
      try {
        const reminderUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/payment-reminder`;
        fetch(reminderUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify({
            action: "mark_paid",
            order_id: data.order_id || body.order_id || "",
          }),
        }).catch(() => {}); // fire-and-forget
      } catch { /* ignore */ }
    }

    const routes = getRoutes();
    const targetUrl = routes[product_code];

    if (!targetUrl) {
      console.error(`No route configured for product_code: ${product_code}`);
      return new Response(
        JSON.stringify({
          error: `No route configured for product: ${product_code}`,
          registered_products: Object.keys(routes),
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // LOCAL = process in this project's provision function
    if (targetUrl === "LOCAL") {
      const provisionSecret = Deno.env.get("PROVISION_SECRET") || matchedSecret;
      const localUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/provision?secret=${encodeURIComponent(provisionSecret)}`;
      console.log("Routing to LOCAL provision (using query secret)");

      const forwardResponse = await fetch(localUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: rawBody,
      });

      const forwardResult = await forwardResponse.text();
      return new Response(forwardResult, {
        status: forwardResponse.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // EXTERNAL = forward to another project's provision endpoint
    console.log(`Routing to EXTERNAL ${product_code}:`, targetUrl);

    // Get the secret for the target project (each project can have its own)
    const targetSecret = Deno.env.get(`ROUTE_${product_code}_SECRET`) || Deno.env.get("PROVISION_SECRET") || "";

    // Re-sign the body with the target project's secret
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(targetSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
    const newSignature = base64Encode(new Uint8Array(signed));

    const forwardResponse = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-scalev-hmac-sha256": newSignature,
      },
      body: rawBody,
    });

    const forwardResult = await forwardResponse.text();
    console.log(`Forward response from ${product_code}:`, forwardResponse.status, forwardResult);

    return new Response(forwardResult, {
      status: forwardResponse.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Gateway error:", error);
    return new Response(
      JSON.stringify({ ok: false, error: (error as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
