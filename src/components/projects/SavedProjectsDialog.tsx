import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { FormState, SavedProject } from '@/types/form';
import { FolderOpen, Save, Trash2, Clock, Check, Plus, RefreshCw, Sparkles, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  currentForm: FormState;
  userId?: string;
  onLoadProject: (formData: FormState, projectName: string) => void;
}

export function SavedProjectsDialog({ currentForm, userId, onLoadProject }: Props) {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [projectNameInput, setProjectNameInput] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [mode, setMode] = useState<'list' | 'save_new'>('list');
  const { toast } = useToast();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      let query = supabase.from('saved_projects').select('*').order('updated_at', { ascending: false });
      if (userId) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query;
      if (!error && data) {
        setProjects(data as SavedProject[]);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchProjects();
      if (currentForm.namaProduk) {
        setProjectNameInput(currentForm.namaProduk);
      }
    }
  }, [open, userId]);

  const handleSaveNew = async () => {
    const name = projectNameInput.trim() || currentForm.namaProduk || 'Proyek Tanpa Nama';
    setSaveLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUid = userId || session?.user?.id;
      if (!currentUid) {
        toast({ title: 'Sesi habis', description: 'Silakan login kembali.', variant: 'destructive' });
        return;
      }

      const { data, error } = await supabase.from('saved_projects').insert({
        user_id: currentUid,
        project_name: name,
        form_data: currentForm as any,
      }).select().single();

      if (error) throw error;

      toast({ title: '✅ Proyek Berhasil Disimpan', description: `Proyek "${name}" siap digunakan kembali kapan saja.` });
      setProjectNameInput('');
      setMode('list');
      fetchProjects();
    } catch (err: any) {
      toast({ title: 'Gagal Menyimpan', description: err.message, variant: 'destructive' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleUpdateExisting = async (project: SavedProject) => {
    setSaveLoading(true);
    try {
      const { error } = await supabase.from('saved_projects').update({
        form_data: currentForm as any,
        updated_at: new Date().toISOString(),
      }).eq('id', project.id);

      if (error) throw error;

      toast({ title: '✅ Proyek Diperbarui', description: `Perubahan disimpan ke "${project.project_name}".` });
      fetchProjects();
    } catch (err: any) {
      toast({ title: 'Gagal Memperbarui', description: err.message, variant: 'destructive' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus proyek "${name}"?`)) return;
    try {
      await supabase.from('saved_projects').delete().eq('id', id);
      toast({ title: '🗑️ Proyek Dihapus' });
      fetchProjects();
    } catch (err: any) {
      toast({ title: 'Gagal Menghapus', description: err.message, variant: 'destructive' });
    }
  };

  const handleLoad = (p: SavedProject) => {
    if (p.form_data) {
      onLoadProject(p.form_data, p.project_name);
      toast({ title: '📂 Proyek Dibuka', description: `Form telah dimuat dengan data "${p.project_name}".` });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs sm:text-sm font-semibold bg-card hover:bg-secondary border-border">
          <FolderOpen className="w-4 h-4 text-primary" />
          <span className="hidden sm:inline">Proyek Tersimpan</span>
          <span className="sm:hidden">Proyek</span>
          {projects.length > 0 && (
            <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {projects.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-4 sm:p-6 bg-card border-border">
        <DialogHeader className="border-b border-border pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              Kelola Proyek Landing Page
            </DialogTitle>
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant={mode === 'save_new' ? 'default' : 'outline'}
                onClick={() => setMode(mode === 'save_new' ? 'list' : 'save_new')}
                className="text-xs h-7 gap-1"
              >
                {mode === 'save_new' ? 'Kembali ke Daftar' : <><Plus className="w-3.5 h-3.5" /> Simpan Form Ini</>}
              </Button>
              <Button size="sm" variant="ghost" onClick={fetchProjects} className="h-7 w-7 p-0">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Simpan produk yang sedang Anda custom ke database agar bisa dibuka dan dimodifikasi lagi kapan saja.
          </p>
        </DialogHeader>

        {mode === 'save_new' ? (
          <div className="space-y-4 py-4">
            <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/25 space-y-2">
              <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Simpan Form Saat Ini Sebagai Proyek Baru
              </p>
              <p className="text-xs text-muted-foreground">
                Semua data step (Framework, Target Audience, Detail Produk, Harga, Desain, Sales Notif, Scarcity) akan disimpan.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Nama Proyek / Produk</label>
              <Input
                placeholder="Contoh: Landing Page dBestReload Agen..."
                value={projectNameInput}
                onChange={(e) => setProjectNameInput(e.target.value)}
                className="bg-secondary"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setMode('list')}>Batal</Button>
              <Button size="sm" onClick={handleSaveNew} disabled={saveLoading} className="gap-1.5">
                <Save className="w-3.5 h-3.5" />
                {saveLoading ? 'Menyimpan...' : 'Simpan ke Database'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1">
            {loading ? (
              <div className="flex items-center justify-center py-12 gap-2 text-xs text-muted-foreground">
                <RefreshCw className="w-4 h-4 animate-spin text-primary" /> Memuat daftar proyek...
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12 space-y-3 bg-secondary/30 rounded-xl border border-dashed border-border/60">
                <FolderOpen className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Belum Ada Proyek Tersimpan</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                    Simpan produk landing page yang sedang Anda buat agar tidak hilang dan bisa dimodifikasi lagi nanti.
                  </p>
                </div>
                <Button size="sm" onClick={() => setMode('save_new')} className="gap-1.5 text-xs">
                  <Plus className="w-3.5 h-3.5" /> Simpan Form Ini Sekarang
                </Button>
              </div>
            ) : (
              projects.map((p) => {
                const fd = p.form_data || {} as any;
                return (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl bg-secondary/50 border border-border hover:border-primary/40 hover:bg-secondary/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-foreground truncate">{p.project_name}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                          {fd.platformTarget || 'Scalev'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(p.updated_at || p.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                        {fd.framework && <span>• {fd.framework.split(' ')[0]}</span>}
                        {fd.tipeProduk && <span>• {fd.tipeProduk}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleLoad(p)}
                        className="text-xs h-8 gap-1"
                      >
                        <FolderOpen className="w-3.5 h-3.5" /> Buka & Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        title="Perbarui proyek ini dengan data form saat ini"
                        onClick={() => handleUpdateExisting(p)}
                        className="text-xs h-8 px-2"
                      >
                        <Save className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(p.id, p.project_name)}
                        className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
