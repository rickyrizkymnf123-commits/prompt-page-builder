import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LogOut, Shield, CheckCircle, XCircle, Trash2, Clock, Users, FileText,
  RefreshCw, KeyRound, Search, UserCheck, UserX, Moon, Sun, Rocket, Zap, RotateCcw, Copy, ExternalLink, UserPlus, Layout,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "@/hooks/use-toast";
import { Step1Framework } from "@/components/steps/Step1Framework";
import { Step2Product } from "@/components/steps/Step2Product";
import { Step3Target } from "@/components/steps/Step3Target";
import { Step4Detail } from "@/components/steps/Step4Detail";
import { Step5Design } from "@/components/steps/Step5Design";
import { Step6Elements } from "@/components/steps/Step6Elements";
import { Step7Platform } from "@/components/steps/Step7Platform";
import { Step8Reference } from "@/components/steps/Step8Reference";
import { FormState, initialFormState, BonusItem } from "@/types/form";
import { StepSalesNotif } from "@/components/steps/StepSalesNotif";
import { StepCountdown } from "@/components/steps/StepCountdown";
import { generatePrompt } from "@/utils/generatePrompt";
import { HtmlPreviewEditor } from "@/components/editor/HtmlPreviewEditor";
import { sampleTemplates } from "@/data/sampleTemplates";

// --- Types ---
interface AdminUser {
  id: string; email: string; name: string | null; phone: string | null;
  status: string; entitlement_id: string | null; product_code: string | null;
  order_id: string | null; role: string; created_at: string; last_sign_in: string | null;
}
interface ProvisionLog {
  id: string; order_id: string | null; email: string | null;
  status: string; message: string | null; created_at: string;
}
interface DbTemplate {
  id: string; title: string; description: string | null; category: string | null;
  html_content: string; is_active: boolean; sort_order: number; created_at: string;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    active: { label: "Aktif", className: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30", icon: <CheckCircle className="h-3 w-3" /> },
    pending: { label: "Pending", className: "text-amber-500 bg-amber-500/10 border-amber-500/30", icon: <Clock className="h-3 w-3" /> },
    rejected: { label: "Ditolak", className: "text-destructive bg-destructive/10 border-destructive/30", icon: <XCircle className="h-3 w-3" /> },
    success: { label: "Success", className: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30", icon: <CheckCircle className="h-3 w-3" /> },
    error: { label: "Error", className: "text-destructive bg-destructive/10 border-destructive/30", icon: <XCircle className="h-3 w-3" /> },
  };
  const s = map[status] || { label: status, className: "text-muted-foreground bg-muted border-border", icon: null };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${s.className}`}>{s.icon}{s.label}</span>;
}

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [logs, setLogs] = useState<ProvisionLog[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [resetDialog, setResetDialog] = useState<{ open: boolean; userId: string; email: string }>({ open: false, userId: "", email: "" });
  const [newPassword, setNewPassword] = useState("");
  const [addMemberDialog, setAddMemberDialog] = useState(false);
  const [addMemberForm, setAddMemberForm] = useState({ email: '', password: '', name: '', role: 'user' });
  const [addMemberLoading, setAddMemberLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [form, setForm] = useState<FormState>({ ...initialFormState });
  const [promptText, setPromptText] = useState("");
  const [toolStep, setToolStep] = useState(1);
  const [isDirty, setIsDirty] = useState(false);

  // Templates state
  const [templates, setTemplates] = useState<DbTemplate[]>([]);
  const [tplDialog, setTplDialog] = useState(false);
  const [tplForm, setTplForm] = useState({ title: '', description: '', category: 'general', html_content: '', is_active: true, sort_order: 0 });
  const [editTplId, setEditTplId] = useState<string | null>(null);
  const [tplLoading, setTplLoading] = useState(false);

  const navigate = useNavigate();
  const { toast: showToast } = useToast();

  useEffect(() => { document.documentElement.classList.toggle("dark", darkMode); }, [darkMode]);

  const fetchUsers = async () => {
    const { data, error } = await supabase.functions.invoke("admin-users", { body: { action: "list" } });
    if (error || !data?.users) return;
    setUsers(data.users);
  };
  const fetchLogs = async () => {
    const { data } = await supabase.from("provision_logs").select("*").order("created_at", { ascending: false }).limit(100);
    setLogs((data as ProvisionLog[]) || []);
  };
  const fetchTemplates = async () => {
    const { data } = await supabase.from("lp_templates").select("*").order("sort_order", { ascending: true });
    setTemplates((data as DbTemplate[]) || []);
  };

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }
      const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).maybeSingle();
      if (roleData?.role !== "admin") { navigate("/app"); return; }
      setAuthorized(true);
      await Promise.all([fetchUsers(), fetchLogs(), fetchTemplates()]);
      setLoading(false);
    };
    check();
  }, [navigate]);

  const handleApprove = async (entitlementId: string) => {
    setActionLoading(entitlementId);
    await supabase.from("entitlements").update({ status: "active" }).eq("id", entitlementId);
    showToast({ title: "Berhasil", description: "User di-approve." });
    await fetchUsers(); setActionLoading(null);
  };
  const handleReject = async (entitlementId: string) => {
    setActionLoading(entitlementId);
    await supabase.from("entitlements").update({ status: "rejected" }).eq("id", entitlementId);
    showToast({ title: "Berhasil", description: "User ditolak." });
    await fetchUsers(); setActionLoading(null);
  };
  const handleDelete = async (userId: string) => {
    setActionLoading(userId);
    await supabase.from("entitlements").delete().eq("user_id", userId);
    showToast({ title: "Berhasil", description: "User dihapus." });
    await fetchUsers(); setActionLoading(null);
  };
  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) { showToast({ title: "Error", description: "Password minimal 6 karakter.", variant: "destructive" }); return; }
    setActionLoading(resetDialog.userId);
    const { error } = await supabase.functions.invoke("admin-users", { body: { action: "reset_password", user_id: resetDialog.userId, password: newPassword } });
    if (error) showToast({ title: "Gagal", description: error.message, variant: "destructive" });
    else showToast({ title: "Berhasil", description: `Password direset untuk ${resetDialog.email}` });
    setResetDialog({ open: false, userId: "", email: "" }); setNewPassword(""); setActionLoading(null);
  };
  const handleAddMember = async () => {
    if (!addMemberForm.email || !addMemberForm.password) { showToast({ title: "Error", description: "Email dan password wajib.", variant: "destructive" }); return; }
    if (addMemberForm.password.length < 6) { showToast({ title: "Error", description: "Password minimal 6 karakter.", variant: "destructive" }); return; }
    setAddMemberLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-users", { body: { action: "add_member", email: addMemberForm.email, password: addMemberForm.password, name: addMemberForm.name, role: addMemberForm.role } });
    if (error || data?.error) showToast({ title: "Gagal", description: data?.error || error?.message, variant: "destructive" });
    else { showToast({ title: "Berhasil", description: `Member ${addMemberForm.email} ditambahkan.` }); setAddMemberDialog(false); setAddMemberForm({ email: '', password: '', name: '', role: 'user' }); await fetchUsers(); }
    setAddMemberLoading(false);
  };

  // Template CRUD
  const handleSaveTemplate = async () => {
    if (!tplForm.title || !tplForm.html_content) { showToast({ title: "Error", description: "Title dan HTML wajib diisi.", variant: "destructive" }); return; }
    setTplLoading(true);
    if (editTplId) {
      await supabase.from("lp_templates").update({
        title: tplForm.title, description: tplForm.description, category: tplForm.category,
        html_content: tplForm.html_content, is_active: tplForm.is_active, sort_order: tplForm.sort_order,
      }).eq("id", editTplId);
      showToast({ title: "Template diupdate!" });
    } else {
      await supabase.from("lp_templates").insert({
        title: tplForm.title, description: tplForm.description, category: tplForm.category,
        html_content: tplForm.html_content, is_active: tplForm.is_active, sort_order: tplForm.sort_order,
      });
      showToast({ title: "Template ditambahkan!" });
    }
    setTplDialog(false); setEditTplId(null);
    setTplForm({ title: '', description: '', category: 'general', html_content: '', is_active: true, sort_order: 0 });
    await fetchTemplates();
    setTplLoading(false);
  };
  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Hapus template ini?')) return;
    await supabase.from("lp_templates").delete().eq("id", id);
    showToast({ title: "Template dihapus." });
    await fetchTemplates();
  };
  const handleEditTemplate = (tpl: DbTemplate) => {
    setEditTplId(tpl.id);
    setTplForm({ title: tpl.title, description: tpl.description || '', category: tpl.category || 'general', html_content: tpl.html_content, is_active: tpl.is_active, sort_order: tpl.sort_order });
    setTplDialog(true);
  };

  // Form handlers
  const handleChange = useCallback((field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (toolStep > 1) setIsDirty(true);
  }, [toolStep]);
  const handleSalesNotifChange = useCallback((config: import('@/types/form').SalesNotifConfig) => {
    setForm(prev => ({ ...prev, salesNotif: config }));
    if (toolStep > 1) setIsDirty(true);
  }, [toolStep]);
  const handleCountdownChange = useCallback((config: import('@/types/form').CountdownConfig) => {
    setForm(prev => ({ ...prev, countdown: config }));
    if (toolStep > 1) setIsDirty(true);
  }, [toolStep]);
  const handleToggleElement = useCallback((element: string) => {
    setForm(prev => ({ ...prev, elemenTambahan: { ...prev.elemenTambahan, [element]: !prev.elemenTambahan[element] } }));
    if (toolStep > 1) setIsDirty(true);
  }, [toolStep]);
  const handleChangeLayers = useCallback((layers: 3 | 4) => {
    setForm(prev => ({ ...prev, pricingLayers: layers }));
    if (toolStep > 1) setIsDirty(true);
  }, [toolStep]);
  const handleChangeBonusList = useCallback((list: BonusItem[]) => {
    setForm(prev => ({ ...prev, bonusList: list }));
    if (toolStep > 1) setIsDirty(true);
  }, [toolStep]);
  const handleGenerate = () => {
    const prompt = generatePrompt(form);
    setPromptText(prompt);
    setIsDirty(false);
    setToolStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleReset = () => { setForm({ ...initialFormState }); setPromptText(""); setToolStep(1); setIsDirty(false); };

  const filteredUsers = users.filter(u => {
    const matchSearch = !search || u.email?.toLowerCase().includes(search.toLowerCase()) || u.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || u.status === filterStatus;
    return matchSearch && matchStatus;
  });
  const pendingCount = users.filter(u => u.status === "pending").length;
  const activeCount = users.filter(u => u.status === "active").length;
  const rejectedCount = users.filter(u => u.status === "rejected").length;

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="flex items-center gap-3"><RefreshCw className="h-5 w-5 animate-spin text-primary" /><p className="text-muted-foreground">{authorized ? "Memuat data..." : "Memeriksa akses..."}</p></div></div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"><Rocket className="h-5 w-5 text-primary-foreground" /></div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-foreground">Landing Page <span className="text-primary">Builder V.10</span></h1>
            <span className="text-xs text-muted-foreground flex items-center gap-1">By Digital Strategi · <Shield className="h-3 w-3" /> Admin Panel</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>{darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</Button>
          <Button variant="ghost" size="icon" onClick={async () => { await supabase.auth.signOut(); navigate("/login"); }}><LogOut className="h-5 w-5" /></Button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-[1400px] mx-auto w-full">
        <Tabs defaultValue="tools">
          <TabsList className="mb-6">
            <TabsTrigger value="tools" className="gap-2"><Zap className="h-4 w-4" /> Tools</TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" /> Users
              {pendingCount > 0 && <span className="ml-1 bg-amber-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{pendingCount}</span>}
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2"><Layout className="h-4 w-4" /> Templates</TabsTrigger>
            <TabsTrigger value="logs" className="gap-2"><FileText className="h-4 w-4" /> Logs</TabsTrigger>
          </TabsList>

          {/* TOOLS TAB */}
          <TabsContent value="tools">
            {toolStep > 1 && (
              <div className="flex items-center justify-center py-4 mb-4">
                {[1,2,3].map(s => {
                  const done = s < toolStep; const active = s === toolStep;
                  return (
                    <div key={s} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${active ? 'bg-primary text-primary-foreground border-primary' : done ? 'bg-transparent text-green-400 border-green-500' : 'bg-transparent text-muted-foreground border-muted-foreground/30'}`}>
                        {done ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : s}
                      </div>
                      {s < 3 && <div className={`w-16 h-0.5 ${done ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />}
                    </div>
                  );
                })}
              </div>
            )}

            {toolStep === 1 && (
              <div className="space-y-4 pb-6 max-w-3xl">
                <Step1Framework framework={form.framework} gayaBahasa={form.gayaBahasa} onChange={handleChange} />
                <Step2Product tipeProduk={form.tipeProduk} tujuanUtama={form.tujuanUtama} onChange={handleChange} />
                <Step3Target levelAwareness={form.levelAwareness} targetAudience={form.targetAudience} onChange={handleChange} />
                <Step4Detail namaProduk={form.namaProduk} hargaNormal={form.hargaNormal} hargaPromo={form.hargaPromo} hargaFinal={form.hargaFinal} keteranganDiskon={form.keteranganDiskon} pricingLayers={form.pricingLayers} bonusList={form.bonusList} deskripsiBenefit={form.deskripsiBenefit} ctaUtama={form.ctaUtama} onChange={handleChange} onChangeLayers={handleChangeLayers} onChangeBonusList={handleChangeBonusList} />
                <Step5Design gayaDesain={form.gayaDesain} onChange={handleChange} />
                <Step6Elements elemenTambahan={form.elemenTambahan} onToggle={handleToggleElement} />
                <Step7Platform platformTarget={form.platformTarget} deviceTarget={form.deviceTarget} onChange={handleChange} />
                <Step8Reference linkReferensi={form.linkReferensi} inspirasiDesain={form.inspirasiDesain} onChange={handleChange} />
                <StepSalesNotif salesNotif={form.salesNotif} onChange={handleSalesNotifChange} />
                <StepCountdown countdown={form.countdown} onChange={handleCountdownChange} />
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={handleReset} className="gap-2"><RotateCcw className="h-4 w-4" /> Reset</Button>
                  <Button onClick={handleGenerate} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2" size="lg">
                    <Zap className="h-4 w-4" /> {isDirty ? "Generate Ulang" : "Generate Prompt ⚡"}
                  </Button>
                </div>
              </div>
            )}

            {toolStep === 2 && (
              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-center text-sm text-muted-foreground">Copy prompt lalu buka AI favorit kamu</p>
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-foreground">📋 Prompt</h2>
                    <Button variant="outline" size="sm" onClick={async () => { await navigator.clipboard.writeText(promptText); toast({ title: 'Disalin!' }); }} className="gap-2"><Copy className="h-4 w-4" /> Copy</Button>
                  </div>
                  <ScrollArea className="h-64"><pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed p-3 bg-secondary rounded-lg">{promptText}</pre></ScrollArea>
                </div>
                <Button onClick={async () => { try { await navigator.clipboard.writeText(promptText); } catch {} window.open('https://chat.z.ai/', '_blank'); toast({ title: '✅ Prompt disalin!' }); }} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2" size="lg"><ExternalLink className="h-4 w-4" /> Buat Landing Page</Button>
                <Button variant="outline" onClick={() => { setToolStep(3); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full gap-2" size="lg">Lanjut ke Preview →</Button>
                <Button variant="outline" onClick={() => setToolStep(1)} className="w-full">← Kembali</Button>
              </div>
            )}

            {toolStep === 3 && <HtmlPreviewEditor onBack={() => setToolStep(2)} />}
          </TabsContent>

          {/* TEMPLATES TAB */}
          <TabsContent value="templates" className="space-y-6">
            {/* DB Templates */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Layout className="h-5 w-5" /> Template Database ({templates.length})</CardTitle>
                <Button size="sm" onClick={() => { setEditTplId(null); setTplForm({ title: '', description: '', category: 'general', html_content: '', is_active: true, sort_order: 0 }); setTplDialog(true); }} className="gap-1">➕ Tambah Template</Button>
              </CardHeader>
              <CardContent>
                {templates.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Belum ada template di database.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Status</TableHead>
                        <TableHead>Order</TableHead><TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {templates.map(tpl => (
                        <TableRow key={tpl.id}>
                          <TableCell className="font-medium">{tpl.title}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{tpl.category}</TableCell>
                          <TableCell><StatusBadge status={tpl.is_active ? 'active' : 'rejected'} /></TableCell>
                          <TableCell className="text-sm">{tpl.sort_order}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button size="sm" variant="outline" onClick={() => handleEditTemplate(tpl)}>✏️</Button>
                              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteTemplate(tpl.id)}>🗑</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Sample Templates Gallery */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">📋 Template Bawaan ({sampleTemplates.length})</CardTitle>
                <Button size="sm" variant="outline" onClick={async () => {
                  const existingTitles = templates.map(t => t.title);
                  const toInsert = sampleTemplates.filter(s => !existingTitles.includes(s.title));
                  if (toInsert.length === 0) { showToast({ title: 'Semua template sudah ada di database.' }); return; }
                  for (let i = 0; i < toInsert.length; i++) {
                    await supabase.from("lp_templates").insert({
                      title: toInsert[i].title, description: toInsert[i].description, category: toInsert[i].category,
                      html_content: toInsert[i].html_content, is_active: true, sort_order: i + templates.length,
                    });
                  }
                  showToast({ title: `✅ ${toInsert.length} template ditambahkan ke database!` });
                  await fetchTemplates();
                }} className="gap-1">🚀 Push Semua ke Database</Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sampleTemplates.map(tpl => (
                    <div key={tpl.id} className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all group">
                      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                        <img src={tpl.thumbnail_url} alt={tpl.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button size="sm" variant="secondary" onClick={() => {
                            setEditTplId(null);
                            setTplForm({ title: tpl.title, description: tpl.description, category: tpl.category, html_content: tpl.html_content, is_active: true, sort_order: 0 });
                            setTplDialog(true);
                          }}>✏️ Edit & Simpan</Button>
                        </div>
                      </div>
                      <div className="p-3 space-y-1">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">{tpl.category}</span>
                        <h3 className="font-bold text-foreground text-sm">{tpl.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{tpl.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* USERS TAB */}
          <TabsContent value="users">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total User", count: users.length, icon: <Users className="h-8 w-8 text-primary" />, filter: "all" },
                { label: "Pending", count: pendingCount, icon: <Clock className="h-8 w-8 text-amber-500" />, filter: "pending" },
                { label: "Aktif", count: activeCount, icon: <UserCheck className="h-8 w-8 text-emerald-500" />, filter: "active" },
                { label: "Ditolak", count: rejectedCount, icon: <UserX className="h-8 w-8 text-destructive" />, filter: "rejected" },
              ].map(s => (
                <Card key={s.filter} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilterStatus(s.filter)}>
                  <CardContent className="p-4 flex items-center gap-3">{s.icon}<div><p className="text-2xl font-bold text-foreground">{s.count}</p><p className="text-xs text-muted-foreground">{s.label}</p></div></CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Daftar User ({filteredUsers.length})</CardTitle>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => setAddMemberDialog(true)}><UserPlus className="h-4 w-4" /> Add</Button>
                  <Button variant="outline" size="icon" onClick={() => { fetchUsers(); fetchLogs(); }}><RefreshCw className="h-4 w-4" /></Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {["all","pending","active","rejected"].map(s => (
                    <Button key={s} size="sm" variant={filterStatus===s?"default":"outline"} onClick={() => setFilterStatus(s)} className="text-xs capitalize">{s==="all"?"Semua":s}</Button>
                  ))}
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow><TableHead>Nama</TableHead><TableHead>Email</TableHead><TableHead>Status</TableHead><TableHead>Role</TableHead><TableHead>Terdaftar</TableHead><TableHead>Login</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Tidak ada data.</TableCell></TableRow>
                      : filteredUsers.map(u => (
                        <TableRow key={u.id} className={u.status==="pending"?"bg-amber-500/5":""}>
                          <TableCell className="font-medium">{u.name||"-"}</TableCell>
                          <TableCell className="text-sm">{u.email}</TableCell>
                          <TableCell><StatusBadge status={u.status} /></TableCell>
                          <TableCell><span className={`text-xs font-medium ${u.role==="admin"?"text-primary":"text-muted-foreground"}`}>{u.role}</span></TableCell>
                          <TableCell className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString("id-ID")}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{u.last_sign_in ? new Date(u.last_sign_in).toLocaleString("id-ID") : "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {u.status==="pending" && u.entitlement_id && (<><Button size="sm" variant="outline" className="gap-1 text-emerald-600 border-emerald-300" onClick={() => handleApprove(u.entitlement_id!)} disabled={actionLoading===u.entitlement_id}><CheckCircle className="h-3 w-3" /> ACC</Button><Button size="sm" variant="outline" className="gap-1 text-destructive border-destructive/30" onClick={() => handleReject(u.entitlement_id!)} disabled={actionLoading===u.entitlement_id}><XCircle className="h-3 w-3" /> Tolak</Button></>)}
                              {u.status==="rejected" && u.entitlement_id && <Button size="sm" variant="outline" className="gap-1 text-emerald-600 border-emerald-300" onClick={() => handleApprove(u.entitlement_id!)} disabled={actionLoading===u.entitlement_id}><CheckCircle className="h-3 w-3" /> ACC</Button>}
                              <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => setResetDialog({ open: true, userId: u.id, email: u.email })}><KeyRound className="h-3 w-3" /></Button>
                              {u.role!=="admin" && <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(u.id)} disabled={actionLoading===u.id}><Trash2 className="h-3 w-3" /></Button>}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LOGS TAB */}
          <TabsContent value="logs">
            <Card>
              <CardHeader><CardTitle>Provision Logs</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Order ID</TableHead><TableHead>Email</TableHead><TableHead>Status</TableHead><TableHead>Message</TableHead><TableHead>Tanggal</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {logs.length===0 ? <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Belum ada log.</TableCell></TableRow>
                    : logs.map(log => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs">{log.order_id||"-"}</TableCell>
                        <TableCell className="text-sm">{log.email||"-"}</TableCell>
                        <TableCell><StatusBadge status={log.status} /></TableCell>
                        <TableCell className="text-xs max-w-[300px] truncate">{log.message||"-"}</TableCell>
                        <TableCell className="text-xs">{new Date(log.created_at).toLocaleString("id-ID")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Reset Password Dialog */}
      <Dialog open={resetDialog.open} onOpenChange={(open) => { if (!open) setResetDialog({ open: false, userId: "", email: "" }); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reset Password</DialogTitle><DialogDescription>Reset password untuk {resetDialog.email}</DialogDescription></DialogHeader>
          <Input type="password" placeholder="Password baru (min. 6)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialog({ open: false, userId: "", email: "" })}>Batal</Button>
            <Button onClick={handleResetPassword} disabled={actionLoading===resetDialog.userId}>{actionLoading===resetDialog.userId ? "..." : "Reset"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={addMemberDialog} onOpenChange={setAddMemberDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5" /> Tambah Member</DialogTitle><DialogDescription>Tambahkan member baru secara manual.</DialogDescription></DialogHeader>
          <div className="space-y-3 py-2">
            <div><label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Nama</label><Input placeholder="Nama" value={addMemberForm.name} onChange={(e) => setAddMemberForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div><label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Email *</label><Input type="email" placeholder="email@contoh.com" value={addMemberForm.email} onChange={(e) => setAddMemberForm(p => ({ ...p, email: e.target.value }))} /></div>
            <div><label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Password *</label><Input type="password" placeholder="Min. 6 karakter" value={addMemberForm.password} onChange={(e) => setAddMemberForm(p => ({ ...p, password: e.target.value }))} /></div>
            <div><label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Role</label><div className="flex gap-2">{['user','admin'].map(r => <button key={r} type="button" onClick={() => setAddMemberForm(p => ({ ...p, role: r }))} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${addMemberForm.role===r?'bg-primary/10 text-primary border-primary':'bg-secondary text-muted-foreground border-border'}`}>{r==='admin'?'👑 Admin':'👤 User'}</button>)}</div></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddMemberDialog(false)}>Batal</Button>
            <Button onClick={handleAddMember} disabled={addMemberLoading}>{addMemberLoading ? "..." : "Tambah"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Dialog */}
      <Dialog open={tplDialog} onOpenChange={setTplDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editTplId ? '✏️ Edit Template' : '➕ Tambah Template'}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Title *</label><Input value={tplForm.title} onChange={(e) => setTplForm(p => ({ ...p, title: e.target.value }))} placeholder="Nama template..." /></div>
            <div><label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Description</label><Input value={tplForm.description} onChange={(e) => setTplForm(p => ({ ...p, description: e.target.value }))} placeholder="Deskripsi singkat..." /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Category</label><Input value={tplForm.category} onChange={(e) => setTplForm(p => ({ ...p, category: e.target.value }))} /></div>
              <div><label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Sort Order</label><Input type="number" value={tplForm.sort_order} onChange={(e) => setTplForm(p => ({ ...p, sort_order: Number(e.target.value) }))} /></div>
              <div><label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Status</label><div className="flex gap-2"><button type="button" onClick={() => setTplForm(p => ({ ...p, is_active: !p.is_active }))} className={`px-3 py-2 rounded-lg text-sm border transition-all ${tplForm.is_active?'bg-emerald-500/10 text-emerald-500 border-emerald-500/30':'bg-secondary text-muted-foreground border-border'}`}>{tplForm.is_active?'✅ Aktif':'❌ Nonaktif'}</button></div></div>
            </div>
            <div><label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">HTML Content *</label><Textarea value={tplForm.html_content} onChange={(e) => setTplForm(p => ({ ...p, html_content: e.target.value }))} placeholder="Paste kode HTML template..." className="min-h-[200px] font-mono text-xs" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTplDialog(false)}>Batal</Button>
            <Button onClick={handleSaveTemplate} disabled={tplLoading}>{tplLoading ? "..." : editTplId ? "Update" : "Simpan"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
