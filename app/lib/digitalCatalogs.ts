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
    sections: [] // index pages must be mapped from exported originals before activation
  },
  flua: {
    slug:"flua",title:"FLUA",pages:17,canvaDesignId:"DAHYAqdRfNI",
    sections: [] // page references require visual validation before activation
  }
};
// No public asset URLs are populated until original approved Canva exports are available.
// Generated public assets must be deployed under /catalogs/{slug}/pages/0001.webp etc.
export function catalogPageUrl(slug: CatalogSlug, page: number) {
  return `/catalogs/${slug}/pages/${String(page).padStart(4,"0")}.webp`;
}
export function catalogPdfUrl(slug: CatalogSlug) {
  return `/catalogs/${slug}/catalog.pdf`;
}
