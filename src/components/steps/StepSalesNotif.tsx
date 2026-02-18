import { StepCard } from '@/components/StepCard';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { SalesNotifConfig } from '@/types/form';

const positions = [
  { value: 'bottom-left', label: 'Kiri Bawah', icon: '↙' },
  { value: 'bottom-right', label: 'Kanan Bawah', icon: '↘' },
  { value: 'top-left', label: 'Kiri Atas', icon: '↖' },
  { value: 'top-right', label: 'Kanan Atas', icon: '↗' },
] as const;

const ukuranOptions = [
  { value: 'small', label: 'Kecil', desc: '280px' },
  { value: 'medium', label: 'Sedang', desc: '320px' },
  { value: 'large', label: 'Besar', desc: '380px' },
] as const;

const emojiOptions = ['🔥', '⚡', '🛒', '💳', '🎉', '✅', '👀', '💰', '🚀', '❤️'];

interface Props {
  salesNotif: SalesNotifConfig;
  onChange: (config: SalesNotifConfig) => void;
}

export function StepSalesNotif({ salesNotif, onChange }: Props) {
  const update = (key: keyof SalesNotifConfig, value: unknown) =>
    onChange({ ...salesNotif, [key]: value });

  return (
    <StepCard step={9} title="Sales Notification 🔔">
      {/* Enable toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border">
        <div>
          <p className="text-sm font-semibold text-foreground">Aktifkan Sales Notification</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Popup real-time "seseorang baru saja beli" untuk social proof
          </p>
        </div>
        <Switch
          checked={salesNotif.enabled}
          onCheckedChange={(v) => update('enabled', v)}
        />
      </div>

      {salesNotif.enabled && (
        <div className="space-y-4 animate-fade-in">
          {/* Preview */}
          <NotifPreview config={salesNotif} />

          {/* Posisi */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Posisi Notifikasi
            </label>
            <div className="grid grid-cols-2 gap-2">
              {positions.map(({ value, label, icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => update('position', value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                    salesNotif.position === value
                      ? 'bg-primary/10 text-primary border-primary'
                      : 'bg-secondary text-muted-foreground border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-lg w-6 text-center">{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Emoji */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Icon / Emoji
            </label>
            <div className="flex flex-wrap gap-2">
              {emojiOptions.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => update('emoji', e)}
                  className={`w-10 h-10 rounded-lg text-xl border transition-all ${
                    salesNotif.emoji === e
                      ? 'bg-primary/10 border-primary'
                      : 'bg-secondary border-border hover:border-primary/50'
                  }`}
                >
                  {e}
                </button>
              ))}
              <Input
                value={!emojiOptions.includes(salesNotif.emoji as typeof emojiOptions[number]) ? salesNotif.emoji : ''}
                onChange={(e) => update('emoji', e.target.value)}
                placeholder="Custom"
                className="w-20 bg-secondary border-border text-center text-lg"
                maxLength={2}
              />
            </div>
          </div>

          {/* Teks konten */}
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Nama Pembeli (rotasi otomatis)
              </label>
              <Input
                value={salesNotif.namaPembeli}
                onChange={(e) => update('namaPembeli', e.target.value)}
                placeholder="Seseorang dari Jakarta, Budi dari Surabaya, ..."
                className="bg-secondary border-border text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                Pisah dengan koma untuk rotasi. Contoh: Budi, Siti, Andi dari Bandung
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Pesan
              </label>
              <Input
                value={salesNotif.pesanNotif}
                onChange={(e) => update('pesanNotif', e.target.value)}
                placeholder="baru saja membeli"
                className="bg-secondary border-border text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Nama Produk di Notif
              </label>
              <Input
                value={salesNotif.namaProdukNotif}
                onChange={(e) => update('namaProdukNotif', e.target.value)}
                placeholder="Kosong = pakai nama produk utama"
                className="bg-secondary border-border text-sm"
              />
            </div>
          </div>

          {/* Timing */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Muncul Setiap
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min={3}
                  max={60}
                  value={salesNotif.interval}
                  onChange={(e) => update('interval', Number(e.target.value))}
                  className="bg-secondary border-border pr-12 text-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  detik
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Tampil Selama
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min={2}
                  max={30}
                  value={salesNotif.durasi}
                  onChange={(e) => update('durasi', Number(e.target.value))}
                  className="bg-secondary border-border pr-12 text-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  detik
                </span>
              </div>
            </div>
          </div>

          {/* Ukuran */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Ukuran Popup
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ukuranOptions.map(({ value, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => update('ukuran', value)}
                  className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                    salesNotif.ukuran === value
                      ? 'bg-primary/10 text-primary border-primary'
                      : 'bg-secondary text-muted-foreground border-border hover:border-primary/50'
                  }`}
                >
                  <span className="font-bold">{label}</span>
                  <span className={`text-[10px] ${salesNotif.ukuran === value ? 'text-primary/70' : 'text-muted-foreground/60'}`}>
                    {desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </StepCard>
  );
}

function NotifPreview({ config }: { config: SalesNotifConfig }) {
  const widths = { small: 280, medium: 320, large: 380 };
  const w = widths[config.ukuran];
  const namaPertama = config.namaPembeli.split(',')[0]?.trim() || 'Seseorang';
  const namaProduk = config.namaProdukNotif || 'produk ini';

  return (
    <div className="relative rounded-lg bg-secondary border border-border p-3 overflow-hidden h-20">
      <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-widest">Preview</p>
      <div
        className="absolute bg-card border border-border rounded-xl shadow-lg px-3 py-2.5 flex items-center gap-2.5"
        style={{
          width: Math.min(w, 300),
          bottom: config.position.startsWith('bottom') ? 10 : undefined,
          top: config.position.startsWith('top') ? 10 : undefined,
          left: config.position.endsWith('left') ? 10 : undefined,
          right: config.position.endsWith('right') ? 10 : undefined,
        }}
      >
        <span className="text-xl flex-shrink-0">{config.emoji}</span>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">
            {namaPertama} {config.pesanNotif}
          </p>
          <p className="text-[11px] text-primary truncate font-medium">{namaProduk}</p>
          <p className="text-[10px] text-muted-foreground">Baru saja · 2 menit lalu</p>
        </div>
      </div>
    </div>
  );
}
