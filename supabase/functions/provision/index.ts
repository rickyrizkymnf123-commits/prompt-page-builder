import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { secret, order_id, name, email, phone, product_code, payment_status } = body;

    const PROVISION_SECRET = Deno.env.get("PROVISION_SECRET");
    if (!PROVISION_SECRET || secret !== PROVISION_SECRET) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Skip if not PAID
    if (payment_status !== "PAID") {
      await supabaseAdmin.from("provision_logs").insert({
        order_id,
        email,
        status: "skipped",
        message: `payment_status: ${payment_status}`,
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

    // Check if user exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      userId = existingUser.id;
      // Update password for existing user
      await supabaseAdmin.auth.admin.updateUserById(userId, { password });
    } else {
      // Create new user
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

      // Update profile with phone
      if (phone) {
        await supabaseAdmin
          .from("profiles")
          .update({ phone, name })
          .eq("user_id", userId);
      }
    }

    // Create entitlement
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

    // Log success
    await supabaseAdmin.from("provision_logs").insert({
      order_id,
      email,
      status: "success",
      message: `User provisioned successfully. Phone: ${phone || "N/A"}`,
    });

    const APP_DOMAIN = "https://ai-page-craft-96.lovable.app";

    const messageTemplate = `Yeay! 🎉 Pembayaran berhasil,\n\nHalo kak ${name || ""} 🙌\nPembayaran kamu untuk Landing Page Engine sudah kami terima ✨\n\nAkses akun kamu di sini:\n👉 ${APP_DOMAIN}/login\n\nEmail: ${email}\nPassword: ${password}\n\n⚠️ Penting:\nPassword ini tidak bisa diubah, mohon disimpan dan dijaga dengan baik.\n`;

    return new Response(
      JSON.stringify({
        ok: true,
        login_url: `${APP_DOMAIN}/login`,
        email,
        password,
        message_template: messageTemplate,
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
