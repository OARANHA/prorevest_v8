import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export const meta: MetaFunction = () => {
  return [
    { title: "Processando Autenticação - ProRevest" },
    { name: "description", content: "Processando autenticação..." },
  ];
};

export default function AuthCallback() {
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        
        const callbackUrl = new URL(window.location.href);
        const hashParams = new URLSearchParams(callbackUrl.hash.substring(1));
        const type = hashParams.get("type");
        const code = callbackUrl.searchParams.get("code");

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            setError("Erro ao processar autenticação: " + exchangeError.message);
            setProcessing(false);
            return;
          }
        }

        const { data, error: sessionError } = await supabase.auth.getSession();

        // Compatibilidade com links de recuperação antigos que ainda apontem para /auth/callback.
        if (type === "recovery" && data.session) {
          navigate("/reset-password", { replace: true });
          return;
        }
        
        if (sessionError) {
          setError("Erro ao processar autenticação: " + sessionError.message);
          setProcessing(false);
          return;
        }
        
        if (data.session) {
          // Usuário autenticado, verificar papel antes de redirecionar
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.session.user.id)
            .single();
          
          if (!profileError && profile?.role === 'admin') {
            console.log("Usuário é administrador, redirecionando para /admin");
            navigate("/admin");
          } else {
            console.log("Usuário não é administrador, redirecionando para /meus-projetos");
            navigate("/meus-projetos");
          }
        } else {
          // Não há sessão, redirecionar para login
          navigate("/login");
        }
      } catch (err) {
        console.error("Erro no callback:", err);
        setError("Erro ao processar autenticação: " + (err as Error).message);
        setProcessing(false);
      }
    };
    
    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-20">
          <div className="text-center p-8 bg-card border border-border rounded-2xl">
            <h1 className="text-2xl font-bold text-foreground mb-4">Erro de Autenticação</h1>
            <p className="text-destructive mb-4">{error}</p>
            <Link 
              to="/login" 
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Voltar para Login
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (processing) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-medium text-foreground">Processando autenticação...</h2>
            <p className="text-muted-foreground mt-2">Aguarde um momento</p>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center">
          <h2 className="text-xl font-medium text-foreground">Redirecionando...</h2>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
