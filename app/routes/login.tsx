import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

import { SiteFooter } from "../components/SiteFooter";
import { supabase } from "../lib/supabaseClient";

export const meta: MetaFunction = () => {
  return [
    { title: "Login - ProRevest" },
    { name: "description", content: "Acesse sua conta no sistema ProRevest para gerenciar seus projetos e orçamentos." },
  ];
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      console.log("Tentando login com:", { email, password });
      const { error, data } = await signIn(email, password);
      console.log("Resultado do login:", { error, data });
      
      if (error) {
        // Verificar se o erro é relacionado à confirmação de email
        if (error.message.includes("Email not confirmed")) {
          setError("Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada ou reenvie o email de confirmação.");
        } else {
          setError(error.message);
        }
      } else {
        console.log("Login bem-sucedido, verificando papel do usuário...");
        // Verificar se o usuário é administrador para redirecionar corretamente
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          console.log("Perfil do usuário:", { profile, profileError });
          if (!profileError && profile?.role === 'admin') {
            console.log("Usuário é administrador, redirecionando para /admin");
            navigate("/admin");
          } else {
            console.log("Usuário não é administrador, redirecionando para /meus-projetos");
            navigate("/meus-projetos");
          }
        } else {
          console.log("Sessão não encontrada, redirecionando para /meus-projetos");
          navigate("/meus-projetos");
        }
      }
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setError("Ocorreu um erro ao fazer login. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12 pt-20">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="text-3xl font-cormorant font-bold text-primary">
              ProRevest
            </Link>
            <h2 className="mt-6 text-3xl font-cormorant font-bold text-foreground">
              Faça login na sua conta
            </h2>
            <p className="mt-2 text-muted-foreground">
              Acesse seus projetos e orçamentos personalizados
            </p>
          </div>

          <div className="mt-8 bg-card border border-border rounded-2xl p-8 shadow-sm">
            {error && (
              <div className="mb-6 bg-destructive/10 text-destructive p-4 rounded-lg">
                {error}
                {error.includes("confirme seu email") && (
                  <div className="mt-2">
                    <Link to="/resend-confirmation" className="font-medium text-primary hover:text-primary/80">
                      Reenviar email de confirmação
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium">
                    Senha
                  </label>
                  <Link to="/esqueci-senha" className="text-sm text-primary hover:text-primary/80">
                    Esqueceu sua senha?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-foreground">
                  Lembrar-me
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
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
                  ) : (
                    "Entrar"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">
                    Ou continue com
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <button className="w-full inline-flex justify-center py-2 px-4 border border-border rounded-lg shadow-sm bg-card text-sm font-medium text-foreground hover:bg-muted">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                  </svg>
                </button>
                <button className="w-full inline-flex justify-center py-2 px-4 border border-border rounded-lg shadow-sm bg-card text-sm font-medium text-foreground hover:bg-muted">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button className="w-full inline-flex justify-center py-2 px-4 border border-border rounded-lg shadow-sm bg-card text-sm font-medium text-foreground hover:bg-muted">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground">
              Não tem uma conta?{' '}
              <Link to="/register" className="font-medium text-primary hover:text-primary/80">
                Cadastre-se
              </Link>
            </p>
            <p className="mt-2 text-muted-foreground">
              Não recebeu o email de confirmação?{' '}
              <Link to="/resend-confirmation" className="font-medium text-primary hover:text-primary/80">
                Reenviar email
              </Link>
            </p>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}