import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, CheckCircle } from "lucide-react";

export default function AppPage() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const { data: entitlement } = await supabase
        .from("entitlements")
        .select("id")
        .eq("product_code", "LPE")
        .eq("status", "active")
        .limit(1)
        .maybeSingle();

      if (!entitlement) {
        await supabase.auth.signOut();
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("user_id", session.user.id)
        .maybeSingle();

      setUserName(profile?.name || session.user.email || "User");
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate("/login");
    });

    checkAccess();
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">
          Landing Page <span className="text-primary">Engine</span>
        </h1>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </header>
      <main className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-primary mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Welcome, {userName}!</h2>
          <p className="text-muted-foreground">Akses aktif. Selamat menggunakan Landing Page Engine.</p>
        </div>
      </main>
    </div>
  );
}
