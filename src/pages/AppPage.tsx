import { useEffect, useState, useCallback } from "react";
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
import { FormState, initialFormState } from "@/types/form";
import { generatePrompt } from "@/utils/generatePrompt";
import { Button } from "@/components/ui/button";
import { Zap, RotateCcw, Copy, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

// Shared Stepper component
function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center py-4">
      {[1, 2, 3].map((s) => {
        const done = s < current;
        const active = s === current;
        return (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
              active
                ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30'
                : done
                ? 'bg-transparent text-green-400 border-green-500'
                : 'bg-transparent text-muted-foreground border-muted-foreground/30'
            }`}>
              {done ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : s}
            </div>
            {s < 3 && (
              <div className={`w-16 h-0.5 transition-all ${done ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Step 2: Prompt Preview Page
function PromptStep({ promptText, onBack, onNext }: { promptText: string; onBack: () => void; onNext: () => void }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(promptText);
    toast({ title: 'Prompt disalin!', description: 'Prompt sudah ada di clipboard.' });
  };

  const handleBuatLandingPage = async () => {
    await navigator.clipboard.writeText(promptText);
    const encodedPrompt = encodeURIComponent(promptText);
    window.open(`https://chat.z.ai/?q=${encodedPrompt}`, '_blank');
    toast({ title: 'Prompt disalin & dikirim!', description: 'Prompt otomatis dikirim ke chat.z.ai.' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Stepper current={2} />
      <p className="text-center text-sm text-muted-foreground">Copy prompt lalu buka AI favorit kamu untuk generate script HTML</p>

      {/* Prompt Box */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">📋 Prompt Siap Digunakan</h2>
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
            <Copy className="h-4 w-4" /> Copy
          </Button>
        </div>
        <ScrollArea className="h-64">
          <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed p-3 bg-secondary rounded-lg">
            {promptText}
          </pre>
        </ScrollArea>
      </div>

      {/* Main CTA → chat.z.ai */}
      <Button
        onClick={handleBuatLandingPage}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2"
        size="lg"
      >
        <ExternalLink className="h-4 w-4" /> Buat Landing Page
      </Button>

      {/* Secondary CTA → Step 3 Preview */}
      <Button
        variant="outline"
        onClick={onNext}
        className="w-full gap-2"
        size="lg"
      >
        Lanjut ke Preview & Edit HTML →
      </Button>

      <Button variant="outline" onClick={onBack} className="w-full">← Kembali Edit Form</Button>
    </div>
  );
}

// Step 3: HTML Preview & Editor Page
function PreviewStep({ onBack }: { onBack: () => void }) {
  const [htmlCode, setHtmlCode] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [editMode, setEditMode] = useState(false);
  const [editTarget, setEditTarget] = useState<{ type: 'text' | 'img' | 'link'; tag: string; value: string; href: string; index: number } | null>(null);
  const [editedElements, setEditedElements] = useState<Record<number, string>>({});
  const [fbPixelId, setFbPixelId] = useState('');
  const [pixelApplied, setPixelApplied] = useState(false);

  const viewportWidths = { desktop: '100%', tablet: '768px', mobile: '390px' };

  const injectPixel = (html: string, pixelId: string) => {
    if (!pixelId.trim()) return html;
    const pixelScript = `<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"/></noscript>
<!-- End Facebook Pixel Code -->`;
    // Inject pixel script into <head>
    let result = html.includes('</head>') ? html.replace('</head>', pixelScript + '\n</head>') : pixelScript + html;
    // Inject FB pixel events on all CTA buttons/links
    const btnEventScript = `<script>
document.addEventListener('DOMContentLoaded', function() {
  var ctaSelectors = 'a[href], button';
  document.querySelectorAll(ctaSelectors).forEach(function(el) {
    el.addEventListener('click', function() {
      if (typeof fbq === 'undefined') return;
      fbq('track', 'AddToCart');
      fbq('track', 'InitiateCheckout');
      fbq('track', 'AddPaymentInfo');
      fbq('track', 'Purchase', {value: 0, currency: 'IDR'});
    });
  });
});
</script>`;
    result = result.includes('</body>') ? result.replace('</body>', btnEventScript + '\n</body>') : result + btnEventScript;
    return result;
  };

  const handleLoadPreview = () => {
    let html = htmlCode;
    if (fbPixelId.trim()) html = injectPixel(html, fbPixelId);
    setPreviewHtml(html);
    setHtmlCode(html);
    setEditedElements({});
    setEditMode(false);
    setPixelApplied(!!fbPixelId.trim());
  };

  const handleClear = () => {
    setHtmlCode('');
    setPreviewHtml('');
    setEditedElements({});
  };

  const handleExport = () => {
    const blob = new Blob([previewHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'landing-page.html';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'HTML diekspor!', description: 'File landing-page.html berhasil diunduh.' });
  };

  // Inject edit mode click handlers into iframe
  const getEditableHtml = () => {
    if (!editMode || !previewHtml) return previewHtml;
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, 'text/html');
    const editableTags = ['h1','h2','h3','h4','h5','h6','p','a','span','li','button','img'];
    let idx = 0;
    editableTags.forEach(tag => {
      doc.querySelectorAll(tag).forEach((el) => {
        el.setAttribute('data-edit-idx', String(idx));
        el.setAttribute('data-edit-tag', tag.toUpperCase());
        if (tag === 'a') el.setAttribute('data-edit-href', (el as HTMLAnchorElement).getAttribute('href') || '');
        const style = el.getAttribute('style') || '';
        el.setAttribute('style', style + ';cursor:pointer;outline:2px dashed rgba(59,130,246,0.5);outline-offset:2px;');
        idx++;
      });
    });
    const script = doc.createElement('script');
    script.textContent = `
      document.addEventListener('click', function(e) {
        const el = e.target.closest('[data-edit-idx]');
        if (!el) return;
        e.preventDefault();
        e.stopPropagation();
        const idx = el.getAttribute('data-edit-idx');
        const tag = el.getAttribute('data-edit-tag');
        const isImg = tag === 'IMG';
        const isA = tag === 'A';
        const value = isImg ? (el.getAttribute('src') || '') : (el.innerText || el.textContent || '');
        const href = isA ? (el.getAttribute('data-edit-href') || el.getAttribute('href') || '') : '';
        window.parent.postMessage({ type: 'EDIT_ELEMENT', idx: Number(idx), tag, value, href, isImg, isA }, '*');
      });
    `;
    doc.body.appendChild(script);
    return doc.documentElement.outerHTML;
  };

  // Listen for messages from iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'EDIT_ELEMENT') {
        setEditTarget({
          type: e.data.isImg ? 'img' : e.data.isA ? 'link' : 'text',
          tag: e.data.tag,
          value: e.data.value,
          href: e.data.href || '',
          index: e.data.idx,
        });
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const handleSaveEdit = (newValue: string, newHref?: string) => {
    if (!editTarget) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, 'text/html');
    // Find element by index across all editable tags
    const editableTags = ['h1','h2','h3','h4','h5','h6','p','a','span','li','button','img'];
    let idx = 0;
    let targetEl: Element | null = null;
    editableTags.forEach(tag => {
      doc.querySelectorAll(tag).forEach(el => {
        if (idx === editTarget.index) targetEl = el;
        idx++;
      });
    });
    if (targetEl) {
      const el = targetEl as Element;
      if (editTarget.type === 'img') {
        el.setAttribute('src', newValue);
      } else if (editTarget.type === 'link') {
        el.textContent = newValue;
        if (newHref !== undefined) el.setAttribute('href', newHref);
      } else {
        el.textContent = newValue;
      }
      const updatedHtml = doc.documentElement.outerHTML;
      setPreviewHtml(updatedHtml);
      setHtmlCode(updatedHtml);
      // Force iframe re-render with updated content
      setEditMode(false);
      setTimeout(() => setEditMode(true), 50);
    }
    setEditTarget(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Stepper current={3} />
      <p className="text-center text-sm text-muted-foreground">Paste script HTML dari AI, preview, edit teks/link/gambar, dan export</p>

      {/* Facebook Pixel */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h2 className="text-base font-semibold text-foreground">🎯 Facebook Pixel (Opsional)</h2>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={fbPixelId}
            onChange={(e) => setFbPixelId(e.target.value)}
            placeholder="Masukkan Pixel ID kamu... contoh: 1234567890"
            className="flex-1 rounded-lg bg-secondary text-foreground text-sm p-3 border border-border focus:outline-none focus:border-primary"
          />
          {pixelApplied && <span className="text-xs text-green-500 font-medium whitespace-nowrap">✅ Pixel terpasang</span>}
        </div>
        <p className="text-xs text-muted-foreground">Pixel akan otomatis disuntikkan ke HTML saat kamu klik "Load Preview".</p>
      </div>

      {/* Paste HTML */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h2 className="text-base font-semibold text-foreground">📄 Paste HTML Script</h2>
        <textarea
          value={htmlCode}
          onChange={(e) => setHtmlCode(e.target.value)}
          placeholder="Paste kode HTML hasil dari AI di sini..."
          className="w-full h-48 rounded-lg bg-secondary text-foreground text-sm font-mono p-3 border border-border resize-y focus:outline-none focus:border-primary"
        />
        <div className="flex gap-3">
          <Button onClick={handleLoadPreview} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
            ▶ Load Preview
          </Button>
          <Button variant="outline" onClick={handleClear} className="gap-2">
            🗑 Clear
          </Button>
          {previewHtml && (
            <Button variant="outline" onClick={handleExport} className="gap-2 ml-auto">
              ⬇ Export HTML
            </Button>
          )}
        </div>
      </div>

      {/* Live Preview */}
      {previewHtml && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <span>👁</span> Live Preview
            </h2>
            <div className="flex items-center gap-2">
              {(['desktop','tablet','mobile'] as const).map((vp) => (
                <button
                  key={vp}
                  type="button"
                  onClick={() => setViewport(vp)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    viewport === vp
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary text-muted-foreground border-border'
                  }`}
                >
                  {vp === 'desktop' ? '🖥' : vp === 'tablet' ? '📟' : '📱'} {vp.charAt(0).toUpperCase() + vp.slice(1)}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setEditMode(!editMode)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all ml-2 ${
                  editMode
                    ? 'bg-destructive text-destructive-foreground border-destructive'
                    : 'bg-secondary text-muted-foreground border-border'
                }`}
              >
                {editMode ? '🔓 Lock Mode' : '✏️ Edit Mode'}
              </button>
            </div>
          </div>

          <div className="flex justify-center overflow-hidden">
            <div style={{ width: viewportWidths[viewport], transition: 'width 0.3s ease' }} className="relative rounded-lg border border-border overflow-hidden">
              <iframe
                srcDoc={previewHtml ? (editMode ? getEditableHtml() : previewHtml) : undefined}
                className="w-full"
                style={{ height: '600px', border: 'none' }}
                title="Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>

          {editMode && (
            <div className="rounded-lg bg-accent/10 border border-accent/30 p-3 text-center">
              <p className="text-sm text-accent font-medium">✏️ Edit Mode ON — klik teks, link, atau gambar untuk mengedit</p>
            </div>
          )}
        </div>
      )}

      {editMode && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center space-y-2">
          <p className="text-sm font-medium text-foreground">🖼 Mau ganti gambar?</p>
          <p className="text-xs text-muted-foreground">Upload gambar ke <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="text-primary underline">imgur.com/upload</a>, ambil link-nya, lalu paste di dialog edit gambar.</p>
        </div>
      )}

      <Button variant="outline" onClick={onBack} className="gap-2">← Kembali ke Prompt</Button>

      {editTarget && (
        <EditModal
          editTarget={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}

function EditModal({
  editTarget,
  onClose,
  onSave,
}: {
  editTarget: { type: 'text' | 'img' | 'link'; tag: string; value: string; href: string; index: number };
  onClose: () => void;
  onSave: (value: string, href?: string) => void;
}) {
  const [textValue, setTextValue] = useState(editTarget.value);
  const [hrefValue, setHrefValue] = useState(editTarget.href);
  const [imgValue, setImgValue] = useState(editTarget.value);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md space-y-4 shadow-2xl">
        <h3 className="text-lg font-bold text-primary flex items-center gap-2">✏️ Edit Element</h3>
        <div className="text-sm text-muted-foreground">
          TAG: <span className="text-primary font-bold">{editTarget.tag}</span>
        </div>

        {editTarget.type === 'img' ? (
          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wide text-foreground">URL Gambar</label>
            <input
              type="text"
              value={imgValue}
              onChange={(e) => setImgValue(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg bg-secondary text-foreground text-sm p-3 border border-border focus:outline-none focus:border-primary"
            />
            <p className="text-xs text-muted-foreground">
              Upload di <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="text-primary underline">imgur.com/upload</a> lalu paste link-nya.
            </p>
          </div>
        ) : editTarget.type === 'link' ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground">Teks</label>
              <textarea
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                rows={3}
                className="w-full rounded-lg bg-secondary text-foreground text-sm p-3 border border-border focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground">URL Tombol / Link</label>
              <input
                type="text"
                value={hrefValue}
                onChange={(e) => setHrefValue(e.target.value)}
                placeholder="#"
                className="w-full rounded-lg bg-secondary text-foreground text-sm p-3 border border-border focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-muted-foreground">Contoh: https://wa.me/6281234567890 untuk WhatsApp</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-foreground">Teks</label>
            <textarea
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              rows={4}
              className="w-full rounded-lg bg-secondary text-foreground text-sm p-3 border border-border focus:outline-none focus:border-primary resize-none"
            />
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-secondary text-foreground text-sm font-semibold hover:bg-muted transition-all"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              if (editTarget.type === 'img') onSave(imgValue);
              else if (editTarget.type === 'link') onSave(textValue, hrefValue);
              else onSave(textValue);
            }}
            className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            💾 Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// Main App Page
export default function AppPage() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [form, setForm] = useState<FormState>({ ...initialFormState });
  const [promptText, setPromptText] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // 1=form, 2=prompt, 3=preview
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
    if (currentStep > 1) setIsDirty(true);
  }, [currentStep]);

  const handleToggleElement = useCallback((element: string) => {
    setForm((prev) => ({
      ...prev,
      elemenTambahan: { ...prev.elemenTambahan, [element]: !prev.elemenTambahan[element] },
    }));
    if (currentStep > 1) setIsDirty(true);
  }, [currentStep]);

  const handleGenerate = () => {
    const prompt = generatePrompt(form);
    setPromptText(prompt);
    setIsDirty(false);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setForm({ ...initialFormState });
    setPromptText("");
    setCurrentStep(1);
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

      {currentStep === 2 && (
        <PromptStep
          promptText={promptText}
          onBack={() => setCurrentStep(1)}
          onNext={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 3 && (
        <PreviewStep onBack={() => setCurrentStep(2)} />
      )}

      {currentStep === 1 && (
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
              <Step8Reference
                linkReferensi={form.linkReferensi}
                inspirasiDesain={form.inspirasiDesain}
                onChange={handleChange}
              />
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={handleReset} className="gap-2">
                  <RotateCcw className="h-4 w-4" /> Reset
                </Button>
                <Button onClick={handleGenerate} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2" size="lg">
                  <Zap className="h-4 w-4" /> {isDirty ? "Generate Ulang" : "Generate Prompt ⚡"}
                </Button>
              </div>
            </div>
            {/* Right panel - prompt preview */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <div className="rounded-xl border border-border bg-card p-5 flex flex-col">
                <h2 className="text-lg font-semibold text-foreground mb-3">🤖 AI Prompt Output</h2>
                <div className="rounded-lg bg-secondary p-4 min-h-[200px]">
                  <p className="text-muted-foreground text-sm italic">
                    Prompt akan muncul setelah kamu klik "Generate Prompt ⚡"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
