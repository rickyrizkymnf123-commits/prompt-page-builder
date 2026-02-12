import { StepCard } from '@/components/StepCard';
import { GroupedSelect } from '@/components/GroupedSelect';
import { levelAwarenessOptions, targetAudienceOptions } from '@/data/formOptions';

interface Props {
  levelAwareness: string;
  targetAudience: string;
  onChange: (field: string, value: string) => void;
}

export function Step3Target({ levelAwareness, targetAudience, onChange }: Props) {
  return (
    <StepCard step={3} title="Target Market">
      <GroupedSelect
        label="Level Awareness"
        placeholder="Pilih level awareness..."
        value={levelAwareness}
        onValueChange={(v) => onChange('levelAwareness', v)}
        options={levelAwarenessOptions}
      />
      <GroupedSelect
        label="Target Audience"
        placeholder="Pilih target audience..."
        value={targetAudience}
        onValueChange={(v) => onChange('targetAudience', v)}
        options={targetAudienceOptions}
      />
    </StepCard>
  );
}
