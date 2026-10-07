import type { MetaFunction } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, MapPin, Calendar, Tag, ChevronRight } from "lucide-react";
import { BlogService, type ProjectCase } from "../services/blogService";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const meta: MetaFunction = () => {
  return [
    { title: "Galeria de Projetos - ProRevest" },
    { name: "description", content: "Conheça os cases de sucesso da ProRevest" },
  ];
}

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<ProjectCase[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  
  const [searchTerm, setSearchTerm] = useState(search);
  const [selectedCategory, setSelectedCategory] = useState(category);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    setSearchTerm(search);
    setSelectedCategory(category);
  }, [search, category]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const [projectsData, categoriesData] = await Promise.all([
        BlogService.getPublishedProjectCases(),
        BlogService.getProjectCategories()
      ]);
      
      setProjects(projectsData);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      console.error("Error loading projects:", err);
      setError("Falha ao carregar projetos");
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchTerm === "" || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "" || project.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value) {
      searchParams.set("search", value);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value) {
      searchParams.set("category", value);
    } else {
      searchParams.delete("category");
    }
    setSearchParams(searchParams);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container mx-auto px-4 py-12 pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando projetos...</p>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container mx-auto px-4 py-12 pt-20">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-destructive mb-2">Erro</h2>
            <p className="text-destructive mb-4">{error}</p>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-4 py-12 pt-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-cormorant font-bold mb-4">Galeria de Projetos</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Conheça os cases de sucesso da ProRevest
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar projetos..."
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Todas as categorias</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Projects */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-cormorant font-bold mb-2">Nenhum projeto encontrado</h2>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory 
                ? "Tente ajustar seus filtros de busca" 
                : "Em breve teremos novos projetos publicados"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(project => (
              <article key={project.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {project.featured_image && (
                  <img 
                    src={project.featured_image} 
                    alt={project.title} 
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {project.category}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-cormorant font-bold mb-3 line-clamp-2">
                    <Link to={`/projects/${project.slug}`} className="hover:text-primary transition-colors">
                      {project.title}
                    </Link>
                  </h2>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(project.completed_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <Link 
                    to={`/projects/${project.slug}`} 
                    className="flex items-center gap-1 text-primary hover:text-primary/80 font-medium"
                  >
                    Ver projeto
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
