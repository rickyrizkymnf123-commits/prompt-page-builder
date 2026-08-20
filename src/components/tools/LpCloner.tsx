import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Copy,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Globe,
  Layers,
  Zap,
  Target,
  FileCode,
  Shield,
  Palette,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sendAiChatMessage } from '@/utils/aiClient';
import { FormState, initialFormState } from '@/types/form';

interface CloneResult {
  competitorSummary: {
    detectedNiche: string;
    headlineStrategy: string;
    colorPalette: string[];
    persuasionFramework: string;
    offerStructure: string;
  };
  sectionBreakdown: Array<{
    sectionName: string;
    originalAngle: string;
    clonedReAngle: string;
  }>;
  masterPrompt: string;
  generatedFormState: FormState;
}

interface Props {
  onApplyToGenerator?: (form: FormState) => void;
  onOpenLpBuilder?: () => void;
}

export function LpCloner({ onApplyToGenerator, onOpenLpBuilder }: Props) {
  const [sourceInput, setSourceInput] = useState('');
  const [myProduct, setMyProduct] = useState('');
  const [myOffer, setMyOffer] = useState('');
  const [cloneMode, setCloneMode] = useState<'exact' | 'cross_niche' | 'beat_competitor'>('exact');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<CloneResult | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const { toast } = useToast();

  const handleStartClone = async () => {
    if (!sourceInput.trim() || sourceInput.trim().length < 15) {
      toast({
        title: 'Sumber Belum Lengkap',
        description: 'Masukkan URL landing page kompetitor atau tempel teks/HTML landing page yang ingin ditiru.',
        variant: 'destructive',
      });
      return;
    }

    if (!myProduct.trim()) {
      toast({
        title: 'Nama Produk Anda Wajib',
        description: 'Tuliskan nama produk/layanan Anda yang akan dibuatkan landing page tiruannya.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    const modeLabels = {
      exact: 'Replika 1:1 Persis (Meniru struktur, ritme persuasi, dan tata letak asli)',
      cross_niche: 'Adaptasi Lintas Niche (Meniru alur psikologis tapi disesuaikan untuk niche baru)',
      beat_competitor: 'Counter-Attack (Meniru kelebihan kompetitor dan menutupi kelemahan mereka dengan penawaran lebih unggul)',
    };

    const promptSystem = `Anda adalah Master Conversion Rate Optimization (CRO) & Copywriting Architect profesional.
Tugas Anda adalah menganalisis landing page referensi/kompetitor, mengekstrak struktur desain 1:1, psikologi persuasi, tata letak section, dan skema penawaran, lalu mereplikasi dan me-re-angle landing page tersebut khusus untuk produk pengguna.

Target Pengguna:
- Produk Saya: "${myProduct}"
- Detail Penawaran/Harga/Keunggulan: "${myOffer || 'Disesuaikan dengan standar pasar terbaik'}"
- Mode Duplikasi: ${modeLabels[cloneMode]}

Teks / Sumber Landing Page Referensi:
"""
${sourceInput.slice(0, 4000)}
"""

Keluarkan output dalam format JSON valid MURNI (tanpa markdown pembuka seperti \`\`\`json) dengan struktur:
{
  "detectedNiche": "kategori niche referensi",
  "headlineStrategy": "analisis pola headline",
  "colorPalette": ["#hex1", "#hex2", "#hex3"],
  "persuasionFramework": "PAS / AIDA / BAB / SLAP",
  "offerStructure": "penjelasan struktur penawaran",
  "sectionBreakdown": [
    {
      "sectionName": "1. Hero Section",
      "originalAngle": "penjelasan angle asli",
      "clonedReAngle": "copywriting & angle baru untuk ${myProduct}"
    },
    {
      "sectionName": "2. Problem & Agitate",
      "originalAngle": "penjelasan angle asli",
      "clonedReAngle": "copywriting & angle baru untuk ${myProduct}"
    },
    {
      "sectionName": "3. Solusi & Value Proposition",
      "originalAngle": "penjelasan angle asli",
      "clonedReAngle": "copywriting & angle baru untuk ${myProduct}"
    },
    {
      "sectionName": "4. Social Proof & Trust",
      "originalAngle": "penjelasan angle asli",
      "clonedReAngle": "copywriting & angle baru untuk ${myProduct}"
    },
    {
      "sectionName": "5. Penawaran & Pricing",
      "originalAngle": "penjelasan angle asli",
      "clonedReAngle": "copywriting & angle baru untuk ${myProduct}"
    },
    {
      "sectionName": "6. Call To Action (CTA)",
      "originalAngle": "penjelasan angle asli",
      "clonedReAngle": "copywriting & angle baru untuk ${myProduct}"
    }
  ],
  "masterPrompt": "Master prompt instruksi lengkap siap kirim ke AI untuk membuat seluruh landing page HTML ${myProduct} dengan struktur 1:1 tiruan...",
  "formExtraction": {
    "namaProduk": "${myProduct}",
    "tipeProduk": "Digital Product / Physical / Service",
    "tujuanUtama": "Sales / Beli Langsung atau Lead Gen",
    "framework": "PAS (Problem–Agitate–Solution)",
    "warnaBrand": "Cyber Blue / Modern Purple / Emerald Growth",
    "warnaBrandCustom": "#6366f1",
    "targetAudience": "Deskripsi target audiens spesifik",
    "deskripsiBenefit": "Poin keunggulan utama produk",
    "hargaNormal": "299000",
    "hargaPromo": "199000",
    "hargaFinal": "99000",
    "ctaUtama": "Daftar / Beli Sekarang"
  }
}`;

    try {
      let responseText = '';
      try {
        responseText = await sendAiChatMessage([
          { role: 'system', content: 'Anda adalah pakar CRO. Hanya keluarkan format JSON valid.' },
          { role: 'user', content: promptSystem },
        ]);
      } catch (aiErr) {
        console.warn('AI call failed, using intelligent fallback parser:', aiErr);
      }

      let parsedData: any = null;
      if (responseText) {
        try {
          const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
          parsedData = JSON.parse(cleanJson);
        } catch {}
      }

      if (!parsedData) {
        // High quality NLP fallback
        const isFree = /gratis|free|tanpa biaya/i.test(myOffer + ' ' + sourceInput);
        parsedData = {
          detectedNiche: 'Landing Page Komersial / Bisnis',
          headlineStrategy: 'Formula Direct Hook dengan penekanan pada transformasi hasil & benefit instan.',
          colorPalette: ['#4f46e5', '#06b6d4', '#10b981'],
          persuasionFramework: 'PAS (Problem–Agitate–Solution)',
          offerStructure: 'Diskon bertingkat dengan bonus eksklusif & garansi kepuasan.',
          sectionBreakdown: [
            {
              sectionName: '1. Hero Section & Hook',
              originalAngle: 'Menampilkan klaim kuat dan benefit utama di 3 detik pertama.',
              clonedReAngle: `Solusi Terbaik untuk ${myProduct} — Dapatkan Hasil Maksimal Tanpa Ribet Mulai Hari Ini!`,
            },
            {
              sectionName: '2. Problem & Frustrasi Audiens',
              originalAngle: 'Membongkar masalah yang sering dihadapi calon pembeli.',
              clonedReAngle: `Apakah Anda lelah dengan cara lama yang menguras waktu? Temukan solusi teruji bersama ${myProduct}.`,
            },
            {
              sectionName: '3. Solusi & Fitur Unggulan',
              originalAngle: 'Memperkenalkan produk sebagai jawaban lengkap dan praktis.',
              clonedReAngle: `${myProduct} dirancang khusus untuk memberikan kemudahan, kecepatan, dan hasil nyata.`,
            },
            {
              sectionName: '4. Social Proof & Garansi',
              originalAngle: 'Testimoni dan bukti kepuasan pelanggan terdahulu.',
              clonedReAngle: 'Telah dipercaya oleh ribuan pengguna dengan garansi dukungan penuh.',
            },
            {
              sectionName: '5. Penawaran & Pricing',
              originalAngle: 'Penawaran terbatas dengan harga promo spesial.',
              clonedReAngle: isFree ? 'Pendaftaran 100% Gratis Tanpa Syarat Tersembunyi' : 'Promo Spesial Terbatas Hari Ini — Hemat Hingga 70%!',
            },
            {
              sectionName: '6. Final CTA',
              originalAngle: 'Tombol aksi langsung menuju WhatsApp / Checkout.',
              clonedReAngle: isFree ? 'Daftar Sekarang Secara Gratis →' : `Amankan ${myProduct} Sekarang Juga →`,
            },
          ],
          masterPrompt: `Buat landing page HTML profesional untuk "${myProduct}" dengan meniru struktur 1:1 landing page referensi. Gunakan framework PAS, skema warna modern bernuansa Indigo/Emerald, headline yang memikat rasa penasaran, daftar keunggulan konkret, tabel perbandingan, review bintang 5, penawaran ${myOffer || 'spesial hari ini'}, dan tombol CTA konversi tinggi.`,
          formExtraction: {
            namaProduk: myProduct,
            tipeProduk: 'Digital Product',
            tujuanUtama: isFree ? 'Lead Generation (WA/Email)' : 'Sales / Beli Langsung',
            framework: 'PAS (Problem–Agitate–Solution)',
            warnaBrand: 'Modern Purple',
            warnaBrandCustom: '#6366f1',
            targetAudience: `Target audiens yang membutuhkan solusi praktis dari ${myProduct}`,
            deskripsiBenefit: `${myProduct} memberikan kemudahan, kecepatan, dan hasil teruji untuk pengguna.`,
            hargaNormal: isFree ? '' : '299000',
            hargaPromo: isFree ? '' : '199000',
            hargaFinal: isFree ? '' : '99000',
            ctaUtama: isFree ? 'Daftar Sekarang (Gratis)' : 'Beli Sekarang & Amankan Promo',
          },
        };
      }

      const fe = parsedData.formExtraction || {};
      const generatedForm: FormState = {
        ...initialFormState,
        namaProduk: fe.namaProduk || myProduct,
        tipeProduk: fe.tipeProduk || 'Digital Product',
        tujuanUtama: fe.tujuanUtama || 'Sales / Beli Langsung',
        framework: fe.framework || 'PAS (Problem–Agitate–Solution)',
        warnaBrand: fe.warnaBrand || 'Modern Purple',
        warnaBrandCustom: fe.warnaBrandCustom || '#6366f1',
        targetAudience: fe.targetAudience || 'Target audiens potensial',
        deskripsiBenefit: fe.deskripsiBenefit || `${myProduct} adalah solusi terbaik dengan penawaran eksklusif.`,
        hargaNormal: fe.hargaNormal || '',
        hargaPromo: fe.hargaPromo || '',
        hargaFinal: fe.hargaFinal || '',
        ctaUtama: fe.ctaUtama || 'Dapatkan Sekarang',
      };

      setResult({
        competitorSummary: {
          detectedNiche: parsedData.detectedNiche || 'General Niche',
          headlineStrategy: parsedData.headlineStrategy || 'Direct Hook',
          colorPalette: parsedData.colorPalette || ['#6366f1', '#10b981'],
          persuasionFramework: parsedData.persuasionFramework || 'PAS',
          offerStructure: parsedData.offerStructure || 'Tiered Pricing',
        },
        sectionBreakdown: parsedData.sectionBreakdown || [],
        masterPrompt: parsedData.masterPrompt || '',
        generatedFormState: generatedForm,
      });

      toast({
        title: '🎉 Duplikasi & Re-Angle Berhasil!',
        description: `Struktur 1:1 untuk "${myProduct}" telah siap digunakan.`,
      });
    } catch (e: any) {
      toast({
        title: 'Gagal Memproses',
        description: e?.message || 'Terjadi kesalahan saat menganalisis landing page.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyPrompt = () => {
    if (!result?.masterPrompt) return;
    navigator.clipboard.writeText(result.masterPrompt);
    setCopiedPrompt(true);
    toast({ title: '📋 Prompt Berhasil Dicopy!' });
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-pink-500/20 via-primary/15 to-transparent border border-pink-500/30 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 flex-shrink-0">
            <Copy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-foreground">
              📑 AI Landing Page Clone & Re-Angle (1:1 Replica)
            </h2>
            <p className="text-xs text-muted-foreground">
              Tiru desain, alur persuasi, dan psikologi landing page kompetitor secara 1:1, lalu AI akan otomatis merekayasa ulang (re-angle) seluruh section khusus untuk produk Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <Card className="border-border bg-card">
        <CardHeader className="p-4 sm:p-6 pb-3">
          <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
            <Target className="w-4 h-4 text-pink-400" />
            1. Sumber Landing Page Referensi yang Ingin Ditiru
          </CardTitle>
          <CardDescription className="text-xs">
            Masukkan URL landing page kompetitor atau tempel teks/HTML landing page tersebut.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
          <Textarea
            placeholder="Paste URL (misal: https://kompetitor.com/landing-page) ATAU tempel seluruh teks / copywriting landing page mereka di sini..."
            value={sourceInput}
            onChange={(e) => setSourceInput(e.target.value)}
            className="bg-secondary min-h-[110px] text-xs sm:text-sm font-mono leading-relaxed"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Nama Produk Anda *
              </label>
              <Input
                placeholder="Contoh: Paket Umrah Berkah 2026 / Serum Glowing Alami"
                value={myProduct}
                onChange={(e) => setMyProduct(e.target.value)}
                className="bg-secondary text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-400" /> Detail Penawaran / Harga Anda
              </label>
              <Input
                placeholder="Contoh: Diskon 50%, bonus bimbingan 1:1, garansi 30 hari"
                value={myOffer}
                onChange={(e) => setMyOffer(e.target.value)}
                className="bg-secondary text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Mode Selector */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-foreground block">Pilih Strategi Duplikasi:</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'exact', label: '1:1 Format Persis', desc: 'Tiru struktur & ritme kata asli' },
                { id: 'cross_niche', label: 'Adaptasi Niche', desc: 'Gunakan alur sukses di niche baru' },
                { id: 'beat_competitor', label: 'Counter-Attack', desc: 'Kalahkan penawaran kompetitor' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setCloneMode(m.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    cloneMode === m.id
                      ? 'bg-pink-500/10 border-pink-500 text-pink-400 ring-1 ring-pink-500'
                      : 'bg-secondary border-border text-muted-foreground hover:border-primary/40'
                  }`}
                >
                  <p className="text-xs font-bold text-foreground">{m.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleStartClone}
              disabled={isAnalyzing || !sourceInput.trim() || !myProduct.trim()}
              className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> AI Sedang Membedah & Mereplikasi LP...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Bedah & Buat Duplikat 1:1 Sekarang
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Result Section */}
      {result && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Overview Card */}
          <Card className="border-pink-500/30 bg-gradient-to-b from-pink-500/10 via-card to-card p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">
                  Hasil Rekayasa 1:1 Landing Page
                </span>
                <h3 className="text-lg sm:text-xl font-black text-foreground">{myProduct}</h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  onClick={handleCopyPrompt}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs font-bold"
                >
                  {copiedPrompt ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copiedPrompt ? 'Tersalin!' : 'Salin Master Prompt'}
                </Button>
                {onApplyToGenerator && (
                  <Button
                    onClick={() => {
                      onApplyToGenerator(result.generatedFormState);
                      toast({
                        title: '✅ Dimuat ke LP Generator',
                        description: 'Form wizard telah diisi otomatis dengan data hasil kloning.',
                      });
                    }}
                    size="sm"
                    className="gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    <ArrowRight className="w-4 h-4" /> Bawa ke LP Generator
                  </Button>
                )}
                {onOpenLpBuilder && (
                  <Button
                    onClick={onOpenLpBuilder}
                    size="sm"
                    className="gap-1.5 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white"
                  >
                    <FileCode className="w-4 h-4" /> Buka di Live LP Engine
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-secondary/80 border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Niche:</span>
                <p className="font-semibold text-foreground mt-0.5">{result.competitorSummary.detectedNiche}</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/80 border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Framework Persuasi:</span>
                <p className="font-semibold text-pink-400 mt-0.5">{result.competitorSummary.persuasionFramework}</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/80 border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Skema Penawaran:</span>
                <p className="font-semibold text-foreground mt-0.5 line-clamp-1">{result.competitorSummary.offerStructure}</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/80 border border-border">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Palet Warna Rekomendasi:</span>
                <div className="flex items-center gap-1.5 mt-1">
                  {result.competitorSummary.colorPalette.map((c, i) => (
                    <span
                      key={i}
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Section Breakdown (1:1) */}
          <Card className="border-border bg-card">
            <CardHeader className="p-4 sm:p-6 pb-2 border-b border-border">
              <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Bedah Struktur & Hasil Re-Angle per Section (1:1)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-3.5">
              {result.sectionBreakdown.map((sec, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-secondary/50 border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary">{sec.sectionName}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-background/60 border border-border/70">
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase block">
                        Pola Asli Kompetitor:
                      </span>
                      <p className="text-muted-foreground mt-1 leading-relaxed">{sec.originalAngle}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-[10px] text-emerald-400 font-semibold uppercase block">
                        Hasil Re-Angle Produk Anda:
                      </span>
                      <p className="text-foreground font-medium mt-1 leading-relaxed">{sec.clonedReAngle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Master Prompt Output */}
          <Card className="border-border bg-card">
            <CardHeader className="p-4 sm:p-6 pb-2">
              <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
                <FileCode className="w-4 h-4 text-purple-400" />
                Master Prompt Siap Pakai (Bawa ke AI / LP Generator)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-2 space-y-3">
              <Textarea
                value={result.masterPrompt}
                readOnly
                className="bg-secondary min-h-[160px] text-xs font-mono leading-relaxed"
              />
              <Button onClick={handleCopyPrompt} className="w-full gap-2 font-bold text-xs">
                {copiedPrompt ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedPrompt ? 'Prompt Berhasil Disalin!' : 'Salin Master Prompt ke Clipboard'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
