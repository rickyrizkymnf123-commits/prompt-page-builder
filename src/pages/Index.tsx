import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: roles } = await supabase
          .from("user_roles").select("role").eq("user_id", session.user.id);
        if (roles?.some((r) => r.role === "admin")) {
          navigate("/admin");
          return;
        }
        navigate("/app");
      } else {
        navigate("/login");
      }
    };
    redirect();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Memuat...</p>
    </div>
  );
};

export default Index;
