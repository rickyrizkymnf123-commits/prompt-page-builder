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

  const sectionsToInclude = activeElements.length > 0
    ? activeElements.map((s, i) => `${i + 1}. ${s}`).join('\n')
    : '1. Hero Section\n2. Benefit\n3. CTA';

  const platformBlock = buildPlatformBlock(platformName, deviceTarget);
  const designBlock = buildDesignBlock(form);
  const copywritingBlock = buildCopywritingBlock(form, awarenessLevel);
  const productBlock = buildProductBlock(form, hargaNormalFormatted, hargaPromoFormatted);
  const countdownBlock = buildCountdownBlock(form);
  const salesNotifBlock = buildSalesNotifBlock(form);
  const referensiBlock = buildReferensiBlock(form);

  return `# 🔥 MASTER PROMPT LANDING PAGE (UNIFIED VERSION)

Anda adalah **Senior Conversion Copywriter + Landing Page Developer Expert** yang berpengalaman menciptakan ratusan landing page high-converting untuk social media ads dan direct sales.

Anda memiliki mindset:
* Conversion-focused
* UI/UX minded
* Paham compliance Meta & Google Ads
* Menguasai struktur persuasion modern

---

## 🎯 TUGAS UTAMA

Buatkan **Landing Page High-Converting** dalam bentuk **kode HTML tunggal (single file)** untuk platform **${platformName}**, dengan desain premium, fokus konversi, dan aman regulasi iklan.

Output harus **langsung berupa HTML**, tanpa penjelasan tambahan.

---

${platformBlock}

---

${designBlock}

---

${copywritingBlock}

---

${productBlock}

---

## 🧱 SECTION WAJIB ADA

${sectionsToInclude}
${referensiBlock}

---

${countdownBlock}

---

## 🔔 SALES NOTIFICATION POPUP
${salesNotifBlock}

---

## 💰 CONVERSION RULES

* Harga normal dicoret: ${hargaNormalFormatted}
* Harga promo ditonjolkan: ${hargaPromoFormatted}
* Tambahkan urgency wajar
* Setiap CTA WAJIB ada micro-copy trust 1–2 baris di bawah tombol

CTA harus:
* \`<a href="#">\` atau \`<button>\`
* Besar
* Kontras
* Centered
* Teks CTA: "${form.ctaUtama || 'Beli Sekarang'}"

---

## 🔐 TRUST & REASSURANCE

Tambahkan:
* Social proof angka/logis
* Testimoni realistis
* FAQ anti keberatan
* Garansi yang masuk akal (tanpa overclaim)

---

## 📦 OUTPUT FINAL

Output HARUS:
* 1 file HTML tunggal
* Semua CSS inline${isStandalone ? ' (boleh pakai <style> di <head>)' : ''}
* JS countdown aktif
* Layout single column
* Siap inject ke ${platformName}
* Tidak ada penjelasan tambahan
* Tidak ada teks di luar HTML${isScalev ? `
* KRITIS: Cek ulang SETIAP section — pastikan semua punya max-width:688px dan margin:0 auto sebelum output final` : ''}`;
}

function buildPlatformBlock(platformName: string, deviceTarget: string): string {
  const scalevDeviceRules: Record<string, string> = {
    Desktop: `* Padding halaman: 32px vertikal, 128px horizontal
* Lebar konten efektif: ±432px
* Padding internal section: 32px 128px`,
    Tablet: `* Padding halaman: 32px vertikal, 50px horizontal
* Lebar konten efektif: ±588px
* Padding internal section: 32px 50px`,
    Mobile: `* Padding halaman: 35px semua sisi
* Lebar konten efektif: ±618px
* Padding internal section: 35px
* Margin antar komponen: 16px
* Layout: SINGLE COLUMN (tidak ada 2 kolom berdampingan!)
* Flex direction: column untuk semua layout`,
  };

  const platformRules: Record<string, string> = {
    'Scalev': `# 📐 ATURAN STRUKTUR & LAYOUT — SCALEV (${deviceTarget})

1. Layout WAJIB **single column** di semua ukuran layar.
2. Setiap section WAJIB memiliki:
   * \`max-width:688px\`
   * \`margin:0 auto\`
   * \`box-sizing:border-box\`
3. Tidak boleh menggunakan grid atau multi-column layout.
4. Semua styling WAJIB inline CSS (\`style=""\`).
5. Tidak boleh menggunakan:
   * CDN CSS framework
   * External CSS file
   * \`<style>\` tag
6. Hanya boleh menggunakan tag:
   \`div, section, span, h1-h6, p, a, img, ul, li\`
7. Semua gambar WAJIB:
   * \`<img>\` standar
   * Menggunakan placeholder: https://placehold.co/
   * Tidak boleh base64
   * Tidak boleh background-image CSS
8. SETIAP elemen harus punya style inline — TIDAK BOLEH ada elemen tanpa style
9. width: 100% WAJIB ada di SETIAP img tag

### Device Rules (${deviceTarget}):
${scalevDeviceRules[deviceTarget] || scalevDeviceRules['Mobile']}`,

    'Berdu': `# 📐 ATURAN STRUKTUR & LAYOUT — BERDU

1. Layout single column, max-width: 780px, margin: 0 auto.
2. Semua styling WAJIB inline CSS.
3. Tidak boleh: CDN, external CSS, \`<style>\` tag.
4. Tag yang boleh: div, section, span, h1-h6, p, a, img, ul, li.
5. Gambar: \`<img>\` standar, placeholder https://placehold.co/, no base64.`,

    'Lynk.id': `# 📐 ATURAN STRUKTUR & LAYOUT — LYNK.ID

1. Layout single column, inline CSS only.
2. Tidak boleh: CDN, external CSS, \`<style>\` tag.
3. Tag yang boleh: div, section, span, h1-h6, p, a, img, ul, li.
4. Gambar: \`<img>\` standar, placeholder https://placehold.co/, no base64.`,

    'WordPress': `# 📐 ATURAN STRUKTUR & LAYOUT — WORDPRESS

1. Output HTML tunggal, boleh menggunakan \`<style>\` tag scoped.
2. HTML semantik, kompatibel Elementor HTML widget / Divi code module.
3. Gambar: \`<img>\` standar, placeholder https://placehold.co/.
4. Hindari shortcode WordPress.`,

    'Shopify': `# 📐 ATURAN STRUKTUR & LAYOUT — SHOPIFY

1. Output HTML tunggal dengan CSS inline.
2. Hindari Liquid templating.
3. Tag HTML standar saja.
4. Gambar: \`<img>\` standar, placeholder https://placehold.co/.
5. Kompatibel Shopify custom HTML sections.`,

    'Standalone': `# 📐 ATURAN STRUKTUR & LAYOUT — STANDALONE HTML

1. File HTML lengkap: \`<!DOCTYPE html>\`, \`<head>\`, \`<body>\`.
2. Boleh \`<style>\` di \`<head>\` + import Google Fonts.
3. Layout single column, responsive.
4. Gambar: \`<img>\` standar, placeholder https://placehold.co/.`,
  };

  return platformRules[platformName] || platformRules['Standalone'];
}

function buildDesignBlock(form: FormState): string {
  return `# 🎨 DESAIN VISUAL

* Gaya Desain: ${form.gayaDesain || 'Modern Minimalis'}
* Tema: **DARK MODE WAJIB** — sesuaikan dengan gaya "${form.gayaDesain || 'Modern Minimalis'}"
* **KRITIS:** Background TIDAK BOLEH putih/terang. Setiap section dan container WAJIB punya background gelap via inline style.
* Warna background utama: \`#0f0d1a\` atau \`#1a1a2e\` (dark purple/navy)
* Warna background section bergantian: gunakan variasi gelap seperti \`#13111c\`, \`#1a1a2e\`, \`#0f0d1a\`, \`#16132b\`
* Warna teks utama: \`#ffffff\` atau \`#f0f0f0\`
* Warna teks sekunder: \`#b0b0b0\` atau \`#9ca3af\`
* Warna aksen/CTA: sesuaikan gaya desain (default: \`#7C3AED\` purple atau \`#ff4757\` merah)
* **SETIAP elemen div/section WAJIB punya style="background-color:..." yang gelap** — jangan biarkan ada elemen tanpa background karena Scalev default putih
* CTA harus besar, kontras, eye-catching
* Skimming friendly (heading jelas + bullet points)
* Maksimal 1 emoji per heading/bullet
* Gunakan font modern (sans-serif sebagai fallback)
* Visual hierarchy: heading besar → subheading → body text → CTA
* Setiap section punya background kontras bergantian (tetap dalam range warna gelap)`;
}

function buildCopywritingBlock(form: FormState, awarenessLevel: string): string {
  return `# ✍️ COPYWRITING FRAMEWORK

Gunakan framework: **${form.framework || 'PAS'}** secara natural dengan struktur persuasi:

1. Attention → Hook kuat & curiosity-based
2. Interest → Problem spesifik target market
3. Desire → Agitasi + dampak jika tidak diatasi
4. Conviction → Solusi + Social Proof
5. Action → CTA kuat + urgency

Awareness level: **${awarenessLevel}**
Gaya Bahasa: **${form.gayaBahasa || 'Profesional'}** — konsisten di seluruh halaman.

Hindari:
* Klaim "pasti", "jamin", "100%"
* Overclaim medis/finansial
* Janji tidak realistis`;
}

function buildProductBlock(form: FormState, hargaNormal: string, hargaPromo: string): string {
  return `# 📦 PROFIL PRODUK

* **Nama Produk:** ${form.namaProduk || '[Nama Produk]'}
* **Tipe:** ${form.tipeProduk || '-'}
* **Tujuan:** ${form.tujuanUtama || '-'}
* **Harga Normal:** ${hargaNormal}
* **Harga Promo:** ${hargaPromo}
* **Deskripsi/Benefit:** ${form.deskripsiBenefit || '-'}
* **CTA Utama:** ${form.ctaUtama || 'Beli Sekarang'}
* **Target Audience:** ${form.targetAudience || '-'}`;
}

function buildReferensiBlock(form: FormState): string {
  if (!form.linkReferensi && !form.inspirasiDesain) return '';
  let block = '\n\n## 🔗 REFERENSI DESAIN';
  if (form.linkReferensi) block += `\n* URL Referensi: ${form.linkReferensi}`;
  if (form.inspirasiDesain) block += `\n* Yang ingin ditiru: ${form.inspirasiDesain}`;
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
Label: "${label}"
Background: ${bg} | Text: ${text} | Accent angka: ${accent}

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
* Container: \`id="countdown-container"\` \`data-edit-id="countdown-deadline"\` \`style="background:${bg};color:${text};..."\`
* Label: \`p style="color:${accent};..."\` → "${label}"
* Angka: \`span id="cd-days/hours/minutes/seconds"\` \`style="background:${accent};color:${text};..."\``;
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

  return `Tambahkan kode berikut PERSIS sebelum \`</body>\` tanpa mengubah logic JS.
ID WAJIB ADA: sn-popup, sn-name, sn-product

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
