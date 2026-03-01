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

// Framework formula structures
const frameworkFormulas: Record<string, { label: string; steps: string[] }> = {
  'AIDCA': { label: 'AIDCA', steps: ['Attention', 'Interest', 'Desire', 'Conviction', 'Action'] },
  'PAS (Problem–Agitate–Solution)': { label: 'PAS', steps: ['Problem', 'Agitate', 'Solution'] },
  'BAB (Before–After–Bridge)': { label: 'BAB', steps: ['Before', 'After', 'Bridge'] },
  '4P (Promise–Picture–Proof–Push)': { label: '4P', steps: ['Promise', 'Picture', 'Proof', 'Push'] },
  'SLAP (Stop–Look–Act–Purchase)': { label: 'SLAP', steps: ['Stop', 'Look', 'Act', 'Purchase'] },
  'StoryBrand': { label: 'StoryBrand', steps: ['Character', 'Problem', 'Guide', 'Plan', 'Action', 'Success'] },
  'ABT (And–But–Therefore)': { label: 'ABT', steps: ['And', 'But', 'Therefore'] },
  "Hero's Journey": { label: "Hero's Journey", steps: ['Ordinary', 'Call', 'Challenge', 'Transformation', 'Return'] },
  'HSO (Hook–Story–Offer)': { label: 'HSO', steps: ['Hook', 'Story', 'Offer'] },
  'QUEST': { label: 'QUEST', steps: ['Qualify', 'Understand', 'Educate', 'Stimulate', 'Transition'] },
  'JTBD (Jobs To Be Done)': { label: 'JTBD', steps: ['Situation', 'Motivation', 'Outcome'] },
  'Awareness Ladder': { label: 'Awareness', steps: ['Unaware', 'Problem', 'Solution', 'Product', 'Most Aware'] },
  'FAB (Features–Advantages–Benefits)': { label: 'FAB', steps: ['Features', 'Advantages', 'Benefits'] },
  'PASTOR': { label: 'PASTOR', steps: ['Person', 'Amplify', 'Story', 'Transform', 'Offer', 'Response'] },
  'Problem–Promise–Proof': { label: 'PPP', steps: ['Problem', 'Promise', 'Proof'] },
  'Useful–Urgent–Unique': { label: 'UUU', steps: ['Useful', 'Urgent', 'Unique'] },
  'The 3 Reason Why': { label: '3 Why', steps: ['Why This', 'Why Now', 'Why You'] },
  'Feature–Solution–Solution': { label: 'FSS', steps: ['Feature', 'Solution₁', 'Solution₂'] },
  'Solution–Impact–Problem': { label: 'SIP', steps: ['Solution', 'Impact', 'Problem'] },
  'Failed–Growth–Success': { label: 'FGS', steps: ['Failed', 'Growth', 'Success'] },
  'Stop–Fear–Listen': { label: 'SFL', steps: ['Stop', 'Fear', 'Listen'] },
};

export function LivePreview({ form }: Props) {
  const accent = colorMap[form.warnaBrand] || '#6c63ff';
  const theme = themeMap[form.tema] || themeMap['Default'];
  const isDark = form.tema === 'Dark' || form.tema === 'Colorful';
  const formula = frameworkFormulas[form.framework];

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

        {/* Framework Formula */}
        {formula && (
          <div className="rounded-lg p-2" style={{ background: accent + '11', border: `1px solid ${accent}33` }}>
            <div className="text-[7px] font-bold text-center mb-1.5" style={{ color: accent }}>
              📐 Formula: {formula.label}
            </div>
            <div className="flex items-center justify-center gap-0.5 flex-wrap">
              {formula.steps.map((step, i) => (
                <div key={step} className="flex items-center gap-0.5">
                  <span
                    className="text-[6px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: accent, color: '#fff' }}
                  >
                    {step}
                  </span>
                  {i < formula.steps.length - 1 && (
                    <span className="text-[8px]" style={{ color: accent }}>→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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

        {/* Hero */}
        {form.elemenTambahan['Hero Section'] && (
          <div className="rounded-lg p-3 text-center" style={{ background: theme.card }}>
            <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center text-lg" style={{ background: accent + '22' }}>
              🚀
            </div>
            <div className="font-extrabold text-sm leading-tight mb-1" style={{ color: theme.text }}>
              {productName}
            </div>
            {form.deskripsiBenefit && (
              <div className="text-[8px] opacity-70 mb-2 line-clamp-2">{form.deskripsiBenefit}</div>
            )}
            <div
              className="rounded-md py-1.5 px-3 text-[9px] font-bold inline-block"
              style={{ background: accent, color: '#fff' }}
            >
              {ctaText}
            </div>
          </div>
        )}

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

        {/* Before-After */}
        {form.elemenTambahan['Before-After'] && (
          <div className="rounded-lg p-2" style={{ background: theme.card }}>
            <div className="text-[8px] font-bold text-center mb-1.5">Before vs After</div>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="rounded p-1.5 text-center text-[7px]" style={{ background: isDark ? '#331a1a' : '#ffe0e0' }}>
                <span className="text-sm block mb-0.5">😩</span>
                Sebelum
              </div>
              <div className="rounded p-1.5 text-center text-[7px]" style={{ background: isDark ? '#1a3320' : '#e0ffe0' }}>
                <span className="text-sm block mb-0.5">😍</span>
                Sesudah
              </div>
            </div>
          </div>
        )}

        {/* How It Works */}
        {form.elemenTambahan['How It Works'] && (
          <div className="rounded-lg p-2" style={{ background: theme.card }}>
            <div className="text-[8px] font-bold text-center mb-1.5">Cara Kerja</div>
            <div className="flex justify-around">
              {[{ n: '1', t: 'Pilih' }, { n: '2', t: 'Proses' }, { n: '3', t: 'Hasil' }].map(s => (
                <div key={s.n} className="text-center">
                  <div className="w-5 h-5 rounded-full mx-auto flex items-center justify-center text-[8px] font-bold mb-0.5" style={{ background: accent, color: '#fff' }}>{s.n}</div>
                  <div className="text-[7px]">{s.t}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        {form.elemenTambahan['Feature List'] && (
          <div className="rounded-lg p-2" style={{ background: theme.card }}>
            <div className="text-[8px] font-bold text-center mb-1">✨ Fitur Unggulan</div>
            <div className="space-y-0.5">
              {['Fitur pertama', 'Fitur kedua', 'Fitur ketiga'].map((f, i) => (
                <div key={i} className="flex items-center gap-1 text-[7px]">
                  <span style={{ color: accent }}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonial */}
        {form.elemenTambahan['Testimonial'] && (
          <div className="rounded-lg p-2" style={{ background: theme.card }}>
            <div className="text-[8px] font-bold text-center mb-1.5">💬 Testimoni</div>
            <div className="space-y-1">
              {[{ n: 'Andi', t: 'Luar biasa hasilnya!' }, { n: 'Siti', t: 'Sangat membantu bisnis saya' }].map((t, i) => (
                <div key={i} className="rounded p-1.5 text-[7px]" style={{ background: isDark ? '#1f1f3a' : '#f0f0f5' }}>
                  <div className="flex items-center gap-1 mb-0.5">
                    <div className="w-3 h-3 rounded-full text-[6px] flex items-center justify-center" style={{ background: accent + '33' }}>👤</div>
                    <span className="font-bold">{t.n}</span>
                    <span style={{ color: accent }}>⭐⭐⭐⭐⭐</span>
                  </div>
                  <div className="opacity-80">"{t.t}"</div>
                </div>
              ))}
            </div>
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
            {form.hargaNormal && (
              <div className="text-[8px] line-through opacity-40">Rp {form.hargaNormal}</div>
            )}
            {form.hargaPromo && (
              <div className="text-[8px] line-through opacity-50">Rp {form.hargaPromo}</div>
            )}
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
          <div className="text-[9px] font-bold mb-1.5" style={{ color: theme.text }}>Jangan tunggu lagi!</div>
          <div
            className="rounded-md py-2 px-4 text-[10px] font-bold w-full text-center"
            style={{ background: accent, color: '#fff' }}
          >
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
