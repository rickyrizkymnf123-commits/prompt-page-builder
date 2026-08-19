import { FormState } from '@/types/form';

export function generatePrompt(form: FormState): string {
  const activeElements = Object.entries(form.elemenTambahan || {}).filter(([, v]) => v).map(([k]) => k);
  const awarenessMap: Record<string, string> = {
    'Unaware (Belum sadar)': 'Unaware (Audiens belum menyadari ada masalah, butuh cerita/hook rasa penasaran)',
    'Problem Aware (Tahu masalah)': 'Problem Aware (Audiens merasakan problem nyata dan butuh solusi tuntas)',
    'Solution Aware (Cari solusi)': 'Solution Aware (Audiens sedang mencari & membandingkan solusi terbaik)',
    'Product Aware (Tahu produk)': 'Product Aware (Audiens sudah tahu produk ini tapi butuh pemicu penawaran kuat)',
    'Most Aware (Siap beli)': 'Most Aware (Audiens siap checkout, butuh penawaran tak terbantahkan & scarcity)',
  };
  const awarenessLevel = awarenessMap[form.levelAwareness] || form.levelAwareness || 'Problem Aware';
  const fmt = (v: string) => v ? `Rp ${Number(v).toLocaleString('id-ID')}` : '-';
  const platformName = form.platformTarget || 'Scalev';
  const deviceTarget = form.deviceTarget || 'Mobile';
  const isEnglish = form.language === 'en';
  const lang = isEnglish ? 'English (World-Class International Conversion Copywriting)' : 'Bahasa Indonesia (Persuasif, Mengalir, High-Converting & Anti-Kaku)';

  const isWebsite = form.tipeProduk?.toLowerCase().includes('website') || form.tujuanUtama?.toLowerCase().includes('website');

  return `# 🔥 MASTER PROMPT: WORLD-CLASS 3D HIGH-CONVERTING ${isWebsite ? 'WEBSITE' : 'LANDING PAGE'} ARCHITECTURE ($10,000+ AGENCY QUALITY)

Anda adalah **World-Class Principal Web Architect + Elite Conversion Designer** (setara lead designer di Linear, Apple, Stripe, Framer, Vercel). Anda ahli merancang ${isWebsite ? 'website & web app' : 'landing page'} modern dengan estetika **3D Visual, Glassmorphism, Aurora Gradients, Bento-Grid, dan Copywriting Konversi Tinggi**.

Mindset & Standar Kualitas:
1. **Desain Kelas Dunia (Bukan Template AI Biasa):** Gunakan pencahayaan ambient 3D, depth, glowing borders, frosted glassmorphism halus, bento grid modular, dan floating metric badges.
2. **Copywriting Persuasif Mendalam:** DILARANG menggunakan teks malas seperti "Lorem ipsum", "[Teks disini]", atau "Fitur 1". Semua kalimat, judul, benefit, studi kasus, FAQ, dan testimoni HARUS ditulis LENGKAP, detail, relevan, dan menyentuh emosi pembaca.
3. **Interaktif & Responsif Mobile-First:** Setiap tombol, accordion FAQ, video player, dan countdown harus berfungsi interaktif dengan mulus di layar smartphone (375px), tablet, dan desktop.
4. **Bahasa Output:** **${lang}**
5. **Output Format:** **100% KODE HTML TUNGGAL (SINGLE-FILE HTML LANGSUNG)** tanpa penjelasan atau teks di luar HTML.

---

## ⚙️ TARGET PLATFORM & ENVIRONMENT
- Platform Deploy: **${platformName}**
- Target Device: **${deviceTarget}**
${buildPlatformBlock(platformName, deviceTarget)}

---

## 🎨 3D DESIGN SYSTEM & VISUAL TOKENS
${buildDesignBlock(form)}

---

## ✍️ COPYWRITING & CONVERSION STRATEGY
${buildCopywritingBlock(form, awarenessLevel)}

---

## 📦 PROFIL PRODUK / BISNIS
${buildProductBlock(form, fmt)}

---

## 🧱 STRUKTUR & URUTAN SECTION WAJIB (WORLD-CLASS FLOW)
${buildSectionArchitecture(form, isWebsite)}

---

${buildMediaBlock(form)}

---

${buildCountdownBlock(form)}

${buildScarcityBlock(form)}

---

## 🔔 REAL-TIME FLOATING SALES NOTIFICATION
${buildSalesNotifBlock(form)}

---

## 💰 STRUKTUR HARGA & PENAWARAN TAK TERBANTAHKAN
${buildPricingRules(form, fmt)}

${buildCtaActionBlock(form)}

---

${buildMetaCapiBlock(form)}

---

## 🛡️ ANTI-BANNED ADS COMPLIANCE & TRUST PILLARS
1. **Kejujuran & Realistis:** Hindari janji instan "pasti kaya", "garansi sembuh total", atau "bebas risiko 100% tanpa usaha". Gunakan argumen logis dan hasil nyata.
2. **Social Proof Transparan:** Tampilkan testimoni dengan nama asli, foto avatar, rating bintang 5, dan hasil yang masuk akal.
3. **FAQ Anti-Keberatan:** Jawab 4–6 pertanyaan krusial pelanggan (cara akses, metode bayar, garansi, support).
4. **Kebijakan & Disclaimer:** Sertakan footer disclaimer legal compliance di bagian paling bawah.

---

## 🚀 KODE HTML WAJIB DIHASILKAN LENGKAP DENGAN CSS & JS:
Hasilkan sekarang seluruh kode HTML lengkap dari \`<!DOCTYPE html>\` sampai \`</html>\` dengan CSS internal di dalam \`<style>\` dan script interaktif di dalam \`<script>\`. Pastikan desainnya tampak sangat mahal, mewah, 3D, dan siap pakai langsung!`;
}

// Section Architecture Builder
function buildSectionArchitecture(form: FormState, isWebsite: boolean): string {
  if (isWebsite) {
    return `Bangun struktur **Website Multi-Section 3D Modern** dengan alur berikut:
1. **Floating Glass Navbar**: Logo brand, menu navigasi (*Fitur, Video Demo, Testimoni, Harga, FAQ*), dan tombol CTA Fast Action.
2. **Hero Section 3D**:
   - Status badge menyala (*e.g. ⚡ Rilis Versi 2026 / Diskon Terbatas*).
   - Hook Headline tebal dengan gradasi warna (*Gradient Text*).
   - Subheadline yang memperjelas value proposition dalam 3 detik.
   - Tombol CTA Utama bercahaya (*Shimmer Glow*) + Tombol Secondary (*Lihat Demo Video*).
   - **3D Product Mockup Showcase**: Kartu showcase 3D miring (*perspective tilt*) dengan floating glass badges (*e.g. 📈 +340% ROI, ⚡ 10x Lebih Cepat, ⭐ 4.9/5 Rating*).
3. **Social Proof & Client Logo Marquee**: Deretan metrik pengguna (*2,800+ Active Users, 99.8% Kepuasan*).
4. **3D Bento-Grid Feature Showcase**: Grid modular asimetris (1 kartu hero bento + 3 kartu fitur pendukung) dengan neon icon glow dan highlight teks.
5. **Interactive Video Explainer Section**: Frame video player 16:9 dengan YouTube embed, ambient light background glow, dan label fitur video.
6. **Before vs After Visual Comparison**: Kartu perbandingan kontras (*Cara Lama yang Melelahkan ❌* vs *Solusi Baru Otomatis ✅*).
7. **Interactive Tiered Pricing Matrix**: Pilihan paket bertingkat dengan popular badge halo, checklist benefit, dan tombol checkout instan.
8. **Wall of Love (Testimonial Grid)**: Kartu review pelanggan berbahan glassmorphism lengkap dengan foto avatar, verified badge, dan rating bintang.
9. **Interactive FAQ Accordion**: Pertanyaan & jawaban yang dapat diklik buka-tutup secara mulus (*smooth height transition*).
10. **Final Action CTA Banner & Scarcity Timer**: Banner penutup bertenaga tinggi dengan countdown timer real-time.
11. **Modern Multi-Column Footer**: Link navigasi, hak cipta, dan disclaimer kepatuhan iklan.`;
  }

  return `Bangun struktur **Landing Page Direct Conversion 3D** dengan alur berikut:
1. **Hero Section 3D (Impact Hook)**:
   - Badge pill penawaran (*🔥 Edisi Terbatas / Promo Spesial*).
   - Headline utama yang memikat dalam 3 detik dengan highlight gradasi warna.
   - Subjudul persuasif yang menjelaskan solusi dan transformasi produk.
   - Tombol CTA Utama berdenyut halus (*Pulse Glow*) + Rating Bintang Sosial Proof.
   - **3D Showcase Card**: Gambar mockup visual produk dengan sudut 3D (*perspective tilt*) & floating micro-badges.
2. **The Real Problem & Agitation (Pain Point)**: Mengupas tuntas masalah nyata yang dialami audiens dan biaya kerugian jika tidak segera diatasi.
3. **The Breakthrough Solution (Solusi Utama)**: Memperkenalkan produk sebagai jalan pintas tercepat dan termudah.
4. **3D Bento Grid Keunggulan**: Fitur-fitur unggulan dalam kartu bento box ber-glow neon dengan ikon visual dan penjelasan konkret.
5. **Interactive Video Section**: Video player responsif dengan ambient glow frame.
6. **Before-After Comparison**: Tabel / kartu komparasi (*Tanpa Produk Ini ❌* vs *Dengan Produk Ini ✅*).
7. **Bonus Spesial Bernilai Tinggi**: Daftar fasilitas ekstra gratis yang meningkatkan nilai penawaran berkali-kali lipat.
8. **Interactive Pricing & Scarcity Table**: Layer harga kontras (Harga normal dicoret vs Harga promo spesial) + Sisa Kuota Progress Bar.
9. **Real-time Countdown Timer**: Timer mundur jam-menit-detik yang bergerak otomatis.
10. **Testimoni Otentik**: Cerita sukses pelanggan dengan avatar, verified buyer badge, dan rating bintang.
11. **Garansi & Risk Reversal**: Jaminan keamanan pembelian (Garansi uang kembali / Panduan sampai bisa).
12. **Interactive FAQ Accordion**: Tanya jawab yang dapat diklik buka-tutup secara mulus.
13. **Final Closing CTA & Sticky Bottom Mobile Bar**: Tombol aksi terakhir + Floating bar sticky di layar HP.`;
}

// Platform Block Builder
function buildPlatformBlock(platformName: string, deviceTarget: string): string {
  const isScalev = platformName === 'Scalev';
  const isWinMe = platformName === 'WinMe';
  const isOrderHero = platformName === 'OrderHero';
  const isOrderOnline = platformName === 'OrderOnline';

  let specificRules = '';
  if (isScalev) {
    specificRules = `- **Scalev Custom HTML Target:**
- Semua elemen harus berada di dalam wrapper utama dengan ID: \`#lp-root\`
- Container maksimal: **688px – 720px**, margin: **auto**, padding horizontal: **20px**
- Gunakan inline CSS atau tag \`<style>\` internal yang terisolasi agar tidak bentrok dengan Scalev core`;
  } else if (isWinMe) {
    specificRules = `- **WinMe Platform Target:**
- Desain single column responsif yang siap menerima inject checkout modal WinMe
- Tombol CTA disiapkan dengan kelas \`.cta-btn\` agar dapat disambungkan ke event trigger`;
  } else if (isOrderHero || isOrderOnline) {
    specificRules = `- **${platformName} Target:**
- Desain terpusat mobile-first (maksimal 700px) siap disandingkan dengan form embed checkout
- Layout bersih tanpa overflow horizontal`;
  } else {
    specificRules = `- **Standalone Production Ready:**
- 100% self-contained dengan font Google Fonts, CSS internal lengkap, dan Vanilla JS ringan`;
  }

  return `${specificRules}
- **Device Target:** **${deviceTarget}** (Pastikan 100% responsif dan sempurna saat dibuka di iPhone, Android, iPad, dan Laptop)`;
}

// Design Block Builder with 3D & Aurora Engine
function buildDesignBlock(form: FormState): string {
  const hex = form.warnaBrandCustom || '#7c3aed';
  const typo = form.typography || { fontFamily: 'Plus Jakarta Sans', buttonSize: 'large', entranceAnimation: 'fade-in' };
  const gaya = form.gayaDesain || '🔮 Ultra 3D Glassmorphism & Aurora Glow (Linear / Framer Style)';

  return `Wajib menyematkan CSS Framework 3D berikut di dalam tag \`<style>\`:
- **Font Utama:** \`'${typo.fontFamily}', -apple-system, BlinkMacSystemFont, sans-serif\` (Muat via \`<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(typo.fontFamily)}:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">\`)
- **Aksen Warna Utama:** \`${hex}\` (Definisikan CSS Variable: \`--brand: ${hex};\`)
- **Gaya Desain Terpilih:** **${gaya}**

**Standar Visual & CSS 3D Wajib Diimplementasikan:**
1. **Aurora Mesh Canvas Background:**
   \`background: #08070d; background-image: radial-gradient(circle at 50% -10%, rgba(124, 58, 237, 0.22), transparent 60%), radial-gradient(circle at 10% 40%, rgba(236, 72, 153, 0.12), transparent 45%), radial-gradient(circle at 90% 70%, rgba(59, 130, 246, 0.12), transparent 45%); background-attachment: fixed;\`
2. **3D Glassmorphic Cards (Apple / Linear Depth):**
   \`background: rgba(255, 255, 255, 0.025); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 20px 40px -15px rgba(0, 0, 0, 0.5); transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);\`
3. **Card 3D Hover Effect:**
   \`transform: translateY(-5px) scale(1.01); border-color: rgba(168, 85, 247, 0.4); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 30px 60px -15px rgba(124, 58, 237, 0.3);\`
4. **Glowing CTA Button:**
   \`background: linear-gradient(135deg, ${hex}, #9333ea 50%, #ec4899); color: #ffffff; font-weight: 800; border-radius: 16px; padding: 18px 36px; border: none; box-shadow: 0 0 30px -5px ${hex}88, inset 0 1px 0 rgba(255,255,255,0.4); cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 10px;\`
5. **Keyframe Animations:**
   - \`@keyframes float3d { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-8px) rotate(1deg); } }\`
   - \`@keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 20px -5px ${hex}88; } 50% { box-shadow: 0 0 40px 0px ${hex}cc; } }\`
   - \`@keyframes shine { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }\``;
}

// Copywriting Block Builder
function buildCopywritingBlock(form: FormState, awarenessLevel: string): string {
  const traffic = form.trafficCategory ? `\n- Saluran Traffic / Iklan: **${form.trafficCategory}**` : '';
  const isEnglish = form.language === 'en';

  return `- Framework Copywriting: **${form.framework || 'PAS (Problem–Agitate–Solution)'}**
- Gaya Bahasa / Tone: **${form.gayaBahasa || 'Friendly & Conversational (Persuasif)'}**
- Level Awareness Audiens: **${awarenessLevel}**${traffic}
- Bahasa Tulisan: **${isEnglish ? 'English' : 'Bahasa Indonesia'}**

**Prinsip Naskah Konversi:**
1. **Hook 3 Detik:** Headline harus menjawab: *"Apa keuntungannya buat saya?"* dan *"Kenapa harus sekarang?"*.
2. **Emosional & Solutif:** Ceritakan frustrasi nyata yang dialami pelanggan sebelum menemukan solusi ini.
3. **Bento Box Micro-Copy:** Setiap kartu fitur memiliki subjudul benefit spesifik (bukan sekadar deskripsi teknis).
4. **Transparansi & Bukti:** Setiap klaim diperkuat oleh angka, data, atau testimoni realistis.`;
}

// Product Block Builder
function buildProductBlock(form: FormState, fmt: (v: string) => string): string {
  const cfg = form.pricingLayersConfig || { noPriceMode: false, layerNormal: true, layerPromo: true, layerFinal: true };
  const lines: string[] = [];

  lines.push(`- Nama Produk / Brand: **${form.namaProduk || '[Nama Produk Anda]'}**`);
  lines.push(`- Tipe Produk / Model: **${form.tipeProduk || 'Digital Product / SaaS'}**`);
  lines.push(`- Tujuan Utama: **${form.tujuanUtama || 'Sales & Konversi Langsung'}**`);
  lines.push(`- Target Audiens Spesifik: **${form.targetAudience || 'Pebisnis Online & Profesional'}**`);

  if (cfg.noPriceMode) {
    lines.push(`- Model Harga: **100% Gratis / Free Registration / Lead Generation** (Tanpa tabel harga rupiah)`);
  } else if (form.tieredPricing?.enabled && form.tieredPricing.tiers.length > 0) {
    lines.push(`- Model Harga: **Paket Bertingkat (Tiered / Batch Pricing):**`);
    form.tieredPricing.tiers.forEach((t) => {
      lines.push(`  - **${t.name}**: ${fmt(t.price)} ${t.originalPrice ? `(Coret: ~~${fmt(t.originalPrice)}~~)` : ''} ${t.quota ? `[${t.quota}]` : ''}`);
    });
  } else {
    if (cfg.layerNormal && form.hargaNormal) lines.push(`- Harga Normal: **${fmt(form.hargaNormal)}** (dicoret)`);
    if (cfg.layerPromo && form.hargaPromo) lines.push(`- Harga Promo: **${fmt(form.hargaPromo)}** (dicoret)`);
    if (cfg.layerFinal && form.hargaFinal) lines.push(`- 🔥 Harga Final Diskon: **${fmt(form.hargaFinal)}** (Harga Beli Sekarang)`);
    if (form.keteranganDiskon) lines.push(`- Keterangan Diskon: *${form.keteranganDiskon}*`);
  }

  if (form.deskripsiBenefit) {
    lines.push(`- Keunggulan Utama: **${form.deskripsiBenefit}**`);
  }

  if (form.bonusList && form.bonusList.length > 0) {
    const validBonuses = form.bonusList.filter(b => b.nama);
    if (validBonuses.length > 0) {
      const bonusItems = validBonuses.map(b => `  - 🎁 **${b.nama}** ${b.hargaAsli ? `(Senilai ~~${fmt(b.hargaAsli)}~~)` : ''}`).join('\n');
      const totalBonus = validBonuses.reduce((s, b) => s + (Number(b.hargaAsli) || 0), 0);
      lines.push(`- **Bonus Eksklusif Tambahan:**\n${bonusItems}\n- Total Nilai Bonus: **${fmt(String(totalBonus))} (Diberikan 100% GRATIS)**`);
    }
  }

  return lines.join('\n');
}

// Media Block Builder
function buildMediaBlock(form: FormState): string {
  const m = form.media;
  const hasCover = m?.coverHeroUrl;
  const hasVideo = m?.videoHeroUrl;
  const hasPhotos = m?.fotoProdukUrls && m?.fotoProdukUrls.length > 0;

  if (!hasCover && !hasVideo && !hasPhotos) {
    return `## 🖼️ MEDIA & VIDEO SHOWCASE SECTION
Tampilkan section media interaktif berikut:
1. **Hero 3D Mockup Card**: Tampilkan mockup visual produk dalam frame kartu 3D bergradasi neon dengan floating badge di atasnya.
2. **Interactive Video Showcase Section**: Buat section video dengan rasio 16:9, ambient glowing backdrop, play button kaca, dan badge fitur video (Gunakan iframe YouTube embed responsif).
3. **Bento Grid Image Showcase**: Galeri foto fitur produk dalam format bento grid modern yang estetik.`;
  }

  const lines: string[] = ['## 🖼️ MEDIA ASSETS WAJIB DI-EMBED SECARA VISUAL'];
  if (hasCover) {
    lines.push(`- Hero Cover Image: \`<img src="${m.coverHeroUrl}" alt="Hero Cover" style="width:100%;max-height:420px;object-fit:cover;border-radius:24px;box-shadow:0 20px 50px rgba(0,0,0,0.5);margin-bottom:24px;" />\``);
  }
  if (hasVideo) {
    lines.push(`- Video Explainer Hero / Section: Tampilkan video player responsif 16:9 dengan URL embed: **${m.videoHeroUrl}**`);
  }
  if (hasPhotos) {
    lines.push(`- Galeri Foto Produk: Tampilkan gambar-gambar berikut dalam grid bento yang mewah:`);
    m.fotoProdukUrls.forEach((url, i) => lines.push(`  ${i + 1}. \`${url}\``));
  }
  return lines.join('\n');
}

// Pricing Rules Builder
function buildPricingRules(form: FormState, fmt: (v: string) => string): string {
  const cfg = form.pricingLayersConfig || { noPriceMode: false, layerNormal: true, layerPromo: true, layerFinal: true };

  if (cfg.noPriceMode) {
    return `- **MODE LEAD GENERATION / FREE ACCESS:**
- Jangan tampilkan label harga rupiah.
- Tekankan keuntungan instan dan formulir pendaftaran 1-klik yang mudah.`;
  }

  if (form.tieredPricing?.enabled && form.tieredPricing.tiers.length > 0) {
    return `- **STRUKTUR HARGA BERTINGKAT (TIERED CARDS):**
- Tampilkan 2-3 kolom kartu harga bertingkat dengan border kaca 3D.
- Kartu paket paling populer diberi efek glow aurora menyala, badge *🔥 PALING LARIS*, dan tombol CTA paling menonjol.`;
  }

  return `- Tampilkan kartu harga kaca 3D dengan kontras tinggi: harga normal dicoret, harga promo, dan harga final besar bercahaya.
- Sertakan micro-copy kepastian (misal: *"Garansi Uang Kembali 100% · Pembayaran Aman Terenkripsi · Akses Langsung Aktif"*).`;
}

// CTA Action Block Builder
function buildCtaActionBlock(form: FormState): string {
  const cta = form.ctaMode || {
    type: 'button',
    buttonText: form.ctaUtama || 'Beli Sekarang',
    waNumber: '6281234567890',
    waMessage: 'Halo admin, saya mau order promo produk ini sekarang...',
    micrositeUrl: '',
    leadFormFields: { name: true, wa: true, email: true, note: false, packageSelect: true, buttonText: 'Daftar Sekarang' }
  };

  if (cta.type === 'whatsapp') {
    const enc = encodeURIComponent(cta.waMessage || 'Halo, saya mau pesan promo sekarang');
    const waLink = `https://wa.me/${cta.waNumber.replace(/[^0-9]/g, '') || '6281234567890'}?text=${enc}`;
    return `### 💬 CALL TO ACTION: DIRECT WHATSAPP ORDER (CTWA)
- Semua tombol CTA utama HARUS mengarah ke link WhatsApp: \`<a href="${waLink}" target="_blank" class="cta-btn">\`
- Teks Tombol: **"${form.ctaUtama || cta.buttonText || 'Chat WhatsApp Sekarang'}"**
- Berikan ikon WhatsApp menyala di dalam tombol CTA`;
  }

  if (cta.type === 'microsite' && cta.micrositeUrl) {
    return `### 🔗 CALL TO ACTION: DIRECT CHECKOUT LINK
- Semua tombol CTA utama HARUS mengarah ke URL: \`<a href="${cta.micrositeUrl}" target="_blank" class="cta-btn">\`
- Teks Tombol: **"${form.ctaUtama || cta.buttonText || 'Amankan Promo Sekarang'}"**`;
  }

  if (cta.type === 'lead_form') {
    return `### 📋 CALL TO ACTION: LEAD CAPTURE FORM 3D
- Tampilkan formulir pendaftaran 3D glassmorphic yang elegan dengan input:
  ${cta.leadFormFields?.name ? '- Input Nama Lengkap\n' : ''}${cta.leadFormFields?.wa ? '- Input Nomor WhatsApp\n' : ''}${cta.leadFormFields?.email ? '- Input Alamat Email\n' : ''}${cta.leadFormFields?.packageSelect ? '- Pilihan Dropdown Paket\n' : ''}
- Tombol Submit: **"${cta.leadFormFields?.buttonText || 'Kirim & Dapatkan Akses Instan'}"**`;
  }

  return `### 🔘 CALL TO ACTION: TOMBOL STANDAR
- Teks Tombol: **"${form.ctaUtama || 'Beli Sekarang'}"**
- Tombol dibuat besar, bersinar (*pulse glow*), dengan efek hover 3D dan floating bar di layar HP`;
}

// Meta CAPI Block Builder
function buildMetaCapiBlock(form: FormState): string {
  const c = form.metaCapi;
  if (!c || !c.enabled || !c.pixelId) return '';

  return `## 📡 META PIXEL & CONVERSIONS API SCRIPT
Sematkan script tracking Meta Pixel berikut di dalam \`<head>\`:
\`\`\`html
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${c.pixelId}');
fbq('track', 'PageView');
function trackCtaLead(){ fbq('track', '${c.eventName || 'Lead'}'); }
</script>
\`\`\`
Pada setiap tombol CTA, tambahkan attribute \`onclick="trackCtaLead()"\`.`;
}

// Countdown Block Builder
function buildCountdownBlock(form: FormState): string {
  const c = form.countdown;
  const totalMs = c?.enabled ? (c.hari * 86400000) + (c.jam * 3600000) + (c.menit * 60000) + (c.detik * 1000) : 2 * 86400000;
  const label = c?.enabled ? c.labelAtas : '⏰ PROMO & BONUS DITUTUP DALAM';
  const bg = c?.enabled ? c.bgColor : 'rgba(255,255,255,0.03)';
  const text = c?.enabled ? c.textColor : '#ffffff';
  const accent = c?.enabled ? c.accentColor : '#a855f7';
  const durasi = c?.enabled ? `${c.hari} hari, ${c.jam} jam, ${c.menit} menit, ${c.detik} detik` : '2 hari, 0 jam, 0 menit, 0 detik';

  return `## ⏳ COUNTDOWN TIMER REAL-TIME (3D GLASS BOXES)
Durasi: ${durasi}
Label: **"${label}"**
Background Box: **${bg}**, Accent Glow: **${accent}**

Implementasikan kotak waktu 3D (Hari : Jam : Menit : Detik) dengan JavaScript live ticker yang bergerak mulus setiap detik:
\`\`\`html
<div class="countdown-container" style="background:${bg};border:1px solid rgba(255,255,255,0.1);backdrop-filter:blur(16px);border-radius:20px;padding:24px;text-align:center;max-width:560px;margin:30px auto;box-shadow:0 20px 40px rgba(0,0,0,0.4);">
  <p style="font-size:13px;font-weight:800;color:${accent};letter-spacing:1px;margin:0 0 16px;text-transform:uppercase;">🔥 ${label}</p>
  <div style="display:flex;justify-content:center;gap:12px;align-items:center;">
    <div style="background:rgba(0,0,0,0.5);border:1px solid ${accent}44;border-radius:14px;padding:12px 16px;min-width:64px;box-shadow:inset 0 1px 0 rgba(255,255,255,0.1);"><span id="cd-days" style="font-size:26px;font-weight:900;color:#ffffff;display:block;">02</span><span style="font-size:10px;color:#9ca3af;font-weight:600;">HARI</span></div>
    <span style="font-size:20px;font-weight:900;color:${accent};">:</span>
    <div style="background:rgba(0,0,0,0.5);border:1px solid ${accent}44;border-radius:14px;padding:12px 16px;min-width:64px;box-shadow:inset 0 1px 0 rgba(255,255,255,0.1);"><span id="cd-hours" style="font-size:26px;font-weight:900;color:#ffffff;display:block;">00</span><span style="font-size:10px;color:#9ca3af;font-weight:600;">JAM</span></div>
    <span style="font-size:20px;font-weight:900;color:${accent};">:</span>
    <div style="background:rgba(0,0,0,0.5);border:1px solid ${accent}44;border-radius:14px;padding:12px 16px;min-width:64px;box-shadow:inset 0 1px 0 rgba(255,255,255,0.1);"><span id="cd-minutes" style="font-size:26px;font-weight:900;color:#ffffff;display:block;">00</span><span style="font-size:10px;color:#9ca3af;font-weight:600;">MENIT</span></div>
    <span style="font-size:20px;font-weight:900;color:${accent};">:</span>
    <div style="background:rgba(0,0,0,0.5);border:1px solid ${accent}44;border-radius:14px;padding:12px 16px;min-width:64px;box-shadow:inset 0 1px 0 rgba(255,255,255,0.1);"><span id="cd-seconds" style="font-size:26px;font-weight:900;color:${accent};display:block;">00</span><span style="font-size:10px;color:#9ca3af;font-weight:600;">DETIK</span></div>
  </div>
</div>
<script>
(function(){
  var totalSec = ${Math.floor(totalMs / 1000)};
  var end = Date.now() + totalSec * 1000;
  function pad(n){ return String(n).padStart(2,'0'); }
  function tick(){
    var diff = Math.max(0, Math.floor((end - Date.now()) / 1000));
    var d = Math.floor(diff / 86400);
    var h = Math.floor((diff % 86400) / 3600);
    var m = Math.floor((diff % 3600) / 60);
    var s = diff % 60;
    var de = document.getElementById('cd-days');
    var he = document.getElementById('cd-hours');
    var me = document.getElementById('cd-minutes');
    var se = document.getElementById('cd-seconds');
    if(de) de.textContent = pad(d);
    if(he) he.textContent = pad(h);
    if(me) me.textContent = pad(m);
    if(se) se.textContent = pad(s);
    if(diff > 0) setTimeout(tick, 1000);
  }
  tick();
})();
</script>
\`\`\``;
}

// Scarcity Block Builder
function buildScarcityBlock(form: FormState): string {
  const s = form.scarcitySeat;
  if (!s || !s.enabled) return '';
  const percent = Math.min(100, Math.round(((s.totalSeat - s.sisaSeat) / (s.totalSeat || 1)) * 100));

  return `## 🔥 SISA KUOTA PROGRESS BAR (3D SCARCITY)
Label: **"${s.label}"**
Total Kuota: **${s.totalSeat}**, Sisa Kuota: **${s.sisaSeat}** (${percent}% terisi)

\`\`\`html
<div id="scarcity-bar" style="background:rgba(255,255,255,0.03);border:1px solid rgba(245,158,11,0.4);border-radius:18px;padding:16px 20px;margin:20px auto;max-width:580px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,0.3);">
  <p style="margin:0 0 10px;font-size:13px;font-weight:800;color:#f59e0b;letter-spacing:0.5px;">
    ⚡ ${s.label} HANYA TERSISA <span id="seat-count" style="color:#ef4444;font-size:18px;font-weight:900;">${s.sisaSeat}</span> DARI ${s.totalSeat} SLOT!
  </p>
  <div style="background:#0a0a12;border-radius:999px;height:12px;width:100%;overflow:hidden;padding:2px;border:1px solid #374151;">
    <div id="seat-progress" style="background:linear-gradient(90deg,#f59e0b,#ef4444);height:100%;border-radius:999px;width:${percent}%;transition:width 1s ease;"></div>
  </div>
  <p style="margin:8px 0 0;font-size:11px;color:#9ca3af;">🔒 Kuota berkurang secara realtime · Dapatkan akses sekarang sebelum ditutup</p>
</div>
${s.autoDecrease ? `
<script>
(function(){
  var current = ${s.sisaSeat};
  var min = Math.max(1, current - 3);
  function reduce(){
    if (current > min && Math.random() > 0.4) {
      current--;
      var el = document.getElementById('seat-count');
      if (el) el.textContent = current;
      var prog = document.getElementById('seat-progress');
      if (prog) prog.style.width = Math.min(98, Math.round(((${s.totalSeat} - current) / ${s.totalSeat}) * 100)) + '%';
    }
    setTimeout(reduce, Math.floor(Math.random() * 8000) + 7000);
  }
  setTimeout(reduce, 4000);
})();
</script>
` : ''}
\`\`\``;
}

// Sales Notif Builder
function buildSalesNotifBlock(form: FormState): string {
  const n = form.salesNotif;
  if (!n || !n.enabled) return '*(Sales notification dinonaktifkan)*';

  const widths = { small: 280, medium: 320, large: 380 };
  const w = widths[n.ukuran] || 320;
  const posStyle: Record<string, string> = {
    'bottom-left': 'bottom:24px;left:24px',
    'bottom-right': 'bottom:24px;right:24px',
    'top-left': 'top:24px;left:24px',
    'top-right': 'top:24px;right:24px',
  };
  const pos = posStyle[n.position] || 'bottom:24px;left:24px';
  const namaProduk = n.namaProdukNotif || form.namaProduk || 'produk ini';
  const names = n.namaPembeli.split(',').map(s => s.trim()).filter(Boolean);

  return `Sematkan popup social proof berikut persis sebelum \`</body>\`:
\`\`\`html
<div id="sn-popup" style="display:none;position:fixed;${pos};width:${w}px;background:rgba(15,15,25,0.95);backdrop-filter:blur(20px);border-radius:18px;box-shadow:0 20px 50px rgba(0,0,0,0.5);padding:14px 16px;z-index:99999;font-family:sans-serif;align-items:center;gap:12px;border:1px solid rgba(255,255,255,0.12);border-left:4px solid ${n.borderColor || '#a855f7'};">
  <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#7c3aed,#ec4899);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">${n.emoji || '⚡'}</div>
  <div style="min-width:0;flex:1;">
    <p id="sn-name" style="margin:0;font-size:13px;font-weight:700;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></p>
    <p id="sn-product" style="margin:2px 0 0;font-size:12px;color:${n.borderColor || '#c4b5fd'};font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${namaProduk}</p>
    <p style="margin:3px 0 0;font-size:10px;color:#9ca3af;">✓ Pembelian Terverifikasi · 2 menit lalu</p>
  </div>
</div>
<script>
(function(){
  var names = ${JSON.stringify(names)};
  var msg = "${n.pesanNotif || 'baru saja membeli'}";
  var interval = ${n.interval * 1000};
  var durasi = ${n.durasi * 1000};
  var idx = 0;
  var popup = document.getElementById('sn-popup');
  function showNotif(){
    if(!names || names.length === 0) return;
    var name = names[idx % names.length];
    idx++;
    var nameEl = document.getElementById('sn-name');
    if(nameEl) nameEl.textContent = name + ' ' + msg;
    popup.style.display = 'flex';
    popup.style.opacity = '0';
    popup.style.transform = 'translateY(15px) scale(0.95)';
    popup.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(function(){
      popup.style.opacity = '1';
      popup.style.transform = 'translateY(0) scale(1)';
    }, 50);
    setTimeout(function(){
      popup.style.opacity = '0';
      popup.style.transform = 'translateY(15px) scale(0.95)';
      setTimeout(function(){ popup.style.display = 'none'; }, 400);
    }, durasi);
  }
  setTimeout(function(){
    showNotif();
    setInterval(showNotif, interval + durasi);
  }, 2500);
})();
</script>
\`\`\``;
}
