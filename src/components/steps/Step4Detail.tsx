import { useState } from 'react';
import { StepCard } from '@/components/StepCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BonusItem, PricingLayersConfig } from '@/types/form';
import { Switch } from '@/components/ui/switch';
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
  pricingLayersConfig?: PricingLayersConfig;
  bonusList: BonusItem[];
  deskripsiBenefit: string;
  ctaUtama: string;
  onChange: (field: string, value: any) => void;
  onChangeBonusList: (list: BonusItem[]) => void;
}

export function Step4Detail({
  namaProduk,
  hargaNormal,
  hargaPromo,
  hargaFinal,
  keteranganDiskon,
  pricingLayersConfig = { layerNormal: true, layerPromo: true, layerFinal: true },
  bonusList,
  deskripsiBenefit,
  ctaUtama,
  onChange,
  onChangeBonusList,
}: Props) {
  const [isManualCta, setIsManualCta] = useState(false);

  const handleCtaSelect = (value: string) => {
    if (value === '__manual__') {
      setIsManualCta(true);
      onChange('ctaUtama', '');
    } else {
      setIsManualCta(false);
      onChange('ctaUtama', value);
    }
  };

  const safeList = bonusList || [];
  const addBonus = () => onChangeBonusList([...safeList, { nama: '', hargaAsli: '' }]);
  const removeBonus = (i: number) => onChangeBonusList(safeList.filter((_, idx) => idx !== i));
  const updateBonus = (i: number, field: keyof BonusItem, value: string) => {
    const updated = [...safeList];
    updated[i] = { ...updated[i], [field]: value };
    onChangeBonusList(updated);
  };

  const toggleLayer = (layer: keyof PricingLayersConfig, checked: boolean) => {
    onChange('pricingLayersConfig', {
      ...pricingLayersConfig,
      [layer]: checked,
    });
  };

  const applyPreset = (preset: '3-layer' | '2-layer' | '1-layer') => {
    if (preset === '3-layer') {
      onChange('pricingLayersConfig', { layerNormal: true, layerPromo: true, layerFinal: true });
    } else if (preset === '2-layer') {
      onChange('pricingLayersConfig', { layerNormal: true, layerPromo: false, layerFinal: true });
    } else if (preset === '1-layer') {
      onChange('pricingLayersConfig', { layerNormal: false, layerPromo: false, layerFinal: true });
    }
  };

  const is3Layer = pricingLayersConfig.layerNormal && pricingLayersConfig.layerPromo && pricingLayersConfig.layerFinal;
  const is2Layer = pricingLayersConfig.layerNormal && !pricingLayersConfig.layerPromo && pricingLayersConfig.layerFinal;
  const is1Layer = !pricingLayersConfig.layerNormal && !pricingLayersConfig.layerPromo && pricingLayersConfig.layerFinal;

  return (
    <StepCard step={4} title="Detail Produk & Pricing">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Nama Produk <span className="text-destructive">*</span></label>
        <Input placeholder="Masukkan nama produk..." value={namaProduk} onChange={(e) => onChange('namaProduk', e.target.value)} className="bg-secondary border-border" />
      </div>

      {/* Pricing Section with Layer Controls */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-2">
          <div>
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              🏷️ Struktur Harga
              <span className="text-[11px] font-normal text-muted-foreground">(Opsi On/Off 3 Layer)</span>
            </label>
            <p className="text-xs text-muted-foreground">Aktifkan atau nonaktifkan layer harga sesuai kebutuhan penawaran Anda.</p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-muted-foreground uppercase font-bold mr-1">Preset:</span>
            <button
              type="button"
              onClick={() => applyPreset('3-layer')}
              className={`text-[11px] px-2.5 py-1 rounded-md font-medium border transition-all ${
                is3Layer ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              3 Layer
            </button>
            <button
              type="button"
              onClick={() => applyPreset('2-layer')}
              className={`text-[11px] px-2.5 py-1 rounded-md font-medium border transition-all ${
                is2Layer ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              2 Layer
            </button>
            <button
              type="button"
              onClick={() => applyPreset('1-layer')}
              className={`text-[11px] px-2.5 py-1 rounded-md font-medium border transition-all ${
                is1Layer ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              1 Layer (Single)
            </button>
          </div>
        </div>

        {/* 3 Layer Inputs with ON/OFF Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Layer 1: Harga Normal */}
          <div className={`p-3 rounded-xl border transition-all space-y-2 ${
            pricingLayersConfig.layerNormal ? 'bg-secondary/70 border-border' : 'bg-secondary/20 border-dashed border-border/40 opacity-60'
          }`}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1">
                1. Harga Normal
                <span className="text-destructive text-[10px]">(dicoret)</span>
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground font-mono">{pricingLayersConfig.layerNormal ? 'ON' : 'OFF'}</span>
                <Switch
                  checked={pricingLayersConfig.layerNormal}
                  onCheckedChange={(c) => toggleLayer('layerNormal', c)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
            {pricingLayersConfig.layerNormal ? (
              <Input
                type="number"
                placeholder="Rp (cth: 499000)"
                value={hargaNormal}
                onChange={(e) => onChange('hargaNormal', e.target.value)}
                className="bg-background border-border text-sm"
              />
            ) : (
              <div className="text-[11px] text-muted-foreground/60 italic py-2 text-center bg-background/30 rounded border border-border/20">
                Layer dinonaktifkan
              </div>
            )}
          </div>

          {/* Layer 2: Harga Promo */}
          <div className={`p-3 rounded-xl border transition-all space-y-2 ${
            pricingLayersConfig.layerPromo ? 'bg-secondary/70 border-border' : 'bg-secondary/20 border-dashed border-border/40 opacity-60'
          }`}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1">
                2. Harga Promo
                <span className="text-muted-foreground text-[10px]">(dicoret)</span>
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground font-mono">{pricingLayersConfig.layerPromo ? 'ON' : 'OFF'}</span>
                <Switch
                  checked={pricingLayersConfig.layerPromo}
                  onCheckedChange={(c) => toggleLayer('layerPromo', c)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
            {pricingLayersConfig.layerPromo ? (
              <Input
                type="number"
                placeholder="Rp (cth: 249000)"
                value={hargaPromo}
                onChange={(e) => onChange('hargaPromo', e.target.value)}
                className="bg-background border-border text-sm"
              />
            ) : (
              <div className="text-[11px] text-muted-foreground/60 italic py-2 text-center bg-background/30 rounded border border-border/20">
                Layer dinonaktifkan
              </div>
            )}
          </div>

          {/* Layer 3: Harga Final */}
          <div className={`p-3 rounded-xl border transition-all space-y-2 ${
            pricingLayersConfig.layerFinal ? 'bg-secondary/70 border-primary/40 ring-1 ring-primary/20' : 'bg-secondary/20 border-dashed border-border/40 opacity-60'
          }`}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-primary flex items-center gap-1">
                3. Harga Diskon
                <span className="text-[10px] font-normal text-muted-foreground">(Beli Sekarang)</span>
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground font-mono">{pricingLayersConfig.layerFinal ? 'ON' : 'OFF'}</span>
                <Switch
                  checked={pricingLayersConfig.layerFinal}
                  onCheckedChange={(c) => toggleLayer('layerFinal', c)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
            {pricingLayersConfig.layerFinal ? (
              <Input
                type="number"
                placeholder="Rp (cth: 99000)"
                value={hargaFinal}
                onChange={(e) => onChange('hargaFinal', e.target.value)}
                className="bg-background border-border font-bold text-primary text-sm"
              />
            ) : (
              <div className="text-[11px] text-muted-foreground/60 italic py-2 text-center bg-background/30 rounded border border-border/20">
                Layer dinonaktifkan
              </div>
            )}
          </div>
        </div>

        {/* Keterangan Diskon */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Keterangan Diskon (Opsional)</label>
          <Input
            placeholder='Contoh: Kalo kamu checkout hari ini pakai kode "DISKON50"'
            value={keteranganDiskon}
            onChange={(e) => onChange('keteranganDiskon', e.target.value)}
            className="bg-secondary border-border"
          />
        </div>

        {/* Pricing Preview - Dynamically updates according to ON/OFF toggles */}
        <div className="rounded-xl bg-secondary/80 border border-border p-4 text-center space-y-2 shadow-inner">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Preview Struktur Harga Landing Page</p>
          </div>

          {pricingLayersConfig.layerNormal && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase">Harga Normal</p>
              <p className="text-lg text-destructive line-through font-bold">
                {hargaNormal ? `Rp ${Number(hargaNormal).toLocaleString('id-ID')}` : 'Rp -'}
              </p>
            </div>
          )}

          {pricingLayersConfig.layerPromo && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase mt-1">Harga Promo</p>
              <p className="text-base text-muted-foreground line-through font-semibold">
                {hargaPromo ? `Rp ${Number(hargaPromo).toLocaleString('id-ID')}` : 'Rp -'}
              </p>
            </div>
          )}

          {keteranganDiskon && (
            <p className="text-xs text-amber-500 font-medium my-1">{keteranganDiskon}</p>
          )}

          {pricingLayersConfig.layerFinal && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase mt-1">
                🔥 {pricingLayersConfig.layerNormal || pricingLayersConfig.layerPromo ? 'Harga Diskon untuk kamu yang beli sekarang' : 'Harga Spesial'}
              </p>
              <p className="text-2xl sm:text-3xl text-primary font-black">
                {hargaFinal ? `Rp ${Number(hargaFinal).toLocaleString('id-ID')}` : 'Rp -'}
              </p>
            </div>
          )}

          {!pricingLayersConfig.layerNormal && !pricingLayersConfig.layerPromo && !pricingLayersConfig.layerFinal && (
            <p className="text-xs text-muted-foreground italic py-3">Semua layer harga nonaktif. Aktifkan minimal satu layer di atas.</p>
          )}
        </div>
      </div>

      {/* Bonus Section */}
      <div className="space-y-3 pt-3 border-t border-border/60">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">🎁 Bonus Tambahan (Opsional)</label>
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
        <label className="text-sm font-medium text-foreground">Deskripsi & Benefit Produk</label>
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
