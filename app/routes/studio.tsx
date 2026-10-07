import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Layout } from "../components/Layout";
import { Plus, Settings, LogOut, Palette, Home, User, Sparkles, Wand2, Layers, Brush, Camera, Download, Share2, Heart, Clock, TrendingUp, Eye, Edit } from "lucide-react";
import { AuthModal } from "../components/auth/AuthModal";

export default function StudioProRevest() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Estados para gerenciamento do Studio
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("projects");
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Mock data para projetos iniciais
  const mockProjects = [
    {
      id: "1",
      name: "Sala de Estar Moderna",
      description: "Design contemporâneo com cores neutras e detalhes em madeira",
      thumbnail: "https://images.unsplash.com/photo-15569095763-2a9b0d3b1e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D3DWx0h&auto=format&fit=crop&w=800&q=80",
      status: "draft",
      created_at: "2023-12-01T10:00:00Z",
      updated_at: "2023-12-01T10:00:00Z"
    },
    {
      id: "2",
      name: "Cozinha Rústica",
      description: "Ambiente aconchegante com tons terrosos e elementos rústicos",
      thumbnail: "https://images.unsplash.com/photo-1578685827384-0c9a1e5a7c9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D3DWx0h&auto=format&fit=crop&w=800&q=80",
      status: "in_progress",
      created_at: "2023-11-28T14:30:00Z",
      updated_at: "2023-12-01T09:15:00Z"
    },
    {
      id: "3",
      name: "Quarto Infantil",
      description: "Cores vibrantes e divertidas para o quarto dos pequenos",
      thumbnail: "https://images.unsplash.com/photo-1586023468424-c2cb7a7f0ecf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D3DWx0h&auto=format&fit=crop&w=800&q=80",
      status: "completed",
      created_at: "2023-11-15T16:45:00Z",
      updated_at: "2023-11-20T11:30:00Z"
    }
  ];

  useEffect(() => {
    const loadProjects = async () => {
      try {
        // Simular carregamento de projetos
        setTimeout(() => {
          setProjects(mockProjects);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Erro ao carregar projetos:", error);
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleCreateProject = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    navigate("/studioprorevest");
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/studio/project/${projectId}`);
  };

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) {
      signOut();
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <Layout showHeaderFooter={false}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary border-t-transparent mb-4"></div>
            <p className="text-muted-foreground">Carregando Studio ProRevest...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showHeaderFooter={false}>
      <div className="min-h-screen bg-gray-50">
        {/* Header do Studio */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                    <Palette className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Studio ProRevest</h1>
                    <p className="text-sm text-gray-500">Design de Interiores com IA</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-5 w-5 mr-2" />
                      <span>Olá, {user.email}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-gray-500 hover:text-gray-700 flex items-center"
                      title="Sair"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section Premium */}
          <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 rounded-3xl p-12 mb-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <Sparkles className="h-8 w-8 mr-3 animate-pulse" />
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                  Studio ProRevest
                </h2>
                <Sparkles className="h-8 w-8 ml-3 animate-pulse" />
              </div>
              <p className="text-xl mb-8 max-w-3xl mx-auto text-center leading-relaxed">
                Transforme seus espaços com IA avançada. Design profissional, cores perfeitas e resultados incríveis em minutos.
              </p>
              
              {/* Features Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <Wand2 className="h-12 w-12 mb-4 text-yellow-300 mx-auto" />
                  <h3 className="font-semibold mb-2">IA Generativa</h3>
                  <p className="text-sm opacity-90">Designs únicos com inteligência artificial</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <Palette className="h-12 w-12 mb-4 text-pink-300 mx-auto" />
                  <h3 className="font-semibold mb-2">Paletas Expert</h3>
                  <p className="text-sm opacity-90">Cores profissionais para cada ambiente</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <Camera className="h-12 w-12 mb-4 text-orange-300 mx-auto" />
      <h3 className="font-semibold mb-2">Visualização Pro</h3>
                  <p className="text-sm opacity-90">Veja seu projeto antes de executar</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleCreateProject}
                  className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center group hover:scale-105 shadow-lg"
                >
                  <Plus className="h-6 w-6 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                  Criar Novo Projeto
                </button>
                <button
                  onClick={() => navigate("/inspiracao")}
                  className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center justify-center border border-white/30"
                >
                  <Heart className="h-6 w-6 mr-3" />
                  Ver Inspirações
                </button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-purple-600 mb-2">1.2K+</div>
              <div className="text-sm text-gray-600">Projetos Criados</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-pink-600 mb-2">850+</div>
              <div className="text-sm text-gray-600">Cores Disponíveis</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-orange-600 mb-2">4.9★</div>
              <div className="text-sm text-gray-600">Satisfação</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">IA Online</div>
            </div>
          </div>

          {/* Tabs de Navegação (apenas para usuários autenticados) */}
          {user && (
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("projects")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "projects"
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <Home className="h-5 w-5 mr-2" />
                      Meus Projetos
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("gallery")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "gallery"
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <Palette className="h-5 w-5 mr-2" />
                      Galeria de Cores
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("templates")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "templates"
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Templates
                    </div>
                  </button>
                </nav>
              </div>
            </div>
          )}

          {/* Conteúdo da Tab Ativa */}
          {user && activeTab === "projects" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Meus Projetos</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{projects.length} projetos</span>
                </div>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-6xl mb-4">🎨</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum projeto ainda</h3>
                  <p className="text-gray-600 mb-6">Comece criando seu primeiro projeto de design</p>
                  <button
                    onClick={handleCreateProject}
                    className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Criar Projeto
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105"
                      onClick={() => handleViewProject(project.id)}
                    >
                      <div className="aspect-video relative">
                        <img
                          src={project.thumbnail}
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full backdrop-blur-sm ${
                            project.status === 'completed'
                              ? 'bg-green-500/90 text-white'
                              : project.status === 'in_progress'
                              ? 'bg-yellow-500/90 text-white'
                              : 'bg-gray-500/90 text-white'
                          }`}>
                            {project.status === 'completed' && '✓ Concluído'}
                            {project.status === 'in_progress' && '⚡ Em Andamento'}
                            {project.status === 'draft' && '📝 Rascunho'}
                          </span>
                        </div>
                        
                        {/* Action Buttons Overlay */}
                        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button className="flex-1 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors flex items-center justify-center">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </button>
                          <button className="flex-1 bg-purple-600/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center">
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h4 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-purple-600 transition-colors">{project.name}</h4>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(project.created_at).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {project.status === 'completed' ? '100%' : project.status === 'in_progress' ? '60%' : '10%'}
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              project.status === 'completed'
                                ? 'bg-green-500 w-full'
                                : project.status === 'in_progress'
                                ? 'bg-yellow-500 w-3/5'
                                : 'bg-gray-400 w-1/10'
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {user && activeTab === "gallery" && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Galeria de Cores</h3>
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Em Breve</h3>
                <p className="text-gray-600 mb-6">Explore nossa paleta de cores completa</p>
                <button
                  onClick={() => navigate("/paleta-cores")}
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Ver Paleta de Cores
                </button>
              </div>
            </div>
          )}

          {user && activeTab === "templates" && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Templates de Design</h3>
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Em Breve</h3>
                <p className="text-gray-600 mb-6">Templates prontos para começar rapidamente</p>
                <button
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Explorar Templates
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Modal de Autenticação */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          navigate("/studioprorevest");
        }}
      />
    </Layout>
  );
}
