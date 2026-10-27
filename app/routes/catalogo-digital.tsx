import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Download, ExternalLink, Home, ZoomIn, ZoomOut } from "lucide-react";
import { catalogs, catalogPageUrl, catalogPdfUrl, type CatalogSlug } from "../lib/digitalCatalogs";

export default function DigitalCatalogViewer() {
  const { slug } = useParams();
  const catalog = slug && Object.prototype.hasOwnProperty.call(catalogs,slug) ? catalogs[slug as CatalogSlug] : null;
  const [page,setPage] = useState(1);
  const [zoom,setZoom] = useState(false);
  const [loadFailed,setLoadFailed] = useState(false);
  const [pdfAvailable,setPdfAvailable] = useState(false);
  useEffect(()=>{setPage(1);setZoom(false);setLoadFailed(false)},[slug]);
  useEffect(()=>setLoadFailed(false),[page,slug]);
  useEffect(()=>{
    if(!catalog) return;
    let active=true;
    fetch(catalogPdfUrl(catalog.slug),{method:"HEAD"})
      .then(r=>{if(active)setPdfAvailable(r.ok && (r.headers.get("content-type")||"").includes("pdf"))})
      .catch(()=>{if(active)setPdfAvailable(false)});
    return ()=>{active=false};
  },[catalog?.slug]);
  useEffect(()=>{
    if(!catalog) return;
    const handle=(event: KeyboardEvent)=>{
      if(event.target instanceof HTMLElement && ["INPUT","TEXTAREA","SELECT"].includes(event.target.tagName))return;
      if(event.key==="ArrowRight")setPage(p=>Math.min(catalog.pages,p+1));
      if(event.key==="ArrowLeft")setPage(p=>Math.max(1,p-1));
      if(event.key==="Escape")setZoom(false);
    };
    window.addEventListener("keydown",handle);
    return ()=>window.removeEventListener("keydown",handle);
  },[catalog?.slug]);
  if(!catalog) return <main className="mx-auto max-w-3xl p-8"><h1>Catálogo não encontrado</h1><Link to="/catalogos">Voltar para catálogos</Link></main>;
  const url=catalogPageUrl(catalog.slug,page);
  return <main className="min-h-screen bg-slate-950 text-white" aria-label={`Catálogo ${catalog.title}`}>
    <div className="mx-auto max-w-7xl px-4 py-5">
      <nav className="flex flex-wrap items-center justify-between gap-3 mb-5" aria-label="Navegação do catálogo">
        <Link to="/catalogos" className="inline-flex items-center gap-2 underline underline-offset-4"><Home size={17}/> Catálogos</Link>
        <div className="text-center"><div className="text-2xl font-semibold tracking-wider">{catalog.title}</div><div className="text-sm text-slate-400">Pré-catálogo ProRevest</div></div>
        <div className="flex items-center gap-3">
          {pdfAvailable ? <a href={catalogPdfUrl(catalog.slug)} download={`ProRevest-${catalog.title}.pdf`} className="inline-flex gap-2 items-center underline"><Download size={17}/> PDF</a> : <span className="text-xs text-slate-400" title="Aguardando exportação oficial aprovada">PDF indisponível</span>}
        </div>
      </nav>
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {catalog.sections.map(section=><button type="button" key={section.title} className="rounded border border-slate-500 px-3 py-2 hover:bg-slate-800" onClick={()=>setPage(Math.min(catalog.pages,section.firstPage))}>{section.title}</button>)}
      </div>
      <div className={zoom?"overflow-auto max-h-[82vh] border border-slate-700":"border border-slate-700"} aria-live="polite">
        {loadFailed ? <div className="aspect-video flex flex-col gap-3 justify-center items-center p-6 text-center bg-slate-900"><h2 className="font-semibold">Página original ainda não disponível</h2><p className="text-sm text-slate-300">Aguardando a exportação aprovada do Canva. Nenhuma imagem ilustrativa será usada no lugar do design original.</p></div> :
        <img key={url} src={url} onError={()=>setLoadFailed(true)} className={zoom?"w-[1920px] max-w-none mx-auto":"block w-full h-auto"} alt={`Página ${page} de ${catalog.pages} do catálogo ${catalog.title}`} loading="eager"/>}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
        <button type="button" className="rounded border px-3 py-2 disabled:opacity-40" disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} aria-label="Página anterior"><ArrowLeft/></button>
        <label className="flex items-center gap-2">Página <select className="text-slate-950 rounded p-2" value={page} onChange={e=>setPage(Number(e.target.value))}>{Array.from({length:catalog.pages},(_,i)=><option value={i+1} key={i}>{i+1}</option>)}</select> de {catalog.pages}</label>
        <button type="button" className="rounded border px-3 py-2 disabled:opacity-40" disabled={page===catalog.pages} onClick={()=>setPage(p=>Math.min(catalog.pages,p+1))} aria-label="Próxima página"><ArrowRight/></button>
        <button type="button" className="rounded border px-3 py-2" onClick={()=>setZoom(z=>!z)} aria-label={zoom?"Reduzir zoom":"Ampliar zoom"}>{zoom?<ZoomOut/>:<ZoomIn/>}</button>
      </div>
      <div className="text-center text-xs text-slate-400 mt-4">Imagens e PDF exibidos somente quando os arquivos originais aprovados estiverem publicados no domínio ProRevest.</div>
    </div>
  </main>;
}
