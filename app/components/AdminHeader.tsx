import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRightOnRectangleIcon, BellIcon, CogIcon, EyeIcon } from '@heroicons/react/24/outline';
import { LogoService } from '../services/logoService';

export const AdminHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoSize, setLogoSize] = useState({ width: 120, height: 48 });

  // Carregar logotipo do localStorage ao montar
  useEffect(() => {
    const savedLogo = localStorage.getItem('adminLogo') || localStorage.getItem('siteLogo');
    if (savedLogo) {
      setLogoUrl(savedLogo);
    } else {
      LogoService.getSiteLogoUrl().then((url) => {
        if (url) setLogoUrl(url);
      });
    }

    const handleLogoUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ logoUrl: string }>;
      if (customEvent.detail && typeof customEvent.detail.logoUrl === 'string') {
        const newLogoUrl = customEvent.detail.logoUrl;
        setLogoUrl(newLogoUrl);
      }
    };

    window.addEventListener('logoUpdated', handleLogoUpdate);

    return () => {
      window.removeEventListener('logoUpdated', handleLogoUpdate);
    };
  }, []);

  // Detectar scroll e ajustar tamanho do logo
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
      
      // Reduzir o logo ao rolar
      if (scrolled) {
        setLogoSize({ width: 80, height: 32 });
      } else {
        setLogoSize({ width: 120, height: 48 });
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Verificar estado inicial

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleViewFrontend = () => {
    // Abrir o frontend em uma nova janela/janela
    window.open('/', '_blank');
  };

  const getUserName = () => {
    if (!user) return 'Administrador';
    if (user.user_metadata && user.user_metadata.full_name) {
      return user.user_metadata.full_name;
    }
    return user.email || 'Administrador';
  };

  return (
    <header className={`bg-slate-900 border-b border-slate-700/50 px-6 py-4 sticky top-0 z-50 transition-all duration-300 backdrop-blur-sm ${
      isScrolled ? 'py-3 shadow-xl shadow-black/10' : 'py-4'
    }`}>
      <div className="flex items-center justify-between">
        {/* Título */}
        <div className="flex items-center space-x-4">
          <div>
            <h1
              className="font-semibold text-white transition-all duration-300 tracking-tight"
              style={{ fontSize: isScrolled ? '16px' : '18px' }}
            >
              Painel Administrativo
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Sistema de Gestão ProRevest
            </p>
          </div>
        </div>
        
        {/* Controles do Usuário */}
        <div className="flex items-center space-x-3">
          {/* Indicador de Status */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-slate-800/50 rounded-full border border-slate-700/50">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-300 font-medium">Online</span>
          </div>

          {/* Separador */}
          <div className="h-6 w-px bg-slate-700/50"></div>

          {/* Notificações */}
          <button className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 relative group">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-slate-900"></span>
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center border border-slate-900">
              3
            </span>
          </button>
          
          {/* Configurações */}
          <button className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 group">
            <CogIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Visualizar Frontend */}
          <button 
            className="p-2.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800/50 rounded-lg transition-all duration-200 group"
            onClick={handleViewFrontend}
            title="Visualizar Frontend"
          >
            <EyeIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
          
          {/* Perfil do Usuário */}
          <div className="flex items-center space-x-3 pl-3 border-l border-slate-700/50">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white leading-tight">{getUserName()}</p>
              <p className="text-xs text-slate-400 mt-0.5">Administrador</p>
            </div>
            
            {/* Avatar */}
            <div className="relative group">
              <div className="h-10 w-10 bg-gradient-to-br from-orange-600 to-amber-600 rounded-full flex items-center justify-center border-2 border-slate-700 group-hover:border-orange-500 transition-colors duration-200">
                <span className="text-sm font-semibold text-white">
                  {getUserName().charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-200 -z-10"></div>
            </div>
            
            {/* Menu Dropdown (simplificado) */}
            <div className="relative">
              <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/50 rounded-lg transition-all duration-200 group"
                onClick={handleLogout}
                title="Sair do Sistema"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
