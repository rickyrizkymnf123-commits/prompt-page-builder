import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GroupedOption } from '@/types/form';
import { Search, Sparkles, Check, Edit3, ChevronRight, X, Layers } from 'lucide-react';

interface Props {
  title: string;
  placeholder?: string;
  value: string;
  options: GroupedOption[];
  onSelect: (value: string) => void;
  allowManual?: boolean;
  icon?: React.ReactNode;
}

export function LiquidGlassModal({
  title,
  placeholder = 'Pilih opsi...',
  value,
  options,
  onSelect,
  allowManual = true,
  icon,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);

  const flatOptions = options.flatMap(g => g.options);
  const isCustomValue = value && !flatOptions.includes(value);

  const handleChoose = (opt: string) => {
    if (opt.includes('Lainnya (Isi Manual)')) {
      setIsManualMode(true);
      return;
    }
    onSelect(opt);
    setOpen(false);
    setIsManualMode(false);
    setSearch('');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onSelect(manualInput.trim());
      setOpen(false);
      setIsManualMode(false);
      setManualInput('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-secondary/80 hover:bg-secondary border border-border/80 text-left transition-all text-xs sm:text-sm shadow-inner group hover:border-primary/50"
        >
          <div className="flex items-center gap-2 min-w-0 pr-2">
            {icon && <span className="text-primary flex-shrink-0">{icon}</span>}
            <span className={`truncate font-medium ${value ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
              {value || placeholder}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0">
            {value && isCustomValue && (
              <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-mono font-bold">Custom</span>
            )}
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-xl max-h-[85vh] flex flex-col p-4 sm:p-6 bg-slate-950/70 backdrop-blur-3xl border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.75)] rounded-3xl sm:rounded-[32px] overflow-hidden">
        {/* Apple Glass Glow Accent at top */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-36 bg-gradient-to-b from-primary/30 via-indigo-500/20 to-transparent blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <DialogHeader className="border-b border-white/10 pb-3.5 pr-8 flex-shrink-0 relative z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base sm:text-lg font-black flex items-center gap-2.5 text-white">
              <span className="w-7 h-7 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary text-sm">
                ✨
              </span>
              {title}
            </DialogTitle>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Pilih opsi siap pakai atau klik tombol isi manual untuk menentukan sendiri.
          </p>
        </DialogHeader>

        {isManualMode ? (
          <form onSubmit={handleManualSubmit} className="space-y-4 py-4 relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-xl space-y-1">
              <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                <Edit3 className="w-4 h-4" /> Tulis Manual Kustom
              </p>
              <p className="text-xs text-slate-300">
                Ketikkan deskripsi spesifik sesuai bisnis atau penawaran produk Anda.
              </p>
            </div>

            <Input
              placeholder={`Contoh: Server Pulsa & PPOB Terpercaya...`}
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="bg-white/[0.08] border-white/20 text-white text-sm h-12 rounded-2xl placeholder:text-slate-400 focus:border-primary"
              autoFocus
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsManualMode(false)}
                className="rounded-xl bg-white/5 border-white/15 text-white hover:bg-white/10 text-xs h-9"
              >
                ← Kembali ke Daftar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!manualInput.trim()}
                className="bg-primary hover:bg-primary/90 text-white font-bold text-xs h-9 px-5 rounded-xl shadow-lg shadow-primary/30"
              >
                Gunakan Ini
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 space-y-3 pt-2 relative z-10">
            {/* Liquid Glass Search Bar */}
            <div className="relative flex-shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Ketik untuk mencari opsi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 text-xs sm:text-sm bg-white/[0.07] border-white/15 text-white placeholder:text-slate-400 rounded-2xl focus:border-primary"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Manual Entry Glass Button */}
            {allowManual && (
              <button
                type="button"
                onClick={() => {
                  setManualInput(value && isCustomValue ? value : '');
                  setIsManualMode(true);
                }}
                className="flex items-center justify-between p-3 rounded-2xl border border-dashed border-primary/50 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-all"
              >
                <span className="flex items-center gap-2">
                  <Edit3 className="w-3.5 h-3.5" /> Tidak ada di daftar? Klik untuk isi manual...
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* Grouped Glass Options List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1.5 max-h-[380px] scrollbar-thin">
              {options.map((group) => {
                const filtered = group.options.filter(o =>
                  !search || o.toLowerCase().includes(search.toLowerCase())
                );
                if (filtered.length === 0) return null;

                return (
                  <div key={group.group} className="space-y-2">
                    <p className="text-[11px] font-black text-primary uppercase tracking-wider px-1">
                      {group.group}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {filtered.map((opt) => {
                        const isSelected = value === opt;
                        const isManualChoice = opt.includes('Lainnya (Isi Manual)');
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleChoose(opt)}
                            className={`flex items-center justify-between p-3 rounded-2xl text-xs font-semibold text-left transition-all border ${
                              isSelected
                                ? 'bg-gradient-to-r from-primary to-indigo-600 text-white border-primary shadow-lg shadow-primary/30 font-bold'
                                : isManualChoice
                                ? 'bg-primary/15 border-primary/40 text-primary hover:bg-primary/25'
                                : 'bg-white/[0.06] hover:bg-white/[0.14] border-white/10 hover:border-primary/50 text-slate-100'
                            }`}
                          >
                            <span className="truncate pr-1">{opt}</span>
                            {isSelected && <Check className="w-4 h-4 flex-shrink-0 text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
