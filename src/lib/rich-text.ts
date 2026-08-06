import { Marked, Renderer } from "marked";

const escapeHtml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const safeUrl = (value: string) => {
  const trimmed = value.trim();
  if (/^(https?:|mailto:|tel:)/i.test(trimmed) || trimmed.startsWith("/") || trimmed.startsWith("#")) {
    return trimmed;
  }
  return "#";
};

const renderer = new Renderer();

renderer.html = ({ text }) => escapeHtml(text);
renderer.link = function ({ href, title, tokens }) {
  const safeHref = safeUrl(href);
  const label = this.parser.parseInline(tokens);
  const titleAttribute = title ? ` title="${escapeHtml(title)}"` : "";
  const externalAttributes = /^https?:/i.test(safeHref) ? ' target="_blank" rel="noopener noreferrer"' : "";
  return `<a href="${escapeHtml(safeHref)}"${titleAttribute}${externalAttributes}>${label}</a>`;
};
renderer.image = ({ href, title, text }) => {
  const safeHref = safeUrl(href);
  const titleAttribute = title ? ` title="${escapeHtml(title)}"` : "";
  return `<img src="${escapeHtml(safeHref)}" alt="${escapeHtml(text)}"${titleAttribute} loading="lazy" decoding="async">`;
};

const richText = new Marked({
  gfm: true,
  breaks: false,
  renderer,
});

export const renderRichText = (markdown = "") => richText.parse(markdown, { async: false });
