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
import { Search, Sparkles, Check, Edit3, ChevronRight, X } from 'lucide-react';

interface Props {
  title: string;
  placeholder?: string;
  value: string;
  options: GroupedOption[];
  onSelect: (value: string) => void;
  allowManual?: boolean;
}

export function LiquidGlassModal({
  title,
  placeholder = 'Pilih opsi...',
  value,
  options,
  onSelect,
  allowManual = true,
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
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-secondary/70 hover:bg-secondary border border-border/80 text-left transition-all text-xs sm:text-sm shadow-inner group"
        >
          <span className={`truncate font-medium ${value ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
            {value || placeholder}
          </span>
          <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0">
            {value && isCustomValue && (
              <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono">Custom</span>
            )}
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-xl max-h-[85vh] flex flex-col p-4 sm:p-6 bg-card/95 backdrop-blur-2xl border-border/80 shadow-2xl rounded-2xl">
        <DialogHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2 text-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              {title}
            </DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pilih dari daftar kategori atau masukkan deskripsi kustom Anda.
          </p>
        </DialogHeader>

        {isManualMode ? (
          <form onSubmit={handleManualSubmit} className="space-y-4 py-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/25 space-y-1">
              <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5" /> Tulis Manual Kustom
              </p>
              <p className="text-xs text-muted-foreground">
                Ketikkan nama {title.toLowerCase()} spesifik sesuai produk Anda.
              </p>
            </div>

            <Input
              placeholder={`Contoh: Server Pulsa & PPOB Terpercaya...`}
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="bg-secondary text-sm h-11"
              autoFocus
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsManualMode(false)}>
                Kembali ke Daftar
              </Button>
              <Button type="submit" size="sm" disabled={!manualInput.trim()} className="bg-primary text-primary-foreground font-semibold">
                Gunakan Ini
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 space-y-3 pt-2">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Cari opsi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs sm:text-sm bg-secondary"
              />
              {search && (
                <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick manual entry button */}
            {allowManual && (
              <button
                type="button"
                onClick={() => {
                  setManualInput(value && isCustomValue ? value : '');
                  setIsManualMode(true);
                }}
                className="flex items-center justify-between p-2.5 rounded-xl border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-semibold transition-all"
              >
                <span className="flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" /> Tidak ada di daftar? Klik untuk isi manual...
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Grouped Options List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[380px]">
              {options.map((group) => {
                const filtered = group.options.filter(o =>
                  !search || o.toLowerCase().includes(search.toLowerCase())
                );
                if (filtered.length === 0) return null;

                return (
                  <div key={group.group} className="space-y-1.5">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1">
                      {group.group}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {filtered.map((opt) => {
                        const isSelected = value === opt;
                        const isManualChoice = opt.includes('Lainnya (Isi Manual)');
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleChoose(opt)}
                            className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium text-left transition-all border ${
                              isSelected
                                ? 'bg-primary text-primary-foreground border-primary font-bold shadow-sm'
                                : isManualChoice
                                ? 'bg-primary/5 border-primary/30 text-primary hover:bg-primary/10'
                                : 'bg-secondary/50 hover:bg-secondary border-border text-foreground hover:border-primary/40'
                            }`}
                          >
                            <span className="truncate">{opt}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
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
