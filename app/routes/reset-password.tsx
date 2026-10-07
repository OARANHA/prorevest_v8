import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

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
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se há um token no sessionStorage (vindo do callback)
    const storedToken = sessionStorage.getItem('password_reset_token');
    if (storedToken) {
      console.log("Token encontrado no sessionStorage:", storedToken);
      setToken(storedToken);
      // Não remover ainda, vamos remover após usar com sucesso
    } else {
      // Verificar se há token na URL (caso o usuário tenha vindo diretamente)
      const hash = window.location.hash.substring(1);
      const urlParams = new URLSearchParams(hash || window.location.search);
      const urlToken = urlParams.get("token") || urlParams.get("access_token");
      if (urlToken) {
        console.log("Token encontrado na URL:", urlToken);
        setToken(urlToken);
      } else {
        console.log("Nenhum token encontrado");
        setError("Token de redefinição de senha não encontrado. Por favor, solicite um novo link.");
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar senhas
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    
    if (!token) {
      setError("Token de redefinição de senha não encontrado. Por favor, solicite um novo link.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    setMessage("");
    
    try {
      console.log("Tentando atualizar senha com token:", token);
      
      // Primeiro, vamos definir a sessão com o token de acesso
      // Isso é necessário para o Supabase reconhecer que estamos em um processo de redefinição
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log("Sessão atual:", sessionData);
      
      // Atualizar a senha do usuário usando o token
      const { data, error: updateError } = await supabase.auth.updateUser({ 
        password: password
      });
      
      console.log("Resultado da atualização:", data, updateError);
      
      if (updateError) {
        setError(updateError.message);
      } else {
        // Remover o token do sessionStorage após uso bem-sucedido
        sessionStorage.removeItem('password_reset_token');
        setMessage("Senha redefinida com sucesso! Você será redirecionado para a página de login.");
        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      console.error("Erro ao redefinir senha:", err);
      setError("Ocorreu um erro ao redefinir sua senha. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
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
            
            {!token ? (
              <div className="text-center">
                <p className="text-destructive mb-4">
                  Token de redefinição de senha não encontrado. Por favor, solicite um novo link.
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
      <SiteFooter />
    </div>
  );
}