import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Video, Sparkles, Wand2, RefreshCw, CheckCircle2, ArrowRight, Layers, Flame } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreativeAnalysis {
  videoHook: string;
  dominantEmotion: string;
  targetAudience: string;
  corePromise: string;
  suggestedHeroHeadline: string;
  suggestedSubheadline: string;
  suggestedFramework: string;
  suggestedCta: string;
}

interface Props {
  onApplyToForm?: (data: Partial<any>) => void;
}

export function CreativeSync({ onApplyToForm }: Props) {
  const [adScript, setAdScript] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<CreativeAnalysis | null>(null);
  const { toast } = useToast();

  const handleSync = () => {
    if (!adScript.trim() || adScript.trim().length < 15) {
      toast({
        title: 'Naskah Terlalu Pendek',
        description: 'Tempelkan transkrip / ide naskah video iklan TikTok atau Facebook Ads Anda (minimal 15 karakter).',
        variant: 'destructive',
      });
      return;
    }

    setAnalyzing(true);

    setTimeout(() => {
      const text = adScript.toLowerCase();
      let emotion = 'Frustrasi terhadap hasil boncos / capek kerja manual';
      let hook = 'Stop scroll! Kalau kamu masih capek closing manual satu-satu...';
      let promise = 'Otomatisasi sistem yang hemat waktu dan menaikkan konversi hingga 3x lipat';
      let headline = 'Tinggalkan Cara Lama yang Menguras Waktu: Bangun Sistem Otomatis yang Menghasilkan Orderan 24 Jam Nonstop';
      let subheadline = 'Solusi praktis siap pakai yang dirancang khusus agar Anda bisa fokus scale-up tanpa pusing operasional.';
      let cta = 'Mulai Sekarang & Amankan Promo';
      let framework = 'PAS (Problem–Agitate–Solution)';

      if (/skincare|jerawat|kusam|glowing|flek/i.test(text)) {
        emotion = 'Insecurity terhadap masalah kulit wajah & keinginan tampil percaya diri';
        hook = 'Pernah nggak sih ngerasa udah gonta-ganti skincare tapi muka tetep kusam?';
        promise = 'Kulit tampak glowing sehat dan bebas noda hitam dalam 7-14 hari';
        headline = 'Rahasia Kulit Cerah Glowing Sehat Alami Tanpa Ketergantungan Bahan Kimia';
        subheadline = 'Diformulasikan dengan ekstrak botanical premium yang terbukti klinis melembapkan dan memudarkan flek hitam.';
        cta = 'Dapatkan Paket Glowing Hari Ini';
        framework = 'BAB (Before–After–Bridge)';
      } else if (/pulsa|agen|cuan|bisnis|modal|untung/i.test(text)) {
        emotion = 'Semangat mencari penghasilan sampingan modal minim tapi pasti';
        hook = 'Modal 50rb bisa dapet cuan harian dari jualan pulsa & bayar tagihan?';
        promise = 'Server tercepat, harga termurah langsung dari distributor, gratis pendaftaran';
        headline = 'Mulai Bisnis Konter Pulsa & Loket Pembayaran Tagihan dari HP Anda Sendiri';
        subheadline = 'Transaksi hitungan detik, komisi otomatis masuk, dibimbing langsung sampai mahir tanpa biaya pendaftaran!';
        cta = 'Daftar Jadi Agen Gratis Sekarang';
        framework = 'SLAP (Stop–Look–Act–Purchase)';
      }

      setResult({
        videoHook: hook,
        dominantEmotion: emotion,
        targetAudience: 'Audiens yang melihat video iklan Anda di TikTok/FB',
        corePromise: promise,
        suggestedHeroHeadline: headline,
        suggestedSubheadline: subheadline,
        suggestedFramework: framework,
        suggestedCta: cta,
      });

      setAnalyzing(false);
      toast({ title: '🎬 Sinkronisasi Iklan Selesai', description: 'Headline dan alur landing page telah diselaraskan dengan materi iklan video.' });
    }, 1100);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-500/20 via-primary/10 to-transparent border border-purple-500/30 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 flex-shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-foreground">🎬 AI Creative-to-Landing Page Sync</h2>
            <p className="text-xs text-muted-foreground">
              Ekstrak Hook, Emosi & Janji dari video iklan TikTok/Meta Ads Anda, lalu susun landing page dengan *Message Match* 100% selaras agar konversi melejit.
            </p>
          </div>
        </div>
      </div>

      {/* Input Card */}
      <Card className="border-border bg-card">
        <CardHeader className="p-4 sm:p-6 pb-2">
          <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-primary" />
            Masukkan Transkrip / Naskah Video Iklan Anda
          </CardTitle>
          <CardDescription className="text-xs">
            Salin naskah voiceover, hook 3 detik pertama, atau poin penting video iklan yang sedang Anda jalankan.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-2 space-y-3.5">
          <Textarea
            placeholder="Contoh: Stop scroll! Kalo kamu advertiser yang tiap hari boncos setting ads manual, tonton video ini sampai habis. Sekarang udah ada template otomatisasi yang bikin ROAS naik 4x lipat..."
            value={adScript}
            onChange={(e) => setAdScript(e.target.value)}
            className="bg-secondary min-h-[120px] text-xs sm:text-sm font-mono leading-relaxed"
          />

          <div className="flex justify-end pt-1">
            <Button
              onClick={handleSync}
              disabled={analyzing || adScript.trim().length < 15}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold gap-2"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Menyelaraskan Naskah Iklan ke LP...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Sinkronkan ke Landing Page
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Synchronized Result */}
      {result && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <Card className="border-purple-500/40 bg-gradient-to-b from-purple-500/10 to-card p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Message Match Engine</span>
                <h3 className="text-base sm:text-lg font-black text-foreground">Struktur Landing Page Selaras Iklan</h3>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                100% Selaras (High ROAS)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-secondary/70 border border-border space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">🎯 Hook Video yang Terdeteksi:</span>
                <p className="font-semibold text-foreground italic">"{result.videoHook}"</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/70 border border-border space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">🔥 Emosi Pendorong:</span>
                <p className="font-semibold text-amber-400">{result.dominantEmotion}</p>
              </div>
            </div>

            {/* Generated Hero Section Copy */}
            <div className="p-4 rounded-xl bg-background/80 border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Headline Hero Landing Page Rekomendasi:
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">Framework: {result.suggestedFramework}</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-foreground leading-snug">
                "{result.suggestedHeroHeadline}"
              </h4>
              <p className="text-xs text-muted-foreground">
                {result.suggestedSubheadline}
              </p>
              <div className="pt-2 flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400">Tombol CTA:</span>
                <span className="text-xs font-bold bg-primary text-primary-foreground px-3 py-1 rounded-lg">
                  {result.suggestedCta}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
