import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Palette } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";

/**
 * Header canônico. A marca publicada é determinística, não depende do
 * localStorage de cada visitante nem de consultas ao Supabase Storage.
 * O fluxo administrativo de upload de logo continua separado.
 */
const MAIN_LINKS = [
  { to: "/catalogo", label: "Catálogo" },
  { to: "/paleta-cores", label: "Cores" },
  { to: "/studio", label: "Studio" },
  { to: "/inspiracao", label: "Inspiração" },
  { to: "/blog", label: "Blog" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" }
] as const;

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Falha ao sair:", error.message);
      return;
    }
    setOpen(false);
    navigate("/");
  }

  const links = MAIN_LINKS.map(item => {
    const studio = item.label === "Studio";
    return <Link key={item.to} to={item.to}
      aria-current={location.pathname === item.to ? "page" : undefined}
      className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500">
      {studio ? <><Palette size={15} aria-hidden="true"/><span>Studio</span><span className="font-bold text-orange-600">ProRevest</span></> : item.label}
    </Link>;
  });

  const account = user ? <>
    <span className="max-w-[140px] truncate text-xs text-gray-600" title={user.user_metadata?.full_name || user.email || ""}>
      {user.user_metadata?.full_name || user.email || "Minha conta"}
    </span>
    <button type="button" onClick={signOut} className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">Sair</button>
  </> : <>
    <Link to="/login" className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">Login</Link>
    <Link to="/register" className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700">Cadastre-se</Link>
  </>;

  return <header className={`fixed inset-x-0 top-0 z-[60] h-16 border-b border-white/70 bg-white/95 shadow-sm transition-shadow duration-300 ${scrolled ? "shadow-md" : ""}`}>
    <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between gap-3 px-4 lg:px-8">
      <Link to="/" aria-label="ProRevest — página inicial" className="flex shrink-0 items-center gap-2 lg:hidden">
        <img src="/images/catalog-launch/prorevest-logo.png" alt="ProRevest" className="h-9 w-auto max-w-[130px] object-contain" />
      </Link>
      <div className="hidden min-w-0 flex-1 items-center justify-end gap-1 lg:flex">{links.slice(0, 4)}</div>
      <Link to="/" aria-label="ProRevest — página inicial" className="hidden w-28 shrink-0 justify-center lg:flex">
        <img src="/images/catalog-launch/prorevest-logo.png" alt="ProRevest" className="h-10 w-auto max-w-28 object-contain" />
      </Link>
      <div className="hidden min-w-0 flex-1 items-center justify-start gap-1 lg:flex">
        <nav aria-label="Navegação principal" className="flex items-center gap-1">{links.slice(4)}</nav>
        <div className="ml-auto flex shrink-0 items-center gap-1">{account}</div>
      </div>
      <button type="button" aria-expanded={open} aria-controls="mobile-primary-nav" aria-label={open ? "Fechar menu" : "Abrir menu"} onClick={() => setOpen(v => !v)}
        className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 text-gray-800 lg:hidden">
        {open ? <X size={23}/> : <Menu size={23}/>}
      </button>
    </div>
    {open && <nav id="mobile-primary-nav" aria-label="Navegação móvel" className="max-h-[calc(100dvh-64px)] overflow-auto border-t border-gray-100 bg-white px-5 py-4 shadow-xl lg:hidden">
      <div className="flex flex-col items-start gap-1">{links}</div>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">{account}</div>
    </nav>}
  </header>;
};
