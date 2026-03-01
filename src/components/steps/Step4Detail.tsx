import { useState } from 'react';
import { StepCard } from '@/components/StepCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BonusItem } from '@/types/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ctaOptions = [
  'Beli Sekarang', 'Daftar Sekarang', 'Gabung Sekarang', 'Konsultasi Gratis',
  'Download Sekarang', 'Amankan Slot', 'Mulai Sekarang', 'Apply Now (Lamar)',
  'Get Quote (Minta Penawaran)', 'Start Free Trial', 'Join Waitlist',
];

interface Props {
  namaProduk: string;
  hargaNormal: string;
  hargaPromo: string;
  hargaFinal: string;
  keteranganDiskon: string;
  bonusList: BonusItem[];
  deskripsiBenefit: string;
  ctaUtama: string;
  onChange: (field: string, value: string) => void;
  onChangeBonusList: (list: BonusItem[]) => void;
}

export function Step4Detail({
  namaProduk, hargaNormal, hargaPromo, hargaFinal, keteranganDiskon,
  bonusList, deskripsiBenefit, ctaUtama, onChange,
  onChangeBonusList
}: Props) {
  const [isManualCta, setIsManualCta] = useState(false);

  const handleCtaSelect = (value: string) => {
    if (value === '__manual__') { setIsManualCta(true); onChange('ctaUtama', ''); }
    else { setIsManualCta(false); onChange('ctaUtama', value); }
  };

  const safeList = bonusList || [];
  const addBonus = () => onChangeBonusList([...safeList, { nama: '', hargaAsli: '' }]);
  const removeBonus = (i: number) => onChangeBonusList(safeList.filter((_, idx) => idx !== i));
  const updateBonus = (i: number, field: keyof BonusItem, value: string) => {
    const updated = [...safeList];
    updated[i] = { ...updated[i], [field]: value };
    onChangeBonusList(updated);
  };

  return (
    <StepCard step={4} title="Detail Produk & Pricing">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Nama Produk <span className="text-destructive">*</span></label>
        <Input placeholder="Masukkan nama produk..." value={namaProduk} onChange={(e) => onChange('namaProduk', e.target.value)} className="bg-secondary border-border" />
      </div>

      {/* Pricing - 4 Layer Only (Normal → Promo → Harga Asli) */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Struktur Harga (3 Layer)</label>
        <p className="text-xs text-muted-foreground">Harga Normal (dicoret) → Harga Promo (dicoret) → Harga Diskon (Beli Sekarang)</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Harga Normal <span className="text-destructive text-[10px]">(dicoret)</span></label>
            <Input type="number" placeholder="Rp" value={hargaNormal} onChange={(e) => onChange('hargaNormal', e.target.value)} className="bg-secondary border-border" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Harga Promo <span className="text-destructive text-[10px]">(dicoret)</span></label>
            <Input type="number" placeholder="Rp" value={hargaPromo} onChange={(e) => onChange('hargaPromo', e.target.value)} className="bg-secondary border-border" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Harga Diskon <span className="text-primary text-[10px]">(Beli Sekarang)</span></label>
            <Input type="number" placeholder="Rp" value={hargaFinal} onChange={(e) => onChange('hargaFinal', e.target.value)} className="bg-secondary border-border" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Keterangan Diskon (Opsional)</label>
          <Input placeholder='Contoh: Kalo pake kode voucher "DISKON50"' value={keteranganDiskon} onChange={(e) => onChange('keteranganDiskon', e.target.value)} className="bg-secondary border-border" />
        </div>

        {/* Pricing Preview - matching reference image style */}
        <div className="rounded-lg bg-secondary/60 border border-border p-4 text-center space-y-2">
          <p className="text-[10px] text-muted-foreground uppercase font-semibold">Preview Harga</p>
          <p className="text-[10px] text-muted-foreground uppercase mt-2">Harga Normal</p>
          <p className="text-lg text-destructive line-through font-bold">
            {hargaNormal ? `Rp ${Number(hargaNormal).toLocaleString('id-ID')}` : 'Rp -'}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase mt-1">Harga Promo</p>
          <p className="text-base text-muted-foreground line-through font-semibold">
            {hargaPromo ? `Rp ${Number(hargaPromo).toLocaleString('id-ID')}` : 'Rp -'}
          </p>
          {keteranganDiskon && (
            <p className="text-xs text-muted-foreground mt-1">{keteranganDiskon}</p>
          )}
          <p className="text-[10px] text-muted-foreground uppercase mt-1">🔥 Harga Diskon untuk kamu yang beli sekarang</p>
          <p className="text-2xl text-primary font-black">
            {hargaFinal ? `Rp ${Number(hargaFinal).toLocaleString('id-ID')}` : 'Rp -'}
          </p>
        </div>
      </div>

      {/* Bonus Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">🎁 Bonus (Opsional)</label>
          <button type="button" onClick={addBonus} className="text-xs text-primary font-semibold hover:underline">+ Tambah Bonus</button>
        </div>
        {safeList.map((bonus, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1 space-y-1">
              <Input placeholder={`Bonus ${i + 1}: Nama bonus...`} value={bonus.nama} onChange={(e) => updateBonus(i, 'nama', e.target.value)} className="bg-secondary border-border text-sm" />
            </div>
            <div className="w-32">
              <Input type="number" placeholder="Harga asli" value={bonus.hargaAsli} onChange={(e) => updateBonus(i, 'hargaAsli', e.target.value)} className="bg-secondary border-border text-sm" />
            </div>
            <button type="button" onClick={() => removeBonus(i)} className="mt-1 text-destructive hover:bg-destructive/10 rounded p-1 text-xs">🗑</button>
          </div>
        ))}
        {safeList.length > 0 && (
          <div className="rounded-lg bg-secondary/60 border border-border p-3 space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Preview Bonus</p>
            {safeList.filter(b => b.nama).map((b, i) => (
              <p key={i} className="text-xs text-foreground">
                ✅ {b.nama} {b.hargaAsli && <span className="text-destructive line-through ml-1">Rp {Number(b.hargaAsli).toLocaleString('id-ID')}</span>}
              </p>
            ))}
            {safeList.some(b => b.hargaAsli) && (
              <p className="text-xs font-semibold text-primary mt-1">
                Total nilai bonus: Rp {safeList.reduce((sum, b) => sum + (Number(b.hargaAsli) || 0), 0).toLocaleString('id-ID')}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Deskripsi & Benefit</label>
        <Textarea placeholder="Deskripsikan produk dan benefit utamanya..." value={deskripsiBenefit} onChange={(e) => onChange('deskripsiBenefit', e.target.value)} className="bg-secondary border-border min-h-[100px]" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">CTA Utama</label>
        <Select value={isManualCta ? '__manual__' : ctaUtama} onValueChange={handleCtaSelect}>
          <SelectTrigger className="w-full bg-secondary border-border"><SelectValue placeholder="Pilih CTA..." /></SelectTrigger>
          <SelectContent className="bg-popover border-border z-50">
            {ctaOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
            <SelectItem value="__manual__">Isi Manual...</SelectItem>
          </SelectContent>
        </Select>
        {isManualCta && <Input placeholder="Tulis CTA kamu..." value={ctaUtama} onChange={(e) => onChange('ctaUtama', e.target.value)} className="bg-secondary border-border mt-2" autoFocus />}
      </div>
    </StepCard>
  );
}
