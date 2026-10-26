# Handover

Last updated: 2026-10-26 (Codex, session 2 fixes)

## Current state

- Session 1 was merged into `main` in [PR #1](https://github.com/Luka9815/neo-georgia-website/pull/1). Session 2 starts from that merged baseline and is prepared on `codex/session-2-fixes` for a separate PR against `main`; do not treat the session 1 commits as unpushed local work.

- Eleventy 3 ESM skeleton on Node 24 LTS. `npm ci`, `npm start` (port 8080), `npm run build` (output `_site/`). Source and scripts are committed; output and node_modules are ignored.
- Georgian and English routes, root redirect to Georgian, language switch and hreflang. English listings exclude untranslated News. Story listings also have a section-index fallback. All seven menu destinations resolve.
- Home has six blocks. Calls are grouped by Key Action for `site.currentCallYear` (currently 2026), with calculated status and Brussels time. The calls page shows that selected edition first, followed by all other editions as descending-year archives. Changing the calendar year does not change the selected call edition. Three action detail pages automatically collect calls, upcoming and past events, resources with source labels, stories and FAQs.
- Three [SAMPLE] records each for Action, Event and News, plus three current-edition Calls and one 2025 archive Call. One News item is Georgian-only to exercise fallback behaviour. Related sample resources, a story, a FAQ and draft basic pages support the skeleton. No real content, images, personal contacts or accounts were added.
- Minimal event/news/story details, section listings and footer-note pages prevent dead links. These are not the complete later-phase templates or CMS integration.
- One Nunjucks template per page type in `src/pages/`, inheriting `_includes/page.njk`, with central routes in `_data/views.js` grouped by `_data/pageTypes.js`. Markdown body fields in JSON, plain responsive CSS, no client JavaScript, remote fonts or trackers. See docs/CONTENT.md for the bilingual contract and both CMS mappings.
- EU footer uses the explicitly requested text emblem placeholder, funding statement, verbatim English disclaimer and unapproved Georgian TODO. These are not launch-compliant final assets.
- Canonical/OG metadata, sitemap and preview noindex/robots restrictions are generated. SITE_URL overrides the host URL. Never launch with the default example.org URL or the preview indexing restrictions still present.
- netlify.toml and portable root `_redirects` are included. No live-host validation is recorded here, and hosting/CMS selection remains open. Session 1 was pushed and merged. No external account or CMS has been created by Codex.

## Validation

Call opens/deadline and Event date/end fields now store local wall-clock times without an offset plus a named `timeZone`. The Temporal polyfill resolves seasonal offsets for status calculations, ordering and rendered datetime attributes. Invalid dates, editor-entered offsets and ambiguous or nonexistent clock-change times fail the build rather than being guessed. See docs/CONTENT.md for editor input rules. News dates retain their original instant format.

From the repository root:

1. `npm ci`
2. `npm run build`
3. `npm test`
4. In another terminal run `npm start`.
5. Run `npm run check:a11y`. It uses `/usr/bin/chromium` by default. On another machine set `CHROMIUM_PATH` to an installed Chromium executable. Set TEST_URL if the dev server uses a different port. Browser binaries are not part of npm ci.

Checks cover generated language versions, metadata, seven menu items, EU footer, all internal links and fragments, shared content references, core translations, [SAMPLE] marking, status boundaries, Brussels daylight saving, six home blocks and all action relationship blocks. Browser checks run axe on every non-redirect page, test 320 px horizontal overflow, keyboard skip links and actual language-switch navigation. This is basic automated accessibility testing, not a full WCAG audit. Manual screen-reader review, full keyboard review and Lighthouse scoring remain open.

Session 1 results are preserved in CHANGELOG. Session 2 validation covers local-time conversion in Brussels and Tbilisi, both daylight-saving transitions (including rejected gap/overlap times), derived HTML offsets, explicit call-edition ordering and archive rendering. The readability refactor was compared against its preceding build: all 45 HTML documents retain identical DOM structure, attributes and text apart from whitespace. Final command results are recorded in the session 2 CHANGELOG entry.

The sample dates are in 2026. As time advances, items move to past/closed; lists may become empty. No fixture date is forced in production. Status only changes on rebuild.

## Connect Netlify (Luka)

1. Session 1 is already on `main`. Select `main` for that baseline, or `codex/session-2-fixes` to test this session before its PR is merged. Push any later local changes before deploying them. Use an existing hosting account registered to the ERIDA/NEO address, as required by DECISIONS. Do not use a personal account for institutional ownership.
2. In Netlify choose **Add new project > Import an existing project**, select GitHub, and authorise only the required repository (`Luka9815/neo-georgia-website`). Select that repository and the pushed branch (normally `main`).
3. Leave base directory at the repository root. Confirm build command `npm run build`, publish directory `_site` and Node 24 from netlify.toml. Do not set NODE_ENV=production or omit dev dependencies: Eleventy is a build dependency.
4. Deploy using the generated temporary netlify.app address. The build reads DEPLOY_PRIME_URL for metadata. If setting SITE_URL, use the full HTTPS temporary site origin; changing it requires another deploy. Do not configure a production domain yet.
5. Enable Deploy Previews for pull requests in the project's build settings if not already enabled. Keep preview noindex enabled. Check `/` redirects to `/ka/`, both homes and calls pages work, and `/ka/missing/` and `/en/missing/` return HTTP 404 in the respective languages. Inspect build logs and test language switches on action and Georgian-only news pages.

## Connect Cloudflare Pages (Luka)

1. Select `main` for the merged session 1 baseline, or `codex/session-2-fixes` for this session before merge, using the same repository and an existing ERIDA/NEO-owned Cloudflare account.
2. In **Workers & Pages > Create application > Pages > Connect to Git**, connect GitHub, grant access to the required repository and select `Luka9815/neo-georgia-website`. Choose a temporary project name and production branch (normally `main`). Choose Pages, not a Workers deployment.
3. Set framework preset to **None**, build command `npm run build`, output directory `_site`, and root directory to the repository root. Set build variable `NODE_VERSION=24` for production and preview. Keep dev dependencies enabled. The repository also includes `.nvmrc`.
4. Save and deploy to the generated pages.dev address. The build reads CF_PAGES_URL for metadata. SITE_URL is an optional full HTTPS origin override, requiring a rebuild when changed. Keep preview branch builds enabled and preview noindex in place.
5. Test the same home, call and switch routes. Root `_redirects` provides the 302 to `/ka/`. Cloudflare's root `404.html` prevents SPA fallback: unknown paths return a Georgian 404 with an English 404 switch. Locale-specific 404 interception is only configured for Netlify; do not copy its 404 rules into Cloudflare `_redirects`, which does not support that status.

After both deployments, record the temporary origins, build logs, redirect and 404 HTTP results, accessibility/performance observations and editor-integration constraints. Choose hosting based on that evidence. No live host behaviour has yet been verified here.

## Next task

Review the session 2 PR against `main` without merging automatically. Connect and test the two previews using the steps above, then compare Decap CMS and Pages CMS for News and Events against docs/CONTENT.md before selecting a host/editor. No tokens, hooks or personal emails go into this public repository.

## Remaining work

- Real EACEA Georgian/English emblem files and approved Georgian disclaimer; confirm funding wording against the signed grant agreement.
- Final event, news, story, publications, FAQ, people, contact and basic-page designs; opportunity filters. Current supporting pages are minimal.
- Font choice, responsive image pipeline, production content validation, Georgian editorial review, manual accessibility and Lighthouse mobile 90+ checks.
- Search test with Georgian, content migration and old-URL redirects, privacy/accessibility/prevailing-language text approval.
- Daily rebuild: after selecting the host, create its build hook, store it as the GitHub Actions secret SITE_BUILD_HOOK, and add a daily 04:15 UTC workflow plus workflow_dispatch that POSTs to it. Until activated, manually rebuild to refresh statuses. Never commit the hook URL.
- Hosting choice, CMS choice and end-to-end CMS round-trip tests remain open. A draft field mapping is not editor validation.

## Waiting on Nino / NEO (blocks launch, not the skeleton)

Domain decision and written transfer agreement; WordPress export or admin access; NEO logo; institutional hosting/CMS account ownership; prevailing language; featured actions and editors; approved Georgian disclaimer. Working documents remain in Google Drive Cowork/NEO; website code and documentation live here.
