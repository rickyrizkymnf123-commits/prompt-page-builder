import { StepCard } from '@/components/StepCard';
import { platformTargetOptions } from '@/data/formOptions';

const platformIcons: Record<string, string> = {
  'OrderHero': '🦸‍♂️',
  'WinMe': '🏆',
  'Scalev': '🚀',
  'Berdu': '🏪',
  'OrderOnline': '📦',
  'LandingPress': '📑',
  'WordPress': '🌐',
  'Lynk.id': '🔗',
  'Mayar': '💳',
  'Shopify': '🛒',
  'Standalone': '📄',
};

const deviceOptions = [
  {
    label: 'Mobile',
    icon: '📲',
    desc: 'Padding 35px — Fokus Layar HP & Traffic Ads',
  },
  {
    label: 'Tablet',
    icon: '📱',
    desc: 'Padding 50px — Layar iPad & Tablet',
  },
  {
    label: 'Desktop',
    icon: '🖥️',
    desc: 'Padding 128px — Tampilan Laptop & PC',
  },
  {
    label: 'Responsive',
    icon: '💻📱',
    desc: 'Auto-adjust — Menyesuaikan Semua Layar',
  },
];

interface Props {
  platformTarget: string;
  deviceTarget: string;
  onChange: (field: string, value: string) => void;
}

export function Step7Platform({ platformTarget, deviceTarget, onChange }: Props) {
  const isScalev = platformTarget === 'Scalev';
  const isOrderHero = platformTarget === 'OrderHero';
  const isWinMe = platformTarget === 'WinMe';

  return (
    <StepCard step={7} title="Platform & Device Target">
      {/* Platform selector */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Platform Tujuan</p>
        <div className="flex flex-wrap gap-2">
          {platformTargetOptions.map((platform) => {
            const active = platformTarget === platform;
            const icon = platformIcons[platform] || '🌐';
            return (
              <button
                key={platform}
                type="button"
                onClick={() => onChange('platformTarget', platform)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                  active
                    ? 'bg-primary/10 text-primary border-primary shadow-sm shadow-primary/20'
                    : 'bg-secondary/70 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                }`}
              >
                <span
                  className={`flex-shrink-0 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${
                    active ? 'border-primary' : 'border-muted-foreground/40'
                  }`}
                >
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-primary block" />}
                </span>
                <span className="text-base">{icon}</span>
                <span className="font-bold tracking-wide">{platform}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Device selector */}
      <div className="mt-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
          Device Target
          {isScalev && <span className="ml-2 text-primary normal-case font-normal">(Rekomendasi Scalev)</span>}
          {isOrderHero && <span className="ml-2 text-primary normal-case font-normal">(Optimasi OrderHero)</span>}
          {isWinMe && <span className="ml-2 text-primary normal-case font-normal">(Optimasi WinMe)</span>}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {deviceOptions.map(({ label, icon, desc }) => {
            const active = deviceTarget === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => onChange('deviceTarget', label)}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl text-xs sm:text-sm font-semibold transition-all border text-center ${
                  active
                    ? 'bg-primary/10 text-primary border-primary shadow-sm shadow-primary/20'
                    : 'bg-secondary/70 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                }`}
              >
                <span className="text-2xl">{icon}</span>
                <span className="font-bold text-foreground">{label}</span>
                <span className={`text-[10px] font-normal leading-snug ${active ? 'text-primary/80' : 'text-muted-foreground/70'}`}>
                  {desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scalev size hint */}
        {isScalev && (
          <div className="mt-3 rounded-xl bg-primary/5 border border-primary/20 p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-primary mb-1">📐 Scalev Width Reference</p>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className={`rounded-lg p-2 border ${deviceTarget === 'Desktop' ? 'bg-primary/15 border-primary/40 text-primary font-semibold' : 'border-border/50'}`}>
                <div className="font-bold">Desktop</div>
                <div>~432px konten</div>
                <div className="text-[10px] text-muted-foreground">(688 − 2×128)</div>
              </div>
              <div className={`rounded-lg p-2 border ${deviceTarget === 'Tablet' ? 'bg-primary/15 border-primary/40 text-primary font-semibold' : 'border-border/50'}`}>
                <div className="font-bold">Tablet</div>
                <div>~588px konten</div>
                <div className="text-[10px] text-muted-foreground">(688 − 2×50)</div>
              </div>
              <div className={`rounded-lg p-2 border ${deviceTarget === 'Mobile' ? 'bg-primary/15 border-primary/40 text-primary font-semibold' : 'border-border/50'}`}>
                <div className="font-bold">Mobile</div>
                <div>~618px konten</div>
                <div className="text-[10px] text-muted-foreground">(688 − 2×35)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StepCard>
  );
}
