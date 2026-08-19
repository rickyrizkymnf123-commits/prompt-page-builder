import { StepCard } from '@/components/StepCard';
import { tipeProdukOptions, tujuanUtamaOptions, trafficCategoryOptions } from '@/data/formOptions';
import { LiquidGlassModal } from '@/components/ui/LiquidGlassModal';
import { Package, Target, Radio } from 'lucide-react';
import { translations, Language } from '@/utils/i18n';

interface Props {
  tipeProduk: string;
  tujuanUtama: string;
  trafficCategory?: string;
  language?: Language;
  onChange: (field: string, value: string) => void;
}

export function Step2Product({
  tipeProduk,
  tujuanUtama,
  trafficCategory = 'General / All Traffic Channels',
  language = 'id',
  onChange,
}: Props) {
  const t = translations[language] || translations.id;

  return (
    <StepCard step={2} title={t.step2Title}>
      <div className="space-y-3.5">
        {/* Tipe Produk */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t.tipeProdukLabel}
          </label>
          <LiquidGlassModal
            title={t.tipeProdukLabel}
            placeholder={t.tipeProdukPlaceholder}
            value={tipeProduk}
            options={tipeProdukOptions}
            onSelect={(val) => onChange('tipeProduk', val)}
            icon={<Package className="w-4 h-4" />}
          />
        </div>

        {/* Tujuan Utama */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t.tujuanUtamaLabel}
          </label>
          <LiquidGlassModal
            title={t.tujuanUtamaLabel}
            placeholder={t.tujuanUtamaPlaceholder}
            value={tujuanUtama}
            options={tujuanUtamaOptions}
            onSelect={(val) => onChange('tujuanUtama', val)}
            icon={<Target className="w-4 h-4" />}
          />
        </div>

        {/* Saluran Traffic / Iklan */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t.trafficCategoryLabel}
          </label>
          <LiquidGlassModal
            title={t.trafficCategoryLabel}
            placeholder={t.trafficCategoryPlaceholder}
            value={trafficCategory}
            options={trafficCategoryOptions}
            onSelect={(val) => onChange('trafficCategory', val)}
            allowManual={false}
            icon={<Radio className="w-4 h-4" />}
          />
        </div>
      </div>
    </StepCard>
  );
}
