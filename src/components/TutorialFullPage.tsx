import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Play } from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string;
  sort_order: number;
}

function toEmbedUrl(url: string): string {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  return url;
}

export function TutorialFullPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('tutorials')
        .select('id, title, description, youtube_url, sort_order')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (data) setTutorials(data as Tutorial[]);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="text-center text-muted-foreground text-sm py-12">Memuat tutorial...</div>;
  if (tutorials.length === 0) return <div className="text-center text-muted-foreground text-sm py-12">Belum ada tutorial tersedia.</div>;

  const active = tutorials[activeIndex];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-bold text-lg md:text-xl mb-1 flex items-center gap-2">
          <Play className="w-5 h-5 text-primary" /> 📺 Tutorial Penggunaan
        </h2>
        <p className="text-sm text-muted-foreground">
          Tonton video panduan untuk memaksimalkan penggunaan tools ini.
          <span className="ml-2 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
            {tutorials.length} video
          </span>
        </p>
      </div>

      {/* Side-by-side layout: video left, list right */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Video Player */}
        <div className="flex-1 min-w-0">
          <div className="rounded-xl overflow-hidden border border-border bg-black aspect-video">
            <iframe
              src={toEmbedUrl(active.youtube_url)}
              className="w-full h-full border-0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title={active.title}
            />
          </div>
          <div className="mt-3">
            <h3 className="text-base font-semibold text-foreground">{active.title}</h3>
            {active.description && (
              <p className="text-sm text-muted-foreground mt-1">{active.description}</p>
            )}
          </div>
        </div>

        {/* Video List */}
        <div className="lg:w-[340px] xl:w-[380px] flex-shrink-0 rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Daftar Video</p>
          </div>
          <div className="divide-y divide-border max-h-[400px] lg:max-h-[480px] overflow-y-auto">
            {tutorials.map((t, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                    isActive ? 'bg-primary/10' : 'hover:bg-muted/30'
                  }`}
                >
                  <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5 ${
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {isActive ? '▶' : i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium leading-snug ${isActive ? 'text-primary' : 'text-foreground'}`}>
                      {t.title}
                    </p>
                    {t.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{t.description}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
