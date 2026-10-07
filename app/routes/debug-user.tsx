import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export const meta: MetaFunction = () => {
  return [
    { title: "Debug User - ProRevest" },
    { name: "description", content: "Página de debug para usuários" },
  ];
}

export default function DebugUser() {
  const [email, setEmail] = useState("aranha.com@gmail.com");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkUser = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    
    try {
      // Tentar fazer login para verificar o status
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: "ara1nha1@"
      });
      
      if (error) {
        setResult({ error: error.message });
        
        // Se o erro for de email não confirmado, tentar reenviar
        if (error.message.includes("Email not confirmed")) {
          const resendResult = await supabase.auth.resend({
            type: 'signup',
            email: email,
            options: {
              emailRedirectTo: window.location.origin
            }
          });
          
          if (resendResult.error) {
            setResult({ 
              error: error.message,
              resendError: resendResult.error.message
            });
          } else {
            setResult({ 
              error: error.message,
              resendSuccess: "Email de confirmação reenviado com sucesso!"
            });
          }
        }
      } else {
        setResult({ success: "Login bem-sucedido!", data });
      }
    } catch (err) {
      setError("Erro ao verificar usuário: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <Link to="/" className="text-3xl font-cormorant font-bold text-primary">
            ProRevest - Debug
          </Link>
          <h2 className="mt-6 text-3xl font-cormorant font-bold text-foreground">
            Debug de Usuário
          </h2>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              E-mail para debug
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="seu@email.com"
            />
          </div>

          <button
            onClick={checkUser}
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors mb-6 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verificando...
              </>
            ) : (
              "Verificar Usuário"
            )}
          </button>

          {error && (
            <div className="mb-6 bg-destructive/10 text-destructive p-4 rounded-lg">
              {error}
            </div>
          )}

          {result && (
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Resultado:</h3>
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Soluções possíveis:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Se o email não foi confirmado, clique em "Verificar Usuário" para reenviar o email de confirmação</li>
              <li>Verifique sua caixa de entrada e pasta de spam pelo email de confirmação</li>
              <li>Se esqueceu sua senha, use a página <Link to="/esqueci-senha" className="text-primary">Esqueci minha senha</Link></li>
              <li>Se ainda tiver problemas, tente <Link to="/register" className="text-primary">registrar uma nova conta</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}