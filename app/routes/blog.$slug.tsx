import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import { useLoaderData, useNavigate, Link, useLocation } from "react-router-dom";
import { Calendar, User, ArrowLeft, Share2, Eye, Clock, List, BookOpen } from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { BlogService, type BlogPost } from "../services/blogService";

export const meta: MetaFunction = ({ data }: { data: any }) => {
  if (!data || !data.post) return [];
  
  return [
    { title: `${data.post.title} - Blog ProRevest` },
    { name: "description", content: data.post.excerpt },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const { slug } = params;
    if (!slug) {
      throw new Error("Slug não fornecido");
    }
    
    const post = await BlogService.getBlogPostBySlug(slug);
    if (!post) {
      throw new Error("Post não encontrado");
    }
    
    // Incrementar visualizações
    await BlogService.incrementBlogPostViews(post.id);

    // Buscar relacionados (mesma categoria ou tags em comum)
    let related: BlogPost[] = [];
    try {
      const all = await BlogService.getPublishedBlogPosts();
      related = (all || [])
        .filter((p) => p.id !== post.id)
        .filter((p) => p.category === post.category || p.tags.some((t) => post.tags.includes(t)))
        .slice(0, 3);
    } catch (e) {
      related = [];
    }

    return { post, related };
  } catch (error) {
    console.error("Error loading blog post:", error);
    return { post: null, error: "Falha ao carregar o post" };
  }
}

export default function BlogPost() {
  const { post, related = [], error } = useLoaderData() as { post: BlogPost | null; related?: BlogPost[]; error?: string };
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const workflowRef = useRef<HTMLDivElement | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  type TocItem = { id: string; text: string; level: number };
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  const stripHtml = (html: string) => {
    // Versão segura para SSR - não usa document
    if (typeof document === 'undefined') {
      // No servidor: remover tags HTML usando regex simples
      return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }
    
    // No cliente: usar a implementação original
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const wordCount = useMemo(() => {
    if (!post) return 0;
    const text = stripHtml(post.content);
    const words = text.trim().split(/\s+/).filter(Boolean);
    return words.length;
  }, [post]);

  const readingTime = useMemo(() => {
    const minutes = Math.max(1, Math.round(wordCount / 200));
    return minutes;
  }, [wordCount]);

  // Renderizar Markdown com formatação elegante e segura
  const renderedHtml = useMemo(() => {
    try {
      const md = post?.content || "";
      marked.setOptions({ gfm: true, breaks: true });
      const raw = marked.parse(md) as string;
      // Sanitizar no client
      return typeof window !== 'undefined' ? DOMPurify.sanitize(raw) : raw;
    } catch (e) {
      return post?.content || "";
    }
  }, [post?.content]);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

  useEffect(() => {
    // Desabilitado: manipulação de DOM para garantir renderização correta
    // Todo o processamento de workflow stages está desabilitado
  }, []);

  useEffect(() => {
    const wf = workflowRef.current;
    if (!wf) return;
    let rafId: number | null = null;
    const update = () => {
      rafId = null;
      const rect = wf.getBoundingClientRect();
      const topDoc = window.scrollY + rect.top;
      const height = wf.scrollHeight;
      const focusY = window.scrollY + window.innerHeight * 0.18;
      const progressed = Math.min(Math.max(focusY - topDoc, 0), height);
      wf.style.setProperty('--rail-progress-px', progressed + 'px');
    };
    const onScroll = () => {
      if (rafId != null) return;
      rafId = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const wf = workflowRef.current;
    if (!wf || !activeId) return;
    const stages = Array.from(wf.querySelectorAll('.workflow-stage')) as HTMLElement[];
    stages.forEach((s) => s.classList.remove('active'));
    const activeEl = document.getElementById(activeId)?.closest('.workflow-stage') as HTMLElement | null;
    if (activeEl) activeEl.classList.add('active');
  }, [activeId]);

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12 pt-16">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-destructive mb-2">Erro</h2>
          <p className="text-destructive mb-4">{error || "Post não encontrado"}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
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
    <>
      <div className="container mx-auto px-4 py-12 pt-8 max-w-6xl">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Voltar
        </button>
        
        {/* Hero vibrante */}
        <section className="relative -mx-4 mb-8 rounded-2xl overflow-hidden shadow-xl">
          {post.featured_image ? (
            <img 
              src={post.featured_image}
              alt={post.title || 'Post sem título'}
              className="w-full h-[320px] md:h-[480px] object-cover"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                img.onerror = null;
                img.src = "/images/hero-bg.jpg";
              }}
            />
          ) : (
            <img 
              src="/images/hero-bg.jpg"
              alt={post?.title || 'Post sem título'}
              className="w-full h-[320px] md:h-[480px] object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">Insights</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">{post.category}</span>
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white/90 backdrop-blur-sm">
                  #{tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white drop-shadow-lg">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-2"><User className="h-5 w-5" /><span>{post.author}</span></div>
              <div className="flex items-center gap-2"><Calendar className="h-5 w-5" /><span>{new Date(post.published_at || post.created_at).toLocaleDateString('pt-BR')}</span></div>
              <div className="flex items-center gap-2"><Eye className="h-5 w-5" /><span>{post.views} visualizações</span></div>
              <div className="flex items-center gap-2"><Clock className="h-5 w-5" /><span>{readingTime} min de leitura</span></div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
          {/* Conteúdo em card com fundo amarelo claro e detalhes coloridos */}
          <article className="relative bg-yellow-50 dark:bg-yellow-50 backdrop-blur-sm border border-yellow-200 dark:border-yellow-200 rounded-2xl overflow-hidden shadow-lg">
            {/* pinceladas leves no topo */}
            <div className="h-10 bg-top bg-repeat-x opacity-60" style={{ backgroundImage: "url('/images/brush-soft.svg')" }} />
            {/* barra lateral colorida sutil */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-pink-500 to-orange-500 opacity-60" />
            <div className="p-6 md:p-10">
              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="inline-flex items-center gap-2 bg-yellow-50 dark:bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200 dark:border-yellow-200"><BookOpen className="h-4 w-4"/> <span>{wordCount} palavras</span></div>
                <div className="inline-flex items-center gap-2 bg-yellow-50 dark:bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200 dark:border-yellow-200"><Clock className="h-4 w-4"/> <span>{readingTime} min</span></div>
              </div>

              <div className="workflow relative" ref={workflowRef}>
              <div 
                ref={contentRef}
                className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-cormorant prose-headings:text-slate-900 dark:prose-headings:text-white prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl prose-hr:border-primary/30 prose-blockquote:border-l-4 prose-blockquote:border-primary/40 prose-blockquote:bg-orange-50/50 dark:prose-blockquote:bg-white/5 prose-code:bg-orange-50/80 dark:prose-code:bg-white/10 prose-code:text-pink-700 dark:prose-code:text-pink-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
              </div>

              <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleShare}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-orange-600 text-white shadow hover:opacity-90 transition"
                    aria-label="Compartilhar post"
                  >
                    <Share2 className="h-5 w-5" />
                    <span>{copied ? 'Link copiado!' : 'Compartilhar'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Última atualização:</span>
                  <span>{new Date(post.updated_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </article>

          {/* Sumário fixo (ToC) */}
          <aside className="hidden lg:block sticky top-24 self-start">
            <div className="bg-yellow-50 dark:bg-yellow-50 backdrop-blur-sm border border-yellow-200 dark:border-yellow-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <List className="h-4 w-4 text-primary"/>
                <h3 className="text-sm font-semibold">Sumário</h3>
              </div>
              <nav className="space-y-1">
                {toc.length === 0 && (
                  <p className="text-xs text-muted-foreground">Seções serão exibidas aqui.</p>
                )}
                {toc.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      history.replaceState(null, '', `#${item.id}`);
                    }}
                    className={`block w-full text-left text-sm px-2 py-1 rounded transition-colors ${activeId === item.id ? 'bg-orange-100 text-orange-700' : 'hover:bg-yellow-100 dark:hover:bg-yellow-100'}`}
                    style={{ paddingLeft: item.level === 3 ? '1.25rem' : '0.5rem' }}
                  >
                    {item.text}
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        </div>

        {/* Posts relacionados */}
        <div className="mt-12">
          <h2 className="text-2xl font-cormorant font-bold mb-6">Conteúdos relacionados</h2>
          {related.length === 0 ? (
            <p className="text-muted-foreground">Em breve mais conteúdos relacionados a este post.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rp) => (
                <Link
                  to={`/blog/${rp.slug}`}
                  key={rp.id}
                  className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  {rp.featured_image ? (
                    <img
                      src={rp.featured_image || "/images/hero-bg.jpg"}
                      alt={rp.title || 'Post sem título'}
                      className="w-full h-36 object-cover"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        img.onerror = null;
                        img.src = "/images/hero-bg.jpg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-36 bg-gradient-to-br from-orange-100 to-pink-100" />
                  )}
                  <div className="p-4">
                    <h3 className="text-base font-semibold group-hover:text-primary transition-colors line-clamp-2">{rp.title}</h3>
                    <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(rp.published_at || rp.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox para imagens */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <img src={lightboxImage} alt="Imagem ampliada" className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl" />
        </div>
      )}
    </>
  );
}
