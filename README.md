# Remix of Prompt Page Builder

BANGUN SEBUAH APLIKASI SAAS WEB BERNAMA:

“Landing Page Engine”

TUJUAN:
Aplikasi ini adalah Prompt Generator untuk membuat Landing Page HTML menggunakan AI.

Flow kerja HARUS sama dengan tools referensi:

User isi seluruh form.

User klik tombol “Generate Prompt”.

Prompt muncul di panel kanan.

User klik “Buat Landing Page”.

Sistem auto-copy prompt dan membuka chat.z.ai di tab baru.

TIDAK BOLEH:

Auto update realtime

Generate otomatis tanpa klik

Menghilangkan dropdown option

Mengurangi kategori

Menghilangkan step

Mengubah urutan

🎨 THEME & UI

THEME: Dark Purple Premium

Background utama:
Very dark navy-purple

Card background:
Sedikit lebih terang dari background utama

Accent color:
Gradient ungu → magenta

Text:
Putih untuk primary
Abu terang untuk secondary

Border:
Ungu gelap tipis

Semua selected state:
Highlight ungu

Layout:

Kiri: Form Wizard (scroll)

Kanan: Sticky AI Prompt Output panel

📐 STRUKTUR HALAMAN

HEADER:

Logo kiri: Landing Page Engine

Kanan: Icon dark/light toggle + logout icon

BODY:
Grid 2 kolom:

Left column (Form Engine)

Right column (AI Prompt Output - sticky)

🧠 STATE LOGIC (WAJIB)

State awal:

Prompt panel kosong (placeholder text)

Tombol "Salin Prompt" disabled

Tombol "Buat Landing Page" disabled

Setelah klik "Generate Prompt":

Prompt muncul

Salin Prompt aktif

Buat Landing Page aktif

Jika user mengubah field setelah generate:

Status menjadi "Dirty"

Tombol berubah jadi "Generate Ulang"

Prompt tidak berubah sampai diklik ulang

🧱 FORM SECTIONS (WAJIB URUT DAN LENGKAP)

STEP 1 — Framework & Tone

PILIH FRAMEWORK:

A. Conversion Focused

AIDCA

PAS (Problem–Agitate–Solution)

BAB (Before–After–Bridge)

4P (Promise–Picture–Proof–Push)

SLAP (Stop–Look–Act–Purchase)

B. Storytelling & Brand

StoryBrand

ABT (And–But–Therefore)

Hero’s Journey

HSO (Hook–Story–Offer)

C. Diagnostic & Educational

QUEST

JTBD (Jobs To Be Done)

Awareness Ladder

FAB (Features–Advantages–Benefits)

D. Advanced / Hybrid

PASTOR

Problem–Promise–Proof

Useful–Urgent–Unique

The 3 Reason Why

Feature–Solution–Solution

Solution–Impact–Problem

Failed–Growth–Success

Stop–Fear–Listen

GAYA BAHASA:

Popular & Efektif

Friendly & Conversational

Professional & Formal

Witty & Humorous

Bold & Disruptive

Emotional & Story

Empathetic

Storytelling

Inspirational

Exciting & Energetic

Authority & Logic

Direct & To The Point

Scientific / Data-Driven

Trustworthy

Urgent / Scarcity

Vibe Khusus

Luxury & Exclusive

Minimalist & Zen

STEP 2 — Produk & Tujuan

TIPE PRODUK:

A. Digital Product

Ebook / Template

Mini Course / Video

Toolkit / Resource Pack

Membership / Komunitas

Bundle / Paket

B. Service / Jasa

Agency / Freelance

Konsultasi 1:1

Done-For-You

Audit / Review

Maintenance / Retainer

C. Physical / Commerce

Skincare / Fashion

Food & Beverage

Kesehatan / Wellness

Home & Living

Gadget / Aksesoris

D. Software

SaaS / Software

App / Mobile

Plugin / Add-on

E. Education

Kursus / Coaching

Bootcamp

Workshop

F. Event & Social

Event / Webinar

Event Offline

Fundraising / Donasi

H. Properti & High Value

Real Estate / Properti

Interior Design / Renovasi

Automotive

Luxury Goods

G. Lainnya

Lainnya (Isi Manual)

TUJUAN UTAMA:

A. Acquire

Lead Generation (WA/Email)

Download (Lead Magnet)

Registrasi (Event/WL)

Newsletter Signup

Quiz / Assessment Opt-in

Early Access / Beta Access

B. Convert

Sales / Beli Langsung

Checkout (Keranjang)

Pre-Order

Upsell / Downsell

Affiliate Conversion

Flash Sale / Limited Offer

C. Try

Trial / Demo

Sample / Preview

Free Consultation Entry

D. Subscribe

Subscribe (Membership)

Join Community

Renewal / Upgrade Plan

E. Contact

Chat (WA/DM)

Booking (Jadwal)

Konsultasi (Call)

Request Proposal

F. Impact

Donasi / Fundraising

Volunteer Signup

G. Apply & Selection

Apply Now (Seleksi)

Join Waitlist

STEP 3 — Target Market

LEVEL AWARENESS:

Unaware (Belum sadar)

Problem Aware (Tahu masalah)

Solution Aware (Cari solusi)

Product Aware (Tahu produk)

Most Aware (Siap beli)

TARGET AUDIENCE:

A. Marketing & Ads

Advertiser

Performance Marketer

Digital Marketing Manager

Content Strategist

Media Buyer Agency

B. Business

Business Owner (UMKM)

Founder Startup

Owner Toko Offline

Sales Team / Leader

Franchise Owner

C. Commerce

Seller Marketplace

Reseller / Dropshipper

Distributor / Grosir

Brand Lokal / D2C

D. Creator Economy

Content Creator / Affiliate

Influencer (Nano/Micro)

Coach / Mentor / Trainer

Educator / Course Creator

E. B2B / Corporate

HR / People Ops

Ops / Finance / Admin

IT / Tech Team

Procurement / Purchasing

G. Demographics Specific

Ibu Rumah Tangga / Moms

Pelajar / Mahasiswa

Fresh Graduate

Investor / Trader

Pensiunan

F. Other

Non-Profit / Organization

Umum (General Audience)

Lainnya (Isi Manual)

STEP 4 — Detail Produk & Copy

Field:

Nama Produk (required)

Harga Normal (number)

Harga Promo (number)

Deskripsi & Benefit (textarea)

CTA Utama (text input)

STEP 5 — Gaya Desain

Dropdown:

Bold & High Conversion

Modern SaaS

Clean & Minimal

Luxury Dark

High Contrast Offer

Story-Based Visual

STEP 6 — Elemen Tambahan (toggle button style)

Semua default ON:

Social Proof

Testimonial

FAQ

Bonus

Guarantee

Scarcity

Comparison

STEP 7 — Platform Target

Button selector style:

Scalev

Lynk.id

WordPress (Elementor/Divi)

Shopify

Copy HTML

⚡ TOMBOL

LEFT PANEL BOTTOM:

Reset

Generate Prompt

RIGHT PANEL:

Salin Prompt

Buat Landing Page

🔗 ACTION “BUAT LANDING PAGE”

Saat diklik:

Auto copy prompt ke clipboard

Buka https://chat.z.ai/
 di tab baru

Tampilkan toast:
“Prompt sudah disalin. Paste di chat.z.ai lalu Run.”

TIDAK ADA API CALL.
TIDAK ADA TOKEN USAGE.
HANYA REDIRECT + COPY.

📦 OUTPUT PROMPT FORMAT

Prompt harus menyusun:

Role AI

Tugas

Aturan Layout

Aturan Compliance

Profil Produk

Offer

Struktur Halaman berdasarkan Platform

Additional Sections sesuai toggle

Output requirement:

HTML single file

Tailwind CSS

Single column layout

Dark mode

Micro-copy CTA

No overclaim

BANGUN APLIKASI INI DENGAN STRUKTUR BERSIH, STATE MANAGEMENT JELAS, DAN KODE YANG TERORGANISIR.

JANGAN HILANGKAN OPSI.
JANGAN MENGURANGI KATEGORI.
JANGAN MENGUBAH URUTAN.
JANGAN MENGHAPUS STEP.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f0a27dca-a626-4b06-a01a-2d9e6c54a651).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
