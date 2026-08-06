import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const isPreviewDeploy = process.env.CONTEXT === "branch-deploy" || process.env.CONTEXT === "deploy-preview";

  if (isPreviewDeploy) {
    return new Response("User-agent: *\nDisallow: /\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const sitemapUrl = new URL("sitemap-index.xml", site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl.href}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
