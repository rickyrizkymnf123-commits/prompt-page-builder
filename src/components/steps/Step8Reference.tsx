import { useState } from 'react';
import { StepCard } from '@/components/StepCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MediaConfig } from '@/types/form';
import { Image, Video, Link, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  linkReferensi: string;
  inspirasiDesain: string;
  media?: MediaConfig;
  onChange: (field: string, value: string) => void;
  onChangeMedia?: (media: MediaConfig) => void;
}

export function Step8Reference({
  linkReferensi,
  inspirasiDesain,
  media = { fotoProdukUrls: [], videoHeroUrl: '', coverHeroUrl: '' },
  onChange,
  onChangeMedia,
}: Props) {
  const [photoInput, setPhotoInput] = useState('');

  const addPhoto = () => {
    if (!photoInput.trim() || !onChangeMedia) return;
    onChangeMedia({
      ...media,
      fotoProdukUrls: [...(media.fotoProdukUrls || []), photoInput.trim()],
    });
    setPhotoInput('');
  };

  const removePhoto = (index: number) => {
    if (!onChangeMedia) return;
    onChangeMedia({
      ...media,
      fotoProdukUrls: (media.fotoProdukUrls || []).filter((_, i) => i !== index),
    });
  };

  return (
    <StepCard step={8} title="Media Foto/Video & Link Referensi 🖼️">
      <div className="space-y-4">
        {/* 1. MEDIA FOTO & VIDEO SECTION */}
        <div className="space-y-3 p-3.5 rounded-xl bg-secondary/50 border border-border">
          <p className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
            <Image className="w-4 h-4 text-primary" />
            Media Foto Produk, Video Hero & Cover LP
          </p>

          {/* Cover Hero URL */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-foreground">
              URL Cover Banner / Header Hero (Opsional)
            </Label>
            <Input
              placeholder="https://domain.com/images/hero-cover.webp"
              value={media.coverHeroUrl}
              onChange={(e) => onChangeMedia && onChangeMedia({ ...media, coverHeroUrl: e.target.value })}
              className="bg-background text-xs"
            />
          </div>

          {/* Video Hero URL */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-foreground flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-red-500" />
              URL Video Hero / Video Penawaran (YouTube / Vimeo / Direct MP4)
            </Label>
            <Input
              placeholder="https://youtube.com/watch?v=... atau https://tiktok.com/..."
              value={media.videoHeroUrl}
              onChange={(e) => onChangeMedia && onChangeMedia({ ...media, videoHeroUrl: e.target.value })}
              className="bg-background text-xs"
            />
          </div>

          {/* Foto Produk List */}
          <div className="space-y-1.5 pt-1">
            <Label className="text-xs font-semibold text-foreground">
              URL Foto Produk / Galeri (Opsional)
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://domain.com/images/produk-1.webp"
                value={photoInput}
                onChange={(e) => setPhotoInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPhoto())}
                className="bg-background text-xs"
              />
              <Button type="button" size="sm" onClick={addPhoto} className="gap-1 text-xs px-3">
                <Plus className="w-3.5 h-3.5" /> Tambah
              </Button>
            </div>

            {media.fotoProdukUrls && media.fotoProdukUrls.length > 0 && (
              <div className="space-y-1 pt-1">
                {media.fotoProdukUrls.map((url, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-background border border-border text-xs">
                    <span className="truncate max-w-[85%] font-mono text-muted-foreground">{url}</span>
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="text-destructive hover:bg-destructive/10 p-1 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 2. LINK REFERENSI */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Link className="w-3.5 h-3.5 text-primary" />
            URL Landing Page Referensi (Opsional)
          </Label>
          <Input
            placeholder="https://contoh-landing-page.com"
            value={linkReferensi}
            onChange={(e) => onChange('linkReferensi', e.target.value)}
            className="bg-secondary text-xs sm:text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Apa yang Ingin Ditiru dari Referensi? (Opsional)
          </Label>
          <Textarea
            placeholder="Contoh: Saya suka layout hero-nya, headline to the point, dan cara menyusun perbandingan before-after..."
            value={inspirasiDesain}
            onChange={(e) => onChange('inspirasiDesain', e.target.value)}
            rows={2}
            className="bg-secondary text-xs sm:text-sm"
          />
        </div>
      </div>
    </StepCard>
  );
}
