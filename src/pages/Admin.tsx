import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  LogOut, Shield, CheckCircle, XCircle, Trash2, Clock, Users, FileText,
  RefreshCw, KeyRound, Search, UserCheck, UserX, AlertTriangle, Moon, Sun, Rocket, Zap, RotateCcw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Step1Framework } from "@/components/steps/Step1Framework";
import { Step2Product } from "@/components/steps/Step2Product";
import { Step3Target } from "@/components/steps/Step3Target";
import { Step4Detail } from "@/components/steps/Step4Detail";
import { Step5Design } from "@/components/steps/Step5Design";
import { Step6Elements } from "@/components/steps/Step6Elements";
import { Step7Platform } from "@/components/steps/Step7Platform";
import { PromptPanel } from "@/components/PromptPanel";
import { FormState, initialFormState } from "@/types/form";
import { generatePrompt } from "@/utils/generatePrompt";

// --- Types ---
interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  status: string;
  entitlement_id: string | null;
  product_code: string | null;
  order_id: string | null;
  role: string;
  created_at: string;
  last_sign_in: string | null;
}

interface ProvisionLog {
  id: string;
  order_id: string | null;
  email: string | null;
  status: string;
  message: string | null;
  created_at: string;
}

// --- Sub-components ---
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; icon: React.ReactNode }> = {
    active: { bg: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400", icon: <CheckCircle className="h-3 w-3" /> },
    pending: { bg: "bg-amber-500/15 text-amber-700 dark:text-amber-400", icon: <Clock className="h-3 w-3" /> },
    rejected: { bg: "bg-destructive/15 text-destructive", icon: <XCircle className="h-3 w-3" /> },
    no_entitlement: { bg: "bg-muted text-muted-foreground", icon: <AlertTriangle className="h-3 w-3" /> },
  };
  const c = config[status] || config.no_entitlement;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg}`}>
      {c.icon} {status === "no_entitlement" ? "Tanpa Akses" : status}
    </span>
  );
}

// --- Main Component ---
export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [logs, setLogs] = useState<ProvisionLog[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [resetDialog, setResetDialog] = useState<{ open: boolean; userId: string; email: string }>({
    open: false, userId: "", email: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  // Tools state
  const [form, setForm] = useState<FormState>({ ...initialFormState });
  const [promptText, setPromptText] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const fetchUsers = useCallback(async () => {
    const res = await supabase.functions.invoke("admin-users", {
      body: { action: "list" },
    });
    if (res.data?.users) setUsers(res.data.users);
  }, []);

  const fetchLogs = useCallback(async () => {
    const { data } = await supabase
      .from("provision_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    setLogs((data as ProvisionLog[]) || []);
  }, []);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }
      const { data: roles } = await supabase
        .from("user_roles").select("role").eq("user_id", session.user.id);
      if (!roles?.some((r) => r.role === "admin")) { navigate("/login"); return; }
      setAuthorized(true);
      await Promise.all([fetchUsers(), fetchLogs()]);
      setLoading(false);
    };
    checkAdmin();
  }, [navigate, fetchUsers, fetchLogs]);

  // --- Admin actions ---
  const invokeAction = async (action: string, body: Record<string, string>, loadingKey: string, successMsg: string) => {
    setActionLoading(loadingKey);
    const res = await supabase.functions.invoke("admin-users", { body: { action, ...body } });
    if (res.error || res.data?.error) {
      toast({ title: "Gagal", description: res.error?.message || res.data?.error, variant: "destructive" });
    } else {
      toast({ title: "Berhasil", description: successMsg });
      await fetchUsers();
    }
    setActionLoading(null);
  };

  const handleApprove = (entId: string) => invokeAction("approve", { user_id: entId }, entId, "User telah disetujui.");
  const handleReject = (entId: string) => invokeAction("reject", { user_id: entId }, entId, "User telah ditolak.");
  const handleDelete = async (userId: string) => {
    if (!confirm("Yakin ingin menghapus user ini secara permanen?")) return;
    await invokeAction("delete", { user_id: userId }, userId, "User berhasil dihapus.");
  };
  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "Password minimal 6 karakter", variant: "destructive" });
      return;
    }
    setActionLoading(resetDialog.userId);
    const res = await supabase.functions.invoke("admin-users", {
      body: { action: "reset_password", user_id: resetDialog.userId, password: newPassword },
    });
    if (res.error || res.data?.error) {
      toast({ title: "Gagal", description: res.error?.message || res.data?.error, variant: "destructive" });
    } else {
      toast({ title: "Berhasil", description: `Password berhasil direset untuk ${resetDialog.email}` });
    }
    setResetDialog({ open: false, userId: "", email: "" });
    setNewPassword("");
    setActionLoading(null);
  };

  // --- Tools handlers ---
  const handleChange = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (hasGenerated) setIsDirty(true);
  }, [hasGenerated]);

  const handleToggleElement = useCallback((element: string) => {
    setForm((prev) => ({
      ...prev,
      elemenTambahan: { ...prev.elemenTambahan, [element]: !prev.elemenTambahan[element] },
    }));
    if (hasGenerated) setIsDirty(true);
  }, [hasGenerated]);

  const handleGenerate = () => {
    const prompt = generatePrompt(form);
    setPromptText(prompt);
    setHasGenerated(true);
    setIsDirty(false);
  };

  const handleReset = () => {
    setForm({ ...initialFormState });
    setPromptText("");
    setHasGenerated(false);
    setIsDirty(false);
  };

  // --- Derived ---
  const filteredUsers = users.filter((u) => {
    const matchSearch = !search || u.email?.toLowerCase().includes(search.toLowerCase()) || u.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || u.status === filterStatus;
    return matchSearch && matchStatus;
  });
  const pendingCount = users.filter((u) => u.status === "pending").length;
  const activeCount = users.filter((u) => u.status === "active").length;
  const rejectedCount = users.filter((u) => u.status === "rejected").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-5 w-5 animate-spin text-primary" />
          <p className="text-muted-foreground">{authorized ? "Memuat data..." : "Memeriksa akses..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Unified Header */}
      <header className="border-b border-border bg-card px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Rocket className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-foreground">
              Landing Page <span className="text-primary">Engine</span>
            </h1>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Shield className="h-3 w-3" /> Admin Panel
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={async () => { await supabase.auth.signOut(); navigate("/login"); }}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-[1400px] mx-auto w-full">
        <Tabs defaultValue="tools">
          <TabsList className="mb-6">
            <TabsTrigger value="tools" className="gap-2">
              <Zap className="h-4 w-4" /> Tools
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" /> Manajemen User
              {pendingCount > 0 && (
                <span className="ml-1 bg-amber-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <FileText className="h-4 w-4" /> Provision Logs
            </TabsTrigger>
          </TabsList>

          {/* ===== TOOLS TAB ===== */}
          <TabsContent value="tools">
            {/* Hero */}
            <section className="text-center py-12 px-6 mb-6 rounded-lg border border-border bg-card">
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                NEW V3.0 RELEASE
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight max-w-3xl mx-auto"
              >
                Buat Landing Page professional cuman dalam{" "}
                <span className="text-primary">Hitungan menit</span> <Zap className="inline h-8 w-8 text-primary" />
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto"
              >
                Generate Landing Page dari format yang benar, karena landing page yang gagal biasanya bukan salah katanya, tapi salah strukturnya.
              </motion.p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
              <div className="space-y-4 pb-6">
                <Step1Framework framework={form.framework} gayaBahasa={form.gayaBahasa} onChange={handleChange} />
                <Step2Product tipeProduk={form.tipeProduk} tujuanUtama={form.tujuanUtama} onChange={handleChange} />
                <Step3Target levelAwareness={form.levelAwareness} targetAudience={form.targetAudience} onChange={handleChange} />
                <Step4Detail
                  namaProduk={form.namaProduk} hargaNormal={form.hargaNormal} hargaPromo={form.hargaPromo}
                  deskripsiBenefit={form.deskripsiBenefit} ctaUtama={form.ctaUtama} onChange={handleChange}
                />
                <Step5Design gayaDesain={form.gayaDesain} onChange={handleChange} />
                <Step6Elements elemenTambahan={form.elemenTambahan} onToggle={handleToggleElement} />
                <Step7Platform platformTarget={form.platformTarget} onChange={handleChange} />
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={handleReset} className="gap-2">
                    <RotateCcw className="h-4 w-4" /> Reset
                  </Button>
                  <Button onClick={handleGenerate} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2" size="lg">
                    <Zap className="h-4 w-4" /> {isDirty ? "Generate Ulang" : "Generate Prompt"}
                  </Button>
                </div>
              </div>
              <div className="lg:sticky lg:top-6 lg:self-start">
                <PromptPanel promptText={promptText} hasPrompt={hasGenerated} />
              </div>
            </div>
          </TabsContent>

          {/* ===== USERS TAB ===== */}
          <TabsContent value="users">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total User", count: users.length, icon: <Users className="h-8 w-8 text-primary" />, filter: "all" },
                { label: "Pending", count: pendingCount, icon: <Clock className="h-8 w-8 text-amber-500" />, filter: "pending" },
                { label: "Aktif", count: activeCount, icon: <UserCheck className="h-8 w-8 text-emerald-500" />, filter: "active" },
                { label: "Ditolak", count: rejectedCount, icon: <UserX className="h-8 w-8 text-destructive" />, filter: "rejected" },
              ].map((s) => (
                <Card key={s.filter} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilterStatus(s.filter)}>
                  <CardContent className="p-4 flex items-center gap-3">
                    {s.icon}
                    <div>
                      <p className="text-2xl font-bold text-foreground">{s.count}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" /> Daftar User ({filteredUsers.length})
                </CardTitle>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Cari nama atau email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                  </div>
                  <Button variant="outline" size="icon" onClick={() => { fetchUsers(); fetchLogs(); }}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {["all", "pending", "active", "rejected"].map((s) => (
                    <Button key={s} size="sm" variant={filterStatus === s ? "default" : "outline"} onClick={() => setFilterStatus(s)} className="text-xs capitalize">
                      {s === "all" ? "Semua" : s}
                    </Button>
                  ))}
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Terdaftar</TableHead>
                        <TableHead>Login Terakhir</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            {search ? "Tidak ada user yang cocok." : "Belum ada user terdaftar."}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((u) => (
                          <TableRow key={u.id} className={u.status === "pending" ? "bg-amber-500/5" : ""}>
                            <TableCell className="font-medium">{u.name || "-"}</TableCell>
                            <TableCell className="text-sm">{u.email}</TableCell>
                            <TableCell><StatusBadge status={u.status} /></TableCell>
                            <TableCell>
                              <span className={`text-xs font-medium ${u.role === "admin" ? "text-primary" : "text-muted-foreground"}`}>{u.role}</span>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString("id-ID")}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{u.last_sign_in ? new Date(u.last_sign_in).toLocaleString("id-ID") : "Belum pernah"}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                {u.status === "pending" && u.entitlement_id && (
                                  <>
                                    <Button size="sm" variant="outline" className="gap-1 text-emerald-600 border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950" onClick={() => handleApprove(u.entitlement_id!)} disabled={actionLoading === u.entitlement_id}>
                                      <CheckCircle className="h-3 w-3" /> ACC
                                    </Button>
                                    <Button size="sm" variant="outline" className="gap-1 text-destructive border-destructive/30 hover:bg-destructive/5" onClick={() => handleReject(u.entitlement_id!)} disabled={actionLoading === u.entitlement_id}>
                                      <XCircle className="h-3 w-3" /> Tolak
                                    </Button>
                                  </>
                                )}
                                {u.status === "rejected" && u.entitlement_id && (
                                  <Button size="sm" variant="outline" className="gap-1 text-emerald-600 border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950" onClick={() => handleApprove(u.entitlement_id!)} disabled={actionLoading === u.entitlement_id}>
                                    <CheckCircle className="h-3 w-3" /> ACC
                                  </Button>
                                )}
                                <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => setResetDialog({ open: true, userId: u.id, email: u.email })}>
                                  <KeyRound className="h-3 w-3" />
                                </Button>
                                {u.role !== "admin" && (
                                  <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(u.id)} disabled={actionLoading === u.id}>
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== LOGS TAB ===== */}
          <TabsContent value="logs">
            <Card>
              <CardHeader><CardTitle>Provision Logs</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Tanggal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">Belum ada log.</TableCell>
                      </TableRow>
                    ) : (
                      logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-xs">{log.order_id || "-"}</TableCell>
                          <TableCell className="text-sm">{log.email || "-"}</TableCell>
                          <TableCell><StatusBadge status={log.status} /></TableCell>
                          <TableCell className="text-xs max-w-[300px] truncate">{log.message || "-"}</TableCell>
                          <TableCell className="text-xs">{new Date(log.created_at).toLocaleString("id-ID")}</TableCell>
                        </TableRow>
                      ))
                    )}
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
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>Reset password untuk {resetDialog.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input type="password" placeholder="Password baru (min. 6 karakter)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialog({ open: false, userId: "", email: "" })}>Batal</Button>
            <Button onClick={handleResetPassword} disabled={actionLoading === resetDialog.userId}>
              {actionLoading === resetDialog.userId ? "Memproses..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
