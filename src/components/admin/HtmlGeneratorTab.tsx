import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, Eye, X, RefreshCw, CheckCircle2, Palette, Type, FileCode } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

const LANDING_HTML_URL = "/landing.html";

interface CustomizationConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  heroRating: string;
  solutionVideoUrl: string;
  pricingTitle: string;
  priceOriginal: string;
  priceStrike: string;
  priceFinal: string;
  voucherCode: string;
  pricingSavings: string;
  checkoutTitle: string;
  embedFormCode: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  footerText: string;
  pageTitle: string;
  metaDescription: string;
}

const defaultConfig: CustomizationConfig = {
  heroTitle: 'Bikin Landing Page <span class="text-gradient-primary">Professional</span><br>Cuma Modal Klik, Langsung Jadi ⚡',
  heroSubtitle: 'Gak perlu bayar developer jutaan. Gak perlu skill coding. <strong style="color:hsl(0 0% 95%)">Tinggal isi form → klik generate → landing page profesional langsung jadi.</strong> Siap dipasang iklan, siap closing.',
  heroCta: "Lihat Cara Kerjanya — Gampang Banget 👇",
  heroRating: "4.9/5 rating dari 100+ business owner Indonesia",
  solutionVideoUrl: "https://www.youtube.com/embed/LW12zGyz6BQ?autoplay=1&mute=1&loop=1&playlist=LW12zGyz6BQ&controls=0&showinfo=0&rel=0&modestbranding=1&disablekb=1&vq=hd1080",
  pricingTitle: "Sekali Bayar, Senjata Bisnis Lo Aktif Selamanya 💰",
  priceOriginal: "Rp 660.000",
  priceStrike: "Rp 299.000",
  priceFinal: "Rp 159.000",
  voucherCode: "DIGITOOLS",
  pricingSavings: "Rp 501.000",
  checkoutTitle: 'Amankan Akses Lo <span class="text-gradient-primary">Sekarang</span>',
  embedFormCode: "",
  primaryColor: "265 85% 60%",
  accentColor: "280 80% 65%",
  backgroundColor: "250 30% 5%",
  footerText: "© 2026 Landing Page Builder by Digital Strategi. All rights reserved.",
  pageTitle: "Landing Page Builder — Bikin LP Profesional Tanpa Coding",
  metaDescription: "Bikin landing page profesional dalam hitungan menit. Tanpa coding, tanpa bayar developer mahal.",
};

const HtmlGeneratorTab = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<CustomizationConfig>(defaultConfig);
  const [baseHtml, setBaseHtml] = useState("");
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetch(LANDING_HTML_URL)
      .then((r) => r.text())
      .then(setBaseHtml)
      .catch(() => toast({ title: "Error loading template", variant: "destructive" }));
  }, []);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("app_settings").select("*").eq("key", "embed_form_code").maybeSingle();
      if (data?.value) setConfig(prev => ({ ...prev, embedFormCode: data.value }));
    };
    const handleEmbedUpdated = () => load();
    load();
    window.addEventListener("admin-embed-updated", handleEmbedUpdated);
    return () => window.removeEventListener("admin-embed-updated", handleEmbedUpdated);
  }, []);

  const updateConfig = (key: keyof CustomizationConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const generateHtml = () => {
    if (!baseHtml) { toast({ title: "Template belum dimuat", variant: "destructive" }); return; }
    setGenerating(true);
    let html = baseHtml;

    html = html.replace(/<title>.*?<\/title>/, `<title>${config.pageTitle}</title>`);
    html = html.replace(/content="Bikin landing page profesional.*?"/, `content="${config.metaDescription}"`);

    if (config.primaryColor !== defaultConfig.primaryColor) html = html.replace(/265 85% 60%/g, config.primaryColor);
    if (config.accentColor !== defaultConfig.accentColor) html = html.replace(/280 80% 65%/g, config.accentColor);
    if (config.backgroundColor !== defaultConfig.backgroundColor) html = html.replace(/250 30% 5%/g, config.backgroundColor);

    html = html.replace(/Bikin Landing Page <span id="typing-text".*?<\/span>\s*<br>\s*Cuma Modal Klik, Langsung Jadi ⚡/s, config.heroTitle);
    html = html.replace(/Gak perlu bayar developer jutaan\..*?Siap dipasang iklan, siap closing\./s, config.heroSubtitle);
    html = html.replace(/Lihat Cara Kerjanya — Gampang Banget 👇/, config.heroCta);
    html = html.replace(/4\.9\/5 rating dari 100\+ business owner Indonesia/, config.heroRating);

    if (config.solutionVideoUrl !== defaultConfig.solutionVideoUrl) {
      const defaultVideoId = 'LW12zGyz6BQ';
      const newUrlMatch = config.solutionVideoUrl.match(/embed\/([^?/]+)/);
      const newVideoId = newUrlMatch ? newUrlMatch[1] : defaultVideoId;
      html = html.replace(/https:\/\/www\.youtube\.com\/embed\/LW12zGyz6BQ[^'"']*/g, config.solutionVideoUrl);
      html = html.replace(/https:\/\/img\.youtube\.com\/vi\/LW12zGyz6BQ/g, `https://img.youtube.com/vi/${newVideoId}`);
      html = html.replace(new RegExp(`playlist=${defaultVideoId}`, 'g'), `playlist=${newVideoId}`);
    }

    html = html.replace(/Rp 660\.000/g, config.priceOriginal);
    html = html.replace(/Rp 299\.000/g, config.priceStrike);
    html = html.replace(/Rp 159\.000/g, config.priceFinal);
    html = html.replace(/Rp 501\.000/g, config.pricingSavings);
    html = html.replace(/"DIGITOOLS"/g, `"${config.voucherCode}"`);
    html = html.replace(/DIGITOOLS/g, config.voucherCode);

    if (config.embedFormCode.trim()) {
      const embedCode = config.embedFormCode.trim();
      html = html.replace(/<iframe id="scalev-checkout"[^>]*>[\s\S]*?<\/iframe>/, `<div id="checkout-embed-root" style="width:100%;min-height:1800px;border:0;border-radius:1rem;background:transparent;overflow:hidden">${embedCode}</div>`);
      html = html.replace(/<script>\s*\(function\(\)\{\s*var iframe=document\.getElementById\('scalev-checkout'\)[\s\S]*?\}\)\(\);\s*<\/script>/, `<style id="checkout-embed-style">#checkout-embed-root iframe{width:100%!important;min-height:1800px!important;border:0!important;overflow:hidden!important;display:block!important;filter:invert(1) hue-rotate(180deg) saturate(1.65) brightness(1.15) contrast(1.1)!important}</style>`);
    }

    html = html.replace(/© 2026 Landing Page Builder by Digital Strategi\. All rights reserved\./, config.footerText);

    setGeneratedHtml(html);
    setGenerating(false);
    toast({ title: "✅ HTML berhasil di-generate!" });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedHtml);
      setCopied(true);
      toast({ title: "✅ HTML berhasil dicopy ke clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    } catch { toast({ title: "Gagal copy", variant: "destructive" }); }
  };

  const downloadHtml = () => {
    const blob = new Blob([generatedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "landing-page.html"; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "✅ File HTML berhasil didownload!" });
  };

  useEffect(() => {
    if (!showPreview || !iframeRef.current || !generatedHtml) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    doc.open(); doc.write(generatedHtml); doc.close();
  }, [showPreview, generatedHtml]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-lg md:text-xl mb-1">Generate HTML</h2>
        <p className="text-sm text-muted-foreground">Customize konten landing page, lalu generate HTML siap pakai.</p>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="w-full grid grid-cols-3 h-10">
          <TabsTrigger value="content" className="text-xs gap-1.5"><Type className="w-3 h-3" /> Konten</TabsTrigger>
          <TabsTrigger value="pricing" className="text-xs gap-1.5"><FileCode className="w-3 h-3" /> Harga & CTA</TabsTrigger>
          <TabsTrigger value="style" className="text-xs gap-1.5"><Palette className="w-3 h-3" /> Style & Meta</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">🚀 Hero Section</h3>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Judul Hero (HTML)</label>
                <Textarea value={config.heroTitle} onChange={(e) => updateConfig("heroTitle", e.target.value)} rows={3} className="font-mono text-xs" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Subtitle Hero (HTML)</label>
                <Textarea value={config.heroSubtitle} onChange={(e) => updateConfig("heroSubtitle", e.target.value)} rows={3} className="font-mono text-xs" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Tombol CTA</label>
                  <Input value={config.heroCta} onChange={(e) => updateConfig("heroCta", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Rating Text</label>
                  <Input value={config.heroRating} onChange={(e) => updateConfig("heroRating", e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">🎬 Solution Video</h3>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">YouTube Embed URL</label>
                <Input value={config.solutionVideoUrl} onChange={(e) => updateConfig("solutionVideoUrl", e.target.value)} className="text-xs font-mono" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">💳 Embed Form Checkout</h3>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Kode HTML Embed</label>
                <Textarea value={config.embedFormCode} onChange={(e) => updateConfig("embedFormCode", e.target.value)} rows={5} className="font-mono text-xs" placeholder="Kosongkan untuk pakai default Scalev iframe" />
              </div>
              <p className="text-xs text-muted-foreground">💡 Kosongkan jika ingin pakai Scalev checkout bawaan.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">💰 Pricing</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground mb-1 block">Harga Normal</label><Input value={config.priceOriginal} onChange={(e) => updateConfig("priceOriginal", e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground mb-1 block">Harga Coret</label><Input value={config.priceStrike} onChange={(e) => updateConfig("priceStrike", e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground mb-1 block">Harga Final</label><Input value={config.priceFinal} onChange={(e) => updateConfig("priceFinal", e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground mb-1 block">Total Savings</label><Input value={config.pricingSavings} onChange={(e) => updateConfig("pricingSavings", e.target.value)} /></div>
              </div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Kode Voucher</label><Input value={config.voucherCode} onChange={(e) => updateConfig("voucherCode", e.target.value)} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="style" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">🎨 Warna (HSL)</h3>
              <p className="text-xs text-muted-foreground">Format: "hue saturation% lightness%"</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div><label className="text-xs text-muted-foreground mb-1 block">Primary</label><Input value={config.primaryColor} onChange={(e) => updateConfig("primaryColor", e.target.value)} className="font-mono text-xs" /></div>
                <div><label className="text-xs text-muted-foreground mb-1 block">Accent</label><Input value={config.accentColor} onChange={(e) => updateConfig("accentColor", e.target.value)} className="font-mono text-xs" /></div>
                <div><label className="text-xs text-muted-foreground mb-1 block">Background</label><Input value={config.backgroundColor} onChange={(e) => updateConfig("backgroundColor", e.target.value)} className="font-mono text-xs" /></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">📋 Meta & Branding</h3>
              <div><label className="text-xs text-muted-foreground mb-1 block">Page Title</label><Input value={config.pageTitle} onChange={(e) => updateConfig("pageTitle", e.target.value)} /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Meta Description</label><Textarea value={config.metaDescription} onChange={(e) => updateConfig("metaDescription", e.target.value)} rows={2} className="text-xs" /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Footer Text</label><Input value={config.footerText} onChange={(e) => updateConfig("footerText", e.target.value)} /></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button onClick={generateHtml} className="w-full h-12 text-base gap-2" disabled={generating || !baseHtml}>
        {generating ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        Generate HTML
      </Button>

      {generatedHtml && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-sm">HTML Siap!</span>
                <span className="text-xs text-muted-foreground">({(generatedHtml.length / 1024).toFixed(1)} KB)</span>
              </div>
              <Button onClick={() => setShowPreview(!showPreview)} size="sm" variant="outline" className="gap-1.5">
                {showPreview ? <X className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />} Preview
              </Button>
            </div>

            <div className="flex gap-2">
              <Button onClick={copyToClipboard} className="flex-1 gap-1.5" variant={copied ? "outline" : "default"}>
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Tercopy!" : "Copy HTML"}
              </Button>
              <Button onClick={downloadHtml} className="flex-1 gap-1.5" variant="outline">
                <Download className="w-3.5 h-3.5" /> Download .html
              </Button>
            </div>

            {showPreview && (
              <div className="rounded-xl overflow-hidden border border-border">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/30">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                  </div>
                  <span className="text-[10px] text-muted-foreground">Preview Generated HTML</span>
                </div>
                <iframe ref={iframeRef} className="w-full border-0" style={{ height: "500px" }} title="Generated Preview" />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HtmlGeneratorTab;
