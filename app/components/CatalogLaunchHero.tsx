import { ArrowRight, BookOpen, Gem, Layers } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Promotional landing hero kept separate from HomeDigitalCatalogs.
 * Image stage, brand, headline and CTA are independent responsive layers.
 * Artwork assets arrive in a GitHub Desktop package after visual approval.
 */
export default function CatalogLaunchHero() {
  return <section aria-labelledby="catalog-launch-title" className="relative isolate overflow-hidden bg-[#211b19] text-white">
    <div className="absolute inset-0 bg-gradient-to-br from-[#191d15] via-[#34271f] to-[#8c6043]" aria-hidden="true"/>
    <div className="absolute inset-0 opacity-30" style={{backgroundImage:"radial-gradient(circle at 58% 2%,rgba(255,190,116,.4),transparent 54%)"}} aria-hidden="true"/>
    <div className="relative mx-auto grid min-h-[610px] max-w-[1600px] items-center gap-5 px-6 py-16 lg:min-h-[720px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-0 lg:px-16">
      <div className="relative z-10 max-w-2xl lg:py-8">
        <Link to="/" aria-label="Página inicial ProRevest" className="mb-12 block w-fit">
          <img src="/images/catalog-launch/prorevest-logo.png" alt="ProRevest" className="h-auto w-48 max-w-full sm:w-56" />
        </Link>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[.35em] text-orange-400 sm:text-sm">Lançamento</p>
        <h1 id="catalog-launch-title" className="max-w-2xl font-serif text-5xl leading-[1.04] tracking-tight sm:text-6xl xl:text-7xl">
          Nossos catálogos<br/>em versão digital
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-white/85 sm:text-xl">Explore a beleza, a textura e a inovação das linhas PIACERI e FLUA.</p>
        <Link to="/catalogos" className="mt-7 inline-flex items-center gap-4 rounded-full bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-colors hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
          Acessar catálogos <ArrowRight size={20} aria-hidden="true"/>
        </Link>
        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/80 sm:text-sm">
          <li className="inline-flex items-center gap-2"><BookOpen size={20}/> Design exclusivo</li>
          <li className="inline-flex items-center gap-2"><Layers size={20}/> Soluções completas</li>
          <li className="inline-flex items-center gap-2"><Gem size={20}/> Inspiração para projetos</li>
        </ul>
      </div>
      <div className="relative min-h-[250px] lg:h-[610px]" aria-label="Apresentação visual das linhas PIACERI e FLUA">
        <img src="/images/catalog-launch/catalogs-scene.webp" alt="Composição promocional ilustrativa dos catálogos PIACERI e FLUA em cenário arquitetônico" className="h-full min-h-[260px] w-full rounded-2xl object-cover object-center shadow-2xl shadow-black/25 lg:absolute lg:inset-0 lg:min-h-0 lg:rounded-none lg:shadow-none"/>
      </div>
    </div>
  </section>;
}
