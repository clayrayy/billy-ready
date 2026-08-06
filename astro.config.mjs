import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// SITE_URL lets us pin the canonical origin once a custom domain is ready.
// Netlify provides URL automatically for every build, so a new site can deploy
// successfully before its custom domain has been connected.
const configuredSite = process.env.SITE_URL ?? process.env.URL;

const site = configuredSite ?? "http://localhost:4321";
const sitemapExclusions = new Set(["/booking-thanks/", "/newsletter-thanks/"]);

// Vite serves files in `public` directly during development, but it does not
// resolve `/admin/` to `/admin/index.html` like Netlify does in production.
const decapAdminDevRedirect = {
  name: "decap-admin-dev-redirect",
  hooks: {
    "astro:server:setup": ({ server }) => {
      server.middlewares.use((request, response, next) => {
        const pathname = request.url?.split("?", 1)[0];

        if (pathname === "/admin" || pathname === "/admin/") {
          response.statusCode = 302;
          response.setHeader("Location", "/admin/index.html");
          response.end();
          return;
        }

        next();
      });
    },
  },
};

export default defineConfig({
  site,
  output: "static",
  integrations: [
    decapAdminDevRedirect,
    sitemap({
      filter: (page) => !sitemapExclusions.has(new URL(page).pathname),
    }),
  ],
  compressHTML: true,
});
