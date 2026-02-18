import { StepCard } from '@/components/StepCard';
import { elemenTambahanOptions } from '@/data/formOptions';

const sectionIcons: Record<string, string> = {
  'Hero Section': '🏆',
  'Social Proof': '⭐',
  'Testimonial': '💬',
  'FAQ': '❓',
  'Bonus Section': '🎁',
  'Guarantee': '🛡️',
  'Scarcity / Timer': '⏰',
  'Pricing Table': '💰',
  'Feature List': '📋',
  'Video Section': '🎥',
  'Before-After': '🔄',
  'How It Works': '⚙️',
};

interface Props {
  elemenTambahan: Record<string, boolean>;
  onToggle: (element: string) => void;
}

export function Step6Elements({ elemenTambahan, onToggle }: Props) {
  const activeCount = Object.values(elemenTambahan).filter(Boolean).length;

  return (
    <StepCard step={6} title="Elemen Tambahan (Section)">
      <p className="text-sm text-muted-foreground">
        Pilih section yang ingin ditambahkan di landing page:
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {elemenTambahanOptions.map((el) => {
          const active = elemenTambahan[el] ?? false;
          const icon = sectionIcons[el] || '📌';
          return (
            <button
              key={el}
              type="button"
              onClick={() => onToggle(el)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all border text-left ${
                active
                  ? 'bg-primary/10 text-primary border-primary'
                  : 'bg-secondary text-muted-foreground border-border hover:border-primary/50'
              }`}
            >
              <span
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  active
                    ? 'bg-primary border-primary'
                    : 'border-muted-foreground/40'
                }`}
              >
                {active && (
                  <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span className="uppercase tracking-wide text-xs leading-tight">{el}</span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        {activeCount} section dipilih
      </p>
    </StepCard>
  );
}
