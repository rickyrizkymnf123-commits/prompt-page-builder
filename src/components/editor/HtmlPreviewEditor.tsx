import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { EditModal, EditTarget } from './EditModal';
import { toast } from '@/hooks/use-toast';

interface SectionInfo {
  index: number;
  name: string;
  tagName: string;
}

interface Props {
  onBack: () => void;
  initialHtml?: string;
}

const SECTION_TEMPLATES: Record<string, string> = {
  'Hero Section': `<section style="max-width:688px;margin:0 auto;padding:40px 35px;text-align:center;background:#13111c;box-sizing:border-box;"><h1 style="font-size:32px;font-weight:800;color:#ffffff;margin:0 0 16px;">Headline Utama Anda</h1><p style="font-size:16px;color:#b0b0b0;margin:0 0 24px;">Deskripsi singkat yang menjelaskan value proposition produk Anda.</p><a href="#" style="display:inline-block;padding:14px 32px;background:#7C3AED;color:#fff;border-radius:12px;font-weight:700;text-decoration:none;font-size:16px;">Beli Sekarang</a></section>`,
  'FAQ': `<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0f0d1a;box-sizing:border-box;"><h2 style="font-size:24px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">❓ Frequently Asked Questions</h2><div style="margin-bottom:16px;padding:16px;background:#1a1a2e;border-radius:12px;"><p style="font-weight:700;color:#ffffff;margin:0 0 8px;">Q: Apakah ada garansi?</p><p style="color:#b0b0b0;margin:0;">A: Ya, kami memberikan garansi 30 hari uang kembali.</p></div><div style="padding:16px;background:#1a1a2e;border-radius:12px;"><p style="font-weight:700;color:#ffffff;margin:0 0 8px;">Q: Bagaimana cara aksesnya?</p><p style="color:#b0b0b0;margin:0;">A: Anda akan mendapat akses langsung setelah pembayaran.</p></div></section>`,
  'Testimonial': `<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#16132b;box-sizing:border-box;"><h2 style="font-size:24px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">⭐ Apa Kata Mereka</h2><div style="padding:20px;background:#1a1a2e;border-radius:12px;border-left:4px solid #7C3AED;margin-bottom:16px;"><p style="color:#e8e8f0;margin:0 0 8px;font-style:italic;">"Produk ini benar-benar mengubah cara saya bekerja. Sangat direkomendasikan!"</p><p style="color:#7C3AED;font-weight:600;margin:0;">— Budi, Jakarta</p></div></section>`,
  'CTA Section': `<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#1a1a2e;text-align:center;box-sizing:border-box;"><h2 style="font-size:28px;font-weight:800;color:#ffffff;margin:0 0 16px;">🚀 Jangan Tunggu Lagi!</h2><p style="font-size:16px;color:#b0b0b0;margin:0 0 24px;">Dapatkan akses sekarang sebelum promo berakhir.</p><a href="#" style="display:inline-block;padding:16px 40px;background:#ff4757;color:#fff;border-radius:12px;font-weight:700;text-decoration:none;font-size:18px;">Beli Sekarang</a><p style="font-size:12px;color:#9ca3af;margin:12px 0 0;">✅ Garansi 30 hari uang kembali</p></section>`,
  'Feature List': `<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0f0d1a;box-sizing:border-box;"><h2 style="font-size:24px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">✨ Apa yang Kamu Dapat</h2><ul style="list-style:none;padding:0;margin:0;"><li style="padding:12px 16px;background:#1a1a2e;border-radius:8px;margin-bottom:8px;color:#e8e8f0;font-size:14px;">✅ Fitur utama pertama</li><li style="padding:12px 16px;background:#1a1a2e;border-radius:8px;margin-bottom:8px;color:#e8e8f0;font-size:14px;">✅ Fitur utama kedua</li><li style="padding:12px 16px;background:#1a1a2e;border-radius:8px;color:#e8e8f0;font-size:14px;">✅ Fitur utama ketiga</li></ul></section>`,
  'Bonus Section': `<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#13111c;box-sizing:border-box;"><h2 style="font-size:24px;font-weight:700;color:#ff4757;text-align:center;margin:0 0 24px;">🎁 BONUS YANG AKAN KAMU DAPATKAN</h2><div style="padding:16px;background:#1a1a2e;border-radius:12px;margin-bottom:12px;border-left:4px solid #ff4757;"><p style="color:#ffffff;font-weight:600;margin:0 0 4px;">✅ Bonus 1 — Template Premium</p><p style="color:#9ca3af;font-size:13px;margin:0;">Harga normal: <span style="text-decoration:line-through;color:#ff4757;">Rp 199.000</span></p></div><div style="padding:16px;background:#1a1a2e;border-radius:12px;border-left:4px solid #ff4757;"><p style="color:#ffffff;font-weight:600;margin:0 0 4px;">✅ Bonus 2 — Akses Komunitas</p><p style="color:#9ca3af;font-size:13px;margin:0;">Harga normal: <span style="text-decoration:line-through;color:#ff4757;">Rp 299.000</span></p></div></section>`,
};

export function HtmlPreviewEditor({ onBack, initialHtml }: Props) {
  const [htmlCode, setHtmlCode] = useState(initialHtml || '');
  const [previewHtml, setPreviewHtml] = useState(initialHtml || '');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [editMode, setEditMode] = useState(false);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [fbPixelId, setFbPixelId] = useState('');
  const [pixelApplied, setPixelApplied] = useState(false);
  const [sections, setSections] = useState<SectionInfo[]>([]);
  const [showSectionPanel, setShowSectionPanel] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);

  const viewportWidths = { desktop: '100%', tablet: '768px', mobile: '390px' };

  // Parse sections from HTML
  const parseSections = useCallback((html: string) => {
    if (!html) { setSections([]); return; }
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const root = doc.getElementById('lp-root') || doc.body;
    const children = Array.from(root.children);
    const secs: SectionInfo[] = [];
    children.forEach((child, i) => {
      if (child.tagName === 'SCRIPT' || child.tagName === 'STYLE' || child.id === 'sn-popup') return;
      const heading = child.querySelector('h1,h2,h3,h4');
      const name = heading?.textContent?.slice(0, 40) || `Section ${i + 1}`;
      secs.push({ index: i, name: name.trim(), tagName: child.tagName });
    });
    setSections(secs);
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

  const injectPixel = (html: string, pixelId: string) => {
    if (!pixelId.trim()) return html;
    if (html.includes("fbq('init'") || html.includes('fbq("init"') || html.includes('connect.facebook.net/en_US/fbevents.js')) return html;
    const pixelScript = `<!-- Facebook Pixel Code -->\n<script>\n!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');\nfbq('init', '${pixelId}');\nfbq('track', 'PageView');\n</script>\n<!-- End Facebook Pixel Code -->`;
    return html.includes('</head>') ? html.replace('</head>', pixelScript + '\n</head>') : pixelScript + html;
  };

  const handleLoadPreview = () => {
    let html = htmlCode;
    if (fbPixelId.trim()) html = injectPixel(html, fbPixelId);
    setPreviewHtml(html);
    setHtmlCode(html);
    setEditMode(false);
    setPixelApplied(!!fbPixelId.trim());
  };

  // Get editable HTML with fixes for countdown, navigation, and image editing
  const getEditableHtml = () => {
    if (!editMode || !previewHtml) return previewHtml;
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, 'text/html');

    // BUGFIX: Remove countdown & notification scripts to prevent interference
    doc.querySelectorAll('script').forEach(script => {
      const text = script.textContent || '';
      if (text.includes('cd-days') || text.includes('cd-hours') ||
          text.includes('cd-minutes') || text.includes('cd-seconds') ||
          text.includes('sn-popup') || text.includes('showNotif')) {
        script.remove();
      }
    });

    const editableTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'span', 'li', 'button', 'img', 'iframe'];
    let idx = 0;
    editableTags.forEach(tag => {
      doc.querySelectorAll(tag).forEach(el => {
        // Skip elements inside sales notification popup
        if (el.closest('#sn-popup')) { idx++; return; }

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
          overlay.innerHTML = '<span style="background:rgba(59,130,246,0.9);color:white;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:bold;">🎬 Edit video</span>';
          wrapper.appendChild(overlay);
          idx++;
          return;
        }

        const style = el.getAttribute('style') || '';
        el.setAttribute('style', style + ';cursor:pointer;outline:2px dashed rgba(59,130,246,0.5);outline-offset:2px;');
        idx++;
      });
    });

    // Inject click handler script with fixes
    const script = doc.createElement('script');
    script.textContent = `
      // Prevent ALL navigation inside iframe
      document.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', function(e) { e.preventDefault(); });
      });
      document.addEventListener('submit', function(e) { e.preventDefault(); });

      document.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        // BUGFIX: Prioritize IMG over parent elements
        var el = e.target;
        if (el.tagName === 'IMG' && el.hasAttribute('data-edit-idx')) {
          // use img directly
        } else {
          el = e.target.closest('[data-edit-idx]');
        }
        if (!el) return;

        var idx = el.getAttribute('data-edit-idx');
        var tag = el.getAttribute('data-edit-tag');
        var isImg = tag === 'IMG';
        var isA = tag === 'A';
        var isIframe = tag === 'IFRAME';
        var value = isImg ? (el.getAttribute('src') || '') :
                    isIframe ? (el.getAttribute('data-edit-src') || (el.querySelector('iframe') ? el.querySelector('iframe').getAttribute('src') : '') || '') :
                    (el.innerText || el.textContent || '');
        var href = isA ? (el.getAttribute('data-edit-href') || el.getAttribute('href') || '') : '';
        var pixelEvent = el.getAttribute('data-pixel-event') || '';
        var imgWidth = isImg ? (el.naturalWidth || el.getAttribute('width') || 0) : 0;
        var imgHeight = isImg ? (el.naturalHeight || el.getAttribute('height') || 0) : 0;
        var bgColor = el.style.backgroundColor || '';
        var textColor = el.style.color || '';

        window.parent.postMessage({
          type: 'EDIT_ELEMENT', idx: Number(idx), tag: tag, value: value, href: href,
          isImg: isImg, isA: isA, isIframe: isIframe, pixelEvent: pixelEvent,
          imgWidth: imgWidth, imgHeight: imgHeight, bgColor: bgColor, textColor: textColor
        }, '*');
      }, true);
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
          bgColor: e.data.bgColor || '',
          textColor: e.data.textColor || '',
        });
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const handleSaveEdit = (newValue: string, newHref?: string, pixelEvent?: string, styles?: { bgColor?: string; textColor?: string }) => {
    if (!editTarget) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, 'text/html');
    const editableTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'span', 'li', 'button', 'img', 'iframe'];
    let idx = 0;
    let targetEl: Element | null = null;
    editableTags.forEach(tag => {
      doc.querySelectorAll(tag).forEach(el => {
        if (el.closest('#sn-popup')) { idx++; return; }
        if (idx === editTarget.index) targetEl = el;
        idx++;
      });
    });
    if (targetEl) {
      const el = targetEl as HTMLElement;
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
      // Apply color styles if provided
      if (styles?.textColor) el.style.color = styles.textColor;
      if (styles?.bgColor) el.style.backgroundColor = styles.bgColor;

      const updatedHtml = doc.documentElement.outerHTML;
      setPreviewHtml(updatedHtml);
      setHtmlCode(updatedHtml);
      setEditMode(false);
      setTimeout(() => setEditMode(true), 50);
    }
    setEditTarget(null);
  };

  // Section management
  const moveSection = (sectionIndex: number, direction: 'up' | 'down') => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, 'text/html');
    const root = doc.getElementById('lp-root') || doc.body;
    const children = Array.from(root.children).filter(c => c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE' && c.id !== 'sn-popup');
    
    if (direction === 'up' && sectionIndex > 0) {
      root.insertBefore(children[sectionIndex], children[sectionIndex - 1]);
    } else if (direction === 'down' && sectionIndex < children.length - 1) {
      root.insertBefore(children[sectionIndex + 1], children[sectionIndex]);
    }
    const html = doc.documentElement.outerHTML;
    setPreviewHtml(html);
    setHtmlCode(html);
  };

  const deleteSection = (sectionIndex: number) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, 'text/html');
    const root = doc.getElementById('lp-root') || doc.body;
    const children = Array.from(root.children).filter(c => c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE' && c.id !== 'sn-popup');
    if (children[sectionIndex]) {
      children[sectionIndex].remove();
      const html = doc.documentElement.outerHTML;
      setPreviewHtml(html);
      setHtmlCode(html);
      toast({ title: 'Section dihapus' });
    }
  };

  const changeSectionColor = (sectionIndex: number, color: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, 'text/html');
    const root = doc.getElementById('lp-root') || doc.body;
    const children = Array.from(root.children).filter(c => c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE' && c.id !== 'sn-popup');
    if (children[sectionIndex]) {
      (children[sectionIndex] as HTMLElement).style.backgroundColor = color;
      const html = doc.documentElement.outerHTML;
      setPreviewHtml(html);
      setHtmlCode(html);
    }
  };

  const addSection = (templateKey: string) => {
    const templateHtml = SECTION_TEMPLATES[templateKey];
    if (!templateHtml) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, 'text/html');
    const root = doc.getElementById('lp-root') || doc.body;
    // Insert before scripts/notification
    const snPopup = doc.getElementById('sn-popup');
    const temp = doc.createElement('div');
    temp.innerHTML = templateHtml;
    const newSection = temp.firstElementChild;
    if (newSection) {
      if (snPopup) root.insertBefore(newSection, snPopup);
      else root.appendChild(newSection);
    }
    const html = doc.documentElement.outerHTML;
    setPreviewHtml(html);
    setHtmlCode(html);
    setShowAddSection(false);
    toast({ title: `Section "${templateKey}" ditambahkan` });
  };

  const handleExport = () => {
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
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-4">
      {/* Facebook Pixel */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-2">
        <h2 className="text-sm font-semibold text-foreground">🎯 Facebook Pixel (Opsional)</h2>
        <div className="flex gap-3 items-center">
          <input type="text" value={fbPixelId} onChange={(e) => setFbPixelId(e.target.value)} placeholder="Pixel ID..." className="flex-1 rounded-lg bg-secondary text-foreground text-sm p-2.5 border border-border focus:outline-none focus:border-primary" />
          {pixelApplied && <span className="text-xs text-green-500 font-medium">✅</span>}
        </div>
      </div>

      {/* Paste HTML */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h2 className="text-sm font-semibold text-foreground">📄 Paste HTML Script</h2>
        <textarea value={htmlCode} onChange={(e) => setHtmlCode(e.target.value)} placeholder="Paste kode HTML dari AI..." className="w-full h-40 rounded-lg bg-secondary text-foreground text-sm font-mono p-3 border border-border resize-y focus:outline-none focus:border-primary" />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleLoadPreview} className="gap-1">▶ Load Preview</Button>
          <Button size="sm" variant="outline" onClick={() => { setHtmlCode(''); setPreviewHtml(''); }}>🗑 Clear</Button>
          {previewHtml && <Button size="sm" variant="outline" onClick={handleExport} className="ml-auto">⬇ Export</Button>}
        </div>
      </div>

      {/* Preview + Section Manager */}
      {previewHtml && (
        <div className="flex gap-4">
          {/* Section Panel */}
          {editMode && showSectionPanel && (
            <div className="w-64 flex-shrink-0 rounded-xl border border-border bg-card p-3 space-y-2 max-h-[700px] overflow-y-auto">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">📦 Sections ({sections.length})</h3>
              {sections.map((sec, i) => (
                <div key={i} className="rounded-lg bg-secondary border border-border p-2 space-y-1">
                  <p className="text-xs font-medium text-foreground truncate" title={sec.name}>{sec.name}</p>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => moveSection(i, 'up')} disabled={i === 0} className="px-1.5 py-0.5 rounded text-xs bg-muted hover:bg-muted-foreground/20 disabled:opacity-30">↑</button>
                    <button type="button" onClick={() => moveSection(i, 'down')} disabled={i === sections.length - 1} className="px-1.5 py-0.5 rounded text-xs bg-muted hover:bg-muted-foreground/20 disabled:opacity-30">↓</button>
                    <input type="color" defaultValue="#1a1a2e" onChange={(e) => changeSectionColor(i, e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 p-0 ml-auto" title="Ganti warna background" />
                    <button type="button" onClick={() => { if (confirm('Hapus section ini?')) deleteSection(i); }} className="px-1.5 py-0.5 rounded text-xs text-destructive hover:bg-destructive/10">🗑</button>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <button type="button" onClick={() => setShowAddSection(!showAddSection)} className="w-full py-2 rounded-lg border border-dashed border-primary/50 text-primary text-xs font-semibold hover:bg-primary/5 transition-all">
                  ➕ Tambah Section
                </button>
                {showAddSection && (
                  <div className="mt-2 space-y-1">
                    {Object.keys(SECTION_TEMPLATES).map(key => (
                      <button key={key} type="button" onClick={() => addSection(key)} className="w-full text-left px-2 py-1.5 rounded text-xs border border-border hover:bg-primary/10 hover:border-primary/50 transition-all text-foreground">
                        {key}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="flex-1 rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-semibold text-foreground">👁 Live Preview</h2>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['desktop', 'tablet', 'mobile'] as const).map(vp => (
                  <button key={vp} type="button" onClick={() => setViewport(vp)} className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${viewport === vp ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-muted-foreground border-border'}`}>
                    {vp === 'desktop' ? '🖥' : vp === 'tablet' ? '📟' : '📱'} {vp.charAt(0).toUpperCase() + vp.slice(1)}
                  </button>
                ))}
                <button type="button" onClick={() => { setEditMode(!editMode); if (!editMode) setShowSectionPanel(true); }} className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ml-1 ${editMode ? 'bg-destructive text-destructive-foreground border-destructive' : 'bg-secondary text-muted-foreground border-border'}`}>
                  {editMode ? '🔓 Lock' : '✏️ Edit'}
                </button>
                {editMode && (
                  <button type="button" onClick={() => setShowSectionPanel(!showSectionPanel)} className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${showSectionPanel ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-muted-foreground border-border'}`}>
                    📦 Sections
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-center overflow-hidden">
              <div style={{ width: viewportWidths[viewport], transition: 'width 0.3s ease' }} className="relative rounded-lg border border-border overflow-hidden">
                {/* BUGFIX: Remove allow-same-origin to prevent iframe navigating to app routes */}
                <iframe
                  srcDoc={editMode ? getEditableHtml() : previewHtml}
                  className="w-full"
                  style={{ height: '600px', border: 'none' }}
                  title="Preview"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
            {editMode && (
              <div className="rounded-lg bg-accent/10 border border-accent/30 p-2 text-center">
                <p className="text-xs text-accent font-medium">✏️ Edit Mode ON — klik teks, link, atau gambar untuk mengedit. Gunakan panel Sections untuk reorder/hapus/tambah.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {editMode && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 text-center">
          <p className="text-xs text-muted-foreground">Gunakan gambar format <strong>.webp</strong> untuk performa terbaik. Upload di <a href="https://uploadimgur.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">uploadimgur.com</a></p>
        </div>
      )}

      {/* Bottom bar */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-border py-3 flex gap-2 items-center">
        <Button variant="outline" size="sm" onClick={onBack}>← Kembali</Button>
        <Button variant="outline" size="sm" onClick={async () => { await navigator.clipboard.writeText(previewHtml || htmlCode); toast({ title: '✅ Disalin!' }); }} disabled={!previewHtml && !htmlCode}>📋 Copy HTML</Button>
        <Button size="sm" onClick={handleExport} disabled={!previewHtml && !htmlCode} className="gap-1 bg-green-600 hover:bg-green-700 text-white font-bold ml-auto">⬇ Download HTML</Button>
      </div>

      {editTarget && <EditModal editTarget={editTarget} onClose={() => setEditTarget(null)} onSave={handleSaveEdit} />}
    </div>
  );
}
