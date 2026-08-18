import { GroupedOption } from '@/types/form';

export const frameworkOptions: GroupedOption[] = [
  {
    group: 'A. Conversion Focused',
    options: [
      'AIDCA',
      'PAS (Problem–Agitate–Solution)',
      'BAB (Before–After–Bridge)',
      '4P (Promise–Picture–Proof–Push)',
      'SLAP (Stop–Look–Act–Purchase)',
    ],
  },
  {
    group: 'B. Storytelling & Brand',
    options: [
      'StoryBrand',
      'ABT (And–But–Therefore)',
      "Hero's Journey",
      'HSO (Hook–Story–Offer)',
    ],
  },
  {
    group: 'C. Diagnostic & Educational',
    options: [
      'QUEST',
      'JTBD (Jobs To Be Done)',
      'Awareness Ladder',
      'FAB (Features–Advantages–Benefits)',
    ],
  },
  {
    group: 'D. Advanced / Hybrid',
    options: [
      'PASTOR',
      'Problem–Promise–Proof',
      'Useful–Urgent–Unique',
      'The 3 Reason Why',
      'Feature–Solution–Solution',
      'Solution–Impact–Problem',
      'Failed–Growth–Success',
      'Stop–Fear–Listen',
    ],
  },
];

export const gayaBahasaOptions: GroupedOption[] = [
  {
    group: 'Popular & Efektif',
    options: [
      'Friendly & Conversational',
      'Professional & Formal',
      'Witty & Humorous',
      'Bold & Disruptive',
      'Emotional & Story',
      'Empathetic',
      'Storytelling',
      'Inspirational',
      'Exciting & Energetic',
    ],
  },
  {
    group: 'Authority & Logic',
    options: [
      'Direct & To The Point',
      'Scientific / Data-Driven',
      'Trustworthy',
      'Urgent / Scarcity',
    ],
  },
  {
    group: 'Vibe Khusus',
    options: ['Luxury & Exclusive', 'Minimalist & Zen'],
  },
];

export const tipeProdukOptions: GroupedOption[] = [
  {
    group: 'A. Digital Product',
    options: [
      'Ebook / Template',
      'Mini Course / Video',
      'Toolkit / Resource Pack',
      'Membership / Komunitas',
      'Bundle / Paket',
    ],
  },
  {
    group: 'B. Service / Jasa',
    options: [
      'Agency / Freelance',
      'Konsultasi 1:1',
      'Done-For-You',
      'Audit / Review',
      'Maintenance / Retainer',
    ],
  },
  {
    group: 'C. Physical / Commerce',
    options: [
      'Skincare / Fashion',
      'Food & Beverage',
      'Kesehatan / Wellness',
      'Home & Living',
      'Gadget / Aksesoris',
      'Server Pulsa & PPOB',
    ],
  },
  {
    group: 'D. Software & Apps',
    options: ['SaaS / Software', 'App / Mobile', 'Plugin / Add-on'],
  },
  {
    group: 'E. Education',
    options: ['Kursus / Coaching', 'Bootcamp', 'Workshop'],
  },
  {
    group: 'F. Event & Social',
    options: ['Event / Webinar', 'Event Offline', 'Fundraising / Donasi'],
  },
  {
    group: 'H. Properti & High Value',
    options: [
      'Real Estate / Properti',
      'Interior Design / Renovasi',
      'Automotive',
      'Luxury Goods',
    ],
  },
  {
    group: 'G. Lainnya',
    options: ['Lainnya (Isi Manual)'],
  },
];

export const tujuanUtamaOptions: GroupedOption[] = [
  {
    group: 'A. Acquire',
    options: [
      'Lead Generation (WA/Email)',
      'Download (Lead Magnet)',
      'Registrasi (Event/WL)',
      'Newsletter Signup',
      'Quiz / Assessment Opt-in',
      'Early Access / Beta Access',
    ],
  },
  {
    group: 'B. Convert',
    options: [
      'Sales / Beli Langsung',
      'Checkout (Keranjang)',
      'Pre-Order',
      'Upsell / Downsell',
      'Affiliate Conversion',
      'Flash Sale / Limited Offer',
    ],
  },
  {
    group: 'C. Try',
    options: ['Trial / Demo', 'Sample / Preview', 'Free Consultation Entry'],
  },
  {
    group: 'D. Subscribe',
    options: [
      'Subscribe (Membership)',
      'Join Community',
      'Renewal / Upgrade Plan',
    ],
  },
  {
    group: 'E. Contact',
    options: [
      'Chat (WA/DM)',
      'Booking (Jadwal)',
      'Konsultasi (Call)',
      'Request Proposal',
    ],
  },
  {
    group: 'F. Impact',
    options: ['Donasi / Fundraising', 'Volunteer Signup'],
  },
  {
    group: 'G. Apply & Selection',
    options: ['Apply Now (Seleksi)', 'Join Waitlist'],
  },
];

export const trafficCategoryOptions: GroupedOption[] = [
  {
    group: 'Iklan Berbayar (Paid Ads)',
    options: [
      'Meta Ads (Facebook & Instagram)',
      'TikTok Ads (Impulse & Trend)',
      'Google Search & Display Ads',
      'YouTube Video Ads',
    ],
  },
  {
    group: 'Direct Action & Organik',
    options: [
      'Click to WhatsApp (CTWA Direct)',
      'Affiliate & Review Landing Page',
      'Lead Magnet / Free Webinar Funnel',
      'General / All Traffic Channels',
    ],
  },
];

export const levelAwarenessOptions: string[] = [
  'Unaware (Belum sadar)',
  'Problem Aware (Tahu masalah)',
  'Solution Aware (Cari solusi)',
  'Product Aware (Tahu produk)',
  'Most Aware (Siap beli)',
];

export const targetAudienceOptions: GroupedOption[] = [
  {
    group: 'A. Marketing & Ads',
    options: [
      'Advertiser',
      'Performance Marketer',
      'Digital Marketing Manager',
      'Content Strategist',
      'Media Buyer Agency',
    ],
  },
  {
    group: 'B. Business',
    options: [
      'Business Owner (UMKM)',
      'Founder Startup',
      'Owner Toko Offline',
      'Sales Team / Leader',
      'Franchise Owner',
    ],
  },
  {
    group: 'C. Commerce',
    options: [
      'Seller Marketplace',
      'Reseller / Dropshipper',
      'Distributor / Grosir',
      'Brand Lokal / D2C',
    ],
  },
  {
    group: 'D. Creator Economy',
    options: [
      'Content Creator / Affiliate',
      'Influencer (Nano/Micro)',
      'Coach / Mentor / Trainer',
      'Educator / Course Creator',
    ],
  },
  {
    group: 'E. B2B / Corporate',
    options: [
      'HR / People Ops',
      'Ops / Finance / Admin',
      'IT / Tech Team',
      'Procurement / Purchasing',
    ],
  },
  {
    group: 'G. Demographics Specific',
    options: [
      'Ibu Rumah Tangga / Moms',
      'Pelajar / Mahasiswa',
      'Fresh Graduate',
      'Investor / Trader',
      'Pensiunan',
    ],
  },
  {
    group: 'F. Other',
    options: [
      'Non-Profit / Organization',
      'Umum (General Audience)',
      'Lainnya (Isi Manual)',
    ],
  },
];

export const gayaDesainOptions: GroupedOption[] = [
  {
    group: 'A. Archetype Brand (Specific Look)',
    options: [
      'Apple Style (Clean & Glass)',
      'Stripe / Linear Style (Fintech)',
      'Airbnb Style (Warm & Friendly)',
      'Notion Style (Minimalist B&W)',
      'Nike / Adidas Style (Bold & Dynamic)',
      'Tesla Style (Sleek Futuristic)',
    ],
  },
  {
    group: 'B. Popular & Standard',
    options: [
      'Clean & Minimalist',
      'Modern SaaS',
      'Bold & High Conversion',
      'Elegant & Premium Luxury',
      'Trust & Authority',
      'Dark Mode Cyber',
    ],
  },
  {
    group: 'C. Trending & Aesthetic',
    options: [
      'Bento Grid / Modular',
      'Glassmorphism & Glow',
      'Neobrutalism / Pop Art',
      'Organic & Natural Earth',
    ],
  },
];

export interface ColorSwatch {
  name: string;
  hex: string;
  accent: string;
  bgDark: string;
  label: string;
  category: 'Modern' | 'Bold' | 'Luxury' | 'Vibrant' | 'Cool';
}

export const colorSwatchList: ColorSwatch[] = [
  { name: 'Modern Purple', hex: '#6c63ff', accent: '#ff4757', bgDark: '#0f0f1a', label: 'Purple Indigo', category: 'Modern' },
  { name: 'Emerald Growth', hex: '#10b981', accent: '#f59e0b', bgDark: '#061a12', label: 'Emerald Green', category: 'Modern' },
  { name: 'Cyber Blue', hex: '#0284c7', accent: '#38bdf8', bgDark: '#081426', label: 'Ocean Cyan', category: 'Cool' },
  { name: 'Electric Navy', hex: '#3b82f6', accent: '#fbbf24', bgDark: '#0b1329', label: 'Royal Navy', category: 'Cool' },
  { name: 'Fire Orange', hex: '#ea580c', accent: '#e11d48', bgDark: '#1c0e07', label: 'Flame Orange', category: 'Bold' },
  { name: 'Ruby Crimson', hex: '#e11d48', accent: '#fda4af', bgDark: '#1a080d', label: 'Ruby Red', category: 'Bold' },
  { name: 'Golden Luxury', hex: '#d97706', accent: '#fbbf24', bgDark: '#171105', label: 'Gold Elegance', category: 'Luxury' },
  { name: 'Rose Beauty', hex: '#ec4899', accent: '#f43f5e', bgDark: '#1a0714', label: 'Pink Magenta', category: 'Vibrant' },
  { name: 'Dark Monolith', hex: '#18181b', accent: '#6366f1', bgDark: '#09090b', label: 'Midnight Black', category: 'Luxury' },
];

export interface VisualTheme {
  id: string;
  title: string;
  desc: string;
  bgClass: string;
  borderClass: string;
  accentColor: string;
}

export const visualThemes: VisualTheme[] = [
  { id: 'Dark Mode Clean', title: '🌙 Dark Mode Clean', desc: 'Latar gelap elegan, kontras tinggi & fokus pada CTA', bgClass: 'bg-slate-950 text-slate-100', borderClass: 'border-slate-800', accentColor: '#6c63ff' },
  { id: 'Light Modern', title: '☀️ Light Modern', desc: 'Bersih, profesional, nyaman dibaca untuk corporate/B2B', bgClass: 'bg-white text-slate-900', borderClass: 'border-slate-200', accentColor: '#0284c7' },
  { id: 'Glassmorphism Apple', title: '✨ Glassmorphism Apple', desc: 'Efek liquid glass transparan bergradasi premium', bgClass: 'bg-gradient-to-br from-slate-900 to-indigo-950 text-white', borderClass: 'border-indigo-500/30', accentColor: '#818cf8' },
  { id: 'Bold Vibrant', title: '🔥 Bold & High Energy', desc: 'Warna berani untuk flash sale & impulsif buyers', bgClass: 'bg-neutral-950 text-white', borderClass: 'border-amber-500/40', accentColor: '#ea580c' },
];

export const fontPresets = [
  { name: 'Plus Jakarta Sans', category: 'Modern Geometric Sans (Sangat direkomendasikan untuk Indonesia)' },
  { name: 'Inter', category: 'Clean Tech & Neutral Standard' },
  { name: 'Outfit', category: 'Contemporary & Trendy Tech' },
  { name: 'Playfair Display', category: 'Luxury & Elegant Editorial Serif' },
  { name: 'Montserrat', category: 'Bold Display & High Impact' },
  { name: 'Poppins', category: 'Friendly & Rounded Sans' },
];

export const animationOptions = [
  { id: 'fade-in', label: 'Fade In Smooth (Halus & Elegan)' },
  { id: 'slide-up', label: 'Slide Up Entrance (Modern & Dinamis)' },
  { id: 'zoom-in', label: 'Zoom In Soft (Menarik Perhatian)' },
  { id: 'pulse', label: 'Subtle Pulse on CTA (Tinggi Konversi)' },
  { id: 'none', label: 'Tanpa Animasi (Statik Ringan)' },
];

export const elemenTambahanOptions: string[] = [
  'Hero Section',
  'Before-After',
  'Feature List',
  'How It Works',
  'Social Proof',
  'Testimonial',
  'Video Section',
  'Bonus Section',
  'Pricing Table',
  'Scarcity / Timer',
  'Guarantee',
  'FAQ',
];

export const platformTargetOptions: string[] = [
  'OrderHero',
  'WinMe',
  'Scalev',
  'Berdu',
  'OrderOnline',
  'LandingPress',
  'WordPress',
  'Lynk.id',
  'Mayar',
  'Shopify',
  'Standalone',
];
