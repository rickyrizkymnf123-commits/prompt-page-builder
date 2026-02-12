import { Moon, Sun, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
}

export function Header({ darkMode, onToggleDark }: Props) {
  return (
    <header className="border-b border-border bg-card px-6 py-3 flex items-center justify-between">
      <h1 className="text-xl font-bold text-foreground">
        Landing Page <span className="text-primary">Engine</span>
      </h1>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onToggleDark}>
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
