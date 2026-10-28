import { useState, useEffect } from "react";
import { Link, useLoaderData } from "react-router-dom";
import type { MetaFunction } from "react-router-dom";
import type { LoaderFunctionArgs } from "react-router-dom";
import { Calendar, User, Clock, ChevronRight, Search, Filter, ArrowRight } from "lucide-react";

import type { BlogPost as ServiceBlogPost } from "~/services/blogService";

interface BlogPost extends ServiceBlogPost {
  read_time: number; // Adicionado para compatibilidade
}

interface LoaderData {
  posts: BlogPost[];
  categories: string[];
  tags: string[];
  totalPosts: number;
  currentPage: number;
  totalPages: number;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Blog - Prorevest" },
    { name: "description", content: "Dicas, tendências e guias sobre tintas, cores e acabamentos para revestimentos industriais." },
    { name: "keywords", content: "blog, tintas, cores, dicas, guias, tendências, acabamentos, revestimentos industriais" },
  ];
};

import { BlogService } from "~/services/blogService";

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderData> {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const category = url.searchParams.get("category");
  const tag = url.searchParams.get("tag");
  const search = url.searchParams.get("search");

  try {
    // Usar BlogService para buscar dados reais do Supabase
    const posts = await BlogService.getBlogPosts('published');
    const categories = await BlogService.getBlogCategories();
    const tags = await BlogService.getBlogTags();

    // Filtragem básica no frontend (podemos melhorar depois)
    let filteredPosts = posts;
    if (category) {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }
    if (tag) {
      filteredPosts = filteredPosts.filter(post => post.tags.includes(tag));
    }
    if (search) {
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Paginação
    const startIndex = (page - 1) * 6;
    const endIndex = startIndex + 6;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    // Adicionar read_time calculado aos posts
    const postsWithReadTime = paginatedPosts.map((post: any) => ({
      ...post,
      read_time: Math.ceil(post.content.split(/\s+/).length / 200) // 200 palavras por minuto
    }));

    return {
      posts: postsWithReadTime,
      categories: categories.map((cat: any) => cat.name),
      tags: tags.map((tag: any) => tag.name),
      totalPosts: filteredPosts.length,
      currentPage: page,
      totalPages: Math.ceil(filteredPosts.length / 6),
    };
  } catch (error) {
    console.error("❌ Erro ao carregar posts do blog:", error);
    
    // Fallback para dados mockados em caso de erro
    const mockPosts: BlogPost[] = [
      {
        id: "1",
        title: "Como escolher a cor certa para sua sala",
        slug: "como-escolher-cor-sala",
        excerpt: "Descubra as melhores cores para transformar sua sala em um ambiente acolhedor e moderno.",
        content: "Escolher a cor certa para a sala pode ser um desafio. Neste guia, vamos mostrar como escolher as cores perfeitas para sua sala...",
        featured_image: "https://images.unsplash.com/photo-1534423175165-d8e4c3f4a1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        author: "Maria Silva",
        author_id: "author-1",
        published_at: "2023-12-10T10:00:00Z",
        updated_at: "2023-12-10T10:00:00Z",
        created_at: "2023-12-10T10:00:00Z",
        category: "Cores",
        tags: ["decoração", "sala", "cores", "guia"],
        read_time: 5,
        status: "published",
        views: 150
      }
    ];

    const mockCategories = ["Cores", "Tendências", "Técnicas", "Manutenção", "Negócios"];
    const mockTags = ["decoração", "sala", "cores", "guia", "texturizadas", "tendências"];

    return {
      posts: mockPosts,
      categories: mockCategories,
      tags: mockTags,
      totalPosts: mockPosts.length,
      currentPage: 1,
      totalPages: 1,
    };
  }
}

export default function BlogPage() {
  const { posts, categories, tags, totalPosts, currentPage, totalPages } = useLoaderData<LoaderData>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredPosts = posts.filter(post => post.status === "published");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  return (
      <div className="min-h-screen bg-[#f7f5f1]">
        {/* Editorial masthead */}
        <section className="relative overflow-hidden bg-[#111a25] text-white">
          <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8 lg:py-28">
            <div className="mb-7 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-orange-300"><span className="h-px w-12 bg-orange-400" /> ProRevest Journal <span className="text-slate-400">/ Ideias & materiais</span></div>
            <h1 className="max-w-5xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-7xl lg:text-[6.3rem]">Espaços que <span className="font-serif italic font-normal text-orange-300">inspiram.</span><br />Materiais que transformam.</h1>
            <div className="mt-9 flex flex-col gap-6 border-t border-white/20 pt-7 md:flex-row md:items-center md:justify-between">
              <p className="max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">Um olhar sobre arquitetura, cores, texturas e as ideias por trás de cada ambiente.</p>
              <a href="#artigos" className="inline-flex items-center gap-3 self-start rounded-full border border-white/40 px-6 py-3 text-sm font-semibold transition hover:border-orange-300 hover:text-orange-300">Explorar artigos <ArrowRight className="h-4 w-4" /></a>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar posts..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Todas Categorias</option>
                  {categories.map((cat, idx) => (
                    <option key={`${cat}-${idx}`} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Todas Tags</option>
                  {tags.map((tag, idx) => (
                    <option key={`${tag}-${idx}`} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Editorial section heading */}
          <div id="artigos" className="mb-10 flex flex-col gap-3 border-b border-slate-300 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-orange-600">Biblioteca de ideias</p><h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Últimas histórias</h2></div>
            <p className="text-sm text-slate-500">{totalPosts} {totalPosts === 1 ? 'artigo publicado' : 'artigos publicados'}</p>
          </div>
          {/* Stats */}
          <div className="hidden">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-primary">{totalPosts}</div>
              <div className="text-sm text-gray-600">Posts Publicados</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-primary">{categories.length}</div>
              <div className="text-sm text-gray-600">Categorias</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-primary">{tags.length}</div>
              <div className="text-sm text-gray-600">Tags</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-primary">200</div>
              <div className="text-sm text-gray-600">Leitores Ativos</div>
            </div>
          </div>

          {/* Posts Grid com cards modernos (sempre claro) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mb-14">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group relative overflow-hidden rounded-2xl border border-[#e7e1d7] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10"
              >
                {/* Featured Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={post.featured_image || "/images/hero-bg.jpg"}
                    alt={post.title || 'Post sem título'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      img.onerror = null;
                      img.src = "/images/hero-bg.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary text-white shadow">
                    {post.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-7">
                  {/* Title */}
                  <Link to={`/blog/${post.slug}`} className="block mb-3">
                    <h2 className="text-2xl font-semibold leading-tight tracking-tight line-clamp-2">
                      <span className="text-slate-900 transition-colors group-hover:text-orange-600">
                        {post.title}
                      </span>
                    </h2>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <div className="flex items-center mr-4">
                      <User className="h-4 w-4 mr-1" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center mr-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(post.published_at || post.created_at)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{getReadTime(post.content)} min de leitura</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {post.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={`${tag}-${idx}`}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Read More */}
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center font-semibold text-primary hover:text-primary/85 transition-colors"
                    aria-label={`Ler mais: ${post.title}`}
                  >
                    Ler Mais
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                {/* Glow edge */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary via-orange-500 to-pink-600 transition-opacity" />
              </article>
            ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <nav className="flex items-center space-x-2">
                <Link
                  to={`/blog?page=${currentPage - 1}`}
                  className={`px-3 py-2 rounded-md border ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Anterior
                </Link>

                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <Link
                      key={pageNumber}
                      to={`/blog?page=${pageNumber}`}
                      className={`px-3 py-2 rounded-md border ${
                        currentPage === pageNumber
                          ? "bg-primary text-white"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNumber}
                    </Link>
                  );
                })}

                <Link
                  to={`/blog?page=${currentPage + 1}`}
                  className={`px-3 py-2 rounded-md border ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Próximo
                </Link>
              </nav>
            </div>
          )}

          {/* Relevant next step, without pretending to subscribe users */}
          <section className="relative overflow-hidden rounded-3xl bg-[#162232] px-7 py-12 text-white sm:px-12 sm:py-16">
            <div className="absolute -right-14 -top-24 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl" />
            <div className="relative flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl"><p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-orange-300">Da inspiração à prática</p><h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-5xl">Sua próxima ideia começa com uma cor.</h2><p className="text-slate-300">Explore as cores ProRevest e visualize possibilidades para seu ambiente.</p></div>
              <Link to="/paleta-cores" className="inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-full bg-orange-500 px-7 py-4 font-semibold text-white transition hover:bg-orange-600">Explorar cores <ArrowRight className="h-5 w-5" /></Link>
            </div>
          </section>
        </div>
      </div>
  );
}
