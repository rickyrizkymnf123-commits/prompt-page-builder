import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { PromptPanel } from "@/components/PromptPanel";
import { Step1Framework } from "@/components/steps/Step1Framework";
import { Step2Product } from "@/components/steps/Step2Product";
import { Step3Target } from "@/components/steps/Step3Target";
import { Step4Detail } from "@/components/steps/Step4Detail";
import { Step5Design } from "@/components/steps/Step5Design";
import { Step6Elements } from "@/components/steps/Step6Elements";
import { Step7Platform } from "@/components/steps/Step7Platform";
import { FormState, initialFormState } from "@/types/form";
import { generatePrompt } from "@/utils/generatePrompt";
import { Button } from "@/components/ui/button";
import { Zap, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function AppPage() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [form, setForm] = useState<FormState>({ ...initialFormState });
  const [promptText, setPromptText] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }

      const { data: entitlements } = await supabase
        .from("entitlements")
        .select("id")
        .eq("product_code", "LPE")
        .eq("status", "active");

      if (!entitlements || entitlements.length === 0) {
        await supabase.auth.signOut();
        navigate("/login");
        return;
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

  const handleChange = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (hasGenerated) setIsDirty(true);
  }, [hasGenerated]);

  const handleToggleElement = useCallback((element: string) => {
    setForm((prev) => ({
      ...prev,
      elemenTambahan: { ...prev.elemenTambahan, [element]: !prev.elemenTambahan[element] },
    }));
    if (hasGenerated) setIsDirty(true);
  }, [hasGenerated]);

  const handleGenerate = () => {
    const prompt = generatePrompt(form);
    setPromptText(prompt);
    setHasGenerated(true);
    setIsDirty(false);
  };

  const handleReset = () => {
    setForm({ ...initialFormState });
    setPromptText("");
    setHasGenerated(false);
    setIsDirty(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header darkMode={darkMode} onToggleDark={() => setDarkMode(!darkMode)} />

      <div className="max-w-[1440px] mx-auto p-6">
        {/* Hero */}
        <section className="text-center py-12 px-6 mb-6 rounded-lg border border-border bg-card">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            NEW V3.0 RELEASE
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight max-w-3xl mx-auto"
          >
            Buat Landing Page professional cuman dalam{" "}
            <span className="text-primary">Hitungan menit</span> <Zap className="inline h-8 w-8 text-primary" />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto"
          >
            Generate Landing Page dari format yang benar, karena landing page yang gagal biasanya bukan salah katanya, tapi salah strukturnya.
          </motion.p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          <div className="space-y-4 pb-6">
            <Step1Framework framework={form.framework} gayaBahasa={form.gayaBahasa} onChange={handleChange} />
            <Step2Product tipeProduk={form.tipeProduk} tujuanUtama={form.tujuanUtama} onChange={handleChange} />
            <Step3Target levelAwareness={form.levelAwareness} targetAudience={form.targetAudience} onChange={handleChange} />
            <Step4Detail
              namaProduk={form.namaProduk} hargaNormal={form.hargaNormal} hargaPromo={form.hargaPromo}
              deskripsiBenefit={form.deskripsiBenefit} ctaUtama={form.ctaUtama} onChange={handleChange}
            />
            <Step5Design gayaDesain={form.gayaDesain} onChange={handleChange} />
            <Step6Elements elemenTambahan={form.elemenTambahan} onToggle={handleToggleElement} />
            <Step7Platform platformTarget={form.platformTarget} onChange={handleChange} />
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
              <Button onClick={handleGenerate} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2" size="lg">
                <Zap className="h-4 w-4" /> {isDirty ? "Generate Ulang" : "Generate Prompt"}
              </Button>
            </div>
          </div>
          <div className="lg:sticky lg:top-6 lg:self-start">
            <PromptPanel promptText={promptText} hasPrompt={hasGenerated} />
          </div>
        </div>
      </div>
    </div>
  );
}
