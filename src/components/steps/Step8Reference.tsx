import { StepCard } from '@/components/StepCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Props {
  linkReferensi: string;
  inspirasiDesain: string;
  onChange: (field: string, value: string) => void;
}

export function Step8Reference({ linkReferensi, inspirasiDesain, onChange }: Props) {
  return (
    <StepCard step={8} title="Link Referensi — Opsional">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold uppercase tracking-wide text-foreground">
            URL Landing Page Referensi{' '}
            <span className="text-muted-foreground font-normal normal-case tracking-normal">(opsional)</span>
          </Label>
          <Input
            placeholder="https://contoh-landing-page.com"
            value={linkReferensi}
            onChange={(e) => onChange('linkReferensi', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold uppercase tracking-wide text-foreground">
            Apa yang Ingin Ditiru?{' '}
            <span className="text-muted-foreground font-normal normal-case tracking-normal">(opsional)</span>
          </Label>
          <Textarea
            placeholder="Contoh: Saya suka layout hero-nya, warna gradien, dan cara menampilkan testimonial..."
            value={inspirasiDesain}
            onChange={(e) => onChange('inspirasiDesain', e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </StepCard>
  );
}
