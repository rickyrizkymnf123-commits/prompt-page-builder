import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, Sparkles, Check, ArrowRight } from 'lucide-react';

export interface FrameworkInfo {
  name: string;
  group: string;
  structure: string;
  summary: string;
  bestFor: string;
  example: string;
}

export const frameworkDetails: FrameworkInfo[] = [
  // A. CONVERSION FOCUSED
  {
    name: 'PAS (Problem–Agitate–Solution)',
    group: 'Conversion Focused',
    structure: 'Problem (Masalah) → Agitate (Perparah Dampak) → Solution (Solusi)',
    summary: 'Framework paling populer dan ampuh untuk produk yang memecahkan rasa sakit / frustrasi pembeli.',
    bestFor: 'Produk solusi masalah mendesak (obat/herbal, kursus atasi kebangkrutan, software otomatisasi, tools hemat waktu).',
    example: 'Capek closing boncos terus? (Problem) Tiap bulan bayar ads jutaan tapi nol sales, mental capek dompet terkuras. (Agitate) Kenalkan Bot Auto-Closing AI yang balas pesan 24 jam nonstop! (Solution)',
  },
  {
    name: 'AIDCA',
    group: 'Conversion Focused',
    structure: 'Attention (Perhatian) → Interest (Minat) → Desire (Hasrat) → Conviction (Keyakinan/Bukti) → Action (Beli)',
    summary: 'Struktur klasik terlengkap untuk membangun kepercayaan dari awal hingga konversi dengan bukti kuat.',
    bestFor: 'Produk dengan banyak testimoni, studi kasus, garansi, atau produk bernilai tinggi (high-ticket).',
    example: 'Gunakan headline bombastis (A), data statistik mengejutkan (I), visual transformasi impian (D), screenshot testimoni ratusan member (C), lalu CTA tombol diskon terbatas (A).',
  },
  {
    name: 'BAB (Before–After–Bridge)',
    group: 'Conversion Focused',
    structure: 'Before (Kondisi Dulu) → After (Kondisi Impian) → Bridge (Jembatan Produk)',
    summary: 'Memperlihatkan kontras drastis antara kondisi hidup yang buruk saat ini dengan masa depan cerah setelah memakai produk.',
    bestFor: 'Skincare, fitness & diet, resep masakan, template siap pakai, kursus skill baru.',
    example: 'Dulu: Butuh 5 jam cuma buat desain 1 flyer. Sekarang: 2 menit beres tinggal drag & drop berkat 1000+ Template Canva Siap Pakai!',
  },
  {
    name: '4P (Promise–Picture–Proof–Push)',
    group: 'Conversion Focused',
    structure: 'Promise (Janji Besar) → Picture (Gambaran Hasil) → Proof (Bukti & Angka) → Push (Dorongan Kuat)',
    summary: 'Memberikan janji berani di awal, melukiskan hidup pelanggan dengan indah, lalu memperkuatnya dengan bukti tak terbantahkan.',
    bestFor: 'Webinar, program mentoring, agency jasa, penawaran diskon hari ini.',
    example: 'Kuasai Skill Copywriting dalam 7 Hari (Promise). Bayangkan banjir orderan tiap posting (Picture). Sudah terbukti pada 1.400+ alumni (Proof). Daftar sekarang sebelum slot habis! (Push)',
  },
  {
    name: 'SLAP (Stop–Look–Act–Purchase)',
    group: 'Conversion Focused',
    structure: 'Stop (Hentikan Scroll) → Look (Lihat Tawaran) → Act (Ambil Tindakan) → Purchase (Beli)',
    summary: 'Format super cepat dan to-the-point untuk impulsif buyers dan flash sale harga murah.',
    bestFor: 'Produk low-ticket (ebook Rp 49rb, voucher, template murah, flash sale).',
    example: 'STOP! Jangan beli template lain sebelum lihat paket 50-in-1 ini. Cuma Rp 49.000 khusus hari ini, klik beli!',
  },

  // B. STORYTELLING & BRAND
  {
    name: 'StoryBrand',
    group: 'Storytelling & Brand',
    structure: 'Karakter (Pelanggan) → Punya Masalah → Bertemu Pemandu (Anda) → Diberi Rencana → Sukses / Hindari Gagal',
    summary: 'Jadikan pembeli sebagai PAHLAWAN cerita, bukan produk Anda. Produk Anda hanyalah senjata/pemandu bijak yang membantunya menang.',
    bestFor: 'Brand premium, SaaS/Software, jasa konsultasi, kursus profesional, personal branding.',
    example: 'Anda ingin bisnis berkembang tanpa terjebak operasional? Kami hadir membimbing Anda membangun sistem autopilot 3 langkah.',
  },
  {
    name: 'Hero\'s Journey',
    group: 'Storytelling & Brand',
    structure: 'Titik Terendah → Panggilan Petualangan → Rintangan Berat → Penemuan Rahasia → Kemenangan',
    summary: 'Kisah nyata pendiri / alumni yang menyentuh emosi pembeli karena mereka merasakan nasib yang sama.',
    bestFor: 'Buku biografi, kursus mindset, affiliate marketing, produk edukasi finansial.',
    example: 'Cerita bagaimana seorang kurir motor berhutang 50 juta bisa membangun toko online omset 100 juta/bulan dengan metode ini.',
  },
  {
    name: 'HSO (Hook–Story–Offer)',
    group: 'Storytelling & Brand',
    structure: 'Hook (Kait Perhatian) → Story (Cerita Mengikat) → Offer (Penawaran Spesial)',
    summary: 'Formula andalan Russell Brunson (ClickFunnels) untuk mengonversi traffic dingin (cold traffic) dari iklan TikTok & Facebook.',
    bestFor: 'Landing page iklan ads Facebook / TikTok / Instagram Reels.',
    example: 'Hook visual yang memancing penasaran → Cerita singkat relatable → Penawaran bundle tidak masuk akal murahnya.',
  },
  {
    name: 'ABT (And–But–Therefore)',
    group: 'Storytelling & Brand',
    structure: 'And (Fakta 1 & Fakta 2) → But (Tetapi ada kendala besar) → Therefore (Oleh karena itu solusinya)',
    summary: 'Struktur narasi ultra-padat 3 kalimat yang membuat pesan langsung nancep di kepala audiens.',
    bestFor: 'Pitching cepat, headline landing page, email broadcast.',
    example: 'Anda ingin omset naik DAN punya banyak waktu luang, TETAPI karyawan selalu bikin salah, OLEH KARENA ITU Anda butuh SOP Template ini.',
  },

  // C. DIAGNOSTIC & EDUCATIONAL
  {
    name: 'QUEST',
    group: 'Diagnostic & Educational',
    structure: 'Qualify (Kualifikasi Target) → Understand (Pahami Masalah) → Educate (Edukasi) → Stimulate (Gugah Minat) → Transition (Ajak Beli)',
    summary: 'Menyaring audiens yang tepat sejak awal, memberikan edukasi nilai tinggi, lalu mengajak membeli secara halus.',
    bestFor: 'B2B, workshop mahal, program seleksi, konsultasi privat.',
    example: 'Khusus untuk Business Owner dengan omset minimal 50jt/bulan yang ingin ekspansi cabang tanpa ribet manajemen.',
  },
  {
    name: 'JTBD (Jobs To Be Done)',
    group: 'Diagnostic & Educational',
    structure: 'Situasi Saat Ini → Hasil yang Diinginkan (Job) → Hambatan → Transformasi Produk',
    summary: 'Fokus pada hasil konkret yang ingin dicapai pelanggan (pembeli tidak membeli bor 1/4 inch, mereka membeli lubang 1/4 inch di tembok).',
    bestFor: 'Produk produktivitas, SaaS, peralatan kerja, jasa outsourcing.',
    example: 'Bukan sekadar aplikasi kasir, tapi cara agar Anda bisa liburan keluarga sementara toko tetap buka dan tercatat rapi.',
  },
  {
    name: 'Awareness Ladder',
    group: 'Diagnostic & Educational',
    structure: 'Unaware → Problem Aware → Solution Aware → Product Aware → Most Aware',
    summary: 'Membimbing audiens dari yang sama sekali tidak paham sampai menjadi pembeli fanatik langkah demi langkah.',
    bestFor: 'Produk baru, kategori inovatif, edukasi pasar yang belum matang.',
    example: 'Menjelaskan bahaya radiasi gadget (Problem) → Mengapa kacamata biasa tidak cukup (Solution) → Keunggulan lensa X kami (Product).',
  },
  {
    name: 'FAB (Features–Advantages–Benefits)',
    group: 'Diagnostic & Educational',
    structure: 'Feature (Fitur) → Advantage (Keunggulan) → Benefit (Manfaat Nyata bagi Hidup Anda)',
    summary: 'Menerjemahkan spesifikasi teknis menjadi manfaat emosional yang dirasakan langsung oleh pembeli.',
    bestFor: 'Gadget, elektronik, aplikasi mobile, produk teknis, suplemen.',
    example: 'Baterai 5000 mAh (Feature) → Tahan 48 jam (Advantage) → Anda tidak perlu panik kehabisan baterai saat traveling seharian (Benefit).',
  },

  // D. ADVANCED
  {
    name: 'PASTOR',
    group: 'Advanced / Hybrid',
    structure: 'Problem → Amplify → Story → Transformation → Offer → Response',
    summary: 'Framework komprehensif karya Ray Edwards untuk landing page format panjang (Long-form Sales Page) berkonversi jutaan rupiah.',
    bestFor: 'Long-form sales page, ecourse lengkap, produk fisik eksklusif, program tahunan.',
    example: 'Struktur naratif lengkap yang menyentuh logika, emosi, bukti sosial, penanganan keberatan, dan penawaran bergaransi.',
  },
];

interface Props {
  selectedFramework?: string;
  onSelectFramework: (name: string) => void;
}

export function FrameworkGuideModal({ selectedFramework, onSelectFramework }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  const groups = ['all', 'Conversion Focused', 'Storytelling & Brand', 'Diagnostic & Educational', 'Advanced / Hybrid'];

  const filtered = frameworkDetails.filter(f => {
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.summary.toLowerCase().includes(search.toLowerCase()) || f.bestFor.toLowerCase().includes(search.toLowerCase());
    const matchGroup = selectedGroup === 'all' || f.group.toLowerCase().includes(selectedGroup.toLowerCase());
    return matchSearch && matchGroup;
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20 hover:bg-primary/20 transition-all"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Panduan Lengkap Model Framework ℹ️</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-4 sm:p-6 bg-card border-border">
        <DialogHeader className="border-b border-border pb-3">
          <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Panduan Singkat Model Framework Copywriting
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Pilih model framework yang paling pas dengan tujuan dan jenis produk landing page Anda.
          </p>
        </DialogHeader>

        {/* Filter & Search */}
        <div className="space-y-2 py-3 border-b border-border">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Cari nama framework, kegunaan, contoh..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs sm:text-sm bg-secondary"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {groups.map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGroup(g)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all border ${
                  selectedGroup === g
                    ? 'bg-primary text-primary-foreground border-primary font-semibold'
                    : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
                }`}
              >
                {g === 'all' ? 'Semua Kategori' : g}
              </button>
            ))}
          </div>
        </div>

        {/* List of Frameworks */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-2">
          {filtered.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground py-8">Framework tidak ditemukan.</p>
          ) : (
            filtered.map((item) => {
              const isSelected = selectedFramework === item.name || selectedFramework?.includes(item.name.split(' ')[0]);
              return (
                <div
                  key={item.name}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all space-y-2 ${
                    isSelected
                      ? 'bg-primary/10 border-primary shadow-sm shadow-primary/20 ring-1 ring-primary'
                      : 'bg-secondary/40 border-border hover:border-primary/40 hover:bg-secondary/70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm sm:text-base text-foreground">{item.name}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                          {item.group}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-amber-500 mt-0.5">{item.structure}</p>
                    </div>
                    <Button
                      size="sm"
                      variant={isSelected ? 'default' : 'outline'}
                      onClick={() => {
                        onSelectFramework(item.name);
                        setOpen(false);
                      }}
                      className="gap-1 text-xs h-8 flex-shrink-0"
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Terpilih
                        </>
                      ) : (
                        <>
                          Gunakan Framework Ini <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-foreground/90 leading-relaxed">{item.summary}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="p-2 rounded-lg bg-background/60 border border-border/50">
                      <p className="font-semibold text-primary mb-0.5">🎯 Sangat Cocok Untuk:</p>
                      <p className="text-muted-foreground">{item.bestFor}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-background/60 border border-border/50">
                      <p className="font-semibold text-emerald-500 mb-0.5">💡 Contoh Penerapan:</p>
                      <p className="text-muted-foreground italic">"{item.example}"</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
