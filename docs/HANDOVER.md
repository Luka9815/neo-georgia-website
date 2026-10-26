# Handover

Last updated: 2026-10-26 (Claude Code, after session 8: News Actions optional, bilingual-only migration, smaller disclaimer)

## Current state

- Eleventy 3 ESM on Node 24 LTS, plain CSS, Nunjucks page types and Markdown body fields in JSON. Run commands from the repository root. Output `_site/` and node_modules are ignored.
- Georgian and English homes, seven menu destinations, nine bilingual [DRAFT] Action pages with automatic related blocks, calls, supporting listings and details. Actions await editorial review; News/Event demonstration content remains [SAMPLE]; the language policy and supplied funding disclaimer now use the approved text. Core translation parity, untranslated News/Story fallback and EU footers are checked.
- Call opens/deadline and Event date/end use offset-free local wall-clock times plus a named timeZone. Temporal derives offsets and rejects ambiguous/nonexistent clock-change times. currentCallYear (2026) selects the visible call edition independently of the clock, with other years shown as archives.
- Hosting is now GitHub Pages through `.github/workflows/deploy.yml`. Netlify and Cloudflare Pages are dropped. Their old configuration can be restored from git history if true HTTP 301 redirects make a different host necessary.
- The workflow runs on pushes to main, daily at 04:15 UTC, and manual dispatch. It installs with npm ci, builds, tests, uploads the Pages artifact and deploys with official actions. No build hook, custom secret or browser accessibility check is used in CI. Deployments share a concurrency group.
- PATH_PREFIX controls Eleventy's pathPrefix (default `/`). The workflow derives the project prefix and GitHub Pages origin from the repository name and owner (currently `/neo-georgia-website/` and Luka's account), so those workflow values follow a repository transfer. Internal links, assets, language switches and refresh targets are rewritten by Eleventy's HTML base plugin. Canonical, hreflang, OG and sitemap URLs use the complete SITE_URL base.
- SITE_URL defaults to `https://luka9815.github.io/neo-georgia-website/`. For a custom domain, set SITE_URL to its HTTPS root and PATH_PREFIX to `/`, and replace the project-path workflow values with those custom-domain settings. Confirm both settings and the deployed address after transferring the repository to ERIDA.
- siteLaunched is false in `src/_data/settings.json`, read by site.js and not exposed in the CMS: every page is noindex and robots.txt disallows crawling. After launch approval, set it true; content pages become indexable while redirects and 404 remain noindex. Do not launch until the funding wording/artwork and final content are approved. The Georgian disclaimer now uses the exact project text supplied in session 6, proofread by Luka.
- One root bilingual 404.html has Georgian first, English second, both home links and the EU footer. The root index.html has a meta refresh, target canonical and a visible link to the Georgian home. No client JavaScript is needed. `.nojekyll` is copied into the output and included in the Pages artifact.
- `src/_data/redirects.json` is an empty old-path/new-path map. Once the export arrives, add validated mappings to generate static meta-refresh stubs. These do not provide HTTP 301 responses. See CONTENT.md.
- Sessions 1 to 7 are present in main. Session 8 starts from main commit 5639bcd on codex/session-8-migration, one commit per item. Generated text and selected image files remain under migration/review; live content, assets, templates, redirects and deploy configuration are unchanged.
- `.pages.yml` now configures News, Events and a single-file Settings editor. Staff use GitHub sign-in at app.pagescms.org. Collection filenames derive from slug. Field labels are Georgian first; News English is optional, Event English required. The current documentation and implementation were checked via GitHub because the docs host returned 403. Sources and verification limits are in CONTENT.md.
- News dates are calendar days (YYYY-MM-DD); existing News samples were migrated. Events keep local minute-precision strings without offsets and a named zone. Required fields, related action slugs, classifications, calendar dates and time ranges are validated before rendering with filename/field errors.
- Bodies use rich-text with explicit Markdown output. Raw HTML remains disabled in markdown-it. Image insertion is disabled for now; src/assets/uploads is reserved for future images with /assets/uploads public paths handled by PATH_PREFIX.
- Settings reads settings.json and exposes currentCallYear plus optional logoPath. The empty logoPath preserves the wordmark; an approved existing local /assets/ image uses language-specific alt text. No old-site logo has been downloaded. CMS merge mode preserves the code-only siteLaunched and other unmanaged keys. An owner with repository write access can still edit code directly.
- No hosted Pages CMS sign-in, repository authorisation, content write or deployment was performed by Codex. Local builds and JSON/render tests do not establish a successful authenticated hosted editing session.

## Session 5 design state

- Event registration and translated agendas are optional in CMS, validation and templates. Missing/blank blocks are hidden; supplied URLs still require HTTPS. The Event slug example is sample-event, the Action-option maintenance note names both .pages.yml lists, and EDITING uses the requested Georgian word for spaces.
- Choose self-hosted subset Noto Sans Georgian plus Noto Sans at 400/700, font-display: swap, with full OFL notices and a source/checksum manifest. Four faces total 99,184 bytes. The English home loads three (83,452 bytes) because its language switch is Georgian. Fonts are already prepared; normal builds/CI do not run the Python maintenance subsetting script.
- Blue, one warm accent and neutral CSS tokens have 20 allowed text/background pairs tested at 4.5:1 or better. Status/source words remain visible. Georgian text has no text-transform. See DESIGN.md for font/licence comparisons and palette rules.
- The NEO text wordmark (or future optional approved logoPath image) and language switch sit above seven shared navigation destinations. Desktop links and a native details/summary mobile menu share one macro. Mobile keyboard activation and the desktop layout work with page JavaScript disabled.
- Calls, Events and News use consistent cards; open/upcoming/closed badges and official/NEO/partner source labels use explicit text. Contact/legal links and the EU funding block are separated. Session 6 uses the original official English beneficiary emblem on both language versions, with Georgian alt text on /ka/.
- Home keeps all six approved blocks. The purpose/audience hero, section links, story panel and illustrative figures adapt from one column to desktop. A pre-existing Nunjucks rejectattr misuse hid every deadline; an explicit filter and regression test now show open/upcoming calls correctly.
- Before/after full-page screenshots of /ka/ and /en/ at 360/1280 px are in docs/review/session-5, listed in its README and the PR. The final screenshots wait for fonts and disable page JavaScript. Manual visual inspection caught and corrected a split Georgian hero word at mobile width.
- Local mobile Lighthouse runs on the built site returned performance 99, accessibility 100 and best practices 96 for both homes. SEO is 66 while siteLaunched=false intentionally blocks indexing. These are local lab measurements, not a deployed-site guarantee. Live CMS/hosting checks and Georgian editorial review remain open.

## Session 6 state

- English prevails if language versions differ. Footer and /language/ read one translated policy string. Initial old-site News import is limited to the twelve months before the agreed migration/export date; record that window when importing.
- Domain choice is deferred until the site is built, likely taking over erasmus.org.ge. No DNS or custom-domain setting changed. ERIDA must own the domain.
- The Georgian disclaimer exactly preserves the project text supplied and proofread by Luka. It is not an official EACEA Georgian translation.
- Use the unmodified official English Funded by the European Union emblem on both languages, with Georgian alt text “დაფინანსებულია ევროკავშირის მიერ” on /ka/. The KA archive country-branding file has been removed because it is not the beneficiary emblem. Obtain the official Georgian Funded by the EU emblem from the EU Delegation or EACEA and replace the Georgian-page image then. Provenance is in src/assets/eu/README.md. Georgian funding/disclaimer text is unchanged.
- Empty logoPath keeps the wordmark. A validated local approved image path uses bilingual alternatives and automatic PATH_PREFIX. No old NEO logo was downloaded.
- The next-step hero panel is hidden below 600 px. Open calls have the strongest badge, green with white text at 9.11:1. Section labels appear only in mixed home cards; status/source labels remain visible elsewhere.
- Nine bilingual [DRAFT] Actions replace the three samples and are grouped by higher education, VET, youth and sport. The 2026 Guide was downloaded and checked; each record cites its eligibility clauses and official URLs. A shared Georgia authority exclusion appears on every page. See ACTION-REVIEW.md for applicant/partner distinctions and review caveats. Both CMS action lists contain all nine slugs; old sample relationships retain their stable identifiers.

## Session 7 migration dry run

- Start with migration/review/REPORT.md. The manual importer is scripts/import-wp.js; run it using Node 24 with `node --use-env-proxy scripts/import-wp.js`. It is not called by builds, CI or npm test. CONTENT.md documents regeneration and optional --run-at.
- The final run on 2026-10-26 covers 2025-10-26T16:46:45.58Z inclusive to 2026-10-26T16:46:45.58Z exclusive. All public REST collections completed: 76 posts, 23 categories, six tags, 1,827 media metadata records and 202 top-level pages. No attachment binary was downloaded.
- Output: 72 Georgian News-shaped review files, 38 Event candidates, 540 unique image/PDF URLs, two duplicate-title groups, and draft post/page redirect proposals. Forty-four drafts have actions:[] with a blocking warning instead of an invented classification. All suggestions need review; no Event record was created.
- No WPML/Polylang language or translation fields were observed on the returned posts. ?lang=en returned the same 76 IDs as the default query. Four sources (36035, 36152, 36349, 36509) contain English prose without verified linked Georgian versions, so no en object or guessed translation was generated. They remain individually listed in inventory/REPORT for language review. This does not establish that the entire old site has no English.
- The redirect draft lists all 76 post URLs and 202 top-level pages. Four post targets and 114 page targets remain null for language/conversion or section review. It is not wired into src/_data/redirects.json. Top-level pages include old Elementor and legacy material; being listed is not approval to migrate it.
- The initial proxy block cleared before the successful run. No external account or credential was needed. Local raw recovery data in migration/review/.cache is ignored and must not be committed; only sanitised review output is tracked. Archive review notes before rerunning, because generated files are replaced.
- Build and all 67 tests pass in root and project-prefix layouts. Ten new converter checks use saved fixtures and forbid network access. The published source folders, templates, assets, workflow and live redirect map are unchanged; generated review files are absent from _site.

## Session 8 migration review

- Start with the quick table at the top of migration/review/REPORT.md and mark decisions.csv. Each of the 76 source posts now has a separate draft. Keep and pair_with are blank; type and Actions are suggestions. A rerun preserves decisions.csv and writes decisions.template.csv for comparison. The CSV is not applied automatically.
- Exact final window: 2025-10-26T17:24:33.248Z inclusive to 2026-10-26T17:24:33.248Z exclusive. All REST reads and selected-image downloads completed without failure.
- Title/body detection is separate and ignores URL letters. Output has 43 clear ka records, 4 explicitly unapproved en candidates and 29 records under sourceText for mixed bodies or mismatched title/body scripts. No source is split, translated or merged. The prior assumption that a Georgian title makes the whole body Georgian is removed.
- There are 27 CANDIDATE pairs within mixed source posts, with section-marker/script evidence and confidence notes. No cross-post candidate passed the date/media/topic/slug criteria in this run. Five English-body sources without a Georgian candidate (36035, 36117, 36152, 36349, 36509) are listed separately. One has a Georgian title with an English body. Script detection and common English words are review clues, not approved language labels.
- Leading title emoji, standalone leading theme dates, empty info markers and repeated blank lines are removed. Body emoji, numerical title prefixes and meaningful dates remain. Clean ASCII WordPress slugs are reused after underscore conversion; otherwise romanised title slugs stop at a word boundary within 60 characters, except an unavoidable single-token hard cut. Existing clean published slugs are preserved even when long.
- Selected images: 69 original files no wider than 1024 px, 28,140,498 bytes saved and 28,140,498 bytes downloaded (about 26.84 MiB). Every file was decoded/verified locally and its byte size checked against provenance. Both alt fields remain [ALT NEEDED]. Six posts have no image; one has only an external emoji icon, so no substitute was downloaded. All other image/PDF attachments remain listed only.
- Review still needs 45 Action choices, 38 Event classifications and the language decisions above. Draft redirects have 33 unresolved post targets due to language review, plus 114 page targets needing a section choice. The live redirect map remains empty.
- Build and all 76 tests pass in root and project-prefix layouts. Nineteen converter/review checks are offline with fetch forbidden; image tests use injected fake bytes. No migration output appears in _site. CONTENT.md documents the revised procedure and limitations.

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

1. Sessions 1 to 5 are already in main. After this PR is reviewed and merged, open https://app.pagescms.org, sign in with GitHub and authorise the app for this repository if requested. Open Luka9815/neo-georgia-website and main. Do not create a second repository or hosting account. If the app cannot see the repository, check GitHub access and installation scope.
2. Confirm the Georgian-first forms appear. Settings exposes currentCallYear and logoPath; keep logoPath empty until the new project logo is approved. Save the year and confirm siteLaunched remains present/false in settings.json but absent from the form.
3. Create one News item with slug sample-cms-test, a publication date, one action, and Georgian title/body prefixed [SAMPLE]. Leave English entirely blank. Use a bold word and a link in the body, then save.
4. Wait for Deploy GitHub Pages to pass (usually about two minutes). Check the Georgian News list and detail page, Markdown formatting and language-switch fallback to the English News index. Verify the JSON has Markdown strings, a date-only date and no meaningful English object.
5. Delete that test item through the CMS, wait for another successful deploy and confirm it disappears from the list. The deleted detail URL should reach the root bilingual 404. Do not leave temporary published content behind.
6. For the Event round trip, edit an existing [SAMPLE] Event on a temporary branch first. Verify the timeZone default on a new form, all select values, both language objects and exact date/end values without seconds or offsets. Save, reopen, inspect JSON and check the preview/build before merging any real content. Optional blank-English News and preservation of unmanaged fields also need this hosted round-trip check.
7. Use EDITING.md for staff training. If the deploy fails, inspect the filename/field message in Actions and contact [NEO technical contact]. A failed build does not replace the previous successful deployment. Check GitHub Pages is enabled using the activation instructions above before diagnosing CMS saves as deployment failures.

## Next task

Luka confirms the five keeps in migration/review/decisions.csv (all other rows are n). Then a separately briefed session promotes them: split each post's ka and en sections into one News record with both languages, apply the listed Actions (empty is allowed for News), approve slugs, images and alt text, and add redirects only for the promoted posts. Skipped posts are not translated or migrated. Continue the Action editorial review, hosted Pages CMS test and staff training. Any domain must be registered to ERIDA.

## Remaining work

- Turn on Pages and verify the first hosted deployment. Monitor the scheduled rebuild and re-enable it after inactivity if needed.
- Authenticated Pages CMS News/Event create, edit, delete and settings-preservation tests. Configuration and local validation are complete.
- Obtain the official Georgian Funded by the EU beneficiary emblem from the EU Delegation or EACEA, then replace the English image on /ka/. Until then the English beneficiary emblem is used on both languages. Confirm funding wording against the signed grant agreement. The supplied Georgian project disclaimer is in place.
- Remaining templates, opportunity filters, responsive image pipeline, production content validation and Georgian editorial review of the new typography.
- Review the regenerated News drafts, downloaded selected images, CSV decisions and old-URL proposals. Any content promotion, additional attachment download or redirect activation needs a separate approved task. Continue other content migration, Georgian search, privacy/accessibility approval and manual accessibility/Lighthouse checks.
- A daily rebuild refreshes static statuses. Sample dates are in 2026 and may become past/closed; no fixed test clock is used in production.

## Waiting on Nino / NEO

Domain choice after the build and institutional registration/transfer agreement; review of the REST News dry run (a WordPress export may still be needed for other content or missing protected widget data); approved new NEO logo; official Georgian "Funded by the EU" emblem file from the EU Delegation or EACEA; editors. Action topics and language precedence are decided; the source-checked [DRAFT] eligibility and Georgian terminology await NEO review. Working documents remain in Google Drive Cowork/NEO; website source and documentation live here.
