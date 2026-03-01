import { useState } from 'react';
import { StepCard } from '@/components/StepCard';
import { GroupedSelect } from '@/components/GroupedSelect';
import { Input } from '@/components/ui/input';
import { tipeProdukOptions, tujuanUtamaOptions } from '@/data/formOptions';

interface Props {
  tipeProduk: string;
  tujuanUtama: string;
  onChange: (field: string, value: string) => void;
}

export function Step2Product({ tipeProduk, tujuanUtama, onChange }: Props) {
  const [isManualTipe, setIsManualTipe] = useState(false);

  const handleTipeChange = (v: string) => {
    if (v === 'Lainnya (Isi Manual)') {
      setIsManualTipe(true);
      onChange('tipeProduk', '');
    } else {
      setIsManualTipe(false);
      onChange('tipeProduk', v);
    }
  };

  return (
    <StepCard step={2} title="Produk & Tujuan">
      <GroupedSelect
        label="Tipe Produk"
        placeholder="Pilih tipe produk..."
        value={isManualTipe ? 'Lainnya (Isi Manual)' : tipeProduk}
        onValueChange={handleTipeChange}
        options={tipeProdukOptions}
      />
      {isManualTipe && (
        <Input
          placeholder="Tulis tipe produk kamu..."
          value={tipeProduk}
          onChange={(e) => onChange('tipeProduk', e.target.value)}
          className="bg-secondary border-border mt-1"
          autoFocus
        />
      )}
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
