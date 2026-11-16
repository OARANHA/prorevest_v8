import { ArrowRight, Layers3, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

type FeaturedProduct = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  category?: string;
  finish?: string;
  isFeatured: boolean;
};

export function FeaturedProducts({ products }: { products: FeaturedProduct[] }) {
  const featured = products.filter((product) => product.isFeatured && product.slug).slice(0, 4);

  return (
    <section id="produtos" aria-labelledby="featured-products-title" className="scroll-mt-24 bg-[#f7f5f1] py-16 text-slate-900 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-orange-700">Conheça os materiais</p>
            <h2 id="featured-products-title" className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">Produtos que inspiram projetos.</h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">Explore os revestimentos selecionados no catálogo ProRevest. Informações de acabamentos e aplicações são apresentadas por produto.</p>
          </div>
          <Link to="/catalogo" className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-orange-700 transition hover:border-orange-400">Ver catálogo <ArrowRight className="h-4 w-4" /></Link>
        </div>

        {featured.length === 0 ? (
          <div className="rounded-2xl border border-[#e7e1d7] bg-white px-6 py-10 text-center">
            <Layers3 className="mx-auto mb-4 h-10 w-10 text-slate-400" aria-hidden="true" />
            <p className="text-lg font-semibold">Não há produtos destacados para exibição no momento.</p>
            <p className="mt-2 text-sm text-slate-600">A coleção completa pode ser consultada no catálogo.</p>
            <Link to="/catalogo" className="mt-5 inline-flex items-center gap-2 font-semibold text-orange-700 underline underline-offset-4">Explorar produtos <ArrowRight className="h-4 w-4" /></Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <article key={product.id} className="group flex flex-col overflow-hidden rounded-2xl border border-[#e7e1d7] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <Link to={`/produto/${product.slug}`} aria-label={`Conhecer ${product.name}`} className="relative block aspect-[4/3] overflow-hidden bg-gradient-to-br from-stone-200 via-stone-100 to-slate-100">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400"><Layers3 className="h-10 w-10" /></div>
                  {product.image && <img src={product.image} alt={product.name} loading="lazy" className="relative h-full w-full object-cover transition duration-500 group-hover:scale-105" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
                  <span className="absolute left-3 top-3 rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold text-white shadow">Destaque</span>
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  {product.category && <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-orange-700">{product.category}</p>}
                  <Link to={`/produto/${product.slug}`}><h3 className="text-xl font-semibold leading-snug group-hover:text-orange-700">{product.name}</h3></Link>
                  {product.description && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{product.description}</p>}
                  {product.finish && <p className="mt-4 text-sm text-slate-600"><strong>Acabamento:</strong> {product.finish}</p>}
                  <Link to={`/produto/${product.slug}`} className="mt-auto inline-flex items-center gap-2 pt-5 font-semibold text-orange-700">Ver informações <ArrowRight className="h-4 w-4" /></Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-3xl bg-[#162232] p-8 text-white sm:p-10 md:flex-row md:items-center">
          <div><h3 className="text-2xl font-semibold sm:text-3xl">Experimente cores no seu ambiente.</h3><p className="mt-3 max-w-xl text-sm text-slate-300">Envie uma foto ao Studio ProRevest para explorar possibilidades de cores e efeitos.</p></div>
          <Link to="/studio" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-orange-600 px-6 py-3 font-semibold hover:bg-orange-700"><Sparkles className="h-4 w-4" /> Abrir Studio</Link>
        </div>
      </div>
    </section>
  );
}
