# Handover

Last updated: 2026-10-26 (Codex, session 4: Pages CMS)

## Current state

- Eleventy 3 ESM on Node 24 LTS, plain CSS, Nunjucks page types and Markdown body fields in JSON. Run commands from the repository root. Output `_site/` and node_modules are ignored.
- Georgian and English homes, seven menu destinations, action pages with automatic related blocks, calls, supporting listings and details. All content remains [SAMPLE]. Core translation parity, untranslated News/Story fallback and EU footers are checked.
- Call opens/deadline and Event date/end use offset-free local wall-clock times plus a named timeZone. Temporal derives offsets and rejects ambiguous/nonexistent clock-change times. currentCallYear (2026) selects the visible call edition independently of the clock, with other years shown as archives.
- Hosting is now GitHub Pages through `.github/workflows/deploy.yml`. Netlify and Cloudflare Pages are dropped. Their old configuration can be restored from git history if true HTTP 301 redirects make a different host necessary.
- The workflow runs on pushes to main, daily at 04:15 UTC, and manual dispatch. It installs with npm ci, builds, tests, uploads the Pages artifact and deploys with official actions. No build hook, custom secret or browser accessibility check is used in CI. Deployments share a concurrency group.
- PATH_PREFIX controls Eleventy's pathPrefix (default `/`). The workflow derives the project prefix and GitHub Pages origin from the repository name and owner (currently `/neo-georgia-website/` and Luka's account), so those workflow values follow a repository transfer. Internal links, assets, language switches and refresh targets are rewritten by Eleventy's HTML base plugin. Canonical, hreflang, OG and sitemap URLs use the complete SITE_URL base.
- SITE_URL defaults to `https://luka9815.github.io/neo-georgia-website/`. For a custom domain, set SITE_URL to its HTTPS root and PATH_PREFIX to `/`, and replace the project-path workflow values with those custom-domain settings. Confirm both settings and the deployed address after transferring the repository to ERIDA.
- siteLaunched is false in `src/_data/settings.json`, read by site.js and not exposed in the CMS: every page is noindex and robots.txt disallows crawling. After launch approval, set it true; content pages become indexable while redirects and 404 remain noindex. Do not launch until the official EU emblem files, Georgian disclaimer and content are approved.
- One root bilingual 404.html has Georgian first, English second, both home links and the EU footer. The root index.html has a meta refresh, target canonical and a visible link to the Georgian home. No client JavaScript is needed. `.nojekyll` is copied into the output and included in the Pages artifact.
- `src/_data/redirects.json` is an empty old-path/new-path map. Once the export arrives, add validated mappings to generate static meta-refresh stubs. These do not provide HTTP 301 responses. See CONTENT.md.
- Sessions 1 to 3 are present in current main. Session 4 starts from main on `codex/session-4-pages-cms`; no dependency branch is needed.
- `.pages.yml` now configures News, Events and a single-file Settings editor. Staff use GitHub sign-in at app.pagescms.org. Collection filenames derive from slug. Field labels are Georgian first; News English is optional, Event English required. The current documentation and implementation were checked via GitHub because the docs host returned 403. Sources and verification limits are in CONTENT.md.
- News dates are calendar days (YYYY-MM-DD); existing News samples were migrated. Events keep local minute-precision strings without offsets and a named zone. Required fields, related action slugs, classifications, calendar dates and time ranges are validated before rendering with filename/field errors.
- Bodies use rich-text with explicit Markdown output. Raw HTML remains disabled in markdown-it. Image insertion is disabled for now; src/assets/uploads is reserved for future images with /assets/uploads public paths handled by PATH_PREFIX.
- Settings reads settings.json and exposes only currentCallYear. CMS merge mode preserves siteLaunched and other unmanaged keys. An owner with repository write access can still edit code directly.
- No hosted Pages CMS sign-in, repository authorisation, content write or deployment was performed by Codex. Local builds and JSON/render tests do not establish a successful authenticated hosted editing session.

## Turn on GitHub Pages (Luka)

1. Once the required PRs are reviewed and merged, open this repository on GitHub: **Settings > Pages > Build and deployment > Source: GitHub Actions**.
2. Open **Actions > Deploy GitHub Pages > Run workflow**, select **main**, then run it once. Wait for the build and deploy jobs to pass.
3. Open `https://luka9815.github.io/neo-georgia-website/`. Check the root reaches the Georgian home; open both homes, calls and an action page; test the language switch, Georgian-only news fallback, CSS and a missing URL. The missing URL must show the bilingual 404. Local browser tests do not replace this hosted check.
4. Check that the daily schedule is running. GitHub disables scheduled workflows in public repositories after 60 days without repository activity. If disabled, open **Actions > Deploy GitHub Pages > Enable workflow**, then **Run workflow** to check it. If the whole repository's Actions feature is disabled, enable it under Settings > Actions first.
5. During the build, hosting, repository and CMS use Luka's GitHub account. The domain must be registered to ERIDA, never an individual. No extra hosting account is needed. When transferring the repository, verify Pages configuration, the workflow URL values and the custom-domain settings.

## Validation

Root build:

1. `npm ci`
2. `npm run build`
3. `npm test`
4. In a separate terminal: `npm start`.
5. `npm run check:a11y`

Project-path build (the deployment layout):

1. `PATH_PREFIX=/neo-georgia-website/ SITE_URL=https://luka9815.github.io/neo-georgia-website/ npm run build`
2. `PATH_PREFIX=/neo-georgia-website/ SITE_URL=https://luka9815.github.io/neo-georgia-website/ npm test`
3. Start a separate dev server with the same variables: `PATH_PREFIX=/neo-georgia-website/ SITE_URL=https://luka9815.github.io/neo-georgia-website/ npm start -- --port=8082`.
4. `PATH_PREFIX=/neo-georgia-website/ TEST_URL=http://127.0.0.1:8082 npm run check:a11y`

For a custom-domain rehearsal use PATH_PREFIX=/ and SITE_URL=https://example.org/. Tests also create isolated prefixed and custom-domain builds. They check generated targets, absolute metadata, sitemap, refresh URLs, bilingual 404, .nojekyll, indexing and legacy redirects, plus the existing language, footer, content, call-edition and daylight-saving checks. The legacy-redirect fixture also exercises siteLaunched=true without changing tracked files.

The browser check uses `/usr/bin/chromium`; set CHROMIUM_PATH if Chromium lives elsewhere. TEST_URL is the local server origin without a path suffix. The script adds PATH_PREFIX itself. Basic axe, 320 px layout and keyboard skip-link/switch checks do not replace a full accessibility audit. Tests include deliberately bad editor fixtures, safe Markdown rendering, a changed CMS call year and prefixed upload paths. Final command results are recorded in CHANGELOG.

## Test Pages CMS (Luka)

1. Review and merge the session 4 PR separately. Open https://app.pagescms.org, sign in with GitHub and authorise the app for this repository if requested. Open Luka9815/neo-georgia-website and main. Do not create a second repository or hosting account. If the app cannot see the repository, check GitHub access and installation scope.
2. Confirm the Georgian-first News, Events and Settings forms appear. In Settings confirm only currentCallYear is editable. Save the existing year, then inspect settings.json on GitHub: siteLaunched must still be present and false. It must not appear in the form.
3. Create one News item with slug sample-cms-test, a publication date, one action, and Georgian title/body prefixed [SAMPLE]. Leave English entirely blank. Use a bold word and a link in the body, then save.
4. Wait for Deploy GitHub Pages to pass (usually about two minutes). Check the Georgian News list and detail page, Markdown formatting and language-switch fallback to the English News index. Verify the JSON has Markdown strings, a date-only date and no meaningful English object.
5. Delete that test item through the CMS, wait for another successful deploy and confirm it disappears from the list. The deleted detail URL should reach the root bilingual 404. Do not leave temporary published content behind.
6. For the Event round trip, edit an existing [SAMPLE] Event on a temporary branch first. Verify the timeZone default on a new form, all select values, both language objects and exact date/end values without seconds or offsets. Save, reopen, inspect JSON and check the preview/build before merging any real content. Optional blank-English News and preservation of unmanaged fields also need this hosted round-trip check.
7. Use EDITING.md for staff training. If the deploy fails, inspect the filename/field message in Actions and contact [NEO technical contact]. A failed build does not replace the previous successful deployment. Check GitHub Pages is enabled using the activation instructions above before diagnosing CMS saves as deployment failures.

## Next task

Complete the authenticated Pages CMS test above and train staff using docs/EDITING.md. Then add the image/alt-text workflow and responsive image pipeline before enabling rich-text image insertion. Never commit credentials or personal email addresses. The domain remains registered to ERIDA.

## Remaining work

- Turn on Pages and verify the first hosted deployment. Monitor the scheduled rebuild and re-enable it after inactivity if needed.
- Authenticated Pages CMS News/Event create, edit, delete and settings-preservation tests. Configuration and local validation are complete.
- Original EACEA Georgian/English emblems and the approved Georgian disclaimer; confirm funding wording against the signed grant agreement.
- Final templates, opportunity filters, font choice, responsive image pipeline, production content validation and Georgian editorial review.
- Search with Georgian, content migration, old-URL mapping, privacy/accessibility/prevailing-language approval, manual accessibility and Lighthouse checks.
- A daily rebuild refreshes static statuses. Sample dates are in 2026 and may become past/closed; no fixed test clock is used in production.

## Waiting on Nino / NEO

Domain decision and institutional registration/transfer agreement; WordPress export; NEO logo; prevailing language; featured actions and editors; approved Georgian disclaimer. Working documents remain in Google Drive Cowork/NEO; website source and documentation live here.
