import { useState } from 'react';
import { StepCard } from '@/components/StepCard';
import { Input } from '@/components/ui/input';
import { tipeProdukOptions, tujuanUtamaOptions } from '@/data/formOptions';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GroupedSelect } from '@/components/GroupedSelect';

const MANUAL_VALUE = '__tipeproduk_manual__';

// Flatten all predefined options
const allPredefined = tipeProdukOptions.flatMap(g => g.options).filter(o => o !== 'Lainnya (Isi Manual)');

interface Props {
  tipeProduk: string;
  tujuanUtama: string;
  onChange: (field: string, value: string) => void;
}

export function Step2Product({ tipeProduk, tujuanUtama, onChange }: Props) {
  // Determine if manual mode based on whether current value is NOT in predefined list
  const isPredefined = allPredefined.includes(tipeProduk);
  const [isManual, setIsManual] = useState(!isPredefined && tipeProduk !== '');

  const selectValue = isManual ? MANUAL_VALUE : tipeProduk;

  const handleSelect = (val: string) => {
    if (val === MANUAL_VALUE) {
      setIsManual(true);
      onChange('tipeProduk', '');
    } else {
      setIsManual(false);
      onChange('tipeProduk', val);
    }
  };

  return (
    <StepCard step={2} title="Produk & Tujuan">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Tipe Produk</label>
        <Select value={selectValue} onValueChange={handleSelect}>
          <SelectTrigger className="w-full bg-secondary border-border">
            <SelectValue placeholder="Pilih tipe produk..." />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border z-50 max-h-[300px]">
            {tipeProdukOptions.map((group) => (
              <SelectGroup key={group.group}>
                <SelectLabel className="text-accent font-bold text-xs uppercase tracking-wide pt-3 pb-1">
                  {group.group}
                </SelectLabel>
                {group.options.map((opt) => {
                  const isLainnya = opt === 'Lainnya (Isi Manual)';
                  return (
                    <SelectItem key={opt} value={isLainnya ? MANUAL_VALUE : opt}>
                      {opt}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
        {isManual && (
          <Input
            placeholder="Tulis tipe produk kamu..."
            value={tipeProduk}
            onChange={(e) => onChange('tipeProduk', e.target.value)}
            className="bg-secondary border-border"
            autoFocus
          />
        )}
      </div>
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
