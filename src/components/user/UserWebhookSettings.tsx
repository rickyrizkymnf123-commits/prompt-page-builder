import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { KeyRound, Copy, Eye, EyeOff, ExternalLink, Check, UserPlus } from "lucide-react";

interface UserWebhookSettingsProps {
  userId: string;
  userEmail: string;
}

export default function UserWebhookSettings({ userId, userEmail }: UserWebhookSettingsProps) {
  const { toast } = useToast();
  const [secret, setSecret] = useState("");
  const [label, setLabel] = useState("");
  const [savedSecret, setSavedSecret] = useState<{ secret: string; label: string } | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedAffiliate, setCopiedAffiliate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [affiliateLink, setAffiliateLink] = useState("");

  const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gateway-provision`;

  // Load existing secret + affiliate link
  useEffect(() => {
    const load = async () => {
      const [secretRes, settingsRes] = await Promise.all([
        supabase.from("user_signing_secrets").select("*").eq("user_id", userId).maybeSingle(),
        supabase.from("app_settings").select("key,value").eq("key", "affiliate_link").maybeSingle(),
      ]);
      if (secretRes.data) {
        setSavedSecret({ secret: (secretRes.data as any).secret, label: (secretRes.data as any).label || "" });
        setSecret((secretRes.data as any).secret);
        setLabel((secretRes.data as any).label || "");
      }
      if (settingsRes.data) {
        setAffiliateLink((settingsRes.data as any).value || "");
      }
      setLoading(false);
    };
    load();
  }, [userId]);

  const handleSave = async () => {
    if (!secret.trim()) {
      toast({ title: "Error", description: "Signing secret tidak boleh kosong.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const labelValue = label.trim() || userEmail;
    const { error } = await supabase
      .from("user_signing_secrets")
      .upsert(
        { user_id: userId, secret: secret.trim(), label: labelValue, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
    if (error) {
      toast({ title: "Gagal menyimpan", description: error.message, variant: "destructive" });
    } else {
      setSavedSecret({ secret: secret.trim(), label: labelValue });
      toast({ title: "✅ Signing secret berhasil disimpan!" });
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Yakin hapus signing secret?")) return;
    await supabase.from("user_signing_secrets").delete().eq("user_id", userId);
    setSavedSecret(null);
    setSecret("");
    setLabel("");
    toast({ title: "🗑 Signing secret dihapus." });
  };

  const copyWebhookUrl = async () => {
    await navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast({ title: "📋 Webhook URL disalin!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const copyAffiliateLink = async () => {
    await navigator.clipboard.writeText(affiliateLink);
    setCopiedAffiliate(true);
    toast({ title: "📋 Link undangan disalin!" });
    setTimeout(() => setCopiedAffiliate(false), 2000);
  };

  if (loading) return <div className="text-center text-muted-foreground text-sm py-8">Memuat...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-lg md:text-xl mb-1 flex items-center gap-2"><KeyRound className="w-5 h-5" /> Webhook Settings</h2>
        <p className="text-sm text-muted-foreground">Konfigurasi webhook untuk menerima notifikasi dari Scalev.</p>
      </div>

      {/* Webhook URL */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">🔗 Webhook URL</h3>
          <p className="text-xs text-muted-foreground">Gunakan URL ini di pengaturan webhook Scalev kamu. Subscribe ke event: <code className="bg-muted px-1 rounded">order.payment_status_changed</code></p>
          <div className="flex gap-2">
            <Input value={webhookUrl} readOnly className="font-mono text-xs flex-1" />
            <Button size="sm" variant="outline" className="gap-1 shrink-0" onClick={copyWebhookUrl}>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Disalin!" : "Copy"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Undangan Produk / Affiliate Link */}
      {affiliateLink && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2"><UserPlus className="w-4 h-4" /> Undangan Produk (Affiliate)</h3>
            <p className="text-xs text-muted-foreground">Klik link di bawah untuk mengajukan kolaborasi dan menjual produk ini sebagai partner/affiliate.</p>
            <div className="flex gap-2">
              <Input value={affiliateLink} readOnly className="text-xs flex-1" />
              <Button size="sm" variant="outline" className="gap-1 shrink-0" onClick={copyAffiliateLink}>
                {copiedAffiliate ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedAffiliate ? "Disalin!" : "Copy"}
              </Button>
              <Button size="sm" variant="outline" className="gap-1 shrink-0" asChild>
                <a href={affiliateLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5" /> Buka
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Signing Secret */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">🔐 Signing Secret</h3>
          <p className="text-xs text-muted-foreground">Masukkan Signing Secret dari pengaturan webhook di dashboard Scalev kamu. Secret ini digunakan untuk memverifikasi keaslian webhook yang diterima.</p>
          
          {savedSecret ? (
            <div className="space-y-3">
              <div className="rounded-lg bg-secondary border border-border p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-foreground">{savedSecret.label}</p>
                  <button type="button" onClick={() => setShowSecret(!showSecret)} className="text-xs text-primary hover:underline flex items-center gap-1">
                    {showSecret ? <><EyeOff className="h-3 w-3" /> Sembunyikan</> : <><Eye className="h-3 w-3" /> Tampilkan</>}
                  </button>
                </div>
                <p className="text-xs font-mono text-muted-foreground">
                  {showSecret ? savedSecret.secret : "••••••••" + savedSecret.secret.slice(-6)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { setSavedSecret(null); }} className="text-xs">
                  ✏️ Edit Secret
                </Button>
                <Button size="sm" variant="outline" onClick={handleDelete} className="text-xs text-destructive hover:bg-destructive/10">
                  🗑 Hapus
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Label (opsional)</label>
                <Input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder={userEmail}
                  className="text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Signing Secret *</label>
                <Input
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Paste signing secret dari Scalev..."
                  className="font-mono text-xs"
                  type={showSecret ? "text" : "password"}
                />
                <button type="button" onClick={() => setShowSecret(!showSecret)} className="text-[10px] text-primary hover:underline mt-1 flex items-center gap-1">
                  {showSecret ? <><EyeOff className="h-2.5 w-2.5" /> Sembunyikan</> : <><Eye className="h-2.5 w-2.5" /> Tampilkan</>}
                </button>
              </div>
              <Button size="sm" onClick={handleSave} disabled={saving || !secret.trim()} className="gap-1">
                {saving ? "Menyimpan..." : "💾 Simpan Secret"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Guide */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">📖 Cara Setup</h3>
          <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Login ke dashboard Scalev kamu</li>
            <li>Buka <strong>Settings → Webhooks</strong></li>
            <li>Klik <strong>"Add Webhook"</strong></li>
            <li>Paste <strong>Webhook URL</strong> dari atas</li>
            <li>Subscribe ke event: <code className="bg-muted px-1 rounded">order.payment_status_changed</code></li>
            <li>Copy <strong>Signing Secret</strong> yang diberikan Scalev</li>
            <li>Paste signing secret di form di atas dan klik Simpan</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
