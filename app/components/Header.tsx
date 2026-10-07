import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { LogoService } from '../services/logoService';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      // Tornar o header translúcido após rolar 50px
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Função para lidar com o logout
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Função para obter o nome do usuário
  const getUserName = () => {
    if (!user) return '';
    if (user.user_metadata && user.user_metadata.full_name) {
      return user.user_metadata.full_name;
    }
    return user.email || 'Usuário';
  };

  const [currentLogo, setCurrentLogo] = useState<string>('');

  // Carregar logotipo do localStorage ao montar
  useEffect(() => {
    const savedLogo = localStorage.getItem('siteLogo');
    if (savedLogo) {
      setCurrentLogo(savedLogo);
    } else {
      // Buscar no Supabase Storage se não houver no localStorage
      LogoService.getSiteLogoUrl().then((url) => {
        if (url) setCurrentLogo(url);
      });
    }
  }, []);

  // Função para atualizar logotipo
  const updateLogo = (newLogoUrl: string) => {
    setCurrentLogo(newLogoUrl);
    localStorage.setItem('siteLogo', newLogoUrl);
  };

  // Usar como efeito colateral do upload do admin
  useEffect(() => {
    const handleLogoChange = (event: CustomEvent) => {
      console.log('Header recebeu evento logoUpdate:', event.detail);
      updateLogo(event.detail.logoUrl);
    };

    window.addEventListener('logoUpdate', handleLogoChange as EventListener);
    window.addEventListener('logoUpdated', handleLogoChange as EventListener);

    return () => {
      window.removeEventListener('logoUpdate', handleLogoChange as EventListener);
      window.removeEventListener('logoUpdated', handleLogoChange as EventListener);
    };
  }, []);

  return (
    <header className={`fixed top-0 w-full transition-all duration-500 z-40 ${isScrolled ? 'bg-white/20 backdrop-blur-md' : 'bg-transparent'} `} style={{ top: '0px', zIndex: 60, height: '64px' }}>
      <div className="max-w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Logotipo do site */}
            {!currentLogo ? (
              <div className="flex-shrink-0">
                <Link to="/" className="cursor-pointer flex items-center space-x-2 drop-shadow-lg">
                  <i className={`ri-home-4-line text-xl ${isScrolled ? 'text-gray-900' : 'text-gray-900'} drop-shadow-md`}></i>
                  <h1 className={`text-2xl font-normal ${isScrolled ? 'text-gray-900' : 'text-gray-900'} drop-shadow-md`}>Studio Prorevest e Inspiração</h1>
                </Link>
              </div>
            ) : null}
          </div>

          <nav className={`hidden lg:flex items-center space-x-8 ${isMenuOpen ? 'block' : 'hidden'}`}>
            <Link to="/catalogo" className={`font-normal transition-all duration-300 text-lg ${isScrolled ? 'text-gray-900' : 'text-gray-900'} hover:text-orange-600 hover:scale-105 hover:shadow-lg hover:bg-white/10 hover:backdrop-blur-sm rounded-lg px-3 py-2 drop-shadow-sm`}>Catálogo</Link>
            <Link to="/paleta-cores" className={`font-normal transition-all duration-300 text-lg ${isScrolled ? 'text-gray-900' : 'text-gray-900'} hover:text-orange-600 hover:scale-105 hover:shadow-lg hover:bg-white/10 hover:backdrop-blur-sm rounded-lg px-3 py-2 drop-shadow-sm`}>Cores</Link>
            <Link to="/studio" className={`font-normal transition-all duration-300 text-lg ${isScrolled ? 'text-gray-900' : 'text-gray-900'} hover:text-orange-600 hover:scale-105 hover:shadow-lg hover:bg-white/10 hover:backdrop-blur-sm rounded-lg px-3 py-2 flex items-center group drop-shadow-sm`}>
              <i className="ri-palette-line mr-2 group-hover:rotate-12 transition-transform duration-300"></i>
              <span className="font-medium">Studio</span>
              <span className="ml-1 font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">ProRevest</span>
            </Link>
            <Link to="/inspiracao" className={`font-normal transition-all duration-300 text-lg ${isScrolled ? 'text-gray-900' : 'text-gray-900'} hover:text-orange-600 hover:scale-105 hover:shadow-lg hover:bg-white/10 hover:backdrop-blur-sm rounded-lg px-3 py-2 drop-shadow-sm`}>Inspiração</Link>
            {currentLogo && (
              <div className="relative w-16 md:w-20 xl:w-24 2xl:w-28 flex items-center justify-center" aria-hidden="false">
                <Link to="/" aria-label="Página inicial" className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                  <img
                    src={currentLogo}
                    alt="Prorevest Logo"
                    className={`h-20 xl:h-20 2xl:h-20 w-auto object-contain transition-all duration-300 drop-shadow-xl pt-4 ${isScrolled ? 'brightness-90' : 'brightness-100'} transform -translate-y-4 hover:scale-105`}
                    style={{ zIndex: 70 }}
                  />
                </Link>
              </div>
            )}
            <Link to="/blog" className={`font-normal transition-all duration-300 text-lg ${isScrolled ? 'text-gray-900' : 'text-gray-900'} hover:text-orange-600 hover:scale-105 hover:shadow-lg hover:bg-white/10 hover:backdrop-blur-sm rounded-lg px-3 py-2 drop-shadow-sm`}>Blog</Link>
            <Link to="/sobre" className={`font-normal transition-all duration-300 text-lg ${isScrolled ? 'text-gray-900' : 'text-gray-900'} hover:text-orange-600 hover:scale-105 hover:shadow-lg hover:bg-white/10 hover:backdrop-blur-sm rounded-lg px-3 py-2 drop-shadow-sm`}>Sobre</Link>
            <Link to="/contato" className={`font-normal transition-all duration-300 text-lg ${isScrolled ? 'text-gray-900' : 'text-gray-900'} hover:text-orange-600 hover:scale-105 hover:shadow-lg hover:bg-white/10 hover:backdrop-blur-sm rounded-lg px-3 py-2 drop-shadow-sm`}>Contato</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-3">
              {user ? (
                // Se o usuário estiver logado, mostrar opções de usuário
                <div className="flex items-center space-x-3">
                  <span className={`font-normal text-lg ${isScrolled ? 'text-gray-900' : 'text-gray-900'} drop-shadow-sm`}>
                    Olá, {getUserName()}
                  </span>
                  <button
                    onClick={handleLogout}
                    className={`font-normal transition-all duration-300 text-lg ${isScrolled ? 'text-gray-900' : 'text-gray-900'} hover:text-orange-600 hover:scale-105 hover:shadow-lg hover:bg-white/10 hover:backdrop-blur-sm rounded-lg px-3 py-2 drop-shadow-sm`}
                  >
                    Sair
                  </button>
                </div>
              ) : (
                // Se o usuário não estiver logado, mostrar opções de login/cadastro
                <>
                  <Link to="/login" className={`font-normal transition-all duration-300 text-lg ${isScrolled ? 'text-gray-900' : 'text-gray-900'} hover:text-orange-600 hover:scale-105 hover:shadow-lg hover:bg-white/10 hover:backdrop-blur-sm rounded-lg px-3 py-2 drop-shadow-sm`}>Login</Link>
                  <Link to="/register" className={`px-6 py-2 rounded-lg font-normal whitespace-nowrap hover:bg-orange-700 transition-all duration-300 text-lg ${isScrolled ? 'bg-orange-600 text-white hover:text-white' : 'bg-orange-600 text-white'} hover:scale-105 hover:shadow-lg`}>
                    Cadastre-se
                  </Link>
                </>
              )}
            </div>
            <button
              className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-lg ${isScrolled ? 'text-gray-900 bg-orange-600 text-white' : 'text-white bg-orange-600'}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className="ri-menu-line text-xl"></i>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-2 py-2 space-y-1">
            <Link to="/catalogo" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">Catálogo</Link>
            <Link to="/paleta-cores" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">Cores</Link>
            <Link to="/studio" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 flex items-center group">
              <i className="ri-palette-line mr-2 group-hover:rotate-12 transition-transform duration-300"></i>
              <span className="font-medium">Studio</span>
              <span className="ml-1 font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">ProRevest</span>
            </Link>
            <Link to="/inspiracao" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">Inspiração</Link>
            <Link to="/blog" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">Insights</span>
            </Link>
            <Link to="/sobre" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">Sobre</Link>
            <Link to="/contato" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">Contato</Link>
            <div className="border-t border-gray-200 pt-2 space-y-1">
              {user ? (
                <>
                  <span className="block px-3 py-2 text-base font-medium text-gray-700">Olá, {getUserName()}</span>
                  <button 
                    onClick={handleLogout}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 w-full text-left"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">Login</Link>
                  <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">Cadastre-se</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
