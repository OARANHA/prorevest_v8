import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerSlide {
  image: string;
  link?: string;
  alt?: string;
}

const banners: BannerSlide[] = [
  { image: '/images/banner5.png', alt: 'Banner ProRevest' },
  { image: '/images/banner3.jpg', link: '/studio', alt: 'Studio ProRevest' },
  { image: '/images/banner4.jpg', alt: 'Banner Promocional' },
];

interface HeroCarouselProps {
  autoPlayInterval?: number;
}

export function HeroCarousel({ autoPlayInterval = 120000 }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % banners.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + banners.length) % banners.length);
  }, [currentSlide, goToSlide, banners.length]);

  // Auto-rotation
  useEffect(() => {
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlayInterval, nextSlide]);

  const currentBanner = banners[currentSlide];

  // Se o banner tem link, wrap em Link component
  const BannerContent = () => (
    <div
      className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${
        isTransitioning ? 'opacity-90' : 'opacity-100'
      }`}
      style={{ backgroundImage: `url('${currentBanner.image}')` }}
      role="img"
      aria-label={currentBanner.alt}
    />
  );

  return (
    <div className="absolute inset-0 z-0">
      {/* Banner slides */}
      {currentBanner.link ? (
        <Link to={currentBanner.link} className="absolute inset-0">
          <BannerContent />
        </Link>
      ) : (
        <BannerContent />
      )}

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-[25] p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 text-white"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-[25] p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 text-white"
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[25] flex gap-3">
        {banners.map((banner, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Ir para ${banner.alt}`}
          />
        ))}
      </div>
    </div>
  );
}