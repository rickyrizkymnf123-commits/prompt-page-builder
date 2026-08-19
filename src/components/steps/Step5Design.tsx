import { StepCard } from '@/components/StepCard';
import { gayaDesainOptions, colorSwatchList, visualThemes, fontPresets, animationOptions } from '@/data/formOptions';
import { GroupedSelect } from '@/components/GroupedSelect';
import { DesignTypographyConfig } from '@/types/form';
import { Palette, Type, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { translations, Language } from '@/utils/i18n';

interface Props {
  warnaBrand: string;
  warnaBrandCustom?: string;
  tema: string;
  gayaDesain: string;
  typography?: DesignTypographyConfig;
  language?: Language;
  onChange: (field: string, value: any) => void;
  onChangeTypography?: (typography: DesignTypographyConfig) => void;
}

export function Step5Design({
  warnaBrand,
  warnaBrandCustom = '#6c63ff',
  tema,
  gayaDesain,
  typography = { fontFamily: 'Plus Jakarta Sans', buttonSize: 'large', entranceAnimation: 'fade-in' },
  language = 'id',
  onChange,
  onChangeTypography,
}: Props) {
  const t = translations[language] || translations.id;

  const handleSelectColor = (swatchName: string, hex: string) => {
    onChange('warnaBrand', swatchName);
    onChange('warnaBrandCustom', hex);
  };

  const updateTypo = (field: keyof DesignTypographyConfig, value: string) => {
    const updated = { ...typography, [field]: value };
    onChange('typography', updated);
    if (onChangeTypography) {
      onChangeTypography(updated);
    }
  };

  return (
    <StepCard step={5} title={t.step5Title}>
      {/* 1. VISUAL COLOR SWATCHES & CUSTOM PICKER */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-primary" />
            {t.colorBrandLabel}
          </label>
          <span className="text-[11px] font-mono text-primary font-bold">{warnaBrandCustom || '#6c63ff'}</span>
        </div>

        {/* Color Palette Swatches */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {colorSwatchList.map((swatch) => {
            const isSelected = (warnaBrandCustom && swatch.hex)
              ? warnaBrandCustom.toLowerCase() === swatch.hex.toLowerCase()
              : warnaBrand === swatch.name;

            return (
              <button
                key={swatch.name}
                type="button"
                onClick={() => handleSelectColor(swatch.name, swatch.hex)}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/50 bg-primary/10 shadow-md font-bold'
                    : 'border-border bg-secondary/40 hover:bg-secondary hover:border-primary/40'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full shadow-inner flex items-center justify-center border border-white/20 transition-transform group-hover:scale-105"
                  style={{ backgroundColor: swatch.hex }}
                >
                  {isSelected && <Check className="w-4 h-4 text-white drop-shadow" />}
                </div>
                <span className="text-[10px] font-semibold text-foreground text-center truncate w-full">
                  {swatch.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Color Picker Input */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/50 border border-border">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={warnaBrandCustom || '#6c63ff'}
              onChange={(e) => handleSelectColor('Custom Color', e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
            />
            <span className="text-xs font-semibold text-foreground">{t.customColorLabel}</span>
          </div>
          <Input
            value={warnaBrandCustom || '#6c63ff'}
            onChange={(e) => handleSelectColor('Custom Color', e.target.value)}
            placeholder="#6c63ff"
            className="h-8 max-w-[120px] bg-background text-xs font-mono"
          />
          <span className="text-[11px] text-muted-foreground hidden sm:inline">
            {language === 'en' ? 'Pick custom hex code matching your brand' : 'Pilih warna persis sesuai brand / logo produk Anda'}
          </span>
        </div>
      </div>

      {/* 2. VISUAL THEME PREVIEW CARDS */}
      <div className="space-y-2.5 pt-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {t.themeStyleLabel}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {visualThemes.map((vt) => {
            const isSelected = tema === vt.id || (vt.id === 'Dark Mode Clean' && (!tema || tema === 'Default' || tema === 'Dark'));
            return (
              <button
                key={vt.id}
                type="button"
                onClick={() => onChange('tema', vt.id)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/40 bg-secondary shadow-md'
                    : 'border-border bg-secondary/40 hover:bg-secondary hover:border-primary/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs sm:text-sm text-foreground">{vt.title}</span>
                  {isSelected && <Check className="w-4 h-4 text-primary" />}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{vt.desc}</p>
                <div
                  className="h-1.5 w-full rounded-full mt-2"
                  style={{ background: vt.accentColor }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. GAYA DESAIN / ARCHETYPE */}
      <div className="pt-2">
        <GroupedSelect
          label={t.archetypeLabel}
          placeholder={language === 'en' ? 'Select visual style (Apple Style, 3D Bento, Linear)...' : 'Pilih gaya desain (Apple Style, Minimalist, Bento Grid)...'}
          value={gayaDesain}
          onValueChange={(v) => onChange('gayaDesain', v)}
          options={gayaDesainOptions}
        />
      </div>

      {/* 4. TIPOGRAFI, UKURAN TOMBOL & ANIMASI */}
      <div className="space-y-3 pt-3 border-t border-border/60">
        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
          <Type className="w-4 h-4 text-primary" />
          {language === 'en' ? 'Typography & Animations' : 'Tipografi Font & Animasi Teks'}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Font Family */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">Google Font</label>
            <select
              value={typography.fontFamily || 'Plus Jakarta Sans'}
              onChange={(e) => updateTypo('fontFamily', e.target.value)}
              className="w-full h-9 rounded-xl bg-secondary border border-border px-2.5 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
            >
              {fontPresets.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Button Size */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">
              {language === 'en' ? 'CTA Button Size' : 'Ukuran Tombol CTA'}
            </label>
            <select
              value={typography.buttonSize || 'large'}
              onChange={(e) => updateTypo('buttonSize', e.target.value)}
              className="w-full h-9 rounded-xl bg-secondary border border-border px-2.5 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
            >
              <option value="normal">{language === 'en' ? 'Normal (44px)' : 'Normal (Standar 44px)'}</option>
              <option value="large">{language === 'en' ? 'Large / Prominent (52px)' : 'Besar / Prominent (52px)'}</option>
              <option value="full">{language === 'en' ? 'Full-Width Mobile (100%)' : 'Full-Width Mobile (100% Layar)'}</option>
            </select>
          </div>

          {/* Entrance Animation */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">
              {language === 'en' ? 'Entrance Animation' : 'Animasi Masuk Section'}
            </label>
            <select
              value={typography.entranceAnimation || 'fade-in'}
              onChange={(e) => updateTypo('entranceAnimation', e.target.value)}
              className="w-full h-9 rounded-xl bg-secondary border border-border px-2.5 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
            >
              {animationOptions.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </StepCard>
  );
}
