import type { LoaderFunctionArgs, MetaFunction } from "react-router-dom";
import { Form, Link, useLoaderData, useNavigation } from "react-router-dom";
import { ArrowRight, BookOpen, Layers3, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_featured: boolean;
  categories: { name: string } | null;
  finishes: { name: string } | null;
};
type CatalogOption = { id: string; name: string };
type Filters = { search: string; category: string; finish: string; sort: string };
type LoaderData = {
  products: CatalogProduct[];
  categories: CatalogOption[];
  finishes: CatalogOption[];
  filters: Filters;
  currentPage: number;
  totalPages: number;
  total: number;
  error: boolean;
};

const PAGE_SIZE = 12;

export const meta: MetaFunction = () => [
  { title: "Produtos e acabamentos | ProRevest" },
  { name: "description", content: "Conheça as tintas, texturas e revestimentos ProRevest. Filtre por categoria e acabamento, consulte informações técnicas e experimente cores no Studio." },
  { property: "og:title", content: "Catálogo de produtos ProRevest" },
  { property: "og:type", content: "website" },
  { tagName: "link", rel: "canonical", href: "https://prorevesttintas.com.br/catalogo" },
];

function parsePage(input: string | null): number {
  const value = Number(input);
  return Number.isSafeInteger(value) && value > 0 ? Math.min(value, 10000) : 1;
}

function catalogPageUrl(page: number, filters: Filters): string {
  const query = new URLSearchParams();
  if (filters.search) query.set("search", filters.search);
  if (filters.category) query.set("category", filters.category);
  if (filters.finish) query.set("finish", filters.finish);
  if (filters.sort !== "name") query.set("sort", filters.sort);
  if (page > 1) query.set("page", String(page));
  const params = query.toString();
  return params ? `/catalogo?${params}#produtos` : "/catalogo#produtos";
}

export async function loader({ request }: LoaderFunctionArgs): Promise<LoaderData> {
  const url = new URL(request.url);
  const filters: Filters = {
    search: (url.searchParams.get("search") || "").trim().slice(0, 80),
    category: (url.searchParams.get("category") || "").trim().slice(0, 80),
    finish: (url.searchParams.get("finish") || "").trim().slice(0, 80),
    sort: url.searchParams.get("sort") === "featured" ? "featured" : "name",
  };
  const requestedPage = parsePage(url.searchParams.get("page"));

  try {
    if (!supabase) throw new Error("Supabase indisponível");

    const [categoriesResult, finishesResult] = await Promise.all([
      supabase.from("categories").select("id,name").eq("is_archived", false).order("name"),
      supabase.from("finishes").select("id,name").eq("is_archived", false).order("name"),
    ]);
    if (categoriesResult.error) throw categoriesResult.error;
    if (finishesResult.error) throw finishesResult.error;

    const applyFilters = (query: any) => {
      let result = query.eq("is_archived", false);
      if (filters.category) result = result.eq("category_id", filters.category);
      if (filters.finish) result = result.eq("finish_id", filters.finish);
      if (filters.search) result = result.ilike("name", `%${filters.search.replace(/[%_]/g, "\\$&")}%`);
      return result;
    };

    const { count, error: countError } = await applyFilters(
      supabase.from("products").select("id", { count: "exact", head: true }),
    );
    if (countError) throw countError;

    const total = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const currentPage = Math.min(requestedPage, totalPages);

    let productQuery = applyFilters(
      supabase.from("products").select("id,name,slug,description,image_url,is_featured,categories(name),finishes(name)"),
    );
    if (filters.sort === "featured") productQuery = productQuery.order("is_featured", { ascending: false });
    productQuery = productQuery.order("name", { ascending: true })
      .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1);
    const { data, error } = await productQuery;
    if (error) throw error;

    return {
      products: (data || []) as unknown as CatalogProduct[],
      categories: (categoriesResult.data || []) as CatalogOption[],
      finishes: (finishesResult.data || []) as CatalogOption[],
      filters, currentPage, totalPages, total, error: false,
    };
  } catch (error) {
    console.error("Falha ao carregar o catálogo público:", error);
    return { products: [], categories: [], finishes: [], filters, currentPage: 1, totalPages: 1, total: 0, error: true };
  }
}

function ProductImage({ product }: { product: CatalogProduct }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-stone-200 via-stone-100 to-slate-100">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
        <Layers3 className="h-11 w-11" aria-hidden="true" />
        <span className="text-xs">Imagem não disponível</span>
      </div>
      {product.image_url && <img src={product.image_url} alt={`Produto ${product.name}`} loading="lazy" className="relative h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
      {product.is_featured && <span className="absolute left-4 top-4 rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold text-white shadow">Destaque</span>}
    </div>
  );
}

export default function Catalogo() {
  const { products, categories, finishes, filters, currentPage, totalPages, total, error } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const hasFilters = Boolean(filters.search || filters.category || filters.finish || filters.sort !== "name");

  return (
    <main className="min-h-screen bg-[#f7f5f1] text-slate-900">
      <section className="relative overflow-hidden bg-[#152331] text-white">
        <div className="pointer-events-none absolute -right-16 -top-28 h-80 w-80 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-orange-300">Materiais e acabamentos</p>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight sm:text-7xl">O material certo para <span className="font-serif italic font-normal text-orange-300">cada ideia.</span></h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-300">Explore o catálogo ProRevest, encontre acabamentos para seu projeto e leve suas referências de cores ao Studio.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/studio" className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3 font-semibold hover:bg-orange-700">Experimentar no Studio <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/catalogos" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold hover:bg-white/10"><BookOpen className="h-4 w-4" />Catálogos digitais PIACERI e FLUA</Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[270px_minmax(0,1fr)]">
          <aside aria-label="Filtros de produtos" className="self-start rounded-2xl border border-[#e7e1d7] bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold"><SlidersHorizontal className="h-5 w-5 text-orange-600" />Refine sua busca</h2>
            <Form method="get" action="/catalogo" role="search" className="space-y-5">
              <label className="block text-sm font-semibold text-slate-700">
                Nome do produto
                <span className="relative mt-2 block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input type="search" name="search" key={filters.search} defaultValue={filters.search} maxLength={80} placeholder="Buscar produtos" className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-3 font-normal text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600" />
                </span>
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Categoria
                <select name="category" key={filters.category} defaultValue={filters.category} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 font-normal text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600">
                  <option value="">Todas as categorias</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Acabamento
                <select name="finish" key={filters.finish} defaultValue={filters.finish} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 font-normal text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600">
                  <option value="">Todos os acabamentos</option>
                  {finishes.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Ordenação
                <select name="sort" key={filters.sort} defaultValue={filters.sort} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 font-normal text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600">
                  <option value="name">Nome (A–Z)</option>
                  <option value="featured">Destaques primeiro</option>
                </select>
              </label>
              <button type="submit" disabled={navigation.state !== "idle"} className="w-full rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60">{navigation.state === "idle" ? "Aplicar filtros" : "Buscando..."}</button>
            </Form>
            {hasFilters && <Link to="/catalogo#produtos" className="mt-5 inline-block text-sm font-semibold text-orange-700 underline underline-offset-4">Limpar filtros</Link>}
            <p className="mt-6 border-t border-slate-200 pt-5 text-xs leading-relaxed text-slate-500">Catálogo institucional sem preços. Informações de aplicação e disponibilidade devem ser confirmadas para cada produto.</p>
          </aside>

          <section id="produtos" aria-labelledby="heading-produtos" className="min-w-0 scroll-mt-24">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-slate-300 pb-6">
              <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-orange-700">Catálogo ProRevest</p><h2 id="heading-produtos" className="text-3xl font-semibold tracking-tight sm:text-4xl">Nossos produtos</h2></div>
              {!error && <p role="status" className="text-sm text-slate-600">{total} {total === 1 ? "produto encontrado" : "produtos encontrados"}</p>}
            </div>

            {error ? (
              <div role="alert" className="rounded-2xl border border-amber-200 bg-white p-10 text-center">
                <h3 className="mb-2 text-xl font-semibold">Catálogo temporariamente indisponível</h3>
                <p className="text-slate-600">Não foi possível consultar os produtos neste momento.</p>
                <Link to="/catalogo" className="mt-5 inline-block font-semibold text-orange-700 underline">Tentar novamente</Link>
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <Search className="mx-auto mb-4 h-10 w-10 text-slate-400" />
                <h3 className="mb-2 text-xl font-semibold">Nenhum produto encontrado</h3>
                <p className="text-slate-600">Ajuste a busca ou explore o catálogo sem filtros.</p>
                <Link to="/catalogo" className="mt-5 inline-block font-semibold text-orange-700 underline">Ver todos os produtos</Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <article key={product.id} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e7e1d7] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <Link to={`/produto/${product.slug}`} aria-label={`Conhecer ${product.name}`}>
                      <ProductImage product={product} />
                    </Link>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-orange-700">{product.categories?.name || "Revestimento ProRevest"}</p>
                      <Link to={`/produto/${product.slug}`} className="mb-3 block"><h3 className="text-xl font-semibold leading-snug text-slate-900 group-hover:text-orange-700">{product.name}</h3></Link>
                      {product.description && <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-600">{product.description}</p>}
                      {product.finishes?.name && <p className="mb-4 text-sm text-slate-600"><span className="font-semibold">Acabamento:</span> {product.finishes.name}</p>}
                      <Link to={`/produto/${product.slug}`} className="mt-auto inline-flex items-center gap-2 font-semibold text-orange-700 hover:text-orange-800">Ver informações <ArrowRight className="h-4 w-4" /></Link>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {!error && totalPages > 1 && (
              <nav aria-label="Paginação dos produtos" className="mt-10 flex flex-wrap items-center justify-center gap-2">
                {currentPage > 1 ? <Link to={catalogPageUrl(currentPage - 1, filters)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 hover:bg-orange-50">Anterior</Link> : <span className="rounded-lg border border-slate-200 px-4 py-2 text-slate-400">Anterior</span>}
                {Array.from({ length: totalPages }, (_, i) => i + 1).filter((page) => totalPages <= 7 || page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1).map((page) => (
                  <Link key={page} aria-current={page === currentPage ? "page" : undefined} to={catalogPageUrl(page, filters)} className={`rounded-lg border px-4 py-2 ${page === currentPage ? "border-orange-600 bg-orange-600 text-white" : "border-slate-300 bg-white hover:bg-orange-50"}`}>{page}</Link>
                ))}
                {currentPage < totalPages ? <Link to={catalogPageUrl(currentPage + 1, filters)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 hover:bg-orange-50">Próxima</Link> : <span className="rounded-lg border border-slate-200 px-4 py-2 text-slate-400">Próxima</span>}
              </nav>
            )}
          </section>
        </div>

        <section className="mt-16 flex flex-col items-start justify-between gap-6 rounded-3xl bg-[#162232] p-8 text-white sm:p-12 lg:flex-row lg:items-center">
          <div className="max-w-2xl"><p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-orange-300">Do produto à aplicação</p><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Visualize possibilidades no seu ambiente.</h2><p className="mt-4 text-slate-300">Leve uma foto do espaço ao Studio e experimente cores e efeitos ProRevest antes de decidir.</p></div>
          <Link to="/studio" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-orange-600 px-7 py-4 font-semibold text-white hover:bg-orange-700"><Sparkles className="h-5 w-5" /> Abrir Studio</Link>
        </section>
      </div>
    </main>
  );
}
