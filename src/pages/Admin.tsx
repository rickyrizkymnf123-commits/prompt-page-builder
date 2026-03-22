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
import DemoManagementTab from "@/components/admin/DemoManagementTab";
import HtmlGeneratorTab from "@/components/admin/HtmlGeneratorTab";

interface AdminUser {
  id: string; email: string; name: string | null; phone: string | null;
  status: string; entitlement_id: string | null; product_code: string | null;
  order_id: string | null; role: string; created_at: string; last_sign_in: string | null;
  prompt_used: number;
}
interface ProvisionLog {
  id: string; order_id: string | null; email: string | null;
  status: string; message: string | null; created_at: string;
  source_label: string | null;
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

function UserSecretsPanel() {
  const [userSecrets, setUserSecrets] = useState<{ id: string; label: string; secret: string; user_id: string }[]>([]);
  const [showUserSecrets, setShowUserSecrets] = useState(false);
  const { toast: showToast } = useToast();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("user_signing_secrets").select("*");
      if (data) setUserSecrets(data as any[]);
    };
    load();
  }, []);

  if (userSecrets.length === 0) return null;

  return (
    <div className="border-t border-border pt-6 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">👤 User Signing Secrets</h3>
        <p className="text-xs text-muted-foreground mt-1">Secret yang dimasukkan oleh user dari dashboard mereka. Otomatis digunakan oleh gateway untuk verifikasi webhook.</p>
      </div>
      <div className="space-y-2">
        {userSecrets.map((entry) => (
          <div key={entry.id} className="flex items-center gap-2 rounded-lg bg-secondary border border-border p-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{entry.label || "User"}</p>
              <p className="text-xs font-mono text-muted-foreground truncate">{showUserSecrets ? entry.secret : "••••••••" + entry.secret.slice(-6)}</p>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setShowUserSecrets(!showUserSecrets)} className="text-xs text-primary hover:underline flex items-center gap-1">
          {showUserSecrets ? <><EyeOff className="h-3 w-3" /> Sembunyikan</> : <><Eye className="h-3 w-3" /> Tampilkan Secret</>}
        </button>
      </div>
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
  // Bulk add members
  const [bulkAddDialog, setBulkAddDialog] = useState(false);
  const [bulkAddRows, setBulkAddRows] = useState<{ email: string; name: string; password: string }[]>([{ email: '', name: '', password: '' }]);
  const [bulkAddTier, setBulkAddTier] = useState<'free' | 'paid'>('free');
  const [bulkAddLoading, setBulkAddLoading] = useState(false);
  const [bulkAddResults, setBulkAddResults] = useState<{ email: string; success: boolean; error?: string }[] | null>(null);
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
  const [affiliateLink, setAffiliateLink] = useState('');
  const [signingSecrets, setSigningSecrets] = useState<{ label: string; secret: string }[]>([]);
  const [newSecretLabel, setNewSecretLabel] = useState('');
  const [newSecretValue, setNewSecretValue] = useState('');
  const [showSecretValues, setShowSecretValues] = useState(false);
  // Slug map state
  const [slugMap, setSlugMap] = useState<{ slug: string; product_code: string; label: string }[]>([]);
  const [newSlug, setNewSlug] = useState('');
  const [newSlugProduct, setNewSlugProduct] = useState('LPE');
  const [newSlugLabel, setNewSlugLabel] = useState('');
  // Test Provision state
  const [testProvForm, setTestProvForm] = useState({ email: '', name: '', phone: '', product_code: 'LPE' });
  const [testProvLoading, setTestProvLoading] = useState(false);
  const [testProvResult, setTestProvResult] = useState<any>(null);
  // Partner Webhook Test state
  const [partnerTestForm, setPartnerTestForm] = useState({ partner: '', email: 'test@example.com', name: 'Test Partner', phone: '', product_code: 'LPE' });
  const [partnerTestLoading, setPartnerTestLoading] = useState(false);
  const [partnerTestResult, setPartnerTestResult] = useState<any>(null);
  // Tutorials state
  const [tutorialsList, setTutorialsList] = useState<{ id: string; title: string; description: string | null; youtube_url: string; sort_order: number; is_active: boolean }[]>([]);
  const [tutDialog, setTutDialog] = useState(false);
  const [tutForm, setTutForm] = useState({ title: '', description: '', youtube_url: '', sort_order: 0, is_active: true });
  const [editTutId, setEditTutId] = useState<string | null>(null);
  const [tutLoading, setTutLoading] = useState(false);

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
        const al = (data as any[]).find((r: any) => r.key === 'affiliate_link');
        if (al) setAffiliateLink(al.value || '');
        const ws = (data as any[]).find((r: any) => r.key === 'webhook_signing_secrets');
        if (ws?.value) {
          try {
            const parsed = JSON.parse(ws.value);
            if (Array.isArray(parsed)) setSigningSecrets(parsed.map((e: any) => typeof e === 'string' ? { label: '', secret: e } : { label: e.label || '', secret: e.secret || '' }));
          } catch {}
        }
        const sm = (data as any[]).find((r: any) => r.key === 'scalev_slug_map');
        if (sm?.value) {
          try {
            const parsed = JSON.parse(sm.value);
            if (Array.isArray(parsed)) setSlugMap(parsed.map((e: any) => ({ slug: e.slug || '', product_code: e.product_code || 'LPE', label: e.label || '' })));
          } catch {}
        }
      }
    } catch {}
  };
  const fetchTutorials = async () => {
    const { data } = await supabase.from('tutorials').select('*').order('sort_order', { ascending: true });
    if (data) setTutorialsList(data as any[]);
  };

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }
      const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).maybeSingle();
      if (roleData?.role !== "admin") { navigate("/app"); return; }
      setAuthorized(true);
      await Promise.all([fetchUsers(), fetchLogs(), fetchTemplates(), fetchSettings(), fetchTutorials()]);
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
    if (!confirm('Yakin hapus user ini?')) return;
    setActionLoading(userId);
    const { error } = await supabase.functions.invoke("admin-users", { body: { action: "delete", user_id: userId } });
    if (error) showToast({ title: "Error", description: "Gagal menghapus user.", variant: "destructive" });
    else showToast({ title: "Berhasil", description: "User dihapus." });
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
    try {
      const { data, error } = await supabase.functions.invoke("admin-users", { body: { action: "add_member", email: addMemberForm.email, password: addMemberForm.password, name: addMemberForm.name, role: addMemberForm.role, tier: addMemberTier } });
      const errMsg = data?.error || error?.message;
      if (errMsg) {
        const friendlyMsg = errMsg.includes("already been registered") ? "Email sudah terdaftar. Gunakan email lain." : errMsg;
        showToast({ title: "Gagal", description: friendlyMsg, variant: "destructive" });
      } else {
        showToast({ title: "Berhasil", description: `Member ${addMemberForm.email} ditambahkan.` }); setAddMemberDialog(false); setAddMemberForm({ email: '', password: '', name: '', role: 'user' }); setAddMemberTier('free'); await fetchUsers();
      }
    } catch (e: any) {
      showToast({ title: "Gagal", description: e?.message || "Terjadi kesalahan.", variant: "destructive" });
    }
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
  const handleBulkAddMembers = async () => {
    const members = bulkAddRows.filter(r => r.email.trim());
    if (members.length === 0) { showToast({ title: "Error", description: "Tidak ada data member yang valid.", variant: "destructive" }); return; }
    setBulkAddLoading(true);
    setBulkAddResults(null);
    const { data, error } = await supabase.functions.invoke("admin-users", { body: { action: "bulk_add_members", members, tier: bulkAddTier } });
    if (error) { showToast({ title: "Gagal", description: error.message, variant: "destructive" }); }
    else {
      setBulkAddResults(data.results || []);
      showToast({ title: `✅ ${data.successCount} berhasil, ${data.failCount} gagal` });
      await fetchUsers();
    }
    setBulkAddLoading(false);
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
        await supabase.functions.invoke("admin-users", { body: { action: "delete", user_id: uid } });
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
            <TabsTrigger value="lpbuilder" className="gap-1 sm:gap-2 text-xs sm:text-sm"><ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">LP Builder</span><span className="sm:hidden">LP</span></TabsTrigger>
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
                  <div className="relative flex-1 min-w-0"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 text-sm" /></div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => setAddMemberDialog(true)}><UserPlus className="h-4 w-4" /> <span className="hidden sm:inline">Add</span></Button>
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => { setBulkAddDialog(true); setBulkAddResults(null); setBulkAddRows([{ email: '', name: '', password: '' }]); }}><Users className="h-4 w-4" /> <span className="hidden sm:inline">Bulk</span></Button>
                    <Button variant="outline" size="sm" className="px-2" onClick={() => { fetchUsers(); fetchLogs(); }}><RefreshCw className="h-4 w-4" /></Button>
                  </div>
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
                        <TableHead>Usage</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Terdaftar</TableHead>
                        <TableHead>Login</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground py-8">Tidak ada data.</TableCell></TableRow>
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
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span className={`text-xs font-mono ${u.prompt_used >= 5 && u.product_code !== 'LPE' ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>{u.prompt_used}/5</span>
                              {u.role !== 'admin' && u.prompt_used > 0 && (
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-muted-foreground hover:text-primary" title="Reset usage" onClick={async () => {
                                  await supabase.functions.invoke("admin-users", { body: { action: "reset_usage", user_id: u.id } });
                                  showToast({ title: '✅ Usage direset' });
                                  fetchUsers();
                                }}><RotateCcw className="h-3 w-3" /></Button>
                              )}
                            </div>
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
                    <TableHeader><TableRow><TableHead className="text-xs">Order ID</TableHead><TableHead className="text-xs">Email</TableHead><TableHead className="text-xs">Status</TableHead><TableHead className="text-xs hidden sm:table-cell">Sumber</TableHead><TableHead className="text-xs hidden sm:table-cell">Message</TableHead><TableHead className="text-xs">Tanggal</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {logs.length===0 ? <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8 text-sm">Belum ada log.</TableCell></TableRow>
                      : logs.map(log => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-[10px] sm:text-xs">{log.order_id?.slice(0, 8) || "-"}</TableCell>
                          <TableCell className="text-[10px] sm:text-sm max-w-[100px] truncate">{log.email||"-"}</TableCell>
                          <TableCell><StatusBadge status={log.status} /></TableCell>
                          <TableCell className="text-xs hidden sm:table-cell">{log.source_label ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">{log.source_label}</span> : <span className="text-muted-foreground">-</span>}</TableCell>
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

                {/* Affiliate / Undangan Produk Link */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Link Undangan Produk (Affiliate)</label>
                  <p className="text-xs text-muted-foreground">Link ini akan ditampilkan ke user untuk mengajukan kolaborasi/affiliate. User bisa klik link ini untuk mendaftar sebagai partner.</p>
                  <div className="flex gap-2">
                    <Input value={affiliateLink} onChange={(e) => setAffiliateLink(e.target.value)} placeholder="https://scalev.id/affiliate/..." className="flex-1" />
                    <Button onClick={async () => {
                      await (supabase as any).from('app_settings').upsert({ key: 'affiliate_link', value: affiliateLink, updated_at: new Date().toISOString() }, { onConflict: 'key' });
                      showToast({ title: '✅ Link undangan disimpan!' });
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

                {/* Webhook URL */}
                <div className="border-t border-border pt-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">🌐 Webhook URL</h3>
                    <p className="text-xs text-muted-foreground mt-1">Berikan URL ini kepada partner Anda untuk digunakan sebagai Webhook Endpoint di akun Scalev mereka. Subscribe ke event <strong>order.payment_status_changed</strong>.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input readOnly value="https://npgglrvvdlhagztsxsjc.supabase.co/functions/v1/gateway-provision?product=LPE" className="font-mono text-xs bg-muted" />
                    <Button size="sm" variant="outline" onClick={() => {
                      navigator.clipboard.writeText('https://npgglrvvdlhagztsxsjc.supabase.co/functions/v1/gateway-provision?product=LPE');
                      showToast({ title: '📋 URL disalin!' });
                    }}>Copy</Button>
                  </div>
                </div>

                {/* Webhook Signing Secrets Management */}
                <div className="border-t border-border pt-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">🔑 Webhook Signing Secrets (Multi-Partner)</h3>
                    <p className="text-xs text-muted-foreground mt-1">Tambahkan Signing Secret dari setiap partner Scalev agar webhook mereka bisa diverifikasi. Secret utama dari ENV sudah otomatis digunakan.</p>
                  </div>
                  
                  {signingSecrets.length > 0 && (
                    <div className="space-y-2">
                      {signingSecrets.map((entry, i) => (
                        <div key={i} className="flex items-center gap-2 rounded-lg bg-secondary border border-border p-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">{entry.label || `Partner ${i + 1}`}</p>
                            <p className="text-xs font-mono text-muted-foreground truncate">{showSecretValues ? entry.secret : '••••••••' + entry.secret.slice(-6)}</p>
                          </div>
                          <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0" onClick={async () => {
                            const next = signingSecrets.filter((_, idx) => idx !== i);
                            setSigningSecrets(next);
                            await (supabase as any).from('app_settings').update({ value: JSON.stringify(next) }).eq('key', 'webhook_signing_secrets');
                            showToast({ title: '🗑 Secret dihapus' });
                          }}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                      <button type="button" onClick={() => setShowSecretValues(!showSecretValues)} className="text-xs text-primary hover:underline flex items-center gap-1">
                        {showSecretValues ? <><EyeOff className="h-3 w-3" /> Sembunyikan</> : <><Eye className="h-3 w-3" /> Tampilkan Secret</>}
                      </button>
                    </div>
                  )}

                  <div className="rounded-lg border border-dashed border-border p-3 space-y-2">
                    <p className="text-xs font-semibold text-foreground">Tambah Secret Baru</p>
                    <div className="flex gap-2">
                      <Input value={newSecretLabel} onChange={(e) => setNewSecretLabel(e.target.value)} placeholder="Label (misal: Partner Ahmad)" className="flex-1" />
                      <Input value={newSecretValue} onChange={(e) => setNewSecretValue(e.target.value)} placeholder="Signing Secret dari Scalev" className="flex-1 font-mono text-xs" />
                      <Button size="sm" disabled={!newSecretValue.trim()} onClick={async () => {
                        const next = [...signingSecrets, { label: newSecretLabel.trim() || `Partner ${signingSecrets.length + 1}`, secret: newSecretValue.trim() }];
                        setSigningSecrets(next);
                        await (supabase as any).from('app_settings').update({ value: JSON.stringify(next) }).eq('key', 'webhook_signing_secrets');
                        setNewSecretLabel(''); setNewSecretValue('');
                        showToast({ title: '✅ Secret ditambahkan!' });
                      }}>+ Tambah</Button>
                    </div>
                  </div>
                </div>

                {/* User-submitted Signing Secrets (read-only view) */}
                <UserSecretsPanel />

                {/* Scalev Slug Map Management */}
                <div className="border-t border-border pt-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">🗺️ Slug Routing Map</h3>
                    <p className="text-xs text-muted-foreground mt-1">Mapping slug checkout Scalev ke Product Code. Ketika ada order dari slug yang terdaftar, gateway otomatis meneruskan ke project yang benar.</p>
                  </div>

                  {slugMap.length > 0 && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-[1fr_100px_auto] gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3">
                        <span>Slug / Label</span>
                        <span>Product</span>
                        <span></span>
                      </div>
                      {slugMap.map((entry, i) => (
                        <div key={i} className="grid grid-cols-[1fr_100px_auto] gap-2 items-center rounded-lg bg-secondary border border-border p-3">
                          <div className="min-w-0">
                            <p className="text-xs font-mono text-foreground truncate">{entry.slug}</p>
                            {entry.label && <p className="text-[10px] text-muted-foreground truncate">{entry.label}</p>}
                          </div>
                          <span className="text-xs font-semibold text-primary">{entry.product_code}</span>
                          <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0" onClick={async () => {
                            const next = slugMap.filter((_, idx) => idx !== i);
                            setSlugMap(next);
                            await (supabase as any).from('app_settings').update({ value: JSON.stringify(next) }).eq('key', 'scalev_slug_map');
                            showToast({ title: '🗑 Slug dihapus' });
                          }}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="rounded-lg border border-dashed border-border p-3 space-y-2">
                    <p className="text-xs font-semibold text-foreground">Tambah Slug Baru</p>
                    <div className="flex gap-2">
                      <Input value={newSlug} onChange={(e) => setNewSlug(e.target.value)} placeholder="Slug (misal: anaksehat)" className="flex-1 font-mono text-xs" />
                      <select value={newSlugProduct} onChange={(e) => setNewSlugProduct(e.target.value)}
                        className="h-9 rounded-md border border-input bg-background px-3 text-xs font-semibold">
                        <option value="LPE">LPE</option>
                        <option value="SWA">SWA</option>
                        <option value="PEA">PEA</option>
                        <option value="DST">DST</option>
                        <option value="MAA">MAA</option>
                        <option value="PNA">PNA</option>
                      </select>
                      <Input value={newSlugLabel} onChange={(e) => setNewSlugLabel(e.target.value)} placeholder="Label (opsional)" className="w-32 text-xs" />
                      <Button size="sm" disabled={!newSlug.trim()} onClick={async () => {
                        const exists = slugMap.some(s => s.slug === newSlug.trim());
                        if (exists) { showToast({ title: '⚠️ Slug sudah ada!', variant: 'destructive' }); return; }
                        const next = [...slugMap, { slug: newSlug.trim(), product_code: newSlugProduct, label: newSlugLabel.trim() }];
                        setSlugMap(next);
                        await (supabase as any).from('app_settings').update({ value: JSON.stringify(next) }).eq('key', 'scalev_slug_map');
                        setNewSlug(''); setNewSlugLabel('');
                        showToast({ title: '✅ Slug ditambahkan!' });
                      }}>+ Tambah</Button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-secondary/50 p-3">
                    <p className="text-[10px] text-muted-foreground">💡 <strong>Tips:</strong> Slug adalah bagian akhir dari URL checkout Scalev. Contoh: dari <code className="bg-muted px-1 rounded">papospedia.myscalev.com/<strong>anaksehat</strong></code>, slug-nya adalah <strong>anaksehat</strong>.</p>
                  </div>
                </div>

                {/* Test Provision */}
                <div className="border-t border-border pt-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">🧪 Test Provisioning</h3>
                    <p className="text-xs text-muted-foreground mt-1">Simulasi webhook Scalev untuk test alur provisioning lengkap (buat akun, entitlement, kirim WA) tanpa pembayaran nyata.</p>
                  </div>

                  <div className="rounded-lg border border-dashed border-border p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-foreground">Email *</label>
                        <Input value={testProvForm.email} onChange={(e) => setTestProvForm(p => ({ ...p, email: e.target.value }))} placeholder="test@example.com" className="text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-foreground">Nama</label>
                        <Input value={testProvForm.name} onChange={(e) => setTestProvForm(p => ({ ...p, name: e.target.value }))} placeholder="Test User" className="text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-foreground">No. WhatsApp</label>
                        <Input value={testProvForm.phone} onChange={(e) => setTestProvForm(p => ({ ...p, phone: e.target.value }))} placeholder="08123456789" className="text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-foreground">Product Code</label>
                        <select value={testProvForm.product_code} onChange={(e) => setTestProvForm(p => ({ ...p, product_code: e.target.value }))}
                          className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs">
                          <option value="LPE">LPE (Landing Page Engine)</option>
                          <option value="LPE_FREE">LPE_FREE (Gratis)</option>
                          <option value="SWA">SWA (Story Weaver AI)</option>
                          <option value="PEA">PEA (Property Enhancer AI)</option>
                          <option value="DST">DST (Digital Strategy)</option>
                          <option value="MAA">MAA (Meta Ads)</option>
                          <option value="PNA">PNA (Profit Navigator)</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button size="sm" disabled={testProvLoading || !testProvForm.email.trim()} onClick={async () => {
                        setTestProvLoading(true);
                        setTestProvResult(null);
                        try {
                          const { data, error } = await supabase.functions.invoke('admin-users', {
                            body: {
                              action: 'test_provision',
                              email: testProvForm.email,
                              name: testProvForm.name || 'Test User',
                              phone: testProvForm.phone,
                              tier: testProvForm.product_code,
                            },
                          });
                          if (error) {
                            setTestProvResult({ success: false, error: error.message });
                          } else {
                            setTestProvResult(data);
                            if (data?.success) {
                              showToast({ title: '✅ Test provision berhasil!' });
                              await fetchUsers();
                              await fetchLogs();
                            } else {
                              showToast({ title: '❌ Test provision gagal', description: data?.provision_result?.error || data?.error || 'Unknown error', variant: 'destructive' });
                            }
                          }
                        } catch (err: any) {
                          setTestProvResult({ success: false, error: err.message });
                        }
                        setTestProvLoading(false);
                      }}>
                        {testProvLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1" /> : <Rocket className="h-3.5 w-3.5 mr-1" />}
                        {testProvLoading ? 'Memproses...' : 'Jalankan Test'}
                      </Button>
                      <p className="text-[10px] text-muted-foreground">⚠️ Akan membuat akun + entitlement nyata. Jika nomor WA diisi, notifikasi WA akan terkirim.</p>
                    </div>
                  </div>

                  {testProvResult && (
                    <div className={`rounded-lg border p-4 space-y-2 ${testProvResult.success ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-destructive/30 bg-destructive/5'}`}>
                      <div className="flex items-center gap-2">
                        {testProvResult.success ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-destructive" />}
                        <p className="text-sm font-semibold text-foreground">{testProvResult.success ? 'Provisioning Berhasil!' : 'Provisioning Gagal'}</p>
                      </div>
                      {testProvResult.test_order_id && (
                        <p className="text-xs text-muted-foreground">Order ID: <span className="font-mono">{testProvResult.test_order_id}</span></p>
                      )}
                      {testProvResult.provision_result?.email && (
                        <p className="text-xs text-muted-foreground">Email: <span className="font-mono">{testProvResult.provision_result.email}</span></p>
                      )}
                      {testProvResult.provision_result?.password && (
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">Password: <span className="font-mono font-semibold text-foreground">{testProvResult.provision_result.password}</span></p>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => {
                            navigator.clipboard.writeText(testProvResult.provision_result.password);
                            showToast({ title: '📋 Password disalin!' });
                          }}><Copy className="h-3 w-3" /></Button>
                        </div>
                      )}
                      {testProvResult.provision_result?.whatsapp_sent !== undefined && (
                        <p className="text-xs text-muted-foreground">WhatsApp: {testProvResult.provision_result.whatsapp_sent ? '✅ Terkirim' : '⏭️ Tidak dikirim (no phone)'}</p>
                      )}
                      {testProvResult.error && (
                        <p className="text-xs text-destructive">{testProvResult.error}</p>
                      )}
                      {testProvResult.provision_result?.error && (
                        <p className="text-xs text-destructive">{testProvResult.provision_result.error}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* TEST PARTNER WEBHOOK */}
                <div className="border-t border-border pt-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">🔗 Test Webhook Partner</h3>
                    <p className="text-xs text-muted-foreground mt-1">Test koneksi webhook partner: verifikasi HMAC, cek data customer, dan kirim WA test. Pilih partner dari daftar signing secret yang sudah terdaftar.</p>
                  </div>

                  <div className="rounded-lg border border-dashed border-border p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-foreground">Partner *</label>
                        <select value={partnerTestForm.partner} onChange={(e) => setPartnerTestForm(p => ({ ...p, partner: e.target.value }))}
                          className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs">
                          <option value="">-- Pilih Partner --</option>
                          {signingSecrets.map((s: any, i: number) => (
                            <option key={i} value={s.secret}>{s.label} ({s.secret.slice(0, 8)}...)</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-foreground">Product Code</label>
                        <select value={partnerTestForm.product_code} onChange={(e) => setPartnerTestForm(p => ({ ...p, product_code: e.target.value }))}
                          className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs">
                          <option value="LPE">LPE (Landing Page Engine)</option>
                          <option value="SWA">SWA (Story Weaver AI)</option>
                          <option value="PEA">PEA (Property Enhancer AI)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-foreground">Email</label>
                        <Input value={partnerTestForm.email} onChange={(e) => setPartnerTestForm(p => ({ ...p, email: e.target.value }))} placeholder="test@example.com" className="text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-foreground">Nama</label>
                        <Input value={partnerTestForm.name} onChange={(e) => setPartnerTestForm(p => ({ ...p, name: e.target.value }))} placeholder="Test Partner" className="text-xs" />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-medium text-foreground">No. WhatsApp (opsional, isi jika mau test kirim WA)</label>
                        <Input value={partnerTestForm.phone} onChange={(e) => setPartnerTestForm(p => ({ ...p, phone: e.target.value }))} placeholder="08123456789" className="text-xs" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button size="sm" disabled={partnerTestLoading || !partnerTestForm.partner} onClick={async () => {
                        setPartnerTestLoading(true);
                        setPartnerTestResult(null);
                        try {
                          const { data, error } = await supabase.functions.invoke('admin-users', {
                            body: {
                              action: 'test_partner_webhook',
                              partner_secret: partnerTestForm.partner,
                              email: partnerTestForm.email,
                              name: partnerTestForm.name,
                              phone: partnerTestForm.phone,
                              tier: partnerTestForm.product_code,
                            },
                          });
                          if (error) {
                            setPartnerTestResult({ success: false, error: error.message });
                          } else {
                            setPartnerTestResult(data);
                            if (data?.success) {
                              showToast({ title: '✅ Webhook partner berhasil!' });
                            } else {
                              showToast({ title: '❌ Webhook partner gagal', description: data?.gateway_result?.error || data?.error || 'Unknown', variant: 'destructive' });
                            }
                          }
                        } catch (err: any) {
                          setPartnerTestResult({ success: false, error: err.message });
                        }
                        setPartnerTestLoading(false);
                      }}>
                        {partnerTestLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1" /> : <Rocket className="h-3.5 w-3.5 mr-1" />}
                        {partnerTestLoading ? 'Testing...' : 'Test Koneksi Partner'}
                      </Button>
                      <p className="text-[10px] text-muted-foreground">Mengirim fake webhook dengan HMAC partner untuk verifikasi koneksi.</p>
                    </div>
                  </div>

                  {partnerTestResult && (
                    <div className={`rounded-lg border p-4 space-y-3 ${partnerTestResult.success ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-destructive/30 bg-destructive/5'}`}>
                      {/* HMAC Status */}
                      <div className="flex items-center gap-2">
                        {partnerTestResult.hmac_valid ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-destructive" />}
                        <p className="text-sm font-semibold text-foreground">HMAC: {partnerTestResult.hmac_valid ? '✅ Valid' : '❌ Invalid — Secret tidak cocok'}</p>
                      </div>

                      {/* Customer Data */}
                      {partnerTestResult.customer_data && (
                        <div className="bg-background/50 rounded-md p-3 space-y-1">
                          <p className="text-xs font-medium text-foreground mb-1">📋 Data Customer (parsed):</p>
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            <span className="text-muted-foreground">Email:</span>
                            <span className={`font-mono ${partnerTestResult.customer_data.email ? 'text-foreground' : 'text-destructive font-semibold'}`}>
                              {partnerTestResult.customer_data.email || '⚠️ NULL'}
                            </span>
                            <span className="text-muted-foreground">Nama:</span>
                            <span className={`font-mono ${partnerTestResult.customer_data.name ? 'text-foreground' : 'text-destructive font-semibold'}`}>
                              {partnerTestResult.customer_data.name || '⚠️ NULL'}
                            </span>
                            <span className="text-muted-foreground">Phone:</span>
                            <span className={`font-mono ${partnerTestResult.customer_data.phone && !partnerTestResult.customer_data.phone_is_null ? 'text-foreground' : 'text-amber-500 font-semibold'}`}>
                              {partnerTestResult.customer_data.phone || '⚠️ Kosong (WA tidak terkirim)'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Gateway result */}
                      <div className="text-xs text-muted-foreground">
                        <span>Gateway Status: <span className="font-mono">{partnerTestResult.gateway_status}</span></span>
                        {partnerTestResult.test_order_id && <span className="ml-3">Order: <span className="font-mono">{partnerTestResult.test_order_id}</span></span>}
                      </div>

                      {/* WA status from gateway result */}
                      {partnerTestResult.gateway_result?.whatsapp_sent !== undefined && (
                        <p className="text-xs">WhatsApp: {partnerTestResult.gateway_result.whatsapp_sent ? '✅ Terkirim' : '⏭️ Tidak dikirim'}</p>
                      )}

                      {partnerTestResult.error && <p className="text-xs text-destructive">{partnerTestResult.error}</p>}
                      {partnerTestResult.gateway_result?.error && <p className="text-xs text-destructive">{partnerTestResult.gateway_result.error}</p>}
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">📺 Video Tutorial</h3>
                      <p className="text-xs text-muted-foreground">Kelola video tutorial yang ditampilkan di dashboard user</p>
                    </div>
                    <Button size="sm" onClick={() => { setEditTutId(null); setTutForm({ title: '', description: '', youtube_url: '', sort_order: 0, is_active: true }); setTutDialog(true); }}>
                      + Tambah Video
                    </Button>
                  </div>

                  {tutorialsList.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-8">Belum ada video tutorial.</p>
                  ) : (
                    <div className="space-y-2">
                      {tutorialsList.map((tut) => (
                        <div key={tut.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary">
                          <span className="text-xs text-muted-foreground font-mono w-6 text-center">{tut.sort_order}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{tut.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{tut.youtube_url}</p>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tut.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                            {tut.is_active ? 'Aktif' : 'Nonaktif'}
                          </span>
                          <Button variant="outline" size="sm" onClick={() => {
                            setEditTutId(tut.id);
                            setTutForm({ title: tut.title, description: tut.description || '', youtube_url: tut.youtube_url, sort_order: tut.sort_order, is_active: tut.is_active });
                            setTutDialog(true);
                          }}>Edit</Button>
                          <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={async () => {
                            if (!confirm('Hapus video tutorial ini?')) return;
                            await supabase.from('tutorials').delete().eq('id', tut.id);
                            showToast({ title: 'Video tutorial dihapus.' });
                            await fetchTutorials();
                          }}>🗑</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LP BUILDER TAB */}
          <TabsContent value="lpbuilder">
            <div className="space-y-6">
              <Tabs defaultValue="demos">
                <TabsList className="w-full grid grid-cols-2 h-10">
                  <TabsTrigger value="demos" className="text-xs sm:text-sm gap-1">🖼 Demos</TabsTrigger>
                  <TabsTrigger value="generate" className="text-xs sm:text-sm gap-1">⚡ Generate HTML</TabsTrigger>
                </TabsList>
                <TabsContent value="demos" className="mt-6"><DemoManagementTab /></TabsContent>
                <TabsContent value="generate" className="mt-6"><HtmlGeneratorTab /></TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Tutorial Dialog */}
      <Dialog open={tutDialog} onOpenChange={setTutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTutId ? '✏️ Edit Video Tutorial' : '➕ Tambah Video Tutorial'}</DialogTitle>
            <DialogDescription>Masukkan link YouTube dan informasi video tutorial.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Judul Video *</label>
              <Input value={tutForm.title} onChange={(e) => setTutForm(p => ({ ...p, title: e.target.value }))} placeholder="Cara Generate Prompt..." />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Deskripsi</label>
              <Textarea value={tutForm.description} onChange={(e) => setTutForm(p => ({ ...p, description: e.target.value }))} placeholder="Deskripsi singkat..." className="min-h-[60px]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">URL YouTube *</label>
              <Input value={tutForm.youtube_url} onChange={(e) => setTutForm(p => ({ ...p, youtube_url: e.target.value }))} placeholder="https://www.youtube.com/watch?v=..." />
              {tutForm.youtube_url && (() => {
                const match = tutForm.youtube_url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                if (match) return (
                  <div className="mt-2 rounded-lg overflow-hidden border border-border aspect-video">
                    <iframe src={`https://www.youtube.com/embed/${match[1]}`} className="w-full h-full" allowFullScreen title="Preview" />
                  </div>
                );
                return null;
              })()}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Urutan</label>
                <Input type="number" value={tutForm.sort_order} onChange={(e) => setTutForm(p => ({ ...p, sort_order: Number(e.target.value) }))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Status</label>
                <button type="button" onClick={() => setTutForm(p => ({ ...p, is_active: !p.is_active }))} className={`px-3 py-2 rounded-lg text-sm border transition-all ${tutForm.is_active ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-secondary text-muted-foreground border-border'}`}>
                  {tutForm.is_active ? '✅ Aktif' : '❌ Nonaktif'}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTutDialog(false)}>Batal</Button>
            <Button disabled={tutLoading} onClick={async () => {
              if (!tutForm.title || !tutForm.youtube_url) { showToast({ title: 'Error', description: 'Judul dan URL YouTube wajib diisi.', variant: 'destructive' }); return; }
              setTutLoading(true);
              if (editTutId) {
                await supabase.from('tutorials').update({ title: tutForm.title, description: tutForm.description || null, youtube_url: tutForm.youtube_url, sort_order: tutForm.sort_order, is_active: tutForm.is_active }).eq('id', editTutId);
                showToast({ title: 'Video tutorial diupdate!' });
              } else {
                await supabase.from('tutorials').insert({ title: tutForm.title, description: tutForm.description || null, youtube_url: tutForm.youtube_url, sort_order: tutForm.sort_order, is_active: tutForm.is_active });
                showToast({ title: 'Video tutorial ditambahkan!' });
              }
              setTutDialog(false);
              setEditTutId(null);
              await fetchTutorials();
              setTutLoading(false);
            }}>{tutLoading ? 'Menyimpan...' : editTutId ? '💾 Update' : '💾 Simpan'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      {/* Bulk Add Members Dialog */}
      <Dialog open={bulkAddDialog} onOpenChange={(open) => { if (!open) { setBulkAddDialog(false); setBulkAddResults(null); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Tambah Member Massal</DialogTitle>
            <DialogDescription>Isi data member per baris, lalu klik Tambah Semua.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-3 py-2">
            {/* Header row */}
            <div className="grid grid-cols-[1fr_1fr_1fr_36px] gap-2 px-1">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase">Email *</label>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase">Nama</label>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase">Password *</label>
              <span />
            </div>
            {/* Rows */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {bulkAddRows.map((row, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_1fr_36px] gap-2 items-center">
                  <Input
                    type="email"
                    placeholder="email@contoh.com"
                    value={row.email}
                    onChange={(e) => { const next = [...bulkAddRows]; next[i] = { ...next[i], email: e.target.value }; setBulkAddRows(next); }}
                    className="text-xs h-9"
                  />
                  <Input
                    placeholder="Nama"
                    value={row.name}
                    onChange={(e) => { const next = [...bulkAddRows]; next[i] = { ...next[i], name: e.target.value }; setBulkAddRows(next); }}
                    className="text-xs h-9"
                  />
                  <Input
                    type="text"
                    placeholder="Min. 6 karakter"
                    value={row.password}
                    onChange={(e) => { const next = [...bulkAddRows]; next[i] = { ...next[i], password: e.target.value }; setBulkAddRows(next); }}
                    className="text-xs h-9"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 text-destructive hover:bg-destructive/10"
                    onClick={() => { if (bulkAddRows.length > 1) { setBulkAddRows(bulkAddRows.filter((_, idx) => idx !== i)); } else { setBulkAddRows([{ email: '', name: '', password: '' }]); } }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" className="gap-1 text-xs" onClick={() => setBulkAddRows([...bulkAddRows, { email: '', name: '', password: '' }])}>
              <UserPlus className="h-3.5 w-3.5" /> Tambah Baris
            </Button>

            <div className="flex items-center justify-between pt-2">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase mb-1 block">Tier Akses</label>
                <div className="flex gap-2">
                  {(['free', 'paid'] as const).map(t => (
                    <button key={t} type="button" onClick={() => setBulkAddTier(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${bulkAddTier === t ? 'bg-primary/10 text-primary border-primary' : 'bg-secondary text-muted-foreground border-border'}`}>
                      {t === 'paid' ? '⭐ Berbayar' : '🆓 Gratis'}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{bulkAddRows.filter(r => r.email.trim()).length} member</p>
            </div>

            {bulkAddResults && (
              <div className="rounded-lg border border-border p-3 max-h-[150px] overflow-y-auto space-y-1">
                <p className="text-xs font-semibold text-foreground mb-2">Hasil:</p>
                {bulkAddResults.map((r, i) => (
                  <div key={i} className={`text-xs flex items-center gap-2 ${r.success ? 'text-emerald-500' : 'text-destructive'}`}>
                    {r.success ? <CheckCircle className="h-3 w-3 flex-shrink-0" /> : <XCircle className="h-3 w-3 flex-shrink-0" />}
                    <span className="truncate">{r.email}</span>
                    {r.error && <span className="text-muted-foreground truncate">— {r.error}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkAddDialog(false)}>Tutup</Button>
            <Button onClick={handleBulkAddMembers} disabled={bulkAddLoading}>{bulkAddLoading ? "Memproses..." : "🚀 Tambah Semua"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
