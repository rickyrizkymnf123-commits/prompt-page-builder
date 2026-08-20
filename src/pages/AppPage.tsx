import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { SidebarDrawer } from "@/components/navigation/SidebarDrawer";
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
import { AiApiSettings } from "@/components/settings/AiApiSettings";
import { FormState, initialFormState, SalesNotifConfig, CountdownConfig, ScarcitySeatConfig, BonusItem } from "@/types/form";
import { generatePrompt } from "@/utils/generatePrompt";
import { Button } from "@/components/ui/button";
import { Zap, RotateCcw, Copy, BookmarkPlus, FolderOpen, ChevronRight, Menu, ArrowLeft, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import HtmlGeneratorTab from "@/components/admin/HtmlGeneratorTab";
import UserWebhookSettings from "@/components/user/UserWebhookSettings";
import { TutorialFullPage } from "@/components/TutorialFullPage";
import { SavedProjectsDialog } from "@/components/projects/SavedProjectsDialog";
import { LandingPageAuditor } from "@/components/audit/LandingPageAuditor";
import { CompetitorSpy } from "@/components/tools/CompetitorSpy";
import { CreativeSync } from "@/components/tools/CreativeSync";
import { FiveSecondTest } from "@/components/tools/FiveSecondTest";
import { QuickPromptMode } from "@/components/tools/QuickPromptMode";
import { LpCloner } from "@/components/tools/LpCloner";
import { AffiliateProgram } from "@/components/affiliate/AffiliateProgram";
import { LiveBlueprintDisplay } from "@/components/preview/LiveBlueprintDisplay";
import { translations, Language } from "@/utils/i18n";

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center py-2.5">
      {[1, 2, 3].map((s) => {
        const done = s < current;
        const active = s === current;
        return (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition-all ${active ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30' : done ? 'bg-transparent text-emerald-400 border-emerald-500' : 'bg-transparent text-muted-foreground border-muted-foreground/30'}`}>
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
  const [impersonatedUser, setImpersonatedUser] = useState<{
    id: string;
    email: string;
    name: string;
    tier: 'free' | 'paid';
  } | null>(null);

  // Sidebar Drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activePage = searchParams.get('tab') || 'generator';
  const isPaid = userTier === 'paid';
  const FREE_LIMIT = 5;

  const currentLang: Language = form.language || 'id';
  const t = translations[currentLang] || translations.id;

  const handlePageChange = (tabName: string) => {
    setSearchParams({ tab: tabName });
    setIsSidebarOpen(false);
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

      // Check Impersonation Mode (Mode Intip)
      const impRaw = sessionStorage.getItem('lpb_impersonated_user');
      if (impRaw) {
        try {
          const imp = JSON.parse(impRaw);
          if (imp && imp.isImpersonating) {
            setImpersonatedUser(imp);
            setUserId(imp.id);
            setUserEmail(imp.email);
            setUserTier(imp.tier || 'free');

            try {
              const { data: settings } = await (supabase as any).from('app_settings').select('value').eq('key', 'scalev_order_url').maybeSingle();
              if (settings?.value) setOrderUrl(settings.value);
            } catch {}

            if (imp.tier !== 'paid') {
              const { data: usage } = await supabase.from('prompt_usage').select('used_count').eq('user_id', imp.id).maybeSingle();
              const count = usage?.used_count ?? 0;
              setPromptUsage(count);
              setUsageLimitReached(count >= FREE_LIMIT);
            }
            setLoading(false);
            return;
          }
        } catch {}
      }

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

  const pageTitles: Record<string, string> = {
    generator: '🚀 Landing Page Generator',
    quick_prompt: '⚡ Prompt Cepat (AI Auto-Fill)',
    lp_cloner: '📑 AI LP Clone & Re-Angle (1:1 Replica)',
    api_settings: '⚙️ Konfigurasi API AI (KoboiLLM / OpenAI)',
    competitor_spy: '🕵️‍♂️ AI Competitor Spy Tool',
    creative_sync: '🎬 Creative-to-Landing Page Sync',
    five_second: '⏱️ Tes 5 Detik (Clarity Test)',
    audit: '🔍 AI Landing Page Auditor',
    templates: '📋 Galeri Template',
    lpbuilder: '🚀 Live LP Builder Engine',
    affiliate: '🤝 Program Kemitraan (Affiliate)',
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground text-xs sm:text-sm">Memuat aplikasi...</p></div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Impersonation Banner */}
      {impersonatedUser && (
        <div className="bg-gradient-to-r from-amber-600 via-indigo-600 to-purple-700 text-white px-3 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-lg sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-300 animate-pulse flex-shrink-0" />
            <span>
              <strong>Mode Intip Aktif:</strong> Melihat sebagai{' '}
              <code className="bg-black/30 px-1.5 py-0.5 rounded font-mono text-amber-200">{impersonatedUser.email}</code>{' '}
              ({impersonatedUser.tier === 'paid' ? '⭐ Berbayar' : '🆓 Gratis'})
            </span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="h-7 text-xs font-bold gap-1 bg-white text-slate-900 hover:bg-white/90 shadow-sm"
            onClick={() => {
              sessionStorage.removeItem('lpb_impersonated_user');
              navigate('/admin?tab=users');
            }}
          >
            Keluar Mode Intip →
          </Button>
        </div>
      )}

      {/* Top Header with Hamburger ☰ and Language Switcher beside Dark Mode */}
      <Header
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(!darkMode)}
        language={form.language || 'id'}
        onToggleLang={() => handleChange('language', form.language === 'en' ? 'id' : 'en')}
        onOpenMenu={() => setIsSidebarOpen(true)}
      />

      {/* Slide-out Sidebar Drawer */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activePage}
        onSelectTab={handlePageChange}
        userEmail={userEmail}
        isAdmin={impersonatedUser ? false : (userEmail === 'fauzymnf29@gmail.com')}
        onLogout={async () => {
          await supabase.auth.signOut();
          navigate('/login');
        }}
      />

      {/* Clean Sub-header Bar with Page Title & Quick Action */}
      <div className="border-b border-border/70 bg-card/60 px-3 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-[1536px] mx-auto flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-black text-foreground">
              {pageTitles[activePage] || 'Menu Aplikasi'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {activePage !== 'generator' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange('generator')}
                className="text-xs h-8 gap-1 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Ke Generator
              </Button>
            )}

            <SavedProjectsDialog
              currentForm={form}
              userId={userId}
              onLoadProject={(formData) => {
                setForm(formData);
                setPromptText("");
                setCurrentStep(1);
                handlePageChange('generator');
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Page Container - Optimized for PC, Tablet & Mobile */}
      <main className="flex-1 max-w-[1536px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
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
                    language={form.language || 'id'}
                    onChange={handleChange}
                  />

                  <Step2Product
                    tipeProduk={form.tipeProduk}
                    tujuanUtama={form.tujuanUtama}
                    trafficCategory={form.trafficCategory}
                    language={form.language || 'id'}
                    onChange={handleChange}
                  />

                  <Step3Target
                    levelAwareness={form.levelAwareness}
                    targetAudience={form.targetAudience}
                    language={form.language || 'id'}
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
                    language={form.language || 'id'}
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
                    language={form.language || 'id'}
                    onChange={handleChange}
                    onChangeTypography={(t) => handleChange('typography', t)}
                  />

                  <Step6Elements
                    elemenTambahan={form.elemenTambahan}
                    metaCapi={form.metaCapi}
                    language={form.language || 'id'}
                    onToggle={handleToggleElement}
                    onChangeMetaCapi={(c) => handleChange('metaCapi', c)}
                  />

                  <Step7Platform
                    platformTarget={form.platformTarget}
                    deviceTarget={form.deviceTarget}
                    language={form.language || 'id'}
                    onChange={handleChange}
                  />

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

        {/* TAB: LP CLONER & RE-ANGLE */}
        {activePage === 'lp_cloner' && (
          <LpCloner
            onApplyToGenerator={(clonedForm) => {
              setForm(clonedForm);
              handlePageChange('generator');
            }}
            onOpenLpBuilder={() => handlePageChange('lpbuilder')}
          />
        )}

        {/* TAB 3: KOBOILLM / OPENAI API CONFIGURATION */}
        {activePage === 'api_settings' && <AiApiSettings />}

        {/* TAB 4: COMPETITOR SPY */}
        {activePage === 'competitor_spy' && <CompetitorSpy />}

        {/* TAB 5: CREATIVE SYNC */}
        {activePage === 'creative_sync' && (
          <CreativeSync
            onApplyToForm={(data) => {
              setForm(prev => ({ ...prev, ...data }));
              handlePageChange('generator');
            }}
          />
        )}

        {/* TAB 6: TES 5 DETIK */}
        {activePage === 'five_second' && <FiveSecondTest />}

        {/* TAB 7: AUDIT LP */}
        {activePage === 'audit' && <LandingPageAuditor />}

        {/* TAB 8: TEMPLATES GALLERY */}
        {activePage === 'templates' && (
          <TemplateGallery
            onSelectTemplate={handleSelectTemplate}
            isPaid={isPaid}
            orderUrl={orderUrl}
            userId={userId}
          />
        )}

        {/* TAB 9: AFFILIATE PROGRAM */}
        {activePage === 'affiliate' && (
          <AffiliateProgram
            userId={userId}
            userEmail={userEmail}
            isAdmin={userEmail === 'fauzymnf29@gmail.com'}
          />
        )}

        {/* TAB 10: LP BUILDER */}
        {activePage === 'lpbuilder' && <HtmlGeneratorTab isAdmin={false} />}

        {/* TAB 11: WEBHOOK */}
        {activePage === 'webhook' && isPaid && <UserWebhookSettings userId={userId} />}

        {/* TAB 12: TUTORIAL */}
        {activePage === 'tutorial' && isPaid && <TutorialFullPage />}
      </main>
    </div>
  );
}
