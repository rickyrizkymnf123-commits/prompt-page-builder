import { FormState } from '@/types/form';

export function generatePrompt(form: FormState): string {
  const activeElements = Object.entries(form.elemenTambahan)
    .filter(([, v]) => v)
    .map(([k]) => k);

  const hargaSection = form.hargaNormal || form.hargaPromo
    ? `\nPENAWARAN (OFFER):\n\n- Harga Normal: ${form.hargaNormal || '-'}\n- Harga Promo: ${form.hargaPromo || '-'}\n- CTA Utama: "${form.ctaUtama || '-'}"`
    : '';

  const platformInstructions: Record<string, string> = {
    'Scalev': 'Scalev',
    'Lynk.id': 'Lynk.id',
    'WordPress (Elementor/Divi)': 'WordPress (Elementor/Divi)',
    'Shopify': 'Shopify',
    'Copy HTML': 'Copy HTML',
  };

  const platformName = platformInstructions[form.platformTarget] || 'Copy HTML';

  const awarenessMap: Record<string, string> = {
    'Unaware (Belum sadar)': 'Unaware',
    'Problem Aware (Tahu masalah)': 'Problem Aware',
    'Solution Aware (Cari solusi)': 'Solution Aware',
    'Product Aware (Tahu produk)': 'Product Aware',
    'Most Aware (Siap beli)': 'Most Aware',
  };

  const awarenessLevel = awarenessMap[form.levelAwareness] || form.levelAwareness;

  return `ANDA ADALAH: Senior Conversion Copywriter + UI/UX minded marketer yang sudah menciptakan ratusan landing page yang mengkonversi untuk penjualan di social media.

TUGAS ANDA: Menulis Copywriting Landing Page (Sales Page) dengan struktur HTML yang rapi, persuasif, dan aman untuk kebijakan iklan (Meta/Google Ads Compliance).

ATURAN PENULISAN & LAYOUT (WAJIB DIPATUHI):

1. LAYOUT: Desain WAJIB menggunakan SATU KOLOM TUNGGAL (Single Column) di seluruh ukuran layar (Mobile, Tablet, Desktop). Jangan gunakan grid atau layout berkolom meskipun di desktop.

2. TEMA VISUAL: Wajib menggunakan latar belakang Dark Mode (Gelap) di seluruh bagian. Gunakan warna teks terang (putih/abu) untuk keterbacaan yang maksimal.

3. Skimming-friendly: Gunakan heading yang jelas dan bullet points.

4. Emoji hemat & relevan: Maksimal 1 emoji per bullet point atau heading. Jangan berlebihan.

5. Headline Curiosity-First atau menyebut masalah spesifik. Hindari headline generik yang membosankan.

6. Hidden CTA Wajib: Tuliskan 1–2 baris teks reassurance/trust (micro-copy) tepat di bawah setiap tombol CTA.

7. Anti Overclaim: Jangan gunakan kata "pasti", "jamin", "100%", atau klaim medis/finansial yang tidak realistis agar aman dari banned iklan.

8. Penyesuaian Awareness: Tulis copywriting dengan level awareness "${awarenessLevel}". Fokus pada "Sadar masalah, cari solusi".

9. Tone: Gunakan gaya bahasa "${form.gayaBahasa}".

PROFIL PRODUK & MARKET:

- Nama Produk: ${form.namaProduk || '-'}

- Kategori: ${form.tipeProduk || '-'}

- Deskripsi & Benefit: ${form.deskripsiBenefit || form.namaProduk || '-'}

- Target Market: ${form.targetAudience || '-'}

- Tujuan Utama: ${form.tujuanUtama || '-'}

- Framework Utama: ${form.framework || '-'}
${hargaSection}

STRUKTUR HALAMAN (PLATFORM: ${platformName}):

1. HERO SECTION: Hook maut yang relevan dengan target audience.

2. BODY CONTENT: Mengikuti alur framework ${form.framework || '-'}.

3. ADDITIONAL SECTIONS: Wajib masukkan section tambahan berikut: ${activeElements.join(', ') || '-'}.

4. TRUST ELEMENTS: Masukkan Social Proof dan Reassurance.

5. CONVERSION BLOCK: Kontras harga dan urgensi yang masuk akal.

6. HIDDEN CTA: Pastikan ada micro-copy trust di bawah tombol.

OUTPUT: Generate kode HTML utuh (single file) dengan Tailwind CSS, visual premium sesuai gaya "${form.gayaDesain || 'Bold & High Conversion'}" dengan nuansa warna dominan "dark ungu", dan copywriting yang sangat persuasif namun aman secara regulasi.`;
}
