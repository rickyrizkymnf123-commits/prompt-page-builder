# 🚀 Template Setup SaaS — Copy-Paste ke Project Lovable Baru

## Cara Pakai
1. Buka project Lovable baru
2. Copy-paste **Prompt 1** ke chat → tunggu selesai → approve migration
3. Copy-paste **Prompt 2** ke chat → tunggu selesai
4. Copy-paste **Prompt 3** ke chat → tunggu selesai
5. Tambahkan secrets: `PROVISION_SECRET`, `WAHA_API_URL`, `WAHA_API_KEY`, `WAHA_SESSION_NAME`
6. Catat URL endpoint provision untuk gateway router

> **PENTING:** Ganti semua `[PRODUCT_CODE]`, `[NAMA_PRODUK]`, `[APP_DOMAIN]` sesuai project kamu.

---

## Prompt 1 — Database & Auth Setup

```
Saya mau setup sistem SaaS dengan database dan auth. Buatkan:

1. Enum `app_role` dengan nilai 'admin' dan 'user'

2. Tabel `profiles`:
   - id (uuid, primary key, default gen_random_uuid())
   - user_id (uuid, not null, unique)
   - name (text, nullable)
   - phone (text, nullable)
   - created_at (timestamptz, default now())
   - updated_at (timestamptz, default now())
   - RLS: user bisa lihat & update profile sendiri, admin bisa lihat & hapus semua

3. Tabel `user_roles`:
   - id (uuid, primary key, default gen_random_uuid())
   - user_id (uuid, not null)
   - role (app_role, not null)
   - created_at (timestamptz, default now())
   - Unique constraint: (user_id, role)
   - RLS: admin bisa manage semua roles

4. Tabel `entitlements`:
   - id (uuid, primary key, default gen_random_uuid())
   - user_id (uuid, not null)
   - product_code (text, not null, default '[PRODUCT_CODE]')
   - status (text, not null, default 'active')
   - order_id (text, not null)
   - created_at (timestamptz, default now())
   - RLS: user bisa lihat entitlement sendiri, admin bisa lihat/update/hapus semua

5. Tabel `provision_logs`:
   - id (uuid, primary key, default gen_random_uuid())
   - order_id (text, nullable)
   - email (text, nullable)
   - status (text, not null)
   - message (text, nullable)
   - created_at (timestamptz, default now())
   - RLS: hanya admin bisa lihat, tidak ada insert/update/delete via client

6. Function `has_role(uuid, app_role)` → boolean (SECURITY DEFINER)
7. Function `has_active_entitlement(uuid, text)` → boolean (SECURITY DEFINER)
8. Function `handle_new_user()` trigger → auto-create profile saat user baru
9. Function `update_updated_at_column()` trigger → auto-update updated_at

Semua RLS policies harus RESTRICTIVE (bukan PERMISSIVE).
Gunakan `has_role(auth.uid(), 'admin')` untuk cek admin di RLS.
```

---

## Prompt 2 — Edge Functions

```
Buatkan 2 edge function:

### Edge Function 1: `provision`
Webhook endpoint untuk auto-provisioning dari Scalev. Fitur:

- CORS headers (allow semua origin)
- Handle GET request → return { ok: true } (health check)
- Handle empty POST body → return { ok: true } (ping dari Scalev)
- Handle `business.test_event` → return { ok: true }
- Verifikasi HMAC-SHA256 via header `x-scalev-hmac-sha256` menggunakan Web Crypto API
  - Juga support fallback via query param `?secret=`
  - Secret dari env `PROVISION_SECRET`
  - Signature = base64 encode dari HMAC-SHA256(rawBody, secret)
- Parse payload Scalev:
  - `body.data.customer.email` atau `body.data.destination_address.email` → email
  - `body.data.customer.name` atau `body.data.destination_address.name` → name
  - `body.data.customer.phone` atau `body.data.destination_address.phone` → phone
  - `body.data.order_id` → order_id
  - `body.data.payment_status` → harus "paid", kalau bukan skip
  - product_code default: `[PRODUCT_CODE]`
- Cek duplikat berdasarkan order_id di tabel entitlements
- Jika user sudah ada (by email) → update password, pakai userId yang ada
- Jika user baru → createUser dengan email_confirm: true, password random
- Buat entitlement dengan status 'active'
- Log semua ke provision_logs (success, failed, skipped, duplicate)
- Kirim notifikasi WhatsApp via WAHA:
  - Format phone: hapus non-angka, ganti awalan 0 jadi 62, tambah @c.us
  - POST ke `{WAHA_API_URL}/api/sendText` dengan header `X-Api-Key: {WAHA_API_KEY}`
  - Body: { session: WAHA_SESSION_NAME, chatId, text: message }
  - Template pesan: email, password, link login ke [APP_DOMAIN]/login
- Set `verify_jwt = false` di config.toml untuk function ini

### Edge Function 2: `admin-users`
Admin management endpoint. Fitur:

- Verifikasi caller adalah admin via Authorization header → cek user_roles
- Action `list`: listUsers dari auth.admin, join dengan profiles, entitlements, user_roles. Return array dengan id, email, name, phone, status, entitlement_id, product_code, order_id, role, created_at, last_sign_in
- Action `delete`: hapus entitlements, profiles, user_roles, lalu deleteUser
- Action `approve`: update entitlement status ke 'active' by entitlement id
- Action `reject`: update entitlement status ke 'rejected' by entitlement id
- Action `reset_password`: updateUserById dengan password baru (dikirim dari client)
- Semua action dikirim via POST body { action, user_id, password? }
- Setup admin awal: jika tidak ada auth header, cek body.setup_secret === PROVISION_SECRET, lalu createUser admin + insert user_roles + entitlement

Kedua function menggunakan `createClient` dari `https://esm.sh/@supabase/supabase-js@2`.
```

---

## Prompt 3 — Halaman UI

```
Buatkan halaman-halaman berikut:

### 1. `/login` — Halaman Login
- Hanya login, TIDAK ADA menu daftar/register
- Form: email + password
- Setelah login:
  - Cek user_roles → jika admin, redirect ke /admin
  - Cek entitlements → jika ada product_code '[PRODUCT_CODE]' dengan status 'active', redirect ke /app
  - Jika tidak ada entitlement aktif, tampilkan error "Akses belum aktif" dan sign out
- Styling: dark mode, card centered, branding "[NAMA_PRODUK]"

### 2. `/admin` — Admin Panel
Tab-based layout dengan 3 tab:

**Tab Tools:**
- Hero section dengan branding [NAMA_PRODUK]
- [SESUAIKAN DENGAN FITUR UTAMA PROJECT]

**Tab Manajemen User:**
- Stats cards: Total User, Pending, Aktif, Ditolak (klik untuk filter)
- Search bar + refresh button
- Filter buttons: Semua, Pending, Active, Rejected
- Table: Nama, Email, Status (badge warna), Role, Terdaftar, Login Terakhir, Aksi
- Aksi: Approve/Reject (untuk pending), Reset Password (dialog), Delete
- Panggil edge function `admin-users` via `supabase.functions.invoke`

**Tab Provision Logs:**
- Table: Order ID, Email, Status, Message, Tanggal
- Data dari tabel provision_logs, order by created_at desc

Header: logo + nama app, toggle dark mode, tombol logout

### 3. `/app` — Halaman User
- Cek session + entitlement active untuk '[PRODUCT_CODE]'
- Jika tidak valid → sign out + redirect ke /login
- [SESUAIKAN DENGAN FITUR UTAMA PROJECT]
- Header dengan branding, toggle dark mode, tombol logout

### 4. `/` — Index (redirect)
- Cek session:
  - Ada session + admin → redirect /admin
  - Ada session + user biasa → redirect /app
  - Tidak ada session → redirect /login

### Routing di App.tsx:
- `/` → Index
- `/login` → Login
- `/app` → AppPage
- `/admin` → Admin
- `*` → NotFound
```

---

## Setelah Selesai

1. **Tambah secrets** di project:
   - `PROVISION_SECRET` = Signing Secret dari Scalev (sama untuk semua project)
   - `WAHA_API_URL` = URL server WAHA kamu
   - `WAHA_API_KEY` = API key WAHA kamu
   - `WAHA_SESSION_NAME` = nama session WAHA

2. **Buat admin pertama** — panggil edge function admin-users:
   ```
   POST /functions/v1/admin-users
   Body: {
     "setup_secret": "[PROVISION_SECRET]",
     "email": "admin@example.com",
     "password": "password123",
     "name": "Admin"
   }
   ```

3. **Catat endpoint** untuk gateway router:
   ```
   https://[PROJECT_ID].supabase.co/functions/v1/provision
   ```

4. **Kembali ke project hub** (Prompt Page Builder) untuk setup gateway router

---

## Daftar Project & Product Code

| No | Project | Product Code | Endpoint URL |
|----|---------|-------------|-------------|
| 1 | Prompt Page Builder (Hub) | LPE | https://npgglrvvdlhagztsxsjc.supabase.co/functions/v1/provision |
| 2 | Story Weaver AI | SWA | [catat setelah setup] |
| 3 | Property Enhancer AI | PEA | [catat setelah setup] |
| 4 | Digital Strategy Toolkit | DST | [catat setelah setup] |
| 5 | Meta Ads Accelerator | MAA | [catat setelah setup] |
| 6 | Profit Navigator | PNA | [catat setelah setup] |
