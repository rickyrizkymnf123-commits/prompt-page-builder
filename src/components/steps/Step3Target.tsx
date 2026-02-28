import { useState } from 'react';
import { StepCard } from '@/components/StepCard';
import { GroupedSelect } from '@/components/GroupedSelect';
import { Input } from '@/components/ui/input';
import { levelAwarenessOptions, targetAudienceOptions } from '@/data/formOptions';

interface Props {
  levelAwareness: string;
  targetAudience: string;
  onChange: (field: string, value: string) => void;
}

export function Step3Target({ levelAwareness, targetAudience, onChange }: Props) {
  const [isManualTarget, setIsManualTarget] = useState(targetAudience !== '' && !targetAudienceOptions.some(g => g.options.includes(targetAudience)));

  const handleTargetChange = (v: string) => {
    if (v === 'Lainnya (Isi Manual)') {
      setIsManualTarget(true);
      onChange('targetAudience', '');
    } else {
      setIsManualTarget(false);
      onChange('targetAudience', v);
    }
  };

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
        value={isManualTarget ? 'Lainnya (Isi Manual)' : targetAudience}
        onValueChange={handleTargetChange}
        options={targetAudienceOptions}
      />
      {isManualTarget && (
        <Input
          placeholder="Tulis target audience kamu..."
          value={targetAudience}
          onChange={(e) => onChange('targetAudience', e.target.value)}
          className="bg-secondary border-border"
          autoFocus
        />
      )}
    </StepCard>
  );
}
