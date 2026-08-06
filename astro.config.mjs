import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const configuredSite = process.env.SITE_URL;

if (process.env.NETLIFY === "true" && !configuredSite) {
  throw new Error(
    "SITE_URL is required for Netlify builds. Set it to the final canonical origin, such as https://www.example.com.",
  );
}

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
