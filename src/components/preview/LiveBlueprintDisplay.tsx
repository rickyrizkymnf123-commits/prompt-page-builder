import React from 'react';
import { FormState } from '@/types/form';
import { Sparkles, Eye, Layers, Flame, CheckCircle, ArrowRight, Shield } from 'lucide-react';
import { frameworkDetails } from '@/components/framework/FrameworkGuideModal';

interface Props {
  form: FormState;
}

export function LiveBlueprintDisplay({ form }: Props) {
  const currentDetail = frameworkDetails.find(
    f => f.name === form.framework || form.framework?.startsWith(f.name.split(' ')[0])
  );

  const brandColor = form.warnaBrandCustom || '#6c63ff';
  const isNoPrice = form.pricingLayersConfig?.noPriceMode;

  return (
    <div className="sticky top-20 space-y-4">
      {/* Header Badge */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Live Blueprint Display
          </span>
        </div>
        <span className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-mono font-bold">
          {form.platformTarget || 'Scalev'} · {form.deviceTarget || 'Mobile'}
        </span>
      </div>

      {/* Blueprint Visual Preview Card */}
      <div className="rounded-2xl border border-border bg-card/90 overflow-hidden shadow-xl space-y-3 p-4">
        {/* Mock LP Hero Header */}
        <div
          className="p-4 rounded-xl text-center space-y-2 relative overflow-hidden transition-all duration-300"
          style={{
            background: form.tema?.includes('Light') ? '#ffffff' : '#0b0f19',
            color: form.tema?.includes('Light') ? '#0f172a' : '#ffffff',
            border: `1px solid ${brandColor}40`,
          }}
        >
          <div
            className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-1"
            style={{ backgroundColor: `${brandColor}20`, color: brandColor }}
          >
            {form.tipeProduk || 'Solusi Pilihan Terbaik'}
          </div>

          <h3 className="font-extrabold text-sm sm:text-base leading-tight">
            {form.namaProduk || 'Nama Produk Anda'}
          </h3>

          <p className="text-[11px] text-muted-foreground line-clamp-2">
            {form.deskripsiBenefit || 'Deskripsi singkat transformasi dan keunggulan utama yang didapatkan pembeli.'}
          </p>

          {/* Pricing Preview Badge */}
          <div className="pt-2">
            {isNoPrice ? (
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                100% Gratis / Pendaftaran Agen
              </span>
            ) : form.pricingLayersConfig?.layerFinal && form.hargaFinal ? (
              <div className="space-y-0.5">
                {form.pricingLayersConfig.layerNormal && form.hargaNormal && (
                  <span className="text-[10px] text-destructive line-through mr-1.5">
                    Rp {Number(form.hargaNormal).toLocaleString('id-ID')}
                  </span>
                )}
                <span className="text-sm font-black" style={{ color: brandColor }}>
                  Rp {Number(form.hargaFinal).toLocaleString('id-ID')}
                </span>
              </div>
            ) : (
              <span className="text-xs font-bold text-muted-foreground">Harga Spesial Promo</span>
            )}
          </div>

          {/* Mock CTA Button */}
          <div className="pt-2">
            <button
              type="button"
              className="w-full py-2 px-3 rounded-lg text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-1.5"
              style={{ backgroundColor: brandColor }}
            >
              <span>{form.ctaUtama || 'Beli Sekarang'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-[9px] text-muted-foreground block mt-1">
              {form.ctaMode?.type === 'whatsapp' ? '💬 Direct Chat WhatsApp' : '🔒 Pembayaran Aman & Instan'}
            </span>
          </div>
        </div>

        {/* Framework Structure Stages */}
        {currentDetail ? (
          <div className="p-3 rounded-xl bg-secondary/60 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                Alur {currentDetail.name.split(' ')[0]}:
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">{currentDetail.group}</span>
            </div>
            <p className="text-[11px] text-amber-400 font-mono leading-relaxed">
              {currentDetail.structure}
            </p>
            <p className="text-[10px] text-muted-foreground leading-relaxed pt-1 border-t border-border/40">
              💡 {currentDetail.summary}
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-secondary/40 border border-dashed border-border/60 text-center space-y-1">
            <Sparkles className="w-4 h-4 text-primary mx-auto opacity-60" />
            <p className="text-xs font-semibold text-muted-foreground">Pilih Framework di Step 1</p>
            <p className="text-[10px] text-muted-foreground">Alur copywriting dan contoh penerapannya akan muncul di sini secara realtime.</p>
          </div>
        )}

        {/* Scarcity / Urgency Live Preview */}
        {form.scarcitySeat?.enabled && (
          <div className="p-2.5 rounded-xl bg-secondary/60 border border-amber-500/30 text-center space-y-1.5">
            <span className="text-[10px] font-bold text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" /> Sisa {form.scarcitySeat.sisaSeat} dari {form.scarcitySeat.totalSeat} Slot!
            </span>
            <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border">
              <div
                className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full"
                style={{ width: `${Math.min(100, Math.round(((form.scarcitySeat.totalSeat - form.scarcitySeat.sisaSeat) / (form.scarcitySeat.totalSeat || 1)) * 100))}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
