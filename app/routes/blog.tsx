import type { LoaderFunctionArgs, MetaFunction } from "react-router-dom";
import { Form, Link, useLoaderData, useNavigation } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock3, Search, BookOpen } from "lucide-react";
import { BlogService, type BlogPost } from "../services/blogService";

type BlogCard = BlogPost & { readTime: number };
type Filters = { search: string; category: string; tag: string };
type LoaderData = {
  posts: BlogCard[];
  categories: string[];
  tags: string[];
  filters: Filters;
  totalPosts: number;
  currentPage: number;
  totalPages: number;
  error: boolean;
};

const PAGE_SIZE = 6;
const SITE = "https://prorevesttintas.com.br";

export const meta: MetaFunction = () => [
  { title: "Blog ProRevest | Arquitetura, cores e revestimentos" },
  { name: "description", content: "Inspiração, técnicas e materiais para projetos de arquitetura, tintas e revestimentos. Explore conteúdos publicados pela ProRevest." },
  { property: "og:title", content: "Blog ProRevest | Ideias e materiais" },
  { property: "og:type", content: "website" },
  { tagName: "link", rel: "canonical", href: `${SITE}/blog` },
];

function safePage(raw: string | null): number {
  const page = Number(raw);
  return Number.isSafeInteger(page) && page > 0 ? Math.min(page, 10000) : 1;
}

function readingMinutes(content: string): number {
  const plain = (content || "").replace(/<[^>]+>/g, " ").replace(/[#*_~\[\]()]/g, " ");
  const count = plain.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(count / 200));
}

function pageLink(page: number, filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.tag) params.set("tag", filters.tag);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/blog?${query}#artigos` : "/blog#artigos";
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderData> {
  const url = new URL(request.url);
  const filters: Filters = {
    search: (url.searchParams.get("search") || "").trim().slice(0, 100),
    category: (url.searchParams.get("category") || "").trim().slice(0, 100),
    tag: (url.searchParams.get("tag") || "").trim().slice(0, 100),
  };

  try {
    // O conjunto público é a fonte única de posts, categorias e tags: nunca incluir rascunhos.
    const published = await BlogService.getPublishedBlogPosts();
    const categories = [...new Set(published.map((p) => p.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));
    const tags = [...new Set(published.flatMap((p) => p.tags || []).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));
    const needle = filters.search.toLocaleLowerCase("pt-BR");

    const matching = published
      .filter((post) =>
        (!filters.category || post.category === filters.category) &&
        (!filters.tag || (post.tags || []).includes(filters.tag)) &&
        (!needle || [post.title || "", post.excerpt || ""].some((value) => value.toLocaleLowerCase("pt-BR").includes(needle))),
      )
      .sort((a, b) => Date.parse(b.published_at || b.created_at) - Date.parse(a.published_at || a.created_at));

    const totalPages = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
    const currentPage = Math.min(safePage(url.searchParams.get("page")), totalPages);
    const posts = matching
      .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
      .map((post) => ({ ...post, readTime: readingMinutes(post.content || "") }));

    return { posts, categories, tags, filters, totalPosts: matching.length, currentPage, totalPages, error: false };
  } catch (error) {
    console.error("Falha na consulta de artigos publicados:", error);
    // Falha de serviço nunca é substituída por artigos, autores ou estatísticas fictícias.
    return { posts: [], categories: [], tags: [], filters, totalPosts: 0, currentPage: 1, totalPages: 1, error: true };
  }
}

function formatDate(date: string): string {
  const dateValue = new Date(date);
  return Number.isNaN(dateValue.getTime()) ? "" : dateValue.toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" });
}

export default function BlogPage() {
  const { posts, categories, tags, filters, totalPosts, currentPage, totalPages, error } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const hasFilters = Boolean(filters.search || filters.category || filters.tag);

  return (
    <main className="min-h-screen bg-[#f7f5f1] text-slate-900">
      <section className="relative overflow-hidden bg-[#111a25] text-white">
        <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8 lg:py-28">
          <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-orange-300"><span className="h-px w-10 bg-orange-400" />ProRevest Journal</p>
          <h1 className="max-w-5xl text-5xl font-semibold leading-tight tracking-tight sm:text-7xl">Ideias para espaços <span className="font-serif italic font-normal text-orange-300">com identidade.</span></h1>
          <div className="mt-8 flex flex-col gap-6 border-t border-white/20 pt-7 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">Conteúdos sobre arquitetura, técnicas de aplicação, cores e acabamentos para transformar projetos em realidade.</p>
            <a href="#artigos" className="inline-flex items-center gap-2 self-start rounded-full border border-white/40 px-5 py-3 text-sm font-semibold hover:border-orange-300 hover:text-orange-300">Explorar artigos <ArrowRight className="h-4 w-4" /></a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <section aria-label="Pesquisar e filtrar artigos" className="mb-10 rounded-2xl border border-[#e7e1d7] bg-white p-5 shadow-sm sm:p-7">
          <Form method="get" action="/blog" role="search" className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,210px)_minmax(0,210px)_auto] md:items-end">
            <label className="block text-sm font-semibold text-slate-700">
              Buscar conteúdo
              <span className="relative mt-2 block">
                <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input type="search" name="search" key={filters.search} defaultValue={filters.search} maxLength={100} placeholder="Tema, técnica, material..." className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500" />
              </span>
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Categoria
              <select name="category" key={filters.category} defaultValue={filters.category} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500">
                <option value="">Todas as categorias</option>
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Assunto
              <select name="tag" key={filters.tag} defaultValue={filters.tag} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500">
                <option value="">Todas as tags</option>
                {tags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
              </select>
            </label>
            <button type="submit" disabled={navigation.state !== "idle"} className="rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60">{navigation.state === "idle" ? "Buscar" : "Buscando..."}</button>
          </Form>
          {hasFilters && <Link to="/blog#artigos" className="mt-4 inline-block text-sm font-semibold text-orange-700 underline underline-offset-4">Limpar filtros</Link>}
        </section>

        <section id="artigos" aria-labelledby="heading-artigos" className="scroll-mt-24">
          <div className="mb-9 flex flex-col gap-3 border-b border-slate-300 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-orange-700">Biblioteca de ideias</p><h2 id="heading-artigos" className="text-3xl font-semibold tracking-tight sm:text-5xl">Artigos publicados</h2></div>
            {!error && <p className="text-sm text-slate-600" role="status">{totalPosts} {totalPosts === 1 ? "artigo encontrado" : "artigos encontrados"}</p>}
          </div>

          {error ? (
            <div role="alert" className="rounded-2xl border border-amber-200 bg-white p-10 text-center">
              <BookOpen className="mx-auto mb-4 h-10 w-10 text-amber-700" />
              <h3 className="mb-2 text-xl font-semibold">Artigos temporariamente indisponíveis</h3>
              <p className="text-slate-600">Não foi possível consultar os conteúdos publicados. Tente novamente em instantes.</p>
              <Link to="/blog" className="mt-5 inline-block font-semibold text-orange-700 underline">Tentar novamente</Link>
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <Search aria-hidden="true" className="mx-auto mb-4 h-10 w-10 text-slate-400" />
              <h3 className="mb-2 text-xl font-semibold">Nenhum artigo encontrado</h3>
              <p className="text-slate-600">Experimente outros termos ou explore todas as publicações.</p>
              {hasFilters && <Link to="/blog#artigos" className="mt-5 inline-block font-semibold text-orange-700 underline">Ver todos os artigos</Link>}
            </div>
          ) : (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post.id} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e7e1d7] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
                  <Link to={`/blog/${post.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-100" aria-label={`Ler: ${post.title}`}>
                    {post.featured_image ? <img src={post.featured_image} alt={post.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <div className="flex h-full items-center justify-center text-slate-400"><BookOpen className="h-12 w-12" /></div>}
                    {post.category && <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900 shadow">{post.category}</span>}
                  </Link>
                  <div className="flex flex-1 flex-col p-6">
                    <Link to={`/blog/${post.slug}`} className="mb-3 block"><h3 className="line-clamp-3 text-2xl font-semibold leading-snug text-slate-900 group-hover:text-orange-700">{post.title}</h3></Link>
                    {post.excerpt && <p className="mb-5 line-clamp-3 text-slate-600">{post.excerpt}</p>}
                    <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600">
                      {post.published_at || post.created_at ? <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{formatDate(post.published_at || post.created_at)}</span> : null}
                      <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" />{post.readTime} min de leitura</span>
                    </div>
                    <Link to={`/blog/${post.slug}`} className="mt-5 inline-flex items-center gap-2 font-semibold text-orange-700 hover:text-orange-800">Ler artigo <ArrowRight className="h-4 w-4" /></Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!error && totalPages > 1 && (
            <nav aria-label="Paginação do blog" className="mt-12 flex flex-wrap items-center justify-center gap-2">
              {currentPage > 1 ? <Link to={pageLink(currentPage - 1, filters)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 hover:bg-orange-50">Anterior</Link> : <span className="rounded-lg border border-slate-200 px-4 py-2 text-slate-400">Anterior</span>}
              {Array.from({ length: totalPages }, (_, i) => i + 1).filter((page) => totalPages <= 7 || page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1).map((page) => (
                <Link key={page} aria-current={page === currentPage ? "page" : undefined} to={pageLink(page, filters)} className={`rounded-lg border px-4 py-2 ${page === currentPage ? "border-orange-600 bg-orange-600 text-white" : "border-slate-300 bg-white hover:bg-orange-50"}`}>{page}</Link>
              ))}
              {currentPage < totalPages ? <Link to={pageLink(currentPage + 1, filters)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 hover:bg-orange-50">Próxima</Link> : <span className="rounded-lg border border-slate-200 px-4 py-2 text-slate-400">Próxima</span>}
            </nav>
          )}
        </section>

        <section className="relative mt-16 overflow-hidden rounded-3xl bg-[#162232] px-7 py-12 text-white sm:px-12 sm:py-16">
          <div className="relative flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl"><p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-orange-300">Da inspiração à prática</p><h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-5xl">Imagine a próxima cor no seu ambiente.</h2><p className="text-slate-300">Conheça os acabamentos ProRevest e use o Studio para experimentar cores e efeitos em uma foto do seu espaço.</p></div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Link to="/studio" className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-7 py-4 font-semibold text-white hover:bg-orange-700">Abrir Studio <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/catalogo" className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-4 font-semibold hover:bg-white/10">Conhecer produtos</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
