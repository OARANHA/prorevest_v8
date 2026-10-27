import { ArrowRight, BookOpen, Download, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { catalogPageUrl, catalogPdfUrl } from "../lib/digitalCatalogs";

/**
 * Nova vitrine editorial da Home. Usa somente capas oficiais já publicadas
 * na branch dos catálogos. A arte de lançamento da Hero é uma aprovação separada.
 */
export default function HomeDigitalCatalogs() {
  const entries = [
    { slug: "piaceri" as const, title: "PIACERI", description: "Pedras naturais semipreciosas. Inspiração italiana, expressão e sofisticação.", accent: "from-orange-500 to-rose-500" },
    { slug: "flua" as const, title: "FLUA", description: "Pedras naturais e texturas que evocam equilíbrio, fluidez e conexão.", accent: "from-indigo-500 to-purple-500" }
  ];
  return (
    <section id="catalogos-digitais" aria-labelledby="catalogos-digitais-titulo" className="relative overflow-hidden bg-gradient-to-br from-white via-indigo-50/40 to-orange-50/40 py-20 sm:py-24">
      <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-purple-200/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto mb-11 max-w-3xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-xs font-semibold uppercase tracking-[.18em] text-white shadow-lg shadow-indigo-200/50">
            <Sparkles size={16}/> Novos catálogos digitais
          </span>
          <h2 id="catalogos-digitais-titulo" className="text-4xl font-light leading-tight tracking-tight text-gray-900 sm:text-6xl">
            Explore novas <span className="bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text font-semibold text-transparent">possibilidades.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
            Conheça PIACERI e FLUA. Duas linhas de pedras naturais com cores, texturas e referências para seu próximo projeto.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {entries.map(entry => (
            <article key={entry.slug} className="group overflow-hidden rounded-3xl border border-white bg-white shadow-xl shadow-slate-200/70 transition-transform duration-300 hover:-translate-y-1">
              <Link to={`/catalogos/${entry.slug}`} className="block overflow-hidden" aria-label={`Abrir catálogo ${entry.title}`}>
                <img src={catalogPageUrl(entry.slug, 1)} className="aspect-video h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" loading="lazy" alt={`Capa original do catálogo ${entry.title}`} />
              </Link>
              <div className="p-7 sm:p-8">
                <div className={`mb-3 h-1 w-12 rounded-full bg-gradient-to-r ${entry.accent}`}></div>
                <h3 className="text-3xl font-semibold tracking-tight text-gray-900">{entry.title}</h3>
                <p className="mt-2 max-w-lg leading-relaxed text-gray-600">{entry.description}</p>
                <div className="mt-6 flex flex-wrap items-center gap-5">
                  <Link to={`/catalogos/${entry.slug}`} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:from-orange-700 hover:to-orange-600">
                    <BookOpen size={17}/> Explorar <ArrowRight size={16}/>
                  </Link>
                  <a href={catalogPdfUrl(entry.slug)} download={`ProRevest-${entry.title}.pdf`} className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 underline underline-offset-4 hover:text-indigo-600">
                    <Download size={16}/> Baixar PDF
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-9 text-center">
          <Link to="/catalogos" className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/85 px-7 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition-colors hover:bg-indigo-50">
            Ver todos os catálogos <ArrowRight size={17}/>
          </Link>
        </div>
      </div>
    </section>
  );
}
