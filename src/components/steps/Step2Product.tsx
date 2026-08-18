import { StepCard } from '@/components/StepCard';
import { tipeProdukOptions, tujuanUtamaOptions, trafficCategoryOptions } from '@/data/formOptions';
import { LiquidGlassModal } from '@/components/ui/LiquidGlassModal';
import { Input } from '@/components/ui/input';

interface Props {
  tipeProduk: string;
  tujuanUtama: string;
  trafficCategory?: string;
  onChange: (field: string, value: string) => void;
}

export function Step2Product({
  tipeProduk,
  tujuanUtama,
  trafficCategory = 'General / All Traffic Channels',
  onChange,
}: Props) {
  return (
    <StepCard step={2} title="Produk, Tujuan & Saluran Traffic">
      <div className="space-y-3.5">
        {/* Tipe Produk */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Tipe Produk / Model Bisnis
          </label>
          <LiquidGlassModal
            title="Pilih Tipe Produk"
            placeholder="Klik untuk memilih tipe produk / isi manual..."
            value={tipeProduk}
            options={tipeProdukOptions}
            onSelect={(val) => onChange('tipeProduk', val)}
          />
        </div>

        {/* Tujuan Utama */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Tujuan Utama Landing Page
          </label>
          <LiquidGlassModal
            title="Pilih Tujuan Utama"
            placeholder="Pilih tujuan konversi (cth: Sales, Lead Gen, WA Chat)..."
            value={tujuanUtama}
            options={tujuanUtamaOptions}
            onSelect={(val) => onChange('tujuanUtama', val)}
          />
        </div>

        {/* Saluran Traffic / Iklan */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Target Saluran Iklan / Traffic (Opsional)
          </label>
          <LiquidGlassModal
            title="Pilih Target Saluran Traffic"
            placeholder="Pilih channel iklan (Meta Ads, TikTok Ads, CTWA, Google)..."
            value={trafficCategory}
            options={trafficCategoryOptions}
            onSelect={(val) => onChange('trafficCategory', val)}
            allowManual={false}
          />
        </div>
      </div>
    </StepCard>
  );
}
