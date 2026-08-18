import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Step1Framework } from "@/components/steps/Step1Framework";
import { Step2Product } from "@/components/steps/Step2Product";
import { Step3Target } from "@/components/steps/Step3Target";
import { Step4Detail } from "@/components/steps/Step4Detail";
import { Step5Design } from "@/components/steps/Step5Design";
import { Step6Elements } from "@/components/steps/Step6Elements";
import { Step7Platform } from "@/components/steps/Step7Platform";
import { StepSalesNotif } from "@/components/steps/StepSalesNotif";
import { StepCountdown } from "@/components/steps/StepCountdown";
import { HtmlPreviewEditor } from "@/components/editor/HtmlPreviewEditor";
import { TemplateGallery } from "@/components/templates/TemplateGallery";
import { FormState, initialFormState, SalesNotifConfig, CountdownConfig, ScarcitySeatConfig, BonusItem, TieredPricingConfig, CtaModeConfig, DesignTypographyConfig, MetaCapiConfig } from "@/types/form";
import { generatePrompt } from "@/utils/generatePrompt";
import { Button } from "@/components/ui/button";
import { Zap, RotateCcw, Copy, ExternalLink, Lock, FileCode, KeyRound, PlayCircle, ShieldCheck, FolderOpen, Target, Video, Timer, DollarSign, BookmarkPlus, Globe, Sparkles, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CostBreakdownModal } from "@/components/CostBreakdownModal";
import HtmlGeneratorTab from "@/components/admin/HtmlGeneratorTab";
import UserWebhookSettings from "@/components/user/UserWebhookSettings";
import { TutorialFullPage } from "@/components/TutorialFullPage";
import { SavedProjectsDialog } from "@/components/projects/SavedProjectsDialog";
import { LandingPageAuditor } from "@/components/audit/LandingPageAuditor";
import { CompetitorSpy } from "@/components/tools/CompetitorSpy";
import { CreativeSync } from "@/components/tools/CreativeSync";
import { FiveSecondTest } from "@/components/tools/FiveSecondTest";
import { QuickPromptMode } from "@/components/tools/QuickPromptMode";
import { AffiliateProgram } from "@/components/affiliate/AffiliateProgram";
import { LiveBlueprintDisplay } from "@/components/preview/LiveBlueprintDisplay";
import { translations, Language } from "@/utils/i18n";

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center py-3">
      {[1, 2, 3].map((s) => {
        const done = s < current;
        const active = s === current;
        return (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition-all ${active ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30' : done ? 'bg-transparent text-emerald-400 border-emerald-500' : 'bg-transparent text-muted-foreground border-muted-foreground/30'}`}>
              {done ? <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : s}
            </div>
            {s < 3 && <div className={`w-8 sm:w-16 h-0.5 transition-all ${done ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />}
          </div>
        );
      })}
    </div>
  );
}

function GeneratingLoader() {
  const steps = [
    { icon: '🔍', text: 'Menganalisis profil produk & target audience...' },
    { icon: '✍️', text: 'Menyusun framework copywriting persuasif...' },
    { icon: '🎨', text: 'Menerapkan warna brand & tipografi...' },
    { icon: '🧱', text: 'Membangun struktur section...' },
    { icon: '⚡', text: 'Finalisasi master prompt high-converting...' },
  ];
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 flex flex-col items-center justify-center min-h-[50vh]">
      <motion.div
        className="relative w-16 h-16 sm:w-20 sm:h-20 mb-6"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-muted" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary" />
      </motion.div>

      <div className="space-y-2.5 w-full">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: i <= activeStep ? 1 : 0.3,
              x: i <= activeStep ? 0 : -20,
            }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl transition-colors ${i === activeStep ? 'bg-primary/10 border border-primary/30' : i < activeStep ? 'bg-muted/30' : ''}`}
          >
            <span className="text-base">{i < activeStep ? '✅' : step.icon}</span>
            <span className={`text-xs sm:text-sm font-medium ${i === activeStep ? 'text-primary font-bold' : i < activeStep ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>
              {step.text}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PromptStep({ promptText, onBack, onNext }: { promptText: string; onBack: () => void; onNext: () => void }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    toast({ title: '📋 Prompt Berhasil Disalin!', description: 'Tempelkan ke Claude, ChatGPT, atau AI Builder favorit Anda.' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-2 sm:p-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h2 className="text-base sm:text-xl font-black text-foreground">✨ Master Prompt Siap Digunakan</h2>
          <p className="text-xs text-muted-foreground">Salin prompt ini ke AI pilihan Anda atau langsung buka di Live HTML Editor.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleCopy} className="gap-1.5 text-xs h-9 bg-primary text-primary-foreground font-bold">
            <Copy className="w-3.5 h-3.5" /> {copied ? 'Tersalin!' : 'Salin Prompt'}
          </Button>
          <Button onClick={onNext} variant="outline" className="gap-1.5 text-xs h-9 font-semibold">
            Buka Live Editor →
          </Button>
        </div>
      </div>

      <div className="relative rounded-2xl border border-border bg-card p-3 sm:p-5 shadow-xl">
        <ScrollArea className="h-[420px] sm:h-[500px] pr-2">
          <pre className="text-xs sm:text-sm font-mono text-foreground whitespace-pre-wrap leading-relaxed">
            {promptText}
          </pre>
        </ScrollArea>
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={onBack} className="text-xs">
          ← Kembali Edit Form
        </Button>
      </div>
    </div>
  );
}

export default function AppPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [form, setForm] = useState<FormState>(initialFormState);
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [templateHtml, setTemplateHtml] = useState("");
  const [mode, setMode] = useState<'prompt' | 'template'>('prompt');

  const [loading, setLoading] = useState(true);
  const [userTier, setUserTier] = useState<'free' | 'paid'>('free');
  const [promptUsage, setPromptUsage] = useState(0);
  const [usageLimitReached, setUsageLimitReached] = useState(false);
  const [orderUrl, setOrderUrl] = useState('');
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  const activePage = searchParams.get('tab') || 'generator';
  const isPaid = userTier === 'paid';
  const FREE_LIMIT = 5;

  const currentLang: Language = form.language || 'id';
  const t = translations[currentLang] || translations.id;

  const handlePageChange = (tabName: string) => {
    setSearchParams({ tab: tabName });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load draft from localStorage
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('lpb_form_draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && typeof parsed === 'object') {
          setForm(prev => ({ ...prev, ...parsed }));
        }
      }
    } catch {}
  }, []);

  // Autosave form draft
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('lpb_form_draft', JSON.stringify(form));
      } catch {}
    }, 1000);
    return () => clearTimeout(timer);
  }, [form]);

  // Auth & Session Check
  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }
      setUserId(session.user.id);
      setUserEmail(session.user.email || '');

      const isAdmin = session.user.email === 'fauzymnf29@gmail.com';

      const { data: entitlements } = await supabase
        .from("entitlements")
        .select("id, product_code, status")
        .eq("user_id", session.user.id);

      const hasPaid = isAdmin || entitlements?.some((e: any) => e.status === 'active' && e.product_code === 'LPE');
      setUserTier(hasPaid ? 'paid' : 'free');

      try {
        const { data: settings } = await (supabase as any).from('app_settings').select('value').eq('key', 'scalev_order_url').maybeSingle();
        if (settings?.value) setOrderUrl(settings.value);
      } catch {}

      if (!hasPaid) {
        const { data: usage } = await supabase.from('prompt_usage').select('used_count').eq('user_id', session.user.id).maybeSingle();
        const count = usage?.used_count ?? 0;
        setPromptUsage(count);
        setUsageLimitReached(count >= FREE_LIMIT);
      }

      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate("/login");
    });
    checkAccess();
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleChange = useCallback((field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSalesNotifChange = useCallback((config: SalesNotifConfig) => {
    setForm(prev => ({ ...prev, salesNotif: config }));
  }, []);

  const handleCountdownChange = useCallback((config: CountdownConfig) => {
    setForm(prev => ({ ...prev, countdown: config }));
  }, []);

  const handleScarcityChange = useCallback((config: ScarcitySeatConfig) => {
    setForm(prev => ({ ...prev, scarcitySeat: config }));
  }, []);

  const handleToggleElement = useCallback((element: string) => {
    setForm(prev => ({ ...prev, elemenTambahan: { ...prev.elemenTambahan, [element]: !prev.elemenTambahan[element] } }));
  }, []);

  const handleChangeBonusList = useCallback((list: BonusItem[]) => {
    setForm(prev => ({ ...prev, bonusList: list }));
  }, []);

  const handleGenerate = async () => {
    if (!isPaid && usageLimitReached) {
      toast({ title: '🔒 Limit Tercapai', description: `Kamu sudah menggunakan ${FREE_LIMIT}x generate gratis. Upgrade untuk unlimited.`, variant: 'destructive' });
      return;
    }
    setIsGenerating(true);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!isPaid) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const newCount = promptUsage + 1;
        await supabase.from('prompt_usage').upsert({ user_id: session.user.id, used_count: newCount, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
        setPromptUsage(newCount);
        if (newCount >= FREE_LIMIT) setUsageLimitReached(true);
      }
    }

    setTimeout(() => {
      const prompt = generatePrompt(form);
      setPromptText(prompt);
      setIsGenerating(false);
    }, 2200);
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

  const handleSaveAsCustomTemplate = async (htmlToSave: string) => {
    const name = prompt('Masukkan Nama Template Kustom Anda:', form.namaProduk || 'Template Kustom');
    if (!name) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUid = userId || session?.user?.id;
      if (!currentUid) {
        toast({ title: 'Sesi habis', description: 'Silakan login kembali.', variant: 'destructive' });
        return;
      }

      await supabase.from('custom_user_templates').insert({
        user_id: currentUid,
        title: name,
        description: `Dibuat dari proyek ${form.namaProduk || 'Custom'} (${form.platformTarget || 'Scalev'})`,
        category: 'Template Saya',
        html_content: htmlToSave,
        form_data: form as any,
      });

      toast({ title: '⭐ Template Kustom Disimpan', description: `"${name}" kini tersedia di Galeri Template Anda.` });
    } catch (err: any) {
      toast({ title: 'Gagal Menyimpan', description: err.message, variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground text-xs sm:text-sm">Memuat aplikasi...</p></div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky Top Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/80 shadow-sm">
        <Header darkMode={darkMode} onToggleDark={() => setDarkMode(!darkMode)} />

        {/* Sticky Tab Navigation Bar */}
        <div className="max-w-[1440px] mx-auto px-2 sm:px-6">
          <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none py-1.5">
            <div className="flex gap-1 items-center flex-shrink-0">
              <button
                type="button"
                onClick={() => handlePageChange('generator')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold transition-all rounded-xl ${
                  activePage === 'generator' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{t.generator}</span>
              </button>

              <button
                type="button"
                onClick={() => handlePageChange('quick_prompt')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold transition-all rounded-xl ${
                  activePage === 'quick_prompt' ? 'bg-amber-500 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.quickPrompt}</span>
              </button>

              <button
                type="button"
                onClick={() => handlePageChange('competitor_spy')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold transition-all rounded-xl ${
                  activePage === 'competitor_spy' ? 'bg-red-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.competitorSpy}</span>
                <span className="sm:hidden">Spy</span>
              </button>

              <button
                type="button"
                onClick={() => handlePageChange('creative_sync')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold transition-all rounded-xl ${
                  activePage === 'creative_sync' ? 'bg-purple-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.creativeSync}</span>
                <span className="sm:hidden">Sync</span>
              </button>

              <button
                type="button"
                onClick={() => handlePageChange('five_second')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold transition-all rounded-xl ${
                  activePage === 'five_second' ? 'bg-amber-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.fiveSecond}</span>
                <span className="sm:hidden">5s</span>
              </button>

              <button
                type="button"
                onClick={() => handlePageChange('audit')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold transition-all rounded-xl ${
                  activePage === 'audit' ? 'bg-emerald-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.auditLp}</span>
              </button>

              <button
                type="button"
                onClick={() => handlePageChange('templates')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold transition-all rounded-xl ${
                  activePage === 'templates' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <span>{t.templates}</span>
              </button>

              <button
                type="button"
                onClick={() => handlePageChange('affiliate')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold transition-all rounded-xl ${
                  activePage === 'affiliate' ? 'bg-emerald-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>{t.affiliate}</span>
              </button>
            </div>

            {/* Right Tools: Language & Saved Projects */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Language Switcher */}
              <button
                type="button"
                onClick={() => handleChange('language', form.language === 'id' ? 'en' : 'id')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-secondary border border-border text-xs font-bold text-foreground hover:border-primary transition-all shadow-sm"
                title="Ganti Bahasa (Language Switcher)"
              >
                <Globe className="w-3.5 h-3.5 text-primary" />
                <span>{form.language === 'en' ? '🇬🇧 EN' : '🇮🇩 ID'}</span>
              </button>

              <SavedProjectsDialog
                currentForm={form}
                userId={userId}
                onLoadProject={(formData) => {
                  setForm(formData);
                  setPromptText("");
                  setCurrentStep(1);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Container */}
      <div className="max-w-[1440px] mx-auto px-2.5 sm:px-6 py-4 sm:py-6">
        {/* TAB 1: GENERATOR & BLUEPRINT WIZARD */}
        {activePage === 'generator' && (
          <div>
            <Stepper current={currentStep} />

            {currentStep === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left / Center Wizard Form Steps */}
                <div className="lg:col-span-8 space-y-4">
                  <Step1Framework
                    framework={form.framework}
                    gayaBahasa={form.gayaBahasa}
                    onChange={handleChange}
                  />

                  <Step2Product
                    tipeProduk={form.tipeProduk}
                    tujuanUtama={form.tujuanUtama}
                    trafficCategory={form.trafficCategory}
                    onChange={handleChange}
                  />

                  <Step3Target
                    levelAwareness={form.levelAwareness}
                    targetAudience={form.targetAudience}
                    onChange={handleChange}
                  />

                  <Step4Detail
                    namaProduk={form.namaProduk}
                    hargaNormal={form.hargaNormal}
                    hargaPromo={form.hargaPromo}
                    hargaFinal={form.hargaFinal}
                    keteranganDiskon={form.keteranganDiskon}
                    pricingLayersConfig={form.pricingLayersConfig}
                    tieredPricing={form.tieredPricing}
                    ctaMode={form.ctaMode}
                    bonusList={form.bonusList}
                    deskripsiBenefit={form.deskripsiBenefit}
                    ctaUtama={form.ctaUtama}
                    onChange={handleChange}
                    onChangeBonusList={handleChangeBonusList}
                    onChangeTieredPricing={(t) => handleChange('tieredPricing', t)}
                    onChangeCtaMode={(c) => handleChange('ctaMode', c)}
                  />

                  <Step5Design
                    warnaBrand={form.warnaBrand}
                    warnaBrandCustom={form.warnaBrandCustom}
                    tema={form.tema}
                    gayaDesain={form.gayaDesain}
                    typography={form.typography}
                    onChange={handleChange}
                    onChangeTypography={(t) => handleChange('typography', t)}
                  />

                  <Step6Elements
                    elemenTambahan={form.elemenTambahan}
                    metaCapi={form.metaCapi}
                    onToggle={handleToggleElement}
                    onChangeMetaCapi={(c) => handleChange('metaCapi', c)}
                  />

                  <Step7Platform
                    platformTarget={form.platformTarget}
                    deviceTarget={form.deviceTarget}
                    onChange={handleChange}
                  />

                  {/* (Step 8 Media Foto/Video & Link Referensi removed as requested) */}

                  <StepSalesNotif
                    salesNotif={form.salesNotif}
                    onChange={handleSalesNotifChange}
                  />

                  <StepCountdown
                    countdown={form.countdown}
                    scarcitySeat={form.scarcitySeat}
                    onChange={handleCountdownChange}
                    onChangeScarcity={handleScarcityChange}
                  />

                  {/* Submit Generate Action Bar */}
                  <div className="pt-4 flex items-center justify-between gap-3 sticky bottom-4 p-3.5 sm:p-4 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-2xl z-30">
                    <Button variant="ghost" onClick={() => setForm(initialFormState)} className="text-xs text-muted-foreground">
                      <RotateCcw className="w-3.5 h-3.5 mr-1" /> {t.resetForm}
                    </Button>

                    <Button
                      onClick={handleGenerate}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs sm:text-sm px-5 sm:px-7 h-11 gap-2 shadow-lg shadow-primary/30"
                    >
                      <Zap className="w-4 h-4" /> {t.generateMasterPrompt}
                    </Button>
                  </div>
                </div>

                {/* Right Side Live Blueprint Display (Desktop & Tablet) */}
                <div className="hidden lg:block lg:col-span-4">
                  <LiveBlueprintDisplay form={form} />
                </div>
              </div>
            )}

            {currentStep === 2 && isGenerating && <GeneratingLoader />}

            {currentStep === 2 && !isGenerating && (
              <PromptStep
                promptText={promptText}
                onBack={() => setCurrentStep(1)}
                onNext={() => setCurrentStep(3)}
              />
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 p-3 bg-secondary/50 rounded-2xl border border-border flex-wrap">
                  <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)} className="text-xs">
                    {t.backToPrompt}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSaveAsCustomTemplate(templateHtml || promptText)}
                    className="gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" /> {t.saveAsTemplate}
                  </Button>
                </div>

                <HtmlPreviewEditor
                  onBack={() => setCurrentStep(2)}
                  initialHtml={templateHtml || ''}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROMPT CEPAT */}
        {activePage === 'quick_prompt' && (
          <QuickPromptMode
            onApplyQuickForm={(quickForm) => {
              setForm(quickForm);
              handlePageChange('generator');
            }}
          />
        )}

        {/* TAB 3: COMPETITOR SPY */}
        {activePage === 'competitor_spy' && <CompetitorSpy />}

        {/* TAB 4: CREATIVE SYNC */}
        {activePage === 'creative_sync' && <CreativeSync />}

        {/* TAB 5: TES 5 DETIK */}
        {activePage === 'five_second' && <FiveSecondTest />}

        {/* TAB 6: AUDIT LP */}
        {activePage === 'audit' && <LandingPageAuditor />}

        {/* TAB 7: TEMPLATES GALLERY */}
        {activePage === 'templates' && (
          <TemplateGallery
            onSelectTemplate={handleSelectTemplate}
            isPaid={isPaid}
            orderUrl={orderUrl}
            userId={userId}
          />
        )}

        {/* TAB 8: AFFILIATE PROGRAM */}
        {activePage === 'affiliate' && (
          <AffiliateProgram
            userId={userId}
            userEmail={userEmail}
            isAdmin={userEmail === 'fauzymnf29@gmail.com'}
          />
        )}

        {/* TAB 9: LP BUILDER */}
        {activePage === 'lpbuilder' && isPaid && <HtmlGeneratorTab />}

        {/* TAB 10: WEBHOOK */}
        {activePage === 'webhook' && isPaid && <UserWebhookSettings userId={userId} />}

        {/* TAB 11: TUTORIAL */}
        {activePage === 'tutorial' && isPaid && <TutorialFullPage />}
      </div>
    </div>
  );
}
