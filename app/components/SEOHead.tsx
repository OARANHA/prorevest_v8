// Removido useLocation para evitar erro de hook fora do Router em dev

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  noIndex?: boolean;
}

export function SEOHead({ 
  title = "ProRevest - Revestimentos de Alta Qualidade para sua casa ou empresa", 
  description = "Especialistas em revestimentos residenciais e comerciais com mais de 15 anos de experiência. Orçamentos rápidos e atendimento personalizado.",
  image = "/og-image.jpg",
  type = "website",
  noIndex = false
}: SEOProps) {
  const baseOrigin = (import.meta as any)?.env?.VITE_SITE_URL || "https://prorevesttintas.com.br";
  const isClient = typeof window !== "undefined";
  const url = isClient ? `${baseOrigin}${window.location.pathname}${window.location.search || ''}` : baseOrigin;
  
  return (
    <>
      {/* Metadados básicos */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="revestimento, piso, parede, cerâmica, porcelanato, construção civil, orçamento, reforma, acabamento" />
      <meta name="author" content="ProRevest" />
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="ProRevest" />
      <meta property="og:locale" content="pt_BR" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:creator" content="@prorevest" />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      {!noIndex && <meta name="robots" content="index,follow" />}
      
      {/* Additional SEO */}
      <meta name="language" content="pt-BR" />
      <meta name="geo.region" content="BR-SP" />
      <meta name="geo.placename" content="São Paulo" />
      <meta name="ICBM" content="-23.5505;-46.6333" />
      
      {/* Structured Data - LocalBusiness */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "ProRevest",
            "description": description,
            "url": "https://prorevesttintas.com.br",
            "telephone": "+55-51-98660-5758",
            "email": "contato@prorevest.com.br",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Canoas",
              "addressRegion": "RS",
              "addressCountry": "BR",
              "streetAddress": "Rio Grande do SUl"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "-23.5505",
              "longitude": "-46.6333"
            },
            "openingHours": "Mo-Fr 08:00-18:00",
            "sameAs": [
              "https://instagram.com/prorevesttintas",
              "https://facebook.com/prorevesttintas",
              "https://linkedin.com/company/prorevesttintas"
            ],
            "priceRange": "$$",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "127"
            }
          })
        }}
      />
      
      {/* Structured Data - Service */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Serviços de Revestimento",
            "description": "Instalação de revestimentos cerâmicos, porcelanatos e pedras naturais",
            "provider": {
              "@type": "LocalBusiness",
              "name": "ProRevest",
              "url": "https://prorevestintas.com.br"
            },
            "serviceType": "Installation Service",
            "areaServed": {
              "@type": "Place",
              "name": "Canoas e Brasil"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Catálogo de Serviços",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Revestimento Cerâmico",
                    "description": "Instalação de cerâmicas em paredes e pisos"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Revestimento",
                    "description": "Aplicação de porcelanatos de alta qualidade"
                  }
                }
              ]
            }
          })
        }}
      />
    </>
  );
}
