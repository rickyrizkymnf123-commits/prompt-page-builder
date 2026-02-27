import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { sampleTemplates, LpTemplate } from '@/data/sampleTemplates';

interface Props {
  onSelectTemplate: (html: string) => void;
}

export function TemplateGallery({ onSelectTemplate }: Props) {
  const [templates, setTemplates] = useState<LpTemplate[]>(sampleTemplates);
  const [previewTemplate, setPreviewTemplate] = useState<LpTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDbTemplates = async () => {
      try {
        const { data } = await supabase
          .from('lp_templates')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        if (data && data.length > 0) {
          const dbTemplates: LpTemplate[] = data.map((t: any) => ({
            id: t.id,
            title: t.title,
            description: t.description || '',
            category: t.category || 'general',
            thumbnail_url: t.thumbnail_url || `https://placehold.co/400x300/0f0d1a/7C3AED?text=${encodeURIComponent(t.title)}`,
            html_content: t.html_content,
          }));
          setTemplates([...dbTemplates, ...sampleTemplates]);
        }
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetchDbTemplates();
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">📋 Pilih Template</h2>
        <p className="text-sm text-muted-foreground mt-1">Pilih template siap pakai lalu edit sesuai kebutuhan</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Memuat template...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(tpl => (
            <div key={tpl.id} className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all group">
              <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                <img src={tpl.thumbnail_url} alt={tpl.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setPreviewTemplate(tpl)}>👁 Preview</Button>
                  <Button size="sm" onClick={() => onSelectTemplate(tpl.html_content)}>✅ Gunakan</Button>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">{tpl.category}</span>
                </div>
                <h3 className="font-bold text-foreground text-sm">{tpl.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{tpl.description}</p>
                <Button size="sm" className="w-full mt-2" onClick={() => onSelectTemplate(tpl.html_content)}>
                  Gunakan Template →
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setPreviewTemplate(null); }}>
          <div className="bg-card rounded-2xl border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-bold text-foreground">{previewTemplate.title}</h3>
                <p className="text-xs text-muted-foreground">{previewTemplate.description}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => { onSelectTemplate(previewTemplate.html_content); setPreviewTemplate(null); }}>✅ Gunakan Template</Button>
                <Button size="sm" variant="outline" onClick={() => setPreviewTemplate(null)}>✕ Tutup</Button>
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
