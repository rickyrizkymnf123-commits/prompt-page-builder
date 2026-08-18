import { useState } from 'react';
import { StepCard } from '@/components/StepCard';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { MetaCapiConfig } from '@/types/form';
import { ArrowUp, ArrowDown, Radio, Sparkles, Check, GripVertical } from 'lucide-react';

const sectionIcons: Record<string, string> = {
  'Hero Section': '🏆',
  'Before-After': '🔄',
  'Feature List': '📋',
  'How It Works': '⚙️',
  'Social Proof': '⭐',
  'Testimonial': '💬',
  'Video Section': '🎥',
  'Bonus Section': '🎁',
  'Pricing Table': '💰',
  'Scarcity / Timer': '⏰',
  'Guarantee': '🛡️',
  'FAQ': '❓',
};

interface Props {
  elemenTambahan: Record<string, boolean>;
  sectionOrder?: string[];
  metaCapi?: MetaCapiConfig;
  onToggle: (element: string) => void;
  onReorder?: (order: string[]) => void;
  onChangeMetaCapi?: (metaCapi: MetaCapiConfig) => void;
}

export function Step6Elements({
  elemenTambahan,
  sectionOrder = Object.keys(sectionIcons),
  metaCapi = { enabled: false, pixelId: '', capiToken: '', eventName: 'Lead' },
  onToggle,
  onReorder,
  onChangeMetaCapi,
}: Props) {
  const activeCount = Object.values(elemenTambahan).filter(Boolean).length;

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (!onReorder) return;
    const newOrder = [...sectionOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;
    onReorder(newOrder);
  };

  return (
    <StepCard step={6} title="Struktur Section & Meta CAPI CTWA">
      {/* 1. SECTION TOGGLE & REORDERING */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Susunan & Urutan Section Landing Page
            </p>
            <p className="text-[11px] text-muted-foreground">
              Aktifkan section yang diinginkan dan gunakan panah naik/turun untuk mengatur alur membaca pengunjung.
            </p>
          </div>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {activeCount} Aktif
          </span>
        </div>

        {/* Section Grid & Reorder List */}
        <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
          {sectionOrder.map((el, index) => {
            const active = elemenTambahan[el] ?? false;
            const icon = sectionIcons[el] || '📌';
            return (
              <div
                key={el}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                  active
                    ? 'bg-secondary/80 border-primary/40 shadow-sm'
                    : 'bg-secondary/20 border-border/40 opacity-50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-sm">{icon}</span>
                  <span className="font-bold text-xs text-foreground truncate">{el}</span>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveSection(index, 'up')}
                    className="w-6 h-6 rounded flex items-center justify-center bg-background border border-border text-muted-foreground hover:text-foreground disabled:opacity-30"
                    title="Geser Naik"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    disabled={index === sectionOrder.length - 1}
                    onClick={() => moveSection(index, 'down')}
                    className="w-6 h-6 rounded flex items-center justify-center bg-background border border-border text-muted-foreground hover:text-foreground disabled:opacity-30"
                    title="Geser Turun"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <Switch
                    checked={active}
                    onCheckedChange={() => onToggle(el)}
                    className="data-[state=checked]:bg-primary ml-1"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. META CONVERSIONS API (CAPI) CTWA TRACKING */}
      <div className="space-y-3 pt-3 border-t border-border/60">
        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
          <div>
            <p className="text-xs sm:text-sm font-bold text-blue-400 flex items-center gap-1.5">
              <Radio className="w-4 h-4" />
              Meta Conversions API (CAPI) untuk Iklan WhatsApp (CTWA)
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Otomatis inject tracking event <code>Lead</code>/<code>Contact</code> ke server Meta saat pengunjung klik tombol WA
            </p>
          </div>
          <Switch
            checked={metaCapi.enabled}
            onCheckedChange={(checked) => onChangeMetaCapi && onChangeMetaCapi({ ...metaCapi, enabled: checked })}
            className="data-[state=checked]:bg-blue-500"
          />
        </div>

        {metaCapi.enabled && (
          <div className="p-3.5 rounded-xl bg-secondary/60 border border-border space-y-2.5 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground">Meta Pixel ID</label>
                <Input
                  placeholder="Contoh: 123456789012345"
                  value={metaCapi.pixelId}
                  onChange={(e) => onChangeMetaCapi && onChangeMetaCapi({ ...metaCapi, pixelId: e.target.value })}
                  className="bg-background text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-foreground">Event Name</label>
                <select
                  value={metaCapi.eventName}
                  onChange={(e) => onChangeMetaCapi && onChangeMetaCapi({ ...metaCapi, eventName: e.target.value })}
                  className="w-full h-9 rounded-xl bg-background border border-border px-2 text-xs font-medium text-foreground"
                >
                  <option value="Lead">Lead (Rekomendasi CTWA)</option>
                  <option value="Contact">Contact</option>
                  <option value="InitiateCheckout">InitiateCheckout</option>
                  <option value="Purchase">Purchase</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-foreground">Meta CAPI Access Token (Opsional)</label>
              <Input
                type="password"
                placeholder="EAA..."
                value={metaCapi.capiToken}
                onChange={(e) => onChangeMetaCapi && onChangeMetaCapi({ ...metaCapi, capiToken: e.target.value })}
                className="bg-background text-xs font-mono"
              />
            </div>
          </div>
        )}
      </div>
    </StepCard>
  );
}
