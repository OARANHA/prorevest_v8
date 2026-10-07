import { useEffect, useState } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
  onSuccess?: () => void;
};

export function AuthModal({ isOpen, onClose, defaultTab = "login", onSuccess }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // reset ao abrir
      setActiveTab(defaultTab);
      setEmail("");
      setPassword("");
      setFullName("");
      setConfirmPassword("");
      setAccepted(false);
      setError(null);
    }
  }, [isOpen, defaultTab]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError("Informe e-mail e senha.");
      return;
    }
    setLoading(true);
    try {
      const res = await signIn(email, password);
      if (res.error) {
        setError(res.error.message || "Não foi possível entrar.");
      } else {
        onClose();
        onSuccess?.();
      }
    } catch (e: any) {
      setError(e?.message || "Erro ao entrar.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError(null);
    if (!fullName || !email || !password) {
      setError("Preencha nome, e-mail e senha.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }
    if (!accepted) {
      setError("É necessário aceitar a Política de Privacidade e os Termos.");
      return;
    }
    setLoading(true);
    try {
      const res = await signUp(email, password, fullName);
      if (res.error) {
        setError(res.error.message || "Não foi possível cadastrar.");
      } else {
        // Em alguns fluxos do Supabase, é necessário confirmar e-mail.
        onClose();
        onSuccess?.();
      }
    } catch (e: any) {
      setError(e?.message || "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex space-x-4">
            <button
              className={`text-sm font-semibold pb-1 border-b-2 ${
                activeTab === "login" ? "border-primary text-primary" : "border-transparent text-gray-500"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Entrar
            </button>
            <button
              className={`text-sm font-semibold pb-1 border-b-2 ${
                activeTab === "register" ? "border-primary text-primary" : "border-transparent text-gray-500"
              }`}
              onClick={() => setActiveTab("register")}
            >
              Cadastrar-se
            </button>
          </div>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100" aria-label="Fechar modal">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}

          {activeTab === "login" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <div className="relative">
                  <Mail className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <div className="relative">
                  <Lock className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    className="w-full border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Ao continuar, você declara estar ciente da nossa
                {" "}
                <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer" className="text-primary underline">Política de Privacidade</a>
                {" "}e dos
                {" "}
                <a href="/termos-de-uso" target="_blank" rel="noopener noreferrer" className="text-primary underline">Termos de Uso</a>.
              </p>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-primary text-white py-2 rounded-md font-semibold hover:bg-primary/90 disabled:opacity-60"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
                <div className="relative">
                  <User className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <div className="relative">
                  <Mail className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <div className="relative">
                  <Lock className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Crie uma senha"
                    className="w-full border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar senha</label>
                <div className="relative">
                  <Lock className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    className="w-full border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <label className="flex items-start space-x-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  Li e concordo com a
                  {" "}
                  <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer" className="text-primary underline">Política de Privacidade</a>
                  {" "}e com os
                  {" "}
                  <a href="/termos-de-uso" target="_blank" rel="noopener noreferrer" className="text-primary underline">Termos de Uso</a>.
                </span>
              </label>
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-primary text-white py-2 rounded-md font-semibold hover:bg-primary/90 disabled:opacity-60"
              >
                {loading ? "Cadastrando..." : "Criar conta"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}