import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

export const SiteHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth(); // Utilizando o contexto de autenticação
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

  return (
    <header className={`fixed top-0 w-full transition-all duration-500 z-40 ${isScrolled ? 'bg-white/20 backdrop-blur-md' : 'bg-transparent'} `} style={{ top: '0px', zIndex: 60, height: '64px' }}>
      <div className="max-w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="cursor-pointer">
              <h1 className={`text-2xl font-normal ${isScrolled ? 'text-gray-900' : 'text-blue-600'}`}>Prorevest</h1>
            </Link>
          </div>
          <nav className={`hidden lg:flex items-center space-x-8 ${isMenuOpen ? 'block' : 'hidden'}`}>
            <Link to="/simulador" className={`font-normal hover:text-orange-300 transition-colors text-lg ${isScrolled ? 'text-gray-900' : 'text-blue-600'}`}>Ferramentas</Link>
            <Link to="/catalogo" className={`font-normal hover:text-orange-300 transition-colors text-lg ${isScrolled ? 'text-gray-900' : 'text-blue-600'}`}>Catálogo</Link>
            <Link to="/inspiracao" className={`font-normal hover:text-orange-300 transition-colors text-lg ${isScrolled ? 'text-gray-900' : 'text-blue-600'}`}>Inspiração</Link>
            <Link to="/blog" className={`font-normal transition-colors text-lg ${isScrolled ? 'text-gray-900' : 'text-blue-600'} hover:opacity-90`}>
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">Insights</span>
            </Link>
            <Link to="/sobre" className={`font-normal hover:text-orange-300 transition-colors text-lg ${isScrolled ? 'text-gray-900' : 'text-blue-600'}`}>Sobre</Link>
            <Link to="/contato" className={`font-normal hover:text-orange-300 transition-colors text-lg ${isScrolled ? 'text-gray-900' : 'text-blue-600'}`}>Contato</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-3">
              {user ? (
                // Se o usuário estiver logado, mostrar opções de usuário
                <div className="flex items-center space-x-3">
                  <span className={`font-normal text-lg ${isScrolled ? 'text-gray-900' : 'text-blue-600'}`}>
                    Olá, {getUserName()}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className={`font-normal hover:text-orange-300 transition-colors text-lg ${isScrolled ? 'text-gray-900' : 'text-blue-600'}`}
                  >
                    Sair
                  </button>
                </div>
              ) : (
                // Se o usuário não estiver logado, mostrar opções de login/cadastro
                <>
                  <Link to="/login" className={`font-normal hover:text-orange-300 transition-colors text-lg ${isScrolled ? 'text-gray-900' : 'text-blue-600'}`}>Login</Link>
                  <Link to="/register" className={`px-6 py-2 rounded-lg font-normal whitespace-nowrap hover:bg-orange-700 transition-colors text-lg ${isScrolled ? 'bg-orange-600 text-white hover:text-white' : 'bg-orange-600 text-white'}`}>
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
    </header>
  );
};