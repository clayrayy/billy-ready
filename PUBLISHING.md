# Publishing workflow

The CMS uses a staging-first workflow so multiple page edits consume only one
Netlify production deployment.

## Edit and preview

1. Open `/admin/` on the production site.
2. Edit a page and select **Publish**. This saves the change to the `staging`
   branch; it does not change the live site.
3. Use **View staging** in the release dock to review the complete staged site
   at <https://staging--billy-ready.netlify.app>.
4. Repeat for as many pages as needed.

## Release the batch

1. Select **Release site** in the CMS release dock.
2. On GitHub, confirm that the pull request uses `main` as the base and
   `staging` as the compare branch.
3. Create the pull request, review the changes, and merge it.
4. Netlify deploys `main` to the production domain once.

Keep the `staging` branch after a release. If GitHub offers to delete it, leave
it in place because Decap CMS uses it for future edits.

## Restore a previous release

1. Select **Release history** in the CMS release dock.
2. Find the previous production version and select **Restore…**.
3. In the authenticated Netlify deploy screen, select **Publish deploy**.

Netlify production rollbacks are immediate and do not consume deployment
credits. A later production release from `main` will replace the restored
version, so use this as a safe recovery control rather than a replacement for
the Git history.

## Netlify project settings

- Production branch: `main`
- Branch deploy: `staging`
- Staging deploy URL: <https://staging--billy-ready.netlify.app>

Preview builds automatically output `noindex, nofollow` metadata and a blocking
`robots.txt` so the staging site is not indexed by search engines.
