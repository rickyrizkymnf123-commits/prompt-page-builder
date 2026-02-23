import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LogOut, Shield, CheckCircle, XCircle, Trash2, Clock, Users, FileText,
  RefreshCw, KeyRound, Search, UserCheck, UserX, Moon, Sun, Rocket, Zap, RotateCcw, Copy, ExternalLink, UserPlus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Step1Framework } from "@/components/steps/Step1Framework";
import { Step2Product } from "@/components/steps/Step2Product";
import { Step3Target } from "@/components/steps/Step3Target";
import { Step4Detail } from "@/components/steps/Step4Detail";
import { Step5Design } from "@/components/steps/Step5Design";
import { Step6Elements } from "@/components/steps/Step6Elements";
import { Step7Platform } from "@/components/steps/Step7Platform";
import { Step8Reference } from "@/components/steps/Step8Reference";
import { FormState, initialFormState } from "@/types/form";
import { StepSalesNotif } from "@/components/steps/StepSalesNotif";
import { StepCountdown } from "@/components/steps/StepCountdown";
import { generatePrompt } from "@/utils/generatePrompt";

// --- Types ---
interface AdminUser {
  id: string; email: string; name: string | null; phone: string | null;
  status: string; entitlement_id: string | null; product_code: string | null;
  order_id: string | null; role: string; created_at: string; last_sign_in: string | null;
}
interface ProvisionLog {
  id: string; order_id: string | null; email: string | null;
  status: string; message: string | null; created_at: string;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    active:   { label: "Aktif",   className: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30", icon: <CheckCircle className="h-3 w-3" /> },
    pending:  { label: "Pending", className: "text-amber-500 bg-amber-500/10 border-amber-500/30",     icon: <Clock className="h-3 w-3" /> },
    rejected: { label: "Ditolak", className: "text-destructive bg-destructive/10 border-destructive/30", icon: <XCircle className="h-3 w-3" /> },
    success:  { label: "Success", className: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30", icon: <CheckCircle className="h-3 w-3" /> },
    error:    { label: "Error",   className: "text-destructive bg-destructive/10 border-destructive/30", icon: <XCircle className="h-3 w-3" /> },
  };
  const s = map[status] || { label: status, className: "text-muted-foreground bg-muted border-border", icon: null };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${s.className}`}>
      {s.icon}{s.label}
    </span>
  );
}

// Step 3 Preview for Admin
function AdminPreviewStep({ onBack }: { onBack: () => void }) {
  const [htmlCode, setHtmlCode] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [viewport, setViewport] = useState<'desktop'|'tablet'|'mobile'>('desktop');
  const [editMode, setEditMode] = useState(false);
  const [editTarget, setEditTarget] = useState<{type:'text'|'img'|'link'|'video'; tag:string; value:string; href:string; index:number; pixelEvent:string; imgWidth?:number; imgHeight?:number}|null>(null);
  const [fbPixelId, setFbPixelId] = useState('');
  const [pixelApplied, setPixelApplied] = useState(false);
  const viewportWidths = { desktop:'100%', tablet:'768px', mobile:'390px' };

  const injectPixel = (html: string, pixelId: string) => {
    if (!pixelId.trim()) return html;
    // Jika pixel sudah ada di HTML (dari inject sebelumnya atau dari AI), skip — hindari double PageView
    if (
      html.includes("fbq('init'") ||
      html.includes('fbq("init"') ||
      html.includes('connect.facebook.net/en_US/fbevents.js')
    ) {
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
    const result = html.includes('</head>')
      ? html.replace('</head>', pixelScript + '\n</head>')
      : pixelScript + html;
    return result;
  };


  const toYoutubeEmbed = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    return url;
  };

  const getEditableHtml = () => {
    if (!previewHtml) return '';
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, 'text/html');
    let idx = 0;
    ['h1','h2','h3','h4','h5','h6','p','a','span','li','button','img','iframe'].forEach(tag => {
      doc.querySelectorAll(tag).forEach(el => {
        el.setAttribute('data-edit-idx', String(idx));
        el.setAttribute('data-edit-tag', tag.toUpperCase());
        if (tag === 'a') el.setAttribute('data-edit-href', (el as HTMLAnchorElement).getAttribute('href') || '');
        if (tag === 'iframe') {
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
    script.textContent = `document.addEventListener('click',function(e){const el=e.target.closest('[data-edit-idx]');if(!el)return;e.preventDefault();e.stopPropagation();const idx=el.getAttribute('data-edit-idx');const tag=el.getAttribute('data-edit-tag');const isImg=tag==='IMG';const isA=tag==='A';const isIframe=tag==='IFRAME';const value=isImg?(el.getAttribute('src')||''):isIframe?(el.getAttribute('data-edit-src')||el.querySelector('iframe')?.getAttribute('src')||''):(el.innerText||el.textContent||'');const href=isA?(el.getAttribute('data-edit-href')||el.getAttribute('href')||''):'';const pixelEvent=el.getAttribute('data-pixel-event')||'';const imgWidth=isImg?(el.naturalWidth||el.getAttribute('width')||0):0;const imgHeight=isImg?(el.naturalHeight||el.getAttribute('height')||0):0;window.parent.postMessage({type:'EDIT_ELEMENT',idx:Number(idx),tag,value,href,isImg,isA,isIframe,pixelEvent,imgWidth,imgHeight},'*');});`;
    doc.body.appendChild(script);
    return doc.documentElement.outerHTML;
  };

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'EDIT_ELEMENT') setEditTarget({ type: e.data.isImg ? 'img' : e.data.isA ? 'link' : e.data.isIframe ? 'video' : 'text', tag: e.data.tag, value: e.data.value, href: e.data.href || '', index: e.data.idx, pixelEvent: e.data.pixelEvent || '', imgWidth: e.data.imgWidth || 0, imgHeight: e.data.imgHeight || 0 });
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
        el.setAttribute('src', toYoutubeEmbed(newValue));
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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Facebook Pixel */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h2 className="text-base font-semibold text-foreground">🎯 Facebook Pixel (Opsional)</h2>
        <div className="flex gap-3 items-center">
          <input type="text" value={fbPixelId} onChange={(e) => setFbPixelId(e.target.value)} placeholder="Masukkan Pixel ID kamu... contoh: 1234567890" className="flex-1 rounded-lg bg-secondary text-foreground text-sm p-3 border border-border focus:outline-none focus:border-primary" />
          {pixelApplied && <span className="text-xs text-green-500 font-medium whitespace-nowrap">✅ Pixel terpasang</span>}
        </div>
        <p className="text-xs text-muted-foreground">Pixel akan otomatis disuntikkan ke HTML saat kamu klik "Load Preview".</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h2 className="text-base font-semibold text-foreground">📄 Paste HTML Script</h2>
        <textarea value={htmlCode} onChange={(e) => setHtmlCode(e.target.value)} placeholder="Paste kode HTML hasil dari AI di sini..." className="w-full h-48 rounded-lg bg-secondary text-foreground text-sm font-mono p-3 border border-border resize-y focus:outline-none focus:border-primary" />
        <div className="flex gap-3">
          <Button onClick={() => { let html = htmlCode; if (fbPixelId.trim()) html = injectPixel(html, fbPixelId); setPreviewHtml(html); setHtmlCode(html); setEditMode(false); setPixelApplied(!!fbPixelId.trim()); }} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">▶ Load Preview</Button>
          <Button variant="outline" onClick={() => { setHtmlCode(''); setPreviewHtml(''); setPixelApplied(false); }}>🗑 Clear</Button>
          {previewHtml && (
            <Button variant="outline" onClick={() => { const blob = new Blob([previewHtml], {type:'text/html'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='landing-page.html'; a.click(); URL.revokeObjectURL(url); toast({title:'HTML diekspor!'}); }} className="gap-2 ml-auto">⬇ Export HTML</Button>
          )}
        </div>
      </div>
      {previewHtml && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-base font-semibold text-foreground">👁 Live Preview</h2>
            <div className="flex items-center gap-2">
              {(['desktop','tablet','mobile'] as const).map(vp => (
                <button key={vp} type="button" onClick={() => setViewport(vp)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${viewport===vp?'bg-primary text-primary-foreground border-primary':'bg-secondary text-muted-foreground border-border'}`}>
                  {vp.charAt(0).toUpperCase()+vp.slice(1)}
                </button>
              ))}
              <button type="button" onClick={() => setEditMode(!editMode)} className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all ml-2 ${editMode?'bg-destructive text-destructive-foreground border-destructive':'bg-secondary text-muted-foreground border-border'}`}>
                {editMode ? '🔓 Lock Mode' : '✏️ Edit Mode'}
              </button>
            </div>
          </div>
          <div className="flex justify-center overflow-hidden">
            <div style={{ width: viewportWidths[viewport], transition: 'width 0.3s ease' }} className="relative rounded-lg border border-border overflow-hidden">
              <iframe srcDoc={editMode ? getEditableHtml() : previewHtml} className="w-full" style={{ height: '600px', border: 'none' }} title="Preview" sandbox="allow-scripts allow-same-origin" />
            </div>
          </div>
          {editMode && <div className="rounded-lg bg-accent/10 border border-accent/30 p-3 text-center"><p className="text-sm text-accent font-medium">✏️ Edit Mode ON — klik teks, link, atau gambar untuk mengedit</p></div>}
        </div>
      )}
      {editMode && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
          <p className="text-xs text-muted-foreground">Upload gambar ke <a href="https://uploadimgur.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">uploadimgur.com</a> lalu paste link-nya di dialog edit gambar.</p>
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
        <AdminEditModal editTarget={editTarget} onClose={() => setEditTarget(null)} onSave={handleSaveEdit} />
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

function AdminEditModal({
  editTarget,
  onClose,
  onSave,
}: {
  editTarget: {type:'text'|'img'|'link'|'video'; tag:string; value:string; href:string; index:number; pixelEvent:string; imgWidth?:number; imgHeight?:number};
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

  const toYoutubeEmbed = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    return url;
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-primary">✏️ Edit Element</h3>
        <div className="text-sm text-muted-foreground">TAG: <span className="text-primary font-bold">{editTarget.tag}</span></div>

        {editTarget.type === 'video' ? (
          <div className="space-y-3">
            <label className="text-sm font-semibold uppercase tracking-wide text-foreground">🎬 URL Video YouTube</label>
            <input type="text" value={videoValue} onChange={(e) => setVideoValue(e.target.value)} placeholder="https://www.youtube.com/watch?v=... atau embed URL" className="w-full rounded-lg bg-secondary text-foreground text-sm p-3 border border-border focus:outline-none focus:border-primary" />
            <div className="rounded-lg bg-secondary/60 border border-border p-3 space-y-1">
              <p className="text-xs text-muted-foreground font-semibold">Format yang diterima:</p>
              <p className="text-xs text-muted-foreground">• https://www.youtube.com/watch?v=VIDEO_ID</p>
              <p className="text-xs text-muted-foreground">• https://youtu.be/VIDEO_ID</p>
              <p className="text-xs text-muted-foreground">• https://www.youtube.com/embed/VIDEO_ID</p>
            </div>
            {videoValue && (
              <div className="rounded-lg overflow-hidden border border-border aspect-video">
                <iframe src={toYoutubeEmbed(videoValue)} className="w-full h-full" allowFullScreen title="Video preview" />
              </div>
            )}
          </div>
        ) : editTarget.type === 'img' ? (
          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wide text-foreground">URL Gambar</label>
            {(editTarget.imgWidth || editTarget.imgHeight) ? (
              <div className="flex items-center gap-2">
                <span className="text-xs bg-secondary border border-border rounded px-2 py-1 text-muted-foreground font-mono">{editTarget.imgWidth} × {editTarget.imgHeight} px</span>
                <span className="text-xs text-muted-foreground">— ukuran gambar saat ini</span>
              </div>
            ) : null}
            <input type="text" value={imgValue} onChange={(e) => setImgValue(e.target.value)} placeholder="https://..." className="w-full rounded-lg bg-secondary text-foreground text-sm p-3 border border-border focus:outline-none focus:border-primary" />
            {imgValue && (
              <div className="rounded-lg overflow-hidden border border-border bg-secondary/40 flex items-center justify-center" style={{ minHeight: 80 }}>
                <img src={imgValue} alt="preview" className="max-h-32 object-contain rounded" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
              </div>
            )}
            <p className="text-xs text-muted-foreground">Upload di <a href="https://uploadimgur.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">uploadimgur.com</a> lalu paste link-nya.</p>
          </div>
        ) : editTarget.type === 'link' ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground">Teks Tombol</label>
              <textarea value={textValue} onChange={(e) => setTextValue(e.target.value)} rows={2} className="w-full rounded-lg bg-secondary text-foreground text-sm p-3 border border-border focus:outline-none focus:border-primary resize-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground">URL Tombol / Link</label>
              <input type="text" value={hrefValue} onChange={(e) => setHrefValue(e.target.value)} placeholder="https://wa.me/62..." className="w-full rounded-lg bg-secondary text-foreground text-sm p-3 border border-border focus:outline-none focus:border-primary" />
              <p className="text-xs text-muted-foreground">Contoh: https://wa.me/6281234567890 untuk WhatsApp</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground">🎯 Facebook Pixel Event</label>
              <p className="text-xs text-muted-foreground">Pilih event yang di-track saat tombol ini diklik</p>
              <div className="grid grid-cols-1 gap-1.5">
                {FB_PIXEL_EVENTS.map((ev) => (
                  <button key={ev.value} type="button" onClick={() => setPixelEvent(ev.value)} className={`text-left px-3 py-2 rounded-lg text-sm border transition-all ${pixelEvent === ev.value ? 'bg-primary/15 border-primary text-primary font-semibold' : 'bg-secondary border-border text-foreground hover:border-primary/50'}`}>{ev.label}</button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-foreground">Teks</label>
            <textarea value={textValue} onChange={(e) => setTextValue(e.target.value)} rows={4} className="w-full rounded-lg bg-secondary text-foreground text-sm p-3 border border-border focus:outline-none focus:border-primary resize-none" />
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-secondary text-foreground text-sm font-semibold hover:bg-muted transition-all">Batal</button>
          <button type="button" onClick={() => {
            if (editTarget.type === 'video') onSave(toYoutubeEmbed(videoValue));
            else if (editTarget.type === 'img') onSave(imgValue);
            else if (editTarget.type === 'link') onSave(textValue, hrefValue, pixelEvent || undefined);
            else onSave(textValue);
          }} className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all">💾 Simpan</button>
        </div>
      </div>
    </div>
  );
}


// --- Main Component ---
export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [logs, setLogs] = useState<ProvisionLog[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [resetDialog, setResetDialog] = useState<{ open: boolean; userId: string; email: string }>({ open: false, userId: "", email: "" });
  const [newPassword, setNewPassword] = useState("");
  const [addMemberDialog, setAddMemberDialog] = useState(false);
  const [addMemberForm, setAddMemberForm] = useState({ email: '', password: '', name: '', role: 'user' });
  const [addMemberLoading, setAddMemberLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [form, setForm] = useState<FormState>({ ...initialFormState });
  const [promptText, setPromptText] = useState("");
  const [toolStep, setToolStep] = useState(1);
  const [isDirty, setIsDirty] = useState(false);

  const navigate = useNavigate();
  const { toast: showToast } = useToast();

  useEffect(() => { document.documentElement.classList.toggle("dark", darkMode); }, [darkMode]);

  const fetchUsers = async () => {
    const { data, error } = await supabase.functions.invoke("admin-users", {
      body: { action: "list" },
    });
    if (error || !data?.users) return;
    setUsers(data.users);
  };

  const fetchLogs = async () => {
    const { data } = await supabase.from("provision_logs").select("*").order("created_at", { ascending: false }).limit(100);
    setLogs((data as ProvisionLog[]) || []);
  };

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }
      const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).maybeSingle();
      if (roleData?.role !== "admin") { navigate("/app"); return; }
      setAuthorized(true);
      await Promise.all([fetchUsers(), fetchLogs()]);
      setLoading(false);
    };
    check();
  }, [navigate]);

  const handleApprove = async (entitlementId: string) => {
    setActionLoading(entitlementId);
    await supabase.from("entitlements").update({ status: "active" }).eq("id", entitlementId);
    showToast({ title: "Berhasil", description: "User berhasil di-approve." });
    await fetchUsers();
    setActionLoading(null);
  };

  const handleReject = async (entitlementId: string) => {
    setActionLoading(entitlementId);
    await supabase.from("entitlements").update({ status: "rejected" }).eq("id", entitlementId);
    showToast({ title: "Berhasil", description: "User berhasil ditolak." });
    await fetchUsers();
    setActionLoading(null);
  };

  const handleDelete = async (userId: string) => {
    setActionLoading(userId);
    await supabase.from("entitlements").delete().eq("user_id", userId);
    showToast({ title: "Berhasil", description: "User dihapus." });
    await fetchUsers();
    setActionLoading(null);
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) { showToast({ title: "Error", description: "Password minimal 6 karakter.", variant: "destructive" }); return; }
    setActionLoading(resetDialog.userId);
    const { error } = await supabase.functions.invoke("admin-users", { body: { action: "reset_password", user_id: resetDialog.userId, password: newPassword } });
    if (error) { showToast({ title: "Gagal", description: error.message, variant: "destructive" }); }
    else { showToast({ title: "Berhasil", description: `Password berhasil direset untuk ${resetDialog.email}` }); }
    setResetDialog({ open: false, userId: "", email: "" });
    setNewPassword("");
    setActionLoading(null);
  };

  const handleAddMember = async () => {
    if (!addMemberForm.email || !addMemberForm.password) {
      showToast({ title: "Error", description: "Email dan password wajib diisi.", variant: "destructive" });
      return;
    }
    if (addMemberForm.password.length < 6) {
      showToast({ title: "Error", description: "Password minimal 6 karakter.", variant: "destructive" });
      return;
    }
    setAddMemberLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-users", {
      body: {
        action: "add_member",
        email: addMemberForm.email,
        password: addMemberForm.password,
        name: addMemberForm.name,
        role: addMemberForm.role,
      },
    });
    if (error || data?.error) {
      showToast({ title: "Gagal", description: data?.error || error?.message || "Gagal menambah member.", variant: "destructive" });
    } else {
      showToast({ title: "Berhasil", description: `Member ${addMemberForm.email} berhasil ditambahkan.` });
      setAddMemberDialog(false);
      setAddMemberForm({ email: '', password: '', name: '', role: 'user' });
      await fetchUsers();
    }
    setAddMemberLoading(false);
  };

  const handleChange = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (toolStep > 1) setIsDirty(true);
  }, [toolStep]);

  const handleSalesNotifChange = useCallback((config: import('@/types/form').SalesNotifConfig) => {
    setForm((prev) => ({ ...prev, salesNotif: config }));
    if (toolStep > 1) setIsDirty(true);
  }, [toolStep]);

  const handleCountdownChange = useCallback((config: import('@/types/form').CountdownConfig) => {
    setForm((prev) => ({ ...prev, countdown: config }));
    if (toolStep > 1) setIsDirty(true);
  }, [toolStep]);

  const handleToggleElement = useCallback((element: string) => {
    setForm((prev) => ({ ...prev, elemenTambahan: { ...prev.elemenTambahan, [element]: !prev.elemenTambahan[element] } }));
    if (toolStep > 1) setIsDirty(true);
  }, [toolStep]);

  const handleGenerate = () => {
    const prompt = generatePrompt(form);
    setPromptText(prompt);
    setIsDirty(false);
    setToolStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setForm({ ...initialFormState });
    setPromptText("");
    setToolStep(1);
    setIsDirty(false);
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch = !search || u.email?.toLowerCase().includes(search.toLowerCase()) || u.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || u.status === filterStatus;
    return matchSearch && matchStatus;
  });
  const pendingCount = users.filter((u) => u.status === "pending").length;
  const activeCount = users.filter((u) => u.status === "active").length;
  const rejectedCount = users.filter((u) => u.status === "rejected").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-5 w-5 animate-spin text-primary" />
          <p className="text-muted-foreground">{authorized ? "Memuat data..." : "Memeriksa akses..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Rocket className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-foreground">Landing Page <span className="text-primary">Builder V.10</span></h1>
            <span className="text-xs text-muted-foreground flex items-center gap-1">By Digital Strategi · <Shield className="h-3 w-3" /> Admin Panel</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={async () => { await supabase.auth.signOut(); navigate("/login"); }}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-[1400px] mx-auto w-full">
        <Tabs defaultValue="tools">
          <TabsList className="mb-6">
            <TabsTrigger value="tools" className="gap-2"><Zap className="h-4 w-4" /> Tools</TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" /> Manajemen User
              {pendingCount > 0 && <span className="ml-1 bg-amber-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{pendingCount}</span>}
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2"><FileText className="h-4 w-4" /> Provision Logs</TabsTrigger>
          </TabsList>

          {/* TOOLS TAB */}
          <TabsContent value="tools">
            {/* Stepper */}
            {toolStep > 1 && (
              <div className="flex items-center justify-center py-4 mb-4">
                {[1,2,3].map((s) => {
                  const done = s < toolStep; const active = s === toolStep;
                  return (
                    <div key={s} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${active ? 'bg-primary text-primary-foreground border-primary' : done ? 'bg-transparent text-green-400 border-green-500' : 'bg-transparent text-muted-foreground border-muted-foreground/30'}`}>
                        {done ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : s}
                      </div>
                      {s < 3 && <div className={`w-16 h-0.5 ${done ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />}
                    </div>
                  );
                })}
              </div>
            )}

            {toolStep === 1 && (
              <div className="space-y-4 pb-6 max-w-3xl">
                <Step1Framework framework={form.framework} gayaBahasa={form.gayaBahasa} onChange={handleChange} />
                <Step2Product tipeProduk={form.tipeProduk} tujuanUtama={form.tujuanUtama} onChange={handleChange} />
                <Step3Target levelAwareness={form.levelAwareness} targetAudience={form.targetAudience} onChange={handleChange} />
                <Step4Detail namaProduk={form.namaProduk} hargaNormal={form.hargaNormal} hargaPromo={form.hargaPromo} deskripsiBenefit={form.deskripsiBenefit} ctaUtama={form.ctaUtama} onChange={handleChange} />
                <Step5Design gayaDesain={form.gayaDesain} onChange={handleChange} />
                <Step6Elements elemenTambahan={form.elemenTambahan} onToggle={handleToggleElement} />
                <Step7Platform platformTarget={form.platformTarget} deviceTarget={form.deviceTarget} onChange={handleChange} />
                <Step8Reference linkReferensi={form.linkReferensi} inspirasiDesain={form.inspirasiDesain} onChange={handleChange} />
                <StepSalesNotif salesNotif={form.salesNotif} onChange={handleSalesNotifChange} />
                <StepCountdown countdown={form.countdown} onChange={handleCountdownChange} />
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={handleReset} className="gap-2"><RotateCcw className="h-4 w-4" /> Reset</Button>
                  <Button onClick={handleGenerate} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2" size="lg">
                    <Zap className="h-4 w-4" /> {isDirty ? "Generate Ulang" : "Generate Prompt ⚡"}
                  </Button>
                </div>
              </div>
            )}

            {toolStep === 2 && (
              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-center text-sm text-muted-foreground">Copy prompt lalu buka AI favorit kamu untuk generate script HTML</p>
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-foreground">📋 Prompt Siap Digunakan</h2>
                    <Button variant="outline" size="sm" onClick={async () => { await navigator.clipboard.writeText(promptText); toast({ title: 'Disalin!' }); }} className="gap-2">
                      <Copy className="h-4 w-4" /> Copy
                    </Button>
                  </div>
                  <ScrollArea className="h-64">
                    <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed p-3 bg-secondary rounded-lg">{promptText}</pre>
                  </ScrollArea>
                </div>
                <Button onClick={async () => { try { await navigator.clipboard.writeText(promptText); } catch {} window.open('https://chat.z.ai/', '_blank', 'noopener,noreferrer'); toast({ title: '✅ Prompt sudah disalin!', description: 'Paste prompt (Ctrl+V / Cmd+V) lalu tekan Enter.' }); }} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2" size="lg">
                  <ExternalLink className="h-4 w-4" /> Buat Landing Page
                </Button>
                <Button variant="outline" onClick={() => { setToolStep(3); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full gap-2" size="lg">
                  Lanjut ke Preview &amp; Edit HTML →
                </Button>
                <Button variant="outline" onClick={() => setToolStep(1)} className="w-full">← Kembali Edit Form</Button>
              </div>
            )}

            {toolStep === 3 && <AdminPreviewStep onBack={() => setToolStep(2)} />}
          </TabsContent>

          {/* USERS TAB */}
          <TabsContent value="users">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total User", count: users.length, icon: <Users className="h-8 w-8 text-primary" />, filter: "all" },
                { label: "Pending", count: pendingCount, icon: <Clock className="h-8 w-8 text-amber-500" />, filter: "pending" },
                { label: "Aktif", count: activeCount, icon: <UserCheck className="h-8 w-8 text-emerald-500" />, filter: "active" },
                { label: "Ditolak", count: rejectedCount, icon: <UserX className="h-8 w-8 text-destructive" />, filter: "rejected" },
              ].map((s) => (
                <Card key={s.filter} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilterStatus(s.filter)}>
                  <CardContent className="p-4 flex items-center gap-3">
                    {s.icon}
                    <div><p className="text-2xl font-bold text-foreground">{s.count}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Daftar User ({filteredUsers.length})</CardTitle>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Cari nama atau email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                  </div>
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => setAddMemberDialog(true)}><UserPlus className="h-4 w-4" /> Add Member</Button>
                  <Button variant="outline" size="icon" onClick={() => { fetchUsers(); fetchLogs(); }}><RefreshCw className="h-4 w-4" /></Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {["all","pending","active","rejected"].map((s) => (
                    <Button key={s} size="sm" variant={filterStatus===s?"default":"outline"} onClick={() => setFilterStatus(s)} className="text-xs capitalize">{s==="all"?"Semua":s}</Button>
                  ))}
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead><TableHead>Email</TableHead><TableHead>Status</TableHead>
                        <TableHead>Role</TableHead><TableHead>Terdaftar</TableHead><TableHead>Login Terakhir</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">{search ? "Tidak ada user yang cocok." : "Belum ada user terdaftar."}</TableCell></TableRow>
                      ) : filteredUsers.map((u) => (
                        <TableRow key={u.id} className={u.status==="pending"?"bg-amber-500/5":""}>
                          <TableCell className="font-medium">{u.name||"-"}</TableCell>
                          <TableCell className="text-sm">{u.email}</TableCell>
                          <TableCell><StatusBadge status={u.status} /></TableCell>
                          <TableCell><span className={`text-xs font-medium ${u.role==="admin"?"text-primary":"text-muted-foreground"}`}>{u.role}</span></TableCell>
                          <TableCell className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString("id-ID")}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{u.last_sign_in ? new Date(u.last_sign_in).toLocaleString("id-ID") : "Belum pernah"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {u.status==="pending" && u.entitlement_id && (<>
                                <Button size="sm" variant="outline" className="gap-1 text-emerald-600 border-emerald-300" onClick={() => handleApprove(u.entitlement_id!)} disabled={actionLoading===u.entitlement_id}><CheckCircle className="h-3 w-3" /> ACC</Button>
                                <Button size="sm" variant="outline" className="gap-1 text-destructive border-destructive/30" onClick={() => handleReject(u.entitlement_id!)} disabled={actionLoading===u.entitlement_id}><XCircle className="h-3 w-3" /> Tolak</Button>
                              </>)}
                              {u.status==="rejected" && u.entitlement_id && (
                                <Button size="sm" variant="outline" className="gap-1 text-emerald-600 border-emerald-300" onClick={() => handleApprove(u.entitlement_id!)} disabled={actionLoading===u.entitlement_id}><CheckCircle className="h-3 w-3" /> ACC</Button>
                              )}
                              <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => setResetDialog({ open: true, userId: u.id, email: u.email })}><KeyRound className="h-3 w-3" /></Button>
                              {u.role!=="admin" && <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(u.id)} disabled={actionLoading===u.id}><Trash2 className="h-3 w-3" /></Button>}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LOGS TAB */}
          <TabsContent value="logs">
            <Card>
              <CardHeader><CardTitle>Provision Logs</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Order ID</TableHead><TableHead>Email</TableHead><TableHead>Status</TableHead><TableHead>Message</TableHead><TableHead>Tanggal</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.length===0 ? <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Belum ada log.</TableCell></TableRow>
                    : logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs">{log.order_id||"-"}</TableCell>
                        <TableCell className="text-sm">{log.email||"-"}</TableCell>
                        <TableCell><StatusBadge status={log.status} /></TableCell>
                        <TableCell className="text-xs max-w-[300px] truncate">{log.message||"-"}</TableCell>
                        <TableCell className="text-xs">{new Date(log.created_at).toLocaleString("id-ID")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={resetDialog.open} onOpenChange={(open) => { if (!open) setResetDialog({ open: false, userId: "", email: "" }); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>Reset password untuk {resetDialog.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input type="password" placeholder="Password baru (min. 6 karakter)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialog({ open: false, userId: "", email: "" })}>Batal</Button>
            <Button onClick={handleResetPassword} disabled={actionLoading===resetDialog.userId}>
              {actionLoading===resetDialog.userId ? "Memproses..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={addMemberDialog} onOpenChange={setAddMemberDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5" /> Tambah Member Manual</DialogTitle>
            <DialogDescription>Tambahkan member baru secara manual tanpa melalui webhook.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">Nama</label>
              <Input placeholder="Nama lengkap" value={addMemberForm.name} onChange={(e) => setAddMemberForm(prev => ({ ...prev, name: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">Email *</label>
              <Input type="email" placeholder="email@contoh.com" value={addMemberForm.email} onChange={(e) => setAddMemberForm(prev => ({ ...prev, email: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">Password *</label>
              <Input type="password" placeholder="Min. 6 karakter" value={addMemberForm.password} onChange={(e) => setAddMemberForm(prev => ({ ...prev, password: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">Role</label>
              <div className="flex gap-2">
                {['user', 'admin'].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setAddMemberForm(prev => ({ ...prev, role: r }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      addMemberForm.role === r
                        ? 'bg-primary/10 text-primary border-primary'
                        : 'bg-secondary text-muted-foreground border-border'
                    }`}
                  >
                    {r === 'admin' ? '👑 Admin' : '👤 User'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddMemberDialog(false)}>Batal</Button>
            <Button onClick={handleAddMember} disabled={addMemberLoading}>
              {addMemberLoading ? "Memproses..." : "Tambah Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
