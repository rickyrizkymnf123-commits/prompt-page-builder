import { StepCard } from '@/components/StepCard';
import { elemenTambahanOptions } from '@/data/formOptions';

interface Props {
  elemenTambahan: Record<string, boolean>;
  onToggle: (element: string) => void;
}

export function Step6Elements({ elemenTambahan, onToggle }: Props) {
  return (
    <StepCard step={6} title="Elemen Tambahan">
      <div className="flex flex-wrap gap-2">
        {elemenTambahanOptions.map((el) => {
          const active = elemenTambahan[el];
          return (
            <button
              key={el}
              type="button"
              onClick={() => onToggle(el)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                active
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary text-muted-foreground border-border hover:border-primary/50'
              }`}
            >
              {el}
            </button>
          );
        })}
      </div>
    </StepCard>
  );
}
