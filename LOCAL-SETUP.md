# Local Development Setup

Panduan menjalankan project ini di environment lokal/dev.

## Prasyarat

- **Node.js** ≥ 18 (rekomendasi 20+) — install via [nvm](https://github.com/nvm-sh/nvm)
- **npm** (sudah include) atau **bun** (opsional, lebih cepat)
- **Git**
- (Opsional) **Supabase CLI** — hanya jika ingin menjalankan/deploy edge functions lokal:
  `npm install -g supabase`

## 1. Install dependencies

```bash
npm install
# atau
bun install
```

## 2. Setup environment variables

Copy template dan isi nilainya:

```bash
cp .env.example .env
```

Untuk **frontend** (`npm run dev`), cukup isi 3 variabel ini:

```env
VITE_SUPABASE_PROJECT_ID="..."
VITE_SUPABASE_URL="https://xxxx.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOi..."
```

Nilai-nilai bisa diambil dari:
- Lovable: tab **Cloud → Settings**
- Supabase Dashboard: **Project Settings → API**

Variabel lain di `.env.example` (PROVISION_SECRET, WAHA_*, ROUTE_*, dll) hanya dibutuhkan untuk **edge functions**. Set via Supabase dashboard atau:

```bash
supabase secrets set PROVISION_SECRET=xxx WAHA_API_KEY=xxx ...
```

## 3. Jalankan dev server

```bash
npm run dev
```

App jalan di `http://localhost:8080`.

## 4. Scripts lain

```bash
npm run build         # production build
npm run build:dev     # dev-mode build
npm run preview       # preview hasil build
npm run lint          # eslint
npx vitest run        # run tests
```

## 5. Edge Functions (opsional)

Edge functions ada di `supabase/functions/`:
- `provision/` — webhook handler untuk provisioning user
- `gateway-provision/` — router multi-product webhook
- `admin-users/` — admin API
- `payment-reminder/` — reminder pembayaran via WhatsApp

Untuk run lokal:

```bash
supabase login
supabase link --project-ref <YOUR_PROJECT_REF>
supabase functions serve
```

Untuk deploy:

```bash
supabase functions deploy provision
supabase functions deploy gateway-provision
# dst.
```

## 6. Database / Migrations

Schema database dikelola via Supabase. Migration files (jika ada) ada di `supabase/migrations/`. Apply dengan:

```bash
supabase db push
```

## Struktur project

```
.
├── src/                    # React app source
│   ├── components/         # UI components (admin, demos, editor, steps, ui, user)
│   ├── pages/              # Route pages (Index, Login, Admin, AppPage, DemoPage)
│   ├── integrations/       # Supabase client + types (auto-generated, jangan edit)
│   ├── data/               # Static data (themePresets, formOptions, sampleTemplates)
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilities
│   └── utils/              # Helpers (generatePrompt, dll)
├── public/                 # Static assets + landing.html + lp-styles/
├── supabase/
│   ├── functions/          # Edge functions (Deno)
│   └── config.toml         # Supabase project config
├── index.html              # Vite entry
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig*.json
├── postcss.config.js
├── eslint.config.js
├── components.json         # shadcn-ui config
└── package.json
```

## Catatan

- File `src/integrations/supabase/client.ts` dan `src/integrations/supabase/types.ts` **auto-generated** oleh Lovable/Supabase — jangan edit manual.
- Jika perlu regen types Supabase: `supabase gen types typescript --project-id <ref> > src/integrations/supabase/types.ts`
- Tech stack: **Vite 5 + React 18 + TypeScript 5 + Tailwind v3 + shadcn-ui**.
