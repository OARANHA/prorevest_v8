import type { ReactNode } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      const redirectTo = `${location.pathname}${location.search || ""}`;
      navigate(`/login?redirect=${encodeURIComponent(redirectTo)}`, { replace: true });
    }
  }, [loading, user, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-b from-yellow-50 via-white to-yellow-50">
        <div className="flex items-center gap-3 text-slate-700">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600 border-t-transparent" />
          Verificando acesso...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-b from-yellow-50 via-white to-yellow-50">
        <div className="flex items-center gap-3 text-slate-700">
          Redirecionando para login...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
