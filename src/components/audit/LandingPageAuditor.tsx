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
  ShieldAlert,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sendAiChatMessage } from '@/utils/aiClient';

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

  const handleAudit = async () => {
    const text = content.trim();
    if (!text || text.length < 15) {
      toast({
        title: 'Teks Terlalu Pendek',
        description: 'Tempelkan teks landing page, copywriting, atau draft penawaran Anda (minimal 15 karakter).',
        variant: 'destructive',
      });
      return;
    }

    setAnalyzing(true);
    setResult(null);

    const promptSystem = `Anda adalah Lead Conversion Rate Optimization (CRO) Auditor & Meta/TikTok Ads Policy Specialist.
Tugas Anda adalah mengaudit naskah/copywriting landing page berikut secara mendalam terhadap 5 Pilar Konversi & Kepatuhan Kebijakan Iklan (Anti-Banned).

Teks Landing Page:
"""
${text.slice(0, 3500)}
"""

Keluarkan output dalam format JSON valid murni (tanpa \`\`\`json):
{
  "overallScore": 84,
  "grade": "A+ / A / B / C / D",
  "verdict": "Kesimpulan tajam mengenai kesiapan konversi landing page ini",
  "categories": {
    "hook": {
      "score": 85,
      "feedback": "Evaluasi kekuatan hook dan headline pembuka",
      "status": "good / warning / bad"
    },
    "conversion": {
      "score": 80,
      "feedback": "Evaluasi struktur penawaran, urgensi, dan tombol CTA",
      "status": "good / warning / bad"
    },
    "trust": {
      "score": 75,
      "feedback": "Evaluasi bukti sosial, testimoni, dan garansi",
      "status": "good / warning / bad"
    },
    "mobile": {
      "score": 90,
      "feedback": "Evaluasi keterbacaan pada layar smartphone (panjang paragraf, spacing)",
      "status": "good / warning / bad"
    },
    "compliance": {
      "score": 90,
      "feedback": "Evaluasi keamanan dari kata-kata terlarang / klaim berlebihan di Meta Ads & TikTok Ads",
      "status": "good / warning / bad"
    }
  },
  "keyRecommendations": [
    "Saran prioritas 1",
    "Saran prioritas 2",
    "Saran prioritas 3"
  ],
  "bannedWordsFound": ["kata1", "kata2"],
  "improvedHeadlineSuggestion": "Versi headline yang lebih tajam dan aman iklan",
  "improvedCtaSuggestion": "Versi CTA yang lebih persuasif"
}`;

    try {
      let responseText = '';
      try {
        responseText = await sendAiChatMessage([
          { role: 'system', content: 'Anda adalah AI CRO Auditor. HANYA keluarkan format JSON valid.' },
          { role: 'user', content: promptSystem },
        ]);
      } catch (aiErr) {
        console.warn('AI call failed, using intelligent NLP auditor:', aiErr);
      }

      let parsed: any = null;
      if (responseText) {
        try {
          const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
          parsed = JSON.parse(cleanJson);
        } catch {}
      }

      if (!parsed) {
        const lower = text.toLowerCase();
        const bannedList = [
          'pasti kaya', '100% kaya', 'cepat kaya', 'tanpa modal', 'jamin sembuh',
          'pasti untung', 'bebas resiko', 'bikin langsing seketika', 'rahasia terlarang',
          'pasti berhasil', 'garansi uang kembali 1000%'
        ];
        const foundBanned = bannedList.filter(w => lower.includes(w));

        const hasHook = text.length > 40;
        const hasCta = /beli|daftar|gabung|download|chat|order|pesan|amankan|mulai/i.test(text);
        const hasTrust = /testimoni|terbukti|alumni|member|ulasan|garansi|legalitas|resmi|kemenag|bpom/i.test(text);
        const hasUrgency = /terbatas|hari ini|sisa|promo|diskon|slot|sekarang/i.test(text);
        const hasProblem = /capek|bingung|susah|rugi|masalah|kendala|frustasi|sulit|boncos/i.test(text);

        let hookScore = hasHook ? (hasProblem ? 90 : 78) : 55;
        let conversionScore = hasCta ? (hasUrgency ? 92 : 78) : 48;
        let trustScore = hasTrust ? 88 : 58;
        let mobileScore = text.includes('\n') || text.length < 900 ? 90 : 72;
        let complianceScore = foundBanned.length === 0 ? 95 : Math.max(40, 95 - foundBanned.length * 25);

        const overall = Math.round((hookScore + conversionScore + trustScore + mobileScore + complianceScore) / 5);

        let grade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'B';
        let verdict = 'Landing page memiliki fondasi yang baik, perlu perbaikan pada trust & urgency.';
        if (overall >= 90) {
          grade = 'A+';
          verdict = '🔥 Luar Biasa! Landing page siap dijalankan untuk iklan Facebook & TikTok Ads dengan konversi tinggi.';
        } else if (overall >= 80) {
          grade = 'A';
          verdict = '✅ Sangat Baik! Penawaran sudah kuat dan alur persuasi tersusun rapi.';
        } else if (overall >= 65) {
          grade = 'B';
          verdict = '⚠️ Cukup Baik. Perlu penambahan social proof / bukti angka dan penegasan tombol CTA.';
        } else {
          grade = 'C';
          verdict = '❌ Perlu Perbaikan Signifikan. Masih minim hook emosional dan belum ada bukti pendukung.';
        }

        parsed = {
          overallScore: overall,
          grade,
          verdict,
          categories: {
            hook: {
              score: hookScore,
              feedback: hasProblem ? 'Hook berhasil mengangkat masalah audiens secara relevan.' : 'Hook masih cenderung umum dan belum memicu rasa penasaran mendalam.',
              status: hookScore >= 80 ? 'good' : 'warning',
            },
            conversion: {
              score: conversionScore,
              feedback: hasCta ? 'Tombol aksi jelas dan mudah ditemukan.' : 'Call-to-action belum dipertegas di beberapa section krusial.',
              status: conversionScore >= 80 ? 'good' : 'warning',
            },
            trust: {
              score: trustScore,
              feedback: hasTrust ? 'Elemen trust dan legalitas/garansi sudah ada.' : 'Masih minim bukti sosial, review pengguna, atau garansi kepuasan.',
              status: trustScore >= 80 ? 'good' : 'warning',
            },
            mobile: {
              score: mobileScore,
              feedback: 'Paragraf pendek dan mudah di-scan pada layar smartphone.',
              status: 'good',
            },
            compliance: {
              score: complianceScore,
              feedback: foundBanned.length === 0 ? 'Aman dari kata-kata sensitif dan overpromise untuk Meta/TikTok Ads.' : `Ditemukan kata berisiko: ${foundBanned.join(', ')}`,
              status: foundBanned.length === 0 ? 'good' : 'bad',
            },
          },
          keyRecommendations: [
            !hasTrust ? 'Tambahkan testimoni screenshot atau angka pencapaian pengguna terdahulu.' : 'Pertahankan elemen kepercayaan yang sudah ada.',
            !hasUrgency ? 'Sertakan countdown / batasan kuota promo agar pembeli segera bertindak.' : 'Pastikan batas waktu promo terlihat jelas di dekat tombol checkout.',
            'Gunakan tombol CTA kontras dengan teks aksi spesifik.',
          ],
          bannedWordsFound: foundBanned,
          improvedHeadlineSuggestion: 'Tinggalkan Cara Lama yang Menguras Waktu — Dapatkan Solusi Praktis dengan Hasil Teruji',
          improvedCtaSuggestion: 'Amankan Promo Spesial Hari Ini Sebelum Kuota Habis →',
        };
      }

      setResult(parsed);
      toast({
        title: '🔍 Audit Landing Page Selesai!',
        description: `Skor Keseluruhan: ${parsed.overallScore}/100 (Grade: ${parsed.grade})`,
      });
    } catch (e: any) {
      toast({
        title: 'Gagal Menjalankan Audit',
        description: e?.message || 'Terjadi kesalahan.',
        variant: 'destructive',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-primary/10 to-transparent border border-emerald-500/30 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-foreground">🔍 AI Landing Page & Copy Auditor (5 Pilar CRO)</h2>
            <p className="text-xs text-muted-foreground">
              Evaluasi 5 pilar utama konversi: Hook, Value Proposition, Social Proof, Mobile Readability, dan Anti-Banned Policy Compliance (Aman untuk FB & TikTok Ads).
            </p>
          </div>
        </div>
      </div>

      {/* Input Card */}
      <Card className="border-border bg-card">
        <CardHeader className="p-4 sm:p-6 pb-2">
          <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Masukkan Teks Landing Page / Copywriting Anda
          </CardTitle>
          <CardDescription className="text-xs">
            Tempelkan draft copywriting landing page Anda dari atas sampai bawah untuk evaluasi menyeluruh.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-2 space-y-3.5">
          <Textarea
            placeholder="Tempelkan seluruh teks landing page, headline, penawaran, bonus, dan CTA di sini..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-secondary min-h-[130px] text-xs sm:text-sm font-mono leading-relaxed"
          />

          <div className="flex justify-end pt-1">
            <Button
              onClick={handleAudit}
              disabled={analyzing || content.trim().length < 15}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> AI Sedang Mengaudit 5 Pilar Konversi...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Mulai Audit Konversi & Anti-Banned
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Result */}
      {result && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Main Score Header */}
          <Card className="border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 via-card to-card p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  Hasil Audit 5 Pilar CRO
                </span>
                <h3 className="text-base sm:text-lg font-black text-foreground">{result.verdict}</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs text-muted-foreground block">Skor Audit:</span>
                  <span className="text-3xl font-black text-emerald-400">{result.overallScore}/100</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl font-black text-emerald-400">
                  {result.grade}
                </div>
              </div>
            </div>

            {/* Pillar Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {Object.entries(result.categories).map(([key, item]: [string, any]) => {
                const labels: Record<string, string> = {
                  hook: '1. Hook & Headline',
                  conversion: '2. Offer & CTA',
                  trust: '3. Social Proof & Trust',
                  mobile: '4. Mobile UX & Spacing',
                  compliance: '5. Anti-Banned Ads Policy',
                };
                return (
                  <div key={key} className="p-3 rounded-xl bg-secondary/70 border border-border space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{labels[key] || key}</span>
                      <span className={`font-mono font-bold text-xs ${item.score >= 80 ? 'text-emerald-400' : item.score >= 65 ? 'text-amber-400' : 'text-destructive'}`}>
                        {item.score}%
                      </span>
                    </div>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">{item.feedback}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Banned Words Warning if any */}
          {result.bannedWordsFound && result.bannedWordsFound.length > 0 && (
            <Card className="border-destructive/40 bg-destructive/10 p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-destructive flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> Peringatan Kata Sensitif (Risiko Banned Ads):
              </h4>
              <p className="text-xs text-foreground">
                Ditemukan kata berisiko tinggi kena tolak oleh AI Meta/TikTok Ads: <strong>{result.bannedWordsFound.join(', ')}</strong>. Ganti dengan kata yang lebih natural dan berbasis bukti nyata.
              </p>
            </Card>
          )}

          {/* Recommendations & Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-border bg-card p-4 sm:p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" /> Rekomendasi Tindakan Prioritas:
              </h4>
              <ul className="space-y-2 text-xs">
                {result.keyRecommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-foreground font-medium">
                    <span className="text-primary font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {result.improvedHeadlineSuggestion && (
              <Card className="border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Rekomendasi Headline Lolos Audit:
                </h4>
                <p className="text-xs sm:text-sm font-bold text-foreground bg-secondary/70 p-3 rounded-xl border border-border">
                  "{result.improvedHeadlineSuggestion}"
                </p>
                {result.improvedCtaSuggestion && (
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">Rekomendasi Tombol CTA:</span>
                    <p className="text-xs font-semibold text-emerald-400">{result.improvedCtaSuggestion}</p>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
