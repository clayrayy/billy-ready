import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// SITE_URL lets us pin the canonical origin once a custom domain is ready.
// Netlify provides URL automatically for every build, so a new site can deploy
// successfully before its custom domain has been connected.
const configuredSite = process.env.SITE_URL ?? process.env.URL;

const site = configuredSite ?? "http://localhost:4321";
const sitemapExclusions = new Set(["/booking-thanks/", "/newsletter-thanks/"]);

export default defineConfig({
  site,
  output: "static",
  integrations: [
    sitemap({
      filter: (page) => !sitemapExclusions.has(new URL(page).pathname),
    }),
  ],
  compressHTML: true,
});
