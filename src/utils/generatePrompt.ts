import { FormState } from '@/types/form';

export function generatePrompt(form: FormState): string {
  const activeElements = Object.entries(form.elemenTambahan)
    .filter(([, v]) => v)
    .map(([k]) => k);

  const hargaSection = form.hargaNormal || form.hargaPromo
    ? `\n## Offer\n- Harga Normal: ${form.hargaNormal || '-'}\n- Harga Promo: ${form.hargaPromo || '-'}`
    : '';

  const platformInstructions: Record<string, string> = {
    'Scalev': 'Buat dalam format HTML single page yang kompatibel dengan Scalev page builder. Gunakan struktur section-based.',
    'Lynk.id': 'Buat dalam format HTML single page yang kompatibel dengan Lynk.id. Gunakan layout single column yang mobile-first.',
    'WordPress (Elementor/Divi)': 'Buat dalam format HTML single page yang bisa di-import ke WordPress dengan Elementor atau Divi. Gunakan section dan column structure.',
    'Shopify': 'Buat dalam format HTML/Liquid single page yang kompatibel dengan Shopify theme. Gunakan section-based layout.',
    'Copy HTML': 'Buat dalam format HTML single file standalone. Tidak bergantung pada platform apapun.',
  };

  return `# ROLE
Kamu adalah AI Landing Page Expert — seorang copywriter, UI designer, dan conversion strategist yang menguasai framework ${form.framework}.

# TASK
Buatkan satu landing page HTML lengkap untuk produk "${form.namaProduk}" menggunakan framework copywriting **${form.framework}** dengan gaya bahasa **${form.gayaBahasa}**.

# PRODUCT PROFILE
- Nama Produk: ${form.namaProduk}
- Tipe Produk: ${form.tipeProduk}
- Tujuan Utama: ${form.tujuanUtama}
- Level Awareness Target: ${form.levelAwareness}
- Target Audience: ${form.targetAudience}
- Deskripsi & Benefit: ${form.deskripsiBenefit || '-'}
- CTA Utama: ${form.ctaUtama || '-'}
${hargaSection}

# DESIGN STYLE
- Gaya Desain: ${form.gayaDesain}

# LAYOUT RULES
1. Single column layout
2. Mobile-first responsive
3. Dark mode default
4. Gunakan Tailwind CSS (CDN)
5. Single HTML file, no external dependencies selain Tailwind CDN
6. Micro-copy pada setiap CTA button
7. Smooth scroll antar section

# PLATFORM
${platformInstructions[form.platformTarget] || platformInstructions['Copy HTML']}

# ADDITIONAL SECTIONS
Tambahkan section berikut ke dalam landing page:
${activeElements.map((el) => `- ${el}`).join('\n')}

# COMPLIANCE RULES
- Tidak boleh ada overclaim atau janji berlebihan
- Gunakan bahasa yang etis dan tidak manipulatif
- Sertakan disclaimer jika diperlukan
- Pastikan aksesibilitas dasar (alt text, contrast ratio, semantic HTML)

# OUTPUT REQUIREMENTS
- Output: Satu file HTML lengkap
- Styling: Tailwind CSS via CDN
- Layout: Single column, responsive
- Mode: Dark mode default
- Semua teks dalam Bahasa Indonesia
- Siap di-copy-paste dan langsung bisa digunakan`;
}
