import { StepCard } from '@/components/StepCard';
import { GroupedSelect } from '@/components/GroupedSelect';
import { gayaDesainOptions } from '@/data/formOptions';

interface Props {
  gayaDesain: string;
  onChange: (field: string, value: string) => void;
}

export function Step5Design({ gayaDesain, onChange }: Props) {
  return (
    <StepCard step={5} title="Gaya Desain">
      <GroupedSelect
        label="Pilih Gaya Desain"
        placeholder="Pilih gaya desain..."
        value={gayaDesain}
        onValueChange={(v) => onChange('gayaDesain', v)}
        options={gayaDesainOptions}
      />
    </StepCard>
  );
}
