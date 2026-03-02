import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChevronDown, ChevronUp, Play } from 'lucide-react';

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

export function TutorialPanel() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [expanded, setExpanded] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('tutorials')
        .select('id, title, description, youtube_url, sort_order')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (data) setTutorials(data as Tutorial[]);
    };
    fetch();
  }, []);

  if (tutorials.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Play className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">📺 Tutorial Penggunaan</span>
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
            {tutorials.length} video
          </span>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="border-t border-border">
          {/* Active video player */}
          {activeVideo && (
            <div className="aspect-video bg-black">
              <iframe
                src={toEmbedUrl(activeVideo)}
                className="w-full h-full border-0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title="Tutorial video"
              />
            </div>
          )}

          {/* Video list */}
          <div className="divide-y divide-border">
            {tutorials.map((t, i) => {
              const isActive = activeVideo === t.youtube_url;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveVideo(isActive ? null : t.youtube_url)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                    isActive ? 'bg-primary/5' : 'hover:bg-muted/30'
                  }`}
                >
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 ${
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {isActive ? '▶' : i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${isActive ? 'text-primary' : 'text-foreground'}`}>
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
      )}
    </div>
  );
}
