import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Step1Framework } from "@/components/steps/Step1Framework";
import { Step2Product } from "@/components/steps/Step2Product";
import { Step3Target } from "@/components/steps/Step3Target";
import { Step4Detail } from "@/components/steps/Step4Detail";
import { Step5Design } from "@/components/steps/Step5Design";
import { Step6Elements } from "@/components/steps/Step6Elements";
import { Step7Platform } from "@/components/steps/Step7Platform";
import { Step8Reference } from "@/components/steps/Step8Reference";
import { StepSalesNotif } from "@/components/steps/StepSalesNotif";
import { StepCountdown } from "@/components/steps/StepCountdown";
import { HtmlPreviewEditor } from "@/components/editor/HtmlPreviewEditor";
import { TemplateGallery } from "@/components/templates/TemplateGallery";
import { FormState, initialFormState, SalesNotifConfig, CountdownConfig, BonusItem } from "@/types/form";
import { generatePrompt } from "@/utils/generatePrompt";
import { Button } from "@/components/ui/button";
import { Zap, RotateCcw, Copy, ExternalLink, Lock, FileCode, KeyRound, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TypewriterText } from "@/components/TypewriterText";
import { CostBreakdownModal } from "@/components/CostBreakdownModal";
import { TutorialPanel } from "@/components/TutorialPanel";
import HtmlGeneratorTab from "@/components/admin/HtmlGeneratorTab";
import UserWebhookSettings from "@/components/user/UserWebhookSettings";
import { TutorialFullPage } from "@/components/TutorialFullPage";

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center py-4">
      {[1, 2, 3].map((s) => {
        const done = s < current;
        const active = s === current;
        return (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${active ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30' : done ? 'bg-transparent text-green-400 border-green-500' : 'bg-transparent text-muted-foreground border-muted-foreground/30'}`}>
              {done ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : s}
            </div>
            {s < 3 && <div className={`w-16 h-0.5 transition-all ${done ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />}
          </div>
        );
      })}
    </div>
  );
}

function GeneratingLoader() {
  const steps = [
    { icon: '🔍', text: 'Menganalisis profil produk...' },
    { icon: '✍️', text: 'Menyusun framework copywriting...' },
    { icon: '🎨', text: 'Menerapkan gaya desain...' },
    { icon: '🧱', text: 'Membangun struktur section...' },
    { icon: '⚡', text: 'Finalisasi prompt...' },
  ];
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
      {/* Spinner */}
      <motion.div
        className="relative w-20 h-20 mb-8"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-muted" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary" />
      </motion.div>

      {/* Steps */}
      <div className="space-y-3 w-full">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: i <= activeStep ? 1 : 0.3,
              x: i <= activeStep ? 0 : -20,
            }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${i === activeStep ? 'bg-primary/10 border border-primary/30' : i < activeStep ? 'bg-muted/30' : ''}`}
          >
            <span className="text-lg">{i < activeStep ? '✅' : step.icon}</span>
            <span className={`text-sm font-medium ${i === activeStep ? 'text-primary' : i < activeStep ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>
              {step.text}
            </span>
            {i === activeStep && (
              <motion.div
                className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </motion.div>
        ))}
      </div>

      <motion.p
        className="mt-8 text-xs text-muted-foreground text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Generating prompt berkualitas tinggi...
      </motion.p>
    </div>
  );
}

function PromptStep({ promptText, onBack, onNext }: { promptText: string; onBack: () => void; onNext: () => void }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(promptText);
    toast({ title: 'Prompt disalin!' });
  };
  const handleBuat = async () => {
    try { await navigator.clipboard.writeText(promptText); } catch {}
    window.open('https://chat.z.ai/', '_blank', 'noopener,noreferrer');
    toast({ title: '✅ Prompt sudah disalin!', description: 'Paste prompt lalu tekan Enter.' });
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6"
    >
      <Stepper current={2} />
      <p className="text-center text-xs sm:text-sm text-muted-foreground">Copy prompt lalu buka AI favorit kamu</p>
      <div className="rounded-xl border border-border bg-card p-3 sm:p-5">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-sm sm:text-base font-semibold text-foreground">📋 Prompt Siap Digunakan</h2>
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 text-xs sm:text-sm"><Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Copy</Button>
        </div>
        <ScrollArea className="h-48 sm:h-64">
          <pre className="text-xs sm:text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed p-2 sm:p-3 bg-secondary rounded-lg"><TypewriterText text={promptText} /></pre>
        </ScrollArea>
      </div>
      <Button onClick={handleBuat} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2 text-sm" size="lg">
        <ExternalLink className="h-4 w-4" /> Buat Landing Page
      </Button>
      <Button variant="outline" onClick={onNext} className="w-full gap-2 text-sm" size="lg">Lanjut ke Preview & Edit HTML →</Button>
      <Button variant="outline" onClick={onBack} className="w-full text-sm">← Kembali Edit Form</Button>
    </motion.div>
  );
}

export default function AppPage() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [form, setForm] = useState<FormState>({ ...initialFormState });
  const [promptText, setPromptText] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isDirty, setIsDirty] = useState(false);
  const [mode, setMode] = useState<'manual' | 'template'>('manual');
  const [templateHtml, setTemplateHtml] = useState('');
  const [userTier, setUserTier] = useState<'free' | 'paid'>('free');
  const [orderUrl, setOrderUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptUsage, setPromptUsage] = useState(0);
  const [usageLimitReached, setUsageLimitReached] = useState(false);
  const [activePage, setActivePage] = useState<'generator' | 'lpbuilder' | 'webhook'>('generator');
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const FREE_LIMIT = 5;

  const isPaid = userTier === 'paid';

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }
      setUserId(session.user.id);
      setUserEmail(session.user.email || '');
      const { data: entitlements } = await supabase
        .from("entitlements")
        .select("id, product_code")
        .in("product_code", ["LPE", "LPE_FREE"])
        .eq("status", "active");
      if (!entitlements || entitlements.length === 0) { await supabase.auth.signOut(); navigate("/login"); return; }
      const hasPaid = entitlements.some((e: any) => e.product_code === 'LPE');
      setUserTier(hasPaid ? 'paid' : 'free');
      
      try {
        const { data: settings } = await (supabase as any).from('app_settings').select('value').eq('key', 'scalev_order_url').maybeSingle();
        if (settings?.value) setOrderUrl(settings.value);
      } catch {}

      // Fetch prompt usage for free users
      if (!hasPaid) {
        const { data: usage } = await supabase.from('prompt_usage').select('used_count').eq('user_id', session.user.id).maybeSingle();
        const count = usage?.used_count ?? 0;
        setPromptUsage(count);
        setUsageLimitReached(count >= 5);
      }
      
      setLoading(false);
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate("/login");
    });
    checkAccess();
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => { document.documentElement.classList.toggle("dark", darkMode); }, [darkMode]);

  const handleChange = useCallback((field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (currentStep > 1) setIsDirty(true);
  }, [currentStep]);

  const handleSalesNotifChange = useCallback((config: SalesNotifConfig) => {
    setForm(prev => ({ ...prev, salesNotif: config }));
    if (currentStep > 1) setIsDirty(true);
  }, [currentStep]);

  const handleCountdownChange = useCallback((config: CountdownConfig) => {
    setForm(prev => ({ ...prev, countdown: config }));
    if (currentStep > 1) setIsDirty(true);
  }, [currentStep]);

  const handleToggleElement = useCallback((element: string) => {
    setForm(prev => ({ ...prev, elemenTambahan: { ...prev.elemenTambahan, [element]: !prev.elemenTambahan[element] } }));
    if (currentStep > 1) setIsDirty(true);
  }, [currentStep]);

  const handleChangeBonusList = useCallback((list: BonusItem[]) => {
    setForm(prev => ({ ...prev, bonusList: list }));
    if (currentStep > 1) setIsDirty(true);
  }, [currentStep]);

  const handleGenerate = async () => {
    if (!isPaid && usageLimitReached) {
      toast({ title: '🔒 Limit Tercapai', description: `Kamu sudah menggunakan ${FREE_LIMIT}x generate gratis. Upgrade untuk unlimited.`, variant: 'destructive' });
      return;
    }
    setIsGenerating(true);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Increment usage for free users
    if (!isPaid) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const newCount = promptUsage + 1;
        await supabase.from('prompt_usage').upsert({ user_id: session.user.id, used_count: newCount, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
        setPromptUsage(newCount);
        if (newCount >= FREE_LIMIT) setUsageLimitReached(true);
        // Warning at 3rd generate
        if (newCount === 3) {
          toast({ title: '⚠️ Sisa 2x Generate', description: 'Kamu sudah pakai 3 dari 5 generate gratis. Upgrade untuk unlimited!' });
        } else if (newCount === 4) {
          toast({ title: '⚠️ Sisa 1x Generate!', description: 'Ini generate ke-4. Setelah ini tinggal 1x lagi!', variant: 'destructive' });
        }
      }
    }

    setTimeout(() => {
      const prompt = generatePrompt(form);
      setPromptText(prompt);
      setIsDirty(false);
      setIsGenerating(false);
    }, 3000);
  };

  const handleReset = () => {
    setForm({ ...initialFormState });
    setPromptText("");
    setCurrentStep(1);
    setIsDirty(false);
  };

  const handleSelectTemplate = (html: string) => {
    if (!isPaid) return;
    setTemplateHtml(html);
    setMode('template');
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpgrade = () => {
    if (orderUrl) window.open(orderUrl, '_blank');
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Memuat...</p></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header darkMode={darkMode} onToggleDark={() => setDarkMode(!darkMode)} />

      {/* Top-level page navigation */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 pt-3 sm:pt-4">
        <div className="flex gap-1 border-b border-border pb-0 mb-0">
          <button type="button" onClick={() => setActivePage('generator')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all border-b-2 -mb-px ${activePage === 'generator' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            <Zap className="w-3.5 h-3.5" /> Prompt Generator
          </button>
          {isPaid && (
            <>
              <button type="button" onClick={() => setActivePage('lpbuilder')}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all border-b-2 -mb-px ${activePage === 'lpbuilder' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                <FileCode className="w-3.5 h-3.5" /> LP Builder
              </button>
              <button type="button" onClick={() => setActivePage('webhook')}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all border-b-2 -mb-px ${activePage === 'webhook' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                <KeyRound className="w-3.5 h-3.5" /> Webhook
              </button>
            </>
          )}
          {!isPaid && (
            <button type="button" onClick={handleUpgrade}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-all border-b-2 -mb-px border-transparent">
              <Lock className="w-3.5 h-3.5" /> LP Builder & Webhook <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full ml-1">PRO</span>
            </button>
          )}
        </div>
      </div>

      {/* LP Builder Page */}
      {activePage === 'lpbuilder' && isPaid && (
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-6">
          <HtmlGeneratorTab isAdmin={false} />
        </div>
      )}

      {/* Webhook Settings Page */}
      {activePage === 'webhook' && isPaid && (
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-6">
          <UserWebhookSettings userId={userId} userEmail={userEmail} />
        </div>
      )}

      {/* Prompt Generator Page (original content) */}
      {activePage === 'generator' && (
      <>
      {/* Upgrade banner for free users */}
      {!isPaid && currentStep === 1 && (
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 pt-3 sm:pt-4">
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-foreground">🆓 Mode Gratis — Fitur terbatas</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Upgrade untuk akses Template, Edit Mode, Countdown, Sales Notification, dan Pixel ID</p>
            </div>
            {orderUrl && (
              <Button size="sm" onClick={handleUpgrade} className="gap-1 w-full sm:w-auto">
                ⭐ Upgrade Sekarang
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Tab Navigation for mode */}
      {currentStep === 1 && (
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
            <button type="button" onClick={() => setMode('manual')} className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${mode === 'manual' ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' : 'bg-card text-muted-foreground border-border hover:border-primary/40'}`}>
              ⚡ Buat Manual
            </button>
            <button type="button" onClick={() => setMode('template')} className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${mode === 'template' ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' : 'bg-card text-muted-foreground border-border hover:border-primary/40'}`}>
              📋 Template {!isPaid && <Lock className="h-3 w-3" />}
            </button>
            {!isPaid && (
              <button type="button" onClick={handleUpgrade} className="flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-all ml-auto cursor-pointer">
                🔒 Premium
              </button>
            )}
          </div>
        </div>
      )}

      {currentStep === 2 && isGenerating && <GeneratingLoader />}
      {currentStep === 2 && !isGenerating && <PromptStep promptText={promptText} onBack={() => setCurrentStep(1)} onNext={() => setCurrentStep(3)} />}

      {currentStep === 3 && (
        <HtmlPreviewEditor
          onBack={() => {
            if (mode === 'template') { setCurrentStep(1); setTemplateHtml(''); }
            else setCurrentStep(2);
          }}
          initialHtml={mode === 'template' ? templateHtml : undefined}
          isPaid={isPaid}
          orderUrl={orderUrl}
        />
      )}

      {currentStep === 1 && mode === 'template' && (
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 pb-12 space-y-4">
          <TutorialPanel />
          <TemplateGallery onSelectTemplate={handleSelectTemplate} isPaid={isPaid} orderUrl={orderUrl} />
        </div>
      )}

      {currentStep === 1 && mode === 'manual' && (
        <div className="max-w-[1440px] mx-auto px-3 sm:p-6">
          {/* Tutorial panel at top of manual mode */}
          <div className="mb-4">
            <TutorialPanel />
          </div>
          <section className="text-center py-8 sm:py-12 px-4 sm:px-6 mb-4 sm:mb-6 rounded-lg border border-border bg-card">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-4 sm:mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />V11 — New Release 🚀
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight max-w-3xl mx-auto">
              Buat Landing Page professional cuman dalam{" "}<span className="text-primary">Hitungan menit</span> <Zap className="inline h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              Generate Landing Page dari format yang benar, karena landing page yang gagal biasanya bukan salah katanya, tapi salah strukturnya.
            </motion.p>
          </section>

          <div className="space-y-3 sm:space-y-4 pb-6">
            <Step1Framework framework={form.framework} gayaBahasa={form.gayaBahasa} onChange={handleChange} />
            <Step2Product tipeProduk={form.tipeProduk} tujuanUtama={form.tujuanUtama} onChange={handleChange} />
            <Step3Target levelAwareness={form.levelAwareness} targetAudience={form.targetAudience} onChange={handleChange} />
            <Step4Detail
              namaProduk={form.namaProduk} hargaNormal={form.hargaNormal} hargaPromo={form.hargaPromo}
              hargaFinal={form.hargaFinal} keteranganDiskon={form.keteranganDiskon}
              bonusList={form.bonusList}
              deskripsiBenefit={form.deskripsiBenefit} ctaUtama={form.ctaUtama}
              onChange={handleChange} onChangeBonusList={handleChangeBonusList}
            />
            <Step5Design warnaBrand={form.warnaBrand} tema={form.tema} gayaDesain={form.gayaDesain} onChange={handleChange} />
            <Step6Elements elemenTambahan={form.elemenTambahan} onToggle={handleToggleElement} />
            <Step7Platform platformTarget={form.platformTarget} deviceTarget={form.deviceTarget} onChange={handleChange} />
            <Step8Reference linkReferensi={form.linkReferensi} inspirasiDesain={form.inspirasiDesain} onChange={handleChange} />
            
            {/* Sales Notif & Countdown - visible for all, locked for free users */}
            {isPaid ? (
              <>
                <StepSalesNotif salesNotif={form.salesNotif} onChange={handleSalesNotifChange} />
                <StepCountdown countdown={form.countdown} onChange={handleCountdownChange} />
              </>
            ) : (
              <div className="relative space-y-4">
                <div className="pointer-events-none opacity-40 select-none">
                  <StepSalesNotif salesNotif={form.salesNotif} onChange={handleSalesNotifChange} />
                  <StepCountdown countdown={form.countdown} onChange={handleCountdownChange} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="bg-card/95 backdrop-blur border border-border rounded-xl p-5 text-center shadow-xl">
                    <div className="flex items-center gap-2 justify-center mb-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-muted-foreground">Sales Notification & Countdown Timer</span>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">PREMIUM</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">Fitur ini hanya tersedia untuk pengguna berbayar.</p>
                    {orderUrl && (
                      <Button size="sm" onClick={handleUpgrade} className="gap-1">
                        ⭐ Upgrade untuk Unlock
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2 pt-2">
            {!isPaid && (
                <div className="text-center space-y-1.5">
                  <p className="text-xs text-muted-foreground">
                    Generate tersisa: <span className={`font-bold ${usageLimitReached ? 'text-destructive' : 'text-primary'}`}>{Math.max(0, FREE_LIMIT - promptUsage)}/{FREE_LIMIT}</span>
                    {usageLimitReached && ' — Upgrade untuk unlimited'}
                  </p>
                  <CostBreakdownModal />
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleReset} className="gap-2"><RotateCcw className="h-4 w-4" /> Reset</Button>
                {!isPaid && usageLimitReached ? (
                  <Button onClick={handleUpgrade} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2" size="lg">
                    <Lock className="h-4 w-4" /> Upgrade untuk Generate ⭐
                  </Button>
                ) : (
                  <Button onClick={handleGenerate} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2" size="lg">
                    <Zap className="h-4 w-4" /> {isDirty ? "Generate Ulang" : "Generate Prompt ⚡"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}
