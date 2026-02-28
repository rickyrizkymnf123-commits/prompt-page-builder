import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SalesNotifEditorConfig {
  enabled: boolean;
  position: string;
  emoji: string;
  names: string;
  message: string;
  produk: string;
  interval: number;
  duration: number;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

interface CountdownEditorConfig {
  enabled: boolean;
  labelAtas: string;
  hari: number;
  jam: number;
  menit: number;
  detik: number;
  bgColor: string;
  textColor: string;
  accentColor: string;
}

interface Props {
  onInjectSalesNotif: (config: SalesNotifEditorConfig) => void;
  onInjectCountdown: (config: CountdownEditorConfig) => void;
  onRemoveSalesNotif: () => void;
  onRemoveCountdown: () => void;
  hasSalesNotif: boolean;
  hasCountdown: boolean;
}

const positionOptions = [
  { value: 'bottom-left', label: '↙ Kiri Bawah' },
  { value: 'bottom-right', label: '↘ Kanan Bawah' },
  { value: 'top-left', label: '↖ Kiri Atas' },
  { value: 'top-right', label: '↗ Kanan Atas' },
];

const colorPresets = [
  { bg: '#1a1a2e', text: '#ffffff', accent: '#ff4757', label: 'Dark Red' },
  { bg: '#0f0f23', text: '#00d2ff', accent: '#7928ca', label: 'Cyber' },
  { bg: '#ffffff', text: '#1a1a2e', accent: '#6c63ff', label: 'Light Purple' },
  { bg: '#1e3a5f', text: '#ffffff', accent: '#f39c12', label: 'Navy Gold' },
];

export function EditorMarketingPanel({ onInjectSalesNotif, onInjectCountdown, onRemoveSalesNotif, onRemoveCountdown, hasSalesNotif, hasCountdown }: Props) {
  const [activeTab, setActiveTab] = useState<'salesNotif' | 'countdown'>('salesNotif');

  const [snConfig, setSnConfig] = useState<SalesNotifEditorConfig>({
    enabled: true,
    position: 'bottom-left',
    emoji: '🔥',
    names: 'Budi Jakarta,Ani Surabaya,Dian Bandung,Rudi Medan',
    message: 'baru saja membeli',
    produk: 'Produk Premium',
    interval: 5,
    duration: 4,
    bgColor: '#ffffff',
    borderColor: '#6c63ff',
    textColor: '#1a1a2e',
  });

  const [cdConfig, setCdConfig] = useState<CountdownEditorConfig>({
    enabled: true,
    labelAtas: '⏰ PROMO BERAKHIR DALAM',
    hari: 0,
    jam: 12,
    menit: 30,
    detik: 0,
    bgColor: '#1a1a2e',
    textColor: '#ffffff',
    accentColor: '#ff4757',
  });

  const updateSn = (field: keyof SalesNotifEditorConfig, value: any) => {
    setSnConfig(prev => ({ ...prev, [field]: value }));
  };

  const updateCd = (field: keyof CountdownEditorConfig, value: any) => {
    setCdConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">🎯 Marketing Tools</h3>

      {/* Tab switcher */}
      <div className="flex gap-1.5">
        <button type="button" onClick={() => setActiveTab('salesNotif')} className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${activeTab === 'salesNotif' ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-muted-foreground border-border'}`}>
          🔔 Sales Notif
        </button>
        <button type="button" onClick={() => setActiveTab('countdown')} className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${activeTab === 'countdown' ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-muted-foreground border-border'}`}>
          ⏰ Countdown
        </button>
      </div>

      {/* Sales Notif Tab */}
      {activeTab === 'salesNotif' && (
        <div className="space-y-3">
          {/* Position */}
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">Posisi</label>
            <div className="grid grid-cols-2 gap-1.5">
              {positionOptions.map(pos => (
                <button key={pos.value} type="button" onClick={() => updateSn('position', pos.value)} className={`px-2 py-1.5 rounded-lg text-xs border transition-all ${snConfig.position === pos.value ? 'bg-primary/15 border-primary text-primary font-semibold' : 'bg-secondary border-border text-foreground'}`}>
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          {/* Emoji */}
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">Emoji</label>
            <div className="flex gap-1.5 flex-wrap">
              {['🔥', '✅', '🛒', '💰', '⭐', '🎉', '💎', '🚀'].map(em => (
                <button key={em} type="button" onClick={() => updateSn('emoji', em)} className={`w-8 h-8 rounded-lg text-base flex items-center justify-center border transition-all ${snConfig.emoji === em ? 'bg-primary/15 border-primary' : 'bg-secondary border-border'}`}>
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Names */}
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">Nama Pembeli (pisah koma)</label>
            <input type="text" value={snConfig.names} onChange={(e) => updateSn('names', e.target.value)} className="w-full rounded-lg bg-secondary text-foreground text-xs p-2 border border-border focus:outline-none focus:border-primary" />
          </div>

          {/* Message */}
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">Pesan</label>
            <input type="text" value={snConfig.message} onChange={(e) => updateSn('message', e.target.value)} className="w-full rounded-lg bg-secondary text-foreground text-xs p-2 border border-border focus:outline-none focus:border-primary" />
          </div>

          {/* Product name */}
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">Nama Produk</label>
            <input type="text" value={snConfig.produk} onChange={(e) => updateSn('produk', e.target.value)} className="w-full rounded-lg bg-secondary text-foreground text-xs p-2 border border-border focus:outline-none focus:border-primary" />
          </div>

          {/* Timing */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">Interval (detik)</label>
              <input type="number" min={3} max={60} value={snConfig.interval} onChange={(e) => updateSn('interval', parseInt(e.target.value) || 5)} className="w-full rounded-lg bg-secondary text-foreground text-xs p-2 border border-border text-center focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">Durasi (detik)</label>
              <input type="number" min={2} max={30} value={snConfig.duration} onChange={(e) => updateSn('duration', parseInt(e.target.value) || 4)} className="w-full rounded-lg bg-secondary text-foreground text-xs p-2 border border-border text-center focus:outline-none focus:border-primary" />
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-3 gap-2">
            <ColorField label="BG" value={snConfig.bgColor} onChange={(v) => updateSn('bgColor', v)} />
            <ColorField label="Border" value={snConfig.borderColor} onChange={(v) => updateSn('borderColor', v)} />
            <ColorField label="Teks" value={snConfig.textColor} onChange={(v) => updateSn('textColor', v)} />
          </div>

          {/* Preview */}
          <div className="rounded-lg p-3" style={{ background: snConfig.bgColor, border: `2px solid ${snConfig.borderColor}` }}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{snConfig.emoji}</span>
              <div>
                <p className="text-xs font-semibold" style={{ color: snConfig.textColor }}>{snConfig.names.split(',')[0]?.trim() || 'Pembeli'}</p>
                <p className="text-[10px]" style={{ color: snConfig.textColor, opacity: 0.7 }}>{snConfig.message} <strong>{snConfig.produk}</strong></p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={() => onInjectSalesNotif(snConfig)}>
              {hasSalesNotif ? '🔄 Update Notif' : '➕ Inject Notif'}
            </Button>
            {hasSalesNotif && (
              <Button size="sm" variant="destructive" onClick={onRemoveSalesNotif}>🗑</Button>
            )}
          </div>
        </div>
      )}

      {/* Countdown Tab */}
      {activeTab === 'countdown' && (
        <div className="space-y-3">
          {/* Label */}
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">Label</label>
            <input type="text" value={cdConfig.labelAtas} onChange={(e) => updateCd('labelAtas', e.target.value)} className="w-full rounded-lg bg-secondary text-foreground text-xs p-2 border border-border focus:outline-none focus:border-primary" />
          </div>

          {/* Duration */}
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">Durasi</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['hari', 'jam', 'menit', 'detik'] as const).map((field) => (
                <div key={field} className="text-center">
                  <input type="number" min={0} max={field === 'hari' ? 365 : 59} value={cdConfig[field]} onChange={(e) => updateCd(field, Math.max(0, parseInt(e.target.value) || 0))} className="w-full rounded-lg bg-secondary text-foreground text-xs p-2 border border-border text-center focus:outline-none focus:border-primary" />
                  <span className="text-[9px] text-muted-foreground mt-0.5 block capitalize">{field}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Color Presets */}
          <div>
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">Preset</label>
            <div className="flex flex-wrap gap-1.5">
              {colorPresets.map(p => (
                <button key={p.label} type="button" onClick={() => setCdConfig(prev => ({ ...prev, bgColor: p.bg, textColor: p.text, accentColor: p.accent }))} className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium border transition-all ${cdConfig.bgColor === p.bg && cdConfig.accentColor === p.accent ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-secondary text-muted-foreground'}`}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.bg }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.accent }} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-3 gap-2">
            <ColorField label="BG" value={cdConfig.bgColor} onChange={(v) => updateCd('bgColor', v)} />
            <ColorField label="Teks" value={cdConfig.textColor} onChange={(v) => updateCd('textColor', v)} />
            <ColorField label="Accent" value={cdConfig.accentColor} onChange={(v) => updateCd('accentColor', v)} />
          </div>

          {/* Preview */}
          <div className="rounded-lg p-3 text-center" style={{ background: cdConfig.bgColor, color: cdConfig.textColor }}>
            <p className="text-[10px] font-bold mb-2" style={{ color: cdConfig.accentColor }}>{cdConfig.labelAtas}</p>
            <div className="flex justify-center gap-2">
              {[
                { label: 'Hari', val: cdConfig.hari },
                { label: 'Jam', val: cdConfig.jam },
                { label: 'Mnt', val: cdConfig.menit },
                { label: 'Dtk', val: cdConfig.detik },
              ].map(item => (
                <div key={item.label} className="flex flex-col items-center">
                  <span className="text-lg font-bold rounded px-2 py-0.5" style={{ background: cdConfig.accentColor, color: cdConfig.textColor }}>
                    {String(item.val).padStart(2, '0')}
                  </span>
                  <span className="text-[8px] mt-0.5 opacity-70">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={() => onInjectCountdown(cdConfig)}>
              {hasCountdown ? '🔄 Update Timer' : '➕ Inject Timer'}
            </Button>
            {hasCountdown && (
              <Button size="sm" variant="destructive" onClick={onRemoveCountdown}>🗑</Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5 block">{label}</label>
      <div className="flex items-center gap-1">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 p-0" />
        <span className="text-[9px] font-mono text-muted-foreground">{value}</span>
      </div>
    </div>
  );
}

export type { SalesNotifEditorConfig, CountdownEditorConfig };
