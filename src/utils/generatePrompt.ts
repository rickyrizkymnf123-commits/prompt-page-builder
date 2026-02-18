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

  // Platform-specific output rules
  const platformOutputRules: Record<string, string> = {
    'Scalev': `## PLATFORM TARGET: Scalev
Output MUST be a single HTML code block with ALL CSS inline (style attribute on each element). No <head>, no <style> tag, no external CSS. The HTML will be injected inside Scalev's page builder. Use only div, section, span, h1-h6, p, a, img, ul, li tags. All images use placeholder URLs.`,

    'Lynk.id': `## PLATFORM TARGET: Lynk.id
Output MUST be a single HTML code block with ALL CSS inline (style attribute on each element). No <head>, no <style> tag, no external CSS. The HTML will be injected inside Lynk.id's page builder. Use only div, section, span, h1-h6, p, a, img, ul, li tags. All images use placeholder URLs.`,

    'WordPress': `## PLATFORM TARGET: WordPress (Elementor/Divi)
Output MUST be a single HTML code block. You may use <style> tags scoped within the HTML block. Use semantic HTML. All images use placeholder URLs. Avoid WordPress shortcodes. Structure compatible with Elementor HTML widget or Divi code module.`,

    'Shopify': `## PLATFORM TARGET: Shopify
Output MUST be a single HTML code block with inline CSS. Avoid Liquid templating. Use only standard HTML tags. All images use placeholder URLs. Structure must be compatible with Shopify's custom HTML sections.`,

    'Standalone': `## PLATFORM TARGET: Standalone HTML
Output MUST be a complete, self-contained single HTML file including <!DOCTYPE html>, <head> with meta tags, Google Fonts import, and <body>. Use <style> tags in <head> for CSS. All images use placeholder URLs from https://placehold.co/`,
  };

  const outputRule = platformOutputRules[platformName] || platformOutputRules['Standalone'];
  const isStandalone = platformName === 'Standalone';

  const sectionsToInclude = activeElements.join('\n- ');

  const referensiSection = (form.linkReferensi || form.inspirasiDesain)
    ? `\n## REFERENSI DESAIN${form.linkReferensi ? `\n- URL Referensi: ${form.linkReferensi}` : ''}${form.inspirasiDesain ? `\n- Yang ingin ditiru: ${form.inspirasiDesain}` : ''}`
    : '';

  return `Kamu adalah developer landing page expert dan copywriter yang fokus pada konversi.

## TUGAS
Buatkan landing page yang high-converting dalam bentuk kode HTML${isStandalone ? ' lengkap (full HTML file)' : ' tunggal dengan inline CSS'}.

## FRAMEWORK COPYWRITING
Gunakan framework **${form.framework || 'PAS'}** untuk menyusun copy. Susun alur konten mengikuti formula ini secara ketat.

## TONE & BAHASA
- Gaya penulisan: **${form.gayaBahasa || 'Professional & Formal'}**
- Bahasa: **Indonesia**

## INFORMASI PRODUK
- Tipe produk: ${form.tipeProduk || '-'}
- Nama produk: ${form.namaProduk || '-'}
- Deskripsi: ${form.deskripsiBenefit || '-'}
- Harga normal: ${hargaNormalFormatted}
- Harga promo: ${hargaPromoFormatted}
- CTA utama: "${form.ctaUtama || 'Beli Sekarang'}"

## TARGET AUDIENCE
- Tujuan utama: **${form.tujuanUtama || 'Sales / Beli Langsung'}**
- Awareness level: **${awarenessLevel || 'Most Aware'}**
- Target market: **${form.targetAudience || '-'}**

## DESAIN VISUAL
- Gaya desain: **${form.gayaDesain || 'Bold & High Conversion'}**
${referensiSection}
## SECTION YANG HARUS ADA
- ${sectionsToInclude}

${outputRule}

## STRUKTUR LAYOUT (WAJIB)
Gunakan pola layout **TEKS + GAMBAR secara bergantian** di setiap section konten:
- Section ganjil: konten teks di kiri, gambar placeholder di kanan
- Section genap: gambar placeholder di kiri, konten teks di kanan
- Setiap gambar wajib menggunakan tag <img> dengan src dari https://placehold.co/ ukuran realistis (misal: 600x400, 800x500)
- Minimal 3–4 section yang menggunakan pola ini (selain Hero dan CTA)
- Hero section boleh full-width dengan gambar latar/background
- Semua elemen <img> WAJIB memiliki atribut src, alt, dan width/height yang tepat

## ATURAN PENTING
1. SEMUA styling HARUS inline CSS (style="...") di setiap element${isStandalone ? ' atau dalam <style> tag di <head>' : ''}.
2. TIDAK BOLEH ada file CSS external, TIDAK BOLEH pakai CDN CSS framework.
3. Harus fully responsive dengan inline media queries jika diperlukan.
4. Gunakan placeholder image profesional dari https://placehold.co/ — contoh: https://placehold.co/600x400/1a1a2e/ffffff?text=Produk+Foto
5. Tambahkan smooth scroll dan micro-interaction modern jika memungkinkan.
6. Landing page harus terlihat stunning, premium, dan dioptimasi untuk konversi.
7. Gunakan Google Fonts via @import jika perlu (Inter atau sejenis).
8. Anti Overclaim: Jangan gunakan kata "pasti", "jamin", "100%", atau klaim medis/finansial yang tidak realistis.
9. Hidden CTA Wajib: Tuliskan 1–2 baris teks reassurance/trust (micro-copy) tepat di bawah setiap tombol CTA.
10. Output HANYA kode HTML, tanpa penjelasan.
11. Setiap gambar placeholder HARUS bisa diganti — jangan embed base64 atau background-image CSS, gunakan tag <img> standar.`;
}
