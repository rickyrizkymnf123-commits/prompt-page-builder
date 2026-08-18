# Conversation Log

## Session: 2026-08-18

- **User Request**: Mengatasi error 404 NOT_FOUND di Vercel saat halaman di-refresh.
  - **Penyebab**: Aplikasi React (Single Page Application / SPA) membutuhkan konfigurasi server rewrite agar rute client-side (seperti `/login`, `/app`, `/admin`, `/demo/:id`) selalu diteruskan ke `/index.html` saat browser di-refresh.
  - **Solusi**:
    - Menambahkan file `vercel.json` dengan konfigurasi `rewrites` untuk semua rute client-side SPA.
    - Menjaga akses file statis seperti `landing.html`, `favicon.ico`, dan `assets/`.
    - Melakukan commit, push ke GitHub, dan deploy ulang ke Vercel production.
  - **Hasil**: Halaman `/login`, `/admin`, `/app`, dan rute lainnya kini dapat di-refresh dan diakses langsung tanpa error 404.
