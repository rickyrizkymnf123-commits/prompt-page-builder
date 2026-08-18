import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BarChart3,
  Lightbulb,
  Zap,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuditResult {
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  verdict: string;
  categories: {
    hook: { score: number; feedback: string; status: 'good' | 'warning' | 'bad' };
    conversion: { score: number; feedback: string; status: 'good' | 'warning' | 'bad' };
    trust: { score: number; feedback: string; status: 'good' | 'warning' | 'bad' };
    mobile: { score: number; feedback: string; status: 'good' | 'warning' | 'bad' };
    compliance: { score: number; feedback: string; status: 'good' | 'warning' | 'bad' };
  };
  keyRecommendations: string[];
  bannedWordsFound: string[];
  improvedHeadlineSuggestion?: string;
  improvedCtaSuggestion?: string;
}

export function LandingPageAuditor() {
  const [content, setContent] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const { toast } = useToast();

  const handleAudit = () => {
    const text = content.trim();
    if (!text || text.length < 20) {
      toast({
        title: 'Teks Terlalu Pendek',
        description: 'Tempelkan teks landing page, copywriting, atau draft HTML Anda (minimal 20 karakter).',
        variant: 'destructive',
      });
      return;
    }

    setAnalyzing(true);

    setTimeout(() => {
      // Analyze text for banned / sensitive ads words
      const lower = text.toLowerCase();
      const bannedList = [
        'pasti kaya', '100% kaya', 'cepat kaya', 'tanpa modal', 'jamin sembuh',
        'pasti untung', 'bebas resiko', 'bikin langsing seketika', 'rahasia terlarang',
        'pasti berhasil', 'garansi uang kembali 1000%'
      ];
      const foundBanned = bannedList.filter(w => lower.includes(w));

      // Check key sections
      const hasHook = text.length > 50;
      const hasCta = /beli|daftar|gabung|download|chat|order|pesan|amankan|mulai/i.test(text);
      const hasTrust = /testimoni|terbukti|alumni|member|ulasan|garansi|legalitas|resmi/i.test(text);
      const hasUrgency = /terbatas|hari ini|sisa|promo|diskon|slot|sekarang/i.test(text);
      const hasProblem = /capek|bingung|susah|rugi|masalah|kendala|frustasi|sulit|boncos/i.test(text);

      let hookScore = hasHook ? (hasProblem ? 90 : 75) : 50;
      let conversionScore = hasCta ? (hasUrgency ? 92 : 78) : 45;
      let trustScore = hasTrust ? 88 : 55;
      let mobileScore = text.includes('\n\n') || text.length < 800 ? 90 : 70;
      let complianceScore = foundBanned.length === 0 ? 95 : Math.max(40, 95 - foundBanned.length * 25);

      const overallScore = Math.round((hookScore + conversionScore + trustScore + mobileScore + complianceScore) / 5);

      let grade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'B';
      let verdict = 'Landing page memiliki fondasi yang baik, perlu optimasi minor pada trust & CTA.';
      if (overallScore >= 90) {
        grade = 'A+';
        verdict = '🔥 Luar Biasa! Landing page siap dijalankan untuk iklan Facebook & TikTok Ads dengan konversi tinggi.';
      } else if (overallScore >= 80) {
        grade = 'A';
        verdict = '✅ Sangat Baik! Penawaran sudah kuat dan alur persuasi tersusun rapi.';
      } else if (overallScore >= 65) {
        grade = 'B';
        verdict = '⚠️ Cukup Baik. Perlu penambahan social proof / bukti angka dan penegasan tombol CTA.';
      } else {
        grade = 'C';
        verdict = '❌ Perlu Perbaikan Signifikan. Masih minim hook emosional dan belum ada bukti pendukung.';
      }

      const keyRecommendations: string[] = [];
      if (!hasProblem) keyRecommendations.push('Tambahkan 1–2 paragraf yang mengangkat frustrasi/masalah spesifik pembeli di awal (Problem Section).');
      if (!hasTrust) keyRecommendations.push('Tambahkan bukti nyata: angka alumni/pengguna, screenshot testimoni, atau garansi masuk akal.');
      if (!hasUrgency) keyRecommendations.push('Tambahkan elemen kelangkaan (Scarcity / Sisa Slot) agar calon pembeli tidak menunda transaksi.');
      if (foundBanned.length > 0) keyRecommendations.push(`Hapus atau ganti kata overclaim: "${foundBanned.join(', ')}" agar akun iklan tidak terkena rejected/banned oleh Meta Ads.`);
      if (!hasCta) keyRecommendations.push('Perjelas tombol Call To Action (CTA) utama dengan kata kerja aktif yang mengundang aksi.');

      setResult({
        overallScore,
        grade,
        verdict,
        categories: {
          hook: {
            score: hookScore,
            status: hookScore >= 80 ? 'good' : hookScore >= 60 ? 'warning' : 'bad',
            feedback: hasProblem ? 'Hook kuat dan langsung menyentuh titik sakit target audiens.' : 'Hook masih terkesan umum, perlu diperjelas problem spesifiknya.',
          },
          conversion: {
            score: conversionScore,
            status: conversionScore >= 80 ? 'good' : conversionScore >= 60 ? 'warning' : 'bad',
            feedback: hasCta ? 'Tombol aksi dan penawaran sudah jelas terarah.' : 'CTA utama belum menonjol atau belum ada instruksi pembelian.',
          },
          trust: {
            score: trustScore,
            status: trustScore >= 80 ? 'good' : trustScore >= 60 ? 'warning' : 'bad',
            feedback: hasTrust ? 'Social proof dan jaminan keamanan sudah memadai.' : 'Masih minim testimoni atau bukti konkret yang meyakinkan calon pembeli.',
          },
          mobile: {
            score: mobileScore,
            status: mobileScore >= 80 ? 'good' : mobileScore >= 60 ? 'warning' : 'bad',
            feedback: 'Format paragraf pendek dan mudah di-scan mata pengguna smartphone.',
          },
          compliance: {
            score: complianceScore,
            status: complianceScore >= 80 ? 'good' : complianceScore >= 60 ? 'warning' : 'bad',
            feedback: foundBanned.length === 0 ? 'Bebas dari kata overclaim, aman untuk Meta Ads & Google Ads.' : `Ditemukan kata sensitif iklan: ${foundBanned.join(', ')}.`,
          },
        },
        keyRecommendations,
        bannedWordsFound: foundBanned,
        improvedHeadlineSuggestion: 'Transformasikan Bisnis Anda Lebih Cepat Tanpa Ribet Operasional Berkat Sistem Otomatis 3 Langkah',
        improvedCtaSuggestion: 'Amankan Akses Sekarang — Diskon Khusus Hari Ini',
      });

      setAnalyzing(false);
      toast({ title: '🔍 Audit Selesai', description: `Skor Landing Page Anda: ${overallScore}/100 (Grade ${grade})` });
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-foreground">🔍 AI Landing Page & Copy Auditor</h2>
            <p className="text-xs text-muted-foreground">
              Analisis instan kekuatan persuasi, tingkat konversi, keterbacaan mobile, dan kepatuhan regulasi iklan (Meta/Google Ads).
            </p>
          </div>
        </div>
      </div>

      {/* Input Box */}
      <Card className="border-border bg-card">
        <CardHeader className="p-4 sm:p-6 pb-2">
          <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Tempelkan Copywriting / Struktur Landing Page Anda
          </CardTitle>
          <CardDescription className="text-xs">
            Bisa berupa teks headline, draft section, isi penawaran, maupun kode HTML yang ingin diaudit.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-2 space-y-4">
          <Textarea
            placeholder="Tempelkan naskah copywriting atau kode HTML landing page Anda di sini untuk diaudit secara mendalam..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[160px] bg-secondary font-mono text-xs sm:text-sm leading-relaxed"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Panjang karakter: {content.length}</span>
              {content.length > 0 && (
                <button type="button" onClick={() => setContent('')} className="text-destructive hover:underline text-[11px]">
                  Bersihkan
                </button>
              )}
            </div>
            <Button
              onClick={handleAudit}
              disabled={analyzing || content.length < 10}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 px-6"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Menganalisis Konten...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" /> Mulai Audit AI Sekarang
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Results */}
      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Main Score Banner */}
          <Card className="border-primary/40 bg-gradient-to-b from-primary/10 to-card p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider font-bold text-primary">
                  Hasil Audit Landing Page
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-foreground">{result.verdict}</h3>
                <p className="text-xs text-muted-foreground">Berdasarkan standar industri conversion copywriting & periklanan digital modern.</p>
              </div>

              <div className="flex items-center gap-3 bg-secondary/80 p-3 sm:p-4 rounded-2xl border border-border flex-shrink-0">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-black text-primary">{result.overallScore}</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">Skor LP</div>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-black text-amber-500">{result.grade}</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">Grade</div>
                </div>
              </div>
            </div>
          </Card>

          {/* 5 Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { title: '🎯 Hook & Headline', data: result.categories.hook },
              { title: '🔥 Konversi & CTA', data: result.categories.conversion },
              { title: '🛡️ Social Proof & Trust', data: result.categories.trust },
              { title: '📱 Keterbacaan Mobile', data: result.categories.mobile },
              { title: '⚖️ Kepatuhan Iklan (Anti-Banned)', data: result.categories.compliance },
            ].map((cat, idx) => (
              <Card key={idx} className="p-4 bg-secondary/50 border-border space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground">{cat.title}</h4>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                    cat.data.score >= 80 ? 'bg-emerald-500/20 text-emerald-500' : cat.data.score >= 65 ? 'bg-amber-500/20 text-amber-500' : 'bg-destructive/20 text-destructive'
                  }`}>
                    {cat.data.score}/100
                  </span>
                </div>
                <div className="w-full bg-background rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      cat.data.score >= 80 ? 'bg-emerald-500' : cat.data.score >= 65 ? 'bg-amber-500' : 'bg-destructive'
                    }`}
                    style={{ width: `${cat.data.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{cat.data.feedback}</p>
              </Card>
            ))}
          </div>

          {/* Key Recommendations & Suggestions */}
          <Card className="p-4 sm:p-6 bg-card border-border space-y-3">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Rekomendasi Perbaikan Prioritas AI:
            </h4>
            <div className="space-y-2">
              {result.keyRecommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-secondary/60 border border-border text-xs">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                    {i + 1}
                  </span>
                  <p className="text-foreground leading-relaxed pt-0.5">{rec}</p>
                </div>
              ))}
            </div>

            {/* AI Copy Fixes */}
            {result.improvedHeadlineSuggestion && (
              <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/25 space-y-2 mt-4">
                <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Saran Headline Alternatif High-Converting:
                </p>
                <p className="text-xs sm:text-sm font-semibold text-foreground italic bg-background/60 p-2.5 rounded-lg border border-border">
                  "{result.improvedHeadlineSuggestion}"
                </p>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
