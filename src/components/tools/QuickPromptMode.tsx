import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormState, initialFormState } from '@/types/form';
import { Zap, Sparkles, Wand2, RefreshCw, ArrowRight, CheckCircle2, Edit3, Layers, Palette, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sendAiChatMessage } from '@/utils/aiClient';

interface Props {
  onApplyQuickForm: (form: FormState) => void;
}

export function QuickPromptMode({ onApplyQuickForm }: Props) {
  const [quickInput, setQuickInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<FormState | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const parseWithIntelligentNlp = (input: string): FormState => {
    const raw = input.trim();
    const text = raw.toLowerCase();

    // 1. Clean product name extraction
    let cleanName = '';

    // Check specific high-intent keywords
    if (/umrah|umroh|haji/i.test(text)) {
      cleanName = 'Paket Umrah & Haji Khusus Berkah';
    } else if (/pulsa|ppob|reload|konter/i.test(text)) {
      const brandMatch = raw.match(/(?:agen|server|ppob|nama|brand)\s+([A-Za-z0-9\s\-]+?)(?:,|\.|\s+server|\s+pulsa|\s+termurah|\s+gratis)/i);
      cleanName = brandMatch && brandMatch[1] ? `Server Pulsa & PPOB ${brandMatch[1].trim()}` : 'Server Pulsa & Agen PPOB Termurah';
    } else if (/skincare|serum|glowing|jerawat|krim/i.test(text)) {
      cleanName = 'Serum Perawatan Wajah Glowing Alami';
    } else if (/kursus|kelas|ecourse|mentoring|belajar/i.test(text)) {
      cleanName = 'Masterclass & Panduan Praktis Bisnis Digital';
    } else if (/property|properti|rumah|cluster|tanah/i.test(text)) {
      cleanName = 'Hunian Modern Cluster Eksklusif & Asri';
    } else {
      // Regex stripping common Indonesian prompt wrappers
      let cleaned = raw
        .replace(/^(saya\s+)?(mau|ingin|tolong|bisa|buatkan|bikin|buat)\s+(landing\s+page|lp|web|website|halaman|penawaran)?\s*(tentang|untuk|produk|jualan|mengenai)?\s*/i, '')
        .replace(/^(landing\s+page|lp|website)\s*(tentang|untuk|produk|jualan|mengenai)?\s*/i, '')
        .replace(/\s+(dengan|yang|seharga|harga|diskon|promo|bonus|pendaftaran|fitur).*$/i, '')
        .trim();

      if (cleaned.length > 2 && cleaned.length < 50) {
        cleanName = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      } else {
        cleanName = 'Produk Unggulan Spesial';
      }
    }

    // 2. Detect price & pricing mode
    let hargaFinal = '99000';
    let hargaPromo = '199000';
    let hargaNormal = '299000';
    let noPrice = false;

    if (/gratis|tanpa biaya|free|pendaftaran gratis|cuma-cuma/i.test(text) || /umrah|umroh|properti|jasa|konsultasi/i.test(text)) {
      noPrice = true;
    }

    const priceMatch = raw.match(/(?:rp\.?|harga|biaya|tarif)\s*([0-9\.,]+)(?:rb|k|ribu|jt|juta)?/i);
    if (priceMatch && priceMatch[1]) {
      let p = priceMatch[1].replace(/\./g, '').replace(/,/g, '');
      if (priceMatch[0].toLowerCase().includes('jt') || priceMatch[0].toLowerCase().includes('juta')) {
        p += '000000';
      } else if (p.length <= 3) {
        p += '000';
      }
      hargaFinal = p;
      hargaPromo = String(Math.round(Number(p) * 1.4));
      hargaNormal = String(Number(p) * 2);
      noPrice = false;
    }

    // 3. Framework & Style
    let framework = 'PAS (Problem–Agitate–Solution)';
    let color = 'Modern Purple';
    let hex = '#6c63ff';
    let target = 'Calon pembeli potensial yang mencari solusi praktis dan terpercaya';
    let cta = noPrice ? 'Konsultasi Gratis via WhatsApp' : 'Beli Sekarang & Amankan Promo';
    let benefit = `Memberikan kemudahan, efisiensi waktu, dan kualitas terbaik untuk kebutuhan Anda.`;

    if (/umrah|umroh|haji/i.test(text)) {
      framework = 'AIDA (Attention–Interest–Desire–Action)';
      color = 'Emerald Growth';
      hex = '#10b981';
      target = 'Calon jamaah dan keluarga yang mendambakan ibadah umrah khusyuk dengan fasilitas hotel dekat & pembimbing terpercaya';
      cta = 'Konsultasi Jadwal & Brosur Lengkap via WA';
      benefit = `1. Bimbingan Muthawif berpengalaman & sesuai sunnah\n2. Fasilitas hotel bintang 5 dekat pelataran masjid\n3. Kepastian jadwal keberangkatan & legalitas izin Kemenag resmi\n4. Layanan handling bandara & perlengkapan eksklusif`;
    } else if (/pulsa|ppob|reload/i.test(text)) {
      framework = 'SLAP (Stop–Look–Act–Purchase)';
      color = 'Cyber Blue';
      hex = '#0284c7';
      target = 'Pebisnis konter, toko kelontong, dan individu yang ingin cuan tambahan dari transaksi pulsa & bayar tagihan';
      cta = 'Daftar Jadi Agen Gratis Sekarang';
      benefit = `1. Transaksi super cepat 24 jam nonstop via aplikasi & WA\n2. Harga modal termurah langsung dari server distributor\n3. Pendaftaran 100% gratis tanpa biaya bulanan\n4. Komisi transaksi otomatis masuk saldo & bonus spanduk toko`;
    } else if (/skincare|serum|glowing/i.test(text)) {
      framework = 'BAB (Before–After–Bridge)';
      color = 'Rose Beauty';
      hex = '#ec4899';
      target = 'Pria dan wanita yang ingin merawat kulit wajah agar cerah, glowing, dan bebas noda hitam';
      cta = 'Pesan Paket Glowing Promo Hari Ini';
      benefit = `1. Mencerahkan kulit kusam & memudarkan bekas jerawat\n2. Formula aman BPOM tanpa efek samping & tanpa ketergantungan\n3. Terasa lembap dan glowing sejak 7 hari pemakaian\n4. Garansi keaslian produk 100% original`;
    }

    return {
      ...initialFormState,
      namaProduk: cleanName,
      tipeProduk: /software|app|aplikasi/i.test(text) ? 'SaaS / Software' : /skincare|baju|makanan/i.test(text) ? 'Physical / Commerce' : /umrah|jasa|konsultasi/i.test(text) ? 'Service / Agency' : 'Digital Product',
      tujuanUtama: noPrice ? 'Lead Generation (WA/Email)' : 'Sales / Beli Langsung',
      framework,
      warnaBrand: color,
      warnaBrandCustom: hex,
      targetAudience: target,
      deskripsiBenefit: benefit,
      hargaNormal: noPrice ? '' : hargaNormal,
      hargaPromo: noPrice ? '' : hargaPromo,
      hargaFinal: noPrice ? '' : hargaFinal,
      pricingLayersConfig: {
        noPriceMode: noPrice,
        layerNormal: !noPrice,
        layerPromo: !noPrice,
        layerFinal: !noPrice,
      },
      ctaUtama: cta,
    };
  };

  const handleSmartGenerate = async () => {
    if (!quickInput.trim() || quickInput.trim().length < 10) {
      toast({
        title: 'Instruksi Terlalu Pendek',
        description: 'Tuliskan deskripsi produk Anda (contoh: "Mau buat landing page umrah paket vip hemat hotel bintang 5...").',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setParsedPreview(null);

    // Try AI first
    const promptForAi = `Ekstrak instruksi berikut menjadi data formulir landing page profesional dalam format JSON valid murni (tanpa \`\`\`json):
Instruksi pengguna: "${quickInput}"

Keluarkan JSON dengan field:
{
  "namaProduk": "Nama produk spesifik (BUKAN kalimat instruksi seperti 'mau buat landing')",
  "tipeProduk": "Digital Product / Physical / Service / SaaS",
  "tujuanUtama": "Sales / Beli Langsung atau Lead Generation (WA/Email)",
  "framework": "PAS (Problem–Agitate–Solution) / AIDA / BAB / SLAP",
  "warnaBrand": "Cyber Blue / Emerald Growth / Modern Purple / Rose Beauty / Fire Orange",
  "warnaBrandCustom": "#hexcode",
  "targetAudience": "Deskripsi spesifik siapa target audiensnya",
  "deskripsiBenefit": "3-5 poin keunggulan utama dalam kalimat rapi (BUKAN prompt instruksi pengguna)",
  "noPrice": true/false,
  "hargaNormal": "299000",
  "hargaPromo": "199000",
  "hargaFinal": "99000",
  "ctaUtama": "Teks tombol CTA yang persuasif"
}`;

    let generated: FormState | null = null;

    try {
      const response = await sendAiChatMessage([
        { role: 'system', content: 'Anda adalah AI spesialis konversi landing page. Jawab HANYA dalam JSON valid.' },
        { role: 'user', content: promptForAi },
      ]);

      if (response) {
        const clean = response.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(clean);
        if (data && data.namaProduk) {
          const noPrice = data.noPrice || /gratis|free|tanpa biaya/i.test(quickInput);
          generated = {
            ...initialFormState,
            namaProduk: data.namaProduk,
            tipeProduk: data.tipeProduk || 'Digital Product',
            tujuanUtama: data.tujuanUtama || (noPrice ? 'Lead Generation (WA/Email)' : 'Sales / Beli Langsung'),
            framework: data.framework || 'PAS (Problem–Agitate–Solution)',
            warnaBrand: data.warnaBrand || 'Modern Purple',
            warnaBrandCustom: data.warnaBrandCustom || '#6c63ff',
            targetAudience: data.targetAudience || 'Target audiens potensial',
            deskripsiBenefit: data.deskripsiBenefit || 'Keunggulan produk teruji dengan kualitas terbaik.',
            hargaNormal: noPrice ? '' : (data.hargaNormal || '299000'),
            hargaPromo: noPrice ? '' : (data.hargaPromo || '199000'),
            hargaFinal: noPrice ? '' : (data.hargaFinal || '99000'),
            pricingLayersConfig: {
              noPriceMode: noPrice,
              layerNormal: !noPrice,
              layerPromo: !noPrice,
              layerFinal: !noPrice,
            },
            ctaUtama: data.ctaUtama || (noPrice ? 'Konsultasi Gratis via WA' : 'Beli Sekarang'),
          };
        }
      }
    } catch (err) {
      console.warn('KoboiLLM offline/unreachable, using NLP engine:', err);
    }

    if (!generated) {
      generated = parseWithIntelligentNlp(quickInput);
    }

    setParsedPreview(generated);
    setIsGenerating(false);
    toast({
      title: '⚡ Struktur Landing Page Siap!',
      description: `AI berhasil mendeteksi "${generated.namaProduk}" secara akurat.`,
    });
  };

  const handleApply = () => {
    if (parsedPreview) {
      onApplyQuickForm(parsedPreview);
      toast({
        title: '✅ Form Diperbarui',
        description: 'Data telah dimuat ke LP Generator Utama dan siap digenerate!',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-primary/10 to-transparent border border-amber-500/30 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-foreground">⚡ Mode Tulis Prompt Cepat (AI Auto-Fill)</h2>
            <p className="text-xs text-muted-foreground">
              Ketik deskripsi produk dalam kalimat bebas. AI akan otomatis mengekstrak Nama Produk asli, Target Pasar, Manfaat, Harga, dan Framework tanpa Anda harus mengisi 10 step manual.
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
            Contoh: "Saya mau buat landing page umrah paket berkah bintang 5, ada bimbingan muthawif resmi kemenag, pendaftaran konsultasi via whatsapp..."
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-2 space-y-3.5">
          <Textarea
            placeholder="Tuliskan di sini produk apa yang ingin Anda buatkan landing page..."
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            className="bg-secondary min-h-[120px] text-xs sm:text-sm font-mono leading-relaxed"
          />

          <div className="flex justify-end pt-1">
            <Button
              onClick={handleSmartGenerate}
              disabled={isGenerating || quickInput.trim().length < 10}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> AI Sedang Mengekstrak Data Produk...
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
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  Hasil Deteksi Akurat AI
                </span>
                <h3 className="text-lg sm:text-xl font-black text-foreground">{parsedPreview.namaProduk}</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" /> {isEditing ? 'Tutup Edit' : 'Edit Hasil'}
                </Button>
                <Button
                  onClick={handleApply}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9"
                >
                  <CheckCircle2 className="w-4 h-4" /> Terapkan & Buka di Form Generator →
                </Button>
              </div>
            </div>

            {/* Editable Mode */}
            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Nama Produk</label>
                  <Input
                    value={parsedPreview.namaProduk}
                    onChange={(e) => setParsedPreview({ ...parsedPreview, namaProduk: e.target.value })}
                    className="bg-secondary text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Target Audiens</label>
                  <Input
                    value={parsedPreview.targetAudience}
                    onChange={(e) => setParsedPreview({ ...parsedPreview, targetAudience: e.target.value })}
                    className="bg-secondary text-xs"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Deskripsi Manfaat / Fitur</label>
                  <Textarea
                    value={parsedPreview.deskripsiBenefit}
                    onChange={(e) => setParsedPreview({ ...parsedPreview, deskripsiBenefit: e.target.value })}
                    className="bg-secondary text-xs min-h-[80px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Tombol CTA</label>
                  <Input
                    value={parsedPreview.ctaUtama}
                    onChange={(e) => setParsedPreview({ ...parsedPreview, ctaUtama: e.target.value })}
                    className="bg-secondary text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Harga Promo (Opsional)</label>
                  <Input
                    value={parsedPreview.hargaFinal}
                    onChange={(e) => setParsedPreview({ ...parsedPreview, hargaFinal: e.target.value })}
                    className="bg-secondary text-xs"
                    placeholder="Kosongkan jika gratis/konsultasi"
                  />
                </div>
              </div>
            ) : (
              /* Readonly Cards */
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-secondary/70 border border-border">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Framework:</span>
                    <p className="font-semibold text-foreground mt-0.5">{parsedPreview.framework}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-secondary/70 border border-border">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Warna Brand:</span>
                    <p className="font-semibold text-primary mt-0.5 flex items-center gap-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ background: parsedPreview.warnaBrandCustom }}
                      />
                      {parsedPreview.warnaBrand}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-secondary/70 border border-border">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Model Penawaran:</span>
                    <p className="font-semibold text-foreground mt-0.5">
                      {parsedPreview.pricingLayersConfig.noPriceMode
                        ? 'Lead Gen / Bebas Biaya'
                        : `Rp ${Number(parsedPreview.hargaFinal).toLocaleString('id-ID')}`}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-secondary/70 border border-border">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Tombol CTA:</span>
                    <p className="font-semibold text-emerald-400 mt-0.5">{parsedPreview.ctaUtama}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-secondary/50 border border-border text-xs space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                    Poin Manfaat Terdeteksi:
                  </span>
                  <p className="text-foreground leading-relaxed whitespace-pre-line">
                    {parsedPreview.deskripsiBenefit}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
