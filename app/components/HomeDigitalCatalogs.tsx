import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Faixa independente imediatamente abaixo do carrossel.
 * Textos e links são elementos HTML; imagens promocionais são decorativas.
 */
export default function HomeDigitalCatalogs() {
  const entries = [
    { slug: "piaceri" as const, title: "PIACERI", line: "Texturas que inspiram e tornam cada ambiente único.", bg: "bg-[#e6ded5]", image: "/images/catalog-launch/piaceri-faixa.webp" },
    { slug: "flua" as const, title: "FLUA", line: "Superfícies que fluem com a vida.", bg: "bg-[#d7e6e9]", image: "/images/catalog-launch/flua-faixa.webp" }
  ];
  return <section id="catalogos-digitais" aria-labelledby="catalogos-digitais-titulo" className="relative bg-[#fcfaf7] py-7 sm:py-9">
    <div className="mx-auto grid max-w-[1440px] items-center gap-6 px-4 md:grid-cols-[minmax(240px,0.9fr)_minmax(0,2fr)] md:gap-8 lg:px-8">
      <div className="max-w-md">
        <p className="mb-3 text-xs font-bold uppercase tracking-[.23em] text-orange-600">Inspiração para cada detalhe</p>
        <h2 id="catalogos-digitais-titulo" className="text-3xl font-light tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">Catálogos ProRevest</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">Apresentações digitais das nossas linhas, com toda a beleza, textura e especificações para seus projetos.</p>
        <Link to="/catalogos" className="mt-5 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:from-orange-700 hover:to-orange-600">Explorar catálogos <ArrowRight size={18}/></Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
        {entries.map(entry => <Link key={entry.slug} to={`/catalogos/${entry.slug}`} aria-label={`Abrir catálogo ${entry.title}`} className={`group relative flex aspect-[1.65] overflow-hidden rounded-2xl ${entry.bg} shadow-sm ring-1 ring-gray-200/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg`}>
          <div className="relative z-10 flex w-[55%] flex-col justify-center p-4 sm:p-5">
            <span className="mb-1 text-[10px] text-gray-600">linha</span>
            <h3 className="font-serif text-3xl leading-none text-gray-900 sm:text-4xl">{entry.title}</h3>
            <p className="mt-3 max-w-[14rem] text-xs leading-snug text-gray-700">{entry.line}</p>
            <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-gray-800 shadow-sm">Ver catálogo <ArrowRight size={14}/></span>
          </div>
          <div className="absolute inset-y-0 right-0 w-[48%] overflow-hidden">
            <img src={entry.image} loading="lazy" alt="" className="h-full w-full object-cover object-right transition-transform duration-500 group-hover:scale-105"/>
          </div>
        </Link>)}
      </div>
    </div>
  </section>;
}
