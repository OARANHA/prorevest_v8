import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Download, Sparkles } from "lucide-react";
import { catalogs, catalogPageUrl, catalogPdfUrl, type CatalogSlug } from "../lib/digitalCatalogs";

const presentation: Record<CatalogSlug, { eyebrow: string; statement: string; color: string; surface: string }> = {
  piaceri: { eyebrow: "Sofisticação em pedras naturais", statement: "O prazer de sentir cada detalhe.", color: "#d06b22", surface: "#2e1d1e" },
  flua: { eyebrow: "Natureza, equilíbrio e sensações", statement: "Flua e deixe fluir.", color: "#a6b3a0", surface: "#28352d" }
};

export default function DigitalCatalogLibrary() {
  return <main className="min-h-screen bg-[#ebe5dc] text-[#332522]">
    <div className="mx-auto max-w-7xl px-5 py-14 sm:px-10">
      <div className="mb-12 max-w-3xl">
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#926b5d]"><Sparkles size={15}/> ProRevest · Editorial</div>
        <h1 className="font-serif text-5xl leading-tight sm:text-7xl">Coleções que<br/><em>transformam espaços.</em></h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#625852] sm:text-lg">Explore os catálogos digitais ProRevest. Descubra texturas, cores e inspirações por meio de apresentações que preservam sua identidade original.</p>
      </div>
      <section className="grid gap-8 lg:grid-cols-2" aria-label="Catálogos disponíveis">
        {(Object.values(catalogs)).map(c => {
          const p = presentation[c.slug];
          return <article key={c.slug} className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_55px_rgba(34,25,23,.13)] transition-transform hover:-translate-y-1">
            <Link to={`/catalogos/${c.slug}`} className="group relative block overflow-hidden" aria-label={`Explorar catálogo ${c.title}`}>
              <div className="overflow-hidden" style={{ background:p.surface }}>
                <img className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" src={catalogPageUrl(c.slug,1)} alt={`Capa original do catálogo ${c.title}`} loading="lazy"/>
              </div>
              <div className="absolute right-5 top-5 rounded-full bg-white/90 p-3 text-[#392b28] shadow-md" aria-hidden="true"><ArrowUpRight size={20}/></div>
            </Link>
            <div className="p-7 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{color:p.color}}>{p.eyebrow}</p>
              <h2 className="mt-3 font-serif text-4xl">{c.title}</h2>
              <p className="mt-1 font-serif text-xl italic text-[#655e58]">{p.statement}</p>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#e4ddd5] pt-5">
                <Link to={`/catalogos/${c.slug}`} className="inline-flex items-center gap-2 rounded-full bg-[#46302d] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#70514a]"><BookOpen size={17}/> Explorar catálogo</Link>
                <a href={catalogPdfUrl(c.slug)} download={`ProRevest-${c.title}.pdf`} className="inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"><Download size={16}/> Baixar PDF</a>
              </div>
            </div>
          </article>;
        })}
      </section>
      <p className="mt-12 text-center text-xs tracking-widest text-[#796f68]">PROREVEST · PEDRAS NATURAIS · CATÁLOGOS DIGITAIS</p>
    </div>
  </main>;
}
