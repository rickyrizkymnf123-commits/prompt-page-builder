import { StepCard } from '@/components/StepCard';
import { GroupedSelect } from '@/components/GroupedSelect';
import { warnaBrandOptions, temaOptions, gayaDesainOptions } from '@/data/formOptions';

interface Props {
  warnaBrand: string;
  tema: string;
  gayaDesain: string;
  onChange: (field: string, value: string) => void;
}

export function Step5Design({ warnaBrand, tema, gayaDesain, onChange }: Props) {
  return (
    <StepCard step={5} title="Visual & Desain">
      <div className="grid grid-cols-2 gap-4">
        <GroupedSelect
          label="Warna Brand"
          placeholder="Pilih warna..."
          value={warnaBrand}
          onValueChange={(v) => onChange('warnaBrand', v)}
          options={warnaBrandOptions}
        />
        <GroupedSelect
          label="Tema"
          placeholder="Pilih tema..."
          value={tema}
          onValueChange={(v) => onChange('tema', v)}
          options={temaOptions}
        />
      </div>
      <GroupedSelect
        label="Gaya Desain"
        placeholder="Pilih gaya desain..."
        value={gayaDesain}
        onValueChange={(v) => onChange('gayaDesain', v)}
        options={gayaDesainOptions}
      />
    </StepCard>
  );
}
