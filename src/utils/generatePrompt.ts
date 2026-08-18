import { FormState } from '@/types/form';

export function generatePrompt(form: FormState): string {
  const activeElements = Object.entries(form.elemenTambahan).filter(([, v]) => v).map(([k]) => k);
  const awarenessMap: Record<string, string> = {
    'Unaware (Belum sadar)': 'Unaware', 'Problem Aware (Tahu masalah)': 'Problem Aware',
    'Solution Aware (Cari solusi)': 'Solution Aware', 'Product Aware (Tahu produk)': 'Product Aware',
    'Most Aware (Siap beli)': 'Most Aware',
  };
  const awarenessLevel = awarenessMap[form.levelAwareness] || form.levelAwareness;
  const fmt = (v: string) => v ? `Rp ${Number(v).toLocaleString('id-ID')}` : '-';
  const platformName = form.platformTarget || 'Scalev';
  const deviceTarget = form.deviceTarget || 'Mobile';
  const lang = form.language === 'en' ? 'Bahasa Inggris (English Copywriting)' : 'Bahasa Indonesia';

  return `# 🔥 MASTER PROMPT LANDING PAGE HIGH-CONVERTING

Anda adalah **Senior Conversion Copywriter + Landing Page Developer Expert** yang telah membuat ratusan landing page high-converting untuk social media ads & direct sales.

Mindset:
- Conversion-focused & Direct Action
- UI/UX Mobile-First (Feel Native Mobile App)
- Paham compliance Meta & Google Ads (Anti-Banned)
- Bahasa Output: **${lang}**

---
  
## 🎯 TUGAS UTAMA

Buat **Landing Page High-Converting** dalam bentuk **kode HTML tunggal (single file)** untuk platform **${platformName}**, desain premium, fokus konversi, aman regulasi iklan.

Output HARUS **langsung berupa HTML saja** (tanpa penjelasan, tanpa teks di luar HTML).

---
  
${buildPlatformBlock(platformName, deviceTarget)}

---
  
${buildDesignBlock(form)}

---
  
${buildCopywritingBlock(form, awarenessLevel)}

---
  
${buildProductBlock(form, fmt)}

---
  
## 🧱 STRUKTUR & URUTAN SECTION WAJIB
${buildSectionList(form.sectionOrder || activeElements, activeElements)}

${buildMediaBlock(form)}
${buildReferensiBlock(form)}

---
  
${buildCountdownBlock(form)}

${buildScarcityBlock(form)}

---
  
## 🔔 SALES NOTIFICATION POPUP
${buildSalesNotifBlock(form)}

---
  
## 💰 CONVERSION & PRICING RULES
${buildPricingRules(form, fmt)}

${buildCtaActionBlock(form)}

---
  
${buildMetaCapiBlock(form)}

---
  
## 🔐 TRUST & REASSURANCE
Wajib ada:
- Social proof angka/logis
- Testimoni realistis (tidak overclaim)
- FAQ anti keberatan
- Garansi masuk akal

---
  
${buildChecklistBlock(platformName, platformName === 'Scalev')}`;
}

// Section list builder
function buildSectionList(sectionOrder: string[], activeElements: string[]): string {
  const activeSet = new Set(activeElements);
  const finalOrder = (sectionOrder || []).filter(s => activeSet.has(s));
  const list = finalOrder.length > 0 ? finalOrder : activeElements;
  return list.map((sec, i) => `${i + 1}. **${sec}**`).join('\n');
}

// Platform block builder
function buildPlatformBlock(platformName: string, deviceTarget: string): string {
  const isScalev = platformName === 'Scalev';
  const isWinMe = platformName === 'WinMe';
  const isOrderHero = platformName === 'OrderHero';
  const isOrderOnline = platformName === 'OrderOnline';
  const isLandingPress = platformName === 'LandingPress';
  const isMayar = platformName === 'Mayar';

  let specificRules = '';
  if (isScalev) {
    specificRules = `- Scalev Embed Target: Inject ke Custom HTML element Scalev
- Container ID WAJIB: \`#lp-root\`
- Maksimal lebar section: **688px**, margin: **auto**, padding: **35px 20px**
- Single column layout (tanpa multi-kolom horizontal yang patah di mobile)`;
  } else if (isWinMe) {
    specificRules = `- WinMe Compatibility: Format full-width single page checkout / lead capture
- Optimasi tombol CTA agar langsung terhubung ke form checkout WinMe`;
  } else if (isOrderHero) {
    specificRules = `- OrderHero Target: Single column landing page siap inject widget checkout OrderHero
- Layout super responsif di layar smartphone`;
  } else if (isOrderOnline) {
    specificRules = `- OrderOnline Integration: Cocok di-embed bersama form checkout OrderOnline
- Maksimal container: 720px centered`;
  } else if (isLandingPress) {
    specificRules = `- LandingPress WordPress Compatibility: Gunakan utility classes inline yang bersih dan tidak bentrok dengan CSS tema Elementor/LandingPress`;
  } else if (isMayar) {
    specificRules = `- Mayar Link Checkout: Tombol CTA disiapkan mengarah ke payment link Mayar`;
  } else {
    specificRules = `- Standalone HTML: 100% self-contained dengan font Google Fonts, CSS inline/internal, dan JS vanilla`;
  }

  let deviceGuide = '';
  if (deviceTarget === 'Mobile') {
    deviceGuide = `- **Target Device: 📱 MOBILE ONLY**
- Desain WAJIB 100% Mobile-First (feel seperti native smartphone app)
- Ukuran font nyaman dibaca di layar HP (Headline: 24-30px, Body: 14-16px, CTA: 16-18px)
- Touch targets minimal 48px tinggi agar nyaman di-tap jempol
- Padding horizontal 16-20px, tanpa elemen meluap / horizontal scrollbar`;
  } else if (deviceTarget === 'Tablet') {
    deviceGuide = `- **Target Device: 📱 TABLET (iPad / Android Tablet)**
- Container lebar maksimal 768px, layout rapi di orientasi portrait & landscape`;
  } else if (deviceTarget === 'Desktop') {
    deviceGuide = `- **Target Device: 💻 DESKTOP**
- Container terpusat maksimal 960px dengan visual whitespace yang lega`;
  } else {
    deviceGuide = `- **Target Device: 📱💻 RESPONSIVE (All Devices)**
- Single column adaptif dari layar HP 360px hingga Desktop 1200px`;
  }

  return `## ⚙️ TARGET PLATFORM & DEVICE
- Platform: **${platformName}**
- Device Target: **${deviceTarget}**
${deviceGuide}
${specificRules}`;
}

// Design block builder
function buildDesignBlock(form: FormState): string {
  const hex = form.warnaBrandCustom || '#6c63ff';
  const typo = form.typography || { fontFamily: 'Plus Jakarta Sans', buttonSize: 'large', entranceAnimation: 'fade-in' };

  return `## 🎨 ATURAN DESAIN & VISUAL
- Warna Brand Utama (Aksen): **${form.warnaBrand || 'Modern Purple'} (${hex})**
- Tema Nuansa: **${form.tema || 'Dark Mode Clean'}**
- Gaya Desain: **${form.gayaDesain || 'Clean Minimalist'}**
- Font Utama: **${typo.fontFamily}** (Muat via Google Fonts di dalam \`<head>\`)
- Ukuran Tombol CTA: **${typo.buttonSize === 'full' ? 'Full-Width 100% Layar Mobile' : typo.buttonSize === 'large' ? 'Besar / Prominent (Tinggi 52px)' : 'Normal (44px)'}**
- Animasi Transisi: **${typo.entranceAnimation || 'fade-in'}**

Prinsip Visual:
1. Skema warna konsisten beraksen ${hex}
2. Hierarchy kontras: Judul tebal, subjudul abu-abu halus, tombol CTA paling mencolok
3. Rounded corners modern (\`border-radius: 12px\` sampai \`16px\`)
4. Efek Glassmorphism halus pada kartu testimoni & container`;
}

// Copywriting block builder
function buildCopywritingBlock(form: FormState, awarenessLevel: string): string {
  const traffic = form.trafficCategory ? `\n- Saluran Iklan / Traffic: **${form.trafficCategory}**` : '';
  return `## ✍️ COPYWRITING STRATEGY
- Framework: **${form.framework || 'PAS (Problem–Agitate–Solution)'}**
- Tone of Voice: **${form.gayaBahasa || 'Friendly & Conversational'}**
- Level Awareness: **${awarenessLevel || 'Problem Aware'}**${traffic}
- Bahasa: **${form.language === 'en' ? 'English (Professional Conversion Copywriting)' : 'Bahasa Indonesia (Natural, Mengalir, Anti-Kaku)'}**

Aturan Copywriting:
- Headline WAJIB memikat dalam 3 detik pertama
- Angkat pain point spesifik dan tawarkan transformasi produk sebagai jalan keluar
- Hindari kata overclaim "pasti kaya", "garansi sembuh total", atau janji tidak realistis agar aman dari Meta & Google Ads policy`;
}

// Product block builder
function buildProductBlock(form: FormState, fmt: (v: string) => string): string {
  const cfg = form.pricingLayersConfig || { noPriceMode: false, layerNormal: true, layerPromo: true, layerFinal: true };
  const lines: string[] = [];

  if (cfg.noPriceMode) {
    lines.push(`- Model Penawaran: **Pendaftaran / Akses Gratis / Lead Generation (Tanpa Biaya)**`);
    lines.push(`- Biaya: **100% Gratis / Tanpa Biaya Pendaftaran**`);
  } else if (form.tieredPricing?.enabled && form.tieredPricing.tiers.length > 0) {
    lines.push(`- Model Harga: **Harga Bertingkat (Batch / Tiered Pricing):**`);
    form.tieredPricing.tiers.forEach((t) => {
      lines.push(`  - **${t.name}**: ${fmt(t.price)} ${t.originalPrice ? `(dicoret: ~~${fmt(t.originalPrice)}~~)` : ''} ${t.quota ? `[${t.quota}]` : ''}`);
    });
  } else {
    if (cfg.layerNormal && form.hargaNormal) {
      lines.push(`- Harga Normal: **${fmt(form.hargaNormal)}** (dicoret)`);
    }
    if (cfg.layerPromo && form.hargaPromo) {
      lines.push(`- Harga Promo: **${fmt(form.hargaPromo)}** (dicoret)`);
    }
    if (cfg.layerFinal && form.hargaFinal) {
      lines.push(`- 🔥 Harga Final / Diskon (Beli Sekarang): **${fmt(form.hargaFinal)}**`);
    }
    if (form.keteranganDiskon) {
      lines.push(`- Keterangan Diskon: ${form.keteranganDiskon}`);
    }
  }

  const pricingInfo = lines.join('\n');

  let bonusInfo = '';
  if (form.bonusList && form.bonusList.length > 0) {
    const bonusItems = form.bonusList.filter(b => b.nama).map(b =>
      `  - ✅ ${b.nama}${b.hargaAsli ? ` → Senilai: ~~${fmt(b.hargaAsli)}~~ (Gratis)` : ''}`
    ).join('\n');
    if (bonusItems) {
      const totalBonus = form.bonusList.reduce((s, b) => s + (Number(b.hargaAsli) || 0), 0);
      bonusInfo = `\n- **Fasilitas / Bonus yang disertakan:**\n${bonusItems}\n- Total nilai bonus: **${fmt(String(totalBonus))}**`;
    }
  }

  return `# 📦 PROFIL PRODUK / LAYANAN
- Nama Produk/Brand: **${form.namaProduk || '[Nama Produk]'}**
- Tipe: ${form.tipeProduk || '-'}
- Tujuan: ${form.tujuanUtama || '-'}
${pricingInfo}
- CTA Utama: **${form.ctaUtama || 'Beli Sekarang'}**
- Target Audience: **${form.targetAudience || '-'}**
${form.deskripsiBenefit ? `- Keunggulan / Benefit: ${form.deskripsiBenefit}` : ''}${bonusInfo}`;
}

// Media block builder
function buildMediaBlock(form: FormState): string {
  const m = form.media;
  if (!m || (!m.coverHeroUrl && !m.videoHeroUrl && (!m.fotoProdukUrls || m.fotoProdukUrls.length === 0))) return '';

  const lines: string[] = ['\n## 🖼️ MEDIA ASSETS WAJIB DI-EMBED'];
  if (m.coverHeroUrl) {
    lines.push(`- Background Cover Hero Banner: \`<img src="${m.coverHeroUrl}" alt="Hero Cover" style="width:100%;max-height:360px;object-fit:cover;border-radius:16px;margin-bottom:20px;" />\``);
  }
  if (m.videoHeroUrl) {
    lines.push(`- Video Hero Embed: Tampilkan video player responsif (iframe / video tag) untuk URL: **${m.videoHeroUrl}**`);
  }
  if (m.fotoProdukUrls && m.fotoProdukUrls.length > 0) {
    lines.push(`- Galeri Foto Produk: Tampilkan gambar berikut dalam grid/slider:`);
    m.fotoProdukUrls.forEach((url, i) => lines.push(`  ${i + 1}. \`${url}\``));
  }
  return lines.join('\n');
}

// Pricing rules builder
function buildPricingRules(form: FormState, fmt: (v: string) => string): string {
  const cfg = form.pricingLayersConfig || { noPriceMode: false, layerNormal: true, layerPromo: true, layerFinal: true };
  
  if (cfg.noPriceMode) {
    return `- **MODE NON-KOMERSIAL / TANPA HARGA:**
- JANGAN tampilkan tabel harga rupiah.
- Fokuskan copy pada kemudahan pendaftaran/akses dan nilai keuntungan bergabung.`;
  }

  if (form.tieredPricing?.enabled && form.tieredPricing.tiers.length > 0) {
    return `- **STRUKTUR HARGA BERTINGKAT (TIERED BATCH):**
- Tampilkan tabel/kartu perbandingan batch harga yang jelas (Batch 1, Batch 2, Batch 3) lengkap dengan sisa kuota dan badge penawaran.`;
  }

  return `- Tampilkan struktur layer harga kontras (harga normal dicoret, harga promo, dan harga final besar bercahaya).
- Setiap CTA wajib disertai micro-copy trust (misal: "Garansi 100% aman · Akses instan · Support 24/7").`;
}

// CTA Action block builder
function buildCtaActionBlock(form: FormState): string {
  const cta = form.ctaMode || { type: 'button', buttonText: form.ctaUtama || 'Beli Sekarang', waNumber: '', waMessage: '', micrositeUrl: '', leadFormFields: { name: true, wa: true, email: true, note: false, packageSelect: true, buttonText: 'Kirim Sekarang' } };

  if (cta.type === 'whatsapp') {
    const enc = encodeURIComponent(cta.waMessage || 'Halo, saya mau pesan sekarang');
    const waLink = `https://wa.me/${cta.waNumber || '6281234567890'}?text=${enc}`;
    return `### 💬 CALL TO ACTION: DIRECT WHATSAPP (CTWA)
- Tombol CTA HARUS langsung membuka WhatsApp dengan link: \`<a href="${waLink}" target="_blank" class="cta-btn">\`
- Teks Tombol: **"${form.ctaUtama || cta.buttonText || 'Chat WhatsApp Sekarang'}"**
- Icon WhatsApp hijau menyala di samping teks tombol`;
  }

  if (cta.type === 'microsite' && cta.micrositeUrl) {
    return `### 🔗 CALL TO ACTION: DIRECT MICROSITE CHECKOUT
- Tombol CTA mengarah langsung ke URL Checkout: \`<a href="${cta.micrositeUrl}" target="_blank" class="cta-btn">\`
- Teks Tombol: **"${form.ctaUtama || cta.buttonText || 'Beli Sekarang'}"**`;
  }

  if (cta.type === 'lead_form') {
    return `### 📋 CALL TO ACTION: LEAD CAPTURE FORM LANGSUNG
- Tampilkan form pendaftaran bersih & terpusat di landing page dengan input:
  ${cta.leadFormFields?.name ? '- Input Nama Lengkap\n' : ''}${cta.leadFormFields?.wa ? '- Input Nomor WhatsApp\n' : ''}${cta.leadFormFields?.email ? '- Input Alamat Email\n' : ''}${cta.leadFormFields?.packageSelect ? '- Pilihan Dropdown Paket\n' : ''}
- Tombol Submit: **"${cta.leadFormFields?.buttonText || 'Daftar Sekarang'}"**`;
  }

  return `### 🔘 CALL TO ACTION: TOMBOL STANDAR
- Teks Tombol: **"${form.ctaUtama || 'Beli Sekarang'}"**
- Tombol besar, kontras, berpusat, dengan efek hover/pulse modern`;
}

// Meta CAPI block builder
function buildMetaCapiBlock(form: FormState): string {
  const c = form.metaCapi;
  if (!c || !c.enabled || !c.pixelId) return '';

  return `## 📡 META PIXEL & CONVERSIONS API SCRIPT
Tambahkan script tracking Meta berikut di dalam \`<head>\` dan pada tombol CTA:
\`\`\`html
<!-- Meta Pixel Code -->
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
<!-- End Meta Pixel Code -->
\`\`\`
Pada setiap tombol CTA, tambahkan attribute \`onclick="trackCtaLead()"\`.`;
}

// Referensi block builder
function buildReferensiBlock(form: FormState): string {
  if (!form.linkReferensi && !form.inspirasiDesain) return '';
  let block = '\n\n## 🔗 REFERENSI DESAIN';
  if (form.linkReferensi) block += `\n- URL Referensi: ${form.linkReferensi}`;
  if (form.inspirasiDesain) block += `\n- Inspirasi yang ditiru: ${form.inspirasiDesain}`;
  return block;
}

// Countdown block builder
function buildCountdownBlock(form: FormState): string {
  const c = form.countdown;
  const totalMs = c?.enabled ? (c.hari * 86400000) + (c.jam * 3600000) + (c.menit * 60000) + (c.detik * 1000) : 2 * 86400000;
  const label = c?.enabled ? c.labelAtas : '⏰ PROMO BERAKHIR DALAM';
  const bg = c?.enabled ? c.bgColor : '#1a1a2e';
  const text = c?.enabled ? c.textColor : '#ffffff';
  const accent = c?.enabled ? c.accentColor : '#ff4757';
  const durasi = c?.enabled ? `${c.hari} hari, ${c.jam} jam, ${c.menit} menit, ${c.detik} detik` : '2 hari, 0 jam, 0 menit, 0 detik';

  return `## ⏳ COUNTDOWN TIMER (WAJIB BERGERAK)
Durasi: ${durasi}
Label: **"${label}"**
Background: **${bg}**, Text: **${text}**, Accent: **${accent}**

JavaScript Countdown Timer Wajib:
\`\`\`html
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

// Scarcity seat block builder
function buildScarcityBlock(form: FormState): string {
  const s = form.scarcitySeat;
  if (!s || !s.enabled) return '';
  const percent = Math.min(100, Math.round(((s.totalSeat - s.sisaSeat) / (s.totalSeat || 1)) * 100));

  return `## 🔥 SCARCITY & SISA KUOTA WIDGET (WAJIB ADA)
Label: **"${s.label}"**
Total Kuota: **${s.totalSeat}**, Sisa Kuota: **${s.sisaSeat}** (${percent}% terisi)

Struktur HTML & CSS Progress Bar:
\`\`\`html
<div id="scarcity-bar" style="background:#1e1b2e;border:1px solid #f59e0b;border-radius:12px;padding:14px 18px;margin:20px auto;max-width:580px;text-align:center;">
  <p style="margin:0 0 8px;font-size:13px;font-weight:800;color:#f59e0b;letter-spacing:0.5px;">
    🔥 ${s.label} HANYA TERSISA <span id="seat-count" style="color:#ef4444;font-size:16px;">${s.sisaSeat}</span> DARI ${s.totalSeat} SLOT!
  </p>
  <div style="background:#0a0a12;border-radius:999px;height:12px;width:100%;overflow:hidden;padding:2px;border:1px solid #374151;">
    <div id="seat-progress" style="background:linear-gradient(90deg,#f59e0b,#ef4444);height:100%;border-radius:999px;width:${percent}%;transition:width 1s ease;"></div>
  </div>
  <p style="margin:6px 0 0;font-size:11px;color:#9ca3af;">⚡ Kuota terisi cepat · Amankan akses Anda sebelum ditutup</p>
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

// Sales notif builder
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

  return `Tambahkan **PERSIS** sebelum \`</body>\`:
\`\`\`html
<div id="sn-popup" style="display:none;position:fixed;${pos};width:${w}px;background:${n.bgColor};border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.18);padding:14px 16px;z-index:99999;font-family:sans-serif;align-items:center;gap:12px;border-left:4px solid ${n.borderColor};">
  <span style="font-size:24px;">${n.emoji}</span>
  <div>
    <p id="sn-name" style="margin:0;font-size:13px;font-weight:700;color:${n.textColor};"></p>
    <p id="sn-product" style="margin:2px 0 0;font-size:12px;color:${n.borderColor};font-weight:600;">${namaProduk}</p>
    <p style="margin:3px 0 0;font-size:11px;color:#9ca3af;">Baru saja · beberapa menit lalu</p>
  </div>
</div>
<script>
(function(){var names=${JSON.stringify(names)};var msg="${n.pesanNotif}";var interval=${n.interval * 1000};var durasi=${n.durasi * 1000};var idx=0;var popup=document.getElementById('sn-popup');function showNotif(){var name=names[idx%names.length];idx++;document.getElementById('sn-name').textContent=name+' '+msg;popup.style.display='flex';popup.style.opacity='0';popup.style.transform='translateY(10px)';popup.style.transition='opacity 0.4s,transform 0.4s';setTimeout(function(){popup.style.opacity='1';popup.style.transform='translateY(0)';},50);setTimeout(function(){popup.style.opacity='0';popup.style.transform='translateY(10px)';setTimeout(function(){popup.style.display='none';},400);},durasi);}setTimeout(function(){showNotif();setInterval(showNotif,interval+durasi);},2000);})();
</script>
\`\`\``;
}

// Checklist block builder
function buildChecklistBlock(platformName: string, isScalev: boolean): string {
  return `## ✅ OUTPUT FINAL
Output HARUS:
- 1 file HTML tunggal${isScalev ? '\n- Semua di dalam `#lp-root`\n- Section: max-width 688px + margin auto + padding 35px' : ''}
- CSS inline pada elemen utama
- Layout single column
- Gambar format .webp (placeholder placehold.co)
- Countdown real-time
- Sales notification sebelum \`</body>\`
- Siap inject ke ${platformName}
- **TIDAK ADA** penjelasan di luar HTML`;
}
