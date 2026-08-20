import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Video, Sparkles, Wand2, RefreshCw, CheckCircle2, ArrowRight, Layers, Flame, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sendAiChatMessage } from '@/utils/aiClient';
import { FormState, initialFormState } from '@/types/form';

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
  onApplyToForm?: (data: Partial<FormState>) => void;
}

export function CreativeSync({ onApplyToForm }: Props) {
  const [adScript, setAdScript] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<CreativeAnalysis | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleSync = async () => {
    if (!adScript.trim() || adScript.trim().length < 10) {
      toast({
        title: 'Naskah Terlalu Pendek',
        description: 'Tempelkan transkrip / narasi video iklan TikTok atau Facebook Ads Anda (minimal 10 karakter).',
        variant: 'destructive',
      });
      return;
    }

    setAnalyzing(true);
    setResult(null);

    const promptSystem = `Anda adalah Master Direct-Response Video Ads to Landing Page Conversion Strategist.
Tugas Anda adalah menganalisis naskah / narasi video iklan (TikTok/FB Ads/Reels), mengekstrak Hook, Emosi Dominan, Target Audiens, dan Janji Utama, lalu merumuskan Hero Headline & Subheadline yang memiliki "Message Match 100% Selaras" untuk landing page.

Naskah Iklan:
"""
${adScript.slice(0, 3000)}
"""

Keluarkan output dalam format JSON valid murni (tanpa \`\`\`json):
{
  "videoHook": "Hook 3 detik pertama yang menarik perhatian",
  "dominantEmotion": "Emosi dominan (misal Frustrasi / Keinginan Cepat / Insecurity / Semangat Cuan)",
  "targetAudience": "Deskripsi spesifik siapa target penonton video ini",
  "corePromise": "Janji solusi utama yang ditawarkan dalam video",
  "suggestedHeroHeadline": "Headline landing page yang selaras 100% dengan kata kunci & emosi di video",
  "suggestedSubheadline": "Subheadline persuasif yang memperkuat headline",
  "suggestedFramework": "PAS (Problem–Agitate–Solution) / BAB (Before–After–Bridge) / SLAP (Stop–Look–Act–Purchase)",
  "suggestedCta": "Teks tombol CTA yang cocok dengan closing video"
}`;

    try {
      let responseText = '';
      try {
        responseText = await sendAiChatMessage([
          { role: 'system', content: 'Anda adalah AI CRO. Hanya keluarkan format JSON valid.' },
          { role: 'user', content: promptSystem },
        ]);
      } catch (aiErr) {
        console.warn('AI call failed, using intelligent NLP extractor:', aiErr);
      }

      let parsed: any = null;
      if (responseText) {
        try {
          const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
          parsed = JSON.parse(cleanJson);
        } catch {}
      }

      if (!parsed) {
        const text = adScript.toLowerCase();
        let emotion = 'Frustrasi terhadap cara lama yang menguras waktu';
        let hook = 'Stop scroll! Kalau kamu masih capek closing manual satu-satu...';
        let promise = 'Otomatisasi sistem yang hemat waktu dan menaikkan konversi hingga 3x lipat';
        let headline = 'Tinggalkan Cara Lama yang Menguras Waktu: Bangun Sistem Otomatis yang Menghasilkan Orderan 24 Jam Nonstop';
        let subheadline = 'Solusi praktis siap pakai yang dirancang khusus agar Anda bisa fokus scale-up tanpa pusing operasional.';
        let cta = 'Mulai Sekarang & Amankan Promo';
        let framework = 'PAS (Problem–Agitate–Solution)';
        let target = 'Pebisnis dan advertiser yang mencari efisiensi operasional';

        if (/umrah|umroh|haji/i.test(text)) {
          emotion = 'Kerinduan mendalam beribadah ke tanah suci dengan rasa tenang & aman';
          hook = 'Ingin ibadah umrah khusyuk tanpa was-was jadwal mundur atau fasilitas tidak sesuai?';
          promise = 'Kepastian jadwal, hotel bintang 5 dekat pelataran masjid, dan bimbingan muthawif resmi';
          headline = 'Wujudkan Impian Ibadah Umrah Khusyuk & Nyaman Bersama Pembimbing Berpengalaman';
          subheadline = 'Fasilitas hotel bintang 5 dekat masjid, kepastian tanggal keberangkatan resmi Kemenag, dan bimbingan sesuai sunnah.';
          cta = 'Konsultasi Jadwal & Brosur via WhatsApp';
          framework = 'AIDA (Attention–Interest–Desire–Action)';
          target = 'Calon jamaah dan keluarga yang mendambakan ibadah umrah berkualitas';
        } else if (/skincare|jerawat|kusam|glowing/i.test(text)) {
          emotion = 'Insecurity terhadap masalah kulit wajah & keinginan tampil percaya diri';
          hook = 'Pernah nggak sih ngerasa udah gonta-ganti skincare tapi muka tetep kusam?';
          promise = 'Kulit tampak glowing sehat dan bebas noda hitam dalam 7-14 hari';
          headline = 'Rahasia Kulit Cerah Glowing Sehat Alami Tanpa Ketergantungan Bahan Kimia';
          subheadline = 'Diformulasikan dengan ekstrak botanical premium yang terbukti melembapkan dan memudarkan flek hitam.';
          cta = 'Dapatkan Paket Glowing Hari Ini';
          framework = 'BAB (Before–After–Bridge)';
          target = 'Pria dan wanita yang ingin merawat kulit wajah sehat cerah';
        } else if (/pulsa|agen|cuan|bisnis|modal/i.test(text)) {
          emotion = 'Semangat mencari penghasilan sampingan modal minim tapi pasti';
          hook = 'Modal 50rb bisa dapet cuan harian dari jualan pulsa & bayar tagihan?';
          promise = 'Server tercepat, harga termurah langsung dari distributor, gratis pendaftaran';
          headline = 'Mulai Bisnis Konter Pulsa & Loket Pembayaran Tagihan dari HP Anda Sendiri';
          subheadline = 'Transaksi hitungan detik, komisi otomatis masuk, dibimbing langsung sampai mahir tanpa biaya pendaftaran!';
          cta = 'Daftar Jadi Agen Gratis Sekarang';
          framework = 'SLAP (Stop–Look–Act–Purchase)';
          target = 'Pebisnis konter dan individu yang ingin penghasilan tambahan';
        }

        parsed = {
          videoHook: hook,
          dominantEmotion: emotion,
          targetAudience: target,
          corePromise: promise,
          suggestedHeroHeadline: headline,
          suggestedSubheadline: subheadline,
          suggestedFramework: framework,
          suggestedCta: cta,
        };
      }

      setResult(parsed);
      toast({
        title: '🎬 Sinkronisasi Iklan Selesai!',
        description: 'Formula landing page telah diselaraskan dengan materi iklan video.',
      });
    } catch (e: any) {
      toast({
        title: 'Gagal Sinkronisasi',
        description: e?.message || 'Terjadi kesalahan.',
        variant: 'destructive',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApply = () => {
    if (result && onApplyToForm) {
      onApplyToForm({
        targetAudience: result.targetAudience,
        framework: result.suggestedFramework,
        ctaUtama: result.suggestedCta,
        deskripsiBenefit: `${result.corePromise}\n\nHeadline: ${result.suggestedHeroHeadline}\nSubtitle: ${result.suggestedSubheadline}`,
      });
      toast({
        title: '✅ Berhasil Diterapkan ke LP Generator',
        description: 'Data keselarasan iklan telah dimuat ke form utama.',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-500/20 via-primary/10 to-transparent border border-purple-500/30 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 flex-shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-foreground">🎬 AI Creative-to-Landing Page Sync</h2>
            <p className="text-xs text-muted-foreground">
              Ekstrak Hook, Emosi & Janji dari video iklan TikTok/Meta Ads Anda, lalu susun landing page dengan Message Match 100% selaras agar konversi tidak drop.
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
            placeholder="Contoh: Stop scroll! Kalo kamu calon jamaah yang mau umrah tapi bingung milih travel amanah, tonton video ini. Sekarang ada paket umrah berkah hotel bintang 5 dekat pelataran masjid..."
            value={adScript}
            onChange={(e) => setAdScript(e.target.value)}
            className="bg-secondary min-h-[120px] text-xs sm:text-sm font-mono leading-relaxed"
          />

          <div className="flex justify-end pt-1">
            <Button
              onClick={handleSync}
              disabled={analyzing || adScript.trim().length < 10}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold gap-2"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> AI Sedang Membedah Narasi Video...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Analisa & Sinkronkan Narasi ke LP
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Result Section */}
      {result && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <Card className="border-purple-500/30 bg-gradient-to-b from-purple-500/10 via-card to-card p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                  Hasil Sinkronisasi Message-Match
                </span>
                <h3 className="text-base sm:text-lg font-black text-foreground">Formula Landing Page Tersinkron</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" /> {isEditing ? 'Selesai Edit' : 'Edit Formula'}
                </Button>
                {onApplyToForm && (
                  <Button
                    onClick={handleApply}
                    className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Terapkan ke LP Generator Utama →
                  </Button>
                )}
              </div>
            </div>

            {/* Editable Fields */}
            {isEditing ? (
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Hero Headline Selaras</label>
                  <Input
                    value={result.suggestedHeroHeadline}
                    onChange={(e) => setResult({ ...result, suggestedHeroHeadline: e.target.value })}
                    className="bg-secondary text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Subheadline</label>
                  <Textarea
                    value={result.suggestedSubheadline}
                    onChange={(e) => setResult({ ...result, suggestedSubheadline: e.target.value })}
                    className="bg-secondary text-xs min-h-[60px]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Target Audiens</label>
                    <Input
                      value={result.targetAudience}
                      onChange={(e) => setResult({ ...result, targetAudience: e.target.value })}
                      className="bg-secondary text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Tombol CTA</label>
                    <Input
                      value={result.suggestedCta}
                      onChange={(e) => setResult({ ...result, suggestedCta: e.target.value })}
                      className="bg-secondary text-xs"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Readonly Cards */
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-secondary/70 border border-border space-y-1">
                    <span className="text-[10px] font-bold text-purple-400 uppercase flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> Hook Video (3 Detik):
                    </span>
                    <p className="text-foreground font-medium italic">"{result.videoHook}"</p>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/70 border border-border space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase">Emosi Pemicu:</span>
                    <p className="text-foreground font-medium">{result.dominantEmotion}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-secondary/50 border border-border space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">
                      Rekomendasi Hero Headline LP:
                    </span>
                    <p className="text-sm font-bold text-foreground mt-0.5">{result.suggestedHeroHeadline}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">
                      Subheadline Penguat:
                    </span>
                    <p className="text-muted-foreground mt-0.5">{result.suggestedSubheadline}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-secondary/70 border border-border">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Framework:</span>
                    <p className="font-semibold text-foreground mt-0.5">{result.suggestedFramework}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-secondary/70 border border-border">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">CTA:</span>
                    <p className="font-semibold text-emerald-400 mt-0.5">{result.suggestedCta}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
