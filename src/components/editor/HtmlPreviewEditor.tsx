import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EditModal, EditTarget } from './EditModal';
import { EditorMarketingPanel, SalesNotifEditorConfig, CountdownEditorConfig } from './EditorMarketingPanel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import {
  Lock,
  MessageSquare,
  Link,
  Sparkles,
  Layers,
  Trash2,
  ArrowUp,
  ArrowDown,
  Palette,
  Smartphone,
  Monitor,
  Edit3,
  CheckCircle2,
  Download,
  Copy,
  Plus,
} from 'lucide-react';

interface SectionInfo {
  index: number;
  name: string;
  tagName: string;
}

interface Props {
  onBack: () => void;
  initialHtml?: string;
  isPaid?: boolean;
  orderUrl?: string;
}

const SECTION_TEMPLATES: Record<string, string> = {
  'Hero Section 3D': `<section style="max-width:720px;margin:0 auto;padding:50px 20px 40px;text-align:center;background:#090812;background-image:radial-gradient(circle at 50% -10%,rgba(124,58,237,0.25),transparent 70%);box-sizing:border-box;border-radius:24px;border:1px solid rgba(255,255,255,0.08);margin-bottom:20px;"><div style="display:inline-block;padding:6px 14px;border-radius:999px;background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.3);color:#c4b5fd;font-size:11px;font-weight:800;letter-spacing:1px;margin-bottom:16px;">🔥 PENAWARAN EKSKLUSIF 2026</div><h1 style="font-size:32px;font-weight:900;color:#ffffff;margin:0 0 16px;line-height:1.2;">Solusi Revolusioner Untuk <span style="background:linear-gradient(135deg,#a855f7,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Hasil 10x Lebih Cepat</span></h1><p style="font-size:15px;color:#a1a1aa;margin:0 0 24px;line-height:1.6;">Deskripsi value proposition yang memikat audiens dan mengubah pengunjung menjadi pembeli aktif dalam hitungan menit.</p><a href="#" style="display:inline-flex;align-items:center;gap:8px;padding:16px 36px;background:linear-gradient(135deg,#7c3aed,#ec4899);color:#fff;border-radius:16px;font-weight:800;text-decoration:none;font-size:16px;box-shadow:0 0 25px rgba(124,58,237,0.5);">🚀 Dapatkan Akses Sekarang</a><p style="font-size:12px;color:#71717a;margin:14px 0 0;">⭐⭐⭐⭐⭐ 4.9/5 · Garansi 30 Hari Uang Kembali</p></section>`,
  'Video Showcase': `<section style="max-width:720px;margin:0 auto;padding:40px 20px;background:#0b0a17;border-radius:24px;border:1px solid rgba(255,255,255,0.08);box-sizing:border-box;margin-bottom:20px;text-align:center;"><h2 style="font-size:24px;font-weight:800;color:#ffffff;margin:0 0 12px;">🎬 Tonton Demo Video Singkat</h2><p style="font-size:14px;color:#a1a1aa;margin:0 0 20px;">Lihat bagaimana produk ini bekerja secara nyata dalam 2 menit.</p><div style="position:relative;border-radius:20px;overflow:hidden;border:1px solid rgba(168,85,247,0.3);box-shadow:0 20px 40px rgba(0,0,0,0.6);aspect-ratio:16/9;background:#000;"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="width:100%;height:100%;border:0;" allowfullscreen title="Video Demo"></iframe></div></section>`,
  '3D Bento Features': `<section style="max-width:720px;margin:0 auto;padding:40px 20px;background:#090812;border-radius:24px;box-sizing:border-box;margin-bottom:20px;"><h2 style="font-size:26px;font-weight:800;color:#ffffff;text-align:center;margin:0 0 24px;">✨ Keunggulan Utama (Bento 3D)</h2><div style="display:grid;grid-template-columns:1fr;gap:14px;"><div style="padding:22px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);backdrop-filter:blur(16px);border-radius:20px;"><div style="font-size:24px;margin-bottom:8px;">⚡</div><h3 style="font-size:18px;font-weight:800;color:#ffffff;margin:0 0 6px;">Eksekusi Instan Otomatis</h3><p style="font-size:13px;color:#a1a1aa;margin:0;line-height:1.5;">Hemat hingga 20 jam kerja per minggu tanpa perlu keahlian teknis yang rumit.</p></div><div style="padding:22px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);backdrop-filter:blur(16px);border-radius:20px;"><div style="font-size:24px;margin-bottom:8px;">📈</div><h3 style="font-size:18px;font-weight:800;color:#ffffff;margin:0 0 6px;">Pertumbuhan Konversi 3.4x</h3><p style="font-size:13px;color:#a1a1aa;margin:0;line-height:1.5;">Formula teruji yang dirancang khusus untuk meningkatkan omset dan leads berkualitas.</p></div></div></section>`,
  'Before vs After': `<section style="max-width:720px;margin:0 auto;padding:40px 20px;background:#0d0c1c;border-radius:24px;border:1px solid rgba(255,255,255,0.08);box-sizing:border-box;margin-bottom:20px;"><h2 style="font-size:24px;font-weight:800;color:#ffffff;text-align:center;margin:0 0 24px;">⚖️ Perbandingan Nyata</h2><div style="display:grid;grid-template-columns:1fr;gap:12px;"><div style="padding:18px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);border-radius:18px;"><p style="font-weight:800;color:#f87171;margin:0 0 6px;">❌ Cara Lama yang Melelahkan</p><p style="font-size:13px;color:#a1a1aa;margin:0;">Trial-error berbulan-bulan, budget iklan boncos, dan hasil tidak konsisten.</p></div><div style="padding:18px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:18px;"><p style="font-weight:800;color:#34d399;margin:0 0 6px;">✅ Solusi Baru dengan Produk Ini</p><p style="font-size:13px;color:#a1a1aa;margin:0;">Langkah terarah dari hari pertama, template siap pakai, dan bimbingan sampai profit.</p></div></div></section>`,
  'Pricing Table 3D': `<section style="max-width:720px;margin:0 auto;padding:44px 20px;background:#090812;border-radius:24px;border:1px solid rgba(168,85,247,0.3);box-shadow:0 0 35px rgba(124,58,237,0.2);box-sizing:border-box;text-align:center;margin-bottom:20px;"><div style="display:inline-block;padding:4px 12px;background:linear-gradient(135deg,#7c3aed,#ec4899);color:#fff;font-size:10px;font-weight:900;border-radius:999px;margin-bottom:12px;">🔥 PALING POPULER</div><h2 style="font-size:26px;font-weight:900;color:#ffffff;margin:0 0 6px;">Paket Akses Lengkap</h2><p style="font-size:14px;color:#a1a1aa;margin:0 0 16px;">Harga normal: <span style="text-decoration:line-through;color:#ef4444;">Rp 499.000</span></p><p style="font-size:36px;font-weight:900;color:#c4b5fd;margin:0 0 20px;">Rp 149.000 <span style="font-size:14px;color:#a1a1aa;font-weight:400;">/ Sekali Bayar</span></p><a href="#" style="display:inline-block;width:90%;padding:16px 20px;background:linear-gradient(135deg,#7c3aed,#ec4899);color:#fff;border-radius:16px;font-weight:800;text-decoration:none;font-size:16px;box-shadow:0 0 20px rgba(124,58,237,0.4);">⚡ Amankan Akses Promo Sekarang</a></section>`,
  'Interactive FAQ': `<section style="max-width:720px;margin:0 auto;padding:40px 20px;background:#0a0916;border-radius:24px;border:1px solid rgba(255,255,255,0.08);box-sizing:border-box;margin-bottom:20px;"><h2 style="font-size:24px;font-weight:800;color:#ffffff;text-align:center;margin:0 0 20px;">❓ Pertanyaan Sering Ditanyakan (FAQ)</h2><div style="margin-bottom:10px;padding:16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;"><p style="font-weight:700;color:#ffffff;margin:0 0 6px;">Q: Apakah pemula bisa langsung mempraktikkannya?</p><p style="color:#a1a1aa;font-size:13px;margin:0;">A: Ya, materi dan template disusun langkah demi langkah dari nol tanpa perlu skill teknis.</p></div><div style="padding:16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;"><p style="font-weight:700;color:#ffffff;margin:0 0 6px;">Q: Bagaimana proses akses setelah pembayaran?</p><p style="color:#a1a1aa;font-size:13px;margin:0;">A: Akses langsung dikirimkan secara otomatis ke WhatsApp & Email Anda dalam hitungan detik.</p></div></section>`,
};

export function HtmlPreviewEditor({ onBack, initialHtml, isPaid = true, orderUrl }: Props) {
  const [htmlCode, setHtmlCode] = useState(initialHtml || '');
  const [previewHtml, setPreviewHtml] = useState(initialHtml || '');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('mobile');
  const [editMode, setEditMode] = useState(false);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [sections, setSections] = useState<SectionInfo[]>([]);
  const [showSectionPanel, setShowSectionPanel] = useState(false);
  const [showCtaQuickInspector, setShowCtaQuickInspector] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);

  // Quick CTA Inspector states
  const [quickCtaText, setQuickCtaText] = useState('Beli Sekarang');
  const [quickWaNumber, setQuickWaNumber] = useState('6281234567890');
  const [quickWaMsg, setQuickWaMsg] = useState('Halo admin, saya mau order promo produk ini sekarang...');
  const [quickLinkUrl, setQuickLinkUrl] = useState('');

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const scrollPosRef = useRef(0);

  const viewportWidths = { desktop: '100%', tablet: '768px', mobile: '375px' };

  // Parse sections from HTML
  const parseSections = useCallback((html: string) => {
    if (!html) { setSections([]); return; }
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const root = doc.getElementById('lp-root') || doc.body;
      const children = Array.from(root.children);
      const secs: SectionInfo[] = [];
      children.forEach((child, i) => {
        if (child.tagName === 'SCRIPT' || child.tagName === 'STYLE' || child.id === 'sn-popup') return;
        const heading = child.querySelector('h1,h2,h3,h4');
        const name = heading?.textContent?.slice(0, 35) || `Section ${i + 1} (${child.tagName.toLowerCase()})`;
        secs.push({ index: i, name: name.trim(), tagName: child.tagName });
      });
      setSections(secs);
    } catch {}
  }, []);

  useEffect(() => {
    if (previewHtml) parseSections(previewHtml);
  }, [previewHtml, parseSections]);

  useEffect(() => {
    if (initialHtml) {
      setHtmlCode(initialHtml);
      setPreviewHtml(initialHtml);
    }
  }, [initialHtml]);

  // Listen to postMessage from iframe when elements are clicked in Edit Mode
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'EDIT_ELEMENT') {
        const { tag, value, href, index, pixelEvent, bgColor, textColor, elType } = e.data;
        let inferredType: EditTarget['type'] = elType || 'text';
        if (tag === 'IMG') inferredType = 'img';
        else if (tag === 'A') inferredType = 'link';
        else if (tag === 'IFRAME') inferredType = 'video';
        else if (tag === 'DIV' && value && value.includes('youtube')) inferredType = 'video';

        setEditTarget({
          type: inferredType,
          tag,
          value: value || '',
          href: href || '',
          index,
          pixelEvent: pixelEvent || '',
          bgColor,
          textColor,
        });
      } else if (e.data?.type === 'SCROLL_POS') {
        scrollPosRef.current = e.data.scrollY || 0;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const serializeDoc = (doc: Document) => '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;

  const restoreScroll = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.scrollTo(0, scrollPosRef.current);
    }
  };

  // Helper to extract editable elements
  const getEditableElements = (doc: Document): HTMLElement[] => {
    const selectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'li', 'a', 'button', 'img', 'iframe'];
    const root = doc.getElementById('lp-root') || doc.body;
    const elements: HTMLElement[] = [];
    root.querySelectorAll(selectors.join(',')).forEach((el) => {
      if (el.id === 'sn-popup' || el.closest('#sn-popup')) return;
      if (el.closest('[data-section-type="countdown"]')) return;
      elements.push(el as HTMLElement);
    });
    return elements;
  };

  // Generate HTML for Edit Mode with hover highlight and click listener
  const getEditableHtml = () => {
    if (!previewHtml) return '';
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(previewHtml, 'text/html');
      const elements = getEditableElements(doc);

      elements.forEach((el, index) => {
        el.setAttribute('data-edit-index', String(index));
        el.setAttribute('data-editable', 'true');
      });

      const editStyles = `
        <style id="lp-edit-styles">
          [data-editable="true"] {
            outline: 2px dashed rgba(168, 85, 247, 0.6) !important;
            outline-offset: 2px !important;
            cursor: pointer !important;
            transition: all 0.15s ease !important;
          }
          [data-editable="true"]:hover {
            outline: 2px solid #a855f7 !important;
            background-color: rgba(168, 85, 247, 0.15) !important;
            box-shadow: 0 0 12px rgba(168, 85, 247, 0.4) !important;
          }
          a, button {
            pointer-events: auto !important;
          }
        </style>
      `;

      const editScript = `
        <script id="lp-edit-script">
          document.addEventListener('click', function(e) {
            var target = e.target.closest('[data-editable="true"]');
            if (target) {
              e.preventDefault();
              e.stopPropagation();
              var index = parseInt(target.getAttribute('data-edit-index'), 10);
              var tag = target.tagName;
              var href = target.getAttribute('href') || '';
              var value = target.tagName === 'IMG' ? (target.getAttribute('src') || '') : (target.innerText || target.textContent || '');
              var pixelEvent = target.getAttribute('data-pixel-event') || '';
              var style = window.getComputedStyle(target);
              var bgColor = style.backgroundColor;
              var textColor = style.color;

              window.parent.postMessage({
                type: 'EDIT_ELEMENT',
                tag: tag,
                value: value,
                href: href,
                index: index,
                pixelEvent: pixelEvent,
                bgColor: bgColor,
                textColor: textColor
              }, '*');
            }
          }, true);

          window.addEventListener('scroll', function() {
            window.parent.postMessage({ type: 'SCROLL_POS', scrollY: window.scrollY }, '*');
          });
        </script>
      `;

      if (doc.head) {
        doc.head.insertAdjacentHTML('beforeend', editStyles);
      }
      if (doc.body) {
        doc.body.insertAdjacentHTML('beforeend', editScript);
      }

      return serializeDoc(doc);
    } catch {
      return previewHtml;
    }
  };

  // Preview HTML when editMode is OFF (disables links from navigating)
  const getPreviewHtml = () => {
    if (!previewHtml) return '';
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(previewHtml, 'text/html');

      const clickPrevention = `
        <script>
          document.addEventListener('click', function(e) {
            var a = e.target.closest('a, button');
            if (a && a.getAttribute('href') && !a.getAttribute('href').startsWith('#')) {
              e.preventDefault();
              console.log('Link clicked in preview:', a.getAttribute('href'));
            }
          }, true);
        </script>
      `;
      if (doc.body) doc.body.insertAdjacentHTML('beforeend', clickPrevention);
      return serializeDoc(doc);
    } catch {
      return previewHtml;
    }
  };

  // Handle saving edits from EditModal
  const handleSaveEdit = (newValue: string, newHref?: string, pixelEvent?: string, styles?: { bgColor?: string; textColor?: string }) => {
    if (!editTarget) return;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(previewHtml, 'text/html');
      const elements = getEditableElements(doc);
      const targetEl = elements[editTarget.index];

      if (targetEl) {
        if (editTarget.type === 'img' || targetEl.tagName === 'IMG') {
          targetEl.setAttribute('src', newValue);
        } else if (editTarget.type === 'video' || targetEl.tagName === 'IFRAME') {
          targetEl.setAttribute('src', newValue);
        } else if (editTarget.type === 'link' || targetEl.tagName === 'A' || targetEl.tagName === 'BUTTON') {
          targetEl.textContent = newValue;
          if (newHref !== undefined) targetEl.setAttribute('href', newHref);
        } else {
          targetEl.textContent = newValue;
        }

        if (styles?.textColor) targetEl.style.color = styles.textColor;
        if (styles?.bgColor) targetEl.style.backgroundColor = styles.bgColor;

        const updatedHtml = serializeDoc(doc);
        setPreviewHtml(updatedHtml);
        setHtmlCode(updatedHtml);
        toast({ title: '✅ Perubahan Disimpan!' });
      }
    } catch (err: any) {
      toast({ title: 'Gagal Menyimpan', description: err.message, variant: 'destructive' });
    }
    setEditTarget(null);
  };

  const handleDeleteElement = () => {
    if (!editTarget) return;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(previewHtml, 'text/html');
      const elements = getEditableElements(doc);
      const targetEl = elements[editTarget.index];
      if (targetEl) {
        targetEl.remove();
        const updatedHtml = serializeDoc(doc);
        setPreviewHtml(updatedHtml);
        setHtmlCode(updatedHtml);
        toast({ title: '🗑️ Elemen Dihapus' });
      }
    } catch {}
    setEditTarget(null);
  };

  // Section Reordering
  const moveSection = (sectionIndex: number, direction: 'up' | 'down') => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(previewHtml, 'text/html');
      const root = doc.getElementById('lp-root') || doc.body;
      const children = Array.from(root.children).filter(c => c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE' && c.id !== 'sn-popup');
      if (direction === 'up' && sectionIndex > 0) root.insertBefore(children[sectionIndex], children[sectionIndex - 1]);
      else if (direction === 'down' && sectionIndex < children.length - 1) root.insertBefore(children[sectionIndex + 1], children[sectionIndex]);
      const html = serializeDoc(doc);
      setPreviewHtml(html); setHtmlCode(html);
      toast({ title: '🔀 Urutan Section Diperbarui' });
    } catch {}
  };

  const deleteSection = (sectionIndex: number) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(previewHtml, 'text/html');
      const root = doc.getElementById('lp-root') || doc.body;
      const children = Array.from(root.children).filter(c => c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE' && c.id !== 'sn-popup');
      if (children[sectionIndex]) {
        children[sectionIndex].remove();
        const html = serializeDoc(doc);
        setPreviewHtml(html); setHtmlCode(html);
        toast({ title: '🗑️ Section Dihapus' });
      }
    } catch {}
  };

  const changeSectionColor = (sectionIndex: number, color: string) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(previewHtml, 'text/html');
      const root = doc.getElementById('lp-root') || doc.body;
      const children = Array.from(root.children).filter(c => c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE' && c.id !== 'sn-popup');
      if (children[sectionIndex]) {
        (children[sectionIndex] as HTMLElement).style.backgroundColor = color;
        const html = serializeDoc(doc);
        setPreviewHtml(html); setHtmlCode(html);
      }
    } catch {}
  };

  const addSection = (templateKey: string) => {
    const tpl = SECTION_TEMPLATES[templateKey];
    if (!tpl) return;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(previewHtml, 'text/html');
      const root = doc.getElementById('lp-root') || doc.body;
      const temp = doc.createElement('div');
      temp.innerHTML = tpl;
      if (temp.firstElementChild) root.appendChild(temp.firstElementChild);
      const html = serializeDoc(doc);
      setPreviewHtml(html); setHtmlCode(html);
      toast({ title: `➕ ${templateKey} Ditambahkan` });
      setShowAddSection(false);
    } catch {}
  };

  // Quick CTA Batch Updater
  const applyQuickCtaToAll = (mode: 'whatsapp' | 'link') => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(previewHtml, 'text/html');
      const buttons = doc.querySelectorAll('a, button');
      let count = 0;

      buttons.forEach((btn) => {
        if (btn.tagName === 'A' || btn.tagName === 'BUTTON') {
          if (quickCtaText.trim()) btn.textContent = quickCtaText.trim();

          if (mode === 'whatsapp') {
            const enc = encodeURIComponent(quickWaMsg);
            btn.setAttribute('href', `https://wa.me/${quickWaNumber.replace(/[^0-9]/g, '')}?text=${enc}`);
            btn.setAttribute('target', '_blank');
          } else if (mode === 'link' && quickLinkUrl) {
            btn.setAttribute('href', quickLinkUrl);
            btn.setAttribute('target', '_blank');
          }
          count++;
        }
      });

      const updated = serializeDoc(doc);
      setPreviewHtml(updated);
      setHtmlCode(updated);
      toast({ title: '✅ CTA Diperbarui!', description: `${count} tombol CTA berhasil disinkronkan.` });
      setShowCtaQuickInspector(false);
    } catch (err: any) {
      toast({ title: 'Gagal memperbarui CTA', description: err.message, variant: 'destructive' });
    }
  };

  const handleExport = () => {
    const blob = new Blob([previewHtml || htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'landing-page.html';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: '⬇️ File HTML Diunduh' });
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-3 space-y-4">
      {/* Top Toolbar */}
      <div className="rounded-2xl border border-border bg-card p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onBack} className="text-xs h-8">
            ← Kembali
          </Button>
          <span className="text-xs font-bold text-foreground truncate">
            {sections.length > 0 ? `📄 ${sections.length} Section Terdeteksi` : 'Live HTML Editor'}
          </span>
        </div>

        {/* Action Controls & Viewport */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Viewport switcher */}
          <div className="flex items-center gap-1 bg-secondary p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                viewport === 'mobile' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>HP (375px)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                viewport === 'desktop' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
          </div>

          {/* EDIT MODE VISUAL TOGGLE BUTTON (CLICK ANY TEXT / IMAGE / CTA TO EDIT) */}
          <Button
            size="sm"
            onClick={() => setEditMode(!editMode)}
            className={`text-xs h-8 gap-1.5 font-bold transition-all ${
              editMode
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-2 ring-amber-400 shadow-md'
                : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{editMode ? '🔓 Mode Edit ON' : '✏️ Mode Edit Visual'}</span>
          </Button>

          {/* Quick CTA Inspector Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowCtaQuickInspector(!showCtaQuickInspector)}
            className={`text-xs h-8 gap-1 font-semibold ${showCtaQuickInspector ? 'bg-primary/10 border-primary text-primary' : ''}`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
            <span>Edit CTA & WA</span>
          </Button>

          {/* Section Reorder Toggle */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSectionPanel(!showSectionPanel)}
            className={`text-xs h-8 gap-1 font-semibold ${showSectionPanel ? 'bg-primary/10 border-primary text-primary' : ''}`}
          >
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>🔀 Reorder</span>
          </Button>

          <Button size="sm" onClick={handleExport} className="text-xs h-8 gap-1 font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
            <Download className="w-3.5 h-3.5" /> Download
          </Button>
        </div>
      </div>

      {/* EDIT MODE ON HELPER BANNER */}
      {editMode && (
        <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between gap-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong>Mode Edit Visual Aktif:</strong> Klik langsung pada teks, judul, paragraf, gambar, atau tombol mana pun di preview untuk mengedit teks, warna background, warna tombol, atau tautan!
            </span>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setEditMode(false)} className="text-xs h-7 text-amber-300 hover:text-white">
            Selesai Edit ✓
          </Button>
        </div>
      )}

      {/* QUICK CTA INSPECTOR POPUP PANEL */}
      {showCtaQuickInspector && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" /> Edit Cepat Semua Tombol CTA & WhatsApp
            </h3>
            <button type="button" onClick={() => setShowCtaQuickInspector(false)} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-foreground">Teks Tombol</label>
              <Input value={quickCtaText} onChange={(e) => setQuickCtaText(e.target.value)} placeholder="Beli Sekarang" className="bg-background text-xs h-8" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-foreground">Nomor WhatsApp (kode 62)</label>
              <Input value={quickWaNumber} onChange={(e) => setQuickWaNumber(e.target.value)} placeholder="6281234567890" className="bg-background text-xs h-8" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-foreground">Link Checkout / Microsite</label>
              <Input value={quickLinkUrl} onChange={(e) => setQuickLinkUrl(e.target.value)} placeholder="https://order.domain.com/..." className="bg-background text-xs h-8" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-foreground">Pesan WhatsApp Otomatis (Auto-Text)</label>
            <Input value={quickWaMsg} onChange={(e) => setQuickWaMsg(e.target.value)} placeholder="Halo admin, saya mau order..." className="bg-background text-xs h-8" />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button size="sm" variant="outline" onClick={() => applyQuickCtaToAll('link')} className="text-xs h-8 gap-1">
              <Link className="w-3.5 h-3.5" /> Terapkan Link Checkout
            </Button>
            <Button size="sm" onClick={() => applyQuickCtaToAll('whatsapp')} className="text-xs h-8 gap-1 font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
              <MessageSquare className="w-3.5 h-3.5" /> Terapkan Direct WhatsApp
            </Button>
          </div>
        </div>
      )}

      {/* SECTION REORDER & MANAGEMENT DRAWER */}
      {showSectionPanel && (
        <div className="p-3.5 rounded-2xl bg-secondary/70 border border-border space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-primary" /> Susun Ulang / Geser Urutan Section ({sections.length})
            </h3>
            <button type="button" onClick={() => setShowSectionPanel(false)} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {sections.map((sec, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-background border border-border flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold truncate max-w-[150px]">{i + 1}. {sec.name}</span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    disabled={i === 0}
                    onClick={() => moveSection(i, 'up')}
                    className="p-1 rounded bg-secondary hover:bg-secondary/80 disabled:opacity-30"
                    title="Geser Naik"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    disabled={i === sections.length - 1}
                    onClick={() => moveSection(i, 'down')}
                    className="p-1 rounded bg-secondary hover:bg-secondary/80 disabled:opacity-30"
                    title="Geser Turun"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <input
                    type="color"
                    defaultValue="#1a1a2e"
                    onChange={(e) => changeSectionColor(i, e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border-0 p-0"
                    title="Ganti Background"
                  />
                  <button
                    type="button"
                    onClick={() => deleteSection(i)}
                    className="p-1 text-destructive hover:bg-destructive/10 rounded"
                    title="Hapus"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <Button size="sm" variant="outline" onClick={() => setShowAddSection(!showAddSection)} className="text-xs h-7 gap-1">
              <Plus className="w-3.5 h-3.5" /> Tambah Section Standar
            </Button>
          </div>

          {showAddSection && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
              {Object.keys(SECTION_TEMPLATES).map(key => (
                <button
                  key={key}
                  type="button"
                  onClick={() => addSection(key)}
                  className="p-2 rounded-lg bg-background border border-border hover:border-primary/50 text-left text-xs font-semibold"
                >
                  + {key}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Preview Container */}
      <div className="flex justify-center overflow-hidden bg-slate-950 p-2 sm:p-4 rounded-2xl border border-border shadow-2xl">
        <div
          style={{ width: viewportWidths[viewport], transition: 'width 0.3s ease' }}
          className="relative rounded-xl overflow-hidden border border-border shadow-2xl bg-white max-w-full"
        >
          <iframe
            ref={iframeRef}
            srcDoc={editMode ? getEditableHtml() : getPreviewHtml()}
            className="w-full"
            style={{ height: '640px', border: 'none' }}
            title="Preview Live Editor"
            sandbox="allow-scripts allow-same-origin"
            onLoad={restoreScroll}
          />
        </div>
      </div>

      {/* Code Textarea & Raw Paste Drawer */}
      <div className="rounded-2xl border border-border bg-card p-3 sm:p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground uppercase">💻 Kode HTML Sumber</span>
          <Button size="sm" variant="ghost" onClick={() => setPreviewHtml(htmlCode)} className="text-xs h-7 text-primary">
            Perbarui Preview
          </Button>
        </div>
        <textarea
          value={htmlCode}
          onChange={(e) => { setHtmlCode(e.target.value); setPreviewHtml(e.target.value); }}
          className="w-full h-36 rounded-xl bg-secondary text-foreground text-xs font-mono p-3 border border-border focus:outline-none focus:border-primary resize-y"
          placeholder="Kode HTML landing page..."
        />
      </div>

      {/* Modal for editing individual element (Headline, Paragraph, Image, Video, Link, Color) */}
      {editTarget && (
        <EditModal
          editTarget={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleSaveEdit}
          onDelete={handleDeleteElement}
        />
      )}
    </div>
  );
}
