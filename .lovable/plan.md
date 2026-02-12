

# Landing Page Engine — Implementation Plan

## Overview
A **Prompt Generator SaaS tool** with a dark purple premium theme. Users fill out a 7-step form, click "Generate Prompt," and the output appears in a sticky right panel. They can then copy the prompt and open chat.z.ai in a new tab. **No backend needed** — purely client-side.

---

## Theme & Design
- **Dark navy-purple** background with slightly lighter card surfaces
- **Purple → magenta gradient** accents (buttons, highlights, selected states)
- **Orange accent** for step numbers and CTA buttons (matching reference screenshots)
- White primary text, light gray secondary text, dark purple subtle borders
- Dark/light mode toggle in header

---

## Layout
- **Header**: Logo "Landing Page **Engine**" on left, dark/light toggle + logout icon on right
- **Body**: 2-column grid
  - **Left column** — Scrollable form with 7 step cards
  - **Right column** — Sticky "AI Prompt Output" panel with action buttons

---

## State Logic
1. **Initial state**: Prompt panel shows placeholder text, "Salin Prompt" and "Buat Landing Page" buttons are disabled
2. **After "Generate Prompt"**: Prompt text appears, both buttons become active
3. **Dirty state**: If any field changes after generating, button changes to "Generate Ulang" — prompt stays unchanged until re-clicked

---

## Form Sections (7 Steps)

### Step 1 — Framework & Tone
- **Pilih Framework** dropdown with grouped categories (Conversion Focused, Storytelling & Brand, Diagnostic & Educational, Advanced/Hybrid) — all options as specified
- **Gaya Bahasa** dropdown with grouped categories (Popular & Efektif, Authority & Logic, Vibe Khusus) — all options as specified

### Step 2 — Produk & Tujuan
- **Tipe Produk** dropdown with grouped categories (Digital Product, Service/Jasa, Physical/Commerce, Software, Education, Event & Social, Properti & High Value, Lainnya) — all options as specified
- **Tujuan Utama** dropdown with grouped categories (Acquire, Convert, Try, Subscribe, Contact, Impact, Apply & Selection) — all options as specified

### Step 3 — Target Market
- **Level Awareness** dropdown — 5 levels as specified
- **Target Audience** dropdown with grouped categories (Marketing & Ads, Business, Commerce, Creator Economy, B2B/Corporate, Demographics Specific, Other) — all options as specified

### Step 4 — Detail Produk & Copy
- **Nama Produk** — text input (required)
- **Harga Normal** — number input
- **Harga Promo** — number input
- **Deskripsi & Benefit** — textarea
- **CTA Utama** — text input

### Step 5 — Gaya Desain
- Dropdown with 6 options: Bold & High Conversion, Modern SaaS, Clean & Minimal, Luxury Dark, High Contrast Offer, Story-Based Visual

### Step 6 — Elemen Tambahan
- Toggle button style chips (all default ON): Social Proof, Testimonial, FAQ, Bonus, Guarantee, Scarcity, Comparison

### Step 7 — Platform Target
- Button selector style (single select): Scalev, Lynk.id, WordPress (Elementor/Divi), Shopify, Copy HTML

---

## Action Buttons
- **Left panel bottom**: "Reset" (outline) + "Generate Prompt ⚡" (gradient orange)
- **Right panel**: "Salin Prompt" (top right of panel) + "Buat Landing Page" (full-width orange bottom)

---

## "Buat Landing Page" Action
1. Auto-copy prompt to clipboard
2. Open https://chat.z.ai/ in new tab
3. Show toast: "Prompt sudah disalin. Paste di chat.z.ai lalu Run."

---

## Generated Prompt Format
The prompt output will be a structured AI instruction covering: Role AI, Task, Layout Rules, Compliance Rules, Product Profile, Offer, Page Structure (based on selected platform), Additional Sections (based on toggles), and output requirements (single HTML file, Tailwind CSS, single column, dark mode, micro-copy CTA, no overclaim).

---

## Technical Approach
- Single-page React app, no backend/database needed
- Clean component architecture with separate files for each step section, the prompt output panel, and prompt generation logic
- All form options stored as structured data constants
- State managed via React useState with a clear form state object and dirty tracking

