import { StepCard } from '@/components/StepCard';
import { platformTargetOptions } from '@/data/formOptions';

const platformIcons: Record<string, string> = {
  'Scalev': '🚀',
  'Berdu': '🏪',
  'WordPress': '🌐',
  'Lynk.id': '🔗',
  'Shopify': '🛒',
  'Standalone': '📄',
};

const deviceOptions = [
  {
    label: 'Desktop',
    icon: '🖥️',
    desc: 'Padding 128px kiri/kanan',
  },
  {
    label: 'Tablet',
    icon: '📱',
    desc: 'Padding 50px kiri/kanan',
  },
  {
    label: 'Mobile',
    icon: '📲',
    desc: 'Padding 35px semua sisi',
  },
];

interface Props {
  platformTarget: string;
  deviceTarget: string;
  onChange: (field: string, value: string) => void;
}

export function Step7Platform({ platformTarget, deviceTarget, onChange }: Props) {
  const isScalev = platformTarget === 'Scalev';

  return (
    <StepCard step={7} title="Platform & Device Target">
      {/* Platform selector */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Platform</p>
        <div className="flex flex-wrap gap-2">
          {platformTargetOptions.map((platform) => {
            const active = platformTarget === platform;
            const icon = platformIcons[platform] || '🌐';
            return (
              <button
                key={platform}
                type="button"
                onClick={() => onChange('platformTarget', platform)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all border ${
                  active
                    ? 'bg-primary/10 text-primary border-primary'
                    : 'bg-secondary text-muted-foreground border-border hover:border-primary/50'
                }`}
              >
                <span
                  className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    active ? 'border-primary' : 'border-muted-foreground/40'
                  }`}
                >
                  {active && <span className="w-2 h-2 rounded-full bg-primary block" />}
                </span>
                <span>{icon}</span>
                <span className="uppercase tracking-wide">{platform}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Device selector — tampil selalu tapi ditekankan untuk Scalev */}
      <div className="mt-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
          Device Target{isScalev && <span className="ml-2 text-primary normal-case font-normal">(Wajib untuk Scalev — menentukan lebar & padding)</span>}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {deviceOptions.map(({ label, icon, desc }) => {
            const active = deviceTarget === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => onChange('deviceTarget', label)}
                className={`flex flex-col items-center gap-1 px-3 py-3 rounded-lg text-sm font-semibold transition-all border ${
                  active
                    ? 'bg-primary/10 text-primary border-primary'
                    : 'bg-secondary text-muted-foreground border-border hover:border-primary/50'
                }`}
              >
                <span className="text-xl">{icon}</span>
                <span className="font-bold">{label}</span>
                <span className={`text-[10px] font-normal text-center leading-tight ${active ? 'text-primary/70' : 'text-muted-foreground/60'}`}>
                  {desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scalev size hint */}
        {isScalev && (
          <div className="mt-3 rounded-lg bg-primary/5 border border-primary/20 px-3 py-2.5 text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-primary mb-1">📐 Scalev Width Reference</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className={`rounded p-1.5 ${deviceTarget === 'Desktop' ? 'bg-primary/15 text-primary font-semibold' : ''}`}>
                <div className="font-bold">Desktop</div>
                <div>~432px konten</div>
                <div className="text-[10px]">(688 − 2×128)</div>
              </div>
              <div className={`rounded p-1.5 ${deviceTarget === 'Tablet' ? 'bg-primary/15 text-primary font-semibold' : ''}`}>
                <div className="font-bold">Tablet</div>
                <div>~588px konten</div>
                <div className="text-[10px]">(688 − 2×50)</div>
              </div>
              <div className={`rounded p-1.5 ${deviceTarget === 'Mobile' ? 'bg-primary/15 text-primary font-semibold' : ''}`}>
                <div className="font-bold">Mobile</div>
                <div>~618px konten</div>
                <div className="text-[10px]">(688 − 2×35)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StepCard>
  );
}
