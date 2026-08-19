import { StepCard } from '@/components/StepCard';
import { levelAwarenessOptions, targetAudienceOptions } from '@/data/formOptions';
import { LiquidGlassModal } from '@/components/ui/LiquidGlassModal';
import { Users, Eye } from 'lucide-react';
import { translations, Language } from '@/utils/i18n';

interface Props {
  levelAwareness: string;
  targetAudience: string;
  language?: Language;
  onChange: (field: string, value: string) => void;
}

const awarenessGrouped = [
  {
    group: 'Tingkat Kesadaran Masalah & Solusi',
    options: levelAwarenessOptions,
  },
];

export function Step3Target({ levelAwareness, targetAudience, language = 'id', onChange }: Props) {
  const t = translations[language] || translations.id;

  return (
    <StepCard step={3} title={t.step3Title}>
      <div className="space-y-3.5">
        {/* Level Awareness */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t.awarenessLabel}
          </label>
          <LiquidGlassModal
            title={t.awarenessLabel}
            placeholder={t.awarenessPlaceholder}
            value={levelAwareness}
            options={awarenessGrouped}
            onSelect={(val) => onChange('levelAwareness', val)}
            allowManual={false}
            icon={<Eye className="w-4 h-4" />}
          />
        </div>

        {/* Target Audience */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t.targetAudienceLabel}
          </label>
          <LiquidGlassModal
            title={t.targetAudienceLabel}
            placeholder={t.targetAudiencePlaceholder}
            value={targetAudience}
            options={targetAudienceOptions}
            onSelect={(val) => onChange('targetAudience', val)}
            icon={<Users className="w-4 h-4" />}
          />
        </div>
      </div>
    </StepCard>
  );
}
