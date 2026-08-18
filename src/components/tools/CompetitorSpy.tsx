import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, Sparkles, AlertCircle, CheckCircle2, Target, Zap, Shield, ArrowRight, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SpyAnalysis {
  competitorUrl: string;
  niche: string;
  headlineHook: {
    analysis: string;
    score: number;
    rating: string;
  };
  funnelStructure: {
    stages: string[];
    weaknesses: string[];
  };
  offerPricing: {
    strategy: string;
    estimatedPrice: string;
    bonusValue: string;
  };
  unexploitedAngles: string[];
  recommendedCounterStrategy: string;
}

interface Props {
  onApplyStrategy?: (strategyPrompt: string) => void;
}

export function CompetitorSpy({ onApplyStrategy }: Props) {
  const [url, setUrl] = useState('');
  const [competitorCopy, setCompetitorCopy] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<SpyAnalysis | null>(null);
  const { toast } = useToast();

  const handleAnalyze = () => {
    if (!url.trim() && !competitorCopy.trim()) {
      toast({ title: 'Masukkan URL atau Teks', description: 'Masukkan URL landing page kompetitor atau tempel naskah mereka.', variant: 'destructive' });
      return;
    }

    setAnalyzing(true);

    setTimeout(() => {
      const rawText = (url + ' ' + competitorCopy).toLowerCase();
      const isSkincare = /skincare|glowing|jerawat|kulit|beauty|serum/i.test(rawText);
      const isCourse = /kursus|kelas|webinar|ecourse|mentoring|belajar/i.test(rawText);
      const isAgen = /pulsa|ppob|agen|reload|mitra|server/i.test(rawText);

      let niche = 'Produk Digital & Solusi Bisnis';
      let unexploited = [
        'Belum menonjolkan garansi kepuasan tanpa resiko (Risk Reversal).',
        'Struktur CTA terlalu jauh di bawah, kehilangan pembeli impulsif.',
        'Copywriting terlalu fokus pada fitur teknis, bukan transformasi emosional pembeli.',
        'Tidak ada social proof angka / studi kasus alumni terverifikasi.',
      ];

      if (isSkincare) {
        niche = 'Beauty & Skincare';
        unexploited = [
          'Kompetitor belum mengedukasi bahaya merkuri/bahan kimia kompetitor lain.',
          'Tidak ada video before-after pemakaian real 7 hari.',
          'Belum ada bundle hemat dengan free gift yang menggoda.',
        ];
      } else if (isCourse) {
        niche = 'Edukasi & Digital Course';
        unexploited = [
          'Kompetitor hanya menjual rekaman video tanpa support grup & bimbingan 1:1.',
          'Kurang penekanan pada roadmap pemula dari nol sampai pecah telur.',
        ];
      } else if (isAgen) {
        niche = 'Server Pulsa & PPOB';
        unexploited = [
          'Kompetitor tidak menampilkan kecepatan transaksi detik & CS 24 jam responsif.',
          'Belum ada fasilitas spanduk toko gratis untuk agen baru.',
        ];
      }

      setResult({
        competitorUrl: url.trim() || 'Teks Kompetitor yang Dianalisa',
        niche,
        headlineHook: {
          analysis: 'Hook kompetitor cenderung menggunakan pola klaim langsung (Direct Promise) namun minim resonansi rasa sakit (Pain Point).',
          score: 72,
          rating: 'Standar / Bisa Dikalahkan',
        },
        funnelStructure: {
          stages: ['Hero Headline Klaim', 'List Fitur Produk', 'Tabel Harga', 'Testimoni Gambar', 'Tombol Checkout'],
          weaknesses: [
            'Minim elemen Agitate (tidak memperdalam dampak kerugian jika tidak beli).',
            'Tidak ada countdown / urgency real-time (traffic menunda beli).',
            'Tidak ada WhatsApp Auto-Closing support langsung.',
          ],
        },
        offerPricing: {
          strategy: 'Single Price Diskon 50% Standar',
          estimatedPrice: 'Kisaran Pasar',
          bonusValue: 'Minim bonus bernilai tinggi',
        },
        unexploitedAngles: unexploited,
        recommendedCounterStrategy: `Gunakan framework PAS (Problem-Agitate-Solution) dengan menekankan: 1) Garansi pasti, 2) Bonus eksklusif bernilai tinggi, 3) Urgency sisa slot agar traffic kompetitor beralih ke produk Anda.`,
      });

      setAnalyzing(false);
      toast({ title: '🕵️‍♂️ Analisa Kompetitor Selesai', description: 'Celah dan strategi counter-offer siap digunakan.' });
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-red-500/20 via-primary/10 to-transparent border border-red-500/30 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/30 flex-shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-foreground">🕵️‍♂️ AI Competitor Spy Tool</h2>
            <p className="text-xs text-muted-foreground">
              Bongkar kelemahan landing page kompetitor, struktur funnel mereka, dan temukan celah *Unfair Advantage* untuk mendominasi pasar.
            </p>
          </div>
        </div>
      </div>

      {/* Input Card */}
      <Card className="border-border bg-card">
        <CardHeader className="p-4 sm:p-6 pb-2">
          <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" />
            Masukkan URL atau Copywriting Kompetitor
          </CardTitle>
          <CardDescription className="text-xs">
            Tempelkan link landing page kompetitor Anda, atau salin teks headline & penawaran mereka.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-2 space-y-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">URL Landing Page Kompetitor</label>
            <Input
              placeholder="https://kompetitor-anda.com/promo-produk..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-secondary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Atau Tempelkan Naskah / Teks Penawaran Mereka (Opsional)</label>
            <Textarea
              placeholder="Salin teks headline, benefit, harga, atau copywriting kompetitor di sini..."
              value={competitorCopy}
              onChange={(e) => setCompetitorCopy(e.target.value)}
              className="bg-secondary min-h-[90px] text-xs font-mono"
            />
          </div>

          <div className="flex justify-end pt-1">
            <Button
              onClick={handleAnalyze}
              disabled={analyzing || (!url.trim() && !competitorCopy.trim())}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold gap-2"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Membedah Landing Page Kompetitor...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" /> Bedah Kompetitor Sekarang
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {result && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Main Card */}
          <Card className="border-red-500/30 bg-gradient-to-b from-red-500/10 to-card p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Niche Terdeteksi: {result.niche}</span>
                <h3 className="text-lg font-black text-foreground mt-0.5">Analisis Kekuatan & Kelemahan Kompetitor</h3>
              </div>
              <div className="bg-secondary px-3 py-1.5 rounded-xl border border-border text-center flex-shrink-0">
                <span className="text-xs font-bold text-amber-500">{result.headlineHook.rating}</span>
                <span className="text-[10px] text-muted-foreground block">Skor: {result.headlineHook.score}/100</span>
              </div>
            </div>

            {/* 3 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Funnel & Weaknesses */}
              <div className="p-3.5 rounded-xl bg-secondary/60 border border-border space-y-2">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-500" /> Celah & Kelemahan Kompetitor:
                </h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {result.funnelStructure.weaknesses.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-destructive font-bold">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Unexploited Angles */}
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Angle Emas yang Belum Mereka Pakai:
                </h4>
                <ul className="space-y-1 text-xs text-foreground/90">
                  {result.unexploitedAngles.map((a, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Counter Strategy */}
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 space-y-2">
              <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-primary" /> Rekomendasi Strategi Menang (Counter-Offer):
              </h4>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                {result.recommendedCounterStrategy}
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
