# Memory

## Production Infrastructure
- **Live Production URL**: [https://prompt-page-builder-app.vercel.app](https://prompt-page-builder-app.vercel.app)
- **Latest Deployment ID**: `dpl_5iSgvmyTtNF1tzTB3ZpDuxyC8pwh` (Status: READY)
- **GitHub Repository**: [https://github.com/rickyrizkymnf123-commits/prompt-page-builder](https://github.com/rickyrizkymnf123-commits/prompt-page-builder)
- **Database (Supabase Project Ref)**: `uxerfoonlifdpgiiwvdi`
- **Main Admin**: `fauzymnf29@gmail.com`
- **Admin Password**: `Eci12345!`

## Core Capabilities & Features
1. **💾 Saved Projects Database (`public.saved_projects`)**:
   - Simpan, buka, edit, dan update form custom ke database Supabase kapan saja.
   - Autosave draft otomatis ke `localStorage` (`lpb_form_draft`).
2. **🛡️ Session Stability, Fix Reset Password, Complete User Deletion & Admin Role Management**:
   - Pengecekan sesi persisten stabil tanpa force logout.
   - Password reset di Admin menggunakan RPC `admin_set_user_password`.
   - Complete User Deletion: Menghapus user secara atomic dari `auth.users` dan seluruh tabel relasi (`profiles`, `entitlements`, `user_roles`, `saved_projects`, dll.).
   - Admin Role Management: Fitur mempromosikan user biasa menjadi Admin (`👑 Jadi Admin`) dan sebaliknya (`👤 Set User`) secara individual maupun massal (bulk).
   - Orphan User Recovery: Jika user terhapus di masa lalu tetapi record `auth.users` tersisa, pendaftaran ulang secara otomatis mendeteksi dan menempatkan user ke antrean persetujuan (ACC) Admin.
3. **📲 CTA Modes & Form Actions**:
   - Direct WhatsApp (CTWA) dengan Auto-Text Generator.
   - Direct Link / Microsite Checkout (Scalev, WinMe, OrderHero, Mayar, dll.).
   - Lead Capture Form langsung di landing page.
4. **📱 Mobile-First Native Feel & UI Polish**:
   - Sticky Header & Navigation Bar dengan backdrop-blur.
   - Perbaikan jarak tombol close `✕` dan refresh `🔄` di dialog (tidak tumpang tindih).
   - Template gallery mobile friendly dengan device preview toggle (*Mobile 375px* vs *Desktop*).
5. **🎨 Visual Warna Brand & Apple Liquid Glass Aesthetic**:
   - Modal selector Apple Liquid Glass transparan dengan input manual smooth.
   - Color Swatch Circles interaktif + custom HEX picker.
   - Visual Theme preview cards & typography Google Fonts + animasi masuk section.
6. **🤝 Program Kemitraan & Affiliate (`public.affiliate_referrals`)**:
   - Referral link unik per member, statistik klik, lead, saldo komisi, dan payout request.
7. **📑 Custom User Templates (`public.custom_user_templates`)**:
   - Simpan hasil LP manual ke akun masing-masing dan muat ulang dari galeri template.
8. **🖼️ Media Assets**:
   - Foto Produk (multi-image), Video Hero Embed (YouTube/TikTok/Vimeo), dan Cover Banner Header.
9. **🕵️‍♂️ AI Competitor Spy Tool**:
   - Analisa URL kompetitor (Headline, Funnel, Offer, Kelemahan, Angle Emas).
10. **🎬 AI Creative-to-Landing Page Sync**:
    - Ekstrak Hook, Emosi, Target & Promise dari video iklan TikTok/FB Ads -> sinkronkan ke LP.
11. **⏱️ Fitur "Tes 5 Detik"**:
    - Evaluasi pemahaman audiens dalam 5 detik pertama lengkap dengan skor & formula quick fix.
12. **⚡ Mode "Tulis Prompt Cepat"**:
    - 1-click auto-fill form dari 1 kalimat instruksi bebas.
13. **🏷️ Struktur Harga Bertingkat (Batch Pricing)** & **Mode Tanpa Harga**:
    - Opsi Batch 1 Early Bird, Batch 2, Batch 3, serta mode non-komersial tanpa harga (pendaftaran agen/free app).
14. **🖥️ Live Side-Display Blueprint**:
    - Visual split screen di desktop yang menampilkan blueprint alur framework secara realtime.
15. **📡 Funnel Meta Conversions API (CAPI) CTWA**:
    - Generator script Pixel & CAPI tracking lead event saat klik WhatsApp.
16. **🔀 Drag & Drop Section Reorder**:
    - Pengaturan urutan section landing page secara adaptif.
