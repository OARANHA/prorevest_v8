import { Link } from "react-router-dom";
import { catalogs } from "../lib/digitalCatalogs";
export default function DigitalCatalogLibrary() {
  return <main className="min-h-screen bg-slate-950 text-white p-6"><div className="mx-auto max-w-5xl"><h1 className="text-4xl mb-3">Catálogos ProRevest</h1><p className="text-slate-300 mb-8">Apresentações digitais das linhas ProRevest.</p><div className="grid md:grid-cols-2 gap-5">{Object.values(catalogs).map(c=><Link key={c.slug} className="block border border-slate-600 rounded-lg p-8 hover:bg-slate-800" to={`/catalogos/${c.slug}`}><h2 className="text-3xl">{c.title}</h2><p className="text-slate-300 mt-3">{c.pages} páginas • Pré-catálogo</p><p className="text-sm mt-5 underline">Explorar catálogo</p></Link>)}</div></div></main>;
}
