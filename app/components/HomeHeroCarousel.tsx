import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import CatalogLaunchHero from "./CatalogLaunchHero";

interface HomeHeroCarouselProps {
  studioSlide: React.ReactNode;
}

const SLIDE_LABELS = ["Studio ProRevest", "Lançamento dos catálogos"];

export default function HomeHeroCarousel({ studioSlide }: HomeHeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    if (paused || hovered || focused || !visible || reducedMotion) return;
    const timer = window.setInterval(() => setActive(value => (value + 1) % 2), 8000);
    return () => window.clearInterval(timer);
  }, [paused, hovered, focused, visible, reducedMotion]);

  const go = (index: number) => setActive((index + 2) % 2);
  return (
    <div
      className="relative isolate overflow-hidden bg-[#211b19]"
      aria-roledescription="carrossel"
      aria-label="Destaques da ProRevest"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div
        className={active === 0 ? "relative" : "hidden"}
        aria-hidden={active !== 0}
      >
        {studioSlide}
      </div>
      <div
        className={active === 1 ? "relative" : "hidden"}
        aria-hidden={active !== 1}
      >
        <CatalogLaunchHero />
      </div>
      <div className="absolute bottom-5 right-4 z-[60] flex items-center gap-2 rounded-full border border-white/30 bg-gray-950/55 px-3 py-2 text-white shadow-xl backdrop-blur-lg sm:bottom-8 sm:right-8" role="group" aria-label="Controles do carrossel">
        <button type="button" aria-label="Slide anterior" onClick={() => go(active - 1)} className="rounded-full p-2 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
          <ArrowLeft size={19} />
        </button>
        {SLIDE_LABELS.map((label, index) => (
          <button
            key={label}
            type="button"
            aria-label={`Mostrar: ${label}`}
            aria-current={active === index ? "true" : undefined}
            onClick={() => go(index)}
            className={`h-2.5 rounded-full transition-all ${active === index ? "w-7 bg-orange-500" : "w-2.5 bg-white/70 hover:bg-white"}`}
          />
        ))}
        <button type="button" aria-label="Próximo slide" onClick={() => go(active + 1)} className="rounded-full p-2 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
          <ArrowRight size={19} />
        </button>
        <button type="button" aria-label={paused ? "Retomar rotação automática" : "Pausar rotação automática"} onClick={() => setPaused(v => !v)} className="rounded-full p-2 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
          {paused ? <Play size={17} /> : <Pause size={17} />}
        </button>
      </div>
    </div>
  );
}
