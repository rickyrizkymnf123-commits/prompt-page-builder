export interface SalesNotifConfig {
  enabled: boolean;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  namaPembeli: string;
  pesanNotif: string;
  namaProdukNotif: string;
  interval: number;
  durasi: number;
  ukuran: 'small' | 'medium' | 'large';
  emoji: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export interface CountdownConfig {
  enabled: boolean;
  hari: number;
  jam: number;
  menit: number;
  detik: number;
  labelAtas: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
}

export interface ScarcitySeatConfig {
  enabled: boolean;
  label: string;
  totalSeat: number;
  sisaSeat: number;
  autoDecrease: boolean;
}

export interface BonusItem {
  nama: string;
  hargaAsli: string;
}

export interface PricingLayersConfig {
  noPriceMode: boolean; // Mode tanpa harga untuk Lead Gen, Free Download, Pendaftaran Agen
  layerNormal: boolean;
  layerPromo: boolean;
  layerFinal: boolean;
}

export interface TierItem {
  name: string; // e.g. "Batch 1 - Early Bird", "Batch 2 - Reguler", "Batch 3 - Last Call"
  price: string;
  originalPrice?: string;
  quota?: string;
  badge?: string;
}

export interface TieredPricingConfig {
  enabled: boolean;
  tiers: TierItem[];
}

export interface CtaModeConfig {
  type: 'button' | 'whatsapp' | 'microsite' | 'lead_form';
  buttonText: string;
  waNumber: string;
  waMessage: string;
  micrositeUrl: string;
  leadFormFields: {
    name: boolean;
    wa: boolean;
    email: boolean;
    note: boolean;
    packageSelect: boolean;
    buttonText: string;
  };
}

export interface MediaConfig {
  fotoProdukUrls: string[];
  videoHeroUrl: string;
  coverHeroUrl: string;
}

export interface DesignTypographyConfig {
  fontFamily: string;
  buttonSize: 'normal' | 'large' | 'full';
  entranceAnimation: 'none' | 'fade-in' | 'slide-up' | 'zoom-in' | 'pulse';
}

export interface MetaCapiConfig {
  enabled: boolean;
  pixelId: string;
  capiToken: string;
  eventName: string;
}

export interface FormState {
  framework: string;
  gayaBahasa: string;
  tipeProduk: string;
  tujuanUtama: string;
  trafficCategory: string; // Meta Ads, Google Ads, TikTok Ads, CTWA, Affiliate, General
  levelAwareness: string;
  targetAudience: string;
  namaProduk: string;
  hargaNormal: string;
  hargaPromo: string;
  hargaFinal: string;
  keteranganDiskon: string;
  pricingLayers: 4;
  pricingLayersConfig: PricingLayersConfig;
  tieredPricing: TieredPricingConfig;
  bonusList: BonusItem[];
  deskripsiBenefit: string;
  ctaUtama: string;
  ctaMode: CtaModeConfig;
  media: MediaConfig;
  typography: DesignTypographyConfig;
  metaCapi: MetaCapiConfig;
  warnaBrand: string;
  warnaBrandCustom?: string;
  tema: string;
  gayaDesain: string;
  elemenTambahan: Record<string, boolean>;
  sectionOrder: string[];
  platformTarget: string;
  deviceTarget: string;
  linkReferensi: string;
  inspirasiDesain: string;
  salesNotif: SalesNotifConfig;
  countdown: CountdownConfig;
  scarcitySeat: ScarcitySeatConfig;
  language: 'id' | 'en';
}

export const initialSectionOrder = [
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

export const initialFormState: FormState = {
  framework: '',
  gayaBahasa: '',
  tipeProduk: '',
  tujuanUtama: '',
  trafficCategory: 'General / All Channels',
  levelAwareness: '',
  targetAudience: '',
  namaProduk: '',
  hargaNormal: '',
  hargaPromo: '',
  hargaFinal: '',
  keteranganDiskon: '',
  pricingLayers: 4,
  pricingLayersConfig: {
    noPriceMode: false,
    layerNormal: true,
    layerPromo: true,
    layerFinal: true,
  },
  tieredPricing: {
    enabled: false,
    tiers: [
      { name: 'Batch 1 (Early Bird)', price: '99000', originalPrice: '299000', quota: 'Sisa 5 Slot', badge: '🔥 Termurah' },
      { name: 'Batch 2 (Reguler)', price: '149000', originalPrice: '299000', quota: 'Kuota 50 Slot', badge: 'Populer' },
      { name: 'Batch 3 (Normal / H-1)', price: '249000', originalPrice: '299000', quota: 'Harga Naik', badge: 'Terakhir' },
    ],
  },
  bonusList: [],
  deskripsiBenefit: '',
  ctaUtama: '',
  ctaMode: {
    type: 'button',
    buttonText: 'Beli Sekarang',
    waNumber: '6281234567890',
    waMessage: 'Halo admin, saya ingin memesan [Nama Produk] sekarang. Apakah masih ada promo?',
    micrositeUrl: '',
    leadFormFields: {
      name: true,
      wa: true,
      email: true,
      note: false,
      packageSelect: true,
      buttonText: 'Kirim & Dapatkan Akses',
    },
  },
  media: {
    fotoProdukUrls: [],
    videoHeroUrl: '',
    coverHeroUrl: '',
  },
  typography: {
    fontFamily: 'Plus Jakarta Sans',
    buttonSize: 'large',
    entranceAnimation: 'fade-in',
  },
  metaCapi: {
    enabled: false,
    pixelId: '',
    capiToken: '',
    eventName: 'Lead',
  },
  warnaBrand: 'Modern Purple',
  warnaBrandCustom: '#6c63ff',
  tema: 'Dark Mode Clean',
  gayaDesain: 'Clean Minimalist',
  elemenTambahan: {
    'Hero Section': true,
    'Social Proof': true,
    'Testimonial': true,
    'FAQ': true,
    'Bonus Section': true,
    'Guarantee': true,
    'Scarcity / Timer': true,
    'Pricing Table': true,
    'Feature List': false,
    'Video Section': true,
    'Before-After': true,
    'How It Works': true,
  },
  sectionOrder: [...initialSectionOrder],
  platformTarget: 'Scalev',
  deviceTarget: 'Mobile',
  linkReferensi: '',
  inspirasiDesain: '',
  salesNotif: {
    enabled: false,
    position: 'bottom-left',
    namaPembeli: 'Seseorang dari Jakarta',
    pesanNotif: 'baru saja membeli',
    namaProdukNotif: '',
    interval: 8,
    durasi: 5,
    ukuran: 'medium',
    emoji: '🔥',
    bgColor: '#ffffff',
    borderColor: '#6c63ff',
    textColor: '#1a1a2e',
  },
  countdown: {
    enabled: true,
    hari: 2,
    jam: 0,
    menit: 0,
    detik: 0,
    labelAtas: '⏰ PROMO BERAKHIR DALAM',
    bgColor: '#1a1a2e',
    textColor: '#ffffff',
    accentColor: '#ff4757',
  },
  scarcitySeat: {
    enabled: false,
    label: '⚠️ SISA SLOT TERBATAS!',
    totalSeat: 50,
    sisaSeat: 7,
    autoDecrease: true,
  },
  language: 'id',
};

export interface SavedProject {
  id: string;
  user_id: string;
  project_name: string;
  form_data: FormState;
  created_at: string;
  updated_at: string;
}

export interface CustomUserTemplate {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  html_content: string;
  form_data?: FormState;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GroupedOption {
  group: string;
  options: string[];
}
