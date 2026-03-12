import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Product display names for WA messages
const PRODUCT_NAMES: Record<string, string> = {
  LPE: "Landing Page Engine",
  SWA: "Ebook Builder V2",
  PEA: "Property Enhancer AI",
};

function formatPhone(phone: string): string {
  let cleaned = phone.replace(/[^\d]/g, "");
  if (cleaned.startsWith("08")) {
    cleaned = "62" + cleaned.slice(1);
  }
  if (!cleaned.endsWith("@c.us")) {
    cleaned = cleaned + "@c.us";
  }
  return cleaned;
}

async function sendWhatsAppReminder(
  phone: string,
  name: string,
  productName: string,
  checkoutUrl: string,
  isFollowUp: boolean
): Promise<boolean> {
  const wahaUrl = Deno.env.get("WAHA_API_URL");
  const wahaKey = Deno.env.get("WAHA_API_KEY");
  const wahaSession = Deno.env.get("WAHA_SESSION_NAME") || "default";

  if (!wahaUrl || !wahaKey || !phone) return false;

  const formattedPhone = formatPhone(phone);
  const firstName = name?.split(" ")[0] || "Kak";

  let message: string;
  if (isFollowUp) {
    message = `Halo kak ${firstName} 🙌\n\nKami lihat pesanan kamu untuk ${productName} belum diselesaikan pembayarannya nih.\n\nYuk segera selesaikan pembayaran sebelum link expired:\n👉 ${checkoutUrl}\n\nKalau ada kendala, silakan hubungi kami ya! 😊`;
  } else {
    message = `Halo kak ${firstName} 🙌\n\nTerima kasih sudah order ${productName}! 🎉\n\nPesanan kamu sudah kami terima, tinggal selesaikan pembayaran ya:\n👉 ${checkoutUrl}\n\nSegera bayar supaya akun kamu langsung aktif ✨`;
  }

  try {
    const res = await fetch(`${wahaUrl}/api/sendText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": wahaKey,
      },
      body: JSON.stringify({
        session: wahaSession,
        chatId: formattedPhone,
        text: message,
      }),
    });
    console.log("WA reminder response:", res.status);
    return res.ok || res.status === 201;
  } catch (e) {
    console.error("WA reminder error:", e);
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  // CRON MODE: called by pg_cron to send follow-up reminders
  if (req.method === "POST") {
    let body: any = {};
    try {
      body = await req.json();
    } catch { /* empty body for cron */ }

    // Mode 1: Immediate reminder (called by gateway)
    if (body.action === "immediate") {
      const { order_id, email, name, phone, product_code, checkout_url } = body;
      const productName = PRODUCT_NAMES[product_code] || product_code;

      // Save to pending_payments
      const { error: insertErr } = await supabase.from("pending_payments").upsert({
        order_id,
        email,
        name,
        phone,
        product_code,
        checkout_url,
        payment_status: "unpaid",
        reminder_count: 1,
        last_reminder_at: new Date().toISOString(),
      }, { onConflict: "order_id" });

      if (insertErr) console.error("Insert pending_payment error:", insertErr);

      // Send immediate WA
      const sent = await sendWhatsAppReminder(phone, name, productName, checkout_url, false);

      return new Response(
        JSON.stringify({ ok: true, wa_sent: sent, order_id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mode 2: Mark as paid (called by gateway when payment confirmed)
    if (body.action === "mark_paid") {
      const { order_id } = body;
      await supabase.from("pending_payments")
        .update({ payment_status: "paid" })
        .eq("order_id", order_id);

      return new Response(
        JSON.stringify({ ok: true, marked: "paid" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mode 3: Cron follow-up — find unpaid orders older than 1 hour, max 3 reminders
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: pendingOrders, error: fetchErr } = await supabase
      .from("pending_payments")
      .select("*")
      .eq("payment_status", "unpaid")
      .lt("last_reminder_at", oneHourAgo)
      .lt("reminder_count", 3)
      .order("created_at", { ascending: true })
      .limit(20);

    if (fetchErr) {
      console.error("Fetch pending error:", fetchErr);
      return new Response(
        JSON.stringify({ ok: false, error: fetchErr.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let sentCount = 0;
    for (const order of pendingOrders || []) {
      const productName = PRODUCT_NAMES[order.product_code] || order.product_code;
      const sent = await sendWhatsAppReminder(
        order.phone || "",
        order.name || "",
        productName,
        order.checkout_url || "",
        true
      );

      if (sent) {
        await supabase.from("pending_payments")
          .update({
            reminder_count: order.reminder_count + 1,
            last_reminder_at: new Date().toISOString(),
          })
          .eq("id", order.id);
        sentCount++;
      }
    }

    // Auto-expire orders older than 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    await supabase.from("pending_payments")
      .update({ payment_status: "expired" })
      .eq("payment_status", "unpaid")
      .lt("created_at", twentyFourHoursAgo);

    return new Response(
      JSON.stringify({ ok: true, reminders_sent: sentCount, checked: pendingOrders?.length || 0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify({ ok: true, status: "ready" }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
