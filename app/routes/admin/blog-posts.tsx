import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Eye, Calendar, User } from "lucide-react";
import { BlogService, type BlogPost } from "../../services/blogService";
import { useNavigate, useLoaderData } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Variáveis de ambiente para o client
const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug: log variáveis no console (remover em produção)
console.log("Blog Posts Route - VITE_SUPABASE_URL:", VITE_SUPABASE_URL ? "definida" : "NÃO DEFINIDA");
console.log("Blog Posts Route - VITE_SUPABASE_ANON_KEY:", VITE_SUPABASE_ANON_KEY ? "definida" : "NÃO DEFINIDA");

export const meta: MetaFunction = () => {
  return [
    { title: "Posts do Blog - ProRevest" },
    { name: "description", content: "Gerencie os posts do blog da ProRevest" },
  ];
}

export async function loader({}: LoaderFunctionArgs) {
  try {
    // Usar variáveis de ambiente diretamente
    if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
      console.error("Variáveis de ambiente do Supabase não configuradas");
      return { posts: [], error: "Configuração do Supabase ausente" };
    }

    const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao buscar posts:", error);
      return { posts: [], error: "Falha ao carregar posts" };
    }

    console.log("Posts carregados no loader:", posts?.length || 0);
    return { posts: posts || [], error: null };
  } catch (error) {
    console.error("Erro no loader de blog posts:", error);
    return { posts: [], error: "Falha ao carregar posts" };
  }
}

export default function AdminBlogPosts() {
  const { posts: loaderPosts, error: loaderError } = useLoaderData() as { posts: BlogPost[]; error: string | null };
  const { user } = useAuth();

  const [posts, setPosts] = useState<BlogPost[]>(loaderPosts || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(loaderPosts || []);
  const [isLoading, setIsLoading] = useState(!loaderPosts || loaderPosts.length === 0);
  const navigate = useNavigate();

  // Carregar posts no client-side se o loader falhar ou retornar vazio
  useEffect(() => {
    // Se o loader retornou posts, usar eles
    if (loaderPosts && loaderPosts.length > 0 && !loaderError) {
      setPosts(loaderPosts);
      setFilteredPosts(loaderPosts);
      setIsLoading(false);
      return;
    }

    // Se o loader falhou ou retornou vazio, tentar carregar no client-side com autenticação
    const loadPostsClientSide = async () => {
      if (!user) {
        console.log("Usuário não autenticado, aguardando...");
        return;
      }

      try {
        console.log("Carregando posts no client-side com usuário autenticado:", user.id);

        // Verificar variáveis de ambiente
        if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
          console.error("Variáveis de ambiente do Supabase não configuradas");
          return;
        }

        // Criar cliente para obter sessão
        const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          console.warn("Sessão não encontrada");
          return;
        }

        // Criar cliente autenticado
        const authenticatedClient = createClient(
          VITE_SUPABASE_URL,
          VITE_SUPABASE_ANON_KEY,
          {
            global: {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            },
          }
        );

        const { data: clientPosts, error } = await authenticatedClient
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Erro ao buscar posts no client-side:", error);
          return;
        }

        console.log("Posts carregados no client-side:", clientPosts?.length || 0);
        setPosts(clientPosts || []);
        setFilteredPosts(clientPosts || []);
      } catch (error) {
        console.error("Erro ao carregar posts no client-side:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPostsClientSide();
  }, [loaderPosts, loaderError, user]);

  const handleRefresh = async () => {
    try {
      setIsLoading(true);

      // Verificar variáveis de ambiente
      if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
        console.error("Variáveis de ambiente do Supabase não configuradas");
        alert("Configuração do Supabase ausente");
        return;
      }

      // Criar cliente para obter sessão
      const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        console.warn("Sessão não encontrada");
        alert("Usuário não autenticado");
        return;
      }

      // Criar cliente autenticado
      const authenticatedClient = createClient(
        VITE_SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY,
        {
          global: {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          },
        }
      );

      const { data: posts, error } = await authenticatedClient
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro ao buscar posts:", error);
        alert("Erro ao carregar posts");
        return;
      }

      setPosts(posts || []);
      setFilteredPosts(posts || []);
    } catch (error) {
      console.error("Erro ao recarregar posts:", error);
      alert("Erro ao recarregar posts");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (loaderError) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-400 mb-2">Erro</h2>
        <p className="text-red-300 mb-4">{loaderError}</p>
        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Recarregar página
          </button>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar carregar posts
          </button>
        </div>
      </div>
    );
  }

  // Filtrar posts com base no termo de busca
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchTerm, posts]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Publicado</span>;
      case "draft":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Rascunho</span>;
      case "archived":
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Arquivado</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Desconhecido</span>;
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;

    try {
      // Verificar variáveis de ambiente
      if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
        console.error("Variáveis de ambiente do Supabase não configuradas");
        alert("Configuração do Supabase ausente");
        return;
      }

      // Criar cliente para obter sessão
      const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        alert("Usuário não autenticado");
        return;
      }

      // Criar cliente autenticado
      const authenticatedClient = createClient(
        VITE_SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY,
        {
          global: {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          },
        }
      );

      await BlogService.deleteBlogPost(postId, authenticatedClient);

      const updatedPosts = posts.filter(p => p.id !== postId);
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
    } catch (error) {
      console.error("Erro ao deletar post:", error);
      alert("Erro ao deletar post. Por favor, tente novamente.");
    }
  };

  const handleViewPost = (slug: string) => {
    window.open(`/blog/${slug}`, '_blank');
  };

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
          <div>
            <h1 className="text-4xl font-cormorant font-bold text-slate-100 mb-2">Posts do Blog</h1>
            <p className="text-slate-300 text-lg">Gerencie os posts do blog da ProRevest</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2"
              title="Recarregar lista de posts"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Atualizar
            </button>
            <button
              onClick={() => navigate("/admin/blog-posts/new")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Novo Post
            </button>
          </div>
        </div>
      </div>

      {/* Barra de busca */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 h-6 w-6" />
          <input
            type="text"
            placeholder="Buscar posts..."
            className="w-full pl-14 pr-6 py-4 border border-slate-600 rounded-lg bg-slate-700/50 text-slate-200 text-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela de posts */}
      <div className="bg-slate-800/50 border border-slate-600 rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-600">
          <thead className="bg-slate-900/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">
                Título
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">
                Autor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">
                Categoria
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">
                Visualizações
              </th>
              <th scope="col" className="px-6 py-3 text-right text-sm font-medium text-slate-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-800/50 divide-y divide-slate-600">
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-8 py-8 text-center text-slate-400 text-lg">
                  Nenhum post encontrado
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-100 text-base mb-1">{post.title}</div>
                    <div className="text-sm text-slate-400 line-clamp-1">{post.excerpt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-slate-400" />
                      <span className="text-slate-200 text-sm">{post.author}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(post.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-200 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                      {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-slate-100">{post.views || 0}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewPost(post.slug)}
                      className="text-blue-400 hover:text-blue-300 mr-3 transition-colors inline-flex items-center justify-center"
                      title="Visualizar"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/admin/blog-posts/${post.id}/edit`)}
                      className="text-green-400 hover:text-green-300 mr-3 transition-colors inline-flex items-center justify-center"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-400 hover:text-red-300 transition-colors inline-flex items-center justify-center"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-lg text-slate-300">
          Mostrando 1 a {filteredPosts.length} de {filteredPosts.length} resultados
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 border border-slate-600 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-700/50 transition-colors">
            Anterior
          </button>
          <button className="px-4 py-2 border border-slate-600 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-700/50 transition-colors">
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}
