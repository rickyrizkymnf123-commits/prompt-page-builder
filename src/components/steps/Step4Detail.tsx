import { StepCard } from '@/components/StepCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  namaProduk: string;
  hargaNormal: string;
  hargaPromo: string;
  deskripsiBenefit: string;
  ctaUtama: string;
  onChange: (field: string, value: string) => void;
}

export function Step4Detail({ namaProduk, hargaNormal, hargaPromo, deskripsiBenefit, ctaUtama, onChange }: Props) {
  return (
    <StepCard step={4} title="Detail Produk & Copy">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Nama Produk <span className="text-destructive">*</span></label>
        <Input
          placeholder="Masukkan nama produk..."
          value={namaProduk}
          onChange={(e) => onChange('namaProduk', e.target.value)}
          className="bg-secondary border-border"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Harga Normal</label>
          <Input
            type="number"
            placeholder="Rp"
            value={hargaNormal}
            onChange={(e) => onChange('hargaNormal', e.target.value)}
            className="bg-secondary border-border"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Harga Promo</label>
          <Input
            type="number"
            placeholder="Rp"
            value={hargaPromo}
            onChange={(e) => onChange('hargaPromo', e.target.value)}
            className="bg-secondary border-border"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Deskripsi & Benefit</label>
        <Textarea
          placeholder="Deskripsikan produk dan benefit utamanya..."
          value={deskripsiBenefit}
          onChange={(e) => onChange('deskripsiBenefit', e.target.value)}
          className="bg-secondary border-border min-h-[100px]"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">CTA Utama</label>
        <Input
          placeholder='Contoh: "Daftar Sekarang"'
          value={ctaUtama}
          onChange={(e) => onChange('ctaUtama', e.target.value)}
          className="bg-secondary border-border"
        />
      </div>
    </StepCard>
  );
}
