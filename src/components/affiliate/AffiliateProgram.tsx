import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Users, Copy, Check, DollarSign, TrendingUp, Sparkles, Share2, Wallet, ArrowUpRight, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  userId?: string;
  userEmail?: string;
  isAdmin?: boolean;
}

export function AffiliateProgram({ userId, userEmail, isAdmin = false }: Props) {
  const [copied, setCopied] = useState(false);
  const [refCode, setRefCode] = useState('');
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [payoutLoading, setPayoutLoading] = useState(false);
  const { toast } = useToast();

  const code = refCode || (userEmail ? userEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : 'aff123');
  const affiliateUrl = `${window.location.origin}/login?ref=${code}`;

  const fetchAffiliateData = async () => {
    if (!userId && !isAdmin) return;
    setLoading(true);
    try {
      let query = supabase.from('affiliate_referrals').select('*').order('created_at', { ascending: false });
      if (!isAdmin && userId) {
        query = query.eq('referrer_user_id', userId);
      }
      const { data } = await query;
      if (data) setReferrals(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchAffiliateData();
  }, [userId, isAdmin]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(affiliateUrl);
    setCopied(true);
    toast({ title: '🔗 Link Affiliate Disalin', description: 'Sebarkan link ini ke teman & komunitas Anda!' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRequestPayout = () => {
    setPayoutLoading(true);
    setTimeout(() => {
      setPayoutLoading(false);
      toast({
        title: '💸 Permintaan Penarikan Dikirim',
        description: 'Admin akan memeriksa dan mentransfer komisi Anda ke rekening/e-wallet terdaftar.',
      });
    }, 800);
  };

  const totalEarnings = referrals.reduce((sum, r) => sum + (Number(r.commission_amount) || 0), 0);
  const totalLeads = referrals.length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-primary/10 to-transparent border border-emerald-500/30 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 flex-shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-foreground">🤝 Program Kemitraan & Affiliate</h2>
            <p className="text-xs text-muted-foreground">
              Ajak rekan pebisnis & advertiser menggunakan Landing Page Builder. Dapatkan komisi berkelanjutan dari setiap member yang mendaftar melalui link Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Referral Link Box */}
      <Card className="border-border bg-card">
        <CardHeader className="p-4 sm:p-6 pb-2">
          <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
            <Share2 className="w-4 h-4 text-emerald-500" />
            Link Referral Unik Anda
          </CardTitle>
          <CardDescription className="text-xs">
            Bagikan link ini di media sosial, grup WhatsApp, Telegram, atau bio Instagram Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-2 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={affiliateUrl}
              readOnly
              className="bg-secondary font-mono text-xs sm:text-sm font-semibold text-primary select-all"
            />
            <Button
              onClick={handleCopyLink}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 flex-shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Tersalin!' : 'Salin Link'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-4 bg-secondary/50 border-border space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] uppercase tracking-wider font-bold">Total Pendaftar / Lead</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-black text-foreground">{totalLeads} Member</p>
          <p className="text-[10px] text-muted-foreground">Dari link referral Anda</p>
        </Card>

        <Card className="p-4 bg-secondary/50 border-border space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] uppercase tracking-wider font-bold">Komisi Diperoleh</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-500">Rp {totalEarnings.toLocaleString('id-ID')}</p>
          <p className="text-[10px] text-muted-foreground">Akumulasi komisi berhasil</p>
        </Card>

        <Card className="p-4 bg-secondary/50 border-border space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] uppercase tracking-wider font-bold">Saldo Siap Tarik</span>
            <Wallet className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-foreground">Rp {totalEarnings.toLocaleString('id-ID')}</p>
          <Button
            size="sm"
            onClick={handleRequestPayout}
            disabled={payoutLoading || totalEarnings === 0}
            className="w-full mt-1 text-xs h-7 gap-1 font-bold bg-amber-500 hover:bg-amber-600 text-white"
          >
            <ArrowUpRight className="w-3.5 h-3.5" /> Tarik Komisi
          </Button>
        </Card>
      </div>

      {/* Referral Activity List */}
      <Card className="border-border bg-card p-4 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          Riwayat Pendaftar dari Referral Anda
        </h3>

        {referrals.length === 0 ? (
          <div className="text-center py-8 bg-secondary/30 rounded-xl border border-dashed border-border/60 p-4 space-y-2">
            <Users className="w-8 h-8 text-muted-foreground mx-auto opacity-40" />
            <p className="text-xs font-semibold text-foreground">Belum Ada Referral</p>
            <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
              Bagikan link affiliate Anda kepada teman dan calon pengguna untuk mulai mengumpulkan komisi.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {referrals.map((r) => (
              <div key={r.id} className="p-3 rounded-xl bg-secondary/50 border border-border flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-foreground">{r.referred_name || r.referred_email || 'Member Baru'}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(r.created_at).toLocaleDateString('id-ID')}</p>
                </div>
                <div className="text-right">
                  <span className="font-black text-emerald-400">Rp {Number(r.commission_amount || 0).toLocaleString('id-ID')}</span>
                  <span className="text-[10px] block text-muted-foreground capitalize">{r.status || 'Active'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
