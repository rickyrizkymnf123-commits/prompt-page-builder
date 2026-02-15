import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) {
        setError("Email atau password salah.");
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Login gagal. Silakan coba lagi.");
        setLoading(false);
        return;
      }

      // Check if admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);

      const isAdmin = roles?.some((r) => r.role === "admin");
      if (isAdmin) {
        navigate("/admin");
        return;
      }

      // Check entitlement
      const { data: entitlement } = await supabase
        .from("entitlements")
        .select("id, status")
        .eq("product_code", "LPE")
        .maybeSingle();

      if (!entitlement) {
        setError("Akses belum aktif. Silakan hubungi support.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      if (entitlement.status === "pending") {
        setError("Akun Anda masih menunggu persetujuan admin.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      if (entitlement.status === "rejected") {
        setError("Pendaftaran Anda ditolak. Silakan hubungi support.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      navigate("/app");
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { name: name.trim() },
        },
      });

      if (signupError) {
        setError(signupError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Registrasi gagal. Silakan coba lagi.");
        setLoading(false);
        return;
      }

      // Create pending entitlement
      const { error: entError } = await supabase.from("entitlements").insert({
        user_id: data.user.id,
        status: "pending",
        order_id: `SELF_REG_${Date.now()}`,
        product_code: "LPE",
      });

      if (entError) {
        console.error("Entitlement error:", entError);
      }

      // Sign out after registration
      await supabase.auth.signOut();

      setSuccess("Pendaftaran berhasil! Silakan tunggu persetujuan admin untuk login.");
      setEmail("");
      setPassword("");
      setName("");
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Landing Page <span className="text-primary">Engine</span>
          </CardTitle>
          <p className="text-muted-foreground text-sm mt-1">Masuk atau daftar akun baru</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Masuk</TabsTrigger>
              <TabsTrigger value="register">Daftar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" placeholder="email@contoh.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" placeholder="Masukkan password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
                  <LogIn className="h-4 w-4" />
                  {loading ? "Memproses..." : "Masuk"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Nama Lengkap</Label>
                  <Input id="reg-name" type="text" placeholder="Nama Anda" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input id="reg-email" type="email" placeholder="email@contoh.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input id="reg-password" type="password" placeholder="Minimal 6 karakter" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="flex items-center gap-2 text-primary text-sm bg-primary/10 p-3 rounded-md">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}
                <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
                  <UserPlus className="h-4 w-4" />
                  {loading ? "Memproses..." : "Daftar"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
