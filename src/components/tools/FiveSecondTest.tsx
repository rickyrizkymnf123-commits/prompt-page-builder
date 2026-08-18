import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Timer, CheckCircle2, XCircle, AlertTriangle, Sparkles, RefreshCw, HelpCircle, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClarityAnswer {
  question: string;
  status: 'clear' | 'warning' | 'unclear';
  detectedAnswer: string;
  recommendation: string;
}

interface TestResult {
  overallScore: number;
  verdict: string;
  answers: ClarityAnswer[];
  quickFixSuggestion: string;
}

export function FiveSecondTest() {
  const [content, setContent] = useState('');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const { toast } = useToast();

  const handleTest = () => {
    if (!content.trim() || content.trim().length < 20) {
      toast({
        title: 'Teks Terlalu Pendek',
        description: 'Tempelkan bagian atas (Hero Section / Headline) landing page Anda minimal 20 karakter.',
        variant: 'destructive',
      });
      return;
    }

    setTesting(true);

    setTimeout(() => {
      const text = content.toLowerCase();
      const hasProduct = /aplikasi|bot|suplemen|kursus|template|jasa|layanan|produk|buku|ebook|skincare|pulsa|server/i.test(text);
      const hasAudience = /untuk|bagi|kamu|anda|owner|pebisnis|ibu|pria|wanita|pemula|agen|reseller/i.test(text);
      const hasBenefit = /hemat|menaikkan|cepat|mudah|cuan|profit|glowing|bebas|otomatis|solusi|garansi/i.test(text);
      const hasHook = /stop|rahasia|terbukti|dapatkan|jangan|bayangkan|hanya|terbatas|sekarang/i.test(text);

      let score = 50;
      if (hasProduct) score += 15;
      if (hasAudience) score += 15;
      if (hasBenefit) score += 10;
      if (hasHook) score += 10;

      const answers: ClarityAnswer[] = [
        {
          question: '1. Ini jualan apa?',
          status: hasProduct ? 'clear' : 'unclear',
          detectedAnswer: hasProduct ? 'Jenis produk/layanan dapat diidentifikasi dalam 2 detik pertama.' : 'Belum jelas apakah ini fisik, software, jasa, atau edukasi.',
          recommendation: hasProduct ? 'Pertahankan ketegasan nama kategori produk.' : 'Tuliskan kategori produk secara eksplisit pada subheadline (misal: "Aplikasi Kasir Otomatis" atau "Serum Pencerah Wajah").',
        },
        {
          question: '2. Ini buat siapa?',
          status: hasAudience ? 'clear' : 'warning',
          detectedAnswer: hasAudience ? 'Target audiens spesifik telah disebutkan atau tersirat jelas.' : 'Target audiens masih terlalu luas / ambigu.',
          recommendation: hasAudience ? 'Sangat baik, audiens merasa diajak bicara secara personal.' : 'Tambahkan kualifikasi target di atas headline (misal: "Khusus untuk Business Owner & Advertiser").',
        },
        {
          question: '3. Apa manfaat utamanya?',
          status: hasBenefit ? 'clear' : 'unclear',
          detectedAnswer: hasBenefit ? 'Janji hasil / manfaat konkret langsung terlihat.' : 'Manfaat masih abstrak dan belum menonjolkan hasil akhir.',
          recommendation: hasBenefit ? 'Manfaat sudah kuat dan menggugah minat.' : 'Fokuskan pada transformasi hidup pembeli: berapa waktu yang dihemat atau keuntungan yang didapat.',
        },
        {
          question: '4. Kenapa saya harus lanjut baca?',
          status: hasHook ? 'clear' : 'warning',
          detectedAnswer: hasHook ? 'Terdapat rasa penasaran / urgensi yang membuat pembeli scroll ke bawah.' : 'Alasan lanjut baca masih kurang mendesak.',
          recommendation: hasHook ? 'Hook berhasil mengikat perhatian pengunjung.' : 'Tambahkan penawaran terbatas atau statistik mengejutkan yang memicu rasa ingin tahu.',
        },
      ];

      let verdict = 'Landing page memiliki pemahaman cepat yang sangat baik!';
      if (score < 75) {
        verdict = 'Pengunjung masih butuh lebih dari 5 detik untuk memahami inti penawaran Anda.';
      }

      setResult({
        overallScore: score,
        verdict,
        answers,
        quickFixSuggestion: 'Tambahkan eyebrow tag di atas judul: [Kategori Produk] Khusus untuk [Target Audiens], lalu jadikan headline sebagai [Janji Hasil Utama].',
      });

      setTesting(false);
      toast({ title: '⏱️ Tes 5 Detik Selesai', description: `Skor Pemahaman Cepat: ${score}/100` });
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-primary/10 to-transparent border border-amber-500/30 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-foreground">⏱️ Tes 5 Detik (5-Second Landing Page Clarity Test)</h2>
            <p className="text-xs text-muted-foreground">
              Simulasi pengunjung baru: Cek apakah dalam 5 detik pertama orang langsung paham apa yang Anda jual, untuk siapa, dan kenapa harus lanjut baca.
            </p>
          </div>
        </div>
      </div>

      {/* Input Card */}
      <Card className="border-border bg-card">
        <CardHeader className="p-4 sm:p-6 pb-2">
          <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Tempelkan Headline & Hero Section Landing Page Anda
          </CardTitle>
          <CardDescription className="text-xs">
            Cukup bagian atas (Judul Utama, Subjudul, dan Kalimat Pembuka) yang pertama kali dilihat saat website dibuka.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-2 space-y-3.5">
          <Textarea
            placeholder="Contoh: 
[Judul]: Bot Auto-Closing WhatsApp yang Membalas Pesan 24 Jam Tanpa Libur
[Subjudul]: Solusi bagi pebisnis online dan advertiser yang lelah membalas chat satu-satu tapi konversi rendah. Otomatisasi follow-up dan tingkatkan omset 3x lipat!"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-secondary min-h-[110px] text-xs sm:text-sm font-mono leading-relaxed"
          />

          <div className="flex justify-end pt-1">
            <Button
              onClick={handleTest}
              disabled={testing || content.trim().length < 20}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold gap-2"
            >
              {testing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Menjalankan Simulasi 5 Detik...
                </>
              ) : (
                <>
                  <Timer className="w-4 h-4" /> Uji Pemahaman 5 Detik Sekarang
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {result && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <Card className="border-amber-500/40 bg-gradient-to-b from-amber-500/10 to-card p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Hasil Evaluasi Cepat</span>
                <h3 className="text-base sm:text-lg font-black text-foreground">{result.verdict}</h3>
              </div>
              <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-2xl border border-border flex-shrink-0">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-black text-amber-500">{result.overallScore}</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">Skor Clarity</div>
                </div>
              </div>
            </div>

            {/* 4 Questions Evaluation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.answers.map((item, idx) => {
                const isClear = item.status === 'clear';
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border space-y-1.5 transition-all ${
                      isClear ? 'bg-secondary/70 border-emerald-500/30' : 'bg-amber-500/5 border-amber-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-foreground">{item.question}</h4>
                      {isClear ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Jelas
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Kurang Jelas
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-foreground/90 font-medium">{item.detectedAnswer}</p>
                    <p className="text-[11px] text-muted-foreground italic pt-1 border-t border-border/40">
                      💡 Saran: {item.recommendation}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Formula Quick Fix */}
            <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/25 space-y-1.5">
              <span className="text-xs font-bold text-primary flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Rumus Quick-Fix 5 Detik:
              </span>
              <p className="text-xs sm:text-sm text-foreground font-semibold">
                "{result.quickFixSuggestion}"
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
