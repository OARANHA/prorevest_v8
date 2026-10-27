import { ArrowRight, BookOpen, Gem, Layers } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Promotional landing hero kept separate from HomeDigitalCatalogs.
 * Image stage, brand, headline and CTA are independent responsive layers.
 * Artwork assets arrive in a GitHub Desktop package after visual approval.
 */
export default function CatalogLaunchHero() {
  return <section aria-labelledby="catalog-launch-title" className="relative isolate h-full overflow-hidden bg-[#211b19] text-white">
    <div className="absolute inset-0 bg-gradient-to-br from-[#191d15] via-[#34271f] to-[#8c6043]" aria-hidden="true"/>
    <div className="absolute inset-0 opacity-30" style={{backgroundImage:"radial-gradient(circle at 58% 2%,rgba(255,190,116,.4),transparent 54%)"}} aria-hidden="true"/>
    <div className="relative mx-auto grid h-full min-h-0 max-w-[1600px] grid-rows-[minmax(0,1fr)_minmax(180px,0.75fr)] items-center gap-2 px-6 pb-16 pt-8 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:grid-rows-1 lg:gap-0 lg:px-16 lg:py-8">
      <div className="relative z-10 max-w-2xl lg:py-8">
        <Link to="/" aria-label="Página inicial ProRevest" className="mb-5 block w-fit lg:mb-8">
          <img src="/images/catalog-launch/prorevest-logo.png" alt="ProRevest" className="h-auto w-48 max-w-full sm:w-56" />
        </Link>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[.35em] text-orange-400 sm:text-sm">Lançamento</p>
        <h1 id="catalog-launch-title" className="max-w-2xl font-serif text-4xl leading-[1.04] tracking-tight sm:text-5xl xl:text-6xl">
          Nossos catálogos<br/>em versão digital
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-white/85 sm:text-xl">Explore a beleza, a textura e a inovação das linhas PIACERI e FLUA.</p>
        <Link to="/catalogos" className="mt-7 inline-flex items-center gap-4 rounded-full bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-colors hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
          Acessar catálogos <ArrowRight size={20} aria-hidden="true"/>
        </Link>
        <ul className="mt-5 flex flex-wrap lg:mt-8 gap-x-6 gap-y-3 text-xs text-white/80 sm:text-sm">
          <li className="inline-flex items-center gap-2"><BookOpen size={20}/> Design exclusivo</li>
          <li className="inline-flex items-center gap-2"><Layers size={20}/> Soluções completas</li>
          <li className="inline-flex items-center gap-2"><Gem size={20}/> Inspiração para projetos</li>
        </ul>
      </div>
      <div className="relative h-full min-h-0 overflow-hidden rounded-2xl lg:rounded-none" aria-label="Apresentação visual das linhas PIACERI e FLUA">
        <img src="/images/catalog-launch/catalogs-scene.webp" alt="Composição promocional ilustrativa dos catálogos PIACERI e FLUA em cenário arquitetônico" className="absolute inset-0 h-full w-full object-cover object-center shadow-2xl shadow-black/25 lg:shadow-none"/>
      </div>
    </div>
  </section>;
}
