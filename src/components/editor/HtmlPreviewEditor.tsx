import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { EditModal, EditTarget } from './EditModal';
import { EditorMarketingPanel, SalesNotifEditorConfig, CountdownEditorConfig } from './EditorMarketingPanel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';

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
  'Hero Section': `<section style="max-width:688px;margin:0 auto;padding:40px 35px;text-align:center;background:#13111c;box-sizing:border-box;"><h1 style="font-size:32px;font-weight:800;color:#ffffff;margin:0 0 16px;">Headline Utama Anda</h1><p style="font-size:16px;color:#b0b0b0;margin:0 0 24px;">Deskripsi singkat yang menjelaskan value proposition produk Anda.</p><a href="#" style="display:inline-block;padding:14px 32px;background:#7C3AED;color:#fff;border-radius:12px;font-weight:700;text-decoration:none;font-size:16px;">Beli Sekarang</a></section>`,
  'FAQ': `<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0f0d1a;box-sizing:border-box;"><h2 style="font-size:24px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">❓ Frequently Asked Questions</h2><div style="margin-bottom:16px;padding:16px;background:#1a1a2e;border-radius:12px;"><p style="font-weight:700;color:#ffffff;margin:0 0 8px;">Q: Apakah ada garansi?</p><p style="color:#b0b0b0;margin:0;">A: Ya, kami memberikan garansi 30 hari uang kembali.</p></div><div style="padding:16px;background:#1a1a2e;border-radius:12px;"><p style="font-weight:700;color:#ffffff;margin:0 0 8px;">Q: Bagaimana cara aksesnya?</p><p style="color:#b0b0b0;margin:0;">A: Anda akan mendapat akses langsung setelah pembayaran.</p></div></section>`,
  'Testimonial': `<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#16132b;box-sizing:border-box;"><h2 style="font-size:24px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">⭐ Apa Kata Mereka</h2><div style="padding:20px;background:#1a1a2e;border-radius:12px;border-left:4px solid #7C3AED;margin-bottom:16px;"><p style="color:#e8e8f0;margin:0 0 8px;font-style:italic;">"Produk ini benar-benar mengubah cara saya bekerja. Sangat direkomendasikan!"</p><p style="color:#7C3AED;font-weight:600;margin:0;">— Budi, Jakarta</p></div></section>`,
  'CTA Section': `<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#1a1a2e;text-align:center;box-sizing:border-box;"><h2 style="font-size:28px;font-weight:800;color:#ffffff;margin:0 0 16px;">🚀 Jangan Tunggu Lagi!</h2><p style="font-size:16px;color:#b0b0b0;margin:0 0 24px;">Dapatkan akses sekarang sebelum promo berakhir.</p><a href="#" style="display:inline-block;padding:16px 40px;background:#ff4757;color:#fff;border-radius:12px;font-weight:700;text-decoration:none;font-size:18px;">Beli Sekarang</a><p style="font-size:12px;color:#9ca3af;margin:12px 0 0;">✅ Garansi 30 hari uang kembali</p></section>`,
  'Feature List': `<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0f0d1a;box-sizing:border-box;"><h2 style="font-size:24px;font-weight:700;color:#ffffff;text-align:center;margin:0 0 24px;">✨ Apa yang Kamu Dapat</h2><ul style="list-style:none;padding:0;margin:0;"><li style="padding:12px 16px;background:#1a1a2e;border-radius:8px;margin-bottom:8px;color:#e8e8f0;font-size:14px;">✅ Fitur utama pertama</li><li style="padding:12px 16px;background:#1a1a2e;border-radius:8px;margin-bottom:8px;color:#e8e8f0;font-size:14px;">✅ Fitur utama kedua</li><li style="padding:12px 16px;background:#1a1a2e;border-radius:8px;color:#e8e8f0;font-size:14px;">✅ Fitur utama ketiga</li></ul></section>`,
  'Bonus Section': `<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#13111c;box-sizing:border-box;"><h2 style="font-size:24px;font-weight:700;color:#ff4757;text-align:center;margin:0 0 24px;">🎁 BONUS YANG AKAN KAMU DAPATKAN</h2><div style="padding:16px;background:#1a1a2e;border-radius:12px;margin-bottom:12px;border-left:4px solid #ff4757;"><p style="color:#ffffff;font-weight:600;margin:0 0 4px;">✅ Bonus 1 — Template Premium</p><p style="color:#9ca3af;font-size:13px;margin:0;">Harga normal: <span style="text-decoration:line-through;color:#ff4757;">Rp 199.000</span></p></div><div style="padding:16px;background:#1a1a2e;border-radius:12px;border-left:4px solid #ff4757;"><p style="color:#ffffff;font-weight:600;margin:0 0 4px;">✅ Bonus 2 — Akses Komunitas</p><p style="color:#9ca3af;font-size:13px;margin:0;">Harga normal: <span style="text-decoration:line-through;color:#ff4757;">Rp 299.000</span></p></div></section>`,
  'Image Gallery': `<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#0f0d1a;box-sizing:border-box;text-align:center;"><h2 style="font-size:24px;font-weight:700;color:#ffffff;margin:0 0 24px;">📸 Gallery Produk</h2><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;"><img src="https://placehold.co/320x200/1a1a2e/7C3AED?text=Gambar+1" alt="Gambar 1" style="width:100%;border-radius:12px;" /><img src="https://placehold.co/320x200/1a1a2e/ff4757?text=Gambar+2" alt="Gambar 2" style="width:100%;border-radius:12px;" /><img src="https://placehold.co/320x200/1a1a2e/38bdf8?text=Gambar+3" alt="Gambar 3" style="width:100%;border-radius:12px;" /><img src="https://placehold.co/320x200/1a1a2e/f59e0b?text=Gambar+4" alt="Gambar 4" style="width:100%;border-radius:12px;" /></div></section>`,
  'Single Image': `<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#13111c;box-sizing:border-box;text-align:center;"><img src="https://placehold.co/600x350/1a1a2e/7C3AED?text=Gambar+Produk" alt="Gambar" style="width:100%;border-radius:16px;" /></section>`,
  'YouTube Video': `<section style="max-width:688px;margin:0 auto;padding:40px 35px;background:#13111c;box-sizing:border-box;text-align:center;"><h2 style="font-size:24px;font-weight:700;color:#ffffff;margin:0 0 16px;">🎬 Video</h2><div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;border-radius:12px;" allowfullscreen></iframe></div></section>`,
  'Countdown Timer': `<section style="max-width:688px;margin:0 auto;padding:30px 35px;background:#1a1a2e;box-sizing:border-box;text-align:center;"><p style="color:#ff4757;font-size:13px;font-weight:700;letter-spacing:2px;margin:0 0 16px;">⏰ PROMO BERAKHIR DALAM</p><div style="display:flex;justify-content:center;gap:12px;"><div style="text-align:center;"><span style="display:inline-block;background:#ff4757;color:#fff;font-size:28px;font-weight:800;padding:8px 16px;border-radius:8px;">00</span><p style="font-size:11px;color:#9ca3af;margin:6px 0 0;">Hari</p></div><div style="text-align:center;"><span style="display:inline-block;background:#ff4757;color:#fff;font-size:28px;font-weight:800;padding:8px 16px;border-radius:8px;">12</span><p style="font-size:11px;color:#9ca3af;margin:6px 0 0;">Jam</p></div><div style="text-align:center;"><span style="display:inline-block;background:#ff4757;color:#fff;font-size:28px;font-weight:800;padding:8px 16px;border-radius:8px;">30</span><p style="font-size:11px;color:#9ca3af;margin:6px 0 0;">Menit</p></div><div style="text-align:center;"><span style="display:inline-block;background:#ff4757;color:#fff;font-size:28px;font-weight:800;padding:8px 16px;border-radius:8px;">00</span><p style="font-size:11px;color:#9ca3af;margin:6px 0 0;">Detik</p></div></div></section>`,
  'Sales Notification': '', // Handled by marketing tools panel
};

const PREMIUM_SECTIONS = ['Countdown Timer', 'Sales Notification'];

export function HtmlPreviewEditor({ onBack, initialHtml, isPaid = true, orderUrl }: Props) {
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
  const [dragSectionIdx, setDragSectionIdx] = useState<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const scrollPosRef = useRef(0);

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

  // Inject click prevention for non-edit preview (buttons should not be clickable)
  const getPreviewHtml = () => {
    if (!previewHtml) return '';
    const preventScript = `<script>document.addEventListener('click',function(e){var a=e.target.closest('a,button');if(a){e.preventDefault();e.stopPropagation();}},true);document.addEventListener('submit',function(e){e.preventDefault();},true);</script>`;
    return previewHtml.includes('</body>') ? previewHtml.replace('</body>', preventScript + '</body>') : previewHtml + preventScript;
  };

  const getEditableHtml = () => {
    if (!editMode || !previewHtml) return previewHtml;
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, 'text/html');

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

    // Mark media containers (yt-container, aspect-video with yt-facade) as editable media
    doc.querySelectorAll('#yt-container, .aspect-video').forEach(container => {
      if (container.closest('#sn-popup')) return;
      const existingIframe = container.querySelector('iframe');
      const existingImg = container.querySelector('img');
      const currentSrc = existingIframe?.getAttribute('src') || existingImg?.getAttribute('src') || '';
      container.setAttribute('data-edit-idx', String(idx));
      container.setAttribute('data-edit-tag', 'MEDIA');
      container.setAttribute('data-edit-src', currentSrc);
      container.setAttribute('data-media-type', existingIframe ? 'video' : 'image');
      const style = container.getAttribute('style') || '';
      container.setAttribute('style', style + ';position:relative;cursor:pointer;');
      const overlay = doc.createElement('div');
      overlay.setAttribute('style', 'position:absolute;inset:0;background:rgba(124,58,237,0.15);border:2px dashed rgba(124,58,237,0.8);cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:10;');
      overlay.innerHTML = '<span style="background:rgba(124,58,237,0.9);color:white;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:bold;">🎬🖼 Edit Media</span>';
      container.appendChild(overlay);
      idx++;
    });

    editableTags.forEach(tag => {
      doc.querySelectorAll(tag).forEach(el => {
        if (el.closest('#sn-popup')) return;
        // Skip elements inside media containers already indexed
        if (el.closest('[data-edit-tag="MEDIA"]')) return;
        el.setAttribute('data-edit-idx', String(idx));
        el.setAttribute('data-edit-tag', tag.toUpperCase());
        if (tag !== 'iframe') el.setAttribute('draggable', 'true');
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
        if (tag === 'img') {
          // Add overlay badge on images to show they support video/image editing
          const parent = el.parentElement;
          if (parent) {
            const wrapper = doc.createElement('div');
            wrapper.setAttribute('style', 'position:relative;display:inline-block;cursor:pointer;');
            wrapper.setAttribute('data-edit-idx', String(idx));
            wrapper.setAttribute('data-edit-tag', 'IMG');
            el.removeAttribute('data-edit-idx');
            el.removeAttribute('data-edit-tag');
            el.removeAttribute('draggable');
            parent.insertBefore(wrapper, el);
            wrapper.appendChild(el);
            const badge = doc.createElement('div');
            badge.setAttribute('style', 'position:absolute;top:8px;right:8px;background:rgba(124,58,237,0.9);color:white;padding:4px 10px;border-radius:16px;font-size:11px;font-weight:bold;z-index:10;pointer-events:none;');
            badge.textContent = '🖼🎬 Edit';
            wrapper.appendChild(badge);
          }
        }
        const style = el.getAttribute('style') || '';
        if (tag !== 'img') {
          el.setAttribute('style', style + ';cursor:pointer;outline:2px dashed rgba(59,130,246,0.5);outline-offset:2px;');
        }
        idx++;
      });
    });

    const editStyle = doc.createElement('style');
    editStyle.textContent = `
      [data-edit-idx]:hover { outline: 2px solid rgba(124,58,237,0.8) !important; outline-offset: 2px; }
      [data-edit-idx][draggable="true"] { cursor: grab; }
      [data-edit-idx][draggable="true"]:active { cursor: grabbing; }
      [data-edit-idx].dragging { opacity: 0.3 !important; }
      .drop-indicator { position: relative; }
      .drop-indicator::before { content: ''; position: absolute; left: 0; right: 0; top: -2px; height: 3px; background: #7C3AED; border-radius: 2px; z-index: 9999; pointer-events: none; }
      .drop-indicator-after::before { top: auto !important; bottom: -2px !important; }
    `;
    doc.head.appendChild(editStyle);

    const script = doc.createElement('script');
    script.textContent = `
      document.querySelectorAll('a,button').forEach(function(a) { a.addEventListener('click', function(e) { e.preventDefault(); }); });
      document.addEventListener('submit', function(e) { e.preventDefault(); });
      // Prevent native browser drag on images so clicks register properly
      document.querySelectorAll('img').forEach(function(img) {
        img.addEventListener('dragstart', function(e) { e.preventDefault(); });
        img.style.webkitUserDrag = 'none';
        img.style.userSelect = 'none';
      });
      
      var _lastScroll = 0;
      window.addEventListener('scroll', function() { _lastScroll = window.pageYOffset || document.documentElement.scrollTop; window.parent.postMessage({ type: 'SCROLL_POS', top: _lastScroll }, '*'); }, true);
      window.addEventListener('message', function(e) { if (e.data && e.data.type === 'SET_SCROLL') { window.scrollTo(0, e.data.top); } });

      var _dragIdx = null;
      var _isClick = true;
      
      document.addEventListener('dragstart', function(e) {
        var el = e.target.closest ? e.target.closest('[data-edit-idx]') : null;
        if (!el) return;
        _dragIdx = Number(el.getAttribute('data-edit-idx'));
        _isClick = false;
        el.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(_dragIdx));
      }, true);

      document.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        document.querySelectorAll('.drop-indicator,.drop-indicator-after').forEach(function(x) { x.classList.remove('drop-indicator','drop-indicator-after'); });
        var target = e.target.closest ? e.target.closest('[data-edit-idx]') : null;
        if (target && Number(target.getAttribute('data-edit-idx')) !== _dragIdx) {
          var rect = target.getBoundingClientRect();
          if (e.clientY > rect.top + rect.height / 2) { target.classList.add('drop-indicator','drop-indicator-after'); }
          else { target.classList.add('drop-indicator'); }
        }
      }, true);

      document.addEventListener('dragleave', function(e) {
        var target = e.target.closest ? e.target.closest('[data-edit-idx]') : null;
        if (target) target.classList.remove('drop-indicator','drop-indicator-after');
      }, true);

      document.addEventListener('drop', function(e) {
        e.preventDefault();
        var isAfter = false;
        document.querySelectorAll('.drop-indicator,.drop-indicator-after').forEach(function(x) {
          if (x.classList.contains('drop-indicator-after')) isAfter = true;
          x.classList.remove('drop-indicator','drop-indicator-after');
        });
        document.querySelectorAll('.dragging').forEach(function(x) { x.classList.remove('dragging'); });
        var dropTarget = e.target.closest ? e.target.closest('[data-edit-idx]') : null;
        if (!dropTarget || _dragIdx === null) { _dragIdx = null; return; }
        var dropIdx = Number(dropTarget.getAttribute('data-edit-idx'));
        if (dropIdx === _dragIdx) { _dragIdx = null; return; }
        window.parent.postMessage({ type: 'REORDER_ELEMENT', fromIdx: _dragIdx, toIdx: dropIdx, after: isAfter }, '*');
        _dragIdx = null;
      }, true);

      document.addEventListener('dragend', function() {
        document.querySelectorAll('.dragging').forEach(function(x) { x.classList.remove('dragging'); });
        document.querySelectorAll('.drop-indicator,.drop-indicator-after').forEach(function(x) { x.classList.remove('drop-indicator','drop-indicator-after'); });
        _dragIdx = null;
      }, true);

      document.addEventListener('mousedown', function() { _isClick = true; });
      document.addEventListener('click', function(e) {
        if (!_isClick) { _isClick = true; return; }
        e.preventDefault(); e.stopPropagation();
        var el = e.target.closest('[data-edit-idx]');
        if (!el) return;
        var idx = el.getAttribute('data-edit-idx');
        var tag = el.getAttribute('data-edit-tag');
        var isImg = tag === 'IMG'; var isA = tag === 'A'; var isIframe = tag === 'IFRAME'; var isMedia = tag === 'MEDIA';
        var imgEl = isImg ? (el.querySelector('img') || el) : el;
        var value = isMedia ? (el.getAttribute('data-edit-src') || '') : isImg ? (imgEl.getAttribute('src') || '') : isIframe ? (el.getAttribute('data-edit-src') || (el.querySelector('iframe') ? el.querySelector('iframe').getAttribute('src') : '') || '') : (el.innerText || el.textContent || '');
        var href = isA ? (el.getAttribute('data-edit-href') || el.getAttribute('href') || '') : '';
        var pixelEvent = el.getAttribute('data-pixel-event') || '';
        var imgWidth = isImg ? (imgEl.naturalWidth || imgEl.getAttribute('width') || 0) : 0;
        var imgHeight = isImg ? (imgEl.naturalHeight || imgEl.getAttribute('height') || 0) : 0;
        var bgColor = el.style.backgroundColor || '';
        var textColor = el.style.color || '';
        window.parent.postMessage({ type: 'EDIT_ELEMENT', idx: Number(idx), tag: tag, value: value, href: href, isImg: isImg, isA: isA, isIframe: isIframe, isMedia: isMedia, pixelEvent: pixelEvent, imgWidth: imgWidth, imgHeight: imgHeight, bgColor: bgColor, textColor: textColor }, '*');
      }, true);
    `;
    doc.body.appendChild(script);
    return doc.documentElement.outerHTML;
  };

  // Restore scroll position after iframe loads
  const restoreScroll = useCallback(() => {
    setTimeout(() => {
      try {
        iframeRef.current?.contentWindow?.postMessage({ type: 'SET_SCROLL', top: scrollPosRef.current }, '*');
      } catch {}
    }, 100);
  }, []);

  // Build element list using SAME tag iteration order as getEditableHtml
  const getEditableElements = useCallback((doc: Document): Element[] => {
    const editableTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'span', 'li', 'button', 'img', 'iframe'];
    const elements: Element[] = [];
    // Media containers first (same order as getEditableHtml)
    doc.querySelectorAll('#yt-container, .aspect-video').forEach(el => {
      if (!el.closest('#sn-popup')) elements.push(el);
    });
    editableTags.forEach(tag => {
      doc.querySelectorAll(tag).forEach(el => {
        if (!el.closest('#sn-popup') && !el.closest('#yt-container') && !el.closest('.aspect-video')) elements.push(el);
      });
    });
    return elements;
  }, []);

  // Helper to serialize back to the same format as the original HTML (avoid wrapping in <html><head><body>)
  const serializeDoc = useCallback((doc: Document): string => {
    const root = doc.getElementById('lp-root');
    // Always capture head content (styles, meta, scripts that DOMParser moved to head)
    const headContent = doc.head.innerHTML.trim();
    const headPart = headContent ? `<head>${headContent}</head>` : '';
    if (root) {
      // Collect scripts/styles from body that are outside lp-root
      const extras: string[] = [];
      Array.from(doc.body.children).forEach(child => {
        if (child !== root) extras.push((child as HTMLElement).outerHTML);
      });
      return headPart + root.outerHTML + extras.join('');
    }
    // Fallback: include head content (styles etc.) + body content
    if (headContent) {
      return headContent + '\n' + doc.body.innerHTML;
    }
    return doc.body.innerHTML;
  }, []);

  // Reorder element by index - handles DnD from iframe
  const reorderElement = useCallback((fromIdx: number, toIdx: number, after: boolean) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, 'text/html');
    const allElements = getEditableElements(doc);
    const fromEl = allElements[fromIdx];
    const toEl = allElements[toIdx];
    if (!fromEl || !toEl || fromEl === toEl) return;

    // Only allow reordering within the same parent to prevent structure corruption
    if (fromEl.parentNode !== toEl.parentNode) {
      toast({ title: '⚠️ Elemen hanya bisa dipindah dalam section yang sama', variant: 'destructive' });
      return;
    }

    if (after) {
      toEl.parentNode?.insertBefore(fromEl, toEl.nextSibling);
    } else {
      toEl.parentNode?.insertBefore(fromEl, toEl);
    }
    const html = serializeDoc(doc);
    setPreviewHtml(html);
    setHtmlCode(html);
    toast({ title: '✅ Elemen dipindahkan!' });
    setTimeout(() => restoreScroll(), 200);
  }, [previewHtml, restoreScroll, getEditableElements, serializeDoc]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'EDIT_ELEMENT') {
        setEditTarget({
          type: e.data.isMedia ? 'media' : e.data.isImg ? 'img' : e.data.isA ? 'link' : e.data.isIframe ? 'video' : 'text',
          tag: e.data.tag, value: e.data.value, href: e.data.href || '', index: e.data.idx,
          pixelEvent: e.data.pixelEvent || '', imgWidth: e.data.imgWidth || 0, imgHeight: e.data.imgHeight || 0,
          bgColor: e.data.bgColor || '', textColor: e.data.textColor || '',
        });
      } else if (e.data?.type === 'REORDER_ELEMENT') {
        reorderElement(e.data.fromIdx, e.data.toIdx, e.data.after);
      } else if (e.data?.type === 'SCROLL_POS') {
        scrollPosRef.current = e.data.top;
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [restoreScroll, reorderElement]);

  const handleSaveEdit = (newValue: string, newHref?: string, pixelEvent?: string, styles?: { bgColor?: string; textColor?: string }) => {
    if (!editTarget) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, 'text/html');
    const allElements = getEditableElements(doc);
    const targetEl = allElements[editTarget.index] || null;
    if (targetEl) {
      const el = targetEl as HTMLElement;
      if (editTarget.type === 'media') {
        // Replace container content with video iframe or image
        if (newHref === 'media:video') {
          el.innerHTML = `<iframe src="${newValue}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;border-radius:12px;" allowfullscreen></iframe>`;
          el.setAttribute('style', 'position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;');
        } else if (newHref === 'media:image') {
          el.innerHTML = `<img src="${newValue}" alt="Media" style="width:100%;border-radius:12px;" />`;
          el.setAttribute('style', '');
        }
      } else if (editTarget.type === 'video') el.setAttribute('src', newValue);
      else if (editTarget.type === 'img') {
        if (newHref === 'media:video') {
          // Replace img with video iframe wrapper
          const videoWrapper = doc.createElement('div');
          videoWrapper.setAttribute('style', 'position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;');
          videoWrapper.innerHTML = `<iframe src="${newValue}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;border-radius:12px;" allowfullscreen></iframe>`;
          el.parentNode?.replaceChild(videoWrapper, el);
        } else {
          el.setAttribute('src', newValue);
        }
      }
      else if (editTarget.type === 'link') {
        // Preserve child elements (like <span>, <img>) inside the link
        if (el.children.length === 0) {
          el.textContent = newValue;
        } else {
          // Update only direct text nodes, keep child elements
          const walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
          const textNodes: Text[] = [];
          let node: Text | null;
          while ((node = walker.nextNode() as Text | null)) {
            if (node.parentNode === el) textNodes.push(node);
          }
          if (textNodes.length > 0) {
            textNodes[0].textContent = newValue;
            for (let i = 1; i < textNodes.length; i++) textNodes[i].textContent = '';
          } else {
            el.insertBefore(doc.createTextNode(newValue), el.firstChild);
          }
        }
        if (newHref !== undefined) el.setAttribute('href', newHref);
        if (pixelEvent) {
          const evScript = pixelEvent === 'Purchase'
            ? `if(typeof fbq!=='undefined'){fbq('track','${pixelEvent}',{value:0,currency:'IDR'});}`
            : `if(typeof fbq!=='undefined'){fbq('track','${pixelEvent}');}`;
          el.setAttribute('onclick', evScript);
          el.setAttribute('data-pixel-event', pixelEvent);
        } else { el.removeAttribute('onclick'); el.removeAttribute('data-pixel-event'); }
      } else {
        // For text elements, preserve child HTML structure
        if (el.children.length === 0) {
          el.textContent = newValue;
        } else {
          // Update direct text nodes only
          const walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
          const textNodes: Text[] = [];
          let node: Text | null;
          while ((node = walker.nextNode() as Text | null)) {
            if (node.parentNode === el) textNodes.push(node);
          }
          if (textNodes.length > 0) {
            textNodes[0].textContent = newValue;
            for (let i = 1; i < textNodes.length; i++) textNodes[i].textContent = '';
          } else {
            el.textContent = newValue;
          }
        }
      if (styles?.textColor) el.style.color = styles.textColor;
      if (styles?.bgColor) el.style.backgroundColor = styles.bgColor;
      const updatedHtml = serializeDoc(doc);
      setPreviewHtml(updatedHtml); setHtmlCode(updatedHtml);
      setTimeout(() => restoreScroll(), 200);
    }
    setEditTarget(null);
  };

  const handleDeleteElement = () => {
    if (!editTarget) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, 'text/html');
    const allElements = getEditableElements(doc);
    const targetEl = allElements[editTarget.index] || null;
    if (targetEl) {
      targetEl.remove();
      const updatedHtml = serializeDoc(doc);
      setPreviewHtml(updatedHtml); setHtmlCode(updatedHtml);
      toast({ title: 'Elemen dihapus' });
      setTimeout(() => restoreScroll(), 200);
    }
    setEditTarget(null);
  };

  const moveSection = (sectionIndex: number, direction: 'up' | 'down') => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, 'text/html');
    const root = doc.getElementById('lp-root') || doc.body;
    const children = Array.from(root.children).filter(c => c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE' && c.id !== 'sn-popup');
    if (direction === 'up' && sectionIndex > 0) root.insertBefore(children[sectionIndex], children[sectionIndex - 1]);
    else if (direction === 'down' && sectionIndex < children.length - 1) root.insertBefore(children[sectionIndex + 1], children[sectionIndex]);
    const html = serializeDoc(doc);
    setPreviewHtml(html); setHtmlCode(html);
    setTimeout(() => restoreScroll(), 200);
  };

  const reorderSection = (fromIndex: number, toIndex: number) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, 'text/html');
    const root = doc.getElementById('lp-root') || doc.body;
    const children = Array.from(root.children).filter(c => c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE' && c.id !== 'sn-popup');
    if (!children[fromIndex] || !children[toIndex]) return;
    const moving = children[fromIndex];
    moving.remove();
    // Re-get filtered children after removal
    const updatedChildren = Array.from(root.children).filter(c => c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE' && c.id !== 'sn-popup');
    if (toIndex >= updatedChildren.length) {
      // Insert before sn-popup or at end
      const snPopup = doc.getElementById('sn-popup');
      if (snPopup) root.insertBefore(moving, snPopup);
      else root.appendChild(moving);
    } else {
      root.insertBefore(moving, updatedChildren[toIndex]);
    }
    const html = serializeDoc(doc);
    setPreviewHtml(html); setHtmlCode(html);
    toast({ title: '✅ Section dipindahkan!' });
    setTimeout(() => restoreScroll(), 200);
  };

  const deleteSection = (sectionIndex: number) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, 'text/html');
    const root = doc.getElementById('lp-root') || doc.body;
    const children = Array.from(root.children).filter(c => c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE' && c.id !== 'sn-popup');
    if (children[sectionIndex]) {
      children[sectionIndex].remove();
      const html = serializeDoc(doc);
      setPreviewHtml(html); setHtmlCode(html);
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
      const html = serializeDoc(doc);
      setPreviewHtml(html); setHtmlCode(html);
    }
  };

  const addSection = (templateKey: string) => {
    if (PREMIUM_SECTIONS.includes(templateKey) && !isPaid) {
      if (orderUrl) window.open(orderUrl, '_blank');
      return;
    }
    // Sales Notification and Countdown are handled by marketing tools
    if (templateKey === 'Sales Notification') {
      injectSalesNotif({
        enabled: true, position: 'bottom-left', emoji: '🔥',
        names: 'Seseorang dari Jakarta,Budi Surabaya,Ani Bandung', message: 'baru saja membeli',
        produk: 'Produk Anda', interval: 5, duration: 4,
        bgColor: '#ffffff', borderColor: '#6c63ff', textColor: '#1a1a2e',
      });
      setShowAddSection(false);
      return;
    }
    if (templateKey === 'Countdown Timer') {
      injectCountdown({
        enabled: true, labelAtas: '⏰ PROMO BERAKHIR DALAM',
        hari: 0, jam: 12, menit: 30, detik: 0,
        bgColor: '#1a1a2e', textColor: '#ffffff', accentColor: '#ff4757',
      });
      setShowAddSection(false);
      return;
    }
    const templateHtml = SECTION_TEMPLATES[templateKey];
    if (!templateHtml) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, 'text/html');
    const root = doc.getElementById('lp-root') || doc.body;
    const snPopup = doc.getElementById('sn-popup');
    const temp = doc.createElement('div');
    temp.innerHTML = templateHtml;
    const newSection = temp.firstElementChild;
    if (newSection) {
      if (snPopup) root.insertBefore(newSection, snPopup);
      else root.appendChild(newSection);
    }
    const html = serializeDoc(doc);
    setPreviewHtml(html); setHtmlCode(html);
    setShowAddSection(false);
    toast({ title: `Section "${templateKey}" ditambahkan` });
    setTimeout(() => restoreScroll(), 300);
  };

  const handleExport = () => {
    const content = previewHtml || htmlCode;
    if (!content) return;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'landing-page.html'; a.click();
    URL.revokeObjectURL(url);
    toast({ title: '⬇ Download berhasil!', description: 'File landing-page.html siap digunakan.' });
  };

  const handleUpgrade = () => {
    if (orderUrl) window.open(orderUrl, '_blank');
  };

  const hasSalesNotif = previewHtml.includes('id="sn-popup"');
  const hasCountdown = previewHtml.includes('cd-days') || previewHtml.includes('cd-hours') || previewHtml.includes('data-section-type="countdown"');

  // Parse existing sales notif config from HTML for marketing tools sync
  const parsedSnConfig = useMemo<Partial<SalesNotifEditorConfig>>(() => {
    if (!hasSalesNotif) return {};
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(previewHtml, 'text/html');
      const popup = doc.getElementById('sn-popup');
      if (!popup) return {};
      const style = popup.getAttribute('style') || '';
      let position = 'bottom-left';
      if (style.includes('top') && style.includes('right')) position = 'top-right';
      else if (style.includes('top') && style.includes('left')) position = 'top-left';
      else if (style.includes('bottom') && style.includes('right')) position = 'bottom-right';
      const bgMatch = style.match(/background:\s*([^;]+)/);
      const borderMatch = style.match(/border:\s*[^;]*solid\s+([^;]+)/);
      const emojiEl = popup.querySelector('span');
      const emoji = emojiEl?.textContent?.trim() || '🔥';
      const nameEl = doc.getElementById('sn-name');
      const msgEl = popup.querySelectorAll('p')[1];
      const msgText = msgEl?.textContent || '';
      const strongEl = msgEl?.querySelector('strong');
      const produk = strongEl?.textContent || 'Produk Anda';
      const message = msgText.replace(produk, '').trim();
      // Parse names from script
      let names = 'Seseorang dari Jakarta';
      const scripts = doc.querySelectorAll('script');
      scripts.forEach(s => {
        const t = s.textContent || '';
        const namesMatch = t.match(/var names=(\[.*?\])/);
        if (namesMatch) {
          try { names = JSON.parse(namesMatch[1]).join(','); } catch {}
        }
      });
      return { position, emoji, names, message, produk, bgColor: bgMatch?.[1]?.trim(), borderColor: borderMatch?.[1]?.trim() };
    } catch { return {}; }
  }, [previewHtml, hasSalesNotif]);

  const parsedCdConfig = useMemo<Partial<CountdownEditorConfig>>(() => {
    if (!hasCountdown) return {};
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(previewHtml, 'text/html');
      const cdSection = doc.querySelector('[data-section-type="countdown"]') || doc.querySelector('[id^="cd-"]')?.closest('section');
      if (!cdSection) return {};
      const style = (cdSection as HTMLElement).getAttribute('style') || '';
      const bgMatch = style.match(/background:\s*([^;]+)/);
      const labelEl = cdSection.querySelector('p');
      const labelAtas = labelEl?.textContent?.trim() || '';
      const accentEl = cdSection.querySelector('[id="cd-days"]');
      const accentStyle = accentEl?.getAttribute('style') || '';
      const accentBgMatch = accentStyle.match(/background:\s*([^;]+)/);
      const textColorMatch = accentStyle.match(/color:\s*([^;]+)/);
      return { bgColor: bgMatch?.[1]?.trim(), labelAtas, accentColor: accentBgMatch?.[1]?.trim(), textColor: textColorMatch?.[1]?.trim() };
    } catch { return {}; }
  }, [previewHtml, hasCountdown]);

  const injectSalesNotif = (config: SalesNotifEditorConfig) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, 'text/html');
    // Remove existing
    doc.getElementById('sn-popup')?.remove();
    doc.querySelectorAll('script').forEach(s => { if ((s.textContent || '').includes('sn-popup') || (s.textContent || '').includes('showNotif')) s.remove(); });

    const posMap: Record<string, string> = {
      'bottom-left': 'bottom:20px;left:20px;',
      'bottom-right': 'bottom:20px;right:20px;',
      'top-left': 'top:20px;left:20px;',
      'top-right': 'top:20px;right:20px;',
    };
    const posStyle = posMap[config.position] || posMap['bottom-left'];
    const names = config.names.split(',').map(n => n.trim()).filter(Boolean);
    const namesJson = JSON.stringify(names);

    const snHtml = `<div id="sn-popup" style="position:fixed;${posStyle}background:${config.bgColor};border:2px solid ${config.borderColor};border-radius:12px;padding:12px 16px;box-shadow:0 4px 20px rgba(0,0,0,0.15);z-index:9999;display:none;align-items:center;gap:10px;max-width:320px;transition:all 0.4s ease;"><span style="font-size:24px;">${config.emoji}</span><div><p id="sn-name" style="margin:0;font-size:13px;color:${config.textColor};font-weight:600;"></p><p style="margin:2px 0 0;font-size:12px;color:${config.textColor};opacity:0.8;">${config.message} <strong>${config.produk}</strong></p></div></div>`;
    const snScript = `<script>(function(){var names=${namesJson};var i=0;var popup=document.getElementById('sn-popup');var nameEl=document.getElementById('sn-name');function showNotif(){if(!popup||!nameEl)return;nameEl.textContent=names[i%names.length];popup.style.display='flex';setTimeout(function(){popup.style.display='none';i++;},${config.duration * 1000});} setTimeout(function(){showNotif();setInterval(showNotif,${(config.interval + config.duration) * 1000});},${config.interval * 1000});})()</script>`;

    const root = doc.getElementById('lp-root') || doc.body;
    const temp = doc.createElement('div');
    temp.innerHTML = snHtml;
    if (temp.firstElementChild) root.appendChild(temp.firstElementChild);
    const scriptEl = doc.createElement('div');
    scriptEl.innerHTML = snScript;
    if (scriptEl.firstElementChild) doc.body.appendChild(scriptEl.firstElementChild);

    const html = serializeDoc(doc);
    setPreviewHtml(html); setHtmlCode(html);
    toast({ title: '✅ Sales Notification diperbarui!' });
    setTimeout(() => restoreScroll(), 300);
  };

  const removeSalesNotif = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, 'text/html');
    doc.getElementById('sn-popup')?.remove();
    doc.querySelectorAll('script').forEach(s => { if ((s.textContent || '').includes('sn-popup') || (s.textContent || '').includes('showNotif')) s.remove(); });
    const html = serializeDoc(doc);
    setPreviewHtml(html); setHtmlCode(html);
    toast({ title: 'Sales Notification dihapus' });
  };

  const injectCountdown = (config: CountdownEditorConfig) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, 'text/html');
    // Remove existing countdown sections
    doc.querySelectorAll('[data-section-type="countdown"]').forEach(el => el.remove());
    doc.querySelectorAll('script').forEach(s => { if ((s.textContent || '').includes('cd-days') || (s.textContent || '').includes('cd-hours')) s.remove(); });

    const totalSec = (config.hari * 86400) + (config.jam * 3600) + (config.menit * 60) + config.detik;
    const cdHtml = `<section data-section-type="countdown" style="max-width:688px;margin:0 auto;padding:30px 35px;background:${config.bgColor};box-sizing:border-box;text-align:center;"><p style="color:${config.accentColor};font-size:13px;font-weight:700;letter-spacing:2px;margin:0 0 16px;">${config.labelAtas}</p><div style="display:flex;justify-content:center;gap:12px;"><div style="text-align:center;"><span id="cd-days" style="display:inline-block;background:${config.accentColor};color:${config.textColor};font-size:28px;font-weight:800;padding:8px 16px;border-radius:8px;">${String(config.hari).padStart(2, '0')}</span><p style="font-size:11px;color:${config.textColor};opacity:0.7;margin:6px 0 0;">Hari</p></div><div style="text-align:center;"><span id="cd-hours" style="display:inline-block;background:${config.accentColor};color:${config.textColor};font-size:28px;font-weight:800;padding:8px 16px;border-radius:8px;">${String(config.jam).padStart(2, '0')}</span><p style="font-size:11px;color:${config.textColor};opacity:0.7;margin:6px 0 0;">Jam</p></div><div style="text-align:center;"><span id="cd-minutes" style="display:inline-block;background:${config.accentColor};color:${config.textColor};font-size:28px;font-weight:800;padding:8px 16px;border-radius:8px;">${String(config.menit).padStart(2, '0')}</span><p style="font-size:11px;color:${config.textColor};opacity:0.7;margin:6px 0 0;">Menit</p></div><div style="text-align:center;"><span id="cd-seconds" style="display:inline-block;background:${config.accentColor};color:${config.textColor};font-size:28px;font-weight:800;padding:8px 16px;border-radius:8px;">${String(config.detik).padStart(2, '0')}</span><p style="font-size:11px;color:${config.textColor};opacity:0.7;margin:6px 0 0;">Detik</p></div></div></section>`;
    const cdScript = `<script>(function(){var end=Date.now()+${totalSec}*1000;function pad(n){return String(n).padStart(2,'0');}function tick(){var diff=Math.max(0,Math.floor((end-Date.now())/1000));var d=Math.floor(diff/86400);var h=Math.floor((diff%86400)/3600);var m=Math.floor((diff%3600)/60);var s=diff%60;var de=document.getElementById('cd-days');var he=document.getElementById('cd-hours');var me=document.getElementById('cd-minutes');var se=document.getElementById('cd-seconds');if(de)de.textContent=pad(d);if(he)he.textContent=pad(h);if(me)me.textContent=pad(m);if(se)se.textContent=pad(s);if(diff>0)requestAnimationFrame(function(){setTimeout(tick,1000);});}tick();})()</script>`;

    const root = doc.getElementById('lp-root') || doc.body;
    const snPopup = doc.getElementById('sn-popup');
    const temp = doc.createElement('div');
    temp.innerHTML = cdHtml;
    if (temp.firstElementChild) {
      if (snPopup) root.insertBefore(temp.firstElementChild, snPopup);
      else root.appendChild(temp.firstElementChild);
    }
    const scriptEl = doc.createElement('div');
    scriptEl.innerHTML = cdScript;
    if (scriptEl.firstElementChild) doc.body.appendChild(scriptEl.firstElementChild);

    const html = serializeDoc(doc);
    setPreviewHtml(html); setHtmlCode(html);
    toast({ title: '✅ Countdown Timer diperbarui!' });
    setTimeout(() => restoreScroll(), 300);
  };

  const removeCountdown = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, 'text/html');
    doc.querySelectorAll('[data-section-type="countdown"]').forEach(el => el.remove());
    doc.querySelectorAll('script').forEach(s => { if ((s.textContent || '').includes('cd-days') || (s.textContent || '').includes('cd-hours')) s.remove(); });
    const html = serializeDoc(doc);
    setPreviewHtml(html); setHtmlCode(html);
    toast({ title: 'Countdown Timer dihapus' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-4">
      {/* Facebook Pixel - Premium feature */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">🎯 Facebook Pixel ID</h2>
          {!isPaid && <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">PREMIUM</span>}
        </div>
        {isPaid ? (
          <div className="flex gap-3 items-center">
            <input type="text" value={fbPixelId} onChange={(e) => setFbPixelId(e.target.value)} placeholder="Pixel ID..." className="flex-1 rounded-lg bg-secondary text-foreground text-sm p-2.5 border border-border focus:outline-none focus:border-primary" />
            {pixelApplied && <span className="text-xs text-green-500 font-medium">✅</span>}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">Fitur ini hanya untuk pengguna berbayar.</p>
            {orderUrl && <Button size="sm" variant="outline" onClick={handleUpgrade} className="gap-1 text-xs"><Lock className="h-3 w-3" /> Upgrade</Button>}
          </div>
        )}
      </div>

      {/* Paste HTML - hidden when preview loaded or initialHtml provided */}
      {!initialHtml && !previewHtml && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">📄 Paste HTML Script</h2>
          <textarea value={htmlCode} onChange={(e) => setHtmlCode(e.target.value)} placeholder="Paste kode HTML dari AI..." className="w-full h-40 rounded-lg bg-secondary text-foreground text-sm font-mono p-3 border border-border resize-y focus:outline-none focus:border-primary" />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleLoadPreview} className="gap-1">▶ Load Preview</Button>
            <Button size="sm" variant="outline" onClick={() => { setHtmlCode(''); setPreviewHtml(''); }}>🗑 Clear</Button>
          </div>
        </div>
      )}
      {!initialHtml && previewHtml && (
        <div className="rounded-xl border border-border bg-card p-3 flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground">✅ HTML Loaded</span>
          <Button size="sm" variant="outline" onClick={() => setPreviewHtml('')}>📝 Edit HTML</Button>
          <Button size="sm" variant="outline" onClick={handleExport} className="ml-auto">⬇ Export</Button>
        </div>
      )}

      {/* Preview + Section Manager */}
      {previewHtml && (
        <div className="flex gap-4">
          {/* Section Panel */}
          {editMode && showSectionPanel && (
            <div className="w-64 flex-shrink-0 sticky top-4 self-start max-h-[85vh] overflow-y-auto">
              <div className="rounded-xl border border-border bg-card p-3 space-y-2">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">📦 Sections ({sections.length})</h3>
                <div className="space-y-1">
                  {sections.map((sec, i) => (
                    <div
                      key={`${i}-${sec.name}`}
                      draggable
                      onDragStart={() => setDragSectionIdx(i)}
                      onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('ring-2', 'ring-primary'); }}
                      onDragLeave={(e) => { e.currentTarget.classList.remove('ring-2', 'ring-primary'); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('ring-2', 'ring-primary');
                        if (dragSectionIdx !== null && dragSectionIdx !== i) {
                          reorderSection(dragSectionIdx, i);
                        }
                        setDragSectionIdx(null);
                      }}
                      onDragEnd={() => setDragSectionIdx(null)}
                      className={`rounded-lg bg-secondary border border-border p-2 space-y-1 cursor-grab active:cursor-grabbing transition-all ${dragSectionIdx === i ? 'opacity-40 scale-95' : ''}`}
                    >
                      <p className="text-xs font-medium text-foreground truncate" title={sec.name}>☰ {sec.name}</p>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => moveSection(i, 'up')} disabled={i === 0} className="px-1 py-0.5 rounded text-xs text-muted-foreground hover:bg-primary/10 disabled:opacity-30">⬆</button>
                        <button type="button" onClick={() => moveSection(i, 'down')} disabled={i === sections.length - 1} className="px-1 py-0.5 rounded text-xs text-muted-foreground hover:bg-primary/10 disabled:opacity-30">⬇</button>
                        <input type="color" defaultValue="#1a1a2e" onChange={(e) => changeSectionColor(i, e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 p-0 ml-auto" title="Ganti warna background" />
                        <button type="button" onClick={() => { if (confirm('Hapus section ini?')) deleteSection(i); }} className="px-1.5 py-0.5 rounded text-xs text-destructive hover:bg-destructive/10">🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2">
                  <button type="button" onClick={() => setShowAddSection(!showAddSection)} className="w-full py-2 rounded-lg border border-dashed border-primary/50 text-primary text-xs font-semibold hover:bg-primary/5 transition-all">
                    ➕ Tambah Section
                  </button>
                  {showAddSection && (
                    <div className="space-y-1 mt-2">
                      {Object.keys(SECTION_TEMPLATES).map(key => {
                        const isLocked = PREMIUM_SECTIONS.includes(key) && !isPaid;
                        return (
                          <button key={key} type="button" onClick={() => addSection(key)} className={`w-full text-left px-2 py-1.5 rounded text-xs border transition-all text-foreground ${isLocked ? 'border-primary/30 bg-primary/5 opacity-60' : 'border-border hover:bg-primary/10 hover:border-primary/50'}`}>
                            {key} {isLocked && <Lock className="inline h-3 w-3 ml-1 text-primary" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
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
                {isPaid ? (
                  <button type="button" onClick={() => {
                    const newMode = !editMode;
                    if (!newMode) setPreviewHtml(htmlCode);
                    setEditMode(newMode);
                    if (newMode) setShowSectionPanel(true);
                  }} className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ml-1 ${editMode ? 'bg-destructive text-destructive-foreground border-destructive' : 'bg-secondary text-muted-foreground border-border'}`}>
                    {editMode ? '🔓 Lock' : '✏️ Edit'}
                  </button>
                ) : (
                  <button type="button" onClick={handleUpgrade} className="px-3 py-1 rounded-lg text-xs font-medium border border-primary/40 bg-primary/10 text-primary ml-1 cursor-pointer hover:bg-primary/20 transition-all flex items-center gap-1">
                    🔒 Edit (Premium)
                  </button>
                )}
                {editMode && (
                  <button type="button" onClick={() => setShowSectionPanel(!showSectionPanel)} className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${showSectionPanel ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-muted-foreground border-border'}`}>
                    📦 Sections
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-center overflow-hidden">
              <div style={{ width: viewportWidths[viewport], transition: 'width 0.3s ease' }} className="relative rounded-lg border border-border overflow-hidden">
                <iframe
                  ref={iframeRef}
                  srcDoc={editMode ? getEditableHtml() : getPreviewHtml()}
                  className="w-full"
                  style={{ height: '600px', border: 'none' }}
                  title="Preview"
                  sandbox="allow-scripts"
                  onLoad={restoreScroll}
                />
              </div>
            </div>
            {editMode && (
              <div className="rounded-lg bg-accent/10 border border-accent/30 p-2 text-center">
                <p className="text-xs text-accent font-medium">✏️ Edit Mode ON — klik untuk edit, <strong>drag & drop</strong> untuk pindahkan elemen mana saja. Panel Sections untuk hapus/tambah.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {editMode && isPaid && previewHtml && (
        <EditorMarketingPanel
          onInjectSalesNotif={injectSalesNotif}
          onInjectCountdown={injectCountdown}
          onRemoveSalesNotif={removeSalesNotif}
          onRemoveCountdown={removeCountdown}
          hasSalesNotif={hasSalesNotif}
          hasCountdown={hasCountdown}
          initialSnConfig={parsedSnConfig}
          initialCdConfig={parsedCdConfig}
        />
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

      {editTarget && <EditModal editTarget={editTarget} onClose={() => setEditTarget(null)} onSave={handleSaveEdit} onDelete={handleDeleteElement} />}
    </div>
  );
}
