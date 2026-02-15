import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Shield, CheckCircle, XCircle, Trash2, Clock, Users, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserWithEntitlement {
  user_id: string;
  name: string | null;
  email?: string;
  status: string;
  entitlement_id: string;
  product_code: string;
  order_id: string;
  created_at: string;
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
  const [users, setUsers] = useState<UserWithEntitlement[]>([]);
  const [logs, setLogs] = useState<ProvisionLog[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchData = async () => {
    const [entResult, profilesResult, logsResult] = await Promise.all([
      supabase.from("entitlements").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*"),
      supabase.from("provision_logs").select("*").order("created_at", { ascending: false }).limit(100),
    ]);

    const entitlements = entResult.data || [];
    const profiles = profilesResult.data || [];

    const merged: UserWithEntitlement[] = entitlements.map((ent) => {
      const profile = profiles.find((p) => p.user_id === ent.user_id);
      return {
        user_id: ent.user_id,
        name: profile?.name || null,
        status: ent.status,
        entitlement_id: ent.id,
        product_code: ent.product_code,
        order_id: ent.order_id,
        created_at: ent.created_at,
      };
    });

    setUsers(merged);
    setLogs((logsResult.data as ProvisionLog[]) || []);
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }

      const { data: roles } = await supabase
        .from("user_roles").select("role").eq("user_id", session.user.id);

      if (!roles?.some((r) => r.role === "admin")) { navigate("/login"); return; }

      setAuthorized(true);
      await fetchData();
      setLoading(false);
    };
    checkAdmin();
  }, [navigate]);

  const handleApprove = async (entId: string) => {
    setActionLoading(entId);
    const { error } = await supabase.from("entitlements").update({ status: "active" }).eq("id", entId);
    if (error) {
      toast({ title: "Gagal", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Berhasil", description: "User telah disetujui." });
      await fetchData();
    }
    setActionLoading(null);
  };

  const handleReject = async (entId: string) => {
    setActionLoading(entId);
    const { error } = await supabase.from("entitlements").update({ status: "rejected" }).eq("id", entId);
    if (error) {
      toast({ title: "Gagal", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Ditolak", description: "User telah ditolak." });
      await fetchData();
    }
    setActionLoading(null);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Yakin ingin menghapus user ini secara permanen?")) return;
    setActionLoading(userId);

    const { data: { session } } = await supabase.auth.getSession();
    const res = await supabase.functions.invoke("delete-user", {
      body: { user_id: userId },
    });

    if (res.error) {
      toast({ title: "Gagal", description: res.error.message, variant: "destructive" });
    } else {
      toast({ title: "Dihapus", description: "User berhasil dihapus." });
      await fetchData();
    }
    setActionLoading(null);
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-500/15 text-green-600",
      pending: "bg-yellow-500/15 text-yellow-600",
      rejected: "bg-destructive/15 text-destructive",
    };
    const icons: Record<string, React.ReactNode> = {
      active: <CheckCircle className="h-3 w-3" />,
      pending: <Clock className="h-3 w-3" />,
      rejected: <XCircle className="h-3 w-3" />,
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${styles[status] || "bg-muted text-muted-foreground"}`}>
        {icons[status]} {status}
      </span>
    );
  };

  const pendingCount = users.filter((u) => u.status === "pending").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{authorized ? "Memuat data..." : "Memeriksa akses..."}</p>
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
        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" /> Manajemen User
              {pendingCount > 0 && (
                <span className="ml-1 bg-yellow-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
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
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" /> Daftar User ({users.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Produk</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Terdaftar</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          Belum ada user terdaftar.
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((u) => (
                        <TableRow key={u.entitlement_id}>
                          <TableCell className="font-medium">{u.name || "-"}</TableCell>
                          <TableCell className="font-mono text-xs">{u.user_id.slice(0, 8)}...</TableCell>
                          <TableCell>{u.product_code}</TableCell>
                          <TableCell>{statusBadge(u.status)}</TableCell>
                          <TableCell className="font-mono text-xs max-w-[150px] truncate">{u.order_id}</TableCell>
                          <TableCell className="text-xs">{new Date(u.created_at).toLocaleString("id-ID")}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {u.status === "pending" && (
                                <>
                                  <Button size="sm" variant="outline" className="gap-1 text-green-600 border-green-300 hover:bg-green-50" onClick={() => handleApprove(u.entitlement_id)} disabled={actionLoading === u.entitlement_id}>
                                    <CheckCircle className="h-3 w-3" /> ACC
                                  </Button>
                                  <Button size="sm" variant="outline" className="gap-1 text-destructive border-destructive/30 hover:bg-destructive/5" onClick={() => handleReject(u.entitlement_id)} disabled={actionLoading === u.entitlement_id}>
                                    <XCircle className="h-3 w-3" /> Tolak
                                  </Button>
                                </>
                              )}
                              {u.status === "rejected" && (
                                <Button size="sm" variant="outline" className="gap-1 text-green-600 border-green-300 hover:bg-green-50" onClick={() => handleApprove(u.entitlement_id)} disabled={actionLoading === u.entitlement_id}>
                                  <CheckCircle className="h-3 w-3" /> ACC
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(u.user_id)} disabled={actionLoading === u.user_id}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
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
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">Belum ada log.</TableCell>
                      </TableRow>
                    ) : (
                      logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-xs">{log.order_id || "-"}</TableCell>
                          <TableCell>{log.email || "-"}</TableCell>
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
    </div>
  );
}
