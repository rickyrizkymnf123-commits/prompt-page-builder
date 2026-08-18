export interface LpTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail_url: string;
  html_content: string;
}

const rawTemplates: LpTemplate[] = [
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
  },
  // ──── 10 TEMPLATE BARU MODERN ────
  {
    id: 'tpl-webinar-1',
    title: 'Webinar / Live Event',
    description: 'Template modern untuk promosi webinar, workshop, atau live event dengan countdown dan registrasi.',
    category: 'Event',
    thumbnail_url: 'https://placehold.co/400x300/0a0a1a/10b981?text=Webinar+Template',
    html_content: `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Webinar Landing Page</title></head><body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;"><div id="lp-root" style="min-height:100vh;width:100%;background:#050510;color:#e8e8f0;margin:0;padding:0;">
<section style="max-width:688px;margin:0 auto;padding:60px 35px 40px;text-align:center;background:linear-gradient(180deg,#0a1628 0%,#050510 100%);box-sizing:border-box;">
<p style="color:#10b981;font-size:12px;font-weight:700;letter-spacing:3px;margin:0 0 20px;text-transform:uppercase;">🎯 Webinar Gratis</p>
<h1 style="font-size:34px;font-weight:900;color:#ffffff;margin:0 0 16px;line-height:1.15;">Rahasia Closing 10 Juta/Hari dari WhatsApp</h1>
<p style="font-size:15px;color:#94a3b8;margin:0 0 28px;line-height:1.7;">Pelajari strategi proven yang digunakan 300+ seller untuk menghasilkan penjualan konsisten tanpa iklan berbayar.</p>
<div style="display:inline-flex;gap:12px;margin-bottom:24px;">
<div style="background:#10b981;color:#fff;padding:10px 16px;border-radius:10px;text-align:center;"><p style="font-size:20px;font-weight:800;margin:0;">25</p><p style="font-size:10px;margin:2px 0 0;opacity:0.8;">HARI</p></div>
<div style="background:#10b981;color:#fff;padding:10px 16px;border-radius:10px;text-align:center;"><p style="font-size:20px;font-weight:800;margin:0;">12</p><p style="font-size:10px;margin:2px 0 0;opacity:0.8;">JAM</p></div>
<div style="background:#10b981;color:#fff;padding:10px 16px;border-radius:10px;text-align:center;"><p style="font-size:20px;font-weight:800;margin:0;">30</p><p style="font-size:10px;margin:2px 0 0;opacity:0.8;">MENIT</p></div>
</div>
<div style="display:block;">
<a href="#" style="display:inline-block;padding:16px 48px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border-radius:14px;font-weight:800;text-decoration:none;font-size:16px;box-shadow:0 8px 32px rgba(16,185,129,0.3);">Daftar Sekarang — GRATIS →</a>
</div>
<p style="font-size:12px;color:#64748b;margin:14px 0 0;">🔒 Kuota terbatas 500 peserta</p>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#080818;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">🎓 Yang Akan Kamu Pelajari</h2>
<div style="padding:18px;background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:14px;margin-bottom:12px;border:1px solid #1e293b;">
<p style="color:#10b981;font-weight:700;margin:0 0 6px;font-size:15px;">Modul 1: Mindset Closing</p>
<p style="color:#94a3b8;margin:0;font-size:13px;">Bangun pola pikir closer sejati yang membuat prospek sulit menolak.</p>
</div>
<div style="padding:18px;background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:14px;margin-bottom:12px;border:1px solid #1e293b;">
<p style="color:#10b981;font-weight:700;margin:0 0 6px;font-size:15px;">Modul 2: Script WhatsApp Killer</p>
<p style="color:#94a3b8;margin:0;font-size:13px;">Template chat siap pakai untuk setiap tahap funnel penjualan.</p>
</div>
<div style="padding:18px;background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:14px;border:1px solid #1e293b;">
<p style="color:#10b981;font-weight:700;margin:0 0 6px;font-size:15px;">Modul 3: Automasi Follow-Up</p>
<p style="color:#94a3b8;margin:0;font-size:13px;">Sistem follow-up otomatis yang bekerja 24/7 tanpa kamu pegang HP.</p>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#050510;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">👨‍🏫 Speaker</h2>
<div style="text-align:center;padding:24px;background:#0f172a;border-radius:16px;border:1px solid #1e293b;">
<img src="https://placehold.co/120x120/1e293b/10b981?text=Speaker" alt="Speaker" style="width:100px;height:100px;border-radius:50%;margin-bottom:16px;border:3px solid #10b981;" />
<h3 style="color:#ffffff;font-size:18px;margin:0 0 4px;">Coach Rizky Pratama</h3>
<p style="color:#10b981;font-size:13px;margin:0 0 12px;">Founder ClosingMaster.id</p>
<p style="color:#94a3b8;font-size:13px;margin:0;">Berpengalaman 8+ tahun di bidang digital sales. Sudah membantu 10.000+ UMKM meningkatkan closing rate hingga 5x lipat.</p>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#080818;box-sizing:border-box;text-align:center;">
<h2 style="font-size:24px;font-weight:800;color:#ffffff;margin:0 0 12px;">🚀 Jangan Sampai Ketinggalan!</h2>
<p style="font-size:15px;color:#94a3b8;margin:0 0 24px;">Webinar ini GRATIS tapi kuotanya terbatas. Daftar sekarang sebelum penuh.</p>
<a href="#" style="display:inline-block;padding:18px 56px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border-radius:14px;font-weight:800;text-decoration:none;font-size:18px;box-shadow:0 8px 32px rgba(16,185,129,0.3);">Daftar Gratis Sekarang</a>
</section>
</div></body></html>`
  },
  {
    id: 'tpl-saas-1',
    title: 'SaaS / Aplikasi',
    description: 'Template glassmorphism modern untuk produk SaaS, aplikasi, atau software dengan fitur highlight.',
    category: 'SaaS',
    thumbnail_url: 'https://placehold.co/400x300/0a0a1a/818cf8?text=SaaS+Template',
    html_content: `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>SaaS Landing Page</title></head><body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;"><div id="lp-root" style="min-height:100vh;width:100%;background:#07071a;color:#e8e8f0;margin:0;padding:0;">
<section style="max-width:688px;margin:0 auto;padding:60px 35px 40px;text-align:center;background:linear-gradient(180deg,#0c0c2e 0%,#07071a 100%);box-sizing:border-box;">
<div style="display:inline-block;padding:6px 16px;background:rgba(129,140,248,0.15);border:1px solid rgba(129,140,248,0.3);border-radius:20px;margin-bottom:20px;">
<p style="color:#818cf8;font-size:12px;font-weight:600;margin:0;">✨ Baru — Versi 3.0 Telah Hadir</p>
</div>
<h1 style="font-size:36px;font-weight:900;color:#ffffff;margin:0 0 16px;line-height:1.1;">Kelola Bisnis Lebih Cerdas dengan AI</h1>
<p style="font-size:16px;color:#94a3b8;margin:0 0 28px;line-height:1.7;">Platform all-in-one untuk manajemen tim, proyek, dan keuangan. Ditenagai oleh kecerdasan buatan.</p>
<a href="#" style="display:inline-block;padding:14px 36px;background:#818cf8;color:#fff;border-radius:12px;font-weight:700;text-decoration:none;font-size:15px;margin-right:8px;">Coba Gratis 14 Hari</a>
<a href="#" style="display:inline-block;padding:14px 36px;background:rgba(129,140,248,0.1);color:#818cf8;border:1px solid rgba(129,140,248,0.3);border-radius:12px;font-weight:700;text-decoration:none;font-size:15px;">Lihat Demo →</a>
</section>
<section style="max-width:688px;margin:0 auto;padding:8px 35px 40px;background:#07071a;box-sizing:border-box;">
<img src="https://placehold.co/620x380/111133/818cf8?text=Dashboard+Preview" alt="Dashboard" style="width:100%;border-radius:16px;border:1px solid #1e1e4a;box-shadow:0 20px 60px rgba(129,140,248,0.1);" />
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0a0a24;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">⚡ Fitur Unggulan</h2>
<div style="display:grid;gap:12px;">
<div style="padding:20px;background:rgba(129,140,248,0.05);border:1px solid #1e1e4a;border-radius:14px;">
<p style="color:#818cf8;font-size:22px;margin:0 0 8px;">🤖</p>
<p style="color:#ffffff;font-weight:700;margin:0 0 6px;font-size:15px;">AI Assistant</p>
<p style="color:#94a3b8;margin:0;font-size:13px;">Otomasi tugas rutin dan dapatkan insight bisnis secara real-time.</p>
</div>
<div style="padding:20px;background:rgba(129,140,248,0.05);border:1px solid #1e1e4a;border-radius:14px;">
<p style="color:#818cf8;font-size:22px;margin:0 0 8px;">📊</p>
<p style="color:#ffffff;font-weight:700;margin:0 0 6px;font-size:15px;">Analytics Dashboard</p>
<p style="color:#94a3b8;margin:0;font-size:13px;">Pantau metrik penting bisnis dalam satu tampilan yang intuitif.</p>
</div>
<div style="padding:20px;background:rgba(129,140,248,0.05);border:1px solid #1e1e4a;border-radius:14px;">
<p style="color:#818cf8;font-size:22px;margin:0 0 8px;">🔗</p>
<p style="color:#ffffff;font-weight:700;margin:0 0 6px;font-size:15px;">100+ Integrasi</p>
<p style="color:#94a3b8;margin:0;font-size:13px;">Hubungkan dengan tools favorit: Slack, Notion, Google, dan lainnya.</p>
</div>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#07071a;box-sizing:border-box;text-align:center;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;margin:0 0 24px;">💎 Pilih Paket</h2>
<div style="display:grid;gap:16px;">
<div style="padding:24px;background:#0a0a24;border:1px solid #1e1e4a;border-radius:16px;">
<p style="color:#94a3b8;font-size:13px;font-weight:600;margin:0 0 8px;text-transform:uppercase;">Starter</p>
<p style="font-size:32px;font-weight:900;color:#ffffff;margin:0 0 4px;">Rp 99K<span style="font-size:14px;color:#64748b;font-weight:400;">/bulan</span></p>
<p style="color:#94a3b8;font-size:13px;margin:0 0 16px;">Untuk freelancer & tim kecil</p>
<a href="#" style="display:block;padding:12px;background:rgba(129,140,248,0.1);color:#818cf8;border:1px solid rgba(129,140,248,0.3);border-radius:10px;font-weight:700;text-decoration:none;font-size:14px;">Mulai Gratis</a>
</div>
<div style="padding:24px;background:linear-gradient(135deg,rgba(129,140,248,0.1),rgba(129,140,248,0.05));border:2px solid #818cf8;border-radius:16px;position:relative;">
<div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:#818cf8;color:#fff;padding:4px 14px;border-radius:20px;font-size:11px;font-weight:700;">POPULER</div>
<p style="color:#818cf8;font-size:13px;font-weight:600;margin:0 0 8px;text-transform:uppercase;">Pro</p>
<p style="font-size:32px;font-weight:900;color:#ffffff;margin:0 0 4px;">Rp 249K<span style="font-size:14px;color:#64748b;font-weight:400;">/bulan</span></p>
<p style="color:#94a3b8;font-size:13px;margin:0 0 16px;">Untuk bisnis yang berkembang</p>
<a href="#" style="display:block;padding:12px;background:#818cf8;color:#fff;border-radius:10px;font-weight:700;text-decoration:none;font-size:14px;">Pilih Pro</a>
</div>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0a0a24;box-sizing:border-box;text-align:center;">
<h2 style="font-size:24px;font-weight:800;color:#ffffff;margin:0 0 12px;">Siap Transformasi Bisnis Anda?</h2>
<p style="font-size:15px;color:#94a3b8;margin:0 0 24px;">Mulai gratis, upgrade kapan saja. Tanpa kartu kredit.</p>
<a href="#" style="display:inline-block;padding:16px 48px;background:#818cf8;color:#fff;border-radius:14px;font-weight:800;text-decoration:none;font-size:16px;box-shadow:0 8px 32px rgba(129,140,248,0.3);">Mulai Sekarang →</a>
</section>
</div></body></html>`
  },
  {
    id: 'tpl-fitness-1',
    title: 'Fitness / Program Diet',
    description: 'Template bold & energik untuk program fitness, diet plan, atau gym membership.',
    category: 'Fitness',
    thumbnail_url: 'https://placehold.co/400x300/0a0a1a/ef4444?text=Fitness+Template',
    html_content: `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Fitness Landing Page</title></head><body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;"><div id="lp-root" style="min-height:100vh;width:100%;background:#0a0a0a;color:#e8e8f0;margin:0;padding:0;">
<section style="max-width:688px;margin:0 auto;padding:60px 35px 40px;text-align:center;background:linear-gradient(180deg,#1a0a0a 0%,#0a0a0a 100%);box-sizing:border-box;">
<p style="color:#ef4444;font-size:12px;font-weight:800;letter-spacing:3px;margin:0 0 20px;text-transform:uppercase;">💪 Program 30 Hari</p>
<h1 style="font-size:36px;font-weight:900;color:#ffffff;margin:0 0 16px;line-height:1.1;text-transform:uppercase;">Turunkan 8 KG dalam 30 Hari</h1>
<p style="font-size:15px;color:#a1a1aa;margin:0 0 28px;line-height:1.7;">Program diet + workout yang sudah terbukti. Tanpa obat, tanpa kelaparan. Hanya metode yang benar.</p>
<img src="https://placehold.co/600x350/1a1a1a/ef4444?text=Before+%26+After" alt="Transformation" style="width:100%;border-radius:16px;margin-bottom:24px;border:2px solid #ef4444;" />
<a href="#" style="display:inline-block;padding:16px 48px;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;border-radius:12px;font-weight:800;text-decoration:none;font-size:16px;text-transform:uppercase;letter-spacing:1px;box-shadow:0 8px 32px rgba(239,68,68,0.3);">Mulai Transformasi →</a>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#111111;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:800;color:#ffffff;text-align:center;margin:0 0 24px;text-transform:uppercase;">📋 Apa yang Kamu Dapat</h2>
<div style="padding:16px;background:#1a1a1a;border-radius:12px;margin-bottom:10px;border-left:4px solid #ef4444;">
<p style="color:#ffffff;font-weight:600;margin:0;">🏋️ 30 Video Workout HD (Pemula-Advanced)</p>
</div>
<div style="padding:16px;background:#1a1a1a;border-radius:12px;margin-bottom:10px;border-left:4px solid #ef4444;">
<p style="color:#ffffff;font-weight:600;margin:0;">🥗 Meal Plan Harian + Resep Mudah</p>
</div>
<div style="padding:16px;background:#1a1a1a;border-radius:12px;margin-bottom:10px;border-left:4px solid #ef4444;">
<p style="color:#ffffff;font-weight:600;margin:0;">📊 Tracker Progress & Body Measurement</p>
</div>
<div style="padding:16px;background:#1a1a1a;border-radius:12px;border-left:4px solid #ef4444;">
<p style="color:#ffffff;font-weight:600;margin:0;">💬 Akses Grup Support Eksklusif</p>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0a0a0a;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:800;color:#ffffff;text-align:center;margin:0 0 24px;">⭐ Hasil Nyata Member Kami</h2>
<div style="padding:20px;background:#1a1a1a;border-radius:14px;margin-bottom:12px;">
<p style="color:#e8e8f0;margin:0 0 8px;font-style:italic;">"Turun 10kg dalam 28 hari! Badanku lebih fit dan energi meningkat drastis."</p>
<p style="color:#ef4444;font-weight:700;margin:0;font-size:14px;">— Dinda, 28 tahun</p>
</div>
<div style="padding:20px;background:#1a1a1a;border-radius:14px;">
<p style="color:#e8e8f0;margin:0 0 8px;font-style:italic;">"Programnya realistis banget. Nggak perlu gym mahal, bisa di rumah!"</p>
<p style="color:#ef4444;font-weight:700;margin:0;font-size:14px;">— Budi, 35 tahun</p>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#111111;box-sizing:border-box;text-align:center;">
<p style="color:#a1a1aa;font-size:14px;margin:0 0 8px;">Harga Normal</p>
<p style="font-size:28px;font-weight:800;color:#ef4444;text-decoration:line-through;margin:0 0 8px;">Rp 499.000</p>
<p style="color:#a1a1aa;font-size:14px;margin:0 0 8px;">Harga Spesial Hari Ini</p>
<p style="font-size:40px;font-weight:900;color:#ffffff;margin:0 0 24px;">Rp 149.000</p>
<a href="#" style="display:inline-block;padding:18px 56px;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;border-radius:14px;font-weight:800;text-decoration:none;font-size:18px;text-transform:uppercase;box-shadow:0 8px 32px rgba(239,68,68,0.3);">🔥 Gabung Sekarang</a>
<p style="font-size:12px;color:#71717a;margin:14px 0 0;">✅ Garansi uang kembali 7 hari</p>
</section>
</div></body></html>`
  },
  {
    id: 'tpl-course-1',
    title: 'Online Course / Kelas',
    description: 'Template elegan untuk kelas online, bootcamp, atau ecourse dengan curriculum dan pricing.',
    category: 'Education',
    thumbnail_url: 'https://placehold.co/400x300/0a0a1a/f97316?text=Course+Template',
    html_content: `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Online Course Landing Page</title></head><body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;"><div id="lp-root" style="min-height:100vh;width:100%;background:#0c0a09;color:#e8e8f0;margin:0;padding:0;">
<section style="max-width:688px;margin:0 auto;padding:60px 35px 40px;text-align:center;background:linear-gradient(180deg,#1c1410 0%,#0c0a09 100%);box-sizing:border-box;">
<div style="display:inline-block;padding:6px 16px;background:rgba(249,115,22,0.15);border:1px solid rgba(249,115,22,0.3);border-radius:20px;margin-bottom:20px;">
<p style="color:#f97316;font-size:12px;font-weight:600;margin:0;">🎓 Batch ke-12 — Dibuka!</p>
</div>
<h1 style="font-size:32px;font-weight:900;color:#ffffff;margin:0 0 16px;line-height:1.15;">Full-Stack JavaScript Bootcamp</h1>
<p style="font-size:15px;color:#a8a29e;margin:0 0 24px;line-height:1.7;">Dari nol sampai bisa bikin aplikasi web lengkap. Belajar React, Node.js, dan deployment dalam 8 minggu intensif.</p>
<a href="#" style="display:inline-block;padding:16px 44px;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;border-radius:12px;font-weight:800;text-decoration:none;font-size:16px;box-shadow:0 8px 32px rgba(249,115,22,0.3);">Daftar Sekarang →</a>
<p style="font-size:12px;color:#78716c;margin:14px 0 0;">📅 Mulai 15 Maret 2026 · Online via Zoom</p>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#171412;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">📚 Kurikulum</h2>
<div style="padding:16px;background:#1c1917;border-radius:12px;margin-bottom:10px;display:flex;align-items:center;gap:12px;">
<span style="background:#f97316;color:#fff;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:800;white-space:nowrap;">Week 1-2</span>
<p style="color:#e8e8f0;margin:0;font-size:14px;">HTML, CSS, JavaScript Fundamentals</p>
</div>
<div style="padding:16px;background:#1c1917;border-radius:12px;margin-bottom:10px;display:flex;align-items:center;gap:12px;">
<span style="background:#f97316;color:#fff;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:800;white-space:nowrap;">Week 3-4</span>
<p style="color:#e8e8f0;margin:0;font-size:14px;">React.js & State Management</p>
</div>
<div style="padding:16px;background:#1c1917;border-radius:12px;margin-bottom:10px;display:flex;align-items:center;gap:12px;">
<span style="background:#f97316;color:#fff;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:800;white-space:nowrap;">Week 5-6</span>
<p style="color:#e8e8f0;margin:0;font-size:14px;">Node.js, Express & Database</p>
</div>
<div style="padding:16px;background:#1c1917;border-radius:12px;display:flex;align-items:center;gap:12px;">
<span style="background:#f97316;color:#fff;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:800;white-space:nowrap;">Week 7-8</span>
<p style="color:#e8e8f0;margin:0;font-size:14px;">Final Project & Deployment</p>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0c0a09;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">🏆 Alumni Sukses</h2>
<div style="padding:20px;background:#1c1917;border-radius:14px;margin-bottom:12px;border-left:4px solid #f97316;">
<p style="color:#e8e8f0;margin:0 0 8px;font-style:italic;">"Setelah bootcamp, langsung diterima kerja sebagai frontend developer dengan gaji 2x lipat!"</p>
<p style="color:#f97316;font-weight:700;margin:0;font-size:14px;">— Sinta, Batch 8</p>
</div>
<div style="padding:20px;background:#1c1917;border-radius:14px;border-left:4px solid #f97316;">
<p style="color:#e8e8f0;margin:0 0 8px;font-style:italic;">"Materinya sangat terstruktur. Mentor-nya sabar dan responsif. Worth it banget!"</p>
<p style="color:#f97316;font-weight:700;margin:0;font-size:14px;">— Faisal, Batch 10</p>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#171412;box-sizing:border-box;text-align:center;">
<h2 style="font-size:24px;font-weight:800;color:#ffffff;margin:0 0 8px;">💰 Investasi Belajar</h2>
<p style="color:#78716c;font-size:14px;margin:0 0 8px;">Early Bird Price</p>
<p style="font-size:36px;font-weight:900;color:#f97316;margin:0 0 4px;">Rp 1.499.000</p>
<p style="color:#78716c;font-size:13px;margin:0 0 24px;">Normal: <span style="text-decoration:line-through;">Rp 3.500.000</span></p>
<a href="#" style="display:inline-block;padding:18px 56px;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;border-radius:14px;font-weight:800;text-decoration:none;font-size:18px;box-shadow:0 8px 32px rgba(249,115,22,0.3);">🚀 Daftar Bootcamp</a>
<p style="font-size:12px;color:#78716c;margin:14px 0 0;">📦 Termasuk akses materi seumur hidup + sertifikat</p>
</section>
</div></body></html>`
  },
  {
    id: 'tpl-fnb-1',
    title: 'F&B / Restoran',
    description: 'Template appetizing untuk restoran, cafe, katering, atau bisnis F&B dengan menu showcase.',
    category: 'F&B',
    thumbnail_url: 'https://placehold.co/400x300/0a0a1a/eab308?text=F%26B+Template',
    html_content: `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>F&B Landing Page</title></head><body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;"><div id="lp-root" style="min-height:100vh;width:100%;background:#0c0a05;color:#e8e8f0;margin:0;padding:0;">
<section style="max-width:688px;margin:0 auto;padding:60px 35px 40px;text-align:center;background:linear-gradient(180deg,#1a1505 0%,#0c0a05 100%);box-sizing:border-box;">
<p style="color:#eab308;font-size:12px;font-weight:700;letter-spacing:3px;margin:0 0 20px;">🍽️ PREMIUM CATERING</p>
<h1 style="font-size:34px;font-weight:900;color:#ffffff;margin:0 0 16px;line-height:1.1;">Katering Sehat Premium untuk Keluarga Modern</h1>
<p style="font-size:15px;color:#a8a29e;margin:0 0 24px;line-height:1.7;">Menu bergizi seimbang, diolah dari bahan organik pilihan. Diantar fresh setiap hari ke rumah Anda.</p>
<img src="https://placehold.co/600x350/1c1917/eab308?text=Food+Image" alt="Food" style="width:100%;border-radius:16px;margin-bottom:24px;" />
<a href="#" style="display:inline-block;padding:16px 44px;background:linear-gradient(135deg,#eab308,#ca8a04);color:#0f0d0a;border-radius:12px;font-weight:800;text-decoration:none;font-size:16px;">Pesan Sekarang →</a>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#121008;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">🌟 Kenapa Pilih Kami?</h2>
<div style="display:grid;gap:12px;">
<div style="padding:20px;background:#1c1917;border-radius:14px;text-align:center;">
<p style="font-size:28px;margin:0 0 8px;">🥬</p>
<p style="color:#ffffff;font-weight:700;margin:0 0 4px;">100% Bahan Organik</p>
<p style="color:#a8a29e;font-size:13px;margin:0;">Dipilih langsung dari petani lokal terpercaya.</p>
</div>
<div style="padding:20px;background:#1c1917;border-radius:14px;text-align:center;">
<p style="font-size:28px;margin:0 0 8px;">👨‍🍳</p>
<p style="color:#ffffff;font-weight:700;margin:0 0 4px;">Chef Berpengalaman</p>
<p style="color:#a8a29e;font-size:13px;margin:0;">Tim chef bintang 5 dengan pengalaman hotel internasional.</p>
</div>
<div style="padding:20px;background:#1c1917;border-radius:14px;text-align:center;">
<p style="font-size:28px;margin:0 0 8px;">🚚</p>
<p style="color:#ffffff;font-weight:700;margin:0 0 4px;">Antar Tepat Waktu</p>
<p style="color:#a8a29e;font-size:13px;margin:0;">Gratis ongkir dan dijamin sampai dalam kondisi fresh.</p>
</div>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0c0a05;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">📦 Pilihan Paket</h2>
<div style="padding:24px;background:#1c1917;border-radius:16px;margin-bottom:12px;border:1px solid #292524;">
<p style="color:#eab308;font-weight:700;font-size:15px;margin:0 0 4px;">Paket Hemat (5 Hari)</p>
<p style="font-size:28px;font-weight:900;color:#ffffff;margin:0 0 8px;">Rp 350.000</p>
<p style="color:#a8a29e;font-size:13px;margin:0;">Makan siang + snack · Porsi 1 orang</p>
</div>
<div style="padding:24px;background:linear-gradient(135deg,rgba(234,179,8,0.1),rgba(234,179,8,0.02));border-radius:16px;margin-bottom:12px;border:2px solid #eab308;">
<div style="display:inline-block;background:#eab308;color:#0f0d0a;padding:3px 12px;border-radius:20px;font-size:11px;font-weight:700;margin-bottom:12px;">BEST SELLER</div>
<p style="color:#eab308;font-weight:700;font-size:15px;margin:0 0 4px;">Paket Keluarga (5 Hari)</p>
<p style="font-size:28px;font-weight:900;color:#ffffff;margin:0 0 8px;">Rp 899.000</p>
<p style="color:#a8a29e;font-size:13px;margin:0;">Makan siang + makan malam · Porsi 4 orang</p>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#121008;box-sizing:border-box;text-align:center;">
<h2 style="font-size:24px;font-weight:800;color:#ffffff;margin:0 0 12px;">📞 Order Sekarang</h2>
<p style="font-size:15px;color:#a8a29e;margin:0 0 24px;">Hubungi kami via WhatsApp untuk konsultasi menu gratis.</p>
<a href="#" style="display:inline-block;padding:18px 56px;background:linear-gradient(135deg,#eab308,#ca8a04);color:#0f0d0a;border-radius:14px;font-weight:800;text-decoration:none;font-size:18px;">Chat WhatsApp →</a>
</section>
</div></body></html>`
  },
  {
    id: 'tpl-agency-1',
    title: 'Agency / Portfolio',
    description: 'Template sleek untuk digital agency, creative studio, atau freelancer portfolio showcase.',
    category: 'Agency',
    thumbnail_url: 'https://placehold.co/400x300/0a0a1a/06b6d4?text=Agency+Template',
    html_content: `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Agency Landing Page</title></head><body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;"><div id="lp-root" style="min-height:100vh;width:100%;background:#040d12;color:#e8e8f0;margin:0;padding:0;">
<section style="max-width:688px;margin:0 auto;padding:60px 35px 40px;text-align:center;background:linear-gradient(180deg,#071a22 0%,#040d12 100%);box-sizing:border-box;">
<p style="color:#06b6d4;font-size:12px;font-weight:700;letter-spacing:3px;margin:0 0 20px;">🏢 DIGITAL AGENCY</p>
<h1 style="font-size:36px;font-weight:900;color:#ffffff;margin:0 0 16px;line-height:1.1;">Kami Bikin Brand Anda Gak Bisa Dilupakan</h1>
<p style="font-size:15px;color:#94a3b8;margin:0 0 28px;line-height:1.7;">Creative studio yang fokus pada branding, web design, dan digital marketing. Klien kami tumbuh rata-rata 3x dalam 6 bulan.</p>
<a href="#" style="display:inline-block;padding:14px 36px;background:#06b6d4;color:#040d12;border-radius:12px;font-weight:800;text-decoration:none;font-size:15px;">Konsultasi Gratis →</a>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#081820;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">🛠️ Layanan Kami</h2>
<div style="display:grid;gap:12px;">
<div style="padding:20px;background:#0c2330;border-radius:14px;border:1px solid #164e63;">
<p style="color:#06b6d4;font-weight:700;margin:0 0 6px;font-size:15px;">🎨 Branding & Identity</p>
<p style="color:#94a3b8;margin:0;font-size:13px;">Logo, brand guideline, visual identity yang konsisten dan memorable.</p>
</div>
<div style="padding:20px;background:#0c2330;border-radius:14px;border:1px solid #164e63;">
<p style="color:#06b6d4;font-weight:700;margin:0 0 6px;font-size:15px;">💻 Web Development</p>
<p style="color:#94a3b8;margin:0;font-size:13px;">Website modern, responsif, dan dioptimasi untuk konversi dan SEO.</p>
</div>
<div style="padding:20px;background:#0c2330;border-radius:14px;border:1px solid #164e63;">
<p style="color:#06b6d4;font-weight:700;margin:0 0 6px;font-size:15px;">📈 Digital Marketing</p>
<p style="color:#94a3b8;margin:0;font-size:13px;">Meta Ads, Google Ads, SEO, dan content strategy yang terukur.</p>
</div>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#040d12;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">📸 Portfolio</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
<img src="https://placehold.co/300x220/0c2330/06b6d4?text=Project+1" alt="Project 1" style="width:100%;border-radius:12px;border:1px solid #164e63;" />
<img src="https://placehold.co/300x220/0c2330/06b6d4?text=Project+2" alt="Project 2" style="width:100%;border-radius:12px;border:1px solid #164e63;" />
<img src="https://placehold.co/300x220/0c2330/06b6d4?text=Project+3" alt="Project 3" style="width:100%;border-radius:12px;border:1px solid #164e63;" />
<img src="https://placehold.co/300x220/0c2330/06b6d4?text=Project+4" alt="Project 4" style="width:100%;border-radius:12px;border:1px solid #164e63;" />
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#081820;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">💬 Kata Klien</h2>
<div style="padding:20px;background:#0c2330;border-radius:14px;margin-bottom:12px;border-left:4px solid #06b6d4;">
<p style="color:#e8e8f0;margin:0 0 8px;font-style:italic;">"Website baru dari tim ini langsung meningkatkan conversion rate kami 4x. Desainnya premium banget!"</p>
<p style="color:#06b6d4;font-weight:700;margin:0;font-size:14px;">— Sarah, CEO FashionBrand.id</p>
</div>
<div style="padding:20px;background:#0c2330;border-radius:14px;border-left:4px solid #06b6d4;">
<p style="color:#e8e8f0;margin:0 0 8px;font-style:italic;">"Branding yang mereka buat bikin brand kami keliatan 10x lebih profesional."</p>
<p style="color:#06b6d4;font-weight:700;margin:0;font-size:14px;">— Kevin, Founder TechStartup</p>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#040d12;box-sizing:border-box;text-align:center;">
<h2 style="font-size:24px;font-weight:800;color:#ffffff;margin:0 0 12px;">🤝 Mari Berkolaborasi</h2>
<p style="font-size:15px;color:#94a3b8;margin:0 0 24px;">Ceritakan proyek Anda dan kami akan bantu wujudkan.</p>
<a href="#" style="display:inline-block;padding:18px 56px;background:#06b6d4;color:#040d12;border-radius:14px;font-weight:800;text-decoration:none;font-size:18px;">Hubungi Kami →</a>
</section>
</div></body></html>`
  },
  {
    id: 'tpl-property-1',
    title: 'Properti / Real Estate',
    description: 'Template mewah untuk properti, rumah, apartemen, atau real estate listing.',
    category: 'Property',
    thumbnail_url: 'https://placehold.co/400x300/0a0a1a/d4a017?text=Property+Template',
    html_content: `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Property Landing Page</title></head><body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;"><div id="lp-root" style="min-height:100vh;width:100%;background:#0a0907;color:#e8e8f0;margin:0;padding:0;">
<section style="max-width:688px;margin:0 auto;padding:60px 35px 40px;text-align:center;background:linear-gradient(180deg,#1a1608 0%,#0a0907 100%);box-sizing:border-box;">
<p style="color:#d4a017;font-size:12px;font-weight:700;letter-spacing:3px;margin:0 0 20px;">🏠 EXCLUSIVE LISTING</p>
<h1 style="font-size:32px;font-weight:900;color:#ffffff;margin:0 0 16px;line-height:1.15;">Hunian Premium di Jantung Kota Jakarta</h1>
<p style="font-size:15px;color:#a8a29e;margin:0 0 24px;line-height:1.7;">Apartemen mewah dengan view 360° kota, fasilitas bintang 5, dan akses langsung ke MRT. Mulai dari 800 jutaan.</p>
<img src="https://placehold.co/600x380/1c1917/d4a017?text=Property+Image" alt="Property" style="width:100%;border-radius:16px;margin-bottom:24px;border:1px solid #292524;" />
<a href="#" style="display:inline-block;padding:16px 44px;background:linear-gradient(135deg,#d4a017,#b8860b);color:#fff;border-radius:12px;font-weight:800;text-decoration:none;font-size:16px;box-shadow:0 8px 32px rgba(212,160,23,0.3);">Jadwalkan Kunjungan →</a>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#110f08;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">✨ Keunggulan Unit</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
<div style="padding:18px;background:#1c1917;border-radius:12px;text-align:center;border:1px solid #292524;">
<p style="font-size:24px;margin:0 0 6px;">🏊</p>
<p style="color:#ffffff;font-weight:600;font-size:13px;margin:0;">Infinity Pool</p>
</div>
<div style="padding:18px;background:#1c1917;border-radius:12px;text-align:center;border:1px solid #292524;">
<p style="font-size:24px;margin:0 0 6px;">🏋️</p>
<p style="color:#ffffff;font-weight:600;font-size:13px;margin:0;">Private Gym</p>
</div>
<div style="padding:18px;background:#1c1917;border-radius:12px;text-align:center;border:1px solid #292524;">
<p style="font-size:24px;margin:0 0 6px;">🚗</p>
<p style="color:#ffffff;font-weight:600;font-size:13px;margin:0;">2 Parking Slot</p>
</div>
<div style="padding:18px;background:#1c1917;border-radius:12px;text-align:center;border:1px solid #292524;">
<p style="font-size:24px;margin:0 0 6px;">🔒</p>
<p style="color:#ffffff;font-weight:600;font-size:13px;margin:0;">24/7 Security</p>
</div>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0a0907;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">📐 Tipe Unit</h2>
<div style="padding:20px;background:#1c1917;border-radius:14px;margin-bottom:12px;border:1px solid #292524;display:flex;justify-content:space-between;align-items:center;">
<div><p style="color:#ffffff;font-weight:700;margin:0;font-size:15px;">Studio (28m²)</p><p style="color:#a8a29e;font-size:13px;margin:4px 0 0;">Fully furnished</p></div>
<p style="color:#d4a017;font-weight:800;font-size:18px;margin:0;">800 Juta</p>
</div>
<div style="padding:20px;background:#1c1917;border-radius:14px;margin-bottom:12px;border:2px solid #d4a017;display:flex;justify-content:space-between;align-items:center;">
<div><p style="color:#ffffff;font-weight:700;margin:0;font-size:15px;">1BR (45m²)</p><p style="color:#a8a29e;font-size:13px;margin:4px 0 0;">Fully furnished + balcony</p></div>
<p style="color:#d4a017;font-weight:800;font-size:18px;margin:0;">1.2 Miliar</p>
</div>
<div style="padding:20px;background:#1c1917;border-radius:14px;border:1px solid #292524;display:flex;justify-content:space-between;align-items:center;">
<div><p style="color:#ffffff;font-weight:700;margin:0;font-size:15px;">2BR (68m²)</p><p style="color:#a8a29e;font-size:13px;margin:4px 0 0;">Premium corner unit</p></div>
<p style="color:#d4a017;font-weight:800;font-size:18px;margin:0;">1.8 Miliar</p>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#110f08;box-sizing:border-box;text-align:center;">
<h2 style="font-size:24px;font-weight:800;color:#ffffff;margin:0 0 12px;">📞 Hubungi Marketing Gallery</h2>
<p style="font-size:15px;color:#a8a29e;margin:0 0 24px;">Jadwalkan kunjungan atau minta price list lengkap.</p>
<a href="#" style="display:inline-block;padding:18px 56px;background:linear-gradient(135deg,#d4a017,#b8860b);color:#fff;border-radius:14px;font-weight:800;text-decoration:none;font-size:18px;box-shadow:0 8px 32px rgba(212,160,23,0.3);">WhatsApp Kami →</a>
<p style="font-size:12px;color:#78716c;margin:14px 0 0;">🏗️ Siap huni Q4 2026 · DP mulai 10%</p>
</section>
</div></body></html>`
  },
  {
    id: 'tpl-fashion-1',
    title: 'Fashion / Brand',
    description: 'Template high-fashion untuk brand clothing, aksesoris, atau streetwear dengan visual dominant.',
    category: 'Fashion',
    thumbnail_url: 'https://placehold.co/400x300/0a0a1a/ec4899?text=Fashion+Template',
    html_content: `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Fashion Landing Page</title></head><body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;"><div id="lp-root" style="min-height:100vh;width:100%;background:#0a0a0e;color:#e8e8f0;margin:0;padding:0;">
<section style="max-width:688px;margin:0 auto;padding:60px 35px 40px;text-align:center;background:linear-gradient(180deg,#1a0a18 0%,#0a0a0e 100%);box-sizing:border-box;">
<p style="color:#ec4899;font-size:11px;font-weight:700;letter-spacing:4px;margin:0 0 20px;text-transform:uppercase;">New Collection 2026</p>
<h1 style="font-size:40px;font-weight:900;color:#ffffff;margin:0 0 16px;line-height:1.05;letter-spacing:-1px;">URBAN<br/>ESSENTIALS</h1>
<p style="font-size:15px;color:#a1a1aa;margin:0 0 28px;line-height:1.7;">Koleksi streetwear premium yang memadukan comfort dan style. Limited edition, hanya 200 pieces per desain.</p>
<img src="https://placehold.co/600x420/1a1a2e/ec4899?text=Fashion+Collection" alt="Collection" style="width:100%;border-radius:16px;margin-bottom:24px;" />
<a href="#" style="display:inline-block;padding:16px 44px;background:linear-gradient(135deg,#ec4899,#db2777);color:#fff;border-radius:12px;font-weight:800;text-decoration:none;font-size:15px;letter-spacing:1px;text-transform:uppercase;box-shadow:0 8px 32px rgba(236,72,153,0.3);">Shop Now →</a>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0e0e14;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">🔥 Best Sellers</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
<div style="background:#18181f;border-radius:14px;overflow:hidden;border:1px solid #27272a;">
<img src="https://placehold.co/300x300/18181f/ec4899?text=Hoodie" alt="Hoodie" style="width:100%;aspect-ratio:1;object-fit:cover;" />
<div style="padding:14px;">
<p style="color:#ffffff;font-weight:700;margin:0 0 4px;font-size:14px;">Urban Hoodie</p>
<p style="color:#ec4899;font-weight:800;margin:0;">Rp 389.000</p>
</div>
</div>
<div style="background:#18181f;border-radius:14px;overflow:hidden;border:1px solid #27272a;">
<img src="https://placehold.co/300x300/18181f/ec4899?text=T-Shirt" alt="T-Shirt" style="width:100%;aspect-ratio:1;object-fit:cover;" />
<div style="padding:14px;">
<p style="color:#ffffff;font-weight:700;margin:0 0 4px;font-size:14px;">Essential Tee</p>
<p style="color:#ec4899;font-weight:800;margin:0;">Rp 199.000</p>
</div>
</div>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0a0a0e;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">💎 Kenapa Kami Berbeda</h2>
<div style="padding:18px;background:#18181f;border-radius:12px;margin-bottom:10px;border:1px solid #27272a;">
<p style="color:#ec4899;font-weight:700;margin:0 0 4px;font-size:14px;">Premium Cotton 300gsm</p>
<p style="color:#a1a1aa;font-size:13px;margin:0;">Material tebal, tidak mudah melar, nyaman di segala cuaca.</p>
</div>
<div style="padding:18px;background:#18181f;border-radius:12px;margin-bottom:10px;border:1px solid #27272a;">
<p style="color:#ec4899;font-weight:700;margin:0 0 4px;font-size:14px;">Limited Production</p>
<p style="color:#a1a1aa;font-size:13px;margin:0;">Hanya 200 pieces per desain. Dijamin eksklusif.</p>
</div>
<div style="padding:18px;background:#18181f;border-radius:12px;border:1px solid #27272a;">
<p style="color:#ec4899;font-weight:700;margin:0 0 4px;font-size:14px;">Free Returns</p>
<p style="color:#a1a1aa;font-size:13px;margin:0;">Tidak cocok? Tukar atau kembalikan gratis dalam 14 hari.</p>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0e0e14;box-sizing:border-box;text-align:center;">
<h2 style="font-size:24px;font-weight:800;color:#ffffff;margin:0 0 12px;">🛍️ Shop The Collection</h2>
<p style="font-size:15px;color:#a1a1aa;margin:0 0 24px;">Gratis ongkir untuk pembelian pertama. Gunakan kode: URBAN2026</p>
<a href="#" style="display:inline-block;padding:18px 56px;background:linear-gradient(135deg,#ec4899,#db2777);color:#fff;border-radius:14px;font-weight:800;text-decoration:none;font-size:18px;text-transform:uppercase;letter-spacing:1px;box-shadow:0 8px 32px rgba(236,72,153,0.3);">Belanja Sekarang</a>
</section>
</div></body></html>`
  },
  {
    id: 'tpl-travel-1',
    title: 'Travel / Wisata',
    description: 'Template vibrant untuk paket wisata, travel agent, atau tour operator dengan itinerary.',
    category: 'Travel',
    thumbnail_url: 'https://placehold.co/400x300/0a0a1a/14b8a6?text=Travel+Template',
    html_content: `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Travel Landing Page</title></head><body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;"><div id="lp-root" style="min-height:100vh;width:100%;background:#041f1e;color:#e8e8f0;margin:0;padding:0;">
<section style="max-width:688px;margin:0 auto;padding:60px 35px 40px;text-align:center;background:linear-gradient(180deg,#062e2c 0%,#041f1e 100%);box-sizing:border-box;">
<p style="color:#14b8a6;font-size:12px;font-weight:700;letter-spacing:3px;margin:0 0 20px;">✈️ OPEN TRIP</p>
<h1 style="font-size:34px;font-weight:900;color:#ffffff;margin:0 0 16px;line-height:1.1;">Jelajahi Labuan Bajo 4D3N</h1>
<p style="font-size:15px;color:#94a3b8;margin:0 0 24px;line-height:1.7;">Paket wisata all-inclusive dengan kapal phinisi premium. Snorkeling, diving, dan sunset yang tak terlupakan.</p>
<img src="https://placehold.co/600x380/0c3835/14b8a6?text=Labuan+Bajo" alt="Labuan Bajo" style="width:100%;border-radius:16px;margin-bottom:24px;" />
<a href="#" style="display:inline-block;padding:16px 44px;background:linear-gradient(135deg,#14b8a6,#0d9488);color:#fff;border-radius:12px;font-weight:800;text-decoration:none;font-size:16px;box-shadow:0 8px 32px rgba(20,184,166,0.3);">Booking Sekarang →</a>
<p style="font-size:12px;color:#64748b;margin:14px 0 0;">📅 Berangkat setiap Jumat · Max 15 peserta</p>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#052a28;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">🗓️ Itinerary</h2>
<div style="padding:16px;background:#0c3835;border-radius:12px;margin-bottom:10px;border-left:4px solid #14b8a6;">
<p style="color:#14b8a6;font-weight:700;margin:0 0 4px;font-size:14px;">Day 1 — Arrival</p>
<p style="color:#94a3b8;font-size:13px;margin:0;">Check-in hotel · City tour · Welcome dinner</p>
</div>
<div style="padding:16px;background:#0c3835;border-radius:12px;margin-bottom:10px;border-left:4px solid #14b8a6;">
<p style="color:#14b8a6;font-weight:700;margin:0 0 4px;font-size:14px;">Day 2 — Island Hopping</p>
<p style="color:#94a3b8;font-size:13px;margin:0;">Pulau Padar · Pink Beach · Manta Point</p>
</div>
<div style="padding:16px;background:#0c3835;border-radius:12px;margin-bottom:10px;border-left:4px solid #14b8a6;">
<p style="color:#14b8a6;font-weight:700;margin:0 0 4px;font-size:14px;">Day 3 — Komodo Adventure</p>
<p style="color:#94a3b8;font-size:13px;margin:0;">Pulau Komodo · Taka Makassar · Sunset cruise</p>
</div>
<div style="padding:16px;background:#0c3835;border-radius:12px;border-left:4px solid #14b8a6;">
<p style="color:#14b8a6;font-weight:700;margin:0 0 4px;font-size:14px;">Day 4 — Departure</p>
<p style="color:#94a3b8;font-size:13px;margin:0;">Free time · Souvenir shopping · Airport transfer</p>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#041f1e;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">📦 Sudah Termasuk</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
<div style="padding:14px;background:#0c3835;border-radius:10px;text-align:center;"><p style="color:#e8e8f0;margin:0;font-size:13px;">✅ Hotel 3 malam</p></div>
<div style="padding:14px;background:#0c3835;border-radius:10px;text-align:center;"><p style="color:#e8e8f0;margin:0;font-size:13px;">✅ Kapal phinisi</p></div>
<div style="padding:14px;background:#0c3835;border-radius:10px;text-align:center;"><p style="color:#e8e8f0;margin:0;font-size:13px;">✅ Makan 3x/hari</p></div>
<div style="padding:14px;background:#0c3835;border-radius:10px;text-align:center;"><p style="color:#e8e8f0;margin:0;font-size:13px;">✅ Alat snorkeling</p></div>
<div style="padding:14px;background:#0c3835;border-radius:10px;text-align:center;"><p style="color:#e8e8f0;margin:0;font-size:13px;">✅ Guide lokal</p></div>
<div style="padding:14px;background:#0c3835;border-radius:10px;text-align:center;"><p style="color:#e8e8f0;margin:0;font-size:13px;">✅ Dokumentasi</p></div>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#052a28;box-sizing:border-box;text-align:center;">
<p style="color:#64748b;font-size:14px;margin:0 0 8px;">Harga per orang</p>
<p style="font-size:36px;font-weight:900;color:#14b8a6;margin:0 0 4px;">Rp 3.299.000</p>
<p style="color:#64748b;font-size:13px;margin:0 0 24px;">Normal: <span style="text-decoration:line-through;">Rp 4.500.000</span></p>
<a href="#" style="display:inline-block;padding:18px 56px;background:linear-gradient(135deg,#14b8a6,#0d9488);color:#fff;border-radius:14px;font-weight:800;text-decoration:none;font-size:18px;box-shadow:0 8px 32px rgba(20,184,166,0.3);">Book Trip Sekarang</a>
<p style="font-size:12px;color:#64748b;margin:14px 0 0;">📞 Atau WhatsApp kami untuk custom trip</p>
</section>
</div></body></html>`
  },
  {
    id: 'tpl-coaching-1',
    title: 'Coaching / Mentoring',
    description: 'Template personal brand untuk coach, mentor, atau speaker dengan authority building.',
    category: 'Coaching',
    thumbnail_url: 'https://placehold.co/400x300/0a0a1a/a855f7?text=Coaching+Template',
    html_content: `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Coaching Landing Page</title></head><body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;"><div id="lp-root" style="min-height:100vh;width:100%;background:#0c0612;color:#e8e8f0;margin:0;padding:0;">
<section style="max-width:688px;margin:0 auto;padding:60px 35px 40px;text-align:center;background:linear-gradient(180deg,#1a0d2e 0%,#0c0612 100%);box-sizing:border-box;">
<img src="https://placehold.co/120x120/1e1535/a855f7?text=Coach" alt="Coach" style="width:100px;height:100px;border-radius:50%;margin-bottom:20px;border:3px solid #a855f7;" />
<p style="color:#a855f7;font-size:12px;font-weight:700;letter-spacing:3px;margin:0 0 16px;text-transform:uppercase;">Business Coach</p>
<h1 style="font-size:34px;font-weight:900;color:#ffffff;margin:0 0 16px;line-height:1.1;">Scale Bisnis Anda dari 100 Juta ke 1 Miliar</h1>
<p style="font-size:15px;color:#94a3b8;margin:0 0 28px;line-height:1.7;">Program mentoring intensif 90 hari bersama Coach Arief. Sudah membantu 500+ business owner naik level.</p>
<a href="#" style="display:inline-block;padding:16px 44px;background:linear-gradient(135deg,#a855f7,#9333ea);color:#fff;border-radius:12px;font-weight:800;text-decoration:none;font-size:16px;box-shadow:0 8px 32px rgba(168,85,247,0.3);">Apply Sekarang →</a>
<p style="font-size:12px;color:#64748b;margin:14px 0 0;">🎯 Kuota terbatas 20 mentee per batch</p>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#100a1e;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">📊 Track Record</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
<div style="padding:20px;background:#1e1535;border-radius:14px;text-align:center;">
<p style="font-size:28px;font-weight:900;color:#a855f7;margin:0;">500+</p>
<p style="color:#94a3b8;font-size:13px;margin:4px 0 0;">Business Owner</p>
</div>
<div style="padding:20px;background:#1e1535;border-radius:14px;text-align:center;">
<p style="font-size:28px;font-weight:900;color:#a855f7;margin:0;">10x</p>
<p style="color:#94a3b8;font-size:13px;margin:4px 0 0;">Rata-rata Growth</p>
</div>
<div style="padding:20px;background:#1e1535;border-radius:14px;text-align:center;">
<p style="font-size:28px;font-weight:900;color:#a855f7;margin:0;">15+</p>
<p style="color:#94a3b8;font-size:13px;margin:4px 0 0;">Tahun Experience</p>
</div>
<div style="padding:20px;background:#1e1535;border-radius:14px;text-align:center;">
<p style="font-size:28px;font-weight:900;color:#a855f7;margin:0;">98%</p>
<p style="color:#94a3b8;font-size:13px;margin:4px 0 0;">Satisfaction Rate</p>
</div>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0c0612;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">🎯 Program Mentoring</h2>
<div style="padding:18px;background:#1e1535;border-radius:12px;margin-bottom:10px;border:1px solid #2e1f4d;">
<p style="color:#a855f7;font-weight:700;margin:0 0 6px;font-size:14px;">1-on-1 Strategy Session</p>
<p style="color:#94a3b8;font-size:13px;margin:0;">4x sesi private coaching untuk bedah bisnis Anda secara mendalam.</p>
</div>
<div style="padding:18px;background:#1e1535;border-radius:12px;margin-bottom:10px;border:1px solid #2e1f4d;">
<p style="color:#a855f7;font-weight:700;margin:0 0 6px;font-size:14px;">Group Mastermind</p>
<p style="color:#94a3b8;font-size:13px;margin:0;">Sesi mingguan bersama sesama business owner untuk sharing dan accountability.</p>
</div>
<div style="padding:18px;background:#1e1535;border-radius:12px;margin-bottom:10px;border:1px solid #2e1f4d;">
<p style="color:#a855f7;font-weight:700;margin:0 0 6px;font-size:14px;">Business Audit</p>
<p style="color:#94a3b8;font-size:13px;margin:0;">Review mendalam terhadap operasional, marketing, dan keuangan bisnis Anda.</p>
</div>
<div style="padding:18px;background:#1e1535;border-radius:12px;border:1px solid #2e1f4d;">
<p style="color:#a855f7;font-weight:700;margin:0 0 6px;font-size:14px;">WhatsApp Priority Support</p>
<p style="color:#94a3b8;font-size:13px;margin:0;">Akses langsung ke Coach Arief via WA selama 90 hari penuh.</p>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#100a1e;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">💬 Testimoni</h2>
<div style="padding:20px;background:#1e1535;border-radius:14px;margin-bottom:12px;border-left:4px solid #a855f7;">
<p style="color:#e8e8f0;margin:0 0 8px;font-style:italic;">"Omzet bisnis saya naik dari 150jt ke 1.2M dalam 6 bulan setelah program ini. Game changer!"</p>
<p style="color:#a855f7;font-weight:700;margin:0;font-size:14px;">— Hendra, Owner F&B Chain</p>
</div>
<div style="padding:20px;background:#1e1535;border-radius:14px;border-left:4px solid #a855f7;">
<p style="color:#e8e8f0;margin:0 0 8px;font-style:italic;">"Coach Arief bukan cuma ngasih teori, tapi beneran turun tangan bantu implementasi."</p>
<p style="color:#a855f7;font-weight:700;margin:0;font-size:14px;">— Maya, Founder EdTech</p>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0c0612;box-sizing:border-box;text-align:center;">
<h2 style="font-size:24px;font-weight:800;color:#ffffff;margin:0 0 8px;">💎 Investasi Program</h2>
<p style="color:#64748b;font-size:14px;margin:0 0 8px;">Program 90 Hari</p>
<p style="font-size:36px;font-weight:900;color:#a855f7;margin:0 0 4px;">Rp 15.000.000</p>
<p style="color:#64748b;font-size:13px;margin:0 0 24px;">Atau 3x cicilan Rp 5.500.000</p>
<a href="#" style="display:inline-block;padding:18px 56px;background:linear-gradient(135deg,#a855f7,#9333ea);color:#fff;border-radius:14px;font-weight:800;text-decoration:none;font-size:18px;box-shadow:0 8px 32px rgba(168,85,247,0.3);">Apply Sekarang</a>
<p style="font-size:12px;color:#64748b;margin:14px 0 0;">📋 Seleksi via interview · Batch berikutnya April 2026</p>
</section>
</div></body></html>`
  },
  {
    id: 'tpl-membership-1',
    title: 'Membership / Komunitas',
    description: 'Template eksklusif untuk membership site, komunitas premium, atau subscription program.',
    category: 'Membership',
    thumbnail_url: 'https://placehold.co/400x300/0a0a1a/3b82f6?text=Membership+Template',
    html_content: `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Membership Landing Page</title></head><body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;"><div id="lp-root" style="min-height:100vh;width:100%;background:#060a18;color:#e8e8f0;margin:0;padding:0;">
<section style="max-width:688px;margin:0 auto;padding:60px 35px 40px;text-align:center;background:linear-gradient(180deg,#0c1530 0%,#060a18 100%);box-sizing:border-box;">
<div style="display:inline-block;padding:6px 16px;background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.3);border-radius:20px;margin-bottom:20px;">
<p style="color:#3b82f6;font-size:12px;font-weight:600;margin:0;">🔑 Members Only</p>
</div>
<h1 style="font-size:34px;font-weight:900;color:#ffffff;margin:0 0 16px;line-height:1.1;">Inner Circle — Komunitas Entrepreneur Elite</h1>
<p style="font-size:15px;color:#94a3b8;margin:0 0 28px;line-height:1.7;">Bergabung dengan 300+ business owner yang saling support, sharing strategi, dan tumbuh bersama.</p>
<a href="#" style="display:inline-block;padding:16px 44px;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;border-radius:12px;font-weight:800;text-decoration:none;font-size:16px;box-shadow:0 8px 32px rgba(59,130,246,0.3);">Gabung Inner Circle →</a>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0a1025;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">🎁 Benefit Member</h2>
<div style="padding:18px;background:#0f1a38;border-radius:12px;margin-bottom:10px;border:1px solid #1e3a5f;">
<p style="color:#3b82f6;font-weight:700;margin:0 0 6px;font-size:15px;">📚 Library 200+ Video</p>
<p style="color:#94a3b8;font-size:13px;margin:0;">Akses penuh ke semua course dan workshop recording.</p>
</div>
<div style="padding:18px;background:#0f1a38;border-radius:12px;margin-bottom:10px;border:1px solid #1e3a5f;">
<p style="color:#3b82f6;font-weight:700;margin:0 0 6px;font-size:15px;">🎙️ Weekly Live Session</p>
<p style="color:#94a3b8;font-size:13px;margin:0;">Sesi live mingguan bersama expert dan sesama member.</p>
</div>
<div style="padding:18px;background:#0f1a38;border-radius:12px;margin-bottom:10px;border:1px solid #1e3a5f;">
<p style="color:#3b82f6;font-weight:700;margin:0 0 6px;font-size:15px;">🤝 Networking Event</p>
<p style="color:#94a3b8;font-size:13px;margin:0;">Event offline quarterly untuk membangun koneksi bisnis nyata.</p>
</div>
<div style="padding:18px;background:#0f1a38;border-radius:12px;border:1px solid #1e3a5f;">
<p style="color:#3b82f6;font-weight:700;margin:0 0 6px;font-size:15px;">💼 Deal & Partnership</p>
<p style="color:#94a3b8;font-size:13px;margin:0;">Diskon tools bisnis dan peluang kolaborasi antar member.</p>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#060a18;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">⭐ Kata Member</h2>
<div style="padding:20px;background:#0f1a38;border-radius:14px;margin-bottom:12px;border-left:4px solid #3b82f6;">
<p style="color:#e8e8f0;margin:0 0 8px;font-style:italic;">"Komunitas ini mengubah cara saya berbisnis. Networkingnya luar biasa, deals terjadi setiap minggu."</p>
<p style="color:#3b82f6;font-weight:700;margin:0;font-size:14px;">— Tono, Owner Franchise</p>
</div>
<div style="padding:20px;background:#0f1a38;border-radius:14px;border-left:4px solid #3b82f6;">
<p style="color:#e8e8f0;margin:0 0 8px;font-style:italic;">"Worth every penny! Materi dan koneksinya berkualitas tinggi. Investasi terbaik tahun ini."</p>
<p style="color:#3b82f6;font-weight:700;margin:0;font-size:14px;">— Lisa, Digital Marketer</p>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0a1025;box-sizing:border-box;text-align:center;">
<h2 style="font-size:24px;font-weight:800;color:#ffffff;margin:0 0 24px;">💰 Pilih Membership</h2>
<div style="display:grid;gap:16px;">
<div style="padding:24px;background:#0f1a38;border:1px solid #1e3a5f;border-radius:16px;">
<p style="color:#94a3b8;font-size:13px;font-weight:600;margin:0 0 8px;text-transform:uppercase;">Bulanan</p>
<p style="font-size:32px;font-weight:900;color:#ffffff;margin:0 0 4px;">Rp 199K<span style="font-size:14px;color:#64748b;font-weight:400;">/bulan</span></p>
<p style="color:#94a3b8;font-size:13px;margin:0 0 16px;">Bisa cancel kapan saja</p>
<a href="#" style="display:block;padding:12px;background:rgba(59,130,246,0.1);color:#3b82f6;border:1px solid rgba(59,130,246,0.3);border-radius:10px;font-weight:700;text-decoration:none;font-size:14px;">Pilih Bulanan</a>
</div>
<div style="padding:24px;background:linear-gradient(135deg,rgba(59,130,246,0.1),rgba(59,130,246,0.03));border:2px solid #3b82f6;border-radius:16px;position:relative;">
<div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:#3b82f6;color:#fff;padding:4px 14px;border-radius:20px;font-size:11px;font-weight:700;">HEMAT 40%</div>
<p style="color:#3b82f6;font-size:13px;font-weight:600;margin:0 0 8px;text-transform:uppercase;">Tahunan</p>
<p style="font-size:32px;font-weight:900;color:#ffffff;margin:0 0 4px;">Rp 1.499K<span style="font-size:14px;color:#64748b;font-weight:400;">/tahun</span></p>
<p style="color:#94a3b8;font-size:13px;margin:0 0 16px;">Setara Rp 125K/bulan</p>
<a href="#" style="display:block;padding:12px;background:#3b82f6;color:#fff;border-radius:10px;font-weight:700;text-decoration:none;font-size:14px;">Pilih Tahunan</a>
</div>
</div>
</section>
</div></body></html>`
  },
  {
    id: 'tpl-healthcare-1',
    title: 'Kesehatan / Klinik',
    description: 'Template clean dan terpercaya untuk klinik, dokter, atau layanan kesehatan dengan booking system.',
    category: 'Healthcare',
    thumbnail_url: 'https://placehold.co/400x300/0a0a1a/22d3ee?text=Healthcare+Template',
    html_content: `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Healthcare Landing Page</title></head><body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;"><div id="lp-root" style="min-height:100vh;width:100%;background:#040e14;color:#e8e8f0;margin:0;padding:0;">
<section style="max-width:688px;margin:0 auto;padding:60px 35px 40px;text-align:center;background:linear-gradient(180deg,#081c28 0%,#040e14 100%);box-sizing:border-box;">
<p style="color:#22d3ee;font-size:12px;font-weight:700;letter-spacing:3px;margin:0 0 20px;">🏥 KLINIK TERPERCAYA</p>
<h1 style="font-size:32px;font-weight:900;color:#ffffff;margin:0 0 16px;line-height:1.15;">Perawatan Kulit Profesional dengan Teknologi Terkini</h1>
<p style="font-size:15px;color:#94a3b8;margin:0 0 28px;line-height:1.7;">Klinik kecantikan dengan dokter spesialis kulit bersertifikat. Treatment aman, hasil terbukti, harga transparan.</p>
<a href="#" style="display:inline-block;padding:16px 44px;background:linear-gradient(135deg,#22d3ee,#06b6d4);color:#040e14;border-radius:12px;font-weight:800;text-decoration:none;font-size:16px;box-shadow:0 8px 32px rgba(34,211,238,0.2);">Booking Konsultasi →</a>
<p style="font-size:12px;color:#64748b;margin:14px 0 0;">👩‍⚕️ Konsultasi pertama GRATIS</p>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#061a24;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">✨ Treatment Populer</h2>
<div style="display:grid;gap:12px;">
<div style="padding:20px;background:#0c2836;border-radius:14px;border:1px solid #164e63;display:flex;justify-content:space-between;align-items:center;">
<div><p style="color:#ffffff;font-weight:700;margin:0 0 4px;font-size:15px;">Facial Hydra Glow</p><p style="color:#94a3b8;font-size:13px;margin:0;">Deep cleansing + hydration boost</p></div>
<p style="color:#22d3ee;font-weight:800;font-size:16px;margin:0;white-space:nowrap;">Rp 299K</p>
</div>
<div style="padding:20px;background:#0c2836;border-radius:14px;border:1px solid #164e63;display:flex;justify-content:space-between;align-items:center;">
<div><p style="color:#ffffff;font-weight:700;margin:0 0 4px;font-size:15px;">Laser Rejuvenation</p><p style="color:#94a3b8;font-size:13px;margin:0;">Anti-aging + skin tightening</p></div>
<p style="color:#22d3ee;font-weight:800;font-size:16px;margin:0;white-space:nowrap;">Rp 899K</p>
</div>
<div style="padding:20px;background:#0c2836;border-radius:14px;border:1px solid #164e63;display:flex;justify-content:space-between;align-items:center;">
<div><p style="color:#ffffff;font-weight:700;margin:0 0 4px;font-size:15px;">Chemical Peeling</p><p style="color:#94a3b8;font-size:13px;margin:0;">Acne scar + brightening</p></div>
<p style="color:#22d3ee;font-weight:800;font-size:16px;margin:0;white-space:nowrap;">Rp 499K</p>
</div>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#040e14;box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">🛡️ Kenapa Pilih Kami</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
<div style="padding:18px;background:#0c2836;border-radius:12px;text-align:center;border:1px solid #164e63;">
<p style="font-size:24px;margin:0 0 8px;">👩‍⚕️</p>
<p style="color:#ffffff;font-weight:600;font-size:13px;margin:0 0 4px;">Dokter Spesialis</p>
<p style="color:#94a3b8;font-size:12px;margin:0;">Bersertifikat resmi</p>
</div>
<div style="padding:18px;background:#0c2836;border-radius:12px;text-align:center;border:1px solid #164e63;">
<p style="font-size:24px;margin:0 0 8px;">🔬</p>
<p style="color:#ffffff;font-weight:600;font-size:13px;margin:0 0 4px;">Alat Terbaru</p>
<p style="color:#94a3b8;font-size:12px;margin:0;">FDA approved</p>
</div>
<div style="padding:18px;background:#0c2836;border-radius:12px;text-align:center;border:1px solid #164e63;">
<p style="font-size:24px;margin:0 0 8px;">💯</p>
<p style="color:#ffffff;font-weight:600;font-size:13px;margin:0 0 4px;">10.000+ Pasien</p>
<p style="color:#94a3b8;font-size:12px;margin:0;">Satisfied & happy</p>
</div>
<div style="padding:18px;background:#0c2836;border-radius:12px;text-align:center;border:1px solid #164e63;">
<p style="font-size:24px;margin:0 0 8px;">📍</p>
<p style="color:#ffffff;font-weight:600;font-size:13px;margin:0 0 4px;">3 Cabang</p>
<p style="color:#94a3b8;font-size:12px;margin:0;">Jakarta & Tangerang</p>
</div>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#061a24;box-sizing:border-box;text-align:center;">
<h2 style="font-size:24px;font-weight:800;color:#ffffff;margin:0 0 12px;">📞 Booking Sekarang</h2>
<p style="font-size:15px;color:#94a3b8;margin:0 0 24px;">Konsultasi pertama GRATIS. Hubungi kami untuk jadwalkan appointment.</p>
<a href="#" style="display:inline-block;padding:18px 56px;background:linear-gradient(135deg,#22d3ee,#06b6d4);color:#040e14;border-radius:14px;font-weight:800;text-decoration:none;font-size:18px;box-shadow:0 8px 32px rgba(34,211,238,0.2);">WhatsApp Booking →</a>
<p style="font-size:12px;color:#64748b;margin:14px 0 0;">🕐 Buka Senin-Sabtu, 09.00-21.00</p>
</section>
</div></body></html>`
  },
  {
    id: 'tpl-undangan-1',
    title: 'Undangan / Event',
    description: 'Template elegan untuk undangan pernikahan, gathering, atau event spesial dengan RSVP.',
    category: 'Invitation',
    thumbnail_url: 'https://placehold.co/400x300/0a0a1a/c084fc?text=Undangan+Template',
    html_content: `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Undangan Event</title></head><body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;"><div id="lp-root" style="min-height:100vh;width:100%;background:#0a0810;color:#e8e8f0;margin:0;padding:0;">
<section style="max-width:688px;margin:0 auto;padding:80px 35px 40px;text-align:center;background:linear-gradient(180deg,#150f24 0%,#0a0810 100%);box-sizing:border-box;">
<p style="color:#c084fc;font-size:14px;font-weight:400;letter-spacing:4px;margin:0 0 24px;font-style:italic;">The Wedding of</p>
<h1 style="font-size:42px;font-weight:300;color:#ffffff;margin:0 0 8px;line-height:1.1;font-style:italic;">Rina & Andi</h1>
<div style="width:60px;height:1px;background:#c084fc;margin:20px auto;"></div>
<p style="font-size:16px;color:#c084fc;margin:0 0 8px;font-weight:600;">Sabtu, 15 Mei 2026</p>
<p style="font-size:14px;color:#94a3b8;margin:0;">Hotel Grand Hyatt Jakarta</p>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0e0b18;box-sizing:border-box;text-align:center;">
<p style="color:#c084fc;font-size:13px;letter-spacing:2px;margin:0 0 20px;font-style:italic;">Bismillahirrahmanirrahim</p>
<p style="font-size:15px;color:#d4d4d8;margin:0 0 20px;line-height:1.8;">Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan resepsi pernikahan kami.</p>
<div style="display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:center;margin-bottom:24px;">
<div style="text-align:center;">
<p style="color:#ffffff;font-weight:700;font-size:18px;margin:0 0 4px;">Rina Amelia</p>
<p style="color:#94a3b8;font-size:13px;margin:0;">Putri Bapak Sutrisno & Ibu Dewi</p>
</div>
<p style="color:#c084fc;font-size:28px;margin:0;">&</p>
<div style="text-align:center;">
<p style="color:#ffffff;font-weight:700;font-size:18px;margin:0 0 4px;">Andi Pratama</p>
<p style="color:#94a3b8;font-size:13px;margin:0;">Putra Bapak Haryanto & Ibu Sri</p>
</div>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0a0810;box-sizing:border-box;">
<h2 style="font-size:20px;font-weight:600;color:#ffffff;text-align:center;margin:0 0 24px;font-style:italic;">📍 Detail Acara</h2>
<div style="padding:24px;background:#150f24;border-radius:16px;margin-bottom:12px;border:1px solid #2e1f4d;text-align:center;">
<p style="color:#c084fc;font-weight:700;font-size:15px;margin:0 0 8px;">💒 Akad Nikah</p>
<p style="color:#ffffff;font-size:14px;margin:0 0 4px;">08.00 — 10.00 WIB</p>
<p style="color:#94a3b8;font-size:13px;margin:0;">Ballroom A, Lt. 3</p>
</div>
<div style="padding:24px;background:#150f24;border-radius:16px;border:1px solid #2e1f4d;text-align:center;">
<p style="color:#c084fc;font-weight:700;font-size:15px;margin:0 0 8px;">🎉 Resepsi</p>
<p style="color:#ffffff;font-size:14px;margin:0 0 4px;">11.00 — 14.00 WIB</p>
<p style="color:#94a3b8;font-size:13px;margin:0;">Grand Ballroom, Lt. 5</p>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0e0b18;box-sizing:border-box;text-align:center;">
<h2 style="font-size:20px;font-weight:600;color:#ffffff;margin:0 0 12px;font-style:italic;">Konfirmasi Kehadiran</h2>
<p style="font-size:14px;color:#94a3b8;margin:0 0 24px;">Kehadiran Anda merupakan kebahagiaan bagi kami.</p>
<a href="#" style="display:inline-block;padding:16px 48px;background:linear-gradient(135deg,#c084fc,#a855f7);color:#fff;border-radius:14px;font-weight:700;text-decoration:none;font-size:16px;box-shadow:0 8px 32px rgba(192,132,252,0.3);">Konfirmasi Hadir →</a>
</section>
<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0a0810;box-sizing:border-box;text-align:center;">
<p style="color:#c084fc;font-size:14px;margin:0 0 16px;font-style:italic;">💝 Amplop Digital</p>
<div style="padding:20px;background:#150f24;border-radius:14px;border:1px solid #2e1f4d;">
<p style="color:#ffffff;font-size:14px;margin:0 0 8px;">Bank BCA</p>
<p style="color:#c084fc;font-weight:700;font-size:18px;margin:0 0 4px;">1234567890</p>
<p style="color:#94a3b8;font-size:13px;margin:0;">a.n. Rina Amelia</p>
</div>
</section>
<section style="max-width:688px;margin:0 auto;padding:30px 35px;background:#0e0b18;box-sizing:border-box;text-align:center;">
<div style="width:60px;height:1px;background:#c084fc;margin:0 auto 16px;"></div>
<p style="color:#94a3b8;font-size:13px;margin:0;font-style:italic;">"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri."</p>
<p style="color:#64748b;font-size:12px;margin:8px 0 0;">— QS. Ar-Rum: 21</p>
</section>
</div></body></html>`
  }
];

// ──── VARIED PHOTO & EXTRA SECTION GENERATORS ────

// Style 1: Full-width hero + 3 column grid
const GALLERY_HERO_3COL = (bg: string, card: string, accent: string) =>
  `<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:${bg};box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">📸 Dokumentasi</h2>
<img src="https://placehold.co/620x320/${card.replace('#','')}/${accent.replace('#','')}?text=Highlight+Utama" alt="Highlight" style="width:100%;border-radius:16px;margin-bottom:12px;" />
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
<img src="https://placehold.co/200x160/${card.replace('#','')}/${accent.replace('#','')}?text=Foto+1" alt="Foto 1" style="width:100%;border-radius:10px;" />
<img src="https://placehold.co/200x160/${card.replace('#','')}/${accent.replace('#','')}?text=Foto+2" alt="Foto 2" style="width:100%;border-radius:10px;" />
<img src="https://placehold.co/200x160/${card.replace('#','')}/${accent.replace('#','')}?text=Foto+3" alt="Foto 3" style="width:100%;border-radius:10px;" />
</div>
</section>`;

// Style 2: 1 large left + 2 stacked right (masonry)
const GALLERY_MASONRY = (bg: string, card: string, accent: string) =>
  `<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:${bg};box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">🖼️ Portfolio</h2>
<div style="display:grid;grid-template-columns:1.2fr 1fr;gap:12px;">
<img src="https://placehold.co/380x400/${card.replace('#','')}/${accent.replace('#','')}?text=Karya+Utama" alt="Main" style="width:100%;height:100%;object-fit:cover;border-radius:14px;border:1px solid ${accent}33;" />
<div style="display:flex;flex-direction:column;gap:12px;">
<img src="https://placehold.co/280x190/${card.replace('#','')}/${accent.replace('#','')}?text=Detail+1" alt="Detail 1" style="width:100%;border-radius:14px;border:1px solid ${accent}33;" />
<img src="https://placehold.co/280x190/${card.replace('#','')}/${accent.replace('#','')}?text=Detail+2" alt="Detail 2" style="width:100%;border-radius:14px;border:1px solid ${accent}33;" />
</div>
</div>
</section>`;

// Style 3: Before/After comparison cards
const GALLERY_BEFORE_AFTER = (bg: string, card: string, accent: string) =>
  `<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:${bg};box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">🔄 Hasil Nyata</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
<div style="text-align:center;">
<img src="https://placehold.co/300x240/${card.replace('#','')}/ff4757?text=BEFORE" alt="Before" style="width:100%;border-radius:14px;border:2px solid #ff4757;" />
<p style="color:#ff4757;font-weight:700;font-size:13px;margin:8px 0 0;">❌ Sebelum</p>
</div>
<div style="text-align:center;">
<img src="https://placehold.co/300x240/${card.replace('#','')}/${accent.replace('#','')}?text=AFTER" alt="After" style="width:100%;border-radius:14px;border:2px solid ${accent};" />
<p style="color:${accent};font-weight:700;font-size:13px;margin:8px 0 0;">✅ Sesudah</p>
</div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
<div style="text-align:center;">
<img src="https://placehold.co/300x240/${card.replace('#','')}/ff4757?text=BEFORE+2" alt="Before 2" style="width:100%;border-radius:14px;border:2px solid #ff4757;" />
<p style="color:#ff4757;font-weight:700;font-size:13px;margin:8px 0 0;">❌ Sebelum</p>
</div>
<div style="text-align:center;">
<img src="https://placehold.co/300x240/${card.replace('#','')}/${accent.replace('#','')}?text=AFTER+2" alt="After 2" style="width:100%;border-radius:14px;border:2px solid ${accent};" />
<p style="color:${accent};font-weight:700;font-size:13px;margin:8px 0 0;">✅ Sesudah</p>
</div>
</div>
</section>`;

// Style 4: Product showcase carousel-like (horizontal cards)
const GALLERY_PRODUCT_CARDS = (bg: string, card: string, accent: string) =>
  `<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:${bg};box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">🛍️ Koleksi Produk</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
<div style="background:${card};border-radius:14px;overflow:hidden;border:1px solid ${accent}22;">
<img src="https://placehold.co/320x280/${card.replace('#','')}/${accent.replace('#','')}?text=Produk+A" alt="Produk A" style="width:100%;aspect-ratio:1;object-fit:cover;" />
<div style="padding:14px;"><p style="color:#fff;font-weight:700;margin:0 0 4px;font-size:14px;">Produk Unggulan A</p><p style="color:${accent};font-weight:800;margin:0;font-size:15px;">Rp 299.000</p></div>
</div>
<div style="background:${card};border-radius:14px;overflow:hidden;border:1px solid ${accent}22;">
<img src="https://placehold.co/320x280/${card.replace('#','')}/${accent.replace('#','')}?text=Produk+B" alt="Produk B" style="width:100%;aspect-ratio:1;object-fit:cover;" />
<div style="padding:14px;"><p style="color:#fff;font-weight:700;margin:0 0 4px;font-size:14px;">Produk Unggulan B</p><p style="color:${accent};font-weight:800;margin:0;font-size:15px;">Rp 399.000</p></div>
</div>
</div>
<div style="margin-top:14px;">
<div style="background:${card};border-radius:14px;overflow:hidden;border:1px solid ${accent}22;display:flex;align-items:center;gap:16px;">
<img src="https://placehold.co/200x200/${card.replace('#','')}/${accent.replace('#','')}?text=Bundle" alt="Bundle" style="width:40%;aspect-ratio:1;object-fit:cover;" />
<div style="padding:14px;flex:1;"><p style="color:${accent};font-size:11px;font-weight:700;letter-spacing:2px;margin:0 0 6px;">⭐ BEST SELLER</p><p style="color:#fff;font-weight:700;margin:0 0 4px;font-size:15px;">Paket Bundle Hemat</p><p style="color:${accent};font-weight:800;margin:0;font-size:17px;">Rp 549.000</p></div>
</div>
</div>
</section>`;

// Style 5: Full-width stacked with captions
const GALLERY_STACKED_CAPTION = (bg: string, card: string, accent: string) =>
  `<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:${bg};box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">📷 Momen Terbaik</h2>
<div style="margin-bottom:16px;border-radius:14px;overflow:hidden;border:1px solid ${accent}33;">
<img src="https://placehold.co/620x300/${card.replace('#','')}/${accent.replace('#','')}?text=Momen+Spesial+1" alt="Momen 1" style="width:100%;display:block;" />
<div style="padding:14px;background:${card};"><p style="color:#fff;font-weight:600;margin:0 0 4px;font-size:14px;">✨ Pengalaman Tak Terlupakan</p><p style="color:#94a3b8;font-size:12px;margin:0;">Setiap momen dirancang untuk memberikan kesan mendalam</p></div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
<div style="border-radius:14px;overflow:hidden;border:1px solid ${accent}33;">
<img src="https://placehold.co/300x200/${card.replace('#','')}/${accent.replace('#','')}?text=Momen+2" alt="Momen 2" style="width:100%;display:block;" />
<div style="padding:12px;background:${card};"><p style="color:#fff;font-weight:600;margin:0;font-size:13px;">🎯 Detail Sempurna</p></div>
</div>
<div style="border-radius:14px;overflow:hidden;border:1px solid ${accent}33;">
<img src="https://placehold.co/300x200/${card.replace('#','')}/${accent.replace('#','')}?text=Momen+3" alt="Momen 3" style="width:100%;display:block;" />
<div style="padding:12px;background:${card};"><p style="color:#fff;font-weight:600;margin:0;font-size:13px;">💎 Kualitas Premium</p></div>
</div>
</div>
</section>`;

// Style 6: Team/people showcase with round photos
const GALLERY_TEAM = (bg: string, card: string, accent: string) =>
  `<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:${bg};box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">👥 Tim Profesional</h2>
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;text-align:center;">
<div>
<img src="https://placehold.co/140x140/${card.replace('#','')}/${accent.replace('#','')}?text=Team+1" alt="Team 1" style="width:100px;height:100px;border-radius:50%;border:3px solid ${accent};margin-bottom:10px;" />
<p style="color:#fff;font-weight:700;font-size:14px;margin:0 0 2px;">Dr. Sarah</p>
<p style="color:${accent};font-size:12px;margin:0;">Founder & CEO</p>
</div>
<div>
<img src="https://placehold.co/140x140/${card.replace('#','')}/${accent.replace('#','')}?text=Team+2" alt="Team 2" style="width:100px;height:100px;border-radius:50%;border:3px solid ${accent};margin-bottom:10px;" />
<p style="color:#fff;font-weight:700;font-size:14px;margin:0 0 2px;">Budi Santoso</p>
<p style="color:${accent};font-size:12px;margin:0;">Head of Marketing</p>
</div>
<div>
<img src="https://placehold.co/140x140/${card.replace('#','')}/${accent.replace('#','')}?text=Team+3" alt="Team 3" style="width:100px;height:100px;border-radius:50%;border:3px solid ${accent};margin-bottom:10px;" />
<p style="color:#fff;font-weight:700;font-size:14px;margin:0 0 2px;">Rina Dewi</p>
<p style="color:${accent};font-size:12px;margin:0;">Lead Designer</p>
</div>
</div>
</section>`;

// Style 7: Feature showcase with icon images
const GALLERY_FEATURES_IMG = (bg: string, card: string, accent: string) =>
  `<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:${bg};box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">🏆 Keunggulan Kami</h2>
<div style="display:flex;flex-direction:column;gap:14px;">
<div style="display:flex;gap:16px;align-items:center;padding:16px;background:${card};border-radius:14px;border:1px solid ${accent}22;">
<img src="https://placehold.co/80x80/${card.replace('#','')}/${accent.replace('#','')}?text=✓" alt="Icon 1" style="width:70px;height:70px;border-radius:12px;flex-shrink:0;" />
<div><p style="color:#fff;font-weight:700;margin:0 0 4px;font-size:15px;">Berpengalaman 10+ Tahun</p><p style="color:#94a3b8;font-size:13px;margin:0;">Sudah dipercaya ribuan klien dari berbagai industri.</p></div>
</div>
<div style="display:flex;gap:16px;align-items:center;padding:16px;background:${card};border-radius:14px;border:1px solid ${accent}22;">
<img src="https://placehold.co/80x80/${card.replace('#','')}/${accent.replace('#','')}?text=★" alt="Icon 2" style="width:70px;height:70px;border-radius:12px;flex-shrink:0;" />
<div><p style="color:#fff;font-weight:700;margin:0 0 4px;font-size:15px;">Rating 4.9/5 Bintang</p><p style="color:#94a3b8;font-size:13px;margin:0;">Konsistensi kualitas yang diakui pelanggan setia.</p></div>
</div>
<div style="display:flex;gap:16px;align-items:center;padding:16px;background:${card};border-radius:14px;border:1px solid ${accent}22;">
<img src="https://placehold.co/80x80/${card.replace('#','')}/${accent.replace('#','')}?text=♥" alt="Icon 3" style="width:70px;height:70px;border-radius:12px;flex-shrink:0;" />
<div><p style="color:#fff;font-weight:700;margin:0 0 4px;font-size:15px;">Garansi 100% Puas</p><p style="color:#94a3b8;font-size:13px;margin:0;">Tidak puas? Uang kembali tanpa ribet.</p></div>
</div>
</div>
</section>`;

// Extra section: Process/Steps
const EXTRA_PROCESS = (bg: string, card: string, accent: string) =>
  `<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:${bg};box-sizing:border-box;">
<h2 style="font-size:22px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">⚙️ Cara Kerjanya</h2>
<div style="display:flex;flex-direction:column;gap:0;">
<div style="display:flex;gap:16px;align-items:flex-start;padding:18px 0;">
<div style="width:40px;height:40px;border-radius:50%;background:${accent};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;flex-shrink:0;">1</div>
<div style="flex:1;border-bottom:1px solid ${accent}22;padding-bottom:18px;"><p style="color:#fff;font-weight:700;margin:0 0 4px;font-size:15px;">Konsultasi Gratis</p><p style="color:#94a3b8;font-size:13px;margin:0;">Ceritakan kebutuhan Anda, kami analisa dan berikan rekomendasi terbaik.</p></div>
</div>
<div style="display:flex;gap:16px;align-items:flex-start;padding:18px 0;">
<div style="width:40px;height:40px;border-radius:50%;background:${accent};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;flex-shrink:0;">2</div>
<div style="flex:1;border-bottom:1px solid ${accent}22;padding-bottom:18px;"><p style="color:#fff;font-weight:700;margin:0 0 4px;font-size:15px;">Proses Pengerjaan</p><p style="color:#94a3b8;font-size:13px;margin:0;">Tim kami mulai bekerja dengan update progress secara berkala.</p></div>
</div>
<div style="display:flex;gap:16px;align-items:flex-start;padding:18px 0;">
<div style="width:40px;height:40px;border-radius:50%;background:${accent};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;flex-shrink:0;">3</div>
<div style="flex:1;"><p style="color:#fff;font-weight:700;margin:0 0 4px;font-size:15px;">Serah Terima & Support</p><p style="color:#94a3b8;font-size:13px;margin:0;">Hasil final dikirim beserta panduan dan dukungan after-sales.</p></div>
</div>
</div>
</section>`;

// Extra section: Stats bar
const EXTRA_STATS = (bg: string, card: string, accent: string) =>
  `<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:${bg};box-sizing:border-box;">
<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;text-align:center;">
<div style="padding:16px 8px;background:${card};border-radius:12px;">
<p style="font-size:24px;font-weight:900;color:${accent};margin:0;">5K+</p>
<p style="color:#94a3b8;font-size:11px;margin:4px 0 0;">Pelanggan</p>
</div>
<div style="padding:16px 8px;background:${card};border-radius:12px;">
<p style="font-size:24px;font-weight:900;color:${accent};margin:0;">99%</p>
<p style="color:#94a3b8;font-size:11px;margin:4px 0 0;">Puas</p>
</div>
<div style="padding:16px 8px;background:${card};border-radius:12px;">
<p style="font-size:24px;font-weight:900;color:${accent};margin:0;">50+</p>
<p style="color:#94a3b8;font-size:11px;margin:4px 0 0;">Kota</p>
</div>
<div style="padding:16px 8px;background:${card};border-radius:12px;">
<p style="font-size:24px;font-weight:900;color:${accent};margin:0;">24/7</p>
<p style="color:#94a3b8;font-size:11px;margin:4px 0 0;">Support</p>
</div>
</div>
</section>`;

// Extra: Social proof logos
const EXTRA_SOCIAL_PROOF = (bg: string, card: string, accent: string) =>
  `<section style="max-width:688px;margin:0 auto;padding:30px 35px;background:${bg};box-sizing:border-box;text-align:center;">
<p style="color:#64748b;font-size:12px;font-weight:600;letter-spacing:2px;margin:0 0 16px;text-transform:uppercase;">Dipercaya Oleh</p>
<div style="display:flex;justify-content:center;gap:20px;flex-wrap:wrap;align-items:center;">
<img src="https://placehold.co/100x40/${card.replace('#','')}/${accent.replace('#','')}?text=Brand+A" alt="Brand A" style="height:36px;opacity:0.6;border-radius:6px;" />
<img src="https://placehold.co/100x40/${card.replace('#','')}/${accent.replace('#','')}?text=Brand+B" alt="Brand B" style="height:36px;opacity:0.6;border-radius:6px;" />
<img src="https://placehold.co/100x40/${card.replace('#','')}/${accent.replace('#','')}?text=Brand+C" alt="Brand C" style="height:36px;opacity:0.6;border-radius:6px;" />
<img src="https://placehold.co/100x40/${card.replace('#','')}/${accent.replace('#','')}?text=Brand+D" alt="Brand D" style="height:36px;opacity:0.6;border-radius:6px;" />
</div>
</section>`;

// Map each template to different combinations of gallery + extra sections
type SectionFn = (bg: string, card: string, accent: string) => string;
const templateExtras: Record<string, SectionFn[]> = {
  'tpl-ebook-1':     [EXTRA_SOCIAL_PROOF, GALLERY_STACKED_CAPTION, EXTRA_PROCESS],
  'tpl-jasa-1':      [EXTRA_STATS, GALLERY_MASONRY, EXTRA_PROCESS],
  'tpl-produk-1':    [GALLERY_BEFORE_AFTER, EXTRA_STATS, GALLERY_PRODUCT_CARDS],
  'tpl-webinar-1':   [EXTRA_SOCIAL_PROOF, GALLERY_HERO_3COL, EXTRA_STATS],
  'tpl-saas-1':      [EXTRA_SOCIAL_PROOF, GALLERY_FEATURES_IMG, EXTRA_STATS],
  'tpl-fitness-1':   [GALLERY_BEFORE_AFTER, EXTRA_STATS, EXTRA_PROCESS],
  'tpl-course-1':    [EXTRA_SOCIAL_PROOF, GALLERY_TEAM, EXTRA_STATS],
  'tpl-fnb-1':       [GALLERY_PRODUCT_CARDS, EXTRA_STATS, GALLERY_STACKED_CAPTION],
  'tpl-agency-1':    [EXTRA_SOCIAL_PROOF, GALLERY_MASONRY, GALLERY_TEAM],
  'tpl-property-1':  [GALLERY_HERO_3COL, EXTRA_STATS, GALLERY_STACKED_CAPTION],
  'tpl-fashion-1':   [GALLERY_PRODUCT_CARDS, EXTRA_SOCIAL_PROOF, GALLERY_STACKED_CAPTION],
  'tpl-travel-1':    [GALLERY_HERO_3COL, EXTRA_STATS, GALLERY_STACKED_CAPTION],
  'tpl-coaching-1':  [EXTRA_SOCIAL_PROOF, GALLERY_FEATURES_IMG, EXTRA_PROCESS],
  'tpl-membership-1':[EXTRA_SOCIAL_PROOF, GALLERY_TEAM, EXTRA_STATS],
  'tpl-healthcare-1':[GALLERY_BEFORE_AFTER, GALLERY_TEAM, EXTRA_STATS],
  'tpl-undangan-1':  [GALLERY_STACKED_CAPTION, GALLERY_HERO_3COL],
};

const colorMap: Record<string, [string, string, string]> = {
  'tpl-ebook-1': ['#0f0d1a', '#1a1a2e', '#7C3AED'],
  'tpl-jasa-1': ['#0f0d1a', '#1a1a2e', '#38bdf8'],
  'tpl-produk-1': ['#13111c', '#1a1a2e', '#f59e0b'],
  'tpl-webinar-1': ['#080818', '#0f172a', '#10b981'],
  'tpl-saas-1': ['#0a0a24', '#111133', '#818cf8'],
  'tpl-fitness-1': ['#111111', '#1a1a1a', '#ef4444'],
  'tpl-course-1': ['#0c0a09', '#1c1917', '#f97316'],
  'tpl-fnb-1': ['#121008', '#1c1917', '#eab308'],
  'tpl-agency-1': ['#081820', '#0c2330', '#06b6d4'],
  'tpl-property-1': ['#110f08', '#1c1917', '#d4a017'],
  'tpl-fashion-1': ['#0e0e14', '#18181f', '#ec4899'],
  'tpl-travel-1': ['#052a28', '#0c3835', '#14b8a6'],
  'tpl-coaching-1': ['#100a1e', '#1e1535', '#a855f7'],
  'tpl-membership-1': ['#0a1025', '#0f1a38', '#3b82f6'],
  'tpl-healthcare-1': ['#061a24', '#0c2836', '#22d3ee'],
  'tpl-undangan-1': ['#0e0b18', '#150f24', '#c084fc'],
};

export const sampleTemplates: LpTemplate[] = rawTemplates.map(t => {
  const cfg = colorMap[t.id];
  const extras = templateExtras[t.id];
  const extraHtml = (cfg && extras) ? extras.map(fn => fn(cfg[0], cfg[1], cfg[2])).join('') : '';
  const html_content = extraHtml ? t.html_content.replace('</div></body></html>', extraHtml + '</div></body></html>') : t.html_content;
  return { ...t, thumbnail_url: '', html_content };
});
