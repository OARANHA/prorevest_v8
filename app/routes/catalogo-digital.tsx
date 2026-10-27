import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Copy, Download, Home, Layers, Maximize, Minimize, QrCode, Share2, X, ZoomIn, ZoomOut } from "lucide-react";
import { catalogs, catalogPageUrl, catalogPdfUrl, type CatalogSlug } from "../lib/digitalCatalogs";

type Panel = "collections" | "share" | "qr" | null;
const themes = {
  piaceri: { accent: "#ea580c", ink: "#374151", paper: "#ffffff", body: "#f8fafc" },
  flua: { accent: "#4f46e5", ink: "#374151", paper: "#ffffff", body: "#f8fafc" }
};

export default function DigitalCatalogViewer() {
  const { slug } = useParams();
  const catalog = slug && Object.prototype.hasOwnProperty.call(catalogs, slug) ? catalogs[slug as CatalogSlug] : null;
  const theme = themes[catalog?.slug || "piaceri"];
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [pdfAvailable, setPdfAvailable] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setPage(1); setZoom(false); setPanel(null); setLoadFailed(false); }, [slug]);
  useEffect(() => setLoadFailed(false), [page, slug]);
  useEffect(() => {
    if (!catalog) return;
    let active = true;
    fetch(catalogPdfUrl(catalog.slug), { method: "HEAD" })
      .then(r => { if (active) setPdfAvailable(r.ok && (r.headers.get("content-type") || "").includes("pdf")); })
      .catch(() => { if (active) setPdfAvailable(false); });
    return () => { active = false; };
  }, [catalog?.slug]);
  useEffect(() => {
    const update = () => setFullScreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);
  useEffect(() => {
    if (!catalog) return;
    const handler = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable)) return;
      if (event.key === "ArrowRight") setPage(p => Math.min(catalog.pages, p + 1));
      if (event.key === "ArrowLeft") setPage(p => Math.max(1, p - 1));
      if (event.key === "Escape") setPanel(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [catalog?.slug]);

  const publicUrl = !catalog ? "" : `https://prorevesttintas.com.br/catalogos/${catalog.slug}`;
  useEffect(() => {
    let cancelled = false;
    if (panel !== "qr" || !publicUrl) return;
    // QR is generated locally, without a third-party API or user tracking.
    import("qrcode").then(mod => mod.toDataURL(publicUrl, { width: 512, margin: 2, errorCorrectionLevel: "H" }))
      .then(data => { if (!cancelled) setQrImage(data); })
      .catch(() => { if (!cancelled) setQrImage(""); });
    return () => { cancelled = true; };
  }, [panel, publicUrl]);

  async function share() {
    if (!publicUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: `Catálogo ${catalog?.title} | ProRevest`, url: publicUrl });
        return;
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
    }
    try { await navigator.clipboard.writeText(publicUrl); setCopied(true); }
    catch { setPanel("share"); }
  }
  async function fullscreen() {
    if (!stageRef.current) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await stageRef.current.requestFullscreen();
    } catch { /* Fullscreen is not supported by all browsers. */ }
  }

  if (!catalog) return <main className="mx-auto max-w-3xl p-8"><h1>Catálogo não encontrado</h1><Link to="/catalogos">Voltar para catálogos</Link></main>;
  const url = catalogPageUrl(catalog.slug, page);
  const actionStyle = "flex h-11 w-11 items-center justify-center rounded-xl transition-colors hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  const action = (label: string, Icon: typeof Home, onClick: () => void, active = false) =>
    <button type="button" title={label} aria-label={label} aria-pressed={active} onClick={onClick} className={actionStyle} style={active ? { background: theme.ink, color: theme.paper } : { color: theme.ink }}><Icon size={20} /></button>;

  return <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-indigo-50/30 text-gray-800">
    <div className="mx-auto max-w-7xl px-3 pt-7 pb-24 sm:px-8">
      <header className="mb-5 flex items-center justify-between gap-4">
        <Link to="/catalogos" className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:text-orange-600">← Catálogos</Link>
        <div className="text-center"><h1 className="text-3xl font-semibold tracking-wide">{catalog.title.toLowerCase()}</h1><p className="text-xs text-gray-500">ProRevest · Pedras naturais</p></div>
        <span className="text-xs tabular-nums opacity-75">{page} / {catalog.pages}</span>
      </header>
      <div className="relative mx-auto max-w-6xl">
        <div ref={stageRef} className="relative flex flex-col justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-slate-200/60" style={fullScreen ? { background:"#111827", height:"100dvh", padding:"12px 60px" } : undefined}>
          <div className={zoom ? "max-h-[84vh] overflow-auto" : "overflow-hidden"} style={fullScreen && !zoom ? { maxHeight:"calc(100dvh - 110px)", display:"flex", alignItems:"center" } : undefined}>
            {loadFailed ?
              <div className="flex aspect-video flex-col items-center justify-center gap-2 p-6 text-center"><h2 className="font-semibold">Página indisponível</h2><p className="text-sm opacity-75">Não foi possível carregar o arquivo original.</p></div> :
              <img key={url} src={url} alt={`Página ${page} de ${catalog.pages} do catálogo ${catalog.title}`} onError={() => setLoadFailed(true)} loading="eager" className={zoom ? "mx-auto w-[1920px] max-w-none" : fullScreen ? "mx-auto block h-auto max-h-[calc(100dvh-110px)] w-full object-contain" : "block h-auto w-full"} />}
          </div>
          <nav aria-label="Ferramentas do catálogo" className={`absolute ${fullScreen ? "bottom-16" : "bottom-2"} left-1/2 z-30 flex -translate-x-1/2 gap-1 rounded-2xl border border-white/40 p-2 shadow-2xl backdrop-blur-xl md:bottom-auto md:left-3 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:flex-col`} style={{ background: theme.paper + "ee" }}>
            {action("Coleções", Layers, () => setPanel(p => p === "collections" ? null : "collections"), panel === "collections")}
            {action("Compartilhar", Share2, () => setPanel(p => p === "share" ? null : "share"), panel === "share")}
            {action("QR Code", QrCode, () => setPanel(p => p === "qr" ? null : "qr"), panel === "qr")}
            {pdfAvailable ? <a href={catalogPdfUrl(catalog.slug)} download={`ProRevest-${catalog.title}.pdf`} title="Baixar PDF" aria-label="Baixar PDF" className={actionStyle} style={{ color: theme.ink }}><Download size={20}/></a> : <span title="PDF indisponível" className="flex h-11 w-11 items-center justify-center opacity-40" style={{color:theme.ink}}><Download size={20}/></span>}
            {action(zoom ? "Reduzir zoom" : "Ampliar zoom", zoom ? ZoomOut : ZoomIn, () => setZoom(v => !v), zoom)}
            {action(fullScreen ? "Sair da tela cheia" : "Tela cheia", fullScreen ? Minimize : Maximize, fullscreen, fullScreen)}
          </nav>
          {fullScreen && <nav aria-label="Navegação em tela cheia" className="absolute bottom-2 left-1/2 z-30 flex -translate-x-1/2 items-center gap-4 rounded-full px-4 py-2 text-sm shadow-xl" style={{background:theme.paper,color:theme.ink}}><button disabled={page===1} aria-label="Página anterior" className="disabled:opacity-30" onClick={()=>setPage(p=>Math.max(1,p-1))}><ArrowLeft size={22}/></button><span className="tabular-nums">{page} / {catalog.pages}</span><button disabled={page===catalog.pages} aria-label="Próxima página" className="disabled:opacity-30" onClick={()=>setPage(p=>Math.min(catalog.pages,p+1))}><ArrowRight size={22}/></button><button title="Criar QR Code" aria-label="Criar QR Code" onClick={()=>setPanel("qr")}><QrCode size={20}/></button></nav>}
          {panel && <section role="dialog" aria-label={panel === "collections" ? "Coleções" : panel === "qr" ? "QR Code" : "Compartilhar"} className="absolute bottom-20 left-2 right-2 z-40 mx-auto max-w-sm rounded-2xl p-5 shadow-2xl md:bottom-auto md:left-16 md:right-auto md:top-8 md:mx-0" style={{background:theme.paper,color:theme.ink}}>
          <div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-semibold">{panel === "collections" ? "Coleções" : panel === "share" ? "Compartilhar" : "QR Code"}</h2><button aria-label="Fechar" onClick={() => setPanel(null)}><X size={20}/></button></div>
          {panel === "collections" && <div className="max-h-[58vh] overflow-y-auto">{catalog.sections.map(s => <button key={s.title} onClick={() => { setPage(s.firstPage); setPanel(null); }} className="flex w-full items-center justify-between border-b border-gray-200 py-3 text-left text-lg font-medium hover:text-orange-600">{s.title}<ArrowRight size={17}/></button>)}</div>}
          {panel === "share" && <div className="space-y-3"><p className="text-sm">Compartilhe o endereço permanente deste catálogo.</p><input aria-label="Link do catálogo" readOnly value={publicUrl} className="w-full rounded-lg border border-current/20 bg-transparent p-2 text-sm"/><button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm" style={{background:theme.ink,color:theme.paper}} onClick={() => share()}>{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? "Link copiado" : "Copiar ou compartilhar"}</button></div>}
          {panel === "qr" && <div className="flex flex-col items-center gap-3"><p className="text-center text-sm">Aponte a câmera para abrir o catálogo.</p>{qrImage ? <><img className="h-48 w-48" src={qrImage} alt={`QR Code para abrir o catálogo ${catalog.title}`}/><a download={`QR-ProRevest-${catalog.title}.png`} href={qrImage} className="rounded-lg px-4 py-2 text-sm" style={{background:theme.ink,color:theme.paper}}>Baixar QR Code PNG</a></> : <p className="text-sm">Gerando QR Code…</p>}</div>}
        </section>}
        </div>
      </div>
      <nav aria-label="Navegação das páginas" className="mt-6 flex items-center justify-center gap-5 text-sm text-gray-700">
        <button disabled={page === 1} aria-label="Página anterior" className="rounded-xl border border-gray-200 bg-white p-2 shadow-sm hover:border-orange-300 disabled:opacity-25" onClick={() => setPage(p => Math.max(1, p - 1))}><ArrowLeft size={20}/></button>
        <label className="flex items-center gap-2">Página <select className="rounded-lg p-2" style={{ background:theme.paper,color:theme.ink }} value={page} onChange={e => setPage(Number(e.target.value))}>{Array.from({ length: catalog.pages }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select> de {catalog.pages}</label>
        <button disabled={page === catalog.pages} aria-label="Próxima página" className="rounded-xl border border-white/30 p-2 disabled:opacity-25" onClick={() => setPage(p => Math.min(catalog.pages, p + 1))}><ArrowRight size={20}/></button>
      </nav>
    </div>
  </main>;
}
