import { StepCard } from '@/components/StepCard';
import { platformTargetOptions } from '@/data/formOptions';

const platformIcons: Record<string, string> = {
  'Scalev': '🚀',
  'WordPress': '🌐',
  'Lynk.id': '🔗',
  'Shopify': '🛒',
  'Standalone': '📄',
};

interface Props {
  platformTarget: string;
  onChange: (field: string, value: string) => void;
}

export function Step7Platform({ platformTarget, onChange }: Props) {
  return (
    <StepCard step={7} title="Platform Target">
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
                  active
                    ? 'border-primary'
                    : 'border-muted-foreground/40'
                }`}
              >
                {active && <span className="w-2 h-2 rounded-full bg-primary block" />}
              </span>
              <span className="uppercase tracking-wide">{platform}</span>
            </button>
          );
        })}
      </div>
    </StepCard>
  );
}
