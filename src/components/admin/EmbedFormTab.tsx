import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye, X, Code2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const EmbedFormTab = () => {
  const { toast } = useToast();
  const [embedCode, setEmbedCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("app_settings").select("*").eq("key", "embed_form_code").maybeSingle();
      if (data?.value) setEmbedCode(data.value);
      setLoaded(true);
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await supabase.from("app_settings").update({ value: embedCode }).eq("key", "embed_form_code");
      window.dispatchEvent(new CustomEvent("admin-embed-updated", { detail: embedCode }));
      toast({ title: "✅ Berhasil", description: "Embed code tersimpan" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!showPreview || !iframeRef.current || !embedCode) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;background:hsl(250 30% 5%);overflow:hidden}[data-preview-embed-root],iframe{width:100%!important}iframe{min-height:1800px!important;border:0!important;overflow:hidden!important;display:block!important;filter:invert(1) hue-rotate(180deg) saturate(1.65) brightness(1.15) contrast(1.1)!important}[data-preview-embed-root],[data-preview-embed-root] *:not(input):not(textarea):not(select):not(option):not(button){color:hsl(0 0% 95%)!important}</style></head><body><div data-preview-embed-root>${embedCode}</div></body></html>`);
    doc.close();
  }, [showPreview, embedCode]);

  if (!loaded) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-lg md:text-xl mb-1">Embed Form Checkout</h2>
        <p className="text-sm text-muted-foreground">Paste kode HTML embed form pembayaran (iframe/script) yang akan tampil di section checkout landing page.</p>
      </div>

      <Card>
        <CardContent className="p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Code2 className="w-3.5 h-3.5" />
            <span>HTML / Embed Code</span>
          </div>
          <Textarea
            value={embedCode}
            onChange={(e) => setEmbedCode(e.target.value)}
            placeholder='<iframe src="https://..." ...></iframe>'
            rows={8}
            className="font-mono text-xs"
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={save} disabled={saving} size="sm" className="gap-1.5">
              {saving ? <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Simpan
            </Button>
            <Button onClick={() => setShowPreview(!showPreview)} size="sm" variant="outline" disabled={!embedCode.trim()} className="gap-1.5">
              {showPreview ? <X className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showPreview ? "Tutup Preview" : "Preview"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPreview && (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              </div>
              <span className="text-xs text-muted-foreground">Live Preview</span>
            </div>
            <button onClick={() => setShowPreview(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <iframe ref={iframeRef} className="w-full border-0" style={{ minHeight: "1800px" }} title="Embed Preview" />
        </Card>
      )}

      <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground">
          Embed code ini akan otomatis dipakai di section checkout landing page dan juga saat Generate HTML.
        </p>
      </div>
    </div>
  );
};

export default EmbedFormTab;
