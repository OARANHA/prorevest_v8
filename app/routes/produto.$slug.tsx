import type { LoaderFunctionArgs, MetaFunction } from "react-router-dom";
import { isRouteErrorResponse, Link, useLoaderData, useRouteError } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, Layers3, MessageCircle, Palette, Sparkles } from "lucide-react";
import { ProductService, type ProductWithDetails } from "../services/productService";

type ProductData = { product: ProductWithDetails; related: ProductWithDetails[] };

const labels: Record<string, string> = {
  composition: "Composição",
  coverage: "Rendimento",
  yield: "Rendimento",
  dryingTime: "Tempo de secagem",
  drying_time: "Tempo de secagem",
  applicationMethod: "Método de aplicação",
  dilution: "Diluição",
  cleaning: "Limpeza",
  glossLevel: "Acabamento",
  durability: "Durabilidade",
  washability: "Lavabilidade",
  voc: "VOC",
  vocEmission: "Emissão de VOC",
  certifications: "Certificações",
  suitableFor: "Indicação de uso",
};

export const meta: MetaFunction = ({ data }) => {
  const product = (data as ProductData | undefined)?.product;
  if (!product) return [{ title: "Produto não encontrado | ProRevest" }];
  const description = (product.description || `Conheça ${product.name} e suas informações técnicas na ProRevest.`).slice(0, 160);
  return [
    { title: `${product.name} | Produtos ProRevest` },
    { name: "description", content: description },
    { property: "og:title", content: product.name },
    { property: "og:description", content: description },
    { property: "og:type", content: "product" },
    ...(product.image_url ? [{ property: "og:image", content: product.image_url }] : []),
    { tagName: "link", rel: "canonical", href: `https://prorevesttintas.com.br/produto/${encodeURIComponent(product.slug)}` },
  ];
};

export async function loader({ params }: LoaderFunctionArgs): Promise<ProductData> {
  if (!params.slug) throw new Response("Produto não encontrado", { status: 404 });

  try {
    const product = await ProductService.getProductBySlug(params.slug);
    if (!product) throw new Response("Produto não encontrado", { status: 404 });

    let related: ProductWithDetails[] = [];
    try {
      related = (await ProductService.getSimilarProducts(product.id, 4))
        .filter((other) => other.id !== product.id);
    } catch (error) {
      console.error("Falha ao consultar produtos relacionados:", error);
    }

    return { product, related };
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error("Erro ao consultar produto no catálogo:", error);
    throw new Response("Produto temporariamente indisponível", { status: 503 });
  }
}

function techItems(value: unknown): Array<{ label: string; value: string }> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return Object.entries(value as Record<string, unknown>)
    .map(([key, entry]) => {
      const text = typeof entry === "string" || typeof entry === "number"
        ? String(entry).trim()
        : Array.isArray(entry) && entry.every((item) => typeof item === "string" || typeof item === "number")
          ? entry.join(", ")
          : "";
      return { label: labels[key] || key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " "), value: text };
    })
    .filter((entry) => Boolean(entry.value));
}

function productImages(product: ProductWithDetails): string[] {
  const values = [product.image_url, ...(product.product_variants || []).map((v) => v.image_url)];
  return [...new Set(values.filter((url): url is string => typeof url === "string" && (/^https?:\/\//i.test(url) || url.startsWith("/"))))];
}

function ProductPhoto({ url, name, className }: { url?: string; name: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-stone-200 via-stone-100 to-slate-100 ${className || ""}`}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Layers3 className="h-12 w-12" aria-hidden="true" />
        <span className="text-sm">Imagem não disponível</span>
      </div>
      {url && <img src={url} alt={name} className="relative h-full w-full object-contain" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
    </div>
  );
}

export default function Produto() {
  const { product, related } = useLoaderData<typeof loader>();
  const images = useMemo(() => productImages(product), [product]);
  const [activeImage, setActiveImage] = useState(0);
  useEffect(() => setActiveImage(0), [product.id]);
  const details = useMemo(() => techItems(product.technical_data), [product.technical_data]);
  const colors = useMemo(() => {
    const all = [...(product.product_colors || []).map((item) => item.colors), ...(product.product_variants || []).map((item) => item.colors)];
    return [...new Map(all.filter(Boolean).map((color) => [color.id, color])).values()];
  }, [product]);
  const contact = `https://wa.me/5551986605758?text=${encodeURIComponent(`Olá! Gostaria de informações técnicas e disponibilidade do produto ${product.name} (ProRevest).`)}`;

  return (
    <main className="min-h-screen bg-[#f7f5f1] text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
        <nav aria-label="Localização" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <Link to="/catalogo" className="inline-flex items-center gap-2 font-semibold text-orange-700 hover:underline"><ArrowLeft className="h-4 w-4" /> Produtos</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <section aria-label={`Imagens de ${product.name}`} className="min-w-0">
            <ProductPhoto url={images[activeImage]} name={product.name} className="aspect-square rounded-3xl border border-[#e7e1d7] bg-white" />
            {images.length > 1 && <div className="mt-4 flex flex-wrap gap-3">
              {images.map((url, index) => (
                <button key={url} type="button" aria-label={`Ver imagem ${index + 1} de ${product.name}`} aria-pressed={activeImage === index} onClick={() => setActiveImage(index)} className={`h-20 w-20 overflow-hidden rounded-xl border-2 bg-white p-1 transition ${activeImage === index ? "border-orange-600" : "border-slate-200 hover:border-orange-300"}`}>
                  <img src={url} alt="" loading="lazy" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>}
          </section>

          <section className="flex flex-col justify-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-orange-700">{product.categories?.name || "Produto ProRevest"}</p>
            <h1 className="mb-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{product.name}</h1>
            {product.description && <p className="mb-7 text-lg leading-relaxed text-slate-600">{product.description}</p>}
            {product.finishes?.name && <div className="mb-6 flex items-center gap-3 text-slate-700"><Layers3 className="h-5 w-5 text-orange-600" /><span><strong>Acabamento:</strong> {product.finishes.name}</span></div>}
            {colors.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-3 flex items-center gap-2 text-base font-semibold"><Palette className="h-5 w-5 text-orange-600" /> Cores cadastradas</h2>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <div key={color.id} className="flex max-w-[150px] items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700" title={color.name}>
                      <span className="h-5 w-5 shrink-0 rounded-full border border-slate-300" style={{ backgroundColor: /^#[0-9a-f]{3,8}$/i.test(color.hex_code || "") ? color.hex_code : "#e5e7eb" }} />
                      <span className="truncate">{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/studio" className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-7 py-4 font-semibold text-white hover:bg-orange-700"><Sparkles className="h-5 w-5" /> Experimentar cores no Studio</Link>
              <a href={contact} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-4 font-semibold text-slate-900 hover:bg-slate-50"><MessageCircle className="h-5 w-5" /> Consultar produto</a>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">O Studio permite experimentar cores e efeitos em uma foto do ambiente. A seleção deste produto não é aplicada automaticamente.</p>
          </section>
        </div>

        {(product.full_description || details.length > 0) && (
          <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            {product.full_description && (
              <section aria-labelledby="description-title" className="rounded-2xl border border-[#e7e1d7] bg-white p-7 sm:p-9">
                <h2 id="description-title" className="mb-5 text-2xl font-semibold">Sobre este produto</h2>
                <p className="whitespace-pre-line leading-relaxed text-slate-700">{product.full_description}</p>
              </section>
            )}
            {details.length > 0 && (
              <section aria-labelledby="technical-title" className="rounded-2xl border border-[#e7e1d7] bg-white p-7 sm:p-9">
                <h2 id="technical-title" className="mb-5 text-2xl font-semibold">Informações técnicas cadastradas</h2>
                <dl className="divide-y divide-slate-100">
                  {details.map((detail) => <div key={detail.label} className="grid gap-1 py-3 sm:grid-cols-[140px_1fr] sm:gap-4"><dt className="text-sm font-semibold text-slate-700">{detail.label}</dt><dd className="text-sm text-slate-600">{detail.value}</dd></div>)}
                </dl>
                <p className="mt-5 text-xs leading-relaxed text-slate-500">Confirme preparo, rendimento e modo de aplicação na documentação técnica atual do produto antes de utilizar.</p>
              </section>
            )}
          </div>
        )}

        {product.application_video_url && /^https?:\/\//i.test(product.application_video_url) && (
          <div className="mt-8">
            <a href={product.application_video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-orange-700 underline underline-offset-4">Ver vídeo de aplicação <ExternalLink className="h-4 w-4" /></a>
          </div>
        )}

        {related.length > 0 && (
          <section className="mt-16" aria-labelledby="related-products-title">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-3 border-b border-slate-300 pb-5">
              <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-orange-700">Continue explorando</p><h2 id="related-products-title" className="text-3xl font-semibold">Outros produtos</h2></div>
              <Link to="/catalogo" className="inline-flex items-center gap-2 font-semibold text-orange-700">Ver catálogo <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((other) => (
                <Link to={`/produto/${other.slug}`} key={other.id} className="group overflow-hidden rounded-2xl border border-[#e7e1d7] bg-white shadow-sm hover:shadow-md">
                  <ProductPhoto url={other.image_url} name={other.name} className="aspect-[4/3]" />
                  <div className="p-5"><p className="mb-2 text-xs font-bold uppercase tracking-wide text-orange-700">{other.categories?.name || "ProRevest"}</p><h3 className="font-semibold text-slate-900 group-hover:text-orange-700">{other.name}</h3></div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-16 flex flex-col items-start justify-between gap-5 rounded-3xl bg-[#162232] p-8 text-white sm:p-12 md:flex-row md:items-center">
          <div><h2 className="text-2xl font-semibold sm:text-3xl">Buscando inspiração para seu projeto?</h2><p className="mt-3 text-slate-300">Veja aplicações, materiais e ideias no blog ProRevest.</p></div>
          <Link to="/blog" className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold hover:bg-white/10"><BookOpen className="h-5 w-5" /> Explorar blog</Link>
        </section>
      </div>
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const missing = isRouteErrorResponse(error) && error.status === 404;
  return (
    <main className="min-h-[55vh] bg-[#f7f5f1] px-6 py-20 text-center text-slate-900">
      <Layers3 className="mx-auto mb-5 h-12 w-12 text-orange-600" />
      <h1 className="mb-3 text-3xl font-semibold">{missing ? "Produto não encontrado" : "Produto temporariamente indisponível"}</h1>
      <p className="mx-auto mb-7 max-w-lg text-slate-600">{missing ? "Este produto não está disponível no catálogo público." : "Não foi possível consultar as informações do produto. Tente novamente mais tarde."}</p>
      <Link to="/catalogo" className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700">Voltar ao catálogo <ArrowRight className="h-4 w-4" /></Link>
    </main>
  );
}
