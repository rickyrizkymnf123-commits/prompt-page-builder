import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  RefreshCw, KeyRound, Search, UserCheck, UserX, Moon, Sun, Rocket, Zap, RotateCcw, Copy, ExternalLink, UserPlus, Layout, Settings, Lock, Eye, EyeOff, Video, Plus, ShieldCheck, FolderOpen,
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
import { FormState, initialFormState, BonusItem, ScarcitySeatConfig } from "@/types/form";
import { StepSalesNotif } from "@/components/steps/StepSalesNotif";
import { StepCountdown } from "@/components/steps/StepCountdown";
import { generatePrompt } from "@/utils/generatePrompt";
import { HtmlPreviewEditor } from "@/components/editor/HtmlPreviewEditor";
import { sampleTemplates } from "@/data/sampleTemplates";
import { motion } from "framer-motion";
import { TypewriterText } from "@/components/TypewriterText";
import DemoManagementTab from "@/components/admin/DemoManagementTab";
import HtmlGeneratorTab from "@/components/admin/HtmlGeneratorTab";
import { SavedProjectsDialog } from "@/components/projects/SavedProjectsDialog";
import { LandingPageAuditor } from "@/components/audit/LandingPageAuditor";
import { AffiliateProgram } from "@/components/affiliate/AffiliateProgram";
import { SidebarDrawer } from "@/components/navigation/SidebarDrawer";
import { AiApiSettings } from "@/components/settings/AiApiSettings";
import { CompetitorSpy } from "@/components/tools/CompetitorSpy";
import { CreativeSync } from "@/components/tools/CreativeSync";
import { FiveSecondTest } from "@/components/tools/FiveSecondTest";
import { QuickPromptMode } from "@/components/tools/QuickPromptMode";
import { Globe, Menu } from "lucide-react";

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
  const [filterTier, setFilterTier] = useState<string>("all");
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
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || localStorage.getItem("admin_active_tab") || "tools";
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<'id' | 'en'>('id');

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    const tabFromStorage = localStorage.getItem("admin_active_tab");
    const targetTab = tabFromUrl || tabFromStorage || "tools";
    if (activeTab !== targetTab) {
      setActiveTab(targetTab);
    }
    if (!tabFromUrl) {
      setSearchParams({ tab: targetTab }, { replace: true });
    }
  }, [searchParams]);

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    setSearchParams({ tab: val }, { replace: true });
    try {
      localStorage.setItem("admin_active_tab", val);
    } catch {}
  };

  const { toast: showToast } = useToast();

  useEffect(() => { document.documentElement.classList.toggle("dark", darkMode); }, [darkMode]);

  const fetchUsers = async () => {
    try {
      // 1. Query Edge Function if available
      let edgeUsers: any[] = [];
      try {
        const { data, error } = await supabase.functions.invoke("admin-users", { body: { action: "list" } });
        if (!error && data?.users && Array.isArray(data.users)) {
          edgeUsers = data.users;
        }
      } catch {}

      // 2. Query Direct Database Tables
      const [profilesRes, entRes, rolesRes, usageRes] = await Promise.all([
        supabase.from("profiles").select("*"),
        supabase.from("entitlements").select("*"),
        supabase.from("user_roles").select("*"),
        supabase.from("prompt_usage").select("*"),
      ]);

      const profiles = profilesRes.data || [];
      const entitlements = entRes.data || [];
      const roles = rolesRes.data || [];
      const usages = usageRes.data || [];

      // Create a map of all known user_ids
      const userMap = new Map<string, any>();

      // Populate from Profiles first (Direct DB truth for name, email, phone)
      for (const p of profiles) {
        userMap.set(p.user_id, {
          id: p.user_id,
          name: p.name || "-",
          phone: p.phone || "",
          email: p.email || (p.name ? `${p.name.toLowerCase().replace(/\s+/g, '')}@user.local` : `user-${p.user_id.slice(0, 8)}`),
          created_at: p.created_at || new Date().toISOString(),
        });
      }

      // Populate / merge from Edge users
      for (const eu of edgeUsers) {
        const existing = userMap.get(eu.id) || { id: eu.id };
        userMap.set(eu.id, {
          ...existing,
          ...eu,
          name: existing.name && existing.name !== "-" ? existing.name : eu.name || "-",
          phone: existing.phone || eu.phone || "",
          email: existing.email || eu.email || `user-${eu.id.slice(0, 8)}`,
        });
      }

      // Populate / merge from Entitlements
      for (const e of entitlements) {
        const existing = userMap.get(e.user_id) || { id: e.user_id };
        userMap.set(e.user_id, {
          ...existing,
          id: e.user_id,
          entitlement_id: e.id,
          product_code: e.product_code || existing.product_code || "LPE",
          status: e.status || existing.status || "pending",
          created_at: existing.created_at || e.created_at,
        });
      }

      // Populate / merge from Roles
      for (const r of roles) {
        const existing = userMap.get(r.user_id) || { id: r.user_id };
        userMap.set(r.user_id, {
          ...existing,
          id: r.user_id,
          role: r.role || existing.role || "user",
        });
      }

      // Populate / merge from Usages
      for (const u of usages) {
        const existing = userMap.get(u.user_id) || { id: u.user_id };
        userMap.set(u.user_id, {
          ...existing,
          id: u.user_id,
          prompt_used: u.used_count || 0,
        });
      }

      // Format clean list
      const unifiedUsers = Array.from(userMap.values()).map(u => ({
        id: u.id,
        email: u.email || `user-${u.id.slice(0, 8)}`,
        name: u.name || "-",
        phone: u.phone || "",
        role: u.role || (u.email === "fauzymnf29@gmail.com" ? "admin" : "user"),
        product_code: u.product_code || "LPE",
        status: u.status || "pending",
        entitlement_id: u.entitlement_id || null,
        prompt_used: u.prompt_used || 0,
        created_at: u.created_at || new Date().toISOString(),
        last_sign_in: u.last_sign_in || null,
      }));

      // Sort with pending first, then newest
      unifiedUsers.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setUsers(unifiedUsers);
    } catch (err) {
      console.error("fetchUsers error:", err);
    }
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
    let list: any[] = [];
    try {
      const { data } = await supabase.from('tutorials').select('*').order('sort_order', { ascending: true });
      if (data && data.length > 0) list = data;
    } catch {}
    if (list.length === 0) {
      const localTut = localStorage.getItem('admin_tutorials');
      if (localTut) {
        try { list = JSON.parse(localTut); } catch {}
      }
    }
    setTutorialsList(list);
  };

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }
      const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).maybeSingle();
      if (roleData?.role !== "admin" && session.user.email !== "fauzymnf29@gmail.com") { navigate("/app"); return; }
      setAuthorized(true);
      await Promise.all([fetchUsers(), fetchLogs(), fetchTemplates(), fetchSettings(), fetchTutorials()]);
      setLoading(false);
    };
    check();
  }, [navigate]);

  const handleApprove = async (userId: string, entitlementId?: string | null) => {
    setActionLoading(userId);
    try {
      if (entitlementId) {
        await supabase.from("entitlements").update({ status: "active", product_code: "LPE" }).eq("id", entitlementId);
      } else {
        await supabase.from("entitlements").upsert({
          user_id: userId,
          order_id: "acc-" + Date.now(),
          product_code: "LPE",
          status: "active",
        }, { onConflict: "user_id" });
      }
      // Ensure user role exists
      await supabase.from("user_roles").upsert({ user_id: userId, role: "user" }, { onConflict: "user_id" });
      showToast({ title: "✅ Berhasil di-ACC", description: "Pengguna sekarang aktif dan dapat login." });
    } catch (e: any) {
      showToast({ title: "Error", description: e.message, variant: "destructive" });
    }
    await fetchUsers();
    setActionLoading(null);
  };

  const handleReject = async (userId: string, entitlementId?: string | null) => {
    setActionLoading(userId);
    try {
      if (entitlementId) {
        await supabase.from("entitlements").update({ status: "rejected" }).eq("id", entitlementId);
      } else {
        await supabase.from("entitlements").upsert({
          user_id: userId,
          order_id: "rej-" + Date.now(),
          product_code: "LPE",
          status: "rejected",
        }, { onConflict: "user_id" });
      }
      showToast({ title: "❌ User Ditolak", description: "Status pendaftaran pengguna diset ke Ditolak." });
    } catch (e: any) {
      showToast({ title: "Error", description: e.message, variant: "destructive" });
    }
    await fetchUsers();
    setActionLoading(null);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Yakin ingin menghapus user ini secara permanen?')) return;
    setActionLoading(userId);
    try {
      await Promise.all([
        supabase.from("profiles").delete().eq("user_id", userId),
        supabase.from("entitlements").delete().eq("user_id", userId),
        supabase.from("user_roles").delete().eq("user_id", userId),
        supabase.from("prompt_usage").delete().eq("user_id", userId),
        supabase.from("user_signing_secrets").delete().eq("user_id", userId),
      ]);
      try {
        await supabase.functions.invoke("admin-users", { body: { action: "delete", user_id: userId } });
      } catch {}
      showToast({ title: "🗑 User Dihapus", description: "Data user berhasil dihapus dari sistem." });
    } catch (e: any) {
      showToast({ title: "Error", description: e.message, variant: "destructive" });
    }
    await fetchUsers();
    setActionLoading(null);
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      showToast({ title: "Error", description: "Password minimal 6 karakter.", variant: "destructive" });
      return;
    }
    setActionLoading(resetDialog.userId);
    try {
      // 1. Direct RPC password reset
      const { data: rpcData, error: rpcError } = await supabase.rpc('admin_set_user_password', {
        target_user_id: resetDialog.userId,
        new_plain_password: newPassword,
      });

      if (rpcError) {
        // Fallback to Edge function if RPC fails
        try {
          await supabase.functions.invoke("admin-users", {
            body: { action: "reset_password", user_id: resetDialog.userId, password: newPassword }
          });
        } catch {}
      }

      showToast({ title: "✅ Berhasil", description: `Password berhasil direset untuk ${resetDialog.email}` });
      setResetDialog({ open: false, userId: "", email: "" });
      setNewPassword("");
      setShowNewPassword(false);
    } catch (err: any) {
      showToast({ title: "Gagal", description: err.message || "Gagal mereset password.", variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangeTier = async (userId: string, newTier: 'free' | 'paid') => {
    setActionLoading(userId);
    const prod = newTier === 'paid' ? 'LPE' : 'LPE_FREE';
    await supabase.from("entitlements").update({ product_code: prod }).eq("user_id", userId);
    showToast({ title: `Tier diubah ke ${newTier === 'paid' ? 'Berbayar' : 'Gratis'}` });
    await fetchUsers();
    setActionLoading(null);
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

    try {
      if (bulkDialog.action === 'approve') {
        for (const uid of ids) {
          await supabase.from("entitlements").update({ status: "active", product_code: "LPE" }).eq("user_id", uid);
        }
        showToast({ title: `✅ ${ids.length} User Berhasil di-ACC!` });
      } else if (bulkDialog.action === 'reject') {
        for (const uid of ids) {
          await supabase.from("entitlements").update({ status: "rejected" }).eq("user_id", uid);
        }
        showToast({ title: `❌ ${ids.length} User Ditolak.` });
      } else if (bulkDialog.action === 'delete') {
        for (const uid of ids) {
          await Promise.all([
            supabase.from("profiles").delete().eq("user_id", uid),
            supabase.from("entitlements").delete().eq("user_id", uid),
            supabase.from("user_roles").delete().eq("user_id", uid),
            supabase.from("prompt_usage").delete().eq("user_id", uid),
            supabase.from("user_signing_secrets").delete().eq("user_id", uid),
          ]);
          try {
            await supabase.functions.invoke("admin-users", { body: { action: "delete", user_id: uid } });
          } catch {}
        }
        showToast({ title: `🗑 ${ids.length} User Berhasil Dihapus!` });
      } else if (bulkDialog.action === 'tier_paid' || bulkDialog.action === 'tier_free') {
        const prod = bulkDialog.action === 'tier_paid' ? 'LPE' : 'LPE_FREE';
        for (const uid of ids) {
          await supabase.from("entitlements").update({ product_code: prod }).eq("user_id", uid);
        }
        showToast({ title: `✅ ${ids.length} User diubah ke ${bulkDialog.action === 'tier_paid' ? 'Berbayar' : 'Gratis'}` });
      } else if (bulkDialog.action === 'reset_password') {
        if (!bulkPassword || bulkPassword.length < 6) {
          showToast({ title: "Error", description: "Password minimal 6 karakter.", variant: "destructive" });
          setBulkLoading(false);
          return;
        }
        for (const uid of ids) {
          try {
            await supabase.rpc('admin_set_user_password', { target_user_id: uid, new_plain_password: bulkPassword });
          } catch {}
        }
        showToast({ title: `✅ Password ${ids.length} user berhasil direset` });
      }
    } catch (err: any) {
      showToast({ title: "Gagal memproses aksi massal", description: err.message, variant: "destructive" });
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
  const handleScarcityChange = useCallback((config: ScarcitySeatConfig) => {
    setForm(prev => ({ ...prev, scarcitySeat: config }));
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
    const matchTier = filterTier === "all" || (filterTier === "paid" ? u.product_code === "LPE" : u.product_code !== "LPE");
    return matchSearch && matchStatus && matchTier;
  });
  const pendingCount = users.filter(u => u.status === "pending").length;
  const activeCount = users.filter(u => u.status === "active").length;
  const rejectedCount = users.filter(u => u.status === "rejected").length;
  const paidCount = users.filter(u => u.product_code === "LPE").length;
  const freeCount = users.filter(u => u.product_code !== "LPE").length;

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="flex items-center gap-3"><RefreshCw className="h-5 w-5 animate-spin text-primary" /><p className="text-muted-foreground">{authorized ? "Memuat data..." : "Memeriksa akses..."}</p></div></div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header with Hamburger ☰ and Language Switcher beside Dark Mode */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-xl px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="w-9 h-9 rounded-xl bg-secondary hover:bg-secondary/80 border border-border flex items-center justify-center text-foreground transition-all hover:border-primary/50 flex-shrink-0 shadow-sm"
            title="Buka Menu & Fitur AI"
          >
            <Menu className="w-5 h-5 text-primary" />
          </button>

          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-600/30">
            <Rocket className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-white" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black text-foreground truncate">
                Landing Page <span className="text-primary">Builder</span>
              </h1>
              <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.2 rounded-full">
                👑 Admin
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground hidden sm:block">Control Center & AI Engine</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-bold text-foreground transition-all hover:border-primary/50 shadow-sm"
            title="Ganti Bahasa (Language Switcher)"
          >
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span>{language === 'en' ? '🇬🇧 EN' : '🇮🇩 ID'}</span>
          </button>

          {/* Dark / Light Mode */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-secondary/50 border border-border"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-400" />}
          </Button>

          {/* Logout */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-secondary/50 border border-border hover:bg-red-500/15 hover:text-red-400"
            onClick={async () => { await supabase.auth.signOut(); navigate("/login"); }}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Slide-out Sidebar Drawer */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab === 'tools' ? 'generator' : activeTab}
        onSelectTab={(tab) => {
          handleTabChange(tab === 'generator' ? 'tools' : tab);
          setIsSidebarOpen(false);
        }}
        isAdmin={true}
        pendingUsersCount={pendingCount}
        onLogout={async () => {
          await supabase.auth.signOut();
          navigate('/login');
        }}
      />

      {/* Clean Sub-header Bar with Active Menu Title */}
      <div className="border-b border-border/70 bg-card/60 px-3 sm:px-6 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-foreground hover:text-primary transition-colors"
          >
            <Menu className="w-4 h-4 text-primary" />
            <span>
              {activeTab === 'tools' || activeTab === 'generator'
                ? '🚀 Landing Page Generator'
                : activeTab === 'quick_prompt'
                ? '⚡ Prompt Cepat (AI Auto-Fill)'
                : activeTab === 'api_settings'
                ? '⚙️ Konfigurasi API AI (KoboiLLM / OpenAI)'
                : activeTab === 'competitor_spy'
                ? '🕵️‍♂️ AI Competitor Spy Tool'
                : activeTab === 'creative_sync'
                ? '🎬 Creative-to-Landing Page Sync'
                : activeTab === 'five_second'
                ? '⏱️ Tes 5 Detik (Clarity Test)'
                : activeTab === 'audit'
                ? '🔍 AI Landing Page Auditor'
                : activeTab === 'templates'
                ? '📋 Kelola Template Landing Page'
                : activeTab === 'affiliate'
                ? '🤝 Kelola Program Affiliate'
                : activeTab === 'users'
                ? `👥 Kelola Pengguna (${pendingCount > 0 ? `${pendingCount} Pending` : 'Semua User'})`
                : activeTab === 'logs'
                ? '📄 Aktivitas & Log Webhook'
                : activeTab === 'settings'
                ? '⚙️ Pengaturan Sistem & Webhook'
                : activeTab === 'lpbuilder'
                ? '🚀 Live LP Builder Engine'
                : 'Menu Administrator'}
            </span>
          </button>

          <div className="flex items-center gap-2">
            {activeTab !== 'tools' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTabChange('tools')}
                className="text-xs h-8 gap-1 font-semibold"
              >
                ← Ke Generator
              </Button>
            )}

            <SavedProjectsDialog
              currentForm={form}
              onLoadProject={(formData) => {
                setForm(formData);
                setPromptText("");
                setToolStep(1);
                handleTabChange('tools');
              }}
            />
          </div>
        </div>
      </div>

      <main className="flex-1 px-3 py-4 sm:p-6 max-w-[1400px] mx-auto w-full">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 sm:space-y-6">
          {/* KOBOILLM AI API CONFIGURATION TAB */}
          <TabsContent value="api_settings">
            <AiApiSettings />
          </TabsContent>

          {/* QUICK PROMPT TAB */}
          <TabsContent value="quick_prompt">
            <QuickPromptMode
              onApplyQuickForm={(quickForm) => {
                setForm(quickForm);
                handleTabChange('tools');
              }}
            />
          </TabsContent>

          {/* COMPETITOR SPY TAB */}
          <TabsContent value="competitor_spy">
            <CompetitorSpy />
          </TabsContent>

          {/* CREATIVE SYNC TAB */}
          <TabsContent value="creative_sync">
            <CreativeSync />
          </TabsContent>

          {/* FIVE SECOND TEST TAB */}
          <TabsContent value="five_second">
            <FiveSecondTest />
          </TabsContent>

          {/* AFFILIATE TAB */}
          <TabsContent value="affiliate">
            <AffiliateProgram isAdmin={true} />
          </TabsContent>

          {/* AUDIT LP TAB */}
          <TabsContent value="audit">
            <LandingPageAuditor />
          </TabsContent>

          {/* TOOLS TAB */}
          <TabsContent value="tools">
            <div className="flex items-center justify-between gap-2 max-w-3xl pb-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Prompt Generator Wizard</span>
              <SavedProjectsDialog
                currentForm={form}
                onLoadProject={(formData) => {
                  setForm(formData);
                  setPromptText("");
                  setToolStep(1);
                }}
              />
            </div>

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
                <Step4Detail
                  namaProduk={form.namaProduk}
                  hargaNormal={form.hargaNormal}
                  hargaPromo={form.hargaPromo}
                  hargaFinal={form.hargaFinal}
                  keteranganDiskon={form.keteranganDiskon}
                  pricingLayersConfig={form.pricingLayersConfig}
                  bonusList={form.bonusList}
                  deskripsiBenefit={form.deskripsiBenefit}
                  ctaUtama={form.ctaUtama}
                  onChange={handleChange}
                  onChangeBonusList={handleChangeBonusList}
                />
                <Step5Design warnaBrand={form.warnaBrand} tema={form.tema} gayaDesain={form.gayaDesain} onChange={handleChange} />
                <Step6Elements elemenTambahan={form.elemenTambahan} onToggle={handleToggleElement} />
                <Step7Platform platformTarget={form.platformTarget} deviceTarget={form.deviceTarget} onChange={handleChange} />
                <StepSalesNotif salesNotif={form.salesNotif} onChange={handleSalesNotifChange} />
                <StepCountdown
                  countdown={form.countdown}
                  scarcitySeat={form.scarcitySeat}
                  onChange={handleCountdownChange}
                  onChangeScarcity={handleScarcityChange}
                />
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-4 sm:mb-6">
              {[
                { label: "Total User", count: users.length, icon: <Users className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />, filter: "all", type: "status" },
                { label: "Pending", count: pendingCount, icon: <Clock className="h-5 w-5 sm:h-7 sm:w-7 text-amber-500" />, filter: "pending", type: "status" },
                { label: "Aktif", count: activeCount, icon: <UserCheck className="h-5 w-5 sm:h-7 sm:w-7 text-emerald-500" />, filter: "active", type: "status" },
                { label: "Ditolak", count: rejectedCount, icon: <UserX className="h-5 w-5 sm:h-7 sm:w-7 text-destructive" />, filter: "rejected", type: "status" },
                { label: "Berbayar", count: paidCount, icon: <span className="text-lg sm:text-2xl">⭐</span>, filter: "paid", type: "tier" },
                { label: "Gratis", count: freeCount, icon: <span className="text-lg sm:text-2xl">🆓</span>, filter: "free", type: "tier" },
              ].map(s => (
                <Card key={s.filter} className={`cursor-pointer hover:border-primary/50 transition-colors ${(s.type === 'status' ? filterStatus === s.filter : filterTier === s.filter) ? 'border-primary' : ''}`} onClick={() => {
                  if (s.type === 'tier') { setFilterTier(filterTier === s.filter ? 'all' : s.filter); }
                  else { setFilterStatus(s.filter); }
                }}>
                  <CardContent className="p-2 sm:p-3 flex items-center gap-2">{s.icon}<div><p className="text-base sm:text-xl font-bold text-foreground">{s.count}</p><p className="text-[9px] sm:text-[10px] text-muted-foreground">{s.label}</p></div></CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader className="flex flex-col gap-2 p-3 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base"><Users className="h-4 w-4 sm:h-5 sm:w-5" /> User ({filteredUsers.length})</CardTitle>
                <div className="flex items-center gap-2 w-full">
                  <div className="relative flex-1 min-w-0"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Cari nama / email / HP..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 text-sm h-9" /></div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button variant="outline" size="sm" className="gap-1 h-9" onClick={() => setAddMemberDialog(true)}><UserPlus className="h-4 w-4" /> <span className="hidden sm:inline">Add</span></Button>
                    <Button variant="outline" size="sm" className="gap-1 h-9" onClick={() => { setBulkAddDialog(true); setBulkAddResults(null); setBulkAddRows([{ email: '', name: '', password: '' }]); }}><Users className="h-4 w-4" /> <span className="hidden sm:inline">Bulk</span></Button>
                    <Button variant="outline" size="sm" className="px-2 h-9" onClick={() => { fetchUsers(); fetchLogs(); }}><RefreshCw className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap items-center">
                  {["all","pending","active","rejected"].map(s => (
                    <Button key={s} size="sm" variant={filterStatus===s?"default":"outline"} onClick={() => setFilterStatus(s)} className="text-[10px] sm:text-xs capitalize h-7 sm:h-8 px-2 sm:px-3">{s==="all"?"Semua":s}</Button>
                  ))}
                  <span className="text-muted-foreground text-xs">|</span>
                  {[{k:"all",l:"Semua Tier"},{k:"paid",l:"⭐ Berbayar"},{k:"free",l:"🆓 Gratis"}].map(t => (
                    <Button key={t.k} size="sm" variant={filterTier===t.k?"default":"outline"} onClick={() => setFilterTier(t.k)} className="text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3">{t.l}</Button>
                  ))}
                  {selectedUsers.size > 0 && (
                    <div className="flex gap-1.5 flex-wrap w-full sm:w-auto sm:ml-auto mt-1 sm:mt-0 items-center bg-secondary/80 p-1.5 rounded-lg border border-border">
                      <span className="text-xs font-semibold text-primary px-1">{selectedUsers.size} dipilih:</span>
                      <Button size="sm" variant="outline" onClick={() => setBulkDialog({ open: true, action: 'approve' })} className="text-xs gap-1 h-7 border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10">
                        <CheckCircle className="h-3.5 w-3.5" /> ACC
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setBulkDialog({ open: true, action: 'reject' })} className="text-xs gap-1 h-7 border-amber-500/40 text-amber-500 hover:bg-amber-500/10">
                        <XCircle className="h-3.5 w-3.5" /> Tolak
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setBulkDialog({ open: true, action: 'tier_paid' })} className="text-xs gap-1 h-7">
                        ⭐ Berbayar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setBulkDialog({ open: true, action: 'tier_free' })} className="text-xs gap-1 h-7">
                        🆓 Gratis
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setBulkDialog({ open: true, action: 'reset_password' })} className="text-xs gap-1 h-7">
                        <KeyRound className="h-3.5 w-3.5" /> Reset Pass
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => setBulkDialog({ open: true, action: 'delete' })} className="text-xs gap-1 h-7">
                        <Trash2 className="h-3.5 w-3.5" /> Hapus Terpilih
                      </Button>
                    </div>
                  )}
                </div>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10">
                          <Checkbox checked={selectedUsers.size > 0 && selectedUsers.size === filteredUsers.filter(u => u.role !== 'admin').length} onCheckedChange={toggleSelectAll} />
                        </TableHead>
                        <TableHead>User / Kontak</TableHead>
                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                        <TableHead>Tier & Usage</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden lg:table-cell">Role</TableHead>
                        <TableHead className="hidden md:table-cell">Terdaftar</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Tidak ada data.</TableCell></TableRow>
                      : filteredUsers.map(u => (
                        <TableRow key={u.id} className={`${u.status==="pending"?"bg-amber-500/5":""} ${selectedUsers.has(u.id) ? "bg-primary/5" : ""}`}>
                          <TableCell>
                            {u.role !== 'admin' && <Checkbox checked={selectedUsers.has(u.id)} onCheckedChange={() => toggleSelectUser(u.id)} />}
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="space-y-0.5">
                              <p className="text-xs sm:text-sm font-semibold text-foreground">{u.name||"-"}</p>
                              <p className="text-[11px] sm:hidden text-muted-foreground font-mono truncate max-w-[150px]">{u.email}</p>
                              {u.phone && <p className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">📱 {u.phone}</p>}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{u.email}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${u.product_code === 'LPE' ? 'text-primary bg-primary/10 border border-primary/30' : 'text-amber-500 bg-amber-500/10 border border-amber-500/30'}`}>
                                {u.product_code === 'LPE' ? '⭐ Berbayar' : '🆓 Gratis'}
                              </span>
                              <div className="flex items-center gap-1">
                                <span className={`text-[10px] sm:text-xs font-mono ${u.prompt_used >= 5 && u.product_code !== 'LPE' ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>{u.prompt_used}/5</span>
                                {u.role !== 'admin' && u.prompt_used > 0 && (
                                  <Button size="sm" variant="ghost" className="h-5 w-5 p-0 text-muted-foreground hover:text-primary" title="Reset usage" onClick={async () => {
                                    await supabase.from("prompt_usage").update({ used_count: 0 }).eq("user_id", u.id);
                                    showToast({ title: '✅ Usage direset' });
                                    fetchUsers();
                                  }}><RotateCcw className="h-3 w-3" /></Button>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell><StatusBadge status={u.status} /></TableCell>
                          <TableCell className="hidden lg:table-cell"><span className={`text-xs font-medium ${u.role==="admin"?"text-primary":"text-muted-foreground"}`}>{u.role}</span></TableCell>
                          <TableCell className="text-xs text-muted-foreground hidden md:table-cell">{new Date(u.created_at).toLocaleDateString("id-ID")}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1 flex-wrap">
                              {u.status === "pending" && (
                                <>
                                  <Button size="sm" variant="outline" className="gap-1 text-xs text-emerald-600 border-emerald-300 hover:bg-emerald-500/10 h-7 px-2" onClick={() => handleApprove(u.id, u.entitlement_id)} disabled={actionLoading === u.id}>
                                    <CheckCircle className="h-3.5 w-3.5" /> ACC
                                  </Button>
                                  <Button size="sm" variant="outline" className="gap-1 text-xs text-destructive border-destructive/30 hover:bg-destructive/10 h-7 px-2" onClick={() => handleReject(u.id, u.entitlement_id)} disabled={actionLoading === u.id}>
                                    <XCircle className="h-3.5 w-3.5" /> Tolak
                                  </Button>
                                </>
                              )}
                              {u.status === "rejected" && (
                                <Button size="sm" variant="outline" className="gap-1 text-xs text-emerald-600 border-emerald-300 hover:bg-emerald-500/10 h-7 px-2" onClick={() => handleApprove(u.id, u.entitlement_id)} disabled={actionLoading === u.id}>
                                  <CheckCircle className="h-3.5 w-3.5" /> ACC
                                </Button>
                              )}
                              {u.status === "active" && u.role !== 'admin' && (
                                <Button size="sm" variant="outline" className="gap-1 text-xs text-amber-500 border-amber-300/40 hover:bg-amber-500/10 h-7 px-2" onClick={() => handleReject(u.id, u.entitlement_id)} disabled={actionLoading === u.id} title="Nonaktifkan / Tolak Akses">
                                  <XCircle className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Nonaktifkan</span>
                                </Button>
                              )}
                              {u.role !== 'admin' && (
                                <Button size="sm" variant="outline" className="text-xs h-7 px-2" onClick={() => handleChangeTier(u.id, u.product_code === 'LPE' ? 'free' : 'paid')} disabled={actionLoading === u.id}>
                                  {u.product_code === 'LPE' ? '⬇ Gratis' : '⬆ Bayar'}
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" className="text-muted-foreground h-7 w-7 p-0" onClick={() => setResetDialog({ open: true, userId: u.id, email: u.email })} title="Reset Password">
                                <KeyRound className="h-3.5 w-3.5" />
                              </Button>
                              {u.role !== "admin" && (
                                <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 h-7 w-7 p-0" onClick={() => handleDelete(u.id)} disabled={actionLoading === u.id} title="Hapus User">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
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

          {/* SETTINGS TAB - VIDEO TUTORIAL ONLY */}
          <TabsContent value="settings">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-6 border-b border-border">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Video className="h-5 w-5 text-primary" /> Pengaturan Video Tutorial
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Kelola daftar video tutorial yang ditampilkan pada dashboard pengguna.
                  </p>
                </div>
                <Button size="sm" onClick={() => { setEditTutId(null); setTutForm({ title: '', description: '', youtube_url: '', sort_order: tutorialsList.length + 1, is_active: true }); setTutDialog(true); }} className="gap-1.5 w-full sm:w-auto">
                  <Plus className="h-4 w-4" /> Tambah Video Tutorial
                </Button>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                {tutorialsList.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-border rounded-xl">
                    <Video className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-foreground">Belum ada video tutorial</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-4">Klik tombol di atas untuk menambahkan panduan YouTube pertama.</p>
                    <Button size="sm" onClick={() => { setEditTutId(null); setTutForm({ title: '', description: '', youtube_url: '', sort_order: 1, is_active: true }); setTutDialog(true); }} className="gap-1.5">
                      <Plus className="h-4 w-4" /> Tambah Video Tutorial
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tutorialsList.map((tut) => (
                      <div key={tut.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-border bg-secondary/50 hover:bg-secondary transition-colors">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <span className="text-xs font-mono text-muted-foreground bg-background px-2 py-1 rounded border border-border shrink-0 mt-0.5">#{tut.sort_order}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-bold text-foreground">{tut.title}</p>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tut.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                                {tut.is_active ? '✅ Aktif' : 'Off'}
                              </span>
                            </div>
                            {tut.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{tut.description}</p>}
                            <a href={tut.youtube_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1 truncate">
                              🔗 {tut.youtube_url}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <Button variant="outline" size="sm" onClick={() => {
                            setEditTutId(tut.id);
                            setTutForm({ title: tut.title, description: tut.description || '', youtube_url: tut.youtube_url, sort_order: tut.sort_order, is_active: tut.is_active });
                            setTutDialog(true);
                          }} className="text-xs">Edit</Button>
                          <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 text-xs" onClick={async () => {
                            if (!confirm('Hapus video tutorial ini?')) return;
                            try { await supabase.from('tutorials').delete().eq('id', tut.id); } catch {}
                            const updated = tutorialsList.filter(t => t.id !== tut.id);
                            setTutorialsList(updated);
                            try { localStorage.setItem('admin_tutorials', JSON.stringify(updated)); } catch {}
                            showToast({ title: 'Video tutorial dihapus.' });
                          }}>🗑 Hapus</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
              const newTut = {
                id: editTutId || `tut-${Date.now()}`,
                title: tutForm.title,
                description: tutForm.description || null,
                youtube_url: tutForm.youtube_url,
                sort_order: tutForm.sort_order,
                is_active: tutForm.is_active,
              };
              try {
                if (editTutId) {
                  await supabase.from('tutorials').update({ title: tutForm.title, description: tutForm.description || null, youtube_url: tutForm.youtube_url, sort_order: tutForm.sort_order, is_active: tutForm.is_active }).eq('id', editTutId);
                } else {
                  await supabase.from('tutorials').insert({ title: tutForm.title, description: tutForm.description || null, youtube_url: tutForm.youtube_url, sort_order: tutForm.sort_order, is_active: tutForm.is_active });
                }
              } catch {}

              let updatedList: any[] = [];
              if (editTutId) {
                updatedList = tutorialsList.map(t => t.id === editTutId ? { ...t, ...newTut } : t);
                showToast({ title: '✅ Video tutorial diupdate!' });
              } else {
                updatedList = [...tutorialsList, newTut];
                showToast({ title: '✅ Video tutorial ditambahkan!' });
              }
              setTutorialsList(updatedList);
              try { localStorage.setItem('admin_tutorials', JSON.stringify(updatedList)); } catch {}
              setTutDialog(false);
              setEditTutId(null);
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
              {bulkDialog.action === 'approve' && '✅ ACC / Setujui User Terpilih'}
              {bulkDialog.action === 'reject' && '❌ Tolak User Terpilih'}
              {bulkDialog.action === 'tier_paid' && '⭐ Ubah ke Berbayar Massal'}
              {bulkDialog.action === 'tier_free' && '🆓 Ubah ke Gratis Massal'}
              {bulkDialog.action === 'reset_password' && '🔑 Reset Password Massal'}
              {bulkDialog.action === 'delete' && '🗑 Hapus Beberapa User Sekaligus'}
            </DialogTitle>
            <DialogDescription>
              Tindakan ini akan diterapkan ke <strong>{selectedUsers.size} user</strong> yang Anda pilih.
            </DialogDescription>
          </DialogHeader>
          {bulkDialog.action === 'approve' && (
            <p className="text-sm text-foreground">
              Semua user yang dipilih akan langsung di-ACC dan berstatus <strong>Aktif</strong> dengan akses penuh ke builder.
            </p>
          )}
          {bulkDialog.action === 'reject' && (
            <p className="text-sm text-muted-foreground">
              Pendaftaran user yang dipilih akan diset ke <strong>Ditolak</strong> dan mereka tidak dapat masuk ke aplikasi.
            </p>
          )}
          {bulkDialog.action === 'tier_paid' && (
            <p className="text-sm text-foreground">
              User yang dipilih akan diubah tier-nya menjadi <strong>⭐ Berbayar (Unlimited)</strong>.
            </p>
          )}
          {bulkDialog.action === 'tier_free' && (
            <p className="text-sm text-foreground">
              User yang dipilih akan diubah tier-nya menjadi <strong>🆓 Gratis (Limit 5x)</strong>.
            </p>
          )}
          {bulkDialog.action === 'reset_password' && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Masukkan password baru yang akan diterapkan ke semua user terpilih:</p>
              <div className="relative">
                <Input type={showBulkPassword ? "text" : "password"} placeholder="Password baru untuk semua (min. 6)" value={bulkPassword} onChange={(e) => setBulkPassword(e.target.value)} className="pr-10" />
                <button type="button" onClick={() => setShowBulkPassword(!showBulkPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                  {showBulkPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}
          {bulkDialog.action === 'delete' && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive space-y-1">
              <p className="font-bold flex items-center gap-1.5"><Trash2 className="h-4 w-4" /> Peringatan Penghapusan:</p>
              <p>User yang dipilih akan dihapus secara permanen dari sistem beserta seluruh entitlement dan riwayatnya. Tindakan ini tidak dapat dibatalkan.</p>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setBulkDialog({ open: false, action: '' })}>Batal</Button>
            <Button onClick={handleBulkAction} disabled={bulkLoading} variant={bulkDialog.action === 'delete' ? 'destructive' : 'default'}>
              {bulkLoading ? "Memproses..." : "Konfirmasi & Jalankan"}
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
