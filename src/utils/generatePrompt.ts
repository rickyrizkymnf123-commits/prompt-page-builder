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
  const platformName = form.platformTarget || 'Standalone';
  const deviceTarget = form.deviceTarget || 'Mobile';

  return `# 🔥 MASTER PROMPT LANDING PAGE

Anda adalah **Senior Conversion Copywriter + Landing Page Developer Expert** yang telah membuat ratusan landing page high-converting untuk social media ads & direct sales.

Mindset:
- Conversion-focused
- UI/UX minded
- Paham compliance Meta & Google Ads
- Menguasai struktur persuasion modern

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
  
## 🧱 SECTION WAJIB ADA (URUTKAN DENGAN LOGIS)

${buildSectionList(activeElements)}
${buildReferensiBlock(form)}

---
  
${buildCountdownBlock(form)}

---
  
## 🔔 SALES NOTIFICATION POPUP
${buildSalesNotifBlock(form)}

---
  
## 💰 CONVERSION RULES

${buildPricingRules(form, fmt)}

CTA harus:
- \`<a href="#">\` atau \`<button>\`
- Besar, kontras, centered
- Teks: **"${form.ctaUtama || 'Beli Sekarang'}"**

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
function buildSectionList(activeElements: string[]): string {
  const orderedSections = ['Hero Section','Social Proof','Problem Section','Before-After','Video Section','Feature List','Bonus Section','How It Works','Pricing Table','Guarantee','FAQ','Final CTA','Testimonial','Scarcity / Timer'];
  const selected = activeElements.length > 0 ? activeElements : ['Hero Section','Social Proof','Problem Section','Before-After','Video Section','Feature List','Bonus Section','How It Works','Pricing Table','Guarantee','FAQ'];
  const sorted = [...selected].sort((a, b) => {
    const ia = orderedSections.indexOf(a);
    const ib = orderedSections.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });
  const desc: Record<string, string> = {
    'Hero Section': 'hook + value + CTA', 'Social Proof': 'angka/logis', 'Problem Section': 'problem aware',
    'Video Section': 'pakai img placeholder "Video Preview"', 'Feature List': 'benefit jelas',
    'Pricing Table': 'harga normal dicoret, promo ditonjolkan + bonus', 'Guarantee': 'masuk akal', 'Final CTA': 'closing',
    'Testimonial': 'realistis', 'Scarcity / Timer': 'countdown aktif',
  };
  return sorted.map((s, i) => `${i + 1}) ${s}${desc[s] ? ` (${desc[s]})` : ''}`).join('\n');
}

// Platform block builder
function buildPlatformBlock(platformName: string, deviceTarget: string): string {
  const scalevDeviceRules: Record<string, string> = {
    Desktop: `- Padding halaman: 32px vertikal, 128px horizontal
- Lebar konten efektif: ±432px
- Padding internal section: 32px 128px`,
    Tablet: `- Padding halaman: 32px vertikal, 50px horizontal
- Lebar konten efektif: ±588px
- Padding internal section: 32px 50px`,
    Mobile: `- Padding halaman: 35px semua sisi
- Lebar konten efektif: ±618px
- Padding internal section: 35px
- Margin antar komponen: 16px
- Layout: SINGLE COLUMN
- Flex direction: column untuk semua layout`,
  };
  const rules: Record<string, string> = {
    'Scalev': `# 📐 ATURAN STRUKTUR & LAYOUT — SCALEV (${deviceTarget})

0) WAJIB ada wrapper root:
   \`<div id="lp-root" style="min-height:100vh;width:100%;background:#0a0a12;color:#e8e8f0;font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:0;">\`

1) Layout WAJIB **single column** di semua ukuran layar.
2) Setiap SECTION WAJIB: \`max-width:688px\`, \`margin:0 auto\`, \`box-sizing:border-box\`, \`padding:35px\`
3) Tidak boleh grid / multi-column.
4) Flex HANYA \`flex-direction:column\` (pengecualian: countdown angka boleh row).
5) Semua styling WAJIB inline CSS pada elemen utama.
6) Tidak boleh: CDN, external CSS, \`<style>\` tag.
7) Tag: div, section, span, h1-h6, p, a, img, ul, li
8) Gambar: \`<img>\` standar, placeholder placehold.co, width:100%, format .webp jika ada, no base64, no background-image.

### Device Rules (${deviceTarget}):
${scalevDeviceRules[deviceTarget] || scalevDeviceRules['Mobile']}`,
    'Berdu': `# 📐 ATURAN — BERDU

0) Wrapper root: \`<div id="lp-root" style="min-height:100vh;width:100%;background:#0a0a12;color:#e8e8f0;...">\`
1) Single column, max-width:780px, margin:0 auto, padding:35px.
2) Inline CSS. No CDN. Gambar: \`<img>\` + width:100% + format .webp`,
    'Lynk.id': `# 📐 ATURAN — LYNK.ID

0) Wrapper root wajib.
1) Single column, inline CSS.
2) Gambar: \`<img>\` + width:100% + format .webp`,
    'WordPress': `# 📐 ATURAN — WORDPRESS

1) HTML tunggal, boleh \`<style>\` scoped.
2) Semantik HTML, kompatibel Elementor HTML widget.
3) Gambar: \`<img>\` + width:100% + format .webp`,
    'Shopify': `# 📐 ATURAN — SHOPIFY

1) HTML tunggal + CSS inline.
2) Tag standar. Gambar: \`<img>\` + width:100% + format .webp`,
    'Standalone': `# 📐 ATURAN — STANDALONE HTML

1) File HTML lengkap.
2) Boleh \`<style>\` + Google Fonts.
3) Single column, responsive.
4) Gambar: \`<img>\` + width:100% + format .webp`,
  };
  return rules[platformName] || rules['Standalone'];
}

// Design block builder
function buildDesignBlock(form: FormState): string {
  return `# 🎨 DESAIN VISUAL

- Gaya: ${form.gayaDesain || 'Modern Minimalis'} (Premium)
- Tema: **Dark Mode** (background gelap, teks terang)
- **KRITIS:** Background TIDAK BOLEH putih. Wrapper root dan setiap section WAJIB background gelap.
- Warna background: \`#0a0a12\` (root), section bergantian: \`#0f0d1a\`, \`#13111c\`, \`#1a1a2e\`, \`#16132b\`
- Teks: \`#e8e8f0\` / \`#ffffff\`, sekunder: \`#b0b0b0\` / \`#9ca3af\`
- CTA besar, kontras, centered. Setiap section background berbeda.`;
}

// Copywriting block builder
function buildCopywritingBlock(form: FormState, awarenessLevel: string): string {
  return `# ✍️ COPYWRITING FRAMEWORK

Gunakan framework **${form.framework || 'PAS'}** secara natural:
1) Attention → Hook kuat 2) Interest → Problem spesifik 3) Desire → Agitasi 4) Conviction → Solusi + Social Proof 5) Action → CTA + urgency

Awareness: **${awarenessLevel}**
Gaya bahasa: **${form.gayaBahasa || 'Profesional'}**

Hindari: Klaim "pasti"/"jamin"/"100%", overclaim medis/finansial, janji tidak realistis`;
}

// Product block builder
function buildProductBlock(form: FormState, fmt: (v: string) => string): string {
  // Always 4-layer (3 prices: Normal, Promo, Final)
  let pricingInfo = `- Harga Normal: **${fmt(form.hargaNormal)}** (dicoret)`;
  pricingInfo += `\n- Harga Promo: **${fmt(form.hargaPromo)}** (dicoret)`;
  pricingInfo += `\n- 🔥 Harga Diskon (untuk kamu yang beli sekarang): **${fmt(form.hargaFinal)}**`;
  if (form.keteranganDiskon) pricingInfo += `\n- Keterangan: ${form.keteranganDiskon}`;

  let bonusInfo = '';
  if (form.bonusList.length > 0) {
    const bonusItems = form.bonusList.filter(b => b.nama).map(b =>
      `  - ✅ ${b.nama}${b.hargaAsli ? ` → Harga normal: ~~${fmt(b.hargaAsli)}~~` : ''}`
    ).join('\n');
    if (bonusItems) {
      const totalBonus = form.bonusList.reduce((s, b) => s + (Number(b.hargaAsli) || 0), 0);
      bonusInfo = `\n- **Bonus yang disertakan:**\n${bonusItems}\n- Total nilai bonus: **${fmt(String(totalBonus))}**`;
    }
  }

  return `# 📦 PROFIL PRODUK

- Nama Produk: **${form.namaProduk || '[Nama Produk]'}**
- Tipe: ${form.tipeProduk || '-'}
- Tujuan: ${form.tujuanUtama || '-'}
${pricingInfo}
- CTA Utama: **${form.ctaUtama || 'Beli Sekarang'}**
- Target Audience: **${form.targetAudience || '-'}**
${form.deskripsiBenefit ? `- Deskripsi/Benefit: ${form.deskripsiBenefit}` : ''}${bonusInfo}`;
}

// Pricing rules builder
function buildPricingRules(form: FormState, fmt: (v: string) => string): string {
  return `- Harga normal dicoret: **${fmt(form.hargaNormal)}**
- Harga promo dicoret: **${fmt(form.hargaPromo)}**
- ${form.keteranganDiskon || 'Dengan diskon tambahan'}
- **🔥 HARGA DISKON untuk kamu yang beli sekarang (tidak dicoret, paling besar):** **${fmt(form.hargaFinal)}**
- Tambahkan urgency wajar (tanpa overclaim)
- Setiap CTA WAJIB ada micro-copy trust 1–2 baris di bawah tombol

**PENTING:** Tampilkan 3 layer harga secara visual:
1. Harga tertinggi (coret, merah)
2. Harga promo (coret juga)
3. Keterangan diskon tambahan
4. 🔥 Harga diskon untuk kamu yang beli sekarang (besar, bold, warna aksen, TIDAK dicoret)`;
}

// Referensi block builder
function buildReferensiBlock(form: FormState): string {
  if (!form.linkReferensi && !form.inspirasiDesain) return '';
  let block = '\n\n## 🔗 REFERENSI DESAIN';
  if (form.linkReferensi) block += `\n- URL: ${form.linkReferensi}`;
  if (form.inspirasiDesain) block += `\n- Yang ditiru: ${form.inspirasiDesain}`;
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

JavaScript WAJIB (salin PERSIS tanpa modifikasi):
\`\`\`
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
\`\`\`

**PENTING:** Script countdown HARUS diletakkan SEBELUM \`</body>\`. Gunakan \`setTimeout(tick, 1000)\` bukan \`setInterval\` supaya tidak drift. ID elemen WAJIB: \`cd-days\`, \`cd-hours\`, \`cd-minutes\`, \`cd-seconds\`.

HTML WAJIB: Container \`div#countdown-container\`, angka \`span#cd-days/hours/minutes/seconds\` style: \`background:${accent};color:${text}\``;
}

// Sales notification block builder
function buildSalesNotifBlock(form: FormState): string {
  const n = form.salesNotif;
  if (!n.enabled) return 'Tidak ada sales notification.';
  const widths = { small: 280, medium: 320, large: 380 };
  const w = widths[n.ukuran];
  const posStyle: Record<string, string> = { 'bottom-left': 'bottom:24px;left:24px', 'bottom-right': 'bottom:24px;right:24px', 'top-left': 'top:24px;left:24px', 'top-right': 'top:24px;right:24px' };
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
