import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  UserIcon, 
  ShoppingCartIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  SparklesIcon,
  PaintBrushIcon,
  ArrowsPointingOutIcon,
  LightBulbIcon,
  CalculatorIcon,
  StarIcon,
  FireIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { Search } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { SeasonalThemeToggle } from './SeasonalThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { Header } from './Header';
import { SiteFooter } from './SiteFooter';
import { FlowiseChat } from './FlowiseChat';
import { WhatsAppButton } from './WhatsAppButton';

const NavLink = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) => (
  <Link
    to={to}
    onClick={onClick}
    className="relative text-foreground transition-colors hover:text-primary group py-2"
  >
    {children}
    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
  </Link>
);

export function Layout({ children, showHeaderFooter = true }: { children: React.ReactNode; showHeaderFooter?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Detecção de rota admin baseada no router (consistente SSR/Client)
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const shouldShowHeaderFooter = showHeaderFooter && !isAdminRoute;

  // Estado para a pesquisa
  const [searchQuery, setSearchQuery] = useState("");

  // Função para lidar com a pesquisa
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirecionar para a página de catálogo com o termo de busca
    if (searchQuery.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/catalogo');
    }
    // Limpar o campo de pesquisa após a submissão
    setSearchQuery("");
  };

  useEffect(() => {
    // Definir explicitamente o estado inicial
    // O menu deve ser visível ao iniciar a página
    setIsScrolled(false);
    
    // Função para verificar a posição do scroll
    const checkScroll = () => {
      // Apenas ocultar a barra de pesquisa quando rolar mais de 10px
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
    };
    
    // Verificar imediatamente ao carregar o componente
    checkScroll();
    
    // Adicionar listener para o evento de scroll
    window.addEventListener('scroll', checkScroll);
    
    // Limpar o listener quando o componente for desmontado
    return () => {
      window.removeEventListener('scroll', checkScroll);
    };
  }, []);



  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Função para obter o nome do usuário
  const getUserName = () => {
    if (!user) return '';
    // Verificar se o usuário tem dados de perfil
    if (user.user_metadata && user.user_metadata.full_name) {
      return user.user_metadata.full_name;
    }
    // Caso contrário, usar o email como fallback
    return user.email || 'Usuário';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-foreground font-inter transition-colors duration-300">
      {shouldShowHeaderFooter && <Header />}
      <main className={`${shouldShowHeaderFooter ? 'pt-16' : ''} transition-all duration-300`}>
        {children}
      </main>
      {shouldShowHeaderFooter && <SiteFooter />}
      {/* Adicionar o chat Flowise e botão WhatsApp em todas as páginas que não são admin */}
      {!isAdminRoute && (
        <>
          <FlowiseChat />
          <WhatsAppButton />
        </>
      )}
    </div>
  );
}

export default Layout;

// Adicionando os ícones que estavam faltando
function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}
