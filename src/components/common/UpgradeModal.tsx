import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Lock,
  CheckCircle,
  MessageCircle,
  Copy,
  Check,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ADMIN_WA_NUMBER = '6285603962335';
export const ADMIN_WA_DISPLAY = '+62 856-0396-2335';

export function getAdminWaUrl(purpose: 'approval' | 'upgrade', userEmail?: string, featureName?: string) {
  let message = '';
  if (purpose === 'approval') {
    message = `Halo Admin, saya baru saja mendaftar di Prompt Page Builder dengan email: ${userEmail || '...'}.\nMohon untuk di-ACC akun saya agar bisa mulai membuat Landing Page. Terima kasih!`;
  } else {
    const feat = featureName ? `"${featureName}"` : 'fitur-fitur premium';
    message = `Halo Admin, saya pengguna Prompt Page Builder (Email: ${userEmail || '...'}).\nSaya ingin upgrade ke Tier Berbayar (Pro) untuk membuka akses ${feat}.\n\nMohon informasi biaya & proses aktivasinya. Terima kasih!`;
  }
  return `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName?: string;
  userEmail?: string;
}

export function UpgradeModal({ open, onOpenChange, featureName, userEmail }: Props) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(ADMIN_WA_DISPLAY);
    setCopied(true);
    toast({
      title: '📋 Nomor WA Disalin',
      description: `${ADMIN_WA_DISPLAY} telah disalin ke clipboard.`,
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const waUrl = getAdminWaUrl('upgrade', userEmail, featureName);

  const proFeatures = [
    'AI LP Clone & Re-Angle 1:1 (Duplikat LP Kompetitor)',
    'AI Competitor Spy (Bedah Angle & Penawaran Lawan)',
    'Creative-to-LP Sync (Ekstrak Hook TikTok/FB Ads ke LP)',
    'Prompt Cepat (AI Auto-Fill Form 1-Klik)',
    'Tes 5 Detik & Formula Quick Fix Skor Kejelasan',
    'AI Landing Page Auditor (5 Pilar Konversi & Anti-Banned)',
    'Galeri Template Siap Pakai & Visual Customizer',
    'Live LP Builder Engine HTML Langsung',
    'Unlimited Generate Master Prompt tanpa batasan kuota',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-border bg-card/95 backdrop-blur-2xl shadow-2xl rounded-2xl">
        {/* Header Banner with Gradient */}
        <div className="relative p-6 pb-4 bg-gradient-to-br from-purple-600/20 via-indigo-600/10 to-transparent border-b border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" /> Fitur Khusus Member Pro
              </div>
              <DialogTitle className="text-lg sm:text-xl font-black text-foreground">
                {featureName ? `Buka Akses ${featureName}` : 'Upgrade ke Tier Berbayar (Pro)'}
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
            Akun Tier Gratis Anda saat ini hanya dapat mengakses <strong className="text-foreground">LP Generator (Utama)</strong>. Upgrade ke member Pro untuk membuka seluruh alat kecerdasan buatan dan template siap pakai.
          </DialogDescription>
        </div>

        {/* Pro Benefits List */}
        <div className="p-6 py-4 space-y-4 max-h-[48vh] overflow-y-auto">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-primary" /> Yang Anda Dapatkan di Tier Pro:
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {proFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2 rounded-lg bg-secondary/50 border border-border/60 text-xs text-foreground/90"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Admin Box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground">WhatsApp Admin Resmi</p>
                <p className="text-[11px] text-muted-foreground">Hubungi Admin untuk aktivasi tier Pro langsung</p>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                {ADMIN_WA_DISPLAY}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Admin via WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </a>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyPhone}
                className="h-10 px-3 rounded-xl border-border text-xs gap-1.5 hover:bg-secondary"
                title="Salin Nomor WhatsApp"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Tersalin' : 'Salin'}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-secondary/40 border-t border-border/50 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            Aktivasi cepat dalam hitungan menit via Admin
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs h-8 px-3 rounded-lg"
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
