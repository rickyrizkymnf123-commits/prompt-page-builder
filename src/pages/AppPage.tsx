import { useEffect, useState } from "react";
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

export default function AppPage() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [form, setForm] = useState<FormState>(initialFormState);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

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

  const handleChange = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  const handleToggleElement = (element: string) =>
    setForm((prev) => ({
      ...prev,
      elemenTambahan: { ...prev.elemenTambahan, [element]: !prev.elemenTambahan[element] },
    }));
  const promptText = generatePrompt(form);
  const hasPrompt = !!(form.framework && form.tipeProduk && form.namaProduk);

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
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 p-6 max-w-[1440px] mx-auto">
        <div className="space-y-6">
          <Step1Framework framework={form.framework} gayaBahasa={form.gayaBahasa} onChange={handleChange} />
          <Step2Product tipeProduk={form.tipeProduk} tujuanUtama={form.tujuanUtama} onChange={handleChange} />
          <Step3Target targetAudience={form.targetAudience} levelAwareness={form.levelAwareness} onChange={handleChange} />
          <Step4Detail
            namaProduk={form.namaProduk}
            hargaNormal={form.hargaNormal}
            hargaPromo={form.hargaPromo}
            deskripsiBenefit={form.deskripsiBenefit}
            ctaUtama={form.ctaUtama}
            onChange={handleChange}
          />
          <Step5Design gayaDesain={form.gayaDesain} onChange={handleChange} />
          <Step6Elements elemenTambahan={form.elemenTambahan} onToggle={handleToggleElement} />
          <Step7Platform platformTarget={form.platformTarget} onChange={handleChange} />
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <PromptPanel promptText={promptText} hasPrompt={hasPrompt} />
          </div>
        </div>
      </div>
    </div>
  );
}
