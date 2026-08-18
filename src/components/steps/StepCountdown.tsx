import { StepCard } from '@/components/StepCard';
import { CountdownConfig, ScarcitySeatConfig } from '@/types/form';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Flame, Clock } from 'lucide-react';

interface Props {
  countdown: CountdownConfig;
  scarcitySeat?: ScarcitySeatConfig;
  onChange: (config: CountdownConfig) => void;
  onChangeScarcity?: (config: ScarcitySeatConfig) => void;
}

const colorPresets = [
  { bg: '#1a1a2e', text: '#ffffff', accent: '#ff4757', label: 'Dark Red' },
  { bg: '#0f0f23', text: '#00d2ff', accent: '#7928ca', label: 'Cyber' },
  { bg: '#ffffff', text: '#1a1a2e', accent: '#6c63ff', label: 'Light Purple' },
  { bg: '#1e3a5f', text: '#ffffff', accent: '#f39c12', label: 'Navy Gold' },
  { bg: '#2d1b69', text: '#ffffff', accent: '#e91e63', label: 'Purple Pink' },
];

export function StepCountdown({
  countdown,
  scarcitySeat = { enabled: false, label: '⚠️ SISA SLOT TERBATAS!', totalSeat: 50, sisaSeat: 7, autoDecrease: true },
  onChange,
  onChangeScarcity,
}: Props) {
  const update = (field: keyof CountdownConfig, value: any) => {
    onChange({ ...countdown, [field]: value });
  };

  const updateScarcity = (field: keyof ScarcitySeatConfig, value: any) => {
    if (onChangeScarcity) {
      onChangeScarcity({ ...scarcitySeat, [field]: value });
    }
  };

  const percentUsed = Math.min(100, Math.round(((scarcitySeat.totalSeat - scarcitySeat.sisaSeat) / (scarcitySeat.totalSeat || 1)) * 100));

  return (
    <StepCard step={10} title="Urgency & Scarcity ⏳">
      {/* 1. COUNTDOWN TIMER */}
      <div className="space-y-3 pb-3 border-b border-border/70">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              1. Countdown Timer Real-Time
            </p>
            <p className="text-xs text-muted-foreground">Timer hitung mundur waktu promo berakhir</p>
          </div>
          <Switch
            checked={countdown.enabled}
            onCheckedChange={(v) => update('enabled', v)}
            className="data-[state=checked]:bg-primary"
          />
        </div>

        {countdown.enabled && (
          <div className="space-y-3 pt-2 animate-in fade-in duration-200">
            {/* Label */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">Label di Atas Timer</label>
              <Input
                type="text"
                value={countdown.labelAtas}
                onChange={(e) => update('labelAtas', e.target.value)}
                className="bg-secondary text-sm"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">Durasi Countdown</label>
              <div className="grid grid-cols-4 gap-2">
                {(['hari', 'jam', 'menit', 'detik'] as const).map((field) => (
                  <div key={field} className="text-center">
                    <Input
                      type="number"
                      min={0}
                      max={field === 'hari' ? 365 : 59}
                      value={countdown[field]}
                      onChange={(e) => update(field, Math.max(0, parseInt(e.target.value) || 0))}
                      className="bg-secondary text-center text-sm font-bold"
                    />
                    <span className="text-[10px] text-muted-foreground mt-1 block capitalize font-mono">{field}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Presets */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">Preset Warna</label>
              <div className="flex flex-wrap gap-2">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => onChange({ ...countdown, bgColor: preset.bg, textColor: preset.text, accentColor: preset.accent })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      countdown.bgColor === preset.bg && countdown.accentColor === preset.accent
                        ? 'border-primary bg-primary/10 text-primary font-bold'
                        : 'border-border bg-secondary text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    <div className="flex gap-0.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: preset.bg }} />
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: preset.accent }} />
                    </div>
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Colors */}
            <div className="grid grid-cols-3 gap-2">
              <ColorField label="Background" value={countdown.bgColor} onChange={(v) => update('bgColor', v)} />
              <ColorField label="Teks" value={countdown.textColor} onChange={(v) => update('textColor', v)} />
              <ColorField label="Accent" value={countdown.accentColor} onChange={(v) => update('accentColor', v)} />
            </div>

            {/* Preview */}
            <div
              className="rounded-xl p-3.5 text-center shadow-md"
              style={{ background: countdown.bgColor, color: countdown.textColor }}
            >
              <p className="text-xs font-bold mb-2 tracking-wide" style={{ color: countdown.accentColor }}>{countdown.labelAtas}</p>
              <div className="flex justify-center gap-2.5">
                {[
                  { label: 'Hari', val: countdown.hari },
                  { label: 'Jam', val: countdown.jam },
                  { label: 'Menit', val: countdown.menit },
                  { label: 'Detik', val: countdown.detik },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center">
                    <span
                      className="text-xl sm:text-2xl font-black rounded-lg px-2.5 py-1 min-w-[42px]"
                      style={{ background: countdown.accentColor, color: countdown.textColor }}
                    >
                      {String(item.val).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] mt-1 opacity-70 font-mono">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. SISA SEAT & KUOTA TERBATAS WIDGET */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              2. Sisa Slot / Kuota Tersisa Widget (Scarcity)
            </p>
            <p className="text-xs text-muted-foreground">Bar indikator sisa kuota yang memicu tindakan cepat calon pembeli</p>
          </div>
          <Switch
            checked={scarcitySeat.enabled}
            onCheckedChange={(v) => updateScarcity('enabled', v)}
            className="data-[state=checked]:bg-amber-500"
          />
        </div>

        {scarcitySeat.enabled && (
          <div className="space-y-3 pt-1 animate-in fade-in duration-200">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">Label Scarcity</label>
              <Input
                type="text"
                value={scarcitySeat.label}
                onChange={(e) => updateScarcity('label', e.target.value)}
                placeholder="Contoh: ⚠️ SISA SLOT TERBATAS!"
                className="bg-secondary text-sm font-bold text-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">Total Kuota / Slot</label>
                <Input
                  type="number"
                  min={1}
                  value={scarcitySeat.totalSeat}
                  onChange={(e) => updateScarcity('totalSeat', Math.max(1, parseInt(e.target.value) || 1))}
                  className="bg-secondary text-sm font-bold text-center"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">Sisa Slot Sekarang</label>
                <Input
                  type="number"
                  min={1}
                  value={scarcitySeat.sisaSeat}
                  onChange={(e) => updateScarcity('sisaSeat', Math.max(1, parseInt(e.target.value) || 1))}
                  className="bg-secondary text-sm font-bold text-center text-destructive"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/50 border border-border">
              <div>
                <p className="text-xs font-bold text-foreground">Live Decreasing Counter (Auto FOMO)</p>
                <p className="text-[11px] text-muted-foreground">Sisa slot akan berkurang perlahan secara otomatis saat audiens membaca halaman</p>
              </div>
              <Switch
                checked={scarcitySeat.autoDecrease}
                onCheckedChange={(v) => updateScarcity('autoDecrease', v)}
                className="data-[state=checked]:bg-amber-500"
              />
            </div>

            {/* Live Preview Scarcity Bar */}
            <div className="p-3.5 rounded-xl bg-secondary/80 border border-amber-500/30 space-y-2 text-center">
              <p className="text-xs font-bold text-amber-500 tracking-wide flex items-center justify-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
                {scarcitySeat.label} (HANYA TERSISA <span className="text-destructive font-black text-sm">{scarcitySeat.sisaSeat}</span> DARI {scarcitySeat.totalSeat} SLOT)
              </p>
              <div className="w-full bg-background rounded-full h-3.5 overflow-hidden p-0.5 border border-border">
                <div
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 h-full rounded-full transition-all duration-500 animate-pulse"
                  style={{ width: `${percentUsed}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground font-mono">
                {percentUsed}% Slot Sudah Terisi · {scarcitySeat.sisaSeat} Slot Tersedia
              </p>
            </div>
          </div>
        )}
      </div>
    </StepCard>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">{label}</label>
      <div className="flex items-center gap-1.5 bg-secondary border border-border rounded-lg p-1.5">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent p-0" />
        <span className="text-[10px] font-mono text-muted-foreground truncate">{value}</span>
      </div>
    </div>
  );
}
