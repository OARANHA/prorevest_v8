import { ArrowRight, BookOpen, Gem, Layers } from "lucide-react";
import { Link } from "react-router-dom";

/** Full-bleed artwork; editorial content is accessible and independent. */
export default function CatalogLaunchHero() {
  return (
    <section aria-labelledby="catalog-launch-title" className="relative isolate h-full w-full overflow-hidden bg-[#211b19] text-white">
      <img
        src="/images/catalog-launch/catalogs-scene.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(19,17,14,.94) 0%, rgba(24,20,16,.84) 30%, rgba(26,20,16,.4) 52%, rgba(26,20,16,0) 76%)" }} />
      <div className="relative z-10 flex h-full w-full items-center px-6 pb-16 pt-10 sm:px-12 lg:px-[7%]">
        <div className="max-w-[600px]">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[.35em] text-orange-400 sm:text-sm">Lançamento</p>
          <h1 id="catalog-launch-title" className="font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl xl:text-6xl">
            Nossos catálogos<br/>em versão digital
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/90 sm:text-lg">
            Explore a beleza, a textura e a inovação das linhas PIACERI e FLUA.
          </p>
          <Link to="/catalogos" className="mt-6 inline-flex items-center gap-3 rounded-full bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            Acessar catálogos <ArrowRight size={20} aria-hidden="true"/>
          </Link>
          <ul className="mt-7 hidden flex-wrap gap-x-5 gap-y-3 text-xs text-white/90 sm:flex">
            <li className="inline-flex items-center gap-2"><BookOpen size={18}/> Design exclusivo</li>
            <li className="inline-flex items-center gap-2"><Layers size={18}/> Soluções completas</li>
            <li className="inline-flex items-center gap-2"><Gem size={18}/> Inspiração para projetos</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
