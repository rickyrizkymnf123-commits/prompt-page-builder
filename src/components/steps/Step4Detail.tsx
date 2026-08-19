import { useState } from 'react';
import { StepCard } from '@/components/StepCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BonusItem, PricingLayersConfig, TieredPricingConfig, TierItem, CtaModeConfig } from '@/types/form';
import { Switch } from '@/components/ui/switch';
import { CheckCircle2, Info, MessageSquare, Plus, Trash2, Layers, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { translations, Language } from '@/utils/i18n';

const ctaOptions = [
  'Beli Sekarang', 'Daftar Sekarang', 'Gabung Jadi Agen Sekarang', 'Download Aplikasi Sekarang',
  'Konsultasi Gratis via WhatsApp', 'Download Sekarang (Gratis)', 'Amankan Slot', 'Mulai Sekarang',
  'Apply Now (Daftar)', 'Get Quote (Minta Penawaran)', 'Start Free Trial', 'Join Waitlist',
];

interface Props {
  namaProduk: string;
  hargaNormal: string;
  hargaPromo: string;
  hargaFinal: string;
  keteranganDiskon: string;
  pricingLayersConfig?: PricingLayersConfig;
  tieredPricing?: TieredPricingConfig;
  ctaMode?: CtaModeConfig;
  bonusList: BonusItem[];
  deskripsiBenefit: string;
  ctaUtama: string;
  language?: Language;
  onChange: (field: string, value: any) => void;
  onChangeBonusList: (list: BonusItem[]) => void;
  onChangeTieredPricing?: (tiered: TieredPricingConfig) => void;
  onChangeCtaMode?: (ctaMode: CtaModeConfig) => void;
}

export function Step4Detail({
  namaProduk,
  hargaNormal,
  hargaPromo,
  hargaFinal,
  keteranganDiskon,
  pricingLayersConfig = { noPriceMode: false, layerNormal: true, layerPromo: true, layerFinal: true },
  tieredPricing = {
    enabled: false,
    tiers: [
      { name: 'Batch 1 (Early Bird)', price: '99000', originalPrice: '299000', quota: 'Sisa 5 Slot', badge: '🔥 Termurah' },
      { name: 'Batch 2 (Reguler)', price: '149000', originalPrice: '299000', quota: 'Kuota 50 Slot', badge: 'Populer' },
      { name: 'Batch 3 (Normal / H-1)', price: '249000', originalPrice: '299000', quota: 'Harga Naik', badge: 'Terakhir' },
    ],
  },
  ctaMode = {
    type: 'button',
    buttonText: 'Beli Sekarang',
    waNumber: '6281234567890',
    waMessage: 'Halo admin, saya ingin memesan produk ini sekarang. Apakah masih ada promo?',
    micrositeUrl: '',
    leadFormFields: { name: true, wa: true, email: true, note: false, packageSelect: true, buttonText: 'Kirim & Dapatkan Akses' },
  },
  bonusList,
  deskripsiBenefit,
  ctaUtama,
  language = 'id',
  onChange,
  onChangeBonusList,
  onChangeTieredPricing,
  onChangeCtaMode,
}: Props) {
  const t = translations[language] || translations.id;
  const isNoPrice = !!pricingLayersConfig.noPriceMode;

  const safeList = bonusList || [];
  const addBonus = () => onChangeBonusList([...safeList, { nama: '', hargaAsli: '' }]);
  const removeBonus = (i: number) => onChangeBonusList(safeList.filter((_, idx) => idx !== i));
  const updateBonus = (i: number, field: keyof BonusItem, value: string) => {
    const updated = [...safeList];
    updated[i] = { ...updated[i], [field]: value };
    onChangeBonusList(updated);
  };

  const toggleNoPriceMode = (checked: boolean) => {
    const updated = { ...pricingLayersConfig, noPriceMode: checked };
    onChange('pricingLayersConfig', updated);
  };

  const toggleLayer = (layer: 'layerNormal' | 'layerPromo' | 'layerFinal', checked: boolean) => {
    const updated = { ...pricingLayersConfig, [layer]: checked };
    onChange('pricingLayersConfig', updated);
  };

  const applyPreset = (preset: '3-layer' | '2-layer' | '1-layer' | 'no-price') => {
    if (preset === 'no-price') {
      onChange('pricingLayersConfig', { noPriceMode: true, layerNormal: false, layerPromo: false, layerFinal: false });
    } else if (preset === '3-layer') {
      onChange('pricingLayersConfig', { noPriceMode: false, layerNormal: true, layerPromo: true, layerFinal: true });
    } else if (preset === '2-layer') {
      onChange('pricingLayersConfig', { noPriceMode: false, layerNormal: true, layerPromo: false, layerFinal: true });
    } else if (preset === '1-layer') {
      onChange('pricingLayersConfig', { noPriceMode: false, layerNormal: false, layerPromo: false, layerFinal: true });
    }
  };

  const is3Layer = !isNoPrice && pricingLayersConfig.layerNormal && pricingLayersConfig.layerPromo && pricingLayersConfig.layerFinal;
  const is2Layer = !isNoPrice && pricingLayersConfig.layerNormal && !pricingLayersConfig.layerPromo && pricingLayersConfig.layerFinal;
  const is1Layer = !isNoPrice && !pricingLayersConfig.layerNormal && !pricingLayersConfig.layerPromo && pricingLayersConfig.layerFinal;

  // Tiered Pricing Helpers
  const toggleTieredPricing = (checked: boolean) => {
    const updated = { ...tieredPricing, enabled: checked };
    onChange('tieredPricing', updated);
    if (onChangeTieredPricing) {
      onChangeTieredPricing(updated);
    }
  };

  const addTier = () => {
    const currentTiers = tieredPricing.tiers || [];
    const updated = {
      ...tieredPricing,
      tiers: [
        ...currentTiers,
        {
          name: `Batch ${currentTiers.length + 1}`,
          price: '199000',
          originalPrice: '499000',
          quota: 'Sisa Kuota',
          badge: 'Promo',
        },
      ],
    };
    onChange('tieredPricing', updated);
    if (onChangeTieredPricing) onChangeTieredPricing(updated);
  };

  const removeTier = (idx: number) => {
    const updated = {
      ...tieredPricing,
      tiers: (tieredPricing.tiers || []).filter((_, i) => i !== idx),
    };
    onChange('tieredPricing', updated);
    if (onChangeTieredPricing) onChangeTieredPricing(updated);
  };

  const updateTier = (idx: number, field: keyof TierItem, value: string) => {
    const newTiers = [...(tieredPricing.tiers || [])];
    newTiers[idx] = { ...newTiers[idx], [field]: value };
    const updated = { ...tieredPricing, tiers: newTiers };
    onChange('tieredPricing', updated);
    if (onChangeTieredPricing) onChangeTieredPricing(updated);
  };

  // CTA mode helpers
  const setCtaType = (type: CtaModeConfig['type']) => {
    const updated = { ...ctaMode, type };
    onChange('ctaMode', updated);
    if (onChangeCtaMode) {
      onChangeCtaMode(updated);
    }
  };

  const updateCtaModeField = (field: keyof CtaModeConfig, value: any) => {
    const updated = { ...ctaMode, [field]: value };
    onChange('ctaMode', updated);
    if (onChangeCtaMode) {
      onChangeCtaMode(updated);
    }
  };

  const updateLeadFormField = (field: keyof CtaModeConfig['leadFormFields'], value: any) => {
    const updated = {
      ...ctaMode,
      leadFormFields: { ...ctaMode.leadFormFields, [field]: value },
    };
    onChange('ctaMode', updated);
    if (onChangeCtaMode) {
      onChangeCtaMode(updated);
    }
  };

  return (
    <StepCard step={4} title={t.step4Title}>
      <div className="space-y-2">
        <label className="text-sm font-bold text-foreground">
          {t.namaProdukLabel}
        </label>
        <Input
          placeholder={t.namaProdukPlaceholder}
          value={namaProduk}
          onChange={(e) => onChange('namaProduk', e.target.value)}
          className="bg-secondary border-border h-11 text-sm font-medium"
        />
      </div>

      {/* Pricing Section with No-Price Mode and Layer Controls */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-2">
          <div>
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              🏷️ {t.pricingStructureTitle}
            </label>
            <p className="text-xs text-muted-foreground">
              {language === 'en' ? 'Choose tiered pricing, layered prices, or no-price mode.' : 'Pilih model harga bertingkat, harga normal/promo, atau mode tanpa harga.'}
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-muted-foreground uppercase font-bold mr-1">Preset:</span>
            <button
              type="button"
              onClick={() => applyPreset('no-price')}
              className={`text-[11px] px-2.5 py-1 rounded-md font-medium border transition-all ${
                isNoPrice ? 'bg-amber-500 text-white border-amber-600 font-bold' : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              🚫 {language === 'en' ? 'No Price (Lead/Free)' : 'Tanpa Harga (Free/Lead)'}
            </button>
            <button
              type="button"
              onClick={() => applyPreset('3-layer')}
              className={`text-[11px] px-2.5 py-1 rounded-md font-medium border transition-all ${
                is3Layer ? 'bg-primary text-primary-foreground border-primary font-bold' : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              3 Layer
            </button>
            <button
              type="button"
              onClick={() => applyPreset('2-layer')}
              className={`text-[11px] px-2.5 py-1 rounded-md font-medium border transition-all ${
                is2Layer ? 'bg-primary text-primary-foreground border-primary font-bold' : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              2 Layer
            </button>
            <button
              type="button"
              onClick={() => applyPreset('1-layer')}
              className={`text-[11px] px-2.5 py-1 rounded-md font-medium border transition-all ${
                is1Layer ? 'bg-primary text-primary-foreground border-primary font-bold' : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              1 Layer
            </button>
          </div>
        </div>

        {/* Mode Tanpa Harga Banner / Switch */}
        <div className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
          isNoPrice ? 'bg-amber-500/10 border-amber-500/40' : 'bg-secondary/40 border-border'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isNoPrice ? 'bg-amber-500 text-white' : 'bg-secondary text-muted-foreground'
            }`}>
              <Info className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-foreground">
                {t.noPriceModeLabel}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {t.noPriceModeDesc}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-xs font-mono font-bold text-muted-foreground">{isNoPrice ? 'ON' : 'OFF'}</span>
            <Switch
              checked={isNoPrice}
              onCheckedChange={toggleNoPriceMode}
              className="data-[state=checked]:bg-amber-500"
            />
          </div>
        </div>

        {/* If Mode Tanpa Harga is ON */}
        {isNoPrice ? (
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center space-y-2">
            <CheckCircle2 className="w-6 h-6 text-amber-500 mx-auto" />
            <p className="text-sm font-bold text-foreground">
              {language === 'en' ? 'No-Price Mode Active' : 'Mode Tanpa Harga Aktif'}
            </p>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              {language === 'en'
                ? 'AI will focus on value, key benefits, free registration, and clear CTA actions without rupiah pricing.'
                : 'AI akan menyusun landing page fokus pada Keunggulan Layanan, Kemudahan Pendaftaran, dan Call-To-Action langsung tanpa tabel harga.'}
            </p>
          </div>
        ) : (
          <>
            {/* OPSI HARGA BERTINGKAT (TIERED / BATCH PRICING) */}
            <div className="p-3.5 rounded-xl bg-secondary/50 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-primary" />
                    {language === 'en' ? 'Tiered Pricing / Batch Pricing' : 'Harga Bertingkat / Batch Pricing (Early Bird, Batch 1, Batch 2)'}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {language === 'en' ? 'Enable if prices increase per batch or limited seats' : 'Aktifkan jika harga naik bertahap berdasarkan periode atau kuota pendaftar'}
                  </p>
                </div>
                <Switch
                  checked={!!tieredPricing.enabled}
                  onCheckedChange={toggleTieredPricing}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              {tieredPricing.enabled && (
                <div className="space-y-2.5 pt-2 animate-in fade-in duration-200">
                  {(tieredPricing.tiers || []).map((tier, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-background/80 border border-border flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                      <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <Input
                          placeholder="Nama Batch (cth: Batch 1 Early Bird)"
                          value={tier.name}
                          onChange={(e) => updateTier(idx, 'name', e.target.value)}
                          className="bg-secondary text-xs h-8"
                        />
                        <Input
                          type="number"
                          placeholder="Harga (Rp)"
                          value={tier.price}
                          onChange={(e) => updateTier(idx, 'price', e.target.value)}
                          className="bg-secondary text-xs font-bold text-primary h-8"
                        />
                        <Input
                          type="number"
                          placeholder="Harga Coret (Rp)"
                          value={tier.originalPrice || ''}
                          onChange={(e) => updateTier(idx, 'originalPrice', e.target.value)}
                          className="bg-secondary text-xs text-muted-foreground h-8"
                        />
                        <Input
                          placeholder="Status/Badge (cth: Sisa 5 Slot)"
                          value={tier.quota || ''}
                          onChange={(e) => updateTier(idx, 'quota', e.target.value)}
                          className="bg-secondary text-xs h-8 text-amber-500 font-medium"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTier(idx)}
                        className="text-destructive h-8 px-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}

                  <Button type="button" variant="outline" size="sm" onClick={addTier} className="text-xs h-7 gap-1">
                    <Plus className="w-3 h-3" /> {language === 'en' ? '+ Add Price Batch' : '+ Tambah Batch Harga'}
                  </Button>
                </div>
              )}
            </div>

            {/* Standard Layer Inputs (if not using tiered pricing) */}
            {!tieredPricing.enabled && (
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
                      placeholder="Rp (cth: 299000)"
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

                {/* Layer 3: Harga Final / Beli Sekarang */}
                <div className={`p-3 rounded-xl border transition-all space-y-2 ${
                  pricingLayersConfig.layerFinal ? 'bg-primary/10 border-primary/40 shadow-sm' : 'bg-secondary/20 border-dashed border-border/40 opacity-60'
                }`}>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-primary flex items-center gap-1">
                      3. Harga Final <span className="text-[10px] font-normal text-muted-foreground">(Beli Sekarang)</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-primary font-mono font-bold">{pricingLayersConfig.layerFinal ? 'ON' : 'OFF'}</span>
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
                      placeholder="Rp (cth: 149000)"
                      value={hargaFinal}
                      onChange={(e) => onChange('hargaFinal', e.target.value)}
                      className="bg-background border-primary/50 text-sm font-bold text-primary"
                    />
                  ) : (
                    <div className="text-[11px] text-muted-foreground/60 italic py-2 text-center bg-background/30 rounded border border-border/20">
                      Layer dinonaktifkan
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Keterangan Diskon */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-medium text-foreground">Keterangan Diskon / Kode Kupon (Opsional)</label>
              <Input
                placeholder='Contoh: Kalo kamu checkout hari ini pakai kode "DISKON50"'
                value={keteranganDiskon}
                onChange={(e) => onChange('keteranganDiskon', e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
          </>
        )}
      </div>

      {/* Bonus Section */}
      <div className="space-y-3 pt-3 border-t border-border/60">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">🎁 Bonus Tambahan / Fasilitas Gratis (Opsional)</label>
          <button type="button" onClick={addBonus} className="text-xs text-primary font-semibold hover:underline">+ Tambah Bonus / Fasilitas</button>
        </div>
        {safeList.map((bonus, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1 space-y-1">
              <Input placeholder={`Bonus ${i + 1}: Nama bonus/fasilitas...`} value={bonus.nama} onChange={(e) => updateBonus(i, 'nama', e.target.value)} className="bg-secondary border-border text-sm" />
            </div>
            <div className="w-32">
              <Input type="number" placeholder="Nilai (Rp)" value={bonus.hargaAsli} onChange={(e) => updateBonus(i, 'hargaAsli', e.target.value)} className="bg-secondary border-border text-sm" />
            </div>
            <button type="button" onClick={() => removeBonus(i)} className="mt-1 text-destructive hover:bg-destructive/10 rounded p-1 text-xs">🗑</button>
          </div>
        ))}
      </div>

      {/* Benefit Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{t.benefitDescLabel}</label>
        <Textarea
          placeholder={t.benefitDescPlaceholder}
          value={deskripsiBenefit}
          onChange={(e) => onChange('deskripsiBenefit', e.target.value)}
          className="bg-secondary border-border min-h-[90px]"
        />
      </div>

      {/* CTA ACTION MODE SELECTION (WA, LINK/MICROSITE, LEAD FORM, BUTTON) */}
      <div className="space-y-3 pt-3 border-t border-border/60">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" />
            {t.ctaModeTitle}
          </label>
          <span className="text-[11px] text-muted-foreground">Pilih jenis interaksi yang diinginkan</span>
        </div>

        {/* 4 Mode Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { type: 'button', label: 'Tombol Biasa', icon: '🔘', desc: 'Beli / Daftar standar' },
            { type: 'whatsapp', label: 'Direct WhatsApp', icon: '💬', desc: 'Chat WA + Auto Text' },
            { type: 'microsite', label: 'Microsite / Link', icon: '🔗', desc: 'Checkout Scalev/WinMe' },
            { type: 'lead_form', label: 'Lead Capture Form', icon: '📋', desc: 'Form nama, WA & email' },
          ].map((m) => {
            const isSelected = ctaMode.type === m.type;
            return (
              <button
                key={m.type}
                type="button"
                onClick={() => setCtaType(m.type as any)}
                className={`p-3 rounded-2xl border text-left transition-all relative cursor-pointer ${
                  isSelected
                    ? 'bg-primary/20 border-primary text-primary shadow-md ring-2 ring-primary/40 font-bold'
                    : 'bg-secondary/50 border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                }`}
              >
                <div className="text-xl mb-1">{m.icon}</div>
                <p className="font-bold text-xs text-foreground">{m.label}</p>
                <p className="text-[10px] text-muted-foreground line-clamp-1">{m.desc}</p>
                {isSelected && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Mode Specific Settings */}
        {ctaMode.type === 'whatsapp' && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2.5 animate-in fade-in duration-200">
            <p className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" /> Pengaturan Direct WhatsApp (CTWA)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground">Nomor WhatsApp Admin (kode negara 62)</label>
                <Input
                  placeholder="6281234567890"
                  value={ctaMode.waNumber || ''}
                  onChange={(e) => updateCtaModeField('waNumber', e.target.value)}
                  className="bg-background text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground">Teks Tombol WhatsApp</label>
                <Input
                  placeholder="Chat WhatsApp Sekarang"
                  value={ctaMode.buttonText || ''}
                  onChange={(e) => updateCtaModeField('buttonText', e.target.value)}
                  className="bg-background text-xs h-9"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-foreground">Auto-Text / Pesan Otomatis WhatsApp</label>
              <Input
                placeholder="Halo admin, saya ingin memesan produk ini sekarang..."
                value={ctaMode.waMessage || ''}
                onChange={(e) => updateCtaModeField('waMessage', e.target.value)}
                className="bg-background text-xs h-9"
              />
            </div>
          </div>
        )}

        {ctaMode.type === 'microsite' && (
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-2.5 animate-in fade-in duration-200">
            <p className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Pengaturan Link Microsite / Checkout URL
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground">URL Checkout / Microsite</label>
                <Input
                  placeholder="https://order.domain.com/checkout..."
                  value={ctaMode.micrositeUrl || ''}
                  onChange={(e) => updateCtaModeField('micrositeUrl', e.target.value)}
                  className="bg-background text-xs h-9 font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground">Teks Tombol</label>
                <Input
                  placeholder="Beli Sekarang"
                  value={ctaMode.buttonText || ''}
                  onChange={(e) => updateCtaModeField('buttonText', e.target.value)}
                  className="bg-background text-xs h-9"
                />
              </div>
            </div>
          </div>
        )}

        {ctaMode.type === 'lead_form' && (
          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-2.5 animate-in fade-in duration-200">
            <p className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Formulir Pendaftaran / Lead Capture Form
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={ctaMode.leadFormFields?.name}
                  onChange={(e) => updateLeadFormField('name', e.target.checked)}
                  className="rounded"
                />
                Input Nama
              </label>
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={ctaMode.leadFormFields?.wa}
                  onChange={(e) => updateLeadFormField('wa', e.target.checked)}
                  className="rounded"
                />
                Input WhatsApp
              </label>
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={ctaMode.leadFormFields?.email}
                  onChange={(e) => updateLeadFormField('email', e.target.checked)}
                  className="rounded"
                />
                Input Email
              </label>
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={ctaMode.leadFormFields?.packageSelect}
                  onChange={(e) => updateLeadFormField('packageSelect', e.target.checked)}
                  className="rounded"
                />
                Pilih Paket
              </label>
            </div>
          </div>
        )}

        {/* Teks Tombol Utama */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-bold text-foreground">Teks Tombol CTA Utama</label>
          <Input
            placeholder="Beli Sekarang"
            value={ctaUtama}
            onChange={(e) => onChange('ctaUtama', e.target.value)}
            className="bg-secondary border-border h-10 text-sm font-semibold"
          />
        </div>
      </div>
    </StepCard>
  );
}
