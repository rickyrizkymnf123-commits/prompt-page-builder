export interface SalesNotifConfig {
  enabled: boolean;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  namaPembeli: string;
  pesanNotif: string;
  namaProdukNotif: string;
  interval: number;   // detik antar notif
  durasi: number;     // detik notif tampil
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

export interface FormState {
  framework: string;
  gayaBahasa: string;
  tipeProduk: string;
  tujuanUtama: string;
  levelAwareness: string;
  targetAudience: string;
  namaProduk: string;
  hargaNormal: string;
  hargaPromo: string;
  deskripsiBenefit: string;
  ctaUtama: string;
  gayaDesain: string;
  elemenTambahan: Record<string, boolean>;
  platformTarget: string;
  deviceTarget: string;
  linkReferensi: string;
  inspirasiDesain: string;
  salesNotif: SalesNotifConfig;
  countdown: CountdownConfig;
}

export const initialFormState: FormState = {
  framework: '',
  gayaBahasa: '',
  tipeProduk: '',
  tujuanUtama: '',
  levelAwareness: '',
  targetAudience: '',
  namaProduk: '',
  hargaNormal: '',
  hargaPromo: '',
  deskripsiBenefit: '',
  ctaUtama: '',
  gayaDesain: '',
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
  platformTarget: '',
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
};

export interface GroupedOption {
  group: string;
  options: string[];
}
