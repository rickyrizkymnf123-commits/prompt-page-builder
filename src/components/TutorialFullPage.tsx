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
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('tutorials')
        .select('id, title, description, youtube_url, sort_order')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (data) {
        const items = data as Tutorial[];
        setTutorials(items);
        if (items.length > 0) setActiveVideo(items[0].youtube_url);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="text-center text-muted-foreground text-sm py-12">Memuat tutorial...</div>;
  if (tutorials.length === 0) return <div className="text-center text-muted-foreground text-sm py-12">Belum ada tutorial tersedia.</div>;

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

      {/* Video Player */}
      {activeVideo && (
        <div className="rounded-xl overflow-hidden border border-border bg-black aspect-video">
          <iframe
            src={toEmbedUrl(activeVideo)}
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title="Tutorial video"
          />
        </div>
      )}

      {/* Video List */}
      <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border">
        {tutorials.map((t, i) => {
          const isActive = activeVideo === t.youtube_url;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveVideo(t.youtube_url)}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                isActive ? 'bg-primary/5' : 'hover:bg-muted/30'
              }`}
            >
              <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}>
                {isActive ? '▶' : i + 1}
              </span>
              <div className="min-w-0">
                <p className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-foreground'}`}>
                  {t.title}
                </p>
                {t.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
