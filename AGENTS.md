# Billy Ready Music — Codex project notes

These instructions apply to the entire repository. Read this file before changing the project.

## Product and audience

- This is the public website for Billy Ready, a Mississippi pastor, Christian counselor, author, and songwriter.
- The core message is “Music for the Journey Home”: Christ-centered songs, honest stories, and lasting hope.
- Treat ministry claims, biography, testimonials, contact details, song stories, and Scripture references as factual content. Do not invent or embellish them. When information is missing, leave it editable or ask.
- Billy is expected to make routine content changes through Decap CMS. Keep editing labels plain, defaults honest, and optional fields genuinely optional.
- Use imagery sparingly. Each image should have a clear narrative role; do not repeat Billy’s portrait or the guitar artwork merely to fill space.
- Preserve the established editorial visual language: warm cream/paper surfaces, near-black ink, restrained gold, Iowan/Baskerville-style serif headlines, sans-serif utility copy, generous spacing, and square corners.
- Accessibility and SEO are requirements, not cleanup work. Preserve semantic headings, labels, keyboard focus, reduced-motion behavior, image descriptions, canonical metadata, structured data, sitemap generation, and noindex treatment for admin/confirmation pages.

## User preferences

- Do not use Chromium or Chromium-based browser verification for this project; it repeatedly crashes for the user. Verify with Astro checks/builds, generated HTML inspection, HTTP requests, and user-provided screenshots. If a visual check truly requires a browser, explain the limitation instead of silently launching Chromium.
- Keep the CMS robust and intuitive, but do not turn it into an unrestricted drag-and-drop page designer. The chosen approach is designed, reorderable blocks with tested options.
- Keep costs low. Avoid unnecessary services, functions, production deploys, and paid integrations. A production Netlify deploy currently consumes credits; do not trigger one without the user’s request.

## Stack and local development

- Astro 7 static output with TypeScript; content is pre-rendered HTML.
- Package manager: pnpm 11. Runtime: Node.js `>=22.12.0`; `.nvmrc` selects Node 22.
- If the shell resolves Node 20, run `nvm use` or explicitly prepend `/Users/clayton/.nvm/versions/node/v22.23.2/bin` to `PATH` for checks.
- Standard verification: `pnpm check`, `pnpm build`, and `git diff --check`.
- Local site: `pnpm dev` (normally `http://localhost:4321`).
- Local CMS: run `npx decap-server` in a second terminal, then open `http://localhost:4321/admin/`.
- Astro’s local server does not process Netlify form submissions. Test submission handling only after a Netlify deployment.

## Architecture and source of truth

- `src/content/pages/*.json`: editable page SEO, hero, and ordered page-builder sections.
- `src/content/settings/site.json`: site identity, contact details, social links, and reusable ministry lists.
- `src/content/songs/*.md`: song metadata and behind-the-song stories.
- `src/lib/page-schema.ts` and `src/types/page-builder.ts`: page-builder validation and types. Update both when adding a field.
- `src/components/EditableHero.astro` and `src/components/PageBuilder.astro`: production rendering.
- `src/styles/global.css` and `src/styles/page-builder.css`: production design system and responsive layout.
- `public/admin/config.yml`: Decap fields and validation.
- `public/admin/previews.js` and `public/admin/preview.css`: CMS preview renderer. Mirror relevant production rendering/style changes here.
- `src/layouts/BaseLayout.astro`: metadata, structured data, navigation, footer, and global client behavior.
- `netlify.toml`: build, runtime, caching, and security headers.

## CMS behavior and known pitfalls

- CMS URL: `/admin/`; backend is GitHub repository `clayrayy/billy-ready`, branch `staging`.
- Hosted GitHub OAuth uses `public_repo` scope. Never commit an OAuth client secret, access token, Netlify token, or other credential.
- `publish_mode` is intentionally `simple`: each CMS Publish writes one commit to `staging`.
- Empty optional object fields must preprocess to `undefined`; otherwise Decap may label nested fields as required. Reuse the `optionalAction` pattern in `src/lib/page-schema.ts`.
- Do not add visual placeholder/default copy when an editor deliberately clears an optional eyebrow, label, image, or action. Production and preview should render nothing in that case.
- A standard page hero without an eyebrow should use the centered layout. Keep production CSS and CMS preview behavior aligned.
- Media uploads are stored in `public/uploads` and limited to 2 MB in the CMS.
- Song deletion is disabled in the CMS to protect stable URLs.
- The custom release dock is defined in `public/admin/index.html`, `admin.css`, and `release-controls.js`. It is shown only after a Decap GitHub session is confirmed. Public API data shown by the dock is not authorization; GitHub/Netlify enforce actual release and rollback permissions.

## Branches, releases, and hosting

- GitHub repository: `clayrayy/billy-ready` (public so GitHub OAuth can use the narrower `public_repo` scope).
- `staging` is the editing/integration branch and deploys to `https://staging--billy-ready.netlify.app`.
- `main` is production and serves `https://billyreadymusic.com` through Netlify. DNS is outside the repository; do not alter domain or Cloudflare settings without an explicit request.
- Netlify project: `billy-ready`; site ID: `2e98cace-82c7-40fc-bfcd-8542314235ee`.
- The CMS “Release site” control appears only when GitHub reports `staging` ahead of `main`; it opens the GitHub comparison/PR flow. Production updates by merging staging into main.
- CMS edits can advance remote `staging` while local work is underway. Commit local changes first, then use `git pull --rebase origin staging` before pushing. Never force-push over CMS commits.
- Release history is informational and links to Netlify’s restore confirmation. Restoring an older deploy does not delete later releases.
- Do not push, merge, publish, restore, or change Netlify configuration unless the user explicitly asks. Preserve deployment credits by batching changes.

## Forms and newsletter direction

- `src/components/BookingForm.astro` posts `booking-request` to Netlify and redirects to `/booking-thanks`.
- `src/components/NewsletterForm.astro` posts directly to Brevo and uses Brevo double opt-in. Its public form endpoint, validation script, invisible reCAPTCHA site key, and field names originate from Brevo's generated embed. Never add a Brevo API key, SMTP key, or password to the repository.
- Brevo's generated reCAPTCHA key rejects `localhost`, so the reCAPTCHA element and Google script are intentionally omitted when `import.meta.env.DEV` is true. Test newsletter submission only on a staging or production deploy.
- `public/__forms.html` is the explicit Netlify form-detection manifest for the booking form. Whenever its submitted fields change, update the hidden definition in the same commit.
- The booking form intentionally relies on Netlify's built-in Akismet filtering without a honeypot because contact-card autofill can populate an offscreen booking field and Netlify silently discards honeypot hits without recording them. Keep its hidden `form-name` input.
- Netlify Forms must be enabled and the definitions must pass through a production deploy before live POSTs work. Astro local development returns 404 for form POSTs.
- Netlify should store booking requests and can email submission notifications. It does not process newsletter signups.
- Brevo manages the current newsletter list, confirmation emails, consent records, and campaign delivery. If Billy later chooses Substack, preserve consent records and unsubscribe status during any migration.

## Audio and images

- Web-ready tracks live in `public/audio` and are referenced by local `/audio/*.mp3` paths in song frontmatter. Local audio paths render an HTML audio player; secure external URLs render a listening link.
- The uncompressed `public/songs/This Side of Heaven.wav` is intentionally ignored and retained only as a local master. Do not commit WAV masters.
- Billy’s portrait is `public/images/billy-ready-portrait.webp` and is intentionally used once on the About page.
- The atmospheric guitar image remains the homepage’s primary visual and default sharing image.

## Change discipline

- Expect a dirty or remotely advancing worktree; preserve user/CMS changes and inspect `git status` and `git diff` before editing.
- Use `apply_patch` for text edits. Avoid destructive Git commands and do not remove content or media without confirming scope.
- Keep generated `dist`, `.astro`, `.netlify`, dependencies, logs, secrets, and local WAV masters out of commits.
- Run `git diff --check`, `pnpm check`, and `pnpm build` before handoff. Inspect generated HTML for changes involving metadata, forms, or structured data.
