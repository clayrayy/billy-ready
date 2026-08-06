# Billy Ready Music

A fast, content-first website for Billy Ready’s Christ-centered music and ministry.

## Recommended stack

- **Framework:** Astro + TypeScript. Pages are pre-rendered to plain HTML for speed, accessibility, and crawlability.
- **Content:** Local Markdown content collections. Each song has a dedicated, search-friendly story page and typed metadata.
- **Hosting:** Netlify. It can deploy this static Astro build directly and process the booking/newsletter forms without a separate backend.
- **Domain/DNS:** Purchase the final domain from a registrar you control, then point it to Netlify. Keep the domain account separate from the hosting account so it is easy to move later.
- **Email:** Use a real domain mailbox such as `hello@yourdomain.com` through Google Workspace, Fastmail, or Zoho Mail. The source notes only included `readysong1025`, so no email address is published yet.
- **Analytics:** Start with Google Search Console. Add privacy-friendly analytics only if Billy will actually use the data.
- **CMS:** Decap CMS. Billy can edit page copy, site details, ministry lists, and song stories at `/admin/`; changes remain versioned in GitHub and trigger a fresh static deployment.

This keeps the first version inexpensive and low-maintenance while leaving room for a CMS, email platform, or server-rendered features later.

## Run locally

Requirements: Node.js 22.12+ and pnpm 11.

```bash
nvm install
nvm use
corepack enable
pnpm install
pnpm dev
```

The included `.nvmrc` selects the latest Node.js 22 release. If a terminal is still using Node 20, run `nvm use` from the project directory before installing dependencies or starting Astro.

Useful commands:

```bash
pnpm check
pnpm build
pnpm preview
```

## Deploy to Netlify

1. Create a Git repository and push it to GitHub, GitLab, or Bitbucket.
2. Import the repository in Netlify.
3. Netlify will use `netlify.toml`:
   - Build command: `pnpm run build`
   - Publish directory: `dist`
4. Optionally add a `SITE_URL` environment variable with the final canonical origin, for example `https://www.example.com`. Until then, builds use Netlify's automatically provided site URL.
5. Connect the custom domain and choose one canonical version (`www` or apex). Redirect the other version to it.
6. In Netlify, configure email notifications for the `booking-request` and `newsletter` forms.

The forms are visible locally, but submissions are processed only after a Netlify deployment.

## Content editing

The hosted content manager is available at `/admin/`. It uses Decap CMS's GitHub backend rather than the deprecated Netlify Git Gateway.

One-time authentication setup:

1. In GitHub, register an OAuth application under **Settings → Developer settings → OAuth Apps**.
2. Set the homepage URL to the site's `https://...netlify.app` address.
3. Set the authorization callback URL to `https://api.netlify.com/auth/done`.
4. Copy the OAuth application's Client ID and generate a Client Secret.
5. In Netlify, open **Project configuration → Access & security → OAuth**.
6. Install the GitHub provider and enter the Client ID and Client Secret.
7. Give each editor write access to `clayrayy/billy-ready` on GitHub, then have them sign in at `/admin/`. The CMS requests GitHub's `public_repo` scope so it cannot access private repositories.

For direct publishing by multiple GitHub users on Netlify's Free plan, keep this website repository public. For the smallest authorization footprint, use a dedicated editor GitHub account whose only repository write access is this site. Never commit OAuth secrets or other credentials to the repository; the GitHub Client Secret belongs only in Netlify's OAuth settings.

Song stories live in `src/content/songs`. To add a streaming link, add a `listenUrl` value to a song’s frontmatter:

```yaml
listenUrl: https://example.com/song
```

Page copy lives in `src/content/pages`, while site-wide contact details, social profiles, and ministry lists live in `src/content/settings/site.json`. Both are editable from the CMS.

## SEO included

- Static, semantic HTML with minimal client-side JavaScript
- Unique page titles and meta descriptions
- Canonical URLs
- Open Graph and Twitter sharing metadata
- `Person`, `WebSite`, and `MusicRecording` JSON-LD
- Generated XML sitemap
- `robots.txt` linked to the sitemap
- Descriptive page URLs and dedicated song-story routes
- Responsive, compressed hero artwork with meaningful alt text
- Accessible headings, landmarks, forms, focus states, and reduced-motion support
- Security and long-lived asset caching headers for Netlify

## Before launch

- [ ] Confirm the final domain and set `SITE_URL`.
- [ ] Replace the temporary sanctuary/guitar artwork with strong, current photos of Billy when available.
- [ ] Confirm and add Billy’s complete email address.
- [ ] Add streaming, purchase, YouTube, and social-profile URLs.
- [ ] Reintroduce listener testimonials only after publication permission and credible attribution are confirmed.
- [ ] Test both Netlify forms and configure submission notifications.
- [ ] Update the privacy page with the final email, hosting, newsletter, and analytics services.
- [ ] Verify phone number, event list, biography, statement of faith, and song copy with Billy.
- [ ] Submit `/sitemap-index.xml` in Google Search Console after launch.
- [ ] Create or update a Google Business Profile if the ministry has a public service area or office that qualifies.

## Key files

- `src/pages/index.astro` — homepage
- `src/layouts/BaseLayout.astro` — global metadata, JSON-LD, navigation, and footer
- `src/styles/global.css` — complete visual system and responsive layout
- `src/content.config.ts` — typed song content schema
- `src/content/songs/` — editable song stories
- `src/content/pages/` — CMS-managed page copy
- `src/content/settings/site.json` — CMS-managed contact and ministry settings
- `public/admin/` — Decap CMS interface and field configuration
- `src/pages/book.astro` — Netlify booking form
- `astro.config.mjs` — canonical site URL and sitemap configuration
- `netlify.toml` — hosting build and security headers
