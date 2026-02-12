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
    'Social Proof': true,
    'Testimonial': true,
    'FAQ': true,
    'Bonus': true,
    'Guarantee': true,
    'Scarcity': true,
    'Comparison': true,
  },
  platformTarget: '',
};

export interface GroupedOption {
  group: string;
  options: string[];
}
