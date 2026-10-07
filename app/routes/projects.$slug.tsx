import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { Calendar, MapPin, User, Tag, ArrowLeft, Share2, Eye } from "lucide-react";
import { BlogService, type ProjectCase } from "../services/blogService";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const meta: MetaFunction = ({ data }: { data: any }) => {
  if (!data || !data.project) return [];
  
  return [
    { title: `${data.project.name} - Meus Projetos` },
    { name: "description", content: data.project.description },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const { slug } = params;
    if (!slug) {
      throw new Error("Slug não fornecido");
    }
    
    const project = await BlogService.getProjectCaseBySlug(slug);
    if (!project) {
      throw new Error("Projeto não encontrado");
    }
    
    // Incrementar visualizações
    await BlogService.incrementProjectCaseViews(project.id);
    
    return { project };
  } catch (error) {
    console.error("Error loading project:", error);
    return { project: null, error: "Falha ao carregar o projeto" };
  }
}

export default function Project() {
  const { project, error } = useLoaderData() as { project: ProjectCase | null; error?: string };
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container mx-auto px-4 py-12 pt-20">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-destructive mb-2">Erro</h2>
            <p className="text-destructive mb-4">{error || "Projeto não encontrado"}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: project.title,
          text: project.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-4 py-12 pt-20 max-w-6xl">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Voltar
        </button>
        
        <article className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          {project.featured_image && (
            <img 
              src={project.featured_image} 
              alt={project.title} 
              className="w-full h-64 md:h-96 object-cover"
            />
          )}
          
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
                {project.category}
              </span>
              {project.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-cormorant font-bold mb-4">
              {project.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 mb-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Cliente: {project.client}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>Concluído em {new Date(project.completed_at).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <span>{project.views} visualizações</span>
              </div>
            </div>
            
            <div 
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
            
            {/* Galeria de imagens */}
            {project.images && project.images.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-cormorant font-bold mb-6">Galeria</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.images.map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`Imagem do projeto ${project.title} - ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Produtos utilizados */}
            {project.products_used && project.products_used.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-cormorant font-bold mb-6">Produtos Utilizados</h2>
                <p className="text-muted-foreground">Em breve informações detalhadas sobre os produtos utilizados neste projeto.</p>
              </div>
            )}
            
            <div className="mt-12 pt-6 border-t border-border flex items-center justify-between">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-primary hover:text-primary/80"
              >
                <Share2 className="h-5 w-5" />
                {copied ? 'Link copiado!' : 'Compartilhar'}
              </button>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Última atualização:</span>
                <span>{new Date(project.updated_at).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </article>
      </div>
      <SiteFooter />
    </div>
  );
}
