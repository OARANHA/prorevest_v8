export type CatalogSlug = "piaceri" | "flua";
export interface CatalogSection { title: string; firstPage: number; }
export interface CatalogEntry {
  slug: CatalogSlug;
  title: string;
  pages: number;
  canvaDesignId: string;
  sections: CatalogSection[];
}
export const catalogs: Record<CatalogSlug, CatalogEntry> = {
  piaceri: {
    slug: "piaceri", title: "PIACERI", pages: 38, canvaDesignId: "DAHYAXZ36LY",
    sections: [{title:"Linea Laghi",firstPage:3},{title:"Linea Puglia",firstPage:8},{title:"Linea Luce",firstPage:11},{title:"Linea Vulcani",firstPage:17},{title:"Linea Rovine",firstPage:23},{title:"Linea Vino",firstPage:29},{title:"Linea Firmata",firstPage:33}]
  },
  flua: {
    slug:"flua",title:"FLUA",pages:17,canvaDesignId:"DAHYAqdRfNI",
    sections: [{title:"Linha FLUA",firstPage:3},{title:"Linha Paraíso",firstPage:13}]
  }
};
// Validated against Canva-exported PDF pages on 2026-10-27.
// Static assets are supplied in the separately delivered GitHub Desktop asset package.
// Place them at public/catalogs/{slug}/pages/0001.webp etc.
export function catalogPageUrl(slug: CatalogSlug, page: number) {
  return `/catalogs/${slug}/pages/${String(page).padStart(4,"0")}.webp`;
}
export function catalogPdfUrl(slug: CatalogSlug) {
  return `/catalogs/${slug}/catalog.pdf`;
}
