import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const blog = read("app/routes/blog.tsx");
const article = read("app/routes/blog.$slug.tsx");
const catalog = read("app/routes/catalogo.tsx");
const product = read("app/routes/produto.$slug.tsx");
const blogService = read("app/services/blogService.ts");
const productService = read("app/services/productService.ts");
const markdown = read("app/lib/safeBlogMarkdown.ts");
const home = read("app/routes/home_prorevest.tsx");
const featured = read("app/components/FeaturedProducts.tsx");

let checks = 0;
function check(condition, message) {
  assert.ok(condition, message);
  checks++;
}

check(blog.includes("useLoaderData<typeof loader>()"), "Blog precisa usar loader real");
check(blog.includes("getPublishedBlogPosts()"), "Blog deve listar somente publicados");
check(blog.includes("published.flatMap((p) => p.tags || [])"), "Tags derivadas dos artigos publicados");
check(blog.includes('name="search"') && blog.includes('name="category"') && blog.includes('name="tag"'), "Formulário de busca e filtros funcional");
check(blog.includes("pageLink(currentPage + 1, filters)"), "Paginação preserva filtros");
check(blog.includes("Math.min(safePage"), "Paginação fora do intervalo é limitada");
check(!blog.includes("mockPosts") && !blog.includes("Leitores Ativos"), "Não exibir post ou número fictício");
check(blog.includes("Artigos temporariamente indisponíveis"), "Erro de serviço não aparece como lista vazia");
check(blog.includes("Nenhum artigo encontrado"), "Estado sem resultados explícito");
check(article.includes("renderSafeBlogMarkdown"), "Artigo usa Markdown seguro também no SSR");
check(!article.includes("incrementBlogPostViews"), "Loader GET não grava visualizações");
check(article.includes("isRouteErrorResponse") && article.includes("status: 404"), "Artigo ausente retorna 404");
check(article.includes("getBlogPostBySlug(params.slug, undefined, { publishedOnly: true })"), "Consulta pública filtra published explicitamente");
check(blogService.includes("if (options?.publishedOnly) query = query.eq('status', 'published')"), "Serviço restringe status somente para página pública");
check(!blogService.includes(".eq('slug', slug)\n        .eq('status', 'published')"), "Serviço genérico não bloqueia rascunhos no Admin");
check(markdown.includes("renderer.html =") && markdown.includes("escapeAttribute(html)"), "HTML bruto não é renderizado no SSR");
check(markdown.includes("renderer.link =") && markdown.includes("safeUrl(href)"), "URLs de links são validadas");
check(markdown.includes("renderer.image =") && markdown.includes("safeUrl(href, true)"), "Imagens não aceitam esquemas arbitrários");
check(catalog.includes('name="category"') && catalog.includes('name="finish"') && catalog.includes('name="sort"'), "Filtros do catálogo operantes");
check(catalog.includes('.eq("is_archived", false)') && catalog.includes('select("id", { count: "exact", head: true })'), "Contagens são consultadas sob filtros e sem arquivados");
check(catalog.includes("catalogPageUrl(currentPage + 1, filters)"), "Paginação de produtos preserva filtros");
check(!catalog.includes("priceRange") && !catalog.includes("price_per_liter") && !catalog.includes("R$"), "Catálogo não exibe preços");
check(!catalog.includes("paintTypes") && !catalog.includes("mock"), "Catálogo não publica fichas fictícias");
check(catalog.includes("Catálogo temporariamente indisponível"), "Falha do Supabase distinta do catálogo vazio");
check(product.includes("getProductBySlug(params.slug)") && product.includes("getSimilarProducts(product.id"), "Produto e relacionados vêm de consultas reais");
check(product.includes("techItems(product.technical_data)"), "Especificações vêm dos dados cadastrados");
check(product.includes('to="/studio"') && product.includes("wa.me/5551986605758"), "CTAs de Studio e contato presentes");
check(product.includes("status: 404") && product.includes("ErrorBoundary"), "Produto inexistente retorna 404");
check(!product.includes("mockProduct") && !product.includes("mockReviews") && !product.includes("calculateShipping"), "Detalhe sem demonstrações de comércio");
check(!/\bprice\b|R\$|Frete:|sedex/i.test(product), "Preço e frete não aparecem no detalhe");
check(productService.includes(".eq('slug', slug)\n        .eq('is_archived', false)"), "Consulta pública do produto bloqueia arquivados");
check(productService.includes(".neq('id', productId) // Excluímos o produto atual\n        .eq('is_archived', false)"), "Relacionados bloqueiam arquivados");

check(!home.includes("fallbackProducts"), "Home nunca inventa produtos se Supabase falhar");
check(!home.includes("ProductsSection") && home.includes("<FeaturedProducts"), "Home possui uma única vitrine de produtos");
check(!home.includes("Mais de 200 produtos"), "Home não inventa contagem de produtos");
check(home.includes(".eq('is_featured', true)") && home.includes(".eq('is_archived', false)"), "Vitrine usa destaques reais não arquivados");
check(!featured.includes("R$") && !featured.includes("7 anos") && !featured.includes("avaliações"), "Vitrine não anuncia preço, durabilidade ou avaliações inventadas");
check(featured.includes('id="produtos"') && featured.includes('to="/catalogo"'), "Âncora de produtos e catálogo permanecem navegáveis");

console.log(`PASS: ${checks} verificações estáticas Blog/Produtos`);
