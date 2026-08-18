import { StepCard } from '@/components/StepCard';
import { GroupedSelect } from '@/components/GroupedSelect';
import { frameworkOptions, gayaBahasaOptions } from '@/data/formOptions';
import { FrameworkGuideModal, frameworkDetails } from '@/components/framework/FrameworkGuideModal';
import { Lightbulb } from 'lucide-react';

interface Props {
  framework: string;
  gayaBahasa: string;
  onChange: (field: string, value: string) => void;
}

export function Step1Framework({ framework, gayaBahasa, onChange }: Props) {
  const currentDetail = frameworkDetails.find(
    f => f.name === framework || framework?.startsWith(f.name.split(' ')[0])
  );

  return (
    <StepCard step={1} title="Framework & Tone">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Model Framework Copywriting
          </label>
          <FrameworkGuideModal
            selectedFramework={framework}
            onSelectFramework={(name) => onChange('framework', name)}
          />
        </div>

        <GroupedSelect
          label=""
          placeholder="Pilih model framework (cth: PAS, AIDCA, StoryBrand)..."
          value={framework}
          onValueChange={(v) => onChange('framework', v)}
          options={frameworkOptions}
        />

        {/* Dynamic Framework Explanation Callout */}
        {currentDetail && (
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/25 space-y-1.5 animate-in fade-in duration-200">
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

      <div className="pt-2">
        <GroupedSelect
          label="Gaya Bahasa / Tone of Voice"
          placeholder="Pilih gaya bahasa (cth: Friendly, Bold, Luxury)..."
          value={gayaBahasa}
          onValueChange={(v) => onChange('gayaBahasa', v)}
          options={gayaBahasaOptions}
        />
      </div>
    </StepCard>
  );
}
