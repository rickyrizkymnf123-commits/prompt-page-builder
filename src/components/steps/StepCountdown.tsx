import { StepCard } from '@/components/StepCard';
import { CountdownConfig } from '@/types/form';

interface Props {
  countdown: CountdownConfig;
  onChange: (config: CountdownConfig) => void;
}

const colorPresets = [
  { bg: '#1a1a2e', text: '#ffffff', accent: '#ff4757', label: 'Dark Red' },
  { bg: '#0f0f23', text: '#00d2ff', accent: '#7928ca', label: 'Cyber' },
  { bg: '#ffffff', text: '#1a1a2e', accent: '#6c63ff', label: 'Light Purple' },
  { bg: '#1e3a5f', text: '#ffffff', accent: '#f39c12', label: 'Navy Gold' },
  { bg: '#2d1b69', text: '#ffffff', accent: '#e91e63', label: 'Purple Pink' },
];

export function StepCountdown({ countdown, onChange }: Props) {
  const update = (field: keyof CountdownConfig, value: any) => {
    onChange({ ...countdown, [field]: value });
  };

  return (
    <StepCard step={10} title="Countdown Timer Custom">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Aktifkan Countdown Timer</p>
        <button
          type="button"
          onClick={() => update('enabled', !countdown.enabled)}
          className={`w-12 h-6 rounded-full transition-all relative ${countdown.enabled ? 'bg-primary' : 'bg-muted-foreground/30'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${countdown.enabled ? 'left-6' : 'left-0.5'}`} />
        </button>
      </div>

      {countdown.enabled && (
        <div className="space-y-4 mt-3">
          {/* Label */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">Label di Atas Timer</label>
            <input
              type="text"
              value={countdown.labelAtas}
              onChange={(e) => update('labelAtas', e.target.value)}
              className="w-full rounded-lg bg-secondary text-foreground text-sm p-2.5 border border-border focus:outline-none focus:border-primary"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 block">Durasi Countdown</label>
            <div className="grid grid-cols-4 gap-2">
              {(['hari', 'jam', 'menit', 'detik'] as const).map((field) => (
                <div key={field} className="text-center">
                  <input
                    type="number"
                    min={0}
                    max={field === 'hari' ? 365 : 59}
                    value={countdown[field]}
                    onChange={(e) => update(field, Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full rounded-lg bg-secondary text-foreground text-sm p-2.5 border border-border text-center focus:outline-none focus:border-primary"
                  />
                  <span className="text-[10px] text-muted-foreground mt-1 block capitalize">{field}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Color Presets */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 block">Preset Warna</label>
            <div className="flex flex-wrap gap-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onChange({ ...countdown, bgColor: preset.bg, textColor: preset.text, accentColor: preset.accent })}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                    countdown.bgColor === preset.bg && countdown.accentColor === preset.accent
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-secondary text-muted-foreground hover:border-primary/40'
                  }`}
                >
                  <div className="flex gap-0.5">
                    <span className="w-3 h-3 rounded-full" style={{ background: preset.bg }} />
                    <span className="w-3 h-3 rounded-full" style={{ background: preset.accent }} />
                  </div>
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-3 gap-3">
            <ColorField label="Background" value={countdown.bgColor} onChange={(v) => update('bgColor', v)} />
            <ColorField label="Teks" value={countdown.textColor} onChange={(v) => update('textColor', v)} />
            <ColorField label="Accent" value={countdown.accentColor} onChange={(v) => update('accentColor', v)} />
          </div>

          {/* Preview */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 block">Preview</label>
            <div
              className="rounded-xl p-4 text-center"
              style={{ background: countdown.bgColor, color: countdown.textColor }}
            >
              <p className="text-xs font-bold mb-2" style={{ color: countdown.accentColor }}>{countdown.labelAtas}</p>
              <div className="flex justify-center gap-3">
                {[
                  { label: 'Hari', val: countdown.hari },
                  { label: 'Jam', val: countdown.jam },
                  { label: 'Menit', val: countdown.menit },
                  { label: 'Detik', val: countdown.detik },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center">
                    <span
                      className="text-2xl font-bold rounded-lg px-3 py-1"
                      style={{ background: countdown.accentColor, color: countdown.textColor }}
                    >
                      {String(item.val).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] mt-1 opacity-70">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </StepCard>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">{label}</label>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
        <span className="text-xs font-mono text-muted-foreground">{value}</span>
      </div>
    </div>
  );
}
