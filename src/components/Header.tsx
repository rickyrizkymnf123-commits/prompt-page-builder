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
    <header className="border-b border-border bg-card/95 backdrop-blur-xl px-3 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      {/* Left: Hamburger Menu (Garis Tiga ☰) & App Brand */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
        {onOpenMenu && (
          <button
            type="button"
            onClick={onOpenMenu}
            className="w-9 h-9 rounded-xl bg-secondary hover:bg-secondary/80 border border-border flex items-center justify-center text-foreground transition-all hover:border-primary/50 flex-shrink-0 shadow-sm"
            title="Buka Menu & Fitur AI"
          >
            <Menu className="w-5 h-5 text-primary" />
          </button>
        )}

        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-600/30">
          <Rocket className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-white" />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-black text-foreground truncate">
              Landing Page <span className="text-primary">Builder</span>
            </h1>
            <span className="text-[9px] font-black uppercase tracking-wider bg-primary/15 text-primary border border-primary/30 px-2 py-0.2 rounded-full hidden sm:inline-block">
              V.12 Pro
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground hidden sm:block">By Digital Strategi</span>
        </div>
      </div>

      {/* Right: Language Switcher, Dark Mode, and Logout */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Multi-Language Switcher (beside Dark Mode) */}
        {onToggleLang && (
          <button
            type="button"
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-bold text-foreground transition-all hover:border-primary/50 shadow-sm"
            title="Ganti Bahasa Antarmuka (Translate Tools)"
          >
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span>{language === 'en' ? '🇬🇧 EN' : '🇮🇩 ID'}</span>
          </button>
        )}

        {/* Dark / Light Mode */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleDark}
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-secondary/50 border border-border hover:bg-secondary"
          title="Mode Terang / Gelap"
        >
          {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-400" />}
        </Button>

        {/* Logout */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-secondary/50 border border-border hover:bg-red-500/15 hover:text-red-400"
          title="Keluar"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
