import { StepCard } from '@/components/StepCard';
import { Switch } from '@/components/ui/switch';
import { elemenTambahanOptions } from '@/data/formOptions';
import { MetaCapiConfig } from '@/types/form';
import { Radio, Check, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { translations, Language } from '@/utils/i18n';

const sectionIcons: Record<string, string> = {
  'Hero Section': '🏆',
  'Before-After': '🔄',
  'Feature List': '📋',
  'How It Works': '⚙️',
  'Social Proof': '⭐',
  'Testimonial': '💬',
  'Video Section': '🎥',
  'Bonus Section': '🎁',
  'Pricing Table': '💰',
  'Scarcity / Timer': '⏰',
  'Guarantee': '🛡️',
  'FAQ': '❓',
};

interface Props {
  elemenTambahan: Record<string, boolean>;
  metaCapi?: MetaCapiConfig;
  language?: Language;
  onToggle: (element: string) => void;
  onChangeMetaCapi?: (metaCapi: MetaCapiConfig) => void;
}

export function Step6Elements({
  elemenTambahan,
  metaCapi = { enabled: false, pixelId: '', capiToken: '', eventName: 'Lead' },
  language = 'id',
  onToggle,
  onChangeMetaCapi,
}: Props) {
  const t = translations[language] || translations.id;
  const activeCount = Object.values(elemenTambahan).filter(Boolean).length;

  return (
    <StepCard step={6} title={t.step6Title}>
      <div className="space-y-4">
        {/* Section Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t.sectionsTitle}
            </p>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
              {activeCount} {language === 'en' ? 'Active Sections' : 'Section Aktif'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {elemenTambahanOptions.map((el) => {
              const active = elemenTambahan[el] ?? false;
              const icon = sectionIcons[el] || '📌';
              return (
                <button
                  key={el}
                  type="button"
                  onClick={() => onToggle(el)}
                  className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    active
                      ? 'bg-primary/10 border-primary text-primary shadow-sm ring-1 ring-primary/30 font-bold'
                      : 'bg-secondary/50 border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-1">
                    <span className="text-base flex-shrink-0">{icon}</span>
                    <span className="font-bold text-xs truncate text-foreground">{el}</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                      active ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30'
                    }`}
                  >
                    {active && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground italic pt-1">
            {language === 'en'
              ? '💡 Section order can be rearranged anytime in Live HTML Edit Mode.'
              : '💡 Urutan susunan section dapat diatur dan digeser secara fleksibel nanti di Mode Edit HTML.'}
          </p>
        </div>

        {/* META CONVERSIONS API (CAPI) - NEXT FEATURE */}
        <div className="pt-2 border-t border-border/60">
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-blue-400">{t.metaCapiTitle}</span>
                    <span className="text-[9px] font-black uppercase tracking-wider bg-blue-500 text-white px-2 py-0.5 rounded-full">
                      {t.nextFeatureBadge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {language === 'en'
                      ? 'Server-side Meta Conversions API tracking for precise WhatsApp conversion events.'
                      : 'Modul tracking server-side Meta Conversions API khusus iklan WhatsApp agar event Lead terkirim presisi.'}
                  </p>
                </div>
              </div>
              <Switch
                checked={metaCapi.enabled}
                onCheckedChange={(checked) => onChangeMetaCapi && onChangeMetaCapi({ ...metaCapi, enabled: checked })}
                className="data-[state=checked]:bg-blue-500 flex-shrink-0"
              />
            </div>

            {metaCapi.enabled && (
              <div className="p-3 rounded-xl bg-background/80 border border-border space-y-2 text-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                  <Info className="w-3.5 h-3.5" /> Parameter CAPI (Beta Testing)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    placeholder="Meta Pixel ID (15 digit)"
                    value={metaCapi.pixelId}
                    onChange={(e) => onChangeMetaCapi && onChangeMetaCapi({ ...metaCapi, pixelId: e.target.value })}
                    className="bg-secondary text-xs h-8"
                  />
                  <Input
                    placeholder="Event: Lead / Contact"
                    value={metaCapi.eventName}
                    onChange={(e) => onChangeMetaCapi && onChangeMetaCapi({ ...metaCapi, eventName: e.target.value })}
                    className="bg-secondary text-xs h-8"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </StepCard>
  );
}
