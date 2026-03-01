import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { sampleTemplates, LpTemplate } from '@/data/sampleTemplates';
import { supabase } from '@/integrations/supabase/client';
import { Lock } from 'lucide-react';

interface Props {
  onSelectTemplate: (html: string) => void;
  isPaid?: boolean;
  orderUrl?: string;
}

export function TemplateGallery({ onSelectTemplate, isPaid = true, orderUrl }: Props) {
  const [previewTemplate, setPreviewTemplate] = useState<LpTemplate | null>(null);
  const [dbTemplates, setDbTemplates] = useState<LpTemplate[]>([]);
  const scrollRef = useRef<number>(0);

  // Fetch templates from database
  useEffect(() => {
    const fetchDbTemplates = async () => {
      try {
        const { data } = await supabase
          .from('lp_templates')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        if (data && data.length > 0) {
          const mapped: LpTemplate[] = data.map(t => ({
            id: t.id,
            title: t.title,
            description: t.description || '',
            category: t.category || 'Custom',
            thumbnail_url: t.thumbnail_url || '',
            html_content: t.html_content,
          }));
          setDbTemplates(mapped);
        }
      } catch {}
    };
    fetchDbTemplates();
  }, []);

  // Merge: DB templates first, then built-in
  const allTemplates = [...dbTemplates, ...sampleTemplates.filter(st => !dbTemplates.some(dt => dt.id === st.id))];

  const handleUpgrade = () => {
    if (orderUrl) window.open(orderUrl, '_blank');
  };

  const openPreview = (tpl: LpTemplate) => {
    scrollRef.current = window.scrollY;
    setPreviewTemplate(tpl);
  };

  const closePreview = () => {
    setPreviewTemplate(null);
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollRef.current, behavior: 'instant' as ScrollBehavior });
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">📋 Pilih Template</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {isPaid ? 'Pilih template siap pakai lalu edit sesuai kebutuhan' : '🔒 Upgrade ke versi berbayar untuk menggunakan template'}
        </p>
        {dbTemplates.length > 0 && (
          <p className="text-xs text-primary mt-1">✨ {dbTemplates.length} template custom tersedia</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allTemplates.map(tpl => (
          <div key={tpl.id} className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all group">
            <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
              <div className="w-full h-full overflow-hidden" style={{ pointerEvents: 'none' }}>
                <iframe
                  srcDoc={tpl.html_content}
                  className="w-[400%] h-[400%] border-0"
                  style={{ transform: 'scale(0.25)', transformOrigin: 'top left' }}
                  title={tpl.title}
                  sandbox=""
                  loading="lazy"
                />
              </div>
              <div
                className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-all flex items-end justify-center gap-2 pb-4 cursor-pointer"
                onClick={() => openPreview(tpl)}
              >
                <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); openPreview(tpl); }}>👁 Preview</Button>
                {isPaid ? (
                  <Button size="sm" onClick={(e) => { e.stopPropagation(); onSelectTemplate(tpl.html_content); }}>✅ Gunakan</Button>
                ) : (
                  <Button size="sm" onClick={(e) => { e.stopPropagation(); handleUpgrade(); }} className="gap-1"><Lock className="h-3 w-3" /> Premium</Button>
                )}
              </div>
            </div>
            <div className="p-4 space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">{tpl.category}</span>
              <h3 className="font-bold text-foreground text-sm">{tpl.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{tpl.description}</p>
              {isPaid ? (
                <Button size="sm" className="w-full mt-2" onClick={() => onSelectTemplate(tpl.html_content)}>
                  Gunakan Template →
                </Button>
              ) : (
                <Button size="sm" className="w-full mt-2" variant="outline" onClick={handleUpgrade}>
                  <Lock className="h-3 w-3 mr-1" /> Upgrade untuk Gunakan
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) closePreview(); }}>
          <div className="bg-card rounded-2xl border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-bold text-foreground">{previewTemplate.title}</h3>
                <p className="text-xs text-muted-foreground">{previewTemplate.description}</p>
              </div>
              <div className="flex gap-2">
                {isPaid ? (
                  <Button size="sm" onClick={() => { onSelectTemplate(previewTemplate.html_content); closePreview(); }}>✅ Gunakan Template</Button>
                ) : (
                  <Button size="sm" onClick={handleUpgrade} className="gap-1"><Lock className="h-3 w-3" /> Upgrade</Button>
                )}
                <Button size="sm" variant="outline" onClick={closePreview}>✕ Tutup</Button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe srcDoc={previewTemplate.html_content} className="w-full h-full" style={{ minHeight: '500px' }} title="Template Preview" sandbox="allow-scripts" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
