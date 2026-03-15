import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Save, Eye, X, GripVertical, Power, PowerOff, Layout, Upload, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Demo {
  id: string;
  title: string;
  description: string;
  type: string;
  thumbnail_url: string;
  html_code: string;
  sort_order: number;
  is_active: boolean;
}

const HtmlPreview = ({ html, onClose }: { html: string; onClose: () => void }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#0b0b18;">${html}</body></html>`);
    doc.close();
  }, [html]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="relative w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl bg-card" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            </div>
            <span className="text-xs text-muted-foreground">Live Preview</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
        <iframe ref={iframeRef} className="w-full border-0" style={{ height: "calc(90vh - 48px)" }} title="Preview" />
      </div>
    </div>
  );
};

const ACCEPTED_TYPES = ["image/webp", "image/jpeg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const DemoManagementTab = () => {
  const { toast } = useToast();
  const [demos, setDemos] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const normalizeDemo = (demo: any): Demo => ({
    ...demo,
    title: demo?.title || "",
    description: demo?.description || "",
    type: demo?.type || "",
    thumbnail_url: demo?.thumbnail_url || "",
    html_code: demo?.html_code || "",
    sort_order: demo?.sort_order || 0,
    is_active: typeof demo?.is_active === "boolean" ? demo.is_active : true,
  });

  const fetchDemos = async () => {
    const { data } = await supabase.from("demos").select("*").order("sort_order", { ascending: true });
    const normalized = ((data as any[]) || []).map(normalizeDemo);
    setDemos(normalized);
    setLoading(false);
  };

  useEffect(() => {
    fetchDemos();
  }, []);

  const addDemo = async () => {
    const { data, error } = await supabase
      .from("demos")
      .insert({
        title: "Demo Baru",
        description: "Deskripsi demo",
        type: "Kategori",
        sort_order: demos.length + 1,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    const normalizedDemo = normalizeDemo(data);
    setDemos((prev) => [...prev, normalizedDemo]);
    setExpandedId(normalizedDemo.id);
    toast({ title: "✅ Demo ditambahkan" });
  };

  const saveDemo = async (demo: Demo) => {
    const { error } = await supabase
      .from("demos")
      .update({
        title: demo.title,
        description: demo.description,
        type: demo.type,
        thumbnail_url: demo.thumbnail_url,
        html_code: demo.html_code,
        sort_order: demo.sort_order,
        is_active: demo.is_active,
      })
      .eq("id", demo.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "✅ Demo tersimpan" });
    fetchDemos();
  };

  const deleteDemo = async (id: string) => {
    if (!confirm("Hapus demo ini?")) return;
    // Also delete thumbnail from storage
    const demo = demos.find((d) => d.id === id);
    if (demo?.thumbnail_url) {
      const path = `demos/${id}`;
      await supabase.storage.from("lp-assets").remove([path]);
    }
    await supabase.from("demos").delete().eq("id", id);
    setDemos((prev) => prev.filter((d) => d.id !== id));
    toast({ title: "✅ Demo dihapus" });
  };

  const updateField = (id: string, field: keyof Demo, value: string | number | boolean) => {
    setDemos((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const uploadThumbnail = async (demoId: string, file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({ title: "Format tidak didukung", description: "Gunakan file WebP, JPG, atau PNG.", variant: "destructive" });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "File terlalu besar", description: "Maksimal 5MB.", variant: "destructive" });
      return;
    }

    setUploading(demoId);

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `demos/${demoId}.${ext}`;

    // Remove old file first (different extension maybe)
    const oldExts = ["webp", "jpg", "jpeg", "png"];
    const oldPaths = oldExts.map((e) => `demos/${demoId}.${e}`);
    await supabase.storage.from("lp-assets").remove(oldPaths);

    const { error } = await supabase.storage.from("lp-assets").upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

    if (error) {
      toast({ title: "Upload gagal", description: error.message, variant: "destructive" });
      setUploading(null);
      return;
    }

    const { data: urlData } = supabase.storage.from("lp-assets").getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl + "?t=" + Date.now();

    // Save to DB immediately
    await supabase.from("demos").update({ thumbnail_url: publicUrl }).eq("id", demoId);

    updateField(demoId, "thumbnail_url", publicUrl);
    setUploading(null);
    toast({ title: "✅ Thumbnail diupload" });
  };

  const removeThumbnail = async (demoId: string) => {
    const oldExts = ["webp", "jpg", "jpeg", "png"];
    const oldPaths = oldExts.map((e) => `demos/${demoId}.${e}`);
    await supabase.storage.from("lp-assets").remove(oldPaths);
    await supabase.from("demos").update({ thumbnail_url: "" }).eq("id", demoId);
    updateField(demoId, "thumbnail_url", "");
    toast({ title: "✅ Thumbnail dihapus" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg md:text-xl mb-1">Demo Landing Pages</h2>
          <p className="text-sm text-muted-foreground">{demos.length} demo terdaftar · upload thumbnail 16:9 (1280×720 recommended)</p>
        </div>
        <Button onClick={addDemo} size="sm" className="gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Tambah
        </Button>
      </div>

      <div className="space-y-3">
        {demos.map((demo) => {
          const isExpanded = expandedId === demo.id;
          const isUploading = uploading === demo.id;
          return (
            <Card key={demo.id} className={`transition-all ${isExpanded ? "ring-1 ring-primary/30" : ""}`}>
              <CardContent className="p-0">
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : demo.id)}
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                  <span className="text-xs text-muted-foreground font-mono w-6">#{demo.sort_order}</span>
                  {/* Thumbnail preview */}
                  <div className="w-16 h-10 rounded border border-border bg-muted/30 shrink-0 overflow-hidden relative">
                    {demo.thumbnail_url ? (
                      <img
                        src={demo.thumbnail_url}
                        alt={demo.title}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-3.5 h-3.5 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{demo.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{demo.type}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${demo.is_active ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
                      {demo.is_active ? "Aktif" : "Off"}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewHtml(demo.html_code || "<div style='padding:20px;color:#fff'>Belum ada HTML</div>");
                      }}
                    >
                      <Eye className="w-3.5 h-3.5 text-primary" />
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-border space-y-3">
                    {/* Thumbnail Upload */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Thumbnail (16:9 · 1280×720 · WebP/JPG/PNG · Max 5MB)</label>
                      <div className="flex gap-3 items-start">
                        <div className="w-40 aspect-video rounded-lg border border-border bg-muted/20 overflow-hidden shrink-0 relative">
                          {demo.thumbnail_url ? (
                            <img src={demo.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover object-top" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                              <ImageIcon className="w-6 h-6 text-muted-foreground/30" />
                              <span className="text-[10px] text-muted-foreground/50">Belum ada</span>
                            </div>
                          )}
                          {isUploading && (
                            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <input
                            ref={(el) => { fileInputRefs.current[demo.id] = el; }}
                            type="file"
                            accept=".webp,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) uploadThumbnail(demo.id, file);
                              e.target.value = "";
                            }}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 text-xs"
                            disabled={isUploading}
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRefs.current[demo.id]?.click();
                            }}
                          >
                            <Upload className="w-3 h-3" />
                            {demo.thumbnail_url ? "Ganti" : "Upload"}
                          </Button>
                          {demo.thumbnail_url && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="gap-1.5 text-xs text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeThumbnail(demo.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" /> Hapus
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Judul</label>
                        <Input value={demo.title} onChange={(e) => updateField(demo.id, "title", e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Kategori</label>
                        <Input value={demo.type} onChange={(e) => updateField(demo.id, "type", e.target.value)} />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Deskripsi</label>
                      <Textarea value={demo.description} onChange={(e) => updateField(demo.id, "description", e.target.value)} rows={2} />
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Kode HTML Demo</label>
                      <Textarea value={demo.html_code} onChange={(e) => updateField(demo.id, "html_code", e.target.value)} rows={4} className="font-mono text-xs" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Sort Order</label>
                        <Input
                          type="number"
                          value={demo.sort_order}
                          onChange={(e) => updateField(demo.id, "sort_order", parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                        <Button
                          variant={demo.is_active ? "default" : "outline"}
                          className="w-full gap-1.5"
                          size="sm"
                          onClick={() => updateField(demo.id, "is_active", !demo.is_active)}
                        >
                          {demo.is_active ? <Power className="w-3.5 h-3.5" /> : <PowerOff className="w-3.5 h-3.5" />}
                          {demo.is_active ? "Aktif" : "Nonaktif"}
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button onClick={() => saveDemo(demo)} size="sm" className="flex-1 gap-1.5">
                        <Save className="w-3.5 h-3.5" /> Simpan
                      </Button>
                      <Button onClick={() => deleteDemo(demo.id)} size="sm" variant="destructive" className="gap-1.5">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {demos.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Layout className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Belum ada demo. Klik "Tambah" untuk mulai.</p>
          </div>
        )}
      </div>

      {previewHtml && <HtmlPreview html={previewHtml} onClose={() => setPreviewHtml(null)} />}
    </div>
  );
};

export default DemoManagementTab;
