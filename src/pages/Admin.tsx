import React, { useEffect, useState, useCallback, useRef } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  LogOut, Shield, CheckCircle, XCircle, Trash2, Clock, Users, FileText,
  RefreshCw, KeyRound, Search, UserCheck, UserX, Moon, Sun, Rocket, Zap, RotateCcw, Copy, ExternalLink, UserPlus, Layout, Settings, Lock, Eye, EyeOff,
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
import { motion } from "framer-motion";
import { TypewriterText } from "@/components/TypewriterText";

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
function AdminGeneratingLoader() {
  const steps = [
    { icon: '🔍', text: 'Menganalisis profil produk...' },
    { icon: '✍️', text: 'Menyusun framework copywriting...' },
    { icon: '🎨', text: 'Menerapkan gaya desain...' },
    { icon: '🧱', text: 'Membangun struktur section...' },
    { icon: '⚡', text: 'Finalisasi prompt...' },
  ];
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="max-w-md mx-auto p-6 flex flex-col items-center justify-center min-h-[40vh]">
      <motion.div className="relative w-20 h-20 mb-8" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
        <div className="absolute inset-0 rounded-full border-4 border-muted" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary" />
      </motion.div>
      <div className="space-y-3 w-full">
        {steps.map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: i <= activeStep ? 1 : 0.3, x: i <= activeStep ? 0 : -20 }} transition={{ duration: 0.4, delay: i * 0.1 }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${i === activeStep ? 'bg-primary/10 border border-primary/30' : i < activeStep ? 'bg-muted/30' : ''}`}>
            <span className="text-lg">{i < activeStep ? '✅' : step.icon}</span>
            <span className={`text-sm font-medium ${i === activeStep ? 'text-primary' : i < activeStep ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>{step.text}</span>
            {i === activeStep && <motion.div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />}
          </motion.div>
        ))}
      </div>
      <motion.p className="mt-8 text-xs text-muted-foreground text-center" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
        Generating prompt berkualitas tinggi...
      </motion.p>
    </div>
  );
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
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [addMemberDialog, setAddMemberDialog] = useState(false);
  const [addMemberForm, setAddMemberForm] = useState({ email: '', password: '', name: '', role: 'user' });
  const [showAddMemberPassword, setShowAddMemberPassword] = useState(false);
  const [addMemberLoading, setAddMemberLoading] = useState(false);
  const [addMemberTier, setAddMemberTier] = useState<'free' | 'paid'>('free');
  const [darkMode, setDarkMode] = useState(true);
  const [form, setForm] = useState<FormState>({ ...initialFormState });
  const [promptText, setPromptText] = useState("");
  const [toolStep, setToolStep] = useState(1);
  const [isDirty, setIsDirty] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  // Bulk selection
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [bulkDialog, setBulkDialog] = useState<{ open: boolean; action: string }>({ open: false, action: '' });
  const [bulkPassword, setBulkPassword] = useState('');
  const [showBulkPassword, setShowBulkPassword] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Templates state
  const [templates, setTemplates] = useState<DbTemplate[]>([]);
  const [tplDialog, setTplDialog] = useState(false);
  const [tplForm, setTplForm] = useState({ title: '', description: '', category: 'general', html_content: '', is_active: true, sort_order: 0 });
  const [editTplId, setEditTplId] = useState<string | null>(null);
  const [tplLoading, setTplLoading] = useState(false);
  const [previewTplHtml, setPreviewTplHtml] = useState<string | null>(null);
  const [previewTplTitle, setPreviewTplTitle] = useState('');
  const adminScrollRef = useRef<number>(0);

  // Settings state
  const [orderUrl, setOrderUrl] = useState('');

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
  const fetchSettings = async () => {
    try {
      const { data } = await (supabase as any).from('app_settings').select('*');
      if (data) {
        const s = (data as any[]).find((r: any) => r.key === 'scalev_order_url');
        if (s) setOrderUrl(s.value || '');
      }
    } catch {}
  };

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }
      const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).maybeSingle();
      if (roleData?.role !== "admin") { navigate("/app"); return; }
      setAuthorized(true);
      await Promise.all([fetchUsers(), fetchLogs(), fetchTemplates(), fetchSettings()]);
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
    setResetDialog({ open: false, userId: "", email: "" }); setNewPassword(""); setShowNewPassword(false); setActionLoading(null);
  };
  const handleChangeTier = async (userId: string, newTier: 'free' | 'paid') => {
    setActionLoading(userId);
    await supabase.functions.invoke("admin-users", { body: { action: "change_tier", user_id: userId, role: newTier } });
    showToast({ title: `Tier diubah ke ${newTier === 'paid' ? 'Berbayar' : 'Gratis'}` });
    await fetchUsers(); setActionLoading(null);
  };
  const handleAddMember = async () => {
    if (!addMemberForm.email || !addMemberForm.password) { showToast({ title: "Error", description: "Email dan password wajib.", variant: "destructive" }); return; }
    if (addMemberForm.password.length < 6) { showToast({ title: "Error", description: "Password minimal 6 karakter.", variant: "destructive" }); return; }
    setAddMemberLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-users", { body: { action: "add_member", email: addMemberForm.email, password: addMemberForm.password, name: addMemberForm.name, role: addMemberForm.role, tier: addMemberTier } });
    if (error || data?.error) showToast({ title: "Gagal", description: data?.error || error?.message, variant: "destructive" });
    else { showToast({ title: "Berhasil", description: `Member ${addMemberForm.email} ditambahkan.` }); setAddMemberDialog(false); setAddMemberForm({ email: '', password: '', name: '', role: 'user' }); setAddMemberTier('free'); await fetchUsers(); }
    setAddMemberLoading(false);
  };

  // Bulk actions
  const toggleSelectUser = (userId: string) => {
    setSelectedUsers(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };
  const toggleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.filter(u => u.role !== 'admin').length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.filter(u => u.role !== 'admin').map(u => u.id)));
    }
  };
  const handleBulkAction = async () => {
    if (selectedUsers.size === 0) return;
    setBulkLoading(true);
    const ids = Array.from(selectedUsers);

    if (bulkDialog.action === 'tier_paid' || bulkDialog.action === 'tier_free') {
      const tier = bulkDialog.action === 'tier_paid' ? 'paid' : 'free';
      for (const uid of ids) {
        await supabase.functions.invoke("admin-users", { body: { action: "change_tier", user_id: uid, role: tier } });
      }
      showToast({ title: `✅ ${ids.length} user diubah ke ${tier === 'paid' ? 'Berbayar' : 'Gratis'}` });
    } else if (bulkDialog.action === 'reset_password') {
      if (!bulkPassword || bulkPassword.length < 6) { showToast({ title: "Error", description: "Password minimal 6 karakter.", variant: "destructive" }); setBulkLoading(false); return; }
      for (const uid of ids) {
        await supabase.functions.invoke("admin-users", { body: { action: "reset_password", user_id: uid, password: bulkPassword } });
      }
      showToast({ title: `✅ Password ${ids.length} user direset` });
    } else if (bulkDialog.action === 'delete') {
      for (const uid of ids) {
        await supabase.from("entitlements").delete().eq("user_id", uid);
      }
      showToast({ title: `✅ ${ids.length} user dihapus` });
    }

    setBulkLoading(false);
    setBulkDialog({ open: false, action: '' });
    setBulkPassword('');
    setSelectedUsers(new Set());
    await fetchUsers();
  };

  // Template CRUD
  const handleSaveTemplate = async () => {
    if (!tplForm.title || !tplForm.html_content) { showToast({ title: "Error", description: "Title dan HTML wajib diisi.", variant: "destructive" }); return; }
    setTplLoading(true);
    if (editTplId) {
      await supabase.from("lp_templates").update({ title: tplForm.title, description: tplForm.description, category: tplForm.category, html_content: tplForm.html_content, is_active: tplForm.is_active, sort_order: tplForm.sort_order }).eq("id", editTplId);
      showToast({ title: "Template diupdate!" });
    } else {
      await supabase.from("lp_templates").insert({ title: tplForm.title, description: tplForm.description, category: tplForm.category, html_content: tplForm.html_content, is_active: tplForm.is_active, sort_order: tplForm.sort_order });
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
  const handleChangeBonusList = useCallback((list: BonusItem[]) => {
    setForm(prev => ({ ...prev, bonusList: list }));
    if (toolStep > 1) setIsDirty(true);
  }, [toolStep]);
  const handleGenerate = () => {
    setIsGenerating(true);
    setToolStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const prompt = generatePrompt(form);
      setPromptText(prompt);
      setIsDirty(false);
      setIsGenerating(false);
    }, 3000);
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
      <header className="sticky top-0 z-50 border-b border-border bg-card px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0"><Rocket className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" /></div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-sm sm:text-xl font-bold text-foreground truncate">LP <span className="text-primary">Builder</span> <span className="hidden sm:inline">V.11</span></h1>
            <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1"><Shield className="h-3 w-3" /> Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => setDarkMode(!darkMode)}>{darkMode ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}</Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={async () => { await supabase.auth.signOut(); navigate("/login"); }}><LogOut className="h-4 w-4 sm:h-5 sm:w-5" /></Button>
        </div>
      </header>

      <main className="flex-1 px-3 py-4 sm:p-6 max-w-[1400px] mx-auto w-full">
        <Tabs defaultValue="tools">
          <TabsList className="sticky top-[49px] sm:top-[57px] z-40 mb-4 sm:mb-6 bg-card/95 backdrop-blur w-full overflow-x-auto flex justify-start">
            <TabsTrigger value="tools" className="gap-1 sm:gap-2 text-xs sm:text-sm"><Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> <span className="hidden xs:inline">Tools</span><span className="xs:hidden">⚡</span></TabsTrigger>
            <TabsTrigger value="users" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Users</span>
              {pendingCount > 0 && <span className="ml-0.5 bg-amber-500 text-white text-[9px] sm:text-[10px] font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">{pendingCount}</span>}
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-1 sm:gap-2 text-xs sm:text-sm"><Layout className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Templates</span></TabsTrigger>
            <TabsTrigger value="logs" className="gap-1 sm:gap-2 text-xs sm:text-sm"><FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Logs</span></TabsTrigger>
            <TabsTrigger value="settings" className="gap-1 sm:gap-2 text-xs sm:text-sm"><Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Settings</span></TabsTrigger>
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
                <Step4Detail namaProduk={form.namaProduk} hargaNormal={form.hargaNormal} hargaPromo={form.hargaPromo} hargaFinal={form.hargaFinal} keteranganDiskon={form.keteranganDiskon} bonusList={form.bonusList} deskripsiBenefit={form.deskripsiBenefit} ctaUtama={form.ctaUtama} onChange={handleChange} onChangeBonusList={handleChangeBonusList} />
                <Step5Design warnaBrand={form.warnaBrand} tema={form.tema} gayaDesain={form.gayaDesain} onChange={handleChange} />
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

            {toolStep === 2 && isGenerating && <AdminGeneratingLoader />}

            {toolStep === 2 && !isGenerating && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
                <p className="text-center text-xs sm:text-sm text-muted-foreground">Copy prompt lalu buka AI favorit kamu</p>
                <div className="rounded-xl border border-border bg-card p-3 sm:p-5">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h2 className="text-sm sm:text-base font-semibold text-foreground">📋 Prompt</h2>
                    <Button variant="outline" size="sm" onClick={async () => { await navigator.clipboard.writeText(promptText); toast({ title: 'Disalin!' }); }} className="gap-1.5 text-xs sm:text-sm"><Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Copy</Button>
                  </div>
                  <ScrollArea className="h-48 sm:h-64"><pre className="text-xs sm:text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed p-2 sm:p-3 bg-secondary rounded-lg"><TypewriterText text={promptText} /></pre></ScrollArea>
                </div>
                <Button onClick={async () => { try { await navigator.clipboard.writeText(promptText); } catch {} window.open('https://chat.z.ai/', '_blank'); toast({ title: '✅ Prompt disalin!' }); }} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2 text-sm" size="lg"><ExternalLink className="h-4 w-4" /> Buat Landing Page</Button>
                <Button variant="outline" onClick={() => { setToolStep(3); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full gap-2 text-sm" size="lg">Lanjut ke Preview →</Button>
                <Button variant="outline" onClick={() => setToolStep(1)} className="w-full text-sm">← Kembali</Button>
              </motion.div>
            )}

            {toolStep === 3 && <HtmlPreviewEditor onBack={() => setToolStep(2)} isPaid={true} />}
          </TabsContent>

          {/* TEMPLATES TAB */}
          <TabsContent value="templates" className="space-y-6">
            {previewTplHtml !== null ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => { setPreviewTplHtml(null); requestAnimationFrame(() => { window.scrollTo({ top: adminScrollRef.current, behavior: 'instant' as ScrollBehavior }); }); }}>← Kembali ke Daftar Template</Button>
                  <span className="text-sm font-semibold text-foreground">{previewTplTitle}</span>
                </div>
                <HtmlPreviewEditor onBack={() => { setPreviewTplHtml(null); requestAnimationFrame(() => { window.scrollTo({ top: adminScrollRef.current, behavior: 'instant' as ScrollBehavior }); }); }} initialHtml={previewTplHtml} isPaid={true} />
              </div>
            ) : (
              <>
                <Card>
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-sm sm:text-base"><Layout className="h-4 w-4 sm:h-5 sm:w-5" /> Template DB ({templates.length})</CardTitle>
                    <Button size="sm" onClick={() => { setEditTplId(null); setTplForm({ title: '', description: '', category: 'general', html_content: '', is_active: true, sort_order: 0 }); setTplDialog(true); }} className="gap-1 text-xs sm:text-sm w-full sm:w-auto">➕ Tambah</Button>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 pt-0">
                    {templates.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">Belum ada template di database.</p>
                    ) : (
                      <div className="overflow-x-auto"><Table>
                        <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Status</TableHead><TableHead>Order</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
                        <TableBody>
                          {templates.map(tpl => (
                            <TableRow key={tpl.id}>
                              <TableCell className="font-medium">{tpl.title}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{tpl.category}</TableCell>
                              <TableCell><StatusBadge status={tpl.is_active ? 'active' : 'rejected'} /></TableCell>
                              <TableCell className="text-sm">{tpl.sort_order}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button size="sm" variant="outline" onClick={() => { adminScrollRef.current = window.scrollY; setPreviewTplHtml(tpl.html_content); setPreviewTplTitle(tpl.title); }}>👁 Preview</Button>
                                  <Button size="sm" variant="outline" onClick={() => handleEditTemplate(tpl)}>✏️</Button>
                                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteTemplate(tpl.id)}>🗑</Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table></div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-sm sm:text-base">📋 Bawaan ({sampleTemplates.length})</CardTitle>
                    <Button size="sm" variant="outline" onClick={async () => {
                      const existingTitles = templates.map(t => t.title);
                      const toInsert = sampleTemplates.filter(s => !existingTitles.includes(s.title));
                      if (toInsert.length === 0) { showToast({ title: 'Semua template sudah ada di database.' }); return; }
                      for (let i = 0; i < toInsert.length; i++) {
                        await supabase.from("lp_templates").insert({ title: toInsert[i].title, description: toInsert[i].description, category: toInsert[i].category, html_content: toInsert[i].html_content, is_active: true, sort_order: i + templates.length });
                      }
                      showToast({ title: `✅ ${toInsert.length} template ditambahkan ke database!` });
                      await fetchTemplates();
                    }} className="gap-1 text-xs sm:text-sm w-full sm:w-auto">🚀 Push ke DB</Button>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {sampleTemplates.map(tpl => (
                        <div key={tpl.id} className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all group">
                          <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                            <div className="w-full h-full overflow-hidden" style={{ pointerEvents: 'none' }}>
                              <iframe srcDoc={tpl.html_content} className="w-[400%] h-[400%] border-0" style={{ transform: 'scale(0.25)', transformOrigin: 'top left' }} title={tpl.title} sandbox="" loading="lazy" />
                            </div>
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-all flex items-end justify-center gap-2 pb-3 cursor-pointer" onClick={() => { adminScrollRef.current = window.scrollY; setPreviewTplHtml(tpl.html_content); setPreviewTplTitle(tpl.title); }}>
                              <Button size="sm" variant="secondary" className="text-xs" onClick={(e) => { e.stopPropagation(); adminScrollRef.current = window.scrollY; setPreviewTplHtml(tpl.html_content); setPreviewTplTitle(tpl.title); }}>👁 Preview</Button>
                              <Button size="sm" className="text-xs" onClick={(e) => { e.stopPropagation(); setEditTplId(null); setTplForm({ title: tpl.title, description: tpl.description, category: tpl.category, html_content: tpl.html_content, is_active: true, sort_order: 0 }); setTplDialog(true); }}>💾 Simpan</Button>
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
              </>
            )}
          </TabsContent>

          {/* USERS TAB */}
          <TabsContent value="users">
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
              {[
                { label: "Total User", count: users.length, icon: <Users className="h-5 w-5 sm:h-8 sm:w-8 text-primary" />, filter: "all" },
                { label: "Pending", count: pendingCount, icon: <Clock className="h-5 w-5 sm:h-8 sm:w-8 text-amber-500" />, filter: "pending" },
                { label: "Aktif", count: activeCount, icon: <UserCheck className="h-5 w-5 sm:h-8 sm:w-8 text-emerald-500" />, filter: "active" },
                { label: "Ditolak", count: rejectedCount, icon: <UserX className="h-5 w-5 sm:h-8 sm:w-8 text-destructive" />, filter: "rejected" },
              ].map(s => (
                <Card key={s.filter} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilterStatus(s.filter)}>
                  <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">{s.icon}<div><p className="text-lg sm:text-2xl font-bold text-foreground">{s.count}</p><p className="text-[10px] sm:text-xs text-muted-foreground">{s.label}</p></div></CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader className="flex flex-col gap-2 p-3 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base"><Users className="h-4 w-4 sm:h-5 sm:w-5" /> User ({filteredUsers.length})</CardTitle>
                <div className="flex items-center gap-2 w-full">
                  <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 text-sm" /></div>
                  <Button variant="outline" size="sm" className="gap-1 flex-shrink-0" onClick={() => setAddMemberDialog(true)}><UserPlus className="h-4 w-4" /> <span className="hidden sm:inline">Add</span></Button>
                  <Button variant="outline" size="icon" className="h-9 w-9 flex-shrink-0" onClick={() => { fetchUsers(); fetchLogs(); }}><RefreshCw className="h-4 w-4" /></Button>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap items-center">
                  {["all","pending","active","rejected"].map(s => (
                    <Button key={s} size="sm" variant={filterStatus===s?"default":"outline"} onClick={() => setFilterStatus(s)} className="text-[10px] sm:text-xs capitalize h-7 sm:h-8 px-2 sm:px-3">{s==="all"?"Semua":s}</Button>
                  ))}
                  {selectedUsers.size > 0 && (
                    <div className="flex gap-1 flex-wrap w-full sm:w-auto sm:ml-auto mt-1 sm:mt-0">
                      <span className="text-[10px] sm:text-xs text-muted-foreground self-center mr-1">{selectedUsers.size} dipilih</span>
                      <Button size="sm" variant="outline" onClick={() => setBulkDialog({ open: true, action: 'tier_paid' })} className="text-[10px] sm:text-xs gap-1 h-7">⬆ Bayar</Button>
                      <Button size="sm" variant="outline" onClick={() => setBulkDialog({ open: true, action: 'tier_free' })} className="text-[10px] sm:text-xs gap-1 h-7">⬇ Gratis</Button>
                      <Button size="sm" variant="outline" onClick={() => setBulkDialog({ open: true, action: 'reset_password' })} className="text-[10px] sm:text-xs gap-1 h-7"><KeyRound className="h-3 w-3" /> Reset</Button>
                      <Button size="sm" variant="outline" onClick={() => setBulkDialog({ open: true, action: 'delete' })} className="text-[10px] sm:text-xs gap-1 h-7 text-destructive"><Trash2 className="h-3 w-3" /> Hapus</Button>
                    </div>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10">
                          <Checkbox checked={selectedUsers.size > 0 && selectedUsers.size === filteredUsers.filter(u => u.role !== 'admin').length} onCheckedChange={toggleSelectAll} />
                        </TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Terdaftar</TableHead>
                        <TableHead>Login</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">Tidak ada data.</TableCell></TableRow>
                      : filteredUsers.map(u => (
                        <TableRow key={u.id} className={`${u.status==="pending"?"bg-amber-500/5":""} ${selectedUsers.has(u.id) ? "bg-primary/5" : ""}`}>
                          <TableCell>
                            {u.role !== 'admin' && <Checkbox checked={selectedUsers.has(u.id)} onCheckedChange={() => toggleSelectUser(u.id)} />}
                          </TableCell>
                          <TableCell className="font-medium">{u.name||"-"}</TableCell>
                          <TableCell className="text-sm">{u.email}</TableCell>
                          <TableCell>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.product_code === 'LPE' ? 'text-primary bg-primary/10 border border-primary/30' : 'text-amber-500 bg-amber-500/10 border border-amber-500/30'}`}>
                              {u.product_code === 'LPE' ? '⭐ Berbayar' : '🆓 Gratis'}
                            </span>
                          </TableCell>
                          <TableCell><StatusBadge status={u.status} /></TableCell>
                          <TableCell><span className={`text-xs font-medium ${u.role==="admin"?"text-primary":"text-muted-foreground"}`}>{u.role}</span></TableCell>
                          <TableCell className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString("id-ID")}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{u.last_sign_in ? new Date(u.last_sign_in).toLocaleString("id-ID") : "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1 flex-wrap">
                              {u.status==="pending" && u.entitlement_id && (<><Button size="sm" variant="outline" className="gap-1 text-emerald-600 border-emerald-300" onClick={() => handleApprove(u.entitlement_id!)} disabled={actionLoading===u.entitlement_id}><CheckCircle className="h-3 w-3" /> ACC</Button><Button size="sm" variant="outline" className="gap-1 text-destructive border-destructive/30" onClick={() => handleReject(u.entitlement_id!)} disabled={actionLoading===u.entitlement_id}><XCircle className="h-3 w-3" /> Tolak</Button></>)}
                              {u.status==="rejected" && u.entitlement_id && <Button size="sm" variant="outline" className="gap-1 text-emerald-600 border-emerald-300" onClick={() => handleApprove(u.entitlement_id!)} disabled={actionLoading===u.entitlement_id}><CheckCircle className="h-3 w-3" /> ACC</Button>}
                              {u.role !== 'admin' && (
                                <Button size="sm" variant="outline" className="text-xs" onClick={() => handleChangeTier(u.id, u.product_code === 'LPE' ? 'free' : 'paid')} disabled={actionLoading===u.id}>
                                  {u.product_code === 'LPE' ? '⬇ Gratis' : '⬆ Berbayar'}
                                </Button>
                              )}
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
              <CardHeader className="p-3 sm:p-6"><CardTitle className="text-sm sm:text-base">Provision Logs</CardTitle></CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow><TableHead className="text-xs">Order ID</TableHead><TableHead className="text-xs">Email</TableHead><TableHead className="text-xs">Status</TableHead><TableHead className="text-xs hidden sm:table-cell">Message</TableHead><TableHead className="text-xs">Tanggal</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {logs.length===0 ? <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8 text-sm">Belum ada log.</TableCell></TableRow>
                      : logs.map(log => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-[10px] sm:text-xs">{log.order_id?.slice(0, 8) || "-"}</TableCell>
                          <TableCell className="text-[10px] sm:text-sm max-w-[100px] truncate">{log.email||"-"}</TableCell>
                          <TableCell><StatusBadge status={log.status} /></TableCell>
                          <TableCell className="text-xs max-w-[300px] truncate hidden sm:table-cell">{log.message||"-"}</TableCell>
                          <TableCell className="text-[10px] sm:text-xs whitespace-nowrap">{new Date(log.created_at).toLocaleDateString("id-ID")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> Pengaturan</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Link Order Form Scalev</label>
                  <p className="text-xs text-muted-foreground">User gratis akan diarahkan ke link ini untuk upgrade ke versi berbayar</p>
                  <div className="flex gap-2">
                    <Input value={orderUrl} onChange={(e) => setOrderUrl(e.target.value)} placeholder="https://checkout.scalev.id/..." className="flex-1" />
                    <Button onClick={async () => {
                      await (supabase as any).from('app_settings').update({ value: orderUrl }).eq('key', 'scalev_order_url');
                      showToast({ title: '✅ Link disimpan!' });
                    }}>Simpan</Button>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-secondary p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-foreground">ℹ️ Panduan Tier Akses</h3>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>🆓 <strong>Gratis</strong> — Hanya bisa Generate Prompt manual. Template, Edit Mode, Countdown, Sales Notif, Pixel ID terkunci.</li>
                    <li>⭐ <strong>Berbayar</strong> — Akses penuh semua fitur. Otomatis aktif ketika user membeli via Scalev.</li>
                    <li>🔄 <strong>Auto-Upgrade</strong> — Ketika user gratis membeli via Scalev, tier otomatis berubah ke Berbayar.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Reset Password Dialog */}
      <Dialog open={resetDialog.open} onOpenChange={(open) => { if (!open) { setResetDialog({ open: false, userId: "", email: "" }); setShowNewPassword(false); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reset Password</DialogTitle><DialogDescription>Reset password untuk {resetDialog.email}</DialogDescription></DialogHeader>
          <div className="relative">
            <Input type={showNewPassword ? "text" : "password"} placeholder="Password baru (min. 6)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pr-10" />
            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialog({ open: false, userId: "", email: "" })}>Batal</Button>
            <Button onClick={handleResetPassword} disabled={actionLoading===resetDialog.userId}>{actionLoading===resetDialog.userId ? "..." : "Reset"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Action Dialog */}
      <Dialog open={bulkDialog.open} onOpenChange={(open) => { if (!open) { setBulkDialog({ open: false, action: '' }); setBulkPassword(''); setShowBulkPassword(false); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {bulkDialog.action === 'tier_paid' && '⬆ Ubah ke Berbayar'}
              {bulkDialog.action === 'tier_free' && '⬇ Ubah ke Gratis'}
              {bulkDialog.action === 'reset_password' && '🔑 Reset Password Massal'}
              {bulkDialog.action === 'delete' && '🗑 Hapus User Massal'}
            </DialogTitle>
            <DialogDescription>Tindakan ini akan diterapkan ke {selectedUsers.size} user yang dipilih.</DialogDescription>
          </DialogHeader>
          {bulkDialog.action === 'reset_password' && (
            <div className="relative">
              <Input type={showBulkPassword ? "text" : "password"} placeholder="Password baru untuk semua (min. 6)" value={bulkPassword} onChange={(e) => setBulkPassword(e.target.value)} className="pr-10" />
              <button type="button" onClick={() => setShowBulkPassword(!showBulkPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                {showBulkPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          )}
          {bulkDialog.action === 'delete' && (
            <p className="text-sm text-destructive font-medium">⚠️ Tindakan ini tidak bisa dibatalkan!</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDialog({ open: false, action: '' })}>Batal</Button>
            <Button onClick={handleBulkAction} disabled={bulkLoading} variant={bulkDialog.action === 'delete' ? 'destructive' : 'default'}>
              {bulkLoading ? "Memproses..." : "Konfirmasi"}
            </Button>
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
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Password *</label>
              <div className="relative">
                <Input type={showAddMemberPassword ? "text" : "password"} placeholder="Min. 6 karakter" value={addMemberForm.password} onChange={(e) => setAddMemberForm(p => ({ ...p, password: e.target.value }))} className="pr-10" />
                <button type="button" onClick={() => setShowAddMemberPassword(!showAddMemberPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                  {showAddMemberPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Tier Akses</label>
              <div className="flex gap-2">
                {(['free', 'paid'] as const).map(t => (
                  <button key={t} type="button" onClick={() => setAddMemberTier(t)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${addMemberTier === t ? 'bg-primary/10 text-primary border-primary' : 'bg-secondary text-muted-foreground border-border'}`}>
                    {t === 'paid' ? '⭐ Berbayar (Full)' : '🆓 Gratis (Terbatas)'}
                  </button>
                ))}
              </div>
            </div>
            <div><label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Role</label><div className="flex gap-2">{['user','admin'].map(r => <button key={r} type="button" onClick={() => setAddMemberForm(p => ({ ...p, role: r }))} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${addMemberForm.role===r?'bg-primary/10 text-primary border-primary':'bg-secondary text-muted-foreground border-border'}`}>{r==='admin'?'👑 Admin':'👤 User'}</button>)}</div></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddMemberDialog(false)}>Batal</Button>
            <Button onClick={handleAddMember} disabled={addMemberLoading}>{addMemberLoading ? "..." : "Tambah"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Edit Dialog */}
      <Dialog open={tplDialog} onOpenChange={setTplDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editTplId ? '✏️ Edit Template' : '➕ Tambah Template'}</DialogTitle></DialogHeader>
          <Tabs defaultValue="metadata">
            <TabsList className="mb-3">
              <TabsTrigger value="metadata">📝 Info Template</TabsTrigger>
              <TabsTrigger value="html">💻 HTML Code</TabsTrigger>
              <TabsTrigger value="preview">👁 Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="metadata" className="space-y-3">
              <div><label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Nama Template *</label><Input value={tplForm.title} onChange={(e) => setTplForm(p => ({ ...p, title: e.target.value }))} placeholder="Nama template..." /></div>
              <div><label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Deskripsi</label><Textarea value={tplForm.description} onChange={(e) => setTplForm(p => ({ ...p, description: e.target.value }))} placeholder="Deskripsi singkat template ini..." className="min-h-[80px]" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div><label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Kategori</label><Input value={tplForm.category} onChange={(e) => setTplForm(p => ({ ...p, category: e.target.value }))} /></div>
                <div><label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Urutan</label><Input type="number" value={tplForm.sort_order} onChange={(e) => setTplForm(p => ({ ...p, sort_order: Number(e.target.value) }))} /></div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Status</label>
                  <button type="button" onClick={() => setTplForm(p => ({ ...p, is_active: !p.is_active }))} className={`px-3 py-2 rounded-lg text-sm border transition-all ${tplForm.is_active?'bg-emerald-500/10 text-emerald-500 border-emerald-500/30':'bg-secondary text-muted-foreground border-border'}`}>{tplForm.is_active?'✅ Aktif':'❌ Nonaktif'}</button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="html">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">HTML Content *</label>
                  <span className="text-[10px] text-muted-foreground">{tplForm.html_content.length.toLocaleString()} karakter</span>
                </div>
                <Textarea value={tplForm.html_content} onChange={(e) => setTplForm(p => ({ ...p, html_content: e.target.value }))} placeholder="Paste kode HTML template..." className="min-h-[500px] font-mono text-xs leading-relaxed" />
              </div>
            </TabsContent>

            <TabsContent value="preview">
              {tplForm.html_content ? (
                <div className="rounded-lg border border-border overflow-hidden bg-secondary" style={{ height: '500px' }}>
                  <iframe srcDoc={tplForm.html_content} className="w-full h-full border-0" title="Preview" sandbox="allow-scripts" />
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-16">Belum ada HTML untuk di-preview.</p>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setTplDialog(false)}>Batal</Button>
            <Button onClick={handleSaveTemplate} disabled={tplLoading}>{tplLoading ? "Menyimpan..." : editTplId ? "💾 Update Template" : "💾 Simpan Template"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
