import { StepCard } from '@/components/StepCard';
import { platformTargetOptions } from '@/data/formOptions';

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
          return (
            <button
              key={platform}
              type="button"
              onClick={() => onChange('platformTarget', platform)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                active
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary text-muted-foreground border-border hover:border-primary/50'
              }`}
            >
              {platform}
            </button>
          );
        })}
      </div>
    </StepCard>
  );
}
