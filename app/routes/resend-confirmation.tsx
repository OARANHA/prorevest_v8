import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const meta: MetaFunction = () => {
  return [
    { title: "Reenviar Confirmação - ProRevest" },
    { name: "description", content: "Reenvie o email de confirmação para sua conta ProRevest." },
  ];
}

export default function ResendConfirmation() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) {
        setError(error.message);
      } else {
        setMessage("Email de confirmação reenviado com sucesso! Verifique sua caixa de entrada.");
      }
    } catch (err) {
      setError("Ocorreu um erro ao reenviar o email. Por favor, tente novamente.");
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
              Reenviar Confirmação
            </h2>
            <p className="mt-2 text-muted-foreground">
              Reenvie o email de confirmação para sua conta
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
                    "Reenviar Email"
                  )}
                </button>
              </div>
            </form>

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