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
  linkReferensi: string;
  inspirasiDesain: string;
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
  linkReferensi: '',
  inspirasiDesain: '',
};

export interface GroupedOption {
  group: string;
  options: string[];
}
