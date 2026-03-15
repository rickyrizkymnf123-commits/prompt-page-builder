import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Save, Eye, X, GripVertical, Power, PowerOff, Layout } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

const buildThumbnailDoc = (rawHtml: string) => {
  const html = (rawHtml || "").trim();
  if (!html) return "";

  const guardStyle = "<style>html,body{margin:0!important;padding:0!important;overflow:hidden!important;max-width:100%!important;scrollbar-width:none!important}*{box-sizing:border-box}::-webkit-scrollbar{display:none!important}img,video,iframe,canvas,svg{max-width:100%!important}a,button,input,select,textarea,[role='button']{pointer-events:none!important}</style>";

  if (/<html[\s>]/i.test(html)) {
    if (/<head[\s>]/i.test(html)) {
      return html.replace(/<head([^>]*)>/i, `<head$1>${guardStyle}`);
    }
    return html.replace(/<html([^>]*)>/i, `<html$1><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">${guardStyle}</head>`);
  }

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${guardStyle}</head><body>${html}</body></html>`;
};

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

const DemoManagementTab = () => {
  const { toast } = useToast();
  const [demos, setDemos] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
    await supabase.from("demos").delete().eq("id", id);
    setDemos((prev) => prev.filter((d) => d.id !== id));
    toast({ title: "✅ Demo dihapus" });
  };

  const updateField = (id: string, field: keyof Demo, value: string | number | boolean) => {
    setDemos((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
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
          <p className="text-sm text-muted-foreground">{demos.length} demo terdaftar · thumbnail otomatis dari hero section HTML</p>
        </div>
        <Button onClick={addDemo} size="sm" className="gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Tambah
        </Button>
      </div>

      <div className="space-y-3">
        {demos.map((demo) => {
          const isExpanded = expandedId === demo.id;
          return (
            <Card key={demo.id} className={`transition-all ${isExpanded ? "ring-1 ring-primary/30" : ""}`}>
              <CardContent className="p-0">
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : demo.id)}
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                  <span className="text-xs text-muted-foreground font-mono w-6">#{demo.sort_order}</span>
                  {/* Auto-thumbnail from HTML */}
                  <div className="w-16 h-10 rounded border border-border bg-muted/30 shrink-0 overflow-hidden relative">
                    {demo.html_code ? (
                      <iframe
                        srcDoc={buildThumbnailDoc(demo.html_code)}
                        sandbox="allow-scripts"
                        className="absolute top-0 left-0 border-0 pointer-events-none"
                        style={{ width: "400%", height: "400%", transform: "scale(0.25)", transformOrigin: "top left", overflow: "hidden" }}
                        scrolling="no"
                        title="thumb"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[8px] text-muted-foreground">—</span>
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
