import { StepCard } from '@/components/StepCard';
import { levelAwarenessOptions, targetAudienceOptions } from '@/data/formOptions';
import { LiquidGlassModal } from '@/components/ui/LiquidGlassModal';
import { GroupedSelect } from '@/components/GroupedSelect';

interface Props {
  levelAwareness: string;
  targetAudience: string;
  onChange: (field: string, value: string) => void;
}

export function Step3Target({ levelAwareness, targetAudience, onChange }: Props) {
  return (
    <StepCard step={3} title="Target Market & Awareness">
      <div className="space-y-3.5">
        <GroupedSelect
          label="Level Awareness Calon Pembeli"
          placeholder="Pilih level awareness..."
          value={levelAwareness}
          onValueChange={(v) => onChange('levelAwareness', v)}
          options={levelAwarenessOptions}
        />

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Target Audience Spesifik
          </label>
          <LiquidGlassModal
            title="Pilih Target Audience"
            placeholder="Pilih target audience atau tulis manual..."
            value={targetAudience}
            options={targetAudienceOptions}
            onSelect={(val) => onChange('targetAudience', val)}
          />
        </div>
      </div>
    </StepCard>
  );
}
