import { StepCard } from '@/components/StepCard';
import { GroupedSelect } from '@/components/GroupedSelect';
import { frameworkOptions, gayaBahasaOptions } from '@/data/formOptions';

interface Props {
  framework: string;
  gayaBahasa: string;
  onChange: (field: string, value: string) => void;
}

export function Step1Framework({ framework, gayaBahasa, onChange }: Props) {
  return (
    <StepCard step={1} title="Framework & Tone">
      <GroupedSelect
        label="Pilih Framework"
        placeholder="Pilih framework..."
        value={framework}
        onValueChange={(v) => onChange('framework', v)}
        options={frameworkOptions}
      />
      <GroupedSelect
        label="Gaya Bahasa"
        placeholder="Pilih gaya bahasa..."
        value={gayaBahasa}
        onValueChange={(v) => onChange('gayaBahasa', v)}
        options={gayaBahasaOptions}
      />
    </StepCard>
  );
}
