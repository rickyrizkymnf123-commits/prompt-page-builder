import { useState, useEffect } from 'react';

const FB_PIXEL_EVENTS = [
  { value: '', label: '❌ Tidak ada event khusus' },
  { value: 'AddToCart', label: '🛒 AddToCart' },
  { value: 'InitiateCheckout', label: '💳 InitiateCheckout' },
  { value: 'AddPaymentInfo', label: '💳 AddPaymentInfo' },
  { value: 'Purchase', label: '✅ Purchase' },
  { value: 'Lead', label: '📋 Lead' },
  { value: 'ViewContent', label: '👁 ViewContent' },
  { value: 'CompleteRegistration', label: '📝 CompleteRegistration' },
];

export interface EditTarget {
  type: 'text' | 'img' | 'link' | 'video';
  tag: string;
  value: string;
  href: string;
  index: number;
  pixelEvent: string;
  imgWidth?: number;
  imgHeight?: number;
  bgColor?: string;
  textColor?: string;
}

interface Props {
  editTarget: EditTarget;
  onClose: () => void;
  onSave: (value: string, href?: string, pixelEvent?: string, styles?: { bgColor?: string; textColor?: string }) => void;
}

export function EditModal({ editTarget, onClose, onSave }: Props) {
  const [textValue, setTextValue] = useState(editTarget.value);
  const [hrefValue, setHrefValue] = useState(editTarget.href);
  const [imgValue, setImgValue] = useState(editTarget.value);
  const [videoValue, setVideoValue] = useState(editTarget.value);
  const [pixelEvent, setPixelEvent] = useState(editTarget.pixelEvent || '');
  const [bgColor, setBgColor] = useState(editTarget.bgColor || '');
  const [textColor, setTextColor] = useState(editTarget.textColor || '');

  useEffect(() => {
    setTextValue(editTarget.value);
    setHrefValue(editTarget.href);
    setImgValue(editTarget.value);
    setVideoValue(editTarget.value);
    setPixelEvent(editTarget.pixelEvent || '');
    setBgColor(editTarget.bgColor || '');
    setTextColor(editTarget.textColor || '');
  }, [editTarget.index, editTarget.value, editTarget.href, editTarget.pixelEvent]);

  const toYoutubeEmbed = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    return url;
  };

  const handleSave = () => {
    const styles = (bgColor || textColor) ? { bgColor: bgColor || undefined, textColor: textColor || undefined } : undefined;
    if (editTarget.type === 'video') onSave(toYoutubeEmbed(videoValue), undefined, undefined, styles);
    else if (editTarget.type === 'img') onSave(imgValue, undefined, undefined, styles);
    else if (editTarget.type === 'link') onSave(textValue, hrefValue, pixelEvent || undefined, styles);
    else onSave(textValue, undefined, undefined, styles);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-primary flex items-center gap-2">✏️ Edit Element</h3>
        <div className="text-sm text-muted-foreground">
          TAG: <span className="text-primary font-bold">{editTarget.tag}</span>
        </div>

        {editTarget.type === 'video' ? (
          <div className="space-y-3">
            <label className="text-sm font-semibold uppercase tracking-wide text-foreground">🎬 URL Video YouTube</label>
            <input type="text" value={videoValue} onChange={(e) => setVideoValue(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full rounded-lg bg-secondary text-foreground text-sm p-3 border border-border focus:outline-none focus:border-primary" />
            {videoValue && (
              <div className="rounded-lg overflow-hidden border border-border aspect-video">
                <iframe src={toYoutubeEmbed(videoValue)} className="w-full h-full" allowFullScreen title="Video preview" />
              </div>
            )}
          </div>
        ) : editTarget.type === 'img' ? (
          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wide text-foreground">URL Gambar</label>
            {(editTarget.imgWidth || editTarget.imgHeight) && (
              <span className="text-xs bg-secondary border border-border rounded px-2 py-1 text-muted-foreground font-mono">
                {editTarget.imgWidth} × {editTarget.imgHeight} px
              </span>
            )}
            <input type="text" value={imgValue} onChange={(e) => setImgValue(e.target.value)} placeholder="https://..." className="w-full rounded-lg bg-secondary text-foreground text-sm p-3 border border-border focus:outline-none focus:border-primary" />
            {imgValue && (
              <div className="rounded-lg overflow-hidden border border-border bg-secondary/40 flex items-center justify-center" style={{ minHeight: 80 }}>
                <img src={imgValue} alt="preview" className="max-h-32 object-contain rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
            <p className="text-xs text-muted-foreground">Gunakan format <strong>.webp</strong> untuk performa terbaik. Upload di <a href="https://uploadimgur.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">uploadimgur.com</a></p>
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
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground">🎯 Facebook Pixel Event</label>
              <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
                {FB_PIXEL_EVENTS.map((ev) => (
                  <button key={ev.value} type="button" onClick={() => setPixelEvent(ev.value)} className={`text-left px-3 py-2 rounded-lg text-sm border transition-all ${pixelEvent === ev.value ? 'bg-primary/15 border-primary text-primary font-semibold' : 'bg-secondary border-border text-foreground hover:border-primary/40'}`}>
                    {ev.label}
                  </button>
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

        {/* Color picker section */}
        <div className="border-t border-border pt-3 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-foreground">🎨 Warna (Opsional)</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase">Warna Teks</label>
              <div className="flex items-center gap-2">
                <input type="color" value={textColor || '#ffffff'} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0" />
                <span className="text-xs font-mono text-muted-foreground">{textColor || 'auto'}</span>
                {textColor && <button type="button" onClick={() => setTextColor('')} className="text-xs text-destructive">✕</button>}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase">Background</label>
              <div className="flex items-center gap-2">
                <input type="color" value={bgColor || '#1a1a2e'} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0" />
                <span className="text-xs font-mono text-muted-foreground">{bgColor || 'auto'}</span>
                {bgColor && <button type="button" onClick={() => setBgColor('')} className="text-xs text-destructive">✕</button>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-secondary text-foreground text-sm font-semibold hover:bg-muted transition-all">Batal</button>
          <button type="button" onClick={handleSave} className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2">💾 Simpan</button>
        </div>
      </div>
    </div>
  );
}
