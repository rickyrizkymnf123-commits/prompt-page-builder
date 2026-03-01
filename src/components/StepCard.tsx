import { ReactNode } from 'react';

interface StepCardProps {
  step: number;
  title: string;
  children: ReactNode;
}

export function StepCard({ step, title, children }: StepCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 sm:p-5 space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground text-xs sm:text-sm font-bold flex-shrink-0">
          {step}
        </span>
        <h2 className="text-base sm:text-lg font-semibold text-foreground">{title}</h2>
      </div>
      <div className="space-y-3 sm:space-y-4">{children}</div>
    </div>
  );
}
