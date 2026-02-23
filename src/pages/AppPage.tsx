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
import { StepSalesNotif } from "@/components/steps/StepSalesNotif";
import { StepCountdown } from "@/components/steps/StepCountdown";
import { FormState, initialFormState, SalesNotifConfig, CountdownConfig } from "@/types/form";
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
    try {
      await navigator.clipboard.writeText(promptText);
    } catch {}
    window.open('https://chat.z.ai/', '_blank', 'noopener,noreferrer');
    toast({ title: '✅ Prompt sudah disalin!', description: 'Halaman chat.z.ai sudah terbuka. Paste prompt (Ctrl+V / Cmd+V) lalu tekan Enter.' });
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
  const [editTarget, setEditTarget] = useState<{ type: 'text' | 'img' | 'link' | 'video'; tag: string; value: string; href: string; index: number; pixelEvent: string; imgWidth?: number; imgHeight?: number } | null>(null);
  const [editedElements, setEditedElements] = useState<Record<number, string>>({});
  const [fbPixelId, setFbPixelId] = useState('');
  const [pixelApplied, setPixelApplied] = useState(false);

  const viewportWidths = { desktop: '100%', tablet: '768px', mobile: '390px' };

  const injectPixel = (html: string, pixelId: string) => {
    if (!pixelId.trim()) return html;
    // Jika pixel sudah ada di HTML (dari inject sebelumnya), skip — hindari double PageView
    if (html.includes('fbq(\'init\'') || html.includes('fbq("init"') || html.includes('connect.facebook.net/en_US/fbevents.js')) {
      return html;
    }
    const pixelScript = `<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"/></noscript>
<!-- End Facebook Pixel Code -->`;
    // Inject sekali saja ke dalam <head>, gunakan replace dengan limit pertama saja
    const result = html.includes('</head>')
      ? html.replace('</head>', pixelScript + '\n</head>')
      : pixelScript + html;
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
    const editableTags = ['h1','h2','h3','h4','h5','h6','p','a','span','li','button','img','iframe'];
    let idx = 0;
    editableTags.forEach(tag => {
      doc.querySelectorAll(tag).forEach((el) => {
        el.setAttribute('data-edit-idx', String(idx));
        el.setAttribute('data-edit-tag', tag.toUpperCase());
        if (tag === 'a') el.setAttribute('data-edit-href', (el as HTMLAnchorElement).getAttribute('href') || '');
        if (tag === 'iframe') {
          // wrap iframe in a clickable overlay div
          const wrapper = doc.createElement('div');
          wrapper.setAttribute('data-edit-idx', String(idx));
          wrapper.setAttribute('data-edit-tag', 'IFRAME');
          wrapper.setAttribute('data-edit-src', (el as HTMLIFrameElement).getAttribute('src') || '');
          wrapper.setAttribute('style', 'position:relative;cursor:pointer;');
          el.parentNode?.insertBefore(wrapper, el);
          wrapper.appendChild(el);
          const overlay = doc.createElement('div');
          overlay.setAttribute('style', 'position:absolute;inset:0;background:rgba(59,130,246,0.15);border:2px dashed rgba(59,130,246,0.8);cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:10;');
          overlay.innerHTML = '<span style="background:rgba(59,130,246,0.9);color:white;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:bold;">🎬 Klik untuk edit video</span>';
          wrapper.appendChild(overlay);
          idx++;
          return;
        }
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
        const isIframe = tag === 'IFRAME';
        const value = isImg ? (el.getAttribute('src') || '') : isIframe ? (el.getAttribute('data-edit-src') || el.querySelector('iframe')?.getAttribute('src') || '') : (el.innerText || el.textContent || '');
        const href = isA ? (el.getAttribute('data-edit-href') || el.getAttribute('href') || '') : '';
        const pixelEvent = el.getAttribute('data-pixel-event') || '';
        const imgWidth = isImg ? (el.naturalWidth || el.getAttribute('width') || 0) : 0;
        const imgHeight = isImg ? (el.naturalHeight || el.getAttribute('height') || 0) : 0;
        window.parent.postMessage({ type: 'EDIT_ELEMENT', idx: Number(idx), tag, value, href, isImg, isA, isIframe, pixelEvent, imgWidth, imgHeight }, '*');
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
          type: e.data.isImg ? 'img' : e.data.isA ? 'link' : e.data.isIframe ? 'video' : 'text',
          tag: e.data.tag,
          value: e.data.value,
          href: e.data.href || '',
          index: e.data.idx,
          pixelEvent: e.data.pixelEvent || '',
          imgWidth: e.data.imgWidth || 0,
          imgHeight: e.data.imgHeight || 0,
        });
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const handleSaveEdit = (newValue: string, newHref?: string, pixelEvent?: string) => {
    if (!editTarget) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, 'text/html');
    const editableTags = ['h1','h2','h3','h4','h5','h6','p','a','span','li','button','img','iframe'];
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
      if (editTarget.type === 'video') {
        el.setAttribute('src', newValue);
      } else if (editTarget.type === 'img') {
        el.setAttribute('src', newValue);
      } else if (editTarget.type === 'link') {
        el.textContent = newValue;
        if (newHref !== undefined) el.setAttribute('href', newHref);
        if (pixelEvent) {
          const evScript = pixelEvent === 'Purchase'
            ? `if(typeof fbq!=='undefined'){fbq('track','${pixelEvent}',{value:0,currency:'IDR'});}`
            : `if(typeof fbq!=='undefined'){fbq('track','${pixelEvent}');}`;
          el.setAttribute('onclick', evScript);
          el.setAttribute('data-pixel-event', pixelEvent);
        } else {
          el.removeAttribute('onclick');
          el.removeAttribute('data-pixel-event');
        }
      } else {
        el.textContent = newValue;
      }
      const updatedHtml = doc.documentElement.outerHTML;
      setPreviewHtml(updatedHtml);
      setHtmlCode(updatedHtml);
      setEditMode(false);
      setTimeout(() => setEditMode(true), 50);
    }
    setEditTarget(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
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
          <p className="text-xs text-muted-foreground">Upload gambar ke <a href="https://uploadimgur.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">uploadimgur.com</a>, ambil link-nya, lalu paste di dialog edit gambar.</p>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-border py-4 flex gap-3 items-center">
        <Button variant="outline" onClick={onBack} className="gap-2 px-5">
          ← Kembali
        </Button>
        <Button
          variant="outline"
          onClick={async () => {
            await navigator.clipboard.writeText(previewHtml || htmlCode);
            toast({ title: '✅ Disalin!', description: 'Kode HTML sudah tersalin ke clipboard.' });
          }}
          disabled={!previewHtml && !htmlCode}
          className="gap-2 px-5"
        >
          📋 Copy HTML
        </Button>
        <Button
          onClick={() => {
            const content = previewHtml || htmlCode;
            if (!content) return;
            const blob = new Blob([content], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'landing-page.html';
            a.click();
            URL.revokeObjectURL(url);
            toast({ title: '⬇ Download berhasil!', description: 'File landing-page.html siap digunakan.' });
          }}
          disabled={!previewHtml && !htmlCode}
          className="gap-2 px-6 bg-green-600 hover:bg-green-700 text-white font-bold ml-auto"
        >
          ⬇ Download HTML
        </Button>
      </div>

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

const FB_PIXEL_EVENTS = [
  { value: '', label: '❌ Tidak ada event khusus' },
  { value: 'AddToCart', label: '🛒 AddToCart — Klik tombol beli/keranjang' },
  { value: 'InitiateCheckout', label: '💳 InitiateCheckout — Mulai proses checkout' },
  { value: 'AddPaymentInfo', label: '💳 AddPaymentInfo — Isi info pembayaran' },
  { value: 'Purchase', label: '✅ Purchase — Transaksi berhasil' },
  { value: 'Lead', label: '📋 Lead — Submit form/lead' },
  { value: 'ViewContent', label: '👁 ViewContent — Lihat konten/produk' },
  { value: 'CompleteRegistration', label: '📝 CompleteRegistration — Daftar berhasil' },
];

type EditTargetType = { type: 'text' | 'img' | 'link' | 'video'; tag: string; value: string; href: string; index: number; pixelEvent: string; imgWidth?: number; imgHeight?: number };

function EditModal({
  editTarget,
  onClose,
  onSave,
}: {
  editTarget: EditTargetType;
  onClose: () => void;
  onSave: (value: string, href?: string, pixelEvent?: string) => void;
}) {
  const [textValue, setTextValue] = useState(editTarget.value);
  const [hrefValue, setHrefValue] = useState(editTarget.href);
  const [imgValue, setImgValue] = useState(editTarget.value);
  const [videoValue, setVideoValue] = useState(editTarget.value);
  const [pixelEvent, setPixelEvent] = useState(editTarget.pixelEvent || '');

  useEffect(() => {
    setTextValue(editTarget.value);
    setHrefValue(editTarget.href);
    setImgValue(editTarget.value);
    setVideoValue(editTarget.value);
    setPixelEvent(editTarget.pixelEvent || '');
  }, [editTarget.index, editTarget.value, editTarget.href, editTarget.pixelEvent]);

  // Extract YouTube video ID from various URL formats to show embed URL
  const toYoutubeEmbed = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    return url; // return as-is if already embed or not YT
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-primary flex items-center gap-2">✏️ Edit Element</h3>
        <div className="text-sm text-muted-foreground">
          TAG: <span className="text-primary font-bold">{editTarget.tag}</span>
        </div>

        {editTarget.type === 'video' ? (
          <div className="space-y-3">
            <label className="text-sm font-semibold uppercase tracking-wide text-foreground">🎬 URL Video YouTube</label>
            <input
              type="text"
              value={videoValue}
              onChange={(e) => setVideoValue(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... atau embed URL"
              className="w-full rounded-lg bg-secondary text-foreground text-sm p-3 border border-border focus:outline-none focus:border-primary"
            />
            <div className="rounded-lg bg-secondary/60 border border-border p-3 space-y-1">
              <p className="text-xs text-muted-foreground font-semibold">Format yang diterima:</p>
              <p className="text-xs text-muted-foreground">• https://www.youtube.com/watch?v=VIDEO_ID</p>
              <p className="text-xs text-muted-foreground">• https://youtu.be/VIDEO_ID</p>
              <p className="text-xs text-muted-foreground">• https://www.youtube.com/embed/VIDEO_ID</p>
            </div>
            {videoValue && (
              <div className="rounded-lg overflow-hidden border border-border aspect-video">
                <iframe
                  src={toYoutubeEmbed(videoValue)}
                  className="w-full h-full"
                  allowFullScreen
                  title="Video preview"
                />
              </div>
            )}
          </div>
        ) : editTarget.type === 'img' ? (
          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wide text-foreground">URL Gambar</label>
            {(editTarget.imgWidth || editTarget.imgHeight) ? (
              <div className="flex items-center gap-2">
                <span className="text-xs bg-secondary border border-border rounded px-2 py-1 text-muted-foreground font-mono">
                  {editTarget.imgWidth} × {editTarget.imgHeight} px
                </span>
                <span className="text-xs text-muted-foreground">— ukuran gambar saat ini</span>
              </div>
            ) : null}
            <input
              type="text"
              value={imgValue}
              onChange={(e) => setImgValue(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg bg-secondary text-foreground text-sm p-3 border border-border focus:outline-none focus:border-primary"
            />
            {imgValue && (
              <div className="rounded-lg overflow-hidden border border-border bg-secondary/40 flex items-center justify-center" style={{ minHeight: 80 }}>
                <img src={imgValue} alt="preview" className="max-h-32 object-contain rounded" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Upload di <a href="https://uploadimgur.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">uploadimgur.com</a> lalu paste link-nya.
            </p>
          </div>
        ) : editTarget.type === 'link' ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground">Teks Tombol</label>
              <textarea
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                rows={2}
                className="w-full rounded-lg bg-secondary text-foreground text-sm p-3 border border-border focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground">URL Tombol / Link</label>
              <input
                type="text"
                value={hrefValue}
                onChange={(e) => setHrefValue(e.target.value)}
                placeholder="https://wa.me/62..."
                className="w-full rounded-lg bg-secondary text-foreground text-sm p-3 border border-border focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-muted-foreground">Contoh: https://wa.me/6281234567890 untuk WhatsApp</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground">🎯 Facebook Pixel Event (pilih satu)</label>
              <p className="text-xs text-muted-foreground">
                Default: <span className="text-green-500 font-semibold">PageView</span> otomatis saat halaman dibuka. Pilih event tambahan saat tombol ini diklik:
              </p>
              <div className="grid grid-cols-1 gap-1.5 max-h-52 overflow-y-auto pr-1">
                {FB_PIXEL_EVENTS.map((ev) => (
                  <button
                    key={ev.value}
                    type="button"
                    onClick={() => setPixelEvent(ev.value)}
                    className={`text-left px-3 py-2.5 rounded-lg text-sm border transition-all flex items-center gap-2 ${
                      pixelEvent === ev.value
                        ? 'bg-primary/15 border-primary text-primary font-semibold ring-1 ring-primary'
                        : 'bg-secondary border-border text-foreground hover:border-primary/40'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-all ${pixelEvent === ev.value ? 'bg-primary border-primary' : 'border-muted-foreground/40'}`} />
                    {ev.label}
                  </button>
                ))}
              </div>
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
              if (editTarget.type === 'video') onSave(toYoutubeEmbed(videoValue));
              else if (editTarget.type === 'img') onSave(imgValue);
              else if (editTarget.type === 'link') onSave(textValue, hrefValue, pixelEvent || undefined);
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

  const handleSalesNotifChange = useCallback((config: SalesNotifConfig) => {
    setForm((prev) => ({ ...prev, salesNotif: config }));
    if (currentStep > 1) setIsDirty(true);
  }, [currentStep]);

  const handleCountdownChange = useCallback((config: CountdownConfig) => {
    setForm((prev) => ({ ...prev, countdown: config }));
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
              <Step7Platform platformTarget={form.platformTarget} deviceTarget={form.deviceTarget} onChange={handleChange} />
              <Step8Reference
                linkReferensi={form.linkReferensi}
                inspirasiDesain={form.inspirasiDesain}
                onChange={handleChange}
              />
              <StepSalesNotif salesNotif={form.salesNotif} onChange={handleSalesNotifChange} />
              <StepCountdown countdown={form.countdown} onChange={handleCountdownChange} />
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
