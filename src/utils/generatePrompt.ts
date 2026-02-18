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
Output HARUS berupa satu blok kode HTML dengan SEMUA CSS inline (atribut style di setiap elemen). Tidak ada <head>, tidak ada tag <style>, tidak ada CSS external. HTML akan diinjeksi ke dalam page builder Scalev. Gunakan hanya tag: div, section, span, h1-h6, p, a, img, ul, li. Semua gambar gunakan URL placeholder.`,

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

  const sectionsToInclude = activeElements.join('\n- ');

  const referensiSection = (form.linkReferensi || form.inspirasiDesain)
    ? `\n## REFERENSI DESAIN${form.linkReferensi ? `\n- URL Referensi: ${form.linkReferensi}` : ''}${form.inspirasiDesain ? `\n- Yang ingin ditiru: ${form.inspirasiDesain}` : ''}`
    : '';

  return `Kamu adalah developer landing page expert dan copywriter yang fokus pada konversi tinggi.

## TUGAS
Buatkan landing page yang high-converting dalam bentuk kode HTML${isStandalone ? ' lengkap (full HTML file)' : ' tunggal dengan inline CSS'}.

## FRAMEWORK COPYWRITING
Gunakan framework **${form.framework || 'PAS'}** untuk menyusun copy. Susun alur konten mengikuti formula ini secara ketat dari atas ke bawah.

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

## LAYOUT WAJIB: TEKS + GAMBAR BERGANTIAN (Z-PATTERN)
Setiap section konten WAJIB menggunakan layout 2 kolom (50/50 atau 60/40) dengan pola bergantian:

- Section GANJIL (1, 3, 5, ...): Kolom KIRI = teks/konten  |  Kolom KANAN = gambar placeholder
- Section GENAP (2, 4, 6, ...): Kolom KIRI = gambar placeholder  |  Kolom KANAN = teks/konten

Contoh struktur HTML setiap section konten:
<section style="display:flex;flex-wrap:wrap;align-items:center;gap:60px;padding:80px 5%;max-width:1200px;margin:0 auto;">
  <div style="flex:1;min-width:300px;"> [KONTEN TEKS: heading, paragraf, bullet points] </div>
  <div style="flex:1;min-width:300px;"> <img src="https://placehold.co/600x450/1a1a2e/ffffff?text=Nama+Section" alt="deskripsi" width="600" height="450" style="width:100%;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.3);"> </div>
</section>

WAJIB minimum 3-4 section menggunakan pola teks+gambar bergantian.

Section yang BOLEH full-width (tanpa pola bergantian):
- Hero Section: full width, background image/gradient, heading besar, CTA
- Testimonial/Social Proof: grid atau carousel
- Pricing Table: tabel/card harga
- CTA Section akhir: full width, tombol besar
- Footer

## ATURAN PENTING
1. SEMUA styling HARUS inline CSS (style="...") di setiap element${isStandalone ? ' atau dalam <style> tag di <head>' : ''}.
2. TIDAK BOLEH ada file CSS external, TIDAK BOLEH pakai CDN CSS framework.
3. Responsive: gunakan flex-wrap dan min-width untuk layout mobile yang baik.
4. Setiap <img> WAJIB memiliki: src dari placehold.co ukuran realistis, atribut alt, width, dan height.
5. Contoh gambar placeholder: https://placehold.co/600x450/1a1a2e/ffffff?text=Foto+Produk
6. Tambahkan smooth scroll dan micro-interaction modern jika memungkinkan.
7. Landing page harus terlihat stunning, premium, dan dioptimasi untuk konversi.
8. Gunakan Google Fonts via @import (Inter, Poppins, atau sejenis).
9. Anti Overclaim: Jangan gunakan kata "pasti", "jamin", "100%", atau klaim medis/finansial tidak realistis.
10. Hidden CTA Wajib: Tuliskan 1-2 baris micro-copy trust tepat di bawah setiap tombol CTA.
11. Output HANYA kode HTML mentah, tanpa penjelasan, tanpa markdown code block.
12. Semua gambar HARUS tag <img> standar — jangan embed base64 atau background-image CSS.
13. Tombol CTA harus berupa tag <a href="#"> atau <button> yang jelas, besar, dan eye-catching.`;
}
