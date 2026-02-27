export interface LpTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail_url: string;
  html_content: string;
}

export const sampleTemplates: LpTemplate[] = [
  {
    id: 'tpl-ebook-1',
    title: 'Ebook / Digital Product',
    description: 'Template landing page untuk produk digital (ebook, template, toolkit) dengan dark theme premium.',
    category: 'Digital Product',
    thumbnail_url: 'https://placehold.co/400x300/0f0d1a/7C3AED?text=Ebook+Template',
    html_content: `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Ebook Landing Page</title></head><body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;"><div id="lp-root" style="min-height:100vh;width:100%;background:#0a0a12;color:#e8e8f0;margin:0;padding:0;">
<section style="max-width:688px;margin:0 auto;padding:60px 35px 40px;text-align:center;background:#0f0d1a;box-sizing:border-box;">
<p style="color:#7C3AED;font-size:13px;font-weight:700;letter-spacing:2px;margin:0 0 16px;">🔥 PROMO TERBATAS</p>
<h1 style="font-size:32px;font-weight:800;color:#ffffff;margin:0 0 16px;line-height:1.2;">Kuasai Meta Ads dari Nol Sampai Profit</h1>
<p style="font-size:16px;color:#b0b0b0;margin:0 0 24px;line-height:1.6;">Panduan lengkap 100+ halaman yang sudah dibuktikan oleh 500+ advertiser Indonesia.</p>
<a href="#" style="display:inline-block;padding:16px 40px;background:#7C3AED;color:#fff;border-radius:12px;font-weight:700;text-decoration:none;font-size:16px;">Dapatkan Sekarang →</a>
<p style="font-size:12px;color:#9ca3af;margin:12px 0 0;">✅ Akses seumur hidup · Garansi 30 hari</p>
</section>

<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#13111c;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">😩 Masalah yang Sering Dialami</h2>
<div style="padding:16px;background:#1a1a2e;border-radius:12px;margin-bottom:12px;"><p style="color:#e8e8f0;margin:0;">❌ Iklan sudah jalan tapi boncos terus, nggak tahu harus optimasi dari mana</p></div>
<div style="padding:16px;background:#1a1a2e;border-radius:12px;margin-bottom:12px;"><p style="color:#e8e8f0;margin:0;">❌ Budget habis tapi leads nggak berkualitas</p></div>
<div style="padding:16px;background:#1a1a2e;border-radius:12px;"><p style="color:#e8e8f0;margin:0;">❌ Bingung setup pixel, audience, dan campaign structure</p></div>
</section>

<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0f0d1a;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">✨ Apa yang Kamu Dapat</h2>
<ul style="list-style:none;padding:0;margin:0;">
<li style="padding:14px 16px;background:#1a1a2e;border-radius:10px;margin-bottom:10px;color:#e8e8f0;font-size:14px;">✅ Panduan lengkap Meta Ads dari A-Z</li>
<li style="padding:14px 16px;background:#1a1a2e;border-radius:10px;margin-bottom:10px;color:#e8e8f0;font-size:14px;">✅ Template copywriting iklan siap pakai</li>
<li style="padding:14px 16px;background:#1a1a2e;border-radius:10px;margin-bottom:10px;color:#e8e8f0;font-size:14px;">✅ Studi kasus campaign real</li>
<li style="padding:14px 16px;background:#1a1a2e;border-radius:10px;color:#e8e8f0;font-size:14px;">✅ Akses update seumur hidup</li>
</ul>
</section>

<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#13111c;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ff4757;text-align:center;margin:0 0 24px;">🎁 BONUS SPESIAL</h2>
<div style="padding:16px;background:#1a1a2e;border-radius:12px;margin-bottom:12px;border-left:4px solid #ff4757;">
<p style="color:#ffffff;font-weight:600;margin:0 0 4px;">✅ Template Copywriting Premium</p>
<p style="color:#9ca3af;font-size:13px;margin:0;">Harga normal: <span style="text-decoration:line-through;color:#ff4757;">Rp 199.000</span></p>
</div>
<div style="padding:16px;background:#1a1a2e;border-radius:12px;border-left:4px solid #ff4757;">
<p style="color:#ffffff;font-weight:600;margin:0 0 4px;">✅ Akses Grup Komunitas</p>
<p style="color:#9ca3af;font-size:13px;margin:0;">Harga normal: <span style="text-decoration:line-through;color:#ff4757;">Rp 299.000</span></p>
</div>
</section>

<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0f0d1a;box-sizing:border-box;text-align:center;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;margin:0 0 8px;">💰 Investasi Kamu</h2>
<p style="font-size:16px;color:#9ca3af;margin:0 0 8px;">Harga Normal</p>
<p style="font-size:28px;font-weight:800;color:#ff4757;text-decoration:line-through;margin:0 0 8px;">Rp 299.000</p>
<p style="font-size:16px;color:#9ca3af;margin:0 0 8px;">Harga Promo Hari Ini</p>
<p style="font-size:36px;font-weight:900;color:#7C3AED;margin:0 0 24px;">Rp 99.000</p>
<a href="#" style="display:inline-block;padding:18px 48px;background:#7C3AED;color:#fff;border-radius:14px;font-weight:800;text-decoration:none;font-size:18px;">🚀 Beli Sekarang</a>
<p style="font-size:12px;color:#9ca3af;margin:12px 0 0;">🔒 Pembayaran aman · Garansi 30 hari</p>
</section>

<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#13111c;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">❓ FAQ</h2>
<div style="margin-bottom:12px;padding:16px;background:#1a1a2e;border-radius:12px;">
<p style="font-weight:700;color:#ffffff;margin:0 0 6px;">Apakah cocok untuk pemula?</p>
<p style="color:#b0b0b0;margin:0;font-size:14px;">Ya! Materi disusun dari basic sampai advanced.</p>
</div>
<div style="padding:16px;background:#1a1a2e;border-radius:12px;">
<p style="font-weight:700;color:#ffffff;margin:0 0 6px;">Bagaimana cara aksesnya?</p>
<p style="color:#b0b0b0;margin:0;font-size:14px;">Link akses dikirim ke email setelah pembayaran.</p>
</div>
</section>
</div></body></html>`
  },
  {
    id: 'tpl-jasa-1',
    title: 'Jasa / Konsultasi',
    description: 'Template untuk jasa profesional, konsultasi, atau agency dengan fokus lead generation.',
    category: 'Service',
    thumbnail_url: 'https://placehold.co/400x300/0f0d1a/38bdf8?text=Jasa+Template',
    html_content: `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Jasa Landing Page</title></head><body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;"><div id="lp-root" style="min-height:100vh;width:100%;background:#0a0a12;color:#e8e8f0;margin:0;padding:0;">
<section style="max-width:688px;margin:0 auto;padding:60px 35px 40px;text-align:center;background:#0f0d1a;box-sizing:border-box;">
<p style="color:#38bdf8;font-size:13px;font-weight:700;letter-spacing:2px;margin:0 0 16px;">⚡ KONSULTASI GRATIS</p>
<h1 style="font-size:30px;font-weight:800;color:#ffffff;margin:0 0 16px;line-height:1.2;">Tingkatkan Penjualan Online Anda 3x Lipat dalam 90 Hari</h1>
<p style="font-size:16px;color:#b0b0b0;margin:0 0 24px;line-height:1.6;">Kami bantu setup sistem digital marketing yang terbukti menghasilkan. Sudah 200+ bisnis merasakan hasilnya.</p>
<a href="#" style="display:inline-block;padding:16px 40px;background:#38bdf8;color:#0f172a;border-radius:12px;font-weight:700;text-decoration:none;font-size:16px;">Konsultasi Gratis →</a>
<p style="font-size:12px;color:#9ca3af;margin:12px 0 0;">📞 Tanpa biaya · Tanpa komitmen</p>
</section>

<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#13111c;box-sizing:border-box;text-align:center;">
<div style="display:flex;flex-direction:column;gap:16px;">
<div style="padding:20px;background:#1a1a2e;border-radius:12px;"><p style="font-size:28px;font-weight:800;color:#38bdf8;margin:0;">200+</p><p style="color:#9ca3af;margin:4px 0 0;font-size:14px;">Klien Puas</p></div>
<div style="padding:20px;background:#1a1a2e;border-radius:12px;"><p style="font-size:28px;font-weight:800;color:#38bdf8;margin:0;">3x</p><p style="color:#9ca3af;margin:4px 0 0;font-size:14px;">Rata-rata Peningkatan</p></div>
<div style="padding:20px;background:#1a1a2e;border-radius:12px;"><p style="font-size:28px;font-weight:800;color:#38bdf8;margin:0;">5⭐</p><p style="color:#9ca3af;margin:4px 0 0;font-size:14px;">Rating Google</p></div>
</div>
</section>

<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0f0d1a;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">⭐ Testimoni Klien</h2>
<div style="padding:20px;background:#1a1a2e;border-radius:12px;border-left:4px solid #38bdf8;margin-bottom:12px;">
<p style="color:#e8e8f0;margin:0 0 8px;font-style:italic;">"Omzet naik 280% dalam 2 bulan pertama. Tim mereka sangat profesional!"</p>
<p style="color:#38bdf8;font-weight:600;margin:0;font-size:14px;">— Rina, Owner Skincare Brand</p>
</div>
<div style="padding:20px;background:#1a1a2e;border-radius:12px;border-left:4px solid #38bdf8;">
<p style="color:#e8e8f0;margin:0 0 8px;font-style:italic;">"Akhirnya nemu agency yang beneran paham Meta Ads. Highly recommended."</p>
<p style="color:#38bdf8;font-weight:600;margin:0;font-size:14px;">— Andi, Founder Tech Startup</p>
</div>
</section>

<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#13111c;box-sizing:border-box;text-align:center;">
<h2 style="font-size:26px;font-weight:800;color:#ffffff;margin:0 0 16px;">🚀 Siap Meningkatkan Bisnis Anda?</h2>
<p style="font-size:16px;color:#b0b0b0;margin:0 0 24px;">Jadwalkan sesi konsultasi gratis 30 menit bersama tim kami.</p>
<a href="#" style="display:inline-block;padding:18px 48px;background:#38bdf8;color:#0f172a;border-radius:14px;font-weight:800;text-decoration:none;font-size:18px;">📞 Hubungi Kami Sekarang</a>
</section>
</div></body></html>`
  },
  {
    id: 'tpl-produk-1',
    title: 'Produk Fisik / E-Commerce',
    description: 'Template untuk produk fisik seperti skincare, fashion, gadget dengan pricing table dan urgency.',
    category: 'E-Commerce',
    thumbnail_url: 'https://placehold.co/400x300/0f0d1a/f59e0b?text=Produk+Template',
    html_content: `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Produk Landing Page</title></head><body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;"><div id="lp-root" style="min-height:100vh;width:100%;background:#0a0a12;color:#e8e8f0;margin:0;padding:0;">
<section style="max-width:688px;margin:0 auto;padding:60px 35px 40px;text-align:center;background:#0f0d1a;box-sizing:border-box;">
<p style="color:#f59e0b;font-size:13px;font-weight:700;letter-spacing:2px;margin:0 0 16px;">🛒 FLASH SALE</p>
<h1 style="font-size:30px;font-weight:800;color:#ffffff;margin:0 0 16px;line-height:1.2;">Serum Vitamin C Premium untuk Kulit Glowing</h1>
<p style="font-size:16px;color:#b0b0b0;margin:0 0 16px;line-height:1.6;">Formulasi dermatologist-approved dengan Niacinamide + Hyaluronic Acid.</p>
<img src="https://placehold.co/600x400/1a1a2e/f59e0b?text=Product+Image" alt="Product" style="width:100%;border-radius:16px;margin-bottom:24px;" />
<a href="#" style="display:inline-block;padding:16px 40px;background:#f59e0b;color:#0f172a;border-radius:12px;font-weight:700;text-decoration:none;font-size:16px;">🛒 Order Sekarang</a>
</section>

<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#13111c;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">⚡ Before & After</h2>
<div style="display:flex;flex-direction:column;gap:16px;">
<div style="padding:20px;background:#1a1a2e;border-radius:12px;text-align:center;">
<p style="color:#ff4757;font-weight:700;margin:0 0 8px;">😞 SEBELUM</p>
<p style="color:#b0b0b0;margin:0;font-size:14px;">Kulit kusam, berminyak, pori-pori besar</p>
</div>
<div style="padding:20px;background:#1a1a2e;border-radius:12px;text-align:center;">
<p style="color:#2ed573;font-weight:700;margin:0 0 8px;">😍 SESUDAH</p>
<p style="color:#b0b0b0;margin:0;font-size:14px;">Kulit cerah, glowing, pori-pori mengecil</p>
</div>
</div>
</section>

<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0f0d1a;box-sizing:border-box;text-align:center;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;margin:0 0 8px;">💰 Harga Spesial</h2>
<p style="font-size:14px;color:#9ca3af;margin:0 0 8px;">Harga Normal</p>
<p style="font-size:24px;font-weight:800;color:#ff4757;text-decoration:line-through;margin:0 0 8px;">Rp 350.000</p>
<p style="font-size:14px;color:#9ca3af;margin:0 0 8px;">Harga Flash Sale</p>
<p style="font-size:36px;font-weight:900;color:#f59e0b;margin:0 0 24px;">Rp 149.000</p>
<a href="#" style="display:inline-block;padding:18px 48px;background:#f59e0b;color:#0f172a;border-radius:14px;font-weight:800;text-decoration:none;font-size:18px;">🛒 Order Sekarang</a>
<p style="font-size:12px;color:#9ca3af;margin:12px 0 0;">🚚 Free Ongkir · COD Tersedia</p>
</section>
</div></body></html>`
  }
];
