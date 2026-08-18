import { Moon, Sun, LogOut, Rocket, Menu, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  language?: 'id' | 'en';
  onToggleLang?: () => void;
  onOpenMenu?: () => void;
}

export function Header({
  darkMode,
  onToggleDark,
  language = 'id',
  onToggleLang,
  onOpenMenu,
}: Props) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="border-b border-border bg-card/95 backdrop-blur-xl px-2.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      {/* Left: Hamburger Menu (Garis Tiga ☰) & App Brand */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onOpenMenu && (
          <button
            type="button"
            onClick={onOpenMenu}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-secondary hover:bg-secondary/80 border border-border flex items-center justify-center text-foreground transition-all hover:border-primary/50 flex-shrink-0 shadow-sm"
            title="Buka Menu & Fitur AI"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </button>
        )}

        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-600/30">
          <Rocket className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="text-xs sm:text-base font-black text-foreground truncate">
              <span className="sm:hidden">LP Builder</span>
              <span className="hidden sm:inline">Landing Page <span className="text-primary">Builder</span></span>
            </h1>
            <span className="text-[9px] font-black uppercase tracking-wider bg-primary/15 text-primary border border-primary/30 px-1.5 py-0.2 rounded-full hidden md:inline-block">
              Pro
            </span>
          </div>
        </div>
      </div>

      {/* Right: Language Switcher, Dark Mode, and Logout */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {/* Multi-Language Switcher (beside Dark Mode) */}
        {onToggleLang && (
          <button
            type="button"
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-[11px] sm:text-xs font-bold text-foreground transition-all hover:border-primary/50 shadow-sm whitespace-nowrap"
            title="Ganti Bahasa Antarmuka (Translate Tools)"
          >
            <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary flex-shrink-0" />
            <span>{language === 'en' ? 'EN' : 'ID'}</span>
          </button>
        )}

        {/* Dark / Light Mode */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleDark}
          className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-secondary/50 border border-border hover:bg-secondary"
          title="Mode Terang / Gelap"
        >
          {darkMode ? <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400" /> : <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-400" />}
        </Button>

        {/* Logout */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-secondary/50 border border-border hover:bg-red-500/15 hover:text-red-400"
          title="Keluar"
        >
          <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </header>
  );
}
