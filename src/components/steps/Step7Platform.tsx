import { StepCard } from '@/components/StepCard';
import { platformTargetOptions } from '@/data/formOptions';
import { translations, Language } from '@/utils/i18n';

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
    descEn: 'Padding 35px — Mobile Screen & Ads Traffic',
  },
  {
    label: 'Tablet',
    icon: '📱',
    desc: 'Padding 50px — Layar iPad & Tablet',
    descEn: 'Padding 50px — iPad & Tablet Screens',
  },
  {
    label: 'Desktop',
    icon: '🖥️',
    desc: 'Padding 128px — Tampilan Laptop & PC',
    descEn: 'Padding 128px — Laptop & PC Screens',
  },
  {
    label: 'Responsive',
    icon: '💻📱',
    desc: 'Auto-adjust — Menyesuaikan Semua Layar',
    descEn: 'Auto-adjust — Adapts to All Screen Sizes',
  },
];

interface Props {
  platformTarget: string;
  deviceTarget: string;
  language?: Language;
  onChange: (field: string, value: string) => void;
}

export function Step7Platform({ platformTarget, deviceTarget, language = 'id', onChange }: Props) {
  const t = translations[language] || translations.id;
  const isScalev = platformTarget === 'Scalev';
  const isOrderHero = platformTarget === 'OrderHero';
  const isWinMe = platformTarget === 'WinMe';

  return (
    <StepCard step={7} title={t.step7Title}>
      {/* Platform selector */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
          {t.platformTargetLabel}
        </p>
        <div className="flex flex-wrap gap-2">
          {platformTargetOptions.map((platform) => {
            const active = platformTarget === platform;
            const icon = platformIcons[platform] || '🌐';
            return (
              <button
                key={platform}
                type="button"
                onClick={() => onChange('platformTarget', platform)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  active
                    ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                    : 'bg-secondary/40 text-muted-foreground border-border hover:bg-secondary hover:text-foreground'
                }`}
              >
                <span>{icon}</span>
                <span>{platform}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground inline-block ml-0.5" />}
              </button>
            );
          })}
        </div>

        {/* Platform Info Banners */}
        {isScalev && (
          <div className="mt-3 p-3 bg-primary/10 border border-primary/30 rounded-xl text-xs space-y-1 animate-in fade-in duration-200">
            <p className="font-semibold text-primary">🚀 Preset Khusus Scalev Aktif:</p>
            <p className="text-muted-foreground">HTML terisolasi dalam <code>#lp-root</code>, single column responsif, siap salin dan pasang langsung di Scalev Custom HTML.</p>
          </div>
        )}
        {isWinMe && (
          <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs space-y-1 animate-in fade-in duration-200">
            <p className="font-semibold text-amber-500">🏆 Preset Khusus WinMe Aktif:</p>
            <p className="text-muted-foreground">Struktur disiapkan dengan class tombol <code>.cta-btn</code> yang siap dipadukan dengan modul checkout WinMe.</p>
          </div>
        )}
        {isOrderHero && (
          <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs space-y-1 animate-in fade-in duration-200">
            <p className="font-semibold text-emerald-500">🦸‍♂️ Preset Khusus OrderHero Aktif:</p>
            <p className="text-muted-foreground">Optimal untuk landing page produk fisik dengan alur checkout form OrderHero.</p>
          </div>
        )}
      </div>

      {/* Device Target */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
          {t.deviceTargetLabel}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {deviceOptions.map((dev) => {
            const active = deviceTarget === dev.label;
            return (
              <button
                key={dev.label}
                type="button"
                onClick={() => onChange('deviceTarget', dev.label)}
                className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  active
                    ? 'bg-primary/10 border-primary text-primary shadow-sm ring-1 ring-primary/40'
                    : 'bg-secondary/40 border-border text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <span className="text-2xl mb-1">{dev.icon}</span>
                <span className="text-xs font-bold text-foreground">{dev.label}</span>
                <span className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                  {language === 'en' ? dev.descEn : dev.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </StepCard>
  );
}
