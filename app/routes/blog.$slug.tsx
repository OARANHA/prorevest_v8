import type { LoaderFunctionArgs, MetaFunction } from "react-router-dom";
import { isRouteErrorResponse, Link, useLoaderData, useRouteError } from "react-router-dom";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, Clock3, Share2, Sparkles } from "lucide-react";
import { BlogService, type BlogPost } from "../services/blogService";
import { renderSafeBlogMarkdown } from "../lib/safeBlogMarkdown";

type ArticleData = { post: BlogPost; related: BlogPost[] };

export const meta: MetaFunction = ({ data }) => {
  const post = (data as ArticleData | undefined)?.post;
  if (!post) return [{ title: "Artigo não encontrado | Blog ProRevest" }];
  const description = (post.excerpt || post.title).slice(0, 160);
  return [
    { title: `${post.title} | Blog ProRevest` },
    { name: "description", content: description },
    { property: "og:title", content: post.title },
    { property: "og:description", content: description },
    { property: "og:type", content: "article" },
    ...(post.featured_image ? [{ property: "og:image", content: post.featured_image }] : []),
    { tagName: "link", rel: "canonical", href: `https://prorevesttintas.com.br/blog/${encodeURIComponent(post.slug)}` },
  ];
};

export async function loader({ params }: LoaderFunctionArgs): Promise<ArticleData> {
  if (!params.slug) throw new Response("Artigo não encontrado", { status: 404 });
  try {
    // Leitura pública: artigos em rascunho/arquivados não devem ser acessíveis pelo slug.
    const post = await BlogService.getBlogPostBySlug(params.slug);
    if (!post) throw new Response("Artigo não encontrado", { status: 404 });

    let related: BlogPost[] = [];
    try {
      const all = await BlogService.getPublishedBlogPosts();
      related = all
        .filter((item) => item.id !== post.id)
        .filter((item) => item.category === post.category || (item.tags || []).some((tag) => (post.tags || []).includes(tag)))
        .sort((a, b) => Date.parse(b.published_at || b.created_at) - Date.parse(a.published_at || a.created_at))
        .slice(0, 3);
    } catch (error) {
      console.error("Falha na consulta de artigos relacionados:", error);
    }

    // GET público não altera contador de visualizações no banco.
    return { post, related };
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error("Falha ao carregar artigo do blog:", error);
    throw new Response("Artigo temporariamente indisponível", { status: 503 });
  }
}

function displayDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
}

function readingTime(source: string): number {
  const text = source.replace(/<[^>]*>/g, " ").replace(/[#*_~\[\]()]/g, " ").trim();
  return Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 200));
}

export default function BlogPostPage() {
  const { post, related } = useLoaderData<typeof loader>();
  const renderedHtml = useMemo(() => renderSafeBlogMarkdown(post.content || ""), [post.content]);
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: post.excerpt || post.title, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
      }
    } catch {
      // Cancelamento pelo usuário não representa falha da página.
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f5f1] text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-14">
        <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:underline"><ArrowLeft className="h-4 w-4" /> Todos os artigos</Link>

        <header className="mb-9">
          {post.category && <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-orange-700">{post.category}</p>}
          <h1 className="max-w-5xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">{post.title}</h1>
          {post.excerpt && <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 sm:text-xl">{post.excerpt}</p>}
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-300 pt-5 text-sm text-slate-600">
            {post.author && <span>{post.author}</span>}
            <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" />{displayDate(post.published_at || post.created_at)}</span>
            <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4" />{readingTime(post.content || "")} min de leitura</span>
            <button type="button" onClick={share} className="inline-flex items-center gap-2 font-semibold text-orange-700 hover:underline"><Share2 className="h-4 w-4" /> {copied ? "Link copiado" : "Compartilhar"}</button>
          </div>
        </header>

        {post.featured_image && (
          <div className="mb-10 overflow-hidden rounded-3xl border border-[#e7e1d7] bg-stone-100">
            <img src={post.featured_image} alt={post.title} className="max-h-[540px] w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
          <article className="min-w-0 rounded-2xl border border-[#e7e1d7] bg-white px-6 py-9 shadow-sm sm:px-10">
            <div
              className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-a:text-orange-700 prose-a:underline-offset-4 prose-img:rounded-xl prose-blockquote:border-orange-500 prose-code:break-words"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
            {(post.tags || []).length > 0 && <div className="mt-10 flex flex-wrap gap-2 border-t border-slate-200 pt-6">
              {(post.tags || []).map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">#{tag}</span>)}
            </div>}
          </article>

          <aside className="self-start lg:sticky lg:top-24">
            <div className="rounded-2xl bg-[#162232] p-6 text-white">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange-300">Aplique suas ideias</p>
              <h2 className="text-2xl font-semibold">Do conteúdo ao projeto.</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">Explore acabamentos e experimente cores em uma foto do seu ambiente no Studio ProRevest.</p>
              <Link to="/studio" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold hover:bg-orange-700"><Sparkles className="h-4 w-4" /> Abrir Studio</Link>
              <Link to="/catalogo" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/40 px-5 py-3 text-sm font-semibold hover:bg-white/10">Conhecer produtos</Link>
            </div>
          </aside>
        </div>

        {related.length > 0 && <section className="mt-16" aria-labelledby="related-articles">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3 border-b border-slate-300 pb-5">
            <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-orange-700">Continue lendo</p><h2 id="related-articles" className="text-3xl font-semibold">Conteúdos relacionados</h2></div>
            <Link to="/blog" className="inline-flex items-center gap-2 font-semibold text-orange-700">Ver todos <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((item) => <Link key={item.id} to={`/blog/${item.slug}`} className="group overflow-hidden rounded-2xl border border-[#e7e1d7] bg-white shadow-sm hover:shadow-md">
              <div className="relative aspect-[16/10] bg-stone-100">
                <div className="absolute inset-0 flex items-center justify-center text-slate-400"><BookOpen className="h-9 w-9" /></div>
                {item.featured_image && <img src={item.featured_image} loading="lazy" alt={item.title} className="relative h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
              </div>
              <div className="p-5"><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-700">{item.category}</p><h3 className="text-lg font-semibold leading-snug group-hover:text-orange-700">{item.title}</h3><p className="mt-3 text-xs text-slate-500">{displayDate(item.published_at || item.created_at)}</p></div>
            </Link>)}
          </div>
        </section>}
      </div>
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <main className="min-h-[55vh] bg-[#f7f5f1] px-6 py-20 text-center text-slate-900">
      <BookOpen className="mx-auto mb-5 h-12 w-12 text-orange-600" />
      <h1 className="mb-3 text-3xl font-semibold">{notFound ? "Artigo não encontrado" : "Artigo temporariamente indisponível"}</h1>
      <p className="mx-auto mb-7 max-w-lg text-slate-600">{notFound ? "Este conteúdo não está disponível no blog público." : "Não foi possível carregar o artigo. Tente novamente mais tarde."}</p>
      <Link to="/blog" className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700">Voltar ao blog <ArrowRight className="h-4 w-4" /></Link>
    </main>
  );
}
