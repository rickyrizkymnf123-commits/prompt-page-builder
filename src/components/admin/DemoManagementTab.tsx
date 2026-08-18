import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Save, Eye, X, GripVertical, Power, PowerOff, Layout, Upload, ImageIcon, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { sampleTemplates } from "@/data/sampleTemplates";

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

const SortableDemoCard = ({ id, isExpanded, children }: { id: string; isExpanded: boolean; children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <Card ref={setNodeRef} style={style} className={`relative transition-all ${isExpanded ? "ring-1 ring-primary/30" : ""}`}>
      <div {...attributes} {...listeners} className="absolute left-2 top-3 cursor-grab active:cursor-grabbing z-10 p-1">
        <GripVertical className="w-4 h-4 text-muted-foreground/50" />
      </div>
      {children}
    </Card>
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
    thumbnail_url: (demo?.thumbnail_url && !demo.thumbnail_url.includes("placehold.co")) ? demo.thumbnail_url : "",
    html_code: demo?.html_code || "",
    sort_order: demo?.sort_order || 0,
    is_active: typeof demo?.is_active === "boolean" ? demo.is_active : true,
  });

  const getDefaultDemos = (): Demo[] => {
    return sampleTemplates.map((t, idx) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      type: t.category,
      thumbnail_url: "",
      html_code: t.html_content,
      sort_order: idx + 1,
      is_active: true,
    }));
  };

  const fetchDemos = async () => {
    let result: Demo[] = [];
    try {
      const { data, error } = await supabase.from("demos").select("*").order("sort_order", { ascending: true });
      if (!error && data && data.length > 0) {
        result = (data as any[]).map(normalizeDemo);
      }
    } catch {}

    if (result.length === 0) {
      const cached = localStorage.getItem("admin_demos");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            result = parsed.map(normalizeDemo);
          }
        } catch {}
      }
    }

    if (result.length === 0) {
      result = getDefaultDemos();
      try { localStorage.setItem("admin_demos", JSON.stringify(result)); } catch {}
    } else {
      try { localStorage.setItem("admin_demos", JSON.stringify(result)); } catch {}
    }

    setDemos(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchDemos();
  }, []);

  const handleResetDefaults = () => {
    const defaults = getDefaultDemos();
    setDemos(defaults);
    try { localStorage.setItem("admin_demos", JSON.stringify(defaults)); } catch {}
    toast({ title: "✅ 16 Template Demo Berhasil Dimuat!" });
  };

  const addDemo = async () => {
    const newId = `demo-${Date.now()}`;
    const newDemo: Demo = {
      id: newId,
      title: "Demo Baru",
      description: "Deskripsi demo",
      type: "Kategori",
      thumbnail_url: "",
      html_code: "<!DOCTYPE html><html><body style='margin:0;padding:24px;background:#0f0d1a;color:#fff;font-family:sans-serif;text-align:center;'><h1>Demo Landing Page</h1><p style='color:#a78bfa;'>Edit HTML ini untuk mengubah tampilan</p></body></html>",
      sort_order: demos.length + 1,
      is_active: true,
    };

    try {
      const { data, error } = await supabase
        .from("demos")
        .insert({
          title: newDemo.title,
          description: newDemo.description,
          type: newDemo.type,
          sort_order: newDemo.sort_order,
        })
        .select()
        .single();
      if (!error && data) {
        newDemo.id = data.id;
      }
    } catch {}

    const updated = [...demos, newDemo];
    setDemos(updated);
    try { localStorage.setItem("admin_demos", JSON.stringify(updated)); } catch {}
    setExpandedId(newDemo.id);
    toast({ title: "✅ Demo ditambahkan" });
  };

  const saveDemo = async (demo: Demo) => {
    try {
      await supabase
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
    } catch {}

    const updated = demos.map((d) => (d.id === demo.id ? demo : d));
    setDemos(updated);
    try { localStorage.setItem("admin_demos", JSON.stringify(updated)); } catch {}
    toast({ title: "✅ Demo tersimpan" });
  };

  const deleteDemo = async (id: string) => {
    if (!confirm("Hapus demo ini?")) return;
    try {
      const demo = demos.find((d) => d.id === id);
      if (demo?.thumbnail_url) {
        const path = `demos/${id}`;
        await supabase.storage.from("lp-assets").remove([path]);
      }
      await supabase.from("demos").delete().eq("id", id);
    } catch {}

    const updated = demos.filter((d) => d.id !== id);
    setDemos(updated);
    try { localStorage.setItem("admin_demos", JSON.stringify(updated)); } catch {}
    toast({ title: "✅ Demo dihapus" });
  };

  const updateField = (id: string, field: keyof Demo, value: string | number | boolean) => {
    const updated = demos.map((d) => (d.id === id ? { ...d, [field]: value } : d));
    setDemos(updated);
    try { localStorage.setItem("admin_demos", JSON.stringify(updated)); } catch {}
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = demos.findIndex((d) => d.id === active.id);
    const newIndex = demos.findIndex((d) => d.id === over.id);
    const reordered = arrayMove(demos, oldIndex, newIndex).map((d, i) => ({ ...d, sort_order: i + 1 }));
    setDemos(reordered);
    try { localStorage.setItem("admin_demos", JSON.stringify(reordered)); } catch {}
    try {
      await Promise.all(reordered.map((d) => supabase.from("demos").update({ sort_order: d.sort_order }).eq("id", d.id)));
    } catch {}
    toast({ title: "✅ Urutan disimpan" });
  };

  const uploadThumbnail = async (demoId: string, file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({ title: "Format tidak didukung", description: "Gunakan WebP, JPG, atau PNG.", variant: "destructive" });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "File terlalu besar", description: "Maksimal 5MB.", variant: "destructive" });
      return;
    }

    setUploading(demoId);

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `demos/${demoId}.${ext}`;

    const oldExts = ["webp", "jpg", "jpeg", "png"];
    const oldPaths = oldExts.map((e) => `demos/${demoId}.${e}`);
    try { await supabase.storage.from("lp-assets").remove(oldPaths); } catch {}

    try {
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

      await supabase.from("demos").update({ thumbnail_url: publicUrl }).eq("id", demoId);
      updateField(demoId, "thumbnail_url", publicUrl);
      toast({ title: "✅ Thumbnail berhasil diunggah" });
    } catch (err: any) {
      toast({ title: "Upload gagal", description: err.message, variant: "destructive" });
    } finally {
      setUploading(null);
    }
  };

  const removeThumbnail = async (demoId: string) => {
    const oldExts = ["webp", "jpg", "jpeg", "png"];
    const oldPaths = oldExts.map((e) => `demos/${demoId}.${e}`);
    try {
      await supabase.storage.from("lp-assets").remove(oldPaths);
      await supabase.from("demos").update({ thumbnail_url: "" }).eq("id", demoId);
    } catch {}
    updateField(demoId, "thumbnail_url", "");
    toast({ title: "✅ Kembali ke Live Web Preview" });
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
          <p className="text-sm text-muted-foreground">{demos.length} demo terdaftar · preview tampilan web otomatis aktif</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleResetDefaults} size="sm" variant="outline" className="gap-1.5 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Muat Template Bawaan (16)
          </Button>
          <Button onClick={addDemo} size="sm" className="gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Tambah
          </Button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={demos.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {demos.map((demo) => {
              const isExpanded = expandedId === demo.id;
              const isUploading = uploading === demo.id;
              const hasCustomThumb = !!(demo.thumbnail_url && !demo.thumbnail_url.includes("placehold.co"));
              return (
                <SortableDemoCard key={demo.id} id={demo.id} isExpanded={isExpanded}>
                  <CardContent className="p-0">
                    <div
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : demo.id)}
                    >
                      <span className="w-4 shrink-0" />
                      <span className="text-xs text-muted-foreground font-mono w-6">#{demo.sort_order}</span>
                      <div className="w-16 h-10 rounded border border-border bg-muted/30 shrink-0 overflow-hidden relative">
                        {hasCustomThumb ? (
                          <img
                            src={demo.thumbnail_url}
                            alt={demo.title}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : demo.html_code ? (
                          <div className="w-full h-full overflow-hidden pointer-events-none bg-background">
                            <iframe
                              srcDoc={demo.html_code}
                              className="w-[400%] h-[400%] border-0"
                              style={{ transform: "scale(0.25)", transformOrigin: "top left", pointerEvents: "none" }}
                              title={demo.title}
                              loading="lazy"
                            />
                          </div>
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
                      </div>
                    </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-border space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs text-muted-foreground">Preview Tampilan Depan (16:9)</label>
                        <span className="text-[10px] text-primary/80 font-medium">
                          {hasCustomThumb ? "🖼 Gambar Custom" : "✨ Live Web Preview Otomatis"}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 items-start">
                        <div className="w-full sm:w-64 aspect-video rounded-lg border border-border bg-muted/20 overflow-hidden shrink-0 relative group">
                          {hasCustomThumb ? (
                            <img src={demo.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover object-top" />
                          ) : demo.html_code ? (
                            <div className="w-full h-full overflow-hidden pointer-events-none bg-background">
                              <iframe
                                srcDoc={demo.html_code}
                                className="w-[300%] h-[300%] border-0"
                                style={{ transform: "scale(0.333)", transformOrigin: "top left", pointerEvents: "none" }}
                                title={demo.title}
                                loading="lazy"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                              <ImageIcon className="w-6 h-6 text-muted-foreground/30" />
                              <span className="text-[10px] text-muted-foreground/50">Belum ada preview</span>
                            </div>
                          )}
                          {isUploading && (
                            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap sm:flex-col gap-1.5 w-full sm:w-auto">
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
                            className="gap-1.5 text-xs flex-1 sm:flex-none"
                            disabled={isUploading}
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRefs.current[demo.id]?.click();
                            }}
                          >
                            <Upload className="w-3 h-3" />
                            Upload Gambar Custom
                          </Button>
                          {hasCustomThumb && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="gap-1.5 text-xs text-destructive hover:text-destructive flex-1 sm:flex-none"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeThumbnail(demo.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" /> Hapus (Pakai Live Web Preview)
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="secondary"
                            className="gap-1.5 text-xs flex-1 sm:flex-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewHtml(demo.html_code || "<div style='padding:20px;color:#fff'>Belum ada HTML</div>");
                            }}
                          >
                            <Eye className="w-3 h-3" /> Buka Full Preview
                          </Button>
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
                </SortableDemoCard>
              );
            })}

            {demos.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Layout className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Belum ada demo. Klik "Tambah" untuk mulai.</p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {previewHtml && <HtmlPreview html={previewHtml} onClose={() => setPreviewHtml(null)} />}
    </div>
  );
};

export default DemoManagementTab;
