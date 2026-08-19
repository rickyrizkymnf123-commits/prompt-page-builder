import { StepCard } from '@/components/StepCard';
import { frameworkOptions, gayaBahasaOptions } from '@/data/formOptions';
import { FrameworkGuideModal, frameworkDetails } from '@/components/framework/FrameworkGuideModal';
import { LiquidGlassModal } from '@/components/ui/LiquidGlassModal';
import { Lightbulb, BookOpen, MessageSquare } from 'lucide-react';
import { translations, Language } from '@/utils/i18n';

interface Props {
  framework: string;
  gayaBahasa: string;
  language?: Language;
  onChange: (field: string, value: string) => void;
}

export function Step1Framework({ framework, gayaBahasa, language = 'id', onChange }: Props) {
  const t = translations[language] || translations.id;
  const currentDetail = frameworkDetails.find(
    f => f.name === framework || framework?.startsWith(f.name.split(' ')[0])
  );

  return (
    <StepCard step={1} title={t.step1Title}>
      <div className="space-y-3.5">
        {/* Model Framework Copywriting */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 flex-wrap pb-0.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t.frameworkLabel}
            </label>
            <FrameworkGuideModal
              selectedFramework={framework}
              onSelectFramework={(name) => onChange('framework', name)}
            />
          </div>

          <LiquidGlassModal
            title={t.frameworkLabel}
            placeholder={t.frameworkPlaceholder}
            value={framework}
            options={frameworkOptions}
            onSelect={(val) => onChange('framework', val)}
            allowManual={false}
            icon={<BookOpen className="w-4 h-4" />}
          />

          {/* Dynamic Framework Explanation Callout */}
          {currentDetail && (
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/25 space-y-1.5 animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Struktur: {currentDetail.structure}</span>
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed">
                {currentDetail.summary}
              </p>
              <p className="text-[11px] text-muted-foreground italic">
                🎯 Cocok untuk: {currentDetail.bestFor}
              </p>
            </div>
          )}
        </div>

        {/* Gaya Bahasa / Tone of Voice */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t.gayaBahasaLabel}
          </label>
          <LiquidGlassModal
            title={t.gayaBahasaLabel}
            placeholder={t.gayaBahasaPlaceholder}
            value={gayaBahasa}
            options={gayaBahasaOptions}
            onSelect={(val) => onChange('gayaBahasa', val)}
            allowManual={false}
            icon={<MessageSquare className="w-4 h-4" />}
          />
        </div>
      </div>
    </StepCard>
  );
}
