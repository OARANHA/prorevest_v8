import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Download, Sparkles, ArrowLeft } from "lucide-react";
import { catalogs, catalogPageUrl, catalogPdfUrl, type CatalogSlug } from "../lib/digitalCatalogs";

const presentation: Record<CatalogSlug, { eyebrow: string; statement: string; color: string; surface: string }> = {
  piaceri: { eyebrow: "Sofisticação em pedras naturais", statement: "O prazer de sentir cada detalhe.", color: "#ea580c", surface: "#f3f4f6" },
  flua: { eyebrow: "Natureza, equilíbrio e sensações", statement: "Flua e deixe fluir.", color: "#4f46e5", surface: "#f3f4f6" }
};

export default function DigitalCatalogLibrary() {
  return <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-indigo-50/40 text-gray-800">
    <div className="mx-auto max-w-7xl px-5 py-14 sm:px-10">
      <div className="mb-12 max-w-3xl"><Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-orange-600"><ArrowLeft size={16}/> Voltar à Home</Link>
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-indigo-600"><Sparkles size={15}/> ProRevest · Editorial</div>
        <h1 className="font-semibold tracking-tight text-5xl leading-tight sm:text-6xl">Coleções que<br/><span className="bg-gradient-to-r from-orange-600 to-indigo-600 bg-clip-text text-transparent">transformam espaços.</span></h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">Explore os catálogos digitais ProRevest. Descubra texturas, cores e inspirações por meio de apresentações que preservam sua identidade original.</p>
      </div>
      <section className="grid gap-7 lg:grid-cols-2" aria-label="Catálogos disponíveis">
        {(Object.values(catalogs)).map(c => {
          const p = presentation[c.slug];
          return <article key={c.slug} className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-slate-200/60 transition-transform hover:-translate-y-1">
            <Link to={`/catalogos/${c.slug}`} className="group relative block overflow-hidden" aria-label={`Explorar catálogo ${c.title}`}>
              <div className="overflow-hidden" style={{ background:p.surface }}>
                <img className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" src={catalogPageUrl(c.slug,1)} alt={`Capa original do catálogo ${c.title}`} loading="lazy"/>
              </div>
              <div className="absolute right-5 top-5 rounded-full bg-white/90 p-3 text-gray-700 shadow-md" aria-hidden="true"><ArrowUpRight size={20}/></div>
            </Link>
            <div className="p-7 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{color:p.color}}>{p.eyebrow}</p>
              <h2 className="mt-3 font-semibold text-4xl tracking-tight">{c.title}</h2>
              <p className="mt-1 text-lg text-gray-600">{p.statement}</p>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-5">
                <Link to={`/catalogos/${c.slug}`} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:from-orange-700 hover:to-orange-600"><BookOpen size={17}/> Explorar catálogo</Link>
                <a href={catalogPdfUrl(c.slug)} download={`ProRevest-${c.title}.pdf`} className="inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"><Download size={16}/> Baixar PDF</a>
              </div>
            </div>
          </article>;
        })}
      </section>
      <p className="mt-12 text-center text-xs tracking-widest text-gray-500">PROREVEST · PEDRAS NATURAIS · CATÁLOGOS DIGITAIS</p>
    </div>
  </main>;
}
