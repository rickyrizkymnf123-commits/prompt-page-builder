import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LogIn, UserPlus, AlertCircle, CheckCircle2, Eye, EyeOff, Clock, ShieldAlert } from "lucide-react";

export default function Login() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form state
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      if (error || !data.user) {
        setLoginError("Email atau password salah. Pastikan data yang dimasukkan benar.");
        setLoginLoading(false);
        return;
      }

      // Check if user is admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);

      const isAdmin =
        roles?.some((r) => r.role === "admin") || data.user.email === "fauzymnf29@gmail.com";

      if (isAdmin) {
        navigate("/admin");
        return;
      }

      // Check entitlement status
      const { data: entitlements } = await supabase
        .from("entitlements")
        .select("id, product_code, status")
        .eq("user_id", data.user.id);

      if (!entitlements || entitlements.length === 0) {
        // If no entitlement record exists, create a pending one
        await supabase.from("entitlements").insert({
          user_id: data.user.id,
          order_id: "reg-" + Date.now(),
          product_code: "LPE",
          status: "pending",
        });
        setLoginError("⏳ Akun Anda sedang MENUNGGU PERSETUJUAN (ACC) dari Admin. Silakan hubungi admin.");
        await supabase.auth.signOut();
        setLoginLoading(false);
        return;
      }

      const activeEntitlement = entitlements.find((e) => e.status === "active");
      if (activeEntitlement) {
        navigate("/app");
        return;
      }

      const rejectedEntitlement = entitlements.find((e) => e.status === "rejected");
      if (rejectedEntitlement) {
        setLoginError("❌ Pendaftaran akun Anda DITOLAK oleh Admin. Silakan hubungi admin jika ini merupakan kesalahan.");
        await supabase.auth.signOut();
        setLoginLoading(false);
        return;
      }

      // If status is pending or anything else
      setLoginError("⏳ Akun Anda masih MENUNGGU PERSETUJUAN (ACC) dari Admin. Silakan tunggu konfirmasi admin.");
      await supabase.auth.signOut();
    } catch {
      setLoginError("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");

    if (!regName.trim()) {
      setRegError("Nama lengkap wajib diisi.");
      return;
    }

    if (!regEmail.trim()) {
      setRegError("Email wajib diisi.");
      return;
    }

    if (regPassword.length < 6) {
      setRegError("Password minimal 6 karakter.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError("Konfirmasi password tidak cocok.");
      return;
    }

    setRegLoading(true);

    try {
      // 1. Sign up user in Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: regEmail.trim(),
        password: regPassword,
        options: {
          data: {
            name: regName.trim(),
            phone: regPhone.trim(),
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered") || signUpError.message.includes("User already registered")) {
          setRegError("Email ini sudah terdaftar. Silakan masuk menggunakan form Login.");
        } else {
          setRegError(signUpError.message || "Gagal mendaftarkan akun.");
        }
        setRegLoading(false);
        return;
      }

      const newUserId = authData.user?.id;

      if (newUserId) {
        // 2. Create Profile
        await supabase.from("profiles").upsert({
          user_id: newUserId,
          name: regName.trim(),
          phone: regPhone.trim(),
        }, { onConflict: "user_id" });

        // 3. Create User Role
        await supabase.from("user_roles").upsert({
          user_id: newUserId,
          role: "user",
        }, { onConflict: "user_id" });

        // 4. Create Entitlement with status 'pending' (Awaiting Admin ACC)
        await supabase.from("entitlements").insert({
          user_id: newUserId,
          order_id: "reg-" + Date.now(),
          product_code: "LPE",
          status: "pending",
        });

        // Sign out automatically so user waits for approval
        await supabase.auth.signOut();

        // Show success state
        setRegSuccess(
          `🎉 Pendaftaran berhasil! Akun untuk "${regEmail.trim()}" telah dibuat dan saat ini berstatus MENUNGGU PERSETUJUAN (ACC) dari Admin. Silakan tunggu atau hubungi Admin.`
        );

        // Pre-fill login email
        setLoginEmail(regEmail.trim());
        setRegName("");
        setRegPhone("");
        setRegEmail("");
        setRegPassword("");
        setRegConfirmPassword("");
      } else {
        setRegError("Pendaftaran berhasil, tetapi gagal menginisialisasi profil. Silakan hubungi admin.");
      }
    } catch (err: any) {
      setRegError(err?.message || "Terjadi kesalahan saat pendaftaran.");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-border">
        <CardHeader className="text-center space-y-1 pb-4">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-md">
              {activeTab === "login" ? <LogIn className="h-6 w-6" /> : <UserPlus className="h-6 w-6" />}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Landing Page <span className="text-primary">Builder V.11</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground font-medium">By Digital Strategi</p>
          <CardDescription className="text-xs pt-1">
            {activeTab === "login"
              ? "Masuk ke akun Anda untuk mengelola landing page"
              : "Daftar akun baru untuk mulai membuat landing page profesional"}
          </CardDescription>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-secondary rounded-lg mt-4 border border-border">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setLoginError("");
              }}
              className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === "login"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🔑 Masuk (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setRegError("");
              }}
              className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === "register"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              📝 Daftar Akun Baru
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          {/* ================= LOGIN FORM ================= */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              {regSuccess && (
                <div className="flex items-start gap-2.5 text-emerald-600 dark:text-emerald-400 text-xs bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg leading-relaxed">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{regSuccess}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-xs font-semibold">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="email@contoh.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password" className="text-xs font-semibold">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Masukkan password Anda"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="pr-10 h-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="flex items-start gap-2.5 text-destructive text-xs bg-destructive/10 border border-destructive/20 p-3 rounded-lg leading-relaxed">
                  {loginError.includes("MENUNGGU") ? (
                    <Clock className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                  ) : loginError.includes("DITOLAK") ? (
                    <ShieldAlert className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  )}
                  <span>{loginError}</span>
                </div>
              )}

              <Button type="submit" className="w-full gap-2 font-semibold shadow-md" size="lg" disabled={loginLoading}>
                <LogIn className="h-4 w-4" />
                {loginLoading ? "Memverifikasi..." : "Masuk ke Aplikasi"}
              </Button>

              <div className="text-center pt-2">
                <p className="text-xs text-muted-foreground">
                  Belum punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("register");
                      setRegSuccess("");
                      setLoginError("");
                    }}
                    className="text-primary font-semibold hover:underline"
                  >
                    Daftar di sini
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ================= REGISTER FORM ================= */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="reg-name" className="text-xs font-semibold">Nama Lengkap *</Label>
                <Input
                  id="reg-name"
                  type="text"
                  placeholder="Contoh: Ahmad Fauzy"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-phone" className="text-xs font-semibold">Nomor WhatsApp / HP (Opsional)</Label>
                <Input
                  id="reg-phone"
                  type="tel"
                  placeholder="08123456789"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-email" className="text-xs font-semibold">Email *</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="nama@email.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-password" className="text-xs font-semibold">Password (Min. 6 Karakter) *</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showRegPassword ? "text" : "password"}
                    placeholder="Buat password minimal 6 karakter"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    className="pr-10 h-9 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-confirm-password" className="text-xs font-semibold">Konfirmasi Password *</Label>
                <Input
                  id="reg-confirm-password"
                  type={showRegPassword ? "text" : "password"}
                  placeholder="Ulangi password Anda"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  required
                  className="h-9 text-sm"
                />
              </div>

              {regError && (
                <div className="flex items-start gap-2.5 text-destructive text-xs bg-destructive/10 border border-destructive/20 p-2.5 rounded-lg leading-relaxed">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2.5 text-[11px] text-amber-600 dark:text-amber-400 flex items-start gap-2 leading-relaxed">
                <Clock className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
                <span>
                  <strong>Catatan:</strong> Setelah mendaftar, akun Anda akan masuk ke antrean persetujuan (ACC) Admin sebelum dapat digunakan.
                </span>
              </div>

              <Button type="submit" className="w-full gap-2 font-semibold shadow-md mt-1" size="lg" disabled={regLoading}>
                <UserPlus className="h-4 w-4" />
                {regLoading ? "Mendaftarkan Akun..." : "Daftar Akun Sekarang"}
              </Button>

              <div className="text-center pt-1">
                <p className="text-xs text-muted-foreground">
                  Sudah punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("login");
                      setRegError("");
                    }}
                    className="text-primary font-semibold hover:underline"
                  >
                    Masuk di sini
                  </button>
                </p>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
