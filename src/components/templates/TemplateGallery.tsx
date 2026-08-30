import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { sampleTemplates, LpTemplate } from '@/data/sampleTemplates';
import { supabase } from '@/integrations/supabase/client';
import { Lock, Smartphone, Monitor, Sparkles, FolderOpen, Check } from 'lucide-react';

interface Props {
  onSelectTemplate: (html: string) => void;
  isPaid?: boolean;
  orderUrl?: string;
  userId?: string;
}

export function TemplateGallery({ onSelectTemplate, isPaid = true, orderUrl, userId }: Props) {
  const [previewTemplate, setPreviewTemplate] = useState<LpTemplate | null>(null);
  const [dbTemplates, setDbTemplates] = useState<LpTemplate[]>([]);
  const [userTemplates, setUserTemplates] = useState<LpTemplate[]>([]);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const scrollRef = useRef<number>(0);

  // Fetch templates from database
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // 1. Admin / Global DB templates
        const { data: globalData } = await supabase
          .from('lp_templates')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (globalData && globalData.length > 0) {
          const mapped: LpTemplate[] = globalData.map(t => ({
            id: t.id,
            title: t.title,
            description: t.description || '',
            category: t.category || 'Custom',
            thumbnail_url: t.thumbnail_url || '',
            html_content: t.html_content,
          }));
          setDbTemplates(mapped);
        }

        // 2. Custom User Templates
        if (userId) {
          const { data: userTpls } = await supabase
            .from('custom_user_templates')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

          if (userTpls && userTpls.length > 0) {
            const mappedUser: LpTemplate[] = userTpls.map(t => ({
              id: t.id,
              title: `⭐ ${t.title}`,
              description: t.description || 'Template Kustom Akun Anda',
              category: 'Template Saya',
              thumbnail_url: '',
              html_content: t.html_content,
            }));
            setUserTemplates(mappedUser);
          }
        }
      } catch {}
    };
    fetchTemplates();
  }, [userId]);

  // Merge: User templates, DB templates, then built-in
  const allTemplates = [
    ...userTemplates,
    ...dbTemplates,
    ...sampleTemplates.filter(st => !dbTemplates.some(dt => dt.id === st.id)),
  ];

  const categories = ['Semua', ...Array.from(new Set(allTemplates.map(t => t.category)))];

  const filteredTemplates = selectedCategory === 'Semua'
    ? allTemplates
    : allTemplates.filter(t => t.category === selectedCategory);

  const handleUpgrade = () => {
    if (orderUrl) window.open(orderUrl, '_blank');
  };

  const openPreview = (tpl: LpTemplate) => {
    scrollRef.current = window.scrollY;
    setPreviewTemplate(tpl);
    // On mobile screens, default to mobile view
    if (window.innerWidth < 640) {
      setPreviewDevice('mobile');
    }
  };

  const closePreview = () => {
    setPreviewTemplate(null);
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollRef.current, behavior: 'instant' as ScrollBehavior });
    });
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-foreground flex items-center justify-center gap-2">
          📋 Galeri Template Siap Pakai
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
          {isPaid
            ? 'Pilih template conversion-tested, lalu sesuaikan konten dan gambar sesuai produk Anda.'
            : '🔒 Upgrade ke versi berbayar untuk menggunakan template.'}
        </p>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-secondary/60 text-muted-foreground border-border hover:text-foreground hover:bg-secondary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredTemplates.map(tpl => (
          <div
            key={tpl.id}
            className="rounded-2xl border border-border bg-card/90 overflow-hidden hover:border-primary/50 transition-all flex flex-col shadow-sm group"
          >
            {/* Thumbnail Box */}
            <div
              className="relative aspect-[16/10] overflow-hidden bg-secondary/80 flex items-center justify-center cursor-pointer border-b border-border/50"
              onClick={() => openPreview(tpl)}
            >
              <div className="w-full h-full p-2 flex flex-col items-center justify-center text-center space-y-1.5 select-none">
                <span className="text-2xl">🚀</span>
                <p className="font-extrabold text-xs sm:text-sm text-foreground px-4 line-clamp-1">
                  {tpl.title}
                </p>
                <span className="text-[10px] text-muted-foreground bg-background/80 px-2 py-0.5 rounded-full border border-border">
                  Klik untuk preview live
                </span>
              </div>

              {/* Hover Overlay Buttons */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2 p-4">
                <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); openPreview(tpl); }} className="text-xs font-semibold h-8 shadow">
                  👁 Preview
                </Button>
                {isPaid ? (
                  <Button size="sm" onClick={(e) => { e.stopPropagation(); onSelectTemplate(tpl.html_content); }} className="text-xs font-bold h-8 shadow bg-primary text-primary-foreground">
                    ✏️ Gunakan & Edit
                  </Button>
                ) : (
                  <Button size="sm" onClick={(e) => { e.stopPropagation(); handleUpgrade(); }} className="text-xs font-semibold h-8 gap-1 shadow">
                    <Lock className="h-3 w-3" /> Premium
                  </Button>
                )}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {tpl.category}
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-xs sm:text-sm line-clamp-1">{tpl.title}</h3>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{tpl.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs font-semibold h-8"
                  onClick={() => openPreview(tpl)}
                >
                  👁 Preview
                </Button>
                {isPaid ? (
                  <Button
                    size="sm"
                    className="w-full text-xs font-bold h-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => onSelectTemplate(tpl.html_content)}
                  >
                    ✏️ Edit Template
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="w-full text-xs font-bold h-8"
                    variant="outline"
                    onClick={handleUpgrade}
                  >
                    <Lock className="h-3 w-3 mr-1" /> Upgrade
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile-Friendly Live Preview Modal */}
      {previewTemplate && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) closePreview(); }}
        >
          <div className="bg-card w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] sm:max-w-5xl rounded-none sm:rounded-2xl border border-border overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header Toolbar */}
            <div className="p-3 sm:p-4 border-b border-border flex items-center justify-between gap-2 bg-secondary/40 flex-shrink-0 flex-wrap">
              <div className="min-w-0">
                <h3 className="font-bold text-foreground text-xs sm:text-base truncate">{previewTemplate.title}</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{previewTemplate.category}</p>
              </div>

              {/* Device Preview Switcher */}
              <div className="flex items-center gap-1 bg-background p-1 rounded-xl border border-border flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    previewDevice === 'mobile' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">HP (375px)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    previewDevice === 'desktop' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {isPaid ? (
                  <Button
                    size="sm"
                    onClick={() => { onSelectTemplate(previewTemplate.html_content); closePreview(); }}
                    className="text-xs font-bold h-8 bg-primary text-primary-foreground gap-1"
                  >
                    ✏️ Gunakan & Edit Template
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleUpgrade} className="gap-1 text-xs font-bold h-8">
                    <Lock className="h-3 w-3" /> Upgrade
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={closePreview} className="h-8 px-2.5 text-xs">
                  ✕
                </Button>
              </div>
            </div>

            {/* Iframe Preview Container */}
            <div className="flex-1 bg-slate-950 overflow-hidden flex items-center justify-center p-2 sm:p-4">
              <div
                className={`h-full transition-all duration-300 rounded-xl overflow-hidden border border-border shadow-2xl bg-white ${
                  previewDevice === 'mobile' ? 'w-[375px] max-w-full' : 'w-full'
                }`}
              >
                <iframe
                  srcDoc={previewTemplate.html_content}
                  className="w-full h-full border-0"
                  title="Template Preview Frame"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
