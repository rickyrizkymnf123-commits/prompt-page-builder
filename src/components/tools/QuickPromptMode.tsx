import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FormState, initialFormState } from '@/types/form';
import { Zap, Sparkles, Wand2, RefreshCw, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  onApplyQuickForm: (form: FormState) => void;
}

export function QuickPromptMode({ onApplyQuickForm }: Props) {
  const [quickInput, setQuickInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<FormState | null>(null);
  const { toast } = useToast();

  const handleSmartGenerate = () => {
    if (!quickInput.trim() || quickInput.trim().length < 15) {
      toast({
        title: 'Instruksi Terlalu Pendek',
        description: 'Tuliskan minimal 1 kalimat deskripsi produk Anda (misal nama produk, harga, dan keunggulan).',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const text = quickInput.toLowerCase();

      // Smart extraction heuristics
      let nama = 'Produk Spesial Unggulan';
      const nameMatch = quickInput.match(/(?:merk|nama|brand|produk|jualan)\s+([A-Za-z0-9\s\-]+?)(?:,|\.|\s+harga|\s+untuk|\s+seharga)/i);
      if (nameMatch && nameMatch[1]) {
        nama = nameMatch[1].trim();
      } else {
        const words = quickInput.split(' ').slice(0, 4).join(' ');
        nama = words.replace(/^(saya|jualan|mau|bikin|landing page|promo)/i, '').trim() || 'Produk Kustom';
      }

      // Detect price
      let hargaFinal = '99000';
      let hargaNormal = '299000';
      let noPrice = false;
      const priceMatch = quickInput.match(/(?:rp\.?|harga)\s*([0-9\.,]+)(?:rb|k|ribu)?/i);
      if (priceMatch) {
        let p = priceMatch[1].replace(/\./g, '').replace(/,/g, '');
        if (p.length <= 3) p += '000';
        hargaFinal = p;
        hargaNormal = String(Number(p) * 2);
      } else if (/gratis|tanpa biaya|free/i.test(text)) {
        noPrice = true;
      }

      // Framework selection
      let framework = 'PAS (Problem–Agitate–Solution)';
      if (/murah|flash|diskon|cepat|promo/i.test(text)) {
        framework = 'SLAP (Stop–Look–Act–Purchase)';
      } else if (/cerita|founder|perjalanan|kisah/i.test(text)) {
        framework = "Hero's Journey";
      } else if (/skincare|transformasi|dulu/i.test(text)) {
        framework = 'BAB (Before–After–Bridge)';
      }

      // Color detection
      let color = 'Modern Purple';
      let hex = '#6c63ff';
      if (/hijau|herbal|toko|alam/i.test(text)) {
        color = 'Emerald Growth';
        hex = '#10b981';
      } else if (/biru|fintech|software|aplikasi|ppob|pulsa/i.test(text)) {
        color = 'Cyber Blue';
        hex = '#0284c7';
      } else if (/merah|flash|pedas|berani/i.test(text)) {
        color = 'Fire Orange';
        hex = '#ea580c';
      } else if (/skincare|cantik|wanita|pink/i.test(text)) {
        color = 'Rose Beauty';
        hex = '#ec4899';
      }

      // CTA detection
      let cta = noPrice ? 'Daftar Sekarang (Gratis)' : 'Beli Sekarang & Amankan Promo';
      if (/wa|whatsapp|chat/i.test(text)) {
        cta = 'Konsultasi Gratis via WhatsApp';
      }

      const generated: FormState = {
        ...initialFormState,
        namaProduk: nama,
        tipeProduk: /software|app|aplikasi/i.test(text) ? 'SaaS / Software' : /skincare|baju|makanan/i.test(text) ? 'Physical / Commerce' : 'Digital Product',
        tujuanUtama: noPrice ? 'Lead Generation (WA/Email)' : 'Sales / Beli Langsung',
        framework,
        warnaBrand: color,
        warnaBrandCustom: hex,
        targetAudience: 'Target pembeli potensial yang mencari solusi praktis',
        deskripsiBenefit: quickInput.trim(),
        hargaNormal: noPrice ? '' : hargaNormal,
        hargaPromo: noPrice ? '' : String(Math.round(Number(hargaFinal) * 1.4)),
        hargaFinal: noPrice ? '' : hargaFinal,
        pricingLayersConfig: {
          noPriceMode: noPrice,
          layerNormal: !noPrice,
          layerPromo: !noPrice,
          layerFinal: !noPrice,
        },
        ctaUtama: cta,
      };

      setParsedPreview(generated);
      setIsGenerating(false);
      toast({ title: '⚡ Struktur Landing Page Siap!', description: `AI telah menyusun form lengkap untuk "${nama}".` });
    }, 900);
  };

  const handleApply = () => {
    if (parsedPreview) {
      onApplyQuickForm(parsedPreview);
      toast({ title: '✅ Form Diperbarui', description: 'Data telah dimuat ke form utama dan siap digenerate!' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-primary/10 to-transparent border border-amber-500/30 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-foreground">⚡ Mode Tulis Prompt Cepat (AI Auto-Fill)</h2>
            <p className="text-xs text-muted-foreground">
              Malas isi 10 step? Cukup ketik 1 kalimat/paragraf instruksi bebas. AI akan otomatis menentukan framework, warna, harga, target, dan seluruh struktur landing page.
            </p>
          </div>
        </div>
      </div>

      {/* Input Card */}
      <Card className="border-border bg-card">
        <CardHeader className="p-4 sm:p-6 pb-2">
          <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-primary" />
            Tuliskan Instruksi Bebas tentang Produk Anda
          </CardTitle>
          <CardDescription className="text-xs">
            Contoh: "Saya mau buat landing page pendaftaran agen dBestReload, server pulsa & ppob termurah, pendaftaran gratis, transaksi cepat 24 jam, bonus spanduk toko..."
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-2 space-y-3.5">
          <Textarea
            placeholder="Tuliskan di sini apa saja yang Anda ketahui tentang produk Anda..."
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            className="bg-secondary min-h-[120px] text-xs sm:text-sm font-mono leading-relaxed"
          />

          <div className="flex justify-end pt-1">
            <Button
              onClick={handleSmartGenerate}
              disabled={isGenerating || quickInput.trim().length < 15}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Menganalisis & Menyusun Form...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Susun Form Otomatis dengan AI
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Parsed Result Preview */}
      {parsedPreview && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <Card className="border-primary/40 bg-gradient-to-b from-primary/10 to-card p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Hasil Analisa Cepat AI</span>
                <h3 className="text-lg font-black text-foreground">{parsedPreview.namaProduk}</h3>
              </div>
              <Button onClick={handleApply} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9">
                <CheckCircle2 className="w-4 h-4" /> Terapkan & Buka di Form Generator →
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-secondary/70 border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Framework:</span>
                <p className="font-semibold text-foreground mt-0.5">{parsedPreview.framework}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-secondary/70 border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Warna Brand:</span>
                <p className="font-semibold text-primary mt-0.5 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: parsedPreview.warnaBrandCustom }} />
                  {parsedPreview.warnaBrand}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-secondary/70 border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Model Harga:</span>
                <p className="font-semibold text-foreground mt-0.5">
                  {parsedPreview.pricingLayersConfig.noPriceMode ? 'Gratis / Tanpa Harga' : `Rp ${Number(parsedPreview.hargaFinal).toLocaleString('id-ID')}`}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-secondary/70 border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Tombol CTA:</span>
                <p className="font-semibold text-emerald-400 mt-0.5">{parsedPreview.ctaUtama}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
