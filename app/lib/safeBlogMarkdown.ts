import { Marked, Renderer } from "marked";

// A mesma renderização é executada no SSR e no navegador. Não publicar HTML
// arbitrário do editor no servidor (DOMPurify é dependente de DOM).
function escapeAttribute(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function safeUrl(value: string, image = false): string | null {
  const url = value.trim();
  if (/^https?:\/\//i.test(url) || (url.startsWith("/") && !url.startsWith("//"))) return url;
  if (!image && (/^mailto:/i.test(url) || (url.startsWith("#") && url.length > 1))) return url;
  return null;
}

const renderer = new Renderer();
renderer.html = (html: string) => escapeAttribute(html);
renderer.link = (href: string, title: string | null | undefined, text: string) => {
  const url = safeUrl(href);
  if (!url) return text;
  const optionalTitle = title ? ` title="${escapeAttribute(title)}"` : "";
  return `<a href="${escapeAttribute(url)}"${optionalTitle} rel="noopener noreferrer">${text}</a>`;
};
renderer.image = (href: string, title: string | null | undefined, text: string) => {
  const url = safeUrl(href, true);
  if (!url) return escapeAttribute(text);
  const optionalTitle = title ? ` title="${escapeAttribute(title)}"` : "";
  return `<img src="${escapeAttribute(url)}" alt="${escapeAttribute(text)}"${optionalTitle} loading="lazy">`;
};

const parser = new Marked({ renderer, gfm: true, breaks: true });

export function renderSafeBlogMarkdown(source: string): string {
  return parser.parse(source || "") as string;
}
