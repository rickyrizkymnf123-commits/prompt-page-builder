import { FormState } from '@/types/form';

export function generatePrompt(form: FormState): string {
  const activeElements = Object.entries(form.elemenTambahan)
    .filter(([, v]) => v)
    .map(([k]) => k);

  const awarenessMap: Record<string, string> = {
    'Unaware (Belum sadar)': 'Unaware',
    'Problem Aware (Tahu masalah)': 'Problem Aware',
    'Solution Aware (Cari solusi)': 'Solution Aware',
    'Product Aware (Tahu produk)': 'Product Aware',
    'Most Aware (Siap beli)': 'Most Aware',
  };

  const awarenessLevel = awarenessMap[form.levelAwareness] || form.levelAwareness;

  const hargaNormalFormatted = form.hargaNormal
    ? `Rp ${Number(form.hargaNormal).toLocaleString('id-ID')}`
    : '-';
  const hargaPromoFormatted = form.hargaPromo
    ? `Rp ${Number(form.hargaPromo).toLocaleString('id-ID')}`
    : '-';

  const platformName = form.platformTarget || 'Standalone';
  const deviceTarget = form.deviceTarget || 'Mobile';
  const isScalev = platformName === 'Scalev';
  const isStandalone = platformName === 'Standalone';

  const sectionsToInclude = buildSectionList(activeElements);
  const platformBlock = buildPlatformBlock(platformName, deviceTarget);
  const designBlock = buildDesignBlock(form);
  const copywritingBlock = buildCopywritingBlock(form, awarenessLevel);
  const productBlock = buildProductBlock(form, hargaNormalFormatted, hargaPromoFormatted);
  const countdownBlock = buildCountdownBlock(form);
  const salesNotifBlock = buildSalesNotifBlock(form);
  const referensiBlock = buildReferensiBlock(form);
  const checklistBlock = buildChecklistBlock(platformName, isScalev);

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

${platformBlock}

---

${designBlock}

---

${copywritingBlock}

---

${productBlock}

---

## 🧱 SECTION WAJIB ADA (URUTKAN DENGAN LOGIS)

${sectionsToInclude}
${referensiBlock}

---

${countdownBlock}

---

## 🔔 SALES NOTIFICATION POPUP
${salesNotifBlock}

---

## 💰 CONVERSION RULES

- Harga normal dicoret: **${hargaNormalFormatted}**
- Harga promo ditonjolkan: **${hargaPromoFormatted}**
- Tambahkan urgency wajar (tanpa overclaim)
- Setiap CTA WAJIB ada micro-copy trust 1–2 baris di bawah tombol

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

${checklistBlock}`;
}

function buildSectionList(activeElements: string[]): string {
  // Urutan logis sesuai master prompt final
  const orderedSections = [
    'Hero Section',
    'Social Proof',
    'Problem Section',
    'Before-After',
    'Video Section',
    'Feature List',
    'Bonus Section',
    'How It Works',
    'Pricing Table',
    'Guarantee',
    'FAQ',
    'Final CTA',
    'Testimonial',
    'Scarcity / Timer',
  ];

  const selected = activeElements.length > 0 ? activeElements : [
    'Hero Section', 'Social Proof', 'Problem Section', 'Before-After',
    'Video Section', 'Feature List', 'Bonus Section', 'How It Works',
    'Pricing Table', 'Guarantee', 'FAQ',
  ];

  // Sort by logical order, unknown items go to end
  const sorted = [...selected].sort((a, b) => {
    const ia = orderedSections.indexOf(a);
    const ib = orderedSections.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  const descriptions: Record<string, string> = {
    'Hero Section': 'hook + value + CTA',
    'Social Proof': 'angka/logis',
    'Problem Section': 'problem aware',
    'Before-After': '',
    'Video Section': 'pakai img placeholder "Video Preview"',
    'Feature List': 'benefit jelas',
    'Bonus Section': '',
    'How It Works': '',
    'Pricing Table': 'harga normal dicoret, promo ditonjolkan',
    'Guarantee': 'masuk akal',
    'FAQ': '',
    'Final CTA': 'closing',
    'Testimonial': 'realistis',
    'Scarcity / Timer': 'countdown aktif',
  };

  return sorted.map((s, i) => {
    const desc = descriptions[s];
    return `${i + 1}) ${s}${desc ? ` (${desc})` : ''}`;
  }).join('\n');
}

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
- Layout: SINGLE COLUMN (tidak ada 2 kolom berdampingan!)
- Flex direction: column untuk semua layout`,
  };

  const platformRules: Record<string, string> = {
    'Scalev': `# 📐 ATURAN STRUKTUR & LAYOUT — SCALEV (${deviceTarget})

0) WAJIB ada wrapper root agar background tidak ke-override oleh Scalev:
   - Buat elemen paling luar:
     \`<div id="lp-root" style="min-height:100vh;width:100%;background:#0a0a12;color:#e8e8f0;font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:0;">\`
   - Semua konten landing page WAJIB berada di dalam \`#lp-root\`
   - Jangan mengandalkan background di \`<body>\` saja.

1) Layout WAJIB **single column** di semua ukuran layar.

2) Setiap SECTION WAJIB memiliki:
   - \`max-width:688px\`
   - \`margin:0 auto\`
   - \`box-sizing:border-box\`
   - \`padding:35px\`

3) Tidak boleh menggunakan grid atau multi-column layout.

4) Boleh menggunakan flex HANYA jika:
   - Untuk layout utama WAJIB \`flex-direction:column\`
   - Tidak boleh ada 2 kolom konten berdampingan (row layout untuk konten utama dilarang)
   - Pengecualian: countdown angka boleh row/wrap untuk 4 kotak angka.

5) Semua styling WAJIB inline CSS (\`style=""\`) pada elemen-elemen utama.
   - Elemen WAJIB inline style: wrapper root, semua section, container penting, heading, paragraf utama, CTA, pricing box, countdown container, testimonial card, FAQ box.
   - Elemen minor boleh inherit (tidak wajib 100% semua tag punya style).

6) Tidak boleh menggunakan:
   - CDN CSS framework
   - External CSS file
   - \`<style>\` tag

7) Hanya boleh menggunakan tag:
   \`div, section, span, h1-h6, p, a, img, ul, li\`

8) Semua gambar WAJIB:
   - \`<img>\` standar
   - Placeholder: https://placehold.co/
   - \`width:100%\` WAJIB di setiap img
   - Tidak boleh base64
   - Tidak boleh background-image CSS

### Device Rules (${deviceTarget}):
${scalevDeviceRules[deviceTarget] || scalevDeviceRules['Mobile']}`,

    'Berdu': `# 📐 ATURAN STRUKTUR & LAYOUT — BERDU

0) WAJIB ada wrapper root:
   \`<div id="lp-root" style="min-height:100vh;width:100%;background:#0a0a12;color:#e8e8f0;font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:0;">\`

1) Layout single column, max-width: 780px, margin: 0 auto, padding: 35px.
2) Semua styling WAJIB inline CSS pada elemen utama. Elemen minor boleh inherit.
3) Tidak boleh: CDN, external CSS, \`<style>\` tag.
4) Tag yang boleh: div, section, span, h1-h6, p, a, img, ul, li.
5) Gambar: \`<img>\` standar, placeholder https://placehold.co/, width:100%, no base64.`,

    'Lynk.id': `# 📐 ATURAN STRUKTUR & LAYOUT — LYNK.ID

0) WAJIB ada wrapper root:
   \`<div id="lp-root" style="min-height:100vh;width:100%;background:#0a0a12;color:#e8e8f0;font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:0;">\`

1) Layout single column, inline CSS pada elemen utama. Elemen minor boleh inherit.
2) Tidak boleh: CDN, external CSS, \`<style>\` tag.
3) Tag yang boleh: div, section, span, h1-h6, p, a, img, ul, li.
4) Gambar: \`<img>\` standar, placeholder https://placehold.co/, width:100%, no base64.`,

    'WordPress': `# 📐 ATURAN STRUKTUR & LAYOUT — WORDPRESS

1) Output HTML tunggal, boleh menggunakan \`<style>\` tag scoped.
2) HTML semantik, kompatibel Elementor HTML widget / Divi code module.
3) Gambar: \`<img>\` standar, placeholder https://placehold.co/, width:100%.
4) Hindari shortcode WordPress.`,

    'Shopify': `# 📐 ATURAN STRUKTUR & LAYOUT — SHOPIFY

1) Output HTML tunggal dengan CSS inline pada elemen utama.
2) Hindari Liquid templating.
3) Tag HTML standar saja.
4) Gambar: \`<img>\` standar, placeholder https://placehold.co/, width:100%.
5) Kompatibel Shopify custom HTML sections.`,

    'Standalone': `# 📐 ATURAN STRUKTUR & LAYOUT — STANDALONE HTML

1) File HTML lengkap: \`<!DOCTYPE html>\`, \`<head>\`, \`<body>\`.
2) Boleh \`<style>\` di \`<head>\` + import Google Fonts.
3) Layout single column, responsive.
4) Gambar: \`<img>\` standar, placeholder https://placehold.co/, width:100%.`,
  };

  return platformRules[platformName] || platformRules['Standalone'];
}

function buildDesignBlock(form: FormState): string {
  return `# 🎨 DESAIN VISUAL

- Gaya: ${form.gayaDesain || 'Modern Minimalis'} (Premium)
- Tema: **Dark Mode** (background gelap, teks terang)
- **KRITIS:** Background TIDAK BOLEH putih/terang. Wrapper root dan setiap section WAJIB punya background gelap.
- Warna background utama: \`#0a0a12\` (wrapper root)
- Warna background section bergantian: variasi gelap seperti \`#0f0d1a\`, \`#13111c\`, \`#1a1a2e\`, \`#16132b\`
- Warna teks utama: \`#e8e8f0\` atau \`#ffffff\`
- Warna teks sekunder: \`#b0b0b0\` atau \`#9ca3af\`
- Warna aksen/CTA: sesuaikan gaya desain (default: \`#7C3AED\` purple atau \`#ff4757\` merah)
- Visual hierarchy jelas: heading besar → subheading → body → CTA
- Skimming friendly (heading jelas + bullet points)
- Maksimal 1 emoji per heading/bullet
- CTA besar, kontras, eye-catching, centered
- Setiap section punya background kontras bergantian (dark shade berbeda)`;
}

function buildCopywritingBlock(form: FormState, awarenessLevel: string): string {
  return `# ✍️ COPYWRITING FRAMEWORK

Gunakan framework **${form.framework || 'PAS'}** secara natural:

1) Attention → Hook kuat & curiosity-based
2) Interest → Problem spesifik target market
3) Desire → Agitasi + dampak jika tidak diatasi
4) Conviction → Solusi + Social Proof
5) Action → CTA kuat + urgency wajar

Awareness: **${awarenessLevel}**
Gaya bahasa: **${form.gayaBahasa || 'Profesional'}** (konsisten)

Hindari:
- Klaim "pasti", "jamin", "100%"
- Overclaim medis/finansial
- Janji tidak realistis`;
}

function buildProductBlock(form: FormState, hargaNormal: string, hargaPromo: string): string {
  return `# 📦 PROFIL PRODUK

- Nama Produk: **${form.namaProduk || '[Nama Produk]'}**
- Tipe: ${form.tipeProduk || '-'}
- Tujuan: ${form.tujuanUtama || '-'}
- Harga Normal: **${hargaNormal}**
- Harga Promo: **${hargaPromo}**
- CTA Utama: **${form.ctaUtama || 'Beli Sekarang'}**
- Target Audience: **${form.targetAudience || '-'}**
${form.deskripsiBenefit ? `- Deskripsi/Benefit: ${form.deskripsiBenefit}` : ''}`;
}

function buildReferensiBlock(form: FormState): string {
  if (!form.linkReferensi && !form.inspirasiDesain) return '';
  let block = '\n\n## 🔗 REFERENSI DESAIN';
  if (form.linkReferensi) block += `\n- URL Referensi: ${form.linkReferensi}`;
  if (form.inspirasiDesain) block += `\n- Yang ingin ditiru: ${form.inspirasiDesain}`;
  return block;
}

function buildCountdownBlock(form: FormState): string {
  const c = form.countdown;
  const totalMs = c?.enabled
    ? (c.hari * 86400000) + (c.jam * 3600000) + (c.menit * 60000) + (c.detik * 1000)
    : 2 * 24 * 60 * 60 * 1000;

  const label = c?.enabled ? c.labelAtas : '⏰ PROMO BERAKHIR DALAM';
  const bg = c?.enabled ? c.bgColor : '#1a1a2e';
  const text = c?.enabled ? c.textColor : '#ffffff';
  const accent = c?.enabled ? c.accentColor : '#ff4757';
  const durasi = c?.enabled
    ? `${c.hari} hari, ${c.jam} jam, ${c.menit} menit, ${c.detik} detik`
    : '2 hari, 0 jam, 0 menit, 0 detik';

  return `## ⏳ COUNTDOWN TIMER (WAJIB BERGERAK)

Durasi: ${durasi}
Label: **"${label}"**
Background container: **${bg}**
Text: **${text}**
Accent angka: **${accent}**

Gunakan JavaScript berikut tanpa modifikasi logika:

\`\`\`
(function() {
  var deadline = new Date(Date.now() + ${totalMs});
  function tick() {
    var d = deadline - Date.now();
    if (d < 0) return;
    document.getElementById('cd-days').textContent = String(Math.floor(d/86400000)).padStart(2,'0');
    document.getElementById('cd-hours').textContent = String(Math.floor((d%86400000)/3600000)).padStart(2,'0');
    document.getElementById('cd-minutes').textContent = String(Math.floor((d%3600000)/60000)).padStart(2,'0');
    document.getElementById('cd-seconds').textContent = String(Math.floor((d%60000)/1000)).padStart(2,'0');
  }
  setInterval(tick, 1000); tick();
})();
\`\`\`

Struktur HTML WAJIB:
- Container:
  \`div id="countdown-container" data-edit-id="countdown-deadline" style="background:${bg};color:${text};..."\`
- Label:
  \`p style="color:${accent};..."\` → "${label}"
- Angka:
  \`span id="cd-days" ...\`
  \`span id="cd-hours" ...\`
  \`span id="cd-minutes" ...\`
  \`span id="cd-seconds" ...\`
  Semua angka WAJIB style: \`background:${accent};color:${text};...\``;
}

function buildSalesNotifBlock(form: FormState): string {
  const n = form.salesNotif;
  if (!n.enabled) return 'Tidak ada sales notification untuk halaman ini.';

  const widths = { small: 280, medium: 320, large: 380 };
  const w = widths[n.ukuran];
  const posStyle: Record<string, string> = {
    'bottom-left': 'bottom:24px;left:24px',
    'bottom-right': 'bottom:24px;right:24px',
    'top-left': 'top:24px;left:24px',
    'top-right': 'top:24px;right:24px',
  };
  const pos = posStyle[n.position] || 'bottom:24px;left:24px';
  const namaProduk = n.namaProdukNotif || form.namaProduk || 'produk ini';
  const names = n.namaPembeli.split(',').map(s => s.trim()).filter(Boolean);
  const namesJson = JSON.stringify(names);

  const bgColor = n.bgColor || '#ffffff';
  const borderColor = n.borderColor || '#6c63ff';
  const textColor = n.textColor || '#1a1a2e';

  return `Tambahkan kode berikut **PERSIS** sebelum \`</body>\` tanpa mengubah logic JS.
ID WAJIB ADA: \`sn-popup\`, \`sn-name\`, \`sn-product\`

\`\`\`html
<div id="sn-popup" style="display:none;position:fixed;${pos};width:${w}px;background:${bgColor};border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.18);padding:14px 16px;z-index:99999;font-family:sans-serif;align-items:center;gap:12px;border-left:4px solid ${borderColor};">
  <span style="font-size:24px;">${n.emoji}</span>
  <div>
    <p id="sn-name" style="margin:0;font-size:13px;font-weight:700;color:${textColor};"></p>
    <p id="sn-product" style="margin:2px 0 0;font-size:12px;color:${borderColor};font-weight:600;">${namaProduk}</p>
    <p style="margin:3px 0 0;font-size:11px;color:#9ca3af;">Baru saja · beberapa menit lalu</p>
  </div>
</div>
<script>
(function(){
  var names=${namesJson};
  var msg="${n.pesanNotif}";
  var interval=${n.interval * 1000};
  var durasi=${n.durasi * 1000};
  var idx=0;
  var popup=document.getElementById('sn-popup');
  function showNotif(){
    var name=names[idx%names.length]; idx++;
    document.getElementById('sn-name').textContent=name+' '+msg;
    popup.style.display='flex';
    popup.style.opacity='0';
    popup.style.transform='translateY(10px)';
    popup.style.transition='opacity 0.4s,transform 0.4s';
    setTimeout(function(){popup.style.opacity='1';popup.style.transform='translateY(0)';},50);
    setTimeout(function(){
      popup.style.opacity='0';popup.style.transform='translateY(10px)';
      setTimeout(function(){popup.style.display='none';},400);
    },durasi);
  }
  setTimeout(function(){showNotif();setInterval(showNotif,interval+durasi);},2000);
})();
</script>
\`\`\``;
}

function buildChecklistBlock(platformName: string, isScalev: boolean): string {
  const scalevChecks = isScalev ? `
- Semua konten berada di dalam \`#lp-root\`
- Semua section memenuhi: max-width 688px + margin auto + padding 35px + box-sizing border-box
- Semua gambar \`<img>\` + \`width:100%\` + placeholder placehold.co` : '';

  return `## ✅ OUTPUT FINAL (CEK TERAKHIR)

Output HARUS:
- 1 file HTML tunggal${scalevChecks}
- Semua CSS inline pada elemen utama
- Layout single column
- Countdown berjalan real-time
- Sales notification dipasang persis sebelum \`</body>\`
- Siap inject ke ${platformName}
- Tidak ada penjelasan tambahan
- Tidak ada teks di luar HTML${isScalev ? `
- **KRITIS:** Cek ulang SETIAP section — pastikan semua punya max-width:688px, margin:0 auto, dan berada di dalam #lp-root` : ''}`;
}
