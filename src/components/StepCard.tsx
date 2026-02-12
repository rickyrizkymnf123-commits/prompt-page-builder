import { ReactNode } from 'react';

interface StepCardProps {
  step: number;
  title: string;
  children: ReactNode;
}

export function StepCard({ step, title, children }: StepCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground text-sm font-bold">
          {step}
        </span>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
