import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

import { SiteFooter } from "../components/SiteFooter";
import { supabase } from "../lib/supabaseClient";

export const meta: MetaFunction = () => {
  return [
    { title: "Cadastro - ProRevest" },
    { name: "description", content: "Crie sua conta no sistema ProRevest para acessar recursos exclusivos para arquitetos e designers." },
  ];
}

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    role: "architect"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      console.log("Tentando registrar usuário:", formData.email);
      const { error, data } = await signUp(formData.email, formData.password, formData.fullName);
      console.log("Resultado do registro:", { error, data });
      
      if (error) {
        setError(error.message);
      } else {
        // Registration successful
        console.log("Registro bem-sucedido, verificando papel do usuário...");
        // Verificar se o usuário é administrador para redirecionar corretamente
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
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
      console.error("Erro ao registrar usuário:", err);
      setError("Ocorreu um erro ao criar sua conta. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="py-12 px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Link to="/" className="text-3xl font-cormorant font-bold text-primary">
              ProRevest
            </Link>
            <h2 className="mt-6 text-3xl font-cormorant font-bold text-foreground">
              Crie sua conta
            </h2>
            <p className="mt-2 text-muted-foreground">
              Acesse recursos exclusivos para profissionais de arquitetura e design
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            {error && (
              <div className="mb-6 bg-destructive/10 text-destructive p-4 rounded-lg">
                {error}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                    Nome Completo *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    E-mail *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Senha *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Mínimo de 6 caracteres
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                    Confirmar Senha *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2">
                    Empresa (opcional)
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Nome da sua empresa"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium mb-2">
                    Profissão *
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="architect">Arquiteto</option>
                    <option value="designer">Designer</option>
                    <option value="builder">Construtora</option>
                    <option value="retailer">Lojista</option>
                    <option value="other">Outro</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-foreground">
                  Concordo com os <Link to="/termos" className="text-primary hover:text-primary/80">Termos de Serviço</Link> e a <Link to="/privacidade" className="text-primary hover:text-primary/80">Política de Privacidade</Link>
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
                      Criando conta...
                    </>
                  ) : (
                    "Criar Conta"
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
                    Ou cadastre-se com
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

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Já tem uma conta?{' '}
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