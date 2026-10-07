import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RequireAuth from '../components/auth/RequireAuth';
import { useAuth } from '../contexts/AuthContext';
import { ProjectService, type Project } from '../services/projectService';

export default function MeusProjetos() {
  const [activeTab, setActiveTab] = useState('projects');
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      if (!user?.id) {
        setLoadingProjects(false);
        setProjects([]);
        return;
      }
      try {
        const data = await ProjectService.getProjects(user.id);
        setProjects(data);
        setErrorProjects(null);
      } catch (err) {
        console.error('Erro ao carregar projetos do usuário:', err);
        setErrorProjects('Falha ao carregar seus projetos');
      } finally {
        setLoadingProjects(false);
      }
    };
    loadProjects();
  }, [user]);
  
  const navigate = useNavigate();
  const openDesigner = (projectId: string) => {
    try {
      localStorage.setItem('studioActiveProjectId', projectId);
    } catch {}
    navigate(`/studio?projectId=${projectId}`);
  };
  
  // Mock data for quotes
  const quotes = [
    {
      id: 'quote-1',
      status: 'sent',
      created_at: '2023-05-18'
    },
    {
      id: 'quote-2',
      status: 'approved',
      created_at: '2023-05-10'
    }
  ];

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-cormorant font-bold">Meus Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie seus projetos e orçamentos solicitados
          </p>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-border mb-8">
          <nav className="flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "projects"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
              }`}
              onClick={() => setActiveTab("projects")}
            >
              Projetos
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "quotes"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
              }`}
              onClick={() => setActiveTab("quotes")}
            >
              Orçamentos
            </button>
          </nav>
        </div>
        
        {/* Content based on active tab */}
        {activeTab === "projects" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-cormorant font-bold">Projetos Recentes</h2>
              <Link 
                to="/studio"
                className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Novo Projeto
              </Link>
            </div>
            
            {loadingProjects ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Carregando projetos...</p>
              </div>
            ) : errorProjects ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">Não foi possível carregar seus projetos</h3>
                <p className="text-muted-foreground">Tente novamente mais tarde.</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-xl font-medium mb-2">Nenhum projeto encontrado</h3>
                <p className="text-muted-foreground mb-6">
                  Comece criando seu primeiro projeto
                </p>
                <Link 
                  to="/studio"
                  className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Criar Projeto
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-cormorant font-bold">{project.name}</h3>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          Em andamento
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-4">{project.description}</p>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Criado em: {new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
                        <span>Atualizado: {new Date(project.updated_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="bg-muted/30 px-6 py-4 flex justify-between">
                      <button 
                        onClick={() => openDesigner(project.id)}
                        className="text-primary hover:text-primary/80 font-medium"
                      >
                        Abrir Designer
                      </button>
                      <button className="text-muted-foreground hover:text-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "quotes" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-cormorant font-bold">Orçamentos</h2>
              <Link 
                to="/orcamento" 
                className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Novo Orçamento
              </Link>
            </div>
            
            {quotes.length === 0 ? (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-medium mb-2">Nenhum orçamento encontrado</h3>
                <p className="text-muted-foreground mb-6">
                  Solicite um orçamento para seus projetos
                </p>
                <Link 
                  to="/orcamento" 
                  className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Solicitar Orçamento
                </Link>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/30">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Número
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Data
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {quotes.map((quote) => (
                      <tr key={quote.id} className="hover:bg-muted/10">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {quote.id.substring(0, 8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            quote.status === "signed" 
                              ? "bg-green-100 text-green-800" 
                              : quote.status === "sent" 
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {quote.status === "draft" && "Rascunho"}
                            {quote.status === "sent" && "Enviado"}
                            {quote.status === "approved" && "Aprovado"}
                            {quote.status === "signed" && "Assinado"}
                            {quote.status === "archived" && "Arquivado"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                          {new Date(quote.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link to={`/assinatura-orcamento/${quote.id}`} className="text-primary hover:text-primary/80 mr-4">
                            Ver
                          </Link>
                          <button className="text-muted-foreground hover:text-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </RequireAuth>
  );
}