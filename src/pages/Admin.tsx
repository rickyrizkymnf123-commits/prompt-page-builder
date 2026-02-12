import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Shield } from "lucide-react";

interface ProvisionLog {
  id: string;
  order_id: string | null;
  email: string | null;
  status: string;
  message: string | null;
  created_at: string;
}

interface Entitlement {
  id: string;
  user_id: string;
  product_code: string;
  status: string;
  order_id: string;
  created_at: string;
}

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [logs, setLogs] = useState<ProvisionLog[]>([]);
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      // Check admin role via RPC
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      const isAdmin = roles?.some((r) => r.role === "admin");
      if (!isAdmin) {
        navigate("/login");
        return;
      }

      setAuthorized(true);

      // Fetch data
      const [logsResult, entitlementsResult] = await Promise.all([
        supabase.from("provision_logs").select("*").order("created_at", { ascending: false }).limit(100),
        supabase.from("entitlements").select("*").order("created_at", { ascending: false }).limit(100),
      ]);

      setLogs((logsResult.data as ProvisionLog[]) || []);
      setEntitlements((entitlementsResult.data as Entitlement[]) || []);
      setLoading(false);
    };

    checkAdmin();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

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
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </header>

      <main className="p-6 max-w-[1400px] mx-auto space-y-6">
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
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Belum ada log.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">{log.order_id || "-"}</TableCell>
                      <TableCell>{log.email || "-"}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            log.status === "success"
                              ? "bg-primary/20 text-primary"
                              : log.status === "failed"
                              ? "bg-destructive/20 text-destructive"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {log.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs max-w-[300px] truncate">{log.message || "-"}</TableCell>
                      <TableCell className="text-xs">{new Date(log.created_at).toLocaleString("id-ID")}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entitlements</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entitlements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Belum ada entitlement.
                    </TableCell>
                  </TableRow>
                ) : (
                  entitlements.map((ent) => (
                    <TableRow key={ent.id}>
                      <TableCell className="font-mono text-xs">{ent.user_id}</TableCell>
                      <TableCell>{ent.product_code}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            ent.status === "active"
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {ent.status}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{ent.order_id}</TableCell>
                      <TableCell className="text-xs">{new Date(ent.created_at).toLocaleString("id-ID")}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
