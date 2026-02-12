import { StepCard } from '@/components/StepCard';
import { GroupedSelect } from '@/components/GroupedSelect';
import { tipeProdukOptions, tujuanUtamaOptions } from '@/data/formOptions';

interface Props {
  tipeProduk: string;
  tujuanUtama: string;
  onChange: (field: string, value: string) => void;
}

export function Step2Product({ tipeProduk, tujuanUtama, onChange }: Props) {
  return (
    <StepCard step={2} title="Produk & Tujuan">
      <GroupedSelect
        label="Tipe Produk"
        placeholder="Pilih tipe produk..."
        value={tipeProduk}
        onValueChange={(v) => onChange('tipeProduk', v)}
        options={tipeProdukOptions}
      />
      <GroupedSelect
        label="Tujuan Utama"
        placeholder="Pilih tujuan utama..."
        value={tujuanUtama}
        onValueChange={(v) => onChange('tujuanUtama', v)}
        options={tujuanUtamaOptions}
      />
    </StepCard>
  );
}
