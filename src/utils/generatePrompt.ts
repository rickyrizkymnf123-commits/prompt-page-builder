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

  // Scalev device-specific padding rules
  const scalevDeviceRules: Record<string, string> = {
    Desktop: `### SCALEV DESKTOP MODE
- Container lebar: max-width 688px, margin: 0 auto
- Padding halaman: padding-top: 32px; padding-bottom: 32px; padding-left: 128px; padding-right: 128px
- Lebar konten efektif setelah padding: ±432px
- SEMUA section dan wrapper wajib: max-width: 688px; margin: 0 auto; box-sizing: border-box
- Padding internal section: padding: 32px 128px
- Gambar: max-width: 100%; width: 432px atau lebih kecil`,

    Tablet: `### SCALEV TABLET MODE
- Container lebar: max-width 688px, margin: 0 auto
- Padding halaman: padding-top: 32px; padding-bottom: 32px; padding-left: 50px; padding-right: 50px
- Lebar konten efektif setelah padding: ±588px
- SEMUA section dan wrapper wajib: max-width: 688px; margin: 0 auto; box-sizing: border-box
- Padding internal section: padding: 32px 50px
- Gambar: max-width: 100%; width: 588px atau lebih kecil`,

    Mobile: `### SCALEV MOBILE MODE
- Container lebar: max-width 688px, margin: 0 auto
- Padding halaman: padding-top: 35px; padding-bottom: 35px; padding-left: 35px; padding-right: 35px
- Lebar konten efektif setelah padding: ±618px
- SEMUA section dan wrapper wajib: max-width: 688px; margin: 0 auto; box-sizing: border-box
- Padding internal section: padding: 35px
- Margin antar komponen: 16px
- Gambar: max-width: 100%; width: 618px atau lebih kecil
- Layout: SINGLE COLUMN (tidak ada 2 kolom berdampingan di mobile!)
- Flex direction: column untuk semua layout yang biasanya row`,
  };

  // Platform-specific output rules
  const platformOutputRules: Record<string, string> = {
    'Scalev': `## PLATFORM TARGET: Scalev (${deviceTarget})
Output HARUS berupa satu blok kode HTML dengan SEMUA CSS inline (atribut style di setiap elemen). Tidak ada <head>, tidak ada tag <style>, tidak ada CSS external. HTML akan diinjeksi ke dalam page builder Scalev. Gunakan hanya tag: div, section, span, h1-h6, p, a, img, ul, li. Semua gambar gunakan URL placeholder.

${scalevDeviceRules[deviceTarget] || scalevDeviceRules['Mobile']}

### ATURAN KRITIS SCALEV (WAJIB DIIKUTI 100%):
1. SETIAP elemen harus punya style inline — TIDAK BOLEH ada elemen tanpa style
2. max-width: 688px WAJIB ada di wrapper utama dan SETIAP section
3. margin: 0 auto WAJIB ada di SETIAP section agar center
4. width: 100% WAJIB ada di SETIAP img tag
5. box-sizing: border-box WAJIB ada di semua container
6. Jangan pakai % width yang melebihi container (misal: width: 100vw dilarang)
7. Padding hanya dari dalam (internal section), BUKAN dari page margin`,

    'Berdu': `## PLATFORM TARGET: Berdu
Output HARUS berupa satu blok kode HTML dengan SEMUA CSS inline (atribut style di setiap elemen). Tidak ada <head>, tidak ada tag <style>, tidak ada CSS external. HTML akan diinjeksi ke dalam page builder Berdu. Gunakan hanya tag: div, section, span, h1-h6, p, a, img, ul, li. Semua gambar gunakan URL placeholder. Berdu menggunakan container max-width: 780px.`,

    'Lynk.id': `## PLATFORM TARGET: Lynk.id
Output HARUS berupa satu blok kode HTML dengan SEMUA CSS inline (atribut style di setiap elemen). Tidak ada <head>, tidak ada tag <style>, tidak ada CSS external. HTML akan diinjeksi ke dalam page builder Lynk.id. Gunakan hanya tag: div, section, span, h1-h6, p, a, img, ul, li. Semua gambar gunakan URL placeholder.`,

    'WordPress': `## PLATFORM TARGET: WordPress (Elementor/Divi)
Output HARUS berupa satu blok kode HTML. Boleh menggunakan tag <style> yang di-scope dalam blok HTML. Gunakan HTML semantik. Semua gambar gunakan URL placeholder. Hindari shortcode WordPress. Struktur kompatibel dengan Elementor HTML widget atau Divi code module.`,

    'Shopify': `## PLATFORM TARGET: Shopify
Output HARUS berupa satu blok kode HTML dengan CSS inline. Hindari Liquid templating. Gunakan hanya tag HTML standar. Semua gambar gunakan URL placeholder. Struktur harus kompatibel dengan Shopify custom HTML sections.`,

    'Standalone': `## PLATFORM TARGET: Standalone HTML
Output HARUS berupa file HTML lengkap dan mandiri termasuk <!DOCTYPE html>, <head> dengan meta tags, import Google Fonts, dan <body>. Gunakan tag <style> di <head> untuk CSS. Semua gambar gunakan URL placeholder dari https://placehold.co/`,
  };

  const outputRule = platformOutputRules[platformName] || platformOutputRules['Standalone'];
  const isStandalone = platformName === 'Standalone';
  const isScalev = platformName === 'Scalev';

  const sectionsToInclude = activeElements.join('\n- ');

  const referensiSection = (form.linkReferensi || form.inspirasiDesain)
    ? `\n## REFERENSI DESAIN${form.linkReferensi ? `\n- URL Referensi: ${form.linkReferensi}` : ''}${form.inspirasiDesain ? `\n- Yang ingin ditiru: ${form.inspirasiDesain}` : ''}`
    : '';

  const layoutSection = isScalev && deviceTarget === 'Mobile'
    ? `## LAYOUT WAJIB: SINGLE COLUMN (Mobile Scalev)
Karena target device adalah MOBILE di Scalev, SEMUA section HARUS single column:
- DILARANG layout 2 kolom berdampingan (flex-direction: row dengan 2 div sejajar)
- Setiap section: teks di atas, gambar di bawah (atau sebaliknya bergantian)
- Contoh struktur section mobile:
<section style="max-width:688px;margin:0 auto;padding:35px;box-sizing:border-box;">
  <div style="margin-bottom:24px;"> [KONTEN TEKS: heading, paragraf, bullet] </div>
  <div> <img src="https://placehold.co/618x400/1a1a2e/ffffff?text=Section+Name" alt="deskripsi" style="width:100%;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.3);"> </div>
</section>
WAJIB minimum 3-4 section menggunakan pola teks+gambar bergantian (atas-bawah).`
    : `## LAYOUT WAJIB: TEKS + GAMBAR BERGANTIAN (Z-PATTERN)
Setiap section konten WAJIB menggunakan layout 2 kolom (50/50 atau 60/40) dengan pola bergantian:

- Section GANJIL (1, 3, 5, ...): Kolom KIRI = teks/konten  |  Kolom KANAN = gambar placeholder
- Section GENAP (2, 4, 6, ...): Kolom KIRI = gambar placeholder  |  Kolom KANAN = teks/konten

Contoh struktur HTML setiap section konten:
<section style="display:flex;flex-wrap:wrap;align-items:center;gap:40px;padding:60px 20px;max-width:688px;margin:0 auto;box-sizing:border-box;">
  <div style="flex:1;min-width:260px;"> [KONTEN TEKS: heading, paragraf, bullet points] </div>
  <div style="flex:1;min-width:260px;"> <img src="https://placehold.co/600x450/1a1a2e/ffffff?text=Nama+Section" alt="deskripsi" width="600" height="450" style="width:100%;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.3);"> </div>
</section>

WAJIB minimum 3-4 section menggunakan pola teks+gambar bergantian.

Section yang BOLEH full-width (tanpa pola bergantian):
- Hero Section: full width, background image/gradient, heading besar, CTA
- Testimonial/Social Proof: grid atau carousel
- Pricing Table: tabel/card harga
- CTA Section akhir: full width, tombol besar
- Footer`;

  const salesNotifBlock = buildSalesNotifBlock(form);

  const countdownBlock = buildCountdownBlock(form);

  return `Kamu adalah developer landing page expert dan copywriter yang fokus pada konversi tinggi.

## ROLE & TASK
Buatkan satu halaman landing page lengkap dalam format HTML sesuai instruksi berikut. Kamu WAJIB mengikuti setiap detail tanpa mengurangi atau mengubah apapun.

${outputRule}

${layoutSection}

## PROFIL PRODUK
- Nama Produk: ${form.namaProduk || '[Nama Produk]'}
- Tipe: ${form.tipeProduk || '-'}
- Tujuan: ${form.tujuanUtama || '-'}
- Harga Normal: ${hargaNormalFormatted}
- Harga Promo: ${hargaPromoFormatted}
- Deskripsi/Benefit: ${form.deskripsiBenefit || '-'}
- CTA Utama: ${form.ctaUtama || 'Beli Sekarang'}

## TARGET MARKET
- Level Awareness: ${awarenessLevel}
- Target Audience: ${form.targetAudience || '-'}

## GAYA & DESAIN
- Framework Copywriting: ${form.framework || 'PAS'}
- Gaya Bahasa: ${form.gayaBahasa || 'Profesional'}
- Gaya Desain: ${form.gayaDesain || 'Modern Minimalis'}
${referensiSection}

## SECTIONS YANG HARUS ADA
- ${sectionsToInclude || 'Hero, Benefit, CTA'}

## ATURAN OUTPUT (WAJIB DIIKUTI 100%)
1. Gunakan framework copywriting "${form.framework || 'PAS'}" untuk struktur storytelling.
2. Gaya bahasa: ${form.gayaBahasa || 'Profesional'} — konsisten di seluruh halaman.
3. Gaya desain: ${form.gayaDesain || 'Modern Minimalis'} — warna, spacing, typography harus sesuai tema.
4. Setiap section HARUS punya section wrapper dengan padding yang cukup dan background yang kontras bergantian.
5. Gunakan visual hierarchy yang jelas: heading besar → subheading → body text → CTA.
6. Tambahkan icon/emoji untuk memperkuat poin benefit (✅, 🔥, ⚡, dll).
7. Testimonial harus terlihat natural dengan nama, foto placeholder, dan kutipan.
8. Gunakan warna kontras untuk CTA button — harus langsung terlihat.
9. Semua teks harus menggunakan font-family: sans-serif sebagai fallback.${isStandalone ? '\n10. Import Google Fonts yang sesuai dengan gaya desain di <head>.' : '\n10. Gunakan font-family inline yang aman (sans-serif, serif, monospace).'}
11. WAJIB responsive — gunakan max-width dan width:100% pada semua elemen utama.
12. Semua gambar HARUS tag <img> standar — jangan embed base64 atau background-image CSS.
13. Tombol CTA harus berupa tag <a href="#"> atau <button> yang jelas, besar, dan eye-catching.
14. COUNTDOWN TIMER WAJIB BERGERAK: Jika ada section Scarcity/Timer, WAJIB gunakan JavaScript setInterval yang berjalan real-time setiap 1 detik. Buat elemen dengan id unik (cd-days, cd-hours, cd-minutes, cd-seconds) dan atribut data-edit-id="countdown-deadline" pada container timer agar bisa diedit.${countdownBlock}${isScalev ? `
15. KRITIS SCALEV: Cek ulang SETIAP section — pastikan semua punya max-width:688px dan margin:0 auto sebelum output final.` : ''}${salesNotifBlock}`;
}

function buildCountdownBlock(form: FormState): string {
  const c = form.countdown;
  if (!c?.enabled) return `
Contoh JS countdown wajib:
\`\`\`
(function() {
  var deadline = new Date(Date.now() + 2*24*60*60*1000);
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
Struktur HTML timer (WAJIB gunakan id dan data-edit-id ini):
div id="countdown-container" data-edit-id="countdown-deadline" berisi: span id="cd-days", span id="cd-hours", span id="cd-minutes", span id="cd-seconds"`;

  const totalMs = (c.hari * 86400000) + (c.jam * 3600000) + (c.menit * 60000) + (c.detik * 1000);

  return `
### COUNTDOWN TIMER CUSTOM CONFIG:
- Label: "${c.labelAtas}"
- Durasi: ${c.hari} hari, ${c.jam} jam, ${c.menit} menit, ${c.detik} detik
- Background: ${c.bgColor}
- Warna teks: ${c.textColor}
- Warna accent/angka: ${c.accentColor}

Gunakan konfigurasi warna di atas untuk styling countdown section. JS wajib:
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
Struktur HTML timer (WAJIB):
- Container: div id="countdown-container" data-edit-id="countdown-deadline" style="background:${c.bgColor};color:${c.textColor};..."
- Label: p style="color:${c.accentColor};..." → "${c.labelAtas}"
- Angka: span id="cd-days/hours/minutes/seconds" style="background:${c.accentColor};color:${c.textColor};..."`;
}


function buildSalesNotifBlock(form: FormState): string {
  const n = form.salesNotif;
  if (!n.enabled) return '';

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

  // Use custom colors from config (with fallback defaults)
  const bgColor = n.bgColor || '#ffffff';
  const borderColor = n.borderColor || '#6c63ff';
  const textColor = n.textColor || '#1a1a2e';

  return `

## SALES NOTIFICATION (Social Proof Popup)
Tambahkan kode berikut PERSIS APA ADANYA di bagian akhir <body>, SEBELUM </body>. Jangan modifikasi logika JS-nya, hanya boleh menyesuaikan style jika diperlukan agar sesuai desain.
PENTING: Elemen berikut harus punya id yang tepat agar bisa diedit di Edit Mode: sn-popup, sn-name, sn-product.

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
</script>`;
}

