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
  RefreshCw, KeyRound, Search, UserCheck, UserX, AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    const res = await supabase.functions.invoke("admin-users", {
      body: { action: "list" },
    });
    if (res.data?.users) {
      setUsers(res.data.users);
    }
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

  const invokeAction = async (action: string, body: Record<string, string>, loadingKey: string, successMsg: string) => {
    setActionLoading(loadingKey);
    const res = await supabase.functions.invoke("admin-users", {
      body: { action, ...body },
    });
    if (res.error || res.data?.error) {
      toast({ title: "Gagal", description: res.error?.message || res.data?.error, variant: "destructive" });
    } else {
      toast({ title: "Berhasil", description: successMsg });
      await fetchUsers();
    }
    setActionLoading(null);
  };

  const handleApprove = (entId: string) =>
    invokeAction("approve", { user_id: entId }, entId, "User telah disetujui.");

  const handleReject = (entId: string) =>
    invokeAction("reject", { user_id: entId }, entId, "User telah ditolak.");

  const handleDelete = async (userId: string) => {
    if (!confirm("Yakin ingin menghapus user ini secara permanen? Data tidak bisa dikembalikan.")) return;
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

  const statusBadge = (status: string) => {
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
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch = !search ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.name?.toLowerCase().includes(search.toLowerCase());
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Admin Panel
        </h1>
        <Button variant="ghost" size="icon" onClick={async () => { await supabase.auth.signOut(); navigate("/login"); }}>
          <LogOut className="h-5 w-5" />
        </Button>
      </header>

      <main className="p-6 max-w-[1400px] mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilterStatus("all")}>
            <CardContent className="p-4 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{users.length}</p>
                <p className="text-xs text-muted-foreground">Total User</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilterStatus("pending")}>
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilterStatus("active")}>
            <CardContent className="p-4 flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{activeCount}</p>
                <p className="text-xs text-muted-foreground">Aktif</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilterStatus("rejected")}>
            <CardContent className="p-4 flex items-center gap-3">
              <UserX className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold text-foreground">{rejectedCount}</p>
                <p className="text-xs text-muted-foreground">Ditolak</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="mb-6">
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

          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" /> Daftar User ({filteredUsers.length})
                </CardTitle>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari nama atau email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button variant="outline" size="icon" onClick={() => { fetchUsers(); fetchLogs(); }}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {["all", "pending", "active", "rejected"].map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={filterStatus === s ? "default" : "outline"}
                      onClick={() => setFilterStatus(s)}
                      className="text-xs capitalize"
                    >
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
                            <TableCell>{statusBadge(u.status)}</TableCell>
                            <TableCell>
                              <span className={`text-xs font-medium ${u.role === "admin" ? "text-primary" : "text-muted-foreground"}`}>
                                {u.role}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {new Date(u.created_at).toLocaleDateString("id-ID")}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {u.last_sign_in ? new Date(u.last_sign_in).toLocaleString("id-ID") : "Belum pernah"}
                            </TableCell>
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
                                <Button
                                  size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground"
                                  onClick={() => setResetDialog({ open: true, userId: u.id, email: u.email })}
                                >
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

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Provision Logs</CardTitle>
              </CardHeader>
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
                          <TableCell>{statusBadge(log.status)}</TableCell>
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
            <Input
              type="password"
              placeholder="Password baru (min. 6 karakter)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
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
