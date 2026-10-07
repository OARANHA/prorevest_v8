import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export const meta: MetaFunction = () => {
  return [
    { title: "Redefinir senha - ProRevest" },
    { name: "description", content: "Redefina a senha da sua conta ProRevest." },
  ];
}

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecoveryReady, setIsRecoveryReady] = useState(false);
  const [isCheckingRecovery, setIsCheckingRecovery] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "PASSWORD_RECOVERY" && session) {
        setIsRecoveryReady(true);
        setIsCheckingRecovery(false);
        setError("");
      }
    });

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!mounted) return;
      if (sessionError) {
        setError("Não foi possível validar o link de recuperação. Solicite um novo link.");
      } else if (data.session) {
        setIsRecoveryReady(true);
        setError("");
      } else {
        setError("Link de redefinição inválido ou expirado. Solicite um novo link.");
      }
      setIsCheckingRecovery(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (!isRecoveryReady) {
      setError("O link de recuperação não está mais válido. Solicite um novo link.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setMessage("Senha redefinida com sucesso. Você será direcionado para o login.");
      await supabase.auth.signOut({ scope: "local" });

      window.setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch {
      setError("Ocorreu um erro ao redefinir sua senha. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="text-3xl font-cormorant font-bold text-primary">
              ProRevest
            </Link>
            <h2 className="mt-6 text-3xl font-cormorant font-bold text-foreground">
              Redefinir senha
            </h2>
            <p className="mt-2 text-muted-foreground">
              Crie uma nova senha para sua conta
            </p>
          </div>

          <div className="mt-8 bg-card border border-border rounded-2xl p-8 shadow-sm">
            {error && (
              <div className="mb-6 bg-destructive/10 text-destructive p-4 rounded-lg">
                {error}
              </div>
            )}
            
            {message && (
              <div className="mb-6 bg-green-100 text-green-800 p-4 rounded-lg">
                {message}
              </div>
            )}
            
            {isCheckingRecovery ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Validando seu link de recuperação...</p>
              </div>
            ) : !isRecoveryReady ? (
              <div className="text-center">
                <p className="text-destructive mb-4">
                  Link de redefinição inválido ou expirado. Por favor, solicite um novo link.
                </p>
                <Link 
                  to="/esqueci-senha" 
                  className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Solicitar novo link de redefinição
                </Link>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Nova Senha
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Mínimo de 6 caracteres
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                    Confirmar Nova Senha
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading || !!message}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors ${
                      isLoading || !!message ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processando...
                      </>
                    ) : message ? (
                      "Senha Redefinida!"
                    ) : (
                      "Redefinir Senha"
                    )}
                  </button>
                </div>
              </form>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Lembrou sua senha?{' '}
                <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}