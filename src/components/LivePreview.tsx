import { useMemo } from 'react';
import { FormState } from '@/types/form';

interface Props {
  form: FormState;
}

// Map brand color names to hex
const colorMap: Record<string, string> = {
  'Red / Merah': '#e74c3c', 'Orange / Oranye': '#f39c12', 'Yellow / Kuning': '#f1c40f',
  'Coral': '#ff6b6b', 'Gold / Emas': '#d4a017', 'Crimson': '#dc143c',
  'Blue / Biru': '#3498db', 'Royal Blue': '#4169e1', 'Navy': '#1a1a5e',
  'Teal': '#008080', 'Cyan': '#00bcd4', 'Emerald / Hijau': '#2ecc71',
  'Black / Hitam': '#1a1a2e', 'White / Putih': '#f8f9fa', 'Grey / Abu-abu': '#95a5a6',
  'Charcoal': '#36454f', 'Violet / Purple': '#8e44ad', 'Pink / Magenta': '#e91e9e',
  'Lime / Hijau Muda': '#a8e06c', 'Turquoise': '#1abc9c',
};

const themeMap: Record<string, { bg: string; text: string; card: string }> = {
  'Dark': { bg: '#0f0f1a', text: '#f0f0f0', card: '#1a1a2e' },
  'Light': { bg: '#ffffff', text: '#1a1a2e', card: '#f8f9fa' },
  'Default': { bg: '#f4f4f8', text: '#1a1a2e', card: '#ffffff' },
  'Colorful': { bg: '#1a1a2e', text: '#ffffff', card: '#2a2a4e' },
  'Pastel': { bg: '#fef9f3', text: '#3a3a5a', card: '#fff5ee' },
};

// ── Framework visual configs ──
interface FrameworkVisual {
  label: string;
  steps: { name: string; icon: string; preview: string }[];
}

const frameworkVisuals: Record<string, FrameworkVisual> = {
  'AIDCA': {
    label: 'AIDCA',
    steps: [
      { name: 'Attention', icon: '⚡', preview: 'Headline bold yang menarik perhatian & menghentikan scroll' },
      { name: 'Interest', icon: '🔍', preview: 'Fakta menarik & data yang memicu rasa ingin tahu' },
      { name: 'Desire', icon: '🔥', preview: 'Benefit emosional & visualisasi hasil impian' },
      { name: 'Conviction', icon: '🛡️', preview: 'Testimoni, bukti sosial & garansi kepercayaan' },
      { name: 'Action', icon: '🎯', preview: 'CTA jelas dengan urgensi & penawaran terbatas' },
    ],
  },
  'PAS (Problem–Agitate–Solution)': {
    label: 'PAS',
    steps: [
      { name: 'Problem', icon: '😰', preview: 'Ungkap masalah utama yang dirasakan target market' },
      { name: 'Agitate', icon: '💥', preview: 'Perbesar rasa sakit — apa dampaknya jika dibiarkan?' },
      { name: 'Solution', icon: '✅', preview: 'Tawarkan produk sebagai solusi sempurna + CTA' },
    ],
  },
  'BAB (Before–After–Bridge)': {
    label: 'BAB',
    steps: [
      { name: 'Before', icon: '😩', preview: 'Gambaran kondisi sebelum — frustasi & struggle' },
      { name: 'After', icon: '🌟', preview: 'Visualisasi kehidupan ideal setelah transformasi' },
      { name: 'Bridge', icon: '🌉', preview: 'Produk kamu adalah jembatan menuju kondisi ideal' },
    ],
  },
  '4P (Promise–Picture–Proof–Push)': {
    label: '4P',
    steps: [
      { name: 'Promise', icon: '🎯', preview: 'Janji utama — apa yang akan didapat customer?' },
      { name: 'Picture', icon: '🖼️', preview: 'Lukiskan gambar vivid tentang hasil yang dicapai' },
      { name: 'Proof', icon: '📊', preview: 'Bukti nyata: testimoni, angka, studi kasus' },
      { name: 'Push', icon: '🚀', preview: 'Dorong aksi sekarang — urgensi & scarcity' },
    ],
  },
  'SLAP (Stop–Look–Act–Purchase)': {
    label: 'SLAP',
    steps: [
      { name: 'Stop', icon: '🛑', preview: 'Pattern interrupt — hentikan scroll dengan hook kuat' },
      { name: 'Look', icon: '👀', preview: 'Tarik perhatian dengan visual & headline menarik' },
      { name: 'Act', icon: '⚡', preview: 'Ajak berinteraksi — klik, scroll, atau explore' },
      { name: 'Purchase', icon: '💳', preview: 'Tutup dengan penawaran & tombol beli' },
    ],
  },
  'StoryBrand': {
    label: 'StoryBrand',
    steps: [
      { name: 'Character', icon: '👤', preview: 'Customer sebagai tokoh utama cerita' },
      { name: 'Problem', icon: '😤', preview: 'Masalah yang dihadapi sang tokoh' },
      { name: 'Guide', icon: '🧙', preview: 'Brand kamu hadir sebagai pemandu ahli' },
      { name: 'Plan', icon: '📋', preview: 'Rencana jelas & mudah (3 langkah)' },
      { name: 'Action', icon: '🎯', preview: 'Call to action yang tegas & jelas' },
      { name: 'Success', icon: '🏆', preview: 'Gambaran sukses & hindari kegagalan' },
    ],
  },
  'ABT (And–But–Therefore)': {
    label: 'ABT',
    steps: [
      { name: 'And', icon: '📖', preview: 'Setup cerita — konteks & situasi awal yang relatable' },
      { name: 'But', icon: '⚠️', preview: 'Konflik muncul — masalah yang menghalangi' },
      { name: 'Therefore', icon: '💡', preview: 'Maka solusinya adalah produk kamu + CTA' },
    ],
  },
  "Hero's Journey": {
    label: "Hero's Journey",
    steps: [
      { name: 'Ordinary', icon: '🏠', preview: 'Kehidupan biasa sebelum menemukan solusi' },
      { name: 'Call', icon: '📢', preview: 'Panggilan untuk berubah — ada peluang baru' },
      { name: 'Challenge', icon: '⚔️', preview: 'Tantangan & keraguan yang harus dihadapi' },
      { name: 'Transform', icon: '🦋', preview: 'Transformasi berkat produk/layanan kamu' },
      { name: 'Return', icon: '👑', preview: 'Kembali sebagai versi terbaik diri sendiri' },
    ],
  },
  'HSO (Hook–Story–Offer)': {
    label: 'HSO',
    steps: [
      { name: 'Hook', icon: '🪝', preview: 'Hook kuat di opening — pertanyaan atau fakta shocking' },
      { name: 'Story', icon: '📖', preview: 'Ceritakan kisah relatable yang menyentuh emosi' },
      { name: 'Offer', icon: '🎁', preview: 'Tawarkan solusi + bonus + CTA jelas' },
    ],
  },
  'QUEST': {
    label: 'QUEST',
    steps: [
      { name: 'Qualify', icon: '🎯', preview: 'Filter: "Apakah kamu..." — targetkan audience tepat' },
      { name: 'Understand', icon: '🤝', preview: 'Tunjukkan empati & pemahaman masalah mereka' },
      { name: 'Educate', icon: '📚', preview: 'Edukasi tentang solusi & cara kerjanya' },
      { name: 'Stimulate', icon: '🔥', preview: 'Bangkitkan keinginan dengan benefit & bukti' },
      { name: 'Transition', icon: '➡️', preview: 'Arahkan ke aksi — CTA & langkah selanjutnya' },
    ],
  },
  'JTBD (Jobs To Be Done)': {
    label: 'JTBD',
    steps: [
      { name: 'Situation', icon: '📍', preview: 'Ketika saya berada di situasi ini...' },
      { name: 'Motivation', icon: '💪', preview: 'Saya ingin bisa... (tujuan yang ingin dicapai)' },
      { name: 'Outcome', icon: '🎯', preview: 'Sehingga saya bisa... (hasil akhir yang diinginkan)' },
    ],
  },
  'Awareness Ladder': {
    label: 'Awareness Ladder',
    steps: [
      { name: 'Unaware', icon: '😶', preview: 'Mulai dari masalah yang belum disadari' },
      { name: 'Problem', icon: '😟', preview: 'Sadarkan bahwa ada masalah nyata' },
      { name: 'Solution', icon: '💡', preview: 'Tunjukkan kategori solusi yang tersedia' },
      { name: 'Product', icon: '📦', preview: 'Posisikan produkmu sebagai pilihan terbaik' },
      { name: 'Most Aware', icon: '🤑', preview: 'Dorong aksi — mereka tinggal butuh deal!' },
    ],
  },
  'FAB (Features–Advantages–Benefits)': {
    label: 'FAB',
    steps: [
      { name: 'Features', icon: '⚙️', preview: 'Fitur-fitur utama produk secara teknis' },
      { name: 'Advantages', icon: '📈', preview: 'Keunggulan dibanding kompetitor / cara lama' },
      { name: 'Benefits', icon: '❤️', preview: 'Manfaat emosional & dampak ke kehidupan' },
    ],
  },
  'PASTOR': {
    label: 'PASTOR',
    steps: [
      { name: 'Person', icon: '👤', preview: 'Identifikasi target — siapa mereka?' },
      { name: 'Amplify', icon: '📢', preview: 'Perbesar masalah — apa konsekuensinya?' },
      { name: 'Story', icon: '📖', preview: 'Ceritakan kisah transformasi yang relatable' },
      { name: 'Transform', icon: '🦋', preview: 'Tunjukkan perubahan yang bisa dicapai' },
      { name: 'Offer', icon: '🎁', preview: 'Presentasikan penawaran lengkap' },
      { name: 'Response', icon: '📩', preview: 'CTA jelas — minta respon sekarang' },
    ],
  },
  'Problem–Promise–Proof': {
    label: 'PPP',
    steps: [
      { name: 'Problem', icon: '😰', preview: 'Masalah utama yang menyakitkan' },
      { name: 'Promise', icon: '🌟', preview: 'Janji solusi yang mengubah segalanya' },
      { name: 'Proof', icon: '📊', preview: 'Bukti nyata bahwa ini benar-benar works' },
    ],
  },
  'Useful–Urgent–Unique': {
    label: 'UUU',
    steps: [
      { name: 'Useful', icon: '✅', preview: 'Apa gunanya buat mereka? Value proposition jelas' },
      { name: 'Urgent', icon: '⏰', preview: 'Kenapa harus sekarang? Scarcity & deadline' },
      { name: 'Unique', icon: '💎', preview: 'Apa bedanya dari yang lain? USP kuat' },
    ],
  },
  'The 3 Reason Why': {
    label: '3 Why',
    steps: [
      { name: 'Why This', icon: '🤔', preview: 'Kenapa produk ini yang harus dipilih?' },
      { name: 'Why Now', icon: '⏰', preview: 'Kenapa harus sekarang, bukan nanti?' },
      { name: 'Why You', icon: '👆', preview: 'Kenapa beli dari kamu, bukan kompetitor?' },
    ],
  },
  'Feature–Solution–Solution': {
    label: 'FSS',
    steps: [
      { name: 'Feature', icon: '⚙️', preview: 'Fitur utama yang dimiliki produk' },
      { name: 'Solution₁', icon: '✅', preview: 'Solusi langsung dari fitur tersebut' },
      { name: 'Solution₂', icon: '🚀', preview: 'Dampak lebih besar ke kehidupan customer' },
    ],
  },
  'Solution–Impact–Problem': {
    label: 'SIP',
    steps: [
      { name: 'Solution', icon: '💡', preview: 'Mulai dari solusi — hook yang menarik' },
      { name: 'Impact', icon: '💥', preview: 'Impact positif jika menggunakan solusi ini' },
      { name: 'Problem', icon: '😰', preview: 'Baru ungkap masalah yang diselesaikan' },
    ],
  },
  'Failed–Growth–Success': {
    label: 'FGS',
    steps: [
      { name: 'Failed', icon: '❌', preview: 'Ceritakan kegagalan awal / struggle' },
      { name: 'Growth', icon: '🌱', preview: 'Proses bertumbuh & menemukan cara' },
      { name: 'Success', icon: '🏆', preview: 'Hasil sukses + ajakan ikuti jejak' },
    ],
  },
  'Stop–Fear–Listen': {
    label: 'SFL',
    steps: [
      { name: 'Stop', icon: '🛑', preview: 'Hentikan kebiasaan lama yang merugikan' },
      { name: 'Fear', icon: '😱', preview: 'Apa yang terjadi jika tidak berubah?' },
      { name: 'Listen', icon: '👂', preview: 'Dengarkan — ini solusinya + CTA' },
    ],
  },
};

// Step colors for visual differentiation
const stepColors = [
  '#6c63ff', '#e74c3c', '#f39c12', '#2ecc71', '#3498db', '#8e44ad',
];

function FrameworkSections({
  formula,
  accent,
  theme,
  isDark,
  productName,
}: {
  formula: FrameworkVisual;
  accent: string;
  theme: { bg: string; text: string; card: string };
  isDark: boolean;
  productName: string;
}) {
  return (
    <>
      {/* Formula badge */}
      <div className="rounded-lg p-1.5 text-center" style={{ background: accent + '15', border: `1px solid ${accent}33` }}>
        <div className="text-[7px] font-bold" style={{ color: accent }}>
          📐 {formula.label} Framework
        </div>
        <div className="flex items-center justify-center gap-0.5 flex-wrap mt-1">
          {formula.steps.map((s, i) => (
            <div key={s.name} className="flex items-center gap-0.5">
              <span className="text-[6px] font-bold px-1 py-px rounded-full" style={{ background: stepColors[i % stepColors.length], color: '#fff' }}>
                {s.name}
              </span>
              {i < formula.steps.length - 1 && <span className="text-[7px]" style={{ color: accent }}>→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Visual section blocks per step */}
      {formula.steps.map((step, i) => (
        <div
          key={step.name}
          className="rounded-lg overflow-hidden"
          style={{ background: theme.card, border: `1px solid ${stepColors[i % stepColors.length]}22` }}
        >
          {/* Step header bar */}
          <div
            className="px-2 py-1 flex items-center gap-1.5"
            style={{ background: stepColors[i % stepColors.length] + '18' }}
          >
            <span className="text-xs">{step.icon}</span>
            <span className="text-[8px] font-extrabold" style={{ color: stepColors[i % stepColors.length] }}>
              {i + 1}. {step.name}
            </span>
            <span className="text-[6px] ml-auto opacity-40 uppercase font-bold">Section</span>
          </div>
          {/* Step content mockup */}
          <div className="px-2 py-2">
            <div className="text-[7px] opacity-60 mb-1.5">{step.preview}</div>
            {/* Visual content variations per step type */}
            {renderStepMockup(step.name, accent, isDark, theme, productName)}
          </div>
        </div>
      ))}
    </>
  );
}

function renderStepMockup(
  stepName: string,
  accent: string,
  isDark: boolean,
  theme: { bg: string; text: string; card: string },
  productName: string,
) {
  const lower = stepName.toLowerCase();

  // Problem / Pain steps
  if (['problem', 'agitate', 'failed', 'fear', 'before', 'ordinary', 'but', 'situation'].includes(lower)) {
    return (
      <div className="space-y-1">
        <div className="h-1.5 rounded-full w-[90%]" style={{ background: isDark ? '#4a2020' : '#fde2e2' }} />
        <div className="h-1.5 rounded-full w-[70%]" style={{ background: isDark ? '#4a2020' : '#fde2e2' }} />
        <div className="flex gap-1 mt-1">
          <div className="rounded p-1 text-center flex-1 text-[6px]" style={{ background: isDark ? '#3a1a1a' : '#fff0f0' }}>
            <span className="block text-[10px]">😩</span>
            Pain Point 1
          </div>
          <div className="rounded p-1 text-center flex-1 text-[6px]" style={{ background: isDark ? '#3a1a1a' : '#fff0f0' }}>
            <span className="block text-[10px]">😤</span>
            Pain Point 2
          </div>
        </div>
      </div>
    );
  }

  // Solution / After / Success / Transform steps
  if (['solution', 'after', 'success', 'transform', 'therefore', 'return', 'outcome', 'growth', 'bridge'].includes(lower)) {
    return (
      <div className="space-y-1">
        <div className="h-1.5 rounded-full w-[85%]" style={{ background: isDark ? '#1a3a20' : '#e2fde6' }} />
        <div className="h-1.5 rounded-full w-[65%]" style={{ background: isDark ? '#1a3a20' : '#e2fde6' }} />
        <div className="flex gap-1 mt-1">
          {['🎯', '✅', '🚀'].map((e, i) => (
            <div key={i} className="rounded p-1 text-center flex-1 text-[6px]" style={{ background: accent + '11' }}>
              <span className="block text-[10px]">{e}</span>
              Benefit {i + 1}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Attention / Hook / Stop / Call / Headline steps
  if (['attention', 'hook', 'stop', 'call', 'qualify'].includes(lower)) {
    return (
      <div className="text-center py-1">
        <div className="text-[10px] font-extrabold leading-tight mb-1" style={{ color: accent }}>
          "{productName}"
        </div>
        <div className="h-1 rounded-full w-[60%] mx-auto" style={{ background: accent + '33' }} />
        <div className="h-1 rounded-full w-[40%] mx-auto mt-0.5" style={{ background: accent + '22' }} />
      </div>
    );
  }

  // Interest / Look / Understand / And / Educate steps
  if (['interest', 'look', 'understand', 'and', 'educate', 'picture'].includes(lower)) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded flex items-center justify-center text-[10px]" style={{ background: accent + '22' }}>📊</div>
          <div className="flex-1">
            <div className="h-1 rounded-full w-[80%]" style={{ background: isDark ? '#333' : '#ddd' }} />
            <div className="h-1 rounded-full w-[55%] mt-0.5" style={{ background: isDark ? '#333' : '#ddd' }} />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded flex items-center justify-center text-[10px]" style={{ background: accent + '22' }}>💡</div>
          <div className="flex-1">
            <div className="h-1 rounded-full w-[70%]" style={{ background: isDark ? '#333' : '#ddd' }} />
            <div className="h-1 rounded-full w-[50%] mt-0.5" style={{ background: isDark ? '#333' : '#ddd' }} />
          </div>
        </div>
      </div>
    );
  }

  // Desire / Stimulate / Motivation / Urgent steps
  if (['desire', 'stimulate', 'motivation', 'urgent'].includes(lower)) {
    return (
      <div className="rounded p-1.5 text-center" style={{ background: accent + '11' }}>
        <div className="text-[10px] mb-1">🔥</div>
        <div className="h-1 rounded-full w-[70%] mx-auto" style={{ background: accent + '33' }} />
        <div className="h-1 rounded-full w-[50%] mx-auto mt-0.5" style={{ background: accent + '22' }} />
        <div className="text-[6px] mt-1 opacity-50">Bayangkan jika...</div>
      </div>
    );
  }

  // Conviction / Proof / Guide / Story steps
  if (['conviction', 'proof', 'guide', 'story', 'person', 'amplify', 'character'].includes(lower)) {
    return (
      <div className="space-y-1">
        {[1, 2].map(i => (
          <div key={i} className="flex items-center gap-1 rounded p-1" style={{ background: isDark ? '#1f1f3a' : '#f5f5fa' }}>
            <div className="w-4 h-4 rounded-full flex items-center justify-center text-[7px]" style={{ background: accent + '33' }}>👤</div>
            <div className="flex-1">
              <div className="h-1 rounded-full w-[60%]" style={{ background: isDark ? '#444' : '#ccc' }} />
              <div className="text-[6px] mt-0.5" style={{ color: accent }}>⭐⭐⭐⭐⭐</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Action / CTA / Push / Purchase / Response / Transition / Listen steps
  if (['action', 'push', 'purchase', 'response', 'transition', 'listen', 'why you'].includes(lower)) {
    return (
      <div className="text-center py-1">
        <div className="rounded-md py-1.5 px-3 text-[8px] font-bold inline-block" style={{ background: accent, color: '#fff' }}>
          🎯 Ambil Sekarang!
        </div>
        <div className="text-[6px] mt-1 opacity-40">Penawaran terbatas</div>
      </div>
    );
  }

  // Plan / How It Works steps
  if (['plan', 'why this', 'why now'].includes(lower)) {
    return (
      <div className="flex justify-around">
        {[{ n: '1', t: 'Step 1' }, { n: '2', t: 'Step 2' }, { n: '3', t: 'Step 3' }].map(s => (
          <div key={s.n} className="text-center">
            <div className="w-4 h-4 rounded-full mx-auto flex items-center justify-center text-[7px] font-bold" style={{ background: accent, color: '#fff' }}>{s.n}</div>
            <div className="text-[6px] mt-0.5">{s.t}</div>
          </div>
        ))}
      </div>
    );
  }

  // Features / Advantages / Benefits / Useful / Unique / Offer
  if (['features', 'advantages', 'benefits', 'useful', 'unique', 'offer', 'promise', 'feature', 'solution₁', 'solution₂', 'impact'].includes(lower)) {
    return (
      <div className="space-y-0.5">
        {['Keunggulan pertama', 'Keunggulan kedua', 'Keunggulan ketiga'].map((f, i) => (
          <div key={i} className="flex items-center gap-1 text-[7px]">
            <span style={{ color: accent }}>✓</span> {f}
          </div>
        ))}
      </div>
    );
  }

  // Default / unaware / most aware / product
  return (
    <div className="space-y-1">
      <div className="h-1.5 rounded-full w-[80%]" style={{ background: isDark ? '#333' : '#e0e0e0' }} />
      <div className="h-1.5 rounded-full w-[60%]" style={{ background: isDark ? '#333' : '#e0e0e0' }} />
    </div>
  );
}

export function LivePreview({ form }: Props) {
  const accent = colorMap[form.warnaBrand] || '#6c63ff';
  const theme = themeMap[form.tema] || themeMap['Default'];
  const isDark = form.tema === 'Dark' || form.tema === 'Colorful';
  const formula = frameworkVisuals[form.framework];

  const sections = useMemo(() => {
    const s: { key: string; label: string; icon: string }[] = [];
    if (form.elemenTambahan['Hero Section']) s.push({ key: 'hero', label: 'Hero', icon: '🚀' });
    if (form.elemenTambahan['Video Section']) s.push({ key: 'video', label: 'Video', icon: '🎬' });
    if (form.elemenTambahan['Social Proof']) s.push({ key: 'social', label: 'Social Proof', icon: '⭐' });
    if (form.elemenTambahan['Before-After']) s.push({ key: 'ba', label: 'Before-After', icon: '🔄' });
    if (form.elemenTambahan['How It Works']) s.push({ key: 'how', label: 'How It Works', icon: '📋' });
    if (form.elemenTambahan['Feature List']) s.push({ key: 'features', label: 'Features', icon: '✨' });
    if (form.elemenTambahan['Testimonial']) s.push({ key: 'testi', label: 'Testimonial', icon: '💬' });
    if (form.elemenTambahan['Bonus Section']) s.push({ key: 'bonus', label: 'Bonus', icon: '🎁' });
    if (form.elemenTambahan['Pricing Table']) s.push({ key: 'pricing', label: 'Pricing', icon: '💰' });
    if (form.elemenTambahan['Guarantee']) s.push({ key: 'guarantee', label: 'Guarantee', icon: '🛡️' });
    if (form.elemenTambahan['Scarcity / Timer']) s.push({ key: 'scarcity', label: 'Scarcity', icon: '⏰' });
    if (form.elemenTambahan['FAQ']) s.push({ key: 'faq', label: 'FAQ', icon: '❓' });
    return s;
  }, [form.elemenTambahan]);

  const productName = form.namaProduk || 'Nama Produk Kamu';
  const ctaText = form.ctaUtama || 'Beli Sekarang';

  return (
    <div
      className="rounded-xl overflow-hidden border border-border shadow-lg"
      style={{ background: theme.bg, color: theme.text, fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Phone frame header */}
      <div className="flex items-center justify-center gap-1.5 py-2" style={{ background: isDark ? '#0a0a15' : '#e8e8ec' }}>
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#ff5f57' }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#ffbd2e' }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#28ca41' }} />
        <span className="ml-2 text-[8px] opacity-50">{form.platformTarget || 'Preview'}</span>
      </div>

      <div className="px-3 py-2 space-y-2 max-h-[500px] overflow-y-auto" style={{ fontSize: '10px' }}>

        {/* Floating sticky note */}
        <div className="sticky top-0 z-10 animate-fade-in" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}>
          <div
            className="rounded-md px-2.5 py-1.5 flex items-start gap-1.5 relative"
            style={{
              background: isDark ? 'linear-gradient(135deg, #2a2a4e, #1e1e3a)' : 'linear-gradient(135deg, #fffde7, #fff9c4)',
              border: `1px solid ${isDark ? '#3a3a5e' : '#f0e68c'}`,
              boxShadow: isDark ? '0 3px 10px rgba(0,0,0,0.4)' : '0 3px 10px rgba(0,0,0,0.08)',
              transform: 'rotate(-0.5deg)',
            }}
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full" style={{ background: accent, boxShadow: `0 1px 3px ${accent}66` }} />
            <span className="text-[10px] mt-px">✨</span>
            <div className="text-[7px] leading-relaxed" style={{ color: isDark ? '#d0d0e0' : '#665500' }}>
              <span className="font-bold" style={{ color: accent }}>Preview Mode</span> — Ini gambaran kasar struktur LP. Hasil akhir AI akan <span className="font-bold">jauh lebih bagus</span> ✨
            </div>
          </div>
        </div>

        {/* Countdown */}
        {form.countdown.enabled && form.elemenTambahan['Scarcity / Timer'] && (
          <div className="rounded-md px-2 py-1.5 text-center" style={{ background: form.countdown.bgColor, color: form.countdown.textColor }}>
            <div className="text-[7px] font-bold mb-0.5">{form.countdown.labelAtas}</div>
            <div className="flex justify-center gap-2 text-[10px] font-bold">
              <span style={{ color: form.countdown.accentColor }}>{form.countdown.hari}h</span>
              <span>:</span>
              <span style={{ color: form.countdown.accentColor }}>{form.countdown.jam}j</span>
              <span>:</span>
              <span style={{ color: form.countdown.accentColor }}>{form.countdown.menit}m</span>
            </div>
          </div>
        )}

        {/* Framework-specific sections OR generic hero */}
        {formula ? (
          <FrameworkSections
            formula={formula}
            accent={accent}
            theme={theme}
            isDark={isDark}
            productName={productName}
          />
        ) : (
          /* Default Hero when no framework selected */
          form.elemenTambahan['Hero Section'] && (
            <div className="rounded-lg p-3 text-center" style={{ background: theme.card }}>
              <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center text-lg" style={{ background: accent + '22' }}>
                🚀
              </div>
              <div className="font-extrabold text-sm leading-tight mb-1">{productName}</div>
              {form.deskripsiBenefit && (
                <div className="text-[8px] opacity-70 mb-2 line-clamp-2">{form.deskripsiBenefit}</div>
              )}
              <div className="rounded-md py-1.5 px-3 text-[9px] font-bold inline-block" style={{ background: accent, color: '#fff' }}>
                {ctaText}
              </div>
            </div>
          )
        )}

        {/* Extra elements below framework sections */}

        {/* Video */}
        {form.elemenTambahan['Video Section'] && (
          <div className="rounded-lg overflow-hidden" style={{ background: theme.card }}>
            <div className="aspect-video flex items-center justify-center" style={{ background: isDark ? '#111' : '#e2e2e8' }}>
              <span className="text-2xl">▶️</span>
            </div>
          </div>
        )}

        {/* Social Proof */}
        {form.elemenTambahan['Social Proof'] && (
          <div className="rounded-lg p-2 flex items-center gap-2" style={{ background: theme.card }}>
            <div className="flex -space-x-1.5">
              {['😊','😄','🥰','😎'].map((e, i) => (
                <div key={i} className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] border-2" style={{ background: accent + '22', borderColor: theme.bg }}>{e}</div>
              ))}
            </div>
            <div className="text-[8px]"><span className="font-bold" style={{ color: accent }}>4,800+</span> orang sudah bergabung</div>
          </div>
        )}

        {/* Bonus */}
        {form.elemenTambahan['Bonus Section'] && (
          <div className="rounded-lg p-2" style={{ background: theme.card }}>
            <div className="text-[8px] font-bold text-center mb-1">🎁 Bonus Spesial</div>
            {form.bonusList.length > 0 ? (
              <div className="space-y-0.5">
                {form.bonusList.map((b, i) => (
                  <div key={i} className="flex items-center justify-between text-[7px] rounded px-1.5 py-0.5" style={{ background: accent + '11' }}>
                    <span>🎁 {b.nama || `Bonus ${i + 1}`}</span>
                    {b.hargaAsli && <span className="line-through opacity-50">Rp {b.hargaAsli}</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[7px] text-center opacity-50">Tambahkan bonus di form</div>
            )}
          </div>
        )}

        {/* Pricing */}
        {form.elemenTambahan['Pricing Table'] && (
          <div className="rounded-lg p-2 text-center" style={{ background: theme.card }}>
            <div className="text-[8px] font-bold mb-1">💰 Harga Spesial</div>
            {form.hargaNormal && <div className="text-[8px] line-through opacity-40">Rp {form.hargaNormal}</div>}
            {form.hargaPromo && <div className="text-[8px] line-through opacity-50">Rp {form.hargaPromo}</div>}
            <div className="text-base font-extrabold my-0.5" style={{ color: accent }}>
              {form.hargaFinal ? `Rp ${form.hargaFinal}` : 'Rp ???'}
            </div>
            {form.keteranganDiskon && (
              <div className="text-[7px] px-2 py-0.5 rounded-full inline-block font-bold" style={{ background: accent + '22', color: accent }}>
                {form.keteranganDiskon}
              </div>
            )}
          </div>
        )}

        {/* Guarantee */}
        {form.elemenTambahan['Guarantee'] && (
          <div className="rounded-lg p-2 text-center" style={{ background: theme.card }}>
            <div className="text-lg mb-0.5">🛡️</div>
            <div className="text-[8px] font-bold">Garansi 100% Uang Kembali</div>
            <div className="text-[7px] opacity-60">Jika tidak puas, uang kembali tanpa syarat</div>
          </div>
        )}

        {/* FAQ */}
        {form.elemenTambahan['FAQ'] && (
          <div className="rounded-lg p-2" style={{ background: theme.card }}>
            <div className="text-[8px] font-bold text-center mb-1">❓ FAQ</div>
            {['Apakah ada garansi?', 'Bagaimana cara order?', 'Berapa lama prosesnya?'].map((q, i) => (
              <div key={i} className="text-[7px] rounded px-1.5 py-1 mb-0.5" style={{ background: isDark ? '#1f1f3a' : '#f0f0f5' }}>
                <span className="font-bold">Q:</span> {q}
              </div>
            ))}
          </div>
        )}

        {/* Final CTA */}
        <div className="rounded-lg p-3 text-center" style={{ background: theme.card }}>
          <div className="text-[9px] font-bold mb-1.5">Jangan tunggu lagi!</div>
          <div className="rounded-md py-2 px-4 text-[10px] font-bold w-full text-center" style={{ background: accent, color: '#fff' }}>
            {ctaText}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-2 text-[7px] opacity-40">
          © 2026 {productName} — All Rights Reserved
        </div>
      </div>

      {/* Sales Notification */}
      {form.salesNotif.enabled && (
        <div
          className="mx-3 mb-2 rounded-lg px-2 py-1.5 flex items-center gap-1.5 border text-[7px]"
          style={{ background: form.salesNotif.bgColor, borderColor: form.salesNotif.borderColor, color: form.salesNotif.textColor }}
        >
          <span className="text-sm">{form.salesNotif.emoji}</span>
          <div>
            <div className="font-bold">{form.salesNotif.namaPembeli}</div>
            <div>{form.salesNotif.pesanNotif} {form.salesNotif.namaProdukNotif || productName}</div>
          </div>
        </div>
      )}

      {/* Section map */}
      <div className="px-3 py-2 border-t" style={{ borderColor: isDark ? '#333' : '#e0e0e0', background: isDark ? '#0a0a15' : '#f4f4f8' }}>
        <div className="text-[7px] font-bold opacity-50 mb-1">STRUKTUR ({sections.length} section)</div>
        <div className="flex flex-wrap gap-0.5">
          {sections.map(s => (
            <span key={s.key} className="text-[7px] px-1.5 py-0.5 rounded-full" style={{ background: accent + '22', color: accent }}>
              {s.icon} {s.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
