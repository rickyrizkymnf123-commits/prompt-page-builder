import { StepCard } from '@/components/StepCard';
import { levelAwarenessOptions, targetAudienceOptions } from '@/data/formOptions';
import { LiquidGlassModal } from '@/components/ui/LiquidGlassModal';
import { Users, Eye } from 'lucide-react';

interface Props {
  levelAwareness: string;
  targetAudience: string;
  onChange: (field: string, value: string) => void;
}

const awarenessGrouped = [
  {
    group: 'Tingkat Kesadaran Masalah & Solusi',
    options: levelAwarenessOptions,
  },
];

export function Step3Target({ levelAwareness, targetAudience, onChange }: Props) {
  return (
    <StepCard step={3} title="Target Market & Awareness">
      <div className="space-y-3.5">
        {/* Level Awareness */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Level Awareness Calon Pembeli
          </label>
          <LiquidGlassModal
            title="Pilih Level Awareness"
            placeholder="Pilih level awareness (Problem Aware, Solution Aware)..."
            value={levelAwareness}
            options={awarenessGrouped}
            onSelect={(val) => onChange('levelAwareness', val)}
            allowManual={false}
            icon={<Eye className="w-4 h-4" />}
          />
        </div>

        {/* Target Audience */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Target Audience Spesifik
          </label>
          <LiquidGlassModal
            title="Pilih Target Audience"
            placeholder="Pilih target audience atau tulis manual..."
            value={targetAudience}
            options={targetAudienceOptions}
            onSelect={(val) => onChange('targetAudience', val)}
            icon={<Users className="w-4 h-4" />}
          />
        </div>
      </div>
    </StepCard>
  );
}
